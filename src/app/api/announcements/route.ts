// API de ANUNCIOS.
//   POST /api/announcements → redacta, guarda y publica en Discord.
//   GET  /api/announcements → lista los anuncios recientes (paginado).
//
// SEGURIDAD (en este orden, siempre):
//   1) rango con permiso de publicar (admin / supremo) o 401 y fuera.
//   2) todo lo demás corre en el servidor con la clave de servicio. La
//      webhook_url del canal se lee aquí y NUNCA viaja al navegador.
import { getApiPublisher } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  json,
  validateDraft,
  getChannelByKey,
  getAnnouncements,
  toAdminAnnouncement,
  ANNOUNCEMENT_COLUMNS,
  SERVICE_ROLE_CONFIGURED,
  type AnnouncementRow,
} from "@/lib/announcements";
import { buildPayload, postToDiscord, DiscordApiError } from "@/lib/discord-announce";
import { logDbError } from "@/lib/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // depende de la sesión

// ── Publicar un anuncio nuevo ────────────────────────────────────
export async function POST(req: Request) {
  // 1) ¿Quien llama puede publicar?
  const session = await getApiPublisher();
  if (!session) return json({ error: "No autorizado." }, 401);

  // Sin clave de servicio no hay forma de leer el webhook ni de escribir.
  if (!SERVICE_ROLE_CONFIGURED) {
    return json({ error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor." }, 503);
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "Petición inválida." }, 400);
  }

  // 2) Validación del contenido (límites de embed de Discord incluidos).
  const channelKey =
    typeof (raw as { channel_key?: unknown }).channel_key === "string"
      ? ((raw as { channel_key: string }).channel_key).trim()
      : "";
  if (!channelKey) return json({ error: "Falta el canal de destino." }, 400);

  const validation = validateDraft(raw);
  if (!validation.ok) return json({ error: validation.error }, 400);
  const draft = validation.draft;

  // 3) ¿Existe el canal?
  const channel = await getChannelByKey(channelKey);
  if (!channel) return json({ error: `No hay ningún canal con la clave "${channelKey}".` }, 404);

  const supabase = createAdminClient();

  // 4) Se guarda ANTES de llamar a Discord. Si Discord falla, el anuncio queda
  //    escrito (sin published_at) y se puede reintentar sin volver a teclearlo.
  const { data: inserted, error: insertError } = await supabase
    .from("announcements")
    .insert({
      channel_id: channel.id,
      title: draft.title,
      body: draft.body,
      link_url: draft.linkUrl,
      image_url: draft.imageUrl,
      color: draft.color,
      ping_role: draft.pingRole,
      created_by: session.id,
    })
    .select(ANNOUNCEMENT_COLUMNS)
    .single();

  if (insertError || !inserted) {
    logDbError("POST /api/announcements insert", insertError);
    return json({ error: "No se pudo guardar el anuncio." }, 500);
  }
  const announcement = toAdminAnnouncement(inserted as unknown as AnnouncementRow);

  // 5) Publicar en Discord.
  const payload = buildPayload(draft, channel.defaultRoleId);
  let messageId: string;
  try {
    const message = await postToDiscord(channel.webhookUrl, payload);
    messageId = message.id;
  } catch (err) {
    // 6) Discord falló: el registro se queda SIN published_at. No se borra —
    //    la UI lo enseña como fallido y ofrece reintentar con este id.
    const detail = err instanceof DiscordApiError ? err.message : "Discord no respondió.";
    console.error("[discord] publicar anuncio:", detail);
    return json({ error: detail, id: announcement.id, announcement }, 502);
  }

  // Publicado: guardamos el id del mensaje para poder editarlo después.
  const publishedAt = new Date().toISOString();
  const { data: updated, error: updateError } = await supabase
    .from("announcements")
    .update({ discord_message_id: messageId, published_at: publishedAt })
    .eq("id", announcement.id)
    .select(ANNOUNCEMENT_COLUMNS)
    .single();

  if (updateError || !updated) {
    // Caso raro: el mensaje YA está en Discord pero no pudimos guardar su id.
    // No devolvemos error de publicación (reintentar duplicaría el mensaje);
    // avisamos y dejamos el id en los logs para repararlo a mano.
    logDbError(`POST /api/announcements update (message ${messageId})`, updateError);
    return json(
      {
        announcement: { ...announcement, discordMessageId: messageId, publishedAt },
        warning:
          "El anuncio se publicó en Discord pero no se pudo guardar su id. Editarlo desde el panel no funcionará.",
      },
      200
    );
  }

  return json({ announcement: toAdminAnnouncement(updated as unknown as AnnouncementRow) }, 200);
}

// ── Listado para el panel ────────────────────────────────────────
export async function GET(req: Request) {
  const session = await getApiPublisher();
  if (!session) return json({ error: "No autorizado." }, 401);

  const { searchParams } = new URL(req.url);
  // Tope de 50 por página para no traerse la tabla entera de un tirón.
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 50);
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

  // getAnnouncements selecciona columna por columna: aquí no hay webhook_url.
  const { announcements, total } = await getAnnouncements(limit, offset);
  return json({ announcements, total, limit, offset }, 200);
}
