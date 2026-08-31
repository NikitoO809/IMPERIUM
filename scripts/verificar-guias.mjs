// Contrasta lo PUBLICADO en cada guía de clase contra los datos nuevos del cliente
// y señala qué dato concreto se ha caído, mensaje a mensaje.
//
// No cambia nada: solo mira. Comprueba tres cosas de cada habilidad que se cite:
//   · los niveles de mejora ("nv. 16") existen de verdad
//   · las recargas ("(150 s)") coinciden
//   · la descripción no ha cambiado desde la versión con la que se escribió
//
// Uso: node scripts/verificar-guias.mjs [clase]
import fs from 'node:fs'

const SOLO = process.argv[2]?.toLowerCase()
const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN }
const FORO = '1542632433499901992'

const CLASES = {
  gladiator: 'Gladiator', templar: 'Templar', assassin: 'Assassin', ranger: 'Ranger',
  sorcerer: 'Sorcerer', elementalist: 'Spiritmaster', cleric: 'Cleric', chanter: 'Chanter',
}

const norm = (t) => (t ?? '').split('\\').join('').replace(/\s+/g, ' ').trim().toLowerCase()

// El daño base cambia en casi todas las habilidades y no dice nada por sí solo
// (escala con nivel y equipo). Para saber si el TEXTO cambió, se quita.
const sinDano = (t) => norm(t).replace(/\d[\d,.]*-\d[\d,.]* damage/g, '§')

// Reescrituras de estilo que el juego hace y no cambian nada («deal» -> «deals»)
const RUIDO = new Set([
  'the', 'a', 'an', 'of', 'and', 'to', 'for', 'on', 'is', 'becomes', 'its',
  'deal', 'deals', 'move', 'moves', 'select', 'selects', 'rush', 'rushes',
  'inflict', 'inflicts', 'restore', 'restores', 'increase', 'increases',
  'reduce', 'reduces', 'remove', 'removes', 'grant', 'grants', 'change', 'changes',
  'target', "target's", 'enemy', "enemy's", 'caster', "caster's",
])
const soloRedaccion = (fuera, dentro) => [...fuera, ...dentro]
  .every((p) => RUIDO.has(p.replace(/[.,;:]/g, '')) || /^[.,;:[\]§]+$/.test(p))

// Qué palabras entran y salen, para ver de un vistazo si el cambio importa
function diffPalabras(a, b) {
  const pa = sinDano(a).split(' '), pb = sinDano(b).split(' ')
  const ca = new Map(), cb = new Map()
  for (const p of pa) ca.set(p, (ca.get(p) ?? 0) + 1)
  for (const p of pb) cb.set(p, (cb.get(p) ?? 0) + 1)
  const fuera = [], dentro = []
  for (const [p, n] of ca) if (n > (cb.get(p) ?? 0)) fuera.push(...Array(n - (cb.get(p) ?? 0)).fill(p))
  for (const [p, n] of cb) if (n > (ca.get(p) ?? 0)) dentro.push(...Array(n - (ca.get(p) ?? 0)).fill(p))
  return { fuera, dentro }
}

function fichas(clase, fichero) {
  const f = `scripts/data/${fichero}-${clase}.json`
  if (!fs.existsSync(f)) return null
  const m = new Map()
  for (const k of JSON.parse(fs.readFileSync(f, 'utf8'))) {
    const cuantas = (k.specialty ?? k.stigmas ?? []).length
    const antes = m.get(k.nombre)
    if (!antes || cuantas > ((antes.specialty ?? antes.stigmas ?? []).length)) m.set(k.nombre, k)
  }
  return m
}

const activos = await (await fetch(`https://discord.com/api/v10/guilds/${env.DISCORD_GUILD_ID}/threads/active`, { headers: AUTH })).json()
const hilos = (activos.threads ?? []).filter((t) => t.parent_id === FORO)

let totalFallos = 0, totalRevisar = 0, menores = 0
for (const [clase, titulo] of Object.entries(CLASES)) {
  if (SOLO && clase !== SOLO) continue
  const nuevo = fichas(clase, 'skills-t')
  if (!nuevo) { console.log(`\n${titulo}: sin datos nuevos todavía`); continue }
  const viejo = fichas(clase, 'skills')

  const hilo = hilos.find((t) => t.name.includes(titulo))
  if (!hilo) { console.log(`\n${titulo}: no encuentro la publicación`); continue }
  const ms = (await (await fetch(`https://discord.com/api/v10/channels/${hilo.id}/messages?limit=50`, { headers: AUTH })).json()).reverse()

  console.log(`\n═══ ${hilo.name} ═══`)
  for (const [i, m] of ms.entries()) {
    const texto = m.content ?? ''
    const avisos = []

    // Ojo con los nombres que son trozo de otro («Burst» dentro de «Frost Burst»,
    // «Corrode» dentro de «Jointstrike: Corrode»): solo cuentan si aparecen solos.
    const todas = [...nuevo.keys()].filter((n) => n.length >= 5 && texto.includes(n))
    const citadas = todas.filter((n) => {
      const contenedores = todas.filter((o) => o !== n && o.includes(n))
      if (!contenedores.length) return true
      const suyas = texto.split(n).length - 1
      const ajenas = contenedores.reduce((a, o) => a + (texto.split(o).length - 1) * (o.split(n).length - 1), 0)
      return suyas > ajenas
    })

    // Los niveles y recargas se buscan SOLO en el trozo que habla de esa habilidad:
    // hasta que empieza a hablar de otra. Si no, se cruzan entre líneas vecinas.
    for (const linea of texto.split('\n')) {
      // Dentro de la línea gana el nombre más largo: si aparece «Empyrean Lord's
      // Punishment», ese trozo no es de «Punishment» aunque lo contenga.
      const aqui = citadas
        .map((n) => ({ n, i: linea.indexOf(n) }))
        .filter((x) => x.i >= 0)
        .filter((x, _, todos) => !todos.some((o) =>
          o.n !== x.n && o.n.includes(x.n) && x.i >= o.i && x.i + x.n.length <= o.i + o.n.length))
        .sort((a, b) => a.i - b.i)

      for (const [j, { n, i }] of aqui.entries()) {
        const k = nuevo.get(n)
        const hasta = aqui[j + 1]?.i ?? linea.length
        const trozo = linea.slice(i, hasta)

        for (const mm of trozo.matchAll(/nv\.?\s*(\d+)|nivel\s+(\d+)/gi)) {
          const nv = Number(mm[1] ?? mm[2])
          if ((k.specialty ?? []).length && !k.specialty.some((s) => s.nivel === nv)) {
            avisos.push(`NIVEL   ${n} nv.${nv} no existe · tiene: ${(k.specialty ?? []).map((s) => s.nivel).join(', ')}`)
          }
        }
        const cd = trozo.match(/\((\d+)\s*s\)/)
        if (cd && k.cooldown && Number(cd[1]) !== Number(String(k.cooldown).replace('s', ''))) {
          avisos.push(`RECARGA ${n} dice ${cd[1]}s y ahora es ${k.cooldown}`)
        }
      }
    }

    // Y aparte: si el TEXTO de una habilidad citada cambió (no solo su daño base),
    // lo que la guía diga de ella hay que releerlo.
    for (const n of citadas) {
      const k = nuevo.get(n), v = viejo?.get(n)
      if (!v?.descripcion || !k.descripcion) continue
      if (sinDano(v.descripcion) === sinDano(k.descripcion)) continue
      const { fuera, dentro } = diffPalabras(v.descripcion, k.descripcion)
      if (soloRedaccion(fuera, dentro)) { menores++; continue }   // «deal» -> «deals»: da igual
      avisos.push(`REVISAR ${n}:  − ${fuera.join(' ') || '(nada)'}   →   + ${dentro.join(' ') || '(nada)'}`)
    }

    if (!avisos.length) { console.log(`  ok  ${i + 1}. ${texto.split('\n')[0].slice(0, 58)}`); continue }
    console.log(`  >>  ${i + 1}. ${texto.split('\n')[0].slice(0, 58)}`)
    for (const a of [...new Set(avisos)]) {
      console.log(`        ${a}`)
      if (a.startsWith('NIVEL') || a.startsWith('RECARGA')) totalFallos++
      if (a.startsWith('REVISAR')) totalRevisar++
    }
  }
}
console.log(`\n${totalFallos} datos que no cuadran · ${totalRevisar} textos que hay que releer · ` +
            `${menores} cambios de pura redacción, ignorados`)
