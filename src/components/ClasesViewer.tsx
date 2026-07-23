"use client";

// Visor de la sección "Clases": card con la lista agrupada por rama (cada fila con
// el icono de la clase) + panel de detalle de la clase seleccionada.
// Los datos de agrupación salen de section_blocks.meta: branch, path, role, stats, guide.
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Panel, HudLabel } from "@/components/hud";
import { RichText } from "@/components/RichText";
import type { Block, SectionContent as SectionData } from "@/lib/sections";

type ClassMeta = {
  branch?: string; // rama a la que pertenece (Swordsman, Acolyte…)
  path?: string; // recorrido completo de trabajos
  role?: string; // arquetipo (Tanque, DPS mágico…)
  stats?: string; // estadísticas prioritarias
  guide?: string; // slug de su guía de build, si existe
};

function metaOf(b: Block): ClassMeta {
  return b.meta as ClassMeta;
}

export function ClasesViewer({ section, gameSlug }: { section: SectionData; gameSlug: string }) {
  const [activeId, setActiveId] = useState(section.blocks[0]?.id ?? "");

  // Agrupa por rama conservando el orden en que aparecen los bloques.
  const groups = useMemo(() => {
    const out: { branch: string; blocks: Block[] }[] = [];
    for (const b of section.blocks) {
      const branch = metaOf(b).branch || "Otras";
      let g = out.find((x) => x.branch === branch);
      if (!g) {
        g = { branch, blocks: [] };
        out.push(g);
      }
      g.blocks.push(b);
    }
    return out;
  }, [section.blocks]);

  const active = section.blocks.find((b) => b.id === activeId) ?? section.blocks[0];
  const activeMeta = active ? metaOf(active) : {};

  return (
    <div className="flex flex-col gap-4">
      {/* Introducción de la sección */}
      {(section.intro || section.introTitle) && (
        <Panel corners>
          <div className="panel-inner p-5">
            {section.introTitle && (
              <h2 className="mb-2 font-title text-lg font-bold text-glow-accent">{section.introTitle}</h2>
            )}
            {section.intro?.split("\n\n").map((para, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-white/65">
                {para}
              </p>
            ))}
          </div>
        </Panel>
      )}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[280px_1fr]">
        {/* ── Card de listado: clases por rama ── */}
        <aside className="lg:sticky lg:top-4">
          <Panel corners>
            <div className="panel-inner p-4">
              <HudLabel>Clases</HudLabel>
              <p className="mt-1 mb-4 text-[11px] text-white/35">
                {section.blocks.length} clases · {groups.length} ramas
              </p>

              <nav className="space-y-4">
                {groups.map((g) => (
                  <div key={g.branch}>
                    <p className="hud-label mb-1.5 border-b border-white/10 pb-1 text-[9px] text-accent/60">
                      {g.branch}
                    </p>
                    <div className="space-y-0.5">
                      {g.blocks.map((b) => {
                        const isActive = b.id === active?.id;
                        const icon = b.images[0];
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setActiveId(b.id)}
                            className={`group flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left transition-all ${
                              isActive
                                ? "border border-accent/25 bg-accent/10"
                                : "border border-transparent hover:bg-white/5"
                            }`}
                          >
                            {icon && (
                              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded border border-white/15 bg-black/40">
                                <Image
                                  src={icon}
                                  alt={b.title}
                                  fill
                                  sizes="32px"
                                  unoptimized
                                  className="object-contain p-0.5"
                                />
                              </span>
                            )}
                            <span
                              className={`text-[13px] leading-snug transition-colors ${
                                isActive ? "text-white" : "text-white/55 group-hover:text-white/85"
                              }`}
                            >
                              {b.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </Panel>
        </aside>

        {/* ── Panel de detalle ── */}
        {active && (
          <Panel>
            <div className="panel-inner p-5 sm:p-7">
              <div className="flex items-start gap-4">
                {active.images[0] && (
                  <div className="bevel relative h-20 w-20 shrink-0 overflow-hidden border border-white/15 bg-black/40 sm:h-24 sm:w-24">
                    <Image
                      src={active.images[0]}
                      alt={active.title}
                      fill
                      sizes="96px"
                      unoptimized
                      className="object-contain p-1.5"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="font-title text-xl font-bold sm:text-2xl">{active.title}</h2>
                  {activeMeta.path && (
                    <p className="mt-1 text-sm text-accent/80">{activeMeta.path}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeMeta.role && (
                      <span className="hud-label rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] text-white/60">
                        {activeMeta.role}
                      </span>
                    )}
                    {activeMeta.stats && (
                      <span className="hud-label rounded border border-brand/40 bg-brand/10 px-2 py-0.5 text-[9px] text-brand-bright">
                        {activeMeta.stats}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <RichText content={active.content} />
              </div>

              {activeMeta.guide && (
                <Link
                  href={`/juegos/${gameSlug}/guias/${activeMeta.guide}`}
                  className="btn-hud hud-label mt-6 inline-block px-4 py-2 text-[10px]"
                >
                  VER GUÍA DE BUILD
                </Link>
              )}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
