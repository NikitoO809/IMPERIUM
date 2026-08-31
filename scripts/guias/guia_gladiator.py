# -*- coding: utf-8 -*-
"""Diagramas de la guia de Gladiator, con los iconos reales del juego."""
import json
import math
from PIL import Image, ImageDraw, ImageFont

ROJO = (228, 46, 46)
ORO = (201, 162, 39)
VERDE = (67, 181, 129)
BLANCO = (242, 243, 245)
FONDO = (43, 45, 49)
CAJA = (35, 36, 40)
TEXTO = (219, 222, 225)
GRIS = (148, 155, 164)

ICONOS = json.load(open('iconos/mapa.json', encoding='utf-8'))


def f(px, negrita=False):
    for n in (['seguisb.ttf', 'segoeuib.ttf'] if negrita else ['segoeui.ttf']):
        try:
            return ImageFont.truetype('C:/Windows/Fonts/' + n, px)
        except OSError:
            pass
    return ImageFont.load_default()


def icono(img, nombre, xy, lado=88, borde=None, grosor=4):
    d = ImageDraw.Draw(img)
    x, y = xy
    d.rounded_rectangle([x, y, x + lado, y + lado], radius=10, fill=CAJA)
    try:
        ico = Image.open('iconos/%s.webp' % ICONOS[nombre]).convert('RGBA')
        ico = ico.resize((lado - 10, lado - 10), Image.LANCZOS)
        img.paste(ico, (x + 5, y + 5), ico)
    except (KeyError, FileNotFoundError):
        d.text((x + lado // 2, y + lado // 2), '?', font=f(30, True), fill=GRIS, anchor='mm')
    if borde:
        d.rounded_rectangle([x - 3, y - 3, x + lado + 3, y + lado + 3], radius=13,
                            outline=borde, width=grosor)
    return (x + lado // 2, y + lado // 2)


def etiqueta(d, xy, texto, color=TEXTO, px=14, anchor='ma', negrita=False):
    d.text(xy, texto, font=f(px, negrita), fill=color, anchor=anchor)


def flecha(d, desde, hasta, color=ROJO, grosor=6, cabeza=20):
    d.line([desde, hasta], fill=color, width=grosor)
    ang = math.atan2(hasta[1] - desde[1], hasta[0] - desde[0])
    a = 0.45
    d.polygon([hasta,
               (hasta[0] - cabeza * math.cos(ang - a), hasta[1] - cabeza * math.sin(ang - a)),
               (hasta[0] - cabeza * math.cos(ang + a), hasta[1] - cabeza * math.sin(ang + a))],
              fill=color)


def cartel(d, xy, texto, ancho=290, color=ROJO, px=15):
    fu = f(px)
    lineas, act = [], ''
    for p in texto.split():
        t = (act + ' ' + p).strip()
        if d.textlength(t, font=fu) <= ancho:
            act = t
        else:
            lineas.append(act)
            act = p
    if act:
        lineas.append(act)
    alto = len(lineas) * (px + 5) + 16
    an = max(d.textlength(l, font=fu) for l in lineas) + 24
    x, y = xy
    d.rounded_rectangle([x, y, x + an, y + alto], radius=8, fill=color)
    for i, l in enumerate(lineas):
        d.text((x + 12, y + 8 + i * (px + 5)), l, font=fu, fill=BLANCO)
    return an, alto


# ══════════════════════════ 1. la cadena de derribo ══════════════════════════
W, H = 1240, 790
img = Image.new('RGB', (W, H), FONDO)
d = ImageDraw.Draw(img)

d.text((44, 36), 'LA CADENA DE DERRIBO', font=f(38, True), fill=BLANCO)
d.text((44, 84), 'De esto vive el Gladiator: tumbar al enemigo y castigarlo en el suelo.',
       font=f(19), fill=GRIS)
d.line([(44, 122), (W - 44, 122)], fill=(60, 63, 68), width=2)

# --- paso 1: los que derriban
d.text((44, 150), 'PASO 1 · LO TUMBAS', font=f(15, True), fill=ORO)
tumban = [('Rush Strike', '20s', 'al esquivar\no volando'),
          ('Mocking Blade', '20s', 'derribo\nseguro'),
          ('Wrath Wave', '60s', '50%  ·  100%\nen PNJ'),
          ('Assault Strike', '120s', '30%  ·  100%\nen PNJ')]
X0, Y1, PASO = 44, 184, 150
for i, (n, cd, nota) in enumerate(tumban):
    c = icono(img, n, (X0 + i * PASO, Y1), 88, ORO, 3)
    etiqueta(d, (c[0], Y1 + 96), n, BLANCO, 14, 'ma', True)
    etiqueta(d, (c[0], Y1 + 116), cd, ORO, 13)
    for j, l in enumerate(nota.split('\n')):
        etiqueta(d, (c[0], Y1 + 136 + j * 16), l, GRIS, 12)

# --- banda de transición, en su propia franja para que no pise nada
YB = 384
d.rounded_rectangle([44, YB, 620, YB + 52], radius=9, fill=(58, 38, 38))
flecha(d, (78, YB + 8), (78, YB + 44), cabeza=14, grosor=5)
d.text((100, YB + 26), 'el enemigo está en el suelo', font=f(16, True), fill=ROJO, anchor='lm')

# --- paso 2: los que castigan al derribado
d.text((44, YB + 76), 'PASO 2 · LO CASTIGAS EN EL SUELO', font=f(15, True), fill=ROJO)
castigan = [('Overhead Slam', '5s', 'SOLO golpea a\nquien está derribado'),
            ('Aerial Snare', '45s', 'SOLO a derribados.\nLo manda por el aire')]
Y2 = YB + 110
for i, (n, cd, nota) in enumerate(castigan):
    c = icono(img, n, (X0 + i * PASO, Y2), 88, ROJO, 4)
    etiqueta(d, (c[0], Y2 + 96), n, BLANCO, 14, 'ma', True)
    etiqueta(d, (c[0], Y2 + 116), cd, ROJO, 13)
    for j, l in enumerate(nota.split('\n')):
        etiqueta(d, (c[0], Y2 + 136 + j * 16), l, GRIS, 12)

cartel(d, (700, 184),
       'Estas cuatro son las únicas que tumban. Si no encadenas una de ellas, '
       'las dos de abajo NO hacen nada.', 300)
cartel(d, (700, Y2),
       'Overhead Slam solo tiene 5 s de recarga: es el castigo que se repite. '
       'Con el stigma de 16 puntos se queda SIN recarga.', 300)

d.line([(44, H - 74), (W - 44, H - 74)], fill=(60, 63, 68), width=2)
d.text((44, H - 58), 'Datos sacados de la base de datos del juego (questlog.gg) · versión coreana, '
       'anterior al lanzamiento global del 5 de octubre', font=f(13), fill=GRIS)
img.save('01-cadena-derribo.png')
print('01-cadena-derribo.png')
