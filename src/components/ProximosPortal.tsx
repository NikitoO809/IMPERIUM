"use client";

// Sección PRÓXIMOS con diseño "portal de juegos": un hero grande con carrusel
// entre los más esperados, una fila de portadas destacadas y una lista de
// próximos lanzamientos. Las imágenes grandes (heroImage) se sirven desde
// /public/proximos, así que nunca fallan por bloqueo externo.
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PreRegisterGame } from "@/lib/preregister-games";

// Etiqueta corta de estado para la "fecha" de la lista.
function shortState(s: string): string {
  const m: Record<string, string> = {
    "En desarrollo": "DEV",
    "Beta": "BETA",
    "Acceso anticipado": "EA",
    "Por confirmar": "TBC",
  };
  return m[s] ?? "SOON";
}

function officialHref(g: PreRegisterGame): string {
  return g.preRegisterUrl?.trim() || g.website?.trim() || g.infoUrl || "";
}

export function ProximosPortal({ games }: { games: PreRegisterGame[] }) {
  const heroList = games.slice(0, 3);
  const [hi, setHi] = useState(0);

  // Rotación automática del hero cada 6 s.
  useEffect(() => {
    if (heroList.length < 2) return;
    const t = setInterval(() => setHi((i) => (i + 1) % heroList.length), 6000);
    return () => clearInterval(t);
  }, [heroList.length]);

  if (games.length === 0) {
    return <p className="py-16 text-center text-sm text-white/40">Pronto añadiremos juegos aquí.</p>;
  }

  const hero = heroList[hi];

  return (
    <div>
      {/* ───── HERO ───── */}
      <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c10] sm:min-h-[420px]">
        {hero.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={hero.key}
            src={hero.heroImage}
            alt={hero.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,.96)_0%,rgba(9,9,11,.7)_38%,rgba(9,9,11,.1)_72%,transparent_100%),linear-gradient(0deg,rgba(9,9,11,.92),transparent_55%)]" />

        {heroList.length > 1 && (
          <>
            <button
              aria-label="Anterior"
              onClick={() => setHi((i) => (i - 1 + heroList.length) % heroList.length)}
              className="absolute left-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/50 text-white transition hover:bg-black/75"
            >
              ‹
            </button>
            <button
              aria-label="Siguiente"
              onClick={() => setHi((i) => (i + 1) % heroList.length)}
              className="absolute right-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/50 text-white transition hover:bg-black/75"
            >
              ›
            </button>
          </>
        )}

        <div className="relative z-10 flex min-h-[380px] max-w-xl flex-col justify-end p-7 sm:min-h-[420px] sm:p-10">
          <span className="hud-label text-[11px] font-extrabold tracking-[0.16em] text-lime-400">
            {[hero.genre, hero.status].filter(Boolean).join(" · ")}
          </span>
          <h2 className="font-title mt-2.5 text-4xl font-extrabold uppercase leading-none tracking-tight text-white drop-shadow-[0_3px_20px_rgba(0,0,0,.6)] sm:text-5xl">
            {hero.name}
          </h2>
          {hero.blurb && <p className="mt-3.5 max-w-[470px] text-sm leading-relaxed text-white/80">{hero.blurb}</p>}
          <div className="mt-3.5 flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-white/60">
            {typeof hero.hype === "number" && (
              <span>
                <b className="text-white">{hero.hype.toFixed(1)}</b> hype
              </span>
            )}
            {hero.developer && <span>· {hero.developer}</span>}
            {hero.platforms?.length ? <span>· {hero.platforms.join(" · ")}</span> : null}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href={`/proximos/${hero.key}`} className="btn-hud">Ver mundo</Link>
            {officialHref(hero) && (
              <a
                href={officialHref(hero)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm font-bold text-white"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/40">▶</span>
                Web oficial
              </a>
            )}
          </div>
        </div>

        {heroList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroList.map((g, i) => (
              <button
                key={g.key}
                aria-label={`Ir a ${g.name}`}
                onClick={() => setHi(i)}
                className={`h-1 w-7 rounded-full transition ${i === hi ? "bg-brand" : "bg-white/30"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ───── DESTACADOS ───── */}
      <div className="mb-4 mt-11 flex items-center gap-2.5">
        <span className="h-4.5 w-1 rounded-sm bg-brand" style={{ height: 18 }} />
        <h3 className="font-title text-sm font-extrabold uppercase tracking-[0.18em]">Más esperados</h3>
      </div>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {games.map((g) => (
          <Link
            key={g.key}
            href={`/proximos/${g.key}`}
            className="group relative flex aspect-[3/4] items-end overflow-hidden rounded-xl border border-white/10 bg-[#111] transition hover:-translate-y-1 hover:border-white/30"
          >
            {g.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={g.heroImage}
                alt={g.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(9,9,11,.95)_6%,rgba(9,9,11,.15)_55%,transparent)]" />
            {typeof g.hype === "number" && (
              <span className="absolute right-2 top-2 z-10 rounded-md border border-lime-400/80 bg-black/75 px-1.5 py-0.5 text-[11px] font-extrabold tabular-nums text-lime-400">
                {g.hype.toFixed(1)}
              </span>
            )}
            <div className="relative z-10 w-full p-3">
              <div className="text-[12.5px] font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.7)]">
                {g.name}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-white/55">{g.genre}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ───── PRÓXIMOS LANZAMIENTOS ───── */}
      <div className="mb-4 mt-11 flex items-center gap-2.5">
        <span className="w-1 rounded-sm bg-brand" style={{ height: 18 }} />
        <h3 className="font-title text-sm font-extrabold uppercase tracking-[0.18em]">Próximos lanzamientos</h3>
      </div>
      <div>
        {games.map((g) => (
          <Link
            key={g.key}
            href={`/proximos/${g.key}`}
            className="flex items-center gap-4 border-b border-white/8 px-2.5 py-3 transition hover:bg-white/[0.02]"
          >
            <div className="w-13 shrink-0 text-center" style={{ width: 52 }}>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-lime-400">
                {shortState(g.status)}
              </div>
            </div>
            <div className="h-[50px] w-[88px] shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#111]">
              {g.heroImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.heroImage} alt="" loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-bold text-white">{g.name}</div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.1em] text-white/45">
                {[g.genre, g.status].filter(Boolean).join(" · ")}
              </div>
            </div>
            {g.platforms?.length ? (
              <div className="hidden min-w-[150px] text-right text-xs text-white/50 sm:block">
                {g.platforms.join(" · ")}
              </div>
            ) : null}
            <span className="shrink-0 rounded-lg border border-white/12 px-3.5 py-2 text-xs font-bold text-white/70 transition group-hover:border-brand">
              Ver ▸
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
