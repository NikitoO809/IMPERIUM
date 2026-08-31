# -*- coding: utf-8 -*-
"""Marca la captura de un personaje nuevo: ahi se ve el nivel al que se abre cada mejora."""
import math
import sys
from PIL import Image, ImageDraw, ImageFont

ROJO = (232, 52, 52)
AMARILLO = (255, 199, 44)
VERDE = (67, 200, 130)
AZUL = (86, 164, 240)
BLANCO = (255, 255, 255)
FONDO = (18, 20, 26)
GRIS = (150, 158, 168)

ORIGEN = sys.argv[1]
img = Image.open(ORIGEN).convert('RGB')
W, H = img.size
LEYENDA = 520
lienzo = Image.new('RGB', (W, H + LEYENDA), FONDO)
lienzo.paste(img, (0, 0))
d = ImageDraw.Draw(lienzo)


def f(px, negrita=False):
    for n in (['seguisb.ttf'] if negrita else ['segoeui.ttf']):
        try:
            return ImageFont.truetype('C:/Windows/Fonts/' + n, int(px))
        except OSError:
            pass
    return ImageFont.load_default()


def marco(caja, color=ROJO, grosor=7, radio=14):
    d.rounded_rectangle(caja, radius=radio, outline=color, width=grosor)


def numero(centro, n, radio=30, color=ROJO):
    x, y = centro
    d.ellipse([x - radio, y - radio, x + radio, y + radio], fill=color)
    d.ellipse([x - radio, y - radio, x + radio, y + radio], outline=BLANCO, width=3)
    d.text((x, y - 2), str(n), font=f(radio * 1.15, True), fill=BLANCO, anchor='mm')


def flecha(desde, hasta, color=ROJO, grosor=6, cabeza=24):
    d.line([desde, hasta], fill=color, width=grosor)
    a = math.atan2(hasta[1] - desde[1], hasta[0] - desde[0])
    ab = 0.45
    d.polygon([hasta,
               (hasta[0] - cabeza * math.cos(a - ab), hasta[1] - cabeza * math.sin(a - ab)),
               (hasta[0] - cabeza * math.cos(a + ab), hasta[1] - cabeza * math.sin(a + ab))], fill=color)


# 1 · la columna de niveles, que es LO IMPORTANTE de esta captura
marco([48, 680, 90, 900], AMARILLO, 6, 10)
numero((150, 620), 1, 28, AMARILLO)
flecha((150, 650), (80, 690), AMARILLO, 5, 18)

# 2 · el aviso de que se abren a nivel 8
marco([860, 320, 1700, 368], AMARILLO, 6)
numero((820, 344), 2, 30, AMARILLO)

# 3 · las tres ranuras, todas cerradas todavia
marco([48, 578, 278, 668], ROJO, 6)
numero((320, 622), 3)

# 4 · los candados de cada mejora
marco([490, 680, 542, 900], ROJO, 5, 10)
numero((596, 790), 4)

# 5 · la pestana Stigma, bloqueada a este nivel
marco([1330, 78, 1470, 130], AZUL, 6, 12)
numero((1520, 104), 5, 30, AZUL)

# 6 · los candados del panel de habilidades: nivel de PERSONAJE
marco([2290, 390, 2500, 570], VERDE, 6, 12)
marco([2020, 660, 2500, 820], VERDE, 6, 12)
numero((2560 - 60, 610), 6, 30, VERDE)

# ─── leyenda ───
d.line([(60, H + 30), (W - 60, H + 30)], fill=(60, 66, 76), width=3)
d.text((60, H + 56), 'PERSONAJE NUEVO: AQUÍ SE VE EL NIVEL DE CADA COSA', font=f(34, True), fill=BLANCO)

FILAS = [
    (1, AMARILLO, 'El número de cada mejora es un NIVEL DE HABILIDAD',
     'Tres se abren a nivel 8, una a 12 y otra a 16. No es un coste: es cuánto tienes que subir ESA habilidad.'),
    (2, AMARILLO, 'El juego lo dice en pantalla',
     '«Specialty Skill effect unlocked upon reaching Arrow Scattershot Lv. 8».'),
    (3, ROJO, 'Las tres ranuras se abren a nivel 8, 12 y 20 DE LA HABILIDAD',
     'En un personaje nuevo están las tres cerradas. Suben con la habilidad, no con tu nivel.'),
    (4, ROJO, 'Un candado por mejora',
     'Cada una se desbloquea por su cuenta al llegar a su nivel.'),
    (5, AZUL, 'La pestaña Stigma también está bloqueada',
     'Los Stigma llegan más tarde. Son habilidades aparte, no estas mejoras.'),
    (6, VERDE, 'Los candados rojos del panel son nivel de PERSONAJE',
     'Lv. 11, 13, 15, 17, 21, 23, 25… son las habilidades que aún no tienes por nivel de personaje.'),
]
y = H + 104
for n, color, titulo, texto in FILAS:
    numero((86, y + 16), n, 24, color)
    d.text((124, y), titulo, font=f(26, True), fill=color)
    d.text((124, y + 32), texto, font=f(24), fill=GRIS)
    y += 68

final = lienzo.resize((1700, int(lienzo.size[1] * 1700 / W)), Image.LANCZOS)
final.save('cap-niveles-anotada.png')
print('cap-niveles-anotada.png', final.size)
