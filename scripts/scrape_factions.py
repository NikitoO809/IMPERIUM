import requests
from bs4 import BeautifulSoup
import json

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
SOURCE_URL = "https://cod.guide/factions/"

resp = requests.get(SOURCE_URL, headers=headers, timeout=15)
resp.raise_for_status()
soup = BeautifulSoup(resp.text, "lxml")

article = (
    soup.find("article") or
    soup.find("div", class_=lambda c: c and "entry-content" in c)
)

# Imagen portada: primera imagen grande del artículo
intro_images = []
for img in article.find_all("img"):
    src = img.get("src") or img.get("data-src", "")
    if src and src.startswith("http"):
        intro_images.append(src)
        break

# Intro: texto antes del primer h2 (si lo hay)
intro_text = ""
first_h2 = article.find("h2")
if first_h2:
    for el in first_h2.previous_siblings:
        if hasattr(el, "get_text"):
            t = el.get_text(separator="\n", strip=True)
            if t:
                intro_text = t + "\n\n" + intro_text

# Seccionamos usando todos los h2 y h3 planos (en orden DOM)
headings = article.find_all(["h2", "h3"])

steps = []
for i, heading in enumerate(headings):
    title = heading.get_text(strip=True)
    content_parts = []
    images = []

    # Recolectar hermanos siguientes hasta el próximo heading del mismo nivel o superior
    for sib in heading.next_siblings:
        if not hasattr(sib, "name") or sib.name is None:
            # Texto plano
            t = str(sib).strip()
            if t:
                content_parts.append(t)
            continue

        # Parar en el próximo heading
        if sib.name in ("h2", "h3", "h4"):
            break

        # Imágenes
        for img in sib.find_all("img"):
            src = img.get("src") or img.get("data-src", "")
            if src and src.startswith("http"):
                images.append(src)

        text = sib.get_text(separator="\n", strip=True)
        if text:
            content_parts.append(text)

    content = "\n\n".join(content_parts)
    if title and (content or images):
        steps.append({"title": title, "content": content, "images": images})

result = {
    "title": "Mejores Facciones en Call of Dragons",
    "intro_title": soup.find("h1").get_text(strip=True) if soup.find("h1") else "",
    "intro": intro_text.strip(),
    "intro_images": intro_images,
    "source_url": SOURCE_URL,
    "steps": steps
}

print(f"H1: {result['intro_title']}")
print(f"Imágenes portada: {intro_images}")
print(f"Intro text: {intro_text[:200]}")
print(f"\nPasos encontrados: {len(steps)}")
for i, s in enumerate(steps, 1):
    print(f"\n--- PASO {i}: {s['title']} ---")
    print(s["content"][:500])
    if s["images"]:
        print(f"  Imgs: {s['images']}")

with open("scripts/factions_data.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print("\nGuardado en scripts/factions_data.json")
