// EL ESCENARIO DE LAS LEYENDAS — motor three.js del Salón de la Fama.
//
// Una fila de personajes (planos con su render recortado, deformados por el
// shader para que respiren y ondeen) sobre un suelo oscuro que los refleja,
// con un resplandor dorado en el horizonte y motas de luz flotando.
// La cámara NO se mueve: el ratón desplaza unos pocos píxeles cada capa
// (fondo, fila de atrás, fila de delante) y esa diferencia es la que da la
// profundidad. Al posar el ratón sobre un personaje, el resto baja de brillo,
// él da un paso al frente, se enciende una luz a su espalda y hace su gesto
// (efectos.ts). Se dibuja solo cuando la sección está a la vista y se apaga
// con la pestaña oculta.
import * as THREE from "three";
import { ALTO_LEYENDA as H, FRAGMENT, GESTO, VERTEX } from "./shaders";
import { EFECTOS, type CtxEfecto, type Efecto } from "./efectos";
import { Flashes, PoolParticulas, texAla, texAnillo, texAtlas, texHaz, texOnda, texSuave } from "./particulas";
import { HUECO, aspectoDe, rutaArte, rutaRelieve, type Ancla, type Leyenda } from "./leyendas";
import { GLSL_NOISE } from "@/lib/intro/noise";

export type Opciones = {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  leyendas: Leyenda[];
  reducirMovimiento: boolean;
  etiquetas: () => Record<string, HTMLElement | null>;
  onHover: (id: string | null) => void;
  onListo: () => void;
};

type Personaje = {
  ley: Leyenda;
  mesh: THREE.Mesh;
  reflejo: THREE.Mesh | null; // los que vuelan no se reflejan
  charco: THREE.Sprite | null;
  picker: THREE.Mesh; // gemelo plano de 2 triángulos: SOLO para saber a quién señala el ratón
  halo: THREE.Sprite | null; // solo el líder: resplandor dorado permanente a su espalda
  uni: Record<string, THREE.IUniform>;
  ancho: number;
  x: number;
  y: number; // altura de los pies (la fila de atrás va sobre la grada; los que vuelan, en el aire)
  z: number;
  vuela: boolean;
  ofs: { y: number; z: number }; // desplazamiento temporal que pide un gesto (picado, elevarse)
  fila: 0 | 1; // 0 = delante, 1 = detrás
  escala: number;
  color: THREE.Color; // su color, creado una vez (antes se creaba uno por frame)
  ultX: number; ultY: number; ultOp: number; // último estilo escrito en su etiqueta
  dimBase: number;    // su brillo propio (los de los extremos van algo apagados)
  atenuar: number;    // 0..1 · baja cuando el ratón señala a OTRO
  hoverZ: number;     // el señalado da un paso hacia la cámara
  pxParallax: number; // píxeles que se mueve con el parallax (más cerca, más)
  alpha: Uint8Array | null;
  hover: number;
  hovered: boolean;
  activo: { t0: number; ef: Efecto; ctx: CtxEfecto } | null;
  listo: boolean;
  nacido: number;
};

const FOV = 22;
const PASO = 0.72;       // separación entre personajes (en unidades: un personaje mide 2 de alto)
const ESCALONADO = 0.85; // dos filas: los pares delante, los impares detrás
const GRADA = 0.3;       // la fila de atrás está subida a un escalón: se le ve el cuerpo
const ARCO = 1.0;        // los extremos se van un poco hacia el fondo
const ETIQUETA_Z = 0.32; // las etiquetas van un poco por delante de los pies
const ZIGZAG_PX = 34;    // las de la fila de atrás bajan una línea, para no pisarse
const Y_FONDO = -2.0;    // hasta dónde se ve por debajo del suelo (reflejos y etiquetas)
const PAISAJE_Z = -14;   // el paisaje del fondo, lejos: con el parallax se mueve menos que la fila
const PAISAJE_ALTO = 13; // alto mínimo del paisaje en unidades (crece si hace falta para cubrir el ancho)
const PAISAJE_BASE = 0.42; // fracción de la pintura (desde abajo: su lago con el reflejo) que queda bajo nuestro suelo
const PAISAJE_RUTA = "/fama/fondo.webp";
const ALPHA_W = 48, ALPHA_H = 96;
const ORO = new THREE.Color(0xe3b341); // se crea una vez, no una por frame

// Colores "crudos" para el shader del personaje (que no pasa por la gestión
// de color de three): el hexadecimal tal cual, sin convertir a lineal.
function colorCrudo(hex: string): THREE.Color {
  return new THREE.Color().setStyle(hex, THREE.LinearSRGBColorSpace);
}

export function hayWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export class Escenario {
  private readonly o: Opciones;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly personajes: Personaje[] = [];
  private readonly luz: PoolParticulas;
  private readonly materia: PoolParticulas;
  private readonly flashes: Flashes;
  private readonly luzDir = { value: new THREE.Vector3(0.2, 0.6, 1).normalize() };
  private readonly texturas: THREE.Texture[] = [];
  private readonly ray = new THREE.Raycaster();
  private readonly loader = new THREE.TextureLoader();
  private readonly motas: { points: THREE.Points; mat: THREE.ShaderMaterial };
  private foco: THREE.Sprite | null = null; // la luz que se enciende detrás del señalado
  private mundoPorPixel0 = 0.01;            // cuánto mundo mide un píxel a la altura de la fila
  private raf = 0;
  private visible = false;
  private cargando = false;
  private readonly t0 = performance.now();
  private ultimo = 0;
  private readonly mouse = { x: 0, y: 0, tx: 0, ty: 0, dentro: false };
  private ndc: THREE.Vector2 | null = null;
  private ndcSucio = false; // ¿se ha movido el ratón desde el último picado?
  private hoverRaton: string | null = null;
  private hoverExterno: string | null = null;
  private hoverActual: string | null = null;
  private halfW = 1;
  private centro = 0;       // centro horizontal de todo el grupo (la cámara mira ahí)
  private yTop = 2.6;       // lo más alto que hay que encuadrar
  private hayVuelo = false; // con personajes en el aire el encuadre también mira la altura
  private distancia = 16;
  private pan = 0;
  private panObjetivo = 0;
  private panMax = 0;
  private arrastre: { x0: number; pan0: number; movido: boolean } | null = null;
  private readonly ro: ResizeObserver;
  private readonly io: IntersectionObserver;
  private readonly onVis = () => (document.hidden ? this.parar() : this.arrancar());
  private readonly reduce: boolean;
  private frameSuelto = false;

  constructor(o: Opciones) {
    this.o = o;
    this.reduce = o.reducirMovimiento;
    const lowEnd = window.matchMedia("(pointer: coarse)").matches;

    this.renderer = new THREE.WebGLRenderer({ canvas: o.canvas, alpha: true, antialias: !lowEnd, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowEnd ? 1.5 : 1.75));
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 120);

    // texturas procedurales compartidas
    const suave = texSuave();
    const atlas = texAtlas();
    const tex = { suave, anillo: texAnillo(), onda: texOnda(), haz: texHaz(), ala: texAla() };
    this.texturas.push(suave, atlas, tex.anillo, tex.onda, tex.haz, tex.ala);

    this.luz = new PoolParticulas(lowEnd ? 500 : 1100, atlas, true);
    this.materia = new PoolParticulas(lowEnd ? 160 : 320, atlas, false);
    this.scene.add(this.luz.points, this.materia.points);
    this.flashes = new Flashes(this.scene, tex);

    this.crearSuelo();
    this.crearPaisaje();
    this.crearHorizonte();
    this.motas = this.crearMotas(lowEnd ? 70 : 150, suave);
    this.crearPersonajes(suave);

    // Una sola luz para todos: se coloca detrás del personaje que señala el
    // ratón y se enciende con su color. Barata (un sprite) y hace el trabajo
    // de separarlo del fondo.
    const foco = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: suave, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    foco.renderOrder = 2;
    foco.visible = false;
    this.scene.add(foco);
    this.foco = foco;

    this.ro = new ResizeObserver(() => this.redimensionar());
    this.ro.observe(o.host);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.arrancar();
      else this.parar();
    }, { threshold: 0.02 });
    this.io.observe(o.host);
    document.addEventListener("visibilitychange", this.onVis);

    const host = o.host;
    host.addEventListener("pointermove", this.onMove);
    host.addEventListener("pointerleave", this.onLeave);
    host.addEventListener("pointerdown", this.onDown);
    host.addEventListener("pointerup", this.onUp);
    host.addEventListener("pointercancel", this.onUp);

    this.redimensionar();
    this.dibujar(0);
  }

  // ── construcción de la escena ──────────────────────────────────────────

  private crearSuelo() {
    // Opaco y CON profundidad: tapa el resplandor del horizonte por debajo de
    // la línea del suelo (los reflejos se pintan encima sin test de profundidad).
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vP;
        void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        varying vec2 vP;
        void main() {
          // vP.y crece hacia el fondo (el plano está tumbado)
          float fondo = smoothstep(-6.0, 14.0, vP.y);
          vec3 base = mix(vec3(0.040, 0.040, 0.047), vec3(0.052, 0.050, 0.058), fondo);
          float charco = exp(-(vP.x * vP.x / 70.0 + (vP.y - 1.5) * (vP.y - 1.5) / 10.0));
          base += vec3(0.89, 0.70, 0.25) * charco * 0.055;
          // se funde con el fondo de la página por los lados, por delante y al fondo
          float borde = smoothstep(26.0, 8.0, abs(vP.x)) * smoothstep(-9.0, -3.0, vP.y) * (1.0 - smoothstep(7.0, 19.0, vP.y));
          gl_FragColor = vec4(base * borde, 1.0); // valores ya en sRGB (sin conversión)
        }`,
    });
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(80, 40), mat);
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.set(0, -0.005, 4);
    suelo.renderOrder = 0;
    this.scene.add(suelo);
  }

  // El paisaje del fondo: un plano lejano con la pintura (public/fama/fondo.webp)
  // y su espejo bajo la línea del suelo, para que el suelo lo refleje como un
  // lago. Se funde con la página por arriba y por los lados, y una neblina
  // dorada deriva por su horizonte.
  private paisaje: { mesh: THREE.Mesh; espejo: THREE.Mesh; uni: Record<string, THREE.IUniform>; nacido: number } | null = null;
  private crearPaisaje() {
    const vacio = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
    vacio.needsUpdate = true;
    const uni: Record<string, THREE.IUniform> = {
      uMap: { value: vacio },
      uTime: { value: 0 },
      uFade: { value: 0 },
      uHorizonte: { value: 0 }, // uv.y del plano donde cruza la línea del suelo
    };
    const vertexShader = /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const fragmentShader = GLSL_NOISE + /* glsl */ `
      uniform sampler2D uMap; uniform float uTime, uFade, uHorizonte;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
#ifdef REFLEJO
        // Solo se refleja lo que está por encima del suelo, y tiembla como
        // agua. El temblor es MUY corto a propósito: en el reflejo lo único
        // que se distingue son los acantilados de los lados, y al moverse
        // parecían una montaña suelta flotando bajo los pies.
        if (uv.y < uHorizonte) discard;
        uv.x += sin(uv.y * 40.0 + uTime * 1.6) * 0.0014 + sin(uv.y * 17.0 - uTime * 1.1) * 0.0007;
#endif
        vec3 col = texture2D(uMap, uv).rgb;
        // neblina dorada que deriva por el horizonte
        float m = fbm(vec2(uv.x * 4.0 + uTime * 0.012, uv.y * 7.0 - uTime * 0.008));
        float banda = smoothstep(uHorizonte - 0.05, uHorizonte + 0.12, uv.y) * (1.0 - smoothstep(uHorizonte + 0.16, uHorizonte + 0.4, uv.y));
        col += vec3(0.9, 0.72, 0.4) * m * banda * 0.14;
        // bordes: se funde con la página arriba y a los lados
        float borde = smoothstep(0.0, 0.09, uv.x) * (1.0 - smoothstep(0.91, 1.0, uv.x)) * (1.0 - smoothstep(0.86, 1.0, uv.y));
        float a = borde * uFade;
#ifdef REFLEJO
        // del reflejo interesa el resplandor del centro (la luz sobre el
        // agua), no los acantilados de los extremos: se apagan a los lados y
        // se desvanece antes al alejarse de la orilla
        col *= 0.30;
        a *= (1.0 - smoothstep(uHorizonte, uHorizonte + 0.20, uv.y)) * 0.75;
        a *= 1.0 - smoothstep(0.20, 0.46, abs(uv.x - 0.5));
#endif
        gl_FragColor = vec4(col, a); // valores ya en sRGB (sin conversión)
      }`;
    const mat = new THREE.ShaderMaterial({ uniforms: uni, vertexShader, fragmentShader, transparent: true, depthWrite: false });
    const matR = new THREE.ShaderMaterial({ uniforms: uni, vertexShader, fragmentShader, transparent: true, depthWrite: false, depthTest: false, defines: { REFLEJO: 1 } });
    const geo = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.z = PAISAJE_Z;
    mesh.renderOrder = -2;
    mesh.visible = false;
    const espejo = new THREE.Mesh(geo, matR);
    espejo.position.z = PAISAJE_Z;
    espejo.renderOrder = -1;
    espejo.visible = false;
    this.scene.add(mesh, espejo);
    this.paisaje = { mesh, espejo, uni, nacido: 0 };
  }

  private aspectoPaisaje = 2.4;
  private cargarPaisaje() {
    const pz = this.paisaje;
    if (!pz) return;
    const t = this.loader.load(PAISAJE_RUTA, (tex) => {
      tex.colorSpace = THREE.NoColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      const img = tex.image as HTMLImageElement;
      this.aspectoPaisaje = img.width / Math.max(1, img.height);
      pz.uni.uMap.value = tex;
      pz.mesh.visible = true;
      pz.espejo.visible = true;
      pz.nacido = this.ahora();
      this.colocarPaisaje();
      this.frameSuelto = true;
      this.arrancar();
    });
    this.texturas.push(t);
  }

  // Tamaño y altura del paisaje: cubre todo el ancho que ve la cámara a esa
  // distancia, y su lago (la franja de abajo) queda bajo nuestro suelo, que
  // ya hace de lago: la isla con las cascadas asoma justo detrás del grupo.
  private colocarPaisaje() {
    const pz = this.paisaje;
    if (!pz || !pz.mesh.visible) return;
    const tanH = Math.tan((FOV / 2) * Math.PI / 180);
    const anchoNecesario = 2 * (this.distancia - PAISAJE_Z) * tanH * this.camera.aspect + 4;
    const alto = Math.max(PAISAJE_ALTO, anchoNecesario / this.aspectoPaisaje);
    const ancho = alto * this.aspectoPaisaje;
    const base = -PAISAJE_BASE * alto;
    pz.mesh.scale.set(ancho, alto, 1);
    pz.mesh.position.y = base + alto / 2;
    pz.espejo.scale.set(ancho, -alto, 1);
    pz.espejo.position.y = -(base + alto / 2);
    pz.uni.uHorizonte.value = -base / alto;
  }

  // Resplandor dorado tras la fila: la luz que viene del fondo del salón.
  private crearHorizonte() {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; varying vec2 vUv;
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          // una neblina dorada baja, pegada a la línea del suelo tras la fila
          float h = exp(-pow((p.y + 0.45) * 3.6, 2.0));
          float w = exp(-p.x * p.x * 1.6);
          float latido = 0.92 + 0.08 * sin(uTime * 0.6);
          vec3 col = mix(vec3(0.89, 0.70, 0.25), vec3(1.0, 0.92, 0.72), h * 0.5) * h * w * 0.18 * latido;
          gl_FragColor = vec4(col, 1.0); // valores ya en sRGB (sin conversión)
        }`,
    });
    const plano = new THREE.Mesh(new THREE.PlaneGeometry(46, 12), mat);
    plano.position.set(0, 3.2, -9);
    plano.renderOrder = 0;
    this.scene.add(plano);
    this.horizonteMat = mat;
  }
  private horizonteMat!: THREE.ShaderMaterial;

  private crearMotas(n: number, suave: THREE.Texture) {
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 3.6;
      pos[i * 3 + 2] = -4 + Math.random() * 8;
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uMap: { value: suave }, uScale: { value: 400 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime, uScale; attribute float aSeed; varying float vA;
        void main() {
          vec3 p = position;
          float sube = mod(p.y + uTime * (0.08 + aSeed * 0.12), 3.6);
          p.y = sube;
          p.x += sin(uTime * 0.25 + aSeed * 40.0) * 0.5;
          p.z += cos(uTime * 0.2 + aSeed * 30.0) * 0.4;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (0.018 + aSeed * 0.03) * uScale / max(-mv.z, 0.1);
          gl_Position = projectionMatrix * mv;
          vA = smoothstep(0.0, 0.5, sube) * (1.0 - smoothstep(2.6, 3.6, sube)) * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (1.0 + aSeed) + aSeed * 9.0)));
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap; varying float vA;
        void main() {
          vec4 t = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(vec3(1.0, 0.85, 0.55) * t.a, t.a * vA * 0.7);
        }`,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.renderOrder = 6;
    this.scene.add(points);
    return { points, mat };
  }

  private crearPersonajes(suave: THREE.Texture) {
    const leyendas = this.o.leyendas;
    const enFila = leyendas.filter((l) => !l.vuela);
    const N = enFila.length;
    // sitio de cada uno en la fila: con el hueco central para el líder, los
    // primeros `tras` acaban a su izquierda y el resto empiezan a su derecha
    const hueco = N > HUECO.tras ? HUECO : null;
    const xDe = (i: number) => {
      if (!hueco) return -((N - 1) * PASO) / 2 + i * PASO;
      return i < hueco.tras ? -hueco.ancho / 2 - (hueco.tras - 1 - i) * PASO : hueco.ancho / 2 + (i - hueco.tras) * PASO;
    };
    const extremo = Math.max(1, ...enFila.map((_, i) => Math.abs(xDe(i))));
    this.hayVuelo = leyendas.some((l) => !!l.vuela);
    // encuadre: de la punta más a la izquierda a la más a la derecha (con los
    // que vuelan, que pueden quedar fuera de la fila); la cámara mira al centro
    let xMin = Infinity, xMax = -Infinity;
    leyendas.forEach((l) => {
      const medio = (H * aspectoDe(l.id) * (l.escala ?? 1)) / 2;
      const x = l.vuela ? l.vuela.x : xDe(enFila.indexOf(l));
      xMin = Math.min(xMin, x - medio);
      xMax = Math.max(xMax, x + medio);
    });
    this.centro = (xMin + xMax) / 2;
    this.halfW = (xMax - xMin) / 2 + 0.3;
    const vacio = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
    vacio.needsUpdate = true;

    leyendas.forEach((ley) => {
      const i = enFila.indexOf(ley);
      let u: number, x: number, y: number, z: number, fila: 0 | 1;
      if (ley.vuela) {
        // en el aire, donde diga su ficha (no ocupa sitio en la fila)
        ({ x, y, z } = ley.vuela);
        u = Math.min(1, Math.abs(x) / extremo);
        fila = 0;
        this.yTop = Math.max(this.yTop, y + H * (ley.escala ?? 1) + 0.3);
      } else {
        x = xDe(i);
        u = Math.max(-1, Math.min(1, x / extremo));
        fila = i % 2 === 0 ? 0 : 1;
        z = 0.4 - ARCO * u * u + (fila === 0 ? ESCALONADO / 2 : -ESCALONADO / 2);
        y = fila === 1 ? GRADA : 0;
      }
      const escala = (ley.escala ?? 1) * (ley.vuela ? 1 : 1 - 0.05 * u * u);
      const aspecto = aspectoDe(ley.id);
      const ancho = H * aspecto;

      const uni: Record<string, THREE.IUniform> = {
        uMap: { value: vacio },
        uRelieve: { value: vacio },
        uTexel: { value: new THREE.Vector2(1 / 350, 1 / 512) },
        uTime: { value: 0 },
        uSeed: { value: Math.random() },
        uHover: { value: 0 },
        uHoverT: { value: -1 },
        uRelief: { value: 0.16 },
        uWind: { value: 0 },
        uAngulo: { value: 0 },
        uRadio: { value: 0.3 },
        uKind: { value: 0 },
        uPivot: { value: new THREE.Vector2() },
        uTip: { value: new THREE.Vector2(0, 1) },
        uColor: { value: colorCrudo(ley.color) },
        uLightDir: this.luzDir,
        uKeyColor: { value: colorCrudo("#ffe2b0") },
        uDim: { value: ley.vuela ? 0.95 : 1 - 0.18 * u * u },
        uFade: { value: 0 },
        uOculto: { value: 0 },
        uVuelo: { value: ley.vuela ? 1 : 0 },
      };

      // La deformación (respiración, telas, gesto) es suave, así que 18×36 se
      // ve igual que 28×56 y cuesta la mitad de vértices, cada uno con su
      // lectura de textura del relieve.
      const geo = new THREE.PlaneGeometry(ancho, H, 18, 36).translate(0, H / 2, 0);
      const mat = new THREE.ShaderMaterial({ uniforms: uni, vertexShader: VERTEX, fragmentShader: FRAGMENT, transparent: true, depthWrite: true, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(escala);
      mesh.renderOrder = 3;
      mesh.userData.id = ley.id;
      this.scene.add(mesh);

      // el reflejo queda bajo el suelo: se pinta sin test de profundidad, encima del suelo opaco
      const matR = new THREE.ShaderMaterial({ uniforms: uni, vertexShader: VERTEX, fragmentShader: FRAGMENT, transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide, defines: { REFLEJO: 1 } });
      // El reflejo va aún más basto: se ve borroso y apagado bajo el agua.
      const geoR = new THREE.PlaneGeometry(ancho, H, 10, 20).translate(0, H / 2, 0);
      // El reflejo se espeja en el plano donde pisa (el suelo o la grada).
      // Los que vuelan NO se reflejan: al estar tan altos, su reflejo caía
      // muy lejos de ellos y se leía como una mancha suelta flotando en el
      // negro, no como un reflejo.
      let reflejo: THREE.Mesh | null = null;
      if (!ley.vuela) {
        reflejo = new THREE.Mesh(geoR, matR);
        reflejo.position.set(x, y, z);
        reflejo.scale.set(escala, -escala, escala);
        reflejo.renderOrder = 1;
        this.scene.add(reflejo);
      } else {
        matR.dispose();
        geoR.dispose();
      }

      // charco de luz bajo los pies (se enciende con el color del gesto);
      // los que vuelan alto no lo tienen
      let charco: THREE.Sprite | null = null;
      if (!ley.vuela || ley.vuela.y < 1) {
        charco = new THREE.Sprite(new THREE.SpriteMaterial({ map: suave, color: 0xe3b341, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending }));
        charco.position.set(x, (ley.vuela ? 0 : y) + 0.02, z + 0.15);
        charco.scale.set((ley.lider ? 2.4 : 1.6) * escala, (ley.lider ? 0.7 : 0.45) * escala, 1);
        charco.renderOrder = 1;
        this.scene.add(charco);
      }

      // el líder lleva un resplandor dorado a la espalda, siempre encendido
      let halo: THREE.Sprite | null = null;
      if (ley.lider) {
        halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: suave, color: 0xffcf7a, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }));
        halo.scale.set(3.4 * escala, 3.0 * escala, 1);
        halo.renderOrder = 2;
        this.scene.add(halo);
      }

      // el pivote y la punta del arma, en coordenadas locales del plano
      if (ley.arma) {
        const loc = (a: Ancla) => new THREE.Vector2((a[0] - 0.5) * ancho, (1 - a[1]) * H);
        const p = loc(ley.arma.pivote), t = loc(ley.arma.punta);
        (uni.uPivot.value as THREE.Vector2).copy(p);
        (uni.uTip.value as THREE.Vector2).copy(t);
        uni.uRadio.value = (ley.arma.radio ?? 0.1) * H;
        const grados = ley.arma.angulo ?? 8;
        // la punta debe SUBIR: sentido antihorario si está a la derecha del pivote
        uni.uAngulo.value = (grados * Math.PI) / 180 * (t.x >= p.x ? 1 : -1);
      }

      // Gemelo plano para el picado: 2 triángulos con las mismas uv. Cuelga
      // del personaje, así hereda su sitio sin cálculos extra, y no se dibuja.
      const picker = new THREE.Mesh(new THREE.PlaneGeometry(ancho, H).translate(0, H / 2, 0));
      picker.visible = false;
      mesh.add(picker);

      this.personajes.push({ ley, mesh, reflejo, charco, picker, halo, uni, ancho, x, y, z, vuela: !!ley.vuela, ofs: { y: 0, z: 0 }, fila, escala, color: new THREE.Color(ley.color), ultX: -1e9, ultY: -1e9, ultOp: -1,
        dimBase: uni.uDim.value as number, atenuar: 1, hoverZ: 0,
        pxParallax: ley.vuela ? 9 : fila === 0 ? 7 : 4,
        alpha: null, hover: 0, hovered: false, activo: null, listo: false, nacido: 0 });
    });
  }

  // ── carga del arte (cuando la sección se acerca) ───────────────────────

  cargar() {
    if (this.cargando) return;
    this.cargando = true;
    this.cargarPaisaje();
    let listos = 0;
    this.personajes.forEach((p, i) => {
      const color = this.loader.load(rutaArte(p.ley.id), (t) => {
        t.colorSpace = THREE.NoColorSpace;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
        p.uni.uMap.value = t;
        p.alpha = this.leerAlpha(t.image as HTMLImageElement);
        comprobar();
      });
      const relieve = this.loader.load(rutaRelieve(p.ley.id), (t) => {
        t.colorSpace = THREE.NoColorSpace;
        p.uni.uRelieve.value = t;
        const img = t.image as HTMLImageElement;
        (p.uni.uTexel.value as THREE.Vector2).set(1 / Math.max(1, img.width), 1 / Math.max(1, img.height));
        comprobar();
      });
      this.texturas.push(color, relieve);
      const comprobar = () => {
        if (p.listo || p.uni.uMap.value === undefined) return;
        if (!p.alpha || (p.uni.uTexel.value as THREE.Vector2).x === 1 / 350) return;
        p.listo = true;
        // aparecen de izquierda a derecha, con un pequeño retardo entre ellos
        p.nacido = this.ahora() + i * 0.07;
        this.frameSuelto = true;
        if (++listos === 1) this.o.onListo();
        this.arrancar();
      };
    });
  }

  private leerAlpha(img: HTMLImageElement): Uint8Array {
    const c = document.createElement("canvas");
    c.width = ALPHA_W;
    c.height = ALPHA_H;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(img, 0, 0, ALPHA_W, ALPHA_H);
    const d = g.getImageData(0, 0, ALPHA_W, ALPHA_H).data;
    const out = new Uint8Array(ALPHA_W * ALPHA_H);
    for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3];
    return out;
  }

  // ── tamaño y cámara ────────────────────────────────────────────────────

  private redimensionar() {
    const r = this.o.host.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const tanH = Math.tan((FOV / 2) * Math.PI / 180);
    // distancia para que quepa toda la fila; en pantallas estrechas se acerca
    // y se puede desplazar con el dedo
    let d = this.halfW / (tanH * this.camera.aspect) + 0.8;
    // con gente en el aire, que quepan también a lo alto
    if (this.hayVuelo) d = Math.max(d, (this.yTop - Y_FONDO) / 2 / tanH);
    // la banda ahora es alta: con la fila entera a lo ancho hace falta alejarse más
    d = Math.min(Math.max(d, 9), 24);
    this.distancia = d;
    const visibleHalf = d * tanH * this.camera.aspect;
    this.panMax = Math.max(0, this.halfW - visibleHalf);
    this.mundoPorPixel0 = (2 * this.distancia * tanH * this.camera.aspect) / w;
    this.lienzo.w = w; this.lienzo.h = h;
    for (const p of this.personajes) { p.ultX = -1e9; p.ultY = -1e9; }
    const escalaPx = h / (2 * tanH);
    this.luz.escala = escalaPx;
    this.materia.escala = escalaPx;
    this.motas.mat.uniforms.uScale.value = escalaPx;
    this.colocarPaisaje();
    this.frameSuelto = true;
  }

  // ── entrada ────────────────────────────────────────────────────────────

  private readonly onMove = (e: PointerEvent) => {
    const r = this.o.host.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (this.arrastre) {
      const dx = e.clientX - this.arrastre.x0;
      if (Math.abs(dx) > 6) this.arrastre.movido = true;
      if (this.panMax > 0) {
        this.panObjetivo = Math.min(Math.max(this.arrastre.pan0 - dx * (this.panMax * 2) / r.width * 1.4, -this.panMax), this.panMax);
      }
    }
    if (e.pointerType === "mouse") {
      this.mouse.tx = nx;
      this.mouse.ty = ny;
      this.mouse.dentro = true;
      const ndc = (this.ndc ??= new THREE.Vector2());
      if (Math.abs(ndc.x - nx) > 1e-4 || Math.abs(ndc.y + ny) > 1e-4) {
        ndc.set(nx, -ny);
        this.ndcSucio = true;
      }
    }
    this.arrancar();
  };

  private readonly onLeave = () => {
    this.mouse.tx = 0;
    this.mouse.ty = 0;
    this.mouse.dentro = false;
    this.ndc = null;
    this.ponerHoverRaton(null);
    this.arrastre = null;
  };

  private readonly onDown = (e: PointerEvent) => {
    this.arrastre = { x0: e.clientX, pan0: this.panObjetivo, movido: false };
    if (e.pointerType !== "mouse") {
      const r = this.o.host.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      const id = this.buscar(ndc);
      // un toque dispara el gesto; si luego arrastra, lo soltamos
      this.ponerHoverRaton(id);
    }
    this.arrancar();
  };

  private readonly onUp = () => {
    if (this.arrastre?.movido || !this.mouse.dentro) this.ponerHoverRaton(null);
    this.arrastre = null;
  };

  // hover desde fuera (etiquetas con el ratón o el teclado)
  hover(id: string | null) {
    this.hoverExterno = id;
    this.resolverHover();
    this.arrancar();
  }

  private ponerHoverRaton(id: string | null) {
    if (id === this.hoverRaton) return;
    this.hoverRaton = id;
    this.resolverHover();
  }

  private resolverHover() {
    const id = this.hoverExterno ?? this.hoverRaton;
    if (id === this.hoverActual) return;
    const antes = this.personajes.find((p) => p.ley.id === this.hoverActual);
    if (antes) antes.hovered = false;
    this.hoverActual = id;
    const ahora = this.personajes.find((p) => p.ley.id === id);
    if (ahora) {
      ahora.hovered = true;
      if (!ahora.activo && ahora.listo) this.iniciarGesto(ahora);
    }
    this.o.host.style.cursor = ahora ? "pointer" : "";
    this.o.onHover(id);
  }

  // ¿Qué personaje hay bajo el puntero? (con la silueta real, no el rectángulo)
  private readonly pickers: THREE.Mesh[] = [];
  private readonly hits: THREE.Intersection[] = [];
  private buscar(ndc: THREE.Vector2): string | null {
    // contra los gemelos planos (2 triángulos), no contra la malla completa
    this.pickers.length = 0;
    for (const p of this.personajes) if (p.listo) this.pickers.push(p.picker);
    this.ray.setFromCamera(ndc, this.camera);
    this.hits.length = 0;
    const hits = this.ray.intersectObjects(this.pickers, false, this.hits);
    for (const h of hits) {
      const p = this.personajes.find((q) => q.picker === h.object);
      if (!p || !p.alpha || !h.uv) continue;
      const ax = Math.min(ALPHA_W - 1, Math.max(0, Math.floor(h.uv.x * ALPHA_W)));
      const ay = Math.min(ALPHA_H - 1, Math.max(0, Math.floor((1 - h.uv.y) * ALPHA_H)));
      if (p.alpha[ay * ALPHA_W + ax] > 90) return p.ley.id;
    }
    return null;
  }

  // ── gestos ─────────────────────────────────────────────────────────────

  private iniciarGesto(p: Personaje) {
    const ef = EFECTOS[p.ley.efecto];
    const ctx: CtxEfecto = {
      ley: p.ley,
      color: new THREE.Color(p.ley.color),
      uni: p.uni,
      ancho: p.ancho * p.escala,
      ancla: (a, z = 0) => p.mesh.localToWorld(new THREE.Vector3((a[0] - 0.5) * p.ancho, (1 - a[1]) * H, z)),
      pies: () => (p.vuela ? p.mesh.position.clone() : new THREE.Vector3(p.x, p.y, p.z)),
      mover: (dy, dz) => {
        p.ofs.y = dy;
        p.ofs.z = dz;
      },
      luz: this.luz,
      materia: this.materia,
      flashes: this.flashes,
      estado: {},
      ahora: this.ahora(),
    };
    p.uni.uKind.value = ef.gesto;
    p.uni.uHoverT.value = 0;
    p.activo = { t0: ctx.ahora, ef, ctx };
    ef.iniciar?.(ctx);
    this.arrancar();
  }

  private pasoGestos(dt: number, ahora: number) {
    for (const p of this.personajes) {
      const objetivo = p.hovered ? 1 : 0;
      p.hover += (objetivo - p.hover) * (1 - Math.exp(-dt * 7));
      p.uni.uHover.value = p.hover;
      // cuando el ratón señala a alguien, el resto baja de brillo…
      const atObjetivo = this.hoverActual && !p.hovered ? 0.58 : 1;
      p.atenuar += (atObjetivo - p.atenuar) * (1 - Math.exp(-dt * 6));
      p.uni.uDim.value = p.dimBase * p.atenuar;
      // …y el señalado da un paso hacia la cámara
      p.hoverZ += ((p.hovered ? 0.3 : 0) - p.hoverZ) * (1 - Math.exp(-dt * 6));
      if (p.charco) {
        const mat = p.charco.material as THREE.SpriteMaterial;
        mat.opacity = ((p.ley.lider ? 0.3 : 0.16) + p.hover * 0.35) * (p.uni.uFade.value as number);
        mat.color.lerpColors(ORO, p.color, p.hover);
      }
      if (!p.activo) continue;
      const { t0, ef, ctx } = p.activo;
      const t = (ahora - t0) / ef.duracion;
      ctx.ahora = ahora;
      if (t >= 1) {
        ef.terminar?.(ctx);
        p.uni.uHoverT.value = -1;
        p.uni.uKind.value = GESTO.ninguno;
        p.uni.uWind.value = 0;
        p.uni.uOculto.value = 0;
        p.ofs.y = 0;
        p.ofs.z = 0;
        p.activo = null;
        continue;
      }
      p.uni.uHoverT.value = t;
      ef.paso(ctx, t, dt);
    }
  }

  // ── bucle ──────────────────────────────────────────────────────────────

  private ahora() {
    return (performance.now() - this.t0) / 1000;
  }

  private dibujar(ahora: number) {
    const dt = Math.min(0.05, Math.max(0.001, ahora - this.ultimo));
    this.ultimo = ahora;
    const idle = this.reduce ? 0 : ahora;

    // La cámara está QUIETA: el ratón no la mueve ni hay deriva (Miguel lo
    // prefiere así: que solo se muevan los personajes). El ratón solo orienta
    // la luz que baña las figuras. En pantallas estrechas, el desplazamiento
    // lateral lo pone el dedo al arrastrar.
    this.mouse.x += (this.mouse.tx - this.mouse.x) * (1 - Math.exp(-dt * 4));
    this.mouse.y += (this.mouse.ty - this.mouse.y) * (1 - Math.exp(-dt * 4));
    this.pan += (this.panObjetivo - this.pan) * (1 - Math.exp(-dt * 3));
    // cámara algo por encima de los ojos, mirando a la altura de la cadera:
    // la fila queda en la mitad alta del lienzo y el reflejo, debajo. Con
    // gente volando, mira más arriba para que quepan.
    const miraY = this.hayVuelo ? (this.yTop + Y_FONDO) / 2 : 0.62;
    this.camera.position.set(this.centro + this.pan, miraY + 0.78, this.distancia);
    this.camera.lookAt(this.centro + this.pan, miraY, 0);
    this.luzDir.value.set(this.mouse.x * 0.9 + 0.2, 0.55 - this.mouse.y * 0.45, 1.0).normalize();

    // el picado solo cuando el ratón se ha movido: quieto no cuesta nada
    if (this.ndcSucio && this.ndc && this.mouse.dentro && !this.arrastre) {
      this.ndcSucio = false;
      this.ponerHoverRaton(this.buscar(this.ndc));
    }

    // quien pide menos movimiento no tiene parallax (el hover sí: es respuesta a su gesto)
    const movRaton = this.reduce ? 0 : this.mouse.x;
    let senal: Personaje | null = null;
    for (const p of this.personajes) {
      p.uni.uTime.value = idle;
      if (p.listo && p.uni.uFade.value < 1) p.uni.uFade.value = Math.min(1, Math.max(0, (ahora - p.nacido) / 0.9));
      // los que vuelan se mecen en el aire (y su reflejo con ellos, al revés);
      // los gestos pueden desplazar a cualquiera
      const bob = p.vuela && !this.reduce ? Math.sin(ahora * 1.1 + (p.uni.uSeed.value as number) * 9) * 0.07 : 0;
      // Parallax: al mover el ratón a los lados, cada capa se desplaza unos
      // pocos píxeles, y las de delante más que las del fondo. La cámara NO
      // se mueve: lo que da la profundidad es la diferencia entre capas.
      const par = movRaton * p.pxParallax * this.mundoPorPixel0 * ((this.distancia - p.z) / this.distancia);
      const px = p.x + par;
      const pz = p.z + p.ofs.z + p.hoverZ;
      const py = p.y + bob + p.ofs.y;
      p.mesh.position.set(px, py, pz);
      if (p.reflejo) p.reflejo.position.set(px, p.y, pz);
      if (p.charco) p.charco.position.set(px, (p.vuela ? 0 : p.y) + 0.02, pz + 0.15);
      if (p.halo) {
        // el halo sigue al líder, a la altura del pecho, y late despacio
        p.halo.position.set(px, py + H * p.escala * 0.5, pz - 0.15);
        (p.halo.material as THREE.SpriteMaterial).opacity = (0.26 + 0.08 * Math.sin(ahora * 1.3)) * (p.uni.uFade.value as number);
      }
      if (!senal || p.hover > senal.hover) senal = p;
    }
    // la luz de fondo se muda al personaje señalado y se apaga sola al salir
    if (this.foco) {
      if (senal && senal.hover > 0.004) {
        const m = this.foco.material as THREE.SpriteMaterial;
        m.color.copy(senal.color);
        m.opacity = senal.hover * 0.34 * (senal.uni.uFade.value as number);
        this.foco.visible = true;
        this.foco.scale.set(2.6 * senal.escala, 3.5 * senal.escala, 1);
        this.foco.position.set(senal.mesh.position.x, senal.mesh.position.y + H * senal.escala * 0.5, senal.mesh.position.z - 0.4);
      } else if (this.foco.visible) {
        this.foco.visible = false;
      }
    }
    if (this.paisaje?.mesh.visible) {
      // el fondo también se mueve, pero mucho menos: es lo que está más lejos
      const parF = movRaton * 1.6 * this.mundoPorPixel0 * ((this.distancia - PAISAJE_Z) / this.distancia);
      this.paisaje.mesh.position.x = parF;
      this.paisaje.espejo.position.x = parF;
    }
    this.pasoGestos(dt, ahora);
    this.luz.actualizar(dt, ahora);
    this.materia.actualizar(dt, ahora);
    this.motas.mat.uniforms.uTime.value = idle;
    this.horizonteMat.uniforms.uTime.value = ahora;
    if (this.paisaje?.mesh.visible) {
      this.paisaje.uni.uTime.value = idle;
      if (this.paisaje.uni.uFade.value < 1) this.paisaje.uni.uFade.value = Math.min(1, (ahora - this.paisaje.nacido) / 1.4);
    }

    this.colocarEtiquetas();
    this.renderer.render(this.scene, this.camera);
  }

  private readonly v3 = new THREE.Vector3();
  private lienzo = { w: 1, h: 1 }; // medido al redimensionar, no en cada frame
  private colocarEtiquetas() {
    const etiquetas = this.o.etiquetas();
    const r = this.lienzo;
    for (const p of this.personajes) {
      const el = etiquetas[p.ley.id];
      if (!el) continue;
      // todas las etiquetas cuelgan de la línea de la fila delantera; las de
      // la fila de atrás bajan una línea (zigzag) para no pisarse. Las de los
      // que vuelan van justo bajo sus pies, y se mecen con ellos.
      if (p.vuela) this.v3.set(p.mesh.position.x, p.mesh.position.y - 0.04, p.mesh.position.z);
      else this.v3.set(p.mesh.position.x, 0, p.z + (p.fila === 1 ? ESCALONADO : 0) + ETIQUETA_Z);
      this.v3.project(this.camera);
      const sx = (this.v3.x * 0.5 + 0.5) * r.w;
      const sy = (-this.v3.y * 0.5 + 0.5) * r.h + 4 + (p.fila === 1 ? ZIGZAG_PX : 0);
      // solo se escribe si cambió: cada escritura cuesta recalcular estilo
      if (Math.abs(sx - p.ultX) > 0.25 || Math.abs(sy - p.ultY) > 0.25) {
        p.ultX = sx; p.ultY = sy;
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, 0)`;
      }
      const op = p.listo ? Math.min(1, p.uni.uFade.value as number) : 0;
      if (Math.abs(op - p.ultOp) > 0.01) {
        p.ultOp = op;
        el.style.opacity = String(op);
      }
    }
  }

  private readonly loop = () => {
    this.raf = 0;
    if (!this.visible || document.hidden) return;
    const ahora = this.ahora();
    this.dibujar(ahora);
    const hayGesto = this.personajes.some((p) => p.activo) || this.mouse.dentro;
    if (!this.reduce || hayGesto || this.frameSuelto) {
      this.frameSuelto = false;
      this.raf = requestAnimationFrame(this.loop);
    }
  };

  private arrancar() {
    if (!this.raf && this.visible && !document.hidden) this.raf = requestAnimationFrame(this.loop);
  }

  private parar() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  destruir() {
    this.parar();
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.onVis);
    const host = this.o.host;
    host.removeEventListener("pointermove", this.onMove);
    host.removeEventListener("pointerleave", this.onLeave);
    host.removeEventListener("pointerdown", this.onDown);
    host.removeEventListener("pointerup", this.onUp);
    host.removeEventListener("pointercancel", this.onUp);
    host.style.cursor = "";
    for (const p of this.personajes) {
      p.activo?.ef.terminar?.(p.activo.ctx);
      p.picker.geometry.dispose();
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
      (p.reflejo?.material as THREE.Material | undefined)?.dispose();
      p.charco?.material.dispose();
      p.halo?.material.dispose();
    }
    if (this.foco) {
      this.scene.remove(this.foco);
      this.foco.material.dispose();
    }
    this.flashes.dispose();
    this.luz.dispose();
    this.materia.dispose();
    this.motas.points.geometry.dispose();
    this.motas.mat.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | undefined;
      if (mat && !Array.isArray(mat)) mat.dispose();
    });
    for (const t of this.texturas) t.dispose();
    this.renderer.dispose();
  }
}
