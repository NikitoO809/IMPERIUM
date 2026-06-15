// Layout exclusivo del panel de administración.
// No usa el header/footer del sitio público — tiene su propia estructura con sidebar.
import type { Metadata, Viewport } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PwaRegister } from "@/components/admin/PwaRegister";
import { getOptionalStaff, getPendingChangesCount } from "@/lib/admin";

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
  // Solo el Supremo ve el contador de cambios pendientes.
  const pendingCount = rank === "supremo" ? await getPendingChangesCount() : 0;

  return (
    <div className="relative flex min-h-screen">
      {/* Fondos HUD (mismo sistema que el sitio público) */}
      <div className="app-bg" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      {/* Registra el service worker (PWA) solo dentro del admin */}
      <PwaRegister />

      {/* Sidebar fija a la izquierda */}
      <AdminSidebar rank={rank} pendingCount={pendingCount} />

      {/* Contenido principal */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-auto">
        {/* Aviso para admins / moderadores: sus cambios pasan por aprobación */}
        {(rank === "admin" || rank === "moderador") && (
          <div className="border-b border-amber-400/20 bg-amber-400/10 px-8 py-2 text-center font-hud text-[11px] text-amber-200/90">
            Tus cambios se envían al Supremo para aprobación antes de aplicarse.
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
