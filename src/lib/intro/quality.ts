// Nivel de calidad de la intro según el dispositivo. Tres niveles reales
// (alto, medio, bajo) y "off": sin intro, para quien pide menos movimiento,
// ahorra datos o tiene una gráfica por software. Se puede forzar desde la URL.

export type Tier = "high" | "medium" | "low" | "off";

export interface TierConfig {
  name: Exclude<Tier, "off">;
  pixelRatio: number;      // tope de densidad de píxeles
  terrainSegments: number; // resolución del relieve
  trees: number;           // árboles instanciados
  motes: number;           // partículas flotantes
  creatures: number;       // siluetas voladoras
  beacons: number;         // puntos de la red de conexión
  rays: number;            // haces de luz
  parallax: boolean;       // la cámara reacciona al ratón
  fogDensity: number;
}

export const TIERS: Record<Exclude<Tier, "off">, TierConfig> = {
  high:   { name: "high",   pixelRatio: 1.5,  terrainSegments: 256, trees: 6000, motes: 1600, creatures: 7, beacons: 7, rays: 6, parallax: true,  fogDensity: 0.00072 },
  medium: { name: "medium", pixelRatio: 1.0,  terrainSegments: 180, trees: 3200, motes: 900,  creatures: 5, beacons: 6, rays: 4, parallax: true,  fogDensity: 0.00078 },
  low:    { name: "low",    pixelRatio: 0.75, terrainSegments: 110, trees: 1200, motes: 450,  creatures: 3, beacons: 4, rays: 2, parallax: false, fogDensity: 0.00095 },
};

type NavigatorExtra = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

// Nombre de la GPU que expone WebGL (vacío si no se puede saber).
function gpuName(): string | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) return null;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return name;
  } catch {
    return null;
  }
}

export function detectTier(force: Tier | null = null): Tier {
  if (force) return force;
  if (typeof window === "undefined") return "off";

  const nav = navigator as NavigatorExtra;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  if (nav.connection?.saveData) return "off";

  const gpu = gpuName();
  if (gpu === null) return "off"; // sin WebGL
  if (/swiftshader|llvmpipe|software|mesa offscreen/i.test(gpu)) return "off";

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const mobile = window.matchMedia("(pointer: coarse)").matches || /Android|iPhone|iPad|Mobile/i.test(nav.userAgent);

  if (mobile) return memory >= 3 ? "low" : "off";
  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4) return "medium";
  return "low";
}
