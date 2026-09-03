// La fortaleza de IMPERIUM: murallas con almenas, torres con tejado, recinto
// interior, torre del homenaje con aguja y faro, puerta con portal y
// banderas de tela con el dragón. Todo procedural, sin modelos.
import * as THREE from "three";
import { disposeObject, type WorldCtx, type WorldPart, type FrameState } from "../types";
import { FORTRESS, heightAt } from "./land";
import { makePortalMaterial } from "./magic";

// Material de tela: ondea con el viento y se funde con la niebla.
function makeClothMaterial(map: THREE.Texture, phase: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      { uTime: { value: 0 }, uPhase: { value: phase }, uMap: { value: map } },
    ]),
    side: THREE.DoubleSide,
    fog: true,
    vertexShader: /* glsl */ `
      #include <fog_pars_vertex>
      uniform float uTime; uniform float uPhase;
      varying vec2 vUv; varying float vShade;
      void main() {
        vUv = uv;
        vec3 p = position;
        float w = uv.x;
        p.z += sin(w * 5.0 - uTime * 3.2 + uPhase) * 1.4 * w + sin(w * 11.0 - uTime * 5.1 + uPhase) * 0.45 * w;
        p.y += cos(w * 4.0 - uTime * 2.6 + uPhase) * 0.35 * w;
        vShade = 0.75 + 0.25 * cos(w * 5.0 - uTime * 3.2 + uPhase);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <fog_pars_fragment>
      uniform sampler2D uMap; varying vec2 vUv; varying float vShade;
      void main() {
        vec4 c = texture2D(uMap, vUv);
        gl_FragColor = vec4(c.rgb * vShade * 0.9, 1.0);
        #include <fog_fragment>
      }`,
  });
}
// El uMap va aparte: UniformsUtils.merge clona y perdería la textura.
function bindMap(mat: THREE.ShaderMaterial, map: THREE.Texture) {
  mat.uniforms.uMap.value = map;
}

export interface Flag {
  group: THREE.Group;
  mat: THREE.ShaderMaterial;
}

// Bandera en su mástil (el borde izquierdo queda pegado al palo).
export function makeFlag(ctx: WorldCtx, width: number, height: number, poleHeight: number): Flag {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, poleHeight, 6),
    new THREE.MeshStandardMaterial({ color: 0x2a2730, roughness: 0.8 })
  );
  pole.position.y = poleHeight / 2;
  const geo = new THREE.PlaneGeometry(width, height, 14, 6);
  geo.translate(width / 2, 0, 0);
  const mat = makeClothMaterial(ctx.textures.emblem, ctx.rng() * Math.PI * 2);
  bindMap(mat, ctx.textures.emblem);
  const cloth = new THREE.Mesh(geo, mat);
  cloth.position.y = poleHeight - height / 2 - 1;
  group.add(pole, cloth);
  return { group, mat };
}

export function buildFortress(ctx: WorldCtx): WorldPart {
  const g = new THREE.Group();
  g.position.set(FORTRESS.x, heightAt(FORTRESS.x, FORTRESS.z), FORTRESS.z);
  const flags: Flag[] = [];

  const stone = new THREE.MeshStandardMaterial({ color: 0x35333d, roughness: 0.95 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1a21, roughness: 0.9 });
  const plinth = new THREE.MeshStandardMaterial({ color: 0x2a2930, roughness: 1 });
  const add = (mesh: THREE.Mesh, x: number, y: number, z: number) => {
    mesh.position.set(x, y, z);
    g.add(mesh);
    return mesh;
  };

  // zócalo que ancla la fortaleza a la colina
  add(new THREE.Mesh(new THREE.CylinderGeometry(300, 360, 60, 14), plinth), 0, -30, 0);

  // muralla exterior octogonal con almenas
  const R1 = 230;
  const segs = 8;
  const segLen = 2 * R1 * Math.sin(Math.PI / segs) + 4;
  const apothem = R1 * Math.cos(Math.PI / segs);
  const wallGeo = new THREE.BoxGeometry(segLen, 70, 16);
  const merlons = new THREE.InstancedMesh(new THREE.BoxGeometry(7, 7, 20), stone, segs * 11);
  const m4 = new THREE.Matrix4();
  let mi = 0;
  for (let k = 0; k < segs; k++) {
    const a = (k + 0.5) * ((Math.PI * 2) / segs);
    const wall = add(new THREE.Mesh(wallGeo, stone), apothem * Math.cos(a), 35, apothem * Math.sin(a));
    wall.rotation.y = -(a + Math.PI / 2);
    const tx = -Math.sin(a);
    const tz = Math.cos(a);
    for (let j = 0; j < 11; j++) {
      const off = (j / 10 - 0.5) * segLen * 0.9;
      m4.makeRotationY(-(a + Math.PI / 2));
      m4.setPosition(apothem * Math.cos(a) + tx * off, 74, apothem * Math.sin(a) + tz * off);
      merlons.setMatrixAt(mi++, m4);
    }
  }
  merlons.instanceMatrix.needsUpdate = true;
  g.add(merlons);

  // torres exteriores con tejado y bandera
  const towerGeo = new THREE.CylinderGeometry(26, 30, 130, 10);
  const roofGeo = new THREE.ConeGeometry(31, 46, 10);
  for (let k = 0; k < segs; k++) {
    const a = k * ((Math.PI * 2) / segs);
    const x = R1 * Math.cos(a);
    const z = R1 * Math.sin(a);
    add(new THREE.Mesh(towerGeo, stone), x, 65, z);
    add(new THREE.Mesh(roofGeo, dark), x, 153, z);
    const flag = makeFlag(ctx, 26, 16, 46);
    flag.group.position.set(x, 170, z);
    g.add(flag.group);
    flags.push(flag);
  }

  // recinto interior
  const R2 = 120;
  const innerLen = 2 * R2 * Math.sin(Math.PI / segs) + 4;
  const innerAp = R2 * Math.cos(Math.PI / segs);
  const innerGeo = new THREE.BoxGeometry(innerLen, 100, 14);
  for (let k = 0; k < segs; k++) {
    const a = (k + 0.5) * ((Math.PI * 2) / segs);
    const wall = add(new THREE.Mesh(innerGeo, stone), innerAp * Math.cos(a), 50, innerAp * Math.sin(a));
    wall.rotation.y = -(a + Math.PI / 2);
  }
  const innerTower = new THREE.CylinderGeometry(30, 34, 190, 10);
  const innerRoof = new THREE.ConeGeometry(36, 52, 10);
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + k * (Math.PI / 2);
    add(new THREE.Mesh(innerTower, stone), R2 * Math.cos(a), 95, R2 * Math.sin(a));
    add(new THREE.Mesh(innerRoof, dark), R2 * Math.cos(a), 216, R2 * Math.sin(a));
  }

  // torre del homenaje, aguja y faro
  add(new THREE.Mesh(new THREE.CylinderGeometry(80, 92, 200, 12), stone), 0, 100, 0);
  add(new THREE.Mesh(new THREE.CylinderGeometry(88, 80, 16, 12), stone), 0, 208, 0);
  add(new THREE.Mesh(new THREE.CylinderGeometry(22, 34, 380, 10), stone), 0, 390, 0);
  add(new THREE.Mesh(new THREE.ConeGeometry(30, 90, 10), dark), 0, 625, 0);
  const beacon = add(new THREE.Mesh(new THREE.SphereGeometry(16, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd27a })), 0, 680, 0);
  const beaconGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: ctx.textures.soft, color: 0xffc060, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85 })
  );
  beaconGlow.position.y = 680;
  beaconGlow.scale.setScalar(300);
  const beaconLight = new THREE.PointLight(0xffc860, 60000, 1400, 2);
  beaconLight.position.y = 690;
  g.add(beaconGlow, beaconLight);

  // puerta principal (mira hacia +z, por donde llega la cámara)
  const gateZ = 232;
  add(new THREE.Mesh(new THREE.BoxGeometry(24, 110, 44), stone), -36, 55, gateZ);
  add(new THREE.Mesh(new THREE.BoxGeometry(24, 110, 44), stone), 36, 55, gateZ);
  add(new THREE.Mesh(new THREE.BoxGeometry(96, 30, 44), stone), 0, 95, gateZ);
  const gateTower = new THREE.CylinderGeometry(20, 23, 120, 10);
  const gateRoof = new THREE.ConeGeometry(24, 40, 10);
  for (const sx of [-1, 1]) {
    add(new THREE.Mesh(gateTower, stone), sx * 64, 60, gateZ);
    add(new THREE.Mesh(gateRoof, dark), sx * 64, 140, gateZ);
    const banner = makeFlag(ctx, 40, 24, 60);
    banner.group.position.set(sx * 64, 156, gateZ);
    g.add(banner.group);
    flags.push(banner);
  }
  const gatePortal = makePortalMaterial();
  add(new THREE.Mesh(new THREE.PlaneGeometry(48, 84), gatePortal), 0, 42, gateZ + 1);
  const gateLight = new THREE.PointLight(0xffb45a, 24000, 600, 2);
  gateLight.position.set(0, 50, gateZ + 40);
  g.add(gateLight);
  for (let s = 0; s < 4; s++) {
    add(new THREE.Mesh(new THREE.BoxGeometry(120 + s * 14, 8, 24), plinth), 0, -4 - s * 8, gateZ + 34 + s * 22);
  }

  // ventanas encendidas en el homenaje, la aguja y las torres
  const windows = new THREE.InstancedMesh(new THREE.PlaneGeometry(4, 7), new THREE.MeshBasicMaterial({ color: 0xf0c070 }), 170);
  let wi = 0;
  const putWindow = (radius: number, y: number, a: number, cx = 0, cz = 0) => {
    m4.makeRotationY(Math.PI / 2 - a);
    m4.setPosition(cx + Math.cos(a) * radius, y, cz + Math.sin(a) * radius);
    windows.setMatrixAt(wi++, m4);
  };
  for (let i = 0; i < 90; i++) putWindow(82 + (1 - (30 + ctx.rng() * 160) / 200) * 10, 30 + ctx.rng() * 160, ctx.rng() * Math.PI * 2);
  for (let i = 0; i < 30; i++) {
    const y = 220 + ctx.rng() * 340;
    putWindow(35 - ((y - 200) / 380) * 12, y, ctx.rng() * Math.PI * 2);
  }
  for (let k = 0; k < segs; k++) {
    const a = k * ((Math.PI * 2) / segs);
    for (let i = 0; i < 6; i++) putWindow(27.5, 20 + ctx.rng() * 100, ctx.rng() * Math.PI * 2, R1 * Math.cos(a), R1 * Math.sin(a));
  }
  windows.count = wi;
  windows.instanceMatrix.needsUpdate = true;
  g.add(windows);

  ctx.scene.add(g);

  return {
    update(s: FrameState) {
      for (const f of flags) f.mat.uniforms.uTime.value = s.time;
      gatePortal.uniforms.uTime.value = s.time;
      const pulse = 1 + Math.sin(s.time * 1.8) * 0.08;
      beaconGlow.scale.setScalar(300 * pulse);
      beacon.scale.setScalar(pulse);
    },
    dispose() {
      disposeObject(g);
    },
  };
}
