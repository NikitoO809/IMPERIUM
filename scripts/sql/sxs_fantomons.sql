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
    (v_game, 'fantomons', 'Fantomons — Sword x Staff (13 indexados)', 'Fantomons', 'Las criaturas compañeras de Sword x Staff. Cada Fantomon tiene habilidades pasivas y técnicas activas que complementan tu estilo de juego. Rainbow > SSR > SR > R. El desbloqueo adulto se produce en el nivel 108 (Loong Haven, Día 47+).', array['https://eog.gg/assets/sxs/fantomons/aegiswing.webp']::text[], false,
     'Fantomons', '13 Fantomons con rareza y habilidades', 'paw', 'https://eog.gg/assets/sxs/fantomons/aegiswing.webp', 'tier-list', 3)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values
    (v_section, 1, 'Aegiswing', 'Rareza: Rainbow

Radiant Sanctuary · PASSIVE · At the start of battle, grants the character Guardian Angel for 3 turns. When this status expires, restores 50% of their lost HP and grants them Power Unsealed for the entire battle. · Radiant Halo · TECHNIQUE', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/aegiswing.webp']::text[], '{"rareza": "Rainbow", "tier": "SSS"}'::jsonb),
    (v_section, 2, 'Armopi', 'Rareza: SSR', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/armopi.webp']::text[], '{"rareza": "SSR", "tier": "S"}'::jsonb),
    (v_section, 3, 'Boaro', 'Rareza: SR

Mountain Protection · PASSIVE · Triggers when the caster cumulatively loses 15% of max HP, granting a shield based on the caster''s DEF. Can trigger up to 5 times per battle. · Crash · TECHNIQUE', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/boaro.webp']::text[], '{"rareza": "SR", "tier": "A"}'::jsonb),
    (v_section, 4, 'Chomusuke', 'Rareza: SR', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/chomusuke.webp']::text[], '{"rareza": "SR", "tier": "A"}'::jsonb),
    (v_section, 5, 'Falko', 'Rareza: SR

Golden Flash · PASSIVE · When a damaging Technique is used on enemies, deals Physical DMG once to one of the targets and all enemies 1 grid around. · Golden Feather · TECHNIQUE', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/falko.webp']::text[], '{"rareza": "SR", "tier": "A"}'::jsonb),
    (v_section, 6, 'Herbote', 'Rareza: SSR', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/herbote.webp']::text[], '{"rareza": "SSR", "tier": "S"}'::jsonb),
    (v_section, 7, 'Kels', 'Rareza: SSR

Purging Spell · PASSIVE · When a damaging Technique is used on enemies, deals Water DMG once to one of the targets and randomly dispels 1 buff. Can trigger only once per turn. · Water Orb · TECHNIQUE', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/kels.webp']::text[], '{"rareza": "SSR", "tier": "S"}'::jsonb),
    (v_section, 8, 'Mandragora', 'Rareza: SSR', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/mandragora.webp']::text[], '{"rareza": "SSR", "tier": "S"}'::jsonb),
    (v_section, 9, 'Nyxarchon', 'Rareza: Rainbow

Requiem Blast · PASSIVE · When a damaging Technique is used on enemies, deals Dark DMG once to one of the targets and all enemies 2 grids around, with a 100% chance to inflict 1 stack of 10% DEF Reduction (max 3 stacks) for 2 turns. Can trigger only twice every 2 turns. (Large targets may take multiple hits.) · Shadow Sweep · TECHNIQUE', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/nyxarchon.webp']::text[], '{"rareza": "Rainbow", "tier": "SSS"}'::jsonb),
    (v_section, 10, 'Pandarial', 'Rareza: SR', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/pandarial.webp']::text[], '{"rareza": "SR", "tier": "A"}'::jsonb),
    (v_section, 11, 'Sylvaerie', 'Rareza: SSR

Wind Embrace · PASSIVE · Increases the caster''s ATK and SPD for 1 turn after the caster''s turn ends. · Glow Glob · TECHNIQUE', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/sylvaerie.webp']::text[], '{"rareza": "SSR", "tier": "S"}'::jsonb),
    (v_section, 12, 'Terragon', 'Rareza: SR', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/terragon.webp']::text[], '{"rareza": "SR", "tier": "A"}'::jsonb),
    (v_section, 13, 'Zeioletus', 'Rareza: SSR

Lotus Step · PASSIVE · When a damaging Technique is used on enemies, deals Light DMG once to one of the targets and all enemies 1 grid around, knocking them airborne. Can trigger only twice every 2 turns. (Deals 20% more DMG to large targets.) · Aura Shot · TECHNIQUE', 'https://eog.gg/games/sword-x-staff/', false, array['https://eog.gg/assets/sxs/fantomons/zeioletus.webp']::text[], '{"rareza": "SSR", "tier": "S"}'::jsonb);
end
$IMPERIUM$;
