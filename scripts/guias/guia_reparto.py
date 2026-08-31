# -*- coding: utf-8 -*-
"""El diagrama de reparto PvE/PvP de una clase.

Va en dos mitades, porque Mastery y Stigma no se reparten igual:
  Mastery — cinco mejoras y solo caben TRES: ahi eliges, y ahi tiene sentido
            decir «esta no la cojas en PvE».
  Stigma  — se queda con TODAS las que desbloquee, asi que no eliges mejora:
            decides que Stigma equipas y hasta que nivel la subes. Por eso se
            dibuja su escalera 5/10/15/20/25 en vez de una lista suelta.
"""
import json
import re
import sys
from guia_base import (cargar_iconos, f, icono, etiqueta, lienzo, cerrar, banda,
                       ROJO, ORO, VERDE, AZUL, MORADO, BLANCO, CAJA, TEXTO, GRIS)

DATOS = json.load(open('listas-negras.json', encoding='utf-8'))

NOMBRES = {
    'gladiator': 'GLADIATOR', 'templar': 'TEMPLAR', 'assassin': 'ASSASSIN',
    'ranger': 'RANGER', 'sorcerer': 'SORCERER', 'elementalist': 'SPIRITMASTER',
    'cleric': 'CLERIC', 'chanter': 'CHANTER',
}
ARCHIVOS = {
    'gladiator': 'g9-reparto.png', 'templar': 't9-reparto.png',
    'assassin': 'a9-reparto.png', 'ranger': 'r9-reparto.png',
    'sorcerer': 's9-reparto.png', 'elementalist': 'e9-reparto.png',
    'cleric': 'c9-reparto.png', 'chanter': 'h9-reparto.png',
}

COLOR = {'inutilPve': ROJO, 'valenSiempre': VERDE, 'soloPvp': AZUL, 'otra': (72, 76, 82)}

# se traduce lo justo para que se entienda sin saber inglés
TRADUCE = [
    ('Knockdown Chance', 'de derribo'), ('Stun Chance', 'de aturdir'),
    ('Root Chance', 'de enraizar'), ('Root chance', 'de enraizar'),
    ('Seal Chance', 'de sellar'), ('Seal chance', 'de sellar'),
    ('Frost Chance', 'de congelar'), ('Fear Chance', 'de miedo'),
    ('Airborne Chance', 'de lanzar por el aire'),
    ('Status Effect Chance', 'de estados'), ('Polymorph Chance', 'de polimorfia'),
    ('Multi-Hit chance', 'de golpe múltiple'), ('Stagger Gauge Damage', 'de tambaleo'),
    ('for the duration', ''),
    # «target's» y «reduction» van antes: es lo que le quitas al rival, no lo que te da a ti
    ("target's PvE Damage Boost", 'daño PvE al rival'),
    ("target's PvP Damage Boost", 'daño PvP al rival'),
    ("target's PvE Damage Tolerance", 'aguante PvE al rival'),
    ("target's PvP Damage Tolerance", 'aguante PvP al rival'),
    ('additional ', ''),
    ('PvE Damage Tolerance reduction', 'aguante PvE al rival'),
    ('PvP Damage Tolerance reduction', 'aguante PvP al rival'),
    ('PvE Damage Boost reduction', 'daño PvE al rival'),
    ('PvP Damage Boost reduction', 'daño PvP al rival'),
    ('PvE Damage Tolerance increase', 'aguante PvE'), ('PvP Damage Tolerance increase', 'aguante PvP'),
    ('PvE Damage Boost increase', 'daño PvE'), ('PvP Damage Boost increase', 'daño PvP'),
    ('PvE Damage Boost and Damage Tolerance', 'daño y aguante PvE'),
    ('PvP Damage Boost and Damage Tolerance', 'daño y aguante PvP'),
    ('PvE Damage Tolerance', 'aguante PvE'), ('PvP Damage Tolerance', 'aguante PvP'),
    ('PvE Damage Boost', 'daño PvE'), ('PvP Damage Boost', 'daño PvP'),
    ('Adds ', ''), ('adds ', ''), ('effect to Shrink', 'a Shrink'),
    ('when more targets hit', 'con más objetivos'),
    ('to party members', 'al grupo'), ('for caster and Spirit', 'a ti y al espíritu'),
    ('for Protective Shield duration', 'mientras dure el escudo'),
    ('for Protective Shield', 'con el escudo'),
    ("target's ", 'al rival '), ('to Earth Spirit', 'al espíritu de tierra'),
    ('when effect expires naturally', 'si se acaba sola'),
    ('during healing', 'al curar'), ('Up to ', 'hasta '),
    (' effect', ''), ('for 10s', '10s'), ('for 5s', '5s'), ('for 3s', '3s'),
    # todo lo que lleva «and» dentro va ANTES de traducir el «and» suelto
    ('Ignores Block and Evasion', 'ignora bloqueo y evasión'),
    ('ignores Block and Evasion', 'ignora bloqueo y evasión'),
    ('lands as a Critical Hit', 'y entra como crítico'),
    ('lands as Critical Hit', 'y entra como crítico'),
    ('lands as Multi-Hit', 'y entra como golpe múltiple'),
    ('Breaks Protective Shields', 'rompe escudos'), ('breaks Protective Shields', 'rompe escudos'),
    ('Incoming Heal and Potion Recovery', 'curación y pociones del rival'),
    ('Incoming Heal reduction', 'menos curación recibida'),
    ('Incoming Heal', 'curación recibida'),
    ('reduces Damage over Time interval by 50%', 'el daño en el tiempo tica el doble de rápido'),
    ('during Damage over Time', 'mientras dura el daño en el tiempo'),
    ('PC targets', 'jugadores'), ('PC target', 'jugadores'), ('to players', 'a jugadores'),
    ('Max HP', 'vida máxima'), ('Inflicts Shrink', 'aplica Shrink'),
    ('on landing', 'al acertar'), ('on hit', 'al golpear'),
    ('on skill use', 'al usarla'), ('on use', 'al usarla'),
    ('to Warding', 'a Warding Shield'),
    (' and ', ' y '), ('for Tenacity duration', 'con Tenacity'),
    ('Combat Speed,', 'velocidad,'), ('when less targets hit', 'con menos objetivos'),
]

SIN_CIFRA = '?'

# «reduction» es lo que le QUITAS al rival: el juego lo escribe «+5% ... reduction»,
# así que hay que comerse ese «+» y poner un menos, o se lee al revés.
# El lookbehind evita volver a firmar lo que ya lleva signo.
_AL_RIVAL = re.compile(r'(?<![-−\d])[+]?(\d+(?:[.,]\d+)?%\s+(?:aguante|daño)\s+Pv[EP]\s+al rival)')


def es(t, tope=58):
    for a, b in TRADUCE:
        t = t.replace(a, b)
    t = _AL_RIVAL.sub(r'−\1', t)
    t = ' '.join(t.split()).strip(' ,')
    if len(t) <= tope:
        return t
    corte = t[:tope].rsplit(' ', 1)[0]
    return corte.rstrip(' ,') + '…'


def filas(img, d, y, mejoras, color, texto_nv, campo='efecto'):
    """Las mejoras de Mastery, a dos columnas."""
    for i, m in enumerate(mejoras):
        x = 44 + (i % 2) * 588
        fy = y + (i // 2) * 92
        icono(img, m['habilidad'], (x, fy), 64, color, 3)
        etiqueta(d, (x + 78, fy + 6), m['habilidad'], BLANCO, 15, 'la', True)
        d.rounded_rectangle([x + 78, fy + 30, x + 140, fy + 52], radius=6, fill=color)
        d.text((x + 109, fy + 41), 'nv. %d' % m['nivel'], font=f(13, True), fill=texto_nv, anchor='mm')
        etiqueta(d, (x + 150, fy + 34), es(m[campo]), GRIS, 13, 'la')
    return ((len(mejoras) + 1) // 2) * 92 + 14


def escalera(img, d, y, st):
    """Una Stigma: su escalera de niveles y que aporta cada peldaño."""
    w = img.size[0]
    x = 44
    icono(img, st['habilidad'], (x, y), 56, (90, 96, 104), 2)

    etiqueta(d, (x + 70, y + 2), st['habilidad'], BLANCO, 15, 'la', True)
    pide = []
    if st.get('nivelRequerido'):
        pide.append('pide nv. %d' % st['nivelRequerido'])
    if st.get('puntosStigma'):
        pide.append('%d punto%s' % (st['puntosStigma'], '' if st['puntosStigma'] == 1 else 's'))
    if pide:
        etiqueta(d, (x + 70, y + 22), ' · '.join(pide), GRIS, 12, 'la')

    # los cinco peldaños, coloreados por lo que dan
    px = w - 44 - 5 * 54
    for m in st['mejoras']:
        col = COLOR.get(m['tipo'], COLOR['otra'])
        claro = m['tipo'] in ('inutilPve', 'valenSiempre', 'soloPvp')
        d.rounded_rectangle([px, y + 4, px + 46, y + 34], radius=7, fill=col)
        d.text((px + 23, y + 19), str(m['nivel']), font=f(14, True),
               fill=BLANCO if claro else GRIS, anchor='mm')
        px += 54

    # y debajo, solo lo que importa de esa escalera
    marcadas = [m for m in st['mejoras'] if m['tipo'] != 'otra']
    ty = y + 42
    for m in marcadas[:2]:
        col = COLOR[m['tipo']]
        d.rounded_rectangle([x + 70, ty, x + 118, ty + 18], radius=5, fill=col)
        d.text((x + 94, ty + 10), 'nv. %d' % m['nivel'], font=f(11, True),
               fill=BLANCO if m['tipo'] != 'valenSiempre' else (20, 30, 24), anchor='mm')
        etiqueta(d, (x + 126, ty + 3), es(m['efecto'], 76), GRIS, 12, 'la')
        ty += 22
    if len(marcadas) > 2:
        etiqueta(d, (x + 70, ty + 3), '…y %d más en su escalera' % (len(marcadas) - 2), (110, 116, 124), 12, 'la')
        ty += 22

    return max(74, ty - y + 12)


def dibujar(clase):
    d0 = DATOS[clase]
    ma, st = d0['mastery'], d0['stigma']
    cargar_iconos(clase)
    img, d = lienzo('%s · REPARTO PvE Y PvP' % NOMBRES[clase],
                    'Las mismas mejoras no valen para las dos cosas. Estas son las tuyas.',
                    h=3400)

    y = 150
    y += banda(img, d, y, 'MASTERY · AQUÍ ELIGES',
               'Cada habilidad tiene cinco mejoras y solo puedes poner TRES: las ranuras se abren a '
               'nivel 8, 12 y 20 de esa habilidad. Aquí sí decides qué dejar fuera.',
               ORO, (46, 38, 30), 250) + 18

    if ma['inutilPve']:
        y += banda(img, d, y, 'NO LAS COJAS EN PvE',
                   'Contra PNJ el estado entra al 100%, así que subirle la probabilidad es pasar de '
                   '100% a 100%: ranura tirada. En PvP son de las mejores, porque contra un jugador '
                   'la base es del 40 al 75%.', ROJO, (58, 38, 38), 250) + 16
        y += filas(img, d, y, ma['inutilPve'], ROJO, BLANCO)

    if ma['valenSiempre']:
        y += banda(img, d, y, 'VALEN SIEMPRE',
                   'Suben el daño o el aguante en PvE y en PvP a la vez. Las primeras que hay que '
                   'coger, juegues a lo que juegues.', VERDE, (38, 46, 40), 250) + 16
        y += filas(img, d, y, ma['valenSiempre'], VERDE, (20, 30, 24))

    if ma['soloPvp']:
        y += banda(img, d, y, 'LAS DE PvP',
                   'No suben probabilidad: pasan por encima del bloqueo y la evasión, rompen el escudo '
                   'o le bajan la curación. Eso lo lleva un jugador mucho más que un PNJ.',
                   AZUL, (34, 42, 56), 250) + 16
        y += filas(img, d, y, ma['soloPvp'], AZUL, BLANCO, campo='motivo')

    if st:
        y += 16
        y += banda(img, d, y, 'STIGMA · AQUÍ NO ELIGES',
                   'La Stigma se queda con TODAS las mejoras que desbloquee, a nivel 5, 10, 15, 20 y 25, '
                   'y sube hasta 25. Así que no eliges mejora: eliges qué Stigma equipas y hasta dónde la '
                   'subes. Esta es la escalera de cada una — rojo: en PvE no hace nada · verde: vale en '
                   'los dos modos · azul: PvP.', MORADO, (46, 38, 52), 250) + 18
        for s in st:
            y += escalera(img, d, y, s)

    y += 16
    banda(img, d, y, 'Y OJO',
          'Resetear es gratis, así que prueba repartos sin miedo. Donde ponga «?» es que la base de '
          'datos no da esa cifra: no se inventa.', ORO, (46, 38, 30), 250)

    cerrar(img, d, ARCHIVOS[clase],
           'Datos del volcado del cliente del juego (aion2t.com) · comprobados contra capturas de la '
           'versión de Taiwán')


for clase in (sys.argv[1:] or NOMBRES):
    if clase in DATOS:
        dibujar(clase)
    else:
        print('%s: sin datos todavia' % clase)
