# -*- coding: utf-8 -*-
"""La regla comun a las ocho clases: mana, estado y castigo."""
import json
import os
from PIL import Image, ImageDraw
from guia_base import (f, etiqueta, lienzo, cerrar, banda, CAJA, ROJO, ORO, VERDE,
                       AZUL, BLANCO, TEXTO, GRIS)

MAPAS = {}


def ico(img, clase, nombre, xy, lado=52, borde=None):
    """Como icono() pero eligiendo la carpeta de cada clase."""
    if clase not in MAPAS:
        with open('iconos/%s/mapa.json' % clase, encoding='utf-8') as fh:
            MAPAS[clase] = json.load(fh)
    d = ImageDraw.Draw(img)
    x, y = xy
    d.rounded_rectangle([x, y, x + lado, y + lado], radius=8, fill=CAJA)
    ruta = 'iconos/%s/%s.webp' % (clase, MAPAS[clase].get(nombre, ''))
    if os.path.exists(ruta):
        im = Image.open(ruta).convert('RGBA').resize((lado - 8, lado - 8), Image.LANCZOS)
        img.paste(im, (x + 4, y + 4), im)
    else:
        d.text((x + lado // 2, y + lado // 2), '?', font=f(20, True), fill=GRIS, anchor='mm')
    if borde:
        d.rounded_rectangle([x - 2, y - 2, x + lado + 2, y + lado + 2], radius=10, outline=borde, width=3)


# clase, nombre en español, (mana), (estado que aplica), (castigo, recarga, estado exigido)
FILAS = [
    ('gladiator', 'Gladiator', 'Keen Strike', 'Rush Strike', 'Derribo', 'Overhead Slam', '5s', 'Derribo'),
    ('templar', 'Templar', 'Vicious Strike', 'Shield Smite', 'Aturdido', 'Judgment', '5s', 'Aturdido'),
    ('assassin', 'Assassin', 'Quick Slice', 'Whirlwind Slice', 'Aturdido', 'Shadow Fall', '20s', 'Aturdido'),
    ('ranger', 'Ranger', 'Snipe', 'Snare Shot', 'Ralentizado', 'Burst Arrow', '20s', 'Ralentizado'),
    ('sorcerer', 'Sorcerer', 'Flame Arrow', 'Frost', 'Congelado', 'Frost Burst', '10s', 'Congelado'),
    ('chanter', 'Chanter', 'Onslaught', 'Impactful Crush', 'Aturdido', 'Dark Crush', '5s', 'Aturdido'),
    ('cleric', 'Cleric', "Earth's Retribution", 'Root', 'Enraizado', 'Lightning Strike Scattershot', '—', 'Stagger'),
    ('elementalist', 'Spiritmaster', 'Cold Shock', "Soul's Cry", 'Miedo', 'Rapid Scattershot', '—', 'Stagger'),
]

img, d = lienzo('LA REGLA QUE VALE PARA LAS OCHO CLASES',
                'Da igual con qué juegues: el combate de Aion 2 siempre funciona igual.',
                1240, 1258)

# cabeceras
COLS = [(60, 'CLASE'), (300, '1 · TE DA MANÁ'), (600, '2 · APLICA UN ESTADO'), (900, '3 · LO CASTIGA')]
for x, t in COLS:
    d.text((x, 152), t, font=f(13, True), fill=GRIS)

Y0, ALTO = 182, 84
for i, (clase, nombre, mana, estado, aplica, castigo, cd, exige) in enumerate(FILAS):
    y = Y0 + i * ALTO
    if i % 2 == 0:
        d.rounded_rectangle([44, y - 8, 1196, y + 64], radius=8, fill=(38, 40, 44))
    d.text((60, y + 28), nombre, font=f(17, True), fill=BLANCO, anchor='lm')

    ico(img, clase, mana, (300, y), 52, AZUL)
    etiqueta(d, (362, y + 18), mana, TEXTO, 13.5, 'la')
    etiqueta(d, (362, y + 38), 'sin recarga', AZUL, 12, 'la')

    ico(img, clase, estado, (600, y), 52, ORO)
    etiqueta(d, (662, y + 18), estado, TEXTO, 13.5, 'la')
    etiqueta(d, (662, y + 38), aplica, ORO, 12, 'la')

    ico(img, clase, castigo, (900, y), 52, ROJO)
    etiqueta(d, (962, y + 18), castigo, TEXTO, 13.5, 'la')
    etiqueta(d, (962, y + 38), 'exige %s%s' % (exige, '' if cd == '—' else '  ·  %s' % cd), ROJO, 12, 'la')

y = Y0 + len(FILAS) * ALTO + 6
banda(img, d, y, 'LO QUE SIGNIFICA',
      'No se trata de apretar botones por orden de daño. Primero dejas al enemigo en un estado '
      '—derribado, aturdido, congelado, ralentizado— y solo entonces se desbloquea el golpe que lo castiga. '
      'Esos golpes tienen recargas cortísimas: son los que se repiten.', VERDE, (38, 46, 40), 200)

banda(img, d, y + 116, 'Y ADEMÁS',
      'Las ocho tienen un ataque básico sin recarga que devuelve unos 100 de maná, y una habilidad de remate '
      'que exige Stagger (la barra de aturdimiento). Aprende esas tres piezas de tu clase y ya sabes jugarla.',
      ORO, (46, 38, 30), 200)

banda(img, d, y + 216, 'LAS DOS EXCEPCIONES',
      'Cleric y Spiritmaster son las únicas sin castigo ligado a un estado propio: aplican Enraizado y Miedo, pero su remate depende solo de la barra de Stagger. Se juegan más por control y sostén que por cadena.',
      AZUL, (30, 40, 48), 200)

cerrar(img, d, '00-regla-comun.png')
