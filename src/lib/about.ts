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
  tier: number; // nivel en el organigrama: 0=Líder, 1=Administración, 2=Moderación
  name: string;
  role: string;
  bio: string | null;
  avatarUrl: string | null;
};

export type AboutContent = {
  intro: string | null;
  quote: string | null;   // frase destacada al cierre de la página
  games: string[];        // "Nuestro recorrido": juegos por los que ha pasado IMPERIUM
  timeline: TimelineItem[];
  admins: AdminMember[];
};

// Contenido completo de la página "Nosotros". Devuelve null si Supabase no
// está configurado (la página usará su fallback estático).
export async function getAboutContent(): Promise<AboutContent | null> {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();

  const [pageRes, timelineRes, adminsRes] = await Promise.all([
    supabase.from("about_page").select("intro, quote, games").eq("id", 1).maybeSingle(),
    supabase
      .from("about_timeline")
      .select("id, order_index, year, title, description")
      .order("order_index"),
    supabase
      .from("about_admins")
      .select("id, order_index, tier, name, role, bio, avatar_url")
      .order("tier")
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
    tier: (a as { tier: number | null }).tier ?? 1,
    name: a.name,
    role: a.role,
    bio: a.bio,
    avatarUrl: a.avatar_url,
  }));

  const page = pageRes.data as { intro: string | null; quote: string | null; games: string[] | null } | null;

  return {
    intro: page?.intro ?? null,
    quote: page?.quote ?? null,
    games: page?.games ?? [],
    timeline,
    admins,
  };
}
