// Panel de admin — "MMORPG en el horizonte" (más esperados).
// Solo editar y agregar contenido (sin suscripciones). Solo admin/supremo.
import { requirePublisher } from "@/lib/admin";
import { getAdminPreRegisterGames } from "@/lib/preregister-games";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";
import {
  createPreRegisterGame,
  updatePreRegisterGame,
  movePreRegisterGame,
  deletePreRegisterGame,
} from "../actions";

export default async function AdminHorizontePage() {
  await requirePublisher();
  const games = await getAdminPreRegisterGames();

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Más esperados</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              MMORPG en el horizonte
            </h1>
          </div>
          <div className="text-center">
            <div className="font-title text-2xl font-extrabold text-glow-brand">{games.length}</div>
            <div className="font-hud text-[8px] tracking-widest text-white/35">JUEGOS</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">
        <p className="mb-4 text-xs text-white/40">
          Tarjetas de la portada con la lista de MMORPG más esperados. La nota de &ldquo;hype&rdquo;,
          el estado y los enlaces aparecen al abrir cada ficha.
        </p>

        <div className="space-y-3">
          {games.map((g, idx) => (
            <details key={g.id} className="group overflow-hidden rounded-lg border border-white/10 bg-black/30">
              {/* Cabecera clicable: clic para expandir / contraer */}
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]">
                {g.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.image} alt="" className="h-8 w-8 rounded object-contain bg-white/5" />
                )}
                <span className="flex-1 truncate font-hud text-sm text-white/85">{g.name}</span>
                <span className="hidden font-hud text-[10px] text-white/30 sm:inline">{g.genre}</span>
                {typeof g.hype === "number" && (
                  <span className="rounded-md bg-amber-400/10 px-2 py-0.5 font-hud text-[10px] text-amber-300 ring-1 ring-amber-400/30">
                    {g.hype.toFixed(1)} hype
                  </span>
                )}
                <span className="text-white/30 transition-transform group-open:rotate-180">▾</span>
              </summary>

              <div className="border-t border-white/8 px-5 pt-4">
                {/* Reordenar en la lista */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-hud text-[9px] tracking-widest text-white/25">ORDEN</span>
                  {idx > 0 && (
                    <form action={movePreRegisterGame}>
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↑</button>
                    </form>
                  )}
                  {idx < games.length - 1 && (
                    <form action={movePreRegisterGame}>
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↓</button>
                    </form>
                  )}
                </div>

                {/* Formulario */}
                <form id={`pr-${g.id}`} action={updatePreRegisterGame} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={g.id} />
                <input type="hidden" name="order_index" value={g.orderIndex} />
                <div>
                  <label className={labelCls}>Nombre</label>
                  <input name="name" defaultValue={g.name} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Género</label>
                  <input name="genre" defaultValue={g.genre} className={inputCls} placeholder="Ej: MMORPG" />
                </div>
                <div>
                  <label className={labelCls}>Estado</label>
                  <input name="status" defaultValue={g.status} className={inputCls} placeholder="En desarrollo / Beta..." />
                </div>
                <div>
                  <label className={labelCls}>Hype (0-10, opcional)</label>
                  <input name="hype" defaultValue={g.hype ?? ""} className={inputCls} placeholder="Ej: 9.5" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Descripción</label>
                  <textarea name="blurb" defaultValue={g.blurb} className={textareaCls} rows={2} />
                </div>
                <div>
                  <label className={labelCls}>Plataformas (separadas por comas)</label>
                  <input name="platforms" defaultValue={(g.platforms ?? []).join(", ")} className={inputCls} placeholder="PC, PS5, Switch" />
                </div>
                <div>
                  <label className={labelCls}>Lanzamiento (opcional)</label>
                  <input name="release_window" defaultValue={g.releaseWindow ?? ""} className={inputCls} placeholder="Ej: 2026" />
                </div>
                <div>
                  <label className={labelCls}>Estudio / desarrollador</label>
                  <input name="developer" defaultValue={g.developer ?? ""} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Editora</label>
                  <input name="publisher" defaultValue={g.publisher ?? ""} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Logo / imagen</label>
                  <ImagePreview name="image" defaultValue={g.image ?? ""} placeholder="https://... (opcional)" />
                </div>
                <div>
                  <label className={labelCls}>Enlace de la ficha (info)</label>
                  <input name="info_url" defaultValue={g.infoUrl} className={inputCls} placeholder="https://..." />
                </div>
                <div>
                  <label className={labelCls}>Web oficial (opcional)</label>
                  <input name="website" defaultValue={g.website ?? ""} className={inputCls} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Enlace de preregistro oficial (opcional)</label>
                  <input name="prereg_url" defaultValue={g.preRegisterUrl ?? ""} className={inputCls} placeholder="https://... (cambia el botón a 'Preregistrarse')" />
                </div>
                <p className="sm:col-span-2 font-hud text-[10px] text-white/30">
                  Clave interna: <span className="text-white/45">{g.key}</span> (fija)
                </p>
              </form>

                {/* Botones */}
                <div className="flex items-center gap-3 pb-5 pt-3">
                  <button type="submit" form={`pr-${g.id}`} className={btnPrimary}>
                    <span className="hud-label text-[10px]">Guardar</span>
                  </button>
                  <form action={deletePreRegisterGame}>
                    <input type="hidden" name="id" value={g.id} />
                    <ConfirmButton message={`¿Quitar "${g.name}" de la lista?`} className={btnDanger}>
                      <span className="hud-label text-[9px]">Eliminar</span>
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </details>
          ))}
          {games.length === 0 && (
            <p className="text-sm text-white/35">Aún no hay juegos en la lista. Agrega el primero abajo.</p>
          )}
        </div>

        {/* Nuevo */}
        <details className="mt-4 group">
          <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-3 text-left">
            <span className="font-bold text-accent">+</span>
            <span className="hud-label text-[10px]">NUEVO JUEGO</span>
          </summary>
          <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-5">
            <form action={createPreRegisterGame} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="order_index" value={games.length + 1} />
              <div>
                <label className={labelCls}>Nombre <span className="text-red-400">*</span></label>
                <input name="name" required className={inputCls} placeholder="Ej: Chrono Odyssey" />
              </div>
              <div>
                <label className={labelCls}>Género</label>
                <input name="genre" className={inputCls} placeholder="Ej: MMORPG" />
              </div>
              <div>
                <label className={labelCls}>Estado</label>
                <input name="status" className={inputCls} placeholder="En desarrollo" />
              </div>
              <div>
                <label className={labelCls}>Hype (0-10, opcional)</label>
                <input name="hype" className={inputCls} placeholder="Ej: 9.5" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Descripción</label>
                <textarea name="blurb" className={textareaCls} rows={2} />
              </div>
              <div>
                <label className={labelCls}>Plataformas (separadas por comas)</label>
                <input name="platforms" className={inputCls} placeholder="PC, PS5" />
              </div>
              <div>
                <label className={labelCls}>Lanzamiento (opcional)</label>
                <input name="release_window" className={inputCls} placeholder="2026" />
              </div>
              <div>
                <label className={labelCls}>Estudio / desarrollador</label>
                <input name="developer" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Editora</label>
                <input name="publisher" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Logo / imagen</label>
                <ImagePreview name="image" placeholder="https://... (opcional)" />
              </div>
              <div>
                <label className={labelCls}>Enlace de la ficha (info)</label>
                <input name="info_url" className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Web oficial (opcional)</label>
                <input name="website" className={inputCls} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Enlace de preregistro (opcional)</label>
                <input name="prereg_url" className={inputCls} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btnPrimary}>
                  <span className="hud-label text-[10px]">Agregar juego</span>
                </button>
              </div>
            </form>
          </div>
        </details>
      </div>
    </div>
  );
}
