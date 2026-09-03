"use client";

// Puente para la portada (componente de servidor): la puerta de la intro
// solo existe en el navegador, así que se carga sin SSR.
import dynamic from "next/dynamic";

const IntroGate = dynamic(() => import("./IntroGate").then((m) => m.IntroGate), { ssr: false });

export function IntroMount() {
  return <IntroGate />;
}
