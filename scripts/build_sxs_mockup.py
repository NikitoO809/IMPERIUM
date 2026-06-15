"""Genera una MAQUETA de cobertura (HTML) a partir de lo extraído por Playwright
(_sxs_sections_preview.json): una tarjeta por sección con lo que se detectó, para
que Miguel verifique qué se va a scrapear ANTES de montar nada.
"""
import json
import re
import html as H

data = json.load(open("scripts/data/_sxs_sections_preview.json", encoding="utf-8"))

# Metadatos por sección: menú eog → sección IMPERIUM + formato propuesto + estado.
META = {
    "overview":  ("Overview",  "Resumen",            "Contenido (mapa + novedades)", "todo"),
    "tier-list": ("Tier List", "Tier List de clases", "Visor tier-list (clases por región)", "fix"),
    "guides":    ("Guides",    "Guías",              "Guías interactivas", "done"),
    "builds":    ("Builds",    "Builds",             "Contenido / loadouts por rol", "todo"),
    "database":  ("Database",  "Base de datos",      "Visor con filtros (Skills · Fantomons · Companions)", "todo"),
    "roadmap":   ("Roadmap",   "Roadmap",            "Línea de tiempo / contenido", "todo"),
    "codes":     ("Codes",     "Códigos",            "Tabla de códigos", "todo"),
    "verdict":   ("Verdict",   "Veredicto",          "Contenido (reseña EOG)", "todo"),
}
ORDER = ["tier-list", "database", "builds", "roadmap", "codes", "verdict", "overview", "guides"]
STATUS = {
    "done": ("✅ ya montado y completo", "#54f0b8"),
    "fix":  ("⚠ montado INCOMPLETO — re-scrapear", "#ffcf5a"),
    "todo": ("⬜ por scrapear y montar", "#22e0ff"),
}


def clean_sample(s):
    # Quita el cromo de cabecera ("SXS · EDEN OF GAMING HUB ... FIRST DAWN")
    s = re.sub(r"^.*?FIRST DAWN", "", s, flags=re.S).strip()
    return s[:360]


def headings(s):
    hs = [h for h in s.get("headings", []) if h and h.strip().lower() != "sword x staff"]
    # limpia saltos
    return [re.sub(r"\s+", " ", h).strip() for h in hs][:18]


cards = []
for tab in ORDER:
    s = data.get(tab, {})
    menu, imp, fmt, st = META[tab]
    lbl, col = STATUS[st]
    hs = headings(s)
    imgs = len(s.get("images", []))
    desc = H.escape(clean_sample(s.get("sample", "")))
    items = "".join(f"<li>{H.escape(h)}</li>" for h in hs) or "<li class='muted'>(contenido extraíble al montar)</li>"
    more = "<span class='more'>…y más</span>" if len(s.get("headings", [])) > 18 or imgs >= 60 else ""
    cards.append(f"""
    <article class="card">
      <div class="head">
        <span class="menu">{menu}</span><span class="arrow">→</span><span class="imp">{H.escape(imp)}</span>
        <span class="badge" style="color:{col};border-color:{col}55">{lbl}</span>
      </div>
      <div class="fmt">Formato en IMPERIUM: <b>{H.escape(fmt)}</b> · imágenes detectadas: <b>{imgs}{'+' if imgs>=60 else ''}</b></div>
      <p class="desc">{desc}</p>
      <details><summary>Contenido detectado ({len(hs)}{'+' if more else ''})</summary><ul>{items}</ul>{more}</details>
    </article>""")

html_out = f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IMPERIUM — Maqueta de cobertura SxS</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800&family=Chakra+Petch:wght@500;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:Inter,sans-serif;background:#07070d;color:#e8e8f0;padding:28px 18px 60px;
 background-image:radial-gradient(800px 400px at 15% -5%,rgba(124,92,255,.18),transparent 60%),radial-gradient(700px 400px at 100% 0,rgba(34,224,255,.10),transparent 55%)}}
.wrap{{max-width:900px;margin:0 auto}}
h1{{font-family:Orbitron;font-size:24px;letter-spacing:.04em;text-shadow:0 0 18px rgba(124,92,255,.5)}}
.sub{{color:#9aa0c0;font-size:13px;margin:8px 0 22px;line-height:1.5}}
.card{{position:relative;background:linear-gradient(160deg,rgba(20,20,34,.95),rgba(10,10,20,.95));
 border:1px solid rgba(124,92,255,.35);border-radius:4px;padding:16px 18px;margin-bottom:14px;
 clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)}}
.head{{display:flex;align-items:center;gap:8px;flex-wrap:wrap}}
.menu{{font-family:'Chakra Petch';font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#9aa0c0;border:1px solid #9aa0c044;padding:2px 8px;border-radius:4px}}
.arrow{{color:#555}}
.imp{{font-family:Orbitron;font-weight:800;font-size:16px;color:#fff}}
.badge{{margin-left:auto;font-family:'Chakra Petch';font-size:10px;letter-spacing:.06em;border:1px solid;padding:3px 9px;border-radius:4px}}
.fmt{{font-size:12px;color:#9aa0c0;margin-top:8px}}
.fmt b{{color:#c9ccea}}
.desc{{font-size:12.5px;line-height:1.55;color:#aab;margin-top:8px}}
details{{margin-top:10px}}
summary{{cursor:pointer;font-family:'Chakra Petch';font-size:11px;letter-spacing:.06em;color:#22e0ff}}
ul{{margin:8px 0 0 4px;columns:2;column-gap:24px;list-style:none}}
li{{font-size:12px;color:#cdd;padding:2px 0 2px 12px;position:relative}}
li::before{{content:"◆";position:absolute;left:0;color:#7c5cff;font-size:8px;top:4px}}
li.muted{{color:#778}}
.more{{font-size:11px;color:#778}}
.note{{font-family:'Chakra Petch';font-size:12px;color:#ffcf5a;border-left:3px solid #ffcf5a;background:rgba(255,207,90,.08);padding:10px 14px;border-radius:0 6px 6px 0;margin:18px 0}}
</style></head><body><div class="wrap">
<h1>Maqueta de cobertura — Sword x Staff</h1>
<p class="sub">Lo que detecté en cada sección del menú de eog.gg (vía navegador). <b>Verifica que no falte nada</b> antes de que lo traduzca y monte. Abre cada "Contenido detectado" para ver el detalle. Nada está montado salvo lo marcado ✅.</p>
<div class="note">⚠ Correcciones tras ver el contenido real: la <b>Tier List</b> es de CLASES por región (lo que monté como "Fantomons (4)" era solo una parte) · los <b>Companions</b> existen dentro de <b>Database</b>, separados de los Fantomons.</div>
{''.join(cards)}
</div></body></html>"""

open("docs/maqueta-sxs-cobertura.html", "w", encoding="utf-8").write(html_out)
print("Escrito docs/maqueta-sxs-cobertura.html")
