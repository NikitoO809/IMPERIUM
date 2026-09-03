// PATCH /api/announcements/[id] → edita un anuncio.
//
// Si el anuncio ya se publicó (tiene discord_message_id), EDITA ese mismo
// mensaje en Discord en vez de crear uno nuevo. Si nunca llegó a publicarse,
// solo se guarda en la base de datos (para eso está el endpoint /retry).
//
// El canal NO se cambia aquí: un mensaje vive en el canal donde nació.
import { getApiPublisher } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  json,
  validateDraft,
  getChannelById,
  getAnnouncementWithChannel,
  toAdminAnnouncement,
  ANNOUNCEMENT_COLUMNS,
  SERVICE_ROLE_CONFIGURED,
  type AnnouncementRow,
} from "@/lib/announcements";
import { buildPayload, editOnDiscord, DiscordApiError } from "@/lib/discord-announce";
import { logDbError } from "@/lib/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getApiPublisher();
  if (!session) return json({ error: "No autorizado." }, 401);

  if (!SERVICE_ROLE_CONFIGURED) {
    return json({ error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor." }, 503);
  }

  const { id } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "Petición inválida." }, 400);
  }

  const validation = validateDraft(raw);
  if (!validation.ok) return json({ error: validation.error }, 400);
  const draft = validation.draft;

  const existing = await getAnnouncementWithChannel(id);
  if (!existing) return json({ error: "Ese anuncio no existe." }, 404);

  const supabase = createAdminClient();
  const { data: updated, error: updateError } = await supabase
    .from("announcements")
    .update({
      title: draft.title,
      body: draft.body,
      link_url: draft.linkUrl,
      image_url: draft.imageUrl,
      color: draft.color,
      ping_role: draft.pingRole,
    })
    .eq("id", id)
    .select(ANNOUNCEMENT_COLUMNS)
    .single();

  if (updateError || !updated) {
    logDbError("PATCH /api/announcements update", updateError);
    return json({ error: "No se pudo guardar el cambio." }, 500);
  }
  const announcement = toAdminAnnouncement(updated as unknown as AnnouncementRow);

  // Nunca se publicó: se queda guardado y ya está.
  if (!announcement.discordMessageId) {
    return json({ announcement }, 200);
  }

  const channel = await getChannelById(existing.channelId);
  if (!channel) {
    return json(
      { announcement, error: "El cambio se guardó, pero el canal ya no existe." },
      502
    );
  }

  // Edita el mensaje existente. Discord no vuelve a notificar en una edición,
  // así que nadie recibe un segundo ping.
  try {
    const payload = buildPayload(draft, channel.defaultRoleId);
    await editOnDiscord(channel.webhookUrl, announcement.discordMessageId, payload);
  } catch (err) {
    const detail = err instanceof DiscordApiError ? err.message : "Discord no respondió.";
    console.error("[discord] editar anuncio:", detail);
    return json(
      { announcement, error: `El cambio se guardó, pero Discord no lo aceptó: ${detail}` },
      502
    );
  }

  return json({ announcement }, 200);
}
