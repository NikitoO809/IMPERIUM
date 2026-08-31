// Publica una guia de clase en el foro 『📌』foro-imp a partir de un fichero de guion.
// Uso: node scripts/publicar-guia.mjs <guion.json> <carpeta-de-imagenes>
//
// El guion es: { "titulo", "etiquetas": [...], "apertura", "secciones": [{ "archivo", "texto" }] }
import fs from 'node:fs'
import path from 'node:path'

const [GUION, IMG] = process.argv.slice(2)
if (!GUION || !IMG) { console.error('uso: node scripts/publicar-guia.mjs <guion.json> <carpeta>'); process.exit(1) }

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN }
const FORO = '1542632433499901992'
const LIMITE = 2000                       // maximo de caracteres por mensaje en Discord

const guion = JSON.parse(fs.readFileSync(GUION, 'utf8'))

for (const s of guion.secciones) {
  const ruta = path.join(IMG, s.archivo)
  if (!fs.existsSync(ruta)) { console.error(`falta la imagen ${ruta}`); process.exit(1) }
  if (s.texto.length > LIMITE) { console.error(`el texto de ${s.archivo} pasa de ${LIMITE} caracteres`); process.exit(1) }
}
const entrada = `${guion.apertura}\n\n${guion.secciones[0].texto}`
if (entrada.length > LIMITE) { console.error(`la entrada pasa de ${LIMITE} caracteres (${entrada.length})`); process.exit(1) }

const adjuntar = (form, ruta) => {
  const nombre = path.basename(ruta)
  form.append('files[0]', new Blob([fs.readFileSync(ruta)], { type: 'image/png' }), nombre)
  return nombre
}

const foro = await (await fetch(`https://discord.com/api/v10/channels/${FORO}`, { headers: AUTH })).json()
const tags = guion.etiquetas
  .map((n) => foro.available_tags.find((t) => t.name === n)?.id)
  .filter(Boolean)
if (!tags.length) { console.error('ninguna etiqueta del guion existe en el foro'); process.exit(1) }

// abrir la publicacion
const form = new FormData()
const nom1 = adjuntar(form, path.join(IMG, guion.secciones[0].archivo))
form.append('payload_json', JSON.stringify({
  name: guion.titulo,
  applied_tags: tags,
  message: { content: entrada, attachments: [{ id: 0, filename: nom1 }] },
}))
const r = await fetch(`https://discord.com/api/v10/channels/${FORO}/threads`, { method: 'POST', headers: AUTH, body: form })
if (!r.ok) { console.error(`ERROR ${r.status} ${await r.text()}`); process.exit(1) }
const hilo = await r.json()
console.log(`publicada: ${hilo.name}   [${guion.etiquetas.join(', ')}]`)

let fallos = 0
for (const s of guion.secciones.slice(1)) {
  await new Promise((r) => setTimeout(r, 900))
  const f2 = new FormData()
  const nom = adjuntar(f2, path.join(IMG, s.archivo))
  f2.append('payload_json', JSON.stringify({ content: s.texto, attachments: [{ id: 0, filename: nom }] }))
  const res = await fetch(`https://discord.com/api/v10/channels/${hilo.id}/messages`, { method: 'POST', headers: AUTH, body: f2 })
  if (!res.ok) { console.log(`  FALLO ${res.status} en ${s.archivo}: ${await res.text()}`); fallos++ }
  else console.log(`  ok  ${s.archivo}`)
}

// comprobacion contra el servidor
const leido = await (await fetch(`https://discord.com/api/v10/channels/${hilo.id}/messages?limit=20`, { headers: AUTH })).json()
const imagenes = leido.reduce((n, m) => n + m.attachments.length, 0)
console.log(`\n${leido.length} mensajes, ${imagenes} imagenes${fallos ? `, ${fallos} fallidos` : ''}`)
console.log(`https://discord.com/channels/${env.DISCORD_GUILD_ID}/${hilo.id}`)
