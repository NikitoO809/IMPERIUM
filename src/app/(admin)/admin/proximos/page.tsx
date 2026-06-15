// Panel de admin — Próximos juegos: ver cuánta gente espera cada uno,
// editarlos, reordenarlos y agregar nuevos. Solo admin/supremo.
import { requirePublisher } from "@/lib/admin";
import { getAdminUpcomingGames } from "@/lib/upcoming";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { EmojiPicker } from "@/components/admin/EmojiPicker";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";
import {
  createUpcomingGame,
  updateUpcomingGame,
  moveUpcomingGame,
  deleteUpcomingGame,
} from "../actions";

// Entero decimal -> hex (#rrggbb) para el <input type="color">.
function intToHex(color: number): string {
  return "#" + (color & 0xffffff).toString(16).padStart(6, "0");
}

const totalSubsLabel = (n: number) => `${n} ${n === 1 ? "persona espera" : "personas esperan"}`;

export default async function AdminProximosPage() {
  await requirePublisher();
  const games = await getAdminUpcomingGames();
  const totalSubs = games.reduce((n, g) => n + g.subscribers, 0);

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Próximos juegos</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              Lo que esperamos juntos
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold text-glow-brand">{games.length}</div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">JUEGOS</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold" style={{ color: "#ffcf5a" }}>{totalSubs}</div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">SUSCRIPCIONES</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">

        <p className="mb-4 text-xs text-white/40">
          Estos juegos aparecen en la portada con el botón &ldquo;Avísame cuando salga&rdquo;.
          El número de personas que lo esperan se cuenta solo.
        </p>

        {/* Lista de próximos juegos */}
        <div className="space-y-3">
          {games.map((g, idx) => (
            <details key={g.id} className="group overflow-hidden rounded-lg border border-white/10 bg-black/30">
              {/* Cabecera clicable: muestra el conteo y abre / cierra al pulsar */}
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]">
                <span className="text-base">{g.emoji}</span>
                <span className="flex-1 truncate font-hud text-sm text-white/85">{g.name}</span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 px-2.5 py-1 font-hud text-[10px] text-amber-300 ring-1 ring-amber-400/30">
                  ★ {totalSubsLabel(g.subscribers)}
                </span>
                <span className="text-white/30 transition-transform group-open:rotate-180">▾</span>
              </summary>

              <div className="border-t border-white/8 px-5 pt-4">
                {/* Reordenar en la lista */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-hud text-[9px] tracking-widest text-white/25">ORDEN</span>
                  {idx > 0 && (
                    <form action={moveUpcomingGame}>
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↑</button>
                    </form>
                  )}
                  {idx < games.length - 1 && (
                    <form action={moveUpcomingGame}>
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↓</button>
                    </form>
                  )}
                </div>

                {/* Formulario de edición */}
                <form id={`up-${g.id}`} action={updateUpcomingGame} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={g.id} />
                <input type="hidden" name="order_index" value={g.orderIndex} />
                <div>
                  <label className={labelCls}>Nombre</label>
                  <input name="name" defaultValue={g.name} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Etiqueta / género</label>
                  <input name="tag" defaultValue={g.tag} className={inputCls} placeholder="Ej: MMORPG" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Descripción</label>
                  <textarea name="blurb" defaultValue={g.blurb} className={textareaCls} rows={2} />
                </div>
                <div>
                  <label className={labelCls}>Emoji (círculo de color en Discord)</label>
                  <EmojiPicker name="emoji" defaultValue={g.emoji} />
                </div>
                <div>
                  <label className={labelCls}>Color del aviso</label>
                  <input name="color" type="color" defaultValue={intToHex(g.color)} className={`${inputCls} h-10 cursor-pointer p-1`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Imagen de portada</label>
                  <ImagePreview name="image" defaultValue={g.image ?? ""} placeholder="https://... (opcional)" />
                </div>
                <p className="sm:col-span-2 font-hud text-[10px] text-white/30">
                  Clave interna: <span className="text-white/45">{g.key}</span> (fija, no se cambia para no perder las suscripciones)
                </p>
              </form>

                {/* Botones */}
                <div className="flex items-center gap-3 pb-5 pt-3">
                  <button type="submit" form={`up-${g.id}`} className={btnPrimary}>
                    <span className="hud-label text-[10px]">Guardar</span>
                  </button>
                  <form action={deleteUpcomingGame}>
                    <input type="hidden" name="id" value={g.id} />
                    <ConfirmButton message={`¿Quitar "${g.name}" de próximos juegos?`} className={btnDanger}>
                      <span className="hud-label text-[9px]">Eliminar</span>
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </details>
          ))}
          {games.length === 0 && (
            <p className="text-sm text-white/35">Aún no hay próximos juegos. Agrega el primero abajo.</p>
          )}
        </div>

        {/* Nuevo próximo juego */}
        <details className="mt-4 group">
          <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-3 text-left">
            <span className="font-bold text-accent">+</span>
            <span className="hud-label text-[10px]">NUEVO PRÓXIMO JUEGO</span>
          </summary>
          <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-5">
            <form action={createUpcomingGame} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="order_index" value={games.length + 1} />
              <div>
                <label className={labelCls}>Nombre <span className="text-red-400">*</span></label>
                <input name="name" required className={inputCls} placeholder="Ej: Guild Wars 3" />
              </div>
              <div>
                <label className={labelCls}>Etiqueta / género</label>
                <input name="tag" className={inputCls} placeholder="Ej: MMORPG" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Descripción</label>
                <textarea name="blurb" className={textareaCls} rows={2} placeholder="Por qué lo esperamos..." />
              </div>
              <div>
                <label className={labelCls}>Emoji</label>
                <EmojiPicker name="emoji" defaultValue="🟣" />
              </div>
              <div>
                <label className={labelCls}>Color del aviso</label>
                <input name="color" type="color" defaultValue="#7c5cff" className={`${inputCls} h-10 cursor-pointer p-1`} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Imagen de portada</label>
                <ImagePreview name="image" placeholder="https://... (opcional)" />
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
