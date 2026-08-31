// Crea la sala de reuniones de Aion 2 como CANAL DE ESCENARIO.
//
// Por qué escenario y no un canal de voz normal: en el escenario, quien está
// de público pulsa «✋ Solicitar hablar» y un moderador le abre el micro sobre
// la marcha. En un canal de voz corriente eso no existe, y la única forma de
// repartir la palabra es a base de roles o de tocar permisos uno a uno.
//
// Aquí no hace falta ningún rol: el público es el rol del juego, y los
// oficiales moderan porque tienen los permisos de moderar el escenario.
//
//   node scripts/crear-sala-reuniones.mjs            (simula)
//   node scripts/crear-sala-reuniones.mjs --aplicar
//   node scripts/crear-sala-reuniones.mjs --limpiar  (borra el intento anterior:
//                                                     el canal de voz y el rol)
import fs from 'node:fs'

const APLICAR = process.argv.includes('--aplicar')
const LIMPIAR = process.argv.includes('--limpiar')
const CATEGORIA = '1539349541092991046'   // la de Aion 2
const NOMBRE = '『🎙️』Reuniones'
const OFICIALES = ['EL JEFE', 'Oficial IMP', 'Developer IMP']

// Lo que se creó en el primer intento, con canal de voz y rol.
const VOZ_VIEJA = '1543727885028687983'
const ROL_VIEJO = '1543727883573268520'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = {
  Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN,
  'Content-Type': 'application/json',
  'X-Audit-Log-Reason': 'Sala de reuniones, pedida por Miguel',
}
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: H, ...opts })

if (LIMPIAR) {
  const a = await api(`/channels/${VOZ_VIEJA}`, { method: 'DELETE' })
  console.log(a.ok ? '  borrado el canal de voz anterior' : `  el canal de voz ya no estaba (${a.status})`)
  const b = await api(`/guilds/${env.DISCORD_GUILD_ID}/roles/${ROL_VIEJO}`, { method: 'DELETE' })
  console.log(b.ok ? '  borrado el rol «Orador IMP»' : `  el rol ya no estaba (${b.status})`)
  process.exit(0)
}

const B = {
  gestionarCanal: 1n << 4n, ver: 1n << 10n, escribir: 1n << 11n, historial: 1n << 16n,
  conectar: 1n << 20n, hablar: 1n << 21n, silenciar: 1n << 22n, mover: 1n << 24n,
  video: 1n << 9n, pedirPalabra: 1n << 32n,
}

const roles = await (await api(`/guilds/${env.DISCORD_GUILD_ID}/roles`)).json()
const everyone = env.DISCORD_GUILD_ID
const aion = roles.find((r) => r.name === 'AION 2')
const oficiales = OFICIALES.map((n) => roles.find((r) => r.name === n)).filter(Boolean)
if (!aion) { console.error('no encuentro el rol AION 2'); process.exit(1) }

console.log(`\ncanal:     ${NOMBRE}   (escenario)`)
console.log('categoría: la de Aion 2')
console.log('\nquién hace qué:')
console.log('   @everyone      no lo ve')
console.log('   AION 2         entra de público, escucha, escribe en el chat y puede LEVANTAR LA MANO')
for (const r of oficiales) console.log(`   ${r.name.padEnd(14)} habla y modera: acepta manos levantadas, baja del micro, mueve gente`)
console.log('\nsin roles que repartir: el micro se da y se quita desde el propio escenario')

if (!APLICAR) { console.log('\n(simulación: añade --aplicar para crearlo)\n'); process.exit(0) }

const permisos = [
  { id: everyone, type: 0, allow: '0', deny: String(B.ver) },
  // El público NO lleva «hablar»: por eso le sale el botón de pedir la palabra.
  {
    id: aion.id, type: 0,
    allow: String(B.ver | B.conectar | B.historial | B.escribir | B.pedirPalabra),
    deny: String(B.hablar),
  },
  // Moderar un escenario pide justo estos tres: gestionar el canal, silenciar
  // y mover. Sin los tres, Discord no te deja aceptar a quien pide la palabra.
  ...oficiales.map((r) => ({
    id: r.id, type: 0,
    allow: String(B.ver | B.conectar | B.hablar | B.video | B.escribir | B.historial |
                  B.gestionarCanal | B.silenciar | B.mover | B.pedirPalabra),
    deny: '0',
  })),
]

const res = await api(`/guilds/${env.DISCORD_GUILD_ID}/channels`, {
  method: 'POST',
  body: JSON.stringify({
    name: NOMBRE,
    type: 13,                // escenario
    parent_id: CATEGORIA,
    bitrate: 64000,
    permission_overwrites: permisos,
  }),
})
if (!res.ok) { console.error(`FALLO ${res.status}: ${(await res.text()).slice(0, 400)}`); process.exit(1) }
const c = await res.json()
console.log(`\ncreado: ${c.name}`)
console.log(`id: ${c.id}`)
console.log(`https://discord.com/channels/${env.DISCORD_GUILD_ID}/${c.id}`)
console.log('\nPara la reunión: entra y pulsa «Iniciar escenario», ponle tema y ya puede entrar la gente.')
