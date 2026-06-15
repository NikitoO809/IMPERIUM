"use client";
// Visor de TIER-LIST genérico (data-driven desde section_blocks + meta).
// Sirve para CUALQUIER juego: héroes, compañeros, war-pets... Cada bloque es una
// entidad; su tier va en meta.tier y cualquier otra clave de meta (clase, rol,
// elemento...) se convierte en un filtro automático. Soporta tiers arbitrarios
// (S/A/B o Legendary/Epic...). Imágenes con object-contain (no recorta retratos).
import { useMemo, useState } from "react";
import Image from "next/image";
import { Panel } from "@/components/hud";
import type { SectionContent, Block } from "@/lib/sections";

// Orden sugerido de tiers (lo no listado va al final). Comparación en minúsculas.
const TIER_HINT = [
  "ss", "s+", "s", "s-", "a+", "a", "a-", "b+", "b", "b-",
  "c+", "c", "c-", "d", "e", "f",
  "legendary", "mythic", "epic", "elite", "rare", "advanced", "uncommon", "common",
];
// Color por POSICIÓN del tier (1º dorado, 2º violeta, 3º cian...).
const PALETTE = [
  "border-amber-400 bg-amber-400/15 text-amber-300",
  "border-violet-400 bg-violet-400/15 text-violet-300",
  "border-sky-400 bg-sky-400/15 text-sky-300",
  "border-emerald-400 bg-emerald-400/15 text-emerald-300",
  "border-rose-400 bg-rose-400/15 text-rose-300",
  "border-slate-300 bg-slate-300/15 text-slate-200",
];

const tierRank = (t: string) => {
  const i = TIER_HINT.indexOf(t.toLowerCase());
  return i === -1 ? 900 : i;
};
const tierOf = (b: Block) =>
  typeof b.meta?.tier === "string" && b.meta.tier ? (b.meta.tier as string) : null;

export function TierListViewer({ section }: { section: SectionContent }) {
  const entities = useMemo(() => section.blocks.filter((b) => tierOf(b)), [section.blocks]);
  const descBlocks = useMemo(() => section.blocks.filter((b) => !tierOf(b)), [section.blocks]);

  // Tiers presentes, ordenados; color por posición.
  const tiers = useMemo(() => {
    const set = [...new Set(entities.map((e) => tierOf(e) as string))];
    set.sort((a, b) => tierRank(a) - tierRank(b) || a.localeCompare(b));
    return set;
  }, [entities]);
  const tierColor = (t: string) => PALETTE[Math.min(Math.max(tiers.indexOf(t), 0), PALETTE.length - 1)];

  // Facetas extra (claves de meta distintas de tier) con entre 2 y 10 valores.
  const facets = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const e of entities) {
      for (const [k, v] of Object.entries(e.meta ?? {})) {
        if (k === "tier" || v == null || v === "") continue;
        (map[k] ??= new Set()).add(String(v));
      }
    }
    return Object.entries(map)
      .map(([key, set]) => ({ key, values: [...set].sort() }))
      .filter((f) => f.values.length > 1 && f.values.length <= 10);
  }, [entities]);

  const [q, setQ] = useState("");
  const [tier, setTier] = useState<string | null>(null);
  const [sel, setSel] = useState<Record<string, string | null>>({});

  const list = useMemo(() => {
    return entities
      .filter((e) => {
        if (q && !e.title.toLowerCase().includes(q.toLowerCase())) return false;
        if (tier && tierOf(e) !== tier) return false;
        for (const f of facets) {
          const s = sel[f.key];
          if (s && String(e.meta?.[f.key] ?? "") !== s) return false;
        }
        return true;
      })
      .sort((a, b) => tierRank(tierOf(a)!) - tierRank(tierOf(b)!) || a.title.localeCompare(b.title));
  }, [entities, q, tier, sel, facets]);

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
      active ? "bg-accent text-black" : "bg-white/5 text-white/60 ring-1 ring-white/10 hover:text-white"
    }`;

  // Sin entidades con tier → no es una tier-list: mostramos los bloques como texto.
  if (entities.length === 0) {
    return (
      <div className="space-y-3">
        {descBlocks.map((b) => (
          <Panel key={b.id}>
            <div className="panel-inner p-5">
              {b.title && <h3 className="mb-2 font-title text-base font-bold text-glow-accent">{b.title}</h3>}
              {b.content.split("\n\n").map((p, i) => (
                <p key={i} className="mt-2 text-sm leading-relaxed text-white/65">{p}</p>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Intro de la sección */}
      {(section.intro || section.introTitle) && (
        <Panel corners>
          <div className="panel-inner p-5">
            {section.introTitle && (
              <h2 className="mb-2 font-title text-lg font-bold text-glow-accent">{section.introTitle}</h2>
            )}
            {section.intro?.split("\n\n").map((p, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-white/65">{p}</p>
            ))}
          </div>
        </Panel>
      )}

      {/* Buscador */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar…"
        className="mb-4 mt-5 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none ring-accent/40 placeholder:text-white/35 focus:ring-2 sm:max-w-xs"
      />

      {/* Filtro de tier */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="hud-label mr-1 text-[10px] text-white/40">Tier</span>
        <button onClick={() => setTier(null)} className={chip(tier === null)}>Todos</button>
        {tiers.map((t) => (
          <button key={t} onClick={() => setTier(tier === t ? null : t)} className={chip(tier === t)}>{t}</button>
        ))}
      </div>

      {/* Filtros automáticos por cada faceta de meta */}
      {facets.map((f) => (
        <div key={f.key} className="mb-2 flex flex-wrap items-center gap-2">
          <span className="hud-label mr-1 text-[10px] capitalize text-white/40">{f.key}</span>
          <button onClick={() => setSel((s) => ({ ...s, [f.key]: null }))} className={chip(!sel[f.key])}>Todos</button>
          {f.values.map((v) => (
            <button
              key={v}
              onClick={() => setSel((s) => ({ ...s, [f.key]: s[f.key] === v ? null : v }))}
              className={chip(sel[f.key] === v)}
            >
              {v}
            </button>
          ))}
        </div>
      ))}

      <div className="mb-5 mt-1 hud-label text-[10px] text-white/40">{list.length} resultados</div>

      {/* Rejilla de entidades */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((e) => {
          const t = tierOf(e)!;
          return (
            <Panel key={e.id} className="sweep lift">
              <div className="panel-inner p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10">
                  {e.images[0] ? (
                    <Image src={e.images[0]} alt={e.title} fill unoptimized className="object-contain" sizes="240px" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-white/20">
                      <span className="font-title text-2xl">{t}</span>
                    </div>
                  )}
                  <span className={`absolute left-2 top-2 rounded border px-2 py-0.5 font-title text-[10px] font-extrabold ${tierColor(t)}`}>{t}</span>
                </div>
                <h3 className="mt-3 font-title text-sm font-bold leading-tight">{e.title}</h3>
                {/* Chips de las facetas de este elemento */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {facets.map((f) => {
                    const v = e.meta?.[f.key];
                    return v ? (
                      <span key={f.key} className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/55 ring-1 ring-white/10">{String(v)}</span>
                    ) : null;
                  })}
                </div>
                {e.content && (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/50">{e.content}</p>
                )}
              </div>
            </Panel>
          );
        })}
      </div>

      {list.length === 0 && (
        <p className="py-10 text-center text-sm text-white/40">No hay resultados con esos filtros.</p>
      )}
    </div>
  );
}
