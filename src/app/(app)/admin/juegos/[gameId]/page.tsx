// Panel de admin — gestionar un juego: editar sus datos y sus guías.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, getAdminGame } from "@/lib/admin";
import { Panel, HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { labelCls, inputCls, textareaCls, btnPrimary, btnGhost, btnDanger } from "@/components/admin/styles";
import {
  updateGame,
  deleteGame,
  createGuide,
  setGuidePublished,
} from "../../actions";

export default async function AdminGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  await requireAdmin();
  const { gameId } = await params;
  const data = await getAdminGame(gameId);
  if (!data) notFound();
  const { game, guides } = data;

  return (
    <main className="mx-auto max-w-4xl px-4 pt-12 pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/admin" className="transition hover:text-accent">Admin</Link>
        <span>/</span>
        <span className="text-white/70">{game.name}</span>
      </div>

      <HudLabel>Editar juego</HudLabel>
      <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand">
        {game.name}
      </h1>

      {/* Editar datos del juego */}
      <Panel corners className="mt-6">
        <div className="panel-inner p-5">
          <form action={updateGame} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={game.id} />
            <div>
              <label className={labelCls} htmlFor="name">Nombre</label>
              <input id="name" name="name" defaultValue={game.name} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="slug">Slug</label>
              <input id="slug" name="slug" defaultValue={game.slug} required className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="description">Descripción</label>
              <textarea id="description" name="description" defaultValue={game.description ?? ""} className={textareaCls} />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <button type="submit" className={btnPrimary}>
                <span className="hud-label text-[11px]">Guardar cambios</span>
              </button>
              <span className="hud-label text-[10px] text-white/40">
                Estado: {game.isPublished ? "publicado" : "borrador"}
              </span>
            </div>
          </form>
        </div>
      </Panel>

      {/* Guías del juego */}
      <div className="mb-5 mt-10 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">GUÍAS</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <div className="grid gap-3">
        {guides.map((gd) => (
          <Panel key={gd.id}>
            <div className="panel-inner flex flex-wrap items-center gap-4 p-4">
              <span className="hud-label text-[10px] text-white/35">#{gd.orderIndex}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-title text-sm font-bold">{gd.title}</h3>
                  {gd.isPublished ? (
                    <span className="hud-label text-[8px] text-emerald-400/80">publicada</span>
                  ) : (
                    <span className="hud-label text-[8px] text-amber-400/70">borrador</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/40">/{gd.slug}</p>
              </div>
              <form action={setGuidePublished}>
                <input type="hidden" name="id" value={gd.id} />
                <input type="hidden" name="value" value={String(!gd.isPublished)} />
                <button type="submit" className="btn-hud bg-white/10 px-3 py-2 text-white">
                  <span className="hud-label text-[10px]">{gd.isPublished ? "Despublicar" : "Publicar"}</span>
                </button>
              </form>
              <Link href={`/admin/guias/${gd.id}`} className="btn-hud bg-brand px-3 py-2 text-white">
                <span className="hud-label text-[10px]">Pasos ▸</span>
              </Link>
            </div>
          </Panel>
        ))}
        {guides.length === 0 && <p className="text-sm text-white/40">Este juego aún no tiene guías.</p>}
      </div>

      {/* Crear guía */}
      <Panel corners className="mt-6">
        <div className="panel-inner p-5">
          <h3 className="mb-4 font-title text-base font-bold">Nueva guía</h3>
          <form action={createGuide} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="game_id" value={game.id} />
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="gd-title">Título</label>
              <input id="gd-title" name="title" required className={inputCls} placeholder="Ej: Primeros pasos" />
            </div>
            <div>
              <label className={labelCls} htmlFor="gd-slug">Slug (opcional)</label>
              <input id="gd-slug" name="slug" className={inputCls} placeholder="se genera del título" />
            </div>
            <div>
              <label className={labelCls} htmlFor="gd-order">Orden</label>
              <input id="gd-order" name="order_index" type="number" defaultValue={guides.length + 1} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="gd-desc">Descripción</label>
              <textarea id="gd-desc" name="description" className={textareaCls} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary}>
                <span className="hud-label text-[11px]">Crear guía (borrador)</span>
              </button>
            </div>
          </form>
        </div>
      </Panel>

      {/* Zona peligrosa */}
      <Panel className="mt-10">
        <div className="panel-inner flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h3 className="font-title text-sm font-bold text-red-200">Eliminar juego</h3>
            <p className="mt-0.5 text-xs text-white/40">Borra el juego y todas sus guías y pasos. No se puede deshacer.</p>
          </div>
          <form action={deleteGame}>
            <input type="hidden" name="id" value={game.id} />
            <ConfirmButton
              message={`¿Eliminar "${game.name}" con todas sus guías y pasos? Esto no se puede deshacer.`}
              className={btnDanger}
            >
              <span className="hud-label text-[10px]">Eliminar juego</span>
            </ConfirmButton>
          </form>
        </div>
      </Panel>

      <div className="mt-8">
        <Link href="/admin" className={btnGhost}>
          <span className="hud-label text-[11px]">◂ Volver al panel</span>
        </Link>
      </div>
    </main>
  );
}
