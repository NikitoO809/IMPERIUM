// Panel de admin — Salón de los Titanes: coronar, editar, reordenar, mostrar/
// ocultar y quitar Titanes. El primero de la lista es el #1 (el trono).
// Solo admin/supremo.
import { requirePublisher } from "@/lib/admin";
import { getAdminTitanes } from "@/lib/titanes";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { labelCls, inputCls, textareaCls, btnPrimary, btnGhost, btnDanger } from "@/components/admin/styles";
import { createTitan, updateTitan, moveTitan, setTitanPublished, deleteTitan } from "../actions";

const TIERS = [
  { value: "diamante", label: "Diamante" },
  { value: "rubi", label: "Rubí" },
  { value: "oro", label: "Oro" },
];

function tierLabel(t: string): string {
  return t === "diamante" ? "Diamante" : t === "rubi" ? "Rubí" : "Oro";
}

export default async function AdminTitanesPage() {
  await requirePublisher();
  const titanes = await getAdminTitanes();
  const shown = titanes.filter((t) => t.isPublished).length;

  return (
    <div className="flex h-full flex-col">
      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Salón de los Titanes</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              Los Titanes
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold text-glow-brand">{titanes.length}</div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">TITANES</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold" style={{ color: "#ffcf5a" }}>{shown}</div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">VISIBLES</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">
        <p className="mb-4 text-xs text-white/40">
          El primero de la lista es el <span className="text-white/60">#1 (el trono)</span>. Ordena con ↑/↓.
          El poder va en número completo (ej: 92000000). La foto de perfil es opcional (una URL de imagen).
        </p>

        {/* Lista de Titanes */}
        <div className="space-y-3">
          {titanes.map((t, idx) => (
            <details key={t.id} className="group overflow-hidden rounded-lg border border-white/10 bg-black/30">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]">
                <span className="w-5 shrink-0 text-center font-title text-sm text-white/40">{idx + 1}</span>
                <span className="flex-1 truncate font-hud text-sm text-white/85">
                  {t.ign}
                  {t.isFounder && <span className="ml-2 text-[10px] text-amber-300/70">Fundador</span>}
                </span>
                <span className="font-hud text-[10px] uppercase tracking-wider text-white/40">{tierLabel(t.tier)}</span>
                {t.isPublished ? (
                  <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 font-hud text-[10px] text-emerald-300 ring-1 ring-emerald-400/30">visible</span>
                ) : (
                  <span className="rounded-md bg-white/5 px-2 py-0.5 font-hud text-[10px] text-white/40 ring-1 ring-white/10">oculto</span>
                )}
                <span className="text-white/30 transition-transform group-open:rotate-180">▾</span>
              </summary>

              <div className="border-t border-white/8 px-5 pt-4">
                {/* Reordenar */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-hud text-[9px] tracking-widest text-white/25">ORDEN</span>
                  {idx > 0 && (
                    <form action={moveTitan}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↑</button>
                    </form>
                  )}
                  {idx < titanes.length - 1 && (
                    <form action={moveTitan}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" className="btn-hud px-2 py-0.5 text-[11px] text-white/40 hover:text-white">↓</button>
                    </form>
                  )}
                </div>

                {/* Formulario de edición */}
                <form id={`t-${t.id}`} action={updateTitan} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="order_index" value={t.orderIndex} />
                  <div>
                    <label className={labelCls}>Nombre (IGN) *</label>
                    <input name="ign" defaultValue={t.ign} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Epíteto</label>
                    <input name="epiteto" defaultValue={t.epiteto} className={inputCls} placeholder="El Rompemuros" />
                  </div>
                  <div>
                    <label className={labelCls}>Tier</label>
                    <select name="tier" defaultValue={t.tier} className={inputCls}>
                      {TIERS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>VIP</label>
                    <input name="vip_level" type="number" min={0} defaultValue={t.vipLevel} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Poder total (número completo)</label>
                    <input name="power" type="number" min={0} defaultValue={t.power} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Héroes míticos</label>
                    <input name="mythics" type="number" min={0} defaultValue={t.mythics} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nivel de castillo</label>
                    <input name="castle_level" type="number" min={0} defaultValue={t.castleLevel} className={inputCls} />
                  </div>
                  <label className="flex items-center gap-2 self-end pb-2 text-sm text-white/70">
                    <input name="is_founder" type="checkbox" defaultChecked={t.isFounder} className="h-4 w-4 accent-[#e3b341]" />
                    Fundador
                  </label>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Foto de perfil (URL)</label>
                    <ImagePreview name="avatar_url" defaultValue={t.avatarUrl ?? ""} placeholder="https://... (opcional)" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Frase / flex</label>
                    <textarea name="quote" defaultValue={t.quote} className={textareaCls} rows={2} />
                  </div>
                </form>

                {/* Botones */}
                <div className="flex flex-wrap items-center gap-3 pb-5 pt-3">
                  <button type="submit" form={`t-${t.id}`} className={btnPrimary}>
                    <span className="hud-label text-[10px]">Guardar</span>
                  </button>
                  <form action={setTitanPublished}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="value" value={(!t.isPublished).toString()} />
                    <button type="submit" className={btnGhost}>
                      <span className="hud-label text-[10px]">{t.isPublished ? "Ocultar" : "Mostrar"}</span>
                    </button>
                  </form>
                  <form action={deleteTitan}>
                    <input type="hidden" name="id" value={t.id} />
                    <ConfirmButton message={`¿Quitar a "${t.ign}" del Salón de los Titanes?`} className={btnDanger}>
                      <span className="hud-label text-[9px]">Eliminar</span>
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </details>
          ))}
          {titanes.length === 0 && (
            <p className="text-sm text-white/35">Aún no hay Titanes. Corona al primero abajo.</p>
          )}
        </div>

        {/* Nuevo Titán */}
        <details className="group mt-4">
          <summary className="btn-hud flex w-full cursor-pointer list-none items-center gap-2 bg-white/5 px-4 py-3 text-left">
            <span className="font-bold text-accent">+</span>
            <span className="hud-label text-[10px]">NUEVO TITÁN</span>
          </summary>
          <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-5">
            <form id="t-new" action={createTitan} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="order_index" value={titanes.length + 1} />
              <div>
                <label className={labelCls}>Nombre (IGN) <span className="text-red-400">*</span></label>
                <input name="ign" required className={inputCls} placeholder="Ej: Emperor" />
              </div>
              <div>
                <label className={labelCls}>Epíteto</label>
                <input name="epiteto" className={inputCls} placeholder="El Rompemuros" />
              </div>
              <div>
                <label className={labelCls}>Tier</label>
                <select name="tier" defaultValue="oro" className={inputCls}>
                  {TIERS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>VIP</label>
                <input name="vip_level" type="number" min={0} defaultValue={0} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Poder total (número completo)</label>
                <input name="power" type="number" min={0} defaultValue={0} className={inputCls} placeholder="92000000" />
              </div>
              <div>
                <label className={labelCls}>Héroes míticos</label>
                <input name="mythics" type="number" min={0} defaultValue={0} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nivel de castillo</label>
                <input name="castle_level" type="number" min={0} defaultValue={0} className={inputCls} />
              </div>
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-white/70">
                <input name="is_founder" type="checkbox" className="h-4 w-4 accent-[#e3b341]" />
                Fundador
              </label>
              <div className="sm:col-span-2">
                <label className={labelCls}>Foto de perfil (URL)</label>
                <ImagePreview name="avatar_url" placeholder="https://... (opcional)" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Frase / flex</label>
                <textarea name="quote" className={textareaCls} rows={2} placeholder="Su frase..." />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btnPrimary}>
                  <span className="hud-label text-[10px]">Coronar Titán</span>
                </button>
              </div>
            </form>
          </div>
        </details>
      </div>
    </div>
  );
}
