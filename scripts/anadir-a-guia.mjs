// Añade mensajes con imagen a una publicacion del foro que ya existe.
// Uso: node scripts/anadir-a-guia.mjs "<titulo de la publicacion>" <anadidos.json> <carpeta>
//
// anadidos.json: [{ "archivo": "x.png", "texto": "..." }, ...]
import fs from 'node:fs'
import path from 'node:path'

const [TITULO, LISTA, IMG] = process.argv.slice(2)
if (!TITULO || !LISTA || !IMG) {
  console.error('uso: node scripts/anadir-a-guia.mjs "<titulo>" <anadidos.json> <carpeta>')
  process.exit(1)
}

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN }
const FORO = '1542632433499901992'

const activos = await (await fetch(`https://discord.com/api/v10/guilds/${env.DISCORD_GUILD_ID}/threads/active`, { headers: AUTH })).json()
const hilo = (activos.threads ?? []).find((t) => t.parent_id === FORO && t.name === TITULO)
if (!hilo) { console.error(`no encuentro la publicacion "${TITULO}"`); process.exit(1) }

const anadidos = JSON.parse(fs.readFileSync(LISTA, 'utf8'))
console.log(hilo.name)
let ok = 0
for (const a of anadidos) {
  const ruta = path.join(IMG, a.archivo)
  if (!fs.existsSync(ruta)) { console.log(`  falta ${ruta}`); continue }
  const form = new FormData()
  form.append('files[0]', new Blob([fs.readFileSync(ruta)], { type: 'image/png' }), a.archivo)
  form.append('payload_json', JSON.stringify({ content: a.texto, attachments: [{ id: 0, filename: a.archivo }] }))
  const r = await fetch(`https://discord.com/api/v10/channels/${hilo.id}/messages`, { method: 'POST', headers: AUTH, body: form })
  if (!r.ok) { console.log(`  FALLO ${r.status}: ${(await r.text()).slice(0, 120)}`); continue }
  console.log(`  ok  ${a.archivo}`)
  ok++
  await new Promise((r) => setTimeout(r, 900))
}
console.log(`\n${ok} de ${anadidos.length} añadidos`)
console.log(`https://discord.com/channels/${env.DISCORD_GUILD_ID}/${hilo.id}`)
