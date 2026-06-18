// Panel de admin — Comunidad: MURO DE LOGROS (hazañas de los juegos que jugamos,
// con imágenes y vídeos). Crear / editar / mostrar-ocultar / borrar. Solo
// admin/supremo (los cambios de admin pasan por la cola de aprobación).
import { requirePublisher } from "@/lib/admin";
import { getAdminCommunityAchievements, getAdminTopPlayers } from "@/lib/community";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { MediaListField } from "@/components/admin/MediaListField";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";
import {
  createAchievement,
  updateAchievement,
  setAchievementPublished,
  deleteAchievement,
  createTopPlayer,
  updateTopPlayer,
  setTopPlayerPublished,
  moveTopPlayer,
  deleteTopPlayer,
} from "../actions";

const mediaSummary = (imgs: number, vids: number) => {
  const parts: string[] = [];
  if (imgs) parts.push(`${imgs} ${imgs === 1 ? "imagen" : "imágenes"}`);
  if (vids) parts.push(`${vids} ${vids === 1 ? "vídeo" : "vídeos"}`);
  return parts.join(" · ") || "sin medios";
};

export default async function AdminComunidadPage() {
  await requirePublisher();
  const [achievements, topPlayers] = await Promise.all([
    getAdminCommunityAchievements(),
    getAdminTopPlayers(),
  ]);
  const published = achievements.filter((a) => a.isPublished).length;

  return (
    <div className="flex h-full flex-col">
      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Comunidad</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              Muro de logros
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold text-glow-brand">{achievements.length}</div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">LOGROS</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold" style={{ color: "#22e0ff" }}>{published}</div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">VISIBLES</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">
        <p className="mb-4 text-xs text-white/40">
          Estos logros se muestran en la página <span className="text-white/60">Comunidad</span>, de lo más
          reciente a lo más antiguo. Cada logro lleva título, descripción, el juego, quién lo consiguió, la
          fecha y las <span className="text-white/60">imágenes y vídeos</span> (enlace de YouTube o archivo subido).
        </p>

        {/* Lista de logros */}
        <div className="space-y-3">
          {achievements.map((a) => (
            <details key={a.id} className="group overflow-hidden rounded-lg border border-white/10 bg-black/30">
              {/* Cabecera */}
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: a.accent, boxShadow: `0 0 8px ${a.accent}` }}
                />
                <span className="flex-1 truncate font-hud text-sm text-white/85">{a.title}</span>
                {a.game && <span className="hidden font-hud text-[10px] text-white/35 sm:inline">{a.game}</span>}
                <span className="hidden font-hud text-[10px] text-white/25 md:inline">{mediaSummary(a.images.length, a.videos.length)}</span>
                {a.isPublished ? (
                  <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 font-hud text-[9px] text-emerald-300 ring-1 ring-emerald-400/30">
                    Visible
                  </span>
                ) : (
                  <span className="rounded-md bg-white/5 px-2 py-0.5 font-hud text-[9px] text-white/40 ring-1 ring-white/10">
                    Oculto
                  </span>
                )}
                <span className="text-white/30 transition-transform group-open:rotate-180">▾</span>
              </summary>

              <div className="border-t border-white/8 px-5 pt-4">
                {/* Mostrar / ocultar */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <form action={setAchievementPublished}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="value" value={a.isPublished ? "false" : "true"} />
                    <button type="submit" className="btn-hud bg-white/5 px-3 py-1 text-[10px] text-white/60 hover:text-white">
                      {a.isPublished ? "Ocultar de la web" : "Mostrar en la web"}
                    </button>
                  </form>
                </div>

                {/* Formulario de edición */}
                <form id={`ac-${a.id}`} action={updateAchievement} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={a.id} />
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Título del logro</label>
                    <input name="title" defaultValue={a.title} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Juego</label>
                    <input name="game" defaultValue={a.game} className={inputCls} placeholder="Ej: Call of Dragons" />
                  </div>
                  <div>
                    <label className={labelCls}>Fecha del logro</label>
                    <input name="achieved_on" type="date" defaultValue={a.achievedOn ?? ""} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Quién lo consiguió</label>
                    <input name="author_name" defaultValue={a.authorName} className={inputCls} placeholder="Jugador o grupo" />
                  </div>
                  <div>
                    <label className={labelCls}>Color de acento</label>
                    <input name="accent" type="color" defaultValue={a.accent} className={`${inputCls} h-10 cursor-pointer p-1`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Descripción</label>
                    <textarea name="description" defaultValue={a.description} className={textareaCls} rows={3} placeholder="¿Qué pasó? Cuéntalo." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Foto / avatar de quien lo consiguió (opcional)</label>
                    <ImagePreview name="author_avatar" defaultValue={a.authorAvatar ?? ""} placeholder="https://... (opcional)" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Imágenes</label>
                    <MediaListField name="images" kind="image" defaultUrls={a.images} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Vídeos (YouTube o archivo)</label>
                    <MediaListField name="videos" kind="video" defaultUrls={a.videos} />
                  </div>
                </form>
                <div className="flex items-center gap-3 py-3">
                  <button type="submit" form={`ac-${a.id}`} className={btnPrimary}>
                    <span className="hud-label text-[10px]">Guardar logro</span>
                  </button>
                  <form action={deleteAchievement}>
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmButton message={`¿Eliminar el logro "${a.title}"?`} className={btnDanger}>
                      <span className="hud-label text-[9px]">Eliminar logro</span>
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </details>
          ))}
          {achievements.length === 0 && (
            <p className="text-sm text-white/35">Aún no hay logros. Crea el primero abajo.</p>
          )}
        </div>

        {/* Nuevo logro */}
        <details className="mt-4 group">
          <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-3 text-left">
            <span className="font-bold text-accent">+</span>
            <span className="hud-label text-[10px]">NUEVO LOGRO</span>
          </summary>
          <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-5">
            <form id="ac-new" action={createAchievement} className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>Título del logro <span className="text-red-400">*</span></label>
                <input name="title" required className={inputCls} placeholder="Ej: Primer behemoth derrotado" />
              </div>
              <div>
                <label className={labelCls}>Juego</label>
                <input name="game" className={inputCls} placeholder="Ej: Call of Dragons" />
              </div>
              <div>
                <label className={labelCls}>Fecha del logro</label>
                <input name="achieved_on" type="date" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Quién lo consiguió</label>
                <input name="author_name" className={inputCls} placeholder="Jugador o grupo" />
              </div>
              <div>
                <label className={labelCls}>Color de acento</label>
                <input name="accent" type="color" defaultValue="#7c5cff" className={`${inputCls} h-10 cursor-pointer p-1`} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Descripción</label>
                <textarea name="description" className={textareaCls} rows={3} placeholder="¿Qué pasó? Cuéntalo." />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Foto / avatar de quien lo consiguió (opcional)</label>
                <ImagePreview name="author_avatar" placeholder="https://... (opcional)" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Imágenes</label>
                <MediaListField name="images" kind="image" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Vídeos (YouTube o archivo)</label>
                <MediaListField name="videos" kind="video" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btnPrimary}>
                  <span className="hud-label text-[10px]">Crear logro</span>
                </button>
              </div>
            </form>
          </div>
        </details>

        {/* ═══════════ MEJORES JUGADORES ═══════════ */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="font-title text-lg font-extrabold tracking-wide text-glow-brand">Mejores jugadores</h2>
              <p className="mt-0.5 text-xs text-white/40">
                La élite de la comunidad. Se muestra en <span className="text-white/60">Comunidad</span> sobre un fondo espacial:
                al pulsar un nombre se revela su hazaña. Mantenlo corto (5–10 nombres).
              </p>
            </div>
            <span className="shrink-0 font-title text-2xl font-extrabold text-glow-brand">{topPlayers.length}</span>
          </div>

          <div className="mt-4 space-y-2">
            {topPlayers.map((p, idx) => (
              <details key={p.id} className="group overflow-hidden rounded-lg border border-white/10 bg-black/30">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/[0.02]">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}` }} />
                  <span className="flex-1 truncate font-hud text-sm text-white/80">{p.name}</span>
                  {p.role && <span className="hidden font-hud text-[10px] text-white/35 sm:inline">{p.role}</span>}
                  {p.isPublished ? (
                    <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 font-hud text-[9px] text-emerald-300 ring-1 ring-emerald-400/30">Visible</span>
                  ) : (
                    <span className="rounded-md bg-white/5 px-2 py-0.5 font-hud text-[9px] text-white/40 ring-1 ring-white/10">Oculto</span>
                  )}
                  <span className="text-white/30 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="border-t border-white/8 px-3 pt-3">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-hud text-[9px] tracking-widest text-white/25">ORDEN</span>
                    {idx > 0 && (
                      <form action={moveTopPlayer}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↑</button>
                      </form>
                    )}
                    {idx < topPlayers.length - 1 && (
                      <form action={moveTopPlayer}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↓</button>
                      </form>
                    )}
                    <form action={setTopPlayerPublished}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="value" value={p.isPublished ? "false" : "true"} />
                      <button type="submit" className="btn-hud bg-white/5 px-2.5 py-0.5 text-[9px] text-white/60 hover:text-white">
                        {p.isPublished ? "Ocultar" : "Mostrar"}
                      </button>
                    </form>
                  </div>
                <form id={`tp-${p.id}`} action={updateTopPlayer} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="order_index" value={p.orderIndex} />
                  <div>
                    <label className={labelCls}>Nombre del jugador</label>
                    <input name="name" defaultValue={p.name} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Etiqueta / rol (opcional)</label>
                    <input name="role" defaultValue={p.role} className={inputCls} placeholder="Ej: Líder de alianza" />
                  </div>
                  <div>
                    <label className={labelCls}>Color de brillo</label>
                    <input name="accent" type="color" defaultValue={p.accent} className={`${inputCls} h-10 cursor-pointer p-1`} />
                  </div>
                  <div>
                    <label className={labelCls}>Foto / avatar (opcional)</label>
                    <ImagePreview name="avatar_url" defaultValue={p.avatarUrl ?? ""} placeholder="https://... (opcional)" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Hazaña (se revela al pulsar el nombre — breve)</label>
                    <textarea name="achievement" defaultValue={p.achievement} className={textareaCls} rows={2} placeholder="Ej: Lideró el primer Behemoth élite en menos de 2 minutos." />
                  </div>
                </form>
                <div className="flex items-center gap-3 pb-3 pt-2">
                  <button type="submit" form={`tp-${p.id}`} className={btnPrimary}>
                    <span className="hud-label text-[10px]">Guardar</span>
                  </button>
                  <form action={deleteTopPlayer}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`¿Quitar a "${p.name}" de mejores jugadores?`} className={btnDanger}>
                      <span className="hud-label text-[9px]">Quitar</span>
                    </ConfirmButton>
                  </form>
                </div>
                </div>
              </details>
            ))}
            {topPlayers.length === 0 && (
              <p className="text-sm text-white/35">Aún no hay jugadores destacados. Añade el primero abajo.</p>
            )}
          </div>

          {/* Nuevo jugador */}
          <details className="mt-3 group">
            <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-3 text-left">
              <span className="font-bold text-accent">+</span>
              <span className="hud-label text-[10px]">NUEVO JUGADOR DESTACADO</span>
            </summary>
            <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-5">
              <form id="tp-new" action={createTopPlayer} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="order_index" value={topPlayers.length + 1} />
                <div>
                  <label className={labelCls}>Nombre del jugador <span className="text-red-400">*</span></label>
                  <input name="name" required className={inputCls} placeholder="Ej: DragonSlayer" />
                </div>
                <div>
                  <label className={labelCls}>Etiqueta / rol (opcional)</label>
                  <input name="role" className={inputCls} placeholder="Ej: Líder de alianza" />
                </div>
                <div>
                  <label className={labelCls}>Color de brillo</label>
                  <input name="accent" type="color" defaultValue="#22e0ff" className={`${inputCls} h-10 cursor-pointer p-1`} />
                </div>
                <div>
                  <label className={labelCls}>Foto / avatar (opcional)</label>
                  <ImagePreview name="avatar_url" placeholder="https://... (opcional)" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Hazaña (se revela al pulsar el nombre — breve)</label>
                  <textarea name="achievement" className={textareaCls} rows={2} placeholder="Ej: Lideró el primer Behemoth élite en menos de 2 minutos." />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className={btnPrimary}>
                    <span className="hud-label text-[10px]">Añadir jugador</span>
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
