// Capa de datos de JUEGOS / GUÍAS / PASOS / PROGRESO (lado servidor).
// Lee de Supabase. Si las claves no están puestas (SUPABASE_CONFIGURED = false)
// cae a los datos de EJEMPLO de demo-data.ts para que el sitio siga funcionando.
//
// Reglas de visibilidad (RLS, ver migración 20260613220000):
//   - games/guides/steps: solo se ven los publicados (o todo si eres admin).
//   - step_progress: cada usuario solo ve y edita el suyo.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { GAMES as DEMO_GAMES } from "@/lib/demo-data";
import { logDbError } from "@/lib/log";

// ── Tipos que consumen las páginas ───────────────────────────
export type GameMeta = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tag: string;
  rank: string;
  coverImage: string | null;
};

export type Step = {
  id: string;
  orderIndex: number;
  title: string;
  content: string;
  sourceUrl: string | null;
  isVerified: boolean;
  images: string[]; // URLs de imágenes (vacío si el paso no tiene)
};

export type GuideSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  stepCount: number;
  completedCount: number; // pasos completados por el usuario actual (0 si no hay sesión)
  coverImage: string | null; // primera imagen de intro de la guía
};

export type GuideWithSteps = {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  introTitle: string | null; // título del bloque introductorio (de la fuente)
  intro: string | null; // texto de la introducción (párrafos separados por \n\n)
  introImages: string[]; // imágenes de la cabecera/intro
  steps: Step[];
};

export type GameCard = GameMeta & {
  guideCount: number;
  completionPct: number; // % global del juego para el usuario actual
};

// Metadatos puramente visuales del HUD (no viven en la base de datos).
const PRESENTATION: Record<string, { tag: string; rank: string }> = {
  "call-of-dragons": { tag: "Estrategia", rank: "S" },
  "sword-x-staff": { tag: "RPG / Gacha", rank: "S" },
  "albion-online": { tag: "MMORPG", rank: "S" },
  "zenless-zone-zero": { tag: "RPG de acción / Gacha", rank: "S" },
  "wuthering-waves": { tag: "RPG de acción / Mundo abierto", rank: "S" },
  "arknights-endfield": { tag: "RPG · Saga Arknights", rank: "S" },
  "ragnarok-origin-classic": { tag: "MMORPG clásico", rank: "S" },
};
function present(slug: string) {
  return PRESENTATION[slug] ?? { tag: "Juego", rank: "S" };
}

// ── Formas que devuelve Supabase (select anidado) ────────────
type StepRow = {
  id: string;
  order_index: number;
  title: string;
  content: string | null;
  source_url: string | null;
  is_verified: boolean;
  images: string[] | null;
};
type GuideRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order_index: number;
  intro_title: string | null;
  intro: string | null;
  intro_images: string[] | null;
  guide_steps: StepRow[];
};
type GameRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  guides: GuideRow[];
};

const GAME_TREE_SELECT =
  "id, slug, name, description, cover_image, guides(id, slug, title, description, order_index, intro_title, intro, intro_images, guide_steps(id, order_index, title, content, source_url, is_verified, images))";

// Select LIGERO para el catálogo: solo ids de pasos (para contar avance) y nº de guías.
// No trae el contenido de cada paso (títulos, textos, imágenes) que el catálogo no usa.
const CATALOG_SELECT = "id, slug, name, description, cover_image, guides(id, guide_steps(id))";
type CatalogRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  guides: { id: string; guide_steps: { id: string }[] }[];
};

function mapStep(s: StepRow): Step {
  return {
    id: s.id,
    orderIndex: s.order_index,
    title: s.title,
    content: s.content ?? "",
    sourceUrl: s.source_url,
    isVerified: s.is_verified,
    images: s.images ?? [],
  };
}

// ── Fallback con datos de ejemplo (si no hay Supabase) ───────
function demoTree(slug: string): GameRow | null {
  const g = DEMO_GAMES.find((x) => x.slug === slug && !x.locked);
  if (!g) return null;
  return {
    id: g.slug,
    slug: g.slug,
    name: g.name,
    description: g.description,
    cover_image: null,
    guides: g.guides.map((gd) => ({
      id: gd.slug,
      slug: gd.slug,
      title: gd.title,
      description: gd.description,
      order_index: gd.orderIndex,
      intro_title: gd.introTitle ?? null,
      intro: gd.intro ?? null,
      intro_images: gd.introImages ?? null,
      guide_steps: gd.steps.map((s) => ({
        id: s.id,
        order_index: s.orderIndex,
        title: s.title,
        content: s.content,
        source_url: s.sourceUrl ?? null,
        is_verified: s.isVerified,
        images: s.images ?? null,
      })),
    })),
  };
}

// Trae el árbol completo de un juego publicado (juego → guías → pasos).
async function fetchGameTree(slug: string): Promise<GameRow | null> {
  if (!SUPABASE_CONFIGURED) return demoTree(slug);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select(GAME_TREE_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error || !data) {
    if (error) logDbError("fetchGameTree", error);
    return null;
  }
  return data as unknown as GameRow;
}

// Devuelve el set de step_id que el usuario actual ha completado.
async function fetchCompletedStepIds(): Promise<Set<string>> {
  if (!SUPABASE_CONFIGURED) return new Set();
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return new Set();
  const { data, error } = await supabase
    .from("step_progress")
    .select("step_id")
    .eq("user_id", userId)
    .eq("completed", true);
  if (error) logDbError("fetchCompletedStepIds", error);
  return new Set((data ?? []).map((r: { step_id: string }) => r.step_id));
}

function sortByOrder<T extends { order_index: number }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => a.order_index - b.order_index);
}

// Id del usuario con sesión iniciada (o null). Para saber si pedir login.
export async function getSessionUserId(): Promise<string | null> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ── API pública para las páginas ─────────────────────────────

// Catálogo: juegos publicados + nº de guías + % de avance del usuario.
export async function getCatalog(): Promise<GameCard[]> {
  if (!SUPABASE_CONFIGURED) {
    return DEMO_GAMES.filter((g) => !g.locked).map((g) => ({
      id: g.slug,
      slug: g.slug,
      name: g.name,
      description: g.description,
      ...present(g.slug),
      coverImage: null,
      guideCount: g.guides.length,
      completionPct: 0,
    }));
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select(CATALOG_SELECT)
    .eq("is_published", true)
    .order("created_at");
  if (error || !data) {
    if (error) logDbError("getCatalog", error);
    return [];
  }

  const completed = await fetchCompletedStepIds();
  return (data as unknown as CatalogRow[]).map((g) => {
    const steps = g.guides.flatMap((gd) => gd.guide_steps);
    const total = steps.length;
    const done = steps.filter((s) => completed.has(s.id)).length;
    return {
      id: g.id,
      slug: g.slug,
      name: g.name,
      description: g.description ?? "",
      ...present(g.slug),
      coverImage: g.cover_image ?? null,
      guideCount: g.guides.length,
      completionPct: total ? Math.round((done / total) * 100) : 0,
    };
  });
}

// Metadatos de un juego (para el hub y las secciones). null si no existe/publicado.
export async function getGameMeta(slug: string): Promise<GameMeta | null> {
  const tree = await fetchGameTree(slug);
  if (!tree) return null;
  return {
    id: tree.id,
    slug: tree.slug,
    name: tree.name,
    description: tree.description ?? "",
    ...present(tree.slug),
    coverImage: tree.cover_image ?? null,
  };
}

// Lista de guías de un juego con el avance del usuario en cada una.
export async function getGuidesForGame(
  slug: string
): Promise<{ meta: GameMeta; guides: GuideSummary[] } | null> {
  const tree = await fetchGameTree(slug);
  if (!tree) return null;
  const completed = await fetchCompletedStepIds();
  const guides: GuideSummary[] = sortByOrder(tree.guides).map((gd) => {
    const stepCount = gd.guide_steps.length;
    const completedCount = gd.guide_steps.filter((s) => completed.has(s.id)).length;
    return {
      id: gd.id,
      slug: gd.slug,
      title: gd.title,
      description: gd.description ?? "",
      orderIndex: gd.order_index,
      stepCount,
      completedCount,
      coverImage: gd.intro_images?.[0] ?? null,
    };
  });
  return {
    meta: { id: tree.id, slug: tree.slug, name: tree.name, description: tree.description ?? "", ...present(tree.slug), coverImage: tree.cover_image ?? null },
    guides,
  };
}

// Una guía concreta con sus pasos + qué pasos tiene marcados el usuario.
export async function getGuide(
  gameSlug: string,
  guideSlug: string
): Promise<{
  meta: GameMeta;
  guide: GuideWithSteps;
  completedStepIds: string[];
} | null> {
  const tree = await fetchGameTree(gameSlug);
  if (!tree) return null;
  const gd = tree.guides.find((x) => x.slug === guideSlug);
  if (!gd) return null;
  const completed = await fetchCompletedStepIds();
  const steps = sortByOrder(gd.guide_steps).map(mapStep);
  return {
    meta: { id: tree.id, slug: tree.slug, name: tree.name, description: tree.description ?? "", ...present(tree.slug), coverImage: tree.cover_image ?? null },
    guide: {
      id: gd.id,
      slug: gd.slug,
      title: gd.title,
      description: gd.description ?? "",
      orderIndex: gd.order_index,
      introTitle: gd.intro_title ?? null,
      intro: gd.intro ?? null,
      introImages: gd.intro_images ?? [],
      steps,
    },
    completedStepIds: steps.filter((s) => completed.has(s.id)).map((s) => s.id),
  };
}
