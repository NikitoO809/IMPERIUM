// Visor de ROADMAP de progresión (timeline por temporadas y días).
// Cada bloque lleva __ROADMAP__{json} como contenido.
import { Panel } from "@/components/hud";
import type { SectionContent } from "@/lib/sections";

type EventItem = {
  type: "region" | "job" | "dungeon" | "treasure" | "minigame" | "seasonal" | "unlock" | "event" | "mythic";
  name: string;
  detail?: string;
  power?: Record<string, string>;
};

type DayEvent = {
  day: number;
  date: string;
  estimated: boolean;
  items: EventItem[];
};

type SeasonData = {
  season: string;
  region?: string;
  days: string;
  events: DayEvent[];
};

const TYPE_CFG: Record<string, { icon: string; color: string; bg: string }> = {
  region:   { icon: "◈", color: "text-emerald-300", bg: "bg-emerald-400/10 border-emerald-400/25" },
  job:      { icon: "⬡", color: "text-amber-300",   bg: "bg-amber-400/10   border-amber-400/25"   },
  dungeon:  { icon: "⚔", color: "text-red-300",     bg: "bg-red-400/10     border-red-400/25"     },
  treasure: { icon: "◆", color: "text-violet-300",  bg: "bg-violet-400/10  border-violet-400/25"  },
  minigame: { icon: "◉", color: "text-cyan-300",    bg: "bg-cyan-400/10    border-cyan-400/25"    },
  seasonal: { icon: "◫", color: "text-sky-300",     bg: "bg-sky-400/10     border-sky-400/25"     },
  unlock:   { icon: "◐", color: "text-white/50",    bg: "bg-white/5        border-white/10"       },
  event:    { icon: "✦", color: "text-yellow-300",  bg: "bg-yellow-400/10  border-yellow-400/25"  },
  mythic:   { icon: "★", color: "text-pink-300",    bg: "bg-pink-400/10    border-pink-400/25"    },
};

const STATS = [
  { label: "Días mapeados",      value: "215"  },
  { label: "Temporadas",         value: "4"    },
  { label: "Cambios de trabajo", value: "6"    },
  { label: "Muro Final",         value: "350M" },
];

export function RoadmapViewer({ section }: { section: SectionContent }) {
  const seasons = section.blocks
    .filter((b) => b.content.startsWith("__ROADMAP__"))
    .map((b) => {
      try { return JSON.parse(b.content.slice("__ROADMAP__".length)) as SeasonData; }
      catch { return null; }
    })
    .filter(Boolean) as SeasonData[];

  return (
    <div>
      <Panel corners className="mb-6">
        <div className="panel-inner p-5">
          {section.introTitle && (
            <h2 className="mb-2 font-title text-base font-bold text-glow-accent">{section.introTitle}</h2>
          )}
          {section.intro && (
            <p className="mb-4 text-sm leading-relaxed text-white/55">{section.intro}</p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
                <div className="font-title text-2xl font-extrabold text-accent">{s.value}</div>
                <div className="mt-1 hud-label text-[9px] text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="space-y-4">
        {seasons.map((season, si) => (
          <Panel key={si} corners>
            <div className="panel-inner p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-white/[0.08] pb-3">
                <span className="font-title text-sm font-extrabold tracking-wider text-white">{season.season}</span>
                {season.region && (
                  <span className="hud-label text-[10px] text-accent/60">{season.region}</span>
                )}
                <span className="ml-auto hud-label text-[10px] text-white/25">Day {season.days}</span>
              </div>

              <div className="space-y-3">
                {season.events.map((day, di) => (
                  <div key={di} className="flex gap-3">
                    <div className="flex w-10 shrink-0 flex-col items-center pt-0.5">
                      <div className="flex h-7 w-full items-center justify-center rounded bg-brand/25 font-title text-xs font-bold text-white/70 ring-1 ring-brand/40">
                        {day.day}
                      </div>
                      {di < season.events.length - 1 && (
                        <div className="mt-1 flex-1 w-px bg-white/[0.06]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-3">
                      <div className="mb-2 flex items-center gap-1.5 text-[10px] text-white/30">
                        {day.estimated && (
                          <span className="rounded bg-yellow-400/10 px-1.5 py-0.5 hud-label text-[8px] font-bold text-yellow-400/60">~EST</span>
                        )}
                        <span>{day.date}</span>
                      </div>
                      <div className="space-y-1.5">
                        {day.items.map((item, ii) => {
                          const cfg = TYPE_CFG[item.type] ?? TYPE_CFG.unlock;
                          return (
                            <div key={ii} className={`rounded border px-2.5 py-1.5 ${cfg.bg}`}>
                              <div className="flex items-start gap-2">
                                <span className={`mt-0.5 shrink-0 text-[11px] leading-none ${cfg.color}`}>{cfg.icon}</span>
                                <div className="min-w-0 flex-1">
                                  <span className={`text-xs font-semibold leading-tight ${cfg.color}`}>{item.name}</span>
                                  {item.detail && (
                                    <p className="mt-0.5 text-[10px] leading-snug text-white/40">{item.detail}</p>
                                  )}
                                  {item.power && (
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                      {Object.entries(item.power).map(([mode, val]) =>
                                        val !== "—" ? (
                                          <span key={mode} className="rounded bg-red-400/10 px-2 py-0.5 font-title text-[9px] font-bold text-red-300/70 ring-1 ring-red-400/20">
                                            {mode} · {val}
                                          </span>
                                        ) : null
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
