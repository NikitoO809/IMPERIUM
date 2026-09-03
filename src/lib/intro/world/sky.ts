// El cielo: cúpula con degradado, sol bajo y nubes en movimiento; estrellas;
// haces de luz detrás de la fortaleza; y siluetas voladoras rodeando la aguja.
import * as THREE from "three";
import { GLSL_NOISE } from "../noise";
import { disposeObject, type WorldCtx, type WorldPart, type FrameState } from "../types";
import { FORTRESS, heightAt } from "./land";

function buildDome(ctx: WorldCtx): { mesh: THREE.Mesh; mat: THREE.ShaderMaterial } {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSun: { value: ctx.sunDir }, uFog: { value: ctx.fogColor } },
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: GLSL_NOISE + /* glsl */ `
      uniform float uTime; uniform vec3 uSun; uniform vec3 uFog;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float h = clamp(d.y, -0.2, 1.0);
        vec3 zenith = vec3(0.024, 0.032, 0.070);
        vec3 horizon = vec3(0.165, 0.140, 0.190);
        vec3 col = mix(horizon, zenith, pow(smoothstep(0.0, 0.7, h), 0.8));
        float sd = max(dot(d, uSun), 0.0);
        col += vec3(0.79, 0.54, 0.28) * (pow(sd, 6.0) * 0.55 + pow(sd, 40.0) * 0.9);
        col += vec3(0.42, 0.27, 0.19) * exp(-h * 9.0) * (0.35 + 0.65 * pow(sd, 2.0));
        if (d.y > 0.02) {
          vec2 uv = d.xz / (d.y + 0.15) * 1.6;
          float c = fbm(uv * 0.9 + vec2(uTime * 0.008, uTime * 0.004));
          float c2 = fbm(uv * 2.2 - vec2(uTime * 0.012, 0.0));
          float cl = smoothstep(0.48, 0.78, c * 0.75 + c2 * 0.35);
          float fade = smoothstep(0.02, 0.25, d.y) * (1.0 - smoothstep(0.55, 0.95, d.y));
          vec3 cloud = mix(vec3(0.10, 0.09, 0.12), vec3(0.62, 0.45, 0.30), pow(sd, 3.0) * 0.8 + 0.15);
          col = mix(col, cloud, cl * fade * 0.85);
        }
        col = mix(uFog, col, smoothstep(-0.05, 0.12, d.y));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(4300, 40, 24), mat);
  mesh.renderOrder = -2;
  mesh.name = "sky";
  return { mesh, mat };
}

function buildStars(): THREE.Points {
  const n = 1400;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const y = 0.12 + v * 0.88; // solo la mitad alta
    const r = Math.sqrt(1 - y * y) * 4200;
    pos[i * 3] = Math.cos(theta) * r;
    pos[i * 3 + 1] = y * 4200;
    pos[i * 3 + 2] = Math.sin(theta) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xcfd6ff,
    size: 2.2,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    fog: false,
  });
  const pts = new THREE.Points(geo, mat);
  pts.renderOrder = -1;
  return pts;
}

// Haces de luz: planos aditivos que "respiran" detrás de la fortaleza.
function buildRays(ctx: WorldCtx): { group: THREE.Group; mats: THREE.ShaderMaterial[] } {
  const group = new THREE.Group();
  const mats: THREE.ShaderMaterial[] = [];
  const fy = heightAt(FORTRESS.x, FORTRESS.z);
  const geo = new THREE.PlaneGeometry(150, 2600);
  for (let i = 0; i < ctx.tier.rays; i++) {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uIndex: { value: i } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; uniform float uIndex;
        varying vec2 vUv;
        void main() {
          float edge = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 2.0);
          float a = pow(1.0 - vUv.y, 1.7) * edge * (0.55 + 0.45 * sin(uTime * 0.5 + uIndex * 1.7));
          gl_FragColor = vec4(vec3(1.0, 0.78, 0.45) * a * 0.3, a * 0.3);
        }`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const spread = (i / Math.max(1, ctx.tier.rays - 1) - 0.5) * 1.1;
    mesh.position.set(FORTRESS.x + Math.sin(spread) * 420, fy + 1000, FORTRESS.z - 260 - Math.abs(spread) * 120);
    mesh.rotation.set(0.12, spread + 0.35, spread * 0.25);
    group.add(mesh);
    mats.push(mat);
  }
  return { group, mats };
}

// Siluetas voladoras: cuerpo + dos alas que baten, dando vueltas a la aguja.
interface Flyer {
  group: THREE.Group;
  wingL: THREE.Object3D;
  wingR: THREE.Object3D;
  r: number;
  h: number;
  speed: number;
  phase: number;
}

function buildFlyers(ctx: WorldCtx): { group: THREE.Group; flyers: Flyer[]; cy: number } {
  const group = new THREE.Group();
  const flyers: Flyer[] = [];
  const mat = new THREE.MeshBasicMaterial({ color: 0x08080b, side: THREE.DoubleSide });
  const body = new THREE.BoxGeometry(10, 2.4, 2.4);
  const wing = new THREE.PlaneGeometry(14, 6);
  wing.translate(7, 0, 0);
  const cy = heightAt(FORTRESS.x, FORTRESS.z) + 520;
  for (let i = 0; i < ctx.tier.creatures; i++) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(body, mat));
    const wl = new THREE.Object3D();
    const wr = new THREE.Object3D();
    const ml = new THREE.Mesh(wing, mat);
    const mr = new THREE.Mesh(wing, mat);
    mr.scale.x = -1;
    wl.add(ml);
    wr.add(mr);
    wl.rotation.x = Math.PI / 2;
    wr.rotation.x = Math.PI / 2;
    g.add(wl, wr);
    const scale = 1.4 + ctx.rng() * 1.2;
    g.scale.setScalar(scale);
    group.add(g);
    flyers.push({
      group: g,
      wingL: wl,
      wingR: wr,
      r: 380 + i * 70 + ctx.rng() * 60,
      h: cy + (i - ctx.tier.creatures / 2) * 45,
      speed: 0.10 + ctx.rng() * 0.06,
      phase: ctx.rng() * Math.PI * 2,
    });
  }
  return { group, flyers, cy };
}

export function buildSky(ctx: WorldCtx): WorldPart {
  const dome = buildDome(ctx);
  const stars = buildStars();
  const rays = buildRays(ctx);
  const fly = buildFlyers(ctx);
  ctx.scene.add(dome.mesh, stars, rays.group, fly.group);

  const next = new THREE.Vector3();
  return {
    update(s: FrameState) {
      dome.mat.uniforms.uTime.value = s.time;
      dome.mesh.position.copy(s.camPos);
      stars.position.copy(s.camPos);
      for (const m of rays.mats) m.uniforms.uTime.value = s.time;
      for (const f of fly.flyers) {
        const a = f.phase + s.time * f.speed;
        const y = f.h + Math.sin(s.time * 0.7 + f.phase) * 30;
        f.group.position.set(FORTRESS.x + Math.cos(a) * f.r, y, FORTRESS.z + Math.sin(a) * f.r);
        next.set(FORTRESS.x + Math.cos(a + 0.05) * f.r, y, FORTRESS.z + Math.sin(a + 0.05) * f.r);
        f.group.lookAt(next);
        const flap = Math.sin(s.time * 6.5 + f.phase) * 0.75;
        f.wingL.rotation.z = flap;
        f.wingR.rotation.z = -flap;
      }
    },
    dispose() {
      disposeObject(dome.mesh);
      disposeObject(stars);
      disposeObject(rays.group);
      disposeObject(fly.group);
    },
  };
}
