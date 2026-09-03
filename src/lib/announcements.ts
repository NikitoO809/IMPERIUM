// Capa de datos de los ANUNCIOS del panel (lado servidor).
//
// Las tablas `announcements` y `discord_channels` tienen RLS activada y SIN
// políticas: no se pueden tocar con la sesión del usuario. Todo lo de aquí usa
// el cliente con clave de servicio. Por eso este módulo es "server-only" y por
// eso cada función que lo llama valida antes el rango (getApiPublisher).
//
// Regla de oro: `webhook_url` NUNCA sale de este módulo hacia la UI. Las
// funciones que devuelven datos para el panel seleccionan columna por columna.
import "server-only";
import { createAdminClient, SERVICE_ROLE_CONFIGURED } from "@/lib/supabase/admin";
import { logDbError } from "@/lib/log";
import {
  DISCORD_LIMITS,
  type AnnouncementDraft,
  type AdminAnnouncement,
  type PublicChannel,
} from "@/lib/discord-announce";

// Los tipos compartidos con la UI viven en el módulo puro (el panel es un
// componente de cliente y no puede importar nada "server-only").
export type { AdminAnnouncement, PublicChannel };
export { SERVICE_ROLE_CONFIGURED, DISCORD_LIMITS };

// Canal completo (CON webhook_url). Solo para uso interno del servidor.
export type ChannelWithSecret = PublicChannel & { webhookUrl: string };

// ── Respuestas JSON ──────────────────────────────────────────────
// Mismo formato que el resto de APIs del proyecto: { error: "mensaje" }.
export function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ── Validación del formulario ────────────────────────────────────
// A mano, como en /api/asistente (el proyecto no usa zod).

export type ValidationResult =
  | { ok: true; draft: AnnouncementDraft }
  | { ok: false; error: string };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// Acepta solo http/https. Discord rechaza el embed entero si una URL es rara,
// así que es mejor devolver 400 con un motivo claro que un 502 opaco.
function optionalUrl(
  value: unknown,
  field: string
): { url: string | null } | { error: string } {
  const raw = text(value);
  if (!raw) return { url: null };
  if (!/^https?:\/\/\S+$/i.test(raw)) {
    return { error: `${field} debe empezar por http:// o https://` };
  }
  return { url: raw };
}

// Valida el cuerpo que llega del panel y lo convierte en un AnnouncementDraft.
export function validateDraft(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Petición inválida." };
  }
  const raw = input as Record<string, unknown>;

  const title = text(raw.title);
  if (!title) return { ok: false, error: "El título no puede estar vacío." };
  if (title.length > DISCORD_LIMITS.title) {
    return {
      ok: false,
      error: `El título no puede pasar de ${DISCORD_LIMITS.title} caracteres.`,
    };
  }

  const body = text(raw.body);
  if (body.length > DISCORD_LIMITS.description) {
    return {
      ok: false,
      error: `El cuerpo no puede pasar de ${DISCORD_LIMITS.description} caracteres.`,
    };
  }

  const link = optionalUrl(raw.link_url, "El enlace");
  if ("error" in link) return { ok: false, error: link.error };

  const image = optionalUrl(raw.image_url, "La imagen");
  if ("error" in image) return { ok: false, error: image.error };

  // Color: entero de 0 a 0xFFFFFF (formato de Discord).
  const colorRaw = raw.color;
  const color = typeof colorRaw === "number" ? Math.trunc(colorRaw) : Number.NaN;
  if (!Number.isFinite(color) || color < 0 || color > 0xffffff) {
    return { ok: false, error: "El color no es válido." };
  }

  return {
    ok: true,
    draft: {
      title,
      body: body || null,
      linkUrl: link.url,
      imageUrl: image.url,
      color,
      pingRole: raw.ping_role === true,
    },
  };
}

// ── Lecturas ─────────────────────────────────────────────────────

// Canales configurados, SIN la URL del webhook. Para el selector del panel.
export async function getChannels(): Promise<PublicChannel[]> {
  if (!SERVICE_ROLE_CONFIGURED) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("discord_channels")
    .select("id, key, label, default_role_id") // nunca webhook_url
    .order("label");
  if (error) logDbError("getChannels.discord_channels", error);
  return (data ?? []).map((c) => ({
    id: c.id as string,
    key: c.key as string,
    label: c.label as string,
    defaultRoleId: (c.default_role_id as string | null) ?? null,
  }));
}

// Columnas del canal, incluida la secreta. Solo para los route handlers.
const CHANNEL_COLUMNS = "id, key, label, default_role_id, webhook_url";

type ChannelRow = {
  id: string;
  key: string;
  label: string;
  default_role_id: string | null;
  webhook_url: string;
};

function toChannel(row: ChannelRow): ChannelWithSecret {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    defaultRoleId: row.default_role_id,
    webhookUrl: row.webhook_url,
  };
}

// Canal por clave, CON el webhook (para publicar un anuncio nuevo).
export async function getChannelByKey(key: string): Promise<ChannelWithSecret | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("discord_channels")
    .select(CHANNEL_COLUMNS)
    .eq("key", key)
    .maybeSingle();
  if (error) logDbError("getChannelByKey.discord_channels", error);
  return data ? toChannel(data as ChannelRow) : null;
}

// Canal por id, CON el webhook (para editar o reintentar uno ya guardado).
export async function getChannelById(id: string): Promise<ChannelWithSecret | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("discord_channels")
    .select(CHANNEL_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) logDbError("getChannelById.discord_channels", error);
  return data ? toChannel(data as ChannelRow) : null;
}

// Forma cruda de una fila de announcements con su canal embebido.
export type AnnouncementRow = {
  id: string;
  channel_id: string;
  title: string;
  body: string | null;
  link_url: string | null;
  image_url: string | null;
  color: number;
  ping_role: boolean;
  discord_message_id: string | null;
  published_at: string | null;
  created_at: string;
  discord_channels: { key: string; label: string } | null;
};

// Columnas del anuncio + las del canal que SÍ puede ver el panel.
export const ANNOUNCEMENT_COLUMNS =
  "id, channel_id, title, body, link_url, image_url, color, ping_role, discord_message_id, published_at, created_at, discord_channels(key, label)";

export function toAdminAnnouncement(row: AnnouncementRow): AdminAnnouncement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    linkUrl: row.link_url,
    imageUrl: row.image_url,
    color: row.color,
    pingRole: row.ping_role,
    channelKey: row.discord_channels?.key ?? "",
    channelLabel: row.discord_channels?.label ?? "Canal borrado",
    discordMessageId: row.discord_message_id,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

// Lista paginada, del más reciente al más antiguo.
export async function getAnnouncements(
  limit: number,
  offset: number
): Promise<{ announcements: AdminAnnouncement[]; total: number }> {
  if (!SERVICE_ROLE_CONFIGURED) return { announcements: [], total: 0 };
  const supabase = createAdminClient();
  const { data, error, count } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) logDbError("getAnnouncements.announcements", error);
  const rows = (data ?? []) as unknown as AnnouncementRow[];
  return { announcements: rows.map(toAdminAnnouncement), total: count ?? 0 };
}

// Un anuncio por id, con el id de su canal (para editar / reintentar).
export async function getAnnouncementWithChannel(
  id: string
): Promise<{ announcement: AdminAnnouncement; channelId: string } | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) logDbError("getAnnouncementWithChannel.announcements", error);
  if (!data) return null;
  const row = data as unknown as AnnouncementRow;
  return { announcement: toAdminAnnouncement(row), channelId: row.channel_id };
}
