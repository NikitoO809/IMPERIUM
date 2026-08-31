// Genera la propuesta de renombrado de todo el servidor. NO aplica nada:
// escribe scripts/data/propuesta-estilo.json para revisarla antes.
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const H = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN }

// ---------- versalitas: se ven igual en movil y en PC ----------
const VERSALITA = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
  s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
}
const versalitas = (s) => [...s.toLowerCase()].map((c) => VERSALITA[c] ?? c).join('')

// los emojis ocupan el doble de ancho que una letra
const ancho = (s) => [...s].reduce((n, c) => n + (c.codePointAt(0) > 0x2100 ? 2 : 1), 0)

// El marco se encoge segun lo largo que sea el nombre, para que no se corte.
function marco(nombre, emoji) {
  const n = versalitas(nombre)
  if (ancho(n) <= 11) return `╭─═${emoji}═─ ${n} ─═${emoji}═─╮`
  if (ancho(n) <= 17) return `╭═${emoji}═ ${n} ═${emoji}═╮`
  return `╭─ ${n} ─╮`
}

// ---------- limpieza de los nombres que ya vienen decorados ----------
const DESVERSALITA = Object.fromEntries(Object.entries(VERSALITA).map(([k, v]) => [v, k]))
const BANDERAS = { '🇷🇺': 'ru', '🇪🇸': 'es', '🇬🇧': 'eng', '🇺🇸': 'eng', '🇧🇷': 'br', '🇫🇷': 'fr' }

function limpiar(nombre) {
  let s = nombre
  // una bandera identifica el idioma del canal: se guarda como sufijo antes de borrarla
  let idioma = ''
  for (const [bandera, sufijo] of Object.entries(BANDERAS)) {
    if (s.includes(bandera)) { idioma = '-' + sufijo; s = s.replaceAll(bandera, '') }
  }
  s = [...s].map((c) => DESVERSALITA[c] ?? c).join('')
  s = s.normalize('NFKD').normalize('NFC')          // 𝗢𝗥𝗨𝗠 y demas letras de fantasia -> ASCII
  s = s.replace(/\p{Extended_Pictographic}|\p{Regional_Indicator}|[️⃣]/gu, '')
  s = s.replace(/[『』〔〕【】「」\[\]|┃╭╮╰╯─═┈➤・ㅤ]/g, '')
  s = s.replace(/^\s*l\s*[-–]\s*/i, '')            // el prefijo "l-" que usan varios
  s = s.replace(/^[\s\-–_·.:]+|[\s\-–_·.:]+$/g, '')
  s = s.replace(/[\s_]+/g, '-').replace(/-{2,}/g, '-')
  if (idioma && !s.endsWith(idioma)) s += idioma
  return s
}

// ---------- que emoji le toca a cada canal ----------
// El orden manda: gana la primera que encaje. Lo mas especifico va arriba.
const REGLAS = [
  [/welcome|bienvenid/i, '🖐️'], [/regla|norma/i, '📜'],
  [/aplicar|aplicacion|application/i, '📝'],
  [/pvp|torneo|cup|trophy/i, '🏆'], [/raid/i, '🏹'],
  [/elige-tu-clase|roles?$|rolles/i, '🎯'], [/clase|class/i, '📖'],
  [/anuncio|announcement|comunicado|patch-note/i, '📢'], [/noticia|news/i, '🆕'],
  [/stream|video/i, '📺'], [/sorteo|giveaway|cofre/i, '🎁'],
  [/tinder/i, '👀'], [/meme/i, '😂'], [/musica|music/i, '🎬'],
  [/^test$/i, '🧪'], [/log/i, '📋'], [/interface/i, '✨'],
  [/poll|encuesta/i, '📊'], [/round-table|officer|jefe/i, '👑'],
  [/guia|guide|forum|foro/i, '📌'], [/codigo|code/i, '🚀'],
  [/evento|event/i, '🎈'], [/asistencia/i, '✅'], [/contribucion/i, '📥'],
  [/ayuda|dungeon|help/i, '❓'], [/foto|photo/i, '📸'],
  [/verguenza|shame/i, '💀'], [/kvk/i, '⚔️'],
  [/crea|creator|\+/i, '➕'], [/bot/i, '🤖'],
  [/radio|english|voice|sala|general/i, '💬'],
]
// Conservar el emoji que ya tenia es lo suyo, salvo cuando la regla es mas precisa
// (un canal llamado "raid-bot" debe llevar el mismo icono en las cinco categorias).
const MANDA_LA_REGLA = /raid|round-table|officer|elige-tu-clase|anuncio|announcement|comunicado|noticia|news|patch-note|norma|regla|guia|guide|forum|foro|evento|event|pvp|contribucion|codigo|code/i

function emojiDe(original, limpio, tipo) {
  const porRegla = REGLAS.find(([re]) => re.test(limpio))?.[1]
  if (porRegla && MANDA_LA_REGLA.test(limpio)) return tipo === 2 && porRegla === '💬' ? '🎧' : porRegla
  const yaTiene = [...original].find((c) => /\p{Extended_Pictographic}/u.test(c) && c !== '️')
  if (yaTiene) return yaTiene
  if (porRegla) return tipo === 2 && porRegla === '💬' ? '🎧' : porRegla
  return tipo === 2 ? '🎧' : '💬'
}

// ---------- lo que no se toca ----------
const INTOCABLES = [
  ['491545618859425794', 'los cuenta-cifras los reescribe un bot cada pocos minutos'],
  ['1421648222228582450', 'categoria de sistema de TempVoice'],
  ['767823791224782889', 'categoria de logs del staff'],
]
const esIntocable = (c) => INTOCABLES.some(([id]) => c.id === id || c.parent_id === id)
  || /^Terra's Channel$/.test(c.name) || /Channel$/.test(c.name) && c.type === 2 && /'s /.test(c.name)

// ---------- emoji de cada categoria ----------
const EMOJI_CAT = {
  '491546715774648321': '👑', '1539349541092991046': '⚔️', '1515417285047619584': '👺',
  '1511911372441653320': '🗡️', '1425043787759095838': '🔵', '1372677658856390728': '💎',
  '1342229161363640370': '🐗', '1122588361631203349': '🛡️', '1496035418322370610': '🏝️',
  '1298085838353072138': '🏰', '1184755573439348786': '🐉', '1042660691796054106': '🌍',
  '775807960114528277': '🔱',
}
const NOMBRE_CAT = {
  '491546715774648321': 'IMPERIUM', '1539349541092991046': 'AION 2 IMP',
  '1515417285047619584': 'CALL OF DRAGONS', '1511911372441653320': 'SWORDXSTAFF',
  '1425043787759095838': 'BLUE PROTOCOL', '1372677658856390728': 'CRYSTAL OF ATLAN',
  '1342229161363640370': '7DS ORIGIN', '1122588361631203349': 'SCAR OF HONOR',
  '1496035418322370610': 'TARISLAND', '1298085838353072138': 'AGE OF EMPIRES',
  '1184755573439348786': 'REVELATION M', '1042660691796054106': 'TRAHA GLOBAL',
  '775807960114528277': 'WITCHES A3',
}

const canales = await (await fetch(`https://discord.com/api/v10/guilds/${env.DISCORD_GUILD_ID}/channels`, { headers: H })).json()
const cats = canales.filter((c) => c.type === 4).sort((a, b) => a.position - b.position)
const propuesta = []

for (const cat of cats) {
  const saltada = INTOCABLES.find(([id]) => id === cat.id)
  const nuevoCat = saltada ? null : marco(NOMBRE_CAT[cat.id] ?? limpiar(cat.name), EMOJI_CAT[cat.id] ?? '🎮')
  const hijos = canales.filter((c) => c.parent_id === cat.id).sort((a, b) => a.position - b.position)
  propuesta.push({
    tipo: 'categoria', id: cat.id, antes: cat.name,
    despues: nuevoCat, motivo: saltada?.[1] ?? null,
    canales: hijos.map((c) => {
      if (esIntocable(c)) return { id: c.id, antes: c.name, despues: null, motivo: saltada?.[1] ?? 'canal temporal o de sistema', tipo: c.type }
      const base = limpiar(c.name) || 'canal'
      const nombre = c.type === 2 ? base.replace(/-/g, ' ') : base.toLowerCase()
      return { id: c.id, antes: c.name, despues: `『${emojiDe(c.name, base, c.type)}』${nombre}`, tipo: c.type }
    }),
  })
}

fs.mkdirSync('scripts/data', { recursive: true })
fs.writeFileSync('scripts/data/propuesta-estilo.json', JSON.stringify(propuesta, null, 1), 'utf8')

const total = propuesta.flatMap((p) => p.canales).filter((c) => c.despues).length
const saltados = propuesta.flatMap((p) => p.canales).filter((c) => !c.despues).length
console.log(`propuesta escrita: ${propuesta.filter((p) => p.despues).length} categorias y ${total} canales a cambiar, ${saltados} intocables`)
for (const p of propuesta) {
  console.log('')
  console.log((p.despues ?? p.antes + '   [SE QUEDA: ' + p.motivo + ']'))
  for (const c of p.canales) console.log('   ' + (c.despues ?? c.antes + '   [se queda: ' + c.motivo + ']'))
}
