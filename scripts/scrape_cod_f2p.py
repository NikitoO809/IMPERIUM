# Scraper de https://cod.guide/free-to-play/ para IMPERIUM.
# Extrae SOLO el contenido de la guía (secciones H2/H3, párrafos, listas, imágenes).
# Descarta: menú, sidebar, footer, anuncios, comentarios, breadcrumbs.
import json, time, requests
from bs4 import BeautifulSoup

URL = "https://cod.guide/free-to-play/"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


def abs_url(src):
    if not src:
        return None
    if src.startswith("http"):
        return src
    if src.startswith("//"):
        return "https:" + src
    return "https://cod.guide" + src


def txt(el):
    return el.get_text(" ", strip=True) if el else ""


def extract_block(container):
    """Extrae texto limpio e imágenes de un contenedor HTML."""
    parts = []
    images = []
    for el in container.find_all(["p", "li", "h3", "h4", "img", "figcaption"], recursive=True):
        if el.name == "img":
            u = abs_url(el.get("src") or el.get("data-src"))
            if u and u not in images:
                images.append(u)
        elif el.name == "figcaption":
            t = txt(el)
            if t:
                parts.append(f"[{t}]")
        elif el.name in ("h3", "h4"):
            t = txt(el)
            if t:
                parts.append(f"### {t}")
        elif el.name == "li":
            t = txt(el)
            if t:
                parts.append(f"• {t}")
        elif el.name == "p":
            t = txt(el)
            if t:
                parts.append(t)
    # Quitar duplicados consecutivos
    clean = []
    for p in parts:
        if not clean or clean[-1] != p:
            clean.append(p)
    return "\n\n".join(clean), images


def scrape():
    r = requests.get(URL, timeout=30, headers=HEADERS)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")

    # Buscar el contenedor principal del artículo
    article = (
        soup.find("article")
        or soup.find("main")
        or soup.find(class_=lambda c: c and any(x in c for x in ["entry-content", "post-content", "article-content", "content"]))
    )
    if not article:
        article = soup.body

    # Eliminar ruido: menú, sidebar, footer, anuncios, comentarios
    for tag in article.find_all(["nav", "aside", "footer", "script", "style",
                                  "form", "header"]):
        tag.decompose()
    for tag in article.find_all(class_=lambda c: c and any(x in " ".join(c) for x in [
        "sidebar", "comment", "footer", "nav", "menu", "ad", "social",
        "breadcrumb", "related", "recent", "share", "cookie"
    ])):
        tag.decompose()

    # Título e intro de la guía
    h1 = article.find("h1")
    title = txt(h1) if h1 else "Free-to-Play Guide"

    # Descripción/intro: texto antes del primer H2
    intro_parts = []
    intro_images = []
    first_h2 = article.find("h2")
    if first_h2:
        for sib in first_h2.previous_siblings:
            if not getattr(sib, "name", None):
                continue
            if sib.name in ("p",):
                t = txt(sib)
                if t:
                    intro_parts.insert(0, t)
            elif sib.name == "img":
                u = abs_url(sib.get("src") or sib.get("data-src"))
                if u:
                    intro_images.insert(0, u)
    intro = "\n\n".join(intro_parts)

    # Secciones principales (cada H2 es un paso)
    sections = []
    h2s = article.find_all("h2")
    for i, h2 in enumerate(h2s):
        sec_title = txt(h2)
        # Recoger todo hasta el siguiente H2
        container = BeautifulSoup("<div></div>", "lxml").div
        for sib in h2.next_siblings:
            if getattr(sib, "name", None) == "h2":
                break
            container.append(BeautifulSoup(str(sib), "lxml"))
        content, images = extract_block(container)
        if sec_title or content:
            sections.append({
                "title": sec_title,
                "content": content,
                "images": images,
                "source_url": URL,
            })

    result = {
        "slug": "free-to-play",
        "url": URL,
        "title": title,
        "description": intro,
        "introImages": intro_images,
        "sections": sections,
    }

    out_path = "scripts/cod-f2p.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Título: {title}")
    print(f"Intro: {len(intro)} chars, {len(intro_images)} imágenes")
    print(f"Secciones: {len(sections)}")
    for s in sections:
        imgs = len(s["images"])
        print(f"  • {s['title'][:60]} — {len(s['content'])} chars, {imgs} imgs")
    print(f"\nGuardado en {out_path}")
    return result


if __name__ == "__main__":
    scrape()
