"""Recorre las 8 pestañas del Hub de Sword x Staff en eog.gg con Playwright
(las pestañas se cargan por JavaScript) y extrae un RESUMEN de cada sección:
encabezados, recuentos de elementos clave, imágenes y una muestra de texto.

Sirve para construir la MAQUETA de cobertura (qué se va a scrapear) ANTES de
montar nada. Salida: scripts/data/_sxs_sections_preview.json.
"""
import json
import sys
from playwright.sync_api import sync_playwright

URL = "https://eog.gg/games/sword-x-staff/"
TABS = ["overview", "tier-list", "guides", "builds", "database", "roadmap", "codes", "verdict"]

# JS que resume SOLO el contenido visible (la pestaña activa).
SUMMARIZE = r"""
() => {
  const main = document.querySelector('.hub-content') || document.querySelector('main') || document.body;
  const vis = el => el && el.offsetParent !== null;
  const txt = el => (el.innerText || '').trim();
  const headings = [...main.querySelectorAll('h1,h2,h3,h4')].filter(vis).map(txt).filter(Boolean).slice(0, 40);
  const count = sel => [...main.querySelectorAll(sel)].filter(vis).length;
  const imgs = [...main.querySelectorAll('img')].filter(vis)
      .map(i => i.getAttribute('src')).filter(s => s && !s.includes('/brand/'));
  const uniqImgs = [...new Set(imgs)].slice(0, 60);
  const sample = (main.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 1200);
  return {
    headings,
    counts: {
      classCards: count('.sxs-class-card'),
      codeRows: count('.sxs-code-row'),
      fantRows: count('.sxs-fant-row'),
      guideLinks: count('a[href*="/guides/"]'),
      ovCards: count('.sxs-ov-card'),
      sxsSections: count('.sxs-section'),
      tableRows: count('table tr'),
      listItems: count('ul li'),
    },
    images: uniqImgs,
    sample,
  };
}
"""


def main():
    out = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        page.goto(URL, wait_until="networkidle", timeout=60000)
        for tab in TABS:
            try:
                btn = page.query_selector(f'button[data-tab="{tab}"]')
                if btn:
                    btn.click()
                    page.wait_for_timeout(1500)  # deja cargar el contenido JS
                out[tab] = page.evaluate(SUMMARIZE)
            except Exception as e:
                out[tab] = {"error": str(e)}
            c = out[tab].get("counts") if isinstance(out[tab], dict) else None
            print(f"{tab}: {c}", file=sys.stderr)
        browser.close()

    with open("scripts/data/_sxs_sections_preview.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("\nGuardado scripts/data/_sxs_sections_preview.json", file=sys.stderr)


if __name__ == "__main__":
    main()
