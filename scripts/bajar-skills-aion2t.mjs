// Baja las habilidades de una clase desde aion2t.com, que publica el volcado del
// cliente del juego y trae la fecha de ese volcado en cada ficha.
//
// Sustituye a bajar-skills-aion2.mjs (questlog.gg), que se quedo en la version
// coreana anterior al lanzamiento: ver LEEME de scripts/guias.
//
// Uso: node scripts/bajar-skills-aion2t.mjs Gladiator
import fs from 'node:fs'

const CLASE = process.argv[2] ?? 'Gladiator'
const API = (process.env.FIRECRAWL_API_URL ?? 'https://api.firecrawl.dev').replace(/\/$/, '')
const CLAVE = process.env.FIRECRAWL_API_KEY
if (!CLAVE) { console.error('falta FIRECRAWL_API_KEY en el entorno'); process.exit(1) }

const SALIDA = `scripts/data/skills-t-${CLASE.toLowerCase()}.json`

async function pedir(url, formats) {
  for (let intento = 1; intento <= 4; intento++) {
    try {
      const r = await fetch(`${API}/v1/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLAVE}` },
        body: JSON.stringify({ url, formats, onlyMainContent: true, maxAge: 0 }),
      })
      if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 120)}`)
      const j = await r.json()
      return j?.data ?? j
    } catch (e) {
      if (intento === 4) throw e
      await new Promise((res) => setTimeout(res, intento * 2500))
    }
  }
}

// ---- 1. los ids de la clase, del listado
const listado = await pedir(`https://aion2t.com/db/skills?class=${CLASE}`, ['links'])
const ids = [...new Set((listado.links ?? [])
  .map((l) => l.match(/\/db\/skills\/(\d+)$/)?.[1])
  .filter(Boolean))]
if (!ids.length) { console.error('el listado no devolvio ninguna habilidad'); process.exit(1) }
console.log(`${CLASE}: ${ids.length} habilidades\n`)

// ---- 2. parseo de una ficha
const limpiar = (t) => t
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')          // imagenes
  .replace(/\[\\?\[([^\]]+?)\\?\]\]\([^)]*\)/g, '[$1]')  // [[Nombre]](url) -> [Nombre]
  .replace(/\[([^\]]+?)\]\([^)]*\)/g, '$1')      // resto de enlaces
  .replace(/\\/g, '')
  .replace(/\s+/g, ' ')
  .trim()

// El markdown pega el nivel al efecto ("Level 10500 MP damage on hit"), asi que hay
// que separarlos: las ranuras solo se abren a estos niveles, y de todos los prefijos
// numericos posibles solo uno es uno de ellos.
const NIVELES = new Set([5, 8, 10, 12, 15, 16, 20, 25, 30, 35, 40])

function partirNivel(t) {
  const digitos = t.match(/^(\d+)/)?.[1]
  if (!digitos) return null
  for (let n = digitos.length; n >= 1; n--) {
    const nivel = Number(digitos.slice(0, n))
    if (NIVELES.has(nivel)) return { nivel, efecto: t.slice(n) }
  }
  return null
}

function parsear(md, id) {
  const nombre = md.match(/\n([^\n]+)\n={3,}/)?.[1]?.trim() ?? ''
  const cab = md.match(/={3,}\n\n([^\n]+)/)?.[1] ?? ''
  const requerido = Number(cab.match(/Required level (\d+)/)?.[1] ?? 0) || null
  const maxNivel = Number(md.match(/Max\s*(\d+)/)?.[1] ?? 0) || null

  // la descripcion va entre la linea de Cooldown/Damage y la seccion Specialty
  const cuerpo = md.split(/\nSpecialty\n-+/)[0]
  // se limpia ANTES de medir: si no, la linea de la imagen pasa por descripcion
  const trozos = cuerpo.split('\n\n').map(limpiar).filter(Boolean)
  const descripcion = trozos.find((t) => t.length > 60 && !/^(Level|Damage|Cooldown|Max)/.test(t)) ?? ''

  const specialty = []
  // entre Specialty y la siguiente seccion, que puede ser Chain o Details
  const seccion = md.split(/\nSpecialty\n-+/)[1]?.split(/\n(?:Details|Chain)\n-+/)[0] ?? ''
  for (const trozo of seccion.split(/!\[\]\(/).slice(1)) {
    const m = trozo.match(/\)Level (\d+[\s\S]*)/)
    if (!m) continue
    const p = partirNivel(m[1])
    if (p) specialty.push({ nivel: p.nivel, efecto: limpiar(p.efecto) })
  }

  // Mastery y Stigma NO funcionan igual: la Mastery sube a 40 y solo deja poner
  // tres mejoras (ranuras a nivel 8, 12 y 20); la Stigma sube a 25 y se queda con
  // TODAS las que haya desbloqueado, a niveles 5/10/15/20/25.
  const arbol = /·\s*Stigma\s*·/.test(cab) ? 'Stigma' : /·\s*Mastery\s*·/.test(cab) ? 'Mastery' : ''

  return {
    id,
    nombre,
    clase: cab.match(/^([A-Za-z]+?)(?=Active|Passive|Stigma|Dp|$)/)?.[1] ?? '',
    arbol,
    eligeTres: arbol === 'Mastery',
    tipo: md.match(/\nType([A-Za-z]+)/)?.[1] ?? (/Passive/.test(cab) ? 'Passive' : /Active/.test(cab) ? 'Active' : ''),
    puntosStigma: Number(md.match(/Stigma points\s*(\d+)/)?.[1] ?? 0) || null,
    nivelRequerido: requerido,
    maxNivel,
    descripcion,
    dano: md.match(/Damage(\d[\d,]*)/)?.[1] ?? null,
    cooldown: md.match(/Cooldown([\d.]+s)/)?.[1] ?? null,
    alcance: md.match(/Range(\d+ m)/)?.[1] ?? null,
    arma: md.match(/Weapon([A-Za-z ]+?)(?:Max|Range|$)/)?.[1]?.trim() ?? null,
    specialty,
    volcado: md.match(/Game client · (\d{2}\.\d{2}\.\d{4})/)?.[1] ?? null,
    url: `https://aion2t.com/db/skills/${id}`,
  }
}

// ---- 3. una a una
const salida = []
let fallos = 0
for (const [i, id] of ids.entries()) {
  try {
    const d = await pedir(`https://aion2t.com/db/skills/${id}`, ['markdown'])
    const k = parsear(d.markdown ?? '', id)
    if (!k.nombre) throw new Error('sin nombre: la ficha no se pudo leer')
    salida.push(k)
    console.log(`  ${String(i + 1).padStart(3)}/${ids.length}  ${k.nombre.padEnd(28)} ${(k.arbol || "-").padEnd(8)} ${k.specialty.length} mejoras`)
  } catch (e) {
    console.log(`  ${String(i + 1).padStart(3)}/${ids.length}  ${id}  FALLO: ${e.message}`)
    fallos++
  }
  await new Promise((r) => setTimeout(r, 250))
}

fs.writeFileSync(SALIDA, JSON.stringify(salida, null, 1), 'utf8')
const fechas = [...new Set(salida.map((k) => k.volcado).filter(Boolean))]
console.log(`\n${salida.length} habilidades en ${SALIDA}${fallos ? ` · ${fallos} fallos` : ''}`)
console.log(`volcado del cliente: ${fechas.join(', ') || 'sin fecha'}`)
