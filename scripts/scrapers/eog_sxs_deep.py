"""Scraper profundo de Sword x Staff en eog.gg.

Extrae el texto completo + imágenes de cada pestaña del Hub usando Playwright
(las pestañas y sub-pestañas se cargan por JavaScript).

Salida: scripts/data/sxs_deep.json
Uso   : python scripts/scrapers/eog_sxs_deep.py
"""
import json, sys
from playwright.sync_api import sync_playwright

URL = "https://eog.gg/games/sword-x-staff/"
# No reescrapear guías (ya montadas) ni las simples (ya canónicas)
MAIN_TABS = ["tier-list", "builds", "database", "roadmap"]

EXTRACT = r"""
() => {
  const main = document.querySelector('.hub-content') ||
               document.querySelector('main') || document.body;
  const vis = el => el && el.offsetParent !== null;
  const imgs = [...main.querySelectorAll('img')]
    .filter(vis).map(i => i.getAttribute('src')).filter(s => s && s.length > 1);
  const text = (main.innerText || '').trim();
  const headings = [...main.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter(vis).map(el => el.innerText.trim()).filter(Boolean);
  // Botones visibles (útil para detectar sub-pestañas)
  const buttons = [...document.querySelectorAll('button')]
    .filter(vis)
    .map(b => ({
      text: (b.innerText || '').trim().slice(0, 40),
      attrs: Object.fromEntries([...b.attributes].map(a => [a.name, a.value]))
    }))
    .filter(b => b.text);
  return { text, headings, images: [...new Set(imgs)], buttons };
}
"""


def wait(page, ms=1500):
    page.wait_for_timeout(ms)


def click_main_tab(page, tab):
    try:
        page.click(f'button[data-tab="{tab}"]', timeout=3000)
        wait(page)
        return True
    except Exception:
        return False


def try_click_text(page, label, timeout=2000):
    """Intenta hacer clic en un botón cuyo texto visible contiene `label`."""
    for sel in [
        f'button:has-text("{label}")',
        f'[role="tab"]:has-text("{label}")',
        f'[class*="tab"]:has-text("{label}")',
    ]:
        try:
            page.click(sel, timeout=timeout)
            wait(page, 900)
            return True
        except Exception:
            pass
    return False


def extract(page):
    return page.evaluate(EXTRACT)


def main():
    out = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124"
        )
        print("Cargando página...", file=sys.stderr)
        page.goto(URL, wait_until="networkidle", timeout=60000)
        wait(page, 2000)

        # ── TIER LIST ─────────────────────────────────────────────────────────
        print("\n=== TIER LIST ===", file=sys.stderr)
        click_main_tab(page, "tier-list")
        base = extract(page)
        print(f"  Base: {len(base['text'])} chars, {len(base['images'])} imgs", file=sys.stderr)
        btn_texts = [b['text'] for b in base['buttons']]
        print(f"  Botones visibles: {btn_texts[:25]}", file=sys.stderr)

        tier_regions = {}
        # Los botones de región suelen contener el nombre o el prefijo T1/T2/T3/T4/T5
        REGION_LABELS = [
            ("verdantglade", ["VERDANTGLADE", "T1"]),
            ("cinder-ridge",  ["CINDER RIDGE", "CINDER", "T2"]),
            ("aqualis",       ["AQUALIS", "T3"]),
            ("loong-haven",   ["LOONG HAVEN", "LOONG", "T4"]),
            ("aethyris",      ["AETHYRIS", "T5"]),
        ]
        for region_key, labels in REGION_LABELS:
            clicked = False
            for lbl in labels:
                if try_click_text(page, lbl):
                    clicked = True
                    break
            if clicked:
                data = extract(page)
                tier_regions[region_key] = data
                print(f"  Region {region_key}: {len(data['text'])} chars", file=sys.stderr)
            else:
                print(f"  WARN: no encontré botón para {region_key}", file=sys.stderr)

        out["tier-list"] = {"base": base, "regions": tier_regions}

        # ── BUILDS ────────────────────────────────────────────────────────────
        print("\n=== BUILDS ===", file=sys.stderr)
        click_main_tab(page, "builds")
        data = extract(page)
        out["builds"] = data
        print(f"  {len(data['text'])} chars, {len(data['images'])} imgs", file=sys.stderr)

        # ── DATABASE ──────────────────────────────────────────────────────────
        print("\n=== DATABASE ===", file=sys.stderr)
        click_main_tab(page, "database")
        base_db = extract(page)
        print(f"  Base: {len(base_db['text'])} chars, {len(base_db['images'])} imgs", file=sys.stderr)
        print(f"  Botones: {[b['text'] for b in base_db['buttons'][:25]]}", file=sys.stderr)

        db_subtabs = {}
        for subtab_label in ["SKILLS", "FANTOMONS", "COMPANIONS"]:
            # Volver al tab database y luego clic en sub-tab
            click_main_tab(page, "database")
            wait(page, 500)
            clicked = try_click_text(page, subtab_label)
            if not clicked:
                # Probar variantes en minúsculas
                clicked = try_click_text(page, subtab_label.capitalize())
            data = extract(page)
            key = subtab_label.lower()
            db_subtabs[key] = data
            status = "OK" if clicked else "WARN (subtab no encontrado, datos del estado activo)"
            print(f"  {subtab_label}: {len(data['text'])} chars, {len(data['images'])} imgs — {status}", file=sys.stderr)

        out["database"] = {"base": base_db, "subtabs": db_subtabs}

        # ── ROADMAP ───────────────────────────────────────────────────────────
        print("\n=== ROADMAP ===", file=sys.stderr)
        click_main_tab(page, "roadmap")
        data = extract(page)
        out["roadmap"] = data
        print(f"  {len(data['text'])} chars, {len(data['images'])} imgs", file=sys.stderr)

        browser.close()

    # Guardar
    import os
    os.makedirs("scripts/data", exist_ok=True)
    with open("scripts/data/sxs_deep.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("\n✓ Guardado: scripts/data/sxs_deep.json", file=sys.stderr)


if __name__ == "__main__":
    main()
