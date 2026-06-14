---
name: montar-guia
description: >-
  Scrapea una guía de juego desde una URL que Miguel envía y la monta en la web
  IMPERIUM con el diseño propio (HUD). Úsala SIEMPRE que Miguel pegue/mande un
  enlace (http/https) de una guía o de una sección de un juego — primero pregunta
  "¿La extraigo?" y, al confirmar, scrapea TODO (título, descripción, pasos,
  textos e imágenes) y lo monta en nuestros datos y componentes. Triggers:
  "te paso un link", "extrae esta guía", "scrapea esta página", "monta esta guía
  en la web", o cualquier mensaje que sea principalmente una URL de una guía.
---

# Montar guía (scrapear → montar en IMPERIUM)

Convierte una página web de una guía de juego en una guía nativa de IMPERIUM:
los **datos reales** de la fuente, pero con **nuestro diseño** (componentes HUD),
nunca con el diseño de la web de origen.

Miguel es principiante y no técnico. Explica cada paso en español sencillo y pide
permiso antes de cambios grandes. La UI es en español; el código va en español
(comentarios) con identificadores en inglés.

## Decisiones ya tomadas por Miguel (no volver a preguntar salvo que lo pida)
- **Imágenes:** enlazadas desde la web de origen (NO se descargan). Solo se
  guarda la URL original de cada imagen.
- **Idioma:** traducir el contenido al español (la web y la comunidad son en
  español), manteniendo los nombres propios y términos del juego en su forma
  original (reinos, clases, sistemas, estadísticas).

## IMPORTANTE: la web lee de Supabase, NO del archivo local
`.env.local` tiene las claves de Supabase puestas, así que `SUPABASE_CONFIGURED`
es `true` y las páginas leen de la **base de datos** (tablas `games` → `guides`
→ `guide_steps`). El archivo `demo-data.ts` es solo un plan B para cuando NO hay
Supabase; lo que metas ahí NO se ve en la web mientras Supabase esté conectado.
Por tanto, **el destino real del montaje es Supabase** (vía el MCP
`mcp__supabase__*`). Miguel es **admin** (`miguelcarmona`), así que las páginas
le muestran también lo no publicado. Pregunta cada vez si publicar ya
(`is_published = true`, lo ve toda la comunidad) o dejar en borrador
(`is_published = false`, solo lo ve él para revisar). En cualquier caso los pasos
van con `is_verified = false`.

## Flujo (paso a paso)

### 1. Confirmar
Cuando Miguel mande un enlace, **pregúntale primero**:
"¿Quieres que extraiga esto y lo monte en la web?" — espera su sí.
Si en el mismo mensaje ya dijo "sí/extráela/móntala", salta la pregunta.

Aclara (en una sola pregunta corta) a qué **juego** y a qué **sección** del Hub
corresponde. Las secciones del Hub (catálogo en `GAME_SECTIONS`, `demo-data.ts`):
`guias`, `heroes`, `war-pets`, `behemoths`, `artefactos`, `codigos`, `eventos`,
`herramientas`. Según la sección, el montaje es distinto:
- **`guias`** → guía interactiva con pasos marcables → sigue los pasos 3 y 5 (modelo
  `guides`/`guide_steps`).
- **Cualquier otra sección** (`eventos`, `codigos`, `war-pets`, …) → página de
  contenido genérica → ve al paso **3b** (modelo `game_sections`/`section_blocks`).
- **`heroes`** tiene una tier list propia con filtros (`HeroCards`); no se monta con
  este sistema salvo que Miguel pida lo contrario.

### 2. Scrapear (usa la skill `web-scraping`)
Apóyate en la skill **web-scraping** (Python). Elige la herramienta según la web:
- Web estática (HTML normal): `requests` + `BeautifulSoup`.
- Web con contenido cargado por JavaScript: `Playwright` (o Selenium).

Comprueba que Python esté instalado (`python --version`). Si no lo está, avisa a
Miguel y guíalo para instalarlo antes de continuar.

**Python en el PC de Miguel (Windows):** Python 3.12 ya está instalado y en el
PATH de usuario, así que normalmente basta con `python`. Si una sesión de terminal
no lo encuentra (PATH no recargado), usa la ruta completa:
`C:\Users\Miguel\AppData\Local\Programs\Python\Python312\python.exe`.
Ya están instaladas: `requests`, `beautifulsoup4`, `lxml`. Para webs con
JavaScript, instala Playwright la primera vez que haga falta:
`python -m pip install playwright` y `python -m playwright install chromium`.

Buenas prácticas obligatorias: respeta `robots.txt`, usa un user-agent normal,
mete una pequeña pausa entre peticiones, no satures el servidor.

**Extrae siempre:**
- `title` — título de la guía.
- `description` — entradilla/resumen (si hay).
- Lista de **pasos/secciones** en orden; por cada uno: `title`, `content` (texto
  limpio, sin HTML de relleno) y las **URLs de imágenes** que aparezcan en él.
- La **URL de origen** → va en `sourceUrl` de cada paso.

Guarda el texto extraído limpio (sin menús, anuncios, ni "cookies"). No inventes
nada: si un dato no está en la página, déjalo vacío. (Regla del proyecto: nunca
inventar datos de Call of Dragons.)

**Respeta la ESTRUCTURA REAL de la página (importante).** Las secciones/pasos
deben corresponder 1:1 con las secciones reales de la guía de origen, con sus
**títulos reales** — no inventes una sección "Introducción" ni fusiones bloques.
- Identifica el contenedor de cada sección y su título (en eog.gg: cada paso es un
  `div.sxs-section` con `.sxs-section__title`; el bloque introductorio inicial es
  `.sxs-context` (con su propio título) + `.sxs-intro`).
- El **bloque introductorio** (el que tiene título propio antes de las secciones)
  va como **intro de la guía** (campos `intro_title` / `intro` / `intro_images` en
  la tabla `guides`), NO como un paso.
- Captura también los **sub-bloques** (diagramas, tablas) con sus etiquetas: p. ej.
  un triángulo de stats → "Critical (150%): …"; filas de detalle → "• Tier 1 — …".
- Para guías de eog.gg de Sword x Staff, el scraper fiel ya está en
  `scripts/scrape_sxs.py` (úsalo de referencia para otras webs).

### 3. Montar en Supabase (destino real) — usa el PIPELINE
No escribas SQL a mano. Usa el pipeline (ver `scripts/README.md` y la fuente única
de verdad `docs/CONTENIDO-CONTRATO.md`): escribe un **JSON canónico** en
`scripts/data/`, valídalo y genera el SQL:

```
python scripts/lib/validate.py  scripts/data/<archivo>.json            # corrige ERRORES (los avisos son recomendables)
python scripts/lib/build_sql.py scripts/data/<archivo>.json > scripts/sql/<archivo>.sql
```

`build_sql.py` produce UN bloque `do $IMPERIUM$ … end $IMPERIUM$;` **idempotente**
(borra por slug y reinserta, no duplica), con dollar-quoting único y validado,
`is_verified=false` y `order_index` 1,2,3… Ejecútalo con el MCP
`mcp__supabase__execute_sql`. Si el SQL es grande, **delega la ejecución a un
subagente** (que lea el .sql y lo ejecute) para no inflar el contexto. El JSON
canónico lleva `kind: "guide"` (→ `guides`/`guide_steps`) o `kind: "section"`
(→ `game_sections`/`section_blocks`); el mismo generador sirve para cualquier juego.

Columnas reales (ya existen todas, incluida `images text[]`):
- `games`: slug, name, description, is_published, cover_image.
- `guides`: game_id, slug, title, description, order_index, is_published.
- `guide_steps`: guide_id, order_index, title, content, source_url, is_verified, images.

Reglas al montar:
- `slug`: kebab-case (único). Reaprovecha el slug de la fuente si es limpio.
- `order_index`: 1, 2, 3… en el orden de la guía original (guías y pasos).
- `source_url`: la URL de la página de origen, en CADA paso.
- `is_verified = false` **siempre** al scrapear (no lo marques tú).
- `is_published`: según lo que diga Miguel (publicar ya / borrador).
- Añade los metadatos visuales del juego nuevo en `PRESENTATION` (`games.ts`): tag
  y rank, p. ej. `"sword-x-staff": { tag: "RPG / Gacha", rank: "S" }`.
- (Opcional) deja también una copia en `demo-data.ts` como respaldo/legibilidad,
  pero recuerda que eso NO es lo que se ve en la web.

### 3b. Montar una SECCIÓN de contenido (eventos, codigos, war-pets, …)
Para cualquier sección que NO sea `guias`/`heroes`. Es una **página de contenido
genérica** (intro + bloques de texto e imágenes), sin progreso marcable. Sistema
implementado el 2026-06-13:
- **Tablas** (Supabase): `game_sections` (una fila por juego+sección) y
  `section_blocks` (los bloques). Columnas:
  - `game_sections`: game_id, slug (= slug de la sección del Hub), title,
    intro_title, intro, intro_images (text[]), is_published.
  - `section_blocks`: section_id, order_index, title, content, source_url,
    is_verified, images (text[]).
- **Render**: `src/lib/sections.ts` (`getSectionContent`, `getReadySections`),
  `src/components/SectionContent.tsx`, y la ruta dinámica
  `src/app/(app)/juegos/[slug]/[seccion]/page.tsx` (si hay contenido lo muestra;
  si no, `SectionPlaceholder`). El Hub marca "Listo" por juego vía `getReadySections`.
- **Cómo montar**: igual que el paso 3, pero con `kind: "section"` en el JSON
  canónico (→ `game_sections` + `section_blocks`). El `slug` DEBE ser uno del
  catálogo `GAME_SECTIONS` (facciones, war-pets, behemoths, artefactos, codigos,
  eventos, herramientas) para que aparezca en el Hub. El bloque introductorio va a
  `intro_title`/`intro`/`intro_images`; las secciones reales → `items`.
- **Metadatos por bloque** (`meta` jsonb): para datos estructurados. En `artefactos`,
  cada artefacto individual lleva `meta: {"tier": "Legendary|Epic|Elite|Advanced"}`
  (el visor lo lee de ahí, ya no por posición). Ver el contrato para la convención
  de `order_index` de artefactos.
- Reglas iguales: `is_verified=false` siempre; `is_published` según Miguel;
  `source_url` en cada bloque; no inventar; traducir manteniendo nombres del juego.
- Si reemplazas una sección ya cargada, primero borra sus `section_blocks` y su fila
  `game_sections` (o usa `unique(game_id, slug)` para detectar duplicados).

### 4. Imágenes (enlazadas desde el origen) — YA IMPLEMENTADO
El soporte de imágenes ya está hecho en el código (hecho el 2026-06-13):
- `Step.images: string[]` (en `games.ts`) y `DemoStep.images?` (en `demo-data.ts`),
  propagado en `mapStep`, `demoTree` y `GAME_TREE_SELECT`. Columna `images text[]`
  en `guide_steps`.
- `GuideRunner.tsx` renderiza `step.images` con `next/image` y estética HUD,
  partiendo además el `content` por `\n\n` en párrafos.
- `next.config.ts` permite `eog.gg` en `images.remotePatterns`. **Para un dominio
  nuevo, añádelo ahí y AVISA que hay que reiniciar el dev server** (los cambios de
  `next.config.ts` no se recargan en caliente). Si una web bloquea el hotlinking
  (imagen rota), ofrece descargarlas a `public/`.

### 5. Verificar (no hay tests)
Tras montar:
- **Auditoría**: ejecuta `supabase/audit/content_health.sql` (vía MCP
  `mcp__supabase__execute_sql`) y revisa que no haya nuevos problemas `critico`/`aviso`.
- El dev server suele estar corriendo (`npm run dev`, recuerda: usa `--webpack`,
  no lo quites; **puerto 3003**). Comprueba la ruta:
  `curl -s -o /dev/null -w '%{http_code}' http://localhost:3003/juegos/<juego>/<seccion-o-guias/slug>`
- Revisa el log del dev server por `Syntax Error` / `⨯`.
- Dile a Miguel la URL exacta para que la vea en el navegador.

### 6. Resumir a Miguel
Cuéntale qué montaste: juego, guía, nº de pasos, si traía imágenes, y recuérdale
que está **sin verificar** hasta que él lo revise. Indícale el enlace local.

## Recordatorios del proyecto
- Fuente única de verdad de campos/formatos: `docs/CONTENIDO-CONTRATO.md`. Estado y
  pendientes: `docs/BACKLOG-CONTENIDO.md`.
- ¿Juego nuevo? Sigue el checklist "añadir un juego nuevo" de `scripts/README.md`
  (fila en `games`, `PRESENTATION` en `games.ts`, `SECTION_COVERS` e iconos en el Hub).
- No publiques contenido sin verificar; respeta `isVerified`.
- Diseño "Neón HUD": reutiliza primitivos de `globals.css` y `hud.tsx`
  (`Panel`, `XpBar`, etc.). No reinventes estilos.
- En Next 16 `params` es Promise: `const { slug } = await params;`.
- Pide permiso antes de tocar `games.ts`, `GuideRunner.tsx` o `next.config`.
