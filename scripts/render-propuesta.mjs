// Convierte scripts/data/propuesta-estilo.json en una hoja de revision HTML.
import fs from 'node:fs'

const salida = process.argv[2]
if (!salida) { console.error('uso: node scripts/render-propuesta.mjs <ruta.html>'); process.exit(1) }

const propuesta = JSON.parse(fs.readFileSync('scripts/data/propuesta-estilo.json', 'utf8'))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ICONO = { 0: '#', 2: '🔊', 5: '📣', 13: '🎙️', 15: '💭' }

const cambian = propuesta.flatMap((p) => p.canales).filter((c) => c.despues).length
const quedan = propuesta.flatMap((p) => p.canales).filter((c) => !c.despues).length
const cats = propuesta.filter((p) => p.despues).length

const bloques = propuesta.map((p) => {
  const filas = p.canales.map((c) => {
    if (!c.despues) {
      return `<tr class="skip"><td class="ic">${ICONO[c.tipo] ?? '#'}</td><td class="a">${esc(c.antes)}</td>`
        + `<td class="fl">·</td><td class="b">no se toca <span class="why">${esc(c.motivo)}</span></td></tr>`
    }
    const igual = c.antes === c.despues
    return `<tr${igual ? ' class="same"' : ''}><td class="ic">${ICONO[c.tipo] ?? '#'}</td>`
      + `<td class="a">${esc(c.antes)}</td><td class="fl">→</td><td class="b">${esc(c.despues)}</td></tr>`
  }).join('')

  const cab = p.despues
    ? `<div class="cat"><div class="cat-a">${esc(p.antes)}</div><div class="cat-fl">→</div><div class="cat-b">${esc(p.despues)}</div></div>`
    : `<div class="cat off"><div class="cat-a">${esc(p.antes)}</div><div class="cat-fl">·</div><div class="cat-b">no se toca <span class="why">${esc(p.motivo)}</span></div></div>`

  return `<section class="blk${p.despues ? '' : ' blk-off'}">${cab}<table><tbody>${filas}</tbody></table></section>`
}).join('')

const html = `<title>Renombrado del Servidor</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Noto+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
:root{
  --ground:#EEF1F4;--panel:#fff;--panel-2:#F5F8FA;--ink:#131A21;--ink-2:#4A5A68;--ink-3:#7C8B98;
  --line:#D4DDE4;--line-soft:#E5EBEF;--accent:#0089C4;--gold:#9E7E1E;
  --old:#8A97A2;--new:#0F7B52;--new-bg:#E6F4EC;--off:#98A5AF;
  --warn:#A05A15;--warn-bg:#FAEFE0;--warn-line:#E5C596;
  --shadow:0 1px 2px rgba(19,26,33,.05),0 12px 30px -14px rgba(19,26,33,.2);
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --ground:#0D1218;--panel:#151C23;--panel-2:#1A212A;--ink:#E2EBF2;--ink-2:#9EB0BE;--ink-3:#6E7F8C;
  --line:#26303A;--line-soft:#1F2830;--accent:#3EC1F3;--gold:#D0AB52;
  --old:#6E7F8C;--new:#54C695;--new-bg:#122A20;--off:#5C6B77;
  --warn:#E0A45C;--warn-bg:#28200F;--warn-line:#4A3A20;
  --shadow:0 1px 2px rgba(0,0,0,.45),0 16px 40px -18px rgba(0,0,0,.75);
}}
:root[data-theme="dark"]{
  --ground:#0D1218;--panel:#151C23;--panel-2:#1A212A;--ink:#E2EBF2;--ink-2:#9EB0BE;--ink-3:#6E7F8C;
  --line:#26303A;--line-soft:#1F2830;--accent:#3EC1F3;--gold:#D0AB52;
  --old:#6E7F8C;--new:#54C695;--new-bg:#122A20;--off:#5C6B77;
  --warn:#E0A45C;--warn-bg:#28200F;--warn-line:#4A3A20;
  --shadow:0 1px 2px rgba(0,0,0,.45),0 16px 40px -18px rgba(0,0,0,.75);
}
*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font-family:"Noto Sans","Segoe UI",system-ui,sans-serif;font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:38px 20px 80px}
.eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);margin:0 0 10px}
h1{font-family:Cinzel,Georgia,serif;font-size:clamp(27px,4vw,40px);line-height:1.07;margin:0;text-wrap:balance}
h1 em{font-style:normal;color:var(--gold)}
.lede{max-width:62ch;color:var(--ink-2);margin:13px 0 0}
.stats{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0 0}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:11px 15px;display:flex;gap:9px;align-items:baseline}
.stat b{font-family:"IBM Plex Mono",monospace;font-size:20px;font-weight:600;font-variant-numeric:tabular-nums}
.stat span{font-size:12.5px;color:var(--ink-2)}
.stat.g b{color:var(--new)} .stat.o b{color:var(--off)}
.tools{position:sticky;top:0;z-index:5;margin:22px 0 0;padding:12px 0;background:var(--ground)}
.tools input{width:100%;max-width:420px;font:400 14px/1.4 "Noto Sans",system-ui,sans-serif;color:var(--ink);
  background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:11px 14px}
.tools input::placeholder{color:var(--ink-3)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:5px}
.blk{background:var(--panel);border:1px solid var(--line);border-radius:11px;margin:16px 0 0;overflow:hidden;box-shadow:var(--shadow)}
.blk-off{opacity:.62}
.cat{display:grid;grid-template-columns:minmax(0,1fr) 26px minmax(0,1fr);gap:8px;align-items:center;
  padding:13px 16px;background:var(--panel-2);border-bottom:1px solid var(--line-soft);
  font-family:"IBM Plex Mono",monospace;font-size:12.5px;font-weight:600}
.cat-a{color:var(--old);overflow-wrap:anywhere}
.cat-fl{color:var(--ink-3);text-align:center}
.cat-b{color:var(--new);overflow-wrap:anywhere}
.cat.off .cat-b{color:var(--off);font-weight:400}
table{width:100%;border-collapse:collapse;font-family:"IBM Plex Mono",monospace;font-size:12.5px}
td{padding:7px 10px;border-bottom:1px solid var(--line-soft);vertical-align:top}
tr:last-child td{border-bottom:0}
.ic{width:30px;color:var(--ink-3);text-align:center;font-family:"Noto Sans",system-ui,sans-serif}
.a{color:var(--old);width:40%;overflow-wrap:anywhere}
.fl{width:22px;color:var(--ink-3);text-align:center}
.b{color:var(--new);overflow-wrap:anywhere}
tr.skip .b,tr.skip .a{color:var(--off)}
tr.same .b{color:var(--ink-2)}
.why{display:block;font-family:"Noto Sans",system-ui,sans-serif;font-size:11px;color:var(--ink-3);margin-top:1px}
.hide{display:none}
.empty{padding:26px 16px;color:var(--ink-3);font-size:13.5px;text-align:center}
.notes{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px;margin-top:30px}
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
<p class="eyebrow">Propuesta · nada aplicado</p>
<h1>Renombrado<br><em>del servidor</em></h1>
<p class="lede">Todo lo que cambiaría en IMPERIUM con el estilo que elegiste: marco y versalitas en las categorías, corchete <code>『』</code> con emoji en los canales. Revisa y dime qué corrijo antes de lanzarlo.</p>
<div class="stats">
  <div class="stat g"><b>${cats}</b><span>categorías</span></div>
  <div class="stat g"><b>${cambian}</b><span>canales a renombrar</span></div>
  <div class="stat o"><b>${quedan}</b><span>no se tocan</span></div>
</div>
<div class="tools"><input type="search" id="q" placeholder="Filtrar por nombre de canal o categoría…" autocomplete="off"></div>
<div id="lista">${bloques}</div>
<p class="empty hide" id="nada">Ningún canal coincide con eso.</p>
<div class="notes">
  <div class="card flag">
    <h4>Lo que dejo fuera a propósito</h4>
    <p>Los cinco cuenta-cifras (<code>Member Count: 1199</code>…) los reescribe un bot cada pocos minutos: renombrarlos no serviría de nada.</p>
    <p>También <code>mimir</code>, <code>TEMPVOICE CATEGORY</code> y <code>Terra's Channel</code>, que son de sistema o temporales.</p>
  </div>
  <div class="card">
    <h4>Lo que unifiqué</h4>
    <p>Los canales del mismo tipo llevan ahora el mismo icono en todas las categorías: anuncios 📢, noticias 🆕, normas 📜, guías 📌, general 💬, round-table 👑, códigos 🚀, eventos 🎈.</p>
    <p>Los canales con personalidad propia conservan el suyo: <code>👲 DÍA DE TFT</code>, <code>👀 tinder</code>, <code>💀 lista-de-la-verguenza</code>.</p>
  </div>
  <div class="card">
    <h4>Arreglos de camino</h4>
    <p>El canal ruso de Call of Dragons mantenía su identidad solo por la bandera; ahora se llama <code>general-ru</code>.</p>
    <p>Traha tenía los nombres en letras de fantasía (<code>𝗢𝗥𝗨𝗠</code>) que el buscador no encontraba: pasan a letras normales.</p>
  </div>
</div>
</div>
<script>
var q=document.getElementById('q'),lista=document.getElementById('lista'),nada=document.getElementById('nada');
q.addEventListener('input',function(){
  var t=q.value.trim().toLowerCase(),visibles=0;
  lista.querySelectorAll('.blk').forEach(function(blk){
    var enCat=blk.querySelector('.cat').textContent.toLowerCase().indexOf(t)>-1,hay=0;
    blk.querySelectorAll('tbody tr').forEach(function(tr){
      var ok=!t||enCat||tr.textContent.toLowerCase().indexOf(t)>-1;
      tr.classList.toggle('hide',!ok); if(ok)hay++;
    });
    blk.classList.toggle('hide',!hay); if(hay)visibles++;
  });
  nada.classList.toggle('hide',visibles>0);
});
</script>
`

fs.writeFileSync(salida, html, 'utf8')
console.log(`hoja de revision escrita en ${salida} (${cats} categorias, ${cambian} canales)`)
