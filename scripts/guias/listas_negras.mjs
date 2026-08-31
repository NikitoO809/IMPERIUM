// Clasifica las mejoras de cada clase para el reparto PvE/PvP.
//
// Separa MASTERY de STIGMA porque no funcionan igual y el consejo no es el mismo:
//   Mastery — mejoras a nivel 8/12/16, sube a 40, y solo puedes poner TRES: eliges.
//   Stigma  — mejoras a nivel 5/10/15/20/25, sube a 25, y se queda con TODAS las
//             que haya desbloqueado: no eliges mejora, decides hasta donde subirla.
//
// Uso: node scripts/guias/listas_negras.mjs
import fs from 'node:fs'
import path from 'node:path'

const AQUI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const DATOS = path.join(AQUI, '..', 'data')
const CLASES = ['gladiator', 'templar', 'assassin', 'ranger', 'sorcerer', 'elementalist', 'cleric', 'chanter']

const PLACEHOLDER = /\{[a-z]+:[^}]*\}/gi
const limpio = (t) => (t ?? '').replace(/\\/g, '').replace(PLACEHOLDER, '?').replace(/\s+/g, ' ').trim()

// --- lo que decide en que cajon cae cada mejora, segun el texto del propio juego
const PROBABILIDAD = /\+\d+% (Knockdown|Stun|Root|Seal|Frost|Fear|Airborne|Status Effect|Polymorph|Slow) Chance/i
const AMBOS = /PvE Damage (Boost|Tolerance).*PvP Damage (Boost|Tolerance)|PvE.*and \+?\d.*PvP/i
const IGNORA = /Ignores Block and Evasion/i
const ESCUDO = /breaks? Protective Shield/i
const CURA_RIVAL = /-\d+% Incoming Heal|Incoming Heal reduction/i
const SOLO_PC = /to players|PC targets?/i
const CURA_PROPIA = /\+\d+% Incoming Heal/i

const motivoPvp = (t) => {
  if (IGNORA.test(t)) return 'ignora bloqueo y evasión'
  if (ESCUDO.test(t)) return 'rompe escudos'
  if (CURA_RIVAL.test(t)) return 'le baja la curación al rival'
  if (SOLO_PC.test(t)) return 'solo afecta a jugadores'
  return null
}

// Devuelve el cajon de una mejora, o 'otra' si no cae en ninguno de los tres.
function clasificar(t) {
  if (PROBABILIDAD.test(t)) return { tipo: 'inutilPve' }
  if (AMBOS.test(t)) return { tipo: 'valenSiempre' }
  if (CURA_PROPIA.test(t) && !CURA_RIVAL.test(t)) return { tipo: 'otra' }  // vale en los dos modos
  const motivo = motivoPvp(t)
  return motivo ? { tipo: 'soloPvp', motivo } : { tipo: 'otra' }
}

// aion2t repite ids con variantes: nos quedamos con la ficha que trae mejoras
function fichas(clase) {
  const f = path.join(DATOS, `skills-t-${clase}.json`)
  if (!fs.existsSync(f)) return null
  const m = new Map()
  for (const k of JSON.parse(fs.readFileSync(f, 'utf8'))) {
    const antes = m.get(k.nombre)
    if (!antes || (k.specialty?.length ?? 0) > (antes.specialty?.length ?? 0)) m.set(k.nombre, k)
  }
  return [...m.values()].filter((k) => k.specialty?.length)
}

const salida = {}
const faltan = []
for (const clase of CLASES) {
  const ks = fichas(clase)
  if (!ks) { faltan.push(clase); continue }

  const mastery = { inutilPve: [], valenSiempre: [], soloPvp: [] }
  const stigma = []
  let huecos = 0

  for (const k of ks) {
    const mejoras = k.specialty.map((s) => {
      const efecto = limpio(s.efecto)
      if (efecto.includes('?')) huecos++
      return { nivel: s.nivel, efecto, ...clasificar(efecto) }
    })

    if (k.arbol === 'Stigma') {
      // la Stigma se queda con todas: interesa la escalera entera, no una mejora suelta
      if (mejoras.some((m) => m.tipo !== 'otra')) {
        stigma.push({
          habilidad: k.nombre,
          nivelRequerido: k.nivelRequerido,
          puntosStigma: k.puntosStigma,
          maxNivel: k.maxNivel,
          mejoras,
        })
      }
      continue
    }

    // Mastery: cada mejora compite por una de las tres ranuras
    for (const m of mejoras) {
      if (m.tipo === 'otra') continue
      mastery[m.tipo].push({ habilidad: k.nombre, nivel: m.nivel, efecto: m.efecto, ...(m.motivo ? { motivo: m.motivo } : {}) })
    }
  }

  salida[clase] = { mastery, stigma }
  const nM = mastery.inutilPve.length + mastery.valenSiempre.length + mastery.soloPvp.length
  console.log(`${clase.padEnd(14)} Mastery: ${String(mastery.inutilPve.length).padStart(2)} inútiles en PvE · ` +
              `${String(mastery.valenSiempre.length).padStart(2)} siempre · ${String(mastery.soloPvp.length).padStart(2)} PvP ` +
              `(${nM}) · Stigma: ${String(stigma.length).padStart(2)} habilidades` +
              (huecos ? `  (${huecos} sin cifra)` : ''))
}

if (faltan.length) {
  console.log(`\nfaltan datos de: ${faltan.join(', ')}`)
  console.log('bájalos con: node scripts/bajar-skills-aion2t.mjs <Clase>')
}
if (Object.keys(salida).length) {
  fs.writeFileSync(path.join(AQUI, 'listas-negras.json'), JSON.stringify(salida, null, 1), 'utf8')
  console.log('\nlistas-negras.json escrito')
}
