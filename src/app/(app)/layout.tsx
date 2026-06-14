// Layout compartido de la app: fondo interactivo + cabecera + pie.
// Todas las secciones (Inicio, Juegos, Mi progreso, Comunidad) lo heredan.
import SpotlightBg from "@/components/backgrounds/SpotlightBg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SpotlightBg />
      <div className="scanlines" aria-hidden />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
