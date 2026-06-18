// API del asistente IA. Recibe la conversación y devuelve la respuesta en
// streaming (palabra a palabra). Aquí vive la SEGURIDAD de verdad:
//  1) tiene que haber clave de Anthropic (si no, el bot está "en espera").
//  2) hay que estar logueado.
//  3) hay que tener rango Tester o superior.
//  4) hay un límite diario de preguntas por usuario.
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { canUseAssistant, type Rank } from "@/lib/ranks";
import {
  ASSISTANT_CONFIGURED,
  ASSISTANT_MODEL,
  ASSISTANT_DAILY_LIMIT,
  buildGameCorpus,
  buildSystemPrompt,
} from "@/lib/assistant";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

// Limpia y acota la conversación que llega del cliente (anti-abuso).
function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatMessage[] = [];
  for (const m of raw.slice(-12)) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role === "user" || role === "assistant") && typeof content === "string") {
      const text = content.trim().slice(0, 2000);
      if (text) out.push({ role, content: text });
    }
  }
  // La conversación debe empezar por 'user' y terminar por 'user'.
  while (out.length && out[0].role !== "user") out.shift();
  return out;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  // 1) ¿Bot encendido? (clave de Anthropic puesta)
  if (!ASSISTANT_CONFIGURED) {
    return json({ error: "El asistente todavía no está activado." }, 503);
  }

  let body: { gameSlug?: string; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Petición inválida." }, 400);
  }
  const gameSlug = typeof body.gameSlug === "string" ? body.gameSlug : "";
  const messages = sanitizeMessages(body.messages);
  if (!gameSlug || messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return json({ error: "Falta la pregunta o el juego." }, 400);
  }

  // 2) ¿Logueado?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return json({ error: "Inicia sesión con Discord para usar el asistente." }, 401);
  }

  // 3) ¿Rango Tester o superior?
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const rank = (profile?.role ?? "user") as Rank;
  if (!canUseAssistant(rank)) {
    return json({ error: "Necesitas el rango Tester o superior para usar el asistente." }, 403);
  }

  // 4) Límite diario (atómico, en la BD)
  const { data: quota, error: quotaErr } = await supabase.rpc("assistant_try_consume", {
    p_limit: ASSISTANT_DAILY_LIMIT,
  });
  const row = Array.isArray(quota) ? quota[0] : quota;
  if (quotaErr) {
    return json({ error: "No se pudo comprobar tu cupo. Inténtalo de nuevo." }, 500);
  }
  if (!row?.allowed) {
    return json(
      { error: `Has llegado a tu límite de ${ASSISTANT_DAILY_LIMIT} preguntas por hoy. Vuelve mañana 👊` },
      429
    );
  }

  // Guarda la pregunta en el historial (la respuesta se rellena al terminar).
  const question = messages[messages.length - 1].content;
  let historyId: string | null = null;
  try {
    const { data: hist } = await supabase
      .from("assistant_history")
      .insert({ user_id: user.id, game_slug: gameSlug, question })
      .select("id")
      .maybeSingle();
    historyId = (hist as { id: string } | null)?.id ?? null;
  } catch {
    historyId = null;
  }

  // Contenido del juego (la única fuente del bot)
  const game = await buildGameCorpus(gameSlug);
  if (!game) {
    return json({ error: "Ese juego aún no tiene contenido para el asistente." }, 404);
  }
  const systemPrompt = buildSystemPrompt(gameSlug, game.gameName, game.corpus);

  // Llamada a Claude con caché de prompt (el contenido del juego se cachea →
  // las siguientes preguntas cuestan una fracción).
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const aiStream = client.messages.stream({
    model: ASSISTANT_MODEL,
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  // Devuelve solo el texto, trozo a trozo, para que el chat lo vaya pintando.
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        for await (const event of aiStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n(Ups, se me cruzaron los cables. Prueba otra vez.)"));
      } finally {
        controller.close();
        // Rellena la respuesta en el historial (best-effort).
        if (historyId && full) {
          try {
            await supabase.from("assistant_history").update({ answer: full }).eq("id", historyId);
          } catch {
            /* no pasa nada */
          }
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
      // Preguntas que le quedan hoy (para el contador del chat).
      "X-Assistant-Remaining": String(row?.remaining ?? ""),
    },
  });
}
