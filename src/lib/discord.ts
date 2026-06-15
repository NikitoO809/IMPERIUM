// Datos EN VIVO del servidor de Discord (miembros totales + gente online).
//
// Truco: no hace falta bot ni token. La API de invitaciones de Discord
// devuelve los conteos aproximados de un servidor SOLO con el código de la
// invitación, si pides ?with_counts=true:
//   https://discord.com/api/v10/invites/{code}?with_counts=true
//
// Configura la invitación en .env.local:
//   NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/tu-codigo
// Si no está puesta, getDiscordStats() devuelve null y la web muestra
// un estado neutro (sin romperse).
import "server-only";

export type DiscordStats = {
  serverName: string;
  memberCount: number; // miembros totales (aprox.)
  onlineCount: number; // conectados ahora (aprox.)
  inviteUrl: string;
};

// URL pública de la invitación (también la usan los botones "Únete a Discord").
export const DISCORD_INVITE_URL = process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "";

// Extrae el código "abc123" de una URL como https://discord.gg/abc123
function inviteCode(url: string): string | null {
  const m = url.trim().match(/(?:discord\.gg\/|discord\.com\/invite\/)([\w-]+)/i);
  if (m) return m[1];
  // Por si pegan solo el código suelto.
  if (/^[\w-]+$/.test(url.trim())) return url.trim();
  return null;
}

// Trae los datos del servidor. Cacheado 5 min para no llamar a Discord en cada
// visita. Devuelve null si no hay invitación configurada o si Discord falla.
export async function getDiscordStats(): Promise<DiscordStats | null> {
  const code = inviteCode(DISCORD_INVITE_URL);
  if (!code) return null;

  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${code}?with_counts=true`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      guild?: { name?: string };
      approximate_member_count?: number;
      approximate_presence_count?: number;
    };
    return {
      serverName: data.guild?.name ?? "IMPERIUM",
      memberCount: data.approximate_member_count ?? 0,
      onlineCount: data.approximate_presence_count ?? 0,
      inviteUrl: DISCORD_INVITE_URL,
    };
  } catch {
    return null;
  }
}
