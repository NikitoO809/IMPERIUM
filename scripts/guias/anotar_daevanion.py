# -*- coding: utf-8 -*-
"""Marca la captura del tablero Daevanion de Nezekan."""
import math
from PIL import Image, ImageDraw, ImageFont

ROJO = (232, 52, 52)
AMARILLO = (255, 199, 44)
VERDE = (67, 200, 130)
AZUL = (86, 164, 240)
MORADO = (185, 120, 235)
BLANCO = (255, 255, 255)
FONDO = (18, 20, 26)
GRIS = (150, 158, 168)

ORIGEN = 'c:/Users/Miguel/Desktop/CARPETAS/IMPERIUM/capturas-aion2/daevanion-1-nezekan.jpg'
img = Image.open(ORIGEN).convert('RGB')
W, H = img.size
LEYENDA = 560
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


def circulo(centro, radio, color=ROJO, grosor=7):
    x, y = centro
    d.ellipse([x - radio, y - radio, x + radio, y + radio], outline=color, width=grosor)


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


# 1 · las OCHO pestañas
marco([300, 76, 2250, 132], AMARILLO, 6, 12)
numero((260, 104), 1, 28, AMARILLO)

# 2 · el nodo de partida
circulo((1007, 868), 62, ROJO, 7)
numero((1007, 962), 2, 30, ROJO)

# 3 · nodos ya cogidos (los que brillan en azul)
marco([298, 252, 382, 336], AZUL, 6, 12)
numero((240, 294), 3, 28, AZUL)

# 4 · nodos apagados: aun no llegas
marco([298, 348, 382, 432], GRIS, 6, 12)
numero((240, 390), 4, 28, GRIS)

# 5 · lo que da este tablero
marco([2030, 630, 2500, 730], VERDE, 6, 12)
numero((1990, 680), 5, 30, VERDE)

# 6 · el nivel y lo que cuesta completarlo
marco([2010, 1380, 2510, 1450], MORADO, 6, 12)
numero((1970, 1415), 6, 30, MORADO)

# 7 · el contador de puntos de ESTE tablero
marco([1840, 34, 1990, 76], AMARILLO, 5, 10)
numero((1800, 55), 7, 26, AMARILLO)

# ─── leyenda ───
d.line([(60, H + 30), (W - 60, H + 30)], fill=(60, 66, 76), width=3)
d.text((60, H + 56), 'EL TABLERO DAEVANION POR DENTRO', font=f(34, True), fill=BLANCO)

FILAS = [
    (1, AMARILLO, 'Son OCHO tableros, no seis',
     'Nezekan, Zikel, Vaizel, Triniel, Ariel, Azphel, Marchutan y Yustiel. Los cuatro últimos van en otro color.'),
    (2, ROJO, 'Todo sale del nodo del centro',
     'Solo puedes activar lo que toque algo que ya tengas. De ahí se va expandiendo en las cuatro direcciones.'),
    (3, AZUL, 'Los que brillan son los que ya tienes',
     'Se ve el camino que has ido abriendo desde el centro.'),
    (4, GRIS, 'Los apagados aún no los alcanzas',
     'Vas a gastar puntos en nodos que no querías, solo para llegar al que sí. Planifica la ruta antes.'),
    (5, VERDE, 'Aquí pone lo que da ESTE tablero',
     'Nezekan: velocidad de combate, reducción de recargas, ataque y defensa. Cada tablero sube cosas distintas.'),
    (6, MORADO, 'El nivel que pide y lo que cuesta entero',
     'Nezekan: nivel 12 y 55 puntos. Marchutan y Yustiel piden 232 cada uno.'),
    (7, AMARILLO, 'El contador cambia al cambiar de pestaña',
     'Los cuatro primeros comparten bolsa. Ariel, Azphel, Marchutan y Yustiel tienen la suya.'),
]
y = H + 104
for n, color, titulo, texto in FILAS:
    numero((86, y + 14), n, 22, color)
    d.text((120, y), titulo, font=f(25, True), fill=color)
    d.text((120, y + 30), texto, font=f(23), fill=GRIS)
    y += 62

final = lienzo.resize((1700, int(lienzo.size[1] * 1700 / W)), Image.LANCZOS)
final.save('cap-daevanion-anotada.png')
print('cap-daevanion-anotada.png', final.size)
