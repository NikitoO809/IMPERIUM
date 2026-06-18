"use server";

// Server Actions del panel de admin con COLA DE APROBACIÓN.
//
// Cada operación de contenido vive como "executor" (la lógica real). El `gate`
// decide qué hacer según el rango de quien la dispara:
//   · Supremo            → ejecuta el executor al instante.
//   · Admin / Moderador  → guarda el cambio en `change_requests` (pendiente).
// El Supremo revisa la bandeja (/admin/aprobaciones) y aprueba (re-ejecuta el
// executor) o rechaza (descarta). Las políticas RLS/triggers refuerzan todo.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type DB = Awaited<ReturnType<typeof createClient>>;

// ── Utilidades ───────────────────────────────────────────────────
const PUBLISHERS = ["supremo", "admin"];
const STAFF = ["supremo", "admin", "moderador"];

async function getStaffClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const rank = profile?.role ?? "user";
  if (!STAFF.includes(rank)) throw new Error("No autorizado");
  return { supabase, rank, userId: user.id };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function parseImages(raw: string): string[] {
  return raw.split("\n").map((s) => s.trim()).filter(Boolean);
}

function parseCsv(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function parseHype(raw: string): number | null {
  const v = raw.trim().replace(",", ".");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function hexToInt(raw: string): number {
  const v = raw.trim().replace(/^#/, "");
  const n = parseInt(v, 16);
  return Number.isFinite(n) ? n : 0x7c5cff;
}

function revalidateAll() {
  revalidatePath("/admin", "layout");
  revalidatePath("/juegos", "layout");
  revalidatePath("/comunidad");
}
function revalidateAbout() {
  revalidatePath("/admin/nosotros");
  revalidatePath("/nosotros");
}
function revalidateUpcoming() {
  revalidatePath("/admin/proximos");
  revalidatePath("/");
}
function revalidateHorizon() {
  revalidatePath("/admin/horizonte");
  revalidatePath("/");
}
function revalidateCommunity() {
  revalidatePath("/admin/comunidad");
  revalidatePath("/comunidad");
}

// Deja un "aviso flash" para que el panel muestre un toast tras guardar.
// Va en una cookie corta (no httpOnly → el toast la borra al mostrarse). El
// campo `t` la hace única en cada guardado para que el aviso reaparezca aunque
// el texto se repita. Next devuelve la UI ya con la cookie en el mismo viaje.
async function setFlash(message: string, kind: "ok" | "pending" = "ok") {
  const store = await cookies();
  store.set("admin_flash", JSON.stringify({ message, kind, t: Date.now() }), {
    path: "/",
    maxAge: 30,
    httpOnly: false,
    sameSite: "lax",
  });
}

// FormData <-> JSON (para guardar el cambio pendiente y re-ejecutarlo al aprobar).
function fdToJson(fd: FormData): Record<string, string> {
  const o: Record<string, string> = {};
  for (const [k, v] of fd.entries()) o[k] = String(v);
  return o;
}
function jsonToFd(payload: Record<string, string> | null): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(payload ?? {})) fd.append(k, String(v));
  return fd;
}

// Intercambia el order_index de un elemento con su vecino (subir/bajar), opcionalmente
// acotado a un "padre" (p.ej. los pasos de UNA guía). Centraliza la lógica que antes
// estaba repetida en cada move* y, a diferencia de antes, comprueba los errores de los
// dos UPDATE (si uno falla, lanza en vez de dejar el orden a medias en silencio).
// Solo revalida (con la función indicada) si de verdad hubo intercambio.
async function swapOrder(
  supabase: DB,
  table: string,
  fd: FormData,
  revalidate: () => void,
  parent?: { column: string; value: string }
) {
  const id = str(fd, "id");
  const direction = str(fd, "direction") as "up" | "down";
  let query = supabase.from(table).select("id, order_index");
  if (parent) query = query.eq(parent.column, parent.value);
  const { data: all, error: selErr } = await query.order("order_index");
  if (selErr) throw new Error(selErr.message);
  if (!all) return;
  const idx = all.findIndex((r: { id: string }) => r.id === id);
  if (idx === -1) return;
  const adjIdx = direction === "up" ? idx - 1 : idx + 1;
  if (adjIdx < 0 || adjIdx >= all.length) return;
  const cur = all[idx];
  const adj = all[adjIdx];
  const { error: e1 } = await supabase.from(table).update({ order_index: adj.order_index }).eq("id", cur.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await supabase.from(table).update({ order_index: cur.order_index }).eq("id", adj.id);
  if (e2) throw new Error(e2.message);
  revalidate();
}

// ════════════════════════════════════════════════════════════════
// EXECUTORS — la lógica real de cada operación (sin redirect; eso lo
// maneja el wrapper público). Se ejecutan o al instante (Supremo) o al
// aprobar un cambio pendiente.
// ════════════════════════════════════════════════════════════════
const EXECUTORS: Record<string, (fd: FormData, supabase: DB) => Promise<void>> = {
  // ── Juegos ──
  createGame: async (fd, supabase) => {
    const name = str(fd, "name");
    if (!name) throw new Error("Falta el nombre");
    const { error } = await supabase.from("games").insert({
      name,
      slug: slugify(str(fd, "slug") || name),
      description: str(fd, "description") || null,
      is_published: false,
    });
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  updateGame: async (fd, supabase) => {
    const { error } = await supabase
      .from("games")
      .update({
        name: str(fd, "name"),
        slug: slugify(str(fd, "slug")),
        description: str(fd, "description") || null,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  setGamePublished: async (fd, supabase) => {
    const { error } = await supabase
      .from("games")
      .update({ is_published: str(fd, "value") === "true" })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  deleteGame: async (fd, supabase) => {
    const { error } = await supabase.from("games").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },

  // ── Guías ──
  createGuide: async (fd, supabase) => {
    const gameId = str(fd, "game_id");
    const title = str(fd, "title");
    if (!gameId || !title) throw new Error("Faltan datos");
    const { error } = await supabase.from("guides").insert({
      game_id: gameId,
      title,
      slug: slugify(str(fd, "slug") || title),
      description: str(fd, "description") || null,
      order_index: Number(str(fd, "order_index")) || 0,
      is_published: false,
    });
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  updateGuide: async (fd, supabase) => {
    const coverImage = str(fd, "cover_image");
    const extraImages = parseImages(str(fd, "extra_images"));
    const introImages = [coverImage, ...extraImages].filter(Boolean);
    const { error } = await supabase
      .from("guides")
      .update({
        title: str(fd, "title"),
        slug: slugify(str(fd, "slug")),
        description: str(fd, "description") || null,
        order_index: Number(str(fd, "order_index")) || 0,
        intro_title: str(fd, "intro_title") || null,
        intro: str(fd, "intro") || null,
        intro_images: introImages,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  setGuidePublished: async (fd, supabase) => {
    const { error } = await supabase
      .from("guides")
      .update({ is_published: str(fd, "value") === "true" })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  deleteGuide: async (fd, supabase) => {
    const { error } = await supabase.from("guides").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },

  // ── Pasos ──
  createStep: async (fd, supabase) => {
    const guideId = str(fd, "guide_id");
    const title = str(fd, "title");
    if (!guideId || !title) throw new Error("Faltan datos");
    const images = [str(fd, "main_image"), ...parseImages(str(fd, "extra_images"))].filter(Boolean);
    const { error } = await supabase.from("guide_steps").insert({
      guide_id: guideId,
      title,
      content: str(fd, "content") || null,
      source_url: str(fd, "source_url") || null,
      order_index: Number(str(fd, "order_index")) || 0,
      is_verified: fd.get("is_verified") === "on",
      images,
    });
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  updateStep: async (fd, supabase) => {
    const images = [str(fd, "main_image"), ...parseImages(str(fd, "extra_images"))].filter(Boolean);
    const { error } = await supabase
      .from("guide_steps")
      .update({
        title: str(fd, "title"),
        content: str(fd, "content") || null,
        source_url: str(fd, "source_url") || null,
        order_index: Number(str(fd, "order_index")) || 0,
        is_verified: fd.get("is_verified") === "on",
        images,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  moveStep: async (fd, supabase) => {
    await swapOrder(supabase, "guide_steps", fd, revalidateAll, { column: "guide_id", value: str(fd, "guide_id") });
  },
  deleteStep: async (fd, supabase) => {
    const { error } = await supabase.from("guide_steps").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },

  // ── Secciones ──
  createSection: async (fd, supabase) => {
    const gameId = str(fd, "game_id");
    const title = str(fd, "title");
    if (!gameId || !title) throw new Error("Faltan datos");
    const { error } = await supabase.from("game_sections").insert({
      game_id: gameId,
      title,
      slug: slugify(str(fd, "slug") || title),
      render_type: str(fd, "render_type") || "generic",
      order_index: Number(str(fd, "order_index")) || 99,
    });
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  updateSection: async (fd, supabase) => {
    const { error } = await supabase
      .from("game_sections")
      .update({
        title: str(fd, "title"),
        slug: slugify(str(fd, "slug")),
        intro_title: str(fd, "intro_title") || null,
        intro: str(fd, "intro") || null,
        render_type: str(fd, "render_type") || "generic",
        order_index: Number(str(fd, "order_index")) || 0,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  setSectionPublished: async (fd, supabase) => {
    const { error } = await supabase
      .from("game_sections")
      .update({ is_published: str(fd, "value") === "true" })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  // Publica de golpe TODAS las guías y secciones de un juego (atajo "mostrar
  // todo al público"). Útil tras scrapear un juego nuevo, donde todo nace oculto.
  publishAllContent: async (fd, supabase) => {
    const gameId = str(fd, "game_id");
    if (!gameId) throw new Error("Falta el juego");
    const r1 = await supabase.from("guides").update({ is_published: true }).eq("game_id", gameId);
    if (r1.error) throw new Error(r1.error.message);
    const r2 = await supabase.from("game_sections").update({ is_published: true }).eq("game_id", gameId);
    if (r2.error) throw new Error(r2.error.message);
    revalidateAll();
  },
  deleteSection: async (fd, supabase) => {
    const { error } = await supabase.from("game_sections").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },

  // ── Bloques ──
  createBlock: async (fd, supabase) => {
    const sectionId = str(fd, "section_id");
    const title = str(fd, "title");
    if (!sectionId || !title) throw new Error("Faltan datos");
    const images = [str(fd, "main_image"), ...parseImages(str(fd, "extra_images"))].filter(Boolean);
    const { error } = await supabase.from("section_blocks").insert({
      section_id: sectionId,
      title,
      content: str(fd, "content") || null,
      source_url: str(fd, "source_url") || null,
      order_index: Number(str(fd, "order_index")) || 0,
      is_verified: fd.get("is_verified") === "on",
      images,
    });
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  updateBlock: async (fd, supabase) => {
    const images = [str(fd, "main_image"), ...parseImages(str(fd, "extra_images"))].filter(Boolean);
    const { error } = await supabase
      .from("section_blocks")
      .update({
        title: str(fd, "title"),
        content: str(fd, "content") || null,
        source_url: str(fd, "source_url") || null,
        order_index: Number(str(fd, "order_index")) || 0,
        is_verified: fd.get("is_verified") === "on",
        images,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },
  moveBlock: async (fd, supabase) => {
    await swapOrder(supabase, "section_blocks", fd, revalidateAll, { column: "section_id", value: str(fd, "section_id") });
  },
  deleteBlock: async (fd, supabase) => {
    const { error } = await supabase.from("section_blocks").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAll();
  },

  // ── Próximos juegos ──
  createUpcomingGame: async (fd, supabase) => {
    const name = str(fd, "name");
    if (!name) throw new Error("Falta el nombre");
    const { error } = await supabase.from("upcoming_games").insert({
      key: slugify(str(fd, "key") || name),
      name,
      tag: str(fd, "tag") || "",
      blurb: str(fd, "blurb") || "",
      image: str(fd, "image") || null,
      emoji: str(fd, "emoji") || "🟣",
      color: hexToInt(str(fd, "color") || "#7c5cff"),
      order_index: Number(str(fd, "order_index")) || 0,
    });
    if (error) throw new Error(error.message);
    revalidateUpcoming();
  },
  updateUpcomingGame: async (fd, supabase) => {
    const { error } = await supabase
      .from("upcoming_games")
      .update({
        name: str(fd, "name"),
        tag: str(fd, "tag") || "",
        blurb: str(fd, "blurb") || "",
        image: str(fd, "image") || null,
        emoji: str(fd, "emoji") || "🟣",
        color: hexToInt(str(fd, "color") || "#7c5cff"),
        order_index: Number(str(fd, "order_index")) || 0,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateUpcoming();
  },
  moveUpcomingGame: async (fd, supabase) => {
    await swapOrder(supabase, "upcoming_games", fd, revalidateUpcoming);
  },
  deleteUpcomingGame: async (fd, supabase) => {
    const { error } = await supabase.from("upcoming_games").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateUpcoming();
  },

  // ── MMORPG en el horizonte ──
  createPreRegisterGame: async (fd, supabase) => {
    const name = str(fd, "name");
    if (!name) throw new Error("Falta el nombre");
    const { error } = await supabase.from("preregister_games").insert({
      key: slugify(str(fd, "key") || name),
      name,
      genre: str(fd, "genre") || "",
      status: str(fd, "status") || "",
      hype: parseHype(str(fd, "hype")),
      platforms: parseCsv(str(fd, "platforms")),
      developer: str(fd, "developer") || null,
      publisher: str(fd, "publisher") || null,
      release_window: str(fd, "release_window") || null,
      blurb: str(fd, "blurb") || "",
      image: str(fd, "image") || null,
      info_url: str(fd, "info_url") || "",
      website: str(fd, "website") || null,
      prereg_url: str(fd, "prereg_url") || null,
      order_index: Number(str(fd, "order_index")) || 0,
    });
    if (error) throw new Error(error.message);
    revalidateHorizon();
  },
  updatePreRegisterGame: async (fd, supabase) => {
    const { error } = await supabase
      .from("preregister_games")
      .update({
        name: str(fd, "name"),
        genre: str(fd, "genre") || "",
        status: str(fd, "status") || "",
        hype: parseHype(str(fd, "hype")),
        platforms: parseCsv(str(fd, "platforms")),
        developer: str(fd, "developer") || null,
        publisher: str(fd, "publisher") || null,
        release_window: str(fd, "release_window") || null,
        blurb: str(fd, "blurb") || "",
        image: str(fd, "image") || null,
        info_url: str(fd, "info_url") || "",
        website: str(fd, "website") || null,
        prereg_url: str(fd, "prereg_url") || null,
        order_index: Number(str(fd, "order_index")) || 0,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateHorizon();
  },
  movePreRegisterGame: async (fd, supabase) => {
    await swapOrder(supabase, "preregister_games", fd, revalidateHorizon);
  },
  deletePreRegisterGame: async (fd, supabase) => {
    const { error } = await supabase.from("preregister_games").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateHorizon();
  },

  // ── Nosotros ──
  updateAboutIntro: async (fd, supabase) => {
    const { error } = await supabase.from("about_page").upsert({
      id: 1,
      intro: str(fd, "intro") || null,
      quote: str(fd, "quote") || null,
      games: parseImages(str(fd, "games")), // una por línea (reutiliza el parser de líneas)
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    revalidateAbout();
  },
  createTimelineItem: async (fd, supabase) => {
    const year = str(fd, "year");
    const title = str(fd, "title");
    if (!year || !title) throw new Error("Faltan datos");
    const { error } = await supabase.from("about_timeline").insert({
      year,
      title,
      description: str(fd, "description") || null,
      order_index: Number(str(fd, "order_index")) || 0,
    });
    if (error) throw new Error(error.message);
    revalidateAbout();
  },
  updateTimelineItem: async (fd, supabase) => {
    const { error } = await supabase
      .from("about_timeline")
      .update({
        year: str(fd, "year"),
        title: str(fd, "title"),
        description: str(fd, "description") || null,
        order_index: Number(str(fd, "order_index")) || 0,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAbout();
  },
  moveTimelineItem: async (fd, supabase) => {
    await swapOrder(supabase, "about_timeline", fd, revalidateAbout);
  },
  deleteTimelineItem: async (fd, supabase) => {
    const { error } = await supabase.from("about_timeline").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAbout();
  },
  createAboutAdmin: async (fd, supabase) => {
    const name = str(fd, "name");
    const role = str(fd, "role");
    if (!name || !role) throw new Error("Faltan datos");
    const tierStr = str(fd, "tier");
    const { error } = await supabase.from("about_admins").insert({
      name,
      role,
      bio: str(fd, "bio") || null,
      avatar_url: str(fd, "avatar_url") || null,
      tier: tierStr === "" ? 1 : Number(tierStr),
      order_index: Number(str(fd, "order_index")) || 0,
    });
    if (error) throw new Error(error.message);
    revalidateAbout();
  },
  updateAboutAdmin: async (fd, supabase) => {
    const tierStr = str(fd, "tier");
    const { error } = await supabase
      .from("about_admins")
      .update({
        name: str(fd, "name"),
        role: str(fd, "role"),
        bio: str(fd, "bio") || null,
        avatar_url: str(fd, "avatar_url") || null,
        tier: tierStr === "" ? 1 : Number(tierStr),
        order_index: Number(str(fd, "order_index")) || 0,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAbout();
  },
  moveAboutAdmin: async (fd, supabase) => {
    await swapOrder(supabase, "about_admins", fd, revalidateAbout);
  },
  deleteAboutAdmin: async (fd, supabase) => {
    const { error } = await supabase.from("about_admins").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateAbout();
  },

  // ── Comunidad: logros (hazañas con imágenes y vídeos) ──
  createAchievement: async (fd, supabase) => {
    const title = str(fd, "title");
    if (!title) throw new Error("Falta el título");
    const { error } = await supabase.from("community_achievements").insert({
      title,
      description: str(fd, "description") || null,
      game: str(fd, "game") || null,
      author_name: str(fd, "author_name") || null,
      author_avatar: str(fd, "author_avatar") || null,
      achieved_on: str(fd, "achieved_on") || null,
      images: parseImages(str(fd, "images")),
      videos: parseImages(str(fd, "videos")),
      accent: str(fd, "accent") || "#7c5cff",
    });
    if (error) throw new Error(error.message);
    revalidateCommunity();
  },
  updateAchievement: async (fd, supabase) => {
    const { error } = await supabase
      .from("community_achievements")
      .update({
        title: str(fd, "title"),
        description: str(fd, "description") || null,
        game: str(fd, "game") || null,
        author_name: str(fd, "author_name") || null,
        author_avatar: str(fd, "author_avatar") || null,
        achieved_on: str(fd, "achieved_on") || null,
        images: parseImages(str(fd, "images")),
        videos: parseImages(str(fd, "videos")),
        accent: str(fd, "accent") || "#7c5cff",
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateCommunity();
  },
  setAchievementPublished: async (fd, supabase) => {
    const { error } = await supabase
      .from("community_achievements")
      .update({ is_published: str(fd, "value") === "true" })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateCommunity();
  },
  deleteAchievement: async (fd, supabase) => {
    const { error } = await supabase.from("community_achievements").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateCommunity();
  },

  // ── Comunidad: mejores jugadores ──
  createTopPlayer: async (fd, supabase) => {
    const name = str(fd, "name");
    if (!name) throw new Error("Falta el nombre");
    const { error } = await supabase.from("community_top_players").insert({
      name,
      role: str(fd, "role") || null,
      achievement: str(fd, "achievement") || null,
      avatar_url: str(fd, "avatar_url") || null,
      accent: str(fd, "accent") || "#22e0ff",
      order_index: Number(str(fd, "order_index")) || 0,
    });
    if (error) throw new Error(error.message);
    revalidateCommunity();
  },
  updateTopPlayer: async (fd, supabase) => {
    const { error } = await supabase
      .from("community_top_players")
      .update({
        name: str(fd, "name"),
        role: str(fd, "role") || null,
        achievement: str(fd, "achievement") || null,
        avatar_url: str(fd, "avatar_url") || null,
        accent: str(fd, "accent") || "#22e0ff",
        order_index: Number(str(fd, "order_index")) || 0,
      })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateCommunity();
  },
  setTopPlayerPublished: async (fd, supabase) => {
    const { error } = await supabase
      .from("community_top_players")
      .update({ is_published: str(fd, "value") === "true" })
      .eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateCommunity();
  },
  moveTopPlayer: async (fd, supabase) => {
    await swapOrder(supabase, "community_top_players", fd, revalidateCommunity);
  },
  deleteTopPlayer: async (fd, supabase) => {
    const { error } = await supabase.from("community_top_players").delete().eq("id", str(fd, "id"));
    if (error) throw new Error(error.message);
    revalidateCommunity();
  },
};

// ── gate: ejecutar directo (Supremo) o encolar para aprobación ────
async function gate(
  key: string,
  fd: FormData,
  label: string,
  opts?: { requirePublisher?: boolean }
): Promise<{ executed: boolean }> {
  const ctx = await getStaffClient();
  if (opts?.requirePublisher && !PUBLISHERS.includes(ctx.rank)) {
    throw new Error("Tu rango no puede realizar esta acción.");
  }
  if (ctx.rank === "supremo") {
    await EXECUTORS[key](fd, ctx.supabase);
    await setFlash("Cambios guardados", "ok");
    return { executed: true };
  }
  // Admin / Moderador → queda pendiente de aprobación del Supremo.
  const { error } = await ctx.supabase.from("change_requests").insert({
    author_id: ctx.userId,
    action_key: key,
    payload: fdToJson(fd),
    label,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
  await setFlash("Enviado al Supremo para aprobación", "pending");
  return { executed: false };
}

// ════════════════════════════════════════════════════════════════
// Server Actions públicas (las que llaman los formularios). Cada una
// delega en `gate` con una etiqueta legible para la bandeja.
// ════════════════════════════════════════════════════════════════

// Juegos
export async function createGame(fd: FormData) {
  await gate("createGame", fd, `Crear juego: ${str(fd, "name") || "(nuevo)"}`);
}
export async function updateGame(fd: FormData) {
  await gate("updateGame", fd, `Editar juego: ${str(fd, "name")}`);
}
export async function setGamePublished(fd: FormData) {
  const pub = str(fd, "value") === "true";
  await gate("setGamePublished", fd, `${pub ? "Publicar" : "Despublicar"} un juego`, { requirePublisher: true });
}
export async function deleteGame(fd: FormData) {
  const { executed } = await gate("deleteGame", fd, "Eliminar un juego (y todo su contenido)", { requirePublisher: true });
  if (executed) redirect("/admin");
}

// Guías
export async function createGuide(fd: FormData) {
  await gate("createGuide", fd, `Crear guía: ${str(fd, "title") || "(nueva)"}`);
}
export async function updateGuide(fd: FormData) {
  await gate("updateGuide", fd, `Editar guía: ${str(fd, "title")}`);
}
export async function setGuidePublished(fd: FormData) {
  const pub = str(fd, "value") === "true";
  await gate("setGuidePublished", fd, `${pub ? "Publicar" : "Despublicar"} una guía`, { requirePublisher: true });
}
export async function deleteGuide(fd: FormData) {
  const gameId = str(fd, "game_id");
  const { executed } = await gate("deleteGuide", fd, "Eliminar una guía (y sus pasos)", { requirePublisher: true });
  if (executed && gameId) redirect(`/admin/juegos/${gameId}`);
}

// Pasos
export async function createStep(fd: FormData) {
  await gate("createStep", fd, `Añadir paso: ${str(fd, "title") || "(nuevo)"}`);
}
export async function updateStep(fd: FormData) {
  await gate("updateStep", fd, `Editar paso: ${str(fd, "title")}`);
}
export async function moveStep(fd: FormData) {
  await gate("moveStep", fd, "Reordenar pasos de una guía");
}
export async function deleteStep(fd: FormData) {
  await gate("deleteStep", fd, "Eliminar un paso");
}

// Secciones
export async function createSection(fd: FormData) {
  await gate("createSection", fd, `Crear sección: ${str(fd, "title") || "(nueva)"}`);
}
export async function updateSection(fd: FormData) {
  await gate("updateSection", fd, `Editar sección: ${str(fd, "title")}`);
}
export async function setSectionPublished(fd: FormData) {
  const pub = str(fd, "value") === "true";
  await gate("setSectionPublished", fd, `${pub ? "Mostrar" : "Ocultar"} una sección`, { requirePublisher: true });
}
export async function publishAllContent(fd: FormData) {
  await gate("publishAllContent", fd, "Mostrar al público TODO el contenido de un juego", { requirePublisher: true });
}
export async function deleteSection(fd: FormData) {
  const gameId = str(fd, "game_id");
  const { executed } = await gate("deleteSection", fd, "Eliminar una sección (y sus bloques)", { requirePublisher: true });
  if (executed && gameId) redirect(`/admin/juegos/${gameId}`);
}

// Bloques
export async function createBlock(fd: FormData) {
  await gate("createBlock", fd, `Añadir bloque: ${str(fd, "title") || "(nuevo)"}`);
}
export async function updateBlock(fd: FormData) {
  await gate("updateBlock", fd, `Editar bloque: ${str(fd, "title")}`);
}
export async function moveBlock(fd: FormData) {
  await gate("moveBlock", fd, "Reordenar bloques de una sección");
}
export async function deleteBlock(fd: FormData) {
  await gate("deleteBlock", fd, "Eliminar un bloque");
}

// Próximos juegos
export async function createUpcomingGame(fd: FormData) {
  await gate("createUpcomingGame", fd, `Crear próximo juego: ${str(fd, "name") || "(nuevo)"}`, { requirePublisher: true });
}
export async function updateUpcomingGame(fd: FormData) {
  await gate("updateUpcomingGame", fd, `Editar próximo juego: ${str(fd, "name")}`, { requirePublisher: true });
}
export async function moveUpcomingGame(fd: FormData) {
  await gate("moveUpcomingGame", fd, "Reordenar próximos juegos", { requirePublisher: true });
}
export async function deleteUpcomingGame(fd: FormData) {
  await gate("deleteUpcomingGame", fd, "Eliminar un próximo juego", { requirePublisher: true });
}

// MMORPG en el horizonte
export async function createPreRegisterGame(fd: FormData) {
  await gate("createPreRegisterGame", fd, `Crear MMORPG: ${str(fd, "name") || "(nuevo)"}`, { requirePublisher: true });
}
export async function updatePreRegisterGame(fd: FormData) {
  await gate("updatePreRegisterGame", fd, `Editar MMORPG: ${str(fd, "name")}`, { requirePublisher: true });
}
export async function movePreRegisterGame(fd: FormData) {
  await gate("movePreRegisterGame", fd, "Reordenar MMORPG en el horizonte", { requirePublisher: true });
}
export async function deletePreRegisterGame(fd: FormData) {
  await gate("deletePreRegisterGame", fd, "Eliminar un MMORPG de la lista", { requirePublisher: true });
}

// Nosotros
export async function updateAboutIntro(fd: FormData) {
  await gate("updateAboutIntro", fd, "Editar la descripción de Nosotros", { requirePublisher: true });
}
export async function createTimelineItem(fd: FormData) {
  await gate("createTimelineItem", fd, `Añadir hito: ${str(fd, "title") || "(nuevo)"}`, { requirePublisher: true });
}
export async function updateTimelineItem(fd: FormData) {
  await gate("updateTimelineItem", fd, `Editar hito: ${str(fd, "title")}`, { requirePublisher: true });
}
export async function moveTimelineItem(fd: FormData) {
  await gate("moveTimelineItem", fd, "Reordenar la historia", { requirePublisher: true });
}
export async function deleteTimelineItem(fd: FormData) {
  await gate("deleteTimelineItem", fd, "Eliminar un hito de la historia", { requirePublisher: true });
}
export async function createAboutAdmin(fd: FormData) {
  await gate("createAboutAdmin", fd, `Añadir administrador: ${str(fd, "name") || "(nuevo)"}`, { requirePublisher: true });
}
export async function updateAboutAdmin(fd: FormData) {
  await gate("updateAboutAdmin", fd, `Editar administrador: ${str(fd, "name")}`, { requirePublisher: true });
}
export async function moveAboutAdmin(fd: FormData) {
  await gate("moveAboutAdmin", fd, "Reordenar administradores", { requirePublisher: true });
}
export async function deleteAboutAdmin(fd: FormData) {
  await gate("deleteAboutAdmin", fd, "Eliminar un administrador", { requirePublisher: true });
}

// Comunidad — logros
export async function createAchievement(fd: FormData) {
  await gate("createAchievement", fd, `Crear logro: ${str(fd, "title") || "(nuevo)"}`, { requirePublisher: true });
}
export async function updateAchievement(fd: FormData) {
  await gate("updateAchievement", fd, `Editar logro: ${str(fd, "title")}`, { requirePublisher: true });
}
export async function setAchievementPublished(fd: FormData) {
  const pub = str(fd, "value") === "true";
  await gate("setAchievementPublished", fd, `${pub ? "Mostrar" : "Ocultar"} un logro`, { requirePublisher: true });
}
export async function deleteAchievement(fd: FormData) {
  await gate("deleteAchievement", fd, "Eliminar un logro", { requirePublisher: true });
}

// Comunidad — mejores jugadores
export async function createTopPlayer(fd: FormData) {
  await gate("createTopPlayer", fd, `Añadir jugador top: ${str(fd, "name") || "(nuevo)"}`, { requirePublisher: true });
}
export async function updateTopPlayer(fd: FormData) {
  await gate("updateTopPlayer", fd, `Editar jugador top: ${str(fd, "name")}`, { requirePublisher: true });
}
export async function setTopPlayerPublished(fd: FormData) {
  const pub = str(fd, "value") === "true";
  await gate("setTopPlayerPublished", fd, `${pub ? "Mostrar" : "Ocultar"} un jugador top`, { requirePublisher: true });
}
export async function moveTopPlayer(fd: FormData) {
  await gate("moveTopPlayer", fd, "Reordenar mejores jugadores", { requirePublisher: true });
}
export async function deleteTopPlayer(fd: FormData) {
  await gate("deleteTopPlayer", fd, "Quitar a un jugador top", { requirePublisher: true });
}

// ════════════════════════════════════════════════════════════════
// Bandeja de aprobación — solo el Supremo
// ════════════════════════════════════════════════════════════════
async function requireSupremoCtx() {
  const ctx = await getStaffClient();
  if (ctx.rank !== "supremo") throw new Error("Solo el Supremo puede revisar cambios.");
  return ctx;
}

export async function approveChange(fd: FormData) {
  const ctx = await requireSupremoCtx();
  const id = str(fd, "id");
  const { data: cr } = await ctx.supabase
    .from("change_requests")
    .select("action_key, payload, status")
    .eq("id", id)
    .maybeSingle();
  if (!cr || cr.status !== "pending") throw new Error("Esa solicitud ya no está pendiente.");
  const exec = EXECUTORS[cr.action_key as string];
  if (!exec) throw new Error(`Acción desconocida: ${cr.action_key}`);
  // El Supremo la ejecuta con sus permisos completos.
  await exec(jsonToFd(cr.payload as Record<string, string>), ctx.supabase);
  await ctx.supabase
    .from("change_requests")
    .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewer_id: ctx.userId })
    .eq("id", id);
  revalidatePath("/admin", "layout");
  await setFlash("Cambio aprobado y aplicado", "ok");
}

export async function rejectChange(fd: FormData) {
  const ctx = await requireSupremoCtx();
  const { error } = await ctx.supabase
    .from("change_requests")
    .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewer_id: ctx.userId })
    .eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
  await setFlash("Cambio rechazado", "ok");
}

// ── Usuarios (rangos) — solo el Supremo, directo (no pasa por la cola) ──
const ASSIGNABLE_RANKS = ["admin", "moderador", "tester", "user"];

export async function setUserRole(fd: FormData) {
  const ctx = await getStaffClient();
  if (ctx.rank !== "supremo") throw new Error("Solo el Supremo puede cambiar rangos.");
  const targetId = str(fd, "id");
  const role = str(fd, "role");
  if (!ASSIGNABLE_RANKS.includes(role)) throw new Error("Rango no válido");
  if (targetId === ctx.userId) throw new Error("No puedes cambiar tu propio rango de Supremo.");
  const { error } = await ctx.supabase.from("profiles").update({ role }).eq("id", targetId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
  await setFlash("Rango actualizado", "ok");
}
