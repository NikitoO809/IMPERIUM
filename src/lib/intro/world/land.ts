// La tierra: relieve (montañas en el borde, valle en el centro, río),
// el agua y los bosques instanciados. `heightAt` es la única verdad sobre
// la altura del suelo: todo lo demás (cámara, fortaleza, personajes) la usa.
import * as THREE from "three";
import { fbm2, smoothstep, makeRng, GLSL_NOISE } from "../noise";
import { disposeObject, type WorldCtx, type WorldPart, type FrameState } from "../types";

export const WORLD_SIZE = 5000;
export const WATER_Y = -14;
export const FORTRESS = { x: 0, z: -1500 };
export const RUNES = { x: -700, z: -1000 };
export const RIDGE = { x: -380, z: -300 };

export function heightAt(x: number, z: number): number {
  const d = Math.hypot(x, z);
  const rim = smoothstep(900, 2300, d);
  const mount = fbm2(x * 0.0011 + 4.2, z * 0.0011 + 1.7, 4);
  let h = rim * (260 + 980 * Math.pow(mount, 1.6));
  h += 55 * fbm2(x * 0.005 + 3.1, z * 0.005 + 7.7, 3) - 22;

  // río serpenteante por el valle
  const rx = 240 * Math.sin(z * 0.0011 + 0.6);
  const dx = x - rx;
  h -= 70 * Math.exp(-(dx * dx) / (2 * 110 * 110)) * (1 - rim);

  // colina de la fortaleza
  const df = Math.hypot(x - FORTRESS.x, z - FORTRESS.z);
  h += 330 * Math.exp(-(df * df) / (2 * 300 * 300));

  // meseta de las runas (se aplana)
  const dr = Math.hypot(x - RUNES.x, z - RUNES.z);
  h += (95 - h) * smoothstep(170, 50, dr);

  // loma alargada por la que avanzan los aventureros
  const ex = x - RIDGE.x;
  const ez = z - RIDGE.z;
  h += 60 * Math.exp(-(ex * ex) / (2 * 120 * 120) - (ez * ez) / (2 * 420 * 420));
  return h;
}

function buildTerrain(ctx: WorldCtx): THREE.Mesh {
  const seg = ctx.tier.terrainSegments;
  const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();

  // color por altura y pendiente: valle oscuro, laderas, roca, nieve
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const grass = new THREE.Color(0x2a3424);
  const dark = new THREE.Color(0x1b2419);
  const rock = new THREE.Color(0x3d3a38);
  const snow = new THREE.Color(0xb9bec6);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const ny = nrm.getY(i);
    c.copy(grass).lerp(dark, smoothstep(60, -20, y));
    c.lerp(rock, Math.max(smoothstep(380, 640, y), smoothstep(0.78, 0.5, ny)));
    c.lerp(snow, smoothstep(760, 980, y) * smoothstep(0.55, 0.85, ny));
    c.multiplyScalar(0.88 + 0.24 * fbm2(x * 0.02, z * 0.02, 2));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = "terrain";
  return mesh;
}

function buildWater(ctx: WorldCtx): { mesh: THREE.Mesh; mat: THREE.ShaderMaterial } {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSun: { value: ctx.sunDir },
      uFog: { value: ctx.fogColor },
      uFogDensity: { value: ctx.tier.fogDensity },
      uCam: { value: new THREE.Vector3() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: GLSL_NOISE + /* glsl */ `
      uniform float uTime; uniform vec3 uSun; uniform vec3 uFog; uniform float uFogDensity; uniform vec3 uCam;
      varying vec3 vWorld;
      void main() {
        vec2 p = vWorld.xz * 0.02 + vec2(uTime * 0.05, uTime * 0.03);
        float e = 0.05;
        float h0 = fbm(p);
        float hx = fbm(p + vec2(e, 0.0));
        float hz = fbm(p + vec2(0.0, e));
        vec3 n = normalize(vec3((h0 - hx) * 4.0, 1.0, (h0 - hz) * 4.0));
        vec3 v = normalize(uCam - vWorld);
        float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        vec3 col = mix(vec3(0.03, 0.05, 0.08), vec3(0.16, 0.14, 0.18), 0.25 + 0.75 * fres);
        vec3 hv = normalize(uSun + v);
        float spec = pow(max(dot(n, hv), 0.0), 120.0);
        col += vec3(1.0, 0.8, 0.5) * spec * 1.6;
        float dist = distance(uCam, vWorld);
        float fog = 1.0 - exp(-dist * dist * uFogDensity * uFogDensity);
        gl_FragColor = vec4(mix(col, uFog, fog), 1.0);
      }`,
  });
  const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = WATER_Y;
  mesh.name = "water";
  return { mesh, mat };
}

function buildForest(ctx: WorldCtx): THREE.InstancedMesh {
  const count = ctx.tier.trees;
  // abetos: conos altos y estrechos, agrupados en masas de bosque
  const geo = new THREE.ConeGeometry(1, 1, 6);
  const mat = new THREE.MeshStandardMaterial({ color: 0x18241a, roughness: 1 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const rng = makeRng(7);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const col = new THREE.Color();
  let placed = 0;
  let tries = 0;
  while (placed < count && tries < count * 24) {
    tries++;
    const x = (rng() - 0.5) * 3800;
    const z = (rng() - 0.5) * 3600 - 200;
    if (fbm2(x * 0.004 + 9.1, z * 0.004 + 2.3, 2) < 0.47) continue; // fuera de las masas de bosque
    const h = heightAt(x, z);
    if (h < WATER_Y + 6 || h > 430) continue;
    if (Math.hypot(x - FORTRESS.x, z - FORTRESS.z) < 330) continue;
    if (Math.hypot(x - RUNES.x, z - RUNES.z) < 160) continue;
    if (Math.abs(x - RIDGE.x) < 45 && Math.abs(z - RIDGE.z) < 460) continue;
    const slope = Math.abs(heightAt(x + 6, z) - h) + Math.abs(heightAt(x, z + 6) - h);
    if (slope > 9) continue;
    const size = 7 + rng() * 10;
    const height = size * 1.7;
    p.set(x, h + height * 0.5 - 1, z);
    s.set(size * 0.42, height, size * 0.42);
    m.compose(p, q, s);
    mesh.setMatrixAt(placed, m);
    mesh.setColorAt(placed, col.setHSL(0.27, 0.35, 0.09 + rng() * 0.08));
    placed++;
  }
  mesh.count = placed;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.name = "forest";
  return mesh;
}

export function buildLand(ctx: WorldCtx): WorldPart {
  const group = new THREE.Group();
  const terrain = buildTerrain(ctx);
  const water = buildWater(ctx);
  const forest = buildForest(ctx);
  group.add(terrain, water.mesh, forest);
  ctx.scene.add(group);

  return {
    update(s: FrameState) {
      water.mat.uniforms.uTime.value = s.time;
      (water.mat.uniforms.uCam.value as THREE.Vector3).copy(s.camPos);
    },
    dispose() {
      disposeObject(group);
    },
  };
}
