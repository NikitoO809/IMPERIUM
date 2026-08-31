// Vuelca los datos de una clase de forma legible para poder analizarla.
// Uso: node analizar.mjs sorcerer [activas|pasivas|todo]
import fs from 'node:fs'

const clase = process.argv[2]
const filtro = process.argv[3] ?? 'todo'
const s = JSON.parse(fs.readFileSync(
  `c:/Users/Miguel/Desktop/CARPETAS/IMPERIUM/scripts/data/skills-${clase}.json`, 'utf8'))

const limpio = (t) => (t ?? '').replace(/\\/g, '').replace(/\s+/g, ' ').trim()
const esPasiva = (k) => (k.tipo ?? []).includes('Passive') || k.id.slice(2, 4) >= '70'

const lista = s.filter((k) => k.descripcion)
  .filter((k) => filtro === 'todo' || (filtro === 'pasivas' ? esPasiva(k) : !esPasiva(k)))

for (const k of lista) {
  const meta = [k.cooldown, k.alcance, k.mp && `${k.mp} MP`].filter(Boolean).join(' · ')
  console.log(`\n${k.nombre}${meta ? `   [${meta}]` : '   [sin recarga]'}`)
  console.log(`   ${limpio(k.descripcion).slice(0, 240)}`)
  for (const g of k.stigmas ?? []) console.log(`     ${String(g.coste).padStart(2)}p  ${limpio(g.efecto)}`)
}

const faltan = s.filter((k) => !k.descripcion).map((k) => k.nombre)
console.log(`\n──── ${lista.length} mostradas de ${s.length}`)
if (faltan.length) console.log(`faltan por bajar: ${faltan.join(', ')}`)
