// Devuelve todos los canales al nombre que tenian en discord-nombres-backup.json.
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = {
  Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN,
  'Content-Type': 'application/json',
  'X-Audit-Log-Reason': 'Vuelta atras del estilo de canales',
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const backup = JSON.parse(fs.readFileSync('scripts/data/discord-nombres-backup.json', 'utf8'))
const actuales = await (await fetch(`https://discord.com/api/v10/guilds/${env.DISCORD_GUILD_ID}/channels`, { headers: H })).json()
const porId = new Map(actuales.map((c) => [c.id, c]))

let devueltos = 0
for (const viejo of backup) {
  const ahora = porId.get(viejo.id)
  if (!ahora || ahora.name === viejo.name) continue
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`https://discord.com/api/v10/channels/${viejo.id}`, {
      method: 'PATCH', headers: H, body: JSON.stringify({ name: viejo.name }),
    })
    if (res.ok) { console.log(`  ${ahora.name}  ->  ${viejo.name}`); devueltos++; break }
    if (res.status === 429) {
      const d = await res.json().catch(() => ({}))
      await sleep(Math.ceil((d.retry_after ?? 5) * 1000) + 500)
      continue
    }
    console.log(`  FALLO ${res.status} en ${viejo.name}`)
    break
  }
  await sleep(350)
}
console.log('')
console.log(`${devueltos} canales devueltos a su nombre anterior.`)
