"use client";

// Envuelve una imagen (miniatura) y, al pulsarla, la abre a pantalla completa
// para verla con detalle (lightbox). Pensado para reutilizar: recibe el `src`
// de la imagen grande y como `children` la miniatura ya maquetada (p. ej. un
// <Image> de Next con su estilo). El modal se monta con un portal en <body>
// para que los recortes (clip-path/transform) de los paneles HUD no lo corten.
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function ImageZoom({
  src,
  alt = "",
  className = "",
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // para la transición de entrada

  // Reseteo del fundido en el clic (no en el efecto, que el linter no permite
  // setState síncrono ahí). El portal solo se monta al abrir → siempre en cliente.
  function openZoom() {
    setShown(false);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    // Pinta primero el estado oculto y entra con fundido en el siguiente frame.
    const raf = requestAnimationFrame(() => setShown(true));
    // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={openZoom}
        aria-label="Ampliar imagen"
        className={`group/zoom cursor-zoom-in ${className}`}
      >
        {children}
        {/* Pista visual (lupa) de que la imagen se puede ampliar */}
        <span className="pointer-events-none absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md border border-white/15 bg-black/55 text-white/80 opacity-0 backdrop-blur transition-opacity group-hover/zoom:opacity-100">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3M11 8.5v5M8.5 11h5" />
          </svg>
        </span>
      </button>

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              onClick={() => setOpen(false)}
              className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity duration-200 ${
                shown ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Botón cerrar */}
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/10 text-white/85 transition hover:border-white/30 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              {/* Imagen grande (img normal: detalle completo sin recortes ni
                  recompresión, y sin atarse a remotePatterns de next/image). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] max-w-[92vw] cursor-default rounded-lg object-contain shadow-2xl"
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
}
