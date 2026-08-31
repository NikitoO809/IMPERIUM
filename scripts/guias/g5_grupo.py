# -*- coding: utf-8 -*-
"""05-grupo.png — lo que el Gladiator le aporta al grupo.

Se rehizo el 2026-08-30: la versión anterior decía que `Zikel's Blessing` daba
+20% de ataque a toda la party. En el cliente actual es **solo para el lanzador**,
así que el aporte al grupo viene de otro sitio. Datos comprobados contra capturas.
"""
from guia_base import (cargar_iconos, f, icono, etiqueta, lienzo, cerrar, banda,
                       ROJO, ORO, VERDE, AZUL, MORADO, BLANCO, CAJA, TEXTO, GRIS)

cargar_iconos('gladiator')
img, d = lienzo('LO QUE APORTAS AL GRUPO',
                'No es Zikel\'s Blessing: eso ahora es solo para ti.', h=1200)

y = 150
y += banda(img, d, y, 'LO QUE CAMBIÓ',
           "Zikel's Blessing ya NO buffea a la party. Ahora sube el ataque un 20% y la precisión "
           "en 100 solo al que la lanza. Si has leído lo contrario, era de una versión anterior.",
           ROJO, (58, 38, 38), 230) + 22

# la que ya no vale para el grupo, con sus datos buenos
icono(img, "Zikel's Blessing", (60, y), 92, (120, 70, 70), 3)
etiqueta(d, (176, y + 4), "Zikel's Blessing", BLANCO, 22, 'la', True)
etiqueta(d, (176, y + 36), 'SOLO PARA TI  ·  +20% de ataque y +100 de precisión', ROJO, 15, 'la', True)
etiqueta(d, (176, y + 62), 'dura 10 s  ·  recarga 120 s  ·  es una Stigma, sube hasta 25',
         GRIS, 14, 'la')
y += 116

d.text((60, y), 'SU ESCALERA, Y LO QUE DA CADA PELDAÑO', font=f(14, True), fill=GRIS)
y += 28
escalones = [(5, '+50% daño de tambaleo', GRIS),
             (10, '+10% daño PvE y +5% PvP', VERDE),
             (15, '+50% de golpe múltiple', GRIS),
             (20, '+20% prob. de estados', ROJO),
             (25, '+5 s de duración', GRIS)]
for i, (nv, txt, col) in enumerate(escalones):
    x = 60 + i * 228
    d.rounded_rectangle([x, y, x + 50, y + 24], radius=6, fill=col)
    d.text((x + 25, y + 12), str(nv), font=f(13, True),
           fill=(20, 30, 24) if col is VERDE else BLANCO, anchor='mm')
    etiqueta(d, (x, y + 34), txt, GRIS, 12.5, 'la')
y += 96

d.text((60, y), 'verde: vale en los dos modos  ·  rojo: contra PNJ no hace nada',
       font=f(13), fill=(120, 126, 134))
y += 40

y += banda(img, d, y, 'LO QUE SÍ LE LLEGA AL GRUPO',
           'Tu aporte a la party sale de bloquear y de una Stigma, no de un botón de buff.',
           VERDE, (38, 46, 40), 260) + 22

icono(img, 'Experienced Counterstrike', (60, y), 84, VERDE, 3)
etiqueta(d, (168, y + 2), 'Experienced Counterstrike', BLANCO, 19, 'la', True)
etiqueta(d, (168, y + 30), 'Pasiva. Al BLOQUEAR le da a la party +5,4% de daño PvE y +2,7% PvP, 20 s.',
         TEXTO, 15, 'la')
etiqueta(d, (168, y + 54), 'No se acumula con el Fury del Templar: si lleváis los dos, habladlo.',
         ORO, 14, 'la')
y += 110

icono(img, 'Lifestealing Blade', (60, y), 84, VERDE, 3)
etiqueta(d, (168, y + 2), 'Lifestealing Blade  ·  nv. 10', BLANCO, 19, 'la', True)
etiqueta(d, (168, y + 30), 'Reparte el efecto Predation a los del grupo durante 20 s.', TEXTO, 15, 'la')
etiqueta(d, (168, y + 54), 'Es Stigma: solo la tienes si la equipas y la subes a 10.', GRIS, 14, 'la')
y += 116

cerrar(img, d, '05-grupo.png',
       'Datos del volcado del cliente del juego (aion2t.com) · comprobados contra capturas '
       'de la versión de Taiwán')
