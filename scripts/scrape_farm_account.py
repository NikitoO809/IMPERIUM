import requests
from bs4 import BeautifulSoup, NavigableString
import json
import time

URL = "https://cod.guide/farm-account/"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; IMPERIUM-scraper/1.0)"}

# Headings que son navegacion/footer — los excluimos
SKIP_HEADINGS = {
    "Recent Call of Dragons Guides",
    "Friends",
    "Links",
    "Choose a Label Background Color:",
    "Edit Label Text Below:",
}

time.sleep(1)
r = requests.get(URL, headers=HEADERS, timeout=15)
r.raise_for_status()

soup = BeautifulSoup(r.text, "lxml")

# Título
title_text = soup.find("h1").get_text(strip=True)

# Contenedor principal del artículo
article = soup.find("article") or soup.find("div", class_="entry-content")

# Recorremos todos los elementos en orden (flatten)
all_tags = article.find_all(["h2", "h3", "p", "ul", "ol", "table", "figure", "img"])

steps = []
current = None
intro_parts = []
intro_images = []
in_intro = True

for el in all_tags:
    tag = el.name

    if tag in ("h2", "h3"):
        heading = el.get_text(strip=True)

        # Paramos en secciones de nav/footer
        if heading in SKIP_HEADINGS:
            break

        in_intro = False

        # Guardar paso anterior
        if current is not None:
            steps.append(current)

        current = {
            "title": heading,
            "content": "",
            "images": [],
            "source_url": URL,
        }

    elif in_intro:
        if tag == "p":
            txt = el.get_text(strip=True)
            if txt:
                intro_parts.append(txt)
        if tag in ("figure", "img"):
            for img in el.find_all("img"):
                src = img.get("src") or img.get("data-src", "")
                if src and not src.startswith("data:"):
                    intro_images.append(src)

    else:
        if current is None:
            continue
        if tag in ("p", "ul", "ol", "table"):
            txt = el.get_text(separator="\n", strip=True)
            if txt:
                current["content"] += txt + "\n\n"
        if tag in ("figure", "img"):
            for img in el.find_all("img"):
                src = img.get("src") or img.get("data-src", "")
                if src and not src.startswith("data:"):
                    current["images"].append(src)

if current is not None:
    steps.append(current)

# Limpiar
for s in steps:
    s["content"] = s["content"].strip()

result = {
    "title": title_text,
    "description": " ".join(intro_parts).strip(),
    "intro_images": intro_images,
    "source_url": URL,
    "steps": steps,
}

print(json.dumps(result, ensure_ascii=False, indent=2))
