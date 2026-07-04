"use client";

// Los 4 MMORPG más esperados: cards grandes tipo "banner" apiladas en columna
// vertical, cada una con el artwork completo del juego a un lado y su ficha al
// otro. Al pulsar se abre una ventana (modal animado) con todos los datos y el
// botón para ir a su ficha / preregistro.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { PreRegisterGame } from "@/lib/preregister-games";
import { getPreRegisterContent } from "@/lib/preregister-content";
import { ArrowUpRight } from "@/components/ui/GlassCard";

// Fusiona la ficha básica (BD) con el contenido enriquecido curado (por `key`):
// el contenido manda cuando existe, y aporta datos que la BD no guarda (modelo
// de negocio, motor gráfico y las características "lo que ofrece").
function enrich(game: PreRegisterGame) {
  const c = getPreRegisterContent(game.key);
  return {
    developer: c?.developer ?? game.developer,
    publisher: c?.publisher ?? game.publisher,
    platforms: c?.platforms ?? game.platforms,
    releaseWindow: c?.releaseWindow ?? game.releaseWindow,
    businessModel: c?.businessModel,
    engine: c?.engine,
    highlights: c?.highlights ?? [],
  };
}

const stack: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

// Cuántas cards destacadas se muestran en la home (el resto vive en /proximos).
const FEATURED = 4;

export function PreRegisterGames({ games }: { games: PreRegisterGame[] }) {
  const [active, setActive] = useState<PreRegisterGame | null>(null);

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

  const visible = games.slice(0, FEATURED);

  return (
    <>
      <motion.div
        variants={stack}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-8%" }}
        className="flex flex-col gap-5"
      >
        {visible.map((g, i) => (
          <motion.div key={g.key} variants={cell}>
            <GameCard game={g} rank={i + 1} onOpen={() => setActive(g)} />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {active && <GameModal game={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </>
  );
}

// Card grande horizontal: artwork completo + ficha enriquecida del juego.
function GameCard({
  game,
  rank,
  onOpen,
}: {
  game: PreRegisterGame;
  rank: number;
  onOpen: () => void;
}) {
  const cover = game.heroImage ?? game.image;
  const x = enrich(game);

  return (
    <div className="glass glass-hover group relative">
      {/* Toda la card es clicable: abre el modal (botón real → accesible) */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver detalles de ${game.name}`}
        className="absolute inset-0 z-20 rounded-[inherit]"
      />

      <div className="glass-inner flex flex-col sm:flex-row">
        {/* ── Artwork ── */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[44%] sm:min-h-[312px]">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={`Artwork de ${game.name}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-white/[0.03]">
              <span className="font-display text-2xl text-zinc-700">{game.name.slice(0, 2)}</span>
            </div>
          )}
          {/* Velo para fundir el artwork con el panel (abajo en móvil, a la derecha en desktop) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-black/45" />

          {/* Ranking */}
          <span className="font-num absolute left-4 top-3.5 text-sm text-white/70 drop-shadow-[0_2px_6px_rgba(0,0,0,.8)]">
            #{rank}
          </span>
          {/* Hype */}
          {typeof game.hype === "number" && (
            <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full border border-gold/40 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-gold backdrop-blur-sm">
              <span className="font-num">{game.hype.toFixed(1)}</span> hype
            </span>
          )}
        </div>

        {/* ── Ficha ── (en móvil fluye de arriba abajo; solo se centra en desktop) */}
        <div className="flex flex-1 flex-col p-6 sm:justify-center sm:p-7">
          <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            {[game.genre, game.status].filter(Boolean).join(" · ")}
          </span>
          <h3 className="font-display mt-2 text-2xl leading-tight text-white sm:text-[1.7rem]">
            {game.name}
          </h3>
          {game.blurb && (
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">{game.blurb}</p>
          )}

          {/* Lo que ofrece (dos claves) */}
          {x.highlights.length > 0 && (
            <ul className="mt-3.5 space-y-1.5">
              {x.highlights.slice(0, 2).map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-zinc-300">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" fill="none" aria-hidden>
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="line-clamp-1">{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Ficha técnica */}
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/8 pt-4">
            {x.developer && <Meta label="Estudio" value={x.developer} />}
            {x.platforms?.length ? <Meta label="Plataformas" value={x.platforms.join(" · ")} /> : null}
            {x.businessModel && <Meta label="Modelo" value={x.businessModel} />}
            {x.engine && <Meta label="Motor" value={x.engine} />}
            {x.releaseWindow && <Meta label="Lanzamiento" value={x.releaseWindow} wide />}
          </dl>

          <span className="pill pill-ghost mt-6 self-start !py-2 !text-sm">
            <span>Ver detalles</span>
            <span className="icon-badge !h-6 !w-6">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

// Ventana de detalle (modal animado).
function GameModal({ game, onClose }: { game: PreRegisterGame; onClose: () => void }) {
  const hasPre = !!game.preRegisterUrl?.trim();
  const href = hasPre ? game.preRegisterUrl! : game.website?.trim() || game.infoUrl;
  const ctaLabel = hasPre ? "Preregistrarse" : "Ver juego";
  const x = enrich(game);
  // Artwork local (mismo dominio → nunca lo bloquea un adblock del móvil).
  const cover = game.heroImage ?? game.image;

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
        className="glass relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      >
        {/* Cerrar (pinado sobre la cabecera, fuera del scroll) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3.5 top-3.5 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {/* Cuerpo con scroll propio: el modal nunca se sale de la pantalla */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Cabecera: banner con el artwork local (mismo dominio → siempre carga) */}
          <div className="relative">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={`Artwork de ${game.name}`} className="aspect-[16/9] w-full object-cover" />
            ) : (
              <div className="grid aspect-[16/9] w-full place-items-center bg-white/[0.03]">
                <span className="font-display text-3xl text-zinc-700">{game.name.slice(0, 2)}</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-zinc-300">{game.status}</span>
                {typeof game.hype === "number" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-black/50 px-2 py-0.5 font-medium text-gold backdrop-blur-sm">
                    <span className="font-num">{game.hype.toFixed(1)}</span> hype
                  </span>
                )}
              </div>
              <h3 className="font-display mt-2 text-2xl leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.7)] sm:text-3xl">
                {game.name}
              </h3>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 sm:p-7">
            <p className="text-sm leading-relaxed text-zinc-400">{game.blurb}</p>

            {/* Lo que ofrece */}
            {x.highlights.length > 0 && (
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Lo que ofrece</p>
                <ul className="mt-2.5 space-y-2">
                  {x.highlights.slice(0, 4).map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-snug text-zinc-300">
                      <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="none" aria-hidden>
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/8 pt-5">
              <Meta label="Género" value={game.genre} />
              <Meta label="Estado" value={game.status} />
              {x.platforms?.length ? <Meta label="Plataformas" value={x.platforms.join(" · ")} /> : null}
              {x.developer ? <Meta label="Estudio" value={x.developer} /> : null}
              {x.publisher ? <Meta label="Editora" value={x.publisher} /> : null}
              {x.businessModel ? <Meta label="Modelo" value={x.businessModel} /> : null}
              {x.engine ? <Meta label="Motor" value={x.engine} /> : null}
              {x.releaseWindow ? <Meta label="Lanzamiento" value={x.releaseWindow} wide /> : null}
            </dl>

            <div className="mt-7 flex flex-wrap items-center gap-3">
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
        </div>
      </motion.div>
    </motion.div>
  );
}

// Dato etiquetado del juego. `wide` ocupa las dos columnas (para valores largos).
function Meta({
  label,
  value,
  mono = false,
  wide = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</dt>
      <dd className={`mt-1 text-sm text-zinc-200 ${mono ? "font-num" : ""}`}>{value}</dd>
    </div>
  );
}
