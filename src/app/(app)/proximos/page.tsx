// Sección PRÓXIMOS: catálogo navegable de los juegos que vienen. Cada tarjeta
// lleva al "mundo" del juego (/proximos/[key]) con su info, discusión y alianzas.
// Pública (escaparate + SEO). Dentro de (app): no añade header/footer.
import type { Metadata } from "next";
import Link from "next/link";
import { getPreRegisterGames } from "@/lib/preregister-games";
import { HudLabel } from "@/components/hud";

export const metadata: Metadata = {
  title: "Próximos juegos",
  description:
    "Los juegos que vienen: MMORPG y más en el horizonte. Entra a cada uno, sigue sus novedades y organiza tu alianza para el día 1 con la comunidad IMPERIUM.",
  alternates: { canonical: "/proximos" },
};

export default async function ProximosPage() {
  const games = await getPreRegisterGames();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 pb-16">
      <HudLabel>Próximos</HudLabel>
      <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Juegos en el horizonte
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
        Los juegos que vienen. Entra a cada uno para ver su info, comentar en la discusión y
        montar tu alianza para empezar todos juntos cuando salga.
      </p>

      {games.length === 0 ? (
        <p className="mt-12 text-center text-sm text-white/40">Pronto añadiremos juegos aquí.</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <Link key={g.key} href={`/proximos/${g.key}`} className="block h-full">
              <div className="panel group h-full">
                <div className="panel-inner flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10">
                      {g.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={g.image} alt={`Logo de ${g.name}`} className="max-h-11 w-auto object-contain" />
                      ) : (
                        <span className="font-title text-xs text-white/40">{g.name.slice(0, 2)}</span>
                      )}
                    </span>
                    {typeof g.hype === "number" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
                        <span className="font-num">{g.hype.toFixed(1)}</span> hype
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-title text-lg font-bold leading-tight text-white group-hover:text-accent transition-colors">
                    {g.name}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs uppercase tracking-[0.12em] text-white/45">
                    {[g.genre, g.status].filter(Boolean).join(" · ")}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-hud text-xs font-semibold text-accent/80 group-hover:text-accent transition-colors">
                    Ver mundo <span>▸</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
