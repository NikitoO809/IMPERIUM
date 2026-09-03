// POST /api/announcements/[id]/retry → reintenta publicar un anuncio que se
// guardó pero nunca llegó a Discord (published_at vacío).
//
// Si ya está publicado responde 409: republicar crearía un mensaje duplicado.
// Para cambiarlo, PATCH /api/announcements/[id] (que edita el mensaje).
import { getApiPublisher } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  json,
  getChannelById,
  getAnnouncementWithChannel,
  toAdminAnnouncement,
  ANNOUNCEMENT_COLUMNS,
  SERVICE_ROLE_CONFIGURED,
  type AnnouncementRow,
} from "@/lib/announcements";
import { buildPayload, postToDiscord, DiscordApiError } from "@/lib/discord-announce";
import { logDbError } from "@/lib/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getApiPublisher();
  if (!session) return json({ error: "No autorizado." }, 401);

  if (!SERVICE_ROLE_CONFIGURED) {
    return json({ error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor." }, 503);
  }

  const { id } = await params;

  const existing = await getAnnouncementWithChannel(id);
  if (!existing) return json({ error: "Ese anuncio no existe." }, 404);

  const { announcement, channelId } = existing;

  // Ya publicado: no se republica (duplicaría el mensaje en el canal).
  if (announcement.publishedAt || announcement.discordMessageId) {
    return json({ error: "Ese anuncio ya está publicado.", announcement }, 409);
  }

  const channel = await getChannelById(channelId);
  if (!channel) return json({ error: "El canal de ese anuncio ya no existe." }, 404);

  let messageId: string;
  try {
    const payload = buildPayload(announcement, channel.defaultRoleId);
    const message = await postToDiscord(channel.webhookUrl, payload);
    messageId = message.id;
  } catch (err) {
    const detail = err instanceof DiscordApiError ? err.message : "Discord no respondió.";
    console.error("[discord] reintentar anuncio:", detail);
    return json({ error: detail, id: announcement.id, announcement }, 502);
  }

  const publishedAt = new Date().toISOString();
  const supabase = createAdminClient();
  const { data: updated, error: updateError } = await supabase
    .from("announcements")
    .update({ discord_message_id: messageId, published_at: publishedAt })
    .eq("id", id)
    .select(ANNOUNCEMENT_COLUMNS)
    .single();

  if (updateError || !updated) {
    // El mensaje ya está en Discord; solo falló guardar su id.
    logDbError(`POST /api/announcements/${id}/retry update (message ${messageId})`, updateError);
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
