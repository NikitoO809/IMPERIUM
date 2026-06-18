"""
Scraper genérico y fiel para páginas de cod.guide (Call of Dragons).
Extrae: título (h1), intro (primer bloque), y secciones por h2/h3 con su
contenido, imágenes y tablas. Guarda RAW en inglés (la traducción la hace Claude).

Uso:
  python scripts/scrapers/scrape_codguide_generic.py <slug1> <slug2> ...
  python scripts/scrapers/scrape_codguide_generic.py --batch events
Salida: scripts/data/_codguide_<slug>.json
"""
import requests, json, time, sys, re
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
           "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

# Headings de "ruido" (artículos relacionados, navegación, etc.) que cortan la guía real
STOP_HEADINGS = {"related", "related posts", "related guides", "leave a comment",
                 "leave a reply", "you may also like", "recent posts", "categories",
                 "table of contents", "contents"}

EVENTS = ["a-fine-haul-event", "blessings-of-the-oak", "breaking-through-event",
          "celestial-battlegrounds", "crucible-of-courage", "song-of-solidarity-event",
          "strongest-lord-event", "roots-of-war", "trial-of-light", "summer-smash",
          "live-and-learn"]

GUIDES = ["farming-tips", "get-resources", "healing", "level-up-fast",
          "important-city-hall-levels", "call-of-dragons-vs-rise-of-kingdoms",
          "honorary-vip", "talent-tree-builds"]


def clean(s):
    return re.sub(r"\s+", " ", (s or "")).strip()


def img_url(img):
    for k in ("data-src", "data-lazy-src", "src"):
        v = img.get(k)
        if v and v.startswith("http") and "data:image" not in v:
            return v
    # srcset fallback
    ss = img.get("data-srcset") or img.get("srcset")
    if ss:
        first = ss.split(",")[0].strip().split(" ")[0]
        if first.startswith("http"):
            return first
    return None


def table_to_text(table):
    rows = []
    for tr in table.find_all("tr"):
        cells = [clean(td.get_text(" ", strip=True)) for td in tr.find_all(["th", "td"])]
        if any(cells):
            rows.append(" | ".join(cells))
    return "\n".join(rows)


def scrape(slug):
    url = f"https://cod.guide/{slug}/"
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")
    for t in soup(["script", "style", "nav", "header", "footer", "noscript", "form", "aside"]):
        t.decompose()

    h1 = soup.find("h1")
    title = clean(h1.get_text()) if h1 else slug

    main = soup.find("main") or soup.find("article") or soup.body

    # Recorremos los headings h2/h3 en orden. El contenido de cada sección son
    # los hermanos hasta el siguiente heading.
    headings = main.find_all(["h2", "h3"])
    sections = []
    for hd in headings:
        htext = clean(hd.get_text(" "))
        if not htext or htext.lower() in STOP_HEADINGS:
            if htext.lower() in STOP_HEADINGS:
                break  # a partir de aquí es ruido
            continue
        parts, images = [], []
        tag = hd.find_next_sibling()
        while tag and getattr(tag, "name", None) not in ("h2", "h3"):
            if getattr(tag, "name", None) is None:
                tag = tag.find_next_sibling()
                continue
            # tablas → texto con pipes
            for tb in tag.find_all("table") if hasattr(tag, "find_all") else []:
                tt = table_to_text(tb)
                if tt:
                    parts.append("__TABLE__\n" + tt)
                tb.decompose()
            # listas
            if tag.name in ("ul", "ol"):
                for li in tag.find_all("li"):
                    lt = clean(li.get_text(" "))
                    if lt:
                        parts.append("• " + lt)
            else:
                txt = clean(tag.get_text(" "))
                if txt and len(txt) > 1:
                    parts.append(txt)
            for im in (tag.find_all("img") if hasattr(tag, "find_all") else []):
                u = img_url(im)
                if u and u not in images:
                    images.append(u)
            tag = tag.find_next_sibling()
        content = "\n\n".join(parts)
        # Saltar secciones vacías (0 texto y 0 imágenes): son enlaces a
        # "artículos relacionados" al final de la página, no contenido real.
        if not content and not images:
            continue
        sections.append({"title": htext, "content": content, "images": images})

    # Imagen de portada: primera imagen de contenido relevante
    cover = None
    for im in main.find_all("img"):
        u = img_url(im)
        if u and "logo" not in u.lower() and "avatar" not in u.lower():
            cover = u
            break

    return {"slug": slug, "url": url, "title": title, "cover": cover,
            "n_sections": len(sections), "sections": sections}


def main():
    args = sys.argv[1:]
    if not args:
        print("uso: scrape_codguide_generic.py <slug...> | --batch events|guides")
        return
    if args[0] == "--batch":
        slugs = EVENTS if args[1] == "events" else GUIDES
    else:
        slugs = args
    for slug in slugs:
        try:
            data = scrape(slug)
            out = f"scripts/data/_codguide_{slug}.json"
            with open(out, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"OK  {slug}: {data['n_sections']} secciones, cover={'sí' if data['cover'] else 'no'} -> {out}")
        except Exception as e:
            print(f"ERR {slug}: {e}")
        time.sleep(1.2)


if __name__ == "__main__":
    main()
