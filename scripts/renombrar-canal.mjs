// Renombra un canal o una categoría, guardando el nombre anterior para poder
// dar marcha atrás. Sirve para probar estilos sin miedo.
//
//   node scripts/renombrar-canal.mjs <id> "<nombre nuevo>"     (simula)
//   node scripts/renombrar-canal.mjs <id> "<nombre nuevo>" --aplicar
//   node scripts/renombrar-canal.mjs <id> --revertir
//
// La copia de seguridad vive en scripts/data/nombres-antes.json.
import fs from 'node:fs'

const [ID, ARG2] = process.argv.slice(2)
const APLICAR = process.argv.includes('--aplicar')
const REVERTIR = process.argv.includes('--revertir')
const NUEVO = ARG2 && !ARG2.startsWith('--') ? ARG2 : null

if (!ID || (!NUEVO && !REVERTIR)) {
  console.error('\n  uso: node scripts/renombrar-canal.mjs <id> "<nombre nuevo>" [--aplicar]')
  console.error('       node scripts/renombrar-canal.mjs <id> --revertir\n')
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
  'X-Audit-Log-Reason': 'Prueba de estilo de nombres, pedida por Miguel',
}
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: H, ...opts })

const COPIAS = 'scripts/data/nombres-antes.json'
const copias = fs.existsSync(COPIAS) ? JSON.parse(fs.readFileSync(COPIAS, 'utf8')) : {}

const canal = await (await api(`/channels/${ID}`)).json()
if (!canal.id) { console.error('no encuentro ese canal:', JSON.stringify(canal).slice(0, 200)); process.exit(1) }

const TIPOS = { 0: 'texto', 2: 'voz', 4: 'categoría', 5: 'anuncios', 15: 'foro' }
const destino = REVERTIR ? copias[ID] : NUEVO

if (REVERTIR && !destino) {
  console.error(`\n  no tengo guardado ningún nombre anterior de ${ID}.\n`)
  process.exit(1)
}

console.log(`\n  ${TIPOS[canal.type] ?? 'tipo ' + canal.type}`)
console.log(`  antes:   ${canal.name}`)
console.log(`  después: ${destino}`)

// Discord corta a los 100 caracteres y no deja nombres vacíos.
if ([...destino].length > 100) { console.error('\n  ese nombre pasa de 100 caracteres.\n'); process.exit(1) }

if (!APLICAR && !REVERTIR) {
  console.log('\n  (simulación: añade --aplicar para hacerlo)\n')
  process.exit(0)
}

// La copia se guarda ANTES de tocar nada, y solo la primera vez: así --revertir
// siempre devuelve el nombre original, no el de una prueba intermedia.
if (!REVERTIR && !(ID in copias)) {
  copias[ID] = canal.name
  fs.mkdirSync('scripts/data', { recursive: true })
  fs.writeFileSync(COPIAS, JSON.stringify(copias, null, 1), 'utf8')
}

const res = await api(`/channels/${ID}`, { method: 'PATCH', body: JSON.stringify({ name: destino }) })
if (!res.ok) {
  console.error(`\n  Discord ha dicho que no (${res.status}): ${(await res.text()).slice(0, 300)}`)
  console.error('  ojo: Discord solo deja renombrar un canal 2 veces cada 10 minutos.\n')
  process.exit(1)
}
const hecho = await res.json()
console.log(`\n  hecho: ${hecho.name}`)
if (hecho.name !== destino) console.log('  (Discord ha cambiado algún carácter por su cuenta)')
if (!REVERTIR) console.log(`\n  para deshacerlo:  node scripts/renombrar-canal.mjs ${ID} --revertir\n`)
else { delete copias[ID]; fs.writeFileSync(COPIAS, JSON.stringify(copias, null, 1), 'utf8'); console.log('') }
