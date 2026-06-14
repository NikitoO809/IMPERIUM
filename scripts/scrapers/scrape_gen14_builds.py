# Scraper de builds Gen 1-4 de Call of Dragons (allclash.com).
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

def scrape_build(hero_slug):
    url = f"https://www.allclash.com/best-{hero_slug}-builds-talent-skill-order-pairing-pets-in-call-of-dragons/"
    try:
        r = requests.get(url, timeout=30, headers=H)
        r.raise_for_status()
    except Exception as e:
        return url, [], str(e)

    soup = BeautifulSoup(r.text, "lxml")
    container = soup.select_one("div.entry-content")
    if not container:
        return url, [], "no entry-content"

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
    return url, sections, None


def main():
    heroes = json.load(open("scripts/allclash-heroes.json", encoding="utf-8"))
    gen14 = [h for h in heroes if h["generation"] != "GENERATION 5"]

    results = {}
    errors = []
    for h in gen14:
        slug = slugify(h["name"])
        print(f"  {h['generation']} | {h['name']}...", end=" ", flush=True)
        url, secs, err = scrape_build(slug)
        results[slug] = {"url": url, "sections": secs, "name": h["name"], "generation": h["generation"]}
        if err:
            print(f"ERROR: {err}")
            errors.append((h["name"], err))
        else:
            print(f"{len(secs)} secciones")
        time.sleep(1)

    with open("scripts/gen14-builds.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nTotal: {len(results)} héroes scrapeados")
    if errors:
        print(f"Errores ({len(errors)}):")
        for name, err in errors:
            print(f"  {name}: {err}")
    else:
        print("Sin errores.")
    print("Datos en scripts/gen14-builds.json")


if __name__ == "__main__":
    main()
