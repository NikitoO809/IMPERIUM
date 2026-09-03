"use client";

// Decide si suena la intro (completa, corta o nada) y en qué calidad; solo
// entonces carga la capa cinematográfica (y con ella three.js). Mientras
// suena, bloquea el scroll y avisa al resto de la página (evento
// "imperium-intro") para que no gaste GPU debajo.
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { detectTier, TIERS, type TierConfig } from "@/lib/intro/quality";
import { decideIntro } from "@/lib/intro/storage";
import type { IntroMode } from "@/lib/intro/types";

const IntroCinematic = dynamic(() => import("./IntroCinematic").then((m) => m.IntroCinematic), { ssr: false });

interface Plan {
  mode: IntroMode;
  tier: TierConfig;
}

// Este componente solo existe en el navegador (IntroMount lo carga sin SSR),
// así que aquí podemos mirar la URL y el almacenamiento sin problema.
function plan(): Plan | null {
  const decision = decideIntro(window.location.search);
  if (decision.mode === "none") return null;
  const tier = detectTier(decision.force);
  if (tier === "off") return null;
  return { mode: decision.mode, tier: TIERS[tier] };
}

export function IntroGate() {
  const [current, setCurrent] = useState<Plan | null>(plan);

  useEffect(() => {
    if (!current) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.dataset.intro = "1";
    root.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("imperium-intro", { detail: { playing: true } }));
    return () => {
      delete root.dataset.intro;
      root.style.overflow = prevOverflow;
    };
  }, [current]);

  const done = useCallback(() => setCurrent(null), []);

  return current ? <IntroCinematic mode={current.mode} tier={current.tier} onDone={done} /> : null;
}
