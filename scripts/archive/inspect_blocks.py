import requests
from bs4 import BeautifulSoup

r = requests.get('https://eog.gg/games/sword-x-staff/guides/beginner-guide/',
                 timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
soup = BeautifulSoup(r.text, 'lxml')
hc = soup.select_one('.hub-content')

for sec in hc.select('.sxs-section'):
    t = sec.select_one('.sxs-section__title')
    if not t:
        continue
    title = t.get_text(strip=True)
    if 'Triangle' in title or 'Season Timeline' in title:
        print(f'=== {title} ===')
        for el in sec.find_all(True):
            c = ' '.join(el.get('class') or [])
            if el.name in ('p', 'span', 'div', 'li'):
                txt = el.get_text(' ', strip=True)[:60]
                if txt and c:
                    print(f'  {el.name:4} | {c:30} | {txt}')
        print()
