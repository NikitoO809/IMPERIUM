# -*- coding: utf-8 -*-
"""Imágenes 01, 02 y 04 de la guía de Gladiator, rehechas contra el cliente actual.

Sustituyen a las que salían de guia2.py, que llevaban datos de questlog.gg:
  01 — decía que solo cuatro habilidades tumban (son siete) y hablaba de
       «el stigma de 16 puntos», que ni es un stigma ni son puntos.
  02 — Zikel's Blessing «a todo el grupo» (es solo del lanzador), Blade Toss
       bajando la curación un 30% (es 50%), Ruinous Blow con 30 s (son 45) y
       Rage Burst como «el golpe gordo» (ya no lo es).
  04 — Focused Block devolviendo recursos «al bloquear» (es al parar).
"""
from guia_base import (cargar_iconos, f, icono, etiqueta, lienzo, cerrar, banda, flecha,
                       ROJO, ORO, VERDE, AZUL, MORADO, BLANCO, CAJA, TEXTO, GRIS)

cargar_iconos('gladiator')


def paso(img, d, x, y, nombre, titulo, cd, lineas, color):
    icono(img, nombre, (x, y), 96, color, 4)
    d.text((x + 48, y + 118), titulo, font=f(15, True), fill=BLANCO, anchor='ma')
    d.text((x + 48, y + 140), cd, font=f(13, True), fill=color, anchor='ma')
    for i, l in enumerate(lineas):
        d.text((x + 48, y + 162 + i * 18), l, font=f(12.5), fill=GRIS, anchor='ma')


# ═══════════════════════════ 1 · la cadena de derribo ═══════════════════════════
img, d = lienzo('LA CADENA DE DERRIBO',
                'De esto vive el Gladiator: tumbar al enemigo y castigarlo en el suelo.', h=1100)

y = 150
d.text((44, y), 'PASO 1 · LO QUE TUMBA', font=f(16, True), fill=ORO)
y += 30
tumban = [("Rush Strike", '20 s', ['30% · 100% en PNJ', 'al esquivar o volando']),
          ("Mocking Blade", '20 s', ['derribo seguro', 'sin tirar dados']),
          ("Wrath Wave", '60 s', ['50% · 100% en PNJ', 'en área, Stigma']),
          ("Assault Strike", '120 s', ['30% · 100% en PNJ', 'en área, Stigma'])]
for i, (n, cd, ls) in enumerate(tumban):
    paso(img, d, 60 + i * 150, y, n, n, cd, ls, ORO)
d.rounded_rectangle([700, y, 1196, y + 96], radius=10, fill=(58, 38, 38))
etiqueta(d, (722, y + 18), 'Contra un PNJ las cuatro tumban SIEMPRE.', BLANCO, 14, 'la', True)
etiqueta(d, (722, y + 42), 'Contra un jugador, solo Mocking Blade es seguro:', TEXTO, 13.5, 'la')
etiqueta(d, (722, y + 62), 'las otras tres van a 30-50%. Por eso las mejoras de', TEXTO, 13.5, 'la')
etiqueta(d, (722, y + 82), 'probabilidad valen en PvP y no valen en PvE.', TEXTO, 13.5, 'la')
y += 216

d.rounded_rectangle([44, y, 620, y + 46], radius=10, fill=(58, 38, 38))
flecha(d, (70, y + 8), (70, y + 36), ROJO, 5, 12)
etiqueta(d, (96, y + 15), 'el enemigo está en el suelo', ROJO, 15, 'la', True)
y += 74

d.text((44, y), 'PASO 2 · LO QUE LO CASTIGA ALLÍ', font=f(16, True), fill=ROJO)
y += 30
castigan = [("Overhead Slam", '5 s', ['SOLO a derribados', 'el castigo que se repite']),
            ("Aerial Snare", '45 s', ['SOLO a derribados', 'lo manda por el aire']),
            ("Forced Fall", '0,5 s', ['SOLO a los del aire', 'y los vuelve a tumbar'])]
for i, (n, cd, ls) in enumerate(castigan):
    paso(img, d, 60 + i * 150, y, n, n, cd, ls, ROJO)
d.rounded_rectangle([560, y, 1196, y + 96], radius=10, fill=(38, 46, 40))
etiqueta(d, (582, y + 16), 'Y el bucle se cierra solo', VERDE, 15, 'la', True)
etiqueta(d, (582, y + 42), 'Aerial Snare lo levanta, Forced Fall lo baja otra vez —y con 0,5 s', TEXTO, 13.5, 'la')
etiqueta(d, (582, y + 62), 'de recarga—. Mientras aguante el encadenado, no se levanta.', TEXTO, 13.5, 'la')
y += 216

banda(img, d, y, 'LA MEJORA QUE LO ROMPE',
      'Overhead Slam ya sale con 5 s de recarga, y su mejora de nivel 16 se la quita entera. '
      'No es un «stigma» ni cuesta puntos: es el nivel que tiene que alcanzar esa habilidad.',
      ORO, (46, 38, 30), 260)
cerrar(img, d, '01-cadena-derribo.png')


# ═══════════════════════════════ 2 · la apertura ═══════════════════════════════
img, d = lienzo('LA APERTURA',
                'El orden importa: cada paso hace que el siguiente pegue más fuerte.', h=1000)

y = 160
sec = [("Zikel's Blessing", '120 s', ['+20% ataque', 'SOLO PARA TI'], MORADO),
       ('Ruinous Blow', '45 s', ['Prepare for Battle', '20 segundos'], VERDE),
       ('Blade Toss', '20 s', ['−30% defensa', '−50% curación'], ORO),
       ('Rush Strike', '20 s', ['entras y tumbas', '(tras esquivar)'], ROJO),
       ('Rage Burst', '45 s', ['Wounded: −10% ataque', '+10% daño a ti'], ROJO),
       ('Overhead Slam', '5 s', ['castigo repetido', 'mientras siga abajo'], ROJO)]
for i, (n, cd, ls, col) in enumerate(sec):
    x = 60 + i * 188
    paso(img, d, x, y, n, n, cd, ls, col)
    d.ellipse([x - 8, y - 8, x + 24, y + 24], fill=col)
    d.text((x + 8, y + 8), str(i + 1), font=f(15, True), fill=BLANCO, anchor='mm')
    if i < 5:
        flecha(d, (x + 104, y + 48), (x + 176, y + 48), (90, 96, 104), 3, 10)
y += 230

y += banda(img, d, y, 'LA VENTANA',
           'Blade Toss abre 10 segundos con la defensa rota y la curación a la mitad, y ahí es donde '
           'tiene que caer todo. Prepare for Battle aguanta 20, así que la cola todavía pega: '
           '+20% de daño PvE, +10% PvP, +100 de crítico y +15% de probabilidad de estados.',
           VERDE, (38, 46, 40), 200) + 22

d.text((44, y), 'DE RELLENO, MIENTRAS TODO SE RECARGA', font=f(15, True), fill=ORO)
y += 30
relleno = [('Keen Strike', 'sin recarga · devuelve 100 MP'),
           ('Sword Aura Rampage', 'sin recarga · pide Stagger'),
           ('Crushing Wave', '20 s · daño en área')]
for i, (n, txt) in enumerate(relleno):
    x = 44 + i * 400
    icono(img, n, (x, y), 64)
    etiqueta(d, (x + 78, y + 12), n, BLANCO, 15, 'la', True)
    etiqueta(d, (x + 78, y + 36), txt, GRIS, 13, 'la')
y += 96

banda(img, d, y, 'OJO',
      'Este orden lo he deducido de los datos: no es una rotación oficial. En cuanto salga el global '
      'habrá que contrastarlo jugando.', ORO, (46, 38, 30), 120)
cerrar(img, d, '02-apertura.png')


# ═══════════════════════════ 4 · cuándo pulsar cada defensiva ═══════════════════
img, d = lienzo('CUÁNDO PULSAR CADA DEFENSIVA',
                'Tres botones para tres problemas distintos. Usar el equivocado es morir.', h=900)

y = 158
tarjetas = [
    ('Tenaciousness', '150 s', ROJO, 'Inmune a daño y a estados 3 s',
     ['Para el golpe que te mata.', 'Al acabarse te deja +50% de aguante',
      'en PvE y +25% en PvP otros 3 s.']),
    ('Defiance', '60 s', ORO, 'Te quita el control y te hace inmune 5 s',
     ['Para cuando te tienen tumbado,', 'aturdido, agarrado, congelado', 'o con miedo. Tu escapatoria.']),
    ('Focused Block', '20 s', AZUL, 'Parada garantizada y +100% de bloqueo',
     ['Para el intercambio normal.', 'Te devuelve 110 de maná y aguante', 'al PARAR (no al bloquear).']),
]
for i, (n, cd, col, titulo, lineas) in enumerate(tarjetas):
    x = 44 + i * 390
    d.rounded_rectangle([x, y, x + 358, y + 344], radius=12, fill=CAJA)
    icono(img, n, (x + 26, y + 28), 88, col, 4)
    etiqueta(d, (x + 138, y + 44), n, BLANCO, 20, 'la', True)
    d.rounded_rectangle([x + 138, y + 74, x + 210, y + 100], radius=7, fill=col)
    d.text((x + 174, y + 87), cd, font=f(14, True), fill=BLANCO, anchor='mm')
    etiqueta(d, (x + 26, y + 148), titulo, col, 15, 'la', True)
    for j, l in enumerate(lineas):
        etiqueta(d, (x + 26, y + 196 + j * 26), l, TEXTO, 14.5, 'la')
y += 372

y += banda(img, d, y, 'OJO',
           'Tenaciousness NO para ciertos ataques muy fuertes: no lo guardes para el jefe y te confíes.',
           ROJO, (58, 38, 38), 100) + 12
banda(img, d, y, 'Y ESTO TAMPOCO LO DICE NADIE',
      'La recarga de Defiance NO se puede reducir con nada. Lo dice su propia ficha, así que no montes '
      'el build contando con bajársela.', ORO, (46, 38, 30), 260)
cerrar(img, d, '04-defensivas.png')
