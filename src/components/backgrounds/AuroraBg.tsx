"use client";

// Fondo interactivo: manchas de luz (aurora) que persiguen al cursor
// con distinta inercia, sobre un fondo cálido. Estética imperial/épica.
import { useEffect, useRef } from "react";

export default function AuroraBg() {
  const b1 = useRef<HTMLDivElement>(null);
  const b2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    const p1 = { x: tx, y: ty };
    const p2 = { x: tx, y: ty };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      p1.x += (tx - p1.x) * 0.06;
      p1.y += (ty - p1.y) * 0.06;
      // el segundo blob va al lado opuesto, más lento
      p2.x += (window.innerWidth - tx - p2.x) * 0.035;
      p2.y += (window.innerHeight - ty - p2.y) * 0.035;

      if (b1.current) b1.current.style.transform = `translate3d(${p1.x - 300}px, ${p1.y - 300}px, 0)`;
      if (b2.current) b2.current.style.transform = `translate3d(${p2.x - 250}px, ${p2.y - 250}px, 0)`;
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
      <div className="absolute inset-0" style={{ background: "#0c0805" }} />
      {/* manchas que siguen al cursor */}
      <div
        ref={b1}
        className="absolute h-[600px] w-[600px] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(255,176,46,0.32), transparent 65%)" }}
      />
      <div
        ref={b2}
        className="absolute h-[500px] w-[500px] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(214,72,46,0.28), transparent 65%)" }}
      />
      {/* brillo ambiental fijo */}
      <div
        className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 blur-[100px]"
        style={{ background: "radial-gradient(ellipse, rgba(255,207,90,0.14), transparent 70%)" }}
      />
      {/* viñeta */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 110% 90% at 50% 45%, transparent 50%, rgba(0,0,0,0.7) 100%)" }}
      />
    </div>
  );
}
