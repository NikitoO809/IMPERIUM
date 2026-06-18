// Visor de la sección EVENTOS en formato acordeón (cliente).
// En vez de apilar los 10 eventos abiertos (scroll interminable), muestra una
// lista compacta de tarjetas: cada evento cerrado por defecto y se despliega al
// pulsar. Reutiliza RichText y el mismo look HUD que SectionContent.
"use client";

import { useState } from "react";
import Image from "next/image";
import { Panel } from "@/components/hud";
import { RichText } from "@/components/RichText";
import type { SectionContent as SectionData } from "@/lib/sections";

// ── Rejilla de imágenes del evento (object-contain, sin recorte) ──────────────
function EventImages({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="mt-4 flex justify-center">
        <div className="bevel relative h-48 w-48 overflow-hidden border border-white/15 bg-black/40">
          <Image src={images[0]} alt="" fill sizes="192px" unoptimized className="object-contain p-2" />
        </div>
      </div>
    );
  }
  const cols = images.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4";
  return (
    <div className={`mt-4 grid gap-2 ${cols}`}>
      {images.map((src) => (
        <div key={src} className="bevel relative aspect-square overflow-hidden border border-white/10 bg-black/40">
          <Image src={src} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" unoptimized className="object-contain p-1" />
        </div>
      ))}
    </div>
  );
}

export function EventosViewer({ section }: { section: SectionData }) {
  // Índice del evento abierto (-1 = todos cerrados).
  const [open, setOpen] = useState<number>(-1);

  return (
    <div>
      {/* Intro de la sección */}
      {(section.intro || section.introTitle) && (
        <Panel corners className="mb-5">
          <div className="panel-inner p-5">
            {section.introTitle && (
              <h2 className="mb-2 font-title text-lg font-bold text-glow-accent">
                {section.introTitle}
              </h2>
            )}
            {section.intro?.split("\n\n").map((para, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-white/65">{para}</p>
            ))}
          </div>
        </Panel>
      )}

      {/* Pista de uso + contador */}
      <p className="mb-3 hud-label text-[10px] text-white/40">
        {section.blocks.length} eventos · pulsa uno para desplegarlo
      </p>

      {/* Acordeón de eventos */}
      <div className="space-y-2">
        {section.blocks.map((block, i) => {
          const isOpen = open === i;
          const thumb = block.images[0];
          return (
            <Panel key={block.id}>
              <div className="panel-inner">
                {/* Cabecera pulsable */}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-brand/10"
                >
                  {/* Miniatura del evento (si la hay) */}
                  {thumb ? (
                    <div className="bevel relative h-11 w-11 shrink-0 overflow-hidden border border-white/15 bg-black/40">
                      <Image src={thumb} alt="" fill sizes="44px" unoptimized className="object-contain p-0.5" />
                    </div>
                  ) : (
                    <span className="hud-label flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 bg-black/30 text-[10px] text-accent/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}

                  {/* Título */}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-title text-base font-bold">{block.title}</span>
                    {block.isVerified && (
                      <span className="hud-label text-[8px] text-emerald-400/70">✓ verificado</span>
                    )}
                  </span>

                  {/* Chevron / estado */}
                  <span
                    className={`shrink-0 text-accent/70 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    aria-hidden
                  >
                    ▸
                  </span>
                </button>

                {/* Contenido desplegable */}
                {isOpen && (
                  <div className="border-t border-white/10 px-4 pb-4 pt-3">
                    <RichText content={block.content} />
                    <EventImages images={block.images} />
                    {block.sourceUrl && (
                      <a
                        href={block.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block hud-label text-[9px] text-white/30 transition hover:text-accent"
                      >
                        fuente ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
