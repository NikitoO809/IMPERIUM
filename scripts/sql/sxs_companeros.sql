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
    select id from public.game_sections where game_id = v_game and slug = 'companeros');
  delete from public.game_sections where game_id = v_game and slug = 'companeros';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'companeros', 'Compañeros — Sword x Staff (35 indexados)', 'Compañeros', '35 compañeros indexados. Cada compañero progresa de Blackiron hasta Saint. Son distintos de los Fantomons: los compañeros son personajes del mundo del juego, cada uno compatible con líneas de clase específicas.', array['https://eog.gg/assets/sxs/companions/akane.webp']::text[], false,
     'Compañeros', '35 compañeros con clases compatibles y rangos', 'users', 'https://eog.gg/assets/sxs/companions/akane.webp', 'generic', 5)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Akane', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Hechicero · Archimago · Destructor · Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/akane.webp']::text[], '{}'::jsonb),
    (v_section, 2, 'Aqua', 'Rangos: 1 RANKS · BLACKIRON
Clases compatibles: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/mage.png']::text[], '{}'::jsonb),
    (v_section, 3, 'Astrid', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Sabio · Arcanista · Dominador · Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/sorcerer.png']::text[], '{}'::jsonb),
    (v_section, 4, 'Braulio', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Caballero · Paladín · Guardián · Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/archmage.png']::text[], '{}'::jsonb),
    (v_section, 5, 'Chief', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Sabio · Arcanista · Dominador · Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/destroyer.png']::text[], '{}'::jsonb),
    (v_section, 6, 'Darkness', 'Rangos: 1 RANKS · BLACKIRON
Clases compatibles: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/magister.png']::text[], '{}'::jsonb),
    (v_section, 7, 'Eiichi', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/aqua.webp']::text[], '{}'::jsonb),
    (v_section, 8, 'Freya', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/sage.png']::text[], '{}'::jsonb),
    (v_section, 9, 'Gerald', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Caballero · Paladín · Guardián · Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/astrid.webp']::text[], '{}'::jsonb),
    (v_section, 10, 'Hermes', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Hechicero · Archimago · Destructor · Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/arcanist.png']::text[], '{}'::jsonb),
    (v_section, 11, 'Hui', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Caballero · Paladín · Guardián · Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/dominator.png']::text[], '{}'::jsonb),
    (v_section, 12, 'Isla', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Sabio · Arcanista · Dominador · Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/prophet.png']::text[], '{}'::jsonb),
    (v_section, 13, 'Jiangwang', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Hechicero · Archimago · Destructor · Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/braulio.webp']::text[], '{}'::jsonb),
    (v_section, 14, 'Juubee', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Caballero · Paladín · Guardián · Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/warrior.png']::text[], '{}'::jsonb),
    (v_section, 15, 'Karlos', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/knight.png']::text[], '{}'::jsonb),
    (v_section, 16, 'Kazuma', 'Rangos: 1 RANKS · BLACKIRON
Clases compatibles: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/paladin.png']::text[], '{}'::jsonb),
    (v_section, 17, 'Killian', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Sabio · Arcanista · Dominador · Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/guardian.png']::text[], '{}'::jsonb),
    (v_section, 18, 'Mateo', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Hechicero · Archimago · Destructor · Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/templar.png']::text[], '{}'::jsonb),
    (v_section, 19, 'Mayoi', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/chief.webp']::text[], '{}'::jsonb),
    (v_section, 20, 'Megumin', 'Rangos: 1 RANKS · BLACKIRON
Clases compatibles: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/darkness.webp']::text[], '{}'::jsonb),
    (v_section, 21, 'Micaela', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Caballero · Paladín · Guardián · Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/eiichi.webp']::text[], '{}'::jsonb),
    (v_section, 22, 'Ming', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/duelist.png']::text[], '{}'::jsonb),
    (v_section, 23, 'Mio', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Hechicero · Archimago · Destructor · Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/berserker.png']::text[], '{}'::jsonb),
    (v_section, 24, 'Molly', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Caballero · Paladín · Guardián · Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/conqueror.png']::text[], '{}'::jsonb),
    (v_section, 25, 'Naira', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/classes/ravager.png']::text[], '{}'::jsonb),
    (v_section, 26, 'Ophelia', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Hechicero · Archimago · Destructor · Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/freya.webp']::text[], '{}'::jsonb),
    (v_section, 27, 'Qin', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/gerald.webp']::text[], '{}'::jsonb),
    (v_section, 28, 'Reina', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/hermes.webp']::text[], '{}'::jsonb),
    (v_section, 29, 'Starfrost Santa - Chief', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Hechicero · Archimago · Destructor · Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/hui.webp']::text[], '{}'::jsonb),
    (v_section, 30, 'Starfrost Wish - Molly', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/isla.webp']::text[], '{}'::jsonb),
    (v_section, 31, 'Suimo', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Sabio · Arcanista · Dominador · Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/jiangwang.webp']::text[], '{}'::jsonb),
    (v_section, 32, 'Suzu', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Sabio · Arcanista · Dominador · Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/juubee.webp']::text[], '{}'::jsonb),
    (v_section, 33, 'Sylvia', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Mago · Hechicero · Archimago · Destructor · Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/karlos.webp']::text[], '{}'::jsonb),
    (v_section, 34, 'Vigard', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Caballero · Paladín · Guardián · Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/kazuma.webp']::text[], '{}'::jsonb),
    (v_section, 35, 'Wuji', 'Rangos: 5 RANKS · BLACKIRON → SAINT
Clases compatibles: Guerrero · Duelista · Berserker · Conquistador · Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/companions/killian.webp']::text[], '{}'::jsonb);
end
$IMPERIUM$;
