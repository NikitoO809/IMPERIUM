"""
Scraper para https://cod.guide/beginners/
Guía de principiantes de Call of Dragons
"""
import requests
from bs4 import BeautifulSoup
import json
import time

URL = "https://cod.guide/beginners/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def scrape():
    print(f"Scrapeando: {URL}")
    time.sleep(1)
    r = requests.get(URL, headers=HEADERS, timeout=15)
    r.raise_for_status()
    print(f"Status: {r.status_code}")

    soup = BeautifulSoup(r.text, "lxml")

    # --- Título principal ---
    title = ""
    h1 = soup.find("h1")
    if h1:
        title = h1.get_text(strip=True)
    print(f"Título: {title}")

    # --- Descripción / intro ---
    description = ""
    # Buscar párrafo introductorio antes de las secciones
    intro_candidates = []
    for p in soup.find_all("p"):
        text = p.get_text(strip=True)
        if len(text) > 80:
            intro_candidates.append(text)
            if len(intro_candidates) >= 2:
                break
    if intro_candidates:
        description = " ".join(intro_candidates)

    # --- Imágenes del intro ---
    intro_images = []
    # Buscar imagen principal (hero/cover)
    for img in soup.find_all("img")[:5]:
        src = img.get("src") or img.get("data-src", "")
        if src and ("cod.guide" in src or src.startswith("http")) and "logo" not in src.lower():
            intro_images.append(src)
            break

    # --- Secciones / pasos ---
    # cod.guide usa headings (h2, h3) para separar secciones
    steps = []

    # Encontrar el contenido principal
    main = soup.find("main") or soup.find("article") or soup.find("div", class_=lambda c: c and "content" in c)
    if not main:
        main = soup.body

    # Recolectar todos los headings h2 como secciones principales
    headings = main.find_all(["h2", "h3"])
    print(f"Headings encontrados: {len(headings)}")

    for i, heading in enumerate(headings):
        step_title = heading.get_text(strip=True)
        if not step_title:
            continue

        # Recopilar contenido hasta el siguiente heading del mismo nivel o superior
        content_parts = []
        images = []

        tag = heading.find_next_sibling()
        while tag:
            # Parar si encontramos otro heading del mismo nivel
            if tag.name in ["h2", "h3"]:
                break

            # Texto
            text = tag.get_text(strip=True)
            if text and len(text) > 2:
                content_parts.append(text)

            # Imágenes
            for img in tag.find_all("img"):
                src = img.get("src") or img.get("data-src", "")
                if src and src.startswith("http"):
                    images.append(src)

            tag = tag.find_next_sibling()

        content = "\n\n".join(content_parts)

        if step_title or content:
            steps.append({
                "title": step_title,
                "content": content,
                "images": images,
                "source_url": URL
            })
            print(f"  Paso {i+1}: {step_title[:60]} | imgs: {len(images)}")

    result = {
        "title": title,
        "description": description,
        "intro_images": intro_images,
        "steps": steps
    }

    with open("scripts/beginners_raw.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\nTotal pasos: {len(steps)}")
    print("Guardado en scripts/beginners_raw.json")
    return result

if __name__ == "__main__":
    scrape()
