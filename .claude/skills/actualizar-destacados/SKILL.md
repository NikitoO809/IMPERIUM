---
name: actualizar-destacados
description: >-
  Refresca la sección "MMORPG en el horizonte" de la home de IMPERIUM. Scrapea
  los MMORPG más esperados de mmorpg.com, los muestra en una MAQUETA HTML para
  que Miguel revise y elija los 12 destacados, y solo entonces genera el SQL para
  publicarlos. Úsala cuando Miguel diga "/actualizar-destacados", "actualiza los
  destacados", "refresca los juegos del horizonte", "trae los MMORPG nuevos" o
  cualquier variante de querer actualizar la sección de juegos esperados.
---

# Actualizar destacados (MMORPG en el horizonte)

Refresca la sección **"MMORPG en el horizonte"** de la home con los MMORPG más
esperados, sacados de **mmorpg.com**. Miguel **revisa una maqueta** y **elige los
12** antes de publicar nada. Es la versión asistida de la "Forma 2" (scraping
cuando Miguel quiere): el skill hace el trabajo pesado, Miguel solo revisa.

Miguel es principiante y no técnico. Explica cada paso en español sencillo. **No
publiques nada sin su aprobación explícita.** La UI es en español; código en
español (comentarios) con identificadores en inglés.

## Decisiones ya tomadas por Miguel (no volver a preguntar salvo que lo pida)
- **Fuente:** mmorpg.com (ranking de MMORPGs más esperados). Diseñado para poder
  añadir otras fuentes en el futuro sin rehacer el skill.
- **Solo MMORPGs** (y géneros afines: MMO de acción, ARPG). La sección se llama
  "MMORPG en el horizonte".
- **Solo juegos NO lanzados:** estado "En desarrollo", "Beta", "Alfha", "Por
  confirmar". Se descartan los "Lanzado/Released" (esos van al apartado de juegos
  jugables, no al horizonte).
- **Trae ~20 candidatos, Miguel elige 12.**
- **Revisión = maqueta HTML** (no una tabla). Miguel la abre en el navegador y
  marca los 12.
- **Imágenes enlazadas** desde mmorpg.com (no se descargan): se guarda la URL del
  logo (`images.mmorpg.com/...`).
- **Guardado:** el skill genera el SQL; Miguel lo pega en el panel de Supabase
  (la conexión por MCP/token NO tiene permiso de escritura — ver memoria
  `supabase-cuenta-y-carga-sql`). Una vez cargado, la sección es editable desde el
  panel de admin.

## Destino real: tabla `preregister_games`
La sección lee de la tabla **`preregister_games`** (ver `src/lib/preregister-games.ts`).
Columnas: `key, name, genre, status, hype, platforms (text[]), developer, publisher,
release_window, blurb, image, info_url, website, prereg_url, order_index`.
El componente que la pinta es `src/components/PreRegisterGames.tsx` (cards "glass"
+ modal). El array `FALLBACK_PREREGISTER` es solo plan B si la tabla está vacía.

## Flujo (paso a paso)

### 1. Confirmar
Pregunta: "¿Refresco los MMORPG más esperados desde mmorpg.com?" — espera el sí.
Si Miguel ya lo pidió claramente, salta la confirmación.

### 2. Scrapear mmorpg.com (con Firecrawl — NO requests)
`requests`/BeautifulSoup directos dan **403** (anti-bot). Usa el MCP de
**Firecrawl** (`mcp__firecrawl__firecrawl_scrape` con `formats:["json"]` y un
schema). mmorpg.com es server-side rendered.

- Página base: `https://www.mmorpg.com/games` → su ranking "Highest Hyped" (sidebar)
  da los más esperados, pero **mezcla juegos ya lanzados**.
- Saca name, genre, status, hype, `logoUrl` (de `images.mmorpg.com/images/games/logos/...`)
  e `infoUrl` (ficha en mmorpg.com).
- **Filtra:** quédate solo con los NO lanzados (descarta `status` = Released/Lanzado).
- Si hace falta más candidatos, repite el scrape con `actions` de scroll, o entra
  a las fichas individuales (`infoUrl`) para enriquecer **plataformas,
  desarrollador, editora y una frase (blurb)** — esos datos están en la ficha, no
  en el listado.
- Objetivo: **~20 candidatos no lanzados**, ordenados por `hype` desc.
- NO inventes datos: si un campo no está, déjalo vacío. Verifica que los logos
  cargan (URL real de mmorpg.com).
- Nota: el filtro exacto de "en desarrollo" por URL en mmorpg.com es inestable;
  apóyate en el ranking de hype + filtrado por estado, y enriquece por ficha.

### 3. Maqueta de revisión (el generador ya existe)
Escribe los candidatos a un JSON `scripts/data/destacados.json` con la forma:
```json
{ "games": [ { "name","genre","status","hype","developer","platforms":[],
              "blurb","image","infoUrl","website","preRegisterUrl" }, ... ] }
```
Genera la maqueta con el script ya hecho:
```
python scripts/lib/preview_destacados.py scripts/data/destacados.json
```
Produce `scripts/data/preview-destacados.html`. Ábrela en el navegador de Miguel:
```
powershell -c "Invoke-Item scripts/data/preview-destacados.html"
```
La maqueta imita el diseño "glass" real, tiene casillas para marcar y un contador
"X / 12". Miguel marca 12 y te dice los nombres (o usa "Copiar selección").

### 4. Selección de Miguel
Espera a que Miguel diga los 12 elegidos (o que confirme una propuesta tuya de los
12 con más hype). No sigas sin su selección.

### 5. Generar el SQL (NO ejecutarlo)
Con los 12 elegidos, genera UN bloque SQL idempotente para `preregister_games`:
- Borra los `preregister_games` actuales (o haz upsert por `key`) y reinserta los 12.
- `key`: kebab-case del nombre (estable y único).
- `order_index`: 1..12 en el orden de hype (o el que Miguel prefiera).
- Dollar-quoting con tag `$IMPERIUM$…$IMPERIUM$` para acentos/comillas (verifica
  que ningún texto contenga literalmente `$IMPERIUM$`).
- `image` = URL del logo de mmorpg.com. `info_url` = ficha. `website`/`prereg_url`
  solo si son oficiales y verificados.
Guarda el SQL en `scripts/sql/destacados.sql` y **muéstraselo / dáselo a Miguel
para que lo pegue en el panel de Supabase.** No lo ejecutes por MCP (no hay
permiso de escritura).

### 6. Imágenes: dominio permitido
Para que los logos se vean en la web (no solo en la maqueta), `images.mmorpg.com`
debe estar en `next.config.ts` → `images.remotePatterns`. Si no está, **avisa a
Miguel** de que hay que añadirlo y **reiniciar el dev server** (los cambios de
`next.config.ts` no se recargan en caliente). Pide permiso antes de tocar
`next.config.ts`.

### 7. Resumir a Miguel
Cuéntale: cuántos candidatos se trajeron, los 12 elegidos, dónde está el SQL y el
recordatorio de pegarlo en Supabase. Si faltó algún logo o dato, dilo.

## Ampliar a otras fuentes (futuro)
El skill está pensado para sumar fuentes (Steam próximos lanzamientos, etc.):
añade otro scrape en el paso 2, normaliza al mismo formato de `games[]` y el resto
del flujo (maqueta, selección, SQL) no cambia.

## Recordatorios del proyecto
- No subir nada sin el OK de Miguel; él revisa la maqueta primero.
- Mismo patrón que `montar-guia` y `card-images` (propone → aprueba → guarda).
- Carga de SQL: por el panel de Supabase del proyecto correcto (memoria
  `supabase-cuenta-y-carga-sql`), siempre revisando antes.
- Diseño: la maqueta usa el estilo "glass" (zinc + oro) de la home, NO el HUD neón
  de las guías.
