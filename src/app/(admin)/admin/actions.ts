"use server";

// Server Actions del panel de admin. Cada acción comprueba que el usuario
// es admin (además, las políticas RLS lo refuerzan en la base de datos).
// Tras escribir, se revalidan las rutas afectadas.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ── Utilidades ───────────────────────────────────────────────────
const STAFF = ["supremo", "admin", "moderador"];
const PUBLISHERS = ["supremo", "admin"];

// Cliente Supabase + rango del usuario actual. Exige ser staff.
// Las políticas RLS y los triggers refuerzan los límites en la base de datos.
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

// Compat: la mayoría de acciones solo necesitan el cliente.
async function getAdminClient() {
  const { supabase } = await getStaffClient();
  return supabase;
}

// Exige permiso de publicación (supremo/admin). Lanza si es moderador.
async function requirePublisherAction() {
  const ctx = await getStaffClient();
  if (!PUBLISHERS.includes(ctx.rank)) {
    throw new Error("Tu rango no puede realizar esta acción. Pídeselo a un administrador.");
  }
  return ctx;
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
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function revalidateAll() {
  revalidatePath("/admin", "layout");
  revalidatePath("/juegos", "layout");
  revalidatePath("/comunidad");
}

// Refresca el panel y la página pública de "Nosotros".
function revalidateAbout() {
  revalidatePath("/admin/nosotros");
  revalidatePath("/nosotros");
}

// Refresca el panel y la home (donde se muestran los próximos juegos).
function revalidateUpcoming() {
  revalidatePath("/admin/proximos");
  revalidatePath("/");
}

// Convierte un color hex (#7c5cff) a entero decimal; admite ya-entero.
function hexToInt(raw: string): number {
  const v = raw.trim().replace(/^#/, "");
  const n = parseInt(v, 16);
  return Number.isFinite(n) ? n : 0x7c5cff;
}

// ── Juegos ───────────────────────────────────────────────────────
export async function createGame(fd: FormData) {
  const supabase = await getAdminClient();
  const name = str(fd, "name");
  if (!name) throw new Error("Falta el nombre");
  const slug = slugify(str(fd, "slug") || name);
  const { error } = await supabase.from("games").insert({
    name,
    slug,
    description: str(fd, "description") || null,
    is_published: false,
  });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateGame(fd: FormData) {
  const supabase = await getAdminClient();
  const id = str(fd, "id");
  const { error } = await supabase
    .from("games")
    .update({
      name: str(fd, "name"),
      slug: slugify(str(fd, "slug")),
      description: str(fd, "description") || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function setGamePublished(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const { error } = await supabase
    .from("games")
    .update({ is_published: str(fd, "value") === "true" })
    .eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const { error } = await supabase.from("games").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin");
}

// ── Guías ────────────────────────────────────────────────────────
export async function createGuide(fd: FormData) {
  const supabase = await getAdminClient();
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
}

export async function updateGuide(fd: FormData) {
  const supabase = await getAdminClient();
  // Imagen de portada + adicionales se combinan en intro_images
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
}

export async function setGuidePublished(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const { error } = await supabase
    .from("guides")
    .update({ is_published: str(fd, "value") === "true" })
    .eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteGuide(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const gameId = str(fd, "game_id");
  const { error } = await supabase.from("guides").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
  if (gameId) redirect(`/admin/juegos/${gameId}`);
}

// ── Pasos de guía ─────────────────────────────────────────────────
export async function createStep(fd: FormData) {
  const supabase = await getAdminClient();
  const guideId = str(fd, "guide_id");
  const title = str(fd, "title");
  if (!guideId || !title) throw new Error("Faltan datos");
  // Imagen principal + adicionales
  const mainImage = str(fd, "main_image");
  const extraImages = parseImages(str(fd, "extra_images"));
  const images = [mainImage, ...extraImages].filter(Boolean);
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
}

export async function updateStep(fd: FormData) {
  const supabase = await getAdminClient();
  const mainImage = str(fd, "main_image");
  const extraImages = parseImages(str(fd, "extra_images"));
  const images = [mainImage, ...extraImages].filter(Boolean);
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
}

export async function moveStep(fd: FormData) {
  const supabase = await getAdminClient();
  const id = str(fd, "id");
  const direction = str(fd, "direction") as "up" | "down";
  const guideId = str(fd, "guide_id");

  const { data: allSteps } = await supabase
    .from("guide_steps")
    .select("id, order_index")
    .eq("guide_id", guideId)
    .order("order_index");

  if (!allSteps) return;
  const idx = allSteps.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const adjIdx = direction === "up" ? idx - 1 : idx + 1;
  if (adjIdx < 0 || adjIdx >= allSteps.length) return;

  const cur = allSteps[idx];
  const adj = allSteps[adjIdx];
  await supabase.from("guide_steps").update({ order_index: adj.order_index }).eq("id", cur.id);
  await supabase.from("guide_steps").update({ order_index: cur.order_index }).eq("id", adj.id);
  revalidateAll();
}

export async function setStepVerified(fd: FormData) {
  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("guide_steps")
    .update({ is_verified: str(fd, "value") === "true" })
    .eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteStep(fd: FormData) {
  const supabase = await getAdminClient();
  const { error } = await supabase.from("guide_steps").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

// ── Secciones genéricas ──────────────────────────────────────────
export async function createSection(fd: FormData) {
  const supabase = await getAdminClient();
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
}

export async function updateSection(fd: FormData) {
  const supabase = await getAdminClient();
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
}

export async function deleteSection(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const gameId = str(fd, "game_id");
  const { error } = await supabase.from("game_sections").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
  if (gameId) redirect(`/admin/juegos/${gameId}`);
}

// ── Bloques de sección ───────────────────────────────────────────
export async function createBlock(fd: FormData) {
  const supabase = await getAdminClient();
  const sectionId = str(fd, "section_id");
  const title = str(fd, "title");
  if (!sectionId || !title) throw new Error("Faltan datos");
  const mainImage = str(fd, "main_image");
  const extraImages = parseImages(str(fd, "extra_images"));
  const images = [mainImage, ...extraImages].filter(Boolean);
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
}

export async function updateBlock(fd: FormData) {
  const supabase = await getAdminClient();
  const mainImage = str(fd, "main_image");
  const extraImages = parseImages(str(fd, "extra_images"));
  const images = [mainImage, ...extraImages].filter(Boolean);
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
}

export async function moveBlock(fd: FormData) {
  const supabase = await getAdminClient();
  const id = str(fd, "id");
  const direction = str(fd, "direction") as "up" | "down";
  const sectionId = str(fd, "section_id");

  const { data: allBlocks } = await supabase
    .from("section_blocks")
    .select("id, order_index")
    .eq("section_id", sectionId)
    .order("order_index");

  if (!allBlocks) return;
  const idx = allBlocks.findIndex((b) => b.id === id);
  if (idx === -1) return;
  const adjIdx = direction === "up" ? idx - 1 : idx + 1;
  if (adjIdx < 0 || adjIdx >= allBlocks.length) return;

  const cur = allBlocks[idx];
  const adj = allBlocks[adjIdx];
  await supabase.from("section_blocks").update({ order_index: adj.order_index }).eq("id", cur.id);
  await supabase.from("section_blocks").update({ order_index: cur.order_index }).eq("id", adj.id);
  revalidateAll();
}

export async function deleteBlock(fd: FormData) {
  const supabase = await getAdminClient();
  const { error } = await supabase.from("section_blocks").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

// ── Próximos juegos (home) — solo publishers (admin/supremo) ─────
export async function createUpcomingGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const name = str(fd, "name");
  if (!name) throw new Error("Falta el nombre");
  // El key se genera del nombre y queda fijo (enlaza con las suscripciones).
  const key = slugify(str(fd, "key") || name);
  const { error } = await supabase.from("upcoming_games").insert({
    key,
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
}

export async function updateUpcomingGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  // OJO: no cambiamos `key` (rompería el contador de suscripciones).
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
}

export async function moveUpcomingGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const id = str(fd, "id");
  const direction = str(fd, "direction") as "up" | "down";
  const { data: all } = await supabase
    .from("upcoming_games")
    .select("id, order_index")
    .order("order_index");
  if (!all) return;
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  const adjIdx = direction === "up" ? idx - 1 : idx + 1;
  if (adjIdx < 0 || adjIdx >= all.length) return;
  const cur = all[idx];
  const adj = all[adjIdx];
  await supabase.from("upcoming_games").update({ order_index: adj.order_index }).eq("id", cur.id);
  await supabase.from("upcoming_games").update({ order_index: cur.order_index }).eq("id", adj.id);
  revalidateUpcoming();
}

export async function deleteUpcomingGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const { error } = await supabase.from("upcoming_games").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateUpcoming();
}

// ── MMORPG en el horizonte (más esperados) — solo publishers ─────
function revalidateHorizon() {
  revalidatePath("/admin/horizonte");
  revalidatePath("/");
}

// Texto separado por comas -> array (plataformas).
function parseCsv(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

// Lee el "hype" como número (admite coma decimal) o null si vacío.
function parseHype(raw: string): number | null {
  const v = raw.trim().replace(",", ".");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function createPreRegisterGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const name = str(fd, "name");
  if (!name) throw new Error("Falta el nombre");
  const key = slugify(str(fd, "key") || name);
  const { error } = await supabase.from("preregister_games").insert({
    key,
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
}

export async function updatePreRegisterGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  // No cambiamos `key` (estable).
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
}

export async function movePreRegisterGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const id = str(fd, "id");
  const direction = str(fd, "direction") as "up" | "down";
  const { data: all } = await supabase
    .from("preregister_games")
    .select("id, order_index")
    .order("order_index");
  if (!all) return;
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  const adjIdx = direction === "up" ? idx - 1 : idx + 1;
  if (adjIdx < 0 || adjIdx >= all.length) return;
  const cur = all[idx];
  const adj = all[adjIdx];
  await supabase.from("preregister_games").update({ order_index: adj.order_index }).eq("id", cur.id);
  await supabase.from("preregister_games").update({ order_index: cur.order_index }).eq("id", adj.id);
  revalidateHorizon();
}

export async function deletePreRegisterGame(fd: FormData) {
  const { supabase } = await requirePublisherAction();
  const { error } = await supabase.from("preregister_games").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateHorizon();
}

// ── Usuarios (rangos) — solo el Supremo ──────────────────────────
const ASSIGNABLE_RANKS = ["admin", "moderador", "user"];

export async function setUserRole(fd: FormData) {
  // Solo el Supremo gestiona rangos (el trigger de la BD lo refuerza).
  const { supabase, userId } = await getStaffClient().then(async (ctx) => {
    if (ctx.rank !== "supremo") throw new Error("Solo el Supremo puede cambiar rangos.");
    return ctx;
  });

  const targetId = str(fd, "id");
  const role = str(fd, "role");
  if (!ASSIGNABLE_RANKS.includes(role)) throw new Error("Rango no válido");
  // El Supremo no puede cambiarse el rango a sí mismo (evita quedarse sin Supremo).
  if (targetId === userId) throw new Error("No puedes cambiar tu propio rango de Supremo.");

  const { error } = await supabase.from("profiles").update({ role }).eq("id", targetId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

// ── Nosotros: descripción general ────────────────────────────────
export async function updateAboutIntro(fd: FormData) {
  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("about_page")
    .upsert({ id: 1, intro: str(fd, "intro") || null, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  revalidateAbout();
}

// ── Nosotros: hitos de la historia ───────────────────────────────
export async function createTimelineItem(fd: FormData) {
  const supabase = await getAdminClient();
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
}

export async function updateTimelineItem(fd: FormData) {
  const supabase = await getAdminClient();
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
}

export async function moveTimelineItem(fd: FormData) {
  const supabase = await getAdminClient();
  const id = str(fd, "id");
  const direction = str(fd, "direction") as "up" | "down";

  const { data: all } = await supabase
    .from("about_timeline")
    .select("id, order_index")
    .order("order_index");
  if (!all) return;
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  const adjIdx = direction === "up" ? idx - 1 : idx + 1;
  if (adjIdx < 0 || adjIdx >= all.length) return;
  const cur = all[idx];
  const adj = all[adjIdx];
  await supabase.from("about_timeline").update({ order_index: adj.order_index }).eq("id", cur.id);
  await supabase.from("about_timeline").update({ order_index: cur.order_index }).eq("id", adj.id);
  revalidateAbout();
}

export async function deleteTimelineItem(fd: FormData) {
  const supabase = await getAdminClient();
  const { error } = await supabase.from("about_timeline").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAbout();
}

// ── Nosotros: administradores ────────────────────────────────────
export async function createAboutAdmin(fd: FormData) {
  const supabase = await getAdminClient();
  const name = str(fd, "name");
  const role = str(fd, "role");
  if (!name || !role) throw new Error("Faltan datos");
  const { error } = await supabase.from("about_admins").insert({
    name,
    role,
    bio: str(fd, "bio") || null,
    avatar_url: str(fd, "avatar_url") || null,
    order_index: Number(str(fd, "order_index")) || 0,
  });
  if (error) throw new Error(error.message);
  revalidateAbout();
}

export async function updateAboutAdmin(fd: FormData) {
  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("about_admins")
    .update({
      name: str(fd, "name"),
      role: str(fd, "role"),
      bio: str(fd, "bio") || null,
      avatar_url: str(fd, "avatar_url") || null,
      order_index: Number(str(fd, "order_index")) || 0,
    })
    .eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAbout();
}

export async function moveAboutAdmin(fd: FormData) {
  const supabase = await getAdminClient();
  const id = str(fd, "id");
  const direction = str(fd, "direction") as "up" | "down";

  const { data: all } = await supabase
    .from("about_admins")
    .select("id, order_index")
    .order("order_index");
  if (!all) return;
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  const adjIdx = direction === "up" ? idx - 1 : idx + 1;
  if (adjIdx < 0 || adjIdx >= all.length) return;
  const cur = all[idx];
  const adj = all[adjIdx];
  await supabase.from("about_admins").update({ order_index: adj.order_index }).eq("id", cur.id);
  await supabase.from("about_admins").update({ order_index: cur.order_index }).eq("id", adj.id);
  revalidateAbout();
}

export async function deleteAboutAdmin(fd: FormData) {
  const supabase = await getAdminClient();
  const { error } = await supabase.from("about_admins").delete().eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAbout();
}
