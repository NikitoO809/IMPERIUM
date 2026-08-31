# -*- coding: utf-8 -*-
"""Corrige dos errores de las guias ya publicadas:

1. Los numeros de las mejoras no son un COSTE en puntos: son el NIVEL de la
   habilidad al que se desbloquea cada mejora.
2. Esas mejoras no se llaman "stigmas". En Aion 2 los Stigma son otra cosa:
   habilidades aparte, de las que se equipan 4 de 12.
"""
import glob
import io
import re

# nombres de fichero y claves internas que NO se tocan
PROTEGIDO = re.compile(r"'archivo':\s*'[^']*'|'tipo':\s*'stigmas'|-stigmas\.png")

REGLAS = [
    # el numero es un nivel, no un coste
    (r'stigma de \*\*(\d+) puntos\*\*', r'mejora de **nivel \1**'),
    (r'stigmas? de (\d+) puntos', r'mejora de nivel \1'),
    (r'por \*\*(\d+) puntos\*\*', r'a **nivel \1**'),
    (r'por (\d+) puntos', r'a nivel \1'),
    (r'\*\*(\d+) p\*\*', r'**nv. \1**'),
    (r'\((\d+) p\)', r'(nv. \1)'),
    (r'y con el de \*\*(\d+)\*\*', r'y con la de **nivel \1**'),

    # terminologia: mejora / especializacion, no stigma
    (r'LOS STIGMAS QUE CAMBIAN LA CLASE', 'LAS MEJORAS QUE CAMBIAN LA CLASE'),
    (r'SU MEJOR STIGMA', 'SU MEJOR MEJORA'),
    (r'Los stigmas, que es donde está tu build', 'Las mejoras de habilidad, que es donde está tu build'),
    (r'\*\*Su mejor stigma:\*\*', '**Su mejor mejora:**'),
    (r'\*\*Y hay un stigma que las hace gratis:\*\*', '**Y hay una mejora que las hace gratis:**'),
    (r'el stigma más bestia', 'la mejora más bestia'),
    (r'el mismo stigma de', 'la misma mejora de'),
    (r'un stigma de', 'una mejora de'),
    (r'su mejor stigma', 'su mejor mejora'),
    (r'[Cc]on stigma,', 'con su mejora,'),
    (r'sus [Ss]tigmas', 'sus mejoras'),
    (r'[Ss]tigmas buenos', 'mejores mejoras'),
    (r'los stigmas', 'las mejoras'),
    (r'Los stigmas', 'Las mejoras'),
    (r'tres de sus habilidades tienen el mismo stigma', 'tres de sus habilidades tienen la misma mejora'),

    # la frase de los puntos ya no aplica
    (r'Dos caminos, y los puntos no dan para los dos:',
     'Dos caminos. Ojo: de las cinco mejoras de cada habilidad solo puedes llevar **3 activas**.'),
    (r'Las ranuras no dan para todo: solo puedes llevar 3 de las 5 mejoras de cada habilidad\.',
     'De las cinco mejoras de cada habilidad solo puedes llevar tres activas a la vez.'),

    # tildes que se perdieron
    (r'se desbloquean segun el nivel', 'se desbloquean según el nivel'),
    (r'Aqui se decide', 'Aquí se decide'),
]


def corregir(texto):
    trozos, ultimo = [], 0
    for m in PROTEGIDO.finditer(texto):
        trozos.append((texto[ultimo:m.start()], True))
        trozos.append((m.group(0), False))
        ultimo = m.end()
    trozos.append((texto[ultimo:], True))

    salida = []
    for trozo, editable in trozos:
        if editable:
            for patron, reemplazo in REGLAS:
                trozo = re.sub(patron, reemplazo, trozo)
        salida.append(trozo)
    return ''.join(salida)


tocados = 0
for ruta in sorted(glob.glob('clase_*.py') + glob.glob('guion-*.json') + ['guia2.py']):
    original = io.open(ruta, encoding='utf-8').read()
    nuevo = corregir(original)
    if nuevo != original:
        io.open(ruta, 'w', encoding='utf-8').write(nuevo)
        print('corregido: ' + ruta)
        tocados += 1

print('')
print('%d ficheros corregidos' % tocados)
restos = []
for ruta in sorted(glob.glob('clase_*.py') + glob.glob('guion-*.json') + ['guia2.py']):
    for n, linea in enumerate(io.open(ruta, encoding='utf-8'), 1):
        if re.search(r'\d+ ?p(untos)?\b|stigma', linea, re.I) and not PROTEGIDO.search(linea):
            restos.append('%s:%d  %s' % (ruta, n, linea.strip()[:110]))
if restos:
    print('\nREVISAR A MANO:')
    for r in restos:
        print('  ' + r)
else:
    print('no quedan menciones sueltas')
