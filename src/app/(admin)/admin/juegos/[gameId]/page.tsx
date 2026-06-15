// Panel de admin — gestionar un juego: datos, guías y secciones.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff, getAdminGame, getAdminSections } from "@/lib/admin";
import { canPublish } from "@/lib/ranks";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";
import { updateGame, deleteGame, createGuide, setGuidePublished, createSection } from "../../actions";

const RENDER_TYPES = [
  { value: "generic", label: "Solo texto / tarjetas" },
  { value: "tier-list", label: "Tier list" },
  { value: "artifact-table", label: "Tabla de artefactos" },
  { value: "behemoth", label: "Behemoths" },
  { value: "builds", label: "Builds" },
  { value: "class-tier", label: "Tier list por clase" },
];

export default async function AdminGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { rank } = await requireStaff();
  const userCanPublish = canPublish(rank);
  const { gameId } = await params;
  const [data, sections] = await Promise.all([getAdminGame(gameId), getAdminSections(gameId)]);
  if (!data) notFound();
  const { game, guides } = data;

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <nav className="mb-1 flex items-center gap-1.5 font-hud text-[10px] text-white/35">
          <Link href="/admin" className="hover:text-accent transition-colors">Panel</Link>
          <span>/</span>
          <span className="text-white/60">{game.name}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Editar juego</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              {game.name}
            </h1>
          </div>
          <span className={`font-hud text-[10px] ${game.isPublished ? "text-emerald-400/80" : "text-amber-400/70"}`}>
            {game.isPublished ? "● publicado" : "○ borrador"}
          </span>
        </div>
      </header>

      {/* Contenido en dos columnas */}
      <div className="flex flex-1 gap-0 overflow-auto">

        {/* Col izq: datos + guías */}
        <div className="flex-1 overflow-auto border-r border-white/8 px-8 py-6">

          {/* Datos del juego */}
          <section className="mb-8">
            <h2 className="mb-3 font-title text-[10px] font-bold tracking-[0.2em] text-white/40">
              DATOS
            </h2>
            <form action={updateGame} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={game.id} />
              <div>
                <label className={labelCls}>Nombre</label>
                <input name="name" defaultValue={game.name} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Dirección web (slug)</label>
                <input name="slug" defaultValue={game.slug} required className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Descripción</label>
                <textarea name="description" defaultValue={game.description ?? ""} className={textareaCls} rows={2} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btnPrimary}>
                  <span className="hud-label text-[11px]">Guardar</span>
                </button>
              </div>
            </form>
          </section>

          {/* Guías */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-title text-[10px] font-bold tracking-[0.2em] text-white/40">
                GUÍAS ({guides.length})
              </h2>
              <details className="relative group">
                <summary className="btn-hud cursor-pointer list-none bg-brand px-2.5 py-1.5 text-white">
                  <span className="hud-label text-[9px]">+ Nueva guía</span>
                </summary>
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-white/15 bg-[#0d0d14] p-4 shadow-xl">
                  <form action={createGuide} className="grid gap-3">
                    <input type="hidden" name="game_id" value={game.id} />
                    <input type="hidden" name="order_index" value={guides.length + 1} />
                    <div>
                      <label className={labelCls}>Título</label>
                      <input name="title" required className={inputCls} placeholder="Ej: Primeros pasos" />
                    </div>
                    <div>
                      <label className={labelCls}>Descripción</label>
                      <textarea name="description" className={textareaCls} rows={2} />
                    </div>
                    <button type="submit" className={btnPrimary}>
                      <span className="hud-label text-[10px]">Crear (borrador)</span>
                    </button>
                  </form>
                </div>
              </details>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
              {guides.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-white/35">
                  Sin guías. Crea la primera arriba.
                </div>
              ) : (
                <table className="w-full">
                  <tbody>
                    {guides.map((gd, i) => (
                      <tr
                        key={gd.id}
                        className={`${i < guides.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/[0.02]`}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${gd.isPublished ? "bg-emerald-400" : "bg-amber-400/60"}`} />
                            <span className="font-hud text-sm text-white/85">{gd.title}</span>
                            {gd.introImages.length > 0 && (
                              <span className="font-hud text-[9px] text-accent/50">✓ img</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {userCanPublish && (
                              <form action={setGuidePublished}>
                                <input type="hidden" name="id" value={gd.id} />
                                <input type="hidden" name="value" value={String(!gd.isPublished)} />
                                <button type="submit" className="btn-hud bg-white/8 px-2 py-1 text-white/55 hover:text-white">
                                  <span className="hud-label text-[9px]">{gd.isPublished ? "Desp." : "Pub."}</span>
                                </button>
                              </form>
                            )}
                            <Link href={`/admin/guias/${gd.id}`} className="btn-hud bg-brand px-2 py-1 text-white">
                              <span className="hud-label text-[9px]">Editar ▸</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Zona peligrosa — solo admin/supremo pueden borrar el juego entero */}
          {userCanPublish && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-title text-xs font-bold text-red-300/80">Eliminar juego</p>
                  <p className="mt-0.5 text-[11px] text-white/35">Borra el juego y todo su contenido. Irreversible.</p>
                </div>
                <form action={deleteGame}>
                  <input type="hidden" name="id" value={game.id} />
                  <ConfirmButton
                    message={`¿Eliminar "${game.name}" con todo su contenido?`}
                    className={btnDanger}
                  >
                    <span className="hud-label text-[10px]">Eliminar</span>
                  </ConfirmButton>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Col der: secciones */}
        <div className="w-72 shrink-0 overflow-auto px-6 py-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-title text-[10px] font-bold tracking-[0.2em] text-white/40">
              SECCIONES ({sections.length})
            </h2>
            <details className="relative group">
              <summary className="btn-hud cursor-pointer list-none bg-white/10 px-2.5 py-1.5 text-white/70">
                <span className="hud-label text-[9px]">+ Nueva</span>
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-white/15 bg-[#0d0d14] p-4 shadow-xl">
                <form action={createSection} className="grid gap-3">
                  <input type="hidden" name="game_id" value={game.id} />
                  <div>
                    <label className={labelCls}>Nombre</label>
                    <input name="title" required className={inputCls} placeholder="Ej: Códigos" />
                  </div>
                  <div>
                    <label className={labelCls}>Tipo</label>
                    <select name="render_type" className={inputCls}>
                      {RENDER_TYPES.map((rt) => (
                        <option key={rt.value} value={rt.value}>{rt.label}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className={btnPrimary}>
                    <span className="hud-label text-[10px]">Crear sección</span>
                  </button>
                </form>
              </div>
            </details>
          </div>

          <div className="space-y-1.5">
            {sections.length === 0 ? (
              <p className="text-xs text-white/30">Sin secciones todavía.</p>
            ) : (
              sections.map((sec) => (
                <Link
                  key={sec.id}
                  href={`/admin/juegos/${gameId}/secciones/${sec.id}`}
                  className="flex items-center justify-between rounded-lg border border-white/8 bg-black/20 px-4 py-2.5 transition-colors hover:border-accent/30 hover:bg-white/5"
                >
                  <div>
                    <div className="font-hud text-sm text-white/80">{sec.title}</div>
                    <div className="mt-0.5 font-hud text-[9px] text-white/30">
                      {sec.blockCount} bloques · {sec.renderType}
                    </div>
                  </div>
                  <span className="text-xs text-white/30">▸</span>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
