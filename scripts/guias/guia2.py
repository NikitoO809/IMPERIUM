# -*- coding: utf-8 -*-
"""Diagramas 2 a 6 de la guia de Gladiator."""
from guia_gladiator import (f, icono, etiqueta, flecha, cartel,
                            ROJO, ORO, VERDE, BLANCO, FONDO, CAJA, TEXTO, GRIS)
from PIL import Image, ImageDraw

AZUL = (79, 152, 216)
PIE = ('Datos sacados de la base de datos del juego (questlog.gg) · versión coreana, '
       'anterior al lanzamiento global del 5 de octubre')


def lienzo(titulo, subtitulo, w=1240, h=760):
    img = Image.new('RGB', (w, h), FONDO)
    d = ImageDraw.Draw(img)
    d.text((44, 36), titulo, font=f(38, True), fill=BLANCO)
    d.text((44, 84), subtitulo, font=f(19), fill=GRIS)
    d.line([(44, 122), (w - 44, 122)], fill=(60, 63, 68), width=2)
    return img, d


def cerrar(img, d, nombre, nota=PIE):
    w, h = img.size
    d.line([(44, h - 74), (w - 44, h - 74)], fill=(60, 63, 68), width=2)
    d.text((44, h - 58), nota, font=f(13), fill=GRIS)
    img.save(nombre)
    print(nombre)


# ═══════════════════════════════ 2 · la rotación ═══════════════════════════════
img, d = lienzo('LA APERTURA', 'El orden importa: cada paso hace que el siguiente pegue más fuerte.')

pasos = [
    ("Zikel's Blessing", '120s', '+20% de ataque\na todo el grupo', ORO),
    ('Blade Toss', '20s', 'le baja 30% la defensa\ny la curación recibida', ROJO),
    ('Rush Strike', '20s', 'entras y lo tumbas\n(tras esquivar)', ROJO),
    ('Ruinous Blow', '30s', 'embestida y\nPrepare for Battle', ROJO),
    ('Rage Burst', '45s', 'EL GOLPE GORDO\ncae aquí dentro', VERDE),
    ('Overhead Slam', '5s', 'castigo repetido\nmientras siga en el suelo', ROJO),
]
X0, Y, PASO = 52, 190, 194
for i, (n, cd, nota, color) in enumerate(pasos):
    x = X0 + i * PASO
    c = icono(img, n, (x, Y), 96, color, 4)
    d.ellipse([x - 8, Y - 14, x + 26, Y + 20], fill=color)
    d.text((x + 9, Y + 2), str(i + 1), font=f(19, True), fill=BLANCO, anchor='mm')
    etiqueta(d, (c[0], Y + 106), n, BLANCO, 15, 'ma', True)
    etiqueta(d, (c[0], Y + 128), cd, color, 13)
    for j, l in enumerate(nota.split('\n')):
        etiqueta(d, (c[0], Y + 150 + j * 17), l, GRIS, 12.5)
    if i < len(pasos) - 1:
        flecha(d, (x + 104, Y + 48), (x + PASO - 12, Y + 48), GRIS, 3, 11)

d.rounded_rectangle([52, 400, 1188, 470], radius=10, fill=(38, 46, 40))
d.text((72, 435), 'LA VENTANA', font=f(15, True), fill=VERDE, anchor='lm')
d.text((190, 435),
       'Blade Toss deja al enemigo con 30% menos de defensa durante 10 s, y Rage Burst te sube a ti el daño. '
       'Todo lo gordo entra en esos 10 segundos.', font=f(15), fill=TEXTO, anchor='lm')

d.text((52, 512), 'DE RELLENO, MIENTRAS TODO SE RECARGA', font=f(15, True), fill=ORO)
relleno = [('Keen Strike', 'sin recarga · devuelve 100 MP'),
           ('Sword Aura Rampage', 'sin recarga · pide Stagger'),
           ('Crushing Wave', '20s · daño en área')]
for i, (n, nota) in enumerate(relleno):
    x = 52 + i * 300
    c = icono(img, n, (x, 546), 74, None)
    etiqueta(d, (x + 86, 556), n, BLANCO, 14, 'la', True)
    etiqueta(d, (x + 86, 578), nota, GRIS, 12.5, 'la')

cartel(d, (52, 646), 'Este orden lo he deducido de los datos: no es una rotación oficial. '
                     'En cuanto salga el global habrá que contrastarlo jugando.', 900, (92, 74, 30), 15)
cerrar(img, d, '02-apertura.png')


# ═══════════════════════════════ 3 · las mejoras ═══════════════════════════════
img, d = lienzo('LAS MEJORAS QUE CAMBIAN LA CLASE',
                'Cada habilidad tiene cinco, y se desbloquean según el nivel de esa habilidad. Aquí es donde se decide tu build.',
                1240, 800)

d.rounded_rectangle([44, 150, 1196, 214], radius=10, fill=(46, 38, 30))
d.text((66, 182), 'EL PATRÓN', font=f(15, True), fill=ORO, anchor='lm')
d.text((180, 182),
       'Muchas de las mejoras buenas hacen lo mismo: recortar recargas. Esa es la build del Gladiator, '
       'no subir el número del daño.', font=f(15), fill=TEXTO, anchor='lm')

recorte = [('Overhead Slam', 16, 'Le quita la recarga entera'),
           ('Sword Aura Rampage', 16, '−1 s a TODAS tus recargas al golpear'),
           ('Rush Strike', 12, '−10 s (se queda en 10 s)'),
           ('Crushing Wave', 12, 'Se resetea al hacer crítico'),
           ('Lunge Stance', 20, '50% de −1 s a todo al hacer crítico'),
           ('Rage Burst', 5, '−15 s (se queda en 30 s)')]
d.text((44, 240), 'RECORTAN RECARGAS', font=f(15, True), fill=VERDE)
for i, (n, coste, efecto) in enumerate(recorte):
    x, y = 44 + (i % 3) * 390, 274 + (i // 3) * 116
    icono(img, n, (x, y), 72, VERDE, 3)
    etiqueta(d, (x + 86, y + 4), n, BLANCO, 15, 'la', True)
    d.rounded_rectangle([x + 86, y + 28, x + 140, y + 50], radius=6, fill=VERDE)
    d.text((x + 113, y + 39), 'nv. %d' % coste, font=f(13, True), fill=(20, 30, 24), anchor='mm')
    etiqueta(d, (x + 150, y + 32), efecto, TEXTO, 13, 'la')

d.text((44, 522), 'LOS OTROS QUE MERECEN LA PENA', font=f(15, True), fill=ORO)
otros = [('Ankle Slice', 12, 'Ignora bloqueo y evasión'),
         ('Forced Restraint', 25, 'Ignora bloqueo y evasión'),
         ('Blade Toss', 15, 'Rompe los escudos protectores'),
         ('Tenaciousness', 10, 'Te devuelve 20% de vida al acabar'),
         ('Defiance', 8, 'Te devuelve 20% de vida al usarlo'),
         ('Focused Block', 20, '10% de vida al hacer parada')]
for i, (n, coste, efecto) in enumerate(otros):
    x, y = 44 + (i % 3) * 390, 556 + (i // 3) * 100
    icono(img, n, (x, y), 60, None)
    etiqueta(d, (x + 74, y + 2), n, BLANCO, 14, 'la', True)
    d.rounded_rectangle([x + 74, y + 24, x + 124, y + 44], radius=5, fill=(70, 74, 82))
    d.text((x + 99, y + 34), 'nv. %d' % coste, font=f(12, True), fill=TEXTO, anchor='mm')
    etiqueta(d, (x + 134, y + 27), efecto, GRIS, 12.5, 'la')

cerrar(img, d, '03-stigmas.png')


# ═════════════════════════════ 4 · las defensivas ═════════════════════════════
img, d = lienzo('CUÁNDO PULSAR CADA DEFENSIVA',
                'Tres botones para tres problemas distintos. Usar el equivocado es morir.', 1240, 700)

defensivas = [
    ('Tenaciousness', '150 s', 'Inmune a todo\ndurante 3 s',
     'Para el golpe que te mata.\nAl acabar te deja +50% de\naguante en PvE y +25% en PvP.', ROJO),
    ('Defiance', '60 s', 'Te quita el control\ny te hace inmune 5 s',
     'Para cuando te tienen\ntumbado, aturdido, agarrado\no con miedo. Es tu escapatoria.', ORO),
    ('Focused Block', '20 s', 'Parada garantizada\ny +100% de bloqueo',
     'Para el intercambio normal.\nAdemás te devuelve maná\ny aguante al bloquear.', AZUL),
]
for i, (n, cd, que, cuando, color) in enumerate(defensivas):
    x = 44 + i * 390
    d.rounded_rectangle([x, 160, x + 356, 500], radius=12, fill=CAJA)
    icono(img, n, (x + 24, 186), 84, color, 4)
    etiqueta(d, (x + 124, 194), n, BLANCO, 19, 'la', True)
    d.rounded_rectangle([x + 124, 224, x + 194, 248], radius=6, fill=color)
    d.text((x + 159, 236), cd, font=f(13, True), fill=(18, 20, 24), anchor='mm')
    for j, l in enumerate(que.split('\n')):
        etiqueta(d, (x + 24, 296 + j * 22), l, color, 15, 'la', True)
    for j, l in enumerate(cuando.split('\n')):
        etiqueta(d, (x + 24, 366 + j * 24), l, TEXTO, 14, 'la')

d.rounded_rectangle([44, 524, 1196, 578], radius=10, fill=(58, 38, 38))
d.text((66, 551), 'OJO', font=f(15, True), fill=ROJO, anchor='lm')
d.text((124, 551), 'Tenaciousness no para ciertos ataques muy fuertes. No lo guardes para el jefe '
                   'y te confíes: úsalo cuando veas venir el golpe.', font=f(15), fill=TEXTO, anchor='lm')
cerrar(img, d, '04-defensivas.png')


# ═══════════════════════════════ 5 · el grupo ═══════════════════════════════
img, d = lienzo('LO QUE APORTAS AL GRUPO',
                'Un Gladiator no solo pega: sube el daño de los otros siete.', 1240, 630)

icono(img, "Zikel's Blessing", (60, 176), 132, ORO, 5)
d.text((228, 186), "Zikel's Blessing", font=f(30, True), fill=BLANCO)
d.text((228, 232), '+20% DE ATAQUE A TODO EL GRUPO', font=f(21, True), fill=ORO)
d.text((228, 268), 'Alcance 40 m  ·  dura 10 s  ·  recarga 120 s', font=f(16), fill=TEXTO)
d.text((228, 296), 'Cae sobre ti y sobre los compañeros que tengas a menos de 40 metros.',
       font=f(15), fill=GRIS)

d.rounded_rectangle([60, 344, 1180, 412], radius=10, fill=(46, 38, 30))
d.text((84, 378), 'ÚSALO ANTES DE ENTRAR', font=f(15, True), fill=ORO, anchor='lm')
d.text((320, 378), 'Solo dura 10 segundos. Si lo tiras al llegar, se gasta mientras corréis. '
                   'Se lanza cuando el grupo ya está encima.', font=f(15), fill=TEXTO, anchor='lm')

d.text((60, 440), 'SUS MEJORAS, Y EL NIVEL AL QUE SE ABREN', font=f(14, True), fill=GRIS)
st = [('nv. 5', '+50% de daño a la barra de aturdimiento'), ('nv. 10', '+100 de precisión'),
      ('nv. 15', '+50% de golpe múltiple'), ('nv. 20', '+20% de probabilidad de estados'),
      ('nv. 25', '+10% daño PvE y +5% PvP')]
for i, (p, e) in enumerate(st):
    x = 60 + i * 224
    d.rounded_rectangle([x, 472, x + 44, 494], radius=5, fill=(70, 74, 82))
    d.text((x + 22, 484), p, font=f(12, True), fill=TEXTO, anchor='mm')
    etiqueta(d, (x, 504), e, GRIS, 12.5, 'la')
cerrar(img, d, '05-grupo.png')


# ═══════════════════════════════ 6 · las macros ═══════════════════════════════
img, d = lienzo('LAS MACROS', 'Aion 2 las permite, pero solo hasta cierto punto.', 1240, 640)

d.rounded_rectangle([44, 158, 604, 470], radius=12, fill=CAJA)
d.text((70, 182), 'SÍ SE PUEDE', font=f(16, True), fill=VERDE)
si = ['Encadenar dos habilidades en un botón', 'Suavizar el clic izquierdo y el derecho',
      'Cortar animaciones y ganar fluidez', 'Arrastrar la habilidad al cuadro de la macro',
      'Escribirla a mano con  /Skill [nombre]']
for i, l in enumerate(si):
    d.text((70, 220 + i * 34), '✓', font=f(17, True), fill=VERDE)
    d.text((98, 220 + i * 34), l, font=f(15), fill=TEXTO)

d.rounded_rectangle([70, 400, 578, 448], radius=8, fill=(24, 26, 30))
d.text((88, 424), '/Skill Rush Strike', font=f(16), fill=(126, 211, 156), anchor='lm')
d.text((300, 424), '← y una pausa entre medias', font=f(13), fill=GRIS, anchor='lm')

d.rounded_rectangle([636, 158, 1196, 470], radius=12, fill=CAJA)
d.text((662, 182), 'NO SE PUEDE', font=f(16, True), fill=ROJO)
no = ['Automatizar la rotación entera', 'Farmear solo, sin estar delante',
      'Encadenar más de dos habilidades', 'Saltarse el tiempo global de recarga']
for i, l in enumerate(no):
    d.text((662, 220 + i * 34), '✕', font=f(17, True), fill=ROJO)
    d.text((690, 220 + i * 34), l, font=f(15), fill=TEXTO)

d.rounded_rectangle([662, 372, 1170, 448], radius=8, fill=(58, 38, 38))
d.text((684, 396), 'Farmear con macro estando ausente', font=f(15, True), fill=ROJO)
d.text((684, 420), 'está prohibido y te pueden cerrar la cuenta.', font=f(15), fill=TEXTO)

d.text((44, 508), 'La pausa entre habilidades tiene que cubrir el tiempo global de recarga y la animación. '
                  'Muy corta, se come el golpe; muy larga, pierdes daño.', font=f(15), fill=GRIS)
cerrar(img, d, '06-macros.png',
       'Cómo funcionan las macros en Aion 2 · pendiente de confirmar en el cliente global')
