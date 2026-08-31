# -*- coding: utf-8 -*-
"""Piezas comunes de los diagramas de las guias de clase de Aion 2."""
import json
import math
import os
from PIL import Image, ImageDraw, ImageFont

ROJO = (228, 46, 46)
ORO = (201, 162, 39)
VERDE = (67, 181, 129)
AZUL = (79, 152, 216)
MORADO = (155, 89, 182)
BLANCO = (242, 243, 245)
FONDO = (43, 45, 49)
CAJA = (35, 36, 40)
TEXTO = (219, 222, 225)
GRIS = (148, 155, 164)

PIE = ('Datos del volcado del cliente del juego (aion2t.com) · comprobados contra capturas '
       'de la versión de Taiwán')

_ICONOS = {}
_DIR = 'iconos'


def cargar_iconos(clase):
    """Carga el mapa nombre -> fichero de icono de una clase."""
    global _ICONOS, _DIR
    _DIR = 'iconos/%s' % clase
    with open('%s/mapa.json' % _DIR, encoding='utf-8') as fh:
        _ICONOS = json.load(fh)
    return _ICONOS


def f(px, negrita=False):
    px = int(px)
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
    ruta = os.path.join(_DIR, '%s.webp' % _ICONOS.get(nombre, ''))
    if os.path.exists(ruta):
        ico = Image.open(ruta).convert('RGBA').resize((lado - 10, lado - 10), Image.LANCZOS)
        img.paste(ico, (x + 5, y + 5), ico)
    else:
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


def _partir(d, texto, fuente, ancho):
    lineas, act = [], ''
    for p in texto.split():
        t = (act + ' ' + p).strip()
        if d.textlength(t, font=fuente) <= ancho:
            act = t
        else:
            lineas.append(act)
            act = p
    if act:
        lineas.append(act)
    return lineas


def cartel(d, xy, texto, ancho=290, color=ROJO, px=15):
    fu = f(px)
    lineas = _partir(d, texto, fu, ancho)
    alto = len(lineas) * (px + 5) + 16
    an = max(d.textlength(l, font=fu) for l in lineas) + 24
    x, y = xy
    d.rounded_rectangle([x, y, x + an, y + alto], radius=8, fill=color)
    for i, l in enumerate(lineas):
        d.text((x + 12, y + 8 + i * (px + 5)), l, font=fu, fill=BLANCO)
    return an, alto


def banda(img, d, y, titulo, texto, color=ORO, fondo=(46, 38, 30), sangria=210):
    """Franja ancha con una etiqueta a la izquierda y la explicacion al lado."""
    w = img.size[0]
    fu = f(15)
    lineas = _partir(d, texto, fu, w - 88 - sangria - 24)
    alto = max(54, len(lineas) * 21 + 24)
    d.rounded_rectangle([44, y, w - 44, y + alto], radius=10, fill=fondo)
    d.text((66, y + alto // 2), titulo, font=f(15, True), fill=color, anchor='lm')
    y0 = y + (alto - len(lineas) * 21) // 2 + 2
    for i, l in enumerate(lineas):
        d.text((44 + sangria, y0 + i * 21), l, font=fu, fill=TEXTO)
    return alto


def lienzo(titulo, subtitulo, w=1240, h=760):
    # se dibuja siempre sobre un lienzo holgado; cerrar() lo recorta al contenido
    img = Image.new('RGB', (w, max(h, 1500)), FONDO)
    d = ImageDraw.Draw(img)
    d.text((44, 36), titulo, font=f(38, True), fill=BLANCO)
    d.text((44, 84), subtitulo, font=f(19), fill=GRIS)
    d.line([(44, 122), (w - 44, 122)], fill=(60, 63, 68), width=2)
    return img, d


def _ultima_fila_con_contenido(img):
    """Ultima fila de pixeles que no es el fondo liso."""
    w, h = img.size
    px = img.load()
    for y in range(h - 1, 0, -1):
        for x in range(0, w, 3):          # de tres en tres: basta para detectar
            if px[x, y] != FONDO:
                return y
    return 200


def cerrar(img, d, nombre, nota=PIE):
    """Recorta el lienzo justo debajo de lo dibujado y estampa el pie."""
    w = img.size[0]
    fin = _ultima_fila_con_contenido(img)
    alto = fin + 90
    img = img.crop((0, 0, w, alto))
    d = ImageDraw.Draw(img)
    d.line([(44, alto - 62), (w - 44, alto - 62)], fill=(60, 63, 68), width=2)
    d.text((44, alto - 46), nota, font=f(13), fill=GRIS)
    img.save(nombre)
    print('%s  (%d×%d)' % (nombre, w, alto))
