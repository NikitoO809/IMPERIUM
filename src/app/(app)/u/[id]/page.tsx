// Perfil PÚBLICO de un miembro: /u/[id]. Lo ve cualquiera (también sin login).
// Muestra avatar, nombre, rango (badge con color) y su frase. El dueño puede
// editar su frase aquí mismo. Está dentro de (app): NO añade header/footer.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPublicProfile, getCurrentUserId } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";
import { RankBadge } from "@/components/RankBadge";
import { RANK_LABEL, isDonor, type Rank } from "@/lib/ranks";
import { HudLabel } from "@/components/hud";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await getPublicProfile(id);
  if (!profile) return { title: "Perfil" };
  return {
    title: `${profile.username} · ${RANK_LABEL[profile.rank]}`,
    description: profile.tagline ?? `Perfil de ${profile.username} en IMPERIUM.`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getPublicProfile(id);
  if (!profile) notFound();

  const viewerId = await getCurrentUserId();
  const isOwner = viewerId === profile.id;
  const donor = isDonor(profile.rank);

  const since = new Date(profile.createdAt).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  const initials = profile.username.slice(0, 2).toUpperCase();

  // Editar la propia frase (RLS: cada uno solo edita su perfil).
  async function updateTagline(formData: FormData) {
    "use server";
    const tagline = String(formData.get("tagline") ?? "").trim().slice(0, 140);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ tagline }).eq("id", user.id);
    revalidatePath(`/u/${user.id}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-16">
      <HudLabel>Perfil</HudLabel>

      <div className="mt-4 panel">
        <div className="panel-inner p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
            {/* avatar */}
            <div
              className={`grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-black/40 ring-2 ${
                donor ? "ring-amber-400/50 shadow-[0_0_28px_-4px_rgba(232,181,77,.5)]" : "ring-white/15"
              }`}
            >
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.username} className="h-full w-full object-cover" />
              ) : (
                <span className="font-title text-2xl font-extrabold text-white/70">{initials}</span>
              )}
            </div>

            {/* identidad */}
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
                  {profile.username}
                </h1>
                <RankBadge rank={profile.rank} />
              </div>
              {profile.tagline ? (
                <p className="mt-2 text-sm italic text-white/70">&ldquo;{profile.tagline}&rdquo;</p>
              ) : (
                <p className="mt-2 text-sm text-white/35">Sin frase todavía.</p>
              )}
              <p className="mt-2 text-xs text-white/45">Miembro desde {since}</p>
            </div>
          </div>

          {/* editar la propia frase */}
          {isOwner && (
            <form action={updateTagline} className="mt-6 border-t border-white/10 pt-5">
              <label className="hud-label text-[10px] text-white/50">Tu frase</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  name="tagline"
                  maxLength={140}
                  defaultValue={profile.tagline ?? ""}
                  placeholder="Ej: Aquí destrozamos dragones."
                  className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none"
                />
                <button type="submit" className="btn-hud whitespace-nowrap">
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* secciones futuras (alianzas, actividad) — se rellenarán en su fase */}
      <p className="mt-6 text-center text-xs text-white/30">
        Pronto: juegos que sigue, alianzas y actividad reciente.
      </p>
    </main>
  );
}
