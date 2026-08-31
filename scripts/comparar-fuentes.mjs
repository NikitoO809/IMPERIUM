// Compara lo que teniamos de questlog.gg con lo que dice aion2t.com (volcado del
// cliente) para una clase, y lista lo que cambia.
// Uso: node scripts/comparar-fuentes.mjs gladiator
import fs from 'node:fs'

const CLASE = (process.argv[2] ?? 'gladiator').toLowerCase()
const VIEJO = `scripts/data/skills-${CLASE}.json`
const NUEVO = `scripts/data/skills-t-${CLASE}.json`
for (const f of [VIEJO, NUEVO]) if (!fs.existsSync(f)) { console.error(`falta ${f}`); process.exit(1) }

const norm = (t) => (t ?? '').replace(/\\/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
const viejo = JSON.parse(fs.readFileSync(VIEJO, 'utf8'))
const nuevo = JSON.parse(fs.readFileSync(NUEVO, 'utf8'))

// aion2t repite ids con variantes: nos quedamos con la ficha que trae mejoras
const porNombre = new Map()
for (const k of nuevo) {
  const antes = porNombre.get(k.nombre)
  if (!antes || (k.specialty?.length ?? 0) > (antes.specialty?.length ?? 0)) porNombre.set(k.nombre, k)
}

let nivelesMal = 0, efectosNuevos = 0, efectosIdos = 0, sinFicha = 0, descrDistinta = 0
const filas = []

for (const v of viejo) {
  if (!v.stigmas?.length) continue
  const n = porNombre.get(v.nombre)
  if (!n) { console.log(`  ?  ${v.nombre}: no aparece en la fuente nueva`); sinFicha++; continue }

  const nuevas = n.specialty ?? []
  const usadas = new Set()
  const cambios = []

  for (const s of v.stigmas) {
    const i = nuevas.findIndex((x, j) => !usadas.has(j) && norm(x.efecto) === norm(s.efecto))
    if (i >= 0) {
      usadas.add(i)
      if (nuevas[i].nivel !== s.coste) {
        cambios.push(`     NIVEL  nv.${s.coste} -> nv.${nuevas[i].nivel}   ${s.efecto.replace(/\\/g, '').slice(0, 62)}`)
        nivelesMal++
      }
      continue
    }
    cambios.push(`     YA NO  nv.${s.coste}   ${s.efecto.replace(/\\/g, '').slice(0, 62)}`)
    efectosIdos++
  }
  nuevas.forEach((x, j) => {
    if (usadas.has(j)) return
    cambios.push(`     NUEVA  nv.${x.nivel}   ${x.efecto.slice(0, 62)}`)
    efectosNuevos++
  })

  const dv = norm(v.descripcion), dn = norm(n.descripcion)
  if (dv && dn && dv !== dn) {
    cambios.push(`     TEXTO  antes: ${v.descripcion.replace(/\\/g, '').slice(0, 90)}`)
    cambios.push(`            ahora: ${n.descripcion.slice(0, 90)}`)
    descrDistinta++
  }
  if (cambios.length) filas.push(`\n  ${v.nombre}`, ...cambios)
}

console.log(`=== ${CLASE.toUpperCase()}: ${viejo.length} habilidades antes · ${porNombre.size} ahora ===`)
filas.forEach((f) => console.log(f))
console.log(`\n  ${nivelesMal} mejoras cambian de nivel`)
console.log(`  ${efectosIdos} mejoras que teniamos y ya no estan`)
console.log(`  ${efectosNuevos} mejoras nuevas que no teniamos`)
console.log(`  ${descrDistinta} descripciones distintas`)
console.log(`  ${sinFicha} habilidades sin ficha en la fuente nueva`)
