# -*- coding: utf-8 -*-
"""Diagramas de la guia de Sorcerer."""
from guia_clase import generar

generar('sorcerer', [
    {
        'tipo': 'cadena', 'archivo': 's1-hielo.png',
        'titulo': 'LA CADENA DE HIELO',
        'subtitulo': 'Congelar no es solo frenarlo: es lo que desbloquea tu golpe repetible.',
        'paso1': {'etiqueta': 'PASO 1 · LO CONGELAS', 'items': [
            ('Frost', '30s', '50% congelar\n100% en PNJ'),
            ("Winter's Shackles", '45s', 'con su mejora, 30%\nde congelar'),
            ('Arctic Armor', '90s', 'congela al que\nte pegue de cerca'),
        ]},
        'transicion': 'el enemigo está congelado',
        'paso2': {'etiqueta': 'PASO 2 · LO REVIENTAS', 'items': [
            ('Frost Burst', '10s', 'SOLO sobre\ncongelados'),
        ]},
        'carteles': [
            {'xy': (700, 184), 'texto': 'Frost Burst tiene un mejora de nivel 16 con 50% de resetear '
                                        'su propia recarga. Encadenado, es tu golpe más repetido.', 'ancho': 300},
            {'xy': (700, 470), 'texto': 'Tienes una segunda cadena igual con fuego: Flame Arrow deja Marca de '
                                        'Fuego y Blaze (5 s) solo funciona sobre ella.', 'ancho': 300},
        ],
    },
    {
        'tipo': 'fila', 'archivo': 's2-nuke.png',
        'titulo': 'EL ORDEN DEL GOLPE GORDO',
        'subtitulo': 'Un Sorcerer que lanza Hellfire sin preparar está tirando la mitad del daño.',
        'grupos': [
            {'etiqueta': 'PRIMERO PREPARAS', 'color': 'oro', 'items': [
                ('Delayed Explosion', '30s', 'durante 4 s le haces\n+15% de daño'),
                ('Element Enhancement', '60s', '+10% fuego\ny +10% agua'),
                ('Wish of Concentration', '60s', '+10% de ataque\ny +100 precisión'),
            ]},
            {'etiqueta': 'Y ENTONCES SUELTAS', 'color': 'rojo', 'items': [
                ('Fire Wall', '60s', 'muro de 3 s\nque deja brasas'),
                ('Hellfire', '45s', 'triplica el daño\ncon 3 cargas'),
                ('Divine Burst', '60s', '1.140 y 50 de\nbarra de aturdimiento'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'LA CLAVE', 'color': 'rojo', 'fondo': (58, 38, 38),
             'texto': 'Delayed Explosion no es un golpe: es un preparador. Explota a los 4 segundos, y durante '
                      'esa espera el enemigo recibe un 15% más de daño TUYO. Se lanza antes de todo lo demás.'},
        ],
    },
    {
        'tipo': 'fila', 'archivo': 's3-control.png',
        'titulo': 'EL ARSENAL DE CONTROL',
        'subtitulo': 'Ninguna clase tiene tantas formas de quitarle el turno a alguien.',
        'grupos': [
            {'etiqueta': 'QUITARLE EL CONTROL AL RIVAL', 'color': 'morado', 'items': [
                ('Curse: Tree', '90s', 'lo convierte en árbol\ndurante 10 s'),
                ('Soul Freeze', '60s', '75% de sellarle\nlas habilidades'),
                ("Lumiel's Space", '90s', '75% por los aires\n(100% en PNJ)'),
                ('Bittercold Wind', '15s', 'enraíza en área\nsolo 15 s de recarga'),
            ]},
            {'etiqueta': 'PARA SOBREVIVIR', 'color': 'azul', 'items': [
                ('Hibernation', '180s', 'inmune a todo,\nsales curándote 20%'),
                ('Arctic Armor', '90s', '+20% aguante\ny congela al que toca'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'COMBINACIÓN', 'color': 'oro',
             'texto': "Lumiel's Space con su mejora de nivel 25 DUPLICA la probabilidad de lanzar por los aires "
                      'si el objetivo ya está ralentizado o enraizado. Frenar primero no es opcional.'},
        ],
    },
    {
        'tipo': 'stigmas', 'archivo': 's4-stigmas.png',
        'titulo': 'LAS MEJORAS QUE CAMBIAN LA CLASE',
        'subtitulo': 'Cinco por habilidad. En Mastery salen a nivel 8, 12 y 16 y solo caben TRES; en Stigma salen a 5, 10, 15, 20 y 25 y te quedas con todas.',
        'bandas_arriba': [
            {'etiqueta': 'EL PATRÓN', 'color': 'oro',
             'texto': 'El Sorcerer tiene la mejora más bestia que he visto en las ocho clases: '
                      'Wish of Concentration a nivel 16 le quita 10 segundos a TODAS tus recargas.'},
        ],
        'grupos': [
            {'etiqueta': 'LOS QUE CAMBIAN TU RITMO', 'color': 'verde', 'items': [
                ('Wish of Concentration', 16, '−10 s a TODAS tus recargas'),
                ('Frost Burst', 16, '50% de resetearse'),
                ('Hellfire', 16, '−15 s de recarga'),
                ('Delayed Explosion', 10, '−10 s de recarga'),
                ('Bittercold Wind', 16, '−1 s a Frost al golpear'),
                ("Lumiel's Space", 20, '−30 s de recarga'),
            ]},
            {'etiqueta': 'LOS QUE SUBEN EL TECHO', 'color': 'rojo', 'items': [
                ('Delayed Explosion', 20, '+10% más de daño recibido'),
                ('Fire Wall', 25, '+10% al pegar a quien tenga brasas'),
                ("Lumiel's Space", 25, 'Doble efecto sobre frenados'),
            ]},
        ],
    },
])
