"use client";
// Visor a medida del TIER LIST de clases + fantomons (estilo eog, diseño HUD).
// Lee bloques de section_blocks:
//   - "__CTIER__{json}"  -> una región de la tier list de CLASES (T1..T5)
//   - "__FTIER__{json}"  -> la tier list de FANTOMONS (vista única)
// Pestañas CLASS/FANTOMON, sub-pestañas de región, matriz clase x modo con grades
// de colores y descripción por celda. Generado por scripts/gen_sxs_tierlist.py.
import { Fragment, useMemo, useState } from "react";
import { Panel } from "@/components/hud";
import type { SectionContent } from "@/lib/sections";

// ── Tipos (espejo del JSON canónico) ─────────────────────────
type Grade = { grade: string; desc: string };
type ClassRow = {
  name: string;
  line: string;
  icon?: string | null;
  grades: Record<string, Grade>;
};
type TreeStage = { tier: string; name: string; icon?: string | null };
type TreeLine = {
  key: string;
  line: string;
  role: string;
  icon?: string | null;
  stages: TreeStage[];
};
type Tree = { highlight: string; lines: TreeLine[] };
type Region = {
  tier: string;
  tierKey: string;
  region: string;
  subtitle: string;
  notes: { tag: string; text: string }[];
  classes: ClassRow[];
  tree?: Tree;
};
type Fantomon = { name: string; type: string; note: string; icon?: string | null };
type FantGroup = { title: string; fantomons: Fantomon[] };
type FantData = {
  updated: string;
  context: { title: string; text: string } | null;
  intro: string;
  groups: FantGroup[];
  breakpointsIntro: string;
  breakpoints: { label: string; val: string }[];
  plans: { tag: string; text: string }[];
};

// Modos en orden fijo. Las claves coinciden con el JSON (en inglés); las etiquetas
// se muestran localizadas.
const MODES = ["PvE", "Dragon & Chaos", "PvP", "4v4"] as const;
const MODE_LABEL: Record<string, string> = {
  PvE: "PvE",
  "Dragon & Chaos": "Dragón y Caos",
  PvP: "PvP",
  "4v4": "4v4",
};
const MODE_SHORT: Record<string, string> = {
  PvE: "PvE",
  "Dragon & Chaos": "Drag & Caos",
  PvP: "PvP",
  "4v4": "4v4",
};

// Color por grade (mejor → peor). El HUD usa violeta/cian/ámbar de marca.
const GRADE_STYLE: Record<string, string> = {
  SSS: "border-amber-400/60 bg-amber-400/20 text-amber-300",
  SS: "border-violet-400/60 bg-violet-400/20 text-violet-200",
  S: "border-sky-400/60 bg-sky-400/20 text-sky-200",
  A: "border-emerald-400/55 bg-emerald-400/15 text-emerald-200",
  B: "border-slate-300/45 bg-slate-300/12 text-slate-200",
  C: "border-orange-400/45 bg-orange-400/12 text-orange-200",
  D: "border-rose-500/45 bg-rose-500/12 text-rose-200",
};
const gradeStyle = (g: string) =>
  GRADE_STYLE[g.toUpperCase()] ?? "border-white/12 bg-white/[0.03] text-white/35";

function Icon({ src, alt, className }: { src?: string | null; alt: string; className: string }) {
  if (!src) return null;
  return (
    // Assets externos de eog (iconos del juego). <img> + onError para tolerar 404.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
      }}
    />
  );
}

function NoteCards({ notes }: { notes: { tag: string; text: string }[] }) {
  if (!notes.length) return null;
  return (
    <div className="mb-5 space-y-2.5">
      {notes.map((n, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3.5"
        >
          {n.tag && (
            <span className="hud-label mb-1 block text-[10px] text-accent/70">
              {n.tag}
            </span>
          )}
          <p className="text-[13px] leading-relaxed text-white/60">{n.text}</p>
        </div>
      ))}
    </div>
  );
}

// Árbol de evolución de clases (se muestra en T1/T2, sin tabla de grados).
function ClassTree({ tree }: { tree: Tree }) {
  return (
    <div className="space-y-3">
      <p className="mb-1 text-sm leading-relaxed text-white/55">
        A este nivel todas las clases rinden bien: elige la rama que quieras jugar a
        largo plazo. Esta es su evolución completa — la etapa de esta región va
        resaltada.
      </p>
      {tree.lines.map((L) => (
        <Panel key={L.key} className="lift">
          <div className="panel-inner p-4">
            <div className="mb-2 flex items-center gap-2.5">
              <Icon
                src={L.icon}
                alt={L.line}
                className="h-8 w-8 rounded bg-black/40 object-contain"
              />
              <h4 className="font-title text-sm font-extrabold text-white">{L.line}</h4>
            </div>
            <p className="mb-3 text-[12px] leading-relaxed text-white/55">{L.role}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {L.stages.map((s, i) => {
                const on = s.tier === tree.highlight;
                return (
                  <Fragment key={s.tier}>
                    {i > 0 && <span className="text-white/20">→</span>}
                    <span
                      className={`flex items-center gap-1.5 rounded border px-2 py-1 ${
                        on
                          ? "border-accent bg-accent/15 text-white shadow-[0_0_10px_rgba(34,224,255,0.12)]"
                          : "border-white/10 bg-white/[0.02] text-white/45"
                      }`}
                    >
                      <Icon src={s.icon} alt={s.name} className="h-4 w-4 object-contain" />
                      <span className="hud-label text-[9px] opacity-70">{s.tier}</span>
                      <span className="text-[11px] font-semibold">{s.name}</span>
                    </span>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}

// ── Pestaña CLASS ────────────────────────────────────────────
function ClassTab({ regions }: { regions: Region[] }) {
  const firstWithData =
    regions.find((r) => r.classes.length > 0)?.tierKey ?? regions[0]?.tierKey ?? "";
  const [regKey, setRegKey] = useState(firstWithData);
  const [clsIdx, setClsIdx] = useState(0);

  const region = regions.find((r) => r.tierKey === regKey) ?? regions[0];
  if (!region) return null;
  const cls = region.classes[Math.min(clsIdx, region.classes.length - 1)];

  function changeRegion(k: string) {
    setRegKey(k);
    setClsIdx(0);
  }

  return (
    <div>
      {/* Sub-pestañas de región */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {regions.map((r) => {
          const active = r.tierKey === region.tierKey;
          const empty = r.classes.length === 0;
          return (
            <button
              key={r.tierKey}
              onClick={() => changeRegion(r.tierKey)}
              className={`flex flex-col items-start gap-0.5 rounded border px-3 py-2 text-left transition ${
                active
                  ? "border-accent bg-accent/15 shadow-[0_0_12px_rgba(34,224,255,0.12)]"
                  : "border-white/12 bg-white/[0.02] hover:border-white/25"
              }`}
            >
              <span
                className={`font-title text-xs font-bold ${
                  active ? "text-accent" : "text-white/45"
                }`}
              >
                {r.tier}
                {empty && <span className="ml-1 text-[8px] text-white/20">·</span>}
              </span>
              <span
                className={`truncate text-[11px] font-medium ${
                  active ? "text-white/85" : "text-white/40"
                }`}
              >
                {r.region}
              </span>
            </button>
          );
        })}
      </div>

      {/* Banner de la región */}
      <Panel corners className="mb-5">
        <div className="panel-inner flex flex-wrap items-center gap-x-3 gap-y-1 p-4">
          <span className="hud-label rounded bg-brand/20 px-2 py-0.5 text-[10px] text-brand">
            Región {region.tier}
          </span>
          <h2 className="font-title text-xl font-extrabold text-glow-brand">
            {region.region}
          </h2>
          {region.subtitle && (
            <span className="text-xs text-white/45">· {region.subtitle}</span>
          )}
        </div>
      </Panel>

      <NoteCards notes={region.notes} />

      {region.classes.length === 0 ? (
        region.tree ? (
          <ClassTree tree={region.tree} />
        ) : (
          <Panel corners>
            <div className="panel-inner flex flex-col items-center gap-2 py-12 text-center">
              <span className="font-title text-2xl text-white/12">⚔</span>
              <p className="font-title text-sm font-bold text-white/35">
                Sin diferencias de clase en esta región
              </p>
              <p className="max-w-md text-xs leading-relaxed text-white/25">
                A este nivel cualquier clase rinde bien. Elige la que quieras jugar a
                largo plazo y céntrate en subirla de nivel.
              </p>
            </div>
          </Panel>
        )
      ) : (
        <Panel corners>
          <div className="panel-inner p-4 sm:p-5">
            {/* Matriz clase × modo */}
            <div className="overflow-hidden rounded-lg border border-white/[0.08]">
              {/* Cabecera */}
              <div className="grid grid-cols-[1.3fr_repeat(4,1fr)] bg-white/[0.03]">
                <span className="hud-label px-3 py-2 text-[10px] text-white/40">
                  Clase
                </span>
                {MODES.map((m) => (
                  <span
                    key={m}
                    className="hud-label border-l border-white/[0.06] px-1 py-2 text-center text-[9px] text-white/40 sm:text-[10px]"
                  >
                    {MODE_SHORT[m]}
                  </span>
                ))}
              </div>
              {/* Filas */}
              {region.classes.map((c, i) => {
                const active = c.name === cls.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setClsIdx(i)}
                    className={`grid w-full grid-cols-[1.3fr_repeat(4,1fr)] items-center border-t border-white/[0.06] text-left transition ${
                      active ? "bg-accent/[0.07]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="flex items-center gap-2 px-2 py-2.5 sm:px-3">
                      <Icon
                        src={c.icon}
                        alt={c.name}
                        className="h-7 w-7 shrink-0 rounded bg-black/40 object-contain"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-title text-[13px] font-bold text-white">
                          {c.name}
                        </span>
                        <span className="block truncate text-[10px] text-white/35">
                          {c.line}
                        </span>
                      </span>
                    </span>
                    {MODES.map((m) => {
                      const g = c.grades[m]?.grade ?? "—";
                      return (
                        <span
                          key={m}
                          className="flex items-center justify-center border-l border-white/[0.06] px-1 py-2.5"
                        >
                          <span
                            className={`inline-flex min-w-[30px] items-center justify-center rounded border px-1.5 py-1 font-title text-[11px] font-extrabold ${gradeStyle(
                              g,
                            )}`}
                          >
                            {g}
                          </span>
                        </span>
                      );
                    })}
                  </button>
                );
              })}
            </div>

            {/* Detalle de la clase seleccionada */}
            {cls && (
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <Icon
                    src={cls.icon}
                    alt={cls.name}
                    className="h-9 w-9 rounded bg-black/40 object-contain"
                  />
                  <div>
                    <h3 className="font-title text-base font-extrabold text-glow-accent">
                      {cls.name}
                    </h3>
                    <p className="text-[11px] text-white/40">{cls.line}</p>
                  </div>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {MODES.map((m) => {
                    const g = cls.grades[m];
                    if (!g) return null;
                    return (
                      <div
                        key={m}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3"
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="hud-label text-[10px] text-white/45">
                            {MODE_LABEL[m]}
                          </span>
                          <span
                            className={`inline-flex min-w-[30px] items-center justify-center rounded border px-1.5 py-0.5 font-title text-[11px] font-extrabold ${gradeStyle(
                              g.grade,
                            )}`}
                          >
                            {g.grade}
                          </span>
                        </div>
                        {g.desc && (
                          <p className="text-[12px] leading-relaxed text-white/55">
                            {g.desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}

// ── Pestaña FANTOMON ─────────────────────────────────────────
function FantomonTab({ data }: { data: FantData }) {
  return (
    <div className="space-y-5">
      {(data.context || data.intro) && (
        <Panel corners>
          <div className="panel-inner p-5">
            {data.updated && (
              <span className="hud-label mb-2 block text-[10px] text-white/35">
                {data.updated}
              </span>
            )}
            {data.context && (
              <>
                <h2 className="mb-1.5 font-title text-base font-bold text-glow-accent">
                  {data.context.title}
                </h2>
                <p className="mb-3 text-[13px] leading-relaxed text-white/60">
                  {data.context.text}
                </p>
              </>
            )}
            {data.intro && (
              <p className="text-[13px] leading-relaxed text-white/50">{data.intro}</p>
            )}
          </div>
        </Panel>
      )}

      {/* Grupos de fantomons */}
      {data.groups.map((grp) => (
        <div key={grp.title}>
          <h3 className="mb-2.5 flex items-center gap-2 font-title text-sm font-bold text-white/80">
            <span className="h-1 w-6 rounded bg-brand/60" />
            {grp.title}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {grp.fantomons.map((f) => (
              <Panel key={f.name} className="lift">
                <div className="panel-inner flex gap-3 p-3.5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10">
                    <Icon
                      src={f.icon}
                      alt={f.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-title text-sm font-extrabold text-white">
                      {f.name}
                    </h4>
                    <p className="mb-1 text-[10px] font-medium text-accent/70">
                      {f.type}
                    </p>
                    <p className="text-[11px] leading-relaxed text-white/50">
                      {f.note}
                    </p>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      ))}

      {/* Breakpoints de nivel */}
      {data.breakpoints.length > 0 && (
        <div>
          <h3 className="mb-2.5 flex items-center gap-2 font-title text-sm font-bold text-white/80">
            <span className="h-1 w-6 rounded bg-brand/60" />
            Niveles clave
          </h3>
          {data.breakpointsIntro && (
            <p className="mb-3 text-[12px] leading-relaxed text-white/50">
              {data.breakpointsIntro}
            </p>
          )}
          <Panel>
            <div className="panel-inner divide-y divide-white/[0.06] p-1">
              {data.breakpoints.map((bp) => (
                <div key={bp.label} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="hud-label w-20 shrink-0 text-[11px] text-accent/70">
                    {bp.label}
                  </span>
                  <span className="text-[12px] text-white/60">{bp.val}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* Planes F2P / pago */}
      {data.plans.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.plans.map((p) => (
            <div
              key={p.tag}
              className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <span className="hud-label mb-1.5 block text-[11px] text-brand">
                {p.tag}
              </span>
              <p className="text-[12px] leading-relaxed text-white/55">{p.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────
export function ClassTierViewer({ section }: { section: SectionContent }) {
  const regions = useMemo(
    () =>
      section.blocks
        .filter((b) => b.content.startsWith("__CTIER__"))
        .map((b) => {
          try {
            return JSON.parse(b.content.slice("__CTIER__".length)) as Region;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as Region[],
    [section.blocks],
  );
  const fant = useMemo(() => {
    const b = section.blocks.find((b) => b.content.startsWith("__FTIER__"));
    if (!b) return null;
    try {
      return JSON.parse(b.content.slice("__FTIER__".length)) as FantData;
    } catch {
      return null;
    }
  }, [section.blocks]);

  const hasClass = regions.length > 0;
  const hasFant = !!fant;
  const [tab, setTab] = useState<"class" | "fantomon">(
    hasClass ? "class" : "fantomon",
  );

  return (
    <div>
      {/* Intro de la sección */}
      {(section.introTitle || section.intro) && (
        <Panel corners className="mb-6">
          <div className="panel-inner p-5">
            {section.introTitle && (
              <h2 className="mb-2 font-title text-base font-bold text-glow-accent">
                {section.introTitle}
              </h2>
            )}
            {section.intro && (
              <p className="text-sm leading-relaxed text-white/55">{section.intro}</p>
            )}
          </div>
        </Panel>
      )}

      {/* Pestañas CLASS / FANTOMON */}
      {hasClass && hasFant && (
        <div className="mb-5 flex gap-2">
          {[
            { key: "class" as const, label: "Clases" },
            { key: "fantomon" as const, label: "Fantomons" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded border px-5 py-2 font-title text-sm font-bold transition ${
                tab === t.key
                  ? "border-brand bg-brand/20 text-white shadow-[0_0_12px_rgba(124,92,255,0.15)]"
                  : "border-white/12 bg-white/[0.02] text-white/45 hover:border-white/25 hover:text-white/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === "class" && hasClass ? (
        <ClassTab regions={regions} />
      ) : hasFant ? (
        <FantomonTab data={fant} />
      ) : (
        <p className="py-10 text-center text-sm text-white/40">
          Sin contenido disponible.
        </p>
      )}
    </div>
  );
}
