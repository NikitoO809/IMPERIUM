# Scraper de cod.guide/factions/ para la sección Facciones de Call of Dragons.
import json, requests
from bs4 import BeautifulSoup

URL = "https://cod.guide/factions/"
H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

r = requests.get(URL, timeout=30, headers=H)
r.raise_for_status()
soup = BeautifulSoup(r.text, 'lxml')

main = soup.select_one('article') or soup.select_one('.entry-content') or soup.select_one('main')

sections = []
current = None

def flush():
    if current and (current['content'] or current['images']):
        sections.append(dict(current))

for el in main.find_all(['h1','h2','h3','p','ul','img']):
    tag = el.name
    if tag in ('h1','h2','h3'):
        flush()
        title = el.get_text(' ', strip=True)
        # Saltar secciones de navegación/sidebar
        skip_words = ['recent','friends','links','label','background','edit']
        if any(w in title.lower() for w in skip_words):
            current = None
            continue
        current = {'title': title, 'content': '', 'images': []}
    elif tag == 'p' and current is not None:
        t = el.get_text(' ', strip=True)
        if t:
            current['content'] += ('\n\n' if current['content'] else '') + t
        # imágenes dentro del párrafo
        for img in el.find_all('img'):
            src = img.get('src','') or img.get('data-src','') or ''
            if src and src.startswith('http') and 'cdn.cod.guide' in src:
                if src not in current['images']:
                    current['images'].append(src)
    elif tag == 'ul' and current is not None:
        items = [li.get_text(' ', strip=True) for li in el.find_all('li') if li.get_text(strip=True)]
        if items:
            bullet_text = '\n'.join(f'• {i}' for i in items)
            current['content'] += ('\n\n' if current['content'] else '') + bullet_text
    elif tag == 'img' and current is not None:
        src = el.get('src','') or el.get('data-src','') or ''
        if src and src.startswith('http') and 'cdn.cod.guide' in src:
            if src not in current['images']:
                current['images'].append(src)

flush()

# Filtrar secciones vacías o de navegación
sections = [s for s in sections if s['content'].strip() and len(s['content']) > 50]

out = {'url': URL, 'sections': sections}
with open('scripts/facciones-raw.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print(f"Secciones extraídas: {len(sections)}")
for s in sections:
    print(f"  [{len(s['images'])} imgs] {s['title'][:60]}")
    print(f"    {s['content'][:100]}...")
