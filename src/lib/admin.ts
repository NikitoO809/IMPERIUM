// Capa de datos del PANEL DE ADMIN (lado servidor).
// Lee TODO (incluido lo no publicado) porque el usuario es admin y las
// políticas RLS (Fase 2/4) se lo permiten via is_admin().
import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Comprueba que hay sesión y que el usuario es admin; si no, redirige a inicio.
// Devuelve el id del admin.
export async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") redirect("/");
  return user.id;
}

export type AdminGame = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isPublished: boolean;
  guideCount: number;
};

export type AdminGuide = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  orderIndex: number;
  isPublished: boolean;
};

export type AdminStep = {
  id: string;
  orderIndex: number;
  title: string;
  content: string | null;
  sourceUrl: string | null;
  isVerified: boolean;
  images: string[];
};

export type AdminUser = {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  role: string;
};

// Todos los juegos (publicados y no) con su nº de guías.
export async function getAdminGames(): Promise<AdminGame[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("id, slug, name, description, is_published, guides(id)")
    .order("created_at");
  return (data ?? []).map((g) => ({
    id: g.id,
    slug: g.slug,
    name: g.name,
    description: g.description,
    isPublished: g.is_published,
    guideCount: (g.guides as { id: string }[] | null)?.length ?? 0,
  }));
}

// Un juego + sus guías (ordenadas).
export async function getAdminGame(
  gameId: string
): Promise<{ game: AdminGame; guides: AdminGuide[] } | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("id, slug, name, description, is_published, guides(id, slug, title, description, order_index, is_published)")
    .eq("id", gameId)
    .maybeSingle();
  if (!data) return null;
  const guidesRaw = (data.guides ?? []) as {
    id: string; slug: string; title: string; description: string | null; order_index: number; is_published: boolean;
  }[];
  return {
    game: {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description,
      isPublished: data.is_published,
      guideCount: guidesRaw.length,
    },
    guides: guidesRaw
      .sort((a, b) => a.order_index - b.order_index)
      .map((gd) => ({
        id: gd.id,
        slug: gd.slug,
        title: gd.title,
        description: gd.description,
        orderIndex: gd.order_index,
        isPublished: gd.is_published,
      })),
  };
}

// Una guía + su juego + sus pasos (ordenados).
export async function getAdminGuide(guideId: string): Promise<{
  guide: AdminGuide & { gameId: string };
  game: { id: string; name: string };
  steps: AdminStep[];
} | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guides")
    .select(
      "id, slug, title, description, order_index, is_published, game_id, games(id, name), guide_steps(id, order_index, title, content, source_url, is_verified, images)"
    )
    .eq("id", guideId)
    .maybeSingle();
  if (!data) return null;
  const game = data.games as unknown as { id: string; name: string } | null;
  const stepsRaw = (data.guide_steps ?? []) as {
    id: string; order_index: number; title: string; content: string | null;
    source_url: string | null; is_verified: boolean; images: string[] | null;
  }[];
  return {
    guide: {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      orderIndex: data.order_index,
      isPublished: data.is_published,
      gameId: data.game_id,
    },
    game: { id: game?.id ?? data.game_id, name: game?.name ?? "Juego" },
    steps: stepsRaw
      .sort((a, b) => a.order_index - b.order_index)
      .map((s) => ({
        id: s.id,
        orderIndex: s.order_index,
        title: s.title,
        content: s.content,
        sourceUrl: s.source_url,
        isVerified: s.is_verified,
        images: s.images ?? [],
      })),
  };
}

// Todos los usuarios (para gestionar roles).
export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, role")
    .order("created_at");
  return (data ?? []).map((u) => ({
    id: u.id,
    username: u.username,
    avatarUrl: u.avatar_url,
    role: u.role,
  }));
}
