// Capa de datos de SECCIONES DE CONTENIDO genéricas (lado servidor).
// Cada sección del Hub (eventos, codigos, war-pets, ...) puede tener una página de
// contenido scrapeado: intro + bloques (texto + imágenes). Mismo modelo que las
// guías pero SIN progreso. Lee de Supabase; la visibilidad la decide la RLS
// (publicado para todos, todo para admin).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

// Secciones que tienen su propia implementación (no usan este sistema genérico).
// "heroes" tiene galería interactiva propia (HeroesGallery).
const SPECIAL_SECTIONS = new Set(["guias", "heroes"]);

// ── Tipos que consumen las páginas ───────────────────────────
export type Block = {
  id: string;
  orderIndex: number;
  title: string;
  content: string;
  sourceUrl: string | null;
  isVerified: boolean;
  images: string[];
};

export type SectionContent = {
  id: string;
  slug: string;
  title: string;
  introTitle: string | null;
  intro: string | null;
  introImages: string[];
  blocks: Block[];
};

// ── Formas que devuelve Supabase ─────────────────────────────
type BlockRow = {
  id: string;
  order_index: number;
  title: string;
  content: string | null;
  source_url: string | null;
  is_verified: boolean;
  images: string[] | null;
};
type SectionRow = {
  id: string;
  slug: string;
  title: string;
  intro_title: string | null;
  intro: string | null;
  intro_images: string[] | null;
  section_blocks: BlockRow[];
};

const SECTION_SELECT =
  "id, slug, title, intro_title, intro, intro_images, section_blocks(id, order_index, title, content, source_url, is_verified, images)";

function mapBlock(b: BlockRow): Block {
  return {
    id: b.id,
    orderIndex: b.order_index,
    title: b.title,
    content: b.content ?? "",
    sourceUrl: b.source_url,
    isVerified: b.is_verified,
    images: b.images ?? [],
  };
}

// Id del juego por slug (RLS decide si es visible). null si no existe/visible.
async function gameIdBySlug(slug: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("id")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

// Contenido de una sección concreta de un juego (o null si no hay/no visible).
export async function getSectionContent(
  gameSlug: string,
  sectionSlug: string
): Promise<SectionContent | null> {
  if (!SUPABASE_CONFIGURED) return null;
  if (SPECIAL_SECTIONS.has(sectionSlug)) return null; // las maneja su propia página
  const gameId = await gameIdBySlug(gameSlug);
  if (!gameId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("game_sections")
    .select(SECTION_SELECT)
    .eq("game_id", gameId)
    .eq("slug", sectionSlug)
    .maybeSingle();
  if (error || !data) return null;

  const row = data as unknown as SectionRow;
  const blocks = [...row.section_blocks]
    .sort((a, b) => a.order_index - b.order_index)
    .map(mapBlock);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    introTitle: row.intro_title,
    intro: row.intro,
    introImages: row.intro_images ?? [],
    blocks,
  };
}

// Conjunto de slugs de secciones con contenido visible para ESTE juego.
// Sirve para que el Hub marque "Listo"/"Pendiente" por juego.
export async function getReadySections(gameSlug: string): Promise<Set<string>> {
  const ready = new Set<string>();
  if (!SUPABASE_CONFIGURED) return ready;
  const gameId = await gameIdBySlug(gameSlug);
  if (!gameId) return ready;
  const supabase = await createClient();

  // guias: lista si hay alguna guía publicada
  const { count: guideCount } = await supabase
    .from("guides")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId)
    .eq("is_published", true);
  if ((guideCount ?? 0) > 0) ready.add("guias");

  // heroes: lista si hay héroes publicados
  const { count: heroCount } = await supabase
    .from("heroes")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId)
    .eq("is_published", true);
  if ((heroCount ?? 0) > 0) ready.add("heroes");

  // secciones genéricas (eventos, codigos, war-pets...): las visibles en game_sections
  const { data } = await supabase
    .from("game_sections")
    .select("slug")
    .eq("game_id", gameId);
  for (const r of (data ?? []) as { slug: string }[]) {
    if (r.slug !== "heroes") ready.add(r.slug); // heroes lo maneja su propia ruta
  }

  return ready;
}
