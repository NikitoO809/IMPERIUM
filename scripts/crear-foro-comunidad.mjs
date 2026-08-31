// Crea el foro de comunidad de Aion 2: lo ve y lo usa solo quien tenga el rol
// del juego. A diferencia de la guía de clases, aquí SÍ se puede escribir.
//
// Uso: node scripts/crear-foro-comunidad.mjs [--aplicar]
import fs from 'node:fs'

const APLICAR = process.argv.includes('--aplicar')
const CATEGORIA = '1539349541092991046'   // ╭─═⚔️═─ ᴀɪᴏɴ 2 ɪᴍᴘ ─═⚔️═─╮
const NOMBRE = '『⚔️』comunidad-aion'

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
  emojisExternos: 1n << 18n, gestionarHilos: 1n << 34n,
  crearPublicos: 1n << 35n, crearPrivados: 1n << 36n, enHilos: 1n << 38n,
}

const roles = await (await api(`/guilds/${env.DISCORD_GUILD_ID}/roles`)).json()
const everyone = env.DISCORD_GUILD_ID
const aion = roles.find((r) => r.name === 'AION 2')
const muted = roles.find((r) => r.name === 'Muted')
if (!aion) { console.error('no encuentro el rol AION 2'); process.exit(1) }

const GUIA = `Aquí se habla de Aion 2 entre nosotros: dudas, builds, quedadas, lo que salga.

**Antes de abrir un tema**
· Mira si ya hay uno igual y respóndelo en vez de abrir otro.
· Título claro: «¿Merece la pena subir Zikel's Blessing a 20?» se entiende; «ayuda» no.
· Si es una duda de habilidades, mira antes 『📖』guía-de-clases: puede que ya esté.

**Lo que no cabe aquí**
· Vender cuentas, oro o servicios.
· Peleas con otros gremios. Lo que pase en el juego se queda en el juego.

Los datos de las guías salen del cliente del juego. Si ves algo que no cuadra con tu pantalla, dilo con una captura: se corrige.`

const permisos = [
  // nadie que no sea del juego lo ve
  { id: everyone, type: 0, allow: '0', deny: String(B.ver) },
  // los del juego: entran, abren temas, responden y reaccionan
  {
    id: aion.id, type: 0,
    allow: String(B.ver | B.historial | B.crearPublicos | B.enHilos | B.reaccionar |
                  B.archivos | B.enlaces | B.emojisExternos),
    deny: '0',
  },
]
// los silenciados, silenciados también aquí
if (muted) permisos.push({ id: muted.id, type: 0, allow: '0', deny: String(B.escribir | B.crearPublicos | B.enHilos) })

console.log(`canal:     ${NOMBRE}   (foro)`)
console.log('categoría: ╭─═⚔️═─ ᴀɪᴏɴ 2 ɪᴍᴘ ─═⚔️═─╮')
console.log('\npermisos:')
console.log('   @everyone    NO ve el canal')
console.log('   AION 2       ve · abre temas · responde · reacciona · adjunta imágenes')
if (muted) console.log('   Muted        no escribe')
console.log('   ADMIN        se lo salta todo')
console.log('\nsin etiquetas, como pediste')

if (!APLICAR) { console.log('\n(simulación: añade --aplicar para crearlo)'); process.exit(0) }

const r = await api(`/guilds/${env.DISCORD_GUILD_ID}/channels`, {
  method: 'POST',
  body: JSON.stringify({
    name: NOMBRE,
    type: 15,                       // foro
    parent_id: CATEGORIA,
    topic: GUIA,                    // en un foro esto es la «guía de publicaciones»
    default_sort_order: 0,          // los que tienen actividad reciente, arriba
    default_forum_layout: 1,        // vista de lista
    rate_limit_per_user: 5,         // 5 s entre mensajes, para cortar el spam
    permission_overwrites: permisos,
  }),
})
if (!r.ok) { console.error(`FALLO ${r.status}: ${(await r.text()).slice(0, 400)}`); process.exit(1) }
const c = await r.json()
console.log(`\ncreado: ${c.name}`)
console.log(`id: ${c.id}`)
console.log(`https://discord.com/channels/${env.DISCORD_GUILD_ID}/${c.id}`)
