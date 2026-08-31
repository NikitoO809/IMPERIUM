# -*- coding: utf-8 -*-
"""Diagramas de la guia de Cleric."""
from guia_clase import generar

generar('cleric', [
    {
        'tipo': 'fila', 'archivo': 'c1-curas.png',
        'titulo': 'LAS CUATRO CURAS',
        'subtitulo': 'No es «pulsar curar»: cada una resuelve una situación distinta.',
        'grupos': [
            {'etiqueta': 'DE MÁS RÁPIDA A MÁS LARGA', 'color': 'verde', 'paso': 180, 'items': [
                ('Healing Light', '6s', 'cura al que peor\nesté del grupo'),
                ('Radiant Recovery', '12s', 'cura a TODOS\ny quita 1 estado malo'),
                ('Light of Regeneration', '30s', 'goteo cada 2 s\ndurante 30 s, a todos'),
                ('Benevolence', '90s', 'goteo cada 2 s\ndurante 20 s · Stigma'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'CÓMO SE USAN', 'color': 'verde', 'fondo': (38, 46, 40),
             'texto': 'Light of Regeneration se lanza ANTES de que empiece el daño: son 30 segundos de goteo para '
                      'todo el grupo. Healing Light es el parche de urgencia. Radiant Recovery, cuando además hay '
                      'que limpiar un estado.'},
            {'etiqueta': 'EL ALCANCE MANDA', 'color': 'oro',
             'texto': 'Todas curan en 40 metros, que da bastante margen. Aun así, si el grupo se desparrama más '
                      'allá, tus curas de área dejan de llegar y no te vas a enterar hasta que alguien caiga.'},
        ],
    },
    {
        'tipo': 'fila', 'archivo': 'c2-marcas.png',
        'titulo': 'LO QUE NADIE ESPERA DE UN SANADOR',
        'subtitulo': 'El Cleric también debilita al enemigo, y eso vale para todo el grupo.',
        'grupos': [
            {'etiqueta': 'LAS DOS MARCAS', 'color': 'morado', 'paso': 200, 'items': [
                ('Debilitating Mark', '10s', 'le baja el daño que HACE\ny le mete daño continuo'),
                ('Chain of Torment', '20s', 'le baja el aguante:\nrecibe más de todos'),
            ]},
            {'etiqueta': 'Y CONTROL', 'color': 'azul', 'items': [
                ('Root', '60s', '75% de enraizar 10 s\n(100% en PNJ)'),
            ]},
        ],
        'bandas': [
            {'etiqueta': 'POR QUÉ IMPORTA', 'color': 'morado', 'fondo': (40, 32, 48),
             'texto': 'Debilitating Mark (10 s de recarga) baja lo que pega el enemigo, y Chain of Torment baja su '
                      'aguante, así que TODO el grupo le hace más daño. Mantenerlas puestas rinde más que una cura extra.'},
            {'etiqueta': 'UNA MEJORA QUE LO CAMBIA', 'color': 'oro',
             'texto': 'Debilitating Mark a nivel 8 deja de costar maná y encima te devuelve 150. '
                      'La marca pasa a ser gratis y a sostenerte el maná.'},
        ],
    },
    {
        'tipo': 'destacado', 'archivo': 'c3-aura.png', 'color': 'oro',
        'titulo': 'EL AURA QUE NO CADUCA',
        'subtitulo': 'La habilidad más rentable de la clase, y la que más gente olvida.',
        'habilidad': 'Noble Aura',
        'titular': 'CINCO MINUTOS PEGANDO POR TI',
        'lineas': [
            'Invoca un aura que te sigue y ataca a tu objetivo por su cuenta cada 2 segundos.',
            'Dura 300 segundos. Su recarga son 60.',
            'Es decir: bien mantenida, la tienes puesta SIEMPRE.',
        ],
        'bandas': [
            {'etiqueta': 'HAZLO SIEMPRE', 'color': 'oro',
             'texto': 'Relanzarla en cuanto se acabe es daño gratis durante toda la sesión. Un Cleric que la olvida '
                      'está renunciando a una parte enorme de su aportación sin darse cuenta.'},
            {'etiqueta': 'SU MEJOR MEJORA', 'color': 'verde', 'fondo': (38, 46, 40),
             'texto': 'A nivel 20 le quitas 1 segundo entre ataque y ataque: pasa de pegar cada 2 s a cada 1 s. '
                      'Le estás doblando el daño.'},
        ],
    },
    {
        'tipo': 'stigmas', 'archivo': 'c4-stigmas.png',
        'titulo': 'LAS MEJORAS QUE CAMBIAN LA CLASE',
        'subtitulo': 'Cinco por habilidad. En Mastery salen a nivel 8, 12 y 16 y solo caben TRES; en Stigma salen a 5, 10, 15, 20 y 25 y te quedas con todas.',
        'bandas_arriba': [
            {'etiqueta': 'DOS CAMINOS', 'color': 'oro',
             'texto': 'O curas más y más rápido, o aportas al grupo por la vía de debilitar al enemigo. '
                      'Ojo: en las Mastery (Healing Light, Radiant Recovery, Light of Regeneration, '
                      'Debilitating Mark, Chain of Torment) solo caben TRES mejoras de las cinco; en las '
                      'Stigma (Benevolence, Noble Aura) te quedas con todas las que desbloquees.'},
        ],
        'grupos': [
            {'etiqueta': 'PARA CURAR MEJOR', 'color': 'verde', 'items': [
                ('Healing Light', 16, '−2 s de recarga (6 → 4 s)'),
                ('Healing Light', 8, '+50% si está por debajo del 50%'),
                ('Radiant Recovery', 8, 'Quita 2 estados malos en vez de 1'),
                ('Radiant Recovery', 8, '−3 s de recarga'),
                ('Benevolence', 20, 'Limpia estados cada 5 s'),
                ('Light of Regeneration', 8, '+50% si está bajo de vida'),
            ]},
            {'etiqueta': 'PARA DEBILITAR AL ENEMIGO', 'color': 'morado', 'items': [
                ('Debilitating Mark', 8, 'Gratis y te devuelve 150 de maná'),
                ('Debilitating Mark', 8, '−15% a la defensa del enemigo'),
                ('Chain of Torment', 12, 'Le baja el doble el aguante'),
                ('Noble Aura', 20, 'Ataca cada 1 s en vez de cada 2'),
                ('Chain of Torment', 8, '20% de derribar'),
                ('Root', 15, '+25% de probabilidad de enraizar'),
            ]},
        ],
    },
])
