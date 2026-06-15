"use client";

// Fondo de IMPERIUM: campo de estrellas interactivo.
//  - 3 capas a distinta profundidad → parallax al mover el ratón (sensación 3D).
//  - Un halo de luz sigue al cursor e ilumina la zona (mix-blend screen).
//  - Deriva vertical lenta + parpadeo vía CSS.
//  - Solo anima transform/opacity (GPU). El bucle se detiene en reposo.
//  - Sin ratón (móvil) o con "reducir movimiento": estrellas estáticas, sin halo.
import { useEffect, useRef } from "react";

// count = nº de estrellas, size = px, depth = px de desplazamiento del parallax.
const LAYERS = [
  { count: 64, size: 1, depth: 6, drift: "star-drift-a" },
  { count: 34, size: 2, depth: 16, drift: "star-drift-b" },
  { count: 16, size: 3, depth: 32, drift: "" },
];

export default function StarfieldBg() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sembrar las estrellas (posición/parpadeo aleatorios) una sola vez.
    setRefs.current.forEach((set, i) => {
      if (!set || set.childElementCount) return;
      const { count, size } = LAYERS[i];
      let html = "";
      for (let k = 0; k < count; k++) {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const o = (0.35 + Math.random() * 0.6).toFixed(2);
        const dur = (2.5 + Math.random() * 5).toFixed(1);
        const del = (Math.random() * 5).toFixed(1);
        html += `<span class="star" style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;--o:${o};animation-duration:${dur}s;animation-delay:${del}s"></span>`;
      }
      set.innerHTML = html;
    });

    // Respeta "reducir movimiento": estrellas quietas, sin parallax ni halo.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let running = false;
    // cursor objetivo / suavizado para el parallax (normalizado -0.5..0.5)
    let tx = 0, ty = 0, cx = 0, cy = 0;
    // posición objetivo / suavizada del halo (px)
    let tgx = window.innerWidth / 2, tgy = window.innerHeight / 2;
    let gx = tgx, gy = tgy;

    function apply() {
      pxRefs.current.forEach((px, i) => {
        if (px) px.style.transform = `translate(${-cx * LAYERS[i].depth}px, ${-cy * LAYERS[i].depth}px)`;
      });
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      }
    }

    function loop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      gx += (tgx - gx) * 0.14;
      gy += (tgy - gy) * 0.14;
      apply();
      const settled =
        Math.abs(tx - cx) < 0.0004 &&
        Math.abs(ty - cy) < 0.0004 &&
        Math.abs(tgx - gx) < 0.4 &&
        Math.abs(tgy - gy) < 0.4;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }

    function onMove(e: MouseEvent) {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      tgx = e.clientX;
      tgy = e.clientY;
      rootRef.current?.classList.add("lit"); // enciende el halo al primer movimiento
      start();
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="starfield" aria-hidden>
      {LAYERS.map((l, i) => (
        <div key={i} className="star-px" ref={(el) => { pxRefs.current[i] = el; }}>
          <div className={`star-set ${l.drift}`} ref={(el) => { setRefs.current[i] = el; }} />
        </div>
      ))}
      <div className="star-glow" ref={glowRef} />
    </div>
  );
}
