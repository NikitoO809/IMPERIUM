"""
Rehace el banner que sale al compartir el enlace de IMPERIUM (WhatsApp,
Discord, X…): 1200×630, negro y oro, con el rótulo Cinzel sobre las Leyendas
del Salón de la Fama.

  python scripts/og/generar_portada.py                     # usa la web publicada
  python scripts/og/generar_portada.py --url http://localhost:3001/fama
  python scripts/og/generar_portada.py --salida portada-2.jpg

OJO: WhatsApp guarda la imagen por su URL durante semanas. Si cambias el
diseño, guárdalo con OTRO nombre (`--salida`) y apunta ahí `SHARE_IMAGE` en
src/app/layout.tsx; si no, la gente seguirá viendo la anterior.
"""
from __future__ import annotations

import argparse
import sys
import tempfile
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[2]
DESTINO = ROOT / "public" / "og"
# El navegador sin ventana necesita la GPU de verdad: con el renderizador por
# software el escenario 3D del Salón de la Fama se cuelga al capturar.
GPU = ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"]

PLANTILLA = """<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@400;600&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;background:#0a0a0b}
  .og{position:relative;width:1200px;height:630px;overflow:hidden}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  /* velo: deja el cielo y los torsos, y funde en negro la banda de los nombres */
  .velo{position:absolute;inset:0;background:
    linear-gradient(180deg, rgba(10,10,11,.52) 0%, rgba(10,10,11,0) 20%, rgba(10,10,11,.14) 38%,
      rgba(10,10,11,.80) 55%, rgba(10,10,11,.95) 70%, #0a0a0b 100%),
    radial-gradient(130% 80% at 50% 118%, rgba(0,0,0,.55), transparent 62%)}
  .marco{position:absolute;inset:16px;border:1px solid rgba(227,179,65,.26);border-radius:14px}
  .mid{position:absolute;left:0;right:0;bottom:46px;text-align:center}
  .badge{display:inline-block;padding:8px 20px;border-radius:999px;border:1px solid rgba(255,255,255,.16);
    background:rgba(18,18,22,.6);font-family:Outfit,sans-serif;font-size:18px;font-weight:600;color:#efe9da;letter-spacing:.02em}
  .wrap-word{margin-top:20px}
  .word{position:relative;display:inline-block;font-family:Cinzel,Georgia,serif;font-weight:900;
    text-transform:uppercase;letter-spacing:.05em;line-height:1;font-size:104px}
  .halo{position:absolute;inset:0;color:#e3b341;filter:blur(26px);opacity:.6}
  .depth{position:absolute;inset:0;color:#3a2608;transform:translateY(.035em);filter:blur(.6px)}
  .face{position:relative;background:linear-gradient(180deg,#fff7dc 0%,#f7e2a8 26%,#e3b341 48%,#b07f2b 58%,#f0cf7c 74%,#fff3cf 100%);
    -webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:.7px rgba(255,240,200,.45)}
  .orn{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:16px;opacity:.9}
  .orn i{display:block;width:170px;height:1px;background:linear-gradient(90deg,transparent,rgba(227,179,65,.85))}
  .orn i+i{background:linear-gradient(90deg,rgba(227,179,65,.85),transparent)}
  .orn b{width:9px;height:9px;background:#e3b341;transform:rotate(45deg)}
  .claim{margin-top:15px;font-family:Outfit,sans-serif;font-size:25px;color:rgba(240,240,242,.86)}
  .dom{margin-top:11px;font-family:Outfit,sans-serif;font-size:16px;letter-spacing:.24em;text-transform:uppercase;color:rgba(227,179,65,.92)}
</style></head><body>
<div class="og">
  <img class="bg" src="fondo.jpg" alt="">
  <div class="velo"></div><div class="marco"></div>
  <div class="mid">
    <div><span class="badge">★ Comunidad de Discord · ES</span></div>
    <div class="wrap-word"><span class="word"><span class="halo">IMPERIUM</span><span class="depth">IMPERIUM</span><span class="face">IMPERIUM</span></span></div>
    <div class="orn"><i></i><b></b><i></i></div>
    <div class="claim">Guías paso a paso, tu progreso guardado y gente con quien jugar</div>
    <div class="dom">comunidad-imp.com</div>
  </div>
</div></body></html>
"""


def capturar_fama(url: str, destino: Path) -> None:
    with sync_playwright() as p:
        b = p.chromium.launch(args=GPU)
        pg = b.new_page(viewport={"width": 1920, "height": 1080})
        pg.goto(url, wait_until="networkidle", timeout=120_000)
        pg.wait_for_selector(".ly-stage.is-3d", timeout=60_000)
        pg.wait_for_timeout(7000)  # que respiren y acaben de aparecer
        pg.screenshot(path=str(destino))
        b.close()


def componer(captura: Path, salida: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        carpeta = Path(tmp)
        # banda con la fila (la proporción tiene que ser la de 1200×630)
        im = Image.open(captura)
        im.crop((74, 120, 1845, 1050)).resize((1200, 630), Image.LANCZOS).save(carpeta / "fondo.jpg", quality=95)
        (carpeta / "og.html").write_text(PLANTILLA, encoding="utf-8")
        with sync_playwright() as p:
            b = p.chromium.launch()
            pg = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=2)
            pg.goto((carpeta / "og.html").resolve().as_uri(), wait_until="networkidle", timeout=60_000)
            pg.wait_for_timeout(1500)  # las fuentes de Google
            pg.screenshot(path=str(carpeta / "og_2x.png"))
            b.close()
        # se dibuja al doble y se reduce: texto más limpio, y JPEG por debajo
        # de 300 KB (WhatsApp descarta las vistas previas pesadas)
        img = Image.open(carpeta / "og_2x.png").convert("RGB").resize((1200, 630), Image.LANCZOS)
        salida.parent.mkdir(parents=True, exist_ok=True)
        img.save(salida, quality=88, optimize=True)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="https://comunidad-imp.com/fama")
    ap.add_argument("--salida", default="portada.jpg")
    args = ap.parse_args()

    salida = DESTINO / args.salida
    with tempfile.TemporaryDirectory() as tmp:
        captura = Path(tmp) / "fama.png"
        print(f"→ capturando {args.url}")
        capturar_fama(args.url, captura)
        print("→ componiendo el banner")
        componer(captura, salida)
    print(f"✓ {salida.relative_to(ROOT)} · {salida.stat().st_size // 1024} KB")
    print("  Recuerda: si cambias el diseño, usa otro nombre (WhatsApp cachea por URL).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
