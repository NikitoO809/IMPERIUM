// Formato del Manual de Atreia (guías privadas de Aion 2).
//
// La idea: el contenido son DATOS, no maquetación. Cada texto lleva sus dos
// idiomas al lado, y el visor decide cuál pinta. Así, añadir una clase nueva
// es escribir un fichero como el de Gladiator y nada más — ni tocar el visor
// ni duplicar la página en inglés.

/** Un texto en los dos idiomas. */
export type Par = { es: string; en: string };

/** Fila de la tabla de stats, con su barra de adopción. */
export type FilaStat = {
  nombre: Par;
  nota: Par;
  /** % de jugadores de élite que lo lleva. */
  pct: number;
  /** true = está al 100% y no se discute. */
  top?: boolean;
};

/** Paso de una rotación de combate. */
export type Paso = {
  texto: Par;
  nota?: Par;
  /** Nombre coreano, cuando el paso es una habilidad: de ahí cuelga su icono. */
  ko?: string;
  /** Icono del juego, si lo tenemos. */
  icono?: string;
  /** El paso que manda sobre los demás. */
  clave?: boolean;
};

/** Ficha de una habilidad. */
export type Skill = {
  orden: Par;
  nombre: Par;
  /** Nombre coreano, para poder buscarlo en las fuentes originales. */
  ko: string;
  /** Icono del juego, si lo tenemos. */
  icono?: string;
  puntos: Par[];
};

/** Tarjeta con título, subtítulo y una lista. */
export type Tarjeta = {
  titulo: Par;
  sub?: Par;
  puntos: Par[];
  /** Numera la lista en vez de usar viñetas. */
  ordenada?: boolean;
  nota?: Par;
};

/** Pestaña con contenido propio (los seis oficios, por ejemplo). */
export type Pestana = {
  titulo: Par;
  bloques: Bloque[];
};

export type Bloque =
  | { t: "parrafo"; texto: Par }
  /** Pestañas con contenido anidado. */
  | { t: "pestanas"; items: Pestana[] }
  /** La calculadora de crafteos: cuántas veces fabricar para subir de nivel. */
  | { t: "calculadora" }
  | { t: "tabla"; cabeceras: Par[]; filas: Par[][]; primeraNum?: boolean }
  | { t: "stats"; filas: FilaStat[] }
  | { t: "tarjetas"; columnas?: 2 | 3; items: Tarjeta[] }
  | { t: "skills"; items: Skill[] }
  | { t: "rotacion"; titulo: Par; cuando: Par; pasos: Paso[] }
  | { t: "aviso"; parrafos: Par[] }
  | { t: "subtitulo"; texto: Par }
  | { t: "fuentes"; items: { valor: string; titulo: Par; texto: Par }[] };

export type Seccion = {
  eyebrow: Par;
  titulo: Par;
  intro?: Par[];
  bloques: Bloque[];
  /** Sección que cambia según PvE o PvP. */
  porModo?: { pve: Bloque[]; pvp: Bloque[] };
};

export type Portada = {
  eyebrow: Par;
  titulo: string;
  lede: Par;
  /** Cifras de cabecera: valor + etiqueta. */
  cifras?: { valor: string; etiqueta: Par }[];
  /** Arte de portada, si lo tenemos. */
  arte?: string;
};

export type Guia = {
  /** Parte de la URL: /manual/<clave>/<slug> */
  slug: string;
  /** Nombre en el índice y en la pestaña. */
  nombre: string;
  /** Una línea para la tarjeta del índice. */
  resumen: Par;
  /** Color de acento de la guía, en hex. */
  acento: string;
  portada: Portada;
  secciones: Seccion[];
  /** De dónde salen los datos y qué hay que verificar. */
  fuentes: Par[];
};

/** Elige el idioma de un texto. */
export const t = (par: Par, lang: "es" | "en"): string => par[lang];
