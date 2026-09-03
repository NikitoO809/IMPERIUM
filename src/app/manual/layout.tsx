// El Manual de Atreia, fuera del panel.
//
// Ocupa la pantalla entera y no lleva la cabecera ni el pie del sitio: es un
// lector, no una página más. Y se marca como no indexable, para que ningún
// buscador lo guarde aunque alguien pegue el enlace en un sitio público.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manual de Atreia",
  robots: { index: false, follow: false, nocache: true },
};

export default function ManualLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      {/* Los mismos fondos HUD del resto del sitio */}
      <div className="app-bg" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
