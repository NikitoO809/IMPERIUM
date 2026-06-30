// Tarjetas de ALIANZAS reutilizables (juegos jugables y próximos). Todas se ven;
// solo donantes (Veterano+) crean; cualquiera logueado se une. Dueño/staff
// borran. Recibe slug, nombre y basePath. Seguridad real en RLS.
import Link from "next/link";
import { getAlliances, getMyAllianceIds } from "@/lib/alliances";
import { getViewerRank } from "@/lib/assistant";
import { canParticipate, isStaff, type Rank } from "@/lib/ranks";
import { RankBadge } from "@/components/RankBadge";
import { createAlliance, joinAlliance, leaveAlliance, deleteAlliance } from "@/lib/community-actions";

export async function AllianceBoard({
  gameSlug,
  gameName,
  basePath,
}: {
  gameSlug: string;
  gameName: string;
  basePath: string;
}) {
  const [alliances, mine, viewer] = await Promise.all([
    getAlliances(gameSlug),
    getMyAllianceIds(),
    getViewerRank(),
  ]);
  const viewerRank: Rank | null = viewer?.rank ?? null;
  const canCreate = viewerRank ? canParticipate(viewerRank) : false;
  const isModerator = viewerRank ? isStaff(viewerRank) : false;
  const isLogged = Boolean(viewer);

  return (
    <div>
      {canCreate ? (
        <form action={createAlliance} className="panel">
          <div className="panel-inner space-y-3 p-4">
            <input type="hidden" name="gameSlug" value={gameSlug} />
            <input type="hidden" name="basePath" value={basePath} />
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
                        <form action={deleteAlliance}>
                          <input type="hidden" name="id" value={a.id} />
                          <input type="hidden" name="basePath" value={basePath} />
                          <button type="submit" className="text-xs text-white/35 transition hover:text-red-400">
                            Borrar
                          </button>
                        </form>
                      )}
                      {isLogged ? (
                        isMember ? (
                          <form action={leaveAlliance}>
                            <input type="hidden" name="id" value={a.id} />
                            <input type="hidden" name="basePath" value={basePath} />
                            <button type="submit" className="btn-ghost !py-1.5 !text-xs">Salir</button>
                          </form>
                        ) : (
                          <form action={joinAlliance}>
                            <input type="hidden" name="id" value={a.id} />
                            <input type="hidden" name="basePath" value={basePath} />
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
    </div>
  );
}
