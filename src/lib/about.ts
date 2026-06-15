// Capa de datos de la sección "Nosotros" (lado servidor).
// Lectura pública (RLS lo permite a todos); la escritura va por las server
// actions del admin. Si Supabase no está configurado o no hay filas, las
// páginas usan sus textos de ejemplo como fallback.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export type TimelineItem = {
  id: string;
  orderIndex: number;
  year: string;
  title: string;
  description: string | null;
};

export type AdminMember = {
  id: string;
  orderIndex: number;
  name: string;
  role: string;
  bio: string | null;
  avatarUrl: string | null;
};

export type AboutContent = {
  intro: string | null;
  timeline: TimelineItem[];
  admins: AdminMember[];
};

// Contenido completo de la página "Nosotros". Devuelve null si Supabase no
// está configurado (la página usará su fallback estático).
export async function getAboutContent(): Promise<AboutContent | null> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();

  const [pageRes, timelineRes, adminsRes] = await Promise.all([
    supabase.from("about_page").select("intro").eq("id", 1).maybeSingle(),
    supabase
      .from("about_timeline")
      .select("id, order_index, year, title, description")
      .order("order_index"),
    supabase
      .from("about_admins")
      .select("id, order_index, name, role, bio, avatar_url")
      .order("order_index"),
  ]);

  const timeline = (timelineRes.data ?? []).map((t) => ({
    id: t.id,
    orderIndex: t.order_index,
    year: t.year,
    title: t.title,
    description: t.description,
  }));

  const admins = (adminsRes.data ?? []).map((a) => ({
    id: a.id,
    orderIndex: a.order_index,
    name: a.name,
    role: a.role,
    bio: a.bio,
    avatarUrl: a.avatar_url,
  }));

  return {
    intro: (pageRes.data as { intro: string | null } | null)?.intro ?? null,
    timeline,
    admins,
  };
}
