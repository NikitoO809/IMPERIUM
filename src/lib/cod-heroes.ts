// Dataset de EJEMPLO/PRUEBA: tier list de héroes de Call of Dragons.
// Fuente: https://callofdragonsguides.com/heroes-tier-list/ (junio 2026).
// Categoría: general/mixta (PvP, PvE, Peacekeeping, Garrison, Rally, Gathering).
// En la Fase 2/4 estos datos vivirán en Supabase y los cargará el admin.

export const HERO_SOURCE = "https://callofdragonsguides.com/heroes-tier-list/";

export type Tier = "S+" | "S" | "A" | "B" | "C";
export type HeroClass = "Magic" | "Overall" | "Marksman" | "Cavalry" | "Infantry";
// Rol/escenario en el que el héroe es mejor
export type BestRole = "Rally" | "Garrison" | "PvP" | "Peacekeeping" | "Engineering";

export type Hero = {
  name: string;
  tier: Tier;
  heroClass: HeroClass;
  role: string; // estilo de juego (Tanque, Soporte, Control…)
  bestRole: BestRole; // escenario donde rinde mejor
};

export const TIERS: Tier[] = ["S+", "S", "A", "B", "C"];
export const CLASSES: HeroClass[] = ["Magic", "Overall", "Marksman", "Cavalry", "Infantry"];
export const BEST_ROLES: BestRole[] = ["Rally", "Garrison", "PvP", "Peacekeeping", "Engineering"];

// Etiqueta visible (español) del mejor rol
export const BEST_ROLE_LABEL: Record<BestRole, string> = {
  Rally: "Rally (ataque)",
  Garrison: "Guarnición",
  PvP: "PvP / campo",
  Peacekeeping: "PvE (monstruos)",
  Engineering: "Ingeniería",
};

// Color de la etiqueta del mejor rol
export const BEST_ROLE_STYLE: Record<BestRole, string> = {
  Rally: "bg-rose-500/20 text-rose-300 ring-rose-400/30",
  Garrison: "bg-sky-500/20 text-sky-300 ring-sky-400/30",
  PvP: "bg-violet-500/20 text-violet-300 ring-violet-400/30",
  Peacekeeping: "bg-emerald-500/20 text-emerald-300 ring-emerald-400/30",
  Engineering: "bg-amber-500/20 text-amber-300 ring-amber-400/30",
};

// Orden para ordenar por tier (S+ primero)
export const TIER_ORDER: Record<Tier, number> = { "S+": 0, S: 1, A: 2, B: 3, C: 4 };

// Estilo de color por tier (clases Tailwind para fondo/texto)
export const TIER_STYLE: Record<Tier, string> = {
  "S+": "bg-gradient-to-br from-fuchsia-400 to-rose-500 text-black",
  S: "bg-gradient-to-br from-rank to-amber-600 text-black",
  A: "bg-gradient-to-br from-accent to-cyan-600 text-black",
  B: "bg-gradient-to-br from-brand to-brand-bright text-white",
  C: "bg-white/15 text-white/70",
};

export const HEROES: Hero[] = [
  { name: "Liliya", tier: "S+", heroClass: "Magic", role: "Habilidades / Nuke", bestRole: "Peacekeeping" },
  { name: "Mu Hsiang", tier: "S+", heroClass: "Overall", role: "Soporte", bestRole: "PvP" },
  { name: "Maggrat", tier: "S+", heroClass: "Marksman", role: "Precisión", bestRole: "Garrison" },
  { name: "Theia", tier: "S+", heroClass: "Overall", role: "Soporte", bestRole: "PvP" },
  { name: "Urag", tier: "S", heroClass: "Cavalry", role: "Habilidad", bestRole: "PvP" },
  { name: "Thundelyn", tier: "S", heroClass: "Magic", role: "Control", bestRole: "PvP" },
  { name: "Lei Kuan", tier: "S", heroClass: "Infantry", role: "Tanque", bestRole: "Rally" },
  { name: "Kuma", tier: "S", heroClass: "Infantry", role: "Soporte", bestRole: "PvP" },
  { name: "Goresh", tier: "S", heroClass: "Infantry", role: "Tanque", bestRole: "Rally" },
  { name: "Falgrim", tier: "A", heroClass: "Marksman", role: "Habilidad", bestRole: "PvP" },
  { name: "Lieh Shan Yen", tier: "A", heroClass: "Cavalry", role: "Habilidad", bestRole: "Garrison" },
  { name: "Neya", tier: "A", heroClass: "Cavalry", role: "Movilidad", bestRole: "PvP" },
  { name: "Tobin", tier: "A", heroClass: "Cavalry", role: "Tanque", bestRole: "Rally" },
  { name: "Bertrand", tier: "A", heroClass: "Magic", role: "Habilidades", bestRole: "PvP" },
  { name: "Tohar", tier: "A", heroClass: "Magic", role: "Soporte", bestRole: "Garrison" },
  { name: "Waldyr", tier: "A", heroClass: "Cavalry", role: "Movilidad", bestRole: "PvP" },
  { name: "Emrys", tier: "A", heroClass: "Cavalry", role: "Movilidad", bestRole: "PvP" },
  { name: "Theodore", tier: "A", heroClass: "Cavalry", role: "Habilidades", bestRole: "Garrison" },
  { name: "Zayda", tier: "A", heroClass: "Marksman", role: "Movilidad", bestRole: "PvP" },
  { name: "Velyn", tier: "A", heroClass: "Magic", role: "Control", bestRole: "PvP" },
  { name: "Skogul", tier: "A", heroClass: "Infantry", role: "Movilidad", bestRole: "PvP" },
  { name: "Bakshi", tier: "A", heroClass: "Cavalry", role: "Habilidades", bestRole: "Peacekeeping" },
  { name: "Nika", tier: "B", heroClass: "Infantry", role: "Habilidades", bestRole: "Peacekeeping" },
  { name: "Syndrion", tier: "B", heroClass: "Marksman", role: "Precisión", bestRole: "Rally" },
  { name: "Madeline", tier: "B", heroClass: "Overall", role: "Tanque", bestRole: "PvP" },
  { name: "Garwood", tier: "C", heroClass: "Infantry", role: "Tanque", bestRole: "Garrison" },
  { name: "Hosk", tier: "C", heroClass: "Overall", role: "Precisión", bestRole: "Rally" },
  { name: "Kregg", tier: "C", heroClass: "Marksman", role: "Movilidad", bestRole: "Engineering" },
  { name: "Eliana", tier: "C", heroClass: "Overall", role: "Soporte", bestRole: "Peacekeeping" },
  { name: "Alistair", tier: "C", heroClass: "Cavalry", role: "Tanque", bestRole: "Rally" },
];

// Traducción visible de la clase
export const CLASS_LABEL: Record<HeroClass, string> = {
  Magic: "Magia",
  Overall: "General",
  Marksman: "Tirador",
  Cavalry: "Caballería",
  Infantry: "Infantería",
};

// Héroes extra (no están en el top-30 actual pero sí destacan en temporadas
// anteriores según las fuentes). Ej.: Gwanwyn, el mejor héroe épico.
const EXTRA_HEROES: Hero[] = [
  { name: "Gwanwyn", tier: "A", heroClass: "Marksman", role: "DPS (épico)", bestRole: "PvP" },
];

// Pool completo para resolver las listas por temporada
export const ALL_HEROES: Hero[] = [...HEROES, ...EXTRA_HEROES];
const pick = (names: string[]): Hero[] =>
  names.map((n) => ALL_HEROES.find((h) => h.name === n)).filter((h): h is Hero => !!h);

// ── Temporadas ──
// La tier list es una "foto" del meta vigente y cambia cada temporada.
// "Temporada actual" = tier list completa (real, junio 2026).
// Temporadas anteriores = selección de los MEJORES héroes según fuentes.
export type Season = {
  id: string;
  label: string;
  updated: string | null;
  note: string | null;
  heroes: Hero[];
};

export const SEASONS: Season[] = [
  {
    id: "actual",
    label: "Temporada actual",
    updated: "Jun 2026",
    note: null,
    heroes: HEROES,
  },
  {
    id: "s2",
    label: "Temporada 2 · Hearts of Ice",
    updated: "Ene 2026",
    note: "Selección de los mejores héroes de la Temporada 2 (según fuentes). Las novedades de caballería Agnar y Freya empujan el meta de S2, pero aún no tienen ficha en la web.",
    heroes: pick(["Liliya", "Hosk", "Bakshi", "Waldyr", "Velyn", "Madeline", "Gwanwyn"]),
  },
  {
    id: "s1",
    label: "Temporada 1",
    updated: "Lanzamiento",
    note: "Mejores héroes para empezar y rendir en la Temporada 1 (según fuentes).",
    heroes: pick(["Hosk", "Liliya", "Bakshi", "Waldyr", "Gwanwyn"]),
  },
];
