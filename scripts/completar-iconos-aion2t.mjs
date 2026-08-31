// Completa iconos/<clase>/ con los iconos que falten, sacándolos de aion2t.com.
// Los iconos viejos venían de questlog y no cubren las habilidades que aquella
// base de datos no tenía (pasivas, encadenadas, DP).
//
// Uso: node scripts/completar-iconos-aion2t.mjs <Clase>   (desde la carpeta con iconos/)
import fs from 'node:fs'
import path from 'node:path'

const CLASE = (process.argv[2] ?? 'Gladiator')
const clase = CLASE.toLowerCase()
const API = (process.env.FIRECRAWL_API_URL ?? 'https://api.firecrawl.dev').replace(/\/$/, '')
const CLAVE = process.env.FIRECRAWL_API_KEY
if (!CLAVE) { console.error('falta FIRECRAWL_API_KEY en el entorno'); process.exit(1) }

const DIR = `iconos/${clase}`
const MAPA = `${DIR}/mapa.json`
if (!fs.existsSync(MAPA)) { console.error(`no existe ${MAPA}: ejecuta esto desde la carpeta con iconos/`); process.exit(1) }

const DATOS = `c:/Users/Miguel/Desktop/CARPETAS/IMPERIUM/scripts/data/skills-t-${clase}.json`
const skills = JSON.parse(fs.readFileSync(DATOS, 'utf8'))
const mapa = JSON.parse(fs.readFileSync(MAPA, 'utf8'))

// una ficha por nombre, y solo las que no tengan icono ya
const pendientes = new Map()
for (const k of skills) if (!mapa[k.nombre] && !pendientes.has(k.nombre)) pendientes.set(k.nombre, k.id)

if (!pendientes.size) { console.log(`${CLASE}: no falta ningún icono`); process.exit(0) }
console.log(`${CLASE}: faltan ${pendientes.size} iconos\n`)

let ok = 0
for (const [nombre, id] of pendientes) {
  try {
    const r = await fetch(`${API}/v1/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLAVE}` },
      body: JSON.stringify({ url: `https://aion2t.com/db/skills/${id}`, formats: ['markdown'], onlyMainContent: true, maxAge: 0 }),
    })
    const j = await r.json()
    const md = (j?.data ?? j)?.markdown ?? ''
    // el icono de la cabecera: ![Nombre](https://aion2t.com/db-item-icons/ICON_XXX.webp)
    const icono = md.match(/db-item-icons\/([A-Za-z0-9_]+)\.webp/)?.[1]
    if (!icono) { console.log(`  ${nombre}: la ficha no trae icono`); continue }

    mapa[nombre] = icono
    const destino = path.join(DIR, `${icono}.webp`)
    if (!fs.existsSync(destino)) {
      const img = await fetch(`https://aion2t.com/db-item-icons/${icono}.webp`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!img.ok) { console.log(`  ${nombre}: ${img.status} al bajar el .webp`); continue }
      fs.writeFileSync(destino, Buffer.from(await img.arrayBuffer()))
    }
    console.log(`  ok  ${nombre.padEnd(30)} ${icono}`)
    ok++
  } catch (e) {
    console.log(`  ${nombre}: ${e.message}`)
  }
  await new Promise((r) => setTimeout(r, 250))
}

fs.writeFileSync(MAPA, JSON.stringify(mapa, null, 1), 'utf8')
console.log(`\n${ok} de ${pendientes.size} añadidos a ${MAPA}`)
