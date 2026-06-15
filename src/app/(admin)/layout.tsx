// Layout exclusivo del panel de administración.
// No usa el header/footer del sitio público — tiene su propia estructura con sidebar.
import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — IMPERIUM",
};

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      {/* Fondos HUD (mismo sistema que el sitio público) */}
      <div className="app-bg" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      {/* Sidebar fija a la izquierda */}
      <AdminSidebar />

      {/* Contenido principal */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-auto">
        {children}
      </div>
    </div>
  );
}
