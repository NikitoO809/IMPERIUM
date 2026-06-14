"use client";

// Formato 2: catálogo de tarjetas con filtros por chips.
import { useMemo, useState } from "react";
import {
  TIERS,
  CLASSES,
  BEST_ROLES,
  SEASONS,
  TIER_ORDER,
  TIER_STYLE,
  CLASS_LABEL,
  BEST_ROLE_LABEL,
  BEST_ROLE_STYLE,
  type Tier,
  type HeroClass,
  type BestRole,
} from "@/lib/cod-heroes";
import { Panel } from "@/components/hud";

export function HeroCards() {
  const [seasonId, setSeasonId] = useState(SEASONS[0].id);
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<Tier | null>(null);
  const [cls, setCls] = useState<HeroClass | null>(null);
  const [best, setBest] = useState<BestRole | null>(null);

  const season = SEASONS.find((s) => s.id === seasonId) ?? SEASONS[0];

  const list = useMemo(() => {
    return season.heroes.filter((h) => {
      if (q && !h.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (tier && h.tier !== tier) return false;
      if (cls && h.heroClass !== cls) return false;
      if (best && h.bestRole !== best) return false;
      return true;
    }).sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.name.localeCompare(b.name));
  }, [season, q, tier, cls, best]);

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
      active ? "bg-accent text-black" : "bg-white/5 text-white/60 ring-1 ring-white/10 hover:text-white"
    }`;

  return (
    <div>
      {/* Selector de temporada + vigencia */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-surface/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="hud-label text-[10px] text-white/40">Temporada</span>
          <select
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-accent/40"
          >
            {SEASONS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <span className="hud-label text-[10px] text-white/45">
          {season.updated ? (
            <>Vigente · actualizado <span className="text-accent">{season.updated}</span></>
          ) : (
            <span className="text-amber-400/80">Sin datos cargados todavía</span>
          )}
        </span>
      </div>

      {/* Nota de la temporada */}
      {season.note && (
        <p className="mb-5 rounded-lg border border-border bg-surface/40 px-4 py-3 text-xs leading-relaxed text-white/55">
          ℹ️ {season.note}
        </p>
      )}

      {/* Si la temporada no tiene datos, mostramos estado vacío */}
      {season.heroes.length === 0 ? (
        <Panel corners>
          <div className="panel-inner flex flex-col items-center px-6 py-16 text-center">
            <span className="font-title text-lg font-bold text-white/70">
              Sin tier list para «{season.label}»
            </span>
            <p className="mt-2 max-w-sm text-sm text-white/45">
              La tier list de cada temporada la cargará el equipo desde el panel de
              administración. Cambia a «Temporada actual» para ver el ejemplo con datos reales.
            </p>
            <button
              onClick={() => setSeasonId("actual")}
              className="btn-hud mt-6 bg-brand px-5 py-2.5 text-white"
            >
              <span className="hud-label text-[11px]">Ver temporada actual</span>
            </button>
          </div>
        </Panel>
      ) : (
      <>
      {/* Buscador */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar héroe…"
        className="mb-4 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none ring-accent/40 placeholder:text-white/35 focus:ring-2 sm:max-w-xs"
      />

      {/* Chips de tier */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="hud-label mr-1 text-[10px] text-white/40">Tier</span>
        <button onClick={() => setTier(null)} className={chip(tier === null)}>Todos</button>
        {TIERS.map((t) => (
          <button key={t} onClick={() => setTier(tier === t ? null : t)} className={chip(tier === t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Chips de clase */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="hud-label mr-1 text-[10px] text-white/40">Clase</span>
        <button onClick={() => setCls(null)} className={chip(cls === null)}>Todas</button>
        {CLASSES.map((c) => (
          <button key={c} onClick={() => setCls(cls === c ? null : c)} className={chip(cls === c)}>
            {CLASS_LABEL[c]}
          </button>
        ))}
      </div>

      {/* Chips de "mejor en" (rol/escenario) */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="hud-label mr-1 text-[10px] text-white/40">Mejor en</span>
        <button onClick={() => setBest(null)} className={chip(best === null)}>Todos</button>
        {BEST_ROLES.map((r) => (
          <button key={r} onClick={() => setBest(best === r ? null : r)} className={chip(best === r)}>
            {BEST_ROLE_LABEL[r]}
          </button>
        ))}
        <span className="hud-label ml-auto text-[10px] text-white/40">{list.length} héroes</span>
      </div>

      {/* Rejilla de tarjetas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((h) => {
          const slug = h.name.toLowerCase().replace(/\s+/g, "-");
          return (
            <Panel key={h.name} className="sweep lift">
              <div className="panel-inner p-3">
                {/* Retrato del héroe */}
                <div className="relative overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10">
                  <img
                    src={`/heroes/${slug}.png`}
                    alt={`Retrato de ${h.name}`}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  {/* Insignia de tier */}
                  <span className={`absolute left-2 top-2 grid h-8 w-8 place-items-center rounded font-title text-xs font-extrabold shadow-lg ${TIER_STYLE[h.tier]}`}>
                    {h.tier}
                  </span>
                  {/* Degradado inferior para legibilidad */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <h3 className="mt-3 font-title text-base font-bold leading-tight">{h.name}</h3>
                <p className="mt-1 text-xs text-white/50">
                  {CLASS_LABEL[h.heroClass]} · {h.role}
                </p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${BEST_ROLE_STYLE[h.bestRole]}`}>
                  Mejor en: {BEST_ROLE_LABEL[h.bestRole]}
                </span>
              </div>
            </Panel>
          );
        })}
      </div>

      {list.length === 0 && (
        <p className="py-10 text-center text-sm text-white/40">No hay héroes con esos filtros.</p>
      )}
      </>
      )}
    </div>
  );
}
