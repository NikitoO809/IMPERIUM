"use client";

// Registra el service worker del panel con scope acotado a /admin.
// Solo se monta dentro del layout del admin, así la web pública nunca
// queda bajo el control del service worker.
import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/admin" })
      .catch(() => {
        // Silencioso: si el registro falla, el panel sigue funcionando como web normal.
      });
  }, []);

  return null;
}
