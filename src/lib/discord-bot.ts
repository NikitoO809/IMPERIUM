// Piezas del BOT de Discord de IMPERIUM (comando /anuncio).
//
// No usa discord.js ni ninguna librería: Discord manda cada interacción como
// una petición HTTP normal a nuestra web, y nosotros contestamos con JSON.
// Todo lo que hace falta ya viene en Node.
//
// Documentación: https://discord.com/developers/docs/interactions/receiving-and-responding
import "server-only";
import { createPublicKey, verify as verifySignature } from "node:crypto";

const API = "https://discord.com/api/v10";

// ── Configuración (Portal de Desarrolladores de Discord) ─────────
// .trim() a propósito: al pegar estas claves (en un .env, en el panel de Vercel
// o desde una terminal) es facilísimo colar un espacio o un salto de línea
// invisible al final. Un solo carácter de más y la firma nunca cuadra.
export const DISCORD_APP_ID = (process.env.DISCORD_APP_ID ?? "").trim();
export const DISCORD_PUBLIC_KEY = (process.env.DISCORD_PUBLIC_KEY ?? "").trim();
export const DISCORD_BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN ?? "").trim();

// ¿Está el bot configurado? Si falta algo, el endpoint responde 503 con un
// mensaje claro en vez de fallar de forma rara.
export const BOT_CONFIGURED = Boolean(
  DISCORD_APP_ID && DISCORD_PUBLIC_KEY && DISCORD_BOT_TOKEN
);

// ── Tipos de interacción y de respuesta (los números que usa Discord) ──
export const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3, // alguien pulsó un botón
  MODAL_SUBMIT: 5,
} as const;

export const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  // "Pensando...": se usa cuando la tarea tarda más de los 3 segundos que
  // Discord da de plazo. Luego se sustituye por el resultado real.
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  MODAL: 9,
} as const;

// Marca un mensaje como "solo lo ve quien lanzó el comando".
export const EPHEMERAL = 64;

// ── Verificación de la firma ─────────────────────────────────────
// Discord firma cada petición. Si no comprobamos la firma, cualquiera podría
// mandar peticiones falsas a nuestro endpoint haciéndose pasar por Discord.
//
// La clave pública viene como 32 bytes en hexadecimal, pero Node la quiere
// envuelta en el formato estándar SPKI: por eso el prefijo fijo.
const ED25519_DER_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

export function isValidSignature(
  rawBody: string,
  signature: string | null,
  timestamp: string | null
): boolean {
  if (!signature || !timestamp || !DISCORD_PUBLIC_KEY) return false;
  try {
    const key = createPublicKey({
      key: Buffer.concat([ED25519_DER_PREFIX, Buffer.from(DISCORD_PUBLIC_KEY, "hex")]),
      format: "der",
      type: "spki",
    });
    // En Ed25519 el algoritmo de hash va en null (lo lleva dentro el propio algoritmo).
    return verifySignature(
      null,
      Buffer.from(timestamp + rawBody),
      key,
      Buffer.from(signature, "hex")
    );
  } catch {
    return false;
  }
}

// ── El mensaje que se publica ────────────────────────────────────

export type AnnouncementFields = {
  title: string;
  body: string;
  imageUrl: string;
  linkUrl: string;
  color: string; // hexadecimal escrito por el admin, ej. "#7c5cff"
};

export type DiscordEmbed = {
  title?: string;
  url?: string;
  description?: string;
  color?: number;
  image?: { url: string };
};

// Cuerpo de un mensaje de Discord.
//
// `parse: []` (tupla vacía en el tipo, no un array de textos) es la red de
// seguridad: el bot NO puede mencionar a @everyone ni a @here, ni aunque
// alguien lo escriba dentro del texto. La única mención posible es la del rol
// que el admin eligió a mano en el comando, listado uno a uno en `roles`.
export type DiscordMessageBody = {
  content: string;
  embeds: DiscordEmbed[];
  // `parse: []` = no se menciona a nadie salvo lo que se liste en `roles`.
  // `parse: ["everyone"]` es la ÚNICA forma de avisar a todo el servidor, y
  // solo se pone cuando el admin elige @everyone a mano en el desplegable.
  allowed_mentions: { parse: [] | ["everyone"]; roles?: string[] };
  components?: DiscordActionRow[];
};

// Una fila de botones debajo del mensaje.
export type DiscordActionRow = {
  type: 1;
  components: {
    type: 2; // botón
    style: 1; // azul
    label: string;
    custom_id: string;
    emoji?: { name: string };
  }[];
};

// Botón "Me apunto": al pulsarlo, quien lo haga recibe el rol indicado.
// El rol viaja en el custom_id, que es lo que Discord nos devuelve al pulsar.
export function botonApuntarse(roleId: string): DiscordActionRow {
  return {
    type: 1,
    components: [
      {
        type: 2,
        style: 1,
        label: "Me apunto",
        custom_id: `apuntarse:${roleId}`,
        emoji: { name: "✅" },
      },
    ],
  };
}

// Marca que el aviso va a todo el servidor. En Discord, @everyone es en
// realidad un rol cuyo id es el del propio servidor; aquí se traduce a esta
// palabra para no confundirlo con un rol normal.
export const EVERYONE = "everyone";

// Violeta de IMPERIUM, por si no escriben color.
const DEFAULT_COLOR = 0x7c5cff;

function parseColor(raw: string): number {
  const hex = raw.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return DEFAULT_COLOR;
  return parseInt(hex, 16);
}

function cleanUrl(raw: string): string {
  const url = raw.trim();
  return /^https?:\/\/\S+$/i.test(url) ? url : "";
}

// Convierte lo que se escribió en el formulario en un mensaje de Discord.
//
// Dos formas, según lo que rellene el admin:
//   · Sin título → mensaje de texto normal, como si escribiera una persona.
//   · Con título → tarjeta (embed) con barra de color, imagen y enlace.
//
// `roleId` es el rol elegido en el comando. La mención va SIEMPRE fuera del
// embed: dentro de un embed las menciones se ven, pero no avisan a nadie.
export function buildMessage(
  fields: AnnouncementFields,
  roleId?: string | null
): DiscordMessageBody {
  const title = fields.title.trim();
  const body = fields.body.trim();
  const image = cleanUrl(fields.imageUrl);
  const link = cleanUrl(fields.linkUrl);

  const aTodos = roleId === EVERYONE;
  const ping = aTodos ? "@everyone" : roleId ? `<@&${roleId}>` : "";
  const mentions: DiscordMessageBody["allowed_mentions"] = aTodos
    ? { parse: ["everyone"] }
    : roleId
      ? { parse: [], roles: [roleId] }
      : { parse: [] };

  if (!title) {
    const content = ping ? (body ? ping + "\n" + body : ping) : body;
    return { content, embeds: [], allowed_mentions: mentions };
  }

  const embed: DiscordEmbed = { title, color: parseColor(fields.color) };
  if (body) embed.description = body;
  if (link) embed.url = link;
  if (image) embed.image = { url: image };

  return { content: ping, embeds: [embed], allowed_mentions: mentions };
}

// Saca a quién se avisó en un texto: un rol, todo el servidor, o nadie.
export function roleIdFromContent(content: string): string | null {
  if (content.includes("@everyone")) return EVERYONE;
  const m = content.match(/<@&(\d+)>/);
  return m ? m[1] : null;
}

// Camino inverso: de un mensaje ya publicado a los campos del formulario, para
// poder abrirlo relleno cuando se va a editar. Devuelve también el rol al que
// se avisó, para no perder la mención al guardar los cambios.
export function messageToFields(message: {
  content?: string;
  embeds?: DiscordEmbed[];
}): { fields: AnnouncementFields; roleId: string | null } {
  const content = message.content ?? "";
  const roleId = roleIdFromContent(content);
  // El texto sin la mención (que se vuelve a añadir sola al reconstruirlo).
  const textoLimpio = content.replace(/<@&\d+>/g, "").replace(/@everyone/g, "").trim();

  const embed = message.embeds?.[0];
  if (!embed) {
    return {
      fields: { title: "", body: textoLimpio, imageUrl: "", linkUrl: "", color: "" },
      roleId,
    };
  }
  return {
    fields: {
      title: embed.title ?? "",
      body: embed.description ?? "",
      imageUrl: embed.image?.url ?? "",
      linkUrl: embed.url ?? "",
      color: typeof embed.color === "number" ? "#" + embed.color.toString(16).padStart(6, "0") : "",
    },
    roleId,
  };
}

// ── Llamadas a la API de Discord ─────────────────────────────────

async function discordFetch(path: string, method: string, body: unknown): Promise<Response> {
  return fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify(body),
  });
}

// Publica el mensaje en un canal. Devuelve el id del mensaje creado.
export async function postMessage(
  channelId: string,
  message: DiscordMessageBody
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const res = await discordFetch(`/channels/${channelId}/messages`, "POST", message);
  if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };
  const data = (await res.json()) as { id?: string };
  return data.id ? { ok: true, id: data.id } : { ok: false, error: "Sin id de mensaje." };
}

// Edita un mensaje que publicó el propio bot.
export async function editMessage(
  channelId: string,
  messageId: string,
  message: DiscordMessageBody
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await discordFetch(`/channels/${channelId}/messages/${messageId}`, "PATCH", message);
  if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };
  return { ok: true };
}

// ── Mensajes privados a los miembros de un rol ───────────────────
//
// AVISO: mandar privados en masa es lo que Discord considera spam, y es el
// motivo más común por el que deshabilitan un bot. Por eso hay un tope duro de
// destinatarios, una pausa entre envíos y un informe de lo que pasó.
// Para avisos generales es más seguro mencionar al rol en un canal.

// Nunca se pasa de aquí, aunque el rol tenga más gente.
export const MAX_PRIVADOS = 200;

// Pausa entre privados, para no disparar los límites de Discord.
export const PAUSA_ENTRE_PRIVADOS_MS = 250;

export function esperar(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// Ids de los miembros que tienen un rol. Necesita el permiso especial
// "Server Members Intent" activado en el portal de Discord.
export async function getRoleMembers(
  guildId: string,
  roleId: string
): Promise<{ ok: true; ids: string[]; total: number } | { ok: false; error: string }> {
  const ids: string[] = [];
  let after = "0";

  // La API devuelve como mucho 1000 por página; se pide de mil en mil.
  for (let pagina = 0; pagina < 10; pagina++) {
    const res = await fetch(
      `${API}/guilds/${guildId}/members?limit=1000&after=${after}`,
      { headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` } }
    );
    if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };

    const pagina_datos = (await res.json()) as {
      user?: { id?: string; bot?: boolean };
      roles?: string[];
    }[];
    if (pagina_datos.length === 0) break;

    for (const m of pagina_datos) {
      // Los bots no reciben privados.
      if (m.user?.id && !m.user.bot && m.roles?.includes(roleId)) ids.push(m.user.id);
    }
    after = pagina_datos[pagina_datos.length - 1].user?.id ?? after;
    if (pagina_datos.length < 1000) break;
  }

  return { ok: true, ids: ids.slice(0, MAX_PRIVADOS), total: ids.length };
}

// Manda un privado a una persona. Devuelve false si tiene los privados
// cerrados (lo más común) o si Discord lo rechaza por cualquier motivo.
export async function sendDirectMessage(
  userId: string,
  message: DiscordMessageBody
): Promise<boolean> {
  try {
    // 1) Abrir (o recuperar) la conversación privada con esa persona.
    const canal = await discordFetch("/users/@me/channels", "POST", { recipient_id: userId });
    if (!canal.ok) return false;
    const { id } = (await canal.json()) as { id?: string };
    if (!id) return false;

    // 2) Escribir en ella. En un privado no hay roles que mencionar.
    const sinPing: DiscordMessageBody = { ...message, allowed_mentions: { parse: [] } };
    const res = await discordFetch(`/channels/${id}/messages`, "POST", sinPing);
    return res.ok;
  } catch {
    return false;
  }
}

// Cambia el aviso "Enviando..." que solo ve quien lanzó el comando, para
// dejar ahí el informe final. El token de la interacción vale 15 minutos.
export async function editInteractionResponse(
  interactionToken: string,
  content: string
): Promise<void> {
  try {
    await fetch(`${API}/webhooks/${DISCORD_APP_ID}/${interactionToken}/messages/@original`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  } catch {
    // Si falla el informe no pasa nada: los privados ya salieron.
  }
}

// ── Repartir roles con el botón ──────────────────────────────────
// Necesita que el bot tenga "Gestionar roles" y que su propio rol esté POR
// ENCIMA del que reparte: Discord no deja tocar roles superiores al tuyo.

export async function addRoleToMember(
  guildId: string,
  userId: string,
  roleId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(`${API}/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
    method: "PUT",
    headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
  });
  return res.ok ? { ok: true } : { ok: false, error: `${res.status} ${await res.text()}` };
}

export async function removeRoleFromMember(
  guildId: string,
  userId: string,
  roleId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(`${API}/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
    method: "DELETE",
    headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
  });
  return res.ok ? { ok: true } : { ok: false, error: `${res.status} ${await res.text()}` };
}
