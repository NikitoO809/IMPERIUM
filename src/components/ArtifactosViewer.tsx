"use client";
// Visor interactivo de la sección Artefactos.
// Tabs: Descripción | Héroes | Artefactos (filtro por Tier) | Guías
import { useState } from "react";
import Image from "next/image";
import { Panel } from "@/components/hud";
import type { SectionContent, Block as SectionBlock } from "@/lib/sections";

// ── Tipos ────────────────────────────────────────────────────────────────────

type ArtifactRow = {
  name: string; artifact_img: string; tier: string;
  types: string; hero_images: string[]; hero_label: string;
  range: string; attributes: string;
};

// ── Constantes ───────────────────────────────────────────────────────────────

const TIERS = ["Todos", "Legendary", "Epic", "Elite", "Advanced"] as const;

const TIER_BADGE: Record<string, string> = {
  Legendary: "border-amber-400/60 text-amber-300 bg-amber-400/10",
  Epic:      "border-violet-400/60 text-violet-300 bg-violet-400/10",
  Elite:     "border-sky-400/60 text-sky-300 bg-sky-400/10",
  Advanced:  "border-emerald-400/50 text-emerald-300 bg-emerald-400/10",
};

const TIER_PILL: Record<string, string> = {
  Todos:     "border-white/20 text-white/60 hover:border-accent/50 hover:text-accent",
  Legendary: "border-amber-400/40 text-amber-300/80 hover:border-amber-400 hover:text-amber-300",
  Epic:      "border-violet-400/40 text-violet-300/80 hover:border-violet-400 hover:text-violet-300",
  Elite:     "border-sky-400/40 text-sky-300/80 hover:border-sky-400 hover:text-sky-300",
  Advanced:  "border-emerald-400/40 text-emerald-300/80 hover:border-emerald-400 hover:text-emerald-300",
};

const TIER_PILL_ACTIVE: Record<string, string> = {
  Todos:     "border-accent bg-accent/15 text-accent",
  Legendary: "border-amber-400 bg-amber-400/15 text-amber-300",
  Epic:      "border-violet-400 bg-violet-400/15 text-violet-300",
  Elite:     "border-sky-400 bg-sky-400/15 text-sky-300",
  Advanced:  "border-emerald-400 bg-emerald-400/15 text-emerald-300",
};

// ── Clasificador de bloques ───────────────────────────────────────────────────

function classifyBlocks(blocks: SectionBlock[]) {
  const descripcion: SectionBlock[] = [];
  const heroes: SectionBlock[] = [];
  const artefactos: SectionBlock[] = [];
  const guias: SectionBlock[] = [];

  for (const b of blocks) {
    if (b.orderIndex === 1) { descripcion.push(b); continue; }
    if (b.orderIndex === 2) { heroes.push(b); continue; }
    if (b.orderIndex >= 53) { guias.push(b); continue; }
    artefactos.push(b); // 3-52: lista + individuales
  }
  return { descripcion, heroes, artefactos, guias };
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function BlockText({ block }: { block: SectionBlock }) {
  return (
    <Panel>
      <div className="panel-inner p-5">
        {block.title && (
          <h3 className="mb-3 font-title text-base font-bold text-glow-accent">{block.title}</h3>
        )}
        {block.content.split("\n\n").map((p, i) => (
          <p key={i} className="mt-2 text-sm leading-relaxed text-white/65">{p}</p>
        ))}
        {block.images.length > 0 && (
          <div className={`mt-4 grid gap-2 ${block.images.length === 1 ? "grid-cols-1 max-w-xs" : "grid-cols-2 sm:grid-cols-3"}`}>
            {block.images.map((src, i) => (
              <div key={i} className="bevel relative aspect-video overflow-hidden border border-white/10 bg-black/40">
                <Image src={src} alt="" fill sizes="300px" unoptimized className="object-contain p-1" />
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

// Card individual de artefacto (imagen a la derecha, datos a la izquierda)
function ArtifactCard({ block }: { block: SectionBlock }) {
  const img = block.images[0];
  return (
    <Panel className="h-full">
      <div className="panel-inner flex h-full flex-col p-4">
        <div className="flex items-start gap-3">
          {img && (
            <div className="bevel relative h-16 w-16 shrink-0 overflow-hidden border border-white/15 bg-black/50">
              <Image src={img} alt={block.title} fill sizes="64px" unoptimized className="object-contain p-1" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-title text-sm font-bold leading-tight text-white/90">{block.title}</h4>
            {block.content && (
              <p className="mt-1.5 text-xs leading-relaxed text-white/50 line-clamp-3">{block.content.split("\n\n")[0]}</p>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}

// Tabla de héroes con imágenes
function HeroTable({ raw }: { raw: string }) {
  // El hook va SIEMPRE primero: nunca debe haber un return antes de un hook
  // (regla de los hooks de React). Por eso el parseo va después.
  const [filter, setFilter] = useState<string>("Todos");

  let rows: ArtifactRow[] = [];
  let parseError = false;
  try { rows = JSON.parse(raw); } catch { parseError = true; }
  if (parseError) return <p className="text-red-400 text-sm">Error al cargar tabla.</p>;

  const visible = filter === "Todos" ? rows : rows.filter(r => r.tier === filter);

  return (
    <div>
      {/* Filtro por tier */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TIERS.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`hud-label rounded border px-2.5 py-1 text-[10px] font-bold transition-all ${filter === t ? TIER_PILL_ACTIVE[t] : TIER_PILL[t]}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded border border-white/10">
        <div className="grid grid-cols-[150px_1fr_170px_70px_1fr] border-b border-white/10 bg-brand/20 px-3 py-2">
          {["Artefacto","Tipo","Héroes sugeridos","Rango","Atributos"].map(h => (
            <span key={h} className="hud-label text-[9px] text-accent/70 font-semibold">{h}</span>
          ))}
        </div>
        {visible.map((row, i) => (
          <div key={i} className="grid grid-cols-[150px_1fr_170px_70px_1fr] items-center border-b border-white/5 px-3 py-2.5 odd:bg-white/[0.02] hover:bg-brand/10 transition-colors">
            <div className="flex items-center gap-2 pr-3">
              {row.artifact_img && (
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded border border-white/15 bg-black/40">
                  <Image src={row.artifact_img} alt={row.name} fill sizes="36px" unoptimized className="object-contain p-0.5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/90 leading-tight truncate">{row.name}</p>
                <span className={`mt-0.5 inline-block rounded border px-1 py-px text-[7px] font-bold hud-label ${TIER_BADGE[row.tier] ?? "border-white/20 text-white/40"}`}>{row.tier}</span>
              </div>
            </div>
            <div className="pr-3 text-xs text-white/55">{row.types || "—"}</div>
            <div className="flex flex-wrap gap-1 pr-3">
              {row.hero_images.slice(0, 5).map((src, j) => (
                <div key={j} className="relative h-7 w-7 shrink-0 overflow-hidden rounded border border-white/10 bg-black/40">
                  <Image src={src} alt="" fill sizes="28px" unoptimized className="object-cover" />
                </div>
              ))}
              {row.hero_label && <span className="self-center text-[10px] text-white/40">{row.hero_label}</span>}
            </div>
            <div className="pr-3 text-xs text-white/50">{row.range || "—"}</div>
            <div className="text-xs text-white/65 leading-relaxed">{row.attributes || "—"}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-right text-xs text-white/25">{visible.length} artefactos</p>
    </div>
  );
}

// Grid de artefactos individuales con filtro por tier
function ArtifactoGrid({ blocks }: { blocks: SectionBlock[] }) {
  const [tier, setTier] = useState<string>("Todos");

  // El bloque 3 es "Lista Completa" (texto/tabla intro), los demás son individuales
  const listaBlock = blocks.find(b => b.orderIndex === 3);
  const individuales = blocks.filter(b => b.orderIndex >= 4 && b.orderIndex <= 52);

  // El tier es explícito: se guarda en meta.tier al montar (ver build_sql.py).
  // Antes se deducía por el rango de order_index, lo que se rompía al reordenar.
  function getTier(b: SectionBlock): string {
    return b.meta?.tier ?? "";
  }

  const visible = tier === "Todos" ? individuales : individuales.filter(b => getTier(b) === tier);

  return (
    <div>
      {/* Filtro por tier */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TIERS.map(t => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`hud-label rounded border px-3 py-1.5 text-[10px] font-bold transition-all ${tier === t ? TIER_PILL_ACTIVE[t] : TIER_PILL[t]}`}
          >
            {t === "Todos" ? `Todos (${individuales.length})` : `${t} (${individuales.filter(b => getTier(b) === t).length})`}
          </button>
        ))}
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(b => {
          const t = getTier(b);
          return (
            <div key={b.id} className="relative">
              {/* Badge de tier */}
              <span className={`absolute right-2 top-2 z-10 hud-label rounded border px-1.5 py-px text-[8px] font-bold ${TIER_BADGE[t] ?? ""}`}>
                {t}
              </span>
              <ArtifactCard block={b} />
            </div>
          );
        })}
      </div>

      {listaBlock && (
        <div className="mt-6">
          <BlockText block={listaBlock} />
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

const TABS = [
  { id: "descripcion", label: "Descripción" },
  { id: "heroes",      label: "Mejores Héroes" },
  { id: "artefactos",  label: "Artefactos" },
  { id: "guias",       label: "Guías" },
] as const;
type TabId = typeof TABS[number]["id"];

export function ArtifactosViewer({ section }: { section: SectionContent }) {
  const [tab, setTab] = useState<TabId>("descripcion");
  const { descripcion, heroes, artefactos, guias } = classifyBlocks(section.blocks);

  const heroBlock = heroes[0];
  const isHeroTable = heroBlock?.content.startsWith("__ARTIFACT_TABLE__");

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-white/10 pb-0">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`hud-label shrink-0 border-b-2 px-4 py-2.5 text-[11px] font-bold transition-all ${
              tab === t.id
                ? "border-accent text-accent"
                : "border-transparent text-white/45 hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div>
        {tab === "descripcion" && (
          <div className="space-y-3">
            {/* Bloque intro de la sección */}
            {(section.intro || section.introTitle) && (
              <Panel corners>
                <div className="panel-inner p-5">
                  {section.introTitle && (
                    <h2 className="mb-2 font-title text-lg font-bold text-glow-accent">{section.introTitle}</h2>
                  )}
                  {section.intro?.split("\n\n").map((p, i) => (
                    <p key={i} className="mt-2 text-sm leading-relaxed text-white/65">{p}</p>
                  ))}
                  {section.introImages[0] && (
                    <div className="bevel relative mt-4 aspect-video w-full overflow-hidden border border-white/10">
                      <Image src={section.introImages[0]} alt="" fill sizes="800px" unoptimized className="object-cover" />
                    </div>
                  )}
                </div>
              </Panel>
            )}
            {descripcion.map(b => <BlockText key={b.id} block={b} />)}
          </div>
        )}

        {tab === "heroes" && heroBlock && (
          <div>
            <p className="mb-4 text-sm text-white/45">
              Artefactos recomendados para cada tipo de héroe y estilo de juego.
            </p>
            {isHeroTable
              ? <HeroTable raw={heroBlock.content.slice("__ARTIFACT_TABLE__".length)} />
              : <BlockText block={heroBlock} />
            }
          </div>
        )}

        {tab === "artefactos" && (
          <ArtifactoGrid blocks={artefactos} />
        )}

        {tab === "guias" && (
          <div className="space-y-3">
            {guias.map(b => <BlockText key={b.id} block={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
