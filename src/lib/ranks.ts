// Definición de rangos de IMPERIUM. Módulo PURO (sin "server-only" ni
// "use client") para poder usarlo tanto en componentes de servidor como de
// cliente. La seguridad real vive en la base de datos (RLS + triggers); esto es
// solo presentación y conveniencia para la UI.
//
// La escalera tiene tres bloques:
//   user                       → Recluta (gratis, al entrar con Discord)
//   veterano · fundador · leyenda → DONANTES (apoyan el proyecto): escriben en la
//                                   discusión, crean alianzas y usan el Asistente IA
//   tester · moderador · admin · supremo → EQUIPO (pruebas internas + gestión)

export type Rank =
  | "user"
  | "veterano"
  | "fundador"
  | "leyenda"
  | "tester"
  | "moderador"
  | "admin"
  | "supremo";

// Jerarquía (mayor número = más privilegios). Los donantes van por encima del
// Recluta y por debajo del equipo. 'tester' es un rango interno de pruebas que
// disfruta de lo mismo que un donante alto sin pagar.
export const RANK_LEVEL: Record<Rank, number> = {
  user: 0,
  veterano: 1,
  fundador: 2,
  leyenda: 3,
  tester: 4,
  moderador: 5,
  admin: 6,
  supremo: 7,
};

// Etiqueta visible en la UI.
export const RANK_LABEL: Record<Rank, string> = {
  user: "Recluta",
  veterano: "Veterano",
  fundador: "Fundador",
  leyenda: "Leyenda",
  tester: "Tester",
  moderador: "Moderador",
  admin: "Admin",
  supremo: "Supremo",
};

// Clases de color (HUD) por rango, para badges. Donantes: bronce → cian → oro.
export const RANK_BADGE: Record<Rank, string> = {
  user: "text-white/50 ring-white/15 bg-white/5",
  veterano: "text-orange-300 ring-orange-400/40 bg-orange-400/10",
  fundador: "text-cyan-300 ring-cyan-400/40 bg-cyan-400/10",
  leyenda: "text-yellow-300 ring-yellow-400/40 bg-yellow-400/10",
  tester: "text-sky-300 ring-sky-400/40 bg-sky-400/10",
  moderador: "text-emerald-300 ring-emerald-400/40 bg-emerald-400/10",
  admin: "text-accent ring-accent/40 bg-accent/10",
  supremo: "text-amber-300 ring-amber-400/40 bg-amber-400/10",
};

// Cupo diario de consultas al Asistente IA por rango (red de seguridad de coste:
// cada consulta cuesta tokens de la API). El Recluta no puede usarlo (0). Los
// donantes suben de cupo; el equipo tiene cupo amplio para gestionar.
export const ASSISTANT_DAILY_LIMIT_BY_RANK: Record<Rank, number> = {
  user: 0,
  veterano: 10,
  fundador: 30,
  leyenda: 100,
  tester: 100,
  moderador: 200,
  admin: 200,
  supremo: 200,
};

// Cupo diario del Asistente IA para un rango dado.
export function assistantDailyLimit(rank: Rank): number {
  return ASSISTANT_DAILY_LIMIT_BY_RANK[rank] ?? 0;
}

// ¿Es donante? (veterano, fundador o leyenda). No incluye al equipo.
export function isDonor(rank: Rank): boolean {
  return rank === "veterano" || rank === "fundador" || rank === "leyenda";
}

// ¿Puede PARTICIPAR? (escribir en la discusión, crear alianzas). Donantes y
// equipo sí; el Recluta no. Es el permiso central del modelo "mirar gratis,
// participar de pago".
export function canParticipate(rank: Rank): boolean {
  return RANK_LEVEL[rank] >= RANK_LEVEL.veterano;
}

// ¿Tiene acceso al panel? (staff = moderador, admin, supremo)
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

// ¿Puede USAR el asistente IA? (donante o superior; el Recluta no)
export function canUseAssistant(rank: Rank): boolean {
  return assistantDailyLimit(rank) > 0;
}

// Rangos que el Supremo puede asignar a otros miembros (incluye los de donante,
// que al principio se asignan a mano tras una donación en Ko-fi).
export const ASSIGNABLE_RANKS: Rank[] = [
  "leyenda",
  "fundador",
  "veterano",
  "admin",
  "moderador",
  "tester",
  "user",
];
