# -*- coding: utf-8 -*-
"""Marca la captura real de la pantalla de habilidades."""
import math
from PIL import Image, ImageDraw, ImageFont

ROJO = (232, 52, 52)
AMARILLO = (255, 199, 44)
VERDE = (67, 200, 130)
BLANCO = (255, 255, 255)
FONDO = (18, 20, 26)
GRIS = (150, 158, 168)

ORIGEN = 'C:/Users/Miguel/Pictures/Purple/AION2/Images/06-53-32-560_2026-08-30_NikitoO_Image.jpg'
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


def circulo(centro, radio, color=ROJO, grosor=7):
    x, y = centro
    d.ellipse([x - radio, y - radio, x + radio, y + radio], outline=color, width=grosor)


def marco(caja, color=ROJO, grosor=7, radio=14):
    d.rounded_rectangle(caja, radius=radio, outline=color, width=grosor)


def numero(centro, n, radio=30, color=ROJO):
    x, y = centro
    d.ellipse([x - radio, y - radio, x + radio, y + radio], fill=color)
    d.ellipse([x - radio, y - radio, x + radio, y + radio], outline=BLANCO, width=3)
    d.text((x, y - 2), str(n), font=f(radio * 1.15, True), fill=BLANCO, anchor='mm')


def flecha(desde, hasta, color=ROJO, grosor=7, cabeza=26):
    d.line([desde, hasta], fill=color, width=grosor)
    a = math.atan2(hasta[1] - desde[1], hasta[0] - desde[0])
    ab = 0.45
    d.polygon([hasta,
               (hasta[0] - cabeza * math.cos(a - ab), hasta[1] - cabeza * math.sin(a - ab)),
               (hasta[0] - cabeza * math.cos(a + ab), hasta[1] - cabeza * math.sin(a + ab))], fill=color)


# ─── 1 · las tres ranuras de Specialty ───
marco([48, 686, 290, 780], ROJO, 7)
numero((330, 733), 1)

# ─── 2 · el candado de la tercera ───
circulo((241, 731), 44, AMARILLO, 7)

# ─── 3 · el aviso del nivel 20 ───
marco([978, 318, 1596, 368], AMARILLO, 6)
numero((940, 343), 2, 30, AMARILLO)
flecha((300, 700), (930, 350), AMARILLO, 6, 24)

# ─── 4 · mejoras activas frente a las apagadas ───
marco([46, 880, 560, 912], VERDE, 5, 10)      # Changes to mobile skill
marco([46, 972, 560, 1004], VERDE, 5, 10)     # Restores 50 MP on Critical
numero((610, 942), 3, 30, VERDE)

# ─── 5 · la etiqueta que cambia sola ───
marco([44, 594, 240, 626], VERDE, 5, 10)      # Nontarget | Mobile
flecha((250, 610), (600, 900), VERDE, 5, 22)

# ─── 6 · los puntos y el boton de reinicio ───
marco([2170, 1428, 2460, 1478], ROJO, 6, 12)
marco([2036, 1490, 2140, 1548], ROJO, 6, 12)
numero((2120, 1400), 4)

# ─── 7 · las dos pestanas ───
marco([1080, 78, 1480, 130], AMARILLO, 6, 12)
numero((1520, 104), 5, 30, AMARILLO)

# ─── leyenda ───
d.line([(60, H + 30), (W - 60, H + 30)], fill=(60, 66, 76), width=3)
d.text((60, H + 56), 'LO QUE HAY QUE MIRAR EN ESTA PANTALLA', font=f(34, True), fill=BLANCO)

FILAS = [
    (1, ROJO, 'Las tres ranuras de Specialty', 'De las cinco mejoras solo puedes poner TRES. Aquí hay dos abiertas y una cerrada.'),
    (2, AMARILLO, 'Las ranuras se abren a nivel 8, 12 y 20 de la habilidad', 'Aquí la tercera espera a que Rending Blow llegue a 20. El juego lo dice en pantalla.'),
    (3, VERDE, 'Azul = activa · gris = apagada', 'Aquí están puestas «Changes to mobile skill» y «Restores 50 MP».'),
    (4, ROJO, 'Tus puntos y el botón de reinicio', 'Resetear no cuesta nada: puedes probar repartos sin miedo.'),
    (5, AMARILLO, 'Mastery y Stigma son cosas distintas', 'Las mejoras están en Mastery. Los Stigma son habilidades aparte, en su pestaña.'),
]
y = H + 108
for n, color, titulo, texto in FILAS:
    numero((86, y + 16), n, 24, color)
    d.text((124, y), titulo, font=f(27, True), fill=color)
    d.text((124, y + 33), texto, font=f(25), fill=GRIS)
    y += 74

final = lienzo.resize((1700, int(lienzo.size[1] * 1700 / W)), Image.LANCZOS)
final.save('cap-skill-anotada.png')
print('cap-skill-anotada.png', final.size)
