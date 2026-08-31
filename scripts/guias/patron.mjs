// Busca en las ocho clases el mismo esqueleto: que estado aplica cada una,
// que habilidad exige ese estado, y quien devuelve mana.
import fs from 'node:fs'

const CLASES = ['gladiator', 'templar', 'assassin', 'ranger', 'sorcerer', 'elementalist', 'cleric', 'chanter']
const DIR = 'c:/Users/Miguel/Desktop/CARPETAS/IMPERIUM/scripts/data'
const limpio = (t) => (t ?? '').replace(/\\/g, '').replace(/\s+/g, ' ')

// "Deals X to a target afflicted with Knockdown" -> la habilidad exige ese estado
const EXIGE = /(?:target|enemy|enemies)\s+(?:afflicted with|with)\s+([A-Z][A-Za-z\- ]+?)(?:\s+within|\s+for|,|\.|$)/
const APLICA = /inflict\s+([A-Z][A-Za-z\- ]+?)(?:\s+for|\s+on|,|\.|$)/gi
const MANA = /[Rr]estores?\s+([\d,]+)\s*MP/

for (const clase of CLASES) {
  const s = JSON.parse(fs.readFileSync(`${DIR}/skills-${clase}.json`, 'utf8')).filter((k) => k.descripcion)
  const exigen = [], aplican = new Map(), mana = []

  for (const k of s) {
    const t = limpio(k.descripcion)
    const e = t.match(EXIGE)
    if (e && !/Incapacitated Immunity/.test(e[1])) {
      exigen.push(`${k.nombre} (${k.cooldown ?? 'sin recarga'}) → exige ${e[1].trim()}`)
    }
    for (const m of t.matchAll(APLICA)) {
      const estado = m[1].trim()
      if (estado.length < 20) {
        if (!aplican.has(estado)) aplican.set(estado, [])
        aplican.get(estado).push(k.nombre)
      }
    }
    const mp = t.match(MANA)
    if (mp && !k.cooldown) mana.push(`${k.nombre} (+${mp[1]} MP)`)
  }

  console.log(`\n━━━━━━━━ ${clase.toUpperCase()} ━━━━━━━━`)
  console.log('  EXIGEN un estado previo:')
  exigen.length ? exigen.forEach((l) => console.log(`    ${l}`)) : console.log('    (ninguna)')
  const top = [...aplican.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 4)
  console.log('  APLICAN estados:')
  top.forEach(([e, v]) => console.log(`    ${e.padEnd(14)} ×${v.length}   ${v.slice(0, 4).join(', ')}`))
  console.log(`  DEVUELVEN maná sin recarga: ${mana.join(', ') || '(ninguna)'}`)
}
