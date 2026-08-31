# -*- coding: utf-8 -*-
"""Diagramas de la guia de Templar."""
from guia_clase import generar

generar('templar', [
    {
        'tipo': 'cadena', 'archivo': 't1-cadena.png', 'alto': 800,
        'titulo': 'LA VENTANA DE JUDGMENT',
        'subtitulo': 'Judgment no siempre está disponible: lo encienden otras habilidades.',
        'paso1': {'etiqueta': 'PASO 1 · ESTAS ENCIENDEN JUDGMENT', 'items': [
            ('Shield Smite', '10s', '60% aturdir · 100% en PNJ\nabre Judgment 2 s'),
            ('Doom Shield', '30s', '75% derribo · escudo 5%\nabre Judgment 3 s'),
            ('Shield Rush', '20s', 'embestida\nabre Judgment 2 s'),
            ('Warding Strike', '25s', 'golpe de escudo\nabre Judgment 2 s'),
        ]},
        'transicion': 'la ventana está abierta',
        'paso2': {'etiqueta': 'PASO 2 · Y AHORA SÍ', 'items': [
            ('Judgment', '5s', 'solo dentro\nde la ventana'),
            ('Annihilate', '20s', 'SOLO a aturdidos\no derribados (este sí)'),
        ]},
        'carteles': [
            {'xy': (700, 184), 'texto': 'Doom Shield hace las dos cosas a la vez: derriba y deja '
                                        'Judgment abierto contra ese enemigo 3 segundos, que es la ventana más larga.', 'ancho': 300},
            {'xy': (700, 520), 'texto': 'Judgment tiene 5 s de recarga, y con su mejora de nivel 16 '
                                        'se queda SIN recarga ninguna.', 'ancho': 300},
        ],
    },
    {
        'tipo': 'fila', 'archivo': 't2-tanque.png', 'alto': 720,
        'titulo': 'EL TRABAJO DE TANQUE',
        'subtitulo': 'Que el enemigo te mire a ti, y traértelo donde tú quieras.',
        'grupos': [
            {'etiqueta': 'LLAMAR LA ATENCIÓN', 'color': 'oro', 'items': [
                ('Taunt', '30s', '+20.000 de amenaza.\nEncoge al enemigo'),
                ('Vicious Strike', 'sin recarga', 'amenaza y\n+100 de maná'),
                ('Pummel', 'sin recarga', 'amenaza en área'),
            ]},
            {'etiqueta': 'TRAÉRTELO A LA CARA', 'color': 'rojo', 'items': [
                ('Poach', '15s', 'tira de uno\ny lo enraíza'),
                ('Grapple', '90s', 'tira de hasta 4\nen 7 metros'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'POR QUÉ IMPORTA', 'color': 'oro',
             'texto': 'Grapple y Poach no son daño: son colocación. Sacan al enemigo de encima de tu sanador '
                      'y lo ponen donde el grupo ya está pegando. Bien usados valen más que cualquier golpe.'},
        ],
    },
    {
        'tipo': 'destacado', 'archivo': 't3-grupo.png', 'alto': 660, 'color': 'azul',
        'titulo': 'LO QUE APORTAS AL GRUPO',
        'subtitulo': 'La habilidad que convierte al Templar en el pilar de una party.',
        'habilidad': 'Comrade in Arms',
        'titular': 'COMES LA MITAD DEL DAÑO DE TUS COMPAÑEROS',
        'lineas': [
            'Durante 6 s, cada golpe que reciba un compañero a menos de 40 m se reparte:',
            'la mitad la recibe él, la otra mitad la recibes tú.',
            'Además te sube un 20% el aguante en PvE y un 10% en PvP.',
            'Recarga 120 s.',
        ],
        'bandas': [
            {'etiqueta': 'CUÁNDO', 'color': 'azul', 'fondo': (30, 40, 48),
             'texto': 'En el momento en que el grupo va a comer daño sí o sí: la explosión del jefe, '
                      'la entrada a una pelea grande. No lo tires al principio por costumbre.'},
            {'etiqueta': 'OJO', 'color': 'rojo', 'fondo': (58, 38, 38),
             'texto': 'Estás absorbiendo daño de todos. Si tu sanador no lo sabe, te mueres tú. Avisa antes de usarlo.'},
        ],
    },
    {
        'tipo': 'stigmas', 'archivo': 't4-stigmas.png', 'alto': 700,
        'titulo': 'LAS MEJORAS QUE CAMBIAN LA CLASE',
        'subtitulo': 'Cinco por habilidad. En Mastery salen a nivel 8, 12 y 16 y solo caben TRES; en Stigma salen a 5, 10, 15, 20 y 25 y te quedas con todas.',
        'bandas_arriba': [
            {'etiqueta': 'EL PATRÓN', 'color': 'oro',
             'texto': 'En el Templar las mejoras que más cambian la clase hacen dos cosas: quitarle la recarga al castigo, '
                      'y convertir su defensa en ataque.'},
        ],
        'grupos': [
            {'etiqueta': 'PARA CASTIGAR SIN PARAR', 'color': 'verde', 'items': [
                ('Judgment', 16, 'Le quita la recarga entera'),
                ('Doom Shield', 5, 'Resetea la recarga de Annihilate'),
                ('Shield Smite', 12, '−2 s de recarga'),
                ('Poach', 8, 'Se resetea al matar a alguien'),
                ('Shield Smite', 8, 'Sin coste de maná y +200 al golpear'),
                ('Vicious Strike', 12, '−1 s a Warding Strike al golpear'),
            ]},
            {'etiqueta': 'PARA CONVERTIR DEFENSA EN DAÑO', 'color': 'azul', 'items': [
                ('Battlefield Banner', 15, '+20% al ataque que sale de tu defensa'),
                ('Battlefield Banner', 20, '−30 s de recarga'),
                ('Grapple', 10, '20% de tu vida como escudo'),
            ]},
        ],
    },
])
