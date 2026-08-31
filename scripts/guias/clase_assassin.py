# -*- coding: utf-8 -*-
"""Diagramas de la guia de Assassin."""
from guia_clase import generar

generar('assassin', [
    {
        'tipo': 'cadena', 'archivo': 'a1-insignias.png',
        'titulo': 'LAS INSIGNIAS',
        'subtitulo': 'La mecánica que no tiene ninguna otra clase: marcas al enemigo y luego detonas las marcas.',
        'paso1': {'etiqueta': 'PASO 1 · LE GRABAS MARCAS (duran 10 s)', 'items': [
            ('Savage Roar', 'sin recarga', 'graba 1 · de serie\nsin necesitar mejora'),
            ('Ambush', '10s', 'graba 2 por la espalda\nCON su mejora nv. 8'),
            ('Shadow Fall', '20s', 'graba 3 al golpear\nCON su mejora nv. 8'),
            ('Shadowstep', '45s', 'graba 5 de golpe\nCON su mejora nv. 10'),
        ]},
        'transicion': 'el enemigo lleva marcas encima',
        'paso2': {'etiqueta': 'PASO 2 · LAS DETONAS', 'items': [
            ('Insignia Explosion', '10s', 'más marcas = más daño\ny más aturdimiento'),
            ('Aerial Bind', '120s', 'con 5 marcas lo manda\npor el aire SEGURO'),
        ]},
        'carteles': [
            {'xy': (700, 184), 'texto': 'Las marcas caducan a los 10 segundos. No sirve de nada '
                                        'acumularlas si luego no las detonas a tiempo.', 'ancho': 300},
            {'xy': (700, 520), 'texto': 'Aerial Bind lanza por el aire al 50%… pero con 5 marcas encima '
                                        'sube al 100%. Ahí está la diferencia entre acertar y fallar.',
             'ancho': 300},
        ],
    },
    {
        'tipo': 'cadena', 'archivo': 'a2-espalda.png',
        'titulo': 'POR LA ESPALDA Y DESDE LA SOMBRA',
        'subtitulo': 'El Assassin no pega de frente: se coloca.',
        'paso1': {'etiqueta': 'TE PONES DETRÁS O DESAPARECES', 'items': [
            ('Shadowstrike', '20s', 'salta detrás del rival\ny lo aturde'),
            ('Flash Slice', '10s', 'cruza al otro lado\ny ciega'),
            ('Shadow Walk', '120s', 'sigilo 20 s\n(fuera de combate)'),
            ('Shadowstep', '45s', 'pega, retrocede\ny se esconde 3 s'),
        ]},
        'transicion': 'estás a su espalda',
        'paso2': {'etiqueta': 'Y ENTONCES PEGAS', 'items': [
            ('Ambush', '10s', '+30% de daño\npor la espalda'),
            ('Shadow Fall', '20s', 'SOLO sobre aturdidos.\nSalta y derriba'),
        ]},
        'carteles': [
            {'xy': (700, 184), 'texto': 'Shadow Walk solo funciona fuera de combate… hasta que le pones '
                                        'su mejora de nivel 15, que lo habilita en plena pelea.', 'ancho': 300},
            {'xy': (700, 520), 'texto': 'Rear Smite, una pasiva, premia además cada golpe por la espalda. '
                                        'Colocarse no es estética: es daño.', 'ancho': 300},
        ],
    },
    {
        'tipo': 'fila', 'archivo': 'a3-supervivencia.png',
        'titulo': 'CÓMO NO MORIRTE',
        'subtitulo': 'Pegas como nadie y te matan de dos golpes. Estas son tus salidas.',
        'grupos': [
            {'etiqueta': 'DEFENSIVAS', 'color': 'azul', 'items': [
                ('Evasion Stance', '20s', 'esquiva TODO\nun instante'),
                ('Smoke Bomb', '30s', 'lo ciega 5 s:\nno te ve'),
                ('Shadowstep', '45s', 'pegas y sales\ninvisible 3 s'),
                ('Defiance', '60s', 'te quita el control\nque te tenga preso'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'LA REGLA', 'color': 'azul', 'fondo': (30, 40, 48),
             'texto': 'Evasion Stance devuelve 110 de maná y aguante una vez al esquivar con él. '
                      'No es solo defensa: también te sostiene los recursos.'},
            {'etiqueta': 'OJO', 'color': 'rojo', 'fondo': (58, 38, 38),
             'texto': 'Ceguera no es lo mismo que aturdimiento: el enemigo cegado se sigue moviendo y puede pegarte '
                      'de chiripa. Smoke Bomb te da tiempo, no impunidad.'},
        ],
    },
    {
        'tipo': 'stigmas', 'archivo': 'a4-stigmas.png',
        'titulo': 'LAS MEJORAS QUE CAMBIAN LA CLASE',
        'subtitulo': 'Cinco por habilidad. En Mastery salen a nivel 8, 12 y 16 y solo caben TRES; en Stigma salen a 5, 10, 15, 20 y 25 y te quedas con todas.',
        'bandas_arriba': [
            {'etiqueta': 'EL PATRÓN', 'color': 'oro',
             'texto': 'En el Assassin los mejores mejoras alimentan las marcas y encadenan aturdimientos. '
                      'Es la clase con más combinaciones del juego.'},
        ],
        'grupos': [
            {'etiqueta': 'PARA ALIMENTAR LAS MARCAS', 'color': 'morado', 'items': [
                ('Shadowstep', 10, 'Graba 5 marcas de una vez'),
                ('Shadow Fall', 8, 'Graba 3 marcas al golpear'),
                ('Insignia Explosion', 8, 'Conserva 2 marcas tras detonar'),
                ('Ambush', 8, 'Graba 2 por la espalda'),
                ('Insignia Explosion', 16, '−3 s de recarga'),
                ('Quick Slice', 12, '−1 s a la detonación al golpear'),
            ]},
            {'etiqueta': 'PARA ENCADENAR ATURDIMIENTOS', 'color': 'verde', 'items': [
                ('Flash Slice', 16, '50% de aturdir a quien esté cegado'),
                ('Whirlwind Slice', 16, '25% de resetearse al esquivar'),
                ('Shadow Fall', 16, 'Sirve también sobre cegados'),
                ('Shadow Walk', 15, 'Sigilo disponible en combate'),
                ('Shadowstrike', 8, '+1 s de aturdimiento'),
                ('Whirlwind Slice', 12, '+20% de probabilidad de aturdir'),
            ]},
        ],
    },
])
