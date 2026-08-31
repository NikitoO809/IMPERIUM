// Pone las etiquetas y la reacción del foro 『⚔️』comunidad-aion.
//
// Sigue el mismo criterio que 『📖』guía-de-clases: las clases sin emoji, los
// tipos de tema con emoji, y se repiten los emojis que allí ya significan algo
// (🧬 build, 🏆 PvP, 🗺️ PvE, 🎥 vídeo) para que se lean igual en los dos foros.
//
// Uso: node scripts/etiquetas-comunidad.mjs [--aplicar]
import fs from 'node:fs'

const CANAL = '1543646914170454136'
const APLICAR = process.argv.includes('--aplicar')

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN, 'Content-Type': 'application/json' }

const et = (name, emoji = null, moderated = false) => ({ name, moderated, emoji_name: emoji, emoji_id: null })

const ETIQUETAS = [
  // de qué va el tema
  et('Duda', '💬'),
  et('Build', '🧬'),
  et('Buscar grupo', '🤝'),
  et('PvE', '🗺️'),
  et('PvP', '🏆'),
  et('Legión', '🛡️'),
  et('Vídeo', '🎥'),
  et('Off-topic', '☕'),
  et('Resuelto', '✅'),
  // y de qué clase, sin emoji, como en la guía
  et('Gladiator'), et('Templar'), et('Assassin'), et('Ranger'),
  et('Sorcerer'), et('Spiritmaster'), et('Cleric'), et('Chanter'),
]

// ⭐ ya significa «guía buena» en el otro foro; aquí el botón es para apoyar un tema
const REACCION = { emoji_name: '👍', emoji_id: null }

console.log(`foro: ${CANAL}`)
console.log(`\n${ETIQUETAS.length} etiquetas (el tope de Discord son 20):\n`)
for (const t of ETIQUETAS) {
  console.log(`   ${(t.emoji_name ?? ' ').padEnd(3)} ${t.name}${t.moderated ? '   (solo moderadores)' : ''}`)
}
console.log(`\nreacción rápida en cada tema: ${REACCION.emoji_name}`)

if (!APLICAR) { console.log('\n(simulación: añade --aplicar)'); process.exit(0) }

const r = await fetch(`https://discord.com/api/v10/channels/${CANAL}`, {
  method: 'PATCH',
  headers: AUTH,
  body: JSON.stringify({ available_tags: ETIQUETAS, default_reaction_emoji: REACCION }),
})
if (!r.ok) { console.error(`FALLO ${r.status}: ${(await r.text()).slice(0, 400)}`); process.exit(1) }
const c = await r.json()
console.log(`\nhecho: ${c.available_tags.length} etiquetas puestas en ${c.name}`)
