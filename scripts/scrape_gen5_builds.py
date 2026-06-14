# Scraper de builds individuales de héroes Gen 5 de Call of Dragons (allclash.com).
# Extrae secciones h3 dentro de div.entry-content y genera SQL para hero_builds.
import json, re, time
import requests
from bs4 import BeautifulSoup

PYTHON_PATH = r"C:\Users\Miguel\AppData\Local\Programs\Python\Python312\python.exe"
H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
TAG = "hb"

# Héroes Gen 5 con su slug de URL en allclash
GEN5 = [
    ("vardun",          "best-vardun-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("cantaman",        "best-cantaman-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("seluna-legendary","best-seluna-legendary-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("joren",           "best-joren-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("ellanir",         "best-ellanir-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("agnar",           "best-agnar-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("freya",           "best-freya-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("seluna",          "best-seluna-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("ruby",            "best-ruby-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
    ("kaelan",          "best-kaelan-builds-talent-skill-order-pairing-pets-in-call-of-dragons"),
]

SKIP_H3 = {
    "other hero guides", "more guides", "tier list", "references",
    "comments", "related", "more", "also read", "you might also like",
}

def dq(s):
    s = (s or "").replace("'", "''")
    return f"${TAG}${s}${TAG}$"

def arr(urls):
    if not urls:
        return "'{}'::text[]"
    return "array[" + ", ".join(dq(u) for u in urls) + "]::text[]"

def scrape_build(hero_slug, url_slug):
    url = f"https://www.allclash.com/{url_slug}/"
    try:
        r = requests.get(url, timeout=30, headers=H)
        r.raise_for_status()
    except Exception as e:
        return url, []

    soup = BeautifulSoup(r.text, "lxml")
    container = soup.select_one("div.entry-content")
    if not container:
        return url, []

    sections = []
    current_h3 = None
    current_paras = []
    current_imgs = []

    def flush():
        if current_h3:
            txt = "\n\n".join(p for p in current_paras if p)
            sections.append({
                "section": current_h3,
                "content": txt,
                "images": current_imgs[:],
            })

    for el in container.children:
        tag = getattr(el, "name", None)
        if tag == "h3":
            flush()
            h3_text = el.get_text(" ", strip=True)
            if h3_text.lower() in SKIP_H3:
                current_h3 = None
                current_paras = []
                current_imgs = []
            else:
                current_h3 = h3_text
                current_paras = []
                current_imgs = []
        elif tag in ("p", "ul", "ol") and current_h3:
            t = el.get_text(" ", strip=True)
            if t:
                current_paras.append(t)
            for img in el.find_all("img"):
                src = img.get("data-lazy-src") or img.get("data-src") or img.get("src") or ""
                if src and "wp-content" in src:
                    current_imgs.append(src)
        elif tag == "figure" and current_h3:
            img = el.find("img")
            if img:
                src = img.get("data-lazy-src") or img.get("data-src") or img.get("src") or ""
                if src and "wp-content" in src:
                    current_imgs.append(src)

    flush()
    return url, sections


def main():
    results = {}
    for hero_slug, url_slug in GEN5:
        print(f"  Scrapeando {hero_slug}...", end=" ", flush=True)
        url, secs = scrape_build(hero_slug, url_slug)
        results[hero_slug] = {"url": url, "sections": secs}
        print(f"{len(secs)} secciones")
        time.sleep(1)

    # Guardar datos crudos
    with open("scripts/gen5-builds.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nDatos guardados en scripts/gen5-builds.json")

    # Generar SQL
    lines = [
        "do $do$",
        "declare",
        "  gid uuid;",
        "  hid uuid;",
        "begin",
        "  select id into gid from public.games where slug='call-of-dragons';",
    ]

    for hero_slug, data in results.items():
        url = data["url"]
        secs = data["sections"]
        if not secs:
            print(f"  AVISO: sin secciones para {hero_slug}")
            continue

        lines.append(f"  -- {hero_slug}")
        lines.append(f"  select id into hid from public.heroes where game_id=gid and slug={dq(hero_slug)};")
        lines.append(f"  delete from public.hero_builds where hero_id=hid;")

        for i, s in enumerate(secs):
            lines.append(
                f"  insert into public.hero_builds (hero_id, order_index, section, content, images, source_url, is_verified) "
                f"values (hid, {i}, {dq(s['section'])}, {dq(s['content'])}, {arr(s['images'])}, {dq(url)}, false);"
            )

    lines += ["end", "$do$;"]
    sql = "\n".join(lines)
    with open("scripts/gen5-builds-insert.sql", "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"SQL generado: {len(sql)} chars -> scripts/gen5-builds-insert.sql")


if __name__ == "__main__":
    main()
