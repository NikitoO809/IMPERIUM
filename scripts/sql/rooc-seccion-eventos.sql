do $IMPERIUM$
declare
  v_game uuid;
  v_section uuid;
begin
  select id into v_game from public.games where slug = 'ragnarok-origin-classic';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'ragnarok-origin-classic';
  end if;

  -- Reemplazo idempotente: borra la sección y sus bloques, luego reinserta.
  delete from public.section_blocks where section_id in (
    select id from public.game_sections where game_id = v_game and slug = 'eventos');
  delete from public.game_sections where game_id = v_game and slug = 'eventos';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'eventos', 'Eventos', 'Tyr Cup: el torneo del millón de dólares', 'El Tyr Cup es el torneo de esports más grande que ha visto nunca la franquicia Ragnarok: una competición con un fondo de premios de $1.000.000 USD en juego, la cifra más alta jamás repartida en un torneo de toda la saga.

Su primera edición, la Season 1, ya se disputó por completo: la Gran Final se celebró el 11 de julio de 2026 en Bangkok, Tailandia, con público presencial en el Union Mall. Pero el Tyr Cup no se queda en una sola cita — nace pensado como una competición recurrente, con nuevas temporadas que van cambiando el formato y ampliando su alcance.

Aquí tienes el desglose completo: cómo funciona el torneo y sus etapas, quién puede inscribirse, cómo se reparte el millón de dólares, quién se llevó la primera corona y qué se sabe ya de la próxima temporada.', array['https://file.joymaker.com/game/rooc/web/1200X630en.jpg']::text[], false,
     'Eventos', null, null, 'https://file.joymaker.com/game/rooc/web/1200X630en.jpg', 'generic', 0)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Qué es el Tyr Cup', 'El Tyr Cup es el torneo de esports más grande que ha organizado nunca Ragnarok Origin Classic, con un fondo de premios de $1.000.000 USD — la cifra más alta puesta en juego en toda la historia de la franquicia Ragnarok. Su primera edición, la Season 1, cerró con una Gran Final disputada de forma presencial el 11 de julio de 2026, en el Union Mall de Bangkok, Tailandia.

Cada equipo está formado por 10 jugadores, aunque cada partida se juega 5 contra 5, dentro del modo cross-server Dimension Drill, que permite enfrentar entre sí a equipos de servidores distintos.

El verdadero corazón competitivo del torneo es el Fair Arena Mode: un sistema de estadísticas igualadas en el que cada jugador crea, aparte de su cuenta habitual, un personaje de combate propio solo para el torneo, eligiendo entre 14 clases de 2ª transcendencia disponibles — todas partiendo de los mismos recursos y la misma progresión. La propia organización resume así la filosofía detrás de este sistema: el torneo ''se aleja del modelo competitivo tradicional centrado en la progresión del personaje y la inversión de poder''. Dicho de otro modo: en el Tyr Cup gana quien juega mejor, no quien más ha invertido en su cuenta.', 'https://www.enduins.com/news/history-is-about-to-be-written-ragnarok-origin-classics-biggest-pvp-tournament-holds-its-grand-finals-in-thailand', false, array[]::text[], '{}'::jsonb),
    (v_section, 2, 'Las 4 etapas de la Season 1', 'La Season 1 del Tyr Cup se disputó en 4 etapas sucesivas, cada una recortando el número de equipos en pie. Todo empezaba con la Warm-Up Stage, una fase de práctica cross-server que no puntuaba de cara al torneo: el simple hecho de formar un equipo ya daba elegibilidad automática para seguir adelante. Después llegaba la Ranked Game, ya jugada con el equipo del servidor local a través de Dimension Drill; aquí había que presentar el roster completo de 10 jugadores para clasificar, y solo pasaban los 96 mejores equipos.

Con esos 96 equipos ya clasificados llegaba la Points Stage: se repartían en 4 divisiones de 24 equipos cada una, jugando todos contra todos dentro de su propia división, y de cada división avanzaban los 8 mejores — 32 equipos en total. La etapa final, Eliminations, era un bracket de eliminación directa: las rondas desde el Top 32 hasta el Top 4 se jugaban al mejor de 5 partidas, y la Gran Final, ya de forma presencial, se decidía al mejor de 7.

Para cualquier partida del torneo, el desempate oficial seguía siempre el mismo orden de criterios: primero los puntos de modo, después el número de bajas, el daño total infligido, la curación total y, en último lugar, el número de jugadores participantes.', 'https://roocasia.gnjoy.game/news/16910', false, array[]::text[], '{}'::jsonb),
    (v_section, 3, 'Requisitos para participar', 'Para inscribirse en el Tyr Cup, la cuenta debía tener como mínimo Base Lv.70 con la 2ª transcendencia ya completada. En esta primera Season, el torneo estuvo reservado a las regiones de Sudeste Asiático, Taiwán, Hong Kong y Macao; Corea del Sur quedó excluida de forma explícita por motivos de regulación.

Las normas de conducta eran igual de estrictas: hacer trampas o modificar el cliente del juego suponía la descalificación total, abandonar una partida sin motivo justificado se castigaba con la expulsión del equipo de todo el torneo, y la participación de menores de edad estaba directamente prohibida.', 'https://www.facebook.com/RagnarokOriginClassicEN/', false, array[]::text[], '{}'::jsonb),
    (v_section, 4, 'Reparto de premios de la Season 1', 'El millón de dólares de la Season 1 se repartió por tramos de clasificación. El equipo campeón se llevó $500.000, y el subcampeón, $100.000. Los dos equipos que llegaron a Top 4 recibieron $50.000 cada uno, los cuatro de Top 8 se repartieron $25.000 por equipo, los ocho de Top 16 ganaron $13.000 cada uno, y los dieciséis equipos de Top 32 se llevaron $6.000 por equipo.

Los 64 equipos que no lograron pasar de la Points Stage se quedaron sin premio en dinero: solo recibieron recompensas dentro del propio juego. En todos los casos, el premio de cada equipo se reparte a partes iguales entre los 10 jugadores de su roster.', 'https://roocasia.gnjoy.game/event/TyrCup-home/', false, array[]::text[], '{}'::jsonb),
    (v_section, 5, 'El campeón: ENCORE', 'El equipo campeón de la Season 1 fue ENCORE, de Filipinas, que se impuso en la Gran Final por 4 a 0 al equipo Poek, de Indonesia, el 11 de julio de 2026.

El camino hasta la final fue bien distinto para cada uno: ENCORE llegó con comodidad, barriendo su semifinal por 3 a 0, mientras que Poek tuvo que sufrir hasta la quinta partida — 3 a 2 — de su propia semifinal para conseguir su billete a la Gran Final.', 'https://technology.inquirer.net/147857/philippines-team-encore-beats-indonesia-in-rooc-tyr-cup-finals', false, array[]::text[], '{}'::jsonb),
    (v_section, 6, 'Season 2: Tyr Cup Global', 'Apenas unos días después de que terminara la Season 1, ROOC ya anunció la Season 2 bajo el nombre Tyr Cup Global — y cambia el formato de raíz. Los equipos de 10 jugadores dan paso a una guerra de gremios completa, jugada de forma simultánea en los servidores de Asia y de América, con un premio combinado que se mantiene en $1.000.000.

El nuevo formato se construye sobre tres campos de batalla — Stellar Clash, Vale of Clash y Vigrid Avenge — y organiza la competición en dos ligas paralelas, Tier A y Tier B.

Todavía no hay fecha de inscripción confirmada ni un reglamento oficial completo publicado, así que lo mejor es seguir los canales oficiales del juego para enterarte en cuanto se anuncie.', 'https://gamingph.com/2026/07/a-million-eyes-on-the-action-million-dollar-tyr-cup-s1-concludes-in-spectacular-fashion/', false, array[]::text[], '{}'::jsonb);
end
$IMPERIUM$;
