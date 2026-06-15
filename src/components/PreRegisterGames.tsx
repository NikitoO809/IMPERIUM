"use client";

// Lista de MMORPG más esperados: rejilla de tarjetas compactas con entrada
// escalonada; cada una abre una ventana (modal animado) con todos los datos
// del juego y el botón para ir a su ficha / preregistro.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { PreRegisterGame } from "@/lib/preregister-games";
import { ArrowRight, ArrowUpRight } from "@/components/ui/GlassCard";

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

const INITIAL_VISIBLE = 6;

export function PreRegisterGames({ games }: { games: PreRegisterGame[] }) {
  const [active, setActive] = useState<PreRegisterGame | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Cerrar con Escape + bloquear el scroll del fondo cuando hay modal abierto.
  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  if (games.length === 0) return null;

  const visible = expanded ? games : games.slice(0, INITIAL_VISIBLE);
  const remaining = games.length - INITIAL_VISIBLE;

  return (
    <>
      <motion.div
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-8%" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence initial={false}>
          {visible.map((g) => (
            <motion.div
              key={g.key}
              layout
              variants={cell}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              <GameCard game={g} onOpen={() => setActive(g)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="pill pill-ghost"
            aria-expanded={expanded}
          >
            <span>{expanded ? "Mostrar menos" : `Mostrar ${remaining} más`}</span>
            <span className="icon-badge">
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                fill="none"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {active && <GameModal game={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </>
  );
}

// Tarjeta compacta.
function GameCard({ game, onOpen }: { game: PreRegisterGame; onOpen: () => void }) {
  return (
    <div className="glass glass-hover group h-full">
      <div className="glass-inner flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-white/[0.03] ring-1 ring-white/10">
            {game.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={game.image} alt={`Logo de ${game.name}`} className="max-h-11 w-auto object-contain" />
            ) : (
              <span className="font-display text-xs text-zinc-600">{game.name.slice(0, 2)}</span>
            )}
          </div>
          {typeof game.hype === "number" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold">
              <span className="font-num">{game.hype.toFixed(1)}</span> hype
            </span>
          )}
        </div>

        <h3 className="font-display mt-4 text-lg leading-tight text-white">{game.name}</h3>
        <p className="mt-1.5 flex-1 text-xs uppercase tracking-[0.12em] text-zinc-500">
          {game.genre} · {game.status}
        </p>

        <button type="button" onClick={onOpen} className="pill pill-ghost mt-5 w-full justify-center !py-2 !text-sm">
          <span>Ver detalles</span>
          <span className="icon-badge !h-6 !w-6">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </div>
  );
}

// Ventana de detalle (modal animado).
function GameModal({ game, onClose }: { game: PreRegisterGame; onClose: () => void }) {
  const hasPre = !!game.preRegisterUrl?.trim();
  const href = hasPre ? game.preRegisterUrl! : game.website?.trim() || game.infoUrl;
  const ctaLabel = hasPre ? "Preregistrarse" : "Ver juego";

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Fondo */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles de ${game.name}`}
        className="glass relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      >
        <div className="glass-inner p-6 sm:p-7">
          {/* Cerrar */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/[0.03] ring-1 ring-white/10">
              {game.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={game.image} alt={`Logo de ${game.name}`} className="max-h-14 w-auto object-contain" />
              ) : (
                <span className="font-display text-sm text-zinc-600">{game.name.slice(0, 2)}</span>
              )}
            </div>
            <div>
              <h3 className="font-display text-2xl text-white">{game.name}</h3>
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <span className="text-zinc-400">{game.status}</span>
                {typeof game.hype === "number" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 font-medium text-gold">
                    <span className="font-num">{game.hype.toFixed(1)}</span> hype
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-zinc-400">{game.blurb}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/8 pt-5">
            <Meta label="Género" value={game.genre} />
            <Meta label="Estado" value={game.status} />
            {game.platforms?.length ? <Meta label="Plataformas" value={game.platforms.join(" · ")} /> : null}
            {game.developer ? <Meta label="Estudio" value={game.developer} /> : null}
            {game.publisher ? <Meta label="Editora" value={game.publisher} /> : null}
            {game.releaseWindow ? <Meta label="Lanzamiento" value={game.releaseWindow} mono /> : null}
          </dl>

          <div className="mt-7 flex items-center gap-3">
            <a href={href} target="_blank" rel="noopener noreferrer" className="pill pill-primary">
              <span>{ctaLabel}</span>
              <span className="icon-badge">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
            <button type="button" onClick={onClose} className="pill pill-ghost">
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Dato etiquetado del juego.
function Meta({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</dt>
      <dd className={`mt-1 text-sm text-zinc-200 ${mono ? "font-num" : ""}`}>{value}</dd>
    </div>
  );
}
