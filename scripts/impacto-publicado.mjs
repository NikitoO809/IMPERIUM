// Cruza las mejoras que estan PUBLICADAS en el reparto de una clase con los datos
// nuevos, y dice cuales siguen valiendo y cuales no.
// Uso: node scripts/impacto-publicado.mjs gladiator
import fs from 'node:fs'

const CLASE = (process.argv[2] ?? 'gladiator').toLowerCase()
const norm = (t) => (t ?? '').replace(/\\/g, '').replace(/\s+/g, ' ').trim().toLowerCase()

const publicado = JSON.parse(fs.readFileSync('scripts/guias/listas-negras.json', 'utf8'))[CLASE]
const nuevo = JSON.parse(fs.readFileSync(`scripts/data/skills-t-${CLASE}.json`, 'utf8'))

const porNombre = new Map()
for (const k of nuevo) {
  const antes = porNombre.get(k.nombre)
  if (!antes || (k.specialty?.length ?? 0) > (antes.specialty?.length ?? 0)) porNombre.set(k.nombre, k)
}

let bien = 0, nivel = 0, ido = 0
for (const grupo of ['inutilPve', 'valenSiempre', 'soloPvp']) {
  console.log(`\n--- ${grupo} (${publicado[grupo].length} publicadas) ---`)
  for (const m of publicado[grupo]) {
    const k = porNombre.get(m.habilidad)
    const igual = k?.specialty?.find((s) => norm(s.efecto) === norm(m.efecto))
    if (igual && igual.nivel === m.nivel) { console.log(`  ok      ${m.habilidad} nv.${m.nivel}`); bien++; continue }
    if (igual) { console.log(`  NIVEL   ${m.habilidad} nv.${m.nivel} -> nv.${igual.nivel}`); nivel++; continue }
    // quiza sigue existiendo con el texto cambiado
    const parecida = k?.specialty?.find((s) => s.nivel === m.nivel)
    console.log(`  YA NO   ${m.habilidad} nv.${m.nivel} — ${m.efecto.slice(0, 50)}`)
    if (parecida) console.log(`          en su lugar, nv.${parecida.nivel}: ${parecida.efecto.slice(0, 60)}`)
    ido++
  }
}
const total = bien + nivel + ido
console.log(`\n  ${bien} de ${total} publicadas siguen exactas`)
console.log(`  ${nivel} tienen mal el nivel`)
console.log(`  ${ido} ya no existen con ese texto`)
