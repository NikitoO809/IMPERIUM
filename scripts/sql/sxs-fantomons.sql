do $IMPERIUM$
declare
  v_game uuid;
  v_section uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  -- Reemplazo idempotente: borra la sección y sus bloques, luego reinserta.
  delete from public.section_blocks where section_id in (
    select id from public.game_sections where game_id = v_game and slug = 'fantomons');
  delete from public.game_sections where game_id = v_game and slug = 'fantomons';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'fantomons', 'Fantomons', 'Tier list de lanzamiento', 'Sword x Staff se lanzó globalmente el 19 de mayo (Patch 1.0). Esta lista refleja la lectura de EOG en la semana de lanzamiento sobre los Fantomons de Verdantglade. Las estadísticas se desbloquean en los niveles 20, 50, 70 y 100 del Fantomon, así que el tier efectivo de un Fantomon cambia según lo subas de nivel. Úsala para preseleccionar y luego prueba contra tu propio cuello de botella.

Los Fantomons son los compañeros mascota que se desbloquean al nivel de cuenta 50, a través del árbol gigante en tu base de origen. Cada uno aporta estadísticas pasivas y se une a la línea de batalla activa. La mayoría de jugadores llevan cuatro Fantomons principales subidos de forma pareja en lugar de repartir los materiales por todo el roster: sube cada Fantomon a nivel 20 primero y luego maximiza los que de verdad usas.', array[]::text[], false,
     'Fantomons', 'Tier list de los Fantomons (compañeros mascota) de la semana de lanzamiento.', 'paw', 'https://eog.gg/assets/sxs/fantomons/aegiswing.webp', 'tier-list', 2)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Aegiswing', 'Set de rasgos orientado al daño. Elección común para cualquier equipo de Duelist o Sorcerer que busque techo de daño.', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/aegiswing.webp']::text[], '{"rol": "Attack — DPS principal", "tier": "Mythical"}'::jsonb),
    (v_section, 2, 'Nyxarchon', 'El otro atacante Mythical. Combínalo con Aegiswing para acumular rasgos del lado de ataque.', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/nyxarchon.webp']::text[], '{"rol": "Attack — DPS principal", "tier": "Mythical"}'::jsonb),
    (v_section, 3, 'Mandragora', 'Añade procs de curación a las rotaciones de Sage. Vale la pena si haces fases de DoT del jefe de gremio.', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/mandragora.webp']::text[], '{"rol": "Charm / Heal — Sustain", "tier": "Healer / Charm"}'::jsonb),
    (v_section, 4, 'Herbote', 'Se empareja con Mandragora para cobertura de curación redundante. Sage como principal, Sorcerer como secundario.', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/herbote.webp']::text[], '{"rol": "Charm / Heal — Sustain", "tier": "Healer / Charm"}'::jsonb);
end
$IMPERIUM$;
