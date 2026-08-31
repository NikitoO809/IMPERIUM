# -*- coding: utf-8 -*-
"""Los OCHO tableros Daevanion, con los datos leidos de las capturas del juego."""
from guia_base import (f, lienzo, cerrar, banda, ROJO, ORO, VERDE, AZUL, MORADO,
                       BLANCO, CAJA, TEXTO, GRIS)

PIE = ('Datos leídos de las capturas del juego (versión de Taiwán, cedidas por NikitoO) · '
       'anterior al lanzamiento global del 5 de octubre')

# nombre, nivel, que da, puntos para completarlo, color, bolsa
TABLEROS = [
    ('NEZEKAN', 12, 'Velocidad de combate, RECARGAS MÁS CORTAS,\nataque y defensa', 55, ORO, 'compartida'),
    ('ZIKEL', 20, 'Daño y aguante,\nprecisión y evasión', 56, ORO, 'compartida'),
    ('VAIZEL', 30, 'Daño crítico\ny resistencia al crítico', 59, ORO, 'compartida'),
    ('TRINIEL', 40, 'Golpe múltiple\ny su resistencia', 175, ORO, 'compartida'),
    ('ARIEL', 45, 'DAÑO Y AGUANTE EN PvE\nTiene nodos de jefe', 171, AZUL, 'propia'),
    ('AZPHEL', 45, 'DAÑO Y AGUANTE EN PvP', 152, MORADO, 'propia'),
    ('MARCHUTAN', 45, 'Daño de arma\ny su resistencia', 232, VERDE, 'propia'),
    ('YUSTIEL', 45, 'Ataque y defensa', 232, ROJO, 'propia'),
]

img, d = lienzo('LOS OCHO TABLEROS DAEVANION',
                'Ocho, no seis: las guías que circulan se dejan Marchutan y Yustiel.')

X0, Y0, AN, AL = 44, 156, 372, 150
for i, (nombre, nivel, que, coste, color, bolsa) in enumerate(TABLEROS):
    x = X0 + (i % 3) * (AN + 12)
    y = Y0 + (i // 3) * (AL + 14)
    d.rounded_rectangle([x, y, x + AN, y + AL], radius=12, fill=CAJA)
    d.rounded_rectangle([x, y, x + 6, y + AL], radius=3, fill=color)
    d.text((x + 24, y + 18), nombre, font=f(21, True), fill=BLANCO)
    d.rounded_rectangle([x + AN - 96, y + 18, x + AN - 22, y + 42], radius=7, fill=color)
    d.text((x + AN - 59, y + 30), 'nivel %d' % nivel, font=f(13, True), fill=(20, 24, 28), anchor='mm')
    for j, l in enumerate(que.split('\n')):
        d.text((x + 24, y + 56 + j * 22), l, font=f(14.5), fill=TEXTO)
    d.text((x + 24, y + AL - 34), 'completarlo cuesta', font=f(12), fill=GRIS)
    d.text((x + 168, y + AL - 36), '%d puntos' % coste, font=f(17, True), fill=color)
    if bolsa == 'propia':
        d.text((x + 24, y + AL - 16), 'bolsa de puntos propia', font=f(12), fill=color)

y = Y0 + 3 * (AL + 14) + 10
y += banda(img, d, y, 'LAS BOLSAS ESTÁN SEPARADAS',
           'Los cuatro primeros comparten una bolsa de puntos. Ariel, Azphel, Marchutan y Yustiel tienen cada uno '
           'la suya, y se ve al cambiar de pestaña: el contador de arriba cambia contigo.',
           ORO, (46, 38, 30), 260) + 18

y += banda(img, d, y, 'AHÍ ELIGES A QUÉ JUEGAS',
           'Ariel sube tu daño y tu aguante en PvE (y trae nodos de Ataque y Defensa contra jefes). Azphel hace lo '
           'mismo en PvP. Como cada uno gasta sus propios puntos, no compiten: puedes hacer los dos, pero uno irá antes.',
           AZUL, (30, 40, 48), 260) + 18

banda(img, d, y, 'LO QUE CUESTA DE VERDAD',
      'Los tres primeros se completan con 55, 56 y 59 puntos. A partir de Triniel se dispara: 175, y Marchutan y '
      'Yustiel piden 232 cada uno. Los de nivel 45 son un proyecto de meses, no de una tarde.',
      ROJO, (58, 38, 38), 260)
cerrar(img, d, 'p4-ocho-tableros.png', PIE)
