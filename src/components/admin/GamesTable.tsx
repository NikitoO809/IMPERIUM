"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { AdminGame } from "@/lib/admin";
import { setGamePublished } from "@/app/(admin)/admin/actions";

type Filter = "all" | "published" | "draft";

export function GamesTable({ games, canPublish }: { games: AdminGame[]; canPublish: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((g) => {
      // Filtro por estado
      if (filter === "published" && !g.isPublished) return false;
      if (filter === "draft" && g.isPublished) return false;
      // Filtro por texto (nombre o slug)
      if (q && !g.name.toLowerCase().includes(q) && !g.slug.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [games, query, filter]);

  const publishedCount = games.filter((g) => g.isPublished).length;
  const draftCount = games.length - publishedCount;

  return (
    <div>
      {/* Barra de búsqueda + filtros */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[180px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            ⌕
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar juego..."
            className="w-full rounded-lg border border-white/10 bg-black/30 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-accent/40 placeholder:text-white/30"
          />
        </div>

        {/* Filtros por estado */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 p-1">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            Todos {games.length}
          </FilterChip>
          <FilterChip active={filter === "published"} onClick={() => setFilter("published")}>
            Publicados {publishedCount}
          </FilterChip>
          <FilterChip active={filter === "draft"} onClick={() => setFilter("draft")}>
            Borradores {draftCount}
          </FilterChip>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        {games.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-white/35">
            No hay juegos. Crea el primero con &ldquo;+ Nuevo juego&rdquo;.
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-white/35">
            Ningún juego coincide con la búsqueda.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-5 py-2.5 text-left font-hud text-[9px] tracking-widest text-white/30">
                  JUEGO
                </th>
                <th className="px-4 py-2.5 text-left font-hud text-[9px] tracking-widest text-white/30">
                  GUÍAS
                </th>
                <th className="px-4 py-2.5 text-left font-hud text-[9px] tracking-widest text-white/30">
                  ESTADO
                </th>
                <th className="px-4 py-2.5 text-right font-hud text-[9px] tracking-widest text-white/30">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr
                  key={g.id}
                  className={`${i < filtered.length - 1 ? "border-b border-white/5" : ""} transition-colors hover:bg-white/[0.02]`}
                >
                  <td className="px-5 py-3.5">
                    <div className="font-hud text-sm text-white/90">{g.name}</div>
                    <div className="mt-0.5 font-hud text-[10px] text-white/30">/{g.slug}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-hud text-sm text-white/70">
                      {g.publishedGuideCount}
                      <span className="text-white/30">/{g.guideCount}</span>
                    </span>
                    <div className="mt-1.5 h-0.5 w-16 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-accent/60"
                        style={{
                          width: `${g.guideCount > 0 ? Math.round((g.publishedGuideCount / g.guideCount) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {g.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 font-hud text-[10px] text-emerald-400/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-hud text-[10px] text-amber-400/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
                        borrador
                      </span>
                    )}
                    {g.sectionCount - g.publishedSectionCount > 0 && (
                      <div className="mt-1 font-hud text-[9px] text-amber-300/70" title="Secciones ocultas al público">
                        ⚠ {g.sectionCount - g.publishedSectionCount} secc. ocultas
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {canPublish && (
                        <form action={setGamePublished}>
                          <input type="hidden" name="id" value={g.id} />
                          <input type="hidden" name="value" value={String(!g.isPublished)} />
                          <button
                            type="submit"
                            className="btn-hud bg-white/8 px-2.5 py-1.5 text-white/60 hover:text-white"
                          >
                            <span className="hud-label text-[9px]">
                              {g.isPublished ? "Desp." : "Pub."}
                            </span>
                          </button>
                        </form>
                      )}
                      <Link
                        href={`/admin/juegos/${g.id}`}
                        className="btn-hud bg-brand px-2.5 py-1.5 text-white"
                      >
                        <span className="hud-label text-[9px]">Gestionar ▸</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 font-hud text-[10px] transition-colors ${
        active ? "bg-accent/15 text-accent" : "text-white/45 hover:text-white/75"
      }`}
    >
      {children}
    </button>
  );
}
