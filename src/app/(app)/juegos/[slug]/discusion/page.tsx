// Discusión de un juego: /juegos/[slug]/discusion. Muro simple de mensajes.
// Todos leen (también sin login); solo donantes (Veterano+) escriben. La
// seguridad real vive en RLS; aquí decidimos qué UI mostrar. Ruta estática →
// Next la prioriza sobre la dinámica [seccion].
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getGameMeta } from "@/lib/games";
import { getDiscussion } from "@/lib/discussion";
import { getViewerRank } from "@/lib/assistant";
import { createClient } from "@/lib/supabase/server";
import { canParticipate, isStaff, RANK_LABEL, type Rank } from "@/lib/ranks";
import { RankBadge } from "@/components/RankBadge";
import { HudLabel } from "@/components/hud";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  return { title: game ? `Discusión — ${game.name}` : "Discusión" };
}

// "hace X" sencillo.
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

export default async function DiscussionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) notFound();

  const [posts, viewer] = await Promise.all([getDiscussion(slug), getViewerRank()]);
  const viewerRank: Rank | null = viewer?.rank ?? null;
  const canWrite = viewerRank ? canParticipate(viewerRank) : false;
  const isModerator = viewerRank ? isStaff(viewerRank) : false;

  // Publicar un mensaje (RLS exige donante + autoría).
  async function publish(formData: FormData) {
    "use server";
    const body = String(formData.get("body") ?? "").trim().slice(0, 2000);
    if (!body) return;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("discussion_posts").insert({ game_slug: slug, user_id: user.id, body });
    revalidatePath(`/juegos/${slug}/discusion`);
  }

  // Borrar un mensaje (RLS exige autor o staff).
  async function remove(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("discussion_posts").delete().eq("id", id);
    revalidatePath(`/juegos/${slug}/discusion`);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-16">
      {/* migas */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">Discusión</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        Discusión
      </h1>
      <p className="mt-2 mb-6 max-w-xl text-sm text-white/55">
        Pregunta, comenta y comparte sobre {game.name}. Todos pueden leer; los donantes escriben.
      </p>

      {/* composer (donante) o bloqueo (recluta / sin login) */}
      {canWrite ? (
        <form action={publish} className="panel">
          <div className="panel-inner p-4">
            <textarea
              name="body"
              rows={3}
              maxLength={2000}
              required
              placeholder={`Escribe algo sobre ${game.name}…`}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-white/40">
                Publicarás como {viewerRank ? RANK_LABEL[viewerRank] : ""}
              </span>
              <button type="submit" className="btn-hud">Publicar</button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
          <span className="text-2xl">🔒</span>
          <p className="flex-1 text-sm text-white/75">
            Para escribir necesitas ser <b className="text-amber-300">Veterano</b> o superior.
            Mirar es gratis; participar es de los nuestros.
          </p>
          <Link href="/apoyar" className="btn-hud whitespace-nowrap">Apoyar</Link>
        </div>
      )}

      {/* muro */}
      <div className="mt-8 flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/40">
            Aún no hay mensajes. {canWrite ? "¡Sé el primero!" : "Vuelve pronto."}
          </p>
        ) : (
          posts.map((p) => {
            const canDelete = viewer?.userId === p.authorId || isModerator;
            return (
              <div key={p.id} className="flex gap-3">
                <Link href={`/u/${p.authorId}`} className="shrink-0">
                  <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/15">
                    {p.authorAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.authorAvatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-white/60">
                        {p.authorName.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </span>
                </Link>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/u/${p.authorId}`}
                      className="text-sm font-bold text-white transition hover:text-accent"
                    >
                      {p.authorName}
                    </Link>
                    <RankBadge rank={p.authorRank} />
                    <span className="text-xs text-white/35">· {timeAgo(p.createdAt)}</span>
                    {canDelete && (
                      <form action={remove} className="ml-auto">
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="text-xs text-white/35 transition hover:text-red-400"
                          title="Borrar"
                        >
                          Borrar
                        </button>
                      </form>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-white/80">{p.body}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
