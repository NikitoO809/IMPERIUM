// Contrasta los datos de aion2t.com con una SEGUNDA base de datos independiente
// (aion2pb.com), habilidad por habilidad. Sirve para las clases que no podemos
// comprobar con capturas del juego: si dos fuentes que no se copian coinciden,
// el dato se sostiene solo.
//
// Uso: node scripts/contrastar-fuentes.mjs <clase> [cuantas]
import fs from 'node:fs'

const CLASE = (process.argv[2] ?? 'cleric').toLowerCase()
const TOPE = Number(process.argv[3] ?? 0) || Infinity
const API = (process.env.FIRECRAWL_API_URL ?? 'https://api.firecrawl.dev').replace(/\/$/, '')
const CLAVE = process.env.FIRECRAWL_API_KEY
if (!CLAVE) { console.error('falta FIRECRAWL_API_KEY en el entorno'); process.exit(1) }

// Las dos fuentes escriben lo mismo de forma distinta: «1,000» / «1000»,
// «5 sec» / «5s», «1 min» / «60s». Se igualan aquí para que solo salten las
// diferencias que son de contenido.
const norm = (t) => (t ?? '').split('\\').join('')
  .replace(/\s+/g, ' ')
  .replace(/(\d),(\d{3})/g, '$1$2')       // 1,000 -> 1000
  .replace(/\b(\d+)\s*min\b/g, (_, n) => `${n * 60}s`)
  .replace(/\bsec\b/g, 's')
  .replace(/(\d)\s+s\b/g, '$1s')
  .replace(/[.,]$/, '')
  .trim().toLowerCase()

const skills = JSON.parse(fs.readFileSync(`scripts/data/skills-t-${CLASE}.json`, 'utf8'))
const porNombre = new Map()
for (const k of skills) {
  const antes = porNombre.get(k.nombre)
  if (!antes || k.specialty.length > antes.specialty.length) porNombre.set(k.nombre, k)
}
const lista = [...porNombre.values()].filter((k) => k.specialty.length).slice(0, TOPE)
console.log(`${CLASE}: contrastando ${lista.length} habilidades con aion2pb.com\n`)

let iguales = 0, distintas = 0, sinFicha = 0
for (const k of lista) {
  let md = ''
  try {
    const r = await fetch(`${API}/v1/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLAVE}` },
      body: JSON.stringify({ url: `https://www.aion2pb.com/skills/${k.id}`, formats: ['markdown'], onlyMainContent: true, maxAge: 0 }),
    })
    md = ((await r.json())?.data ?? {}).markdown ?? ''
  } catch (e) {
    console.log(`  ?  ${k.nombre}: ${e.message}`); sinFicha++; continue
  }
  if (!md.includes(k.nombre)) { console.log(`  ?  ${k.nombre}: no aparece en la otra base`); sinFicha++; continue }

  // las mejoras de la otra fuente: "Lv5 +20% Attack for 5 sec on hit"
  const otras = [...md.matchAll(/Lv(\d+)\s+([^\n!]+)/g)].map((m) => ({ nivel: Number(m[1]), efecto: m[2].trim() }))
  const fallos = []

  for (const s of k.specialty) {
    const igual = otras.find((o) => o.nivel === s.nivel && norm(o.efecto) === norm(s.efecto))
    if (igual) continue
    const mismoNivel = otras.filter((o) => o.nivel === s.nivel)
    fallos.push(mismoNivel.length
      ? `nv.${s.nivel}  aion2t: «${s.efecto}»  ·  aion2pb: «${mismoNivel.map((o) => o.efecto).join(' / ')}»`
      : `nv.${s.nivel}  aion2t la tiene y aion2pb no: «${s.efecto}»`)
  }

  if (!fallos.length) { iguales++; console.log(`  ok  ${k.nombre}`); continue }
  distintas++
  console.log(`  >>  ${k.nombre}`)
  fallos.forEach((f) => console.log(`        ${f}`))
  await new Promise((r) => setTimeout(r, 200))
}

console.log(`\n${iguales} habilidades idénticas en las dos fuentes · ${distintas} con diferencias · ${sinFicha} sin comprobar`)
