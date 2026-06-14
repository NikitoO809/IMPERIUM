# Estructura interna de un .tieritem de héroe (para extraer nombre y descripción).
import requests
from bs4 import BeautifulSoup

H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
r = requests.get('https://www.allclash.com/call-of-dragons-best-heroes-tier-list/', timeout=30, headers=H)
soup = BeautifulSoup(r.text, 'lxml')

out = []
items = soup.select('.tieritem')
# El item [1] es Vardun (primer héroe). Volcar su HTML interno resumido.
for idx in (1, 3):
    it = items[idx]
    out.append(f'===== tieritem[{idx}] classes={it.get("class")} =====')
    for el in it.find_all(True, recursive=True):
        cls = ' '.join(el.get('class') or [])
        if el.name == 'img':
            out.append(f'  IMG class="{cls}" alt="{el.get("alt")}" src={el.get("src") or el.get("data-src")}')
        else:
            # solo texto directo del elemento (no de hijos) para ver dónde vive cada cosa
            direct = ''.join(t for t in el.find_all(string=True, recursive=False)).strip()
            if direct:
                out.append(f'  <{el.name} class="{cls}"> {direct[:120]}')
    out.append('')

with open('scripts/allclash-item.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
print('Escrito scripts/allclash-item.txt')
