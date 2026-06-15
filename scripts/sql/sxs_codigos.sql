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
    select id from public.game_sections where game_id = v_game and slug = 'codigos');
  delete from public.game_sections where game_id = v_game and slug = 'codigos';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'codigos', 'Códigos de Canje — Sword x Staff', 'Códigos Activos', '16 códigos públicos disponibles en la ventana de lanzamiento. Canjea en: Inicio → Menú principal (esquina inferior derecha) → Centro de usuario → Código de regalo.', array[]::text[], false,
     'Códigos', '16 códigos de canje gratuitos de la ventana de lanzamiento', 'gift', null, 'generic', 6)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Tabla de Códigos', '__TABLE__{"headers":["Código","Recompensas"],"rows":[["SS000","Por confirmar"],["SS888","Por confirmar"],["ZJ888","Por confirmar"],["ZJ999","Por confirmar"],["ZJ777","Por confirmar"],["SS999","Por confirmar"],["SXSPARTNER","1x Stellatie · 1x Destiny Fruit · 20x Auroral Badge Raro"],["VANOSSTEAM","1x Stellatie · 1x Destiny Fruit · 20x Auroral Badge Raro"],["CARBOTANIMATIONS","Por confirmar"],["SS777","Por confirmar"],["SXSCREATOR","1x Stellatie · 1x Destiny Fruit · 20x Auroral Badge Raro"],["SXSAMBASSADOR","1x Stellatie · 1x Destiny Fruit · 20x Auroral Badge Raro"],["SXSREDDIT","160x Dawnium"],["SXSFBTHANKS","Por confirmar"],["SXSDCTHANKS","Por confirmar"],["THEGAMETHEORIST","Por confirmar"]]}', 'https://eog.gg/games/sword-x-staff/', false, array[]::text[], '{}'::jsonb);
end
$IMPERIUM$;
