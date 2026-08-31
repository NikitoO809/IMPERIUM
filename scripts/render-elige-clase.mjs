// Maqueta de las tres versiones posibles del mensaje de 『🎯』elige-tu-clase.
import fs from 'node:fs'

const salida = process.argv[2]
if (!salida) { console.error('uso: node scripts/render-elige-clase.mjs <ruta.html>'); process.exit(1) }
const EM = JSON.parse(fs.readFileSync('scripts/data/emojis-clases.json', 'utf8'))

// nombre del emoji en el servidor -> como se llama la clase de verdad
const CLASES = [
  { em: 'Templar', n: 'Templar', rol: 'Tanque', arq: 'Guerrero', d: 'Aguanta la primera línea y sujeta al enemigo.', c: '#3F72AF', r: 4 },
  { em: 'Gladiator', n: 'Gladiator', rol: 'Daño cuerpo a cuerpo', arq: 'Guerrero', d: 'Pega fuerte y encaja lo suyo.', c: '#B03A2E', r: 7 },
  { em: 'Ranger', n: 'Ranger', rol: 'Daño a distancia', arq: 'Explorador', d: 'Arco, trampas y distancia.', c: '#229954', r: 6 },
  { em: 'Assassin', n: 'Assassin', rol: 'Daño explosivo', arq: 'Explorador', d: 'Sigilo, entra, mata y desaparece.', c: '#6C3483', r: 7 },
  { em: 'Sorcerer', n: 'Sorcerer', rol: 'Daño mágico', arq: 'Mago', d: 'El mayor daño mágico, y el más frágil.', c: '#E8590C', r: 5 },
  { em: 'Summoner', n: 'Spiritmaster', rol: 'Invocador', arq: 'Mago', d: 'Pelea con espíritus y desgasta al rival.', c: '#17A589', r: 3 },
  { em: 'Cleric', n: 'Cleric', rol: 'Sanador', arq: 'Sacerdote', d: 'El que decide si el grupo vive.', c: '#D9A93A', r: 8 },
  { em: 'Chanter', n: 'Chanter', rol: 'Soporte', arq: 'Sacerdote', d: 'Mejora al grupo y pega de cerca.', c: '#B07A1E', r: 5 },
]

const img = (k, cls = 'e') => `<img class="${cls}" src="${EM[k]}" alt="${k}">`
const reacciones = CLASES.map((c) => `<span class="rx">${img(c.em, 'ex')}<b>${c.r}</b></span>`).join('')

// --- version A: lista de las ocho, una por linea ---
const A = `<div class="embed" style="--ec:#00A8E8">
  <p class="e-title">🎯 ELIGE TU CLASE</p>
  <p class="e-desc">Reacciona aquí abajo con tu clase y se te dará el rol. Puedes cambiar cuando quieras: quita la reacción y pon otra.</p>
  <div class="lista">${CLASES.map((c) => `<div class="li"><span class="li-em">${img(c.em)}</span><b>${c.n}</b><span class="li-rol">${c.rol}</span></div>`).join('')}</div>
  <div class="e-foot">IMPERIUM · Aion 2 · sale el 5 de octubre</div>
</div>`

// --- version B: agrupadas por arquetipo ---
const arqs = [...new Set(CLASES.map((c) => c.arq))]
const B = `<div class="embed" style="--ec:#C9A227">
  <p class="e-title">🎯 ELIGE TU CLASE</p>
  <p class="e-desc">Las ocho clases de Aion 2, por familia. Reacciona con la tuya y se te dará el rol.</p>
  <div class="cols">${arqs.map((a) => `<div class="col"><p class="col-t">${a}</p>${
    CLASES.filter((c) => c.arq === a).map((c) => `<div class="li"><span class="li-em">${img(c.em)}</span><b>${c.n}</b><span class="li-rol">${c.rol}</span></div>`).join('')
  }</div>`).join('')}</div>
  <div class="e-foot">IMPERIUM · Aion 2 · sale el 5 de octubre</div>
</div>`

// --- version C: una linea por clase con su explicacion ---
const C = `<div class="embed" style="--ec:#7B2D8E">
  <p class="e-title">🎯 ELIGE TU CLASE</p>
  <p class="e-desc">Reacciona con la tuya. Si dudas, aquí tienes en una línea lo que hace cada una.</p>
  <div class="lista">${CLASES.map((c) => `<div class="li li-alt" style="--cc:${c.c}"><span class="li-em">${img(c.em)}</span><div><b>${c.n}</b> <span class="li-rol">${c.rol}</span><span class="li-d">${c.d}</span></div></div>`).join('')}</div>
  <div class="e-foot">IMPERIUM · Aion 2 · sale el 5 de octubre</div>
</div>`

const VERSIONES = [
  { t: 'Lista limpia', s: 'Las ocho en una columna, nombre y papel. La más corta: se ve entera sin desplegar en el móvil.', h: A },
  { t: 'Por familias', s: 'Agrupadas en Guerrero, Explorador, Mago y Sacerdote. Enseña cómo está montado el juego, no solo la lista.', h: B },
  { t: 'Con una línea de cada una', s: 'Cada clase explicada en una frase. La más larga, pero el que no sabe nada elige sin salir de la sala.', h: C },
]

const html = `<title>Elige tu Clase</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Noto+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap">
<style>
:root{--ground:#EDF1F5;--panel:#fff;--panel-2:#F4F8FA;--ink:#121A21;--ink-2:#48586A;--ink-3:#7A8998;
 --line:#D3DDE5;--line-soft:#E4EAEF;--accent:#0089C4;--gold:#9C7C1D;
 --ok-bg:#E5F3EB;--ok-line:#A6D2BB;--ok:#1A6A44;--warn-bg:#FAEFE0;--warn-line:#E5C596;--warn:#9F5914;
 --shadow:0 1px 2px rgba(18,26,33,.05),0 14px 34px -15px rgba(18,26,33,.22)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
 --ground:#0D1218;--panel:#151C24;--panel-2:#1A212A;--ink:#E2EBF2;--ink-2:#9DB0BE;--ink-3:#6D7E8C;
 --line:#26303A;--line-soft:#1F2830;--accent:#3EC1F3;--gold:#D0AB52;
 --ok-bg:#122A20;--ok-line:#2B5942;--ok:#5FC795;--warn-bg:#28200F;--warn-line:#4A3A20;--warn:#E0A45C;
 --shadow:0 1px 2px rgba(0,0,0,.45),0 18px 44px -18px rgba(0,0,0,.75)}}
:root[data-theme="dark"]{
 --ground:#0D1218;--panel:#151C24;--panel-2:#1A212A;--ink:#E2EBF2;--ink-2:#9DB0BE;--ink-3:#6D7E8C;
 --line:#26303A;--line-soft:#1F2830;--accent:#3EC1F3;--gold:#D0AB52;
 --ok-bg:#122A20;--ok-line:#2B5942;--ok:#5FC795;--warn-bg:#28200F;--warn-line:#4A3A20;--warn:#E0A45C;
 --shadow:0 1px 2px rgba(0,0,0,.45),0 18px 44px -18px rgba(0,0,0,.75)}
*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font-family:"Noto Sans","Segoe UI",system-ui,sans-serif;font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1200px;margin:0 auto;padding:38px 20px 80px}
.eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);margin:0 0 10px}
h1{font-family:Cinzel,Georgia,serif;font-size:clamp(27px,4vw,40px);line-height:1.07;margin:0;text-wrap:balance}
h1 em{font-style:normal;color:var(--gold)}
.lede{max-width:62ch;color:var(--ink-2);margin:13px 0 0}
.keep{margin:22px 0 0;padding:14px 17px;border-radius:10px;background:var(--ok-bg);border:1px solid var(--ok-line);max-width:74ch}
.keep p{margin:0;font-size:13.5px;color:var(--ink-2)}
.keep b{color:var(--ok)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(390px,1fr));gap:22px;margin-top:26px}
.opt{background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:var(--shadow);display:flex;flex-direction:column}
.opt-top{padding:15px 17px 13px;border-bottom:1px solid var(--line-soft);display:flex;gap:12px;align-items:flex-start}
.num{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;background:var(--panel-2);border:1px solid var(--line);color:var(--ink-3);width:26px;height:26px;border-radius:6px;display:grid;place-items:center;flex:none}
.opt-top h3{margin:0;font-size:15px;font-weight:700}
.opt-top p{margin:3px 0 0;font-size:12.5px;color:var(--ink-2)}

/* la ventana de discord: paleta propia */
.dc{background:#313338;padding:16px 16px 18px;flex:1;color:#DBDEE1;font-size:15px;line-height:1.375}
.msg{display:grid;grid-template-columns:40px minmax(0,1fr);gap:16px}
.av{width:40px;height:40px;border-radius:50%;background:linear-gradient(150deg,#00A8E8,#0B4A6F);display:grid;place-items:center;font-family:Cinzel,serif;font-weight:700;font-size:13px;color:#fff}
.mh{display:flex;align-items:center;gap:8px;margin-bottom:3px;flex-wrap:wrap}
.au{color:#F2F3F5;font-weight:600}
.tag{background:#5865F2;color:#fff;border-radius:3px;padding:1px 4px;font-size:10px;font-weight:600;text-transform:uppercase}
.st{color:#949BA4;font-size:12px}
.embed{position:relative;max-width:520px;background:#2B2D31;border-radius:4px;border-left:4px solid var(--ec);padding:13px 16px 15px;margin-top:4px}
.e-title{color:#F2F3F5;font-weight:700;font-size:16px;margin:0 0 5px}
.e-desc{margin:0;font-size:14px;color:#DBDEE1}
.e-foot{margin-top:12px;padding-top:9px;border-top:1px solid #3F4147;color:#949BA4;font-size:11.5px}
.lista{margin-top:11px;display:flex;flex-direction:column;gap:5px}
.li{display:flex;align-items:center;gap:8px;font-size:14px}
.li b{color:#F2F3F5;font-weight:600}
.li-rol{color:#949BA4;font-size:13px}
.li-em{width:20px;height:20px;flex:none;display:grid;place-items:center}
.e{width:20px;height:20px;object-fit:contain}
.li-alt{align-items:flex-start;padding-left:9px;border-left:2px solid var(--cc)}
.li-alt .li-d{display:block;color:#949BA4;font-size:12.5px;line-height:1.4}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:11px 16px;margin-top:11px}
.col-t{margin:0 0 5px;color:var(--ec);font-family:"IBM Plex Mono",monospace;font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.rxs{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;max-width:520px}
.rx{display:inline-flex;align-items:center;gap:5px;background:#2B2D31;border:1px solid #3F4147;border-radius:8px;padding:3px 7px}
.rx b{color:#949BA4;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.ex{width:17px;height:17px;object-fit:contain}
.rxnote{margin:9px 0 0;color:#949BA4;font-size:11.5px;font-family:"IBM Plex Mono",monospace}
.notes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:30px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:16px 18px}
.card.flag{background:var(--warn-bg);border-color:var(--warn-line)}
.card h4{margin:0 0 8px;font-size:14px;font-weight:700}
.card.flag h4{color:var(--warn)}
.card p{margin:0 0 8px;font-size:13.5px;color:var(--ink-2)}
.card p:last-child{margin:0}
code{font-family:"IBM Plex Mono",monospace;font-size:12px;background:var(--panel-2);border:1px solid var(--line-soft);padding:1px 5px;border-radius:4px;color:var(--ink)}
.card.flag code{background:rgba(0,0,0,.07);border-color:var(--warn-line)}
</style>
<div class="wrap">
<p class="eyebrow">Maqueta · el mensaje sigue vacío en el servidor</p>
<h1>Elige<br><em>tu clase</em></h1>
<p class="lede">Tres formas de rellenar el mensaje de <code>『🎯』elige-tu-clase</code>, que ahora mismo está en blanco. Los emojis son los tuyos, descargados del servidor.</p>
<div class="keep"><p><b>Las reacciones no se tocan.</b> El mensaje lo publicó un webhook al que IMPBOT tiene acceso, así que se edita por dentro: los 45 que ya reaccionaron conservan su rol y los contadores siguen donde están.</p></div>
<div class="grid">
${VERSIONES.map((v, i) => `<div class="opt">
  <div class="opt-top"><span class="num">${i + 1}</span><div><h3>${v.t}</h3><p>${v.s}</p></div></div>
  <div class="dc"><div class="msg"><div class="av">A2</div><div>
    <div class="mh"><span class="au">Aion2 IMP</span><span class="tag">Bot</span><span class="st">hoy a las 21:12</span></div>
    ${v.h}
    <div class="rxs">${reacciones}</div>
    <p class="rxnote">↑ estas siguen exactamente igual</p>
  </div></div></div>
</div>`).join('')}
</div>
<div class="notes">
  <div class="card flag">
    <h4>El emoji dice Summoner, la clase es Spiritmaster</h4>
    <p>En las tres versiones escribo <b>Spiritmaster</b>, que es el nombre real en Aion 2. El emoji seguirá llamándose <code>:Summoner:</code> por dentro, pero eso no se ve.</p>
    <p>Puedo renombrar el emoji yo mismo. El rol no: está por encima de IMPBOT.</p>
  </div>
  <div class="card">
    <h4>Lo que cambia además del mensaje</h4>
    <p>Le pongo descripción al canal, que está vacía: la línea que sale arriba del todo explicando para qué es la sala.</p>
    <p>Nada más. Ni permisos, ni orden, ni el resto de canales.</p>
  </div>
  <div class="card">
    <h4>Si luego quieres cambiarlo</h4>
    <p>Al editarse por webhook, el mensaje se puede reescribir las veces que haga falta sin perder nunca las reacciones.</p>
    <p>Dime el número y lo aplico.</p>
  </div>
</div>
</div>
`

fs.writeFileSync(salida, html, 'utf8')
console.log(`maqueta escrita en ${salida} (${Math.round(html.length / 1024)} KB)`)
