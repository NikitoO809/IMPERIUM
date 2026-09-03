// La magia: portales, el círculo de runas con su mapa holográfico (GUÍAS) y
// la red de faros y arcos de luz que se encienden hacia la aguja (DISCORD).
import * as THREE from "three";
import { GLSL_NOISE } from "../noise";
import { disposeObject, type WorldCtx, type WorldPart, type FrameState } from "../types";
import { FORTRESS, RUNES, heightAt } from "./land";

const VERT_UV = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

export function makePortalMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: VERT_UV,
    fragmentShader: GLSL_NOISE + /* glsl */ `
      uniform float uTime; varying vec2 vUv;
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        float a = atan(p.y, p.x);
        float n = fbm(vec2(a * 1.2 + uTime * 0.5, r * 3.5 - uTime * 1.4));
        float n2 = fbm(vec2(a * 2.0 - uTime * 0.8, r * 6.0 + uTime * 0.9));
        float edge = smoothstep(1.0, 0.82, r);
        float core = smoothstep(0.95, 0.05, r);
        vec3 col = mix(vec3(0.95, 0.62, 0.22), vec3(1.0, 0.95, 0.82), n * 0.6 + n2 * 0.4);
        float alpha = edge * (0.18 + 0.82 * core) * (0.45 + 0.55 * n);
        gl_FragColor = vec4(col * (0.5 + n), alpha);
      }`,
  });
}

interface Portal {
  group: THREE.Group;
  mat: THREE.ShaderMaterial;
  ring2: THREE.Mesh;
}

function makePortal(ctx: WorldCtx, radius: number): Portal {
  const group = new THREE.Group();
  const gold = new THREE.MeshBasicMaterial({ color: 0xffc66a });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, radius * 0.06, 8, 48), gold);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.8, radius * 0.025, 6, 48), gold);
  const mat = makePortalMaterial();
  const disc = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), mat);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: ctx.textures.soft, color: 0xffb45a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 })
  );
  glow.scale.setScalar(radius * 5);
  const light = new THREE.PointLight(0xffb45a, 40000, radius * 22, 2);
  light.position.z = radius * 0.6;
  group.add(ring, ring2, disc, glow, light);
  return { group, mat, ring2 };
}

// Glifos originales: trazos al azar sobre una rejilla, con halo dorado.
function makeGlyphTextures(rng: () => number): THREE.Texture[] {
  const out: THREE.Texture[] = [];
  for (let k = 0; k < 8; k++) {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const g = c.getContext("2d")!;
    g.strokeStyle = "#ffd27a";
    g.lineWidth = 5;
    g.lineCap = "round";
    g.shadowColor = "#ffb84d";
    g.shadowBlur = 8;
    const pt = () => [12 + Math.floor(rng() * 4) * 13.3, 12 + Math.floor(rng() * 4) * 13.3];
    const strokes = 3 + Math.floor(rng() * 3);
    for (let i = 0; i < strokes; i++) {
      const [x1, y1] = pt();
      const [x2, y2] = pt();
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.stroke();
    }
    const [cx, cy] = pt();
    g.beginPath();
    g.arc(cx, cy, 4, 0, Math.PI * 2);
    g.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    out.push(tex);
  }
  return out;
}

interface Rune {
  sprite: THREE.Sprite;
  r: number;
  h: number;
  speed: number;
  phase: number;
}

function buildRuneSite(ctx: WorldCtx) {
  const group = new THREE.Group();
  const ry = heightAt(RUNES.x, RUNES.z);
  group.position.set(RUNES.x, ry, RUNES.z);

  const stone = new THREE.MeshStandardMaterial({ color: 0x3a3740, roughness: 0.95 });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const tall = ctx.rng() > 0.3 ? 42 : 26;
    const m = new THREE.Mesh(new THREE.BoxGeometry(9, tall, 6), stone);
    m.position.set(Math.cos(a) * 62, tall / 2 - 3, Math.sin(a) * 62);
    m.rotation.y = -a + Math.PI / 2;
    m.rotation.z = (ctx.rng() - 0.5) * 0.2;
    group.add(m);
  }
  const altar = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 6, 8), stone);
  altar.position.y = 3;
  group.add(altar);

  const glyphs = makeGlyphTextures(ctx.rng);
  const runes: Rune[] = [];
  for (let i = 0; i < 28; i++) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glyphs[i % glyphs.length], color: 0xffd27a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9 })
    );
    sprite.scale.setScalar(5 + ctx.rng() * 3);
    group.add(sprite);
    runes.push({ sprite, r: 22 + ctx.rng() * 36, h: 10 + ctx.rng() * 36, speed: (0.15 + ctx.rng() * 0.2) * (ctx.rng() > 0.5 ? 1 : -1), phase: ctx.rng() * Math.PI * 2 });
  }

  // mapa holográfico: rejilla + curvas de nivel + barrido
  const holoMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: VERT_UV,
    fragmentShader: GLSL_NOISE + /* glsl */ `
      uniform float uTime; varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        float g = max(step(0.965, fract(uv.x * 12.0)), step(0.965, fract(uv.y * 12.0)));
        float land = fbm(uv * 3.5 + 2.0);
        float contour = 1.0 - smoothstep(0.0, 0.06, abs(fract(land * 8.0 + uTime * 0.1) - 0.5));
        float sweep = smoothstep(0.03, 0.0, abs(fract(uTime * 0.25) - uv.y));
        float edge = smoothstep(0.5, 0.35, length(uv - 0.5));
        float a = (g * 0.35 + contour * 0.55 + sweep * 0.6) * edge;
        gl_FragColor = vec4(vec3(1.0, 0.8, 0.45) * a, a);
      }`,
  });
  const holoGeo = new THREE.PlaneGeometry(76, 76);
  holoGeo.rotateX(-Math.PI / 2);
  const holo = new THREE.Mesh(holoGeo, holoMat);
  holo.position.y = 18;
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffc27a, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8, depthWrite: false });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(50, 0.7, 6, 72), ringMat);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(40, 0.5, 6, 72), ringMat);
  ring1.position.y = 18;
  ring2.position.y = 18;
  const light = new THREE.PointLight(0xffc27a, 30000, 520, 2);
  light.position.y = 25;
  group.add(holo, ring1, ring2, light);

  return { group, runes, holoMat, ring1, ring2, glyphs };
}

// Faros repartidos por el mundo y arcos de luz hacia la aguja.
const BEACON_SPOTS: [number, number][] = [
  [-1500, -200], [1400, -500], [-900, 600], [1100, 900], [-1700, -1300], [1600, -1500], [300, 1500],
];

function buildNetwork(ctx: WorldCtx) {
  const group = new THREE.Group();
  const mats: THREE.ShaderMaterial[] = [];
  const glows: THREE.SpriteMaterial[] = [];
  const spire = new THREE.Vector3(FORTRESS.x, heightAt(FORTRESS.x, FORTRESS.z) + 640, FORTRESS.z);
  const beamGeo = new THREE.CylinderGeometry(5, 16, 600, 8, 1, true);
  for (let i = 0; i < ctx.tier.beacons; i++) {
    const [x, z] = BEACON_SPOTS[i];
    const y0 = heightAt(x, z);
    const beamMat = new THREE.ShaderMaterial({
      uniforms: { uOn: { value: 0 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: VERT_UV,
      fragmentShader: /* glsl */ `
        uniform float uOn; varying vec2 vUv;
        void main() {
          float a = pow(1.0 - vUv.y, 1.8) * uOn * 0.5;
          gl_FragColor = vec4(vec3(1.0, 0.82, 0.5) * a, a);
        }`,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(x, y0 + 300, z);
    const glowMat = new THREE.SpriteMaterial({ map: ctx.textures.soft, color: 0xffc070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.setScalar(140);
    glow.position.set(x, y0 + 12, z);

    const start = new THREE.Vector3(x, y0 + 560, z);
    const ctrl = start.clone().lerp(spire, 0.5).add(new THREE.Vector3(0, 520, 0));
    const curve = new THREE.QuadraticBezierCurve3(start, ctrl, spire);
    const arcMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uOn: { value: 0 }, uPhase: { value: ctx.rng() } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: VERT_UV,
      fragmentShader: /* glsl */ `
        uniform float uTime; uniform float uOn; uniform float uPhase; varying vec2 vUv;
        void main() {
          float pp = fract(uTime * 0.28 + uPhase);
          float p1 = exp(-pow((vUv.x - pp) * 22.0, 2.0));
          float p2 = exp(-pow((vUv.x - fract(pp + 0.5)) * 22.0, 2.0));
          float pulse = max(p1, p2);
          float a = uOn * (0.10 + 0.9 * pulse);
          vec3 col = mix(vec3(1.0, 0.72, 0.35), vec3(1.0, 0.97, 0.9), pulse);
          gl_FragColor = vec4(col * a, a);
        }`,
    });
    const arc = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 2.4, 5, false), arcMat);
    group.add(beam, glow, arc);
    mats.push(beamMat, arcMat);
    glows.push(glowMat);
  }
  return { group, mats, glows };
}

export function buildMagic(ctx: WorldCtx): WorldPart {
  const root = new THREE.Group();

  // portal grande en un risco y portal pequeño al final de la loma
  const p1 = makePortal(ctx, 42);
  p1.group.position.set(620, heightAt(620, -760) + 52, -760);
  p1.group.rotation.y = 0.5;
  const p2 = makePortal(ctx, 18);
  p2.group.position.set(-380, heightAt(-380, -560) + 24, -560);
  p2.group.rotation.y = 0.15;
  const portals = [p1, p2];

  const runes = buildRuneSite(ctx);
  const net = buildNetwork(ctx);
  root.add(p1.group, p2.group, runes.group, net.group);
  ctx.scene.add(root);

  return {
    update(s: FrameState) {
      for (const p of portals) {
        p.mat.uniforms.uTime.value = s.time;
        p.ring2.rotation.z = s.time * 0.6;
      }
      runes.holoMat.uniforms.uTime.value = s.time;
      runes.ring1.rotation.set(0.25, s.time * 0.35, 0);
      runes.ring2.rotation.set(-0.3, -s.time * 0.5, 0.1);
      for (const r of runes.runes) {
        const a = r.phase + s.time * r.speed;
        r.sprite.position.set(Math.cos(a) * r.r, r.h + Math.sin(s.time * 1.3 + r.phase) * 2.5, Math.sin(a) * r.r);
      }
      for (const m of net.mats) {
        m.uniforms.uOn.value = s.networkOn;
        if (m.uniforms.uTime) m.uniforms.uTime.value = s.time;
      }
      for (const g of net.glows) g.opacity = 0.7 * s.networkOn;
    },
    dispose() {
      disposeObject(root);
      runes.glyphs.forEach((t) => t.dispose());
    },
  };
}
