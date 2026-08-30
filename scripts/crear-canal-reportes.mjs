// Crea el canal privado donde caen los avisos del botón "⚠️ Reportar" del
// mercado de Aion 2. Solo lo ven los oficiales.
//
// Va en la categoría de Aion 2, al lado del mercado que vigila, y no en los
// logs: un aviso de estafa entre mensajes de bots se pierde.
//
// Uso: node scripts/crear-canal-reportes.mjs [--aplicar]
import fs from 'node:fs'

const APLICAR = process.argv.includes('--aplicar')
const CATEGORIA = '1539349541092991046'   // ╭─═⚔️═─ ᴀɪᴏɴ 2 ɪᴍᴘ ─═⚔️═─╮
const NOMBRE = '『🚨』reportes-mercado'
const STAFF = ['EL JEFE', 'Oficial IMP', 'Developer IMP']

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN, 'Content-Type': 'application/json' }
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: AUTH, ...opts })

const B = {
  reaccionar: 1n << 6n, ver: 1n << 10n, escribir: 1n << 11n,
  enlaces: 1n << 14n, archivos: 1n << 15n, historial: 1n << 16n,
  emojisExternos: 1n << 18n, enHilos: 1n << 38n,
}

const roles = await (await api(`/guilds/${env.DISCORD_GUILD_ID}/roles`)).json()
const everyone = env.DISCORD_GUILD_ID
const oficiales = STAFF.map((n) => roles.find((r) => r.name === n)).filter(Boolean)
if (oficiales.length === 0) { console.error('no encuentro ningún rol de oficiales'); process.exit(1) }

const TEMA = 'Avisos del botón ⚠️ del mercado de Aion 2. Los escribe IMPBOT: quién reporta, a quién, el enlace a la oferta y qué dice que ha pasado. Comprobadlo antes de tomar medidas: reportar es gratis y se puede usar para fastidiar a un rival.'

const permisos = [
  { id: everyone, type: 0, allow: '0', deny: String(B.ver) },
  ...oficiales.map((r) => ({
    id: r.id, type: 0,
    allow: String(B.ver | B.historial | B.escribir | B.reaccionar | B.enlaces |
                  B.archivos | B.emojisExternos | B.enHilos),
    deny: '0',
  })),
]

console.log(`canal:     ${NOMBRE}   (texto, privado)`)
console.log('categoría: ╭─═⚔️═─ ᴀɪᴏɴ 2 ɪᴍᴘ ─═⚔️═─╮')
console.log('\npermisos:')
console.log('   @everyone    NO ve el canal')
for (const r of oficiales) console.log(`   ${r.name.padEnd(13)}ve · escribe · reacciona`)

if (!APLICAR) { console.log('\n(simulación: añade --aplicar para crearlo)'); process.exit(0) }

const r = await api(`/guilds/${env.DISCORD_GUILD_ID}/channels`, {
  method: 'POST',
  body: JSON.stringify({
    name: NOMBRE,
    type: 0,
    parent_id: CATEGORIA,
    topic: TEMA,
    permission_overwrites: permisos,
  }),
})
if (!r.ok) { console.error(`FALLO ${r.status}: ${(await r.text()).slice(0, 400)}`); process.exit(1) }
const c = await r.json()
console.log(`\ncreado: ${c.name}`)
console.log(`id: ${c.id}`)
console.log(`https://discord.com/channels/${env.DISCORD_GUILD_ID}/${c.id}`)
console.log(`\nPonlo en .env.local y en Vercel:  DISCORD_CANAL_REPORTES=${c.id}`)
