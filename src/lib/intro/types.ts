// Contratos compartidos entre el motor de la intro y las piezas del mundo.
import type * as THREE from "three";
import type { TierConfig } from "./quality";

export type IntroMode = "full" | "short";

export interface WorldCtx {
  scene: THREE.Scene;
  tier: TierConfig;
  mode: IntroMode;
  sunDir: THREE.Vector3; // dirección HACIA el sol, normalizada
  fogColor: THREE.Color;
  textures: { soft: THREE.Texture; emblem: THREE.Texture };
  rng: () => number; // determinista: el mundo sale igual siempre
}

export interface FrameState {
  time: number; // segundos de la línea de tiempo
  dt: number;
  camPos: THREE.Vector3;
  networkOn: number; // 0..1, la red de conexión encendida
}

export interface WorldPart {
  update?(s: FrameState): void;
  dispose(): void;
}

// Libera geometrías y materiales de todo un subárbol y lo saca de la escena.
export function disposeObject(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else if (mat) mat.dispose();
  });
  root.removeFromParent();
}
