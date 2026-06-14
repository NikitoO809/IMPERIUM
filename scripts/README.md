# scripts/ — Pipeline de contenido de IMPERIUM

Aquí vive todo lo que convierte una guía/sección de una web externa en contenido
nativo de IMPERIUM (en Supabase, con nuestro diseño HUD).

La idea clave: **un esquema canónico** (un JSON con la misma forma para todo) + **un
generador genérico** (`lib/build_sql.py`). Antes había un script de SQL a medida por
cada fuente; ahora cualquier contenido pasa por el mismo camino.

## Estructura de carpetas

```
scripts/
  lib/        Pipeline reutilizable (NO tocar a la ligera):
                validate.py   valida el JSON canónico (errores/avisos)
                build_sql.py  JSON canónico -> bloque SQL idempotente
  scrapers/   Un scraper por sitio (eog.gg, cod.guide, allclash…). Cada web es
              distinta; lo que se estandariza es su SALIDA (JSON canónico en data/).
  data/       JSON intermedio (lo scrapeado y lo traducido). Es la "materia prima".
  sql/        SQL ya generado (.sql). Histórico / por si hay que re-ejecutar.
  archive/    Generadores antiguos a medida e inspectores de debug. Referencia
              histórica; superados por lib/build_sql.py. No usar para contenido nuevo.
```

La auditoría de salud del contenido vive en `supabase/audit/content_health.sql`.

## El esquema canónico

Un objeto JSON describe una guía o una sección completa. Lo documenta en detalle
`lib/validate.py`. Resumen:

```json
{
  "game": "call-of-dragons",
  "kind": "section",                 // "section" | "guide"
  "slug": "war-pets",
  "title": "War Pets",
  "intro_title": "…", "intro": "…", "intro_images": ["https://…"],
  "source_url": "https://…",
  "is_published": false,
  "items": [
    { "title": "…", "content": "…", "images": ["https://…"],
      "source_url": "https://…", "meta": { "tier": "Legendary" } }
  ]
}
```

- `kind: "section"` → tablas `game_sections` + `section_blocks` (contenido genérico).
- `kind: "guide"`  → tablas `guides` + `guide_steps` (guía con pasos marcables).
- `items` son los bloques (sección) o pasos (guía), **en orden**. `order_index` se
  genera solo (1, 2, 3…).
- `meta` guarda metadatos estructurados por item (p. ej. `{"tier": "Legendary"}` en
  artefactos). Solo se guarda en `section_blocks`.

### Formatos especiales en `content`
`SectionContent.tsx` detecta prefijos mágicos (el resto debe ser JSON válido):
- `__TABLE__{json}` — tabla HUD genérica `{headers, rows}`.
- `__ARTIFACT_TABLE__{json}` — tabla de artefactos con iconos + retratos.

Ver el contrato completo en `docs/CONTENIDO-CONTRATO.md`.

## Flujo: montar contenido nuevo (checklist "nueva fuente")

1. **Scrapear** → escribe un JSON canónico (en inglés) en `data/`. Usa/crea un
   scraper en `scrapers/`. Respeta la estructura REAL de la página (no inventar ni
   fusionar secciones). Imágenes: solo la URL de origen (no descargar).
2. **Traducir** ese mismo archivo de `data/` al español (nombres del juego en inglés).
   Ya no hay un script `*_es.py` aparte: se traduce el JSON canónico in situ.
3. **Validar**: `python scripts/lib/validate.py data/<archivo>.json`
   → corrige los **errores** (los avisos son recomendables).
4. **Generar SQL**: `python scripts/lib/build_sql.py data/<archivo>.json > sql/<archivo>.sql`
5. **Ejecutar** en Supabase (vía el MCP `mcp__supabase__execute_sql`, o el editor SQL).
   Es idempotente: re-ejecutar reemplaza, no duplica.
6. **Auditar**: ejecuta `supabase/audit/content_health.sql` y revisa que no haya
   nuevos problemas críticos.
7. **Verificar** en el navegador: `http://localhost:3003/juegos/<juego>/<seccion>`
   (recuerda: `npm run dev` usa `--webpack`).

Reglas invariables: `is_verified=false` siempre al montar; `is_published` según
decida Miguel; `source_url` en cada item; nunca inventar datos del juego.

## Checklist "añadir un juego nuevo"

El esquema canónico ya lleva `game`, así que el mismo generador sirve para cualquier
juego. Para que un juego nuevo aparezca bien en la web:

1. Fila en la tabla `games` (slug, name, description, is_published, cover_image).
2. Entrada en `PRESENTATION` (`src/lib/games.ts`) → `tag` y `rank` del juego.
3. Entrada en `SECTION_COVERS` (`src/app/(app)/juegos/[slug]/page.tsx`) → portada por
   sección del Hub.
4. Revisar `GAME_SECTIONS` (`src/lib/demo-data.ts`) si el juego usa secciones distintas.
5. Poblar guías/secciones con el pipeline de arriba (un JSON canónico por sección).

## Notas de entorno (Windows)

- Python 3.12 ya instalado: normalmente basta `python`. Si el PATH no lo encuentra:
  `C:\Users\Miguel\AppData\Local\Programs\Python\Python312\python.exe`.
- Librerías ya instaladas: `requests`, `beautifulsoup4`, `lxml`. Para webs con JS:
  `python -m pip install playwright && python -m playwright install chromium`.
- `build_sql.py` fuerza UTF-8 en su salida para que los acentos no se corrompan al
  redirigir a un `.sql`.
