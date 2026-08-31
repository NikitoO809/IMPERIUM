# -*- coding: utf-8 -*-
"""Guia transversal: como se sube un personaje en Aion 2 y como se reparte para PvE o PvP."""
from PIL import ImageDraw
from guia_base import (f, etiqueta, lienzo, cerrar, banda, flecha,
                       ROJO, ORO, VERDE, AZUL, MORADO, BLANCO, CAJA, TEXTO, GRIS)

PIE_PROP = ('Datos de la base de datos del juego (questlog.gg) y de la wiki coreana · versión coreana, '
            'anterior al lanzamiento global del 5 de octubre')


def caja(d, xy, ancho, alto, color, titulo, lineas, subtitulo=None):
    x, y = xy
    d.rounded_rectangle([x, y, x + ancho, y + alto], radius=12, fill=CAJA)
    d.rounded_rectangle([x, y, x + 6, y + alto], radius=3, fill=color)
    d.text((x + 24, y + 22), titulo, font=f(20, True), fill=BLANCO)
    yy = y + 52
    if subtitulo:
        d.text((x + 24, yy), subtitulo, font=f(14, True), fill=color)
        yy += 26
    for l in lineas:
        d.text((x + 24, yy), l, font=f(14.5), fill=TEXTO if not l.startswith('·') else GRIS)
        yy += 24


# ══════════════ 1 · los tres sistemas ══════════════
img, d = lienzo('CÓMO SUBEN LAS HABILIDADES',
                'Tres sistemas distintos, y solo el primero se paga con puntos de habilidad.')

caja(d, (44, 154), 360, 250, AZUL, 'PUNTOS', [
    'Los ganas al subir de nivel.',
    'Llevan una habilidad hasta',
    'el NIVEL 10 y no dan para',
    'subirlas todas: hay que elegir.',
    '',
    '· Resetearlos es GRATIS:',
    '  prueba repartos sin miedo',
], 'del nivel 1 al 10')

caja(d, (440, 154), 360, 250, ORO, 'DAEVANION', [
    'Tablero de nodos que se abre',
    'al nivel 12 de personaje.',
    'Sube las habilidades POR',
    'ENCIMA de 10: a 12, 16, 20…',
    '',
    '· Sus puntos salen de logros',
    '  y misiones, no de subir nivel',
], 'del nivel 10 en adelante')

caja(d, (836, 154), 360, 250, VERDE, 'EQUIPO', [
    'Las piezas suman niveles',
    'extra de habilidad por su',
    'cuenta, encima de todo',
    'lo anterior.',
    '',
    '· Por eso el mismo personaje',
    '  rinde distinto según su equipo',
], 'lo que llevas puesto')

flecha(d, (404, 279), (436, 279), GRIS, 4, 14)
flecha(d, (800, 279), (832, 279), GRIS, 4, 14)

y = 436
y += banda(img, d, y, 'Y AQUÍ ESTÁ LA GRACIA',
           'Cada habilidad tiene cinco mejoras que se desbloquean a distintos niveles DE ESA HABILIDAD '
           '(nivel 5, 8, 12, 16, 20, 25…). Por eso hay mejoras que solo alcanzas con Daevanion y equipo: '
           'con puntos nunca pasas de 10.', ORO, (46, 38, 30), 240) + 18

y += banda(img, d, y, 'CINCO MEJORAS, TRES RANURAS',
           'Las cinco se desbloquean al nivel de habilidad que marca cada una, pero solo puedes poner TRES. '
           'Y las ranuras también van por nivel de habilidad: la primera al 8, la segunda al 12 y la tercera al 20.',
           VERDE, (38, 46, 40), 260) + 18

banda(img, d, y, 'LOS STIGMA SON OTRA COSA',
      'No confundas: los Stigma son habilidades aparte, se desbloquean sobre el nivel 23 y equipas 4 de 12. '
      'Se suben con Fragmentos de Stigma que se compran con Puntos de Abismo.', AZUL, (30, 40, 48), 240)
cerrar(img, d, 'p1-sistemas.png', PIE_PROP)


# ══════════════ 2 · los tableros ══════════════
img, d = lienzo('LOS SEIS TABLEROS DAEVANION',
                'Se abren a distintos niveles, y cada uno sube una cosa distinta.')

TABLEROS = [
    ('NEZEKAN', '12', 'Velocidad de combate\ny RECARGAS MÁS CORTAS', ORO, 'general'),
    ('ZIKEL', '20', 'Amplifica tu daño\ny tu resistencia', ORO, 'general'),
    ('VAIZEL', '30', 'Daño crítico\ny resistencia al crítico', ORO, 'general'),
    ('TRINIEL', '40', 'Golpe múltiple\ny su resistencia', ORO, 'general'),
    ('ARIEL', '45', 'AMPLIFICA TU DAÑO EN PvE\ny tu aguante en PvE', VERDE, 'PvE'),
    ('AZPHEL', '45', 'AMPLIFICA TU DAÑO EN PvP\ny tu aguante en PvP', ROJO, 'PvP'),
]
X0, Y0, AN, AL = 44, 156, 372, 132
for i, (nombre, nivel, que, color, tipo) in enumerate(TABLEROS):
    x = X0 + (i % 3) * (AN + 12)
    y = Y0 + (i // 3) * (AL + 14)
    d.rounded_rectangle([x, y, x + AN, y + AL], radius=12, fill=CAJA)
    d.rounded_rectangle([x, y, x + 6, y + AL], radius=3, fill=color)
    d.text((x + 24, y + 20), nombre, font=f(21, True), fill=BLANCO)
    d.rounded_rectangle([x + AN - 96, y + 20, x + AN - 22, y + 44], radius=7, fill=color)
    d.text((x + AN - 59, y + 32), 'nivel ' + nivel, font=f(13, True), fill=(20, 24, 28), anchor='mm')
    for j, l in enumerate(que.split('\n')):
        d.text((x + 24, y + 60 + j * 22), l, font=f(14.5), fill=TEXTO)
    if tipo != 'general':
        d.text((x + 24, y + AL - 26), 'puntos propios, no los generales', font=f(12), fill=color)

y = Y0 + 2 * (AL + 14) + 12
y += banda(img, d, y, 'LA DECISIÓN GRANDE',
           'Los cuatro primeros comparten los mismos puntos Daevanion. Ariel y Azphel tienen cada uno LOS SUYOS: '
           'Ariel es el tablero de PvE y Azphel el de PvP. Ahí es donde de verdad eliges a qué juegas.',
           ORO, (46, 38, 30), 240) + 18

y += banda(img, d, y, 'CUÁNTO CUESTA CADA NODO',
           'Gris (estadísticas) 1 punto  ·  Verde (pasivas) 2 puntos  ·  Azul (habilidades activas) 3 puntos  ·  '
           'Naranja (habilidades únicas) 4 puntos.', AZUL, (30, 40, 48), 240) + 18

banda(img, d, y, 'OJO AL CAMINO',
      'Solo puedes activar nodos pegados a otro que ya tengas, expandiendo en las cuatro direcciones desde el '
      'inicio. Vas a gastar puntos en nodos que no querías solo para llegar al que sí. Planifica la ruta antes.',
      ROJO, (58, 38, 38), 240)
cerrar(img, d, 'p2-tableros.png', PIE_PROP)


# ══════════════ 3 · la regla de oro ══════════════
img, d = lienzo('LA REGLA DE ORO: PvE NO ES PvP',
                'Hay 33 mejoras repartidas por las ocho clases que en PvE no hacen absolutamente nada.')

d.rounded_rectangle([44, 152, 1196, 268], radius=12, fill=(58, 38, 38))
d.text((70, 178), 'EL DATO', font=f(15, True), fill=ROJO)
for i, l in enumerate([
    '36 de las 45 habilidades con probabilidad dicen «100% chance to inflict … on NPC targets».',
    'Contra un PNJ, el aturdimiento o el derribo entran SIEMPRE.',
    'Así que subir «+25% de probabilidad de derribo» contra un PNJ es subir de 100% a 100%.',
]):
    d.text((70, 206 + i * 22), l, font=f(15), fill=TEXTO)

d.text((44, 296), 'EJEMPLO CON UNA HABILIDAD REAL', font=f(15, True), fill=ORO)
d.rounded_rectangle([44, 326, 610, 452], radius=12, fill=CAJA)
d.rounded_rectangle([44, 326, 50, 452], radius=3, fill=AZUL)
d.text((70, 346), 'CONTRA UN PNJ  (PvE)', font=f(16, True), fill=AZUL)
d.text((70, 378), 'Rush Strike derriba al 100%', font=f(15), fill=TEXTO)
d.text((70, 402), 'Mejora nv. 16: +25% de derribo', font=f(15), fill=GRIS)
d.text((70, 426), '→ de 100% a 100%. No sirve de nada.', font=f(15, True), fill=ROJO)

d.rounded_rectangle([630, 326, 1196, 452], radius=12, fill=CAJA)
d.rounded_rectangle([630, 326, 636, 452], radius=3, fill=MORADO)
d.text((656, 346), 'CONTRA UN JUGADOR  (PvP)', font=f(16, True), fill=MORADO)
d.text((656, 378), 'Rush Strike derriba al 50%', font=f(15), fill=TEXTO)
d.text((656, 402), 'Mejora nv. 16: +25% de derribo', font=f(15), fill=GRIS)
d.text((656, 426), '→ de 50% a 75%. Es de las mejores.', font=f(15, True), fill=VERDE)

y = 480
y += banda(img, d, y, 'EN PvE, PRIORIZA',
           'Recargas más cortas, daño, recursos (maná y aguante) y aguante. Todo lo que diga «probabilidad de '
           'aturdir / derribar / enraizar / sellar» lo puedes ignorar sin perder nada.',
           AZUL, (30, 40, 48), 250) + 18

y += banda(img, d, y, 'EN PvP, PRIORIZA',
           'Probabilidad y duración de los estados, «ignora bloqueo y evasión», romper escudos y bajarle la '
           'curación al rival. Contra un jugador, quitarle el turno vale más que pegarle más fuerte.',
           MORADO, (40, 32, 48), 250) + 18

banda(img, d, y, 'Y LAS QUE VALEN SIEMPRE',
      'Las que dicen «+X% PvE Damage Boost y +Y% PvP Damage Boost» suben las dos cosas a la vez. '
      'Esas son las primeras que hay que coger, juegues a lo que juegues.', ORO, (46, 38, 30), 250)
cerrar(img, d, 'p3-regla-oro.png', PIE_PROP)
