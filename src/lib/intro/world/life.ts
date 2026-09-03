// La vida del mundo: el grupo de aventureros que avanza por la loma con su
// estandarte (COMUNIDAD) y las partículas: motas doradas por el valle y
// ascuas alrededor del faro de la fortaleza.
import * as THREE from "three";
import { disposeObject, type WorldCtx, type WorldPart, type FrameState } from "../types";
import { FORTRESS, RIDGE, heightAt } from "./land";
import { makeFlag, type Flag } from "./fortress";

interface Figure {
  group: THREE.Group;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  x: number;
  z0: number;
  phase: number;
}

// Silueta encapuchada: cuerpo, capa en cono, cabeza y dos piernas que se mueven.
function makeFigure(ctx: WorldCtx, mat: THREE.Material, withStaff: boolean): Omit<Figure, "x" | "z0" | "phase"> {
  const group = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.2, 4.6, 6), mat);
  torso.position.y = 5.2;
  const cloak = new THREE.Mesh(new THREE.ConeGeometry(2.3, 5.4, 6), mat);
  cloak.position.y = 5.4;
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.05, 7, 6), mat);
  head.position.y = 8.5;
  const legGeo = new THREE.CylinderGeometry(0.5, 0.45, 3.2, 5);
  legGeo.translate(0, -1.6, 0);
  const legL = new THREE.Mesh(legGeo, mat);
  const legR = new THREE.Mesh(legGeo, mat);
  legL.position.set(-0.7, 3.2, 0);
  legR.position.set(0.7, 3.2, 0);
  group.add(torso, cloak, head, legL, legR);
  if (withStaff) {
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 8, 5), mat);
    staff.position.set(1.6, 5, 0.4);
    staff.rotation.z = 0.12;
    group.add(staff);
  }
  group.scale.setScalar(2.4);
  void ctx;
  return { group, legL, legR };
}

function buildParty(ctx: WorldCtx): { group: THREE.Group; figures: Figure[]; banner: Flag } {
  const group = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: 0x0b0b10 });
  const figures: Figure[] = [];
  const layout: [number, number][] = [
    [0, 0], [-9, 11], [10, 14], [-3, 24], [13, 29], [-13, 34], [5, 42], [-7, 52], [11, 57],
  ];
  layout.forEach(([dx, dz], i) => {
    const f = makeFigure(ctx, mat, i % 3 === 1);
    group.add(f.group);
    figures.push({ ...f, x: RIDGE.x + dx, z0: -258 + dz, phase: ctx.rng() * Math.PI * 2 });
  });
  // el estandarte y una antorcha los lleva el primero: así el grupo se lee
  // como siluetas cálidas y no como un bulto negro
  const banner = makeFlag(ctx, 6, 3.8, 13);
  figures[0].group.add(banner.group);
  banner.group.position.set(-1.3, 0, -0.5);
  const torch = new THREE.PointLight(0xffa64d, 9000, 170, 2);
  torch.position.set(1.4, 7, 0.6);
  const torchGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: ctx.textures.soft, color: 0xffb060, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 })
  );
  torchGlow.position.copy(torch.position);
  torchGlow.scale.setScalar(3.5);
  figures[1].group.add(torch, torchGlow);
  return { group, figures, banner };
}

interface Motes {
  points: THREE.Points;
  mat: THREE.ShaderMaterial;
}

// Partículas que suben y se mecen; tamaño según la distancia.
function makeMotes(
  ctx: WorldCtx,
  count: number,
  box: { x: number; y0: number; y1: number; z: number; sx: number; sz: number },
  color: number,
  size: number,
  speed: number
): Motes {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = box.x + (ctx.rng() - 0.5) * box.sx * 2;
    pos[i * 3 + 1] = box.y0 + ctx.rng() * (box.y1 - box.y0);
    pos[i * 3 + 2] = box.z + (ctx.rng() - 0.5) * box.sz * 2;
    seed[i] = ctx.rng();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uSpeed: { value: speed },
      uColor: { value: new THREE.Color(color) },
      uMap: { value: ctx.textures.soft },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uSize; uniform float uSpeed;
      attribute float aSeed;
      varying float vAlpha;
      void main() {
        float rise = mod(aSeed * 400.0 + uTime * uSpeed, 320.0);
        vec3 p = position;
        p.y += rise;
        p.x += sin(uTime * 0.6 + aSeed * 30.0) * 10.0;
        p.z += cos(uTime * 0.5 + aSeed * 20.0) * 10.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uSize * (400.0 / -mv.z) * (0.6 + 0.4 * sin(uTime * 2.0 + aSeed * 50.0));
        gl_Position = projectionMatrix * mv;
        vAlpha = smoothstep(0.0, 40.0, rise) * (1.0 - smoothstep(260.0, 320.0, rise));
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform sampler2D uMap;
      varying float vAlpha;
      void main() {
        float a = texture2D(uMap, gl_PointCoord).a;
        gl_FragColor = vec4(uColor * a, a * vAlpha * 0.9);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  return { points, mat };
}

export function buildLife(ctx: WorldCtx): WorldPart {
  const root = new THREE.Group();
  const party = buildParty(ctx);
  const fy = heightAt(FORTRESS.x, FORTRESS.z);
  const motes = makeMotes(ctx, ctx.tier.motes, { x: 0, y0: -10, y1: 260, z: -200, sx: 1300, sz: 1600 }, 0xffcf7a, 9, 12);
  const embers = makeMotes(ctx, 260, { x: FORTRESS.x, y0: fy + 40, y1: fy + 700, z: FORTRESS.z, sx: 300, sz: 300 }, 0xffb050, 7, 30);
  root.add(party.group, motes.points, embers.points);
  ctx.scene.add(root);

  return {
    update(s: FrameState) {
      for (const f of party.figures) {
        const z = f.z0 - s.time * 6;
        const bob = Math.abs(Math.sin(s.time * 7 + f.phase)) * 0.25;
        f.group.position.set(f.x, heightAt(f.x, z) + bob, z);
        f.group.rotation.y = Math.PI; // caminan hacia -z (la fortaleza)
        const swing = Math.sin(s.time * 7 + f.phase) * 0.55;
        f.legL.rotation.x = swing;
        f.legR.rotation.x = -swing;
      }
      party.banner.mat.uniforms.uTime.value = s.time;
      motes.mat.uniforms.uTime.value = s.time;
      embers.mat.uniforms.uTime.value = s.time;
    },
    dispose() {
      disposeObject(root);
    },
  };
}
