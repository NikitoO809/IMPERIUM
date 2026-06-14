"use client";

// Fondo interactivo: rejilla 3D en perspectiva (synthwave) que se inclina
// suavemente según la posición del cursor, con líneas que avanzan.
import { useEffect, useRef } from "react";

export default function GridPerspectiveBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let trx = 0;
    let try_ = 0;
    let rx = 0;
    let ry = 0;

    const onMove = (e: PointerEvent) => {
      // -1 a 1 según posición del cursor
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      try_ = nx * 8; // giro lateral
      trx = ny * 4; // inclinación
    };

    const loop = () => {
      rx += (trx - rx) * 0.06;
      ry += (try_ - ry) * 0.06;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* cielo */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #0a0418 0%, #1a0a2e 45%, #2d0b3e 100%)" }}
      />
      {/* sol */}
      <div
        className="absolute left-1/2 top-[14%] h-56 w-56 -translate-x-1/2 rounded-full blur-[2px]"
        style={{ background: "radial-gradient(circle, #ff5e9c 0%, #ff8a4c 55%, transparent 72%)" }}
      />
      {/* suelo de rejilla en perspectiva */}
      <div
        ref={ref}
        className="grid-floor absolute bottom-0 left-1/2 h-[65vh] w-[200vw] -translate-x-1/2"
        style={{
          transform:
            "perspective(420px) rotateX(calc(72deg + var(--rx,0deg))) rotateZ(var(--ry,0deg))",
          transformOrigin: "center top",
          backgroundImage:
            "linear-gradient(rgba(255,94,156,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,224,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(180deg, transparent 0%, #000 30%)",
        }}
      />
      {/* viñeta */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 100% 80% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
      />
    </div>
  );
}
