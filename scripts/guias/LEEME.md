# Guías de Aion 2 para el foro de IMPERIUM

Todo lo necesario para crear, corregir y publicar guías en `『📌』foro-imp`.

## De dónde salen los datos

**aion2t.com**, que publica el volcado del cliente del juego con su fecha. Antes
se usaba questlog.gg y **se quedó en la versión coreana anterior al lanzamiento**:
el 2026-08-30 una captura de Miguel demostró que ponía mejoras en niveles que no
son (`Defiance` nv. 8 cuando el juego pide 16) y que se dejaba mejoras enteras.
Se comprobó contra tres capturas más del juego: aion2t acertó **15 de 15**.

`scripts/bajar-skills-aion2.mjs` (questlog) se deja solo como referencia
histórica. Lo que vale es `scripts/bajar-skills-aion2t.mjs`.

**Mastery y Stigma no funcionan igual**, y las guías tienen que distinguirlo:

| | Mastery | Stigma |
|---|---|---|
| Niveles de las mejoras | 8, 8, 8, 12, 16 | 5, 10, 15, 20, 25 |
| Nivel máximo | 40 | 25 |
| Cuántas valen | **tres**, eliges | **todas** las desbloqueadas |

El campo `arbol` de cada habilidad lo dice, y `eligeTres` lo resume.

## Cómo se hace una guía nueva

```bash
# 1. bajar los datos de la clase (si no están ya en scripts/data/)
node scripts/bajar-skills-aion2t.mjs Gladiator     # -> data/skills-t-gladiator.json
node scripts/comparar-fuentes.mjs gladiator        # qué cambió respecto a lo viejo
node scripts/impacto-publicado.mjs gladiator       # qué se cae de lo ya publicado

# 2. mirar los datos para encontrar la mecánica de la clase
node scripts/guias/analizar.mjs gladiator activas
node scripts/guias/patron.mjs             # el esqueleto común a las ocho
node scripts/guias/pve-pvp.mjs            # qué mejora sirve en cada modo
node scripts/guias/npc100.mjs             # las que no sirven en PvE

# 3. los iconos de esa clase
node scripts/guias/iconos-clase.mjs gladiator

# 4. generar los diagramas (desde la carpeta donde estén los iconos)
python scripts/guias/clase_gladiator.py

# 5. publicar
node scripts/publicar-guia.mjs scripts/guias/guion-gladiator.json <carpeta-imagenes>
```

## El reparto PvE/PvP de cada clase

Es el último mensaje de cada guía de clase, y se genera solo. Tres bloques:
las que **no sirven en PvE** (las de «+X% de probabilidad», porque contra un
PNJ el estado ya entra al 100%), las que **valen siempre** (suben daño o
aguante en los dos modos) y las **de PvP** (ignoran bloqueo y evasión, rompen
escudos o bajan la curación del rival).

```bash
node scripts/guias/listas_negras.mjs    # clasifica las mejoras -> listas-negras.json
python scripts/guias/guia_reparto.py    # los 8 diagramas (desde la carpeta de iconos)
node scripts/guias/textos-reparto.mjs   # el texto, y lo mete en cada guion
node scripts/actualizar-guia.mjs scripts/guias/guion-<clase>.json scripts/guias/imagenes
```

`textos-reparto.mjs` recorta solo lo que haga falta para caber en los 2000
caracteres de Discord: lo que no entra sigue estando en la imagen.

## Corregir una guía ya publicada

```bash
node scripts/actualizar-guia.mjs <guion.json> <carpeta>   # reescribe texto e imágenes
node scripts/anadir-a-guia.mjs "<título>" <anadidos.json> <carpeta>
```

`actualizar-guia.mjs` es idempotente: salta lo que ya está bien. Hace falta,
porque **Discord limita cuántos mensajes de más de una hora se editan seguidos**
(error 30046). Si falla, se relanza y sigue.

## Capturas del juego

Van a `capturas-aion2/` (fuera de git). Para marcarlas con círculos rojos,
flechas y leyenda numerada:

```bash
python scripts/guias/anotar_skill.py        # pantalla de habilidades
python scripts/guias/anotar_niveles.py <captura.jpg>
python scripts/guias/anotar_daevanion.py    # tablero Daevanion
```

## Reglas que no se saltan

1. **Nada inventado.** Los datos salen de `scripts/data/skills-<clase>.json`
   (base de datos del juego) o de las capturas. Lo que sea deducción propia se
   marca dentro de la imagen.
2. **Las webs de guías mienten.** Media docena se inventan las habilidades.
   Comprobar siempre contra la base de datos.
3. **Miguel juega en Taiwán**: ante una duda del sistema, preguntarle.
4. **La etiqueta `✅ Oficial` no la pone el bot.** Es de los oficiales.
5. **Si la base de datos no da una cifra**, sale un `?` y se dice. Hay tres
   mejoras del Templar cuyo valor questlog.gg deja sin resolver.
