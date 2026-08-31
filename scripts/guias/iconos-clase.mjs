// Descarga los iconos de una clase a iconos/<clase>/ y deja su mapa.json
// Uso: node iconos-clase.mjs ranger
import fs from 'node:fs'

const CLASE = process.argv[2]
if (!CLASE) { console.error('uso: node iconos-clase.mjs <clase>'); process.exit(1) }

const LISTA = JSON.parse(fs.readFileSync(
  'c:/Users/Miguel/Desktop/CARPETAS/IMPERIUM/scripts/data/lista-skills.json', 'utf8'))
const skills = LISTA[CLASE]
if (!skills?.length) { console.error(`no tengo la lista de ${CLASE}`); process.exit(1) }

const BASE = 'https://cdn.questlog.gg/aion-2/assets/Game/UI/Resource/Texture/Skill/'
const DIR = `iconos/${CLASE}`
fs.mkdirSync(DIR, { recursive: true })

const mapa = {}
let ok = 0, fallos = 0
for (const { nombre, icono } of skills) {
  mapa[nombre] = icono
  const destino = `${DIR}/${icono}.webp`
  if (fs.existsSync(destino)) { ok++; continue }
  try {
    const r = await fetch(BASE + icono + '.webp', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!r.ok) { console.log(`  ${r.status} ${nombre}`); fallos++; continue }
    fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()))
    ok++
  } catch (e) { console.log(`  ${nombre}: ${e.message}`); fallos++ }
  await new Promise((r) => setTimeout(r, 110))
}
fs.writeFileSync(`${DIR}/mapa.json`, JSON.stringify(mapa, null, 1), 'utf8')
console.log(`${CLASE}: ${ok} iconos${fallos ? `, ${fallos} fallidos` : ''}`)
