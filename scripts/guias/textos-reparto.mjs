// Escribe el mensaje de reparto PvE/PvP de cada clase a partir de listas-negras.json
// y lo mete como ultima seccion de su guion, para poder actualizarlo con
// scripts/actualizar-guia.mjs sin tocar el resto de la guia.
//
// Va en dos mitades, como el diagrama: en Mastery eliges tres mejoras, en Stigma
// no eliges ninguna — decides hasta que nivel subes cada Stigma.
//
// Uso: node scripts/guias/textos-reparto.mjs
import fs from 'node:fs'
import path from 'node:path'

const AQUI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const DATOS = JSON.parse(fs.readFileSync(path.join(AQUI, 'listas-negras.json'), 'utf8'))

// la clase se llama Spiritmaster; 'elementalist' es solo su id interno
const GUION = {
  gladiator: 'guion-gladiator.json', templar: 'guion-templar.json',
  assassin: 'guion-assassin.json', ranger: 'guion-ranger.json',
  sorcerer: 'guion-sorcerer.json', elementalist: 'guion-spiritmaster.json',
  cleric: 'guion-cleric.json', chanter: 'guion-chanter.json',
}
const IMAGEN = {
  gladiator: 'g9-reparto.png', templar: 't9-reparto.png', assassin: 'a9-reparto.png',
  ranger: 'r9-reparto.png', sorcerer: 's9-reparto.png', elementalist: 'e9-reparto.png',
  cleric: 'c9-reparto.png', chanter: 'h9-reparto.png',
}
const ANADIDO = {
  gladiator: 'anadido-reparto-gladiator.json', templar: 'anadido-reparto-templar.json',
  assassin: 'anadido-reparto-assassin.json', ranger: 'anadido-reparto-ranger.json',
  sorcerer: 'anadido-reparto-sorcerer.json', elementalist: 'anadido-reparto-elementalist.json',
  cleric: 'anadido-reparto-cleric.json', chanter: 'anadido-reparto-chanter.json',
}

const LIMITE = 2000                       // lo que deja Discord en un mensaje
const TOPE_EFECTO = 54                    // el resto se lee en la imagen
const BOLA = { inutilPve: '🔴', valenSiempre: '🟢', soloPvp: '🔵' }

const corto = (t, tope = TOPE_EFECTO) => (t.length <= tope ? t
  : t.slice(0, tope).replace(/\s+\S*$/, '') + '…')
const linea = (m) => `· \`${m.habilidad}\` **nv. ${m.nivel}** — ${corto(m.efecto)}`

function lista(mejoras, maxLineas) {
  const filas = mejoras.slice(0, maxLineas).map(linea)
  const resto = mejoras.length - maxLineas
  if (resto > 0) filas.push(`· …y ${resto} más: están todas en la imagen.`)
  return filas.join('\n')
}

// las de PvP se agrupan por motivo: son muchas y casi todas dicen lo mismo
function porMotivo(mejoras) {
  const grupos = new Map()
  for (const m of mejoras) {
    const k = m.motivo ?? 'de PvP'
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k).push(`\`${m.habilidad}\` nv. ${m.nivel}`)
  }
  return [...grupos].map(([motivo, cuales]) => `· **${motivo}** — ${cuales.join(' · ')}`).join('\n')
}

// una Stigma = su escalera, que es lo unico que hay que decidir
function escalera(st) {
  const peldanos = st.mejoras
    .filter((m) => m.tipo !== 'otra')
    .map((m) => `${BOLA[m.tipo]} nv. ${m.nivel}`)
    .join(' · ')
  return `· \`${st.habilidad}\` — ${peldanos}`
}

function texto(clase, maxLineas) {
  const { mastery: ma, stigma: st } = DATOS[clase]
  const p = []
  p.push('**Reparto para PvE y para PvP**')
  p.push('Antes de gastar nada, lee **«Cómo subir tus habilidades»**: ahí está la regla que separa los dos modos.')

  p.push('__**Mastery — aquí eliges**__\nCinco mejoras por habilidad y solo caben **tres** ' +
         '(las ranuras se abren a nivel 8, 12 y 20). Aquí sí decides qué dejar fuera.')

  const cuenta = (n, una, varias) => (n === 1 ? una : varias.replace('%d', n))

  if (ma.inutilPve.length) {
    p.push(`**${cuenta(ma.inutilPve.length, 'Esta no hace', 'Estas %d no hacen')} NADA en PvE**, porque ` +
           'contra un PNJ el estado ya entra al 100% y subir su probabilidad es pasar de 100% a 100%. ' +
           'En PvP, de las mejores:')
    p.push(lista(ma.inutilPve, maxLineas))
  }
  if (ma.valenSiempre.length) {
    p.push(`**${cuenta(ma.valenSiempre.length, 'Esta vale', 'Estas %d valen')} siempre**, juegues a lo ` +
           'que juegues: daño o aguante en los dos modos a la vez.')
    p.push(lista(ma.valenSiempre, maxLineas))
  }
  if (ma.soloPvp.length) {
    p.push(`**Y ${cuenta(ma.soloPvp.length, 'esta es la de PvP', 'estas %d son las de PvP')}**: no suben ` +
           'probabilidad, pasan por encima del bloqueo y la evasión, rompen el escudo o le bajan la curación.')
    p.push(porMotivo(ma.soloPvp))
  }

  if (st.length) {
    p.push('__**Stigma — aquí no eliges**__\nUna Stigma se queda con **todas** las mejoras que ' +
           'desbloquee (nivel 5, 10, 15, 20 y 25) y sube hasta 25. Así que no eliges mejora: eliges ' +
           '**qué Stigma equipas y hasta dónde la subes**. 🟢 vale siempre · 🔴 en PvE no hace nada · 🔵 PvP:')
    p.push(st.slice(0, maxLineas + 2).map(escalera).join('\n'))
    if (st.length > maxLineas + 2) p.push(`…y ${st.length - maxLineas - 2} Stigma más, en la imagen.`)
  }

  p.push('⚠️ Resetear es gratis, así que prueba repartos sin miedo.')
  p.push('—\nDatos del volcado del cliente (aion2t.com), comprobados contra capturas del juego. Que las ' +
         'de bloqueo, escudo y curación pesen más en PvP es criterio propio.')
  return p.join('\n\n')
}

// si el mensaje se pasa del limite se van quitando lineas: siguen estando en la imagen
function ajustado(clase) {
  let t = ''
  for (let n = 9; n >= 2; n--) {
    t = texto(clase, n)
    if (t.length <= LIMITE) return { t, n }
  }
  return { t, n: 2 }
}

let aviso = 0
for (const clase of Object.keys(GUION)) {
  if (!DATOS[clase]) { console.log(`${clase.padEnd(14)} sin datos todavía`); continue }
  const { t, n } = ajustado(clase)
  const seccion = { archivo: IMAGEN[clase], texto: t }

  fs.writeFileSync(path.join(AQUI, ANADIDO[clase]), JSON.stringify([seccion], null, 1), 'utf8')

  const ruta = path.join(AQUI, GUION[clase])
  const g = JSON.parse(fs.readFileSync(ruta, 'utf8'))
  const i = g.secciones.findIndex((s) => s.archivo === IMAGEN[clase])
  if (i >= 0) g.secciones[i] = seccion
  else g.secciones.push(seccion)
  fs.writeFileSync(ruta, JSON.stringify(g, null, 1), 'utf8')

  const marca = t.length > LIMITE ? '  ¡SE PASA DEL LÍMITE DE DISCORD!' : ''
  if (marca) aviso++
  console.log(`${clase.padEnd(14)} ${String(t.length).padStart(4)} caracteres · hasta ${n} por bloque · ${g.secciones.length} secciones${marca}`)
}
console.log(aviso ? `\n${aviso} clase(s) por encima de ${LIMITE}: hay que acortar` : '\ntodas caben en un mensaje')
