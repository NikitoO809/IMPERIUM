// Capa de datos de héroes (lado servidor). Lee de public.heroes y public.hero_builds.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export type Hero = {
  id: string;
  name: string;
  slug: string;
  generation: number;
  tier: string;
  faction: string;
  heroClass: string;
  role: string;
  specialty: string;
  description: string;
  imageUrl: string;
};

export type HeroBuild = {
  id: string;
  section: string;
  orderIndex: number;
  content: string;
  images: string[];
  sourceUrl: string | null;
  isVerified: boolean;
};

type HeroRow = {
  id: string;
  name: string;
  slug: string;
  generation: number;
  tier: string;
  faction: string;
  hero_class: string;
  role: string;
  specialty: string;
  description: string;
  image_url: string;
};

type HeroBuildRow = {
  id: string;
  section: string;
  order_index: number;
  content: string;
  images: string[] | null;
  source_url: string | null;
  is_verified: boolean;
};

// Todos los héroes publicados de un juego, ordenados por generación desc y tier.
export async function getHeroesByGame(gameSlug: string): Promise<Hero[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("slug", gameSlug)
    .eq("is_published", true)
    .maybeSingle();
  if (!game) return [];

  const { data, error } = await supabase
    .from("heroes")
    .select("id, name, slug, generation, tier, faction, hero_class, role, specialty, description, image_url")
    .eq("game_id", (game as { id: string }).id)
    .eq("is_published", true)
    .order("generation", { ascending: false })
    .order("name");

  if (error || !data) return [];
  return (data as HeroRow[]).map((h) => ({
    id: h.id,
    name: h.name,
    slug: h.slug,
    generation: h.generation,
    tier: h.tier,
    faction: h.faction,
    heroClass: h.hero_class,
    role: h.role,
    specialty: h.specialty,
    description: h.description,
    imageUrl: h.image_url,
  }));
}

// Build de un héroe concreto (puede estar vacía si aún no se ha scrapeado).
export async function getHeroBuild(heroId: string): Promise<HeroBuild[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_builds")
    .select("id, section, order_index, content, images, source_url, is_verified")
    .eq("hero_id", heroId)
    .order("order_index");

  if (error || !data) return [];
  return (data as HeroBuildRow[]).map((b) => ({
    id: b.id,
    section: b.section,
    orderIndex: b.order_index,
    content: b.content,
    images: b.images ?? [],
    sourceUrl: b.source_url,
    isVerified: b.is_verified,
  }));
}
