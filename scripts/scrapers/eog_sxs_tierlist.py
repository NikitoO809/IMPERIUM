"""Extractor fiel del TIER LIST de Sword x Staff (eog.gg) con Playwright.

Recorre los 10 estados (subtab CLASS / FANTOMON x regiones T1..T5), hace clic por
selectores reales (descubiertos en _explore_sxs_tl.py) y guarda el outerHTML del
contenedor `.sxs-tierlist` de cada estado, para parsear OFFLINE sin re-scrapear.

Salida: scripts/data/sxs_tierlist_raw.json
Uso   : python scripts/scrapers/eog_sxs_tierlist.py
"""
import json
import os
import sys
from playwright.sync_api import sync_playwright

URL = "https://eog.gg/games/sword-x-staff/"
SUBTABS = ["class", "fantomon"]
REGIONS = ["t1", "t2", "t3", "t4", "t5"]

# Captura el contenedor del tier list (sub-tabs + region header + investment + cuerpo).
GRAB = r"""
() => {
  const root = document.querySelector('.sxs-tierlist')
            || document.querySelector('.hub-panel--active')
            || document.querySelector('.hub-content');
  if (!root) return { present: false };
  return { present: true, html: root.outerHTML, text: root.innerText };
}
"""


def log(msg):
    # Solo ASCII para no romper en consola cp1252 de Windows.
    print(msg, file=sys.stderr)


def click(page, selector, timeout=4000):
    try:
        page.click(selector, timeout=timeout)
        page.wait_for_timeout(1100)
        return True
    except Exception as e:
        log(f"  WARN click {selector}: {type(e).__name__}")
        return False


def main():
    out = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124"
        )
        log("Cargando pagina...")
        page.goto(URL, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(2000)
        click(page, 'button[data-tab="tier-list"]')

        for sub in SUBTABS:
            log(f"\n=== SUBTAB {sub} ===")
            click(page, f'button[data-subtab="{sub}"]')
            out[sub] = {}
            for reg in REGIONS:
                ok = click(page, f'button[data-region-tier="{reg}"]')
                data = page.evaluate(GRAB)
                out[sub][reg] = data
                tlen = len(data.get("text", "")) if data.get("present") else 0
                log(f"  {sub}/{reg}: present={data.get('present')} text={tlen} clicked={ok}")

        browser.close()

    os.makedirs("scripts/data", exist_ok=True)
    with open("scripts/data/sxs_tierlist_raw.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    log("\nOK -> scripts/data/sxs_tierlist_raw.json")


if __name__ == "__main__":
    main()
