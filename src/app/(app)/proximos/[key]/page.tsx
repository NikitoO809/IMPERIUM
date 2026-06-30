// "Mundo" de un juego PRÓXIMO: /proximos/[key]. Reúne info + guías (en camino) +
// discusión + alianzas, reutilizando los mismos componentes que los juegos
// jugables. Así un juego que viene ya tiene comunidad desde antes de salir.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPreRegisterGame } from "@/lib/preregister-games";
import { DiscussionBoard } from "@/components/DiscussionBoard";
import { AllianceBoard } from "@/components/AllianceBoard";
import { HudLabel } from "@/components/hud";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const game = await getPreRegisterGame(key);
  if (!game) return { title: "Próximo juego" };
  return {
    title: `${game.name} — Próximamente`,
    description: game.blurb || `${game.name}: novedades, discusión y alianzas en IMPERIUM.`,
    alternates: { canonical: `/proximos/${key}` },
  };
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.16em] text-white/40">{label}</dt>
      <dd className="mt-1 text-sm text-white/80">{value}</dd>
    </div>
  );
}

export default async function ProximoWorld({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const game = await getPreRegisterGame(key);
  if (!game) notFound();

  const base = `/proximos/${key}`;
  const hasPre = !!game.preRegisterUrl?.trim();
  const officialHref = hasPre ? game.preRegisterUrl! : game.website?.trim() || game.infoUrl;
  const officialLabel = hasPre ? "Preregistrarse" : "Ver web oficial";

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-20">
      {/* migas */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/proximos" className="transition hover:text-accent">Próximos</Link>
        <span>/</span>
        <span className="text-white/70">{game.name}</span>
      </div>

      {/* cabecera */}
      <div className="panel">
        <div className="panel-inner flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/10">
            {game.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={game.image} alt={`Logo de ${game.name}`} className="max-h-14 w-auto object-contain" />
            ) : (
              <span className="font-title text-sm text-white/40">{game.name.slice(0, 2)}</span>
            )}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
                {game.name}
              </h1>
              {typeof game.hype === "number" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                  <span className="font-num">{game.hype.toFixed(1)}</span> hype
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-white/55">
              {[game.genre, game.status].filter(Boolean).join(" · ")}
            </p>
          </div>
          {officialHref && (
            <a
              href={officialHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hud whitespace-nowrap"
            >
              {officialLabel}
            </a>
          )}
        </div>
      </div>

      {/* Info */}
      <section className="mt-8">
        <HudLabel>Info</HudLabel>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {game.blurb || "Pronto más información sobre este juego."}
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/10 pt-5">
          {game.genre ? <Meta label="Género" value={game.genre} /> : null}
          {game.status ? <Meta label="Estado" value={game.status} /> : null}
          {game.platforms?.length ? <Meta label="Plataformas" value={game.platforms.join(" · ")} /> : null}
          {game.developer ? <Meta label="Estudio" value={game.developer} /> : null}
          {game.publisher ? <Meta label="Editora" value={game.publisher} /> : null}
          {game.releaseWindow ? <Meta label="Lanzamiento" value={game.releaseWindow} /> : null}
        </dl>
      </section>

      {/* Guías (en camino — opción C) */}
      <section className="mt-10">
        <HudLabel>Guías</HudLabel>
        <div className="mt-3 rounded-xl border border-dashed border-white/12 p-6 text-center text-sm text-white/50">
          📖 Guías en camino. Cuando el juego salga, las guías completas vivirán aquí.
        </div>
      </section>

      {/* Discusión */}
      <section className="mt-10">
        <HudLabel>Discusión</HudLabel>
        <p className="mb-4 mt-3 text-sm text-white/55">
          Comenta y resuelve dudas sobre {game.name}. Todos leen; los donantes escriben.
        </p>
        <DiscussionBoard gameSlug={key} gameName={game.name} basePath={base} />
      </section>

      {/* Alianzas */}
      <section className="mt-12">
        <HudLabel>Alianzas</HudLabel>
        <p className="mb-4 mt-3 text-sm text-white/55">
          Organízate para entrar el día 1. Los donantes crean alianzas; cualquiera se une.
        </p>
        <AllianceBoard gameSlug={key} gameName={game.name} basePath={base} />
      </section>
    </main>
  );
}
