// Deja un canal en solo lectura, opcionalmente visible solo para un rol.
//
//   node scripts/canal-solo-lectura.mjs <id> [--rol "AION 2"] [--reacciones] --aplicar
//   node scripts/canal-solo-lectura.mjs <id> --revertir
//
// Sin --aplicar solo enseña lo que haría. Antes de tocar nada guarda los permisos
// de ese canal en scripts/data/permisos-antes-<id>.json, para poder deshacerlo.
//
// Los roles con ADMIN (Oficial IMP, IMPBOT, EL JEFE…) se saltan todo esto: es de
// Discord, no del script.
import fs from 'node:fs'

const [ID] = process.argv.slice(2).filter((a) => /^\d{17,20}$/.test(a))
const ROL = (() => { const i = process.argv.indexOf('--rol'); return i > 0 ? process.argv[i + 1] : null })()
const REACCIONES = process.argv.includes('--reacciones')
const APLICAR = process.argv.includes('--aplicar')
const REVERTIR = process.argv.includes('--revertir')
if (!ID) {
  console.error('uso: node scripts/canal-solo-lectura.mjs <id> [--rol "NOMBRE"] [--reacciones] [--aplicar|--revertir]')
  process.exit(1)
}

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN, 'Content-Type': 'application/json' }
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: AUTH, ...opts })
const COPIA = `scripts/data/permisos-antes-${ID}.json`

const B = {
  reaccionar: 1n << 6n,
  ver: 1n << 10n,
  escribir: 1n << 11n,
  historial: 1n << 16n,
  gestionarHilos: 1n << 34n,
  crearPublicos: 1n << 35n,
  crearPrivados: 1n << 36n,
  enHilos: 1n << 38n,
}
const NO_ESCRIBIR = B.escribir | B.gestionarHilos | B.crearPublicos | B.crearPrivados | B.enHilos

const roles = await (await api(`/guilds/${env.DISCORD_GUILD_ID}/roles`)).json()
const everyone = env.DISCORD_GUILD_ID
const nom = (id) => (id === everyone ? '@everyone' : roles.find((r) => r.id === id)?.name ?? id)

if (REVERTIR) {
  if (!fs.existsSync(COPIA)) { console.error(`no hay copia en ${COPIA}`); process.exit(1) }
  const antes = JSON.parse(fs.readFileSync(COPIA, 'utf8'))
  const r = await api(`/channels/${ID}`, { method: 'PATCH', body: JSON.stringify({ permission_overwrites: antes.permission_overwrites }) })
  console.log(r.ok ? `«${antes.name}» vuelve a los permisos que tenía` : `FALLO ${r.status}: ${(await r.text()).slice(0, 200)}`)
  process.exit(r.ok ? 0 : 1)
}

const canal = await (await api(`/channels/${ID}`)).json()
if (canal.message) { console.error(`no encuentro el canal ${ID}: ${canal.message}`); process.exit(1) }

const rol = ROL ? roles.find((r) => r.name === ROL) : null
if (ROL && !rol) { console.error(`no existe el rol «${ROL}»`); process.exit(1) }

console.log(`canal: ${canal.name}`)
console.log('permisos ahora:')
for (const p of canal.permission_overwrites ?? []) console.log(`   ${nom(p.id).padEnd(18)} allow=${p.allow} deny=${p.deny}`)
if (!(canal.permission_overwrites ?? []).length) console.log('   (ninguno)')

// se respetan los overwrites que ya hubiera (Muted y demás)
const otros = (canal.permission_overwrites ?? []).filter((p) => p.id !== everyone && p.id !== rol?.id)
const nuevos = [...otros]

// @everyone: nunca escribe. Y si hay rol, tampoco ve.
nuevos.push({
  id: everyone, type: 0, allow: '0',
  deny: String(NO_ESCRIBIR | (rol ? B.ver : 0n)),
})
// el rol: ve y (si se pide) reacciona, pero sigue sin escribir
if (rol) {
  nuevos.push({
    id: rol.id, type: 0,
    allow: String(B.ver | B.historial | (REACCIONES ? B.reaccionar : 0n)),
    deny: String(NO_ESCRIBIR),
  })
} else if (REACCIONES) {
  nuevos[nuevos.length - 1] = { id: everyone, type: 0, allow: String(B.reaccionar | B.historial), deny: String(NO_ESCRIBIR) }
}

console.log('\nquedaría:')
console.log(`   @everyone${' '.repeat(9)}${rol ? 'NO ve el canal · ' : ''}no escribe · no crea hilos · no gestiona`)
if (rol) console.log(`   ${rol.name.padEnd(18)}VE el canal · lee el historial${REACCIONES ? ' · REACCIONA' : ''} · no escribe`)
else if (REACCIONES) console.log('   (todos reaccionan, nadie escribe)')
otros.forEach((p) => console.log(`   ${nom(p.id).padEnd(18)}se queda como estaba`))
console.log('   ADMIN             se lo salta todo')

if (!APLICAR) { console.log('\n(simulación: añade --aplicar para hacerlo)'); process.exit(0) }

fs.writeFileSync(COPIA, JSON.stringify({ name: canal.name, permission_overwrites: canal.permission_overwrites ?? [] }, null, 1), 'utf8')
const r = await api(`/channels/${ID}`, { method: 'PATCH', body: JSON.stringify({ permission_overwrites: nuevos }) })
if (!r.ok) { console.error(`FALLO ${r.status}: ${(await r.text()).slice(0, 300)}`); process.exit(1) }
console.log(`\nhecho. copia en ${COPIA}`)
console.log(`para deshacerlo: node scripts/canal-solo-lectura.mjs ${ID} --revertir`)
