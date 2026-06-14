# Scraper FIEL de las guías de Sword x Staff (eog.gg) para IMPERIUM.
# Respeta la estructura real de la página:
#   - La intro = bloque de contexto (.sxs-context, con su propio título) + .sxs-intro.
#     Se guarda como introTitle + intro de la GUÍA (no como un paso).
#   - Cada sección/paso = un div.sxs-section con su .sxs-section__title real.
#   - Captura sub-bloques: triángulo de stats (.sxs-triangle) y filas de detalle
#     (.sxs-details-row) con sus etiquetas y valores, para no perder información.
# Vuelca a scripts/sxs-guides.json (UTF-8). No inventa nada.
import json
import time
import sys
import requests
from bs4 import BeautifulSoup

BASE = "https://eog.gg"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

SLUGS = [
    "beginner-guide", "companion-upgrade", "daily-dungeons", "destiny-fruit",
    "dps-dummy-test", "food-guide", "gacha-and-pity", "grand-treasure-hunt",
    "important-tips", "reroll-guide", "void-rifts",
]


def abs_url(src):
    if not src:
        return None
    if src.startswith("http"):
        return src
    if src.startswith("//"):
        return "https:" + src
    return BASE + src


def txt(el):
    return el.get_text(" ", strip=True) if el else ""


def collect_images(scope, into):
    for img in scope.find_all("img"):
        u = abs_url(img.get("src"))
        if u and "/brand/" not in u and u not in into:
            into.append(u)


def section_content(sec):
    """Texto rico de un div.sxs-section, en orden del DOM, sin duplicar sub-bloques."""
    parts = []
    images = []
    consumed = set()
    title_el = sec.select_one(".sxs-section__title")

    for el in sec.descendants:
        if not getattr(el, "name", None):
            continue
        if id(el) in consumed:
            continue
        cls = set(el.get("class") or [])

        if el is title_el:
            continue

        # Triángulo de estadísticas: "Etiqueta (métrica): texto"
        if "sxs-triangle" in cls and "sxs-triangle__cell" not in cls:
            for cell in el.select(".sxs-triangle__cell"):
                lab = txt(cell.select_one(".sxs-triangle__label"))
                met = txt(cell.select_one(".sxs-triangle__metric"))
                body = txt(cell.select_one(".sxs-triangle__text"))
                head = lab + (f" ({met})" if met else "")
                parts.append(f"{head}: {body}" if head else body)
            for d in el.descendants:
                consumed.add(id(d))
            consumed.add(id(el))
            continue

        # Bloque de detalles (tabla de filas): título + "• etiqueta: valor"
        if "sxs-details" in cls and not (cls & {
            "sxs-details-row", "sxs-details__body", "sxs-details__title",
            "sxs-details-row__label", "sxs-details-row__val",
        }):
            dt = txt(el.select_one(".sxs-details__title"))
            if dt:
                parts.append(dt)
            for row in el.select(".sxs-details-row"):
                lab = txt(row.select_one(".sxs-details-row__label"))
                val = txt(row.select_one(".sxs-details-row__val"))
                parts.append(f"• {lab}: {val}" if lab else val)
            for d in el.descendants:
                consumed.add(id(d))
            consumed.add(id(el))
            continue

        if el.name == "p" and "sxs-section__body" in cls:
            t = txt(el)
            if t:
                parts.append(t)
            continue

        if el.name == "li":
            t = txt(el)
            if t:
                parts.append("• " + t)
            continue

    collect_images(sec, images)
    # Quitar duplicados consecutivos preservando orden
    clean = []
    for p in parts:
        if not clean or clean[-1] != p:
            clean.append(p)
    return "\n\n".join(clean), images


def scrape(slug):
    url = f"{BASE}/games/sword-x-staff/guides/{slug}/"
    r = requests.get(url, timeout=30, headers=HEADERS)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")
    hc = soup.select_one(".hub-content") or soup.find("main")
    for t in hc.find_all(["script", "style", "nav", "aside"]):
        t.decompose()

    title = hc.select_one(".guide-header__title") or hc.find("h1")
    excerpt = hc.select_one(".guide-header__excerpt")
    category = hc.select_one(".guide-header__category")

    # ── Intro de la guía (contexto + intro), con su título real ──
    intro_title = txt(hc.select_one(".sxs-context__title"))
    intro_parts = []
    for el in hc.select(".sxs-context__text"):
        if txt(el):
            intro_parts.append(txt(el))
    for el in hc.select(".sxs-intro"):
        if txt(el):
            intro_parts.append(txt(el))
    intro = "\n\n".join(intro_parts)

    # Imágenes de cabecera/intro = las que están fuera de cualquier .sxs-section
    intro_images = []
    for img in hc.find_all("img"):
        if img.find_parent(class_="sxs-section"):
            continue
        u = abs_url(img.get("src"))
        if u and "/brand/" not in u and u not in intro_images:
            intro_images.append(u)

    # ── Secciones reales ──
    sections = []
    for sec in hc.select(".sxs-section"):
        st = txt(sec.select_one(".sxs-section__title"))
        content, images = section_content(sec)
        if st or content:
            sections.append({"title": st, "content": content, "images": images})

    return {
        "slug": slug,
        "url": url,
        "category": txt(category),
        "title": txt(title) or slug,
        "excerpt": txt(excerpt),
        "introTitle": intro_title,
        "intro": intro,
        "introImages": intro_images,
        "sections": sections,
    }


def main():
    out = []
    for i, slug in enumerate(SLUGS):
        try:
            g = scrape(slug)
            out.append(g)
            imgs = len(g["introImages"]) + sum(len(s["images"]) for s in g["sections"])
            print(f"[{i+1}/{len(SLUGS)}] {slug}: {len(g['sections'])} secciones, "
                  f"intro='{g['introTitle'][:30]}', {imgs} imagenes")
        except Exception as e:
            print(f"[{i+1}/{len(SLUGS)}] {slug}: ERROR {e}", file=sys.stderr)
        time.sleep(1.0)

    with open("scripts/sxs-guides.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    total = sum(len(g["sections"]) for g in out)
    print(f"\nGuardado scripts/sxs-guides.json: {len(out)} guias, {total} secciones.")


if __name__ == "__main__":
    main()
