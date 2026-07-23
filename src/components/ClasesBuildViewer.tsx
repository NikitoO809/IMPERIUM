"use client";

// Visor de la sección "Clases Build": columna con las clases a la izquierda y, al
// elegir una, su cuadro de información con PESTAÑAS arriba para moverse por los
// pasos de esa build (árboles de habilidades, combo, cartas, mascotas, tácticas).
//
// Un bloque = un paso de una clase. La agrupación sale de section_blocks.meta:
// class, classSlug, classIcon, classOrder, stepOrder.
import { useMemo, useState } from "react";
import Image from "next/image";
import { Panel, HudLabel } from "@/components/hud";
import { RichText } from "@/components/RichText";
import type { Block, SectionContent as SectionData } from "@/lib/sections";

type BuildMeta = {
  class?: string;
  classSlug?: string;
  classIcon?: string;
  classOrder?: number;
  stepOrder?: number;
};

type ClassGroup = { name: string; icon: string | null; steps: Block[] };

// "Árbol Swordsman (1er trabajo)" → "Swordsman": la pestaña tiene que caber.
function tabLabel(title: string) {
  return title
    .replace(/^Árbol\s+/i, "")
    .replace(/\s*—.*$/, "")
    .replace(/\s*\(.*?\)\s*$/, "");
}

export function ClasesBuildViewer({ section }: { section: SectionData }) {
  // Agrupa los bloques por clase, conservando el orden de section_blocks.
  const groups = useMemo(() => {
    const out: ClassGroup[] = [];
    for (const b of section.blocks) {
      const m = b.meta as BuildMeta;
      const name = m.class || "Sin clase";
      let g = out.find((x) => x.name === name);
      if (!g) {
        g = { name, icon: m.classIcon ?? null, steps: [] };
        out.push(g);
      }
      g.steps.push(b);
    }
    return out;
  }, [section.blocks]);

  const [activeClass, setActiveClass] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const group = groups[activeClass];
  const step = group?.steps[activeTab];

  function pickClass(i: number) {
    setActiveClass(i);
    setActiveTab(0); // al cambiar de clase, vuelve a la primera pestaña
  }

  if (groups.length === 0) return null;

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

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[240px_1fr]">
        {/* ── Columna de clases ── */}
        <aside className="lg:sticky lg:top-4">
          <Panel corners>
            <div className="panel-inner p-3">
              <HudLabel>Clases</HudLabel>
              <p className="mt-1 mb-3 text-[11px] text-white/35">{groups.length} builds</p>

              <div className="space-y-0.5">
                {groups.map((g, i) => {
                  const isActive = i === activeClass;
                  return (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => pickClass(i)}
                      className={`group flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left transition-all ${
                        isActive
                          ? "border border-accent/25 bg-accent/10"
                          : "border border-transparent hover:bg-white/5"
                      }`}
                    >
                      {g.icon && (
                        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded border border-white/15 bg-black/40">
                          <Image src={g.icon} alt={g.name} fill sizes="32px" unoptimized className="object-contain p-0.5" />
                        </span>
                      )}
                      <span
                        className={`text-[13px] leading-snug transition-colors ${
                          isActive ? "text-white" : "text-white/55 group-hover:text-white/85"
                        }`}
                      >
                        {g.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Panel>
        </aside>

        {/* ── Cuadro de información con pestañas arriba ── */}
        {/* min-w-0: sin esto la fila de pestañas (contenido ancho) estira la columna
            del grid más allá del contenedor y el texto se sale de la pantalla. */}
        {group && (
          <Panel className="min-w-0">
            <div className="panel-inner min-w-0">
              {/* Cabecera de la clase */}
              <div className="flex items-center gap-3 border-b border-white/10 p-4">
                {group.icon && (
                  <div className="bevel relative h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-black/40">
                    <Image src={group.icon} alt={group.name} fill sizes="56px" unoptimized className="object-contain p-1" />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-title text-xl font-bold text-glow-accent">{group.name}</h2>
                  <p className="text-xs text-white/45">Build para PvP y GvG · {group.steps.length} apartados</p>
                </div>
              </div>

              {/* Pestañas: se reparten en varias filas para que siempre se vean todas
                  (con scroll horizontal se quedaban escondidas fuera de la pantalla). */}
              <div className="flex flex-wrap gap-1 border-b border-white/10 px-3 py-2">
                {group.steps.map((s, i) => {
                  const isActive = i === activeTab;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveTab(i)}
                      className={`shrink-0 rounded border px-2.5 py-1.5 transition-all ${
                        isActive
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/75"
                      }`}
                    >
                      <span className="hud-label mr-1.5 text-[9px] opacity-50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="whitespace-nowrap text-[11px]">{tabLabel(s.title)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Contenido de la pestaña activa */}
              {step && (
                <div className="p-5">
                  <h3 className="mb-3 font-title text-lg font-bold">{step.title}</h3>
                  <RichText content={step.content} />
                  {step.images.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {step.images.map((src) => (
                        <div
                          key={src}
                          className="bevel relative flex min-h-[160px] items-center justify-center overflow-hidden border border-white/10 bg-black/30 p-2"
                        >
                          <Image src={src} alt="" width={480} height={320} unoptimized className="max-h-64 w-auto object-contain" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
