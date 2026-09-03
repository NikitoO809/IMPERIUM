// Motor de la cinemática: crea el mundo (three.js), mueve la cámara por la
// línea de tiempo, dispara los cues de texto y pinta cada fotograma. Solo se
// carga (import dinámico) cuando de verdad va a sonar la intro.
import * as THREE from "three";
import type { TierConfig } from "./quality";
import { makeRng, smoothstep, lerp } from "./noise";
import type { IntroMode, WorldCtx, WorldPart, FrameState } from "./types";
import { FRAMES, CUES_FULL, CUES_SHORT, SHORT_START, HOLD_START, buildPath, samplePath, type Cue, type CameraSample } from "./timeline";
import { heightAt, buildLand, FORTRESS } from "./world/land";
import { buildSky } from "./world/sky";
import { buildFortress } from "./world/fortress";
import { buildLife } from "./world/life";
import { buildMagic } from "./world/magic";

export interface IntroOptions {
  tier: TierConfig;
  mode: IntroMode;
  onCue(cue: Cue): void;
  onFrame(time: number, veil: number, progress: number): void;
}

export interface IntroController {
  readonly time: number;
  seek(t: number): void;
  pause(): void;
  resume(): void;
  dispose(): void;
}

const FOG = 0x191b28;

// Disco suave para brillos y partículas.
function makeSoftTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// Estandarte de IMPERIUM: campo oscuro, borde dorado y el dragón en el centro.
// Hasta que carga el dragón se pinta un rombo dorado.
function makeEmblemTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 160;
  const g = c.getContext("2d")!;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const paint = (img: HTMLImageElement | null) => {
    g.fillStyle = "#171021";
    g.fillRect(0, 0, 256, 160);
    g.strokeStyle = "#e3b341";
    g.lineWidth = 10;
    g.strokeRect(5, 5, 246, 150);
    g.strokeStyle = "rgba(227,179,65,0.35)";
    g.lineWidth = 2;
    g.strokeRect(18, 18, 220, 124);
    if (img) {
      const scale = Math.min(170 / img.width, 116 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      try {
        g.filter = "grayscale(1) sepia(0.4) saturate(1.6) brightness(1.15)";
      } catch {
        // Sin filtros de canvas (navegadores antiguos): el dragón va en su color.
      }
      g.drawImage(img, 128 - w / 2, 80 - h / 2, w, h);
      g.filter = "none";
    } else {
      g.fillStyle = "#e3b341";
      g.beginPath();
      g.moveTo(128, 40);
      g.lineTo(170, 80);
      g.lineTo(128, 120);
      g.lineTo(86, 80);
      g.closePath();
      g.fill();
    }
    tex.needsUpdate = true;
  };
  paint(null);
  const img = new Image();
  img.onload = () => paint(img);
  img.src = "/brand/dragon-trans.png";
  return tex;
}

export function createIntro(canvas: HTMLCanvasElement, opts: IntroOptions): IntroController {
  const { tier, mode } = opts;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: tier.name !== "low", powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier.pixelRatio));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = mode === "full" ? 0.03 : 1.05;

  const scene = new THREE.Scene();
  const fogColor = new THREE.Color(FOG);
  scene.fog = new THREE.FogExp2(FOG, tier.fogDensity);
  scene.background = fogColor;

  const camera = new THREE.PerspectiveCamera(52, 1, 1, 7500);
  scene.add(camera);

  // sol bajo detrás de la fortaleza (contraluz), cielo azulado, relleno tenue
  const sunDir = new THREE.Vector3(0.18, 0.26, -1).normalize();
  const sun = new THREE.DirectionalLight(0xf2c27a, 2.4);
  sun.position.copy(sunDir).multiplyScalar(3000);
  const fill = new THREE.DirectionalLight(0x6c7aa6, 0.35);
  fill.position.set(-1, 0.6, 1);
  scene.add(sun, fill, new THREE.HemisphereLight(0x5c6b8c, 0x1c1712, 0.7));

  const textures = { soft: makeSoftTexture(), emblem: makeEmblemTexture() };
  const ctx: WorldCtx = { scene, tier, mode, sunDir, fogColor, textures, rng: makeRng(2026) };
  const parts: WorldPart[] = [buildSky(ctx), buildLand(ctx), buildFortress(ctx), buildLife(ctx), buildMagic(ctx)];

  // la chispa con la que empieza todo (solo en la versión completa)
  const spark = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: textures.soft, color: 0xffd48a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false })
  );
  spark.visible = false;
  scene.add(spark);

  const path = buildPath(FRAMES, heightAt, { fortress: heightAt(FORTRESS.x, FORTRESS.z) });
  const cues = mode === "full" ? CUES_FULL : CUES_SHORT;
  const fired = new Set<Cue>();
  const sample: CameraSample = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 50 };
  const forward = new THREE.Vector3();
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const frame: FrameState = { time: 0, dt: 0, camPos: camera.position, networkOn: 0 };
  const start = mode === "full" ? 0 : SHORT_START;
  const end = mode === "full" ? HOLD_START : HOLD_START - 1;

  let time = start;
  let playing = true;
  let raf = 0;
  let last = performance.now();
  let disposed = false;

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const onMove = (e: PointerEvent) => {
    if (!tier.parallax) return;
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf && !disposed) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };

  const fireCues = () => {
    for (const c of cues) {
      if (!fired.has(c) && time >= c.at) {
        fired.add(c);
        opts.onCue(c);
      }
    }
  };

  const render = () => {
    samplePath(path, time, sample);
    camera.position.copy(sample.pos);
    camera.lookAt(sample.look);
    camera.fov = sample.fov;
    camera.updateProjectionMatrix();
    // parallax sutil con el ratón
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    camera.rotateY(-mouse.x * 0.035);
    camera.rotateX(-mouse.y * 0.02);

    // apertura: de la oscuridad a la luz; la chispa crece y estalla
    let veil: number;
    if (mode === "full") {
      veil = 1 - smoothstep(2.2, 4.8, time);
      renderer.toneMappingExposure = lerp(0.03, 1.05, smoothstep(1.2, 5.0, time));
      if (time < 6) {
        spark.visible = true;
        forward.copy(sample.look).sub(sample.pos).normalize();
        spark.position.copy(sample.pos).addScaledVector(forward, 160);
        spark.position.y -= 4;
        const grow = 4 + 40 * smoothstep(0.5, 3.6, time);
        const burst = 320 * smoothstep(3.6, 4.4, time) * (1 - smoothstep(4.4, 5.6, time));
        spark.scale.setScalar(grow + burst);
        spark.material.opacity = 1 - smoothstep(4.8, 5.8, time);
      } else {
        spark.visible = false;
      }
    } else {
      veil = 1 - smoothstep(SHORT_START, SHORT_START + 1.6, time);
    }

    frame.time = time;
    frame.networkOn = smoothstep(21.0, 23.2, time);
    for (const p of parts) p.update?.(frame);
    renderer.render(scene, camera);
    opts.onFrame(time, veil, Math.min(1, (time - start) / (end - start)));
  };

  // Si los primeros segundos van a menos de 24 fps, bajamos la resolución una
  // vez: mejor algo menos nítido que una intro a cámara lenta.
  let fpsFrames = 0;
  let fpsTime = 0;
  let adapted = false;

  const loop = (now: number) => {
    raf = 0;
    if (disposed) return;
    const raw = (now - last) / 1000;
    const dt = Math.min(0.1, raw);
    last = now;
    if (!adapted) {
      fpsFrames++;
      fpsTime += raw;
      if (fpsTime > 2.5) {
        adapted = true;
        if (fpsFrames / fpsTime < 24) {
          renderer.setPixelRatio(Math.max(0.5, renderer.getPixelRatio() * 0.6));
          resize();
        }
      }
    }
    if (playing) {
      time += dt;
      fireCues();
    }
    frame.dt = dt;
    render();
    raf = requestAnimationFrame(loop);
  };

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove);
  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(loop);

  return {
    get time() {
      return time;
    },
    seek(t: number) {
      time = t;
      fired.clear();
      let lastCaption: Cue | null = null;
      for (const c of cues) {
        if (c.at > t) continue;
        fired.add(c);
        if (c.type === "caption" || c.type === "clear") lastCaption = c;
        else opts.onCue(c);
      }
      opts.onCue(lastCaption ?? { at: 0, type: "clear" });
    },
    pause() {
      playing = false;
    },
    resume() {
      playing = true;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const p of parts) p.dispose();
      spark.material.dispose();
      textures.soft.dispose();
      textures.emblem.dispose();
      renderer.dispose();
    },
  };
}
