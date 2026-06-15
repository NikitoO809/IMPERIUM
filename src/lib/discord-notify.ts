// Avisos a Discord para las suscripciones de "próximos juegos".
// Dos formatos que conviven:
//   1) FEED con color  → un embed "fulano se apuntó a X" del color del juego.
//   2) TABLERO en vivo → un único mensaje que se EDITA en cada cambio y muestra
//      cuántos esperan cada juego.
//
// Todo es best-effort: si el webhook no está puesto o Discord falla, no rompe
// la suscripción (que ya quedó guardada en la BD).
import "server-only";
import { type UpcomingGame } from "@/lib/upcoming";

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL ?? "";

type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  footer?: { text: string };
};

// ── FEED: embed de "alguien se apuntó" ───────────────────────
export async function sendFeedEmbed(
  game: UpcomingGame,
  username: string,
  currentCount: number
): Promise<void> {
  if (!WEBHOOK_URL) return;
  const embed: DiscordEmbed = {
    title: `${game.emoji} ${game.name}`,
    description: `**${username}** se ha apuntado.`,
    color: game.color,
    footer: { text: `${currentCount} esperando ahora` },
  };
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch {
    // silencioso
  }
}

// ── TABLERO: texto con el total por juego ────────────────────
// Recibe la lista de juegos (desde la tabla upcoming_games) para no depender
// de datos en código.
export function buildScoreboardContent(
  counts: Map<string, number>,
  games: UpcomingGame[]
): string {
  const lines = games.map(
    (g) => `${g.emoji} **${g.name}** — ${counts.get(g.key) ?? 0}`
  );
  return `📊 **Esperando por juego** · se actualiza solo\n\n${lines.join("\n")}`;
}

// Crea el mensaje del tablero (POST). Devuelve su id, o null si falla.
export async function createScoreboard(content: string): Promise<string | null> {
  if (!WEBHOOK_URL) return null;
  try {
    // wait=true hace que Discord devuelva el mensaje creado (con su id).
    const res = await fetch(`${WEBHOOK_URL}?wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return data.id ?? null;
  } catch {
    return null;
  }
}

// Edita el mensaje del tablero (PATCH). Devuelve true si se editó; false si el
// mensaje ya no existe (p.ej. lo borraron) y hay que recrearlo.
export async function editScoreboard(
  messageId: string,
  content: string
): Promise<boolean> {
  if (!WEBHOOK_URL) return false;
  try {
    const res = await fetch(`${WEBHOOK_URL}/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
