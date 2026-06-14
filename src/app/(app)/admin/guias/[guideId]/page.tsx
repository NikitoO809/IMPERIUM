// Panel de admin — gestionar una guía: editar sus datos y sus pasos
// (título, contenido, fuente, verificado, imágenes, orden).
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, getAdminGuide } from "@/lib/admin";
import { Panel, HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { labelCls, inputCls, textareaCls, btnPrimary, btnGhost, btnDanger } from "@/components/admin/styles";
import { updateGuide, deleteGuide, createStep, updateStep, deleteStep } from "../../actions";

export default async function AdminGuidePage({
  params,
}: {
  params: Promise<{ guideId: string }>;
}) {
  await requireAdmin();
  const { guideId } = await params;
  const data = await getAdminGuide(guideId);
  if (!data) notFound();
  const { guide, game, steps } = data;

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/admin" className="transition hover:text-accent">Admin</Link>
        <span>/</span>
        <Link href={`/admin/juegos/${guide.gameId}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">{guide.title}</span>
      </div>

      <HudLabel>Editar guía</HudLabel>
      <h1 className="mt-3 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        {guide.title}
      </h1>

      {/* Editar datos de la guía */}
      <Panel corners className="mt-6">
        <div className="panel-inner p-5">
          <form action={updateGuide} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={guide.id} />
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="title">Título</label>
              <input id="title" name="title" defaultValue={guide.title} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="slug">Slug</label>
              <input id="slug" name="slug" defaultValue={guide.slug} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="order_index">Orden</label>
              <input id="order_index" name="order_index" type="number" defaultValue={guide.orderIndex} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="description">Descripción</label>
              <textarea id="description" name="description" defaultValue={guide.description ?? ""} className={textareaCls} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary}>
                <span className="hud-label text-[11px]">Guardar guía</span>
              </button>
            </div>
          </form>
        </div>
      </Panel>

      {/* Pasos */}
      <div className="mb-5 mt-10 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">PASOS ({steps.length})</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <div className="grid gap-4">
        {steps.map((s) => (
          <Panel key={s.id}>
            <div className="panel-inner p-5">
              <form action={updateStep} className="grid gap-3">
                <input type="hidden" name="id" value={s.id} />
                <div className="flex items-center justify-between gap-2">
                  <span className="hud-label text-[9px] text-accent/60">PASO {String(s.orderIndex).padStart(2, "0")}</span>
                  {s.isVerified ? (
                    <span className="hud-label text-[8px] text-emerald-400/80">✓ verificado</span>
                  ) : (
                    <span className="hud-label text-[8px] text-amber-400/70">sin verificar</span>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div>
                    <label className={labelCls}>Título</label>
                    <input name="title" defaultValue={s.title} required className={inputCls} />
                  </div>
                  <div className="sm:w-24">
                    <label className={labelCls}>Orden</label>
                    <input name="order_index" type="number" defaultValue={s.orderIndex} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Contenido (separa párrafos con una línea en blanco)</label>
                  <textarea name="content" defaultValue={s.content ?? ""} className={textareaCls} />
                </div>
                <div>
                  <label className={labelCls}>Fuente (source_url)</label>
                  <input name="source_url" defaultValue={s.sourceUrl ?? ""} className={inputCls} placeholder="https://..." />
                </div>
                <div>
                  <label className={labelCls}>Imágenes (una URL por línea)</label>
                  <textarea name="images" defaultValue={s.images.join("\n")} className={textareaCls} placeholder="https://...jpg" />
                </div>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" name="is_verified" defaultChecked={s.isVerified} className="h-4 w-4 accent-[var(--color-accent,#22e0ff)]" />
                  Verificado (fuente confirmada)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className={btnPrimary}>
                    <span className="hud-label text-[11px]">Guardar paso</span>
                  </button>
                </div>
              </form>
              {/* Borrar paso (formulario aparte) */}
              <form action={deleteStep} className="mt-3 border-t border-white/5 pt-3">
                <input type="hidden" name="id" value={s.id} />
                <ConfirmButton message={`¿Eliminar el paso "${s.title}"?`} className={btnDanger}>
                  <span className="hud-label text-[10px]">Eliminar paso</span>
                </ConfirmButton>
              </form>
            </div>
          </Panel>
        ))}
        {steps.length === 0 && <p className="text-sm text-white/40">Esta guía aún no tiene pasos.</p>}
      </div>

      {/* Crear paso */}
      <Panel corners className="mt-6">
        <div className="panel-inner p-5">
          <h3 className="mb-4 font-title text-base font-bold">Nuevo paso</h3>
          <form action={createStep} className="grid gap-3">
            <input type="hidden" name="guide_id" value={guide.id} />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <label className={labelCls}>Título</label>
                <input name="title" required className={inputCls} />
              </div>
              <div className="sm:w-24">
                <label className={labelCls}>Orden</label>
                <input name="order_index" type="number" defaultValue={steps.length + 1} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Contenido</label>
              <textarea name="content" className={textareaCls} />
            </div>
            <div>
              <label className={labelCls}>Fuente (source_url)</label>
              <input name="source_url" className={inputCls} placeholder="https://..." />
            </div>
            <div>
              <label className={labelCls}>Imágenes (una URL por línea)</label>
              <textarea name="images" className={textareaCls} />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" name="is_verified" className="h-4 w-4" />
              Verificado (fuente confirmada)
            </label>
            <div>
              <button type="submit" className={btnPrimary}>
                <span className="hud-label text-[11px]">Añadir paso</span>
              </button>
            </div>
          </form>
        </div>
      </Panel>

      {/* Zona peligrosa */}
      <Panel className="mt-10">
        <div className="panel-inner flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h3 className="font-title text-sm font-bold text-red-200">Eliminar guía</h3>
            <p className="mt-0.5 text-xs text-white/40">Borra la guía y todos sus pasos. No se puede deshacer.</p>
          </div>
          <form action={deleteGuide}>
            <input type="hidden" name="id" value={guide.id} />
            <input type="hidden" name="game_id" value={guide.gameId} />
            <ConfirmButton message={`¿Eliminar la guía "${guide.title}" y todos sus pasos?`} className={btnDanger}>
              <span className="hud-label text-[10px]">Eliminar guía</span>
            </ConfirmButton>
          </form>
        </div>
      </Panel>

      <div className="mt-8">
        <Link href={`/admin/juegos/${guide.gameId}`} className={btnGhost}>
          <span className="hud-label text-[11px]">◂ Volver al juego</span>
        </Link>
      </div>
    </main>
  );
}
