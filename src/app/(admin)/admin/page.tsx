// Panel de admin — dashboard. Solo accesible para role = admin.
import Link from "next/link";
import { requireAdmin, getAdminGames, getAdminUsers } from "@/lib/admin";
import { HudLabel } from "@/components/hud";
import { GamesTable } from "@/components/admin/GamesTable";
import { labelCls, inputCls, textareaCls, btnPrimary } from "@/components/admin/styles";
import { createGame } from "./actions";

export default async function AdminPage() {
  await requireAdmin();
  const [games, users] = await Promise.all([getAdminGames(), getAdminUsers()]);

  const totalGuides = games.reduce((n, g) => n + g.guideCount, 0);
  const totalPublished = games.reduce((n, g) => n + g.publishedGuideCount, 0);

  return (
    <div className="flex h-full flex-col">

      {/* ── Barra superior ── */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Panel de control</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              Dashboard
            </h1>
          </div>
          {/* Stats inline */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold text-glow-brand">{games.length}</div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">JUEGOS</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold text-accent">
                {totalPublished}
                <span className="text-sm text-white/30">/{totalGuides}</span>
              </div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">GUÍAS PUB.</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold" style={{ color: "#ffcf5a" }}>
                {users.length}
              </div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">MIEMBROS</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Contenido ── */}
      <div className="flex-1 overflow-auto px-8 py-6">

        {/* ── Juegos ── */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-title text-xs font-bold tracking-[0.2em] text-white/50">JUEGOS</h2>
            <details className="relative group">
              <summary className="btn-hud cursor-pointer list-none bg-brand px-3 py-1.5 text-white">
                <span className="hud-label text-[10px]">+ Nuevo juego</span>
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-white/15 bg-[#0d0d14] p-4 shadow-xl">
                <form action={createGame} className="grid gap-3">
                  <div>
                    <label className={labelCls}>Nombre del juego</label>
                    <input name="name" required className={inputCls} placeholder="Ej: Guild Wars 3" />
                  </div>
                  <div>
                    <label className={labelCls}>Dirección web (slug)</label>
                    <input name="slug" className={inputCls} placeholder="se genera del nombre" />
                  </div>
                  <div>
                    <label className={labelCls}>Descripción</label>
                    <textarea name="description" className={textareaCls} rows={2} />
                  </div>
                  <button type="submit" className={btnPrimary}>
                    <span className="hud-label text-[11px]">Crear (borrador)</span>
                  </button>
                </form>
              </div>
            </details>
          </div>

          {/* Tabla de juegos con búsqueda + filtros */}
          <GamesTable games={games} />
        </div>

        {/* ── Acceso rápido a miembros ── */}
        <div>
          <div className="mb-3">
            <h2 className="font-title text-xs font-bold tracking-[0.2em] text-white/50">MIEMBROS</h2>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30 px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="font-hud text-sm text-white/60">
                {users.length} miembro{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}
              </span>
              <Link
                href="/admin/miembros"
                className="btn-hud bg-white/10 px-3 py-1.5 text-white/70 hover:text-white"
              >
                <span className="hud-label text-[9px]">Ver todos ▸</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
