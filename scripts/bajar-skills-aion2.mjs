// Baja el detalle de las habilidades de una clase de Aion 2 desde questlog.gg.
// La web las pinta con JavaScript, asi que hay que renderizarlas: se usa Firecrawl.
// Uso: node scripts/bajar-skills-aion2.mjs gladiator
import fs from 'node:fs'

const CLASE = process.argv[2] ?? 'gladiator'
const API = (process.env.FIRECRAWL_API_URL ?? 'https://api.firecrawl.dev').replace(/\/$/, '')
const CLAVE = process.env.FIRECRAWL_API_KEY
if (!CLAVE) { console.error('falta FIRECRAWL_API_KEY en el entorno'); process.exit(1) }

// La lista sale de scripts/data/lista-skills.json (la genera listar-skills-aion2.mjs).
// Gladiator se conserva escrito a mano porque se saco antes de tener ese fichero.
const LISTA = fs.existsSync('scripts/data/lista-skills.json')
  ? JSON.parse(fs.readFileSync('scripts/data/lista-skills.json', 'utf8'))
  : {}

const IDS = {
  gladiator: [
    ['11360000', 'Rush Strike'], ['11080000', 'Blade Toss'], ['11010000', 'Rending Blow'],
    ['11020000', 'Keen Strike'], ['11050000', 'Crushing Wave'], ['11240000', 'Wrath Wave'],
    ['11170000', 'Overhead Slam'], ['11190000', 'Leaping Slam'], ['11200000', 'Ankle Slice'],
    ['11100000', 'Ruinous Blow'], ['11390000', 'Rage Burst'], ['11400000', 'Lunge Stance'],
    ['11340000', 'Lifestealing Blade'], ['11290000', 'Mocking Blade'], ['11300000', 'Aerial Snare'],
    ['11250000', "Zikel's Blessing"], ['11280000', 'Sword Aura Rampage'], ['11450000', 'Fracturing Rush'],
    ['11700000', 'Assault Strike'], ['11260000', 'Defiance'], ['11110000', 'Focused Block'],
    ['11130000', 'Armor of Balance'], ['11410000', 'Wave Armor'], ['11380000', 'Tenaciousness'],
    ['11430000', 'Forced Restraint'],
    ['11710000', 'Survival Stance'], ['11720000', 'Protection Armor'], ['11730000', 'Blood Absorption'],
    ['11740000', 'Identify Weakness'], ['11750000', 'Attack Preparation'], ['11760000', 'Impact Hit'],
    ['11770000', 'Destructive Impulse'], ['11780000', 'Experienced Counterstrike'],
    ['11790000', 'Survival Willpower'], ['11800000', 'Murderous Burst'],
  ],
  ...Object.fromEntries(Object.entries(LISTA).map(([c, v]) => [c, v.map((s) => [s.id, s.nombre])])),
}
if (!IDS[CLASE]) { console.error(`no tengo la lista de ${CLASE}. Ejecuta antes listar-skills-aion2.mjs`); process.exit(1) }

// Cloudflare devuelve una pagina de bloqueo con 200: hay que reconocerla por el texto.
const BLOQUEADA = /security service to protect itself|Cloudflare Ray ID|Just a moment|Enable JavaScript and cookies/i

async function renderizar(url, proxy) {
  const r = await fetch(`${API}/v1/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLAVE}` },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true, waitFor: 4000, maxAge: 0, ...(proxy ? { proxy } : {}) }),
  })
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`)
  const j = await r.json()
  const md = j?.data?.markdown ?? j?.markdown ?? ''
  if (BLOQUEADA.test(md)) throw new Error('bloqueada por Cloudflare')
  return md
}

// Primero a lo normal; si nos bloquean, se reintenta en modo sigiloso y mas despacio.
async function conReintento(url, nombre) {
  try {
    return await renderizar(url)
  } catch (e) {
    if (!/Cloudflare/.test(e.message)) throw e
    for (const [intento, espera] of [[1, 3000], [2, 8000], [3, 15000]]) {
      await new Promise((r) => setTimeout(r, espera))
      try {
        const md = await renderizar(url, 'stealth')
        console.log(`   (${nombre} salio al intento sigiloso ${intento})`)
        return md
      } catch (e2) {
        if (intento === 3) throw e2
      }
    }
  }
}

// El markdown de questlog viene en bloques separados por "* * *".
function interpretar(md) {
  const lineas = md.split('\n').map((l) => l.trim()).filter(Boolean)
  const salida = { tipo: [], descripcion: null, stigmas: [], cooldown: null, alcance: null, arma: null }

  for (const t of ['Active', 'Passive', 'Physical', 'Magical', 'Rare', 'Epic']) {
    if (lineas.some((l) => l === t || l.startsWith(t) || l.endsWith(t))) salida.tipo.push(t)
  }

  // la descripcion es la linea de texto mas larga que no es una etiqueta ni una imagen
  const ETIQUETAS = /^(Back|Filters|Level|Specialty|Cooldown|Range|Required|Highlight|Clear|Text Color|Table|Columns|Rows|Cells|Delete|Post Comment|No comments|Login|Add |Merge|Split|Active|Passive|Physical|Magical|\d+$|\*|!\[|#|-)/
  const candidatas = lineas.filter((l) => !ETIQUETAS.test(l) && l.length > 40 && !l.startsWith('['))
  salida.descripcion = candidatas.sort((a, b) => b.length - a.length)[0] ?? null

  // stigmas: tras "Specialty", pares de (coste numerico) + (texto de la mejora)
  const iEsp = lineas.findIndex((l) => l === 'Specialty')
  if (iEsp > -1) {
    for (let i = iEsp + 1; i < lineas.length; i++) {
      const l = lineas[i]
      if (l === 'Cooldown' || l === 'Range' || l.startsWith('Required')) break
      if (/^\d{1,2}$/.test(l)) {
        const texto = lineas[i + 1]
        if (texto && !/^\d{1,2}$/.test(texto) && !texto.startsWith('![')) {
          salida.stigmas.push({ coste: Number(l), efecto: texto.replace(/^\\/, '') })
          i++
        }
      }
    }
  }

  const siguienteA = (etiqueta) => {
    const i = lineas.findIndex((l) => l === etiqueta)
    return i > -1 ? lineas[i + 1] : null
  }
  salida.cooldown = siguienteA('Cooldown')
  salida.alcance = siguienteA('Range')
  const iArma = lineas.findIndex((l) => l.startsWith('Required Weapon'))
  if (iArma > -1) salida.arma = lineas[iArma + 1]
  return salida
}

// Si ya hay descarga previa, solo se rehacen las que fallaron.
const RUTA = `scripts/data/skills-${CLASE}.json`
const previo = fs.existsSync(RUTA) ? JSON.parse(fs.readFileSync(RUTA, 'utf8')) : []
const yaBien = new Map(previo.filter((s) => s.descripcion && !BLOQUEADA.test(s.descripcion)).map((s) => [s.id, s]))
console.log(`${yaBien.size} habilidades ya estaban bien de una descarga anterior\n`)

fs.mkdirSync('scripts/data', { recursive: true })
const guardar = () => fs.writeFileSync(RUTA, JSON.stringify(salida, null, 1), 'utf8')

const salida = []
let ok = 0, fallos = []
for (const [id, nombre] of IDS[CLASE]) {
  const url = `https://questlog.gg/aion-2/en/db/skill/${id}`
  if (yaBien.has(id)) { salida.push(yaBien.get(id)); ok++; continue }
  try {
    const datos = interpretar(await conReintento(url, nombre))
    if (!datos.descripcion) throw new Error('la pagina no traia descripcion')
    salida.push({ id, nombre, ...datos, url })
    ok++
    console.log(`${nombre.padEnd(26)} ${(datos.cooldown ?? 'sin recarga').padEnd(12)} ${datos.stigmas.length} stigmas`)
  } catch (e) {
    console.log(`${nombre.padEnd(26)} FALLO: ${e.message}`)
    fallos.push(nombre)
    salida.push({ id, nombre, error: String(e.message), url })
  }
  guardar()                                // se guarda sobre la marcha, no al final
  await new Promise((r) => setTimeout(r, 1200))
}

guardar()
console.log(`\n${ok} de ${salida.length} habilidades bien -> ${RUTA}`)
if (fallos.length) console.log(`faltan: ${fallos.join(', ')}\n(relanza el script y reintentara solo esas)`)
