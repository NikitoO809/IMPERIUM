// Clases de Tailwind reutilizadas en los formularios del panel de admin.
// Módulo neutro (no "use client" ni "server-only") para poder importarlo
// desde los componentes de servidor del panel.
export const labelCls = "hud-label mb-1 block text-[10px] text-white/50";

export const inputCls =
  "w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-accent/50 placeholder:text-white/30";

export const textareaCls = `${inputCls} min-h-[90px] resize-y`;

export const btnPrimary = "btn-hud bg-brand px-4 py-2 text-white";
export const btnGhost = "btn-hud bg-white/10 px-4 py-2 text-white";
export const btnDanger = "btn-hud bg-red-500/20 px-3 py-2 text-red-200 ring-1 ring-red-500/30";
