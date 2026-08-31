// Crea unas categorías de prueba, cada una con un carácter de raya distinto,
// para mirar EN DISCORD cuál se ve continua y cuál deja cortes. Depende de la
// tipografía de cada equipo, así que no vale con mirarlo en el editor.
//
// Solo las ven los administradores. Se borran con --borrar.
//
//   node scripts/probar-rayas.mjs            (simula)
//   node scripts/probar-rayas.mjs --aplicar
//   node scripts/probar-rayas.mjs --borrar
import fs from 'node:fs'

const APLICAR = process.argv.includes('--aplicar')
const BORRAR = process.argv.includes('--borrar')

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN, 'Content-Type': 'application/json' }
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: H, ...opts })

const NOMBRE = 'ᴀɪᴏɴ 2 ɪᴍᴘ'
const REGISTRO = 'scripts/data/pruebas-rayas.json'

// Cada candidata: cómo se llama el carácter y cuántos van a cada lado.
const RAYAS = [
  { n: 1, char: '─', veces: 7, que: 'U+2500 fina de caja (la que hay ahora)' },
  { n: 2, char: '▔', veces: 7, que: 'U+2594 bloque fino arriba: los bloques se pegan siempre' },
  { n: 3, char: '⸻', veces: 2, que: 'U+2E3B raya de tres emes: una sola pieza larga' },
  { n: 4, char: '━', veces: 7, que: 'U+2501 fina gruesa de caja' },
  { n: 5, char: '▁', veces: 7, que: 'U+2581 bloque fino abajo' },
]

const monta = (r) => `${r.n} ╭${r.char.repeat(r.veces)}${NOMBRE}${r.char.repeat(r.veces)}╮`

if (BORRAR) {
  if (!fs.existsSync(REGISTRO)) { console.error('\n  no hay pruebas que borrar.\n'); process.exit(1) }
  const ids = JSON.parse(fs.readFileSync(REGISTRO, 'utf8'))
  // Borrar la categoría no se lleva por delante lo que tenga dentro, así que
  // primero van los canales hijos.
  const todos = await (await api(`/guilds/${env.DISCORD_GUILD_ID}/channels`)).json()
  for (const hijo of todos.filter((c) => ids.includes(c.parent_id))) {
    const r = await api(`/channels/${hijo.id}`, { method: 'DELETE' })
    console.log(`  ${r.ok ? 'borrado' : 'no he podido borrar'}  ${hijo.name}`)
    await new Promise((s) => setTimeout(s, 500))
  }
  for (const id of ids) {
    const r = await api(`/channels/${id}`, { method: 'DELETE' })
    console.log(`  ${r.ok ? 'borrada' : 'no he podido borrar'}  ${id}`)
  }
  fs.unlinkSync(REGISTRO)
  console.log('')
  process.exit(0)
}

console.log('\n  candidatas:\n')
for (const r of RAYAS) console.log(`  ${monta(r)}      ${r.que}`)

if (!APLICAR) { console.log('\n  (simulación: añade --aplicar para crearlas en Discord)\n'); process.exit(0) }

// Ocultas para todo el mundo: los admins se lo saltan y las ven igual.
const permisos = [{ id: env.DISCORD_GUILD_ID, type: 0, allow: '0', deny: String(1n << 10n) }]

const creadas = []
for (const r of RAYAS) {
  const res = await api(`/guilds/${env.DISCORD_GUILD_ID}/channels`, {
    method: 'POST',
    body: JSON.stringify({ name: monta(r), type: 4, permission_overwrites: permisos }),
  })
  if (!res.ok) { console.error(`  FALLO ${res.status}: ${(await res.text()).slice(0, 200)}`); continue }
  const c = await res.json()
  creadas.push(c.id)
  console.log(`  creada  ${c.name}`)
  await new Promise((s) => setTimeout(s, 600))

  // Sin un canal dentro, Discord NO dibuja la categoría en la lista: se crea
  // bien, la API la devuelve, y en pantalla no aparece.
  await api(`/guilds/${env.DISCORD_GUILD_ID}/channels`, {
    method: 'POST',
    body: JSON.stringify({ name: 'mira-la-de-arriba', type: 0, parent_id: c.id }),
  })
  await new Promise((s) => setTimeout(s, 600))
}
fs.mkdirSync('scripts/data', { recursive: true })
fs.writeFileSync(REGISTRO, JSON.stringify(creadas, null, 1), 'utf8')
console.log('\n  Míralas en Discord, al final de la lista de categorías.')
console.log('  Cuando elijas:  node scripts/probar-rayas.mjs --borrar\n')
