-- Metadatos estructurados por bloque de sección.
-- Añade una "bolsa" jsonb para guardar datos estructurados por bloque sin
-- sobrecargar otras columnas (p. ej. el tier de cada artefacto). Aditivo y con
-- default: no afecta a las filas existentes ni a las políticas RLS.

alter table public.section_blocks
  add column if not exists meta jsonb not null default '{}'::jsonb;

-- Backfill: hacer EXPLÍCITO el tier de los artefactos de Call of Dragons.
-- Hasta ahora ArtifactosViewer deducía el tier por el rango de order_index; ahora
-- lo guardamos en meta.tier. Los rangos de abajo son los que el visor usa hoy
-- (los datos actuales son contiguos 1..62), así que el backfill reproduce
-- exactamente lo que ya se muestra.
do $migrate$
declare
  v_section uuid;
begin
  select s.id into v_section
  from public.game_sections s
       join public.games g on g.id = s.game_id
  where g.slug = 'call-of-dragons' and s.slug = 'artefactos';

  if v_section is not null then
    update public.section_blocks set meta = meta || '{"tier":"Legendary"}'::jsonb
      where section_id = v_section and order_index between 4 and 21;
    update public.section_blocks set meta = meta || '{"tier":"Epic"}'::jsonb
      where section_id = v_section and order_index between 22 and 36;
    update public.section_blocks set meta = meta || '{"tier":"Elite"}'::jsonb
      where section_id = v_section and order_index between 37 and 46;
    update public.section_blocks set meta = meta || '{"tier":"Advanced"}'::jsonb
      where section_id = v_section and order_index between 47 and 52;
  end if;
end
$migrate$;
