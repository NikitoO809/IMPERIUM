-- IMPERIUM · Auditoría de salud del contenido (SOLO LECTURA)
-- ---------------------------------------------------------------------------
-- Devuelve UNA FILA POR PROBLEMA detectado en el contenido montado, con su
-- severidad. Pensado para ejecutarse tras cada montaje (vía el MCP
-- mcp__supabase__execute_sql, o el editor SQL de Supabase). No modifica nada.
--
-- Severidades:
--   critico  -> rompe la página o el SQL; arreglar ya.
--   aviso    -> conviene arreglar (portada, trazabilidad, catálogo).
--   info     -> estado informativo (p. ej. contenido sin verificar).
--
-- Columnas: sev | chk (qué se comprueba) | game | loc (sección/guía) | detail
-- ---------------------------------------------------------------------------
with checks as (

  -- [CRÍTICO] Juego publicado pero sin nada dentro
  select 'critico' sev, 'juego publicado vacio' chk, g.slug game, '-' loc,
         'el juego esta publicado pero no tiene guias ni secciones' detail
  from games g
  where g.is_published
    and not exists (select 1 from guides gu where gu.game_id = g.id)
    and not exists (select 1 from game_sections s where s.game_id = g.id)

  union all
  -- [CRÍTICO] Sección sin bloques
  select 'critico', 'seccion sin bloques', g.slug, s.slug,
         'la seccion no tiene ningun bloque'
  from game_sections s join games g on g.id = s.game_id
  where not exists (select 1 from section_blocks b where b.section_id = s.id)

  union all
  -- [CRÍTICO] Guía sin pasos
  select 'critico', 'guia sin pasos', g.slug, gu.slug,
         'la guia no tiene ningun paso'
  from guides gu join games g on g.id = gu.game_id
  where not exists (select 1 from guide_steps st where st.guide_id = gu.id)

  union all
  -- [CRÍTICO] order_index duplicado dentro de una sección
  select 'critico', 'order_index duplicado (seccion)', g.slug, s.slug,
         'order_index repetido: ' || b.order_index
  from section_blocks b
       join game_sections s on s.id = b.section_id
       join games g on g.id = s.game_id
  group by g.slug, s.slug, b.section_id, b.order_index
  having count(*) > 1

  union all
  -- [CRÍTICO] order_index duplicado dentro de una guía
  select 'critico', 'order_index duplicado (guia)', g.slug, gu.slug,
         'order_index repetido: ' || st.order_index
  from guide_steps st
       join guides gu on gu.id = st.guide_id
       join games g on g.id = gu.game_id
  group by g.slug, gu.slug, st.guide_id, st.order_index
  having count(*) > 1

  union all
  -- [CRÍTICO] Bloque con prefijo mágico cuyo contenido no parece JSON
  select 'critico', 'tabla magica malformada', g.slug, s.slug,
         'bloque #' || b.order_index || ' (' || b.title || '): el contenido tras el prefijo no empieza por [ o {'
  from section_blocks b
       join game_sections s on s.id = b.section_id
       join games g on g.id = s.game_id
  where (b.content like '__TABLE__%'
         and left(regexp_replace(b.content, '^__TABLE__', ''), 1) not in ('[', '{'))
     or (b.content like '__ARTIFACT_TABLE__%'
         and left(regexp_replace(b.content, '^__ARTIFACT_TABLE__', ''), 1) not in ('[', '{'))

  union all
  -- [AVISO] Sección publicada sin portada (intro_images[0])
  select 'aviso', 'seccion sin portada', g.slug, s.slug,
         'sin intro_images[0] (card/cabecera sin imagen)'
  from game_sections s join games g on g.id = s.game_id
  where s.is_published and coalesce(array_length(s.intro_images, 1), 0) = 0

  union all
  -- [AVISO] Guía publicada sin portada
  select 'aviso', 'guia sin portada', g.slug, gu.slug,
         'sin intro_images[0] (card sin imagen)'
  from guides gu join games g on g.id = gu.game_id
  where gu.is_published and coalesce(array_length(gu.intro_images, 1), 0) = 0

  union all
  -- [AVISO] Bloque sin source_url (trazabilidad)
  select 'aviso', 'bloque sin source_url', g.slug, s.slug,
         'bloque #' || b.order_index || ' (' || b.title || ') sin source_url'
  from section_blocks b
       join game_sections s on s.id = b.section_id
       join games g on g.id = s.game_id
  where b.source_url is null or b.source_url = ''

  union all
  -- [AVISO] Paso sin source_url
  select 'aviso', 'paso sin source_url', g.slug, gu.slug,
         'paso #' || st.order_index || ' (' || st.title || ') sin source_url'
  from guide_steps st
       join guides gu on gu.id = st.guide_id
       join games g on g.id = gu.game_id
  where st.source_url is null or st.source_url = ''

  union all
  -- [AVISO] Bloque vacío (ni content ni imágenes)
  select 'aviso', 'bloque vacio', g.slug, s.slug,
         'bloque #' || b.order_index || ' (' || b.title || ') sin content ni imagenes'
  from section_blocks b
       join game_sections s on s.id = b.section_id
       join games g on g.id = s.game_id
  where coalesce(b.content, '') = '' and coalesce(array_length(b.images, 1), 0) = 0

  union all
  -- [AVISO] Sección con slug fuera del catálogo del Hub
  select 'aviso', 'seccion fuera de catalogo', g.slug, s.slug,
         'el slug no esta en el catalogo del Hub; no aparecera como panel'
  from game_sections s join games g on g.id = s.game_id
  where s.slug not in ('guias', 'heroes', 'facciones', 'war-pets', 'behemoths',
                       'artefactos', 'codigos', 'eventos', 'herramientas')

  union all
  -- [AVISO] order_index con huecos en una sección (no es 1..n contiguo)
  select 'aviso', 'order_index con huecos (seccion)', g.slug, s.slug,
         'min=' || min(b.order_index) || ' max=' || max(b.order_index) || ' n=' || count(*)
  from section_blocks b
       join game_sections s on s.id = b.section_id
       join games g on g.id = s.game_id
  group by g.slug, s.slug, b.section_id
  having min(b.order_index) <> 1 or max(b.order_index) <> count(*)

  union all
  -- [INFO] Resumen de contenido publicado sin verificar
  select 'info', 'contenido sin verificar', '(global)', '-',
         'bloques publicados sin verificar: ' ||
           (select count(*) from section_blocks b
              join game_sections s on s.id = b.section_id
            where s.is_published and not b.is_verified) ||
         ' | pasos publicados sin verificar: ' ||
           (select count(*) from guide_steps st
              join guides gu on gu.id = st.guide_id
            where gu.is_published and not st.is_verified)

)
select sev, chk, game, loc, detail
from checks
order by case sev when 'critico' then 1 when 'aviso' then 2 else 3 end, game, chk, loc;
