"use client";

// Botón de envío que pide confirmación antes de ejecutar la acción
// (para borrados u operaciones irreversibles).
export function ConfirmButton({
  children,
  message = "¿Seguro? Esta acción no se puede deshacer.",
  className = "",
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
