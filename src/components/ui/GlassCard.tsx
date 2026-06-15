// Tarjeta "doble-bisel" del sistema Glass Etéreo: una carcasa externa con
// hairline + un núcleo interno concéntrico (radios calculados) que aloja el
// contenido. Reemplaza al Panel HUD en el rediseño agencia.
type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({
  className = "",
  innerClassName = "",
  hover = false,
  children,
  ...rest
}: DivProps & { innerClassName?: string; hover?: boolean }) {
  return (
    <div className={`glass ${hover ? "glass-hover" : ""} ${className}`} {...rest}>
      <div className={`glass-inner ${innerClassName}`}>{children}</div>
    </div>
  );
}

// Flecha ultraligera (line) para los botones button-in-button.
export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Flecha derecha ultraligera (para "explorar →").
export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
