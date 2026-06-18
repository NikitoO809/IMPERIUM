// Panel de admin — editar la sección "Nosotros":
// descripción general, hitos de la historia y administradores.
import { requirePublisher } from "@/lib/admin";
import { getAboutContent } from "@/lib/about";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { CardPreviewButton } from "@/components/admin/CardPreviewButton";
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
  const quote = about?.quote ?? "";
  const games = about?.games ?? [];
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
            <form id="about-intro" action={updateAboutIntro} className="grid gap-3">
              <div>
                <label className={labelCls}>Texto de presentación de la comunidad</label>
                <textarea
                  name="intro"
                  defaultValue={intro}
                  className={textareaCls}
                  rows={6}
                  placeholder="IMPERIUM nació en 2006 en Silkroad Online..."
                />
                <p className="mt-1 font-hud text-[10px] text-white/30">
                  Deja una línea en blanco entre párrafos para separarlos.
                </p>
              </div>
              <div>
                <label className={labelCls}>Nuestro recorrido (juegos) — uno por línea</label>
                <textarea
                  name="games"
                  defaultValue={games.join("\n")}
                  className={textareaCls}
                  rows={5}
                  placeholder={"Silkroad Online\nBlade & Soul\nMIR4"}
                />
                <p className="mt-1 font-hud text-[10px] text-white/30">
                  Cada juego aparece como una etiqueta en la página.
                </p>
              </div>
              <div>
                <label className={labelCls}>Frase de cierre (la última línea se resalta en grande)</label>
                <textarea
                  name="quote"
                  defaultValue={quote}
                  className={textareaCls}
                  rows={4}
                  placeholder={"Porque los juegos cambian. Los servidores desaparecen.\nPero IMPERIUM permanece."}
                />
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" className={btnPrimary}>
                  <span className="hud-label text-[11px]">Guardar descripción</span>
                </button>
                <CardPreviewButton formId="about-intro" fields={{ text: "intro" }} />
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
                <details key={item.id} className="group overflow-hidden rounded-lg border border-white/10 bg-black/30">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.02]">
                    <span className="font-hud text-[10px] text-accent/60">{item.year}</span>
                    <span className="flex-1 truncate font-hud text-sm text-white/70">{item.title}</span>
                    <span className="text-white/30 transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <div className="border-t border-white/8 px-4 pt-3">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-hud text-[9px] tracking-widest text-white/25">ORDEN</span>
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
                  <form id={`tl-${item.id}`} action={updateTimelineItem} className="grid gap-3">
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
                  <div className="flex items-center gap-3 pb-4 pt-3">
                    <button type="submit" form={`tl-${item.id}`} className={btnPrimary}>
                      <span className="hud-label text-[10px]">Guardar</span>
                    </button>
                    <CardPreviewButton formId={`tl-${item.id}`} fields={{ title: "title", badge: "year", text: "description" }} />
                    <form action={deleteTimelineItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmButton message={`¿Eliminar el hito "${item.title}"?`} className={btnDanger}>
                        <span className="hud-label text-[9px]">Eliminar</span>
                      </ConfirmButton>
                    </form>
                  </div>
                  </div>
                </details>
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
                <form id="tl-new" action={createTimelineItem} className="grid gap-3">
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
                  <div className="flex items-center gap-3">
                    <CardPreviewButton formId="tl-new" fields={{ title: "title", badge: "year", text: "description" }} />
                    <button type="submit" className={btnPrimary}>
                      <span className="hud-label text-[10px]">Añadir hito</span>
                    </button>
                  </div>
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
                <details key={m.id} className="group overflow-hidden rounded-lg border border-white/10 bg-black/30">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.02]">
                    <span className="flex-1 truncate font-hud text-sm text-white/70">{m.name}</span>
                    <span className="font-hud text-[9px] text-accent/60">{m.role}</span>
                    <span className="text-white/30 transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <div className="border-t border-white/8 px-4 pt-3">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-hud text-[9px] tracking-widest text-white/25">ORDEN</span>
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
                  <form id={`adm-${m.id}`} action={updateAboutAdmin} className="grid gap-3">
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
                      <div>
                        <label className={labelCls}>Nivel en el organigrama</label>
                        <select name="tier" defaultValue={String(m.tier)} className={inputCls}>
                          <option value="0">Líder</option>
                          <option value="1">Administración</option>
                          <option value="2">Moderación</option>
                        </select>
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
                  <div className="flex items-center gap-3 pb-4 pt-3">
                    <button type="submit" form={`adm-${m.id}`} className={btnPrimary}>
                      <span className="hud-label text-[10px]">Guardar</span>
                    </button>
                    <CardPreviewButton formId={`adm-${m.id}`} variant="person" fields={{ image: "avatar_url", title: "name", subtitle: "role", text: "bio" }} />
                    <form action={deleteAboutAdmin}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton message={`¿Eliminar a "${m.name}"?`} className={btnDanger}>
                        <span className="hud-label text-[9px]">Eliminar</span>
                      </ConfirmButton>
                    </form>
                  </div>
                  </div>
                </details>
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
                <form id="adm-new" action={createAboutAdmin} className="grid gap-3">
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
                    <div>
                      <label className={labelCls}>Nivel en el organigrama</label>
                      <select name="tier" defaultValue="1" className={inputCls}>
                        <option value="0">Líder</option>
                        <option value="1">Administración</option>
                        <option value="2">Moderación</option>
                      </select>
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
                  <div className="flex items-center gap-3">
                    <CardPreviewButton formId="adm-new" variant="person" fields={{ image: "avatar_url", title: "name", subtitle: "role", text: "bio" }} />
                    <button type="submit" className={btnPrimary}>
                      <span className="hud-label text-[10px]">Añadir administrador</span>
                    </button>
                  </div>
                </form>
              </div>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
}
