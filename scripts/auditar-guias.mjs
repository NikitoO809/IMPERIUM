// Revisa lo publicado en el foro contra lo que sabemos ahora del juego.
// No cambia nada: solo señala lo que hay que mirar.
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN }
const FORO = '1542632433499901992'

// Lo que se dio por bueno antes y ahora sabemos que no lo es.
//
// Ojo con «Stigma»: desde que las guías distinguen los dos árboles, la palabra
// aparece a propósito y bien usada. Solo es un error cuando llama «stigma» a una
// mejora, que es como se escribía antes: «el stigma de 16 puntos».
const AVISOS = [
  [/\d+\s?p\b(?!x)|\d+\s+puntos\b/i, 'GRAVE', 'habla de PUNTOS: los números son niveles de habilidad'],
  [/\b(el|los|un|unos|su|sus)\s+stigmas?\s+de\b|\bstigmas?\s+de\s+\d+/i, 'GRAVE',
   'llama «stigma» a una mejora (el Stigma es el otro árbol de habilidades)'],
  [/seis tableros|6 tableros/i, 'GRAVE', 'son OCHO tableros, no seis'],
  [/resetear.{0,20}pag|pagando/i, 'GRAVE', 'resetear es gratis'],
  [/nivel 20 de personaje/i, 'GRAVE', 'la tercera ranura va por nivel de HABILIDAD, no de personaje'],
  [/tres activas|3 activas|solo puedes (llevar|poner) tres/i, 'MEJORABLE', 'se puede añadir que las ranuras se abren a nivel 8, 12 y 20 de la habilidad'],
  [/probabilidad de (aturdir|derribar|enraizar|sellar|congelar)/i, 'MEJORABLE', 'conviene avisar de que esas mejoras no sirven en PvE'],
]

const activos = await (await fetch(`https://discord.com/api/v10/guilds/${env.DISCORD_GUILD_ID}/threads/active`, { headers: AUTH })).json()
const hilos = (activos.threads ?? []).filter((t) => t.parent_id === FORO)

let graves = 0, mejorables = 0
for (const t of hilos) {
  const ms = (await (await fetch(`https://discord.com/api/v10/channels/${t.id}/messages?limit=20`, { headers: AUTH })).json()).reverse()
  const hallazgos = []
  ms.forEach((m, i) => {
    // Se mira línea a línea, y se saltan las del Daevanion: ahí los puntos SON
    // puntos (lo que cuesta completar cada tablero), no niveles de habilidad.
    const lineas = (m.content ?? '').split('\n')
      .filter((l) => !/daevanion|nezekan|zikel|vaizel|triniel|ariel|azphel|marchutan|yustiel|tablero/i.test(l))
    for (const [re, nivel, que] of AVISOS) {
      const linea = lineas.find((l) => re.test(l))
      if (linea) hallazgos.push({ nivel, que, i: i + 1, muestra: linea.match(re)[0] })
    }
  })
  if (!hallazgos.length) { console.log(`ok   ${t.name}`); continue }
  console.log(`\n>>>  ${t.name}`)
  for (const h of hallazgos) {
    console.log(`     [${h.nivel}] mensaje ${h.i}: ${h.que}   («${h.muestra}»)`)
    h.nivel === 'GRAVE' ? graves++ : mejorables++
  }
}

console.log('')
console.log(`${graves} cosas graves · ${mejorables} mejorables`)
