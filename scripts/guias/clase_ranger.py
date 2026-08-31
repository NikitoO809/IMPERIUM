# -*- coding: utf-8 -*-
"""Diagramas de la guia de Ranger."""
from guia_clase import generar

generar('ranger', [
    {
        'tipo': 'cadena', 'archivo': 'r1-precision.png',
        'titulo': 'LA VENTANA DE PRECISIÓN',
        'subtitulo': 'El Ranger no dispara siempre igual: abre una ventana de 10 segundos y mete ahí lo gordo.',
        'paso1': {'etiqueta': 'PASO 1 · ABRES LA VENTANA', 'items': [
            ('Marking Shot', '10s', 'Precisión 10 s:\n+300 de crítico'),
        ]},
        'transicion': 'tienes Precisión activa',
        'paso2': {'etiqueta': 'PASO 2 · LO QUE CAMBIA MIENTRAS DURA', 'items': [
            ('Deadshot', '20s', '+35% de daño\nsi tienes Precisión'),
            ('Suppressing Arrow', '20s', '40% de aturdir,\nsolo con Precisión'),
        ]},
        'carteles': [
            {'xy': (700, 184), 'texto': 'Marking Shot además te desplaza en la dirección que marques: '
                                        'abre la ventana y te recoloca a la vez.', 'ancho': 300},
            {'xy': (700, 470), 'texto': 'Suppressing Arrow SOLO aturde mientras tengas Precisión. '
                                        'Fuera de la ventana es un flechazo más.', 'ancho': 300},
        ],
    },
    {
        'tipo': 'cadena', 'archivo': 'r2-cadena.png',
        'titulo': 'FRENAR Y REVENTAR',
        'subtitulo': 'Tu segunda cadena: si no está frenado, no puedes rematarlo.',
        'paso1': {'etiqueta': 'PASO 1 · LO FRENAS', 'items': [
            ('Snare Shot', '15s', 'ralentiza un 40%\ndurante 5 s'),
            ('Sealing Arrow', '60s', '75% de sellar\n(100% en PNJ)'),
        ]},
        'transicion': 'ralentizado o enraizado',
        'paso2': {'etiqueta': 'PASO 2 · LO REVIENTAS', 'items': [
            ('Burst Arrow', '20s', 'SOLO a frenados\no enraizados'),
        ]},
        'carteles': [
            {'xy': (700, 184), 'texto': 'Snare Shot con su mejora de nivel 16 alarga 2 segundos más '
                                        'el freno: más ventana para rematar.', 'ancho': 300},
            {'xy': (700, 470), 'texto': 'Burst Arrow tiene un 25% de resetearse solo al golpear '
                                        '(mejora de nivel 16). Con suerte, encadenas dos seguidos.',
             'ancho': 300},
        ],
    },
    {
        'tipo': 'fila', 'archivo': 'r3-veneno.png',
        'titulo': 'EL DAÑO QUE NO SE VE',
        'subtitulo': 'Mientras tú recargas, el enemigo se sigue desangrando.',
        'grupos': [
            {'etiqueta': 'DAÑO CONTINUO', 'color': 'rojo', 'items': [
                ('Drill Dart', '5s', 'sangrado 6 s y le baja\nla curación un 60%'),
                ('Griffon Arrow', '45s', 'llamas 10 s: más daño\ncuanto más se mueva'),
                ('Supporting Fire', '90s', 'un orbe que dispara\nsolo durante 15 s'),
            ]},
            {'etiqueta': 'TU PROPIO EMPUJE', 'color': 'verde', 'items': [
                ('Gale Arrow', '20s', '+7% de velocidad\ny de daño, 10 s'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'LA JOYA ESCONDIDA', 'color': 'rojo', 'fondo': (58, 38, 38),
             'texto': 'Drill Dart tiene 5 s de recarga y le baja al enemigo la curación recibida un 60%. Ojo: no se acumula con el Debilitating Smash del Templar ni con el Firestorm del Sorcerer. '
                      'En PvP contra un grupo con sanador, eso decide la pelea más que tu daño.'},
            {'etiqueta': 'DETALLE', 'color': 'oro',
             'texto': 'Griffon Arrow hace más daño cuanto más se mueva el objetivo. Contra alguien que huye '
                      'es cuando más pega, justo cuando otras clases pierden daño.'},
        ],
    },
    {
        'tipo': 'stigmas', 'archivo': 'r4-stigmas.png',
        'titulo': 'LAS MEJORAS QUE CAMBIAN LA CLASE',
        'subtitulo': 'Cinco por habilidad. En Mastery salen a nivel 8, 12 y 16 y solo caben TRES; en Stigma salen a 5, 10, 15, 20 y 25 y te quedas con todas.',
        'bandas_arriba': [
            {'etiqueta': 'EL PATRÓN', 'color': 'oro',
             'texto': 'El Ranger vive de repetir disparos. Las que más le cambian son las que resetean recargas '
                      'y los que alargan la ventana de Precisión.'},
        ],
        'grupos': [
            {'etiqueta': 'PARA DISPARAR MÁS VECES', 'color': 'verde', 'items': [
                ('Deadshot', 16, 'Daño extra al golpear'),
                ('Burst Arrow', 16, '25% de resetearse al golpear'),
                ('Suppressing Arrow', 16, '25% de resetearse al golpear'),
                ('Snipe', 12, '−1 s a Deadshot al golpear'),
                ('Gale Arrow', 16, '−10 s de recarga'),
                ('Drill Dart', 16, 'Se activa una vez más'),
            ]},
            {'etiqueta': 'PARA ALARGAR LA VENTANA', 'color': 'azul', 'items': [
                ('Marking Shot', 8, '+3 s de Precisión (7 → 10 s)'),
                ('Marking Shot', 12, '+1 uso seguido'),
                ('Snare Shot', 16, '+2 s de freno y enraizado'),
            ]},
        ],
    },
])
