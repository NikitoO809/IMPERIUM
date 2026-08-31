// Publica la guia de Gladiator en el foro 『📌』foro-imp, en secciones con sus imagenes.
import fs from 'node:fs'
import path from 'node:path'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const AUTH = { Authorization: 'Bot ' + env.DISCORD_BOT_TOKEN }
const FORO = '1542632433499901992'
const IMG = process.argv[2] ?? '.'

const TITULO = '⚔️ Gladiator · guía completa'

const APERTURA = `Guía de Gladiator sacada de **la base de datos del juego**, no de las webs que salen en Google.

**Un aviso antes de empezar.** Casi todas las guías que aparecen al buscar «Aion 2 Gladiator build» se inventan las habilidades: hablan de *Cleave Burst*, *Blood Smash*, *Battle Roar* o *Final Strike*, y **ninguna de esas existe**. Son páginas de tiendas de oro escritas con IA sin abrir el juego. Todo lo de aquí abajo está contrastado.

**La clase, en corto**
· **Arma:** mandoble. Lo del *polearm* que dicen por ahí también es mentira.
· **Dónde brilla:** Nightmare **S** · Abyss **A** · Arena en solo y en equipo **A** · Transcendence **B** · Subjugation **C** · Awakening **D**
· **PvP 74,1% frente a PvE 53,9%.** Es bastante mejor clase de PvP que de PvE.`

const SECCIONES = [
  {
    archivo: '01-cadena-derribo.png',
    texto: `**1 · La cadena de derribo**

Esto es lo que de verdad define a la clase y no lo cuenta ninguna guía de las que circulan.

**Overhead Slam y Aerial Snare no se pueden lanzar si el enemigo no está derribado.** Lo dice la propia descripción del juego. Solo cuatro habilidades tumban: Rush Strike, Mocking Blade, Wrath Wave y Assault Strike.

O sea que un Gladiator no se juega apretando botones por daño: se juega **tumbando y castigando en el suelo**. Y Overhead Slam tiene 5 s de recarga, así que el castigo se repite una y otra vez.`,
  },
  {
    archivo: '02-apertura.png',
    texto: `**2 · La apertura**

El orden importa porque cada paso prepara el siguiente:

**Blade Toss** deja al enemigo con **30% menos de defensa y de curación recibida durante 10 s**. **Ruinous Blow** te da *Prepare for Battle*. Y **Rage Burst** —6.635 de daño, lo más fuerte que tienes— sube además tu propio daño.

Todo lo gordo tiene que caer dentro de esa ventana de 10 segundos. Fuera de ella pegas a media potencia.

⚠️ Este orden **lo he deducido de los datos**, no es una rotación oficial. Cuando salga el global habrá que contrastarlo jugando.`,
  },
  {
    archivo: '03-stigmas.png',
    texto: `**3 · Los stigmas, que es donde está tu build**

Cada habilidad tiene **cinco mejoras** con coste en puntos. Ahí se decide todo, no en qué habilidades llevas.

Y hay un patrón clarísimo: **los mejores stigmas recortan recargas, no suben daño.**

· **Overhead Slam (16 p)** → le quita la recarga entera
· **Sword Aura Rampage (16 p)** → −1 s a **todas** tus recargas cada vez que golpeas
· **Rush Strike (12 p)** → de 20 s a 10 s
· **Rage Burst (5 p)** → de 45 s a 30 s

La build del Gladiator consiste en **pegar más veces**, no más fuerte.`,
  },
  {
    archivo: '04-defensivas.png',
    texto: `**4 · Cuándo pulsar cada defensiva**

Tres botones para tres problemas distintos. Usar el equivocado es morir.

· **Tenaciousness** (150 s) — inmune a todo 3 s. Para el golpe que te mata.
· **Defiance** (60 s) — te quita aturdimiento, derribo, agarre y miedo. Tu escapatoria.
· **Focused Block** (20 s) — parada garantizada. Para el intercambio normal.

⚠️ Tenaciousness **no para ciertos ataques muy fuertes**. No te confíes guardándolo para el jefe.`,
  },
  {
    archivo: '05-grupo.png',
    texto: `**5 · Lo que aportas al grupo**

**Zikel's Blessing: +20% de ataque a toda la party en 40 metros.**

Es de lo más valioso que trae la clase, y mucha gente lo desperdicia. Dura **solo 10 segundos** y tiene 120 s de recarga: si lo lanzas mientras el grupo todavía va corriendo, se gasta por el camino.

Se tira **cuando ya estáis encima**.`,
  },
  {
    archivo: '06-macros.png',
    texto: `**6 · Las macros**

Aion 2 las permite, pero con límites. Se escriben con \`/Skill [nombre]\` y hace falta una pausa entre habilidades que cubra el tiempo global de recarga y la animación.

Sirven para **encadenar dos habilidades y suavizar el clic**, no para automatizar la rotación entera.

🚫 **Farmear con macro estando ausente está prohibido y te pueden cerrar la cuenta.**

—
Los datos salen de la base de datos del juego (questlog.gg), **versión coreana**, anterior al lanzamiento global del 5 de octubre. Si algo cambia con los parches, se corrige aquí mismo.`,
  },
]

const adjuntar = (form, ruta, i = 0) => {
  const nombre = path.basename(ruta)
  form.append(`files[${i}]`, new Blob([fs.readFileSync(ruta)], { type: 'image/png' }), nombre)
  return nombre
}

// etiquetas del foro
const foro = await (await fetch(`https://discord.com/api/v10/channels/${FORO}`, { headers: AUTH })).json()
const etiqueta = (n) => foro.available_tags.find((t) => t.name === n)?.id
const tags = [etiqueta('Gladiator'), etiqueta('Build'), etiqueta('PvP')].filter(Boolean)

// 1) abrir la publicacion con el texto de entrada y la primera imagen
const form = new FormData()
const primera = SECCIONES[0]
const nombre1 = adjuntar(form, path.join(IMG, primera.archivo))
form.append('payload_json', JSON.stringify({
  name: TITULO,
  applied_tags: tags,
  message: { content: `${APERTURA}\n\n${primera.texto}`, attachments: [{ id: 0, filename: nombre1 }] },
}))

const r = await fetch(`https://discord.com/api/v10/channels/${FORO}/threads`, {
  method: 'POST', headers: AUTH, body: form,
})
if (!r.ok) { console.error('ERROR al abrir la publicacion: ' + r.status + ' ' + await r.text()); process.exit(1) }
const hilo = await r.json()
console.log(`publicacion abierta: ${hilo.name}`)
console.log(`   etiquetas: ${tags.length}   id: ${hilo.id}`)

// 2) el resto de secciones, una por mensaje
for (const s of SECCIONES.slice(1)) {
  await new Promise((r) => setTimeout(r, 900))
  const f2 = new FormData()
  const nom = adjuntar(f2, path.join(IMG, s.archivo))
  f2.append('payload_json', JSON.stringify({ content: s.texto, attachments: [{ id: 0, filename: nom }] }))
  const res = await fetch(`https://discord.com/api/v10/channels/${hilo.id}/messages`, {
    method: 'POST', headers: AUTH, body: f2,
  })
  console.log(`   ${res.ok ? 'ok  ' : 'FALLO ' + res.status + ' ' + await res.text()} ${s.archivo}`)
}

console.log(`\nhttps://discord.com/channels/${env.DISCORD_GUILD_ID}/${hilo.id}`)
