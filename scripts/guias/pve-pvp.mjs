// Separa, con los datos del juego, que mejoras de cada clase sirven en PvE y
// cuales en PvP. No es opinion: se mira lo que dice cada mejora.
import fs from 'node:fs'

const CLASES = ['gladiator', 'templar', 'assassin', 'ranger', 'sorcerer', 'elementalist', 'cleric', 'chanter']
const DIR = 'c:/Users/Miguel/Desktop/CARPETAS/IMPERIUM/scripts/data'
const limpio = (t) => (t ?? '').replace(/\\/g, '').replace(/\s+/g, ' ').trim()

// Lo que marca un efecto como de un modo u otro, segun el propio texto del juego
const SOLO_PVE = /PvE Damage (Boost|Tolerance)|on NPC targets?|NPC target/i
const SOLO_PVP = /PvP Damage (Boost|Tolerance)|PC target|if the target is a player|to players/i
// Lo que vale en PvP porque afecta a lo que hace un jugador
const UTIL_PVP = /Ignores Block and Evasion|Seal|Silence|Stun|Root|Knockdown|Airborne|Fear|Incoming Heal|Move Speed|Protective Shield/i

for (const clase of CLASES) {
  const s = JSON.parse(fs.readFileSync(`${DIR}/skills-${clase}.json`, 'utf8')).filter((k) => k.descripcion)
  const pve = [], pvp = [], ambos = []

  for (const k of s) {
    for (const g of k.stigmas ?? []) {
      const t = limpio(g.efecto)
      const esPve = SOLO_PVE.test(t)
      const esPvp = SOLO_PVP.test(t)
      const fila = `${k.nombre} nv.${g.coste} · ${t}`
      if (esPve && esPvp) ambos.push(fila)
      else if (esPve) pve.push(fila)
      else if (esPvp || UTIL_PVP.test(t)) pvp.push(fila)
    }
  }

  console.log(`\n━━━━━━━ ${clase.toUpperCase()} ━━━━━━━`)
  console.log(`  SOLO PvE (${pve.length}):`)
  pve.slice(0, 6).forEach((l) => console.log('    ' + l))
  console.log(`  MEJOR EN PvP (${pvp.length}):`)
  pvp.slice(0, 8).forEach((l) => console.log('    ' + l))
  if (ambos.length) {
    console.log(`  SUBEN LAS DOS (${ambos.length}):`)
    ambos.slice(0, 4).forEach((l) => console.log('    ' + l))
  }
}
