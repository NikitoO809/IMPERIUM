"use client";

// Campo de estrellas interactivo (canvas) para fondos espaciales. Las estrellas
// reaccionan al ratón (brillo + líneas de energía). Pausa el bucle cuando la
// pestaña no está visible o el canvas sale del viewport (ahorra batería/CPU) y
// respeta prefers-reduced-motion (dibuja un único fotograma estático).
import { useEffect, useRef } from "react";

export function Starfield() {
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
