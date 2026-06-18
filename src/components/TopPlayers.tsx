"use client";

// MEJORES JUGADORES (sección Fama) — un ÁRBOL GENEALÓGICO ESTELAR. Cada jugador
// es un nodo-orbe que flota en el espacio, conectado a los demás por ramas
// luminosas (líneas SVG con energía fluyendo). De fondo, estrellas que reaccionan
// al ratón. Al pulsar un nodo, su orbe se enciende y se revela su hazaña.
import { useEffect, useMemo, useRef, useState } from "react";
import type { TopPlayer } from "@/lib/community";

// ── Campo de estrellas interactivo (canvas) ───────────────────────
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    type Star = { x: number; y: number; z: number; r: number; tw: number };
    let stars: Star[] = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, inside: false };

    function build() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.floor(w * DPR);
      canvas!.height = Math.floor(h * DPR);
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(200, Math.max(70, Math.floor((w * h) / 8500)));
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.8 + 0.2,
          r: Math.random() * 1.3 + 0.3,
          tw: Math.random() * Math.PI * 2,
        });
      }
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
      mouse.inside = mouse.tx >= 0 && mouse.tx <= w && mouse.ty >= 0 && mouse.ty <= h;
    }
    function onLeave() {
      mouse.inside = false;
      mouse.tx = -9999;
      mouse.ty = -9999;
    }

    // Dibuja un único fotograma del campo de estrellas.
    function draw() {
      t += 0.016;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      ctx!.clearRect(0, 0, w, h);

      const ox = mouse.inside ? mouse.x - w / 2 : 0;
      const oy = mouse.inside ? mouse.y - h / 2 : 0;
      const near: { x: number; y: number }[] = [];

      for (const s of stars) {
        const px = s.x + ox * 0.035 * s.z;
        const py = s.y + oy * 0.035 * s.z;
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = mouse.inside ? Math.hypot(dx, dy) : 9999;
        const glow = Math.max(0, 1 - dist / 150);
        const twk = 0.5 + 0.5 * Math.sin(t * 1.8 + s.tw);
        const r = s.r * (1 + glow * 2.2);
        const alpha = Math.min(1, 0.25 + twk * 0.35 + glow * 0.7);

        if (glow > 0.15) near.push({ x: px, y: py });

        ctx!.beginPath();
        ctx!.arc(px, py, r, 0, Math.PI * 2);
        ctx!.fillStyle = glow > 0.2 ? `rgba(150,210,255,${alpha})` : `rgba(205,215,240,${alpha})`;
        if (glow > 0.05) {
          ctx!.shadowBlur = glow * 12;
          ctx!.shadowColor = "rgba(120,180,255,0.9)";
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.fill();
      }
      ctx!.shadowBlur = 0;

      if (mouse.inside && near.length) {
        ctx!.lineWidth = 0.6;
        for (let i = 0; i < near.length; i++) {
          const a = near[i];
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          const op = Math.max(0, 1 - d / 150) * 0.5;
          ctx!.strokeStyle = `rgba(120,190,255,${op})`;
          ctx!.beginPath();
          ctx!.moveTo(mouse.x, mouse.y);
          ctx!.lineTo(a.x, a.y);
          ctx!.stroke();
        }
      }
    }

    // ¿El usuario pide menos movimiento? Entonces no animamos.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Control del bucle: solo corre rAF si la pestaña está visible Y el canvas
    // está en pantalla (ahorra batería/CPU cuando no se ve nada).
    let visible = !document.hidden;
    let onScreen = true;

    function frame() {
      draw();
      raf = requestAnimationFrame(frame);
    }
    function startLoop() {
      if (reduceMotion || raf) return; // ya corriendo o sin animación
      if (!visible || !onScreen) return; // nada que ver
      raf = requestAnimationFrame(frame);
    }
    function stopLoop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function onVisibility() {
      visible = !document.hidden;
      if (visible) startLoop();
      else stopLoop();
    }

    // Pausa cuando el canvas sale del viewport y reanuda al volver a entrar.
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (onScreen) startLoop();
        else stopLoop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    build();
    if (reduceMotion) {
      draw(); // un único fotograma estático
    } else {
      startLoop();
    }
    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopLoop();
      io.disconnect();
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

// ── Disposición en árbol: niveles que se ensanchan (1, 2, 3, …) ────
type TreeNode = {
  player: TopPlayer;
  x: number; // % horizontal
  y: number; // % vertical
  parent: number | null; // índice del nodo padre (en el array plano)
};

function buildTree(players: TopPlayer[]): TreeNode[] {
  // Reparte a los jugadores en niveles de tamaño creciente (forma de árbol).
  const levels: TopPlayer[][] = [];
  let i = 0;
  let cap = 1;
  while (i < players.length) {
    levels.push(players.slice(i, i + cap));
    i += cap;
    cap += 1;
  }

  const nodes: TreeNode[] = [];
  const indexByLevel: number[][] = []; // índices planos por nivel
  const topPad = 22; // deja sitio al título arriba
  const bottomPad = 12;
  const span = 100 - topPad - bottomPad;

  levels.forEach((level, L) => {
    const y = levels.length === 1 ? 50 : topPad + (span * L) / (levels.length - 1);
    const ids: number[] = [];
    level.forEach((player, k) => {
      const x = ((k + 1) / (level.length + 1)) * 100;
      const flat = nodes.length;
      // Padre: el nodo más alineado del nivel anterior.
      let parent: number | null = null;
      if (L > 0) {
        const prev = indexByLevel[L - 1];
        const ratio = level.length === 1 ? 0.5 : k / (level.length - 1);
        parent = prev[Math.round(ratio * (prev.length - 1))];
      }
      nodes.push({ player, x, y, parent });
      ids.push(flat);
    });
    indexByLevel.push(ids);
  });

  return nodes;
}

// ── Un nodo-orbe del árbol ─────────────────────────────────────────
function OrbNode({
  node,
  index,
  active,
  dimmed,
  onToggle,
}: {
  node: TreeNode;
  index: number;
  active: boolean;
  dimmed: boolean;
  onToggle: () => void;
}) {
  const { player } = node;
  const accent = player.accent;
  // Variación estable por índice para que la flotación no vaya sincronizada.
  const delay = (index % 7) * 0.55;
  const dur = 5 + (index % 5);

  return (
    <div
      className="absolute z-20"
      style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div
        className="tp-float transition-opacity duration-300"
        style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s`, opacity: dimmed ? 0.35 : 1 }}
      >
        <button
          type="button"
          onClick={onToggle}
          className="group relative flex flex-col items-center outline-none"
          style={{ transform: active ? "scale(1.12)" : undefined, transition: "transform .25s var(--ease-fluid)" }}
        >
          {/* Halo pulsante */}
          <span
            className="tp-glow pointer-events-none absolute left-1/2 top-3 h-12 w-12 -translate-x-1/2 rounded-full"
            style={{ background: `radial-gradient(circle, ${accent}cc, transparent 70%)`, animationDelay: `${delay}s` }}
            aria-hidden
          />
          {/* Orbe (foto o núcleo de color) */}
          <span
            className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full transition-all duration-300 sm:h-12 sm:w-12"
            style={{
              boxShadow: active
                ? `0 0 0 2px ${accent}, 0 0 26px ${accent}, 0 0 60px ${accent}77`
                : `0 0 0 1.5px ${accent}aa, 0 0 16px ${accent}66`,
              background: `radial-gradient(circle at 35% 30%, ${accent}, #06060f 80%)`,
            }}
          >
            {player.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={player.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-title text-xs font-extrabold text-white drop-shadow">
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </span>
          {/* Nombre */}
          <span
            className="mt-2 whitespace-nowrap font-title text-xs font-extrabold tracking-wide transition-all duration-200 sm:text-sm"
            style={{
              color: active ? accent : "rgba(255,255,255,0.85)",
              textShadow: active ? `0 0 16px ${accent}` : "0 1px 6px rgba(0,0,0,0.8)",
            }}
          >
            {player.name}
          </span>
          {player.role && (
            <span className="mt-0.5 font-hud text-[8px] uppercase tracking-[0.18em]" style={{ color: `${accent}cc` }}>
              {player.role}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Card del jugador (se abre al pulsar un nodo) ───────────────────
function PlayerCard({ player, onClose }: { player: TopPlayer; onClose: () => void }) {
  const accent = player.accent;
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="tp-pop bevel relative w-full max-w-sm overflow-hidden bg-[#080812] p-6 text-center"
        style={{ boxShadow: `0 0 0 1px ${accent}66, 0 0 50px ${accent}33` }}
      >
        {/* Resplandor superior */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28" style={{ background: `radial-gradient(80% 100% at 50% 0%, ${accent}33, transparent 70%)` }} aria-hidden />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 ring-1 ring-white/20 hover:bg-white/20"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Foto / iniciales */}
        <div className="relative mx-auto h-24 w-24">
          <span className="tp-glow pointer-events-none absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} aria-hidden />
          <div
            className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full"
            style={{ boxShadow: `0 0 0 3px ${accent}, 0 0 28px ${accent}88`, background: `radial-gradient(circle at 35% 30%, ${accent}, #06060f 80%)` }}
          >
            {player.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-title text-2xl font-extrabold text-white drop-shadow">
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Nombre + rol */}
        <h3 className="relative mt-4 font-title text-2xl font-extrabold tracking-wide" style={{ color: accent, textShadow: `0 0 18px ${accent}88` }}>
          {player.name}
        </h3>
        {player.role && (
          <span className="relative mt-2 inline-block rounded-full px-3 py-0.5 font-hud text-[10px] uppercase tracking-[0.18em]" style={{ background: `${accent}1f`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}55` }}>
            {player.role}
          </span>
        )}

        {/* Hazaña */}
        <div className="relative mt-4">
          <span className="mx-auto mb-3 block h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          {player.achievement ? (
            <p className="text-sm leading-relaxed text-white/75">{player.achievement}</p>
          ) : (
            <p className="text-sm text-white/40">Aún sin hazaña registrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TopPlayers({ players }: { players: TopPlayer[] }) {
  const nodes = useMemo(() => buildTree(players), [players]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activePlayer = activeId ? players.find((p) => p.id === activeId) ?? null : null;

  // Cerrar la card con la tecla Escape.
  useEffect(() => {
    if (!activeId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  // Altura del lienzo del árbol según cuántos niveles haya (más niveles = más alto).
  const levelsCount = useMemo(() => {
    let n = 0;
    let i = 0;
    let cap = 1;
    while (i < players.length) {
      i += cap;
      cap += 1;
      n += 1;
    }
    return n;
  }, [players]);
  const treeHeight = Math.max(420, 240 + levelsCount * 150);

  return (
    <section className="relative flex w-full flex-col overflow-hidden bg-[#04040c] py-16">
      {/* Fondo espacial */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 0%, #0a0a1e 0%, #04040c 60%, #020207 100%)" }} aria-hidden />
      <Starfield />

      {/* Cabecera */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <span className="hud-label inline-block text-[11px] tracking-[0.3em] text-accent">LA ÉLITE · ÁRBOL DE LA FAMA</span>
        <h2 className="mt-2 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
          Mejores jugadores
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
          La estirpe de leyendas de IMPERIUM. Pulsa un nodo para revelar su hazaña.
        </p>
      </div>

      {/* Árbol */}
      <div className="relative z-10 mx-auto mt-8 w-full max-w-5xl px-4">
        <div className="relative w-full" style={{ height: treeHeight }}>
          {/* Ramas (SVG) — usa % directo como coordenadas */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {nodes.map((n, i) => {
              if (n.parent === null) return null;
              const p = nodes[n.parent];
              const midY = (p.y + n.y) / 2;
              const d = `M ${p.x} ${p.y} C ${p.x} ${midY}, ${n.x} ${midY}, ${n.x} ${n.y}`;
              const on = activeId === n.player.id || activeId === p.player.id;
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  stroke={n.player.accent}
                  strokeWidth={on ? 1.8 : 1}
                  strokeOpacity={on ? 0.9 : 0.32}
                  className={on ? "tp-flow" : undefined}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Nodos */}
          {nodes.map((n, i) => (
            <OrbNode
              key={n.player.id}
              node={n}
              index={i}
              active={activeId === n.player.id}
              dimmed={activeId !== null && activeId !== n.player.id}
              onToggle={() => setActiveId((cur) => (cur === n.player.id ? null : n.player.id))}
            />
          ))}
        </div>
      </div>

      {/* Card del jugador seleccionado */}
      {activePlayer && <PlayerCard player={activePlayer} onClose={() => setActiveId(null)} />}
    </section>
  );
}
