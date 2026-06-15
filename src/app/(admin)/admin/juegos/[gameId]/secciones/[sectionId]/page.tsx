// Panel de admin — gestionar una sección y sus bloques de contenido.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, getAdminSection } from "@/lib/admin";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";
import { updateSection, deleteSection, createBlock, updateBlock, deleteBlock, moveBlock } from "../../../../actions";

const RENDER_TYPES = [
  { value: "generic", label: "Solo texto / tarjetas" },
  { value: "tier-list", label: "Tier list" },
  { value: "artifact-table", label: "Tabla de artefactos" },
  { value: "behemoth", label: "Behemoths" },
  { value: "builds", label: "Builds" },
  { value: "class-tier", label: "Tier list por clase" },
];

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ gameId: string; sectionId: string }>;
}) {
  await requireAdmin();
  const { gameId, sectionId } = await params;
  const data = await getAdminSection(sectionId);
  if (!data) notFound();
  const { section, game, blocks } = data;

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <nav className="mb-1 flex items-center gap-1.5 font-hud text-[10px] text-white/35">
          <Link href="/admin" className="hover:text-accent transition-colors">Panel</Link>
          <span>/</span>
          <Link href={`/admin/juegos/${gameId}`} className="hover:text-accent transition-colors">{game.name}</Link>
          <span>/</span>
          <span className="text-white/60">{section.title}</span>
        </nav>
        <HudLabel>Editar sección</HudLabel>
        <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
          {section.title}
        </h1>
      </header>

      {/* Contenido en dos columnas */}
      <div className="flex flex-1 gap-0 overflow-auto">

        {/* Col izq: configuración */}
        <div className="w-72 shrink-0 overflow-auto border-r border-white/8 px-6 py-6">
          <p className="mb-3 font-title text-[9px] font-bold tracking-widest text-white/35">
            CONFIGURACIÓN
          </p>
          <form action={updateSection} className="grid gap-3">
            <input type="hidden" name="id" value={section.id} />
            <div>
              <label className={labelCls}>Nombre</label>
              <input name="title" defaultValue={section.title} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Dirección web (slug)</label>
              <input name="slug" defaultValue={section.slug} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tipo de contenido</label>
              <select name="render_type" defaultValue={section.renderType} className={inputCls}>
                {RENDER_TYPES.map((rt) => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Posición en el Hub</label>
              <input name="order_index" type="number" defaultValue={section.orderIndex} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Título introductorio</label>
              <input name="intro_title" defaultValue={section.introTitle ?? ""} className={inputCls} placeholder="Opcional" />
            </div>
            <div>
              <label className={labelCls}>Texto de introducción</label>
              <textarea name="intro" defaultValue={section.intro ?? ""} className={textareaCls} rows={3} placeholder="Opcional" />
            </div>
            <button type="submit" className={btnPrimary}>
              <span className="hud-label text-[10px]">Guardar configuración</span>
            </button>
          </form>

          {/* Zona peligrosa */}
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="mb-2 font-title text-[10px] font-bold text-red-300/80">Eliminar sección</p>
            <form action={deleteSection}>
              <input type="hidden" name="id" value={section.id} />
              <input type="hidden" name="game_id" value={gameId} />
              <ConfirmButton
                message={`¿Eliminar "${section.title}" y todos sus bloques?`}
                className={btnDanger}
              >
                <span className="hud-label text-[10px]">Eliminar</span>
              </ConfirmButton>
            </form>
          </div>
        </div>

        {/* Col der: bloques */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-title text-[10px] font-bold tracking-[0.2em] text-white/40">
              BLOQUES ({blocks.length})
            </h2>
          </div>

          <div className="space-y-3">
            {blocks.map((b, idx) => (
              <div key={b.id} className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
                {/* Cabecera */}
                <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.02] px-5 py-2.5">
                  <div className="flex gap-1">
                    {idx > 0 && (
                      <form action={moveBlock}>
                        <input type="hidden" name="id" value={b.id} />
                        <input type="hidden" name="direction" value="up" />
                        <input type="hidden" name="section_id" value={section.id} />
                        <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↑</button>
                      </form>
                    )}
                    {idx < blocks.length - 1 && (
                      <form action={moveBlock}>
                        <input type="hidden" name="id" value={b.id} />
                        <input type="hidden" name="direction" value="down" />
                        <input type="hidden" name="section_id" value={section.id} />
                        <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↓</button>
                      </form>
                    )}
                  </div>
                  <span className="font-hud text-[10px] text-accent/60">#{String(idx + 1).padStart(2, "0")}</span>
                  <span className="flex-1 truncate font-hud text-sm text-white/70">{b.title}</span>
                  {b.isVerified && <span className="font-hud text-[9px] text-emerald-400/70">✓</span>}
                </div>

                {/* Form */}
                <form action={updateBlock} className="grid gap-3 p-5 sm:grid-cols-2">
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="order_index" value={b.orderIndex} />
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Título</label>
                    <input name="title" defaultValue={b.title} required className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Contenido</label>
                    <textarea name="content" defaultValue={b.content} className={textareaCls} rows={3} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Imagen</label>
                    <ImagePreview name="main_image" defaultValue={b.images[0] ?? ""} placeholder="https://..." />
                    <input type="hidden" name="extra_images" value={b.images.slice(1).join("\n")} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Fuente</label>
                    <input name="source_url" defaultValue={b.sourceUrl ?? ""} className={inputCls} placeholder="https://..." />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/65">
                      <input type="checkbox" name="is_verified" defaultChecked={b.isVerified} className="h-3.5 w-3.5 accent-[#22e0ff]" />
                      Verificado
                    </label>
                    <button type="submit" className={btnPrimary}>
                      <span className="hud-label text-[10px]">Guardar bloque</span>
                    </button>
                    <form action={deleteBlock}>
                      <input type="hidden" name="id" value={b.id} />
                      <ConfirmButton message={`¿Eliminar "${b.title}"?`} className={btnDanger}>
                        <span className="hud-label text-[9px]">Eliminar</span>
                      </ConfirmButton>
                    </form>
                  </div>
                </form>
              </div>
            ))}
            {blocks.length === 0 && <p className="text-sm text-white/35">Sin bloques todavía.</p>}
          </div>

          {/* Nuevo bloque */}
          <details className="mt-4 group">
            <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-3 text-left">
              <span className="font-bold text-accent">+</span>
              <span className="hud-label text-[10px]">NUEVO BLOQUE</span>
            </summary>
            <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-5">
              <form action={createBlock} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="section_id" value={section.id} />
                <input type="hidden" name="order_index" value={blocks.length + 1} />
                <div className="sm:col-span-2">
                  <label className={labelCls}>Título</label>
                  <input name="title" required className={inputCls} placeholder="Ej: IMPERIUMCODE25" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Contenido</label>
                  <textarea name="content" className={textareaCls} rows={3} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Imagen</label>
                  <ImagePreview name="main_image" placeholder="https://..." />
                  <input type="hidden" name="extra_images" value="" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Fuente</label>
                  <input name="source_url" className={inputCls} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2 flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-white/65">
                    <input type="checkbox" name="is_verified" className="h-3.5 w-3.5 accent-[#22e0ff]" />
                    Verificado
                  </label>
                  <button type="submit" className={btnPrimary}>
                    <span className="hud-label text-[10px]">Añadir bloque</span>
                  </button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
