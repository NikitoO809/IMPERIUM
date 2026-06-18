"use client";
// Galería interactiva de héroes agrupados por generación.
// Clic en un héroe → modal con detalle + botón "Ver build" que abre nueva pestaña.
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Hero } from "@/lib/heroes";

// ── Colores de tier ─────────────────────────────────────────
const TIER_COLOR: Record<string, string> = {
  "S+": "text-[#ffd700] border-[#ffd700]/60",
  S:   "text-[#ffcf5a] border-[#ffcf5a]/60",
  "A+": "text-[#22e0ff] border-[#22e0ff]/60",
  A:   "text-[#22e0ff]/80 border-[#22e0ff]/40",
  "B+": "text-[#a78bfa] border-[#a78bfa]/60",
  B:   "text-[#a78bfa]/80 border-[#a78bfa]/40",
  "C+": "text-white/60 border-white/30",
  C:   "text-white/50 border-white/25",
  D:   "text-white/35 border-white/20",
  NEW: "text-[#22e0ff] border-[#22e0ff]/60",
};
function tierColor(tier: string) {
  return TIER_COLOR[tier] ?? "text-white/60 border-white/20";
}

const CLASS_ES: Record<string, string> = {
  Magic: "Mago", Infantry: "Infantería", Cavalry: "Caballería",
  Marksman: "Tirador", Overall: "Universal",
};
const ROLE_ES: Record<string, string> = {
  PvP: "PvP", Garrison: "Guarnición", Rally: "Rally",
  Peacekeeping: "Pacificación", Gathering: "Recolección", Engineering: "Ingeniería",
};

// ── Ficha compacta ───────────────────────────────────────────
function HeroCard({ hero, onClick }: { hero: Hero; onClick: () => void }) {
  const tc = tierColor(hero.tier);
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center gap-1.5 p-2 rounded bevel border border-white/10
                 hover:border-accent/50 transition-all duration-200 hover:scale-105
                 hover:shadow-[0_0_12px_rgba(34,224,255,0.2)] focus:outline-none
                 focus:ring-1 focus:ring-accent/60 cursor-pointer w-full"
    >
      <div className="relative w-full aspect-square rounded overflow-hidden bg-white/5">
        {hero.imageUrl ? (
          <Image
            src={hero.imageUrl}
            alt={hero.name}
            fill
            sizes="(max-width:640px) 80px, 100px"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">?</div>
        )}
        <span className={`absolute top-1 right-1 text-[10px] font-title font-black px-1 py-0.5 rounded border bg-black/70 ${tc}`}>
          {hero.tier}
        </span>
      </div>
      <span className="text-[11px] font-hud text-white/85 text-center leading-tight line-clamp-2 w-full">
        {hero.name}
      </span>
    </button>
  );
}

// ── Modal de detalle ─────────────────────────────────────────
function HeroModal({
  hero,
  gameSlug,
  onClose,
}: {
  hero: Hero;
  gameSlug: string;
  onClose: () => void;
}) {
  const tc = tierColor(hero.tier);
  const buildUrl = `/juegos/${gameSlug}/heroes/${hero.slug}`;

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="panel w-full max-w-md">
        <div className="panel-inner p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="hud-label text-[10px] text-accent/60">{"// "}HÉROE · GEN. {hero.generation}</span>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition text-xl leading-none px-1"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {/* Contenido */}
          <div className="p-5 flex flex-col gap-4">
            {/* Retrato + nombre + tier */}
            <div className="flex gap-4 items-start">
              {hero.imageUrl && (
                <div className="relative shrink-0 w-24 h-24 rounded bevel overflow-hidden border border-white/15">
                  <Image src={hero.imageUrl} alt={hero.name} fill className="object-cover object-top" sizes="96px" />
                </div>
              )}
              <div className="flex flex-col gap-2 min-w-0">
                <h2 className="font-title text-lg font-extrabold text-white leading-tight">{hero.name}</h2>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={`font-title font-black px-2 py-0.5 rounded border bg-black/50 ${tc}`}>
                    Tier {hero.tier}
                  </span>
                </div>
              </div>
            </div>

            {/* Atributos */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {[
                ["Clase", CLASS_ES[hero.heroClass] ?? hero.heroClass],
                ["Facción", hero.faction],
                ["Mejor rol", ROLE_ES[hero.role] ?? hero.role],
                ["Especialidad", hero.specialty || "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="hud-label text-[10px] text-accent/60">{"// "}{label}</span>
                  <span className="text-white/85 font-medium">{val}</span>
                </div>
              ))}
            </div>

            {/* Descripción */}
            {hero.description && (
              <div className="panel">
                <div className="panel-inner p-3 text-xs text-white/65 leading-relaxed">
                  {hero.description}
                </div>
              </div>
            )}

            {/* Botón Ver build */}
            <a
              href={buildUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hud w-full text-center text-sm py-2.5 mt-1"
            >
              Ver build ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Galería principal ────────────────────────────────────────
export function HeroesGallery({
  heroes,
  gameSlug,
}: {
  heroes: Hero[];
  gameSlug: string;
}) {
  const [selected, setSelected] = useState<Hero | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const byGen = new Map<number, Hero[]>();
  for (const h of heroes) {
    if (!byGen.has(h.generation)) byGen.set(h.generation, []);
    byGen.get(h.generation)!.push(h);
  }
  const generations = [...byGen.keys()].sort((a, b) => b - a);

  if (heroes.length === 0) {
    return (
      <div className="panel">
        <div className="panel-inner p-8 text-center text-white/40 text-sm">
          Sin héroes disponibles todavía.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-10">
        {generations.map((gen) => (
          <section key={gen}>
            <div className="flex items-center gap-3 mb-4">
              <span className="hud-label text-[11px] text-accent/70">{"// "}GENERACIÓN {gen}</span>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/30">{byGen.get(gen)!.length} héroes</span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-3">
              {byGen.get(gen)!.map((h) => (
                <HeroCard key={h.id} hero={h} onClick={() => setSelected(h)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <HeroModal hero={selected} gameSlug={gameSlug} onClose={close} />
      )}
    </>
  );
}
