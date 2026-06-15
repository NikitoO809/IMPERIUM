---
name: card-images
description: >-
  Revisa una a una todas las cards de la web (Hub de juego + lista de guías),
  detecta las que no tienen imagen, busca en la web imágenes temáticas y
  visualmente compatibles con el diseño HUD de IMPERIUM, presenta una tabla de
  propuestas y, con aprobación de Miguel, las guarda en Supabase y/o en el
  código. Úsala cuando Miguel diga "pon imágenes a las cards", "busca fotos
  para las cards", "rellena las imágenes", "las cards están sin foto", o
  cualquier variante de querer imágenes en las cards del Hub o de guías.
---

# Card Images — Asignar imágenes a las cards de IMPERIUM

Este agente detecta cards sin imagen, busca candidatas en la web y las guarda
con aprobación de Miguel. Miguel es principiante y no técnico; explica cada
paso en español claro.

## Paso 1 — Detectar cards sin imagen

### 1a. Secciones del Hub (SECTION_COVERS en el código)

Lee el archivo `src/app/(app)/juegos/[slug]/page.tsx` y localiza la constante
`SECTION_COVERS` (un `Record<gameSlug, Record<sectionSlug, imageUrl>>`).

Para cada juego, anota qué secciones del catálogo `GAME_SECTIONS` tienen una
URL de imagen y cuáles están vacías o directamente ausentes. Las secciones del
catálogo son: `guias`, `heroes`, `war-pets`, `behemoths`, `artefactos`,
`codigos`, `eventos`, `herramientas`.

Una sección "sin imagen" es aquella cuyo valor en `SECTION_COVERS` es `""`,
`undefined`, o cuyo juego/sección no aparece en el objeto.

### 1b. Cards de guías (intro_images en Supabase)

Ejecuta esta consulta via `mcp__supabase__execute_sql`:

```sql
SELECT g.slug AS game_slug, gd.slug AS guide_slug, gd.title,
       gd.intro_images
FROM guides gd
JOIN games g ON g.id = gd.game_id
WHERE gd.intro_images IS NULL
   OR array_length(gd.intro_images, 1) IS NULL
   OR gd.intro_images[1] IS NULL
   OR gd.intro_images[1] = ''
ORDER BY g.slug, gd.order_index;
```

Esto te da todas las guías sin imagen de portada.

### 1c. Resumir el diagnóstico

Muestra a Miguel un resumen compacto antes de buscar, algo así:

```
Cards sin imagen detectadas:
  Hub sections: 5 (juego X: codigos, eventos | juego Y: behemoths…)
  Guías: 8 (guía A, guía B…)
Total: 13 cards a cubrir
```

Confirma que quiere continuar con la búsqueda.

---

## Paso 2 — Buscar imágenes

Para cada card sin imagen, usa `WebSearch` para encontrar una imagen adecuada.

### Criterios de búsqueda

**Temática (obligatorio):**
- La imagen debe representar el contenido de esa sección o guía del juego
  específico (p. ej. para "artefactos de Call of Dragons" busca artefactos del
  juego, no artefactos genéricos de fantasía).
- Busca primero en fuentes oficiales/de calidad del juego:
  - `cdn.cod.guide` (Call of Dragons)
  - `wiki oficial del juego`
  - `eog.gg`
  - Wikis de fandom del juego
- Si no encuentras en fuentes del juego, amplía a Google Images con términos
  específicos del juego + sección.

**Visual HUD (preferencia):**
- Formato landscape (horizontal), oscuro o de alta saturación.
- Que funcione con el overlay violeta (`bg-brand/25 mix-blend-color`) y los
  scanlines encima; las imágenes muy claras o desaturadas quedan mal.
- Evita imágenes con mucho texto superpuesto (capturas de menú), prefiere
  arte o acción del juego.

### Búsquedas por tipo de card

**Hub section:** `"[nombre del juego]" "[nombre de sección]" screenshot gameplay site:[wiki/cdn del juego]`
Ejemplos:
- Artefactos CoD → `"Call of Dragons" artifacts legendary game`
- Eventos CoD → `"Call of Dragons" events special screenshot`
- War Pets CoD → `"Call of Dragons" pets dragons gameplay`

**Guía:** usa el título de la guía como query: `"[nombre del juego]" "[título de la guía]" guide screenshot`

### Verificar la URL

Antes de proponer una URL, verifica que:
1. La URL es directamente una imagen (termina en `.jpg`, `.png`, `.webp`, o
   devuelve Content-Type imagen).
2. El dominio ya está en `next.config.ts` `remotePatterns`, O anota que habrá
   que añadirlo.

Dominios ya permitidos: `eog.gg`, `www.allclash.com`, `cdn.cod.guide`.

Si la imagen está en un dominio nuevo, márcala con `⚠️ dominio nuevo` en la
tabla — habrá que añadirlo a `next.config.ts` y reiniciar el servidor.

---

## Paso 3 — Presentar tabla de propuestas

Cuando hayas encontrado candidatas para todas (o la mayoría) de las cards,
muestra la tabla completa a Miguel:

```
| # | Tipo    | Juego           | Card                  | URL propuesta                          | Dominio OK | Motivo                          |
|---|---------|-----------------|----------------------|----------------------------------------|------------|---------------------------------|
| 1 | Hub     | call-of-dragons | artefactos           | https://cdn.cod.guide/…/artifacts.jpg  | ✅          | Arte oficial de artefactos CoD  |
| 2 | Guía    | call-of-dragons | Guía de inicio rápido| https://eog.gg/…/quick-start.jpg       | ✅          | Imagen del paso intro de la guía|
| 3 | Hub     | sword-x-staff   | behemoths            | https://wiki.sxs.com/…/beast.png       | ⚠️ nuevo   | Arte oficial behemoths SxS      |
…
```

Después de la tabla:
- Indica cuántas son en dominio ya permitido (✅) y cuántas necesitan añadir
  el dominio a `next.config.ts` (⚠️).
- Pregunta: **"¿Apruebas todo, o hay alguna que quieras cambiar/saltar?"**

Espera la respuesta de Miguel antes de guardar nada.

---

## Paso 4 — Guardar las aprobadas

### 4a. Guías → Supabase

Para cada guía aprobada, ejecuta via `mcp__supabase__execute_sql`:

```sql
UPDATE guides
SET intro_images = ARRAY['<url>']
WHERE slug = '<guide_slug>'
  AND game_id = (SELECT id FROM games WHERE slug = '<game_slug>');
```

Si la guía ya tiene `intro_images` con más de una imagen, haz
`intro_images[1] = '<url>'` (reemplaza solo la primera, que es la de portada).

### 4b. Hub sections → código

Edita `src/app/(app)/juegos/[slug]/page.tsx` para añadir/actualizar las URLs
en `SECTION_COVERS`. Ejemplo de estructura que debes mantener:

```ts
const SECTION_COVERS: Record<string, Record<string, string>> = {
  'call-of-dragons': {
    'artefactos': 'https://cdn.cod.guide/…/artifacts.jpg',
    'behemoths': 'https://…',
    // …
  },
  'sword-x-staff': {
    'behemoths': 'https://…',
  },
};
```

Solo edita las entradas aprobadas; no toques las que ya tenían imagen.

### 4c. Dominios nuevos → next.config.ts

Si alguna imagen aprobada tiene dominio nuevo, añade su entrada a
`next.config.ts` en `images.remotePatterns`:

```ts
{ protocol: 'https', hostname: 'nuevo-dominio.com' },
```

Y avisa a Miguel: **"Hay que reiniciar el servidor dev (Ctrl+C y `npm run dev`)
para que las imágenes de [dominio] carguen."**

---

## Paso 5 — Verificar

Después de guardar:

1. Comprueba que el servidor dev está corriendo:
   `curl -s -o /dev/null -w '%{http_code}' http://localhost:3003/juegos`
   Si devuelve 200, está bien.

2. Si tocaste `next.config.ts`, avisa del reinicio (no puedes reiniciarlo tú,
   lo tiene que hacer Miguel con Ctrl+C + `npm run dev`).

3. Dile a Miguel qué URLs revisar:
   - Hub: `http://localhost:3003/juegos/<slug>`
   - Guía: `http://localhost:3003/juegos/<slug>/guias`

---

## Recordatorios

- **Nunca inventar imágenes de juegos**: si no encuentras nada relevante para
  una card, deja un hueco en la tabla con `— no encontré candidata` y pasa a
  la siguiente. No propongas una imagen genérica de fantasía como sustituto.
- **`object-cover` para cards del Hub y lista de guías** (card headers, imágenes
  de portada) — estas sí van en modo cover porque son fondos de la card.
- **Imágenes de los pasos dentro de guías** → `object-contain` (ver memoria
  `feedback-imagenes-display.md`).
- Respeta `next.config.ts`: solo añade dominios, no borres los existentes.
- El dev server usa `--webpack`, no Turbopack — no lo cambies.
- Si Miguel pide solo cubrir un juego o sección específica, limita el alcance
  a eso sin preguntar de nuevo.
