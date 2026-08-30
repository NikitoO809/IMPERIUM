// Las noticias de Aion 2, traídas solas pero publicadas por un humano.
//
// Una vez al día se mira el canal de novedades oficiales de Steam. Si hay algo
// que no se había visto, se traduce al español y se deja de BORRADOR en el
// canal de oficiales, con dos botones: publicar o descartar. Nada llega al
// canal de noticias sin que alguien le dé al botón.
//
// Sin base de datos, como el resto del bot: para saber qué se ha visto ya, se
// leen los últimos mensajes de los dos canales y se busca el número de la
// noticia en el pie. Un borrador descartado cuenta como visto, así que no
// vuelve a proponerse.
//
// La traducción la hace Claude. Si falla, el borrador sale igual con el texto
// original y el enlace: quien revisa decide qué hacer con él.
import { after } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  discordFetch,
  esStaff,
  postMessage,
  EPHEMERAL,
  InteractionResponseType,
  type DiscordActionRow,
  type DiscordEmbed,
} from "@/lib/discord-bot";

// AION 2 en Steam. El de FOUNDER'S PACK (4972180) es otra ficha y no publica.
const STEAM_APPID = 3393110;

const CANAL_NOTICIAS = (process.env.DISCORD_CANAL_NOTICIAS_AION ?? "").trim();
const CANAL_BORRADORES = (process.env.DISCORD_CANAL_BORRADORES ?? "").trim();
const ROL_AION = (process.env.DISCORD_ROL_AION2 ?? "").trim();

// Avisar al rol al publicar. Aquí sí: si un oficial ha decidido que la noticia
// merece la pena, merece también el aviso.
const AVISAR_AL_ROL = true;

// Cuántos borradores deja como mucho de una tacada.
const MAX_POR_PASADA = 3;

const NOTICIAS_A_MIRAR = 8;
const MENSAJES_A_LEER = 50;

const COLOR = 0x7c5cff;
const COLOR_DESCARTADA = 0x4f545c;

export const NOTICIAS_CONFIGURADAS = Boolean(CANAL_NOTICIAS && CANAL_BORRADORES);

// ── El feed de Steam ─────────────────────────────────────────────

type NoticiaSteam = {
  gid: string;
  title: string;
  url: string;
  contents: string;
  date: number;
  feedname?: string;
};

async function leerFeed(): Promise<NoticiaSteam[]> {
  const url =
    `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/` +
    `?appid=${STEAM_APPID}&count=${NOTICIAS_A_MIRAR}&maxlength=0&format=json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Steam ha dicho que no (${res.status})`);
  const data = (await res.json()) as { appnews?: { newsitems?: NoticiaSteam[] } };
  const items = data.appnews?.newsitems ?? [];
  // Solo lo que publica el propio estudio: el feed también trae notas de webs
  // de terceros, y eso no es una noticia oficial.
  return items.filter((n) => (n.feedname ?? "").includes("steam_community_announcements"));
}

// El texto viene con las etiquetas de Steam ([h3], [table], [*]...). Se quitan
// para que Claude lea el contenido y no el andamiaje.
function sinEtiquetas(bbcode: string): string {
  return bbcode
    .replace(/\[url=[^\]]*\]/gi, "")
    .replace(/\[\/?[a-z][^\]]*\]/gi, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 8000);
}

// Primera imagen del cuerpo, si la trae: le da vida al aviso.
function primeraImagen(bbcode: string): string | undefined {
  const m = bbcode.match(/\[img\]([^[]+)\[\/img\]/i) ?? bbcode.match(/(https:\/\/\S+\.(?:jpg|png|gif))/i);
  const url = m?.[1]?.replace(/^\{STEAM_CLAN_IMAGE\}/, "https://clan.cloudflare.steamstatic.com");
  return url && /^https:\/\//.test(url) ? url : undefined;
}

// ── La traducción ────────────────────────────────────────────────

type Traducida = { titulo: string; resumen: string; puntos: string[] };

const INSTRUCCIONES = `Traduces al español las noticias oficiales del videojuego AION 2 para IMPERIUM, una comunidad hispanohablante de jugadores que va a jugar en legión desde el lanzamiento (5 de octubre de 2026).

Reglas:
- Traduce y resume con fidelidad. No inventes NADA: ni fechas, ni cifras, ni recompensas que no estén en el texto. Si el original no lo dice, tú tampoco.
- Deja en su idioma original los nombres propios del juego (clases, zonas, objetos, Kinah, Quna, Founder's Pack, PURPLE).
- Escribe como se habla en un Discord de gente que juega: directo, sin florituras de marketing y sin "¡prepárate para la aventura!". Trata al lector de tú.
- El resumen: dos o tres frases con lo esencial, empezando por lo que le afecta al jugador.
- Los puntos: entre 2 y 5, cada uno una línea corta con un dato concreto — fechas, horarios, límites, requisitos, qué cambia. Nada de frases de relleno.
- Si la noticia trae horarios en varias zonas, quédate con CEST.

Responde SOLO con un objeto JSON, sin texto alrededor ni bloques de código:
{"titulo": "...", "resumen": "...", "puntos": ["...", "..."]}`;

async function traducir(noticia: NoticiaSteam): Promise<Traducida | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      output_config: { effort: "medium" },
      system: INSTRUCCIONES,
      messages: [
        { role: "user", content: `Título: ${noticia.title}\n\n${sinEtiquetas(noticia.contents)}` },
      ],
    });

    const texto = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Por si contesta con algo alrededor del JSON.
    const crudo = texto.slice(texto.indexOf("{"), texto.lastIndexOf("}") + 1);
    const datos = JSON.parse(crudo) as Partial<Traducida>;
    if (!datos.titulo || !datos.resumen) return null;
    return {
      titulo: String(datos.titulo).slice(0, 240),
      resumen: String(datos.resumen).slice(0, 1500),
      puntos: (Array.isArray(datos.puntos) ? datos.puntos : []).slice(0, 5).map((p) => String(p).slice(0, 200)),
    };
  } catch (error) {
    console.error("[noticias] traducción:", error);
    return null;
  }
}

// ── Qué se ha visto ya ───────────────────────────────────────────

// El número de la noticia va en el pie del aviso: es lo que permite saber qué
// se ha tratado sin guardar nada en ninguna parte.
async function gidsDelCanal(canal: string): Promise<string[]> {
  const res = await discordFetch(`/channels/${canal}/messages?limit=${MENSAJES_A_LEER}`, "GET", undefined);
  if (!res.ok) {
    console.error("[noticias] no he podido leer el canal", canal, res.status);
    return [];
  }
  const mensajes = (await res.json()) as { embeds?: DiscordEmbed[] }[];
  const gids: string[] = [];
  for (const m of mensajes) {
    for (const e of m.embeds ?? []) {
      const encontrado = (e.footer?.text ?? "").match(/#(\d+)/);
      if (encontrado) gids.push(encontrado[1]);
    }
  }
  return gids;
}

// Se miran los dos canales: lo publicado y lo que ya pasó por revisión
// (incluidos los descartes, que no deben volver a proponerse).
async function yaVistas(): Promise<Set<string>> {
  const [publicadas, borradores] = await Promise.all([
    gidsDelCanal(CANAL_NOTICIAS),
    gidsDelCanal(CANAL_BORRADORES),
  ]);
  return new Set([...publicadas, ...borradores]);
}

// ── Cómo queda el aviso ──────────────────────────────────────────

function montar(noticia: NoticiaSteam, t: Traducida | null): DiscordEmbed {
  const fecha = new Date(noticia.date * 1000).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  const embed: DiscordEmbed = {
    title: `📰 ${t ? t.titulo : noticia.title}`.slice(0, 250),
    url: noticia.url,
    color: COLOR,
    footer: {
      text: t
        ? `Noticia oficial de AION 2 · ${fecha} · traducida automáticamente · #${noticia.gid}`
        : `Noticia oficial de AION 2 · ${fecha} · SIN TRADUCIR · #${noticia.gid}`,
    },
  };

  if (t) {
    embed.description = t.puntos.length
      ? `${t.resumen}\n\n${t.puntos.map((p) => `› ${p}`).join("\n")}`
      : t.resumen;
  } else {
    embed.description =
      `${sinEtiquetas(noticia.contents).slice(0, 600)}…\n\n**[Leer la noticia completa](${noticia.url})**`;
  }

  const imagen = primeraImagen(noticia.contents);
  if (imagen) embed.image = { url: imagen };
  return embed;
}

function botones(): DiscordActionRow {
  return {
    type: 1,
    components: [
      { type: 2, style: 3, label: "Publicar", custom_id: "noticia:publicar", emoji: { name: "📢" } },
      { type: 2, style: 2, label: "Descartar", custom_id: "noticia:descartar", emoji: { name: "🗑️" } },
    ],
  };
}

// ── La pasada diaria: deja borradores ────────────────────────────

export async function proponerNoticiasNuevas(): Promise<{
  miradas: number;
  propuestas: number;
  error?: string;
}> {
  if (!NOTICIAS_CONFIGURADAS) {
    return {
      miradas: 0,
      propuestas: 0,
      error: "Faltan DISCORD_CANAL_NOTICIAS_AION o DISCORD_CANAL_BORRADORES.",
    };
  }

  let feed: NoticiaSteam[];
  try {
    feed = await leerFeed();
  } catch (error) {
    return { miradas: 0, propuestas: 0, error: String(error) };
  }

  const vistas = await yaVistas();
  // De la más vieja a la más nueva, para que queden en orden.
  const nuevas = feed.filter((n) => !vistas.has(n.gid)).sort((a, b) => a.date - b.date);

  // La primera vez los canales están vacíos y saldrían todas de golpe: se
  // propone solo la más reciente y las viejas se dan por vistas.
  const aProponer = vistas.size === 0 ? nuevas.slice(-1) : nuevas.slice(0, MAX_POR_PASADA);

  let contador = 0;
  for (const noticia of aProponer) {
    const traducida = await traducir(noticia);
    const res = await postMessage(CANAL_BORRADORES, {
      content: traducida
        ? "**Borrador** — noticia nueva de AION 2. Si le dais a publicar, sale tal cual en el canal de noticias."
        : "**Borrador SIN TRADUCIR** — no he podido traducirla (mirad la clave de Anthropic). Podéis publicarla así o descartarla.",
      embeds: [montar(noticia, traducida)],
      components: [botones()],
      allowed_mentions: { parse: [] },
    });
    if (res.ok) contador++;
    else console.error("[noticias] borrador:", res.error);
    await new Promise((seguir) => setTimeout(seguir, 800));
  }

  return { miradas: feed.length, propuestas: contador };
}

// ── Los botones del borrador ─────────────────────────────────────

type Interaccion = {
  guild_id?: string;
  channel_id?: string;
  token?: string;
  member?: { user?: { id?: string }; permissions?: string };
  user?: { id?: string };
  message?: { id?: string; embeds?: DiscordEmbed[] };
  data?: { custom_id?: string };
};

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function aviso(content: string) {
  return json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: EPHEMERAL },
  });
}

export async function componenteNoticia(
  customId: string,
  i: Interaccion
): Promise<Response | null> {
  if (!customId.startsWith("noticia:")) return null;

  // Revisar noticias es cosa de oficiales, aunque el canal ya sea privado.
  if (!esStaff(i.member?.permissions)) {
    return aviso("Esto solo lo puede tocar un oficial.");
  }

  const accion = customId.split(":")[1];
  const embed = i.message?.embeds?.[0];
  const mensajeId = i.message?.id;
  if (!embed || !mensajeId || !i.channel_id) return aviso("No encuentro ese borrador.");

  const quien = i.member?.user?.id ?? i.user?.id ?? "";

  if (accion === "descartar") {
    after(async () => {
      await discordFetch(`/channels/${i.channel_id}/messages/${mensajeId}`, "PATCH", {
        content: `🗑️ Descartada por <@${quien}>. No volverá a proponerse.`,
        embeds: [{ ...embed, color: COLOR_DESCARTADA }],
        components: [],
        allowed_mentions: { parse: [] },
      });
    });
    return aviso("Descartada. No te la volveré a proponer.");
  }

  if (accion === "publicar") {
    if (!CANAL_NOTICIAS) return aviso("No tengo canal de noticias configurado.");
    after(async () => {
      const res = await postMessage(CANAL_NOTICIAS, {
        content: AVISAR_AL_ROL && ROL_AION ? `<@&${ROL_AION}>` : "",
        embeds: [embed],
        allowed_mentions:
          AVISAR_AL_ROL && ROL_AION ? { parse: [], roles: [ROL_AION] } : { parse: [] },
      });
      await discordFetch(`/channels/${i.channel_id}/messages/${mensajeId}`, "PATCH", {
        content: res.ok
          ? `✅ Publicada por <@${quien}> en <#${CANAL_NOTICIAS}>.`
          : `⚠️ <@${quien}> le dio a publicar, pero ha fallado: ${res.ok ? "" : res.error.slice(0, 200)}`,
        components: [],
        allowed_mentions: { parse: [] },
      });
    });
    return aviso("Publicándola en el canal de noticias…");
  }

  return aviso("Ese botón ya no hace nada.");
}
