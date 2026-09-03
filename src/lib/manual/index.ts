// Registro del Manual de Atreia.
//
// Para añadir una clase nueva (Templar, Cleric…): copia gladiator.ts, cambia
// el contenido y añádela a esta lista. El índice, la ruta y el visor se
// enteran solos — no hay nada más que tocar.
import type { Guia } from "./tipos";
import { oficios } from "./oficios";
import { gladiator } from "./gladiator";
import { templar } from "./templar";

export const GUIAS: Guia[] = [oficios, gladiator, templar];

export function getGuia(slug: string): Guia | undefined {
  return GUIAS.find((g) => g.slug === slug);
}

export type { Guia };
export * from "./tipos";
