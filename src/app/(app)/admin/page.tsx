// Panel de admin — dashboard. Solo accesible para role = admin.
// Gestiona juegos (crear/publicar) y los roles de los usuarios.
import Link from "next/link";
import { requireAdmin, getAdminGames, getAdminUsers } from "@/lib/admin";
import { Panel, HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { labelCls, inputCls, textareaCls, btnPrimary } from "@/components/admin/styles";
import { createGame, setGamePublished, setUserRole } from "./actions";

export default async function AdminPage() {
  const adminId = await requireAdmin();
  const [games, users] = await Promise.all([getAdminGames(), getAdminUsers()]);

  return (
    <main className="mx-auto max-w-4xl px-4 pt-12 pb-16">
      <HudLabel>Panel de control</HudLabel>
      <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Administración
      </h1>
      <p className="mt-3 max-w-xl text-sm text-white/55">
        Crea y publica contenido y gestiona quién es administrador. El contenido se publica
        solo cuando tú lo decides; marca cada paso como verificado cuando confirmes su fuente.
      </p>

      {/* ── Juegos ── */}
      <div className="mb-5 mt-10 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">JUEGOS</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <div className="grid gap-3">
        {games.map((g) => (
          <Panel key={g.id}>
            <div className="panel-inner flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-title text-base font-bold">{g.name}</h3>
                  {g.isPublished ? (
                    <span className="hud-label text-[8px] text-emerald-400/80">publicado</span>
                  ) : (
                    <span className="hud-label text-[8px] text-amber-400/70">borrador</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/40">
                  /{g.slug} · {g.guideCount} guías
                </p>
              </div>
              <form action={setGamePublished}>
                <input type="hidden" name="id" value={g.id} />
                <input type="hidden" name="value" value={String(!g.isPublished)} />
                <button type="submit" className="btn-hud bg-white/10 px-3 py-2 text-white">
                  <span className="hud-label text-[10px]">{g.isPublished ? "Despublicar" : "Publicar"}</span>
                </button>
              </form>
              <Link href={`/admin/juegos/${g.id}`} className="btn-hud bg-brand px-3 py-2 text-white">
                <span className="hud-label text-[10px]">Gestionar ▸</span>
              </Link>
            </div>
          </Panel>
        ))}
        {games.length === 0 && <p className="text-sm text-white/40">Todavía no hay juegos.</p>}
      </div>

      {/* Crear juego */}
      <Panel corners className="mt-6">
        <div className="panel-inner p-5">
          <h3 className="mb-4 font-title text-base font-bold">Nuevo juego</h3>
          <form action={createGame} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="g-name">Nombre</label>
              <input id="g-name" name="name" required className={inputCls} placeholder="Ej: Call of Dragons" />
            </div>
            <div>
              <label className={labelCls} htmlFor="g-slug">Slug (opcional)</label>
              <input id="g-slug" name="slug" className={inputCls} placeholder="se genera del nombre" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="g-desc">Descripción</label>
              <textarea id="g-desc" name="description" className={textareaCls} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary}>
                <span className="hud-label text-[11px]">Crear juego (borrador)</span>
              </button>
            </div>
          </form>
        </div>
      </Panel>

      {/* ── Usuarios ── */}
      <div className="mb-5 mt-12 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">USUARIOS</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <Panel>
        <div className="panel-inner p-4 sm:p-5">
          <ul className="space-y-2.5">
            {users.map((u) => {
              const isSelf = u.id === adminId;
              const nextRole = u.role === "admin" ? "user" : "admin";
              return (
                <li key={u.id} className="flex items-center gap-3 bg-white/[0.02] px-3 py-2.5 bevel">
                  {u.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.avatarUrl} alt="" className="h-8 w-8 rounded-full ring-1 ring-white/15" />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 font-title text-xs">
                      {(u.username ?? "?").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="truncate font-hud text-sm text-white/85">{u.username ?? "Jugador"}</span>
                    {isSelf && <span className="ml-2 hud-label text-[8px] text-accent/70">tú</span>}
                  </div>
                  <span className={`hud-label text-[10px] ${u.role === "admin" ? "text-accent" : "text-white/40"}`}>
                    {u.role}
                  </span>
                  {!isSelf && (
                    <form action={setUserRole}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="role" value={nextRole} />
                      <ConfirmButton
                        message={`¿Cambiar el rol de ${u.username ?? "este usuario"} a ${nextRole}?`}
                        className="btn-hud bg-white/10 px-3 py-1.5 text-white"
                      >
                        <span className="hud-label text-[10px]">Hacer {nextRole}</span>
                      </ConfirmButton>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Panel>
    </main>
  );
}
