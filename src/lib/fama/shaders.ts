// Shaders de las Leyendas: cada personaje es un plano subdividido con su
// render recortado encima. El VERTEX shader le da vida (respiración, peso de
// un pie a otro, telas al viento, relieve a partir del mapa de distancia y el
// gesto del ratón) y el FRAGMENT lo ilumina como si fuera una figura con
// volumen: luz clave que sigue al ratón, brillo metálico y luz de borde.
//
// Convenciones: el plano mide `H` de alto con los pies en y = 0; uv.y = 0 en
// los pies y 1 en la coronilla. Las anclas llegan ya en coordenadas locales.

export const ALTO_LEYENDA = 2.0;

// Gestos del cuerpo (uKind). El resto del gesto (partículas, destellos) lo
// pone efectos.ts desde JavaScript.
export const GESTO = {
  ninguno: 0,
  levantar: 1, // gira la zona del arma alrededor del pivote (la punta sube)
  paso: 2,     // un paso al frente, hacia la cámara
  viento: 3,   // se inclina contra la ráfaga (uWind manda en las telas)
  retroceso: 4, // culatazo: se echa atrás y tiembla
  pulso: 5,    // se hincha un poco, como si tomara aire
  florete: 6,  // giro de hombros y vuelta
} as const;

export const VERTEX = /* glsl */ `
uniform float uTime, uSeed, uHover, uHoverT, uRelief, uWind, uAngulo, uRadio, uVuelo;
uniform int uKind;
uniform vec2 uPivot, uTip;
uniform sampler2D uRelieve;
varying vec2 vUv;

const float PI = 3.14159265;
const float H = ${ALTO_LEYENDA.toFixed(1)};

void main() {
  vUv = uv;
  vec3 p = position;
  float t = uTime + uSeed * 37.0;

  // respiración: el torso sube y se ensancha un pelín
  float torso = smoothstep(0.38, 0.55, uv.y) * (1.0 - smoothstep(0.82, 0.95, uv.y));
  float breath = 0.5 + 0.5 * sin(t * 1.7);
  p.y += torso * breath * 0.010 * H;
  p.x += p.x * torso * breath * 0.012;

  // balanceo de peso: giro leve sobre los pies
  p.x += p.y * sin(t * 0.55) * 0.006;

  // telas: ondean entre rodilla y cintura; con viento, mucho más
  float viento = 1.0 + uWind * 4.0;
  float tela = smoothstep(0.03, 0.2, uv.y) * (1.0 - smoothstep(0.35, 0.6, uv.y));
  p.x += tela * sin(t * 2.1 + uv.y * 8.0 + uv.x * 3.0) * 0.006 * H * viento;
  p.z += tela * cos(t * 1.6 + uv.x * 6.0) * 0.008 * H * viento;

  // pelo y capa alta: un poco de vida arriba
  float alto = smoothstep(0.7, 0.95, uv.y);
  p.x += alto * sin(t * 1.3 + uv.x * 4.0) * 0.004 * H * viento;

  // los que vuelan: aleteo lento (los tercios exteriores de la imagen, de
  // la cintura hacia arriba, suben y bajan) y las telas ondean más.
  // El aleteo se mantiene CORTO aunque el gesto sople viento: pasado un
  // punto la figura deja de leerse como un ala y se ve como una imagen
  // estirada.
  if (uVuelo > 0.5) {
    float lado = abs(uv.x - 0.5) * 2.0;
    float ala = smoothstep(0.2, 0.95, lado) * smoothstep(0.3, 0.7, uv.y);
    float bat = sin(t * 2.2);
    p.y += ala * ala * bat * 0.075 * H * (1.0 + uWind * 0.7);
    p.z -= ala * (0.5 + 0.5 * bat) * 0.05 * H;
    p.x += tela * sin(t * 3.0 + uv.y * 10.0) * 0.008 * H;
  }

  // relieve: volumen a partir del mapa de distancia al borde
  float d = texture2D(uRelieve, uv).r;
  p.z += d * uRelief;

  // ── gesto del ratón ──
  if (uHoverT >= 0.0) {
    float k = sin(PI * uHoverT);
    if (uKind == 1) {
      // gira la zona del arma (cápsula pivote→punta) alrededor del pivote
      vec2 ab = uTip - uPivot;
      vec2 ap = p.xy - uPivot;
      float h = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
      float dist = length(ap - ab * h);
      float wgt = 1.0 - smoothstep(uRadio * 0.5, uRadio, dist);
      wgt *= smoothstep(-0.05, 0.3, h);
      float ang = uAngulo * k * wgt;
      float s = sin(ang), c = cos(ang);
      p.xy = uPivot + vec2(c * ap.x - s * ap.y, s * ap.x + c * ap.y);
    } else if (uKind == 2) {
      p.z += k * 0.35 * smoothstep(0.0, 0.3, uv.y);
      p.xy *= 1.0 + 0.025 * k;
    } else if (uKind == 3) {
      p.x += uv.y * 0.05 * uWind;
    } else if (uKind == 4) {
      float kk = k * k;
      p.z -= kk * 0.28 * uv.y;
      p.x += sin(uHoverT * 70.0) * 0.006 * (1.0 - uHoverT) * uv.y;
    } else if (uKind == 5) {
      p.x *= 1.0 + 0.03 * k;
      p.y *= 1.0 + 0.015 * k;
    } else if (uKind == 6) {
      float g = sin(2.0 * PI * uHoverT) * (1.0 - uHoverT);
      p.x += (uv.y - 0.35) * 0.12 * g;
      p.z += smoothstep(0.3, 1.0, uv.y) * 0.08 * k;
    }
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const FRAGMENT = /* glsl */ `
uniform sampler2D uMap, uRelieve;
uniform vec2 uTexel;
uniform vec3 uColor, uLightDir, uKeyColor;
uniform float uHover, uTime, uDim, uFade, uOculto;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
#ifdef REFLEJO
  // el reflejo tiembla como sobre agua quieta
  uv.x += (sin(uv.y * 55.0 + uTime * 2.2) * 0.0045 + sin(uv.y * 23.0 - uTime * 1.3) * 0.002) * uv.y;
#endif
  vec4 c = texture2D(uMap, uv);
  if (c.a < 0.03) discard;

  // normal a partir del relieve → luz clave, brillo metálico y borde
  float d  = texture2D(uRelieve, uv).r;
  float dx = texture2D(uRelieve, uv + vec2(uTexel.x, 0.0)).r - texture2D(uRelieve, uv - vec2(uTexel.x, 0.0)).r;
  float dy = texture2D(uRelieve, uv + vec2(0.0, uTexel.y)).r - texture2D(uRelieve, uv - vec2(0.0, uTexel.y)).r;
  vec3 n = normalize(vec3(-dx * 6.0, -dy * 6.0, 1.0));
  vec3 L = normalize(uLightDir);
  float diff = max(dot(n, L), 0.0);

  vec3 col = c.rgb;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float sat = max(col.r, max(col.g, col.b)) - min(col.r, min(col.g, col.b));
  float metal = smoothstep(0.35, 0.8, lum) * (1.0 - smoothstep(0.15, 0.5, sat));
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 28.0);

  col *= 0.86 + 0.28 * diff;
  col += uKeyColor * spec * (0.22 + 0.5 * metal);

  // luz de borde: pegada a la silueta (d → 0), del lado de la luz;
  // al pasar el ratón rodea toda la figura con el color del gesto
  float rim = pow(1.0 - d, 5.0);
  float lado = max(dot(normalize(n.xy + 1e-4), L.xy), 0.0);
  float rimL = rim * mix(0.25 + 0.75 * lado, 1.0, uHover);
  col += mix(vec3(1.0, 0.86, 0.58), uColor, uHover) * rimL * (0.22 + 0.95 * uHover);
  col *= uDim;

  // uOculto: un gesto puede hacer que la figura se desvanezca un instante
  float a = c.a * uFade * (1.0 - uOculto);
#ifdef REFLEJO
  col *= 0.5;
  a *= (1.0 - smoothstep(0.0, 0.5, uv.y)) * 0.6;
#endif
  gl_FragColor = vec4(col, a);
}
`;
