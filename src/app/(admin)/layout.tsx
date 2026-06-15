// Layout exclusivo del panel de administración.
// No usa el header/footer del sitio público — tiene su propia estructura con sidebar.
import type { Metadata, Viewport } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PwaRegister } from "@/components/admin/PwaRegister";
import { getOptionalStaff } from "@/lib/admin";

export const metadata: Metadata = {
  title: "IMPERIUM Admin",
  // Manifest que hace el panel instalable como app (acotado a /admin).
  manifest: "/admin.webmanifest",
  appleWebApp: {
    capable: true,
    title: "IMPERIUM Admin",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d14",
};

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getOptionalStaff();
  // Rango por defecto 'user' si no hay sesión staff (la página hará el redirect).
  const rank = session?.rank ?? "user";

  return (
    <div className="relative flex min-h-screen">
      {/* Fondos HUD (mismo sistema que el sitio público) */}
      <div className="app-bg" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      {/* Registra el service worker (PWA) solo dentro del admin */}
      <PwaRegister />

      {/* Sidebar fija a la izquierda */}
      <AdminSidebar rank={rank} />

      {/* Contenido principal */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-auto">
        {children}
      </div>
    </div>
  );
}
