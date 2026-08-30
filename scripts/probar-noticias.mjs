// Prueba en seco del traductor de noticias: coge la última noticia oficial de
// Aion 2 en Steam, la traduce y enseña por pantalla cómo quedaría el aviso.
// NO publica nada en Discord.
//
//   node scripts/probar-noticias.mjs [posición]   (0 = la más reciente)
import fs from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'

const POS = Number(process.argv[2] ?? 0)
const APPID = 3393110

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)

const INSTRUCCIONES = `Traduces al español las noticias oficiales del videojuego AION 2 para el Discord de una comunidad de jugadores.

Reglas:
- Traduce y resume con fidelidad. No inventes NADA: ni fechas, ni cifras, ni recompensas que no estén en el texto.
- Si el original no dice algo, no lo digas tú.
- Deja en su idioma original los nombres propios del juego (clases, zonas, objetos, Kinah, Quna, Founder's Pack, PURPLE).
- Español de España, cercano y directo, sin florituras de marketing ni "¡prepárate para la aventura!".
- El resumen: dos o tres frases con lo esencial.
- Los puntos: entre 2 y 5, cada uno una línea corta con un dato concreto (fechas, límites, requisitos, lo que cambia).

Responde SOLO con un objeto JSON, sin texto alrededor ni bloques de código:
{"titulo": "...", "resumen": "...", "puntos": ["...", "..."]}`

const sinEtiquetas = (s) => s.replace(/\[url=[^\]]*\]/gi, '').replace(/\[\/?[a-z][^\]]*\]/gi, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 8000)

const res = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${APPID}&count=8&maxlength=0&format=json`)
const items = (await res.json()).appnews.newsitems.filter((n) => (n.feedname ?? '').includes('steam_community_announcements'))
const noticia = items[POS]
if (!noticia) { console.error('no hay noticia en esa posición'); process.exit(1) }

console.log(`\nORIGINAL  (${new Date(noticia.date * 1000).toISOString().slice(0, 10)})`)
console.log(`  ${noticia.title}`)
console.log(`  ${noticia.url}\n`)

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
const r = await client.messages.create({
  model: 'claude-opus-5',
  max_tokens: 16000,
  output_config: { effort: 'medium' },
  system: INSTRUCCIONES,
  messages: [{ role: 'user', content: `Título: ${noticia.title}\n\n${sinEtiquetas(noticia.contents)}` }],
})
const texto = r.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
const t = JSON.parse(texto.slice(texto.indexOf('{'), texto.lastIndexOf('}') + 1))

console.log('ASÍ QUEDARÍA EN DISCORD')
console.log('─'.repeat(66))
console.log(`📰 ${t.titulo}`)
console.log('')
console.log(t.resumen)
console.log('')
for (const p of t.puntos) console.log(`› ${p}`)
console.log('')
console.log(`Noticia oficial de AION 2 · traducida automáticamente · #${noticia.gid}`)
console.log('─'.repeat(66))
console.log(`\ntokens: ${r.usage.input_tokens} de entrada, ${r.usage.output_tokens} de salida`)
