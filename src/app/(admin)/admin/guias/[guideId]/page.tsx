// Panel de admin — gestionar una guía: portada, intro, pasos con ↑↓.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff, getAdminGuide } from "@/lib/admin";
import { canPublish } from "@/lib/ranks";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";
import { updateGuide, deleteGuide, createStep, updateStep, deleteStep, moveStep } from "../../actions";

export default async function AdminGuidePage({
  params,
}: {
  params: Promise<{ guideId: string }>;
}) {
  const { rank } = await requireStaff();
  const userCanPublish = canPublish(rank);
  const { guideId } = await params;
  const data = await getAdminGuide(guideId);
  if (!data) notFound();
  const { guide, game, steps } = data;

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <nav className="mb-1 flex items-center gap-1.5 font-hud text-[10px] text-white/35">
          <Link href="/admin" className="hover:text-accent transition-colors">Panel</Link>
          <span>/</span>
          <Link href={`/admin/juegos/${guide.gameId}`} className="hover:text-accent transition-colors">{game.name}</Link>
          <span>/</span>
          <span className="text-white/60">{guide.title}</span>
        </nav>
        <HudLabel>Editar guía</HudLabel>
        <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
          {guide.title}
        </h1>
      </header>

      {/* Contenido en dos columnas */}
      <div className="flex flex-1 gap-0 overflow-auto">

        {/* Col izq: info + portada */}
        <div className="w-72 shrink-0 overflow-auto border-r border-white/8 px-6 py-6">
          <form action={updateGuide} className="grid gap-4">
            <input type="hidden" name="id" value={guide.id} />
            <input type="hidden" name="order_index" value={guide.orderIndex} />

            <div>
              <label className={labelCls}>Título</label>
              <input name="title" defaultValue={guide.title} required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Descripción</label>
              <textarea name="description" defaultValue={guide.description ?? ""} className={textareaCls} rows={2} />
            </div>

            <div className="border-t border-white/8 pt-4">
              <p className="mb-2 font-title text-[9px] font-bold tracking-widest text-white/35">
                PORTADA
              </p>
              <label className={labelCls}>Imagen de portada (URL)</label>
              <p className="mb-1.5 text-[10px] text-white/30">
                Aparece en la tarjeta de la guía.
              </p>
              <ImagePreview
                name="cover_image"
                defaultValue={guide.introImages[0] ?? ""}
                placeholder="https://..."
              />
              <input type="hidden" name="extra_images" value={guide.introImages.slice(1).join("\n")} />
            </div>

            <div className="border-t border-white/8 pt-4">
              <p className="mb-2 font-title text-[9px] font-bold tracking-widest text-white/35">
                PRESENTACIÓN
              </p>
              <label className={labelCls}>Título introductorio</label>
              <input
                name="intro_title"
                defaultValue={guide.introTitle ?? ""}
                className={inputCls}
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className={labelCls}>Texto de presentación</label>
              <textarea
                name="intro"
                defaultValue={guide.intro ?? ""}
                className={textareaCls}
                rows={3}
                placeholder="Opcional"
              />
            </div>

            <button type="submit" className={btnPrimary}>
              <span className="hud-label text-[11px]">Guardar guía</span>
            </button>
          </form>

          {/* Zona peligrosa — solo admin/supremo */}
          {userCanPublish && (
            <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="mb-2 font-title text-[10px] font-bold text-red-300/80">Eliminar guía</p>
              <form action={deleteGuide}>
                <input type="hidden" name="id" value={guide.id} />
                <input type="hidden" name="game_id" value={guide.gameId} />
                <ConfirmButton
                  message={`¿Eliminar "${guide.title}" y todos sus pasos?`}
                  className={btnDanger}
                >
                  <span className="hud-label text-[10px]">Eliminar guía</span>
                </ConfirmButton>
              </form>
            </div>
          )}
        </div>

        {/* Col der: pasos */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-title text-[10px] font-bold tracking-[0.2em] text-white/40">
              PASOS ({steps.length})
            </h2>
          </div>

          <div className="space-y-3">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                className="overflow-hidden rounded-lg border border-white/10 bg-black/30"
              >
                {/* Cabecera del paso */}
                <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.02] px-5 py-2.5">
                  <div className="flex gap-1">
                    {idx > 0 && (
                      <form action={moveStep}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="direction" value="up" />
                        <input type="hidden" name="guide_id" value={guide.id} />
                        <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↑</button>
                      </form>
                    )}
                    {idx < steps.length - 1 && (
                      <form action={moveStep}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="direction" value="down" />
                        <input type="hidden" name="guide_id" value={guide.id} />
                        <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↓</button>
                      </form>
                    )}
                  </div>
                  <span className="font-hud text-[10px] text-accent/60">
                    PASO {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 truncate font-hud text-sm text-white/70">{s.title}</span>
                  {s.isVerified && (
                    <span className="font-hud text-[9px] text-emerald-400/70">✓ verificado</span>
                  )}
                </div>

                {/* Formulario */}
                <form id={`step-${s.id}`} action={updateStep} className="grid gap-3 p-5 sm:grid-cols-2">
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="order_index" value={s.orderIndex} />

                  <div className="sm:col-span-2">
                    <label className={labelCls}>Título</label>
                    <input name="title" defaultValue={s.title} required className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Contenido</label>
                    <textarea name="content" defaultValue={s.content ?? ""} className={textareaCls} rows={3} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Imagen principal</label>
                    <ImagePreview name="main_image" defaultValue={s.images[0] ?? ""} placeholder="https://..." />
                    <input type="hidden" name="extra_images" value={s.images.slice(1).join("\n")} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Fuente</label>
                    <input name="source_url" defaultValue={s.sourceUrl ?? ""} className={inputCls} placeholder="https://..." />
                  </div>
                  <label className="sm:col-span-2 flex cursor-pointer items-center gap-2 text-sm text-white/65">
                    <input type="checkbox" name="is_verified" defaultChecked={s.isVerified} className="h-3.5 w-3.5 accent-[#22e0ff]" />
                    Verificado
                  </label>
                </form>
                <div className="flex flex-wrap items-center gap-4 px-5 pb-5">
                  <button type="submit" form={`step-${s.id}`} className={btnPrimary}>
                    <span className="hud-label text-[10px]">Guardar paso</span>
                  </button>
                  <form action={deleteStep}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmButton message={`¿Eliminar "${s.title}"?`} className={btnDanger}>
                      <span className="hud-label text-[9px]">Eliminar</span>
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}

            {steps.length === 0 && (
              <p className="text-sm text-white/35">Sin pasos todavía.</p>
            )}
          </div>

          {/* Nuevo paso */}
          <details className="mt-4 group">
            <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-3 text-left">
              <span className="font-bold text-accent">+</span>
              <span className="hud-label text-[10px]">NUEVO PASO</span>
            </summary>
            <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-5">
              <form action={createStep} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="guide_id" value={guide.id} />
                <input type="hidden" name="order_index" value={steps.length + 1} />
                <div className="sm:col-span-2">
                  <label className={labelCls}>Título</label>
                  <input name="title" required className={inputCls} placeholder="Ej: Reclutar tu primer héroe" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Contenido</label>
                  <textarea name="content" className={textareaCls} rows={3} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Imagen principal</label>
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
                    <span className="hud-label text-[10px]">Añadir paso</span>
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
