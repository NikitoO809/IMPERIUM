# -*- coding: utf-8 -*-
"""Genera los diagramas de una guia de clase a partir de una especificacion.

Tipos de diagrama:
  cadena     dos filas: lo que aplica un estado y lo que lo castiga
  fila       grupos de habilidades en filas, con nota bajo cada una
  destacado  una habilidad grande con su titular y sus lineas
  stigmas    mejoras agrupadas, con su coste
"""
from guia_base import (cargar_iconos, f, icono, etiqueta, flecha, cartel, lienzo, cerrar, banda,
                       ROJO, ORO, VERDE, AZUL, MORADO, BLANCO, CAJA, TEXTO, GRIS)
from PIL import ImageDraw

COLORES = {'rojo': ROJO, 'oro': ORO, 'verde': VERDE, 'azul': AZUL, 'morado': MORADO, 'gris': GRIS}


def _col(c):
    return COLORES.get(c, c) if isinstance(c, str) else c


def _items(img, d, items, y, x0=44, paso=150, lado=88, color=ORO, borde=True):
    """Fila de habilidades con nombre, recarga y nota debajo. Devuelve el alto usado."""
    filas_nota = 0
    for i, it in enumerate(items):
        nombre, cd, nota = it[0], it[1], it[2]
        c = icono(img, nombre, (x0 + i * paso, y), lado, _col(color) if borde else None, 3)
        etiqueta(d, (c[0], y + lado + 8), nombre, BLANCO, 14, 'ma', True)
        etiqueta(d, (c[0], y + lado + 28), cd, _col(color), 13)
        for j, l in enumerate(nota.split('\n')):
            etiqueta(d, (c[0], y + lado + 48 + j * 16), l, GRIS, 12.5)
        filas_nota = max(filas_nota, len(nota.split('\n')))
    return lado + 48 + filas_nota * 16 + 8


def _cadena(spec):
    alto = spec.get('alto', 800)
    img, d = lienzo(spec['titulo'], spec['subtitulo'], 1240, alto)
    y = 150
    d.text((44, y), spec['paso1']['etiqueta'], font=f(15, True), fill=ORO)
    usado = _items(img, d, spec['paso1']['items'], y + 34, color='oro')
    y = y + 34 + usado + 10

    d.rounded_rectangle([44, y, 620, y + 52], radius=9, fill=(58, 38, 38))
    flecha(d, (78, y + 8), (78, y + 44), cabeza=14, grosor=5)
    d.text((100, y + 26), spec['transicion'], font=f(16, True), fill=ROJO, anchor='lm')
    y += 76

    d.text((44, y), spec['paso2']['etiqueta'], font=f(15, True), fill=ROJO)
    _items(img, d, spec['paso2']['items'], y + 34, color='rojo')

    for c in spec.get('carteles', []):
        cartel(d, (c['xy'][0], c['xy'][1]), c['texto'], c.get('ancho', 300), _col(c.get('color', 'rojo')))
    cerrar(img, d, spec['archivo'])


def _fila(spec):
    img, d = lienzo(spec['titulo'], spec['subtitulo'], 1240, spec.get('alto', 760))
    y = 150
    for g in spec['grupos']:
        d.text((44, y), g['etiqueta'], font=f(15, True), fill=_col(g.get('color', 'oro')))
        usado = _items(img, d, g['items'], y + 34, paso=g.get('paso', 150),
                       lado=g.get('lado', 88), color=g.get('color', 'oro'))
        y = y + 34 + usado + 18
    for b in spec.get('bandas', []):
        y += banda(img, d, y, b['etiqueta'], b['texto'], _col(b.get('color', 'oro')),
                   b.get('fondo', (46, 38, 30)), b.get('sangria', 210)) + 16
    cerrar(img, d, spec['archivo'])


def _destacado(spec):
    img, d = lienzo(spec['titulo'], spec['subtitulo'], 1240, spec.get('alto', 640))
    color = _col(spec.get('color', 'oro'))
    icono(img, spec['habilidad'], (60, 176), 132, color, 5)
    d.text((228, 186), spec['habilidad'], font=f(30, True), fill=BLANCO)
    d.text((228, 232), spec['titular'], font=f(21, True), fill=color)
    for i, l in enumerate(spec['lineas']):
        d.text((228, 272 + i * 26), l, font=f(16), fill=TEXTO if i == 0 else GRIS)
    # las bandas van debajo del icono O debajo de la última línea, lo que caiga
    # más abajo: con cuatro líneas, un alto fijo se comía la última
    y = max(176 + 132 + 60, 272 + len(spec['lineas']) * 26 + 18)
    for b in spec.get('bandas', []):
        y += banda(img, d, y, b['etiqueta'], b['texto'], _col(b.get('color', 'oro')),
                   b.get('fondo', (46, 38, 30)), b.get('sangria', 230)) + 16
    cerrar(img, d, spec['archivo'])


def _stigmas(spec):
    img, d = lienzo(spec['titulo'], spec['subtitulo'], 1240, spec.get('alto', 800))
    y = 150
    for b in spec.get('bandas_arriba', []):
        y += banda(img, d, y, b['etiqueta'], b['texto'], _col(b.get('color', 'oro')),
                   b.get('fondo', (46, 38, 30)), b.get('sangria', 200)) + 22
    for g in spec['grupos']:
        color = _col(g.get('color', 'verde'))
        d.text((44, y), g['etiqueta'], font=f(15, True), fill=color)
        y += 34
        for i, (nombre, coste, efecto) in enumerate(g['items']):
            x = 44 + (i % 3) * 390
            fila_y = y + (i // 3) * 116
            icono(img, nombre, (x, fila_y), 72, color, 3)
            etiqueta(d, (x + 86, fila_y + 4), nombre, BLANCO, 15, 'la', True)
            d.rounded_rectangle([x + 86, fila_y + 28, x + 142, fila_y + 50], radius=6, fill=color)
            d.text((x + 114, fila_y + 39), 'nv. %d' % coste, font=f(13, True), fill=(20, 24, 28), anchor='mm')
            etiqueta(d, (x + 152, fila_y + 32), efecto, TEXTO, 13, 'la')
        y += ((len(g['items']) + 2) // 3) * 116 + 12
    cerrar(img, d, spec['archivo'])


TIPOS = {'cadena': _cadena, 'fila': _fila, 'destacado': _destacado, 'stigmas': _stigmas}


def generar(clase, diagramas):
    cargar_iconos(clase)
    for spec in diagramas:
        TIPOS[spec['tipo']](spec)
