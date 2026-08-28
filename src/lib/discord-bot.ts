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
export const DISCORD_APP_ID = process.env.DISCORD_APP_ID ?? "";
export const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY ?? "";
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN ?? "";

// ¿Está el bot configurado? Si falta algo, el endpoint responde 503 con un
// mensaje claro en vez de fallar de forma rara.
export const BOT_CONFIGURED = Boolean(
  DISCORD_APP_ID && DISCORD_PUBLIC_KEY && DISCORD_BOT_TOKEN
);

// ── Tipos de interacción y de respuesta (los números que usa Discord) ──
export const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MODAL_SUBMIT: 5,
} as const;

export const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
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

// Cuerpo de un mensaje de Discord. `allowed_mentions` con `parse: []` (tupla
// vacía) es la red de seguridad: NADIE puede hacer un @everyone a través del
// bot, ni escribiéndolo dentro del texto.
export type DiscordMessageBody = {
  content: string;
  embeds: DiscordEmbed[];
  allowed_mentions: { parse: [] };
};

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
export function buildMessage(fields: AnnouncementFields): DiscordMessageBody {
  const title = fields.title.trim();
  const body = fields.body.trim();
  const image = cleanUrl(fields.imageUrl);
  const link = cleanUrl(fields.linkUrl);

  if (!title) {
    return { content: body, embeds: [], allowed_mentions: { parse: [] } };
  }

  const embed: DiscordEmbed = { title, color: parseColor(fields.color) };
  if (body) embed.description = body;
  if (link) embed.url = link;
  if (image) embed.image = { url: image };

  return { content: "", embeds: [embed], allowed_mentions: { parse: [] } };
}

// Camino inverso: de un mensaje ya publicado a los campos del formulario, para
// poder abrirlo relleno cuando se va a editar.
export function messageToFields(message: {
  content?: string;
  embeds?: DiscordEmbed[];
}): AnnouncementFields {
  const embed = message.embeds?.[0];
  if (!embed) {
    return { title: "", body: message.content ?? "", imageUrl: "", linkUrl: "", color: "" };
  }
  return {
    title: embed.title ?? "",
    body: embed.description ?? "",
    imageUrl: embed.image?.url ?? "",
    linkUrl: embed.url ?? "",
    color: typeof embed.color === "number" ? "#" + embed.color.toString(16).padStart(6, "0") : "",
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
