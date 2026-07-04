// Muro de DISCUSIÓN reutilizable (juegos jugables y próximos). Todos leen; solo
// donantes (Veterano+) escriben. Recibe el slug del juego, su nombre y el
// basePath (para revalidar tras publicar/borrar). Seguridad real en RLS.
import Link from "next/link";
import { getDiscussion } from "@/lib/discussion";
import { getViewerRank } from "@/lib/assistant";
import { canParticipate, isStaff, RANK_LABEL, type Rank } from "@/lib/ranks";
import { RankBadge } from "@/components/RankBadge";
import { publishPost, deletePost } from "@/lib/community-actions";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

export async function DiscussionBoard({
  gameSlug,
  gameName,
  basePath,
}: {
  gameSlug: string;
  gameName: string;
  basePath: string;
}) {
  const [posts, viewer] = await Promise.all([getDiscussion(gameSlug), getViewerRank()]);
  const viewerRank: Rank | null = viewer?.rank ?? null;
  const canWrite = viewerRank ? canParticipate(viewerRank) : false;
  const isModerator = viewerRank ? isStaff(viewerRank) : false;

  return (
    <div>
      {canWrite ? (
        <form action={publishPost} className="panel">
          <div className="panel-inner p-4">
            <input type="hidden" name="gameSlug" value={gameSlug} />
            <input type="hidden" name="basePath" value={basePath} />
            <textarea
              name="body"
              rows={3}
              maxLength={2000}
              required
              placeholder={`Escribe algo sobre ${gameName}…`}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-white/40">
                Publicarás como {viewerRank ? RANK_LABEL[viewerRank] : ""}
              </span>
              <button type="submit" className="btn-hud bg-brand px-5 py-2 text-sm font-semibold text-white">Publicar</button>
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
          <Link href="/apoyar" className="btn-hud whitespace-nowrap bg-brand px-4 py-2 text-sm font-semibold text-white">Apoyar</Link>
        </div>
      )}

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
                      <form action={deletePost} className="ml-auto">
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="basePath" value={basePath} />
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
    </div>
  );
}
