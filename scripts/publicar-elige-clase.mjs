// Rellena el mensaje de 『🎯』elige-tu-clase editando el webhook que lo publicó,
// para que las reacciones y los roles ya repartidos no se pierdan.
import fs from 'node:fs'

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
const clase = (emoji, nombre, papel) => `<:${emoji}:${EMOJI[emoji]}> **${nombre}**\n${papel}`
const INVISIBLE = '​'   // hueco que fuerza a Discord a poner las familias de dos en dos

const embed = {
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

const TOPIC = 'Reacciona con tu clase de Aion 2 y se te dará el rol. Puedes cambiar cuando quieras: quita la reacción y pon otra.'

const webhooks = await (await fetch(`https://discord.com/api/v10/channels/${CANAL}/webhooks`, { headers: H })).json()
const wh = webhooks.find((w) => w.id === WEBHOOK)
if (!wh?.token) { console.error('IMPBOT no alcanza el webhook que publicó el mensaje'); process.exit(1) }

const res = await fetch(`https://discord.com/api/v10/webhooks/${wh.id}/${wh.token}/messages/${MENSAJE}`, {
  method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }),
})
if (!res.ok) { console.error('ERROR ' + res.status + ' ' + await res.text()); process.exit(1) }
console.log('mensaje actualizado')

await fetch(`https://discord.com/api/v10/channels/${CANAL}`, {
  method: 'PATCH', headers: { ...H, 'X-Audit-Log-Reason': 'descripción del canal' }, body: JSON.stringify({ topic: TOPIC }),
})

// comprobación de verdad: releer el mensaje del canal, no fiarse de la respuesta del PATCH
const [leido] = await (await fetch(`https://discord.com/api/v10/channels/${CANAL}/messages?limit=1`, { headers: H })).json()
const e = leido.embeds[0]
console.log('')
console.log('COMPROBADO EN EL SERVIDOR')
console.log('  título: ' + e.title)
console.log('  familias: ' + e.fields.filter((f) => f.name !== INVISIBLE).map((f) => f.name.trim()).join(' · '))
console.log('  descripción del canal: ' + (await (await fetch(`https://discord.com/api/v10/channels/${CANAL}`, { headers: H })).json()).topic)
console.log('')
const total = (leido.reactions ?? []).reduce((n, r) => n + r.count, 0)
console.log(`  reacciones: ${(leido.reactions ?? []).map((r) => r.emoji.name + ' ×' + r.count).join(' · ')}`)
console.log(`  total ${total} reacciones intactas`)
