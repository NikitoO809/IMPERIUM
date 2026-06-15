"use client";
// Visor interactivo de la sección Behemoths.
// Grid de cards → al clic, detalle completo del behemoth con sus habilidades.
import { useState } from "react";
import Image from "next/image";
import { Panel } from "@/components/hud";
import type { SectionContent, Block } from "@/lib/sections";

// ── Renderizador de contenido markdown-like ───────────────────────────────────

function ContentRenderer({ text }: { text: string }) {
  const lineas = text.split("\n");
  const elementos: React.ReactNode[] = [];
  let i = 0;

  while (i < lineas.length) {
    const linea = lineas[i];

    if (linea.startsWith("## ")) {
      elementos.push(
        <h2 key={i} className="mt-6 mb-3 font-title text-base font-bold text-accent border-b border-accent/20 pb-1">
          {linea.slice(3)}
        </h2>
      );
    } else if (linea.startsWith("### ")) {
      // Habilidad: nombre + texto siguiente como descripción
      const nombreHabilidad = linea.slice(4);
      const textos: string[] = [];
      i++;
      while (i < lineas.length && !lineas[i].startsWith("##") && !lineas[i].startsWith("###")) {
        if (lineas[i].trim()) textos.push(lineas[i]);
        i++;
      }
      elementos.push(
        <div key={i} className="mb-3 rounded border border-white/8 bg-white/[0.03] p-3">
          <p className="mb-1 font-hud text-[11px] font-bold text-amber-300/90">{nombreHabilidad}</p>
          {textos.map((t, j) => (
            <p key={j} className="text-xs leading-relaxed text-white/55">{t}</p>
          ))}
        </div>
      );
      continue;
    } else if (linea.trim()) {
      elementos.push(
        <p key={i} className="mb-2 text-sm leading-relaxed text-white/65">{linea}</p>
      );
    }

    i++;
  }

  return <div>{elementos}</div>;
}

// ── Card del grid ─────────────────────────────────────────────────────────────

function BehemothCard({
  block,
  onClick,
}: {
  block: Block;
  onClick: () => void;
}) {
  const img = block.images[0];

  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left"
    >
      <Panel className="h-full overflow-hidden transition-all duration-200 group-hover:border-accent/50">
        {/* Imagen */}
        <div className="relative h-44 w-full overflow-hidden bg-black/60">
          {img ? (
            <Image
              src={img}
              alt={block.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-title text-4xl text-white/10">?</span>
            </div>
          )}
          {/* Overlay HUD */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-brand/20 mix-blend-color" />
          <div className="scanlines absolute inset-0 opacity-20" />
          {/* Corner brackets */}
          <div className="corners absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>

        {/* Nombre */}
        <div className="panel-inner p-3">
          <p className="font-title text-sm font-bold text-white/90 group-hover:text-accent transition-colors">
            {block.title}
          </p>
          <p className="mt-0.5 font-hud text-[10px] text-white/35 uppercase tracking-widest">
            Ver guía →
          </p>
        </div>
      </Panel>
    </button>
  );
}

// ── Vista de detalle ──────────────────────────────────────────────────────────

function BehemothDetail({
  block,
  onBack,
}: {
  block: Block;
  onBack: () => void;
}) {
  const img = block.images[0];

  return (
    <div>
      {/* Botón volver */}
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 font-hud text-[11px] text-white/45 transition hover:text-accent"
      >
        <span>←</span>
        <span>Volver a todos los Behemoths</span>
      </button>

      {/* Header con imagen */}
      {img && (
        <div className="bevel relative mb-6 h-56 w-full overflow-hidden border border-white/10 sm:h-64">
          <Image
            src={img}
            alt={block.title}
            fill
            sizes="800px"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-brand/20 mix-blend-color" />
          <div className="scanlines absolute inset-0 opacity-15" />
          <div className="absolute bottom-4 left-4">
            <p className="font-hud text-[10px] uppercase tracking-widest text-accent/70">Behemoth</p>
            <h2 className="font-title text-2xl font-extrabold text-glow-accent sm:text-3xl">
              {block.title}
            </h2>
          </div>
        </div>
      )}

      {/* Contenido */}
      <Panel corners>
        <div className="panel-inner p-5">
          <ContentRenderer text={block.content} />
        </div>
      </Panel>

    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function BehemothsViewer({ section }: { section: SectionContent }) {
  const [seleccionado, setSeleccionado] = useState<Block | null>(null);

  if (seleccionado) {
    return (
      <BehemothDetail
        block={seleccionado}
        onBack={() => setSeleccionado(null)}
      />
    );
  }

  return (
    <div>
      {/* Intro de la sección */}
      {(section.introTitle || section.intro) && (
        <Panel corners className="mb-6">
          <div className="panel-inner p-5">
            {section.introTitle && (
              <h2 className="mb-2 font-title text-lg font-bold text-glow-accent">
                {section.introTitle}
              </h2>
            )}
            {section.intro?.split("\n\n").map((p, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-white/65">{p}</p>
            ))}
          </div>
        </Panel>
      )}

      {/* Grid de behemoths */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {section.blocks.map((block) => (
          <BehemothCard
            key={block.id}
            block={block}
            onClick={() => setSeleccionado(block)}
          />
        ))}
      </div>
    </div>
  );
}
