// Capa de datos de la DISCUSIÓN por juego (lado servidor).
// Lee del feed público `discussion_feed` (post + datos públicos del autor, nunca
// discord_id). La escritura/borrado van por server actions en la página, con la
// seguridad real en RLS (solo donantes publican; autor o staff borran).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { type Rank } from "@/lib/ranks";

export type DiscussionPost = {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  authorRank: Rank;
};

type Row = {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  author_name: string | null;
  author_avatar: string | null;
  author_role: string | null;
};

function mapPost(r: Row): DiscussionPost {
  return {
    id: r.id,
    body: r.body,
    createdAt: r.created_at,
    authorId: r.author_id,
    authorName: r.author_name ?? "Jugador",
    authorAvatar: r.author_avatar,
    authorRank: (r.author_role ?? "user") as Rank,
  };
}

// Mensajes de un juego, lo más reciente primero.
export async function getDiscussion(gameSlug: string, limit = 50): Promise<DiscussionPost[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("discussion_feed")
    .select("id, body, created_at, author_id, author_name, author_avatar, author_role")
    .eq("game_slug", gameSlug)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as Row[]).map(mapPost);
}
