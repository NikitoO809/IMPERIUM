"use server";

// Acciones compartidas de la comunidad (discusión + alianzas), reutilizables
// tanto por los juegos jugables (/juegos/[slug]) como por los próximos
// (/proximos/[key]). La seguridad real vive en RLS; aquí solo se ejecuta la
// operación con la sesión del usuario. Cada formulario envía `gameSlug` y
// `basePath` (para revalidar la página correcta) en inputs ocultos.
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "");
}

// ── Discusión ──────────────────────────────────────────────
export async function publishPost(formData: FormData) {
  const gameSlug = str(formData, "gameSlug");
  const basePath = str(formData, "basePath") || "/";
  const body = str(formData, "body").trim().slice(0, 2000);
  if (!gameSlug || !body) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("discussion_posts").insert({ game_slug: gameSlug, user_id: user.id, body });
  revalidatePath(basePath);
}

export async function deletePost(formData: FormData) {
  const id = str(formData, "id");
  const basePath = str(formData, "basePath") || "/";
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("discussion_posts").delete().eq("id", id);
  revalidatePath(basePath);
}

// ── Alianzas ───────────────────────────────────────────────
export async function createAlliance(formData: FormData) {
  const gameSlug = str(formData, "gameSlug");
  const basePath = str(formData, "basePath") || "/";
  const name = str(formData, "name").trim().slice(0, 60);
  const description = str(formData, "description").trim().slice(0, 500);
  if (!gameSlug || name.length < 2) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: created } = await supabase
    .from("alliances")
    .insert({ game_slug: gameSlug, name, description: description || null, owner_id: user.id })
    .select("id")
    .maybeSingle();
  const id = (created as { id: string } | null)?.id;
  if (id) await supabase.from("alliance_members").insert({ alliance_id: id, user_id: user.id });
  revalidatePath(basePath);
}

export async function joinAlliance(formData: FormData) {
  const id = str(formData, "id");
  const basePath = str(formData, "basePath") || "/";
  if (!id) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("alliance_members").insert({ alliance_id: id, user_id: user.id });
  revalidatePath(basePath);
}

export async function leaveAlliance(formData: FormData) {
  const id = str(formData, "id");
  const basePath = str(formData, "basePath") || "/";
  if (!id) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("alliance_members").delete().eq("alliance_id", id).eq("user_id", user.id);
  revalidatePath(basePath);
}

export async function deleteAlliance(formData: FormData) {
  const id = str(formData, "id");
  const basePath = str(formData, "basePath") || "/";
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("alliances").delete().eq("id", id);
  revalidatePath(basePath);
}
