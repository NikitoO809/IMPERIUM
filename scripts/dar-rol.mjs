// Da (o quita) un rol a una lista de personas, de una en una y con calma.
//
//   node scripts/dar-rol.mjs <idRol> <id,id,id>              (simula)
//   node scripts/dar-rol.mjs <idRol> <id,id,id> --aplicar
//   node scripts/dar-rol.mjs <idRol> <id,id,id> --quitar --aplicar   (marcha atras)
//
// Antes de tocar nada comprueba dos cosas: que el rol del bot este por encima
// del rol que se reparte (si no, Discord responde 403 y no explica por que), y
// quien lo tiene ya, para no repetir trabajo.
import fs from 'node:fs'

const [ROL, LISTA] = process.argv.slice(2)
const APLICAR = process.argv.includes('--aplicar')
const QUITAR = process.argv.includes('--quitar')

if (!ROL || !LISTA || LISTA.startsWith('--')) {
  console.error('\n  uso: node scripts/dar-rol.mjs <idRol> <id,id,id> [--aplicar] [--quitar]\n')
  process.exit(1)
}

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = {
  Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN,
  'Content-Type': 'application/json',
  'X-Audit-Log-Reason': 'Rol repartido a mano, pedido por Miguel',
}
const G = env.DISCORD_GUILD_ID
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: H, ...opts })

const ids = LISTA.split(',').map((s) => s.trim()).filter(Boolean)
const roles = await (await api(`/guilds/${G}/roles`)).json()
const rol = roles.find((r) => r.id === ROL)
if (!rol) { console.error(`\n  no existe el rol ${ROL} en el servidor.\n`); process.exit(1) }

// Jerarquia: un bot solo reparte roles que esten por debajo del suyo.
const yo = await (await api(`/guilds/${G}/members/${(await (await api('/users/@me')).json()).id}`)).json()
const miAltura = Math.max(...roles.filter((r) => yo.roles.includes(r.id)).map((r) => r.position))
if (miAltura <= rol.position) {
  console.error(`\n  el rol "${rol.name}" esta por encima del bot: hay que subir el rol del bot en Ajustes > Roles.\n`)
  process.exit(1)
}

console.log(`\n  rol: ${rol.name}   (${QUITAR ? 'QUITAR' : 'DAR'})\n`)

const trabajo = []
for (const id of ids) {
  const m = await (await api(`/guilds/${G}/members/${id}`)).json()
  if (!m.user) { console.log(`  no esta en el servidor   ${id}`); continue }
  const nombre = m.nick || m.user.global_name || m.user.username
  const tiene = m.roles.includes(ROL)
  if (tiene === !QUITAR) { console.log(`  ya esta             ${nombre}`); continue }
  console.log(`  ${QUITAR ? 'se le quitaria' : 'se le daria'}      ${nombre}`)
  trabajo.push({ id, nombre })
}

if (!APLICAR) {
  console.log(`\n  ${trabajo.length} personas. (simulacion: anade --aplicar)\n`)
  process.exit(0)
}
if (!trabajo.length) { console.log('\n  nada que hacer.\n'); process.exit(0) }

console.log('')
for (const p of trabajo) {
  for (let intento = 1; intento <= 5; intento++) {
    const res = await api(`/guilds/${G}/members/${p.id}/roles/${ROL}`, { method: QUITAR ? 'DELETE' : 'PUT' })
    if (res.ok) { console.log(`  hecho   ${p.nombre}`); break }
    if (res.status === 429) {
      const espera = ((await res.json()).retry_after ?? 5) + 1
      console.log(`  esperando ${Math.ceil(espera)}s…`)
      await new Promise((s) => setTimeout(s, espera * 1000))
      continue
    }
    console.error(`  FALLO ${res.status} en ${p.nombre}: ${(await res.text()).slice(0, 200)}`)
    break
  }
}

const vuelta = QUITAR ? '' : ' --quitar'
console.log(`\n  para dar marcha atras:  node scripts/dar-rol.mjs ${ROL} ${ids.join(',')}${vuelta || ' --quitar'} --aplicar\n`)
