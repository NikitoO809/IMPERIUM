# Vuelca la estructura del componente tier list de allclash a un archivo UTF-8.
import requests
from bs4 import BeautifulSoup

H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
r = requests.get('https://www.allclash.com/call-of-dragons-best-heroes-tier-list/', timeout=30, headers=H)
soup = BeautifulSoup(r.text, 'lxml')

out = []
# Buscar el contenedor de la tier list (clases tieritem / tier-color-*)
tieritems = soup.select('.tieritem')
out.append(f'Total .tieritem: {len(tieritems)}')

# Mostrar las clases distintas que aparecen en .tieritem
from collections import Counter
cls_counter = Counter()
for t in tieritems:
    cls_counter[' '.join(t.get('class') or [])] += 1
out.append('Clases de .tieritem:')
for c, n in cls_counter.most_common():
    out.append(f'  {n:3}x  {c}')

# Volcar los primeros ~40 .tieritem: clase + texto + nº imágenes + primer img alt/src
out.append('\n=== Secuencia de .tieritem (primeros 40) ===')
for i, t in enumerate(tieritems[:40]):
    cls = ' '.join(t.get('class') or [])
    txt = t.get_text(' ', strip=True)[:60]
    imgs = t.find_all('img')
    imginfo = ''
    if imgs:
        im = imgs[0]
        src = im.get('data-lazy-src') or im.get('data-src') or im.get('src') or ''
        imginfo = f' | {len(imgs)}img alt="{(im.get("alt") or "")[:25]}" src=...{src[-45:]}'
    out.append(f'[{i}] ({cls}) "{txt}"{imginfo}')

with open('scripts/allclash-structure.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
print('Escrito scripts/allclash-structure.txt')
print(f'Total .tieritem: {len(tieritems)}')
