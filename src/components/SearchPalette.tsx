"use client";

// Panel de búsqueda global (estilo "command palette").
// Se abre con Ctrl+K / ⌘K, con la lupa de la cabecera (evento `imperium:open-search`)
// o desde cualquier botón que llame a openSearch(). Trae resultados EN VIVO desde
// /api/buscar mientras escribes, agrupados por tipo y navegables con el teclado.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookIcon, GemIcon, ShieldIcon, SearchIcon } from "@/components/icons";
import type { SearchKind, SearchResult } from "@/lib/search";

// Nombre del evento que abre el panel desde otros componentes (la lupa de la cabecera).
const OPEN_EVENT = "imperium:open-search";

// Cualquier componente cliente puede abrir el buscador con esto.
export function openSearch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  }
}

// Presentación por tipo de resultado.
const KIND_META: Record<SearchKind, { label: string; Icon: typeof BookIcon }> = {
  guia: { label: "Guías", Icon: BookIcon },
  seccion: { label: "Secciones", Icon: GemIcon },
  heroe: { label: "Héroes", Icon: ShieldIcon },
};
const KIND_ORDER: SearchKind[] = ["guia", "seccion", "heroe"];

export function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActive(0);
  }, []);

  // Navega a un resultado y cierra el panel.
  const navigate = useCallback(
    (url: string) => {
      router.push(url);
      close();
    },
    [router, close]
  );

  // Actualiza el texto y el estado de carga (en el manejador, no en un efecto).
  function onChange(value: string) {
    setQuery(value);
    if (value.trim()) {
      setLoading(true);
    } else {
      setResults([]);
      setLoading(false);
    }
  }

  // ── Abrir: atajo de teclado global + evento de la lupa ──
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // Al abrir: foco en el input y bloquear el scroll del fondo.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ── Buscar (con retardo y cancelación de peticiones viejas) ──
  // El estado solo se toca dentro del callback asíncrono, nunca de forma síncrona
  // en el cuerpo del efecto (evita renders en cascada).
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(q)}&limit=8`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setActive(0);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  // Grupos por tipo (respetando el orden de KIND_ORDER), manteniendo el orden por rank.
  const groups = useMemo(() => {
    return KIND_ORDER.map((kind) => ({
      kind,
      items: results.filter((r) => r.kind === kind),
    })).filter((g) => g.items.length > 0);
  }, [results]);

  // Lista PLANA en el mismo orden visual, para navegar con las flechas.
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const goToAll = useCallback(() => {
    const q = query.trim();
    if (q) navigate(`/buscar?q=${encodeURIComponent(q)}`);
  }, [query, navigate]);

  // Teclado dentro del panel: flechas, Enter, Escape.
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length)); // flat.length = pseudo-item "ver todos"
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active < flat.length && flat[active]) {
        navigate(flat[active].url);
      } else {
        goToAll();
      }
    }
  }

  // Desplaza el elemento activo a la vista.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  const q = query.trim();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar en IMPERIUM"
    >
      {/* Fondo oscurecido — clic para cerrar */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      {/* Caja del buscador */}
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/60 ring-1 ring-accent/10 backdrop-blur-xl"
        onKeyDown={onKeyDown}
      >
        {/* Caja de texto */}
        <div className="flex items-center gap-3 border-b border-white/8 px-4">
          <SearchIcon className="h-4 w-4 shrink-0 text-accent/70" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar guías, secciones, héroes…"
            className="w-full bg-transparent py-4 text-[15px] text-white placeholder:text-white/35 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {loading && (
            <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
          )}
          <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-hud text-[10px] text-white/40 sm:block">
            ESC
          </kbd>
        </div>

        {/* Resultados */}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto overscroll-contain py-2">
          {q && flat.length === 0 && !loading && (
            <div className="px-4 py-10 text-center text-sm text-white/40">
              Sin resultados para <span className="text-white/70">«{q}»</span>.
            </div>
          )}

          {!q && (
            <div className="px-4 py-10 text-center text-sm text-white/35">
              Escribe para buscar en todas las guías, secciones y héroes.
            </div>
          )}

          {groups.map((group) => {
            const { label, Icon } = KIND_META[group.kind];
            return (
              <div key={group.kind} className="mb-1">
                <div className="hud-label px-4 pb-1 pt-2 text-[10px] text-white/35">
                  {label}
                </div>
                {group.items.map((r) => {
                  const idx = flat.indexOf(r);
                  const isActive = idx === active;
                  return (
                    <button
                      key={r.url}
                      data-idx={idx}
                      onClick={() => navigate(r.url)}
                      onMouseMove={() => setActive(idx)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? "bg-accent/12" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      {/* Miniatura o ícono hexagonal */}
                      {r.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.coverImage}
                          alt=""
                          loading="lazy"
                          className="h-10 w-10 shrink-0 rounded-md object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <span
                          className={`hex grid h-10 w-10 shrink-0 place-items-center bg-brand/15 ring-1 ${
                            isActive ? "ring-accent/60" : "ring-accent/25"
                          }`}
                        >
                          <Icon className="h-4 w-4 text-accent" />
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-title text-sm font-semibold text-white">
                            {r.title}
                          </span>
                          <span className="shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-px text-[9px] text-white/45">
                            {r.gameName}
                          </span>
                        </span>
                        {r.snippet && (
                          <span className="mt-0.5 block truncate text-xs text-white/45">
                            {r.snippet}
                          </span>
                        )}
                      </span>

                      <svg
                        viewBox="0 0 24 24"
                        className={`h-3.5 w-3.5 shrink-0 transition-opacity ${isActive ? "opacity-70" : "opacity-0"}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* "Ver todos" — siempre disponible si hay texto */}
          {q && (
            <button
              data-idx={flat.length}
              onClick={goToAll}
              onMouseMove={() => setActive(flat.length)}
              className={`mt-1 flex w-full items-center gap-2 border-t border-white/6 px-4 py-3 text-left text-xs transition-colors ${
                active === flat.length ? "bg-accent/12 text-accent" : "text-white/45 hover:bg-white/[0.03]"
              }`}
            >
              <SearchIcon className="h-3.5 w-3.5" />
              Ver todos los resultados de «{q}»
            </button>
          )}
        </div>

        {/* Pie con pistas de teclado */}
        <div className="flex items-center justify-between border-t border-white/8 px-4 py-2 text-[10px] text-white/30">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↑</kbd>
            <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↓</kbd>
            navegar
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↵</kbd>
            abrir
          </span>
        </div>
      </div>
    </div>
  );
}
