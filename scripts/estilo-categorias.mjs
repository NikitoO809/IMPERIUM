// Pone a todas las categorías el estilo de la de Aion 2: marco de línea
// continua y todas del mismo largo, rellenando con más o menos rayas según
// cuánto ocupe el nombre.
//
//   node scripts/estilo-categorias.mjs            (simula)
//   node scripts/estilo-categorias.mjs --aplicar
//   node scripts/estilo-categorias.mjs --revertir (devuelve los nombres de antes)
//
// Los nombres anteriores se guardan en scripts/data/nombres-antes.json, el
// mismo fichero que usa renombrar-canal.mjs.
import fs from 'node:fs'

const APLICAR = process.argv.includes('--aplicar')
const REVERTIR = process.argv.includes('--revertir')

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = {
  Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN,
  'Content-Type': 'application/json',
  'X-Audit-Log-Reason': 'Estilo de categorias unificado, pedido por Miguel',
}
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: H, ...opts })

// El molde: el de la categoría de Aion 2.
const RAYA = '▁'          // bloque fino: se pega con el de al lado sin cortes
const IZQ = '╭'
const DER = '╮'
const LARGO = 26          // caracteres en total, contando ganchos y rayas

// Las que gestiona otro bot o son zona interna: ni tocarlas.
const INTOCABLES = [/server stats/i, /tempvoice/i, /^mimir$/i]

const COPIAS = 'scripts/data/nombres-antes.json'
const copias = fs.existsSync(COPIAS) ? JSON.parse(fs.readFileSync(COPIAS, 'utf8')) : {}

// Se queda con el nombre y tira el marco: ganchos, rayas de cualquier tipo,
// emojis y los espacios que quedan sueltos.
//
// OJO con cómo se filtran los emojis: hay que ir por rangos, no por un umbral
// «de aquí para arriba, fuera». Las versalitas ꜰ y ꜱ (U+A730 y U+A731) viven
// mucho más arriba que las demás (U+1D00 y alrededores), así que un umbral se
// las lleva y deja «ᴄᴀʟʟ ᴏ ᴅʀᴀɢᴏɴ».
function soloNombre(nombre) {
  return [...nombre]
    .filter((c) => {
      const p = c.codePointAt(0)
      if (p === 0x200d || (p >= 0xfe00 && p <= 0xfe0f)) return false // pegamento de emojis
      if (p >= 0x2190 && p <= 0x2bff) return false // flechas, cajas, bloques, formas
      if (p >= 0x1f000) return false // emojis
      if (c === '-' || c === '⸺' || c === '⸻') return false
      return true
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

function conMarco(nombre) {
  const hueco = Math.max(2, LARGO - 2 - [...nombre].length)
  const izq = Math.floor(hueco / 2)
  return IZQ + RAYA.repeat(izq) + nombre + RAYA.repeat(hueco - izq) + DER
}

const canales = await (await api(`/guilds/${env.DISCORD_GUILD_ID}/channels`)).json()
const categorias = canales.filter((c) => c.type === 4).sort((a, b) => a.position - b.position)

const trabajo = []
for (const cat of categorias) {
  if (INTOCABLES.some((r) => r.test(cat.name))) {
    console.log(`  se queda igual   ${cat.name}`)
    continue
  }
  const destino = REVERTIR ? copias[cat.id] : conMarco(soloNombre(cat.name))
  if (!destino || destino === cat.name) {
    console.log(`  ya está          ${cat.name}`)
    continue
  }
  trabajo.push({ id: cat.id, antes: cat.name, destino })
}

console.log('')
for (const t of trabajo) console.log(`  ${t.antes}\n     →  ${t.destino}\n`)

if (!APLICAR && !REVERTIR) {
  console.log(`  ${trabajo.length} categorías cambiarían. (simulación: añade --aplicar)\n`)
  process.exit(0)
}
if (trabajo.length === 0) { console.log('  nada que hacer.\n'); process.exit(0) }

// Discord solo deja renombrar un canal 2 veces cada 10 minutos, pero eso es
// POR canal: entre categorías distintas no estorba. Lo que sí puede saltar es
// el límite general, así que se va con calma y se reintenta si dice 429.
let hechas = 0
for (const t of trabajo) {
  for (let intento = 1; intento <= 5; intento++) {
    const res = await api(`/channels/${t.id}`, { method: 'PATCH', body: JSON.stringify({ name: t.destino }) })
    if (res.ok) {
      if (!REVERTIR && !(t.id in copias)) {
        copias[t.id] = t.antes
        fs.mkdirSync('scripts/data', { recursive: true })
        fs.writeFileSync(COPIAS, JSON.stringify(copias, null, 1), 'utf8')
      }
      if (REVERTIR) { delete copias[t.id]; fs.writeFileSync(COPIAS, JSON.stringify(copias, null, 1), 'utf8') }
      console.log(`  hecha   ${(await res.json()).name}`)
      hechas++
      break
    }
    if (res.status === 429) {
      const espera = ((await res.json()).retry_after ?? 5) + 1
      console.log(`  esperando ${Math.ceil(espera)}s (Discord va apretado)…`)
      await new Promise((s) => setTimeout(s, espera * 1000))
      continue
    }
    console.error(`  FALLO ${res.status} en ${t.antes}: ${(await res.text()).slice(0, 200)}`)
    break
  }
  await new Promise((s) => setTimeout(s, 900))
}

console.log(`\n  ${hechas} de ${trabajo.length} categorías.`)
if (!REVERTIR) console.log('  para deshacerlo todo:  node scripts/estilo-categorias.mjs --revertir\n')
else console.log('')
