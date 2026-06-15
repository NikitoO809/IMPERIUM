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
    select id from public.game_sections where game_id = v_game and slug = 'habilidades');
  delete from public.game_sections where game_id = v_game and slug = 'habilidades';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'habilidades', 'Habilidades — Sword x Staff (264 indexadas)', 'Base de Datos de Habilidades', '264 habilidades indexadas. Filtra por Tipo (Técnica / Encanto) y por Clase para encontrar las que necesitas.', array['https://eog.gg/assets/sxs/skills/aqua-vortex.webp']::text[], false,
     'Habilidades', '264 habilidades con íconos — filtrables por tipo y clase', 'gem', 'https://eog.gg/assets/sxs/skills/aqua-vortex.webp', 'tier-list', 2)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Aberrancy', 'Tipo: Encanto
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/aberrancy.webp']::text[], '{"clase": "Dominador", "tipo": "Encanto"}'::jsonb),
    (v_section, 2, 'Abyssal Hand', 'Tipo: Técnica
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/abyssal-hand.webp']::text[], '{"clase": "Arcanista", "tipo": "Técnica"}'::jsonb),
    (v_section, 3, 'Adamant Stance', 'Tipo: Encanto
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/adamant-stance.webp']::text[], '{"clase": "Monstruo", "tipo": "Encanto"}'::jsonb),
    (v_section, 4, 'Air Break', 'Tipo: Técnica
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/air-break.webp']::text[], '{"clase": "Devastador", "tipo": "Técnica"}'::jsonb),
    (v_section, 5, 'Aqua Vortex', 'Tipo: Técnica
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/aqua-vortex.webp']::text[], '{"clase": "Archimago", "tipo": "Técnica"}'::jsonb),
    (v_section, 6, 'Asura''s Grasp', 'Tipo: Técnica
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/asuras-grasp.webp']::text[], '{"clase": "Berserker", "tipo": "Técnica"}'::jsonb),
    (v_section, 7, 'Blade of Judgment', 'Tipo: Encanto
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blade-of-judgment.webp']::text[], '{"clase": "Berserker", "tipo": "Encanto"}'::jsonb),
    (v_section, 8, 'Blade of Lament', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blade-of-lament.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 9, 'Blade Siphon', 'Tipo: Encanto
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blade-siphon.webp']::text[], '{"clase": "Berserker", "tipo": "Encanto"}'::jsonb),
    (v_section, 10, 'Blade Storm', 'Tipo: Técnica
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blade-storm.webp']::text[], '{"clase": "Conquistador", "tipo": "Técnica"}'::jsonb),
    (v_section, 11, 'Blade Tempest', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blade-tempest.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 12, 'Blast Spirit', 'Tipo: Técnica
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blast-spirit.webp']::text[], '{"clase": "Magistro", "tipo": "Técnica"}'::jsonb),
    (v_section, 13, 'Blazing Clash', 'Tipo: Encanto
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blazing-clash.webp']::text[], '{"clase": "Duelista", "tipo": "Encanto"}'::jsonb),
    (v_section, 14, 'Blazing Claw', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blazing-claw.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 15, 'Blazing Fire Ring', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blazing-fire-ring.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 16, 'Blazing Momentum', 'Tipo: Encanto
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/blazing-momentum.webp']::text[], '{"clase": "Conquistador", "tipo": "Encanto"}'::jsonb),
    (v_section, 17, 'Block Awareness', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/block-awareness.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 18, 'Block Mastery', 'Tipo: Encanto
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/block-mastery.webp']::text[], '{"clase": "Paladín", "tipo": "Encanto"}'::jsonb),
    (v_section, 19, 'Boiling Bloodlust', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/boiling-bloodlust.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 20, 'Chaos Rune', 'Tipo: Técnica
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/chaos-rune.webp']::text[], '{"clase": "Dominador", "tipo": "Técnica"}'::jsonb),
    (v_section, 21, 'Counter Blade', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/counter-blade.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 22, 'Crag Collapse', 'Tipo: Encanto
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/crag-collapse.webp']::text[], '{"clase": "Monstruo", "tipo": "Encanto"}'::jsonb),
    (v_section, 23, 'Crimson Whirl', 'Tipo: Técnica
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/crimson-whirl.webp']::text[], '{"clase": "Magistro", "tipo": "Técnica"}'::jsonb),
    (v_section, 24, 'Crit Mastery', 'Tipo: Encanto
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/crit-mastery.webp']::text[], '{"clase": "Duelista", "tipo": "Encanto"}'::jsonb),
    (v_section, 25, 'Crusader''s Might', 'Tipo: Encanto
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/crusaders-might.webp']::text[], '{"clase": "Monstruo", "tipo": "Encanto"}'::jsonb),
    (v_section, 26, 'Crystal Armor', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/crystal-armor.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 27, 'Curse Resonance', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/curse-resonance.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 28, 'Cursed Armor', 'Tipo: Encanto
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/cursed-armor.webp']::text[], '{"clase": "Profeta", "tipo": "Encanto"}'::jsonb),
    (v_section, 29, 'Cyclone', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/cyclone.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 30, 'Cyclone Lament', 'Tipo: Encanto
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/cyclone-lament.webp']::text[], '{"clase": "Destructor", "tipo": "Encanto"}'::jsonb),
    (v_section, 31, 'Dark Bullet', 'Tipo: Técnica
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/dark-bullet.webp']::text[], '{"clase": "Sabio", "tipo": "Técnica"}'::jsonb),
    (v_section, 32, 'Dark Starburst', 'Tipo: Técnica
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/dark-starburst.webp']::text[], '{"clase": "Dominador", "tipo": "Técnica"}'::jsonb),
    (v_section, 33, 'Darkness Descends', 'Tipo: Técnica
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/darkness-descends.webp']::text[], '{"clase": "Duelista", "tipo": "Técnica"}'::jsonb),
    (v_section, 34, 'Darkness''s Slash', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/darknesss-slash.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 35, 'Dawnburst', 'Tipo: Técnica
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/dawnburst.webp']::text[], '{"clase": "Templario", "tipo": "Técnica"}'::jsonb),
    (v_section, 36, 'Decoy', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/decoy.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 37, 'Decoy Clone', 'Tipo: Técnica
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/decoy-clone.webp']::text[], '{"clase": "Dominador", "tipo": "Técnica"}'::jsonb),
    (v_section, 38, 'Defensive Assault', 'Tipo: Encanto
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/defensive-assault.webp']::text[], '{"clase": "Caballero", "tipo": "Encanto"}'::jsonb),
    (v_section, 39, 'Desperate Protection', 'Tipo: Técnica
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/desperate-protection.webp']::text[], '{"clase": "Paladín", "tipo": "Técnica"}'::jsonb),
    (v_section, 40, 'Desperate Shadow', 'Tipo: Técnica
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/desperate-shadow.webp']::text[], '{"clase": "Profeta", "tipo": "Técnica"}'::jsonb),
    (v_section, 41, 'Desperate Valor', 'Tipo: Encanto
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/desperate-valor.webp']::text[], '{"clase": "Berserker", "tipo": "Encanto"}'::jsonb),
    (v_section, 42, 'Dew''s Blessing', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/dews-blessing.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 43, 'Dewdrop', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/dewdrop.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 44, 'Divine Wrath', 'Tipo: Técnica
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/divine-wrath.webp']::text[], '{"clase": "Archimago", "tipo": "Técnica"}'::jsonb),
    (v_section, 45, 'Diving Gale', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/diving-gale.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 46, 'Dominant Gaze', 'Tipo: Encanto
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/dominant-gaze.webp']::text[], '{"clase": "Devastador", "tipo": "Encanto"}'::jsonb),
    (v_section, 47, 'Doom Blade', 'Tipo: Técnica
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/doom-blade.webp']::text[], '{"clase": "Berserker", "tipo": "Técnica"}'::jsonb),
    (v_section, 48, 'Drain Touch', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/drain-touch.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 49, 'Dreadful Shadow', 'Tipo: Técnica
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/dreadful-shadow.webp']::text[], '{"clase": "Conquistador", "tipo": "Técnica"}'::jsonb),
    (v_section, 50, 'Drifting Leaf', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/drifting-leaf.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 51, 'Earthquake', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/earthquake.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 52, 'Eclipse Slash', 'Tipo: Técnica
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/eclipse-slash.webp']::text[], '{"clase": "Berserker", "tipo": "Técnica"}'::jsonb),
    (v_section, 53, 'Edge Strike', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/edge-strike.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 54, 'Elemental Body', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/elemental-body.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 55, 'Elemental Harmony', 'Tipo: Encanto
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/elemental-harmony.webp']::text[], '{"clase": "Hechicero", "tipo": "Encanto"}'::jsonb),
    (v_section, 56, 'Elemental Mystery', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/elemental-mystery.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 57, 'Ember Flare', 'Tipo: Encanto
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/ember-flare.webp']::text[], '{"clase": "Magistro", "tipo": "Encanto"}'::jsonb),
    (v_section, 58, 'Energy Burst', 'Tipo: Técnica
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/energy-burst.webp']::text[], '{"clase": "Hechicero", "tipo": "Técnica"}'::jsonb),
    (v_section, 59, 'Explosion Magic', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/explosion-magic.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 60, 'Explosive Spirit', 'Tipo: Encanto
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/explosive-spirit.webp']::text[], '{"clase": "Destructor", "tipo": "Encanto"}'::jsonb),
    (v_section, 61, 'Eye for an Eye', 'Tipo: Encanto
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/eye-for-an-eye.webp']::text[], '{"clase": "Caballero", "tipo": "Encanto"}'::jsonb),
    (v_section, 62, 'Falling Dark Star', 'Tipo: Encanto
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/falling-dark-star.webp']::text[], '{"clase": "Dominador", "tipo": "Encanto"}'::jsonb),
    (v_section, 63, 'Feline Dance', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/feline-dance.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 64, 'Fiery Burst', 'Tipo: Encanto
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/fiery-burst.webp']::text[], '{"clase": "Destructor", "tipo": "Encanto"}'::jsonb),
    (v_section, 65, 'Fiery Rejuvenation', 'Tipo: Encanto
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/fiery-rejuvenation.webp']::text[], '{"clase": "Destructor", "tipo": "Encanto"}'::jsonb),
    (v_section, 66, 'Fiery Star Trail', 'Tipo: Técnica
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/fiery-star-trail.webp']::text[], '{"clase": "Hechicero", "tipo": "Técnica"}'::jsonb),
    (v_section, 67, 'Fighting Spirit', 'Tipo: Encanto
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/fighting-spirit.webp']::text[], '{"clase": "Monstruo", "tipo": "Encanto"}'::jsonb),
    (v_section, 68, 'Fire Blast', 'Tipo: Técnica
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/fire-blast.webp']::text[], '{"clase": "Archimago", "tipo": "Técnica"}'::jsonb),
    (v_section, 69, 'Fire Slash', 'Tipo: Técnica
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/fire-slash.webp']::text[], '{"clase": "Duelista", "tipo": "Técnica"}'::jsonb),
    (v_section, 70, 'Fireball', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/fireball.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 71, 'First Light', 'Tipo: Técnica
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/first-light.webp']::text[], '{"clase": "Templario", "tipo": "Técnica"}'::jsonb),
    (v_section, 72, 'Flame Aura', 'Tipo: Técnica
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flame-aura.webp']::text[], '{"clase": "Duelista", "tipo": "Técnica"}'::jsonb),
    (v_section, 73, 'Flame Jet', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flame-jet.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 74, 'Flame Wolf Summon', 'Tipo: Técnica
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flame-wolf-summon.webp']::text[], '{"clase": "Sabio", "tipo": "Técnica"}'::jsonb),
    (v_section, 75, 'Flaming Heel', 'Tipo: Encanto
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flaming-heel.webp']::text[], '{"clase": "Devastador", "tipo": "Encanto"}'::jsonb),
    (v_section, 76, 'Flaming Path', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flaming-path.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 77, 'Flash Dash', 'Tipo: Técnica
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flash-dash.webp']::text[], '{"clase": "Duelista", "tipo": "Técnica"}'::jsonb),
    (v_section, 78, 'Flash Fire', 'Tipo: Técnica
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flash-fire.webp']::text[], '{"clase": "Conquistador", "tipo": "Técnica"}'::jsonb),
    (v_section, 79, 'Flickering Blade', 'Tipo: Técnica
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flickering-blade.webp']::text[], '{"clase": "Conquistador", "tipo": "Técnica"}'::jsonb),
    (v_section, 80, 'Flickering Stars', 'Tipo: Técnica
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flickering-stars.webp']::text[], '{"clase": "Hechicero", "tipo": "Técnica"}'::jsonb),
    (v_section, 81, 'Flowing Doom', 'Tipo: Técnica
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/flowing-doom.webp']::text[], '{"clase": "Destructor", "tipo": "Técnica"}'::jsonb),
    (v_section, 82, 'Forceful Charge', 'Tipo: Técnica
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/forceful-charge.webp']::text[], '{"clase": "Paladín", "tipo": "Técnica"}'::jsonb),
    (v_section, 83, 'Formation Breaker', 'Tipo: Técnica
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/formation-breaker.webp']::text[], '{"clase": "Destructor", "tipo": "Técnica"}'::jsonb),
    (v_section, 84, 'Frame of Battles', 'Tipo: Encanto
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frame-of-battles.webp']::text[], '{"clase": "Duelista", "tipo": "Encanto"}'::jsonb),
    (v_section, 85, 'Frenzy Totem', 'Tipo: Técnica
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frenzy-totem.webp']::text[], '{"clase": "Arcanista", "tipo": "Técnica"}'::jsonb),
    (v_section, 86, 'Frigid Aura', 'Tipo: Encanto
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frigid-aura.webp']::text[], '{"clase": "Guardián", "tipo": "Encanto"}'::jsonb),
    (v_section, 87, 'Frigid Glint', 'Tipo: Encanto
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frigid-glint.webp']::text[], '{"clase": "Guardián", "tipo": "Encanto"}'::jsonb),
    (v_section, 88, 'Frost Guard', 'Tipo: Encanto
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frost-guard.webp']::text[], '{"clase": "Archimago", "tipo": "Encanto"}'::jsonb),
    (v_section, 89, 'Frost Thorn', 'Tipo: Técnica
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frost-thorn.webp']::text[], '{"clase": "Magistro", "tipo": "Técnica"}'::jsonb),
    (v_section, 90, 'Frostbite Blossom', 'Tipo: Técnica
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frostbite-blossom.webp']::text[], '{"clase": "Caballero", "tipo": "Técnica"}'::jsonb),
    (v_section, 91, 'Frostsoul Ward', 'Tipo: Encanto
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frostsoul-ward.webp']::text[], '{"clase": "Magistro", "tipo": "Encanto"}'::jsonb),
    (v_section, 92, 'Frosty Nova', 'Tipo: Técnica
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/frosty-nova.webp']::text[], '{"clase": "Hechicero", "tipo": "Técnica"}'::jsonb),
    (v_section, 93, 'Gale Dance', 'Tipo: Técnica
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/gale-dance.webp']::text[], '{"clase": "Berserker", "tipo": "Técnica"}'::jsonb),
    (v_section, 94, 'Gale Shield', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/gale-shield.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 95, 'Giant Shark', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/giant-shark.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 96, 'Glacial Song', 'Tipo: Técnica
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/glacial-song.webp']::text[], '{"clase": "Devastador", "tipo": "Técnica"}'::jsonb),
    (v_section, 97, 'Goddess of Water', 'Tipo: Encanto
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/goddess-of-water.webp']::text[], '{"clase": "Monstruo", "tipo": "Encanto"}'::jsonb),
    (v_section, 98, 'Grand Giftfall', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/grand-giftfall.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 99, 'Gravity Pull', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/gravity-pull.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 100, 'Great Luck', 'Tipo: Encanto
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/great-luck.webp']::text[], '{"clase": "Monstruo", "tipo": "Encanto"}'::jsonb),
    (v_section, 101, 'Guardian Ring', 'Tipo: Técnica
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/guardian-ring.webp']::text[], '{"clase": "Caballero", "tipo": "Técnica"}'::jsonb),
    (v_section, 102, 'Hamper Strike', 'Tipo: Técnica
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/hamper-strike.webp']::text[], '{"clase": "Guardián", "tipo": "Técnica"}'::jsonb),
    (v_section, 103, 'Heal', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/heal.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 104, 'Healing Mastery', 'Tipo: Encanto
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/healing-mastery.webp']::text[], '{"clase": "Sabio", "tipo": "Encanto"}'::jsonb),
    (v_section, 105, 'Healing Shift', 'Tipo: Encanto
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/healing-shift.webp']::text[], '{"clase": "Templario", "tipo": "Encanto"}'::jsonb),
    (v_section, 106, 'Healing Touch', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/healing-touch.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 107, 'Heart of Challenge', 'Tipo: Técnica
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/heart-of-challenge.webp']::text[], '{"clase": "Caballero", "tipo": "Técnica"}'::jsonb),
    (v_section, 108, 'Heart of Flame', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/heart-of-flame.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 109, 'Heavy Impact', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/heavy-impact.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 110, 'Hellfire Requiem', 'Tipo: Técnica
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/hellfire-requiem.webp']::text[], '{"clase": "Conquistador", "tipo": "Técnica"}'::jsonb),
    (v_section, 111, 'Hexed Blast', 'Tipo: Técnica
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/hexed-blast.webp']::text[], '{"clase": "Profeta", "tipo": "Técnica"}'::jsonb),
    (v_section, 112, 'Holy Aegis', 'Tipo: Encanto
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/holy-aegis.webp']::text[], '{"clase": "Guardián", "tipo": "Encanto"}'::jsonb),
    (v_section, 113, 'Holy Bulwark', 'Tipo: Encanto
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/holy-bulwark.webp']::text[], '{"clase": "Templario", "tipo": "Encanto"}'::jsonb),
    (v_section, 114, 'Holy Purification', 'Tipo: Técnica
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/holy-purification.webp']::text[], '{"clase": "Paladín", "tipo": "Técnica"}'::jsonb),
    (v_section, 115, 'Holy Recuperation', 'Tipo: Encanto
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/holy-recuperation.webp']::text[], '{"clase": "Templario", "tipo": "Encanto"}'::jsonb),
    (v_section, 116, 'Holy Restoration', 'Tipo: Encanto
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/holy-restoration.webp']::text[], '{"clase": "Templario", "tipo": "Encanto"}'::jsonb),
    (v_section, 117, 'Hook', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/hook.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 118, 'Howling Hurricane', 'Tipo: Técnica
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/howling-hurricane.webp']::text[], '{"clase": "Archimago", "tipo": "Técnica"}'::jsonb),
    (v_section, 119, 'Hunter''s Judgment', 'Tipo: Técnica
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/hunters-judgment.webp']::text[], '{"clase": "Berserker", "tipo": "Técnica"}'::jsonb),
    (v_section, 120, 'Ice Spike', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/ice-spike.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 121, 'Incarnation of Light', 'Tipo: Encanto
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/incarnation-of-light.webp']::text[], '{"clase": "Archimago", "tipo": "Encanto"}'::jsonb),
    (v_section, 122, 'Incinerating Wolf', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/incinerating-wolf.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 123, 'Indomitable Will', 'Tipo: Encanto
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/indomitable-will.webp']::text[], '{"clase": "Duelista", "tipo": "Encanto"}'::jsonb),
    (v_section, 124, 'Insight', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/insight.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 125, 'Insightful Eye', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/insightful-eye.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 126, 'Inspiration', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/inspiration.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 127, 'Iron Fortress', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/iron-fortress.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 128, 'Iron Slashes', 'Tipo: Técnica
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/iron-slashes.webp']::text[], '{"clase": "Templario", "tipo": "Técnica"}'::jsonb),
    (v_section, 129, 'Iron Thorn', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/iron-thorn.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 130, 'Iron Will', 'Tipo: Encanto
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/iron-will.webp']::text[], '{"clase": "Guardián", "tipo": "Encanto"}'::jsonb),
    (v_section, 131, 'Last Stand', 'Tipo: Técnica
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/last-stand.webp']::text[], '{"clase": "Templario", "tipo": "Técnica"}'::jsonb),
    (v_section, 132, 'Leaf Arrow', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/leaf-arrow.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 133, 'Leap Attack', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/leap-attack.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 134, 'Life Blessing', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/life-blessing.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 135, 'Light Burst', 'Tipo: Técnica
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/light-burst.webp']::text[], '{"clase": "Magistro", "tipo": "Técnica"}'::jsonb),
    (v_section, 136, 'Light of Dawn', 'Tipo: Técnica
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/light-of-dawn.webp']::text[], '{"clase": "Hechicero", "tipo": "Técnica"}'::jsonb),
    (v_section, 137, 'Light Sword Array', 'Tipo: Técnica
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/light-sword-array.webp']::text[], '{"clase": "Guardián", "tipo": "Técnica"}'::jsonb),
    (v_section, 138, 'Lightning Chain', 'Tipo: Técnica
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/lightning-chain.webp']::text[], '{"clase": "Hechicero", "tipo": "Técnica"}'::jsonb),
    (v_section, 139, 'Lightning Mystery', 'Tipo: Encanto
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/lightning-mystery.webp']::text[], '{"clase": "Hechicero", "tipo": "Encanto"}'::jsonb),
    (v_section, 140, 'Linked Misfortune', 'Tipo: Encanto
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/linked-misfortune.webp']::text[], '{"clase": "Arcanista", "tipo": "Encanto"}'::jsonb),
    (v_section, 141, 'Lion Combo', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/lion-combo.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 142, 'Luminous Shield', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/luminous-shield.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 143, 'Lunarwater Threads', 'Tipo: Técnica
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/lunarwater-threads.webp']::text[], '{"clase": "Paladín", "tipo": "Técnica"}'::jsonb),
    (v_section, 144, 'Mana Blast', 'Tipo: Técnica
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/mana-blast.webp']::text[], '{"clase": "Arcanista", "tipo": "Técnica"}'::jsonb),
    (v_section, 145, 'Mana Surge', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/mana-surge.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 146, 'Mantra of Blessings', 'Tipo: Encanto
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/mantra-of-blessings.webp']::text[], '{"clase": "Dominador", "tipo": "Encanto"}'::jsonb),
    (v_section, 147, 'Massive Quake', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/massive-quake.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 148, 'Meteoric Flames', 'Tipo: Técnica
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/meteoric-flames.webp']::text[], '{"clase": "Archimago", "tipo": "Técnica"}'::jsonb),
    (v_section, 149, 'Misty Vapor', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/misty-vapor.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 150, 'Mountain Collapse', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/mountain-collapse.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 151, 'My Name Is Megumin!', 'Tipo: Encanto
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/my-name-is-megumin.webp']::text[], '{"clase": "Monstruo", "tipo": "Encanto"}'::jsonb),
    (v_section, 152, 'Nature''s Beauty', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/natures-beauty.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 153, 'Night Curse', 'Tipo: Técnica
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/night-curse.webp']::text[], '{"clase": "Devastador", "tipo": "Técnica"}'::jsonb),
    (v_section, 154, 'Night''s Blessing', 'Tipo: Encanto
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/nights-blessing.webp']::text[], '{"clase": "Arcanista", "tipo": "Encanto"}'::jsonb),
    (v_section, 155, 'Oath of Vigil', 'Tipo: Encanto
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/oath-of-vigil.webp']::text[], '{"clase": "Guardián", "tipo": "Encanto"}'::jsonb),
    (v_section, 156, 'Overhealing', 'Tipo: Encanto
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/overhealing.webp']::text[], '{"clase": "Arcanista", "tipo": "Encanto"}'::jsonb),
    (v_section, 157, 'Overload Protection', 'Tipo: Encanto
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/overload-protection.webp']::text[], '{"clase": "Destructor", "tipo": "Encanto"}'::jsonb),
    (v_section, 158, 'Panflow Streak', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/panflow-streak.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 159, 'Phantom Assault', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/phantom-assault.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 160, 'Phantom Blade', 'Tipo: Técnica
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/phantom-blade.webp']::text[], '{"clase": "Guardián", "tipo": "Técnica"}'::jsonb),
    (v_section, 161, 'Phantom Light', 'Tipo: Encanto
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/phantom-light.webp']::text[], '{"clase": "Dominador", "tipo": "Encanto"}'::jsonb),
    (v_section, 162, 'Piercing Assault', 'Tipo: Encanto
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/piercing-assault.webp']::text[], '{"clase": "Conquistador", "tipo": "Encanto"}'::jsonb),
    (v_section, 163, 'Potential Rebirth', 'Tipo: Encanto
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/potential-rebirth.webp']::text[], '{"clase": "Paladín", "tipo": "Encanto"}'::jsonb),
    (v_section, 164, 'Potential Vitality', 'Tipo: Encanto
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/potential-vitality.webp']::text[], '{"clase": "Duelista", "tipo": "Encanto"}'::jsonb),
    (v_section, 165, 'Protective Rune', 'Tipo: Técnica
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/protective-rune.webp']::text[], '{"clase": "Destructor", "tipo": "Técnica"}'::jsonb),
    (v_section, 166, 'Punch', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/punch.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 167, 'Punishment Sigil', 'Tipo: Encanto
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/punishment-sigil.webp']::text[], '{"clase": "Templario", "tipo": "Encanto"}'::jsonb),
    (v_section, 168, 'Pure Protection', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/pure-protection.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 169, 'Pursuit of Victory', 'Tipo: Encanto
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/pursuit-of-victory.webp']::text[], '{"clase": "Caballero", "tipo": "Encanto"}'::jsonb),
    (v_section, 170, 'Quadrant Slash', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/quadrant-slash.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 171, 'Radiant Restoration', 'Tipo: Técnica
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/radiant-restoration.webp']::text[], '{"clase": "Sabio", "tipo": "Técnica"}'::jsonb),
    (v_section, 172, 'Radiant Rhythm', 'Tipo: Técnica
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/radiant-rhythm.webp']::text[], '{"clase": "Profeta", "tipo": "Técnica"}'::jsonb),
    (v_section, 173, 'Radiant Sear', 'Tipo: Encanto
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/radiant-sear.webp']::text[], '{"clase": "Archimago", "tipo": "Encanto"}'::jsonb),
    (v_section, 174, 'Radiant Warp', 'Tipo: Encanto
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/radiant-warp.webp']::text[], '{"clase": "Magistro", "tipo": "Encanto"}'::jsonb),
    (v_section, 175, 'Raging Maelstrom', 'Tipo: Técnica
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/raging-maelstrom.webp']::text[], '{"clase": "Guardián", "tipo": "Técnica"}'::jsonb),
    (v_section, 176, 'Raging Wildfire', 'Tipo: Encanto
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/raging-wildfire.webp']::text[], '{"clase": "Hechicero", "tipo": "Encanto"}'::jsonb),
    (v_section, 177, 'Rapid Cast', 'Tipo: Encanto
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/rapid-cast.webp']::text[], '{"clase": "Archimago", "tipo": "Encanto"}'::jsonb),
    (v_section, 178, 'Rebound', 'Tipo: Encanto
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/rebound.webp']::text[], '{"clase": "Caballero", "tipo": "Encanto"}'::jsonb),
    (v_section, 179, 'Reflective Armor', 'Tipo: Encanto
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/reflective-armor.webp']::text[], '{"clase": "Paladín", "tipo": "Encanto"}'::jsonb),
    (v_section, 180, 'Rejuvenating Elixir', 'Tipo: Encanto
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/rejuvenating-elixir.webp']::text[], '{"clase": "Profeta", "tipo": "Encanto"}'::jsonb),
    (v_section, 181, 'Rejuvenating Rain', 'Tipo: Técnica
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/rejuvenating-rain.webp']::text[], '{"clase": "Dominador", "tipo": "Técnica"}'::jsonb),
    (v_section, 182, 'Relentless Frenzy', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/relentless-frenzy.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 183, 'Repelling Wind', 'Tipo: Encanto
Clase: Archimago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/repelling-wind.webp']::text[], '{"clase": "Archimago", "tipo": "Encanto"}'::jsonb),
    (v_section, 184, 'Restrain', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/restrain.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 185, 'Resurrection', 'Tipo: Encanto
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/resurrection.webp']::text[], '{"clase": "Sabio", "tipo": "Encanto"}'::jsonb),
    (v_section, 186, 'Ricocheting Shield', 'Tipo: Técnica
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/ricocheting-shield.webp']::text[], '{"clase": "Caballero", "tipo": "Técnica"}'::jsonb),
    (v_section, 187, 'Ring of Omen', 'Tipo: Encanto
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/ring-of-omen.webp']::text[], '{"clase": "Profeta", "tipo": "Encanto"}'::jsonb),
    (v_section, 188, 'Ripple Impact', 'Tipo: Encanto
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/ripple-impact.webp']::text[], '{"clase": "Caballero", "tipo": "Encanto"}'::jsonb),
    (v_section, 189, 'Riptide', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/riptide.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 190, 'Rock Break', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/rock-break.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 191, 'Rock Rex Summon', 'Tipo: Técnica
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/rock-rex-summon.webp']::text[], '{"clase": "Dominador", "tipo": "Técnica"}'::jsonb),
    (v_section, 192, 'Sacred Create Water', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/sacred-create-water.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 193, 'Sacred Rhythm', 'Tipo: Encanto
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/sacred-rhythm.webp']::text[], '{"clase": "Templario", "tipo": "Encanto"}'::jsonb),
    (v_section, 194, 'Sacred Shine', 'Tipo: Técnica
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/sacred-shine.webp']::text[], '{"clase": "Templario", "tipo": "Técnica"}'::jsonb),
    (v_section, 195, 'Sanctified Soul', 'Tipo: Técnica
Clase: Templario', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/sanctified-soul.webp']::text[], '{"clase": "Templario", "tipo": "Técnica"}'::jsonb),
    (v_section, 196, 'Scarlet Zeal', 'Tipo: Encanto
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/scarlet-zeal.webp']::text[], '{"clase": "Devastador", "tipo": "Encanto"}'::jsonb),
    (v_section, 197, 'Seismic Tide', 'Tipo: Técnica
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/seismic-tide.webp']::text[], '{"clase": "Guardián", "tipo": "Técnica"}'::jsonb),
    (v_section, 198, 'Shadow End', 'Tipo: Técnica
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shadow-end.webp']::text[], '{"clase": "Devastador", "tipo": "Técnica"}'::jsonb),
    (v_section, 199, 'Shadow Erosion', 'Tipo: Encanto
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shadow-erosion.webp']::text[], '{"clase": "Sabio", "tipo": "Encanto"}'::jsonb),
    (v_section, 200, 'Shadow Impact', 'Tipo: Técnica
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shadow-impact.webp']::text[], '{"clase": "Sabio", "tipo": "Técnica"}'::jsonb),
    (v_section, 201, 'Shadow of Termination', 'Tipo: Técnica
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shadow-of-termination.webp']::text[], '{"clase": "Arcanista", "tipo": "Técnica"}'::jsonb),
    (v_section, 202, 'Shadow Vengeance', 'Tipo: Encanto
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shadow-vengeance.webp']::text[], '{"clase": "Arcanista", "tipo": "Encanto"}'::jsonb),
    (v_section, 203, 'Shadowstep', 'Tipo: Encanto
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shadowstep.webp']::text[], '{"clase": "Devastador", "tipo": "Encanto"}'::jsonb),
    (v_section, 204, 'Shadowy Current', 'Tipo: Encanto
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shadowy-current.webp']::text[], '{"clase": "Profeta", "tipo": "Encanto"}'::jsonb),
    (v_section, 205, 'Sharp Feathers', 'Tipo: Encanto
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/sharp-feathers.webp']::text[], '{"clase": "Conquistador", "tipo": "Encanto"}'::jsonb),
    (v_section, 206, 'Shattering Dance', 'Tipo: Técnica
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shattering-dance.webp']::text[], '{"clase": "Devastador", "tipo": "Técnica"}'::jsonb),
    (v_section, 207, 'Shattering Ice', 'Tipo: Encanto
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shattering-ice.webp']::text[], '{"clase": "Destructor", "tipo": "Encanto"}'::jsonb),
    (v_section, 208, 'Shattering Sigil', 'Tipo: Técnica
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/shattering-sigil.webp']::text[], '{"clase": "Duelista", "tipo": "Técnica"}'::jsonb),
    (v_section, 209, 'Snipe', 'Tipo: Técnica
Clase: Monstruo', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/snipe.webp']::text[], '{"clase": "Monstruo", "tipo": "Técnica"}'::jsonb),
    (v_section, 210, 'Solaris Storm', 'Tipo: Técnica
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/solaris-storm.webp']::text[], '{"clase": "Devastador", "tipo": "Técnica"}'::jsonb),
    (v_section, 211, 'Soul Breaker', 'Tipo: Encanto
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soul-breaker.webp']::text[], '{"clase": "Conquistador", "tipo": "Encanto"}'::jsonb),
    (v_section, 212, 'Soul Impact', 'Tipo: Encanto
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soul-impact.webp']::text[], '{"clase": "Sabio", "tipo": "Encanto"}'::jsonb),
    (v_section, 213, 'Soul Pact Resonance', 'Tipo: Encanto
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soul-pact-resonance.webp']::text[], '{"clase": "Dominador", "tipo": "Encanto"}'::jsonb),
    (v_section, 214, 'Soul Piercer', 'Tipo: Técnica
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soul-piercer.webp']::text[], '{"clase": "Conquistador", "tipo": "Técnica"}'::jsonb),
    (v_section, 215, 'Soul Protection', 'Tipo: Encanto
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soul-protection.webp']::text[], '{"clase": "Guardián", "tipo": "Encanto"}'::jsonb),
    (v_section, 216, 'Soul Reap', 'Tipo: Técnica
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soul-reap.webp']::text[], '{"clase": "Profeta", "tipo": "Técnica"}'::jsonb),
    (v_section, 217, 'Soul Spark', 'Tipo: Encanto
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soul-spark.webp']::text[], '{"clase": "Sabio", "tipo": "Encanto"}'::jsonb),
    (v_section, 218, 'Soul Splash', 'Tipo: Encanto
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soul-splash.webp']::text[], '{"clase": "Berserker", "tipo": "Encanto"}'::jsonb),
    (v_section, 219, 'Soulbond Restoration', 'Tipo: Encanto
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soulbond-restoration.webp']::text[], '{"clase": "Dominador", "tipo": "Encanto"}'::jsonb),
    (v_section, 220, 'Soulfire Protection', 'Tipo: Encanto
Clase: Berserker', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soulfire-protection.webp']::text[], '{"clase": "Berserker", "tipo": "Encanto"}'::jsonb),
    (v_section, 221, 'Soulweave', 'Tipo: Encanto
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/soulweave.webp']::text[], '{"clase": "Profeta", "tipo": "Encanto"}'::jsonb),
    (v_section, 222, 'Source of Vitality', 'Tipo: Encanto
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/source-of-vitality.webp']::text[], '{"clase": "Paladín", "tipo": "Encanto"}'::jsonb),
    (v_section, 223, 'Spirit Aegis', 'Tipo: Técnica
Clase: Dominador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/spirit-aegis.webp']::text[], '{"clase": "Dominador", "tipo": "Técnica"}'::jsonb),
    (v_section, 224, 'Spirit in Fire', 'Tipo: Encanto
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/spirit-in-fire.webp']::text[], '{"clase": "Conquistador", "tipo": "Encanto"}'::jsonb),
    (v_section, 225, 'Star Shattering Slash', 'Tipo: Técnica
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/star-shattering-slash.webp']::text[], '{"clase": "Paladín", "tipo": "Técnica"}'::jsonb),
    (v_section, 226, 'Starlight Burst', 'Tipo: Técnica
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/starlight-burst.webp']::text[], '{"clase": "Destructor", "tipo": "Técnica"}'::jsonb),
    (v_section, 227, 'Stone Skin', 'Tipo: Encanto
Clase: Paladín', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/stone-skin.webp']::text[], '{"clase": "Paladín", "tipo": "Encanto"}'::jsonb),
    (v_section, 228, 'Stonechief Summon', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/stonechief-summon.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 229, 'Storm Rhapsody', 'Tipo: Técnica
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/storm-rhapsody.webp']::text[], '{"clase": "Magistro", "tipo": "Técnica"}'::jsonb),
    (v_section, 230, 'Strength Rules', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/strength-rules.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 231, 'Stunning Strike', 'Tipo: Técnica
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/stunning-strike.webp']::text[], '{"clase": "Caballero", "tipo": "Técnica"}'::jsonb),
    (v_section, 232, 'Summoner''s Frenzy', 'Tipo: Encanto
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/summoners-frenzy.webp']::text[], '{"clase": "Arcanista", "tipo": "Encanto"}'::jsonb),
    (v_section, 233, 'Summoning Pact', 'Tipo: Encanto
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/summoning-pact.webp']::text[], '{"clase": "Profeta", "tipo": "Encanto"}'::jsonb),
    (v_section, 234, 'Sunset Sword', 'Tipo: Técnica
Clase: Duelista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/sunset-sword.webp']::text[], '{"clase": "Duelista", "tipo": "Técnica"}'::jsonb),
    (v_section, 235, 'Swirling Blade', 'Tipo: Técnica
Clase: Guardián', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/swirling-blade.webp']::text[], '{"clase": "Guardián", "tipo": "Técnica"}'::jsonb),
    (v_section, 236, 'Tactical Adaptation', 'Tipo: Encanto
Clase: Conquistador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/tactical-adaptation.webp']::text[], '{"clase": "Conquistador", "tipo": "Encanto"}'::jsonb),
    (v_section, 237, 'Tempest Edge', 'Tipo: Encanto
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/tempest-edge.webp']::text[], '{"clase": "Devastador", "tipo": "Encanto"}'::jsonb),
    (v_section, 238, 'Tempest Sphere', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/tempest-sphere.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 239, 'Thalasson Summon', 'Tipo: Técnica
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/thalasson-summon.webp']::text[], '{"clase": "Profeta", "tipo": "Técnica"}'::jsonb),
    (v_section, 240, 'Thunder Judgment', 'Tipo: Encanto
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/thunder-judgment.webp']::text[], '{"clase": "Magistro", "tipo": "Encanto"}'::jsonb),
    (v_section, 241, 'Thunder of Judgment', 'Tipo: Técnica
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/thunder-of-judgment.webp']::text[], '{"clase": "Destructor", "tipo": "Técnica"}'::jsonb),
    (v_section, 242, 'Thunderbolt Mark', 'Tipo: Encanto
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/thunderbolt-mark.webp']::text[], '{"clase": "Magistro", "tipo": "Encanto"}'::jsonb),
    (v_section, 243, 'Tough Soul', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/tough-soul.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 244, 'Treantling Summon', 'Tipo: Técnica
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/treantling-summon.webp']::text[], '{"clase": "Sabio", "tipo": "Técnica"}'::jsonb),
    (v_section, 245, 'Twin Gale', 'Tipo: Técnica
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/twin-gale.webp']::text[], '{"clase": "Magistro", "tipo": "Técnica"}'::jsonb),
    (v_section, 246, 'Unstable Aura', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/unstable-aura.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 247, 'Valor Surge', 'Tipo: Técnica
Clase: Caballero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/valor-surge.webp']::text[], '{"clase": "Caballero", "tipo": "Técnica"}'::jsonb),
    (v_section, 248, 'Vital Rhythm', 'Tipo: Encanto
Clase: Magistro', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/vital-rhythm.webp']::text[], '{"clase": "Magistro", "tipo": "Encanto"}'::jsonb),
    (v_section, 249, 'Void Blessing', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/void-blessing.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 250, 'Void Bubble', 'Tipo: Encanto
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/void-bubble.webp']::text[], '{"clase": "Hechicero", "tipo": "Encanto"}'::jsonb),
    (v_section, 251, 'Void Chant', 'Tipo: Técnica
Clase: Profeta', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/void-chant.webp']::text[], '{"clase": "Profeta", "tipo": "Técnica"}'::jsonb),
    (v_section, 252, 'Warrior''s Essence', 'Tipo: Encanto
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/warriors-essence.webp']::text[], '{"clase": "Guerrero", "tipo": "Encanto"}'::jsonb),
    (v_section, 253, 'Water Assault', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/water-assault.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 254, 'Water Shot', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/water-shot.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 255, 'Water to Ice', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/water-to-ice.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 256, 'Waterling Summon', 'Tipo: Técnica
Clase: Arcanista', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/waterling-summon.webp']::text[], '{"clase": "Arcanista", "tipo": "Técnica"}'::jsonb),
    (v_section, 257, 'Weakening Hex', 'Tipo: Técnica
Clase: Sabio', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/weakening-hex.webp']::text[], '{"clase": "Sabio", "tipo": "Técnica"}'::jsonb),
    (v_section, 258, 'Whirlwind Slash', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/whirlwind-slash.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 259, 'Wind Blade Slash', 'Tipo: Técnica
Clase: Guerrero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/wind-blade-slash.webp']::text[], '{"clase": "Guerrero", "tipo": "Técnica"}'::jsonb),
    (v_section, 260, 'Wind Blade Spiral', 'Tipo: Técnica
Clase: Destructor', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/wind-blade-spiral.webp']::text[], '{"clase": "Destructor", "tipo": "Técnica"}'::jsonb),
    (v_section, 261, 'Wind''s Delight', 'Tipo: Técnica
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/winds-delight.webp']::text[], '{"clase": "Mago", "tipo": "Técnica"}'::jsonb),
    (v_section, 262, 'Wind''s Shadow', 'Tipo: Encanto
Clase: Hechicero', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/winds-shadow.webp']::text[], '{"clase": "Hechicero", "tipo": "Encanto"}'::jsonb),
    (v_section, 263, 'Wind''s Whisper', 'Tipo: Encanto
Clase: Mago', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/winds-whisper.webp']::text[], '{"clase": "Mago", "tipo": "Encanto"}'::jsonb),
    (v_section, 264, 'Windless Lord', 'Tipo: Encanto
Clase: Devastador', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/skills/windless-lord.webp']::text[], '{"clase": "Devastador", "tipo": "Encanto"}'::jsonb);
end
$IMPERIUM$;
