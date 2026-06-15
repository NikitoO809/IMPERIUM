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
    select id from public.game_sections where game_id = v_game and slug = 'resumen');
  delete from public.game_sections where game_id = v_game and slug = 'resumen';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'resumen', 'Resumen — Sword x Staff', 'Sword x Staff en EOG', 'Hub de Sword x Staff en Eden of Gaming. Parche 1.0 activo. Servidor: mundo de Kanstein, cinco reinos, cuatro clases avanzadas. Desarrollado por Boltray Games.', array['https://eog.gg/assets/games/sword-x-staff/kingdoms/forest.webp']::text[], false,
     'Resumen del Juego', 'Vista general, actualizaciones recientes y estado del meta en SxS', 'book', 'https://eog.gg/assets/games/sword-x-staff/kingdoms/forest.webp', 'generic', 9)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, '¿Qué contiene este Hub?', 'Recursos disponibles en IMPERIUM para Sword x Staff:

• Tier List de Clases — mejor clase por estilo de combate, para todas las regiones
• Guías — de principiante a endgame, incluyendo clases y sistemas
• Builds — cargas curadas y Build Maker por rol
• Habilidades — base de datos de habilidades, Fantomons y Compañeros
• Roadmap — progresión día a día hasta la Temporada 5
• Códigos — canjea recompensas gratuitas del período de lanzamiento
• Veredicto — análisis de lanzamiento por el equipo de EOG', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/games/sword-x-staff/kingdoms/forest.webp']::text[], '{}'::jsonb),
    (v_section, 2, 'Actualizaciones Recientes', '19 mayo 2026 — LANZAMIENTO GLOBAL: Sword x Staff disponible en iOS, Android y PC (vía emulador). Desarrollado por Boltray Games. Mundo de Kanstein, cinco reinos, cuatro clases avanzadas.

19 mayo 2026 — COLABORACIÓN KonoSuba: evento de lanzamiento activo. Más de 650 pulls gratuitos distribuidos entre recompensas de inicio de sesión e hitos de eventos.

29 julio 2026 (estimado) — PRÓXIMO: Segundo arco de KonoSuba programado. Guarda Wish Stones y Destiny Fruits para la rotación.', 'https://eog.gg/games/sword-x-staff/', false, array[]::text[], '{}'::jsonb),
    (v_section, 3, 'Sobre el Juego', 'Sword x Staff es un RPG idle de fantasía con sistema de habilidades intercambiables. A diferencia de otros gachas, la rareza que se colecciona son las habilidades — no los personajes. Esto permite personalizar libremente el rol de tu personaje sin importar qué clase elegiste al inicio.

El juego progresa por regiones: cada región desbloquea nuevas clases avanzadas (job changes) y sistemas de contenido. Las primeras dos semanas están diseñadas para exploración sin necesidad de gastar.', 'https://eog.gg/games/sword-x-staff/', false, array[]::text[], '{}'::jsonb);
end
$IMPERIUM$;
