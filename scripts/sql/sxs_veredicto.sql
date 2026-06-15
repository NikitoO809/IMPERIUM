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
    select id from public.game_sections where game_id = v_game and slug = 'veredicto');
  delete from public.game_sections where game_id = v_game and slug = 'veredicto';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'veredicto', 'Veredicto — Sword x Staff', 'Veredicto de Lanzamiento EOG.GG', 'Análisis del equipo de analistas de Eden of Gaming. Actualizado el 20 de mayo de 2026.', array['https://eog.gg/assets/games/sword-x-staff/kingdoms/mountain.webp']::text[], false,
     'Veredicto', 'Análisis de lanzamiento de Sword x Staff por el equipo de EOG.GG', 'wrench', 'https://eog.gg/assets/games/sword-x-staff/kingdoms/mountain.webp', 'generic', 8)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Análisis General', 'Sword x Staff es el gacha más paciente que ha lanzado esta temporada. Boltray bloquea casi todos los sistemas significativos hasta el segundo mapa, lo que significa que las primeras dos semanas recompensan la exploración y la experimentación de clases por encima del gasto. La colaboración de lanzamiento de KonoSuba hace que el punto de entrada sea económico.

La estructura de obtención de habilidades es el verdadero diferenciador respecto a todos los demás juegos en EOG.GG. Si quieres evaluarlo: elige Guerrero o Mago, avanza en la exploración del mapa, reclama todos los pulls gratuitos de 10 y no gastes Dawnium en Stellaties.

El bosque de Verdantglade es un filtro por diseño. Aproximadamente la mitad de la base de jugadores abandonará antes de llegar a Cinder Ridge. La mitad que se queda es el público para el que fue diseñado este juego.', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/games/sword-x-staff/kingdoms/mountain.webp']::text[], '{}'::jsonb),
    (v_section, 2, 'Recomendado para', 'Pruébalo si quieres un RPG idle de fantasía que respete tu tiempo, te permita cambiar de rol libremente y trate la colección de habilidades (en lugar de la colección de personajes) como el gancho del gacha. La colaboración de lanzamiento de KonoSuba es la mayor oferta de entrada del mercado.

Evítalo si buscas gráficos de personajes premium, acción en tiempo real o una dificultad que requiera grind activo.

Gasta si llegas a Cinder Ridge y quieres una clase maga de alto nivel: los Fantomons de calidad y la Stellatie correcta marcan la diferencia.', 'https://eog.gg/games/sword-x-staff/', false, array[]::text[], '{}'::jsonb),
    (v_section, 3, 'Calificación del Equipo EOG', 'Guarda y juega gratis · Amigable para F2P · Jugadores pacientes

Cinder Ridge es donde se desbloquean el Banner Premium y las Subastas. Es el punto de decisión real: hasta ahí el juego es completamente disfrutable sin gastar. A partir de ese punto, la inversión en Fantomons y la Stellatie correcta marcan la diferencia en el contenido de alto nivel.', 'https://eog.gg/games/sword-x-staff/', false, array[]::text[], '{}'::jsonb);
end
$IMPERIUM$;
