// Comunidad: MURO DE LOGROS. Hazañas de los juegos que jugamos, con imágenes y
// vídeos (enlaces de YouTube o vídeos subidos a Storage). Se gestionan a mano
// desde el panel (/admin/comunidad) y se guardan en la tabla
// `community_achievements`. La web pública (/comunidad) muestra los publicados,
// ordenados de lo más reciente a lo más antiguo.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  game: string;        // juego al que pertenece (texto libre)
  authorName: string;  // quién lo consiguió
  authorAvatar: string | null;
  achievedOn: string | null; // fecha (YYYY-MM-DD) o null
  images: string[];
  videos: string[];    // URLs de YouTube o de archivos subidos
  accent: string;      // color de acento HUD
  isPublished: boolean;
  createdAt: string;
};

type AchievementRow = {
  id: string;
  title: string;
  description: string | null;
  game: string | null;
  author_name: string | null;
  author_avatar: string | null;
  achieved_on: string | null;
  images: string[] | null;
  videos: string[] | null;
  accent: string | null;
  is_published: boolean;
  created_at: string;
};

const SELECT =
  "id, title, description, game, author_name, author_avatar, achieved_on, " +
  "images, videos, accent, is_published, created_at";

function mapAchievement(r: AchievementRow): Achievement {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    game: r.game ?? "",
    authorName: r.author_name ?? "",
    authorAvatar: r.author_avatar,
    achievedOn: r.achieved_on,
    images: r.images ?? [],
    videos: r.videos ?? [],
    accent: r.accent ?? "#7c5cff",
    isPublished: r.is_published,
    createdAt: r.created_at,
  };
}

// Ordena de lo más reciente a lo más antiguo: por fecha del logro (los que no
// tienen fecha van al final) y, a igualdad, por fecha de creación.
function sortRecent(a: Achievement, b: Achievement): number {
  const da = a.achievedOn ?? "";
  const db = b.achievedOn ?? "";
  if (da !== db) {
    if (!da) return 1;
    if (!db) return -1;
    return db.localeCompare(da);
  }
  return b.createdAt.localeCompare(a.createdAt);
}

// ── Web pública: solo logros publicados ──
export async function getCommunityAchievements(): Promise<Achievement[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_achievements")
    .select(SELECT)
    .eq("is_published", true);
  return ((data ?? []) as unknown as AchievementRow[]).map(mapAchievement).sort(sortRecent);
}

// ── Panel de admin: TODOS los logros (publicados u ocultos) ──
export async function getAdminCommunityAchievements(): Promise<Achievement[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("community_achievements").select(SELECT);
  return ((data ?? []) as unknown as AchievementRow[]).map(mapAchievement).sort(sortRecent);
}

// ════════════════════════════════════════════════════════════════
// MEJORES JUGADORES — la élite de la comunidad. Lista corta; al pulsar un
// nombre se revela su hazaña. Se muestra en una sección de fondo espacial.
// ════════════════════════════════════════════════════════════════
export type TopPlayer = {
  id: string;
  name: string;
  role: string;        // etiqueta corta (rol)
  achievement: string; // hazaña breve
  avatarUrl: string | null;
  accent: string;
  orderIndex: number;
  isPublished: boolean;
};

type TopPlayerRow = {
  id: string;
  name: string;
  role: string | null;
  achievement: string | null;
  avatar_url: string | null;
  accent: string | null;
  order_index: number;
  is_published: boolean;
};

const TP_SELECT = "id, name, role, achievement, avatar_url, accent, order_index, is_published";

function mapTopPlayer(r: TopPlayerRow): TopPlayer {
  return {
    id: r.id,
    name: r.name,
    role: r.role ?? "",
    achievement: r.achievement ?? "",
    avatarUrl: r.avatar_url,
    accent: r.accent ?? "#22e0ff",
    orderIndex: r.order_index,
    isPublished: r.is_published,
  };
}

// ── Web pública: solo jugadores publicados, en orden ──
export async function getTopPlayers(): Promise<TopPlayer[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_top_players")
    .select(TP_SELECT)
    .eq("is_published", true)
    .order("order_index");
  return ((data ?? []) as unknown as TopPlayerRow[]).map(mapTopPlayer);
}

// ── Panel de admin: TODOS los jugadores (publicados u ocultos) ──
export async function getAdminTopPlayers(): Promise<TopPlayer[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_top_players")
    .select(TP_SELECT)
    .order("order_index");
  return ((data ?? []) as unknown as TopPlayerRow[]).map(mapTopPlayer);
}
