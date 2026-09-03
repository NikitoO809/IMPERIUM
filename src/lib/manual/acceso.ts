// Quién puede abrir el Manual de Atreia.
//
// El manual ya no vive en el panel: es una página del sitio a la que solo se
// entra con el enlace completo, porque la URL lleva dentro una clave.
//
// La clave NO puede estar en el código: el repositorio es público en GitHub y
// cualquiera la leería. Vive en la variable de entorno MANUAL_CLAVE, en
// .env.local y en Vercel. Si falta, no se abre nada — mejor un manual
// inaccesible que uno abierto de par en par.
//
// Miguel la eligió corta ("privado") a sabiendas: nadie llega por un buscador,
// pero quien mire la URL puede acertarla. Cambiarla es editar la variable en
// Vercel y volver a desplegar; el enlace viejo deja de funcionar en el acto.
import { timingSafeEqual } from "node:crypto";

/** ¿Es esta la clave del enlace? */
export function claveValida(clave: string): boolean {
  const buena = process.env.MANUAL_CLAVE;
  if (!buena) return false;

  // Se comparan los dos textos en tiempo constante, para que el servidor no
  // tarde más cuanto más se acerque alguien a acertarla.
  const a = Buffer.from(clave);
  const b = Buffer.from(buena);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** El enlace del índice, para volver desde una guía. */
export const indiceHref = (clave: string) => `/manual/${encodeURIComponent(clave)}`;
