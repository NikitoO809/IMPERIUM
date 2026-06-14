import requests
from bs4 import BeautifulSoup
import time

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

url = "https://cod.guide/factions/"
resp = requests.get(url, headers=headers, timeout=15)
resp.raise_for_status()

soup = BeautifulSoup(resp.text, "lxml")

# Buscar todos los links que parezcan sub-guías de facciones
print("=== LINKS EN /factions/ ===")
for a in soup.find_all("a", href=True):
    href = a["href"]
    text = a.get_text(strip=True)
    if text and len(text) > 3:
        print(f"  [{text}] -> {href}")

print("\n=== TÍTULOS H1/H2/H3 ===")
for tag in soup.find_all(["h1","h2","h3","h4"]):
    print(f"  <{tag.name}> {tag.get_text(strip=True)}")

print("\n=== ESTRUCTURA PRINCIPAL ===")
# Buscar contenedor principal
main = soup.find("main") or soup.find("article") or soup.find("div", class_=lambda c: c and "content" in c.lower())
if main:
    print(main.prettify()[:3000])
else:
    print(soup.body.prettify()[:3000] if soup.body else "No body found")
