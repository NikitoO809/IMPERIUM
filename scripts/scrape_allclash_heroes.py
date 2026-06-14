# Scraper de la tier list de héroes de Call of Dragons (allclash.com).
# Recorre los .tieritem en orden: las cabeceras de generación (.itemheadline) marcan
# el grupo; cada héroe lleva nombre, tier (de la clase tiercode-*), facción, clase,
# rol, descripción e imagen. Vuelca a scripts/allclash-heroes.json (UTF-8).
import json
import requests
from bs4 import BeautifulSoup

H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
URL = 'https://www.allclash.com/call-of-dragons-best-heroes-tier-list/'

TIER_MAP = {
    'new': 'NEW', 'ss': 'S+', 's': 'S', 'as': 'A+', 'a': 'A',
    'bs': 'B+', 'b': 'B', 'cs': 'C+', 'c': 'C', 'd': 'D',
}


def txt(el):
    return el.get_text(' ', strip=True) if el else ''


def tier_from_classes(classes):
    for c in classes:
        if c.startswith('tiercode-'):
            return TIER_MAP.get(c.replace('tiercode-', ''), c.replace('tiercode-', '').upper())
    return ''


def main():
    r = requests.get(URL, timeout=30, headers=H)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, 'lxml')

    items = soup.select('.tieritem')
    heroes = []
    current_gen = ''
    for it in items:
        classes = it.get('class') or []
        if 'itemheadline' in classes:
            # Cabecera de generación: "GENERATION 5 Here are all heroes..."
            name_el = it.find(class_='itemname') or it
            t = txt(name_el)
            # Quedarnos solo con "GENERATION N"
            current_gen = t.split('Here are')[0].strip() if 'Here are' in t else t.strip()
            continue

        name = txt(it.select_one('.itemname'))
        if not name:
            continue
        tier = tier_from_classes(classes)
        desc = txt(it.select_one('.maindescription'))

        # Pares additionaldesc: [faccion, clase], [rol, especialidad]
        names = [txt(x).rstrip(':') for x in it.select('.additionaldesc-name')]
        texts = [txt(x) for x in it.select('.additionaldesc-text')]
        faction = names[0] if len(names) > 0 else ''
        hero_class = texts[0] if len(texts) > 0 else ''
        role = names[1] if len(names) > 1 else ''
        specialty = texts[1] if len(texts) > 1 else ''

        img = it.find('img')
        img_src = ''
        if img:
            img_src = img.get('data-lazy-src') or img.get('data-src') or img.get('src') or ''

        heroes.append({
            'generation': current_gen,
            'name': name,
            'tier': tier,
            'faction': faction,
            'heroClass': hero_class,
            'role': role,
            'specialty': specialty,
            'description': desc,
            'image': img_src,
        })

    with open('scripts/allclash-heroes.json', 'w', encoding='utf-8') as f:
        json.dump(heroes, f, ensure_ascii=False, indent=2)

    # Resumen por generación
    from collections import Counter
    by_gen = Counter(h['generation'] for h in heroes)
    print(f'Héroes extraídos: {len(heroes)}')
    for g, n in by_gen.items():
        print(f'  {g}: {n}')
    # Muestra
    h0 = heroes[0]
    print('\nEjemplo:', h0['name'], '|', h0['tier'], '|', h0['faction'], '|',
          h0['heroClass'], '|', h0['role'], '|', h0['image'][-40:])


if __name__ == '__main__':
    main()
