// Quita las etiquetas PvE y PvP de las guias de clase del foro: son guias
// completas de clase, no de un modo de juego concreto.
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN, 'Content-Type': 'application/json', 'X-Audit-Log-Reason': 'las guias de clase no son de un modo concreto' }
const FORO = '1542632433499901992'
const QUITAR = ['PvE', 'PvP']

const foro = await (await fetch(`https://discord.com/api/v10/channels/${FORO}`, { headers: H })).json()
const nombre = (id) => foro.available_tags.find((t) => t.id === id)?.name
const sobra = new Set(foro.available_tags.filter((t) => QUITAR.includes(t.name)).map((t) => t.id))

const activos = await (await fetch(`https://discord.com/api/v10/guilds/${env.DISCORD_GUILD_ID}/threads/active`, { headers: H })).json()
const hilos = (activos.threads ?? []).filter((t) => t.parent_id === FORO)

let tocados = 0
for (const t of hilos) {
  const antes = t.applied_tags ?? []
  const despues = antes.filter((id) => !sobra.has(id))
  if (despues.length === antes.length) { console.log(`   ${t.name}  (no llevaba ninguna)`); continue }
  if (!despues.length) { console.log(`   ${t.name}  SE SALTA: se quedaria sin etiquetas y el foro las exige`); continue }

  const r = await fetch(`https://discord.com/api/v10/channels/${t.id}`, {
    method: 'PATCH', headers: H, body: JSON.stringify({ applied_tags: despues }),
  })
  if (!r.ok) { console.log(`   FALLO ${r.status} en ${t.name}`); continue }
  const j = await r.json()
  console.log(`ok ${t.name}`)
  console.log(`   ${antes.map(nombre).join(' · ')}   ->   ${(j.applied_tags ?? []).map(nombre).join(' · ')}`)
  tocados++
  await new Promise((r) => setTimeout(r, 700))
}
console.log(`\n${tocados} publicaciones corregidas`)
