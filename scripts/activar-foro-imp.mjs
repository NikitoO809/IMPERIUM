// Deja listo el foro 『📌』foro-imp: etiquetas, directrices, orden y publicación de arranque.
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = {
  Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN,
  'Content-Type': 'application/json',
  'X-Audit-Log-Reason': 'Puesta en marcha del foro de guias',
}
const FORO = '1542632433499901992'

const EMOJI = {
  Templar: '1541674638776606811', Gladiator: '1541674524884475925',
  Ranger: '1541674552571076658', Assassin: '1541674437764587570',
  Sorcerer: '1541674581016838145', Summoner: '1541674609429192825',
  Cleric: '1541674499445882920', Chanter: '1541674470320775248',
}

// primero las ocho clases, luego el tipo de contenido
const ETIQUETAS = [
  { name: 'Templar', emoji_id: EMOJI.Templar, emoji_name: null, moderated: false },
  { name: 'Gladiator', emoji_id: EMOJI.Gladiator, emoji_name: null, moderated: false },
  { name: 'Ranger', emoji_id: EMOJI.Ranger, emoji_name: null, moderated: false },
  { name: 'Assassin', emoji_id: EMOJI.Assassin, emoji_name: null, moderated: false },
  { name: 'Sorcerer', emoji_id: EMOJI.Sorcerer, emoji_name: null, moderated: false },
  { name: 'Spiritmaster', emoji_id: EMOJI.Summoner, emoji_name: null, moderated: false },
  { name: 'Cleric', emoji_id: EMOJI.Cleric, emoji_name: null, moderated: false },
  { name: 'Chanter', emoji_id: EMOJI.Chanter, emoji_name: null, moderated: false },
  { name: 'Build', emoji_id: null, emoji_name: '🧬', moderated: false },
  { name: 'PvE', emoji_id: null, emoji_name: '🗺️', moderated: false },
  { name: 'PvP', emoji_id: null, emoji_name: '🏆', moderated: false },
  { name: 'Vídeo', emoji_id: null, emoji_name: '🎥', moderated: false },
  { name: 'Oficial', emoji_id: null, emoji_name: '✅', moderated: true }, // solo la ponen los oficiales
]

const DIRECTRICES = `Guías, builds y todo lo que ayude a jugar mejor a Aion 2.

**Cómo publicar aquí**
1. Título claro: qué clase, qué contenido y para qué sirve. «Build de Cleric para mazmorras» se encuentra; «mi build» no.
2. Etiqueta la publicación con tu clase y con el tipo. Sin etiquetas no te va a encontrar nadie.
3. Si es un vídeo, pega el enlace y resume en dos líneas de qué va.

Para responder se comenta dentro de la publicación, no se abre una nueva.
La etiqueta ✅ Oficial la ponen los oficiales sobre las guías ya revisadas.`

// REQUIRE_TAG: obliga a etiquetar al publicar, que es lo que hace que el filtro sirva
const FLAG_ETIQUETA_OBLIGATORIA = 1 << 4

// Paso 1: las etiquetas y el resto de ajustes. La etiqueta obligatoria NO puede ir
// aqui: Discord la valida contra las etiquetas viejas (ninguna) y rechaza la peticion.
const res = await fetch(`https://discord.com/api/v10/channels/${FORO}`, {
  method: 'PATCH', headers: H,
  body: JSON.stringify({
    topic: DIRECTRICES,
    available_tags: ETIQUETAS,
    default_sort_order: 0,                              // por actividad reciente
    default_forum_layout: 1,                            // lista: se leen los titulos
    default_reaction_emoji: { emoji_id: null, emoji_name: '⭐' },
    default_thread_rate_limit_per_user: 0,
  }),
})
if (!res.ok) { console.error('ERROR ' + res.status + ' ' + await res.text()); process.exit(1) }
const foro = await res.json()
console.log('foro configurado')
console.log('  etiquetas: ' + foro.available_tags.map((t) => t.name).join(' · '))

// Paso 2: ahora que ya existen, se puede exigir que toda publicacion lleve alguna
const obliga = await fetch(`https://discord.com/api/v10/channels/${FORO}`, {
  method: 'PATCH', headers: H, body: JSON.stringify({ flags: FLAG_ETIQUETA_OBLIGATORIA }),
})
console.log('  etiquetar al publicar es obligatorio: ' + (obliga.ok ? 'si' : 'no (' + obliga.status + ')'))

// publicacion de arranque, que ademas hace de plantilla
const tag = (n) => foro.available_tags.find((t) => t.name === n)?.id
const arranque = await fetch(`https://discord.com/api/v10/channels/${FORO}/threads`, {
  method: 'POST', headers: H,
  body: JSON.stringify({
    name: '📌 Cómo publicar una guía aquí',
    applied_tags: [tag('Oficial')].filter(Boolean),
    message: {
      embeds: [{
        color: 0xc9a227,
        title: '📌 Cómo publicar una guía aquí',
        description: 'Este foro es para dejar por escrito lo que sabemos: guías de clase, builds, rutas de subida, mazmorras y PvP.\n\n'
          + 'Copia esta plantilla al abrir tu publicación y rellénala. No hace falta que sea larga: una build bien explicada en diez líneas vale más que tres páginas.',
        fields: [
          { name: 'Plantilla', value: '```\n**Para quién es**\nNivel, clase y tipo de contenido.\n\n**La build / la ruta**\nHabilidades, estadísticas o pasos.\n\n**Por qué funciona**\nDos o tres líneas.\n\n**Qué NO hacer**\nLos fallos típicos.\n```' },
          { name: 'Antes de darle a publicar', value: '• ¿El título dice la clase y el contenido?\n• ¿Has puesto la etiqueta de tu clase y la del tipo?\n• ¿Se entiende sin haber leído otra guía?' },
        ],
        footer: { text: 'IMPERIUM · las guías revisadas llevan la etiqueta ✅ Oficial' },
      }],
    },
  }),
})
if (!arranque.ok) { console.error('la publicacion de arranque fallo: ' + arranque.status + ' ' + await arranque.text()); process.exit(1) }
const hilo = await arranque.json()
console.log('  publicacion de arranque: ' + hilo.name)

// fijarla arriba del todo
const fijar = await fetch(`https://discord.com/api/v10/channels/${hilo.id}`, {
  method: 'PATCH', headers: H, body: JSON.stringify({ flags: 1 << 1 }),
})
console.log('  fijada arriba: ' + (fijar.ok ? 'si' : 'no (' + fijar.status + ')'))

// comprobacion contra el servidor
const final = await (await fetch(`https://discord.com/api/v10/channels/${FORO}`, { headers: H })).json()
console.log('')
console.log('COMPROBADO')
console.log('  directrices: ' + (final.topic ? final.topic.split('\n')[0] + '…' : 'VACIAS'))
console.log('  etiquetas: ' + final.available_tags.length)
console.log('  etiqueta obligatoria al publicar: ' + ((final.flags & FLAG_ETIQUETA_OBLIGATORIA) ? 'si' : 'no'))
console.log('  reaccion por defecto: ' + (final.default_reaction_emoji?.emoji_name ?? 'ninguna'))
