import requests
from bs4 import BeautifulSoup

H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
r = requests.get('https://www.allclash.com/call-of-dragons-best-heroes-tier-list/', timeout=30, headers=H)
soup = BeautifulSoup(r.text, 'lxml')

# ¿Nombres de héroes conocidos en el HTML crudo?
for name in ['Theodore', 'Liliya', 'Vardun', 'Cantaman', 'Bahiti', 'Nika']:
    print(f'  "{name}" en HTML:', name in r.text)

# Imágenes wp-content totales en el documento
imgs = soup.find_all('img')
wp = [im for im in imgs if 'wp-content' in (im.get('src') or im.get('data-src') or im.get('data-lazy-src') or '')]
print('imgs totales:', len(imgs), '| wp-content:', len(wp))

# ¿Dónde están los h3 de generación? Mostrar su contenedor padre y siblings reales
for h in soup.find_all('h3'):
    if 'GENERATION' in h.get_text():
        print(f'\n=== {h.get_text(strip=True)} ===')
        print('  padre:', h.parent.name, h.parent.get("class"))
        # hermanos siguientes del h3
        sib = h.next_sibling
        shown = 0
        node = h
        for _ in range(8):
            node = node.find_next()
            if node is None:
                break
            if getattr(node, 'name', None) in ('img', 'figure', 'p', 'ul', 'div', 'table'):
                t = node.get_text(' ', strip=True)[:70] if hasattr(node, 'get_text') else ''
                cls = node.get('class') if hasattr(node, 'get') else None
                if t or node.name in ('img', 'figure'):
                    print(f'    <{node.name}> {cls} | {t}')
                    shown += 1
            if shown >= 4:
                break
        break  # solo la primera generación para muestra
