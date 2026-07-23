# Contrato de montaje de contenido — IMPERIUM

Fuente ÚNICA de verdad de cómo debe quedar el contenido en la base de datos para
que se vea bien. Si montas contenido (a mano o con el pipeline), respeta esto. La
skill `montar-guia` y `scripts/README.md` apuntan aquí.

Herramientas relacionadas:
- Generar SQL: `scripts/lib/build_sql.py` (consume el JSON canónico; ver `scripts/README.md`).
- Validar antes de montar: `scripts/lib/validate.py`.
- Auditar después de montar: `supabase/audit/content_health.sql`.

---

## Los dos modelos de contenido

| Tipo | Tablas | Cuándo | Render |
|---|---|---|---|
| **Guía interactiva** | `guides` → `guide_steps` | sección `guias` (pasos marcables con progreso) | `GuideRunner` |
| **Sección genérica** | `game_sections` → `section_blocks` | resto de secciones (artefactos, behemoths, eventos…) | según sección (ver abajo) |

`heroes` NO usa ninguno de estos: tiene su galería propia (`HeroCards`).

---

## Campos obligatorios y qué se rompe si faltan

### `guides`
| Campo | Obligatorio | Si falta… |
|---|---|---|
| `slug` | sí (kebab-case, único por juego) | no se puede enrutar |
| `title` | sí | — |
| `intro_images[0]` | recomendado | el card del catálogo sale sin portada |
| `intro_title` / `intro` | recomendado | sin entradilla |
| `is_published` | sí (decide Miguel) | `false` = oculto a la comunidad (solo admin) |
| `order_index` | sí (orden entre guías) | desorden en el listado |

### `guide_steps`
| Campo | Obligatorio | Si falta… |
|---|---|---|
| `title` | sí (NOT NULL) | error de inserción |
| `content` | sí | paso vacío |
| `order_index` | sí (1,2,3… contiguo) | pasos desordenados |
| `source_url` | sí (en CADA paso) | sin trazabilidad / fuente |
| `is_verified` | **siempre `false` al montar** | — |
| `images` | opcional (`text[]`) | sin imágenes |

### `game_sections`
| Campo | Obligatorio | Si falta… |
|---|---|---|
| `slug` | sí, y **del catálogo del Hub** | no aparece como panel |
| `title` | sí | — |
| `intro_images[0]` | recomendado | card/cabecera sin imagen |
| `is_published` | sí (decide Miguel) | `false` = oculto |

Catálogo de slugs válidos del Hub: `guias`, `heroes`, `facciones`, `war-pets`,
`behemoths`, `artefactos`, `codigos`, `eventos`, `herramientas`. Al añadir uno
nuevo hay que registrarlo también en `GAME_SECTIONS` (`src/lib/demo-data.ts`),
`SECTION_ICON` y `SECTION_COVERS` (`src/app/(app)/juegos/[slug]/page.tsx`).

### `section_blocks`
| Campo | Obligatorio | Si falta… |
|---|---|---|
| `title` | sí (NOT NULL) | error de inserción |
| `content` | sí (texto o prefijo mágico) | bloque vacío |
| `order_index` | sí (**1,2,3… contiguo, empieza en 1**) | el auditor lo marca; en artefactos rompe la clasificación |
| `source_url` | sí (en CADA bloque) | sin trazabilidad |
| `is_verified` | **siempre `false` al montar** | — |
| `images` | opcional (`text[]`) | — |
| `meta` | opcional (`jsonb`, def `{}`) | metadatos estructurados; ver artefactos |

---

## Reglas invariables

- `is_verified = false` SIEMPRE al montar (lo revisa Miguel después).
- `is_published`: lo decide Miguel cada vez (publicar / borrador).
- `source_url` en cada paso/bloque (de dónde salió el dato).
- **Nunca inventar** datos del juego: si no está en la fuente, se deja vacío.
- Traducir al **español**, manteniendo nombres propios del juego en su forma
  original (reinos, clases, sistemas, estadísticas, nombres de héroes/artefactos).
- Imágenes: solo se guarda la **URL de origen** (no se descargan). Dominio nuevo →
  añadir a `next.config.ts` `remotePatterns` y **reiniciar** el dev server.
- `order_index` arranca en **1** y es contiguo (1,2,3…). Hay datos antiguos en
  base 0 (p. ej. `facciones`); el auditor los marca como "huecos".

---

## Formatos especiales en `content`

`SectionContent.tsx` detecta prefijos mágicos; el resto del `content` debe ser
**JSON válido** (si no, la página muestra un error).

### `__TABLE__{json}` — tabla HUD genérica
```json
{ "headers": ["Col A", "Col B"], "rows": [ { "Col A": "…", "Col B": "…" } ] }
```

### `__ARTIFACT_TABLE__{json}` — tabla de artefactos (icono + retratos)
```json
[ { "name": "Ancient Tree Roots", "artifact_img": "https://…", "tier": "Legendary",
    "types": "Recolección | Salud", "hero_images": ["https://…"],
    "hero_label": "…", "range": "…", "attributes": "…" } ]
```

### `__SKILLS__{json}` — fichas con icono + nombre + explicación
Lo renderiza `IconList` (`src/components/IconList.tsx`), detectado desde `RichText`,
así que sirve tanto en `guide_steps.content` como en `section_blocks.content`.
Pensado para árboles de habilidades, cartas y mascotas: cada icono queda pegado al
texto que lo explica, en vez de amontonados al final del paso.

```json
[ { "name": "Sword Mastery", "img": "https://…", "tag": "Al máximo",
    "desc": "+30 de PATK permanente. PATK es tu ataque físico: …" } ]
```

- `img` y `tag` son opcionales; si no puedes confirmar el icono real de esa entrada,
  **omite `img`** antes que poner uno equivocado.
- El JSON debe ir en **una sola línea** (`RichText` separa bloques por líneas en blanco).
- Al convertir un paso a este formato, **vacía su `images`** si todos sus iconos
  pasaron a las fichas (si no, saldrían duplicados abajo).
- `desc` se escribe para gente nueva: mantén los números exactos de la fuente y
  aclara en lenguaje llano cada término técnico la primera vez que aparece.

---

## Metadatos por bloque: `meta` (jsonb)

Bolsa de datos estructurados por bloque, sin sobrecargar otras columnas. Hoy se
usa para el **tier de artefactos**:

```json
{ "tier": "Legendary" }   // valores: Legendary | Epic | Elite | Advanced
```

`ArtifactosViewer` lee `block.meta.tier` (antes lo deducía por el rango de
`order_index`, lo que se rompía al reordenar). Migración:
`supabase/migrations/20260614120000_section_blocks_meta.sql`.

---

## Qué visor usa cada sección

`src/app/(app)/juegos/[slug]/[seccion]/page.tsx` elige el render por slug:

| Sección | Visor | Notas |
|---|---|---|
| `artefactos` | `ArtifactosViewer` | 4 tabs; clasifica bloques por `order_index` (ver abajo); ancho `max-w-6xl` |
| `behemoths` | `BehemothsViewer` | parsea `## / ###` en `content`; ancho `max-w-5xl` |
| `render_type = 'classes'` | `ClasesViewer` | lista agrupada por rama con el icono de cada clase + panel de detalle; ancho `max-w-5xl` |
| `render_type = 'class-builds'` | `ClasesBuildViewer` | columna de clases + cuadro con pestañas arriba (un bloque = un apartado de una clase); ancho `max-w-5xl` |
| resto | `SectionContent` | genérico (intro + bloques, con prefijos mágicos) |

### `ClasesBuildViewer`: qué espera en `meta` (jsonb) de cada bloque
Un bloque = **un apartado de una clase** (no una clase entera): 14 clases × 10
apartados = 140 bloques. En `meta`: `class` (nombre por el que se agrupa y que sale
en la columna), `classIcon`, `classSlug`, `classOrder` y `stepOrder`. El orden de
las clases y de sus pestañas es el de `order_index` de los bloques, así que al
montar hay que insertarlos agrupados por clase y en orden.

### `ClasesViewer`: qué espera en `meta` (jsonb) de cada bloque
Un bloque = una clase. `images[0]` es su icono. En `meta`:
`branch` (rama por la que se agrupa la lista), `path` (recorrido de trabajos),
`role`, `stats` y `guide` (slug de su guía de build → pinta el botón "Ver guía de
build"). Sin `branch` la clase cae en un grupo "Otras"; el orden de las ramas es el
de aparición de los bloques por `order_index`.

### Convención de `order_index` en `artefactos` (IMPORTANTE)
`ArtifactosViewer` clasifica por posición; respétala al montar:
- **1** → bloque de descripción.
- **2** → tabla "Mejores Héroes" (`__ARTIFACT_TABLE__`).
- **3** → "Lista Completa" (texto intro de la rejilla).
- **4–52** → artefactos individuales (cada uno con `meta.tier`).
- **53+** → guías de artefactos.

El **tier** ya NO depende del rango: va en `meta.tier`. Pero la separación
descripción/héroes/lista/individuales/guías sí sigue la posición — si reordenas,
mantén estos tramos.
