"use server";

// Server Actions de la página de inicio: suscribirse / desuscribirse a un juego
// "próximamente". Al cambiar, además de guardar en la BD, avisamos a Discord:
//   - FEED  → embed con color "fulano se apuntó a X" (solo la PRIMERA vez que
//     esa persona se apunta a ese juego, para no spamear).
//   - TABLERO → un mensaje único que se EDITA en cada cambio con el total por
//     juego (siempre al día).
//
// El webhook se configura en .env.local (DISCORD_WEBHOOK_URL). Si no está, los
// avisos simplemente no se envían (la suscripción se guarda igual).
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { UPCOMING_GAMES } from "@/lib/upcoming";
import {
  sendFeedEmbed,
  buildScoreboardContent,
  createScoreboard,
  editScoreboard,
} from "@/lib/discord-notify";

export type ToggleResult =
  | { ok: true; subscribed: boolean }
  | { ok: false; error: "auth" | "unknown_game" | "db" };

// Suscribe o desuscribe al usuario actual del juego indicado.
export async function toggleSubscription(gameKey: string): Promise<ToggleResult> {
  const game = UPCOMING_GAMES.find((g) => g.key === gameKey);
  if (!game) return { ok: false, error: "unknown_game" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  // Estado actual de la suscripción (si existe). Nunca borramos filas: las
  // marcamos active/inactive y recordamos si ya avisamos (notified).
  const { data: existing } = await supabase
    .from("game_subscriptions")
    .select("id, active, notified")
    .eq("game_key", gameKey)
    .eq("user_id", user.id)
    .maybeSingle();

  // ── Caso 1: ya estaba apuntado → lo desapuntamos (sin feed, pero el tablero
  //    baja el contador). ──
  if (existing?.active) {
    const { error } = await supabase
      .from("game_subscriptions")
      .update({ active: false })
      .eq("id", existing.id);
    if (error) return { ok: false, error: "db" };
    await refreshScoreboard(supabase);
    revalidatePath("/");
    return { ok: true, subscribed: false };
  }

  // ── Caso 2: se apunta. El feed solo se manda la PRIMERA vez (notified=false). ──
  const firstTime = !existing?.notified;

  if (existing) {
    const { error } = await supabase
      .from("game_subscriptions")
      .update({ active: true, notified: true })
      .eq("id", existing.id);
    if (error) return { ok: false, error: "db" };
  } else {
    const { error } = await supabase
      .from("game_subscriptions")
      .insert({ game_key: gameKey, user_id: user.id, active: true, notified: true });
    if (error) return { ok: false, error: "db" };
  }

  // Conteos frescos (para el footer del feed y para el tablero).
  const counts = await fetchCounts(supabase);

  if (firstTime) {
    const username =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      "Alguien";
    await sendFeedEmbed(game, username, counts.get(gameKey) ?? 1);
  }
  await refreshScoreboard(supabase, counts);

  revalidatePath("/");
  return { ok: true, subscribed: true };
}

// Lee los totales activos por juego (RPC público upcoming_game_counts).
async function fetchCounts(
  supabase: SupabaseClient
): Promise<Map<string, number>> {
  const { data } = await supabase.rpc("upcoming_game_counts");
  return new Map<string, number>(
    (data ?? []).map((r: { game_key: string; subscribers: number }) => [
      r.game_key,
      Number(r.subscribers),
    ])
  );
}

// Mantiene el mensaje "tablero" al día: lo edita si existe, lo crea si no.
async function refreshScoreboard(
  supabase: SupabaseClient,
  counts?: Map<string, number>
): Promise<void> {
  const tally = counts ?? (await fetchCounts(supabase));
  const content = buildScoreboardContent(tally);

  const { data: messageId } = await supabase.rpc("get_scoreboard_message_id");
  if (messageId) {
    const ok = await editScoreboard(messageId as string, content);
    if (ok) return; // editado correctamente
    // Si no se pudo editar (mensaje borrado), seguimos y creamos uno nuevo.
  }

  const newId = await createScoreboard(content);
  if (newId) {
    await supabase.rpc("set_scoreboard_message_id", { msg_id: newId });
  }
}
