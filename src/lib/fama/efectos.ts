// Los dieciséis gestos de las Leyendas: qué pasa cuando el ratón se posa en
// cada una. Cada efecto dura entre 1,4 y 1,8 s, mueve el cuerpo con un gesto
// del shader (GESTO.*) y añade luz, partículas y destellos alrededor del
// personaje. Nada de tarjetas ni datos: solo reacción visual.
//
// `t` va de 0 a 1 a lo largo del gesto; `k = sin(π·t)` sube y baja suave.
import * as THREE from "three";
import type { Ancla, EfectoId, Leyenda } from "./leyendas";
import { GESTO } from "./shaders";
import { dibujarRayos, type Flash, type Flashes, type PoolParticulas } from "./particulas";

export type CtxEfecto = {
  ley: Leyenda;
  color: THREE.Color;
  uni: Record<string, THREE.IUniform>;
  ancla: (a: Ancla, z?: number) => THREE.Vector3; // (u, v) de la imagen → mundo
  pies: () => THREE.Vector3;                        // punto del suelo bajo los pies (o los pies, si vuela)
  mover: (dy: number, dz: number) => void;          // desplaza al personaje mientras dura el gesto
  ancho: number;                                    // ancho del personaje en el mundo
  luz: PoolParticulas;                              // partículas aditivas
  materia: PoolParticulas;                          // humo y pétalos
  flashes: Flashes;
  estado: Record<string, unknown>;                  // memoria de esta activación
  ahora: number;                                    // reloj del escenario (s)
};

export type Efecto = {
  duracion: number;
  gesto: number;
  iniciar?(c: CtxEfecto): void;
  paso(c: CtxEfecto, t: number, dt: number): void;
  terminar?(c: CtxEfecto): void;
};

const PI = Math.PI;
const k = (t: number) => Math.sin(PI * Math.min(Math.max(t, 0), 1));
const entre = (t: number, a: number, b: number) => Math.min(Math.max((t - a) / (b - a), 0), 1);
const suave = (x: number) => x * x * (3 - 2 * x);
const BLANCO = new THREE.Color("#ffffff");
const CALIDO = new THREE.Color("#ffd9a0");
const tmp = new THREE.Vector3();

// Punto intermedio entre dos anclas (para repartir chispas por una hoja).
function sobreArma(c: CtxEfecto, f: number, z = 0.06): THREE.Vector3 {
  const a = c.ley.arma;
  if (!a) return c.ancla(c.ley.mano, z);
  return c.ancla([a.pivote[0] + (a.punta[0] - a.pivote[0]) * f, a.pivote[1] + (a.punta[1] - a.pivote[1]) * f], z);
}

function destello(c: CtxEfecto, clave: string): Flash {
  let f = c.estado[clave] as Flash | undefined;
  if (!f) {
    f = c.flashes.obtener("destello");
    c.estado[clave] = f;
  }
  return f;
}

function flash(c: CtxEfecto, clave: string, tipo: Parameters<Flashes["obtener"]>[0]): Flash {
  let f = c.estado[clave] as Flash | undefined;
  if (!f) {
    f = c.flashes.obtener(tipo);
    c.estado[clave] = f;
  }
  return f;
}

function soltarTodo(c: CtxEfecto) {
  for (const v of Object.values(c.estado)) {
    if (v && typeof v === "object" && "soltar" in v) (v as Flash).soltar();
  }
  c.estado = {};
  c.uni.uWind.value = 0;
}

function pintar(f: Flash, color: THREE.Color, opacidad: number) {
  (f.mat as THREE.SpriteMaterial).color.copy(color);
  (f.mat as THREE.SpriteMaterial).opacity = opacidad;
}

export const EFECTOS: Record<EfectoId, Efecto> = {
  // Paso al frente y onda de choque en el suelo (el escudo golpea).
  escudo: {
    duracion: 1.5,
    gesto: GESTO.paso,
    paso(c, t) {
      const onda = flash(c, "onda", "onda");
      const p = c.pies();
      onda.obj.position.set(p.x, p.y + 0.01, p.z + 0.1);
      const s = 0.4 + suave(entre(t, 0.15, 0.8)) * 2.6;
      onda.obj.scale.set(s, s, 1);
      pintar(onda, c.color, (1 - entre(t, 0.2, 0.85)) * 0.9 * entre(t, 0.12, 0.2));
      if (t > 0.16 && t < 0.24 && !c.estado.golpe) {
        c.estado.golpe = true;
        c.luz.emitir({ pos: p, n: 36, disp: 0.25, vel: [0, 0.9, 0.3], velDisp: 1.1, grav: -2.2, vida: [0.5, 0.9], tam: [0.03, 0.07], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
      }
      const d = destello(c, "mano");
      d.obj.position.copy(c.ancla(c.ley.mano, 0.08));
      const kd = k(entre(t, 0.05, 0.5));
      d.obj.scale.setScalar(0.35 + kd * 0.5);
      pintar(d, c.color, kd * 0.85);
    },
    terminar: soltarTodo,
  },

  // Un haz de luz sagrada baja desde arriba; motas blancas ascienden.
  luz: {
    duracion: 1.8,
    gesto: GESTO.pulso,
    paso(c, t) {
      const haz = flash(c, "haz", "haz");
      const cabeza = c.ancla(c.ley.cabeza ?? [0.5, 0.06], -0.15);
      haz.obj.position.set(cabeza.x, cabeza.y + 1.1, cabeza.z);
      haz.obj.scale.set(0.9 + 0.2 * Math.sin(c.ahora * 6), 3.6, 1);
      pintar(haz, c.color, k(t) * 0.85);
      const d = destello(c, "mano");
      d.obj.position.copy(c.ancla(c.ley.mano, 0.08));
      d.obj.scale.setScalar(0.4 + k(t) * 0.5);
      pintar(d, c.color, k(t) * 0.9);
      if (t < 0.75) {
        const p = c.pies();
        c.luz.emitir({ pos: tmp.set(p.x, p.y + 0.2, p.z + 0.15), n: 2, disp: 0.35, vel: [0, 0.8, 0], velDisp: 0.15, vida: [0.9, 1.6], tam: [0.025, 0.06], color: c.color, color2: CALIDO }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Humo de sombra a los pies y dos destellos violetas en las dagas.
  sombra: {
    duracion: 1.4,
    gesto: GESTO.florete,
    paso(c, t) {
      if (t < 0.6) {
        const p = c.pies();
        c.materia.emitir({ pos: tmp.set(p.x, p.y + 0.15, p.z + 0.12), n: 2, disp: 0.3, vel: [0, 0.45, 0.05], velDisp: 0.25, arrastre: 0.8, vida: [0.8, 1.3], tam: [0.3, 0.55], color: new THREE.Color("#140f22"), tex: 3, giro: 0.8 }, c.ahora);
      }
      const izq = c.ancla(c.ley.mano, 0.08);
      const der = c.ancla([1 - c.ley.mano[0], c.ley.mano[1]], 0.08);
      for (const [clave, pos, t0] of [["d1", izq, 0.25], ["d2", der, 0.5]] as const) {
        const d = destello(c, clave);
        d.obj.position.copy(pos);
        const kk = k(entre(t, t0, t0 + 0.3));
        d.obj.scale.setScalar(0.25 + kk * 0.35);
        pintar(d, c.color, kk);
        if (t > t0 && t < t0 + 0.06 && !c.estado[clave + "x"]) {
          c.estado[clave + "x"] = true;
          c.luz.emitir({ pos, n: 14, disp: 0.05, velDisp: 0.9, arrastre: 2, vida: [0.3, 0.6], tam: [0.02, 0.05], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
        }
      }
    },
    terminar: soltarTodo,
  },

  // El orbe se enciende en la mano y le orbitan chispas azules.
  arcano: {
    duracion: 1.6,
    gesto: GESTO.levantar,
    paso(c, t) {
      const orbe = c.ancla(c.ley.mano, 0.1);
      const d = destello(c, "orbe");
      d.obj.position.copy(orbe);
      d.obj.scale.setScalar(0.45 + k(t) * 0.75);
      pintar(d, c.color, 0.35 + k(t) * 0.65);
      if (t < 0.85) {
        const a = c.ahora * 9;
        for (let i = 0; i < 2; i++) {
          const ang = a + i * PI;
          const r = 0.22 + 0.06 * Math.sin(a * 0.7);
          c.luz.emitir({ pos: tmp.set(orbe.x + Math.cos(ang) * r, orbe.y + Math.sin(ang * 1.3) * r * 0.5, orbe.z + Math.sin(ang) * r), n: 1, disp: 0.01, vel: [-Math.sin(ang) * 0.5, 0.15, Math.cos(ang) * 0.5], velDisp: 0.05, vida: [0.35, 0.6], tam: [0.02, 0.045], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
        }
      }
    },
    terminar: soltarTodo,
  },

  // Tensa el arco y suelta una flecha de energía que se pierde arriba.
  flecha: {
    duracion: 1.6,
    gesto: GESTO.levantar,
    paso(c, t) {
      const mano = c.ancla(c.ley.mano, 0.1);
      const cuerda = destello(c, "cuerda");
      cuerda.obj.position.copy(mano);
      const kc = k(entre(t, 0.3, 0.55));
      cuerda.obj.scale.setScalar(0.2 + kc * 0.35);
      pintar(cuerda, c.color, kc);
      const f = destello(c, "flecha");
      const tf = entre(t, 0.4, 0.95);
      if (tf > 0 && tf < 1) {
        const dir = tmp.set(0.55, 0.8, 0.25).normalize();
        f.obj.position.copy(mano).addScaledVector(dir, tf * 3.2);
        f.obj.scale.set(0.9, 0.09, 1);
        (f.mat as THREE.SpriteMaterial).rotation = Math.atan2(dir.y, dir.x);
        pintar(f, c.color, (1 - tf) * 0.9);
        c.luz.emitir({ pos: f.obj.position, n: 2, disp: 0.02, vel: [0, 0, 0], velDisp: 0.15, vida: [0.25, 0.45], tam: [0.02, 0.04], color: c.color, color2: BLANCO }, c.ahora);
      } else {
        pintar(f, c.color, 0);
      }
      if (t > 0.4 && !c.estado.twang) {
        c.estado.twang = true;
        c.luz.emitir({ pos: mano, n: 12, disp: 0.04, velDisp: 0.8, arrastre: 2, vida: [0.3, 0.5], tam: [0.02, 0.04], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Fuegos fatuos violetas que dan vueltas a su alrededor.
  espiritus: {
    duracion: 1.8,
    gesto: GESTO.pulso,
    paso(c, t) {
      const p = c.pies();
      const n = 4;
      for (let i = 0; i < n; i++) {
        const d = destello(c, "w" + i);
        const ang = c.ahora * 2.2 + (i / n) * PI * 2;
        const r = 0.35 + c.ancho * 0.35;
        const y = 0.5 + i * 0.28 + Math.sin(c.ahora * 3 + i) * 0.1 + t * 0.6;
        d.obj.position.set(p.x + Math.cos(ang) * r, p.y + y, p.z + Math.sin(ang) * r * 0.6 + 0.05);
        d.obj.scale.setScalar(0.22 + 0.08 * Math.sin(c.ahora * 7 + i));
        pintar(d, c.color, k(t) * 0.9);
        if (t < 0.85) c.luz.emitir({ pos: d.obj.position, n: 1, disp: 0.02, vel: [0, 0.2, 0], velDisp: 0.08, vida: [0.4, 0.8], tam: [0.03, 0.06], color: c.color, color2: BLANCO }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Levanta la espada y saltan ascuas por toda la hoja.
  fuego: {
    duracion: 1.6,
    gesto: GESTO.levantar,
    paso(c, t) {
      const punta = sobreArma(c, 1, 0.08);
      const d = destello(c, "punta");
      d.obj.position.copy(punta);
      d.obj.scale.setScalar(0.3 + k(t) * 0.5);
      pintar(d, c.color, k(t) * 0.8);
      if (t > 0.1 && t < 0.85) {
        for (let i = 0; i < 3; i++) {
          c.luz.emitir({ pos: sobreArma(c, 0.25 + Math.random() * 0.75, 0.06), n: 1, disp: 0.03, vel: [0.1, 0.9, 0.1], velDisp: 0.35, grav: 0.6, arrastre: 0.6, vida: [0.5, 1.0], tam: [0.025, 0.06], color: c.color, color2: new THREE.Color("#ffd166") }, c.ahora);
        }
      }
    },
    terminar: soltarTodo,
  },

  // Ráfaga de viento: capa y telas al vuelo, polvo y hojas cruzando.
  viento: {
    duracion: 1.8,
    gesto: GESTO.viento,
    paso(c, t) {
      c.uni.uWind.value = suave(entre(t, 0, 0.18)) * (1 - suave(entre(t, 0.5, 1)));
      if (t < 0.7) {
        const p = c.pies();
        c.luz.emitir({ pos: tmp.set(p.x - c.ancho * 0.9, p.y + 0.2 + Math.random() * 1.5, p.z + 0.2), n: 2, disp: 0.1, vel: [3.2, 0.3, 0], velDisp: 0.35, vida: [0.35, 0.6], tam: [0.02, 0.05], color: c.color, color2: BLANCO }, c.ahora);
        if (Math.random() < 0.5) c.materia.emitir({ pos: tmp.set(p.x - c.ancho * 0.8, p.y + 0.3 + Math.random() * 1.2, p.z + 0.25), n: 1, vel: [2.6, 0.6, 0], velDisp: 0.4, grav: -0.8, vida: [0.6, 0.9], tam: [0.07, 0.11], color: c.color, tex: 2, giro: 6 }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Culatazo: fogonazo en la boca del cañón, chispas y humo.
  explosion: {
    duracion: 1.5,
    gesto: GESTO.retroceso,
    paso(c, t) {
      const boca = sobreArma(c, 1, 0.12);
      const d = destello(c, "fogonazo");
      d.obj.position.copy(boca);
      const kf = 1 - suave(entre(t, 0.05, 0.3));
      d.obj.scale.setScalar(0.3 + kf * 1.3);
      pintar(d, new THREE.Color("#fff1c2"), kf * entre(t, 0.02, 0.06));
      if (t > 0.04 && !c.estado.bang) {
        c.estado.bang = true;
        c.luz.emitir({ pos: boca, n: 40, disp: 0.05, vel: [1.6, 0.6, 0.8], velDisp: 1.4, grav: -2.5, arrastre: 1.2, vida: [0.35, 0.8], tam: [0.02, 0.06], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
      }
      if (t > 0.05 && t < 0.6) {
        c.materia.emitir({ pos: boca, n: 1, disp: 0.06, vel: [0.5, 0.7, 0.2], velDisp: 0.3, arrastre: 1.2, vida: [0.8, 1.3], tam: [0.25, 0.5], color: new THREE.Color("#2a2622"), tex: 3, giro: 1.2 }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Escarcha: cristales que giran alrededor de la mano y vaho frío a los pies.
  hielo: {
    duracion: 1.7,
    gesto: GESTO.pulso,
    paso(c, t) {
      const mano = c.ancla(c.ley.mano, 0.1);
      const d = destello(c, "mano");
      d.obj.position.copy(mano);
      d.obj.scale.setScalar(0.35 + k(t) * 0.6);
      pintar(d, c.color, k(t) * 0.85);
      if (t < 0.8) {
        c.luz.emitir({ pos: mano, n: 2, disp: 0.12, vel: [0, 0.25, 0], velDisp: 0.35, grav: -0.5, arrastre: 0.8, vida: [0.6, 1.1], tam: [0.03, 0.07], color: c.color, color2: BLANCO, tex: 1, giro: 3 }, c.ahora);
        const p = c.pies();
        c.materia.emitir({ pos: tmp.set(p.x, p.y + 0.1, p.z + 0.15), n: 1, disp: 0.35, vel: [0, 0.12, 0.1], velDisp: 0.12, vida: [0.9, 1.4], tam: [0.35, 0.6], color: new THREE.Color("#7fb6d8"), tex: 3, giro: 0.5 }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Pulso de aura roja detrás del cuerpo y ascuas subiendo.
  aura: {
    duracion: 1.6,
    gesto: GESTO.pulso,
    paso(c, t) {
      const a = flash(c, "aura", "destello");
      const pecho = c.ancla([0.5, 0.42], -0.12);
      a.obj.position.copy(pecho);
      a.obj.renderOrder = 2;
      a.obj.scale.set(2.2 + 0.2 * Math.sin(c.ahora * 8), 3.0, 1);
      pintar(a, c.color, k(t) * 0.5);
      if (t < 0.8) {
        const p = c.pies();
        c.luz.emitir({ pos: tmp.set(p.x, p.y + 0.4, p.z - 0.05), n: 2, disp: 0.4, vel: [0, 0.9, 0], velDisp: 0.2, vida: [0.6, 1.1], tam: [0.025, 0.06], color: c.color, color2: new THREE.Color("#ff9a6a") }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Las hojas se encienden en verde y gotean veneno.
  veneno: {
    duracion: 1.6,
    gesto: GESTO.levantar,
    paso(c, t) {
      for (const [clave, f] of [["h1", 0.55], ["h2", 1]] as const) {
        const d = destello(c, clave);
        d.obj.position.copy(sobreArma(c, f, 0.08));
        d.obj.scale.setScalar(0.25 + k(t) * 0.3);
        pintar(d, c.color, k(t) * 0.8);
      }
      if (t > 0.1 && t < 0.85) {
        c.luz.emitir({ pos: sobreArma(c, Math.random(), 0.07), n: 1, disp: 0.02, vel: [0, -0.3, 0], velDisp: 0.08, grav: -1.8, vida: [0.5, 0.9], tam: [0.02, 0.045], color: c.color, color2: new THREE.Color("#d4ff9a") }, c.ahora);
        if (Math.random() < 0.4) c.luz.emitir({ pos: sobreArma(c, Math.random(), 0.07), n: 1, disp: 0.03, vel: [0, 0.35, 0], velDisp: 0.1, vida: [0.5, 0.9], tam: [0.02, 0.04], color: c.color }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Relámpagos por el hacha, fogonazo blanco y un trueno a los pies.
  rayo: {
    duracion: 1.4,
    gesto: GESTO.levantar,
    paso(c, t) {
      const r = flash(c, "rayos", "rayos");
      const a = sobreArma(c, 0.15, 0.1), b = sobreArma(c, 1, 0.1);
      if (t < 0.75) {
        if ((c.estado.ultimo as number | undefined) === undefined || c.ahora - (c.estado.ultimo as number) > 0.05) {
          c.estado.ultimo = c.ahora;
          dibujarRayos(r, a, b, 3, 0.1);
          (r.mat as THREE.LineBasicMaterial).color.copy(Math.random() < 0.5 ? BLANCO : c.color);
        }
        (r.mat as THREE.LineBasicMaterial).opacity = 0.6 + Math.random() * 0.4;
      } else {
        (r.mat as THREE.LineBasicMaterial).opacity = 0;
      }
      const d = destello(c, "punta");
      d.obj.position.copy(b);
      d.obj.scale.setScalar(0.3 + Math.random() * 0.4);
      pintar(d, BLANCO, t < 0.75 ? 0.4 + Math.random() * 0.5 : 0);
      if (Math.random() < 0.5 && t < 0.75) c.luz.emitir({ pos: sobreArma(c, Math.random(), 0.1), n: 1, disp: 0.03, velDisp: 0.7, arrastre: 2, vida: [0.2, 0.4], tam: [0.02, 0.04], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
      const onda = flash(c, "onda", "onda");
      const p = c.pies();
      onda.obj.position.set(p.x, p.y + 0.01, p.z + 0.1);
      const s = 0.3 + suave(entre(t, 0.35, 0.9)) * 2.2;
      onda.obj.scale.set(s, s, 1);
      pintar(onda, c.color, (1 - entre(t, 0.4, 0.9)) * 0.7 * entre(t, 0.33, 0.4));
    },
    terminar: soltarTodo,
  },

  // Florete de katana: brillo que recorre la hoja y pétalos de cerezo.
  petalos: {
    duracion: 1.7,
    gesto: GESTO.florete,
    paso(c, t) {
      const g = destello(c, "brillo");
      const tb = entre(t, 0.15, 0.5);
      g.obj.position.copy(sobreArma(c, tb, 0.09));
      g.obj.scale.setScalar(0.22 + k(tb) * 0.25);
      pintar(g, BLANCO, k(tb));
      if (t > 0.15 && t < 0.7) {
        c.materia.emitir({ pos: sobreArma(c, Math.random(), 0.1), n: 1, disp: 0.08, vel: [0.35, 0.5, 0.25], velDisp: 0.55, grav: -0.9, arrastre: 1.4, vida: [0.9, 1.5], tam: [0.06, 0.1], color: c.color, color2: new THREE.Color("#ffe3ec"), tex: 2, giro: 5 }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Alas de luz doradas que se abren a la espalda (un Daeva de verdad).
  alas: {
    duracion: 1.8,
    gesto: GESTO.paso,
    paso(c, t) {
      const hombro = c.ancla(c.ley.espalda ?? [0.5, 0.3], -0.1);
      const abrir = suave(entre(t, 0.05, 0.45)) * (1 - suave(entre(t, 0.7, 1)));
      const aleteo = Math.sin(c.ahora * 5) * 0.08;
      for (const [clave, lado] of [["ai", -1], ["ad", 1]] as const) {
        const ala = flash(c, clave, "ala");
        ala.obj.position.set(hombro.x + lado * 0.06, hombro.y, hombro.z);
        ala.obj.renderOrder = 2;
        ala.obj.scale.set(lado * (0.2 + abrir * 1.5), 0.2 + abrir * 1.5, 1);
        ala.obj.rotation.z = lado * -aleteo;
        pintar(ala, c.color, abrir * 0.95);
      }
      const d = flash(c, "halo", "destello");
      d.obj.position.copy(hombro);
      d.obj.renderOrder = 2;
      d.obj.scale.set(2.6, 2.0, 1);
      pintar(d, c.color, abrir * 0.35);
      if (abrir > 0.5 && t < 0.75) {
        c.luz.emitir({ pos: tmp.set(hombro.x + (Math.random() - 0.5) * 2.4, hombro.y + Math.random() * 0.9, hombro.z), n: 2, disp: 0.05, vel: [0, 0.35, 0], velDisp: 0.2, vida: [0.6, 1.2], tam: [0.02, 0.05], color: c.color, color2: BLANCO }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // Círculo de runas girando a los pies y motas doradas subiendo.
  runas: {
    duracion: 1.8,
    gesto: GESTO.pulso,
    paso(c, t) {
      const an = flash(c, "anillo", "anillo");
      const p = c.pies();
      an.obj.position.set(p.x, p.y + 0.015, p.z + 0.1);
      const s = 0.3 + suave(entre(t, 0, 0.35)) * 1.5;
      an.obj.scale.set(s, s, 1);
      an.obj.rotation.z = c.ahora * 0.9;
      pintar(an, c.color, k(t) * 0.95);
      if (t > 0.2 && t < 0.8) {
        const ang = Math.random() * PI * 2;
        c.luz.emitir({ pos: tmp.set(p.x + Math.cos(ang) * s * 0.45, p.y + 0.05, p.z + 0.1 + Math.sin(ang) * s * 0.45), n: 1, disp: 0.02, vel: [0, 0.7, 0], velDisp: 0.1, vida: [0.7, 1.2], tam: [0.02, 0.05], color: c.color, color2: BLANCO }, c.ahora);
      }
      const d = destello(c, "mano");
      d.obj.position.copy(c.ancla(c.ley.mano, 0.08));
      d.obj.scale.setScalar(0.3 + k(t) * 0.35);
      pintar(d, c.color, k(t) * 0.7);
    },
    terminar: soltarTodo,
  },

  // Levanta el escudo y una barrera de luz aparece delante, recibiendo impactos.
  muro: {
    duracion: 1.6,
    gesto: GESTO.levantar,
    paso(c, t) {
      const escudo = c.ancla(c.ley.mano, 0.16);
      const aro = flash(c, "aro", "aro");
      aro.obj.position.copy(escudo);
      const abrir = suave(entre(t, 0.08, 0.35)) * (1 - suave(entre(t, 0.75, 1)));
      const s = (0.9 + abrir * 0.9) * (1 + 0.04 * Math.sin(c.ahora * 14));
      aro.obj.scale.set(s, s, 1);
      pintar(aro, c.color, abrir * 0.85);
      const g = flash(c, "brillo", "destello");
      g.obj.position.copy(escudo);
      g.obj.scale.set(1.4 * (0.6 + abrir), 1.4 * (0.6 + abrir), 1);
      pintar(g, c.color, abrir * 0.35);
      // impactos que rebotan en la barrera
      for (const t0 of [0.3, 0.45, 0.6]) {
        const clave = "imp" + t0;
        if (t > t0 && !c.estado[clave]) {
          c.estado[clave] = true;
          const ang = Math.random() * PI * 2, r = 0.25 + Math.random() * 0.45;
          c.luz.emitir({ pos: tmp.set(escudo.x + Math.cos(ang) * r, escudo.y + Math.sin(ang) * r * 0.8, escudo.z + 0.05), n: 16, disp: 0.03, vel: [0, 0.3, 0.6], velDisp: 0.9, grav: -2.0, arrastre: 1.5, vida: [0.3, 0.6], tam: [0.02, 0.05], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
        }
      }
    },
    terminar: soltarTodo,
  },

  // Asesino: se desvanece a parpadeos (como si se moviera demasiado rápido para
  // verlo) y las dos hojas relampaguean por turnos con chispas de acero.
  filo: {
    duracion: 1.5,
    gesto: GESTO.florete,
    paso(c, t) {
      // dos parpadeos: casi desaparece y vuelve
      const p1 = entre(t, 0.18, 0.34), p2 = entre(t, 0.5, 0.66);
      const oculto = Math.max(Math.sin(p1 * PI), Math.sin(p2 * PI)) * (p1 > 0 && p1 < 1 || p2 > 0 && p2 < 1 ? 1 : 0);
      c.uni.uOculto.value = oculto * 0.85;
      // con un arma definida, los dos relámpagos recorren la hoja (punta y
      // empuñadura); si no, la mano y su simétrica (dos dagas)
      const izq = c.ley.arma ? sobreArma(c, 0.9, 0.08) : c.ancla(c.ley.mano, 0.08);
      const der = c.ley.arma ? sobreArma(c, 0.3, 0.08) : c.ancla([1 - c.ley.mano[0], c.ley.mano[1]], 0.08);
      for (const [clave, pos, t0] of [["h1", izq, 0.3], ["h2", der, 0.62]] as const) {
        const d = destello(c, clave);
        d.obj.position.copy(pos);
        const kk = k(entre(t, t0, t0 + 0.25));
        d.obj.scale.set(0.6 + kk * 0.5, 0.12 + kk * 0.08, 1);
        (d.mat as THREE.SpriteMaterial).rotation = clave === "h1" ? 0.6 : -0.6;
        pintar(d, BLANCO, kk);
        if (t > t0 && !c.estado[clave + "x"]) {
          c.estado[clave + "x"] = true;
          c.luz.emitir({ pos, n: 18, disp: 0.04, velDisp: 1.1, arrastre: 2.2, vida: [0.25, 0.5], tam: [0.02, 0.045], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
        }
      }
    },
    terminar(c) {
      c.uni.uOculto.value = 0;
      soltarTodo(c);
    },
  },

  // (vuela) Picado hacia la cámara con un aletazo fuerte y lluvia de plumas de luz.
  estela: {
    duracion: 1.7,
    gesto: GESTO.ninguno,
    paso(c, t) {
      const kk = k(t);
      // el picado es corto a propósito: si se acerca mucho a la cámara, la
      // figura plana se nota y parece que se deforma
      c.mover(-0.12 * kk, 0.4 * kk);
      c.uni.uWind.value = kk * 0.45;
      const pecho = c.ancla([0.5, 0.42], -0.12);
      const g = flash(c, "halo", "destello");
      g.obj.position.copy(pecho);
      g.obj.renderOrder = 2;
      g.obj.scale.set(3.2, 2.4, 1);
      pintar(g, c.color, kk * 0.45);
      if (t > 0.1 && t < 0.8) {
        // plumas de luz que caen de las alas (los tercios exteriores de la imagen)
        const lado = Math.random() < 0.5 ? 0.12 + Math.random() * 0.22 : 0.66 + Math.random() * 0.22;
        c.materia.emitir({ pos: c.ancla([lado, 0.25 + Math.random() * 0.35], 0.08), n: 1, disp: 0.05, vel: [0, -0.35, 0.15], velDisp: 0.3, grav: -0.5, arrastre: 1.3, vida: [1.0, 1.6], tam: [0.06, 0.1], color: c.color, color2: new THREE.Color("#fff3d0"), tex: 2, giro: 4 }, c.ahora);
        c.luz.emitir({ pos: c.ancla([lado, 0.3 + Math.random() * 0.3], 0.08), n: 1, disp: 0.06, vel: [0, 0.2, 0], velDisp: 0.2, vida: [0.5, 0.9], tam: [0.02, 0.05], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },

  // (vuela) Se eleva y un halo de luz se expande a su alrededor, con chispas subiendo.
  halo: {
    duracion: 1.8,
    gesto: GESTO.ninguno,
    paso(c, t) {
      const kk = k(t);
      c.mover(0.3 * kk, 0);
      c.uni.uWind.value = kk * 0.6;
      const centro = c.ancla([0.5, 0.45], 0.1);
      const aro = flash(c, "aro", "aro");
      aro.obj.position.copy(centro);
      const s = 0.6 + suave(entre(t, 0.05, 0.7)) * 3.0;
      aro.obj.scale.set(s, s, 1);
      pintar(aro, c.color, (1 - entre(t, 0.3, 0.85)) * 0.9 * entre(t, 0.02, 0.12));
      const g = flash(c, "brillo", "destello");
      g.obj.position.copy(c.ancla([0.5, 0.42], -0.12));
      g.obj.renderOrder = 2;
      g.obj.scale.set(2.6, 2.6, 1);
      pintar(g, c.color, kk * 0.4);
      if (t < 0.8) {
        const ang = Math.random() * PI * 2, r = 0.5 + Math.random() * 0.5;
        c.luz.emitir({ pos: tmp.set(centro.x + Math.cos(ang) * r, centro.y - 0.6 + Math.random() * 0.4, centro.z + Math.sin(ang) * 0.2), n: 2, disp: 0.03, vel: [0, 0.9, 0], velDisp: 0.15, vida: [0.7, 1.2], tam: [0.02, 0.05], color: c.color, color2: BLANCO, tex: 1 }, c.ahora);
      }
    },
    terminar: soltarTodo,
  },
};
