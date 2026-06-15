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
  publishedGuideCount: number;
};

export type AdminGuide = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  orderIndex: number;
  isPublished: boolean;
  introTitle: string | null;
  intro: string | null;
  introImages: string[];
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

export type AdminSection = {
  id: string;
  slug: string;
  title: string;
  introTitle: string | null;
  intro: string | null;
  renderType: string;
  orderIndex: number;
  blockCount: number;
};

export type AdminBlock = {
  id: string;
  orderIndex: number;
  title: string;
  content: string;
  sourceUrl: string | null;
  isVerified: boolean;
  images: string[];
};

// ── Juegos ───────────────────────────────────────────────────────

export async function getAdminGames(): Promise<AdminGame[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("id, slug, name, description, is_published, guides(id, is_published)")
    .order("created_at");
  return (data ?? []).map((g) => {
    const allGuides = (g.guides as { id: string; is_published: boolean }[] | null) ?? [];
    return {
      id: g.id,
      slug: g.slug,
      name: g.name,
      description: g.description,
      isPublished: g.is_published,
      guideCount: allGuides.length,
      publishedGuideCount: allGuides.filter((gd) => gd.is_published).length,
    };
  });
}

export async function getAdminGame(
  gameId: string
): Promise<{ game: AdminGame; guides: AdminGuide[] } | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select(
      "id, slug, name, description, is_published, guides(id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)"
    )
    .eq("id", gameId)
    .maybeSingle();
  if (!data) return null;
  type GuideRaw = {
    id: string; slug: string; title: string; description: string | null;
    order_index: number; is_published: boolean;
    intro_title: string | null; intro: string | null; intro_images: string[] | null;
  };
  const guidesRaw = (data.guides ?? []) as GuideRaw[];
  const guides: AdminGuide[] = guidesRaw
    .sort((a, b) => a.order_index - b.order_index)
    .map((gd) => ({
      id: gd.id,
      slug: gd.slug,
      title: gd.title,
      description: gd.description,
      orderIndex: gd.order_index,
      isPublished: gd.is_published,
      introTitle: gd.intro_title,
      intro: gd.intro,
      introImages: gd.intro_images ?? [],
    }));
  return {
    game: {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description,
      isPublished: data.is_published,
      guideCount: guides.length,
      publishedGuideCount: guides.filter((gd) => gd.isPublished).length,
    },
    guides,
  };
}

// ── Guías ────────────────────────────────────────────────────────

export async function getAdminGuide(guideId: string): Promise<{
  guide: AdminGuide & { gameId: string };
  game: { id: string; name: string };
  steps: AdminStep[];
} | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guides")
    .select(
      "id, slug, title, description, order_index, is_published, game_id, intro_title, intro, intro_images, games(id, name), guide_steps(id, order_index, title, content, source_url, is_verified, images)"
    )
    .eq("id", guideId)
    .maybeSingle();
  if (!data) return null;

  type DataShape = {
    id: string; slug: string; title: string; description: string | null;
    order_index: number; is_published: boolean; game_id: string;
    intro_title: string | null; intro: string | null; intro_images: string[] | null;
    games: unknown;
    guide_steps: {
      id: string; order_index: number; title: string; content: string | null;
      source_url: string | null; is_verified: boolean; images: string[] | null;
    }[];
  };
  const d = data as unknown as DataShape;
  const game = d.games as { id: string; name: string } | null;

  return {
    guide: {
      id: d.id,
      slug: d.slug,
      title: d.title,
      description: d.description,
      orderIndex: d.order_index,
      isPublished: d.is_published,
      gameId: d.game_id,
      introTitle: d.intro_title,
      intro: d.intro,
      introImages: d.intro_images ?? [],
    },
    game: { id: game?.id ?? d.game_id, name: game?.name ?? "Juego" },
    steps: (d.guide_steps ?? [])
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

// ── Usuarios ─────────────────────────────────────────────────────

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

// ── Secciones genéricas ──────────────────────────────────────────

export async function getAdminSections(gameId: string): Promise<AdminSection[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("game_sections")
    .select("id, slug, title, intro_title, intro, render_type, order_index, section_blocks(id)")
    .eq("game_id", gameId)
    .order("order_index");
  type SecRaw = {
    id: string; slug: string; title: string; intro_title: string | null; intro: string | null;
    render_type: string | null; order_index: number; section_blocks: { id: string }[] | null;
  };
  return (data ?? []).map((s: unknown) => {
    const r = s as SecRaw;
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      introTitle: r.intro_title,
      intro: r.intro,
      renderType: r.render_type ?? "generic",
      orderIndex: r.order_index,
      blockCount: r.section_blocks?.length ?? 0,
    };
  });
}

export async function getAdminSection(sectionId: string): Promise<{
  section: AdminSection & { gameId: string };
  game: { id: string; name: string; slug: string };
  blocks: AdminBlock[];
} | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("game_sections")
    .select(
      "id, slug, title, intro_title, intro, render_type, order_index, game_id, games(id, name, slug), section_blocks(id, order_index, title, content, source_url, is_verified, images)"
    )
    .eq("id", sectionId)
    .maybeSingle();
  if (!data) return null;

  type SectionShape = {
    id: string; slug: string; title: string; intro_title: string | null; intro: string | null;
    render_type: string | null; order_index: number; game_id: string;
    games: unknown;
    section_blocks: {
      id: string; order_index: number; title: string; content: string | null;
      source_url: string | null; is_verified: boolean; images: string[] | null;
    }[];
  };
  const d = data as unknown as SectionShape;
  const game = d.games as { id: string; name: string; slug: string } | null;

  return {
    section: {
      id: d.id,
      slug: d.slug,
      title: d.title,
      introTitle: d.intro_title,
      intro: d.intro,
      renderType: d.render_type ?? "generic",
      orderIndex: d.order_index,
      blockCount: (d.section_blocks ?? []).length,
      gameId: d.game_id,
    },
    game: { id: game?.id ?? d.game_id, name: game?.name ?? "Juego", slug: game?.slug ?? "" },
    blocks: (d.section_blocks ?? [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((b) => ({
        id: b.id,
        orderIndex: b.order_index,
        title: b.title,
        content: b.content ?? "",
        sourceUrl: b.source_url,
        isVerified: b.is_verified,
        images: b.images ?? [],
      })),
  };
}
