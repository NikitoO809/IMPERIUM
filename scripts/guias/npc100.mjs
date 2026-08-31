// ¿Cuantas habilidades aplican su estado al 100% contra PNJ? Si contra un PNJ
// ya entra siempre, las mejoras de "+X% de probabilidad" no valen nada en PvE.
import fs from 'node:fs'

const CLASES = ['gladiator', 'templar', 'assassin', 'ranger', 'sorcerer', 'elementalist', 'cleric', 'chanter']
const DIR = 'c:/Users/Miguel/Desktop/CARPETAS/IMPERIUM/scripts/data'
const limpio = (t) => (t ?? '').replace(/\\/g, '').replace(/\s+/g, ' ')

let conNpc100 = 0, totalConEstado = 0
const mejorasDeProbabilidad = []

for (const clase of CLASES) {
  const s = JSON.parse(fs.readFileSync(`${DIR}/skills-${clase}.json`, 'utf8')).filter((k) => k.descripcion)
  const npc = s.filter((k) => /100% chance to inflict .* on NPC/i.test(limpio(k.descripcion)))
  const conProb = s.filter((k) => /\d+% chance to inflict/i.test(limpio(k.descripcion)))
  conNpc100 += npc.length
  totalConEstado += conProb.length

  const prob = []
  for (const k of s) {
    for (const g of k.stigmas ?? []) {
      if (/\+\d+% (Knockdown|Stun|Root|Seal|Frost|Fear|Airborne|Status Effect|Polymorph) Chance/i.test(limpio(g.efecto))) {
        prob.push(`${k.nombre} nv.${g.coste} · ${limpio(g.efecto)}`)
      }
    }
  }
  mejorasDeProbabilidad.push([clase, prob])

  console.log(`${clase.padEnd(14)} ${String(npc.length).padStart(2)} habilidades con «100% en PNJ»   ` +
              `· ${String(prob.length).padStart(2)} mejoras que suben esa probabilidad`)
}

console.log('')
console.log(`En total: ${conNpc100} habilidades aplican su estado al 100% contra PNJ,`)
console.log(`de ${totalConEstado} que llevan probabilidad.`)
console.log('')
console.log('LAS MEJORAS QUE NO SIRVEN EN PvE (la probabilidad ya es 100% contra PNJ):')
for (const [clase, prob] of mejorasDeProbabilidad) {
  if (!prob.length) continue
  console.log(`\n  ${clase}:`)
  prob.forEach((l) => console.log('    ' + l))
}
