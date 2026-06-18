"""
Scraper dedicado de https://cod.guide/talent-tree-builds/
Extrae datos ESTRUCTURADOS por héroe para el visor TalentBuildsViewer:
  - name, portrait (retrato), intro (texto), builds: [{label, img, mode}]

Estructura real de la página:
  · Cada héroe = un <h2>/<h3> "<Héroe> Talent Trees".
  · Cada árbol = un <figure> con <img> + <figcaption> (= nombre del build).
  · El retrato del SIGUIENTE héroe aparece como un <img> .png suelto al final
    de la sección (lo usamos para asignar el retrato correcto a cada héroe).

Salida: scripts/data/_talent_builds_raw.json
"""
import requests, json, re
from bs4 import BeautifulSoup

URL = "https://cod.guide/talent-tree-builds/"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
           "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}


def clean(s):
    return re.sub(r"\s+", " ", (s or "")).strip()


def img_src(img):
    for k in ("data-src", "data-lazy-src", "src"):
        v = img.get(k)
        if v and v.startswith("http") and "data:image" not in v:
            return v.split("?")[0]
    return None


# Detecta el "modo" del build a partir del label/filename (para el distintivo de color)
MODE_RULES = [
    ("Marksman", ["marksman", "ranged"]),
    ("Behemoths", ["behemoth", "behenmoth"]),
    ("PvP", ["pvp", "1 vs 1", "1vs1", "nuke", "field battle", "kill"]),
    ("Pacificación", ["peacekeeping", "darkling", "pve"]),
    ("Movilidad", ["mobility", "speed"]),
    ("Control", ["control"]),
    ("Tanque", ["tank", "defense", "def"]),
    ("Mixto", ["all-rounder", "all rounder", "balanced"]),
    ("Magia", ["magic", "mage"]),
    ("Farmeo", ["gathering", "farm"]),
]


def detect_mode(label, img):
    hay = (label + " " + (img or "")).lower()
    for mode, kws in MODE_RULES:
        if any(k in hay for k in kws):
            return mode
    return "General"


def is_portrait(src):
    # Retratos: .png con nombre corto de héroe (sin "talent"/"build"/dimensiones)
    if not src or not src.lower().endswith(".png"):
        return False
    name = src.rsplit("/", 1)[-1].lower()
    return not any(x in name for x in ("talent", "build", "1024", "tree"))


def scrape():
    r = requests.get(URL, headers=HEADERS, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")
    for t in soup(["script", "style", "nav", "footer", "noscript"]):
        t.decompose()
    main = soup.find("main") or soup.find("article") or soup.body

    def label_from_filename(src, name):
        base = src.rsplit("/", 1)[-1].rsplit(".", 1)[0]
        base = re.sub(r"-?\d+x\d+$", "", base)               # quita dimensiones
        base = base.replace(name.lower(), "").replace("-", " ").replace("talent", "")
        base = base.replace("tree", "").replace("build", "").replace("guide", "")
        return clean(base).title() or name

    # Recorremos TODOS los elementos relevantes en orden; el héroe activo es el
    # último heading "<X> Talent Trees" visto. Así capturamos galerías con varias
    # imágenes en un mismo <div> (cada <img> es un elemento aparte).
    heroes = []
    current = None
    for el in main.find_all(["h2", "h3", "figure", "img", "p", "ul", "ol"]):
        nm = el.name
        if nm in ("h2", "h3"):
            txt = clean(el.get_text())
            if re.search(r"Talent Tree", txt, re.I) and "best call of dragons" not in txt.lower():
                name = re.sub(r"\s*Talent Trees?\s*", "", txt).replace("’s", "").replace("'s", "").strip()
                current = {"name": name, "intro_parts": [], "builds": [], "_next_portrait": None}
                heroes.append(current)
            else:
                current = None          # heading no-talento -> fin de la zona útil
            continue
        if current is None:
            continue
        if nm == "img":
            if el.find_parent("figure"):
                continue                # se maneja vía <figure>
            src = img_src(el)
            if not src:
                continue
            if is_portrait(src):
                current["_next_portrait"] = src
            else:
                current["builds"].append({"label_en": label_from_filename(src, current["name"]),
                                          "img": src, "mode": detect_mode("", src)})
        elif nm == "figure":
            img = el.find("img"); fc = el.find("figcaption")
            src = img_src(img) if img else None
            if not src:
                continue
            cap = clean(fc.get_text(" ")) if fc else ""
            if is_portrait(src):
                current["_next_portrait"] = src
            else:
                current["builds"].append({"label_en": cap or label_from_filename(src, current["name"]),
                                          "img": src, "mode": detect_mode(cap, src)})
        elif nm in ("p", "ul", "ol"):
            txt = clean(el.get_text(" "))
            if txt and len(txt) > 2 and not txt.lower().startswith("rate this"):
                current["intro_parts"].append(txt)

    for hero in heroes:
        hero["intro_en"] = "\n\n".join(hero.pop("intro_parts"))

    # Asignar retrato: el de cada héroe = el "_next_portrait" del héroe anterior
    for i, hero in enumerate(heroes):
        hero["portrait"] = heroes[i - 1]["_next_portrait"] if i > 0 else None

    # Retratos que falten (1º héroe y alguno suelto): construir por nombre y verificar
    for hero in heroes:
        if not hero["portrait"]:
            guess = f"https://cdn.cod.guide/wp-content/uploads/2023/03/{hero['name'].lower()}.png"
            try:
                if requests.head(guess, headers=HEADERS, timeout=15).status_code == 200:
                    hero["portrait"] = guess
            except Exception:
                pass
    for hero in heroes:
        hero.pop("_next_portrait", None)

    out = {"source_url": URL, "n_heroes": len(heroes), "heroes": heroes}
    with open("scripts/data/_talent_builds_raw.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    for hero in heroes:
        print(f"{hero['name']:12} | builds:{len(hero['builds'])} | retrato:{'sí' if hero['portrait'] else 'NO'}")
    print(f"\nTotal héroes: {len(heroes)} -> scripts/data/_talent_builds_raw.json")


if __name__ == "__main__":
    scrape()
