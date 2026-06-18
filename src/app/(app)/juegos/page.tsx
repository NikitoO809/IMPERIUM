// Sección Juegos — grid para elegir juego (lee de la base de datos).
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCatalog, UPCOMING_PLACEHOLDERS } from "@/lib/games";
import { Panel, HudLabel, XpBar } from "@/components/hud";
import { LockIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Juegos",
  description:
    "Catálogo de juegos de IMPERIUM. Cada juego reúne sus guías interactivas, builds y herramientas.",
  alternates: { canonical: "/juegos" },
};

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
            <Panel corners className="group sweep lift h-full">
              <div className="panel-inner flex h-full flex-col">

                {/* Imagen de cabecera */}
                <div className="relative h-40 w-full overflow-hidden border-b border-white/8">
                  {g.coverImage ? (
                    <>
                      <Image
                        src={g.coverImage}
                        alt={g.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-brand/25 mix-blend-color" />
                      <div className="scanlines absolute inset-0 opacity-20" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-brand/8" />
                  )}
                  <div className="absolute right-3 top-3 z-10">
                    <span className="hex grid h-10 w-10 place-items-center bg-gradient-to-br from-rank to-amber-600 font-title text-sm font-extrabold text-black">
                      {g.rank}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="hud-label text-[10px] text-accent/70">{g.tag}</span>
                  <h3 className="mt-2 font-title text-lg font-bold tracking-tight group-hover:text-accent transition-colors">{g.name}</h3>
                  <p className="mt-1.5 text-sm text-white/50">{g.guideCount} guías disponibles</p>

                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between">
                      <span className="hud-label text-[9px] text-white/40">Completado</span>
                      <span className="hud-label text-[9px] text-accent/70">{g.completionPct}%</span>
                    </div>
                    <XpBar value={g.completionPct} />
                  </div>

                  <div className="mt-4 flex items-center gap-2 font-hud text-sm font-semibold tracking-wide text-accent/80 group-hover:text-accent transition-colors">
                    Abrir guías <span>▸</span>
                  </div>
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
