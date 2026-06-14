import requests, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from bs4 import BeautifulSoup

URL = "https://cod.guide/artifacts/"
r = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
soup = BeautifulSoup(r.text, "lxml")

table = soup.find("table")
rows = []

for tr in table.find_all("tr")[1:]:
    cells = tr.find_all("td")
    if not cells:
        continue

    # Col 0: imagen del artefacto + nombre
    artifact_img = ""
    img_tag = cells[0].find("img")
    if img_tag:
        artifact_img = img_tag.get("src") or img_tag.get("data-src", "")
        if artifact_img.startswith("data:"):
            artifact_img = img_tag.get("data-src", "")
    artifact_name = cells[0].get_text(strip=True)

    # Col 1: Tier (no aparece en la foto pero está en el HTML)
    tier = cells[1].get_text(strip=True) if len(cells) > 1 else ""

    # Col 2: Type(s)
    types = cells[2].get_text(strip=True) if len(cells) > 2 else ""

    # Col 3: Hero To Pair — imágenes de héroes + texto opcional
    hero_images = []
    hero_label = ""
    if len(cells) > 3:
        for img in cells[3].find_all("img"):
            src = img.get("src") or img.get("data-src", "")
            if src and not src.startswith("data:"):
                hero_images.append(src)
        # Texto adicional (ej: "Melee", "Any")
        texts = [t.strip() for t in cells[3].find_all(string=True) if t.strip()]
        hero_label = " ".join(texts).strip()

    # Col 4: Range
    range_ = cells[4].get_text(strip=True) if len(cells) > 4 else ""

    # Col 5: Attributes
    attributes = cells[5].get_text(strip=True) if len(cells) > 5 else ""

    rows.append({
        "name": artifact_name,
        "artifact_img": artifact_img,
        "tier": tier,
        "types": types,
        "hero_images": hero_images,
        "hero_label": hero_label,
        "range": range_,
        "attributes": attributes,
    })

print(json.dumps(rows, ensure_ascii=False, indent=2))
