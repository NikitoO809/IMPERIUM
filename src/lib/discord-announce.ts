// Anuncios del panel → Discord, vía WEBHOOK (sin bot, sin dependencias:
// es un fetch a una URL). Misma técnica que `discord-notify.ts` (el tablero de
// próximos juegos), pero para anuncios con embed rico y editables después.
//
// Módulo PURO a propósito (sin "server-only", igual que `ranks.ts`): el preview
// en vivo del panel es un componente de cliente y necesita `buildPayload` para
// enseñar EXACTAMENTE lo que se va a enviar. Esto es seguro porque ninguna
// función guarda secretos: la URL del webhook siempre llega como PARÁMETRO,
// y solo el servidor la tiene (la lee de `discord_channels` con la clave de
// servicio). Nunca importes esta URL en un componente de cliente.
//
// Referencia de la API: https://discord.com/developers/docs/resources/webhook

// ── Límites de Discord ───────────────────────────────────────────
// Los usa la validación del servidor y el contador de caracteres del panel.
export const DISCORD_LIMITS = {
  title: 256,
  description: 4096,
  footer: 2048,
} as const;

// ── Tipos del mensaje que se envía ───────────────────────────────

export type DiscordEmbed = {
  title: string;
  url?: string;
  description?: string;
  color: number;
  image?: { url: string };
  footer?: { text: string };
  timestamp?: string;
};

// `parse: []` es una TUPLA VACÍA en el tipo, no un array de strings: hace
// imposible colar "everyone" / "here" / "roles" por descuido. Las menciones
// permitidas se listan una a una en `roles`.
export type DiscordAllowedMentions = {
  parse: [];
  roles?: string[];
};

export type DiscordWebhookPayload = {
  content?: string;
  embeds: DiscordEmbed[];
  allowed_mentions: DiscordAllowedMentions;
};

// Respuesta de Discord al crear/editar un mensaje (solo usamos el id).
export type DiscordMessage = {
  id: string;
};

// ── El anuncio, tal como lo maneja la app ────────────────────────
// camelCase como el resto de la capa de datos del panel (`AdminGuide`, etc.).
// El mapeo desde/hacia las columnas snake_case vive en los route handlers.
export type AnnouncementDraft = {
  title: string;
  body: string | null;
  linkUrl: string | null;
  imageUrl: string | null;
  color: number;
  pingRole: boolean;
};

// Canal de Discord tal como lo ve el panel: SIN la URL del webhook. El id del
// rol no es secreto (se ve en cualquier mención) y el preview lo necesita para
// enseñar el ping igual que se enviará.
export type PublicChannel = {
  id: string;
  key: string;
  label: string;
  defaultRoleId: string | null;
};

// Un anuncio ya guardado, tal como lo listan el panel y la API.
export type AdminAnnouncement = AnnouncementDraft & {
  id: string;
  channelKey: string;
  channelLabel: string;
  discordMessageId: string | null;
  publishedAt: string | null;
  createdAt: string;
};

// Texto del pie del embed. Firma de la comunidad en cada anuncio.
export const ANNOUNCEMENT_FOOTER = "IMPERIUM · comunidad-imp.com";

// Error de la API de Discord con el status y el cuerpo de la respuesta, para
// poder responder 502 desde el route handler y enseñar el motivo en el panel.
export class DiscordApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Discord respondió ${status}: ${body.slice(0, 500)}`);
    this.name = "DiscordApiError";
    this.status = status;
    this.body = body;
  }
}

// ── Construcción del mensaje ─────────────────────────────────────

// Arma el JSON que se manda a Discord.
//
//   roleId  → id del rol a mencionar. Solo se usa si el anuncio tiene
//             `pingRole: true`. Si falta, NO se menciona a nadie.
//   options.timestamp → ISO del momento del anuncio (por defecto, ahora).
//             Se pasa a mano en el preview para que no cambie en cada tecla.
//
// Regla de menciones (no negociable): `parse: []` SIEMPRE, y el rol listado en
// `roles` únicamente cuando el admin marcó la casilla. Nunca @everyone.
export function buildPayload(
  announcement: AnnouncementDraft,
  roleId?: string | null,
  options?: { timestamp?: string }
): DiscordWebhookPayload {
  const mentionsRole = announcement.pingRole && Boolean(roleId);

  const embed: DiscordEmbed = {
    title: announcement.title,
    color: announcement.color,
    footer: { text: ANNOUNCEMENT_FOOTER },
    timestamp: options?.timestamp ?? new Date().toISOString(),
  };

  // Campos opcionales: solo van si tienen contenido (Discord rechaza cadenas
  // vacías en `url` e `image.url`).
  const linkUrl = announcement.linkUrl?.trim();
  if (linkUrl) embed.url = linkUrl;

  const body = announcement.body?.trim();
  if (body) embed.description = body;

  const imageUrl = announcement.imageUrl?.trim();
  if (imageUrl) embed.image = { url: imageUrl };

  const payload: DiscordWebhookPayload = {
    embeds: [embed],
    allowed_mentions: mentionsRole ? { parse: [], roles: [roleId as string] } : { parse: [] },
  };

  // El ping va en el `content` (fuera del embed): dentro de un embed las
  // menciones no notifican a nadie.
  if (mentionsRole) payload.content = `<@&${roleId}>`;

  return payload;
}

// ── Envío ────────────────────────────────────────────────────────

// Lee el cuerpo de la respuesta sin romper si viene vacío o no es JSON.
async function readBody(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

// Publica el anuncio. `?wait=true` es imprescindible: hace que Discord
// devuelva el mensaje creado con su `id`, que guardamos para poder editarlo
// más tarde. Lanza DiscordApiError si Discord no acepta el mensaje.
export async function postToDiscord(
  webhookUrl: string,
  payload: DiscordWebhookPayload
): Promise<DiscordMessage> {
  const res = await fetch(`${webhookUrl}?wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new DiscordApiError(res.status, await readBody(res));

  const data = (await res.json()) as { id?: unknown };
  if (typeof data.id !== "string") {
    throw new DiscordApiError(res.status, "Discord no devolvió el id del mensaje.");
  }
  return { id: data.id };
}

// Edita un mensaje YA publicado por este mismo webhook. No crea uno nuevo.
// Ojo: al editar, Discord ignora el `content` para notificar — nadie recibe un
// segundo ping, que es justo lo que queremos.
export async function editOnDiscord(
  webhookUrl: string,
  messageId: string,
  payload: DiscordWebhookPayload
): Promise<DiscordMessage> {
  const res = await fetch(`${webhookUrl}/messages/${messageId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new DiscordApiError(res.status, await readBody(res));

  return { id: messageId };
}
