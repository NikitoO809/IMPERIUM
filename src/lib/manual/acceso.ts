// Quién puede abrir el Manual de Atreia.
//
// El manual ya no vive en el panel: es una página del sitio a la que solo se
// entra con el enlace completo, porque la URL lleva dentro una clave.
//
// La clave NO puede estar en el código: el repositorio es público en GitHub y
// cualquiera la leería. Vive en la variable de entorno MANUAL_CLAVE, en
// .env.local y en Vercel. Si falta, no se abre nada — mejor un manual
// inaccesible que uno abierto de par en par.
import { timingSafeEqual } from "node:crypto";

/** Longitud mínima para que la clave no se pueda adivinar a fuerza bruta. */
const MINIMO = 16;

/** ¿Es esta la clave del enlace? */
export function claveValida(clave: string): boolean {
  const buena = process.env.MANUAL_CLAVE;
  if (!buena || buena.length < MINIMO) return false;

  // Se comparan los dos textos en tiempo constante, para que el servidor no
  // tarde más cuanto más se acerque alguien a acertarla.
  const a = Buffer.from(clave);
  const b = Buffer.from(buena);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** El enlace del índice, para volver desde una guía. */
export const indiceHref = (clave: string) => `/manual/${encodeURIComponent(clave)}`;
