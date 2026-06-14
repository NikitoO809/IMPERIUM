// Sección Juegos — grid para elegir juego (lee de la base de datos).
import Link from "next/link";
import { getCatalog, UPCOMING_PLACEHOLDERS } from "@/lib/games";
import { Panel, HudLabel, XpBar } from "@/components/hud";
import { LockIcon } from "@/components/icons";

export default async function JuegosPage() {
  const games = await getCatalog();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 pb-16">
      <HudLabel>Catálogo</HudLabel>
      <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Selecciona tu juego
      </h1>
      <p className="mt-3 max-w-xl text-sm text-white/55">
        Cada juego reúne sus guías interactivas. Más juegos en camino.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Juegos publicados (desde la base de datos) */}
        {games.map((g) => (
          <Link key={g.slug} href={`/juegos/${g.slug}`} className="block h-full">
            <Panel corners className="sweep lift h-full">
              <div className="panel-inner p-5">
                <div className="flex items-start justify-between">
                  <span className="hud-label text-[10px] text-accent/70">{g.tag}</span>
                  <span className="hex grid h-10 w-10 place-items-center bg-gradient-to-br from-rank to-amber-600 font-title text-sm font-extrabold text-black">
                    {g.rank}
                  </span>
                </div>

                <h3 className="mt-5 font-title text-lg font-bold tracking-tight">{g.name}</h3>
                <p className="mt-1.5 text-sm text-white/50">{g.guideCount} guías disponibles</p>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between">
                    <span className="hud-label text-[9px] text-white/40">Completado</span>
                    <span className="hud-label text-[9px] text-accent/70">{g.completionPct}%</span>
                  </div>
                  <XpBar value={g.completionPct} />
                </div>

                <div className="mt-5 flex items-center gap-2 font-hud text-sm font-semibold tracking-wide text-accent">
                  Abrir guías <span>▸</span>
                </div>
              </div>
            </Panel>
          </Link>
        ))}

        {/* Cartas decorativas de "próximamente" */}
        {UPCOMING_PLACEHOLDERS.map((g) => (
          <div key={g.slug}>
            <Panel className="sweep lift h-full opacity-55">
              <div className="panel-inner p-5">
                <div className="flex items-start justify-between">
                  <span className="hud-label text-[10px] text-accent/70">{g.tag}</span>
                  <span className="hex grid h-10 w-10 place-items-center bg-white/10 font-title text-sm font-extrabold text-white/40">
                    {g.rank}
                  </span>
                </div>

                <h3 className="mt-5 font-title text-lg font-bold tracking-tight">{g.name}</h3>
                <p className="mt-1.5 text-sm text-white/50">Bloqueado · próximamente</p>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between">
                    <span className="hud-label text-[9px] text-white/40">Completado</span>
                    <span className="hud-label text-[9px] text-accent/70">0%</span>
                  </div>
                  <XpBar value={0} />
                </div>

                <div className="mt-5 flex items-center gap-2 font-hud text-sm font-semibold tracking-wide text-white/35">
                  <LockIcon className="h-4 w-4" /> Bloqueado
                </div>
              </div>
            </Panel>
          </div>
        ))}
      </div>
    </main>
  );
}
