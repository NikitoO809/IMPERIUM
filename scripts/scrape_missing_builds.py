# Scrapea los héroes que dieron 404 con el patrón nuevo,
# probando el patrón antiguo: best-{slug}-builds-talent-tree-skill-order-best-pairing-in-call-of-dragons/
import json, re, time
import requests
from bs4 import BeautifulSoup

H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

SKIP_H3 = {
    "other hero guides", "more guides", "tier list", "references",
    "comments", "related", "more", "also read", "you might also like",
}

def slugify(name):
    s = name.lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def scrape_url(url):
    try:
        r = requests.get(url, timeout=30, headers=H)
        r.raise_for_status()
    except Exception as e:
        return [], str(e)

    soup = BeautifulSoup(r.text, "lxml")
    container = soup.select_one("div.entry-content")
    if not container:
        return [], "no entry-content"

    sections = []
    current_h3 = None
    current_paras = []
    current_imgs = []

    def flush():
        if current_h3:
            txt = "\n\n".join(p for p in current_paras if p)
            sections.append({"section": current_h3, "content": txt, "images": current_imgs[:]})

    for el in container.children:
        tag = getattr(el, "name", None)
        if tag == "h3":
            flush()
            h3_text = el.get_text(" ", strip=True)
            if h3_text.lower() in SKIP_H3:
                current_h3 = None; current_paras = []; current_imgs = []
            else:
                current_h3 = h3_text; current_paras = []; current_imgs = []
        elif tag in ("p", "ul", "ol") and current_h3:
            t = el.get_text(" ", strip=True)
            if t: current_paras.append(t)
            for img in el.find_all("img"):
                src = img.get("data-lazy-src") or img.get("data-src") or img.get("src") or ""
                if src and "wp-content" in src: current_imgs.append(src)
        elif tag == "figure" and current_h3:
            img = el.find("img")
            if img:
                src = img.get("data-lazy-src") or img.get("data-src") or img.get("src") or ""
                if src and "wp-content" in src: current_imgs.append(src)

    flush()
    return sections, None


def main():
    # Héroes que dieron 404 con el patrón nuevo
    missing = [
        "Forondil", "Theodore", "Ffraegar", "Syndrion",
        "Liliya", "Kinnara", "Velyn", "Waldyr", "Madeline", "Kregg",
        "Emrys", "Bakshi", "Theia", "Hosk", "Garwood", "Nico", "Nika",
        "Indis", "Atheus", "Alwyn", "Gwanwyn", "Bakhar", "Alistair",
        "Chakcha", "Kella", "Ordo", "Eliana", "Pan",
    ]

    results = {}
    found = []
    not_found = []

    for name in missing:
        slug = slugify(name)
        # Patrón antiguo
        url = f"https://www.allclash.com/best-{slug}-builds-talent-tree-skill-order-best-pairing-in-call-of-dragons/"
        print(f"  {name}...", end=" ", flush=True)
        secs, err = scrape_url(url)
        if err:
            print(f"404")
            not_found.append(name)
            results[slug] = {"url": url, "sections": [], "name": name}
        else:
            print(f"{len(secs)} secciones OK")
            found.append(name)
            results[slug] = {"url": url, "sections": secs, "name": name}
        time.sleep(1)

    with open("scripts/missing-builds.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nEncontrados: {len(found)} — {found}")
    print(f"Sin build:   {len(not_found)} — {not_found}")


if __name__ == "__main__":
    main()
