"use client";

// Fondo 3D del hero: un emblema arcano — núcleo de gema facetada, anillos de
// orrery contrarrotando, runas orbitando y un círculo de invocación debajo.
// Deliberadamente ABSTRACTO (nada de castillos, árboles ni gente hechos de
// primitivas): a esa escala, geometría procedural simple se lee como low-poly
// barato; un objeto compacto con buenas luces y partículas se lee como
// premium. Reacciona al ratón con un parallax de cámara muy sutil.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLSL_NOISE } from "@/lib/intro/noise";

// A diferencia de la cinemática (un mundo entero), este emblema es una
// escena pequeña — unos miles de triángulos y un puñado de partículas — así
// que hasta una GPU floja o por software la mueve de sobra. Solo se apaga
// con movimiento reducido, ahorro de datos, o si WebGL no existe.
function shouldRender(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function makeSoftTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// Franja de marcas (como un dial), para que el anillo mayor lea "instrumento
// de precisión" y no un simple tubo.
function makeTickTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 32;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0c0a08";
  g.fillRect(0, 0, 512, 32);
  for (let i = 0; i < 64; i++) {
    const tall = i % 4 === 0;
    g.fillStyle = tall ? "#ffe6ad" : "rgba(255,214,140,0.55)";
    const w = tall ? 3 : 1.4;
    const h = tall ? 22 : 12;
    g.fillRect(i * 8 - w / 2, 16 - h / 2, w, h);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Glifos originales (trazos al azar sobre una rejilla): las runas que orbitan.
function makeGlyphTextures(seed: number): THREE.Texture[] {
  let s = seed;
  const rng = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s % 1000) / 1000;
  };
  const out: THREE.Texture[] = [];
  for (let k = 0; k < 6; k++) {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const g = c.getContext("2d")!;
    g.strokeStyle = "#ffd27a";
    g.lineWidth = 5;
    g.lineCap = "round";
    g.shadowColor = "#ffb84d";
    g.shadowBlur = 9;
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
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    out.push(tex);
  }
  return out;
}

function makeCoreMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vNormal; varying vec3 vView;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vView);
        float fres = pow(1.0 - max(dot(n, v), 0.0), 2.4);
        float facet = 0.55 + 0.45 * max(dot(n, normalize(vec3(0.4, 0.7, 0.5))), 0.0);
        vec3 deep = vec3(0.05, 0.03, 0.02);
        vec3 gold = vec3(1.0, 0.78, 0.38);
        vec3 hot  = vec3(1.0, 0.95, 0.82);
        float pulse = 0.5 + 0.5 * sin(uTime * 1.4);
        vec3 col = mix(deep, gold, facet);
        col = mix(col, hot, fres * (0.6 + 0.4 * pulse));
        col += gold * fres * fres * 0.6;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}

function makePortalMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: GLSL_NOISE + /* glsl */ `
      uniform float uTime; varying vec2 vUv;
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        float a = atan(p.y, p.x);
        float n = fbm(vec2(a * 1.1 + uTime * 0.45, r * 3.2 - uTime * 1.1));
        float edge = smoothstep(1.0, 0.7, r);
        float core = smoothstep(0.9, 0.0, r);
        vec3 col = mix(vec3(0.95, 0.6, 0.22), vec3(1.0, 0.94, 0.8), n);
        float alpha = edge * (0.12 + 0.8 * core) * (0.4 + 0.6 * n);
        gl_FragColor = vec4(col * (0.4 + n), alpha * 0.85);
      }`,
  });
}

interface Motes {
  points: THREE.Points;
  mat: THREE.ShaderMaterial;
}

function makeMotes(count: number, radius: number, height: number, tex: THREE.Texture): Motes {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * height;
    pos[i * 3 + 2] = Math.sin(a) * r;
    seed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uHeight: { value: height }, uMap: { value: tex } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uHeight;
      attribute float aSeed;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float rise = mod(p.y + uTime * (2.2 + aSeed * 1.6), uHeight);
        p.y = rise - uHeight * 0.5;
        p.x += sin(uTime * 0.6 + aSeed * 40.0) * 1.6;
        p.z += cos(uTime * 0.5 + aSeed * 30.0) * 1.6;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (2.2 + aSeed * 2.4) * (240.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
        vAlpha = smoothstep(0.0, 0.18, rise / uHeight) * (1.0 - smoothstep(0.75, 1.0, rise / uHeight));
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      varying float vAlpha;
      void main() {
        vec4 t = texture2D(uMap, gl_PointCoord);
        gl_FragColor = vec4(vec3(1.0, 0.82, 0.5) * t.a, t.a * vAlpha * 0.85);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  return { points, mat };
}

export function HeroEmblem() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    if (!shouldRender()) return; // se queda el degradado CSS de .sh-hero

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = window.matchMedia("(pointer: coarse)").matches;
    const dpr = window.devicePixelRatio || 1;

    // La escena es pequeña (unos miles de triángulos), así que el móvil también
    // puede dibujarla a 2×: a 1× los anillos salían dentados y todo se veía
    // borroso en pantallas de mucha densidad. Con 2× el suavizado por
    // multimuestreo ya no hace falta (y en el móvil sale caro).
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: dpr < 1.5, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(dpr, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 1, 400);
    camera.position.set(0, 6, 150);

    // el conjunto, más pequeño y más arriba que el centro del lienzo: queda
    // como un sello flotando sobre la insignia y el título, sin atravesar
    // el párrafo de debajo.
    const RIG_Y = 24;
    const RIG_SCALE = 0.62;
    const rig = new THREE.Group();
    rig.position.y = RIG_Y;
    rig.scale.setScalar(RIG_SCALE);
    scene.add(rig);

    // En un lienzo estrecho y alto (el móvil) la cámara ve mucho menos a lo
    // ancho, así que el emblema desbordaba la pantalla y sus anillos cruzaban
    // el título. Lo encogemos con la proporción del lienzo para que vuelva a
    // ser un sello DETRÁS del texto. En escritorio (más ancho que alto) el
    // factor es 1: nada cambia.
    const encaje = (aspect: number) => Math.max(0.56, Math.min(1, aspect / 1.2));

    const soft = makeSoftTexture();
    const ticks = makeTickTexture();
    const glyphs = makeGlyphTextures(7);

    // gema facetada: geometría no indexada para que cada cara tenga su propia
    // normal (facetas visibles de verdad, no una esfera suavizada)
    const coreGeo = new THREE.IcosahedronGeometry(13, 1).toNonIndexed();
    coreGeo.computeVertexNormals();
    const coreMat = makeCoreMaterial();
    const core = new THREE.Mesh(coreGeo, coreMat);
    rig.add(core);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: soft, color: 0xffb35a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.75 })
    );
    glow.scale.setScalar(78);
    rig.add(glow);

    const light = new THREE.PointLight(0xffb35a, 3200, 260, 2);
    rig.add(light);
    scene.add(new THREE.AmbientLight(0x201810, 0.7));

    // anillos: uno "metálico" sólido y uno de energía (glow), por órbita
    const ringDefs = [
      { r: 24, tilt: 0.55, speed: 0.16 },
      { r: 34, tilt: -0.35, speed: -0.11 },
      { r: 46, tilt: 0.18, speed: 0.07 },
    ];
    const rings = ringDefs.map(({ r, tilt }, i) => {
      const grp = new THREE.Group();
      grp.rotation.x = tilt;
      const metal = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.5, 8, 96),
        new THREE.MeshStandardMaterial({ color: 0xcf9a4a, metalness: 0.6, roughness: 0.35, emissive: 0x3a2205, emissiveIntensity: 0.4 })
      );
      const glowRing = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.14, 6, 96),
        new THREE.MeshBasicMaterial({ color: 0xffcf8a, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9, depthWrite: false })
      );
      glowRing.scale.setScalar(1.03);
      grp.add(metal, glowRing);
      if (i === ringDefs.length - 1) {
        const dial = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.9, 6, 128),
          new THREE.MeshBasicMaterial({ map: ticks, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        dial.material.map!.repeat.set(24, 1);
        grp.add(dial);
      }
      rig.add(grp);
      return grp;
    });

    // runas orbitando en la órbita intermedia
    const runeCount = lowEnd ? 6 : 10;
    const runes: { sprite: THREE.Sprite; a: number; speed: number }[] = [];
    for (let i = 0; i < runeCount; i++) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glyphs[i % glyphs.length], color: 0xffd27a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
      );
      sprite.scale.setScalar(4.2);
      rig.add(sprite);
      runes.push({ sprite, a: (i / runeCount) * Math.PI * 2, speed: 0.12 });
    }

    // círculo de invocación bajo la gema
    const portalMat = makePortalMaterial();
    const portal = new THREE.Mesh(new THREE.CircleGeometry(30, 64), portalMat);
    portal.rotation.x = -Math.PI / 2.15;
    portal.position.y = -14;
    rig.add(portal);
    const portalRingMat = new THREE.MeshBasicMaterial({ color: 0xffcf8a, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.85, depthWrite: false });
    const portalRing = new THREE.Mesh(new THREE.TorusGeometry(30, 0.35, 6, 96), portalRingMat);
    portalRing.rotation.x = -Math.PI / 2.15;
    portalRing.position.y = -14;
    rig.add(portalRing);

    // ascuas subiendo a través de los anillos
    const motes = makeMotes(lowEnd ? 90 : 220, 46, 100, soft);
    motes.points.position.y = -30;
    rig.add(motes.points);

    const resize = () => {
      const r = host.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / Math.max(1, r.height);
      camera.updateProjectionMatrix();
      // encoge el sello, pero lo mantiene a la altura del rótulo (no baja con
      // él, o se pondría detrás del párrafo)
      const k = encaje(camera.aspect);
      rig.scale.setScalar(RIG_SCALE * k);
      rig.position.y = RIG_Y * (0.75 + 0.25 * k);
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      mouse.tx = 0;
      mouse.ty = 0;
    };

    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const draw = (time: number) => {
      coreMat.uniforms.uTime.value = time;
      portalMat.uniforms.uTime.value = time;
      motes.mat.uniforms.uTime.value = time;
      rig.rotation.y = time * 0.06;
      core.rotation.y = time * 0.12;
      core.rotation.x = Math.sin(time * 0.25) * 0.06;
      core.position.y = Math.sin(time * 0.6) * 1.6;
      glow.position.y = core.position.y;
      light.position.y = core.position.y;
      const pulse = 1 + Math.sin(time * 1.4) * 0.05;
      glow.scale.setScalar(78 * pulse);
      rings.forEach((g, i) => {
        g.rotation.z = time * ringDefs[i].speed;
      });
      for (const r of runes) {
        r.a += 0.004 * (reduce ? 0 : 1);
        r.sprite.position.set(Math.cos(r.a) * 34, Math.sin(time * 0.5 + r.a * 3) * 3, Math.sin(r.a) * 34);
      }
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      camera.position.x = mouse.x * 10;
      camera.position.y = 6 - mouse.y * 5;
      camera.lookAt(0, 4, 0);
      renderer.render(scene, camera);
      if (!canvas.classList.contains("is-ready")) canvas.classList.add("is-ready");
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      draw((now - t0) / 1000);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0.02 });
    io.observe(host);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    resize();
    draw(0);
    if (!reduce) start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else if (mat) mat.dispose();
      });
      soft.dispose();
      ticks.dispose();
      glyphs.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="sh-canvas" aria-hidden />;
}
