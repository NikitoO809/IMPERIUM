// Saca el icono y el nombre coreano de cada habilidad de una clase, desde
// aion2t.com (volcado del cliente del juego).
//
// El manual nombra las skills en coreano, y ese es el unico nombre que casa
// entre fuentes: el ingles de aion2t no coincide con el que usan las guias
// coreanas (검기난무 alli es "Sword Aura Rampage" y en la guia "Danza de filos").
// Por eso el mapa se guarda con el coreano como clave.
//
// Uso: node scripts/iconos-aion2.mjs Gladiator
import fs from 'node:fs'

const CLASE = process.argv[2] ?? 'Gladiator'
const clase = CLASE.toLowerCase()
const ENTRADA = `scripts/data/skills-t-${clase}.json`
const SALIDA = `scripts/data/iconos-${clase}.json`

if (!fs.existsSync(ENTRADA)) {
  console.error(`no existe ${ENTRADA}`)
  process.exit(1)
}

const skills = JSON.parse(fs.readFileSync(ENTRADA, 'utf8'))
const ids = [...new Set(skills.map((s) => s.id))]
console.log(`${CLASE}: ${ids.length} habilidades`)

async function ficha(id) {
  for (let intento = 1; intento <= 3; intento++) {
    try {
      const r = await fetch(`https://aion2t.com/ko/db/skills/${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      })
      if (!r.ok) throw new Error(String(r.status))
      const html = await r.text()
      // <title>칼날 화무 — 아이온 2 검성 스킬 | Aion2t.com</title>
      const ko = html.match(/<title>([^<—|]+)/)?.[1]?.trim() ?? null
      const icono = html.match(/db-item-icons\/([A-Za-z0-9_]+\.webp)/)?.[1] ?? null
      return { ko, icono }
    } catch (e) {
      if (intento === 3) return { ko: null, icono: null, error: String(e) }
      await new Promise((res) => setTimeout(res, intento * 1500))
    }
  }
}

const mapa = {}
let n = 0
for (const id of ids) {
  const { ko, icono } = await ficha(id)
  const en = skills.find((s) => s.id === id)?.nombre ?? ''
  n++
  if (ko) mapa[ko] = { id, en, icono: icono ? `https://aion2t.com/db-item-icons/${icono}` : null }
  process.stdout.write(`\r  ${n}/${ids.length}`)
  await new Promise((res) => setTimeout(res, 250))
}
process.stdout.write('\n')

fs.writeFileSync(SALIDA, JSON.stringify(mapa, null, 2) + '\n', 'utf8')
const conIcono = Object.values(mapa).filter((v) => v.icono).length
console.log(`${SALIDA}: ${Object.keys(mapa).length} nombres, ${conIcono} con icono`)
