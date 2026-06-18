// Ayuda de formato para las cajas de "Contenido" del panel. Explica en una línea
// las convenciones que entiende el renderizador (RichText) para que el texto se
// vea bien en la web: viñetas, listas numeradas, párrafos y tablas.
export function FormatHint() {
  return (
    <p className="mt-1.5 text-[10px] leading-relaxed text-white/35">
      <span className="text-white/45">Formato:</span>{" "}
      escribe <code className="rounded bg-white/10 px-1 text-white/60">- </code> al inicio para viñetas ·{" "}
      <code className="rounded bg-white/10 px-1 text-white/60">1. </code> para listas numeradas ·{" "}
      deja una <span className="text-white/55">línea en blanco</span> para separar párrafos ·{" "}
      separa columnas con <code className="rounded bg-white/10 px-1 text-white/60">|</code> para hacer una tabla.
    </p>
  );
}
