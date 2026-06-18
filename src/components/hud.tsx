// Piezas reutilizables del HUD de IMPERIUM.

type DivProps = React.HTMLAttributes<HTMLDivElement>;

// Panel biselado con borde luminoso. Envuelve cualquier contenido.
export function Panel({
  className = "",
  innerClassName = "",
  accent = false,
  corners = false,
  children,
  ...rest
}: DivProps & {
  innerClassName?: string;
  accent?: boolean;
  corners?: boolean;
}) {
  return (
    <div
      className={`panel ${accent ? "panel-accent" : ""} ${corners ? "corners" : ""} ${className}`}
      {...rest}
    >
      <div className={`panel-inner ${innerClassName}`}>{children}</div>
    </div>
  );
}

// Etiqueta tipo HUD: "// TEXTO" en mayúsculas con tracking.
export function HudLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`hud-label text-[11px] text-accent/80 ${className}`}>
      <span className="text-accent/50">{"// "}</span>
      {children}
    </span>
  );
}

// Barra de XP / progreso.
export function XpBar({ value, className = "" }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`xpbar ${className}`}>
      <span style={{ width: `${v}%` }} />
    </div>
  );
}
