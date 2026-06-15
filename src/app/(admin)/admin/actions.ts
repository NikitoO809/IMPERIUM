"use server";

// Server Actions del panel de admin. Cada acción comprueba que el usuario
// es admin (además, las políticas RLS lo refuerzan en la base de datos).
// Tras escribir, se revalidan las rutas afectadas.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ── Utilidades ───────────────────────────────────────────────────
async function getAdminClient() {
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
  if (profile?.role !== "admin") throw new Error("No autorizado");
  return supabase;
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
  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("games")
    .update({ is_published: str(fd, "value") === "true" })
    .eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteGame(fd: FormData) {
  const supabase = await getAdminClient();
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
  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("guides")
    .update({ is_published: str(fd, "value") === "true" })
    .eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteGuide(fd: FormData) {
  const supabase = await getAdminClient();
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
  const supabase = await getAdminClient();
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

// ── Usuarios (roles) ─────────────────────────────────────────────
export async function setUserRole(fd: FormData) {
  const supabase = await getAdminClient();
  const role = str(fd, "role");
  if (role !== "admin" && role !== "user") throw new Error("Rol no válido");
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", str(fd, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
