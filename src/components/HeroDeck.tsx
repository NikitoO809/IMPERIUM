"use client";

// Hero de la portada — dinámica "tarjetas 3D".
// Izquierda: marca IMPERIUM + login Discord + datos en vivo.
// Derecha: abanico de hasta 3 juegos reales que se inclina en 3D con el ratón.
// El tilt es solo de cliente (mousemove); en SSR se pinta el estado base.
import { useRef } from "react";
import Link from "next/link";
import { LoginButton } from "@/components/auth/LoginButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowRight, ArrowUpRight } from "@/components/ui/GlassCard";
import { DiscordIcon } from "@/components/icons";
import type { GameCard } from "@/lib/games";

// Posición de cada tarjeta dentro del abanico (según cuántos juegos haya).
const SLOTS = ["hd-main", "hd-left", "hd-right"] as const;

export function HeroDeck({
  members,
  online,
  games,
}: {
  members: string;
  online: string;
  games: GameCard[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  // Inclina el abanico en 3D siguiendo el cursor.
  function onMove(e: React.MouseEvent) {
    const sec = sectionRef.current;
    const deck = deckRef.current;
    if (!sec || !deck) return;
    const r = sec.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    deck.style.setProperty("--ry", `${px * 14}deg`);
    deck.style.setProperty("--rx", `${-py * 10}deg`);
  }
  function onLeave() {
    const deck = deckRef.current;
    if (!deck) return;
    deck.style.setProperty("--ry", "0deg");
    deck.style.setProperty("--rx", "0deg");
  }

  // Las 3 primeras (destacadas) para el abanico; la 1ª es la central.
  const featured = games.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="hd-hero"
    >
      <div className="hd-glow" aria-hidden />

      {/* ── Columna izquierda: marca ── */}
      <div className="hd-copy">
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Comunidad de Discord · ES
        </span>
        <h1 className="font-display mt-6 text-6xl leading-[0.9] tracking-tight text-white sm:text-7xl">
          IMPERIUM
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">
          Una comunidad que juega junta. Guías paso a paso, tu progreso guardado
          y gente con quien jugar.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Magnetic strength={0.3}>
            <LoginButton className="pill pill-primary">
              <DiscordIcon className="h-5 w-5" />
              <span>Entrar con Discord</span>
              <span className="icon-badge">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </LoginButton>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link href="/juegos" className="pill pill-ghost">
              <span>Ver las guías</span>
              <span className="icon-badge">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Magnetic>
        </div>

        <div className="mt-8 flex items-center gap-2.5 text-sm text-zinc-500">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="font-num text-zinc-200">{online}</span>
          <span>en línea</span>
          <span className="text-zinc-700">·</span>
          <span className="font-num text-zinc-200">{members}</span>
          <span>miembros</span>
        </div>
      </div>

      {/* ── Columna derecha: abanico 3D de juegos ── */}
      <div className="hd-deck-wrap">
        <div ref={deckRef} className="hd-deck">
          {featured.map((g, i) => (
            <Link
              key={g.slug}
              href={`/juegos/${g.slug}`}
              className={`hd-card ${SLOTS[i]}`}
              aria-label={g.name}
            >
              {g.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.coverImage} alt={g.name} className="hd-art" />
              ) : (
                <div className="hd-art hd-art-fallback">
                  <span>{g.name.charAt(0)}</span>
                </div>
              )}
              <div className="hd-grad" />
              {i === 0 && <div className="hd-sheen" />}
              <span className="hd-hex">{g.rank}</span>
              <div className="hd-info">
                <span className="hd-tag">{g.tag}</span>
                <h3 className="hd-name">{g.name}</h3>
                <span className="hd-count">{g.guideCount} guías</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="hd-hint">Mueve el ratón para girar las tarjetas</p>
      </div>
    </section>
  );
}
