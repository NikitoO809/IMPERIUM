// Capa de datos y configuración del ASISTENTE IA (lado servidor).
// El bot lee TODO el contenido publicado de un juego (guías + secciones) y lo
// mete en un único texto que se le pasa a Claude. No usa base vectorial: el
// contenido de cada juego cabe de sobra en el contexto, y con caché de prompts
// cada pregunta cuesta una fracción.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { type Rank, assistantDailyLimit } from "@/lib/ranks";

// ¿Está la clave de Anthropic puesta? Si no, el bot queda "en espera": el
// escaparate y el candado funcionan, pero no responde (no rompe la web).
export const ASSISTANT_CONFIGURED =
  SUPABASE_CONFIGURED && Boolean(process.env.ANTHROPIC_API_KEY);

// Modelo: Haiku 4.5 (rápido y barato; sobra para responder sobre texto dado).
export const ASSISTANT_MODEL = "claude-haiku-4-5";

// Límite de preguntas por usuario y día. Valor de REFERENCIA (Veterano); el
// cupo real lo decide el rango vía `assistantDailyLimit(rank)` en `ranks.ts`.
export const ASSISTANT_DAILY_LIMIT = 10;

// ── Identidad del bot por juego (nombre temático) ────────────────────────────
type AssistantIdentity = { name: string; tagline: string };

const ASSISTANT_IDENTITY: Record<string, AssistantIdentity> = {
  "call-of-dragons": { name: "Draco", tagline: "tu colega veterano de Call of Dragons" },
  "sword-x-staff": { name: "Grim", tagline: "tu colega veterano de Sword x Staff" },
};

export function getAssistantIdentity(gameSlug: string, gameName: string): AssistantIdentity {
  return ASSISTANT_IDENTITY[gameSlug] ?? { name: "Asistente IMPERIUM", tagline: `tu colega veterano de ${gameName}` };
}

// Preguntas de ejemplo (chips del escaparate) por juego.
const EXAMPLE_QUESTIONS: Record<string, string[]> = {
  "call-of-dragons": [
    "¿Qué héroe subo primero?",
    "¿Cuál es la mejor build para PvP?",
    "¿Cómo consigo recursos rápido?",
    "¿Qué evento da mejores recompensas?",
  ],
  "sword-x-staff": [
    "¿Por dónde empiezo?",
    "¿Cómo subo de nivel rápido?",
    "¿Qué clase es la mejor?",
    "¿Cómo funcionan los códigos?",
  ],
};

export function getExampleQuestions(gameSlug: string): string[] {
  return (
    EXAMPLE_QUESTIONS[gameSlug] ?? [
      "¿Por dónde empiezo?",
      "¿Cuál es la mejor estrategia?",
      "¿Cómo consigo recursos rápido?",
    ]
  );
}

// Una conversación de muestra (texto fijo, SIN gastar API) para el escaparate:
// engancha al visitante mostrando de lo que es capaz antes de poder usarlo.
export function getSampleExchange(gameSlug: string, gameName: string): { q: string; a: string } {
  const { name } = getAssistantIdentity(gameSlug, gameName);
  if (gameSlug === "call-of-dragons") {
    return {
      q: "¿Qué héroe subo primero?",
      a: `¡Buenas! Soy ${name}. Mira, si vas empezando no te compliques: céntrate en un buen héroe de inicio y méltele todos los recursos a él antes de repartir — así sales de cualquier apuro pronto. Lo tienes detallado en la guía de Primeros Pasos. (Esto es un ejemplo; desbloquéame para preguntarme lo que quieras 😉)`,
    };
  }
  return {
    q: "¿Por dónde empiezo?",
    a: `¡Buenas! Soy ${name}, tu colega de ${gameName}. Lo primero es seguir la guía de inicio y no malgastar recursos al principio. Pregúntame lo que quieras de builds, eventos o estrategias. (Esto es un ejemplo; desbloquéame para usarme 😉)`,
  };
}

// ── Rango del visitante actual (para decidir candado vs chat) ────────────────
export type Viewer = { userId: string; rank: Rank } | null;

// Preguntas que le quedan HOY al usuario actual (o null si no aplica).
export async function getRemainingToday(): Promise<number | null> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  // El cupo depende del rango del usuario (Veterano 10 · Fundador 30 · Leyenda 100 …).
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const rank = (profile?.role ?? "user") as Rank;
  const { data, error } = await supabase.rpc("assistant_remaining", {
    p_limit: assistantDailyLimit(rank),
  });
  if (error) return null;
  return typeof data === "number" ? data : null;
}

// Una entrada del historial: pregunta + respuesta del bot.
export type HistoryItem = { q: string; a: string };

// Historial del usuario para este juego (pregunta + respuesta, distintas, recientes).
export async function getUserHistory(gameSlug: string): Promise<HistoryItem[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("assistant_history")
    .select("question, answer")
    .eq("user_id", user.id)
    .eq("game_slug", gameSlug)
    .order("created_at", { ascending: false })
    .limit(100);

  const seen = new Set<string>();
  const out: HistoryItem[] = [];
  for (const r of (data ?? []) as { question: string; answer: string | null }[]) {
    const q = (r.question ?? "").trim();
    const key = q.toLowerCase();
    if (!q || seen.has(key)) continue;
    seen.add(key);
    out.push({ q, a: (r.answer ?? "").trim() });
    if (out.length >= 30) break;
  }
  return out;
}

export async function getViewerRank(): Promise<Viewer> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return { userId: user.id, rank: (profile?.role ?? "user") as Rank };
}

// ── Recolector de contenido del juego ───────────────────────────────────────
// Junta todas las guías + pasos y todas las secciones + bloques publicados en
// un solo texto, marcando cada parte con su origen (para que el bot cite).

// Quita los prefijos mágicos (__TABLE__, __BUILDS__…) para que el JSON quede
// legible al bot; el contenido sigue siendo útil aunque sea estructurado.
function cleanBlock(content: string): string {
  return content.replace(/^__[A-Z_]+__/, "").trim();
}

type GameCorpus = { gameName: string; corpus: string };

export async function buildGameCorpus(gameSlug: string): Promise<GameCorpus | null> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("id, name, slug")
    .eq("slug", gameSlug)
    .eq("is_published", true)
    .maybeSingle();
  if (!game) return null;

  const parts: string[] = [];

  // Guías + pasos
  const { data: guides } = await supabase
    .from("guides")
    .select("slug, title, intro_title, intro, is_published, guide_steps(order_index, title, content)")
    .eq("game_id", game.id)
    .eq("is_published", true);

  if (guides && guides.length > 0) {
    parts.push("# GUÍAS\n");
    for (const g of guides as Array<Record<string, unknown>>) {
      parts.push(`## Guía: ${g.title as string}`);
      if (g.intro_title) parts.push(String(g.intro_title));
      if (g.intro) parts.push(String(g.intro));
      const steps = ((g.guide_steps as Array<{ order_index: number; title: string; content: string | null }>) ?? [])
        .slice()
        .sort((a, b) => a.order_index - b.order_index);
      for (const s of steps) {
        parts.push(`- ${s.title}: ${(s.content ?? "").trim()}`);
      }
      parts.push(`[Fuente: guía "${g.title as string}" → /juegos/${gameSlug}/guias/${g.slug as string}]\n`);
    }
  }

  // Secciones + bloques
  const { data: sections } = await supabase
    .from("game_sections")
    .select("slug, title, intro_title, intro, is_published, section_blocks(order_index, title, content)")
    .eq("game_id", game.id)
    .eq("is_published", true);

  if (sections && sections.length > 0) {
    parts.push("# SECCIONES\n");
    for (const sec of sections as Array<Record<string, unknown>>) {
      parts.push(`## Sección: ${sec.title as string}`);
      if (sec.intro_title) parts.push(String(sec.intro_title));
      if (sec.intro) parts.push(String(sec.intro));
      const blocks = ((sec.section_blocks as Array<{ order_index: number; title: string; content: string | null }>) ?? [])
        .slice()
        .sort((a, b) => a.order_index - b.order_index);
      for (const b of blocks) {
        const body = cleanBlock(b.content ?? "");
        parts.push(`- ${b.title}: ${body}`);
      }
      parts.push(`[Fuente: sección "${sec.title as string}" → /juegos/${gameSlug}/${sec.slug as string}]\n`);
    }
  }

  if (parts.length === 0) return null;
  return { gameName: game.name as string, corpus: parts.join("\n") };
}

// ── Instrucciones del bot (personalidad + reglas) ────────────────────────────
// Define el tono "colega gamer" y la regla de oro: responder SOLO de las guías.
export function buildSystemPrompt(gameSlug: string, gameName: string, corpus: string): string {
  const { name, tagline } = getAssistantIdentity(gameSlug, gameName);
  return `Eres ${name}, ${tagline}, dentro de la web de la comunidad IMPERIUM.

CÓMO HABLAS (muy importante):
- Como un gamer veterano hablando con otro gamer: cercano, tuteas, directo al grano.
- PROHIBIDO sonar a robot o a corporación. Nunca digas cosas como "según la información proporcionada", "estimado usuario", "es importante destacar que", "como modelo de lenguaje".
- Respuestas CORTAS y útiles. Nada de ensayos. Ve a lo que importa.
- Usa jerga gamer natural cuando encaje (build, meta, farmear, main, PvP/PvE…), sin pasarte.
- Responde SIEMPRE en español (o en el idioma en que te escriban).
- Si la pregunta está mal escrita, en jerga o abreviada, entiéndela igual. Si es demasiado vaga, pregunta una cosa corta para aclarar en vez de soltar "no entiendo".

DE DÓNDE SACAS LAS RESPUESTAS (regla de oro, no la rompas):
- Responde SOLO con la información de las GUÍAS Y SECCIONES de ${gameName} que tienes abajo.
- Si la respuesta NO está ahí, dilo con honestidad y sin rodeos (ej: "eso todavía no está en nuestras guías, crack"). NUNCA te inventes builds, números, nombres ni datos del juego.
- Cuando puedas, di de qué guía o sección sale la info (por su nombre).
- Si te preguntan algo que no tiene nada que ver con ${gameName}, responde corto y simpático y reconduce: recuérdales que eres el asistente de ${gameName} y que te pregunten de héroes, builds, eventos, etc.

IMÁGENES Y ENLACES (muy importante):
- NO puedes mostrar imágenes en el chat. Muchas cosas se ven mejor con imágenes que están en las guías/secciones: árboles de TALENTOS, builds, artefactos, skills, mapas, tier lists…
- Cuando la pregunta tenga que ver con algo visual (talentos, build, árbol de talentos, artefactos, skills, mapas) O cuando el detalle bueno esté en imágenes, SIEMPRE manda al usuario a la guía o sección exacta donde están, con un ENLACE clicable en formato markdown: [Nombre de la sección](/ruta).
- Saca la /ruta del marcador [Fuente: ... → /ruta] que acompaña a cada guía y sección del contenido. Usa la ruta de la sección o guía MÁS relacionada con lo que preguntan.
- REGLA CRÍTICA: usa SOLO rutas que aparezcan literalmente en un marcador [Fuente: ... → /ruta]. NUNCA te inventes una ruta ni adivines un slug; si no hay una ruta que encaje, no pongas enlace.
- Ejemplo: si te preguntan los talentos o la build de un héroe, di en texto lo que tengas y mándalos a la sección donde estén las imágenes, p. ej.: "Los talentos los tienes en imágenes aquí 👉 [Tier List de Héroes](/juegos/${gameSlug}/heroes)" — pero solo si esa ruta aparece en el contenido.
- Siempre que cites una guía o sección, ponla como enlace markdown clicable [nombre](/ruta), no solo el nombre suelto.

CONTENIDO DE ${gameName.toUpperCase()} (tu única fuente de verdad):
${corpus}`;
}
