# Workflow de auto-montaje de contenido — especificación

Idea: dar la **fuente de un juego** y que un workflow **rastree a fondo** todo ese
juego, **descubra qué secciones tiene** (cada juego es distinto) y lo monte en
IMPERIUM con **nuestro diseño HUD**, con la mínima posibilidad de error.

> Cada juego es distinto: Call of Dragons tiene *héroes*; Sword x Staff no — tiene
> *compañeros*. Por eso las secciones NO pueden ser una lista fija: se descubren.

## Decisiones tomadas (Miguel, 2026-06-14)

| Tema | Decisión |
|---|---|
| **Entrada** | Un **enlace raíz** del juego; el workflow rastrea solo (sigue botones/enlaces). |
| **Secciones** | El workflow **detecta y propone**; Miguel **aprueba / renombra / quita** antes de montar. |
| **Publicación** | Monta en **borrador** (`is_published=false`, `is_verified=false`); Miguel revisa y publica. |
| **Fuentes** | Solo **webs conocidas** con adaptador propio (cod.guide, eog.gg, allclash). |
| **Formato** | **Inteligente por tipo**: tier-list/tablas → visores ricos; el resto → genérico. |
| **Arranque** | **Piloto con 1 juego** primero, luego generalizar. |
| **Piloto** | **Sword x Staff** (compañeros) desde **eog.gg** — prueba lo "dinámico" y llena el juego hoy vacío. |

## Cómo funciona (2 ejecuciones, con tu aprobación en medio)

```
FASE 1 — DESCUBRIR                         FASE 2 — MONTAR (tras tu OK)
enlace raíz                                lista de secciones aprobada
   │ rastrea (mismo dominio, acotado          │ por cada sección:
   │ al juego, profundidad limitada)          │   scrapea a fondo (todos los bloques/imgs)
   │ agrupa páginas en secciones              │   → JSON canónico → traduce (ES)
   ▼                                          │   → validate.py → build_sql.py
PROPUESTA de secciones:                       │   → execute_sql (BORRADOR)
  • slug + nombre sugerido                    ▼
  • tipo detectado (tier-list / tabla /    AUDITORÍA (content_health.sql)
    genérico)                                  │
  • URLs origen + muestra                      ▼
   │                                        Te aviso: qué montó, en qué URLs,
   ▼  →  TÚ apruebas/renombras/quitas       todo en borrador para tu revisión.
```

La pausa para tu aprobación es por qué son **dos ejecuciones**: la Fase 1 termina
mostrándote la propuesta; cuando confirmas, se lanza la Fase 2.

## Cambio de arquitectura: secciones dinámicas por juego

Hoy el Hub se arma desde una **lista fija** en código (`GAME_SECTIONS` + mapas
`SECTION_ICON`/`SECTION_COVERS` en `page.tsx`). Para que cada juego tenga SUS
secciones, el Hub debe armarse desde la **base de datos**.

- La tabla `game_sections` ya es por juego. Se le añaden columnas de presentación:
  `label`, `description`, `icon` (clave de icono), `cover_image`, `order_index`,
  `render_type` (`generic` | `tier-list` | `table`).
- El Hub (`[slug]/page.tsx`) lista las `game_sections` del juego y pinta un panel por
  fila (icono con fallback, portada, título, descripción), ordenadas por `order_index`.
- La página de sección (`[seccion]/page.tsx`) elige el visor por `render_type`, no por
  un `if seccion === 'artefactos'` fijo.
- `GAME_SECTIONS` (código) queda solo como **fallback** cuando no hay Supabase.

## Visores por tipo ("formato inteligente")

| `render_type` | Visor | Para |
|---|---|---|
| `generic` | `SectionContent` | texto + imágenes + tablas simples (la mayoría) |
| `tier-list` | visor de tier-list (genérico, basado en datos) | héroes, compañeros, war-pets… |
| `table` / `artifact-table` | visor tipo `ArtifactosViewer` | artefactos y similares |

El workflow detecta el tipo (p. ej. una rejilla con tiers → `tier-list`) y lo incluye
en la propuesta; tú lo confirmas. Los visores ricos actuales (`HeroCards`,
`ArtifactosViewer`) se **generalizan** para que funcionen con datos de cualquier juego.

## Guardarraíles (para acercarnos a "cero error")

- **Solo webs conocidas** con adaptador → parsing fiable.
- **Rastreo acotado**: mismo dominio, dentro del juego (a partir del enlace raíz),
  profundidad limitada, excluye páginas que no son de la guía. Nada de "internet entero".
- **Puerta de aprobación** (Fase 1 → tú) antes de tocar la web.
- **Solo borrador**: nunca publica solo; tú revisas.
- **Validación + auditoría** automáticas (`validate.py`, `content_health.sql`).
- **Idempotente**: re-ejecutar reemplaza, no duplica (pipeline ya lo garantiza).
- No inventar datos; traducir manteniendo nombres del juego; imágenes enlazadas.

## Piloto: Sword x Staff (eog.gg)

Caso ideal: tiene **compañeros** (no héroes) → prueba lo dinámico; y **llena el juego
que hoy está publicado vacío**. Ya hay material de referencia de un scrapeo previo
(`scripts/data/translated/*.json`, scraper `scripts/scrapers/scrape_sxs.py`).

## Plan de construcción (por fases)

1. **Secciones dinámicas (plumbing)**: columnas nuevas en `game_sections`; Hub y
   página de sección leen de la BD; `render_type` elige visor. (Sin romper CoD: se
   migran sus secciones actuales a filas con su icono/portada/tipo.)
2. **Visor `tier-list` genérico** (lo necesita SxS-compañeros); generalizar `ArtifactosViewer`.
3. **Workflow Fase 1 (descubrir)**: crawler acotado + agrupador + propuesta.
4. **Workflow Fase 2 (montar)**: scrape→canónico→traduce→valida→monta borrador→audita.
5. **Correr el piloto SxS**, revisar, ajustar. Luego generalizar a más juegos.

## A confirmar al construir
- Enlace raíz exacto de SxS en eog.gg.
- Mapa de iconos por palabra clave (p. ej. *compañeros*→PawIcon) con override en la aprobación.
