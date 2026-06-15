// Panel de admin — editar la sección "Nosotros":
// descripción general, hitos de la historia y administradores.
import { requirePublisher } from "@/lib/admin";
import { getAboutContent } from "@/lib/about";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";
import {
  updateAboutIntro,
  createTimelineItem,
  updateTimelineItem,
  moveTimelineItem,
  deleteTimelineItem,
  createAboutAdmin,
  updateAboutAdmin,
  moveAboutAdmin,
  deleteAboutAdmin,
} from "../actions";

export default async function AdminNosotrosPage() {
  await requirePublisher();
  const about = await getAboutContent();
  const intro = about?.intro ?? "";
  const timeline = about?.timeline ?? [];
  const admins = about?.admins ?? [];

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <HudLabel>Contenido del sitio</HudLabel>
        <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
          Sección &ldquo;Nosotros&rdquo;
        </h1>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">

        {/* ── Descripción general ── */}
        <section className="mb-8">
          <h2 className="mb-3 font-title text-[10px] font-bold tracking-[0.2em] text-white/40">
            DESCRIPCIÓN GENERAL
          </h2>
          <div className="rounded-lg border border-white/10 bg-black/30 p-5">
            <form action={updateAboutIntro} className="grid gap-3">
              <div>
                <label className={labelCls}>Texto de presentación de la comunidad</label>
                <textarea
                  name="intro"
                  defaultValue={intro}
                  className={textareaCls}
                  rows={4}
                  placeholder="IMPERIUM es una comunidad de jugadores de Discord..."
                />
              </div>
              <div>
                <button type="submit" className={btnPrimary}>
                  <span className="hud-label text-[11px]">Guardar descripción</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ── Dos columnas: historia + administradores ── */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* ── Historia ── */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-title text-[10px] font-bold tracking-[0.2em] text-white/40">
                HISTORIA ({timeline.length})
              </h2>
            </div>

            <div className="space-y-3">
              {timeline.map((item, idx) => (
                <div key={item.id} className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
                  <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.02] px-4 py-2">
                    <div className="flex gap-1">
                      {idx > 0 && (
                        <form action={moveTimelineItem}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="direction" value="up" />
                          <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↑</button>
                        </form>
                      )}
                      {idx < timeline.length - 1 && (
                        <form action={moveTimelineItem}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="direction" value="down" />
                          <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↓</button>
                        </form>
                      )}
                    </div>
                    <span className="font-hud text-[10px] text-accent/60">{item.year}</span>
                    <span className="flex-1 truncate font-hud text-sm text-white/70">{item.title}</span>
                  </div>
                  <form id={`tl-${item.id}`} action={updateTimelineItem} className="grid gap-3 px-4 pt-4">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="order_index" value={item.orderIndex} />
                    <div className="grid gap-3 sm:grid-cols-[100px_1fr]">
                      <div>
                        <label className={labelCls}>Año</label>
                        <input name="year" defaultValue={item.year} required className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Título</label>
                        <input name="title" defaultValue={item.title} required className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Descripción</label>
                      <textarea name="description" defaultValue={item.description ?? ""} className={textareaCls} rows={2} />
                    </div>
                  </form>
                  <div className="flex items-center gap-3 px-4 pb-4 pt-3">
                    <button type="submit" form={`tl-${item.id}`} className={btnPrimary}>
                      <span className="hud-label text-[10px]">Guardar</span>
                    </button>
                    <form action={deleteTimelineItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmButton message={`¿Eliminar el hito "${item.title}"?`} className={btnDanger}>
                        <span className="hud-label text-[9px]">Eliminar</span>
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && <p className="text-sm text-white/35">Sin hitos todavía.</p>}
            </div>

            {/* Nuevo hito */}
            <details className="mt-3 group">
              <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-2.5 text-left">
                <span className="font-bold text-accent">+</span>
                <span className="hud-label text-[10px]">NUEVO HITO</span>
              </summary>
              <div className="mt-2 rounded-lg border border-white/10 bg-black/30 p-4">
                <form action={createTimelineItem} className="grid gap-3">
                  <input type="hidden" name="order_index" value={timeline.length + 1} />
                  <div className="grid gap-3 sm:grid-cols-[100px_1fr]">
                    <div>
                      <label className={labelCls}>Año</label>
                      <input name="year" required className={inputCls} placeholder="2026" />
                    </div>
                    <div>
                      <label className={labelCls}>Título</label>
                      <input name="title" required className={inputCls} placeholder="Ej: Llega un nuevo juego" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Descripción</label>
                    <textarea name="description" className={textareaCls} rows={2} />
                  </div>
                  <button type="submit" className={btnPrimary}>
                    <span className="hud-label text-[10px]">Añadir hito</span>
                  </button>
                </form>
              </div>
            </details>
          </section>

          {/* ── Administradores ── */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-title text-[10px] font-bold tracking-[0.2em] text-white/40">
                ADMINISTRADORES ({admins.length})
              </h2>
            </div>

            <div className="space-y-3">
              {admins.map((m, idx) => (
                <div key={m.id} className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
                  <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.02] px-4 py-2">
                    <div className="flex gap-1">
                      {idx > 0 && (
                        <form action={moveAboutAdmin}>
                          <input type="hidden" name="id" value={m.id} />
                          <input type="hidden" name="direction" value="up" />
                          <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↑</button>
                        </form>
                      )}
                      {idx < admins.length - 1 && (
                        <form action={moveAboutAdmin}>
                          <input type="hidden" name="id" value={m.id} />
                          <input type="hidden" name="direction" value="down" />
                          <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↓</button>
                        </form>
                      )}
                    </div>
                    <span className="flex-1 truncate font-hud text-sm text-white/70">{m.name}</span>
                    <span className="font-hud text-[9px] text-accent/60">{m.role}</span>
                  </div>
                  <form id={`adm-${m.id}`} action={updateAboutAdmin} className="grid gap-3 px-4 pt-4">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="order_index" value={m.orderIndex} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Nombre</label>
                        <input name="name" defaultValue={m.name} required className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Rol</label>
                        <input name="role" defaultValue={m.role} required className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Biografía</label>
                      <textarea name="bio" defaultValue={m.bio ?? ""} className={textareaCls} rows={2} />
                    </div>
                    <div>
                      <label className={labelCls}>Foto / avatar</label>
                      <ImagePreview name="avatar_url" defaultValue={m.avatarUrl ?? ""} placeholder="https://... (opcional)" />
                    </div>
                  </form>
                  <div className="flex items-center gap-3 px-4 pb-4 pt-3">
                    <button type="submit" form={`adm-${m.id}`} className={btnPrimary}>
                      <span className="hud-label text-[10px]">Guardar</span>
                    </button>
                    <form action={deleteAboutAdmin}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton message={`¿Eliminar a "${m.name}"?`} className={btnDanger}>
                        <span className="hud-label text-[9px]">Eliminar</span>
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              ))}
              {admins.length === 0 && <p className="text-sm text-white/35">Sin administradores todavía.</p>}
            </div>

            {/* Nuevo admin */}
            <details className="mt-3 group">
              <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-2.5 text-left">
                <span className="font-bold text-accent">+</span>
                <span className="hud-label text-[10px]">NUEVO ADMINISTRADOR</span>
              </summary>
              <div className="mt-2 rounded-lg border border-white/10 bg-black/30 p-4">
                <form action={createAboutAdmin} className="grid gap-3">
                  <input type="hidden" name="order_index" value={admins.length + 1} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Nombre</label>
                      <input name="name" required className={inputCls} placeholder="Ej: Miguel" />
                    </div>
                    <div>
                      <label className={labelCls}>Rol</label>
                      <input name="role" required className={inputCls} placeholder="Ej: Fundador / Líder" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Biografía</label>
                    <textarea name="bio" className={textareaCls} rows={2} />
                  </div>
                  <div>
                    <label className={labelCls}>Foto / avatar (URL)</label>
                    <ImagePreview name="avatar_url" placeholder="https://... (opcional)" />
                  </div>
                  <button type="submit" className={btnPrimary}>
                    <span className="hud-label text-[10px]">Añadir administrador</span>
                  </button>
                </form>
              </div>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
}
