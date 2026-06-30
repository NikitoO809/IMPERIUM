// Datos de "la comunidad en directo" para la portada: Muro de Fundadores,
// actividad reciente (mensajes + alianzas) y métricas. Todo desde vistas
// públicas → funciona sin login.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { RANK_LEVEL, type Rank } from "@/lib/ranks";

export type Founder = {
  id: string;
  name: string;
  avatar: string | null;
  rank: Rank;
};

// Donantes para el Muro de Fundadores (Leyendas primero), máximo `limit`.
export async function getFounders(limit = 12): Promise<Founder[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("id, username, avatar_url, role")
    .in("role", ["veterano", "fundador", "leyenda"]);
  const rows = (data ?? []) as { id: string; username: string | null; avatar_url: string | null; role: string }[];
  return rows
    .map((r) => ({
      id: r.id,
      name: r.username ?? "Jugador",
      avatar: r.avatar_url,
      rank: r.role as Rank,
    }))
    .sort((a, b) => RANK_LEVEL[b.rank] - RANK_LEVEL[a.rank])
    .slice(0, limit);
}

export type CommunityStats = { members: number; donors: number };

export async function getCommunityStats(): Promise<CommunityStats> {
  if (!SUPABASE_CONFIGURED) return { members: 0, donors: 0 };
  const supabase = await createClient();
  const [{ count: members }, { count: donors }] = await Promise.all([
    supabase.from("public_profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("public_profiles")
      .select("id", { count: "exact", head: true })
      .in("role", ["veterano", "fundador", "leyenda"]),
  ]);
  return { members: members ?? 0, donors: donors ?? 0 };
}

export type ActivityItem = {
  kind: "post" | "alliance";
  authorId: string;
  authorName: string;
  authorRank: Rank;
  gameSlug: string;
  gameName: string;
  text: string;
  when: string;
};

// Actividad reciente: últimos mensajes de discusión + últimas alianzas creadas.
export async function getRecentActivity(limit = 6): Promise<ActivityItem[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();

  const [{ data: posts }, { data: alliances }, { data: games }] = await Promise.all([
    supabase
      .from("discussion_feed")
      .select("game_slug, body, created_at, author_id, author_name, author_role")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("alliance_feed")
      .select("game_slug, name, created_at, owner_id, owner_name, owner_role")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase.from("games").select("slug, name"),
  ]);

  const nameBySlug = new Map<string, string>(
    ((games ?? []) as { slug: string; name: string }[]).map((g) => [g.slug, g.name])
  );
  const pretty = (slug: string) =>
    nameBySlug.get(slug) ?? slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");

  const items: ActivityItem[] = [];
  for (const p of (posts ?? []) as {
    game_slug: string; body: string; created_at: string; author_id: string; author_name: string | null; author_role: string | null;
  }[]) {
    items.push({
      kind: "post",
      authorId: p.author_id,
      authorName: p.author_name ?? "Jugador",
      authorRank: (p.author_role ?? "user") as Rank,
      gameSlug: p.game_slug,
      gameName: pretty(p.game_slug),
      text: p.body.slice(0, 80),
      when: p.created_at,
    });
  }
  for (const a of (alliances ?? []) as {
    game_slug: string; name: string; created_at: string; owner_id: string; owner_name: string | null; owner_role: string | null;
  }[]) {
    items.push({
      kind: "alliance",
      authorId: a.owner_id,
      authorName: a.owner_name ?? "Jugador",
      authorRank: (a.owner_role ?? "user") as Rank,
      gameSlug: a.game_slug,
      gameName: pretty(a.game_slug),
      text: a.name,
      when: a.created_at,
    });
  }

  return items.sort((x, y) => y.when.localeCompare(x.when)).slice(0, limit);
}
