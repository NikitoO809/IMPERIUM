// Layout compartido de la app: fondo neutro + cabecera + pie.
// Todas las secciones (Inicio, Juegos, Mi progreso, Comunidad) lo heredan.
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchPalette } from "@/components/SearchPalette";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="app-bg" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      {/* Buscador global (Ctrl+K / lupa de la cabecera). Vive aquí para estar en todas las páginas. */}
      <SearchPalette />
    </div>
  );
}
