"use client";

// Toast del panel admin: cartelito que aparece arriba a la derecha tras guardar
// y se va solo. Lo alimenta una cookie "flash" que pone el server action (ver
// setFlash en admin/actions.ts). El layout la lee y nos pasa el mensaje; aquí
// la borramos en cuanto se muestra para que no reaparezca al navegar.
import { useEffect, useState } from "react";

type Props = { token: string; message: string; kind: "ok" | "pending" };

export function AdminToast({ token, message, kind }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!message) return;
    setShow(true);
    // Borramos la cookie: ya cumplió su función (evita que se repita el aviso).
    document.cookie = "admin_flash=; path=/; max-age=0";
    const hide = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(hide);
    // token cambia en cada guardado (lleva un timestamp) → reaparece aunque el
    // texto se repita.
  }, [token, message]);

  if (!message) return null;

  const ok = kind === "ok";

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed right-4 top-4 z-[60] transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 font-hud text-sm shadow-lg backdrop-blur ${
          ok
            ? "border-accent/40 bg-accent/15 text-accent shadow-accent/20"
            : "border-amber-400/40 bg-amber-400/15 text-amber-100 shadow-amber-400/20"
        }`}
      >
        <span aria-hidden>{ok ? "✓" : "⏳"}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
