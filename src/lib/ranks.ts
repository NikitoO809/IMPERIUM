// Definición de rangos del equipo IMPERIUM. Módulo PURO (sin "server-only"
// ni "use client") para poder usarlo tanto en componentes de servidor como
// de cliente. La seguridad real vive en la base de datos (RLS + triggers);
// esto es solo presentación y conveniencia para la UI.

export type Rank = "supremo" | "admin" | "moderador" | "user";

// Jerarquía (mayor número = más privilegios).
export const RANK_LEVEL: Record<Rank, number> = {
  user: 0,
  moderador: 1,
  admin: 2,
  supremo: 3,
};

// Etiqueta visible en la UI.
export const RANK_LABEL: Record<Rank, string> = {
  supremo: "Supremo",
  admin: "Admin",
  moderador: "Moderador",
  user: "Miembro",
};

// Clases de color (HUD) por rango, para badges.
export const RANK_BADGE: Record<Rank, string> = {
  supremo: "text-amber-300 ring-amber-400/40 bg-amber-400/10",
  admin: "text-accent ring-accent/40 bg-accent/10",
  moderador: "text-emerald-300 ring-emerald-400/40 bg-emerald-400/10",
  user: "text-white/50 ring-white/15 bg-white/5",
};

// ¿Tiene acceso al panel? (staff = supremo, admin, moderador)
export function isStaff(rank: Rank): boolean {
  return RANK_LEVEL[rank] >= RANK_LEVEL.moderador;
}

// ¿Puede publicar y borrar contenido grande? (supremo, admin)
export function canPublish(rank: Rank): boolean {
  return RANK_LEVEL[rank] >= RANK_LEVEL.admin;
}

// ¿Es el Supremo? (gestiona rangos)
export function isSupremo(rank: Rank): boolean {
  return rank === "supremo";
}

// Rangos que el Supremo puede asignar a otros miembros.
export const ASSIGNABLE_RANKS: Rank[] = ["admin", "moderador", "user"];
