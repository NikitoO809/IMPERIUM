// Deja el foro de guías en solo lectura y visible solo para el rol del juego.
//
//   · lo renombra a «guía-de-clases»
//   · @everyone: no ve el canal, y tampoco puede publicar, responder ni gestionar
//   · AION 2: sí lo ve (pero sigue sin poder escribir: no se le da allow de nada más)
//   · los ADMIN (Oficial IMP, IMPBOT, EL JEFE…) se saltan todo esto por definición
//
// Guarda antes el estado en scripts/data/foro-permisos-antes.json, para poder
// deshacerlo con --revertir.
//
// Uso: node scripts/foro-solo-lectura.mjs [--aplicar] [--revertir]
import fs from 'node:fs'

const FORO = '1542632433499901992'
const NOMBRE = '『📖』guía-de-clases'
const COPIA = 'scripts/data/foro-permisos-antes.json'
const APLICAR = process.argv.includes('--aplicar')
const REVERTIR = process.argv.includes('--revertir')

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN, 'Content-Type': 'application/json' }
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: AUTH, ...opts })

const BIT = {
  ver: 1n << 10n,
  enviar: 1n << 11n,
  gestionarHilos: 1n << 34n,
  crearPublicos: 1n << 35n,
  crearPrivados: 1n << 36n,
  enviarEnHilos: 1n << 38n,
}
const NO_ESCRIBIR = BIT.enviar | BIT.gestionarHilos | BIT.crearPublicos | BIT.crearPrivados | BIT.enviarEnHilos

const roles = await (await api(`/guilds/${env.DISCORD_GUILD_ID}/roles`)).json()
const everyone = env.DISCORD_GUILD_ID
const aion = roles.find((r) => r.name === 'AION 2')
if (!aion) { console.error('no encuentro el rol AION 2'); process.exit(1) }

// ---- deshacer
if (REVERTIR) {
  if (!fs.existsSync(COPIA)) { console.error(`no hay copia en ${COPIA}`); process.exit(1) }
  const antes = JSON.parse(fs.readFileSync(COPIA, 'utf8'))
  const r = await api(`/channels/${FORO}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: antes.name, permission_overwrites: antes.permission_overwrites }),
  })
  console.log(r.ok ? `devuelto a «${antes.name}» con sus permisos de antes` : `FALLO ${r.status}: ${(await r.text()).slice(0, 200)}`)
  process.exit(r.ok ? 0 : 1)
}

// ---- estado actual
const canal = await (await api(`/channels/${FORO}`)).json()
console.log(`ahora:  «${canal.name}»`)
console.log('permisos actuales:')
for (const p of canal.permission_overwrites ?? []) {
  const n = roles.find((r) => r.id === p.id)?.name ?? (p.id === everyone ? '@everyone' : p.id)
  console.log(`   ${n.padEnd(16)} allow=${p.allow} deny=${p.deny}`)
}

// se conservan los overwrites que ya había (Muted), y se pisan los dos nuestros
const otros = (canal.permission_overwrites ?? []).filter((p) => p.id !== everyone && p.id !== aion.id)
const nuevos = [
  ...otros,
  { id: everyone, type: 0, allow: '0', deny: String(BIT.ver | NO_ESCRIBIR) },
  { id: aion.id, type: 0, allow: String(BIT.ver), deny: String(NO_ESCRIBIR) },
]

console.log(`\nquedaría: «${NOMBRE}»`)
console.log('   @everyone   no ve el canal · no publica · no responde · no gestiona')
console.log('   AION 2      VE el canal · no publica · no responde · no gestiona')
otros.forEach((p) => console.log(`   ${(roles.find((r) => r.id === p.id)?.name ?? p.id).padEnd(12)}se queda como estaba`))
console.log('   ADMIN       se lo salta todo (Oficial IMP, IMPBOT, EL JEFE…)')

if (!APLICAR) { console.log('\n(esto es solo la simulación: añade --aplicar para hacerlo)'); process.exit(0) }

fs.writeFileSync(COPIA, JSON.stringify({ name: canal.name, permission_overwrites: canal.permission_overwrites ?? [] }, null, 1), 'utf8')
console.log(`\ncopia de seguridad en ${COPIA}`)

const r = await api(`/channels/${FORO}`, {
  method: 'PATCH',
  body: JSON.stringify({ name: NOMBRE, permission_overwrites: nuevos }),
})
if (!r.ok) { console.error(`FALLO ${r.status}: ${(await r.text()).slice(0, 300)}`); process.exit(1) }
const hecho = await r.json()
console.log(`\nhecho: «${hecho.name}»`)
console.log('para deshacerlo: node scripts/foro-solo-lectura.mjs --revertir')
