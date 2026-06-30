// Capa de datos del PERFIL PÚBLICO de un miembro (lado servidor).
// Lee de la vista `public_profiles` (solo campos públicos: nunca discord_id),
// que tiene permiso de lectura para todos — así un perfil se ve también sin
// login (escaparate + SEO).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { type Rank } from "@/lib/ranks";

export type PublicProfile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  rank: Rank;
  tagline: string | null;
  createdAt: string;
};

type Row = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  tagline: string | null;
  created_at: string;
};

function mapProfile(r: Row): PublicProfile {
  return {
    id: r.id,
    username: r.username ?? "Jugador",
    avatarUrl: r.avatar_url,
    rank: (r.role ?? "user") as Rank,
    tagline: r.tagline,
    createdAt: r.created_at,
  };
}

// Perfil público por id (o null si no existe / Supabase no configurado).
export async function getPublicProfile(id: string): Promise<PublicProfile | null> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("id, username, avatar_url, role, tagline, created_at")
    .eq("id", id)
    .maybeSingle();
  return data ? mapProfile(data as Row) : null;
}

// Id del usuario logueado (para saber si está viendo su propio perfil).
export async function getCurrentUserId(): Promise<string | null> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
