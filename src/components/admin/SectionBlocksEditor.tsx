"use client";

// Editor de bloques de una sección con patrón ÍNDICE + EDITOR (master-detail):
// a la izquierda la lista de todos los bloques (siempre visible), a la derecha
// SOLO el bloque seleccionado en edición. Pensado para secciones grandes
// (p. ej. 264 habilidades) sin scroll infinito.
import { useState } from "react";
import Image from "next/image";
import type { AdminBlock } from "@/lib/admin";
import { createBlock, updateBlock, deleteBlock, moveBlock } from "@/app/(admin)/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { PreviewButton } from "@/components/admin/PreviewButton";
import { FormatHint } from "@/components/admin/FormatHint";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";

export function SectionBlocksEditor({
  sectionId,
  blocks,
}: {
  sectionId: string;
  blocks: AdminBlock[];
}) {
  // null = nada; "new" = creando bloque; un id = editando ese bloque.
  const [selected, setSelected] = useState<string | null>(blocks[0]?.id ?? null);

  // El bloque actual (recalculado en cada render: si se borró, cae a null).
  const current = selected && selected !== "new" ? blocks.find((b) => b.id === selected) ?? null : null;
  const idx = current ? blocks.findIndex((b) => b.id === current.id) : -1;
  const verifiedCount = blocks.filter((b) => b.isVerified).length;
  const withImgCount = blocks.filter((b) => b.images.length > 0).length;

  return (
    <div className="grid gap-4 md:grid-cols-[clamp(220px,24vw,300px)_1fr]">
      {/* ── ÍNDICE: lista de bloques ── */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-black/20">
        <div className="flex items-center justify-between border-b border-white/8 px-3 py-2.5">
          <span className="font-title text-[10px] font-bold tracking-[0.18em] text-white/45">
            BLOQUES ({blocks.length})
          </span>
          <button
            type="button"
            onClick={() => setSelected("new")}
            className={`btn-hud px-2 py-1 ${selected === "new" ? "bg-brand text-white" : "bg-white/10 text-white/70 hover:text-white"}`}
          >
            <span className="hud-label text-[9px]">+ Nuevo</span>
          </button>
        </div>
        {/* Resumen rápido de la sección */}
        <div className="border-b border-white/8 px-3 py-1.5 font-hud text-[9px] text-white/35">
          {verifiedCount} verificados · {withImgCount} con imagen
        </div>
        {/* Lista */}
        <div className="max-h-[64vh] overflow-y-auto p-1.5">
          {blocks.length === 0 && (
            <p className="px-2 py-3 text-xs text-white/30">Sin bloques. Crea el primero con “+ Nuevo”.</p>
          )}
          {blocks.map((b, i) => {
            const isSel = b.id === selected;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelected(b.id)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
                  isSel ? "bg-brand/25 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/85"
                }`}
              >
                <span className="font-hud text-[9px] text-accent/50">{String(i + 1).padStart(2, "0")}</span>
                {b.images[0] ? (
                  <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded border border-white/10 bg-black/40">
                    <Image src={b.images[0]} alt="" fill sizes="28px" unoptimized className="object-contain p-0.5" />
                  </span>
                ) : (
                  <span className="h-7 w-7 shrink-0 rounded border border-white/5 bg-white/[0.02]" />
                )}
                <span className="min-w-0 flex-1 truncate font-hud text-[13px]">{b.title}</span>
                {b.isVerified && <span className="text-[10px] text-emerald-400/70">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── EDITOR: bloque seleccionado o "nuevo" ── */}
      <div className="min-w-0">
        {selected === "new" ? (
          // Crear bloque nuevo
          <div key="new" className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
            <div className="border-b border-white/8 bg-white/[0.02] px-5 py-2.5">
              <span className="hud-label text-[10px] text-accent/70">NUEVO BLOQUE</span>
            </div>
            <form id="block-new" action={createBlock} className="grid gap-3 p-5 sm:grid-cols-2">
              <input type="hidden" name="section_id" value={sectionId} />
              <input type="hidden" name="order_index" value={blocks.length + 1} />
              <input type="hidden" name="extra_images" value="" />
              <div className="sm:col-span-2">
                <label className={labelCls}>Título</label>
                <input name="title" required className={inputCls} placeholder="Ej: T6 · Nueva región" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Contenido</label>
                <textarea name="content" className={textareaCls} rows={5} />
                <FormatHint />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Imagen</label>
                <ImagePreview name="main_image" placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Fuente</label>
                <input name="source_url" className={inputCls} placeholder="https://..." />
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/65">
                  <input type="checkbox" name="is_verified" className="h-3.5 w-3.5 accent-[#22e0ff]" />
                  Verificado
                </label>
                <PreviewButton formId="block-new" />
                <button type="submit" className={btnPrimary}>
                  <span className="hud-label text-[10px]">Añadir bloque</span>
                </button>
              </div>
            </form>
          </div>
        ) : current ? (
          // Editar bloque seleccionado. key fuerza el re-montaje al cambiar de
          // bloque, para que los campos (defaultValue) muestren sus datos.
          <div key={current.id} className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
            <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-white/[0.02] px-5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="font-hud text-[10px] text-accent/60">#{String(idx + 1).padStart(2, "0")}</span>
                <span className="truncate font-hud text-sm text-white/80">{current.title}</span>
              </div>
              {/* Reordenar */}
              <div className="flex gap-1">
                {idx > 0 && (
                  <form action={moveBlock}>
                    <input type="hidden" name="id" value={current.id} />
                    <input type="hidden" name="direction" value="up" />
                    <input type="hidden" name="section_id" value={sectionId} />
                    <button type="submit" title="Subir" className="btn-hud px-2 py-0.5 text-[11px] text-white/45 hover:text-white">↑</button>
                  </form>
                )}
                {idx < blocks.length - 1 && (
                  <form action={moveBlock}>
                    <input type="hidden" name="id" value={current.id} />
                    <input type="hidden" name="direction" value="down" />
                    <input type="hidden" name="section_id" value={sectionId} />
                    <button type="submit" title="Bajar" className="btn-hud px-2 py-0.5 text-[11px] text-white/45 hover:text-white">↓</button>
                  </form>
                )}
              </div>
            </div>

            <form id={`block-${current.id}`} action={updateBlock} className="grid gap-3 p-5 sm:grid-cols-2">
              <input type="hidden" name="id" value={current.id} />
              <input type="hidden" name="order_index" value={current.orderIndex} />
              <div className="sm:col-span-2">
                <label className={labelCls}>Título</label>
                <input name="title" defaultValue={current.title} required className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Contenido</label>
                <textarea name="content" defaultValue={current.content} className={textareaCls} rows={6} />
                <FormatHint />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Imagen</label>
                <ImagePreview name="main_image" defaultValue={current.images[0] ?? ""} placeholder="https://..." />
                <input type="hidden" name="extra_images" value={current.images.slice(1).join("\n")} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Fuente</label>
                <input name="source_url" defaultValue={current.sourceUrl ?? ""} className={inputCls} placeholder="https://..." />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/65 sm:col-span-2">
                <input type="checkbox" name="is_verified" defaultChecked={current.isVerified} className="h-3.5 w-3.5 accent-[#22e0ff]" />
                Verificado
              </label>
            </form>

            <div className="flex flex-wrap items-center gap-4 px-5 pb-5">
              <button type="submit" form={`block-${current.id}`} className={btnPrimary}>
                <span className="hud-label text-[10px]">Guardar bloque</span>
              </button>
              <PreviewButton formId={`block-${current.id}`} />
              <form action={deleteBlock}>
                <input type="hidden" name="id" value={current.id} />
                <ConfirmButton message={`¿Eliminar "${current.title}"?`} className={btnDanger}>
                  <span className="hud-label text-[9px]">Eliminar</span>
                </ConfirmButton>
              </form>
            </div>
          </div>
        ) : (
          // Nada seleccionado
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-white/30">
            Elige un bloque de la lista para editarlo.
          </div>
        )}
      </div>
    </div>
  );
}
