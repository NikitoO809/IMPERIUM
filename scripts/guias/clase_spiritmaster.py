# -*- coding: utf-8 -*-
"""Diagramas de la guia de Spiritmaster (en la base de datos aparece como Elementalist)."""
from guia_clase import generar

generar('elementalist', [
    {
        'tipo': 'fila', 'archivo': 'e1-espiritus.png',
        'titulo': 'LOS CUATRO ESPÍRITUS',
        'subtitulo': 'No hay uno mejor: cada uno resuelve un problema distinto. Elegir bien ES la clase.',
        'grupos': [
            {'etiqueta': 'INVOCACIÓN · 15 s DE RECARGA CADA UNO', 'color': 'oro', 'paso': 180, 'items': [
                ('Summon: Fire Spirit', 'DAÑO', 'pega en área · 15%\nsube ataque y defensa'),
                ('Summon: Water Spirit', 'MANÁ', '+20 de maná por golpe · 15%\nsube ataque y crítico'),
                ('Summon: Wind Spirit', 'VIDA', 'te cura 1,5% por golpe · 10%\nsube precisión y crítico'),
                ('Summon: Earth Spirit', 'TANQUE', '+3.750 de amenaza · 10%\nsube defensa y vida'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'CÓMO ELEGIR', 'color': 'oro',
             'texto': '¿Te quedas sin maná en peleas largas? Agua. ¿Te están matando? Viento, que te cura con cada '
                      'golpe. ¿Farmeando solo? Tierra, que aguanta por ti. ¿Solo quieres daño? Fuego.'},
            {'etiqueta': 'OJO', 'color': 'rojo', 'fondo': (58, 38, 38),
             'texto': 'Pelean solos a base de ataques normales, y sueltan su habilidad de vez en cuando: Fuego y '
                      'Agua un 15% de las veces, Viento y Tierra un 10%. No los pierdas de vista: si muere el '
                      'espíritu, pierdes la mitad de tu clase.'},
        ],
    },
    {
        'tipo': 'cadena', 'archivo': 'e2-conjunto.png',
        'titulo': 'LOS ATAQUES CONJUNTOS',
        'subtitulo': 'Tu espíritu y tú pegáis a la vez, y el enemigo queda marcado.',
        'paso1': {'etiqueta': 'PASO 1 · LO MARCAS', 'items': [
            ('Jointstrike: Corrode', '45s', 'Corrosión 20 s:\nrecibe +10% del espíritu'),
            ('Jointstrike: Curse', '10s', 'Maldición 5 s: a ti\nte hace un 10% menos'),
        ]},
        'transicion': 'el enemigo está marcado',
        'paso2': {'etiqueta': 'PASO 2 · EL ESPÍRITU LO CASTIGA', 'items': [
            ('Summon: Fire Spirit', 'DAÑO', 'pega más fuerte\nmientras dure Corrosión'),
            ('Jointstrike: Curse', '10s', 'lo mantienes\ncon 10 s de recarga'),
        ]},
        'carteles': [
            {'xy': (700, 184), 'texto': 'Corrode dura 20 segundos y hace que el enemigo reciba un 10% más '
                                        'de daño DEL ESPÍRITU. Con su mejora de nivel 25, también del tuyo.',
             'ancho': 300},
            {'xy': (700, 470), 'texto': 'Curse hace las dos cosas a la vez: le pone daño continuo y baja un 10% '
                                        'lo que te pega a ti. Ataque y defensa en el mismo botón.', 'ancho': 300},
        ],
    },
    {
        'tipo': 'destacado', 'archivo': 'e3-proxy.png', 'color': 'azul',
        'titulo': 'EL ESPÍRITU COMO ESCUDO',
        'subtitulo': 'La habilidad que separa a un Spiritmaster que sobrevive de uno que no.',
        'habilidad': 'Command: Proxy',
        'titular': 'TU ESPÍRITU SE COME LA MITAD DE TU DAÑO',
        'lineas': [
            'Durante 4 s, cada golpe que recibas se parte: la mitad la aguanta el espíritu.',
            'Además le sube un 20% el aguante en PvE y un 10% en PvP mientras dura.',
            'Recarga 60 s. Ojo: solo reparte si el espíritu está a menos de 25 m.',
        ],
        'bandas': [
            {'etiqueta': 'MERECE LA PENA MEJORARLA', 'color': 'azul', 'fondo': (30, 40, 48),
             'texto': 'Con su mejora de nivel 20 el espíritu se cura un 3% de vida por segundo mientras dura, '
                      'y con el de 25 se vuelve inmortal si baja del 50%. Deja de ser un sacrificio y pasa a ser un muro.'},
            {'etiqueta': 'Y ADEMÁS', 'color': 'oro',
             'texto': "Enhance: Spirit's Benediction os sube un 20% el daño y el aguante a los dos a la vez, "
                      'y os cura cada segundo durante 10 s. Es tu botón de pelea grande.'},
        ],
    },
    {
        'tipo': 'stigmas', 'archivo': 'e4-stigmas.png',
        'titulo': 'LAS MEJORAS QUE CAMBIAN LA CLASE',
        'subtitulo': 'Cinco por habilidad. En Mastery salen a nivel 8, 12 y 16 y solo caben TRES; en Stigma salen a 5, 10, 15, 20 y 25 y te quedas con todas.',
        'bandas_arriba': [
            {'etiqueta': 'EL PATRÓN', 'color': 'oro',
             'texto': 'Aquí no se trata de recargas: se trata de que el espíritu pegue más y aguante más. '
                      'Los cuatro espíritus son Mastery y comparten la misma mejora de nivel 16: +20% a sus '
                      'estadísticas. Command: Proxy y Jointstrike: Corrode son Stigma.'},
        ],
        'grupos': [
            {'etiqueta': 'PARA QUE EL ESPÍRITU RINDA', 'color': 'verde', 'items': [
                ('Summon: Fire Spirit', 16, '+20% a sus estadísticas'),
                ('Summon: Wind Spirit', 16, '+20% a sus estadísticas'),
                ('Summon: Water Spirit', 16, '+20% a sus estadísticas'),
                ('Summon: Fire Spirit', 8, '−50% de coste de maná'),
                ('Command: Proxy', 20, 'Le cura un 3% por segundo'),
                ('Command: Proxy', 25, 'Inmortal por debajo del 50%'),
            ]},
            {'etiqueta': 'PARA QUE LA MARCA DUELA MÁS', 'color': 'rojo', 'items': [
                ('Jointstrike: Corrode', 25, '+25% del daño que le haces TÚ'),
                ('Jointstrike: Corrode', 15, '−70% de curación recibida'),
                ('Jointstrike: Curse', 12, '−2 s de recarga'),
                ('Cry of Terror', 25, '−30 s de recarga'),
                ("Soul's Cry", 12, '−10 s de recarga'),
                ('Siphon', 15, '30% de tu vida como escudo'),
            ]},
        ],
    },
])
