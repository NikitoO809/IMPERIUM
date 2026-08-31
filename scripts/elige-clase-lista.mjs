// Pasa 『🎯』elige-tu-clase al diseño de lista: las ocho clases en una columna,
// nombre y papel, sin partirlas por familia.
//
// Edita el mensaje que ya existe (a través del webhook que lo publicó), así que
// las reacciones y los roles ya repartidos NO se pierden.
//
//   node scripts/elige-clase-lista.mjs            (simula: enseña cómo queda)
//   node scripts/elige-clase-lista.mjs --aplicar
//   node scripts/elige-clase-lista.mjs --revertir (vuelve al de familias)
import fs from 'node:fs'

const APLICAR = process.argv.includes('--aplicar')
const REVERTIR = process.argv.includes('--revertir')

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN, 'Content-Type': 'application/json' }

const CANAL = '1541669793197727835'
const MENSAJE = '1541693246323957810'
const WEBHOOK = '1541681841369784390'

// el emoji del servidor sigue llamándose Summoner, pero la clase es Spiritmaster
const EMOJI = {
  Templar: '1541674638776606811', Gladiator: '1541674524884475925',
  Ranger: '1541674552571076658', Assassin: '1541674437764587570',
  Sorcerer: '1541674581016838145', Summoner: '1541674609429192825',
  Cleric: '1541674499445882920', Chanter: '1541674470320775248',
}

// El orden es el de las familias del juego, aunque ya no se escriban:
// guerreros, exploradores, magos y sacerdotes.
const CLASES = [
  ['Templar', 'Templar', 'Tanque'],
  ['Gladiator', 'Gladiator', 'Daño cuerpo a cuerpo'],
  ['Ranger', 'Ranger', 'Daño a distancia'],
  ['Assassin', 'Assassin', 'Daño explosivo'],
  ['Sorcerer', 'Sorcerer', 'Daño mágico'],
  ['Summoner', 'Spiritmaster', 'Invocador'],
  ['Cleric', 'Cleric', 'Sanador'],
  ['Chanter', 'Chanter', 'Soporte'],
]

const lista = CLASES.map(([em, n, rol]) => `<:${em}:${EMOJI[em]}> **${n}** · ${rol}`).join('\n')

const LISTA = {
  color: 0xc9a227,
  title: 'Elige tu clase',
  description: `Reacciona con la tuya y te doy el rol.\n\n${lista}`,
}

// Por si hay que dar marcha atrás: el de familias, tal cual estaba.
const clase = (em, n, papel) => `<:${em}:${EMOJI[em]}> **${n}**\n${papel}`
const INVISIBLE = '​'
const FAMILIAS = {
  color: 0xc9a227,
  title: '🎯 ELIGE TU CLASE',
  description: 'Las ocho clases de **Aion 2**, por familia. Reacciona aquí abajo con la tuya y se te dará el rol.\n\n'
    + 'Puedes cambiar cuando quieras: quita la reacción y pon otra.',
  fields: [
    { name: '🛡️  Guerrero', inline: true, value: clase('Templar', 'Templar', 'Tanque') + '\n' + clase('Gladiator', 'Gladiator', 'Daño cuerpo a cuerpo') },
    { name: '🏹  Explorador', inline: true, value: clase('Ranger', 'Ranger', 'Daño a distancia') + '\n' + clase('Assassin', 'Assassin', 'Daño explosivo') },
    { name: INVISIBLE, value: INVISIBLE, inline: true },
    { name: '✨  Mago', inline: true, value: clase('Sorcerer', 'Sorcerer', 'Daño mágico') + '\n' + clase('Summoner', 'Spiritmaster', 'Invocador') },
    { name: '💚  Sacerdote', inline: true, value: clase('Cleric', 'Cleric', 'Sanador') + '\n' + clase('Chanter', 'Chanter', 'Soporte') },
  ],
  footer: { text: 'IMPERIUM · Aion 2 · sale el 5 de octubre' },
}

const embed = REVERTIR ? FAMILIAS : LISTA

console.log(`\nva a quedar así  (${REVERTIR ? 'el de familias, marcha atrás' : 'lista'}):\n`)
console.log(`  ${embed.title}`)
for (const linea of embed.description.split('\n')) console.log(`  ${linea.replace(/<:(\w+):\d+>/g, '[$1]').replace(/\*\*/g, '')}`)
if (embed.footer) console.log(`  ${embed.footer.text}`)

if (!APLICAR && !REVERTIR) { console.log('\n(simulación: añade --aplicar para cambiarlo)\n'); process.exit(0) }

const webhooks = await (await fetch(`https://discord.com/api/v10/channels/${CANAL}/webhooks`, { headers: H })).json()
const wh = webhooks.find((w) => w.id === WEBHOOK)
if (!wh?.token) { console.error('\nIMPBOT no alcanza el webhook que publicó el mensaje'); process.exit(1) }

const res = await fetch(`https://discord.com/api/v10/webhooks/${wh.id}/${wh.token}/messages/${MENSAJE}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ embeds: [embed] }),
})
if (!res.ok) { console.error(`\nERROR ${res.status}: ${(await res.text()).slice(0, 300)}`); process.exit(1) }

// No fiarse del PATCH: releer el mensaje del canal y contar las reacciones.
const leido = await (await fetch(`https://discord.com/api/v10/channels/${CANAL}/messages/${MENSAJE}`, { headers: H })).json()
const e = leido.embeds[0]
const reacciones = leido.reactions ?? []
const total = reacciones.reduce((n, r) => n + r.count, 0)

console.log('\nCOMPROBADO EN EL SERVIDOR')
console.log(`  título:  ${e.title}`)
console.log(`  líneas:  ${e.description.split('\n').filter(Boolean).length}`)
console.log(`  campos:  ${e.fields?.length ?? 0}`)
console.log(`  reacciones: ${reacciones.map((r) => r.emoji.name + ' ×' + r.count).join(' · ')}`)
console.log(`  ${total} reacciones intactas\n`)
