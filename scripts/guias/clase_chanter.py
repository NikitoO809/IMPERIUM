# -*- coding: utf-8 -*-
"""Diagramas de la guia de Chanter."""
from guia_clase import generar

generar('chanter', [
    {
        'tipo': 'fila', 'archivo': 'h1-mantras.png',
        'titulo': 'LO QUE LE DAS AL GRUPO',
        'subtitulo': 'Ninguna clase aporta tanto a los demás. Esto es el Chanter, no su daño.',
        'grupos': [
            {'etiqueta': 'MANTRAS · SIEMPRE PUESTOS (5 s de recarga)', 'color': 'oro', 'paso': 200, 'items': [
                ('Undefeated Mantra', 'PERMANENTE', '+10,5% PvE y +5,25% PvP\na todo el grupo'),
                ('Sprint Mantra', 'PERMANENTE', '+10,5% de velocidad y 15% de\ncurar al golpear'),
            ]},
            {'etiqueta': 'LOS BOTONES GORDOS', 'color': 'verde', 'paso': 200, 'items': [
                ('Power of the Storm', '120s', '+20% velocidad al grupo\ny −20% a TUS recargas'),
                ('Impeding Authority', '90s', 'escudo del 16% de la vida\nde cada uno, 20 s'),
                ('Healing Touch', '30s', 'cura a todo el grupo\nen 40 metros'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'LOS MANTRAS NO SE ACUMULAN', 'color': 'rojo', 'fondo': (58, 38, 38),
             'texto': 'Solo puedes llevar uno activo. Undefeated Mantra sube daño y aguante; Sprint Mantra da '
                      'velocidad y curación. Decide según la pelea, no lo dejes al azar.'},
        ],
    },
    {
        'tipo': 'destacado', 'archivo': 'h2-barrera.png', 'color': 'azul',
        'titulo': 'EL BOTÓN QUE SALVA UNA PELEA',
        'subtitulo': 'Tres segundos en los que tu grupo no se puede morir.',
        'habilidad': 'Barrier Spell',
        'titular': 'NADIE BAJA DEL 10% DE VIDA',
        'lineas': [
            'Durante 3 segundos, ni tú ni ningún compañero a 40 m puede bajar del 10% de vida.',
            'Recarga 180 s. No le afectan los efectos que alargan recargas.',
            'No para ciertos ataques muy fuertes.',
        ],
        'bandas': [
            {'etiqueta': 'CUÁNDO', 'color': 'azul', 'fondo': (30, 40, 48),
             'texto': 'Justo antes del golpe que se lleva al grupo por delante. Son 3 segundos: si lo tiras pronto '
                      'se desperdicia, y si lo tiras tarde ya hay muertos. Es la habilidad que más pide anticipar.'},
            {'etiqueta': 'SU MEJOR MEJORA', 'color': 'verde', 'fondo': (38, 46, 40),
             'texto': 'A nivel 25, al acabarse quita TODOS los estados negativos del grupo. Deja de ser solo un '
                      'salvavidas y pasa a ser también una limpieza general.'},
        ],
    },
    {
        'tipo': 'cadena', 'archivo': 'h3-cadena.png',
        'titulo': 'ATURDIR Y REMATAR',
        'subtitulo': 'Además de sostener al grupo, tienes tu propia cadena.',
        'paso1': {'etiqueta': 'PASO 1 · ATURDES Y ABRES LA VENTANA', 'items': [
            ('Impactful Crush', '10s', '60% aturdir · 100% en PNJ\nabre Dark Crush 2 s'),
            ('Heat Wave Blow', '10s', 'con su mejora, 40%\nde aturdir'),
        ]},
        'transicion': 'aturdido, y la ventana abierta',
        'paso2': {'etiqueta': 'PASO 2 · LO REMATAS', 'items': [
            ('Dark Crush', '5s', 'solo dentro de la ventana.\ncon su mejora, SIN recarga'),
            ('Wave Blow', '20s', 'SOLO sobre aturdidos.\ny los derriba'),
        ]},
        'carteles': [
            {'xy': (700, 184), 'texto': 'Dark Crush ya NO pide que el enemigo esté incapacitado: lo que pasa es '
                                        'que solo está disponible 2 segundos después de usar Impactful Crush.', 'ancho': 300},
            {'xy': (700, 470), 'texto': 'Fracturing Blow le baja un 30% la defensa y pega un 20% más fuerte '
                                        'a quien ya esté incapacitado. Va después del aturdimiento.', 'ancho': 300},
        ],
    },
    {
        'tipo': 'stigmas', 'archivo': 'h4-stigmas.png',
        'titulo': 'LAS MEJORAS QUE CAMBIAN LA CLASE',
        'subtitulo': 'Cinco por habilidad. En Mastery salen a nivel 8, 12 y 16 y solo caben TRES; en Stigma salen a 5, 10, 15, 20 y 25 y te quedas con todas.',
        'bandas_arriba': [
            {'etiqueta': 'EL PATRÓN', 'color': 'oro',
             'texto': 'El Chanter elige entre ser el sostén del grupo o encadenar aturdimientos sin parar. '
                      'Las dos funcionan, pero mezclarlas a medias no. Ojo: en las Mastery (Dark Crush, '
                      'Impactful Crush, Recuperation, Heat Wave Blow) solo caben TRES mejoras; en las Stigma '
                      '(Barrier Spell, Sprint Mantra, Fracturing Blow) te quedas con todas las que desbloquees.'},
        ],
        'grupos': [
            {'etiqueta': 'PARA SOSTENER AL GRUPO', 'color': 'azul', 'items': [
                ('Barrier Spell', 25, 'Al acabar, limpia todos los estados'),
                ('Barrier Spell', 20, '+1 s de duración (3 → 4 s)'),
                ('Recuperation', 16, '−3 s de recarga'),
                ('Recuperation', 8, 'La regeneración se acumula ×2'),
                ('Sprint Mantra', 15, 'Cura un 50% más por debajo del 50% de vida'),
                ('Barrier Spell', 15, 'Aguanta hasta el 20% en vez del 10%'),
            ]},
            {'etiqueta': 'PARA ENCADENAR ATURDIMIENTOS', 'color': 'rojo', 'items': [
                ('Dark Crush', 16, 'Le quita la recarga entera'),
                ('Impactful Crush', 16, '+20% de probabilidad de aturdir'),
                ('Heat Wave Blow', 16, '25% de resetearse al bloquear'),
                ('Wave Blow', 16, '−5 s de recarga'),
                ('Fracturing Blow', 5, '−15 s de recarga'),
                ('Rushing Smash', 12, 'Se resetea al matar a alguien'),
            ]},
        ],
    },
])
