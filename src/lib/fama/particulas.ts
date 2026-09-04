// Partículas y destellos de las Leyendas. Dos piscinas de puntos (una aditiva
// para luz y chispas, otra normal para humo y pétalos) que se rellenan desde
// los efectos, más un puñado de "flashes" reutilizables (destello, anillo en
// el suelo, haz de luz, ala, relámpagos). Todas las texturas se dibujan en un
// canvas al arrancar: nada que descargar.
import * as THREE from "three";

// ── Texturas procedurales ──────────────────────────────────────────────────

function lienzo(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function textura(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 1;
  return t;
}

// Círculo suave (destellos, luz).
export function texSuave(): THREE.CanvasTexture {
  const [c, g] = lienzo(128, 128);
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return textura(c);
}

// Atlas 2×2 de las partículas: 0 suave · 1 chispa · 2 pétalo · 3 humo.
export function texAtlas(): THREE.CanvasTexture {
  const [c, g] = lienzo(256, 256);
  // 0: suave
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  // 1: chispa (estrella de cuatro puntas con núcleo)
  g.save();
  g.translate(192, 64);
  g.globalCompositeOperation = "lighter";
  for (const [sx, sy] of [[1, 0.16], [0.16, 1]] as const) {
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, 60);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.save();
    g.scale(sx, sy);
    g.fillStyle = gr;
    g.beginPath();
    g.arc(0, 0, 60, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  const core = g.createRadialGradient(0, 0, 0, 0, 0, 22);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = core;
  g.beginPath();
  g.arc(0, 0, 22, 0, Math.PI * 2);
  g.fill();
  g.restore();
  // 2: pétalo
  g.save();
  g.translate(64, 192);
  g.rotate(-0.5);
  const pet = g.createRadialGradient(0, 0, 4, 0, 0, 46);
  pet.addColorStop(0, "rgba(255,255,255,1)");
  pet.addColorStop(0.8, "rgba(255,255,255,0.95)");
  pet.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = pet;
  g.beginPath();
  g.moveTo(0, -44);
  g.bezierCurveTo(30, -30, 30, 26, 0, 44);
  g.bezierCurveTo(-30, 26, -30, -30, 0, -44);
  g.fill();
  g.restore();
  // 3: humo (varias bolas suaves solapadas)
  g.save();
  g.translate(192, 192);
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 9; i++) {
    const x = (rnd() - 0.5) * 50, y = (rnd() - 0.5) * 50, r = 22 + rnd() * 26;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, "rgba(255,255,255,0.32)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  return textura(c);
}

// Anillo con runas (círculo de invocación) — blanco sobre transparente.
export function texAnillo(): THREE.CanvasTexture {
  const [c, g] = lienzo(256, 256);
  g.translate(128, 128);
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 3;
  g.shadowColor = "rgba(255,255,255,0.9)";
  g.shadowBlur = 8;
  g.beginPath();
  g.arc(0, 0, 112, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 1.5;
  g.beginPath();
  g.arc(0, 0, 92, 0, Math.PI * 2);
  g.stroke();
  let s = 11;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    g.save();
    g.rotate(a);
    g.translate(102, 0);
    g.rotate(Math.PI / 2);
    g.lineWidth = 2;
    g.beginPath();
    const n = 2 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      g.moveTo((rnd() - 0.5) * 10, (rnd() - 0.5) * 8);
      g.lineTo((rnd() - 0.5) * 10, (rnd() - 0.5) * 8);
    }
    g.stroke();
    g.restore();
  }
  return textura(c);
}

// Onda de choque: anillo suave, grueso.
export function texOnda(): THREE.CanvasTexture {
  const [c, g] = lienzo(256, 256);
  const grad = g.createRadialGradient(128, 128, 70, 128, 128, 124);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(0.55, "rgba(255,255,255,0.9)");
  grad.addColorStop(0.8, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return textura(c);
}

// Haz de luz vertical: brillante en el centro, se apaga en los lados y abajo.
export function texHaz(): THREE.CanvasTexture {
  const [c, g] = lienzo(64, 256);
  const h = g.createLinearGradient(0, 0, 64, 0);
  h.addColorStop(0, "rgba(255,255,255,0)");
  h.addColorStop(0.5, "rgba(255,255,255,1)");
  h.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = h;
  g.fillRect(0, 0, 64, 256);
  g.globalCompositeOperation = "destination-in";
  const v = g.createLinearGradient(0, 0, 0, 256);
  v.addColorStop(0, "rgba(255,255,255,0)");
  v.addColorStop(0.15, "rgba(255,255,255,1)");
  v.addColorStop(0.7, "rgba(255,255,255,0.7)");
  v.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = v;
  g.fillRect(0, 0, 64, 256);
  return textura(c);
}

// Ala de luz: plumas que salen del hombro (esquina inferior izquierda).
export function texAla(): THREE.CanvasTexture {
  const [c, g] = lienzo(256, 256);
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  const plumas = 9;
  for (let i = 0; i < plumas; i++) {
    const f = i / (plumas - 1);
    const ang = -0.05 - f * 1.25; // de casi horizontal a casi vertical
    const len = 150 + Math.sin(f * Math.PI) * 95;
    const x1 = 10 + Math.cos(ang) * len, y1 = 246 + Math.sin(ang) * len;
    const cx = 10 + Math.cos(ang - 0.35) * len * 0.55, cy = 246 + Math.sin(ang - 0.35) * len * 0.55;
    for (const [w, a] of [[16, 0.08], [8, 0.18], [3, 0.7]] as const) {
      g.strokeStyle = `rgba(255,255,255,${a})`;
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(10, 246);
      g.quadraticCurveTo(cx, cy, x1, y1);
      g.stroke();
    }
  }
  return textura(c);
}

// ── Piscina de partículas ──────────────────────────────────────────────────

const rgb = { r: 0, g: 0, b: 0 };

export type Emision = {
  pos: THREE.Vector3;
  n: number;
  vel?: [number, number, number];
  disp?: number;
  velDisp?: number;
  vida?: [number, number];
  tam?: [number, number];
  color: THREE.Color;
  color2?: THREE.Color;
  grav?: number;
  arrastre?: number;
  tex?: 0 | 1 | 2 | 3;
  giro?: number;
};

const VS = /* glsl */ `
attribute vec3 aVel; attribute vec3 aColor;
attribute float aBorn, aTtl, aSize, aTex, aRot, aSeed;
uniform float uTime, uScale;
varying float vLife, vTex, vRot; varying vec3 vColor;
void main() {
  float age = uTime - aBorn;
  float life = clamp(age / max(aTtl, 0.001), 0.0, 1.0);
  vLife = life; vTex = aTex; vColor = aColor;
  vRot = aRot * age + aSeed * 6.2831;
  float grow = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.55, 1.0, life));
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * grow * uScale / max(-mv.z, 0.1);
  gl_Position = projectionMatrix * mv;
  if (age < 0.0 || life >= 1.0 || aTtl <= 0.0) gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
}`;

const FS = /* glsl */ `
uniform sampler2D uMap; uniform float uAlpha;
varying float vLife, vTex, vRot; varying vec3 vColor;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float s = sin(vRot), c = cos(vRot);
  p = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;
  if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) discard;
  vec2 cell = vec2(mod(vTex, 2.0), floor(vTex / 2.0));
  vec4 t = texture2D(uMap, (p + cell) * 0.5);
  float fade = 1.0 - smoothstep(0.6, 1.0, vLife);
  gl_FragColor = vec4(vColor * t.rgb, t.a * fade * uAlpha); // aColor llega ya en sRGB
}`;

export class PoolParticulas {
  readonly points: THREE.Points;
  private readonly max: number;
  private cursor = 0;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly born: Float32Array;
  private readonly ttl: Float32Array;
  private readonly size: Float32Array;
  private readonly col: Float32Array;
  private readonly tex: Float32Array;
  private readonly rot: Float32Array;
  private readonly seed: Float32Array;
  private readonly grav: Float32Array;
  private readonly drag: Float32Array;
  private readonly geo: THREE.BufferGeometry;
  private readonly mat: THREE.ShaderMaterial;
  private vivas = 0;

  constructor(max: number, atlas: THREE.Texture, aditivo: boolean) {
    this.max = max;
    this.pos = new Float32Array(max * 3);
    this.vel = new Float32Array(max * 3);
    this.born = new Float32Array(max).fill(-1e9);
    this.ttl = new Float32Array(max);
    this.size = new Float32Array(max);
    this.col = new Float32Array(max * 3);
    this.tex = new Float32Array(max);
    this.rot = new Float32Array(max);
    this.seed = new Float32Array(max);
    this.grav = new Float32Array(max);
    this.drag = new Float32Array(max);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aVel", new THREE.BufferAttribute(this.vel, 3));
    geo.setAttribute("aBorn", new THREE.BufferAttribute(this.born, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aTtl", new THREE.BufferAttribute(this.ttl, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aSize", new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aColor", new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aTex", new THREE.BufferAttribute(this.tex, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aRot", new THREE.BufferAttribute(this.rot, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(this.seed, 1));
    for (let i = 0; i < max; i++) this.seed[i] = Math.random();
    this.geo = geo;
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uScale: { value: 400 }, uMap: { value: atlas }, uAlpha: { value: 1 } },
      vertexShader: VS,
      fragmentShader: FS,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: aditivo ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(geo, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = aditivo ? 6 : 5;
  }

  set escala(v: number) {
    this.mat.uniforms.uScale.value = v;
  }

  emitir(e: Emision, ahora: number) {
    const [vx, vy, vz] = e.vel ?? [0, 0, 0];
    const disp = e.disp ?? 0.05;
    const vd = e.velDisp ?? 0.2;
    const [v0, v1] = e.vida ?? [0.6, 1.2];
    const [s0, s1] = e.tam ?? [0.04, 0.09];
    for (let k = 0; k < e.n; k++) {
      const i = this.cursor;
      this.cursor = (this.cursor + 1) % this.max;
      const i3 = i * 3;
      // esfera de dispersión (no cubo): queda más natural
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = Math.cbrt(Math.random()) * disp;
      this.pos[i3] = e.pos.x + Math.sin(ph) * Math.cos(th) * r;
      this.pos[i3 + 1] = e.pos.y + Math.sin(ph) * Math.sin(th) * r;
      this.pos[i3 + 2] = e.pos.z + Math.cos(ph) * r;
      this.vel[i3] = vx + (Math.random() - 0.5) * 2 * vd;
      this.vel[i3 + 1] = vy + (Math.random() - 0.5) * 2 * vd;
      this.vel[i3 + 2] = vz + (Math.random() - 0.5) * 2 * vd;
      this.born[i] = ahora;
      this.ttl[i] = v0 + Math.random() * (v1 - v0);
      this.size[i] = s0 + Math.random() * (s1 - s0);
      const c = e.color2 && Math.random() < 0.5 ? e.color2 : e.color;
      // el shader de puntos pinta sin gestión de color: pasamos el color en sRGB
      c.getRGB(rgb, THREE.SRGBColorSpace);
      this.col[i3] = rgb.r;
      this.col[i3 + 1] = rgb.g;
      this.col[i3 + 2] = rgb.b;
      this.tex[i] = e.tex ?? 0;
      this.rot[i] = (e.giro ?? 0) * (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random());
      this.grav[i] = e.grav ?? 0;
      this.drag[i] = e.arrastre ?? 0;
    }
    this.vivas = this.max;
    for (const n of ["aBorn", "aTtl", "aSize", "aColor", "aTex", "aRot"]) {
      (this.geo.getAttribute(n) as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  actualizar(dt: number, ahora: number) {
    this.mat.uniforms.uTime.value = ahora;
    if (!this.vivas) return;
    let algunaViva = false;
    for (let i = 0; i < this.max; i++) {
      const edad = ahora - this.born[i];
      if (edad < 0 || edad > this.ttl[i]) continue;
      algunaViva = true;
      const i3 = i * 3;
      this.vel[i3 + 1] += this.grav[i] * dt;
      const d = Math.max(0, 1 - this.drag[i] * dt);
      this.vel[i3] *= d;
      this.vel[i3 + 1] *= d;
      this.vel[i3 + 2] *= d;
      this.pos[i3] += this.vel[i3] * dt;
      this.pos[i3 + 1] += this.vel[i3 + 1] * dt;
      this.pos[i3 + 2] += this.vel[i3 + 2] * dt;
    }
    (this.geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    if (!algunaViva) this.vivas = 0;
  }

  dispose() {
    this.geo.dispose();
    this.mat.dispose();
  }
}

// ── Flashes reutilizables ──────────────────────────────────────────────────

export type TipoFlash = "destello" | "anillo" | "onda" | "aro" | "haz" | "ala" | "rayos";

export type Flash = {
  tipo: TipoFlash;
  obj: THREE.Object3D;
  mat: THREE.SpriteMaterial | THREE.MeshBasicMaterial | THREE.LineBasicMaterial;
  libre: boolean;
  soltar(): void;
};

export class Flashes {
  private readonly pool: Flash[] = [];
  private readonly tex: { suave: THREE.Texture; anillo: THREE.Texture; onda: THREE.Texture; haz: THREE.Texture; ala: THREE.Texture };
  private readonly scene: THREE.Scene;

  constructor(scene: THREE.Scene, tex: Flashes["tex"]) {
    this.scene = scene;
    this.tex = tex;
  }

  private crear(tipo: TipoFlash): Flash {
    let obj: THREE.Object3D;
    let mat: Flash["mat"];
    const base = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const;
    if (tipo === "destello") {
      mat = new THREE.SpriteMaterial({ map: this.tex.suave, ...base });
      obj = new THREE.Sprite(mat);
    } else if (tipo === "haz") {
      mat = new THREE.SpriteMaterial({ map: this.tex.haz, ...base });
      obj = new THREE.Sprite(mat);
    } else if (tipo === "aro") {
      // anillo de pie, siempre de cara a la cámara (halo que se expande)
      mat = new THREE.SpriteMaterial({ map: this.tex.onda, ...base });
      obj = new THREE.Sprite(mat);
    } else if (tipo === "anillo" || tipo === "onda") {
      mat = new THREE.MeshBasicMaterial({ map: tipo === "anillo" ? this.tex.anillo : this.tex.onda, side: THREE.DoubleSide, ...base });
      obj = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      obj.rotation.x = -Math.PI / 2; // tumbado en el suelo
    } else if (tipo === "ala") {
      mat = new THREE.MeshBasicMaterial({ map: this.tex.ala, side: THREE.DoubleSide, ...base });
      // el hombro queda en el origen: el ala crece hacia +x, +y
      obj = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).translate(0.5, 0.5, 0), mat);
    } else {
      mat = new THREE.LineBasicMaterial({ ...base });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3 * 2 * 3 * 12), 3).setUsage(THREE.DynamicDrawUsage));
      obj = new THREE.LineSegments(geo, mat);
      obj.frustumCulled = false;
    }
    obj.visible = false;
    obj.renderOrder = 6;
    this.scene.add(obj);
    const f: Flash = {
      tipo, obj, mat, libre: true,
      soltar: () => {
        f.libre = true;
        obj.visible = false;
      },
    };
    this.pool.push(f);
    return f;
  }

  obtener(tipo: TipoFlash): Flash {
    const f = this.pool.find((p) => p.libre && p.tipo === tipo) ?? this.crear(tipo);
    f.libre = false;
    f.obj.visible = true;
    f.obj.renderOrder = 6;
    f.obj.scale.set(1, 1, 1);
    f.obj.rotation.set(f.tipo === "anillo" || f.tipo === "onda" ? -Math.PI / 2 : 0, 0, 0);
    if ("opacity" in f.mat) f.mat.opacity = 1;
    if (f.mat instanceof THREE.SpriteMaterial) f.mat.rotation = 0;
    return f;
  }

  dispose() {
    for (const f of this.pool) {
      this.scene.remove(f.obj);
      (f.obj as THREE.Mesh).geometry?.dispose();
      f.mat.dispose();
    }
  }
}

// Relámpago: rellena el buffer de un flash "rayos" con `n` rayos quebrados
// entre a y b (con ramas cortas). Se llama cada pocos ms para que parpadee.
export function dibujarRayos(f: Flash, a: THREE.Vector3, b: THREE.Vector3, n = 3, amp = 0.09) {
  const geo = (f.obj as THREE.LineSegments).geometry;
  const attr = geo.getAttribute("position") as THREE.BufferAttribute;
  const arr = attr.array as Float32Array;
  const segs = 12;
  let k = 0;
  const ab = new THREE.Vector3().subVectors(b, a);
  const perp = new THREE.Vector3(-ab.y, ab.x, 0).normalize();
  for (let r = 0; r < n; r++) {
    let px = a.x, py = a.y, pz = a.z;
    for (let s = 1; s <= segs; s++) {
      const t = s / segs;
      const off = (Math.random() - 0.5) * 2 * amp * Math.sin(t * Math.PI);
      const x = a.x + ab.x * t + perp.x * off, y = a.y + ab.y * t + perp.y * off, z = a.z + ab.z * t + (Math.random() - 0.5) * 0.03;
      arr[k++] = px; arr[k++] = py; arr[k++] = pz;
      arr[k++] = x; arr[k++] = y; arr[k++] = z;
      px = x; py = y; pz = z;
    }
  }
  for (; k < arr.length; k++) arr[k] = 0;
  attr.needsUpdate = true;
  geo.setDrawRange(0, n * segs * 2);
}
