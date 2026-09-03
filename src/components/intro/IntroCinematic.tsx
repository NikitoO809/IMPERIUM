"use client";

// Capa de la cinemática: el lienzo 3D, el velo negro, las bandas de cine, los
// rótulos de cada pilar, el título y el botón de entrada. El motor (three.js)
// se descarga solo cuando esta capa se monta. Esc salta, Enter entra.
import { useCallback, useEffect, useRef, useState } from "react";
import type { TierConfig } from "@/lib/intro/quality";
import type { IntroMode } from "@/lib/intro/types";
import type { Cue } from "@/lib/intro/timeline";
import type { IntroController } from "@/lib/intro/engine";
import { markIntroSeen } from "@/lib/intro/storage";

interface Caption {
  label: string;
  text: string;
}

const LEAVE_MS = 1150;
const AUTO_ENTER_MS = 7000;

export function IntroCinematic({ mode, tier, onDone }: { mode: IntroMode; tier: TierConfig; onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const ctrlRef = useRef<IntroController | null>(null);
  const leavingRef = useRef(false);
  const autoRef = useRef(0);
  const barsRef = useRef(false);

  // El rótulo guarda el último texto aunque esté apagado, para poder fundirlo.
  const [caption, setCaption] = useState<{ text: Caption | null; on: boolean }>({ text: null, on: false });
  const [stage, setStage] = useState(0); // 0 nada · 1 título · 2 lema · 3 botón
  const [leaving, setLeaving] = useState(false);
  const [bars, setBars] = useState(false);

  // Salida: fundido hacia la portada real (que ya está debajo) y limpieza.
  const finish = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    window.clearTimeout(autoRef.current);
    markIntroSeen();
    // la seda del hero arranca ya, debajo del fundido
    window.dispatchEvent(new CustomEvent("imperium-intro", { detail: { playing: false } }));
    setLeaving(true);
    window.setTimeout(() => {
      ctrlRef.current?.dispose();
      ctrlRef.current = null;
      onDone();
    }, LEAVE_MS);
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    import("@/lib/intro/engine").then(({ createIntro }) => {
      if (cancelled) return;
      const ctrl = createIntro(canvas, {
        tier,
        mode,
        onCue: (cue: Cue) => {
          if (cue.type === "caption" && cue.label && cue.text) {
            setCaption({ text: { label: cue.label, text: cue.text }, on: true });
          } else if (cue.type === "clear") {
            setCaption((c) => ({ ...c, on: false }));
          } else if (cue.type === "title") {
            setStage((s) => Math.max(s, 1));
          } else if (cue.type === "tagline") {
            setStage((s) => Math.max(s, 2));
          } else if (cue.type === "enter") {
            setStage(3);
            window.clearTimeout(autoRef.current);
            autoRef.current = window.setTimeout(finish, AUTO_ENTER_MS);
          }
        },
        onFrame: (time, veil, progress) => {
          const el = rootRef.current;
          if (!el) return;
          el.style.setProperty("--ic-veil", veil.toFixed(3));
          el.style.setProperty("--ic-progress", progress.toFixed(4));
          const want = mode === "full" && time > 4.2 && time < 25.2;
          if (want !== barsRef.current) {
            barsRef.current = want;
            setBars(want);
          }
        },
      });
      ctrlRef.current = ctrl;
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __imperiumIntro?: IntroController }).__imperiumIntro = ctrl;
      }
    }).catch((err: unknown) => {
      // Sin 3D (WebGL roto, módulo que no carga…): la portada aparece sin más.
      console.error("Intro 3D no disponible:", err);
      finish();
    });
    return () => {
      cancelled = true;
      window.clearTimeout(autoRef.current);
      ctrlRef.current?.dispose();
      ctrlRef.current = null;
    };
  }, [mode, tier, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "Enter" && stage >= 3) finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish, stage]);

  useEffect(() => {
    if (stage >= 3) enterRef.current?.focus({ preventScroll: true });
  }, [stage]);

  return (
    <div
      ref={rootRef}
      className={`ic${leaving ? " is-leaving" : ""}`}
      role="dialog"
      aria-label="Introducción cinematográfica de IMPERIUM"
      data-bars={bars ? "1" : "0"}
    >
      <canvas ref={canvasRef} className="ic-canvas" aria-hidden />
      <div className="ic-vignette" aria-hidden />
      <div className="ic-veil" aria-hidden />
      <div className="ic-bar ic-bar-top" aria-hidden />
      <div className="ic-bar ic-bar-bottom" aria-hidden />

      <button type="button" className="ic-skip pill pill-ghost" onClick={finish}>
        <span>Saltar intro</span>
        <kbd>Esc</kbd>
      </button>

      <div className={`ic-cap${caption.on ? " is-on" : ""}`}>
        {caption.text && (
          <>
            <span className="ic-cap-k">{caption.text.label}</span>
            <span className="ic-cap-t">{caption.text.text}</span>
          </>
        )}
      </div>

      <div className="ic-center">
        <h2 className={`ic-title${stage >= 1 ? " is-on" : ""}`}>IMPERIUM</h2>
        <p className={`ic-tag${stage >= 2 ? " is-on" : ""}`}>Una comunidad. Miles de aventuras.</p>
        <button
          ref={enterRef}
          type="button"
          className={`ic-enter pill pill-primary${stage >= 3 ? " is-on" : ""}`}
          onClick={finish}
          tabIndex={stage >= 3 ? 0 : -1}
        >
          <span>Entrar a IMPERIUM</span>
          <span className="icon-badge" aria-hidden>→</span>
        </button>
      </div>

      <div className="ic-progress" aria-hidden><i /></div>
    </div>
  );
}
