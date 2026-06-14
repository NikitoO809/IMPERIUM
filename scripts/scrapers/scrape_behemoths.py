"""
Scraper de Behemoths de callofdragonsguides.com
Genera SQL para insertar en game_sections + section_blocks de IMPERIUM.
"""

import requests
from bs4 import BeautifulSoup
import time
import json
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

MAIN_URL = "https://callofdragonsguides.com/call-of-dragons-behemoths-guide/"

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

# ── Traducciones básicas de secciones ─────────────────────────────────────────
TRADUCCIONES = {
    "How to defeat": "Cómo derrotar al",
    "How to Defeat": "Cómo derrotar al",
    "Skills in lair": "Habilidades en guarida",
    "Skills in Alliance": "Habilidades en Alianza",
    "Location and Buffs": "Ubicación y Bonificaciones",
    "Coming Soon": "Próximamente",
    "Attack": "Ataque",
    "Health": "Vida",
    "Power": "Poder",
}

def traducir(texto):
    for en, es in TRADUCCIONES.items():
        texto = texto.replace(en, es)
    return texto


def limpiar_texto(element):
    """Extrae texto limpio de un elemento BeautifulSoup."""
    return element.get_text(separator="\n", strip=True)


def es_imagen_util(src):
    """Filtra imágenes de logo, anuncios y decorativas."""
    excluir = ["cropped-Call-of-Dragons-Guides", "Download-and-Play", "ad", "banner", "logo"]
    return not any(x.lower() in src.lower() for x in excluir)


def scrape_pagina(url):
    """Devuelve (titulo, intro_img, secciones) de una página de behemoth."""
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")

    # Título h1
    h1 = soup.find("h1")
    titulo = h1.get_text(strip=True) if h1 else "Behemoth"

    # Imagen principal (primera imagen grande en el article/entry)
    intro_img = None
    article = soup.find("article") or soup.find("div", class_=re.compile(r"entry|content|post"))
    if article:
        for img in article.find_all("img"):
            src = img.get("src", "")
            if src and es_imagen_util(src) and ("1120x630" in src or "featured" in src.lower()):
                intro_img = src
                break
        if not intro_img:
            for img in article.find_all("img"):
                src = img.get("src", "")
                if src and es_imagen_util(src):
                    intro_img = src
                    break

    # Secciones: cada h2 + contenido hasta el siguiente h2
    secciones = []
    if article:
        nodos = list(article.children)
        seccion_actual = None
        for nodo in article.descendants:
            if nodo.name == "h2":
                if seccion_actual:
                    secciones.append(seccion_actual)
                seccion_actual = {
                    "titulo": traducir(nodo.get_text(strip=True)),
                    "parrafos": [],
                    "imagenes": [],
                }
            elif seccion_actual and nodo.name in ("p", "li"):
                texto = nodo.get_text(strip=True)
                if texto and len(texto) > 5:
                    seccion_actual["parrafos"].append(texto)
            elif seccion_actual and nodo.name == "h3":
                texto = nodo.get_text(strip=True)
                if texto:
                    seccion_actual["parrafos"].append(f"### {texto}")
            elif seccion_actual and nodo.name == "img":
                src = nodo.get("src", "")
                if src and es_imagen_util(src) and src != intro_img:
                    seccion_actual["imagenes"].append(src)
        if seccion_actual:
            secciones.append(seccion_actual)

    return titulo, intro_img, secciones


def scrape_intro_general():
    """Scrape la página general de behemoths para el intro de la sección."""
    resp = requests.get(MAIN_URL, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")

    article = soup.find("article") or soup.find("div", class_=re.compile(r"entry|content|post"))

    intro_title = "Behemoths en Call of Dragons"
    intro_text = []
    intro_img = None

    if article:
        for img in article.find_all("img"):
            src = img.get("src", "")
            if src and es_imagen_util(src):
                intro_img = src
                break
        for elem in article.find_all(["p", "h2", "h3", "li"]):
            texto = elem.get_text(strip=True)
            if texto and len(texto) > 10 and "cookie" not in texto.lower():
                intro_text.append(texto)

    intro = "\n\n".join(intro_text[:8])  # primeros párrafos relevantes
    return intro_title, intro, intro_img


def escape_sql(texto):
    """Escapa para usar dentro de dollar-quoting (el tag evita conflictos)."""
    return texto  # con dollar-quoting no hace falta escapar comillas


def build_sql(data):
    """
    data = {
        intro_title, intro, intro_img,
        bloques: [{titulo, contenido, imagenes, url}]
    }
    """
    lines = []
    lines.append("DO $BEH$")
    lines.append("DECLARE")
    lines.append("  v_game_id uuid;")
    lines.append("  v_section_id uuid;")
    lines.append("BEGIN")
    lines.append("")
    lines.append("  -- Obtener game_id de Call of Dragons")
    lines.append("  SELECT id INTO v_game_id FROM games WHERE slug = 'call-of-dragons';")
    lines.append("")
    lines.append("  -- Borrar sección anterior si existe")
    lines.append("  DELETE FROM section_blocks WHERE section_id IN (")
    lines.append("    SELECT id FROM game_sections WHERE game_id = v_game_id AND slug = 'behemoths'")
    lines.append("  );")
    lines.append("  DELETE FROM game_sections WHERE game_id = v_game_id AND slug = 'behemoths';")
    lines.append("")

    # intro_images como array SQL
    intro_img = data.get("intro_img", "")
    intro_imgs_sql = f"ARRAY['{intro_img}']" if intro_img else "ARRAY[]::text[]"

    lines.append("  -- Insertar game_section")
    lines.append("  INSERT INTO game_sections (game_id, slug, title, intro_title, intro, intro_images, is_published)")
    lines.append("  VALUES (")
    lines.append(f"    v_game_id,")
    lines.append(f"    'behemoths',")
    lines.append(f"    'Behemoths',")
    lines.append(f"    $IT${data['intro_title']}$IT$,")
    lines.append(f"    $IN${data['intro']}$IN$,")
    lines.append(f"    {intro_imgs_sql},")
    lines.append(f"    true")
    lines.append("  ) RETURNING id INTO v_section_id;")
    lines.append("")

    for i, bloque in enumerate(data["bloques"], start=1):
        contenido = bloque["contenido"].replace("$", "\\$")  # seguridad extra
        imgs = bloque.get("imagenes", [])
        imgs_sql = "ARRAY[" + ",".join(f"'{url}'" for url in imgs) + "]" if imgs else "ARRAY[]::text[]"
        tag = f"$B{i}C$"
        tag_t = f"$B{i}T$"

        lines.append(f"  -- Bloque {i}: {bloque['titulo']}")
        lines.append(f"  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)")
        lines.append(f"  VALUES (")
        lines.append(f"    v_section_id,")
        lines.append(f"    {i},")
        lines.append(f"    {tag_t}{bloque['titulo']}{tag_t},")
        lines.append(f"    {tag}{bloque['contenido']}{tag},")
        lines.append(f"    '{bloque['url']}',")
        lines.append(f"    false,")
        lines.append(f"    {imgs_sql}")
        lines.append(f"  );")
        lines.append("")

    lines.append("END $BEH$;")
    return "\n".join(lines)


def main():
    print("=== Scraper Behemoths de callofdragonsguides.com ===\n")

    # 1. Intro general
    print("Scrapeando página general...")
    intro_title, intro, intro_img = scrape_intro_general()
    print(f"  Intro: {intro[:80]}...")
    time.sleep(1)

    # 2. Cada behemoth
    bloques = []
    for nombre, url in BEHEMOTHS:
        print(f"Scrapeando {nombre}...")
        try:
            titulo, img, secciones = scrape_pagina(url)

            # Construir contenido concatenando secciones
            partes = []
            for sec in secciones:
                partes.append(f"## {sec['titulo']}")
                if sec["parrafos"]:
                    partes.append("\n".join(sec["parrafos"]))

            contenido = "\n\n".join(partes)

            # Imágenes: portada + imágenes de secciones (sin duplicados)
            imagenes = []
            if img:
                imagenes.append(img)
            for sec in secciones:
                for i in sec["imagenes"]:
                    if i not in imagenes:
                        imagenes.append(i)

            bloques.append({
                "titulo": nombre,
                "contenido": contenido if contenido else f"Guía de {nombre} — próximamente.",
                "imagenes": imagenes[:5],
                "url": url,
            })
            print(f"  OK: {len(secciones)} secciones, {len(imagenes)} imágenes")
        except Exception as e:
            print(f"  ERROR: {e}")
            bloques.append({
                "titulo": nombre,
                "contenido": f"Guía de {nombre} — próximamente.",
                "imagenes": [],
                "url": url,
            })
        time.sleep(1)

    data = {
        "intro_title": intro_title,
        "intro": intro,
        "intro_img": intro_img or "",
        "bloques": bloques,
    }

    # 3. Guardar JSON (para traducción posterior)
    json_out = "scripts/behemoths_raw.json"
    with open(json_out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\nJSON guardado en {json_out}")

    # 4. Generar SQL (contenido en inglés — se traduce en paso siguiente)
    sql = build_sql(data)
    sql_out = "scripts/behemoths.sql"
    with open(sql_out, "w", encoding="utf-8") as f:
        f.write(sql)

    print(f"SQL generado en {sql_out} ({len(sql)} chars, {len(bloques)} behemoths)")
    print("Listo para traducir y ejecutar en Supabase.")


if __name__ == "__main__":
    main()
