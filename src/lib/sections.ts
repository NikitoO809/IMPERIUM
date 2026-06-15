// Capa de datos de SECCIONES DE CONTENIDO genéricas (lado servidor).
// Cada sección del Hub (eventos, codigos, war-pets, ...) puede tener una página de
// contenido scrapeado: intro + bloques (texto + imágenes). Mismo modelo que las
// guías pero SIN progreso. Lee de Supabase; la visibilidad la decide la RLS
// (publicado para todos, todo para admin).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { GAME_SECTIONS } from "@/lib/demo-data";

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
  // Metadatos estructurados por bloque (jsonb). P. ej. { tier: "Legendary" } en
  // artefactos. Siempre es un objeto (vacío si no hay nada).
  meta: { tier?: string } & Record<string, unknown>;
};

export type SectionContent = {
  id: string;
  slug: string;
  title: string;
  introTitle: string | null;
  intro: string | null;
  introImages: string[];
  renderType: string; // 'generic' | 'tier-list' | 'artifact-table' | 'behemoth'
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
  meta: ({ tier?: string } & Record<string, unknown>) | null;
};
type SectionRow = {
  id: string;
  slug: string;
  title: string;
  intro_title: string | null;
  intro: string | null;
  intro_images: string[] | null;
  render_type: string | null;
  section_blocks: BlockRow[];
};

const SECTION_SELECT =
  "id, slug, title, intro_title, intro, intro_images, render_type, section_blocks(id, order_index, title, content, source_url, is_verified, images, meta)";

function mapBlock(b: BlockRow): Block {
  return {
    id: b.id,
    orderIndex: b.order_index,
    title: b.title,
    content: b.content ?? "",
    sourceUrl: b.source_url,
    isVerified: b.is_verified,
    images: b.images ?? [],
    meta: b.meta ?? {},
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
    renderType: row.render_type ?? "generic",
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

// ── Hub dinámico: secciones a mostrar en el Hub de un juego ───────────────────
// Solo secciones CON contenido. La presentación (label/desc/icono/portada) sale de
// la BD; si está vacía, la página usa sus fallbacks (GAME_SECTIONS/SECTION_*).
// `guias` y `heroes` son rutas propias (especiales) y se tratan aparte.
export type HubSection = {
  slug: string;
  kind: "guias" | "heroes" | "generic";
  renderType: string;
  label: string | null;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  orderIndex: number;
};

export async function getHubSections(gameSlug: string): Promise<HubSection[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const gameId = await gameIdBySlug(gameSlug);
  if (!gameId) return [];
  const supabase = await createClient();

  const out: HubSection[] = [];

  // guias: hay alguna guía visible. NO filtramos is_published aquí: la RLS ya
  // decide (el público solo ve publicadas; el admin ve también los borradores),
  // así Miguel puede revisar borradores desde el Hub.
  const { count: guideCount } = await supabase
    .from("guides")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId);
  if ((guideCount ?? 0) > 0) {
    out.push({ slug: "guias", kind: "guias", renderType: "guias", label: null, description: null, icon: null, coverImage: null, orderIndex: 0 });
  }

  // secciones genéricas con AL MENOS un bloque (excluye heroes; va por su tabla)
  const { data: secs } = await supabase
    .from("game_sections")
    .select("slug, label, description, icon, cover_image, render_type, order_index, section_blocks(count)")
    .eq("game_id", gameId);
  for (const r of (secs ?? []) as Array<Record<string, unknown>>) {
    if (r.slug === "heroes") continue;
    const sb = r.section_blocks as Array<{ count: number }> | undefined;
    const blockCount = Array.isArray(sb) ? sb[0]?.count ?? 0 : 0;
    if (blockCount <= 0) continue;
    out.push({
      slug: r.slug as string,
      kind: "generic",
      renderType: (r.render_type as string) || "generic",
      label: (r.label as string) ?? null,
      description: (r.description as string) ?? null,
      icon: (r.icon as string) ?? null,
      coverImage: (r.cover_image as string) ?? null,
      orderIndex: (r.order_index as number) ?? 0,
    });
  }

  // heroes: por la tabla heroes (lógica heredada, su propia ruta /heroes)
  const { count: heroCount } = await supabase
    .from("heroes")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId)
    .eq("is_published", true);
  if ((heroCount ?? 0) > 0) {
    out.push({ slug: "heroes", kind: "heroes", renderType: "tier-list", label: null, description: null, icon: null, coverImage: null, orderIndex: 0 });
  }

  // Orden: guias primero, luego el orden canónico de GAME_SECTIONS (para que CoD
  // salga igual que hoy), y las secciones nuevas (no catalogadas) al final por su
  // order_index.
  const canonical = (slug: string) => {
    if (slug === "guias") return -1;
    const i = GAME_SECTIONS.findIndex((s) => s.slug === slug);
    return i === -1 ? 100 : i;
  };
  out.sort((a, b) => canonical(a.slug) - canonical(b.slug) || a.orderIndex - b.orderIndex);
  return out;
}
