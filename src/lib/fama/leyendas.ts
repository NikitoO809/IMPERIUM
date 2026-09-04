// LAS LEYENDAS DEL SALÓN DE LA FAMA — la foto de familia del gremio.
//
// Cada entrada es un personaje del escenario 3D de /fama: su nombre, su
// guild, el arte (public/fama/leyendas/<id>.webp, generado con
// scripts/fama/generar_leyendas.py y recortado con procesar_leyendas.py) y el
// gesto que hace al pasar el ratón (`efecto`), con las anclas que ese gesto
// necesita: dónde está la mano, la cabeza o el arma DENTRO de la imagen.
//
// Las anclas son (u, v) entre 0 y 1 medidas desde la esquina superior
// izquierda de la imagen. Para leerlas a ojo, mira scripts/fama/raw/rejilla/
// (cada imagen con una rejilla de 0,1 en 0,1 encima).
//
// El ORDEN de la lista es el orden en la fila (de izquierda a derecha). Los
// que tienen `vuela` no ocupan sitio en la fila: flotan donde diga su ficha.
// Para añadir una leyenda: genera su arte (ver los scripts), añade su entrada
// aquí y listo. Para esconder una sin borrarla: `oculto: true`.
import arte from "./leyendas-arte.json";

export type EfectoId =
  | "escudo"    // paso al frente + onda de choque en el suelo
  | "luz"       // haz de luz sagrada desde arriba
  | "sombra"    // humo de sombra y destello de las dagas
  | "arcano"    // el orbe se enciende y orbitan chispas
  | "flecha"    // tensa el arco y sale una flecha de energía
  | "espiritus" // fuegos fatuos violetas que la rodean
  | "fuego"     // levanta la espada y salen ascuas
  | "viento"    // ráfaga: capa y telas al viento, polvo cruzando
  | "explosion" // retroceso, fogonazo y humo del cañón
  | "hielo"     // cristales de escarcha y vaho frío en la mano
  | "aura"      // pulso de aura roja alrededor del cuerpo
  | "veneno"    // las hojas se encienden en verde y gotean
  | "rayo"      // relámpagos por el hacha y fogonazo
  | "petalos"   // florete de katana con pétalos de cerezo
  | "alas"      // alas de luz doradas a la espalda (Daeva)
  | "runas"     // círculo de runas girando a los pies
  | "estela"    // (vuela) picado hacia la cámara, aleteo fuerte y lluvia de plumas de luz
  | "halo"      // (vuela) se eleva y un halo de luz se expande a su alrededor
  | "muro"      // levanta el escudo y una barrera de luz recibe los impactos
  | "filo";     // asesino: se desvanece a parpadeos y las dos hojas relampaguean

export type Ancla = [number, number];

export type Leyenda = {
  id: string;
  nombre: string;
  guild: string;
  efecto: EfectoId;
  color: string;   // color del gesto y de la luz de borde al pasar el ratón
  mano: Ancla;     // mano, orbe o arma que brilla
  cabeza?: Ancla;  // por encima de la cabeza (haz de luz); si falta: [0.5, 0.06]
  espalda?: Ancla; // entre los omóplatos (las alas nacen ahí); si falta: [0.5, 0.3]
  arma?: {
    pivote: Ancla; // dónde se agarra el arma (eje del giro)
    punta: Ancla;  // punta del arma (lo que sube)
    radio?: number; // ancho de la zona que se mueve, fracción del alto (0,1 por defecto)
    angulo?: number; // grados que sube (8 por defecto)
  };
  escala?: number; // ajuste fino de tamaño (1 = normal)
  lider?: boolean; // el líder lleva un halo dorado permanente y un charco de luz más vivo
  oculto?: boolean;
  // Los que vuelan no ocupan sitio en la fila: flotan donde se les diga.
  // x en unidades (un personaje mide 2 de alto; la fila va de -6 a 6 aprox.),
  // y = altura de los pies sobre el suelo, z positivo = más cerca de la cámara.
  vuela?: { x: number; y: number; z: number };
};

// Hueco en medio de la fila para el líder: los `tras` primeros de la fila
// quedan a la izquierda del hueco y el resto a la derecha.
export const HUECO = { tras: 8, ancho: 1.3 };

const IMPERIUM = "IMPERIUM";

export const LEYENDAS: Leyenda[] = [
  // ── izquierda del hueco (los dos últimos, sublíderes, pegados a Nash) ──
  { id: "truma", nombre: "Truma", guild: IMPERIUM, efecto: "luz", color: "#fff1c9",
    mano: [0.15, 0.22], cabeza: [0.5, 0.04] },
  { id: "seiya", nombre: "Seiya", guild: IMPERIUM, efecto: "alas", color: "#ffe08a",
    mano: [0.85, 0.42], espalda: [0.5, 0.27] },
  { id: "skyy", nombre: "SkyY", guild: IMPERIUM, efecto: "filo", color: "#bfe9ff",
    mano: [0.14, 0.64], arma: { pivote: [0.27, 0.5], punta: [0.05, 0.8], radio: 0.1, angulo: 6 } },
  { id: "terra", nombre: "Terra", guild: IMPERIUM, efecto: "flecha", color: "#6ff0b0",
    mano: [0.72, 0.5], arma: { pivote: [0.72, 0.5], punta: [0.85, 0.1], radio: 0.1, angulo: 6 } },
  { id: "oriana", nombre: "Oriana", guild: IMPERIUM, efecto: "espiritus", color: "#c07cff",
    mano: [0.13, 0.1] },
  { id: "oni", nombre: "ONI", guild: IMPERIUM, efecto: "fuego", color: "#ff7a2a",
    mano: [0.4, 0.58], arma: { pivote: [0.4, 0.58], punta: [0.06, 0.9], radio: 0.11, angulo: 7 } },
  { id: "hennesy", nombre: "Hennesy", guild: IMPERIUM, efecto: "muro", color: "#ffcf5a",
    mano: [0.74, 0.55], arma: { pivote: [0.15, 0.55], punta: [0.05, 0.88], radio: 0.1, angulo: 6 } },
  { id: "nikitoo", nombre: "NikitoO", guild: IMPERIUM, efecto: "sombra", color: "#8a5cff",
    mano: [0.3, 0.5] },
  // ── derecha del hueco (los dos primeros, sublíderes, pegados a Nash) ──
  { id: "hanamichi", nombre: "Hanamichi", guild: IMPERIUM, efecto: "petalos", color: "#ffa4c4",
    mano: [0.6, 0.52], arma: { pivote: [0.6, 0.52], punta: [0.06, 0.6], radio: 0.09, angulo: 8 } },
  { id: "serpiente", nombre: "Serpienny", guild: IMPERIUM, efecto: "veneno", color: "#7cff4a",
    mano: [0.72, 0.55], arma: { pivote: [0.72, 0.55], punta: [0.88, 0.3], radio: 0.1, angulo: 6 } },
  { id: "veint", nombre: "Veint", guild: IMPERIUM, efecto: "viento", color: "#9ff0d0",
    mano: [0.3, 0.45] },
  { id: "bomber", nombre: "BombeRjh", guild: IMPERIUM, efecto: "explosion", color: "#ffb347",
    mano: [0.4, 0.5], arma: { pivote: [0.5, 0.6], punta: [0.06, 0.4], radio: 0.1, angulo: 4 } },
  { id: "glou", nombre: "Glou", guild: IMPERIUM, efecto: "hielo", color: "#9fdcff",
    mano: [0.18, 0.22] },
  { id: "blackats", nombre: "Blackats", guild: IMPERIUM, efecto: "aura", color: "#ff3b3b",
    mano: [0.2, 0.5] },
  { id: "godofwar", nombre: "GodOfWar", guild: IMPERIUM, efecto: "rayo", color: "#cfe6ff",
    mano: [0.3, 0.4], arma: { pivote: [0.3, 0.45], punta: [0.2, 0.08], radio: 0.12, angulo: 6 } },
  { id: "dnavits", nombre: "Dnavits", guild: IMPERIUM, efecto: "escudo", color: "#4ff0e0",
    mano: [0.15, 0.55] },
  { id: "godplayer", nombre: "Godplayer", guild: IMPERIUM, efecto: "runas", color: "#c9a2ff",
    mano: [0.15, 0.06] },
  // ── los que vuelan ──
  // Nash, el líder: flota en el hueco del centro, por delante de la fila y
  // algo más alto que todos, con su halo
  { id: "nashin", nombre: "Nash", guild: IMPERIUM, efecto: "estela", color: "#ffd27a",
    mano: [0.5, 0.5], escala: 1.06, lider: true, vuela: { x: 0, y: 0.85, z: 1.3 } },
  // Celeris, sublíder: vuela en el flanco izquierdo (el lado corto de la fila)
  { id: "celeris", nombre: "Celeris", guild: IMPERIUM, efecto: "halo", color: "#9fdcff",
    mano: [0.5, 0.5], escala: 0.95, vuela: { x: -7.4, y: 1.35, z: 0.3 } },
];

// Proporción ancho/alto de cada imagen (la escribe procesar_leyendas.py).
const ARTE = arte as Record<string, { w: number; h: number }>;

export function aspectoDe(id: string): number {
  const a = ARTE[id];
  return a ? a.w / a.h : 0.62;
}

export function rutaArte(id: string): string {
  return `/fama/leyendas/${id}.webp`;
}

export function rutaRelieve(id: string): string {
  return `/fama/leyendas/${id}-relieve.png`;
}

export const LEYENDAS_VISIBLES = LEYENDAS.filter((l) => !l.oculto);
