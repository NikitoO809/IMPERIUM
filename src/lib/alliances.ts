// Capa de datos de las ALIANZAS por juego (lado servidor).
// Lee del feed público `alliance_feed` (alianza + dueño público + nº miembros).
// Crear/unirse/salir/borrar van por server actions en la página; la seguridad
// real vive en RLS (donantes crean; cualquiera se une; dueño/staff borran).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { type Rank } from "@/lib/ranks";

export type Alliance = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string | null;
  ownerRank: Rank;
  memberCount: number;
};

type Row = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  owner_id: string;
  owner_name: string | null;
  owner_avatar: string | null;
  owner_role: string | null;
  member_count: number | null;
};

function mapAlliance(r: Row): Alliance {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    createdAt: r.created_at,
    ownerId: r.owner_id,
    ownerName: r.owner_name ?? "Jugador",
    ownerAvatar: r.owner_avatar,
    ownerRank: (r.owner_role ?? "user") as Rank,
    memberCount: Number(r.member_count ?? 0),
  };
}

// Alianzas de un juego, lo más reciente primero.
export async function getAlliances(gameSlug: string): Promise<Alliance[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("alliance_feed")
    .select(
      "id, name, description, created_at, owner_id, owner_name, owner_avatar, owner_role, member_count"
    )
    .eq("game_slug", gameSlug)
    .order("created_at", { ascending: false });
  return ((data ?? []) as Row[]).map(mapAlliance);
}

// Ids de las alianzas a las que pertenece el usuario actual (para "Unirme/Salir").
export async function getMyAllianceIds(): Promise<Set<string>> {
  if (!SUPABASE_CONFIGURED) return new Set();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase
    .from("alliance_members")
    .select("alliance_id")
    .eq("user_id", user.id);
  return new Set((data ?? []).map((r: { alliance_id: string }) => r.alliance_id));
}
