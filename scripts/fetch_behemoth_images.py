"""
Obtiene las URLs reales de imágenes de cada behemoth desde og:image/data-src
y genera SQL para actualizar section_blocks en Supabase.
"""

import requests
from bs4 import BeautifulSoup
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

BEHEMOTHS = [
    ("Flame Dragon",  "https://callofdragonsguides.com/flame-dragon/"),
    ("Giant Bear",    "https://callofdragonsguides.com/giant-bear-guide/"),
    ("Giant",         "https://callofdragonsguides.com/giant-guide/"),
    ("Magma Daemon",  "https://callofdragonsguides.com/magma-daemon-guide/"),
    ("Thunder Roc",   "https://callofdragonsguides.com/thunder-roc-guide/"),
    ("Necrogiant",    "https://callofdragonsguides.com/necrogiant-guide/"),
    ("Hydra",         "https://callofdragonsguides.com/hydra-guide/"),
    ("Direbear",      "https://callofdragonsguides.com/direbear-guide/"),
]

EXCLUIR = ["cropped-Call-of-Dragons-Guides", "Download-and-Play", "77x84", "logo"]

def es_util(src):
    return src and not any(x in src for x in EXCLUIR) and not src.startswith("data:")

def get_image(url):
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")

    # 1. og:image (siempre presente en WordPress)
    og = soup.find("meta", property="og:image")
    if og and og.get("content") and es_util(og["content"]):
        return og["content"]

    # 2. twitter:image
    tw = soup.find("meta", attrs={"name": "twitter:image"})
    if tw and tw.get("content") and es_util(tw["content"]):
        return tw["content"]

    # 3. data-src en imágenes del article
    article = soup.find("article") or soup.find("div", class_=re.compile(r"entry|content"))
    if article:
        for img in article.find_all("img"):
            src = img.get("data-src") or img.get("data-lazy-src") or img.get("src", "")
            if es_util(src) and "1120x630" in src:
                return src
        for img in article.find_all("img"):
            src = img.get("data-src") or img.get("data-lazy-src") or img.get("src", "")
            if es_util(src):
                return src

    return None


def main():
    resultados = {}
    for nombre, url in BEHEMOTHS:
        print(f"  {nombre}...", end=" ")
        try:
            img = get_image(url)
            resultados[nombre] = img
            print(img or "NO ENCONTRADA")
        except Exception as e:
            print(f"ERROR: {e}")
            resultados[nombre] = None

    print("\n=== SQL para actualizar imágenes ===\n")
    sql_lines = []
    for nombre, img in resultados.items():
        if img:
            safe = img.replace("'", "''")
            sql_lines.append(
                f"UPDATE section_blocks SET images = ARRAY['{safe}']::text[] "
                f"WHERE title = '{nombre}' AND section_id IN "
                f"(SELECT id FROM game_sections WHERE slug = 'behemoths');"
            )
        else:
            print(f"-- SIN IMAGEN: {nombre}")

    sql = "\n".join(sql_lines)
    print(sql)

    with open("scripts/behemoths_images.sql", "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"\nGuardado en scripts/behemoths_images.sql")


if __name__ == "__main__":
    main()
