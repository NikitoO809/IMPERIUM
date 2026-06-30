# Generador de la MAQUETA de revisión para el skill `actualizar-destacados`.
#
# Toma un JSON con la lista de MMORPGs candidatos (scrapeados de mmorpg.com) y
# produce un archivo HTML autónomo (preview-destacados.html) que Miguel abre en
# el navegador para REVISAR y ELEGIR los 12 destacados antes de publicar.
#
# La maqueta imita el diseño "glass" (zinc + oro) de la sección
# "MMORPG en el horizonte" de la web real, para que lo que se ve aquí sea
# (casi) idéntico a lo que verán los visitantes.
#
# Uso:
#   python scripts/lib/preview_destacados.py <entrada.json> [salida.html]
#
# Formato del JSON de entrada:
#   { "games": [ { "name", "genre", "status", "hype", "image"|"logoUrl",
#                  "platforms"[], "developer", "blurb", "infoUrl", "website",
#                  "preRegisterUrl", "key" }, ... ] }
#
# Nada de esto toca la web ni la base de datos: solo genera un HTML local.
import json
import sys
import html
from pathlib import Path

# Cuántos juegos debe elegir Miguel al final.
TARGET = 12


def slugify(name: str) -> str:
    out = []
    for ch in name.lower():
        if ch.isalnum():
            out.append(ch)
        elif ch in " -_":
            out.append("-")
    slug = "".join(out)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")


def card_html(i: int, g: dict) -> str:
    name = html.escape(g.get("name", "—"))
    genre = html.escape(g.get("genre", "") or "")
    status = html.escape(g.get("status", "") or "")
    image = g.get("image") or g.get("logoUrl") or ""
    hype = g.get("hype")
    initials = html.escape((g.get("name", "??")[:2]).upper())

    hype_badge = ""
    if isinstance(hype, (int, float)) and hype > 0:
        hype_badge = (
            f'<span class="hype"><span class="num">{hype:.1f}</span> hype</span>'
        )

    if image:
        logo = f'<img src="{html.escape(image)}" alt="Logo de {name}" loading="lazy">'
    else:
        logo = f'<span class="initials">{initials}</span>'

    meta_bits = " · ".join(b for b in [genre, status] if b)

    return f"""
      <label class="card" data-i="{i}">
        <input type="checkbox" class="pick" />
        <span class="check"></span>
        <div class="card-top">
          <div class="logo">{logo}</div>
          {hype_badge}
        </div>
        <h3 class="name">{name}</h3>
        <p class="meta">{html.escape(meta_bits)}</p>
      </label>"""


def build(games: list) -> str:
    cards = "\n".join(card_html(i, g) for i, g in enumerate(games))
    total = len(games)
    return f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vista previa — Juegos destacados</title>
<style>
  :root {{
    --bg: #09090b; --panel: #111114; --line: rgba(255,255,255,.08);
    --zinc4: #a1a1aa; --zinc5: #71717a; --zinc6: #52525b;
    --gold: #e8b54d; --brand: #7c5cff; --ok: #22c55e;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0; background: var(--bg); color: #fff;
    font-family: ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }}
  .wrap {{ max-width: 1100px; margin: 0 auto; padding: 40px 20px 120px; }}
  .eyebrow {{
    font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
    color: var(--brand); font-weight: 600;
  }}
  h1 {{ font-size: 30px; margin: 10px 0 6px; font-weight: 800; }}
  .sub {{ color: var(--zinc4); font-size: 14px; max-width: 60ch; line-height: 1.6; }}
  .note {{
    margin-top: 18px; padding: 12px 16px; border: 1px solid var(--line);
    border-left: 3px solid var(--brand); background: rgba(124,92,255,.06);
    border-radius: 8px; font-size: 13px; color: var(--zinc4); line-height: 1.6;
  }}
  .grid {{
    margin-top: 28px; display: grid; gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }}
  .card {{
    position: relative; display: flex; flex-direction: column;
    background: var(--panel); border: 1px solid var(--line);
    border-radius: 16px; padding: 20px; cursor: pointer;
    transition: border-color .2s, transform .2s, box-shadow .2s;
  }}
  .card:hover {{ border-color: rgba(255,255,255,.18); transform: translateY(-2px); }}
  .card .pick {{ position: absolute; opacity: 0; pointer-events: none; }}
  .card .check {{
    position: absolute; top: 14px; right: 14px; width: 22px; height: 22px;
    border: 1.5px solid var(--zinc6); border-radius: 50%;
    display: grid; place-items: center; transition: all .15s;
  }}
  .card .check::after {{
    content: "✓"; font-size: 13px; color: #0a0a0a; opacity: 0;
    transform: scale(.5); transition: all .15s; font-weight: 700;
  }}
  .card:has(.pick:checked) {{
    border-color: var(--gold);
    box-shadow: 0 0 0 1px var(--gold), 0 12px 40px -12px rgba(232,181,77,.4);
  }}
  .card:has(.pick:checked) .check {{ background: var(--gold); border-color: var(--gold); }}
  .card:has(.pick:checked) .check::after {{ opacity: 1; transform: scale(1); }}
  .card-top {{ display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }}
  .logo {{
    width: 64px; height: 64px; flex: 0 0 auto; border-radius: 12px;
    background: rgba(255,255,255,.03); border: 1px solid var(--line);
    display: grid; place-items: center; overflow: hidden;
  }}
  .logo img {{ max-width: 46px; max-height: 46px; width: auto; height: auto; object-fit: contain; }}
  .logo .initials {{ font-size: 13px; color: var(--zinc6); font-weight: 700; }}
  .hype {{
    display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;
    border: 1px solid rgba(232,181,77,.3); background: rgba(232,181,77,.1);
    color: var(--gold); border-radius: 999px; padding: 4px 9px;
    font-size: 11px; font-weight: 500;
  }}
  .hype .num {{ font-variant-numeric: tabular-nums; }}
  .name {{ font-size: 18px; margin: 16px 0 0; line-height: 1.2; font-weight: 700; }}
  .meta {{
    margin: 6px 0 0; font-size: 11px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--zinc5);
  }}
  .bar {{
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
    background: rgba(9,9,11,.85); backdrop-filter: blur(12px);
    border-top: 1px solid var(--line); padding: 16px 20px;
    display: flex; align-items: center; justify-content: center; gap: 18px;
  }}
  .counter {{ font-size: 15px; font-weight: 600; }}
  .counter b {{ color: var(--gold); font-variant-numeric: tabular-nums; }}
  .counter.full b {{ color: var(--ok); }}
  .hint {{ color: var(--zinc5); font-size: 13px; }}
  #copy {{
    border: 1px solid var(--line); background: rgba(255,255,255,.04);
    color: #fff; border-radius: 999px; padding: 9px 18px; font-size: 13px;
    cursor: pointer; transition: all .15s;
  }}
  #copy:hover {{ border-color: var(--gold); color: var(--gold); }}
</style>
</head>
<body>
  <div class="wrap">
    <span class="eyebrow">Vista previa — revisión</span>
    <h1>MMORPG en el horizonte</h1>
    <p class="sub">Estos son los candidatos extraídos de mmorpg.com. Marca los
      <b>{TARGET}</b> que quieres publicar en la web. Cuando termines, dime los nombres
      marcados (o usa el botón de abajo para copiar la lista) y genero el SQL.</p>
    <div class="note">Así se verán las tarjetas en la web real (mismo diseño glass).
      Si un logo no carga, lo verás aquí y podemos arreglarlo antes de publicar.
      <b>Nada se ha subido todavía.</b></div>

    <div class="grid">
{cards}
    </div>
  </div>

  <div class="bar">
    <span class="counter" id="counter">Seleccionados: <b>0</b> / {TARGET}</span>
    <span class="hint" id="hint">Marca {TARGET} juegos</span>
    <button id="copy">Copiar selección</button>
  </div>

<script>
  const TARGET = {TARGET};
  const total = {total};
  const counter = document.getElementById('counter');
  const hint = document.getElementById('hint');
  const picks = () => [...document.querySelectorAll('.pick:checked')];
  function refresh() {{
    const n = picks().length;
    counter.querySelector('b').textContent = n;
    counter.classList.toggle('full', n === TARGET);
    if (n === TARGET) hint.textContent = '¡Listo! Copia la selección o dímela.';
    else if (n > TARGET) hint.textContent = 'Te has pasado, quita ' + (n - TARGET);
    else hint.textContent = 'Faltan ' + (TARGET - n);
  }}
  document.addEventListener('change', e => {{ if (e.target.classList.contains('pick')) refresh(); }});
  document.getElementById('copy').addEventListener('click', () => {{
    const names = picks().map(p => p.closest('.card').querySelector('.name').textContent.trim());
    navigator.clipboard.writeText(names.join('\\n'));
    document.getElementById('copy').textContent = '¡Copiado!';
    setTimeout(() => document.getElementById('copy').textContent = 'Copiar selección', 1500);
  }});
  refresh();
</script>
</body>
</html>"""


def main():
    if len(sys.argv) < 2:
        print("Uso: python scripts/lib/preview_destacados.py <entrada.json> [salida.html]")
        sys.exit(1)
    src = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else src.with_name("preview-destacados.html")
    data = json.loads(src.read_text(encoding="utf-8"))
    games = data.get("games", data) if isinstance(data, dict) else data
    out.write_text(build(games), encoding="utf-8")
    print(f"Maqueta generada: {out}  ({len(games)} juegos)")


if __name__ == "__main__":
    main()
