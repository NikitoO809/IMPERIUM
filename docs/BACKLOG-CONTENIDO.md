# Backlog de contenido — IMPERIUM

Qué hay montado y qué falta, por juego y sección. **Documento vivo**: la foto real
sale de la auditoría — re-genérala y actualiza esta tabla tras cada montaje.

> Cómo refrescar: ejecuta `supabase/audit/content_health.sql` (vía MCP
> `mcp__supabase__execute_sql`) y las consultas de inventario de abajo.

Última actualización: **2026-06-14**.

Estados: `vacío` · `borrador` (no publicado) · `pub-sin-verificar` (publicado,
`is_verified=false`) · `verificado`.

---

## Call of Dragons  (`call-of-dragons`) — publicado

### Guías (`guides` / `guide_steps`)
| Guía | Pasos | Estado | Notas |
|---|---|---|---|
| guia-principiantes | 21 | pub-sin-verificar | — |
| cuenta-de-farmeo | 11 | pub-sin-verificar | — |
| free-to-play | 6 | pub-sin-verificar | publicada 2026-06-14 |

### Secciones (`game_sections` / `section_blocks`)
| Sección | Bloques | Estado | Pendiente |
|---|---|---|---|
| artefactos | 62 | pub-sin-verificar | ✅ portada + `meta.tier` explícito |
| heroes | 65 | pub-sin-verificar | usa galería propia (`HeroCards`) |
| behemoths | 9 | pub-sin-verificar | falta `intro_images[0]` en la sección (cabecera de página) |
| facciones | 7 | pub-sin-verificar | falta `intro_images[0]`; `order_index` en base 0 (huecos) |
| **war-pets** | 0 | **vacío** | montar |
| **codigos** | 0 | **vacío** | montar |
| **eventos** | 0 | **vacío** | montar |
| **herramientas** | 0 | **vacío** | montar |

> El card del Hub de cada sección sale de `SECTION_COVERS` (ya cubierto). El aviso
> "sin portada" del auditor se refiere a la cabecera de la **página** de la sección
> (`game_sections.intro_images`), distinto del card.

---

## Sword x Staff  (`sword-x-staff`) — publicado pero VACÍO

| | | |
|---|---|---|
| Guías | 0 | vacío |
| Secciones | 0 | vacío |

**Decisión de Miguel (2026-06-14): dejarlo como está** por ahora (no despublicar ni
cargar). Deuda conocida: un visitante ve un juego sin contenido. Existe material
histórico en `scripts/` (scraper de eog.gg y SQL antiguo) si se decide llenarlo.

---

## Prioridad sugerida

1. ~~Decidir `free-to-play`~~ → **publicada el 2026-06-14**. ✅
2. **Completar secciones vacías de CoD** con el pipeline: `codigos` (rápido y útil),
   `eventos`, `war-pets`, `herramientas`.
3. **Pulir cabeceras**: poner `intro_images[0]` a las secciones `behemoths` y
   `facciones` (y normalizar el `order_index` de `facciones` a base 1).
4. **Verificación de contenido** (143 bloques + 32 pasos sin verificar): definir cómo
   marca Miguel lo revisado (`is_verified=true`). Hoy no hay flujo para ello.
5. **Sword x Staff**: revisitar la decisión cuando haya material para llenarlo.

---

## Consultas de inventario (solo lectura)

```sql
-- Resumen por juego
select g.slug as game, g.is_published as game_pub,
  (select count(*) from guides gu where gu.game_id=g.id) as guides_total,
  (select count(*) from guides gu where gu.game_id=g.id and gu.is_published) as guides_pub,
  (select count(*) from game_sections s where s.game_id=g.id) as sections_total
from games g order by g.slug;

-- Detalle por sección
select g.slug as game, gs.slug as section, gs.is_published as pub,
  coalesce(array_length(gs.intro_images,1),0) as intro_imgs,
  (select count(*) from section_blocks b where b.section_id=gs.id) as blocks,
  (select count(*) from section_blocks b where b.section_id=gs.id and b.is_verified) as verified
from game_sections gs join games g on g.id=gs.game_id
order by g.slug, gs.slug;
```
