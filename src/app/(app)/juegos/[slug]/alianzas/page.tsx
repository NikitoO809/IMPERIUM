// Alianzas de un juego: /juegos/[slug]/alianzas. Tarjetas de grupos para entrar
// juntos. Todos las ven; solo donantes (Veterano+) crean; cualquiera logueado se
// une. Dueño/staff borran. Seguridad real en RLS. Ruta estática → prioritaria.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getGameMeta } from "@/lib/games";
import { getAlliances, getMyAllianceIds } from "@/lib/alliances";
import { getViewerRank } from "@/lib/assistant";
import { createClient } from "@/lib/supabase/server";
import { canParticipate, isStaff, type Rank } from "@/lib/ranks";
import { RankBadge } from "@/components/RankBadge";
import { HudLabel } from "@/components/hud";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  return { title: game ? `Alianzas — ${game.name}` : "Alianzas" };
}

export default async function AlliancesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) notFound();

  const [alliances, mine, viewer] = await Promise.all([
    getAlliances(slug),
    getMyAllianceIds(),
    getViewerRank(),
  ]);
  const viewerRank: Rank | null = viewer?.rank ?? null;
  const canCreate = viewerRank ? canParticipate(viewerRank) : false;
  const isModerator = viewerRank ? isStaff(viewerRank) : false;
  const isLogged = Boolean(viewer);

  // Crear alianza (RLS: donante + autoría). El dueño entra como primer miembro.
  async function create(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim().slice(0, 60);
    const description = String(formData.get("description") ?? "").trim().slice(0, 500);
    if (name.length < 2) return;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: created } = await supabase
      .from("alliances")
      .insert({ game_slug: slug, name, description: description || null, owner_id: user.id })
      .select("id")
      .maybeSingle();
    const id = (created as { id: string } | null)?.id;
    if (id) await supabase.from("alliance_members").insert({ alliance_id: id, user_id: user.id });
    revalidatePath(`/juegos/${slug}/alianzas`);
  }

  async function join(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("alliance_members").insert({ alliance_id: id, user_id: user.id });
    revalidatePath(`/juegos/${slug}/alianzas`);
  }

  async function leave(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("alliance_members").delete().eq("alliance_id", id).eq("user_id", user.id);
    revalidatePath(`/juegos/${slug}/alianzas`);
  }

  async function remove(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("alliances").delete().eq("id", id);
    revalidatePath(`/juegos/${slug}/alianzas`);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">Alianzas</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        Alianzas
      </h1>
      <p className="mt-2 mb-6 max-w-xl text-sm text-white/55">
        Grupos para entrar juntos a {game.name}. Todos las ven; los donantes las crean; cualquiera se une.
      </p>

      {/* crear (donante) o bloqueo */}
      {canCreate ? (
        <form action={create} className="panel">
          <div className="panel-inner space-y-3 p-4">
            <input
              type="text"
              name="name"
              required
              minLength={2}
              maxLength={60}
              placeholder="Nombre de la alianza"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none"
            />
            <textarea
              name="description"
              rows={2}
              maxLength={500}
              placeholder="¿Qué busca tu alianza? (PvE, PvP, idioma, requisitos…)"
              className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none"
            />
            <div className="flex justify-end">
              <button type="submit" className="btn-hud">Crear alianza</button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
          <span className="text-2xl">🔒</span>
          <p className="flex-1 text-sm text-white/75">
            Crear alianzas es para <b className="text-amber-300">Veteranos</b> o superior.
            Unirte a las que ya existen es gratis.
          </p>
          <Link href="/apoyar" className="btn-hud whitespace-nowrap">Apoyar</Link>
        </div>
      )}

      {/* lista */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {alliances.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-white/40">
            Aún no hay alianzas. {canCreate ? "¡Crea la primera!" : "Vuelve pronto."}
          </p>
        ) : (
          alliances.map((a) => {
            const isMember = mine.has(a.id);
            const canDelete = viewer?.userId === a.ownerId || isModerator;
            return (
              <div key={a.id} className="panel">
                <div className="panel-inner flex h-full flex-col p-5">
                  <h3 className="font-title text-base font-bold text-white">{a.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
                    <span>por</span>
                    <Link href={`/u/${a.ownerId}`} className="text-white/70 transition hover:text-accent">
                      {a.ownerName}
                    </Link>
                    <RankBadge rank={a.ownerRank} className="!px-1.5 !py-0.5 !text-[9px]" />
                  </div>
                  {a.description && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">{a.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/50">👥 {a.memberCount} miembros</span>
                    <div className="flex items-center gap-2">
                      {canDelete && (
                        <form action={remove}>
                          <input type="hidden" name="id" value={a.id} />
                          <button type="submit" className="text-xs text-white/35 transition hover:text-red-400">
                            Borrar
                          </button>
                        </form>
                      )}
                      {isLogged ? (
                        isMember ? (
                          <form action={leave}>
                            <input type="hidden" name="id" value={a.id} />
                            <button type="submit" className="btn-ghost !py-1.5 !text-xs">Salir</button>
                          </form>
                        ) : (
                          <form action={join}>
                            <input type="hidden" name="id" value={a.id} />
                            <button type="submit" className="btn-hud !py-1.5 !text-xs">Unirme</button>
                          </form>
                        )
                      ) : (
                        <span className="text-xs text-white/35">Entra para unirte</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
