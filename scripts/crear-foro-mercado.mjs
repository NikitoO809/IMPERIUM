// Crea el foro del mercado de Aion 2.
//
// La diferencia con los otros foros: aquí NADIE abre temas a mano. Solo el bot,
// desde /vendo y /compro. Por eso al rol AION 2 se le deja ver, responder y
// reaccionar, pero no crear publicaciones: así todas las ofertas tienen la
// misma pinta y se pueden filtrar por etiqueta.
//
// Uso: node scripts/crear-foro-mercado.mjs [--aplicar]
import fs from 'node:fs'

const APLICAR = process.argv.includes('--aplicar')
const CATEGORIA = '1539349541092991046'   // ╭─═⚔️═─ ᴀɪᴏɴ 2 ɪᴍᴘ ─═⚔️═─╮
const NOMBRE = '『💰』mercado-aion'

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

const GUIA = `Aquí se compra y se vende **dentro del juego**. Las ofertas las publica el bot: usa \`/vendo\` o \`/compro\` y rellena el formulario.

**Cómo funciona**
· \`/vendo\` para lo que sueltas, \`/compro\` para lo que buscas. Elige la categoría y rellena precio y nick.
· En cada oferta hay tres botones: **💬 Contactar** avisa por privado al que la puso, **✅ Ya está cerrada** la cierra (solo el que la publicó) y **⚠️ Reportar** avisa a los oficiales.
· Las ofertas se cierran solas a los **7 días**. Si vendiste antes, ciérrala tú.
· Para publicar hay que llevar **7 días** en el servidor.

**Lo que no se admite aquí**
· **Dinero real. Nada.** Ni oro, ni cuentas, ni objetos por euros o dólares. Es baneo de NCSoft para ti y bronca para el servidor.
· Precios falsos para colar una estafa, o vender lo que no tienes.
· Abrir temas a mano: se borran. Todo pasa por el formulario.

**Antes de cerrar un trato**
El intercambio se hace **dentro del juego**, cara a cara. Recuerda que Aion 2 limita los intercambios directos al día: no los gastes en tratos que no están hablados. Si el trato es gordo, pide a un oficial que haga de intermediario.`

const ETIQUETAS = [
  { name: 'Vendo', emoji_name: '💰' },
  { name: 'Compro', emoji_name: '🔎' },
  { name: 'Equipo', emoji_name: '🛡️' },
  { name: 'Materiales', emoji_name: '🪨' },
  { name: 'Consumibles', emoji_name: '🧪' },
  { name: 'Servicios', emoji_name: '🤝' },
  { name: 'Otros', emoji_name: null },
  // Estas dos las pone el bot al cerrar; nadie las elige a mano.
  { name: 'Cerrada', emoji_name: '✅', moderated: true },
  { name: 'Caducada', emoji_name: '🕓', moderated: true },
]

const permisos = [
  // fuera del juego, ni se ve
  { id: everyone, type: 0, allow: '0', deny: String(B.ver) },
  // los del juego: ven, leen, responden dentro de una oferta y reaccionan,
  // pero NO abren temas (eso lo hace el bot con /vendo y /compro)
  {
    id: aion.id, type: 0,
    allow: String(B.ver | B.historial | B.enHilos | B.reaccionar |
                  B.archivos | B.enlaces | B.emojisExternos),
    deny: String(B.crearPublicos | B.crearPrivados),
  },
]
if (muted) permisos.push({ id: muted.id, type: 0, allow: '0', deny: String(B.escribir | B.crearPublicos | B.enHilos) })

console.log(`canal:     ${NOMBRE}   (foro)`)
console.log('categoría: ╭─═⚔️═─ ᴀɪᴏɴ 2 ɪᴍᴘ ─═⚔️═─╮')
console.log('\npermisos:')
console.log('   @everyone    NO ve el canal')
console.log('   AION 2       ve · responde en las ofertas · reacciona — NO abre temas')
if (muted) console.log('   Muted        no escribe')
console.log('   ADMIN        se lo salta todo')
console.log('\netiquetas:')
console.log('   ' + ETIQUETAS.map((e) => e.name).join(' · '))
console.log('   (Cerrada y Caducada las pone solo el bot)')

if (!APLICAR) { console.log('\n(simulación: añade --aplicar para crearlo)'); process.exit(0) }

const r = await api(`/guilds/${env.DISCORD_GUILD_ID}/channels`, {
  method: 'POST',
  body: JSON.stringify({
    name: NOMBRE,
    type: 15,                       // foro
    parent_id: CATEGORIA,
    topic: GUIA,                    // la «guía de publicaciones» del foro
    default_sort_order: 1,          // por fecha: lo último publicado, arriba
    default_forum_layout: 1,        // vista de lista
    rate_limit_per_user: 5,
    available_tags: ETIQUETAS,
    permission_overwrites: permisos,
  }),
})
if (!r.ok) { console.error(`FALLO ${r.status}: ${(await r.text()).slice(0, 400)}`); process.exit(1) }
const c = await r.json()
console.log(`\ncreado: ${c.name}`)
console.log(`id: ${c.id}`)
console.log(`https://discord.com/channels/${env.DISCORD_GUILD_ID}/${c.id}`)
console.log('\nAhora, para que el bot pueda publicar ahí:')
console.log(`   1. En .env.local y en Vercel:  DISCORD_FORO_MERCADO=${c.id}`)
console.log('   2. En Vercel también:          DISCORD_GUILD_ID (para la caducidad diaria)')
console.log('   3. Registra los comandos:      npm run discord:comandos')
console.log('   4. Ajustes del servidor → Integraciones → IMPERIUM → /vendo y /compro → dáselos al rol AION 2')
