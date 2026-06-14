import requests
from bs4 import BeautifulSoup
import json, time

URL = "https://cod.guide/artifacts/"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; IMPERIUM-scraper/1.0)"}

SKIP_HEADINGS = {
    "Recent Call of Dragons Guides", "Friends", "Links",
    "Choose a Label Background Color:", "Edit Label Text Below:",
}

time.sleep(1)
r = requests.get(URL, headers=HEADERS, timeout=15)
r.raise_for_status()
soup = BeautifulSoup(r.text, "lxml")

title_tag = soup.find("h1")
title_text = title_tag.get_text(strip=True) if title_tag else "Artifacts"

article = soup.find("article") or soup.find("div", class_="entry-content")
all_tags = article.find_all(["h2", "h3", "p", "ul", "ol", "table", "figure", "img"])

blocks = []
current = None
intro_parts = []
intro_images = []
in_intro = True

for el in all_tags:
    tag = el.name
    if tag in ("h2", "h3"):
        heading = el.get_text(strip=True)
        if heading in SKIP_HEADINGS:
            break
        in_intro = False
        if current is not None:
            blocks.append(current)
        current = {"title": heading, "content": "", "images": [], "source_url": URL}
    elif in_intro:
        if tag == "p":
            txt = el.get_text(strip=True)
            if txt:
                intro_parts.append(txt)
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
        for img in el.find_all("img"):
            src = img.get("src") or img.get("data-src", "")
            if src and not src.startswith("data:"):
                current["images"].append(src)

if current is not None:
    blocks.append(current)

for b in blocks:
    b["content"] = b["content"].strip()

result = {
    "title": title_text,
    "intro": " ".join(intro_parts).strip(),
    "intro_images": intro_images,
    "source_url": URL,
    "blocks": blocks,
}
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
print(json.dumps(result, ensure_ascii=False, indent=2))
