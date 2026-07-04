"use client";

// Hero de la portada — dinámica "campo de partículas".
// Muro de portadas de fondo + campo de partículas que sigue el ratón
// (y se mueve solo en reposo) + marca IMPERIUM y login real de Discord.
// El efecto es solo de cliente; en SSR se pinta el muro y el contenido.
import { useEffect, useRef } from "react";
import Link from "next/link";
import { LoginButton } from "@/components/auth/LoginButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowRight, ArrowUpRight } from "@/components/ui/GlassCard";
import { DiscordIcon } from "@/components/icons";

// Portadas del muro (viven en /public/pasarela).
const WALL = [
  "chrono-trigger", "half-life2", "portal2", "skyrim", "gtav", "tlou",
  "witcher3", "mgsv", "dark-souls", "doom", "hollow-knight", "rdr2",
  "god-of-war", "tetris", "sekiro", "disco-elysium", "death-stranding",
  "cyberpunk", "ff7", "hades", "elden-ring", "baldurs-gate3", "resident-evil4", "cs2",
];

// Reparte las portadas en 6 columnas para el muro.
const COLS = 6;
const buckets: string[][] = Array.from({ length: COLS }, () => []);
WALL.forEach((s, i) => buckets[i % COLS].push(s));

export function HeroParticles({ members, online }: { members: string; online: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const hero = heroRef.current;
    if (!grid || !hero) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── construir la rejilla de partículas (oro) ──
    const R = 14, GAP = 1.8, hue = 43, center = (R - 1) / 2;
    type P = { el: HTMLDivElement; scale: number; damp: number; spd: number; cx: number; cy: number };
    const parts: P[] = [];
    grid.innerHTML = "";
    grid.style.width = `${R * GAP}rem`;
    grid.style.height = `${R * GAP}rem`;
    for (let i = 0; i < R * R; i++) {
      const row = Math.floor(i / R), col = i % R;
      const dist = Math.hypot(row - center, col - center);
      const scale = Math.max(0.1, 1.2 - dist * 0.12);
      const opacity = Math.max(0.05, 1 - dist * 0.1);
      const light = Math.max(15, 75 - dist * 6);
      const glow = Math.max(0.5, 6 - dist * 0.5);
      const el = document.createElement("div");
      el.className = "hp-particle";
      el.style.cssText =
        `width:.42rem;height:.42rem;left:${col * GAP}rem;top:${row * GAP}rem;` +
        `opacity:${opacity};background:hsl(${hue},85%,${light}%);` +
        `box-shadow:0 0 ${glow * 0.2}rem 0 hsl(${hue},85%,60%);z-index:${Math.round(R * R - dist * 5)};`;
      grid.appendChild(el);
      parts.push({ el, scale, damp: Math.max(0.3, 1 - dist * 0.08), spd: Math.max(0.05, 0.2 - dist * 0.012), cx: 0, cy: 0 });
    }

    // ── cursor: sigue el ratón; en reposo se mueve solo ──
    const target = { x: 0, y: 0 };
    let lastMove = Date.now() - 9999, auto = true;
    const t0 = Date.now();
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX - window.innerWidth / 2) * 0.8;
      target.y = (e.clientY - window.innerHeight / 2) * 0.8;
      lastMove = Date.now();
      auto = false;
    };
    hero.addEventListener("mousemove", onMove);

    let raf = 0;
    const loop = () => {
      const now = Date.now();
      if (!reduce) {
        if (now - lastMove > 4000) auto = true;
        if (auto) {
          const s = (now - t0) * 0.001;
          target.x = Math.sin(s * 0.3) * 200 + Math.sin(s * 0.17) * 100;
          target.y = Math.cos(s * 0.2) * 150 + Math.cos(s * 0.23) * 80;
        }
      }
      for (const p of parts) {
        p.cx += (target.x * p.damp - p.cx) * p.spd;
        p.cy += (target.y * p.damp - p.cy) * p.spd;
        p.el.style.transform = `translate(${p.cx}px,${p.cy}px) scale(${p.scale})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={heroRef} className="hp-hero">
      {/* muro de portadas */}
      <div className="hp-wall" aria-hidden>
        {buckets.map((b, ci) => {
          const set = [...b, ...b, ...b];
          return (
            <div key={ci} className={`hp-col${ci % 2 ? " down" : ""}`} style={{ animationDuration: `${40 + ci * 4}s` }}>
              {set.map((s, k) => (
                <div key={k} className="hp-cell" style={{ backgroundImage: `url(/pasarela/${s}.jpg)` }} />
              ))}
            </div>
          );
        })}
      </div>
      <div className="hp-scrim" aria-hidden />
      <div className="hp-field" aria-hidden><div ref={gridRef} className="hp-grid" /></div>
      <div className="hp-amb" aria-hidden><i className="hp-a1" /><i className="hp-a2" /></div>

      {/* contenido */}
      <div className="hp-content">
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Comunidad de Discord · ES
        </span>
        <h1 className="hp-title">IMPERIUM</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
          Una comunidad que juega junta. Guías paso a paso, tu progreso guardado
          y gente con quien jugar.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Magnetic strength={0.3}>
            <LoginButton className="pill pill-primary">
              <DiscordIcon className="h-5 w-5" />
              <span>Entrar con Discord</span>
              <span className="icon-badge"><ArrowUpRight className="h-4 w-4" /></span>
            </LoginButton>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link href="/juegos" className="pill pill-ghost">
              <span>Ver las guías</span>
              <span className="icon-badge"><ArrowRight className="h-4 w-4" /></span>
            </Link>
          </Magnetic>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2.5 text-sm text-zinc-400">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="font-num text-zinc-200">{online}</span>
          <span>en línea</span>
          <span className="text-zinc-700">·</span>
          <span className="font-num text-zinc-200">{members}</span>
          <span>miembros</span>
        </div>
      </div>
    </section>
  );
}
