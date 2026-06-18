"use client";

// Visor de Builds de Árbol de Talentos de Call of Dragons.
// Lee los pasos de la guía (uno por héroe), cuyo `content` es un bloque
// __TALENTS__{json} con { portrait, credit, intro, builds:[{label,mode,img}] }.
// Muestra: barra lateral de héroes con retrato + panel del héroe con sus árboles
// (cada build = imagen + nombre + distintivo de modo), con filtro por modo.
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Step } from "@/lib/games";
import { HudLabel, Panel } from "@/components/hud";

type Build = { label: string; mode: string; img: string };
type Hero = {
  id: string;
  name: string;
  portrait: string | null;
  credit?: string | null;
  intro?: string | null;
  builds: Build[];
};

const PREFIX = "__TALENTS__";

// cod.guide sirve versiones recortadas (p. ej. "...-1024x722.jpg"). Quitamos el
// sufijo de dimensiones para cargar la imagen ORIGINAL a máxima resolución.
function fullRes(url: string): string {
  return url.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, "");
}

// Color del distintivo según el modo del build.
const MODE_BADGE: Record<string, string> = {
  Marksman:     "border-amber-400/50 text-amber-300 bg-amber-400/10",
  Behemoths:    "border-rose-400/50 text-rose-300 bg-rose-400/10",
  PvP:          "border-red-400/50 text-red-300 bg-red-400/10",
  "Pacificación": "border-emerald-400/50 text-emerald-300 bg-emerald-400/10",
  Movilidad:    "border-sky-400/50 text-sky-300 bg-sky-400/10",
  Control:      "border-violet-400/50 text-violet-300 bg-violet-400/10",
  Tanque:       "border-slate-300/50 text-slate-200 bg-slate-300/10",
  Mixto:        "border-teal-400/50 text-teal-300 bg-teal-400/10",
  Magia:        "border-fuchsia-400/50 text-fuchsia-300 bg-fuchsia-400/10",
  Farmeo:       "border-lime-400/50 text-lime-300 bg-lime-400/10",
  General:      "border-white/20 text-white/50 bg-white/5",
};

function parseHeroes(steps: Step[]): Hero[] {
  const heroes: Hero[] = [];
  for (const s of steps) {
    if (!s.content?.startsWith(PREFIX)) continue;
    try {
      const data = JSON.parse(s.content.slice(PREFIX.length));
      heroes.push({
        id: s.id,
        name: s.title,
        portrait: data.portrait ?? null,
        credit: data.credit ?? null,
        intro: data.intro ?? null,
        builds: Array.isArray(data.builds) ? data.builds : [],
      });
    } catch {
      /* paso mal formado: lo ignoramos */
    }
  }
  return heroes;
}

export function TalentBuildsViewer({ steps }: { steps: Step[] }) {
  const heroes = useMemo(() => parseHeroes(steps), [steps]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mode, setMode] = useState<string>("Todos");
  // Imagen ampliada en el lightbox (null = cerrado).
  const [zoom, setZoom] = useState<{ img: string; label: string } | null>(null);

  // Cerrar el lightbox con la tecla Escape y bloquear el scroll de fondo.
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setZoom(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [zoom]);

  if (heroes.length === 0) {
    return <p className="text-sm text-white/50">No hay builds para mostrar.</p>;
  }

  const hero = heroes[Math.min(activeIdx, heroes.length - 1)];
  const modes = ["Todos", ...Array.from(new Set(hero.builds.map((b) => b.mode)))];
  const builds = mode === "Todos" ? hero.builds : hero.builds.filter((b) => b.mode === mode);

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
      {/* ── Barra lateral de héroes ── */}
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <HudLabel>Héroes ({heroes.length})</HudLabel>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
          {heroes.map((h, i) => {
            const active = i === activeIdx;
            return (
              <button
                key={h.id}
                onClick={() => { setActiveIdx(i); setMode("Todos"); }}
                className={`group flex shrink-0 items-center gap-2.5 rounded border px-2.5 py-2 text-left transition lg:w-full ${
                  active
                    ? "border-accent/50 bg-accent/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/5"
                }`}
              >
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/40">
                  {h.portrait ? (
                    <Image src={h.portrait} alt={h.name} fill sizes="36px" unoptimized className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[10px] text-white/40">
                      {h.name.slice(0, 2)}
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className={`block truncate text-xs font-semibold ${active ? "text-accent" : "text-white/80"}`}>
                    {h.name}
                  </span>
                  <span className="hud-label block text-[9px] text-white/35">{h.builds.length} builds</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Panel del héroe ── */}
      <Panel corners>
        <div className="panel-inner p-5 sm:p-6">
          {/* Cabecera del héroe */}
          <div className="flex items-center gap-4">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/40">
              {hero.portrait ? (
                <Image src={hero.portrait} alt={hero.name} fill sizes="64px" unoptimized className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm text-white/40">
                  {hero.name.slice(0, 2)}
                </span>
              )}
            </span>
            <div>
              <h2 className="font-title text-2xl font-extrabold tracking-wide text-glow-brand">{hero.name}</h2>
              {hero.credit && <p className="hud-label mt-0.5 text-[10px] text-white/40">{hero.credit}</p>}
            </div>
          </div>

          {/* Intro del héroe */}
          {hero.intro && (
            <div className="mt-4 space-y-2">
              {hero.intro.split("\n\n").map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-white/60">{p}</p>
              ))}
            </div>
          )}

          {/* Filtro por modo */}
          {modes.length > 2 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`hud-label rounded border px-2.5 py-1 text-[10px] transition ${
                    mode === m
                      ? "border-accent/50 bg-accent/15 text-accent"
                      : "border-white/15 text-white/45 hover:border-white/30 hover:text-white/70"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Rejilla de árboles */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {builds.map((b, i) => (
              <figure key={i} className="bevel overflow-hidden border border-white/10 bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setZoom({ img: fullRes(b.img), label: b.label })}
                  className="group relative block w-full cursor-zoom-in"
                  aria-label={`Ampliar build ${b.label}`}
                >
                  <span className="relative block aspect-[16/11] bg-black/40">
                    <Image src={b.img} alt={b.label} fill sizes="(max-width:640px) 100vw, 380px" unoptimized className="object-contain transition group-hover:scale-[1.02]" />
                  </span>
                  {/* Indicador de "ampliar" al pasar el ratón */}
                  <span className="hud-label pointer-events-none absolute right-2 top-2 rounded border border-white/20 bg-black/60 px-1.5 py-0.5 text-[9px] text-white/80 opacity-0 transition group-hover:opacity-100">
                    ⤢ Ampliar
                  </span>
                </button>
                <figcaption className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
                  <span className="truncate text-xs font-semibold text-white/80">{b.label}</span>
                  <span className={`hud-label shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold ${MODE_BADGE[b.mode] ?? MODE_BADGE.General}`}>
                    {b.mode}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Panel>

      {/* ── Lightbox: imagen ampliada a máxima resolución ── */}
      {zoom && (
        <div
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={() => setZoom(null)}
            className="hud-label absolute right-4 top-4 z-10 rounded border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white/85 transition hover:border-accent/60 hover:text-accent"
          >
            ✕ Cerrar
          </button>

          {/* Imagen original (clic en la imagen no cierra) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-6xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoom.img}
              alt={zoom.label}
              className="mx-auto max-h-[85vh] w-auto max-w-full rounded border border-white/15 object-contain"
            />
          </div>
          <p className="hud-label mt-3 text-center text-xs text-white/70">
            {zoom.label} · <span className="text-white/40">clic fuera o Esc para cerrar</span>
          </p>
        </div>
      )}
    </div>
  );
}
