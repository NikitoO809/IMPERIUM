-- Buscador global de IMPERIUM.
-- Función que busca EN VIVO en guías (+ pasos), secciones (+ bloques) y héroes.
-- Como consulta las tablas directamente, el contenido nuevo aparece solo (sin reindexar).
-- SECURITY INVOKER: se ejecuta como el usuario que llama, así la RLS decide qué ve
-- (el público solo lo publicado; el admin también los borradores).

-- Extensiones: buscar sin acentos (unaccent) y tolerar erratas (pg_trgm).
create extension if not exists unaccent with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create or replace function public.search_content(q text, max_results int default 24)
returns table (
  kind        text,
  game_slug   text,
  game_name   text,
  url         text,
  title       text,
  subtitle    text,
  snippet     text,
  cover_image text,
  rank        real
)
language sql
stable
security invoker
set search_path = public, extensions, pg_temp
as $$
  with input as (
    select
      extensions.unaccent(lower(nullif(trim(q), ''))) as norm,
      websearch_to_tsquery('spanish', extensions.unaccent(coalesce(nullif(trim(q), ''), ''))) as tsq
  ),
  docs as (
    -- ── GUÍAS: documento = título + descripción + intro + TODOS sus pasos ──
    select
      'guia'::text as kind,
      gm.slug      as game_slug,
      gm.name      as game_name,
      '/juegos/' || gm.slug || '/guias/' || gd.slug as url,
      gd.title     as title,
      gm.name      as subtitle,
      gd.intro_images[1] as cover_image,
      coalesce(gd.description, gd.intro, '') as descr,
      gd.title || ' ' || coalesce(gd.description, '') || ' ' || coalesce(gd.intro, '') || ' ' ||
        coalesce(string_agg(coalesce(gs.title, '') || ' ' || coalesce(gs.content, ''), ' '), '') as doc
    from guides gd
    join games gm on gm.id = gd.game_id
    left join guide_steps gs on gs.guide_id = gd.id
    group by gd.id, gm.slug, gm.name

    union all
    -- ── SECCIONES: documento = título/label + descripción + intro + sus bloques ──
    select
      'seccion'::text,
      gm.slug,
      gm.name,
      '/juegos/' || gm.slug || '/' || sec.slug,
      coalesce(nullif(sec.label, ''), sec.title) as title,
      gm.name,
      nullif(sec.cover_image, ''),
      coalesce(sec.description, sec.intro, '') as descr,
      coalesce(sec.title, '') || ' ' || coalesce(sec.label, '') || ' ' ||
        coalesce(sec.description, '') || ' ' || coalesce(sec.intro, '') || ' ' ||
        coalesce(string_agg(coalesce(sb.title, '') || ' ' || coalesce(sb.content, ''), ' '), '') as doc
    from game_sections sec
    join games gm on gm.id = sec.game_id
    left join section_blocks sb on sb.section_id = sec.id
    where sec.slug not in ('heroes', 'guias')
    group by sec.id, gm.slug, gm.name

    union all
    -- ── HÉROES ──
    select
      'heroe'::text,
      gm.slug,
      gm.name,
      '/juegos/' || gm.slug || '/heroes/' || h.slug,
      h.name,
      case when coalesce(h.tier, '') <> '' then gm.name || ' · Tier ' || h.tier else gm.name end,
      nullif(h.image_url, ''),
      coalesce(nullif(h.description, ''), h.specialty, '') as descr,
      h.name || ' ' || coalesce(h.faction, '') || ' ' || coalesce(h.hero_class, '') || ' ' ||
        coalesce(h.role, '') || ' ' || coalesce(h.specialty, '') || ' ' || coalesce(h.description, '')
    from heroes h
    join games gm on gm.id = h.game_id
    where h.is_published = true
  )
  select
    d.kind, d.game_slug, d.game_name, d.url, d.title, d.subtitle,
    left(regexp_replace(nullif(d.descr, ''), '\s+', ' ', 'g'), 180) as snippet,
    d.cover_image,
    (
      ts_rank(to_tsvector('spanish', extensions.unaccent(d.doc)), i.tsq)
      + case when extensions.unaccent(lower(d.title)) like '%' || i.norm || '%' then 1.0 else 0 end
      + extensions.similarity(extensions.unaccent(lower(d.title)), i.norm) * 0.4
    )::real as rank
  from docs d, input i
  where i.norm is not null
    and (
      to_tsvector('spanish', extensions.unaccent(d.doc)) @@ i.tsq
      or extensions.unaccent(lower(d.title)) like '%' || i.norm || '%'
      or extensions.similarity(extensions.unaccent(lower(d.title)), i.norm) > 0.3
    )
  order by rank desc, d.title
  limit greatest(1, least(max_results, 50));
$$;

grant execute on function public.search_content(text, int) to anon, authenticated;

comment on function public.search_content(text, int) is
  'Buscador global de IMPERIUM: busca en vivo en guías (+pasos), secciones (+bloques) y héroes. SECURITY INVOKER → respeta RLS.';
