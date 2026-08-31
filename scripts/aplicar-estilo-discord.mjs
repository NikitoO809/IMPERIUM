// Aplica scripts/data/propuesta-estilo.json al servidor.
// Va guardando el avance, asi que se puede relanzar y sigue donde iba.
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = {
  Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN,
  'Content-Type': 'application/json',
  'X-Audit-Log-Reason': 'Estilo unificado de canales, aprobado por Miguel',
}

const AVANCE = 'scripts/data/avance-estilo.json'
const hechos = fs.existsSync(AVANCE) ? JSON.parse(fs.readFileSync(AVANCE, 'utf8')) : {}
const guardar = () => fs.writeFileSync(AVANCE, JSON.stringify(hechos, null, 1), 'utf8')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function renombrar(id, name, etiqueta) {
  if (hechos[id] === name) { console.log(`  ya estaba  ${name}`); return true }
  for (let intento = 1; intento <= 6; intento++) {
    const res = await fetch(`https://discord.com/api/v10/channels/${id}`, {
      method: 'PATCH', headers: H, body: JSON.stringify({ name }),
    })
    if (res.ok) {
      const j = await res.json()
      hechos[id] = j.name
      guardar()
      const avisa = j.name !== name ? `   (Discord lo dejo en "${j.name}")` : ''
      console.log(`  ${etiqueta}  ${j.name}${avisa}`)
      return true
    }
    if (res.status === 429) {
      const d = await res.json().catch(() => ({}))
      const espera = Math.ceil((d.retry_after ?? 5) * 1000) + 500
      console.log(`  ... frenado por Discord, espero ${Math.round(espera / 1000)}s (${name})`)
      await sleep(espera)
      continue
    }
    console.log(`  FALLO ${res.status}  ${name}  ->  ${await res.text()}`)
    return false
  }
  console.log(`  RENDIDO tras 6 intentos: ${name}`)
  return false
}

const propuesta = JSON.parse(fs.readFileSync('scripts/data/propuesta-estilo.json', 'utf8'))
let ok = 0, fallos = 0

for (const cat of propuesta) {
  if (!cat.despues) continue
  console.log('')
  console.log(cat.despues)
  ;(await renombrar(cat.id, cat.despues, 'CAT ')) ? ok++ : fallos++
  await sleep(350)
  for (const c of cat.canales) {
    if (!c.despues) continue
    ;(await renombrar(c.id, c.despues, '    ')) ? ok++ : fallos++
    await sleep(350)
  }
}

console.log('')
console.log(`TERMINADO: ${ok} aplicados, ${fallos} fallidos.`)
if (fallos) console.log('Relanza el script y seguira solo por los que faltan.')
console.log('Para deshacerlo todo: node scripts/revertir-estilo-discord.mjs')
