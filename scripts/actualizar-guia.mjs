// Reescribe una guia ya publicada: cambia el texto y sustituye las imagenes de
// cada mensaje, sin borrar la publicacion ni perder las reacciones.
// Uso: node scripts/actualizar-guia.mjs <guion.json> <carpeta-de-imagenes>
import fs from 'node:fs'
import path from 'node:path'

const [GUION, IMG] = process.argv.slice(2)
// --imagenes: reenvía también los mensajes cuyo texto no ha cambiado. Hace falta
// cuando lo que se ha rehecho es el diagrama y no el texto que va encima.
const FORZAR = process.argv.includes('--imagenes')
if (!GUION || !IMG) { console.error('uso: node scripts/actualizar-guia.mjs <guion.json> <carpeta> [--imagenes]'); process.exit(1) }

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN }
const FORO = '1542632433499901992'

const guion = JSON.parse(fs.readFileSync(GUION, 'utf8'))
const entrada = `${guion.apertura}\n\n${guion.secciones[0].texto}`

// localizar la publicacion por su titulo
const activos = await (await fetch(`https://discord.com/api/v10/guilds/${env.DISCORD_GUILD_ID}/threads/active`, { headers: AUTH })).json()
const hilo = (activos.threads ?? []).find((t) => t.parent_id === FORO && t.name === guion.titulo)
if (!hilo) { console.error(`no encuentro la publicacion "${guion.titulo}"`); process.exit(1) }

// Los mensajes vienen del mas nuevo al mas viejo: se invierten para seguir el orden
// del guion. Y se quedan SOLO los del propio bot: en el hilo puede escribir
// cualquiera (otros bots incluidos) y eso no es parte de la guia.
const todos = (await (await fetch(`https://discord.com/api/v10/channels/${hilo.id}/messages?limit=50`, { headers: AUTH })).json()).reverse()
const mensajes = todos.filter((m) => m.author?.id === env.DISCORD_APP_ID)
const ajenos = todos.length - mensajes.length
if (ajenos) console.log(`  (${ajenos} mensaje${ajenos > 1 ? 's' : ''} de otros en el hilo, se ignoran)`)
if (mensajes.length !== guion.secciones.length) {
  console.error(`la publicacion tiene ${mensajes.length} mensajes del bot y el guion ${guion.secciones.length} secciones: no cuadran`)
  process.exit(1)
}

console.log(guion.titulo)
let ok = 0
for (const [i, seccion] of guion.secciones.entries()) {
  const mensaje = mensajes[i]
  const ruta = path.join(IMG, seccion.archivo)
  const texto = i === 0 ? entrada : seccion.texto

  // Discord limita las ediciones de mensajes con mas de una hora, asi que no se
  // gasta cupo en los que ya estan bien.
  if (mensaje.content === texto && !FORZAR) { console.log(`  ya estaba  ${seccion.archivo}`); ok++; continue }

  let hecho = false
  for (let intento = 1; intento <= 5 && !hecho; intento++) {
    const form = new FormData()
    form.append('files[0]', new Blob([fs.readFileSync(ruta)], { type: 'image/png' }), seccion.archivo)
    // attachments con solo la nueva = se descartan las imagenes viejas
    form.append('payload_json', JSON.stringify({ content: texto, attachments: [{ id: 0, filename: seccion.archivo }] }))

    const r = await fetch(`https://discord.com/api/v10/channels/${hilo.id}/messages/${mensaje.id}`, {
      method: 'PATCH', headers: AUTH, body: form,
    })
    if (r.ok) {
      const j = await r.json()
      console.log(`  ok  ${seccion.archivo}  (${j.attachments.length} imagen, ${j.content.length} caracteres)`)
      ok++
      hecho = true
      break
    }
    if (r.status === 429) {
      const d = await r.json().catch(() => ({}))
      const espera = Math.max(5000, Math.ceil((d.retry_after ?? 5) * 1000) * intento * 4)
      console.log(`  ... Discord frena las ediciones, espero ${Math.round(espera / 1000)}s (${seccion.archivo})`)
      await new Promise((r) => setTimeout(r, espera))
      continue
    }
    console.log(`  FALLO ${r.status} en ${seccion.archivo}: ${(await r.text()).slice(0, 140)}`)
    break
  }
  await new Promise((r) => setTimeout(r, 900))
}
console.log(`  ${ok} de ${guion.secciones.length} mensajes actualizados`)
