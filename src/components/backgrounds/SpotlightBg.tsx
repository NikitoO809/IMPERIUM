"use client";

// Fondo interactivo: un foco de luz que sigue al cursor con suavizado.
// Ligero (solo CSS + un bucle de animación que mueve variables).
import { useEffect, useRef } from "react";

export default function SpotlightBg({
  color = "124,92,255",
  color2 = "34,224,255",
}: {
  color?: string;
  color2?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let cx = tx;
    let cy = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--mx", `${cx}px`);
      el.style.setProperty("--my", `${cy}px`);
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
    <>
      <div className="fixed inset-0 -z-20 bg-background" aria-hidden />
      <div
        className="grid-overlay"
        aria-hidden
        style={{ zIndex: -15 }}
      />
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(550px circle at var(--mx,50%) var(--my,50%), rgba(${color},0.20), transparent 60%), radial-gradient(900px circle at var(--mx,50%) var(--my,50%), rgba(${color2},0.10), transparent 70%)`,
        }}
      />
      <div className="vignette" aria-hidden style={{ zIndex: -5 }} />
    </>
  );
}
