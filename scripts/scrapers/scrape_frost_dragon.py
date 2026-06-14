"""Scrapea la guía del Frost Dragon y devuelve contenido + imagen."""
import requests
from bs4 import BeautifulSoup
import re

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
URL = "https://callofdragonsguides.com/frost-dragon/"

EXCLUIR = ["cropped-Call-of-Dragons-Guides", "Download-and-Play", "77x84"]

def es_util(src):
    return src and not any(x in src for x in EXCLUIR) and not src.startswith("data:")

resp = requests.get(URL, headers=HEADERS, timeout=15)
soup = BeautifulSoup(resp.text, "lxml")

# og:image
og = soup.find("meta", property="og:image")
img = og["content"] if og and og.get("content") and es_util(og["content"]) else None
print(f"IMAGEN: {img}")

# Secciones h2 + h3
article = soup.find("article") or soup.find("div", class_=re.compile(r"entry|content"))
secciones = []
sec_actual = None
if article:
    for nodo in article.descendants:
        if nodo.name == "h2":
            if sec_actual:
                secciones.append(sec_actual)
            sec_actual = {"titulo": nodo.get_text(strip=True), "parrafos": []}
        elif sec_actual and nodo.name in ("p", "li"):
            t = nodo.get_text(strip=True)
            if t and len(t) > 5:
                sec_actual["parrafos"].append(t)
        elif sec_actual and nodo.name == "h3":
            t = nodo.get_text(strip=True)
            if t:
                sec_actual["parrafos"].append(f"### {t}")
    if sec_actual:
        secciones.append(sec_actual)

partes = []
for s in secciones:
    partes.append(f"## {s['titulo']}")
    if s["parrafos"]:
        partes.append("\n".join(s["parrafos"]))

contenido = "\n\n".join(partes)
print(f"\nCONTENIDO ({len(contenido)} chars):\n{contenido[:500]}...")

with open("scripts/frost_dragon_raw.txt", "w", encoding="utf-8") as f:
    f.write(f"IMG:{img}\n---\n{contenido}")
print("\nGuardado en scripts/frost_dragon_raw.txt")
