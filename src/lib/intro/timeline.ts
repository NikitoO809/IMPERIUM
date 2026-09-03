// Línea de tiempo de la cinemática: por dónde vuela la cámara (fotogramas
// clave sobre una spline) y cuándo salen los textos (cues). Las alturas van
// "sobre el terreno", así la cámara nunca se mete dentro de una montaña.
import * as THREE from "three";

export interface Keyframe {
  t: number;    // segundo
  x: number;    // posición de la cámara (x, z) y altura sobre el suelo
  z: number;
  alt: number;
  lx: number;   // punto al que mira (x, z) y altura sobre el suelo
  lz: number;
  lalt: number;
  fov: number;
  // Con "fortress", la altura se mide desde el suelo de la fortaleza (no el
  // local): así los planos finales encuadran la fortaleza entera.
  ref?: "fortress";
  lref?: "fortress";
}

export type CueType = "caption" | "clear" | "title" | "tagline" | "enter";
export interface Cue {
  at: number;
  type: CueType;
  label?: string;
  text?: string;
}

// La versión corta arranca en la revelación de la fortaleza.
export const SHORT_START = 24.5;
// Desde aquí la cámara solo deriva despacio mientras el visitante decide.
export const HOLD_START = 30;

export const FRAMES: Keyframe[] = [
  // oscuridad → la chispa → el valle se abre
  { t: 0,    x: 40,   z: 1350,  alt: 70,  lx: 0,    lz: 900,   lalt: 40,  fov: 50 },
  { t: 4.5,  x: 30,   z: 1150,  alt: 75,  lx: 0,    lz: 700,   lalt: 50,  fov: 52 },
  // vuelo bajo por el valle hacia la loma de los aventureros (COMUNIDAD)
  { t: 9,    x: -140, z: 520,   alt: 95,  lx: -380, lz: -120,  lalt: 30,  fov: 55 },
  { t: 12.2, x: -330, z: -250,  alt: 16,  lx: -385, lz: -345,  lalt: 8,   fov: 56 },
  // el círculo de runas (GUÍAS)
  { t: 14.2, x: -470, z: -540,  alt: 60,  lx: -700, lz: -1000, lalt: 25,  fov: 54 },
  { t: 17.2, x: -820, z: -880,  alt: 55,  lx: -700, lz: -1000, lalt: 22,  fov: 50 },
  // subida: el mundo entero y la fortaleza a lo lejos (MMORPG)
  { t: 19.6, x: -620, z: -420,  alt: 480, lx: 0,    lz: -1500, lalt: 400, fov: 58 },
  { t: 22,   x: 380,  z: -60,   alt: 640, lx: 0,    lz: -1500, lalt: 480, fov: 58 },
  // la red se enciende (DISCORD) y giramos hacia la fachada
  { t: 24.5, x: 520,  z: -900,  alt: 380, lx: 0,    lz: -1500, lalt: 620, fov: 52 },
  // revelación: la fortaleza entera, de frente, y el título encima
  { t: 27.5, x: 240,  z: -160,  alt: 360, ref: "fortress", lx: 0, lz: -1500, lalt: 310, lref: "fortress", fov: 50 },
  { t: 30,   x: 0,    z: -400,  alt: 300, ref: "fortress", lx: 0, lz: -1500, lalt: 300, lref: "fortress", fov: 48 },
  { t: 44,   x: 0,    z: -470,  alt: 290, ref: "fortress", lx: 0, lz: -1500, lalt: 298, lref: "fortress", fov: 47 },
];

export const CUES_FULL: Cue[] = [
  { at: 9.0,  type: "caption", label: "Comunidad", text: "Un grupo que avanza junto." },
  { at: 13.8, type: "caption", label: "Guías",     text: "Runas, mapas y el conocimiento del gremio." },
  { at: 17.8, type: "caption", label: "MMORPG",    text: "Fortalezas, raids y mundos abiertos." },
  { at: 21.6, type: "caption", label: "Discord",   text: "Conectados desde cualquier lugar." },
  { at: 24.8, type: "clear" },
  { at: 26.8, type: "title" },
  { at: 28.3, type: "tagline" },
  { at: 29.6, type: "enter" },
];

export const CUES_SHORT: Cue[] = [
  { at: 26.4, type: "title" },
  { at: 27.7, type: "tagline" },
  { at: 28.8, type: "enter" },
];

export interface CameraPath {
  pos: THREE.CatmullRomCurve3;
  look: THREE.CatmullRomCurve3;
  times: number[];
  fovs: number[];
}

export function buildPath(
  frames: Keyframe[],
  heightAt: (x: number, z: number) => number,
  refs: { fortress: number }
): CameraPath {
  const pos = frames.map((f) => new THREE.Vector3(f.x, (f.ref ? refs[f.ref] : heightAt(f.x, f.z)) + f.alt, f.z));
  const look = frames.map((f) => new THREE.Vector3(f.lx, (f.lref ? refs[f.lref] : heightAt(f.lx, f.lz)) + f.lalt, f.lz));
  return {
    pos: new THREE.CatmullRomCurve3(pos, false, "centripetal"),
    look: new THREE.CatmullRomCurve3(look, false, "centripetal"),
    times: frames.map((f) => f.t),
    fovs: frames.map((f) => f.fov),
  };
}

export interface CameraSample {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
}

// Posición, mirada y fov en el segundo t (los tramos van a su ritmo: los
// fotogramas más separados en el tiempo son los tramos lentos).
export function samplePath(path: CameraPath, t: number, out: CameraSample) {
  const { times } = path;
  const n = times.length;
  const tt = Math.min(Math.max(t, times[0]), times[n - 1]);
  let i = 0;
  while (i < n - 2 && tt >= times[i + 1]) i++;
  const f = (tt - times[i]) / (times[i + 1] - times[i]);
  const u = (i + f) / (n - 1);
  path.pos.getPoint(u, out.pos);
  path.look.getPoint(u, out.look);
  out.fov = path.fovs[i] + (path.fovs[i + 1] - path.fovs[i]) * f;
}
