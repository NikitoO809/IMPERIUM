DO $sxsq$
DECLARE v_section_id uuid;
BEGIN

-- Borrar si ya existe
DELETE FROM section_blocks sb USING game_sections gs
  WHERE sb.section_id = gs.id AND gs.game_id = '7137eaf9-fbc4-4ade-b36f-cf73221d10cd' AND gs.slug = 'artefactos';
DELETE FROM game_sections WHERE game_id = '7137eaf9-fbc4-4ade-b36f-cf73221d10cd' AND slug = 'artefactos';

INSERT INTO game_sections (game_id, slug, title, intro_title, intro, intro_images, is_published)
VALUES ('7137eaf9-fbc4-4ade-b36f-cf73221d10cd', 'artefactos', 'Artefactos', 'Guía Definitiva de Artefactos',
  'Los artefactos en Call of Dragons son objetos especiales que se pueden equipar en los héroes para potenciar sus habilidades en batalla. Esta guía cubre todo sobre los artefactos: cómo obtenerlos, activarlos, equiparlos, mejorarlos y cuáles son los mejores para cada héroe.',
  ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/Call-of-Dragons-artifact-300x216.jpg']::text[], true)
RETURNING id INTO v_section_id;

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 1, '¿Qué son los Artefactos en Call of Dragons?',
  'If you’re an experienced player of Call of Dragons, you’re likely aware that your heroes need powerful weapons to maximize their potential.

These weapons, called Artifacts, can be found as you progress through the game, and they offer a range of stats and abilities that can be used to equip your heroes with the best possible gear.

Artifacts are essential in boosting the combat abilities and damage output of your heroes, whether you’re battling other players in PvP or facing off against challenging PvE enemies such as
Darklings, Dark Creatures
, and
Behemoths
.

Additionally, Artifacts can also improve non-combat skills like Gathering, Legion Load Capacity, and Building Engineering.

Each Artifact comes with a powerful active skill that can be utilized during battle to gain instant resources or to weaken enemy units and strengthen your own.',
  'https://cod.guide/artifacts/', false, ARRAY[]::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 2, 'Mejores Héroes para Usar con Artefactos',
  'Name
Tier
Type(s)
Hero To Pair
Range
Attributes
Ancient Tree Roots
Legendary
Gathering | Health
None
Legion Load Capacity +24.7% | Legion HP +5.5%
Bloodblade Banner
Legendary
Rally | Assault
None
Rallied Army ATK +19.8% | Legion DEF +6.5%
Breath of Jargentis
Legendary
Magic | Support
Near
Magic Unit Magic ATK +19.8% | Legion ATK +6.5%
Breath of the Forest
Legendary
Garrison | Support
None
Garrisoned Army ATK +19.8% | Legion DEF +6.5%
Fang of Ashkari
Legendary
Magic | PvP | Tank
Melee
Near
Magic Unit DEF +19.8% | Legion DEF +6.5%
Greymar''s Warhammer
Legendary
Infantry | Control
Near
Infantry unit DEF +19.8% | Legion DEF +6.5%
Heart of Kamasi
Legendary
Marksman | PvP | Support
Near
Marksman Unit DEF +19.8% | Legion DEF +6.5%
Kingslayer
Legendary
Cavalry | PvP | Assault
Near
Cavalry Unit ATK +19.8% | Legion ATK +6.5%
Kurrata''s Wrath
Legendary
Peacekeeping
Near
Peacekeeping Damage +26.4% | Legion ATK +6.5%
Lucia''s Horn
Legendary
Gathering
Far
Gather Speed +24.7% | Legion DEF + 6.5%
Phoenix Eye
Legendary
Magic | Assault
Near
Magic Unit Magic ATK +19.8% | Legion ATK +6.5%
Shadowblade
Legendary
Marksman | PvP | Assault
Medium
Marksman Unit ATK + 19.8% | Legion ATK + 6.5%
Sorland''s Blade
Legendary
Cavalry | PvP | Assault
Near
Cavalry Unit ATK +19.8% | Legion March Speed +7.5%
Springbird Feather
Legendary
Mobility
Any
None
Legion March Speed +24.7% | Legion HP +5.5%
Springs of Silence
Legendary
Infantry | PvP | Assault
Near
Infantry Unit ATK +19.8% | Legion ATK +6.5%
Staff of the Prophet
Legendary
Magic | Mobility
Very Far
Magic Unit HP +16.8% | Legion HP +5.5%
Storm Arrows
Legendary
Cavalry | Mobility
Medium
Cavalry Unit ATK +19.8% | Legion ATK +6.5%
Tear of Arbon
Legendary
Magic | PvP | Support
Near
Magic Unit DEF +19.8% | Legion DEF +6.5%
Amulet of Glory
Epic
Cavalry | Peacekeeping
Near
Cavalry Unit HP +15.8% | Peacekeeping Damage Taken +7.5%
Archery Master''s Manuel
Epic
Marksman | PvP
Marksman Unit DEF +16.8% | Legion DEF +4.5%
Blade of Reproach
Epic
Cavalry | Peacekeeping
Cavalry Unit ATK +16.8% | Peacekeeping Damage +7.5%
Butcher''s Balde
Epic
Infantry | PvP | Assault
Infantry Unit ATK +16.8% | Legion ATK +4.5%
Centaur Bow
Epic
Cavalry | PvP | Assault
Cavalry Unit DEF +16.8% | Legion DEF +4.5%
Cloak of Stealth
Epic
Cavalary | Mobility
Cavalry Unit ATK +16.8% | Legion ATK +4.5%
Codex of Prophecy
Epic
Infantry | Peacekeeping
Infantry unit DEF +16.8% | Peacekeeping Damage Taken +7.5%
Freezing Ring
Epic
Magic | Tank
Near
Magic Unit DEF +16.8% | Legion HP +4%
Giant''s Bone
Epic
Peackeeping
Peacekeeping Damage +21.7% | Legion ATK +4.5%
Greenfinger Sickle
Epic
Gathering
None
Legion Load Capacity +21.7% | Legion HP +4%
Heartpiercer
Epic
Marksman | PvP | Assault
Medium
Marksman Unit ATK +16.8% | Legion ATK +4.5%
Homecoming Blossom
Epic
Mobility
Any
Very Far
Legion March Speed +21.7% | Legion DEF +4.5%
Magic Bomb
Epic
Magic | PvP | Assault
Far
Magic Unit ATK +16.8% | Legion ATK +4.5%
Potion of Vigor
Epic
Infantry | Engineering
Build Engineering +21.7% | Legion HP +4%
Spirit Bangle
Epic
Magic | PvP | Support
Magic Unit HP +15.8% | Legion HP +4%
Staff of Spring
Epic
Magic | PvP | Support
Magic Unit HP +15.8% | Legion HP +4%
Bone Cleaver
Elite
Cavalry | PvP | Assault
Cavalry Unit ATK +14.8% | Legion DEF +4.5%
Boots of Swiftness
Elite
Mobility
Any
Legion March Speed +17.7% | Legion HP +4%
Crown of the Berserker
Elite
Cavalry | PvP
Cavalry Unit ATK +14.8% | Legion ATK +4.5%
Ever-Ice
Elite
Magic | PvP | Assault
Magic Unit DEF +14.8% | Legion HP +4%
Harlequin Mask
Elite
Infantry | Peacekeeping
Infantry unit DEF +14.8% | Legion DEF +4.5%
Rapid Crossbow
Elite
Marksman | PvP | Assault
Marksman Unit HP +12.8% | Legion ATK +4.5%
Enchanted Coins
Advanced
Gather | Attack
Gather Speed +10% | Legion ATK +1.5%
Joyous Fireworkds
Advanced
Engineering | Health
Build Engineering +10% | Legion HP +1.5%
Storm Leaf
Advanced
Gather | Defense
Legion Load Capacity +10% | legion DEF +1.5%

Melee

Read more:
Artifact Tier List',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/ancient-tree-roots.png','https://cdn.cod.guide/wp-content/uploads/2023/02/indis.png','https://cdn.cod.guide/wp-content/uploads/2023/02/pan.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 3, 'Lista Completa de Artefactos',
  'Legendary Artifacts',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/shadowblades.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 4, 'Shadowblades',
  'Marksman | PvP | Assault

Marksman Unit ATK +24%
Legion ATK +22%

Skill
: Shadow Games
Cooldown
: 1m 30s
Rage Cost
: 1,200

Deals Artifact Skill damage (Physical Damage Factor 3,600) to up to 5 enemy Legions in a designated rectangle. Each Legion takes 15% less damage per additional target.

When thrown, these paper-thin knives fly through the night like the shadow of the moon, completing their mission without a sound.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/sorland-blade.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 5, 'Soland’s Blade',
  'Cavalry | PvP | Assault

Cavalry Unit ATK +24%
Legion March Speed +18%

Skill
: Sword Oath
Cooldown
: 1m 30s
Rage Cost
: 600

Deals Artifact Skill damage (Physical Damage Factor 3,200) to up to 2 enemy Legions in a designated arc. Legions take 25% less damage per additional target. Grants your Legions Haste, increasing March Speed by 20% for 10s.

Since the age of the Heptarchy, House Sorland’s Blade has had only one mission—to guard and protect, bringing glory to the Sons of the Stag.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/kurratas-wrath.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 6, 'Kurrata’s Wrath',
  'Peacekeeping

Peacekeeping Damage +26.4%
Legion ATK +22%

Skill
: Wolf Pack
Cooldown
: 1m 30s
Rage Cost
: None

Casts on up to 10 friendly Legions in a designated circle, increasing damage they deal to Darklings and Dark Creatures by 40% for 10s.

The gauntlets that Kurrata used in a Duel of Honor. Upon the last drum beat, all of Wilderburg would know his name.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/springs-of-silence.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 7, 'Springs of Silence',
  'Infantry | PvP | Assault

Infantry Unit ATK +24%
Legion ATK +22%

Skill
: Fleeting Beauty
Cooldown
: 1m 30s
Rage Cost
: 400

Deals Artifact Skill damage to up to 3 enemy Legions in a designated arc (Physical Damage Factor 3,200). Each additional target reduces the damage dealt to each target by 15%. Legions that take damage also gain Slow, reducing their March Speed by 20% for 19s.

Those cut down by these twin daggers don’t even have time to scream. The flowing blood does all the talking.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/lucias-horn.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 8, 'Lucia’s Horn',
  'Gathering

Overall Gather Speed +24.7%
Legion DEF +22%

Skill
: Bounty of Nature
Cooldown
: 2h
Rage Cost
: None

Casts immediately. After a short charge-up, a random Resource Point located in Alliance territory near your Legion is refreshed (minimum level 7, maximum level 7). Charging cannot be interrupted.

A horn blessed by the Elven Queen. Its power to summon forth life has not faded with time.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/ancient-tree-roots.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 9, 'Ancient Tree Roots',
  'Gathering

Legion Load Capacity +24.7%
Legion HP+22%

Skill
: Geomancy
Cooldown
: 30s
Rage Cost
: None

Casts immediately. After a short charge-up, teleports your Legion to a random unmanned high-level Resource Point within a certain range. Moving, being attacked, or gaining control effects can interrupt charging.

Where Titan fell, the Ancient Tree stands tall. The land’s memories lie deep within its labyrinthine roots.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/tear-of-arbon.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 10, 'Tear of Arbon',
  'Magic | PvP | Support

Magic Unit DEF +24%
Legion DEF +22%

Skill
: Divine Mercy
Cooldown
: 1m 30s
Rage Cost
: 1,600

Casts on up to 4 friendly Legions in a designated circle, healing lightly wounded units every 2s for 8s (Healing Factor 800).

According to legends, this transparent stone formed from a tear of Arbon has powerful protective and healing abilities.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/fang-of-ashkari.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 11, 'Fang Ashkari',
  'All-Rounder | PvP | Tank

Legion DEF +24%
Legion DEF +22%

Skill
: Thundershadow
Cooldown
: 1m 30s
Rage Cost
: 400

Casts immediately, dealing Artifact Skill damage every second to up to 4 Legions in a circle surrounding the caster for 8s (Damage Factor 1,000). Each additional target reduces damage dealt to each target by 15%.

Thunder resounds in the air. Black clouds fill the sky. Demons weep, gods howl. This fang is all that remains of a once mighty dragon.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/breath-of-Jargentis.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 12, 'Breath of the Forest',
  'Garrison | Support

Garrisoned Army ATK +24%
Legion DEF +22%

Skill
: Deepwoods Symphony
Cooldown
: None
Rage Cost
: None

Takes effect while serving as Garrison Captain. When garrisoning a City or Stronghold, your Legion randomly gains one of the following effects every 30s: Ode (heals once every 2s for IOS, Healing Factor 600); Hymn (grants Vigor, increasing HP by 30% for iOS); or Aria (removes one debuff every 2s for 6s).

A five-stringed lyre played by the Elven Queen. Its sound is like that of a spring breeze, enduring, full of life.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/bloodblade-banner.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 13, 'Bloodblade Banner',
  'Rally | Assault

Rallied Army ATK +24%
Legion DEF +22%

Skill
: Warrior Spirit
Cooldown
: None
Rage Cost
: None

Once your Rallied Army enters battle, it deals Artifact Skill damage once every 30s (Physical Damage Factor 1,300), and your Legion gains Physical Keen, increasing their Physical ATK by 10% for 10s.

The banner of the Bloodblade Clan. Blessed by shamans, it stands unwavering, endowed with the glory of the Clan’s brave warriors.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/heart-of-kamasi-1.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 14, 'Heart of Kamasi',
  'Marksman | PvP | Support

Marksman Unit DEF +24%
Legion DEF +22%

Skill
: Earthen Judgement
Cooldown
: 1m 30s
Rage Cost
: 1,200

Casts immediately. 3 friendly Legions (including the caster) gain Physical Keen and Onslaught for IOS, increasing their Physical ATK by 30% and increasing normal attack damage dealt by 30%. Only takes effect when a Legion is composed entirely of Marksman units.

After saving the Tavrosi from the Sunset of the Gods, the Earth Spirit Kamasi bestowed upon them a precious gem which held his remaining power—the power of the earth itself.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/staff-of-the-prophet.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 15, 'Staff of the Prophet',
  'Magic | Mobility

Magic Unit HP +20%
Legion HP +17%

Skill
: Toward the Light
Cooldown
: 8h
Rage Cost
: 1,200

Casts on a selected friendly Legion within the current Region and .within Alliance territory. After a 15s charge-up, 6 surrounding friendly Legions (including the target) are teleported to that Legion’s location. Teleportation will prioritize your Legions.

Legends speak of a prophet who accepted a great mission from the God of Light. With his staffin hand, he led Humankind out of the Endless Night.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/wolf-woman-of-haelor.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 16, 'Wolf-Woman of Haelor',
  'Cavalry | Mobility

Cavalry Unit HP +20%
Legion HP +17%

Skill
: Wolfshadow
Cooldown
: 1m 30s
Rage Cost
: None

Immediately teleports your Legion to a designated empty area (range 24). Legion returns to their original position when the Skill is cast again, or 15s after casting.

The Wolf-Woman of Haelor Glacier is a well-known tale. Beneath her wolf mask, she was a true wolfrider.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/dragonrift.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 17, 'Dragonrift',
  'Cavalry | Mobility

Cavalry Unit HP +20%
Legion HP +17%

Skill
: Wolfshadow
Cooldown
: 1m 30s
Rage Cost
: None

Immediately teleports your Legion to a designated empty area (range 24). Legion returns to their original position when the Skill is cast again, or 15s after casting.

The Wolf-Woman of Haelor Glacier is a well-known tale. Beneath her wolf mask, she was a true wolfrider.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/phoenix-eye.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 18, 'Phoenix Eye',
  'Magic | PvP | Assault

Magic Unit ATK +24%
Legion ATK +22%

Skill
: Burst Strike
Cooldown
: 1m 30s
Rage Cost
: 1,600

Deals Artifact Skill damage to up to 5 surrounding enemy Legions in a circle (Magic Damage Factor 4,000). Each Legion takes 15% less damage for each additional target.

An eye lost by the Phoenix during the Sunset of the Gods. The fire that • should have died out still burns furiously within.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/kingslayer.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 19, 'Kingslayer',
  'Cavalry | PvP | Assault

Cavalry Unit ATK +24%
Legion ATK +22%

Skill
: Burst Strike
Cooldown
: 1m 30s
Rage Cost
: 600

Deals Artifact Skill damage (Physical Damage Factor 3,600) to up to 5 enemy Legions in a designated arc. Legions take 15% less damage per additional target. Legions that have fewer than 10% units remaining will be immediately defeated (only takes effect on Legions of other Lords).

The tolling bells signal the end of the trial. The true king’s hands shake in the twilight, and the false king’s head laughs in the flames.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/breath-of-Jargentis.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 20, 'Breath of Jargentis',
  'Magic | PvP | Support

Magic Unit ATK +24%
Legion ATK +22%

Skill
: Acid Breath
Cooldown
: 1m 30s
Rage Cost
: 1,600

Inflicts DEF Break on up to 10 enemy Legions in a designated circle, reducing their DEF by 32% for 20s. If cast again, DEF Break does not stack, but its duration is reset.

The saliva of a primal, venomous dragon. What is perhaps more surprising is that the bottle containing it remains intact.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/storm-arrows.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 21, 'Storm Arrows',
  'Cavalry | Mobility

Cavalry Unit ATK +24%
Legion ATK +22%

Skill
: Blink
Cooldown
: 1m 30s
Rage Cost
: None

Immediately teleports your Legion to a designated empty area (range 30) and grants them Rampage, increasing their damage dealt by for 4s.

A magical arrow used during the’ Night of Storms that changed the history of Jargand.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/springs-of-silence.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 22, 'Springbird Feather',
  'Mobility

Legion March Speed +24.7%
Legion HP +17%

Skill
: Mighty Tailwind
Cooldown
: 1m 30s
Rage Cost
: None

Casts immediately. Grants Haste to your Legion and up to 10 surrounding friendly Legions, increasing your Legion’s March Speed by 48% and friendly Legions’ March Speed by 32% for 10s.

A feather of the Springbird that led Tiyar to Whitewing Peak. A symbol of the Holy Light.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/greymars-warhammer.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 23, 'Greymar’s Warhammer',
  'Infantry | PvP | Control

Infantry Unit DEF +24%
Legion DEF +22%

Skill
: Ground Pound
Cooldown
: 1m 30s
Rage Cost
: 400

Casts immediately. Deals Artifact Skill damage (Physical Damage Factor 3,200) to up to 5 surrounding enemy Legions in a circle and Stuns them for 2s. The damage dealt to each target is reduced by 15% for each additional target. This effect can only be triggered once every 10s.

A warhammer crafted by the great weaponsmith Greymar. It is light as a feather—unless one is hit by it.

Epic Artifacts',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/heartpiercer.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 24, 'Heartpiercer',
  'Marksman | PvP | Assault

Marksman Unit ATK +20%
Legion ATK +18%

Skill
: Heart Shot
Cooldown
: 1m 30s
Rage Cost
: 1,200

Deals Physical Artifact Skill damage to the target Legion (Physical Damage Factor 2,000), and has a 65% chance to inflict Physical DEF Break, reducing their Physical DEF by for 3s.

A well-crafted crossbow whose arrows have only one target. Shot through the heart? This thing’s probably to blame.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/heartpiercer.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 25, 'Archery Master’s Manual',
  'Marksman | PvP

Marksman Unit DEF +20%
Legion DEF +18%

Skill
: Steady Shot
Cooldown
: 1m 30s
Rage Cost
: 1,200

Casts immediately. Your Legion gains Keen, increasing their ATK by for 20s.

One of three manuals composed by Archery Master Omer. Its exquisite drawings could be understood even by a child.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/heartpiercer.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 26, 'Magic Bomb',
  'Marksman | PvP
| Assault

Marksman Unit ATK +20%
Legion ATK +18%

Skill
: Time Bomb
Cooldown
: 1m 30s
Rage Cost
: 1,600

Throws a Magic Bomb at the target Legion. After 8s, the Magic Bomb explodes, dealing Artifact Skill damage to up to 3 nearby enemy Legions (Magic Damage Factor 1,800). Each additional target reduces damage dealt to each target by 15%.

“Hurry up, but don’t cut the wrong fuse!” “…This thing doesn’t have any, you idiot!”',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/giants-bone.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 27, 'Giant’s Bone',
  'Peacekeeping

Peacekeeping Damage +21.7%
Legion ATK +18%

Skill
: Power Strike
Cooldown
: 1m 30s
Rage Cost
: None

Deals Artifact Skill damage to up to 3 enemy Legions in a forward arc (Damage Factor 2,000, only affects Darklings, Dark Creatures, and Behemoths). Each additional target reduces damage dealt to each target by 15%. In addition, there is a 65% chance to knock the targets Airborne for 3s.

The leg bone of a Giant, used by a warrior as a weapon. The fractures across it are signs of his power and glory.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/staff-of-spring.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 28, 'Staff of Spring',
  'Magic | PvP | Support

Magic Unit HP +17%
Legion HP +15%

Skill
: Salve
Cooldown
: 1m 30s
Rage Cost
: 1,600

Heals lightly wounded units in the target Legion (Healing Factor 2,400).

This staff is proof of the Druids’ maxim: arcane magic is a soulless art, and only the tree of life springs eternal.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/homecoming-blossom.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 29, 'Homecoming Blossom',
  'Mobility

Legion March Speed +21.7%
Legion DEF +18%

Skill
: Recall
Cooldown
: 30m
Rage Cost
: None

Casts immediately. After a short charge-up, teleports Legions back to near your City. Moving, being attacked, or receiving control effects can interrupt charging.

A pair of magical plants that nurture• the bond between a traveler and their home.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/spirit-bangle.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 30, 'Spirit Bangle',
  'Magic | PvP | Support

Magic Unit HP +17%
Legion HP +15%

Skill
: Cleansing Charm
Cooldown
: 3m
Rage Cost
: None

Casts immediately. Removes 1 debuff or impairment effect from up to 5 surrounding friendly Legions. This Artifact Skill can still be cast while Legions are subject to control effects.

A bangle created by the Great Shaman of the Witchtongue Clan that allows its wearer to stay calm in • the face of danger.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/potion-of-vigor.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 31, 'Potion of Vigor',
  'Infantry | Engineering

Building Engineering +21.7%
Legion HP +15%

Skill
: Quick Build
Cooldown
: 6h
Rage Cost
: None

Casts immediately. Increases Legions’ Engineering by 100% for 1,800s.

A powerful medicine with a honey-sweet flavor which gives slaves the motivation to get through the drudgery of the workday.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/freezing-ring.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 32, 'Freezing Ring',
  'Magic | Tank

Magic Unit DEF +20%
Legion HP +15%

Skill
: Frost Barrier
Cooldown
: 4m
Rage Cost
: None

Casts immediately. Grants Ice Defense to your Legion, making it immune to all damage, but unable to carry out actions. Effective for up to 10s. After Ice Defense ends, up to 10 surrounding enemy Legions are Slowed, reducing their March Speed by 30% for 8s. Casting again while Ice Defense is still active will cancel Ice Defense prematurely.

This ice-blue ring emits a disconcertingly frigid aura. Perhaps • the secret to invincibility lies in stillness.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/cloak-of-stealth.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 33, 'Cloak of Stealth',
  'Cavalry | Mobility

Cavalry Unit ATK +20%
Legion ATK +18%

Skill
: Subterfuge
Cooldown
: 1h
Rage Cost
: None

Casts immediately. Grants Legions Stealth for 1,800s, reducing their March Speed by 15%. While in Stealth, Legions cannot be normally detected, and can only be seen if they move too close to the enemy. Actively attacking, taking damage, or opening Chests will cause Stealth to expire.

In war, speed is crucial. The maker of this cloak believed that remaining unseen is just as important.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/greenfinger-sickle.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 34, 'Greenfinger Sickle',
  'Gathering

Legion Load Capacity +21.7%
Legion HP +15%

Skill
: Quick Gather
Cooldown
: 12h
Rage Cost
: None

Casts while gathering Gold, Wood, Ore, and Mana. Immediately gathers resources from a chosen Resource Point (Gold/Wood 400,000, Ore 300,000, Mana 160,000). Resources gathered cannot exceed the Legion’s resource Load Capacity or the remaining amount of resources at the Resource Point.

An elaborate sickle made with arcane magic, capable of trimming • weeds with as much precision as one’s bare hands.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/codex-of-prophecy.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 35, 'Codex of Prophecy',
  'Infantry | Peacekeeping

Infantry Unit DEF +20%
Peacekeeping Damage Taken -12%

Skill
: Sacred Shield
Cooldown
: 1m 30s
Rage Cost
: None

Casts immediately. Grants a Shield to your Legion and up to 9 nearby friendly Legions which can absorb a certain amount of damage from Darklings, Dark Creatures, and Behemoths only (Shield Factor 2,400) for 15s. Shields do not stack.

A thousand-year-old collection of secret prophetic warnings against disaster.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/amulet-of-glory.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 36, 'Amulet of Glory',
  'Cavalry | Peacekeeping

Infantry Unit HP +17%
Peacekeeping Damage Taken -12%

Skill
: Protective Aura
Cooldown
: 1m 30s
Rage Cost
: None

Casts immediately. Grants a Buff once per 2s to your Legion and up to 4 nearby friendly Legions, reducing the damage they take from Darklings and Dark Creatures by for 15s.

An amulet blessed by the Light to silently safeguard believers’ faith as they walk in darkness.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/blade-of-reproach.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 37, 'Blade of Reproach',
  'Cavalry | Peacekeeping

Cavalry Unit ATK +20%
Peacekeeping Damage +12%

Skill
: Reproach
Cooldown
: 45s
Rage Cost
: None

Casts on a target Legion (Darklings, Dark Creatures, and Behemoths only), dealing Artifact Skill damage once (Physical Damage Factor 2,000). If this Skill successfully kills the target Legion, 1 buff will be gained. For each buff, Reproach’s damage is increased by 20%, stacking up to 5 times. This buff effect lasts until the Legion returns to the City, or enters a Stronghold or a Resource Point.

The sword of Florin, Knight of Daybreak, given the power to repel the darkness by the priest of the Abbey of Mount Helios.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/butchers-blade.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 38, 'Butcher’s Blade',
  'Infantry | PvP | Assault

Infantry Unit ATK +20%
Legion ATK +18%

Skill
: Butchering Blow
Cooldown
: 1m 30s
Rage Cost
: 400

Casts immediately, dealing Artifact Skill damage twice to up to 3 enemy Legions in a forward arc (Physical Damage Factor 900). Each additional target reduces damage dealt to each target by 15%.

They called him the “Butcher of Dreadfang”. With this blade in hand,’ an Orcish warrior singlehandedly revived the fortunes of his clan.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/centaur-bow.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 39, 'Centaur Bow',
  'Cavalry | PvP | Assault

Cavalry Unit DEF +20%
Legion DEF +18%

Skill
: Hall of Arrows
Cooldown
: 1m 30s
Rage Cost
: 600

Deals Artifact Skill damage (Physical Damage Factor 1,500) to up to 3 enemy Legions in a designated circle. Each Legion takes 15% less damage per additional target.

A gift from a Centaur, who was an excellent scout… and an excellent warrior.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/bomb-flinger.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 40, 'Bomb Flinger',
  'Marksman | Peacekeeping

Marksman Unit ATK +20%
Legion ATK +18%

Skill
: Bombs Away
Cooldown
: 1m 30s
Rage Cost
: None

Deals Artifact Skill damage (Physical Damage Factor 2,400) to the target (Darklings, Dark Creatures, and Behemoths only). Also has a 80% chance to Stun targets that take damage for 2s.

The so-called “Bomb Flinger Uprising” was perhaps the most violent of all the Goblin slave rebellions over the centuries. Its downfall is attributed to neither betrayal nor conspiracy, but the miscalculations of a single idiot.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/bomb-flinger.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 41, 'Enchiridion of Advanced Incantations',
  'Magic  | Peacekeeping

Magic Unit ATK +20%
Legion ATK +18%

Skill
: Fireburst
Cooldown
: 1m 30s
Rage Cost
: None

Deals Artifact Skill damage (Magic Damage Factor 2,800) to the target (Darklings, Dark Creatures, and Behemoths only).

Required reading for anyone undertaking the Advanced Incantation exams. Any student who actually reads it from cover to cover must be either diligent or insane.

Rare Artifacts',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/rapid-crossbow.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 42, 'Rapid Crossbow',
  'Marksman | PvP

Marksman Unit HP +15%
Legion ATK +18%

Skill
: Arrow Strafe
Cooldown
: 1m 30s
Rage Cost
: 1,200

Deals Artifact Skill damage to the target Legion 2 times (Physical Damage Factor 500 each time).

A practical and compact bow that reflects the motto of the weaponsmith who made it: user-friendliness is everything.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/bone-cleaver.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 43, 'Bone Cleaver',
  'Cavalry  | PvP | Assault

Cavalry Unit ATK +18%
Legion DEF +14%

Skill
: Bone Smash
Cooldown
: 1m 30s
Rage Cost
: 600

Deals Artifact Skill damage to the target Legion (Physical Damage Factor 800). Damage Factor is increased to 1,200 when the attacking Legion’s Unit Count is above 50%.

It can cut through the brush to clear. a path and slice up game for food. A necessity for travel.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/bone-cleaver.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 44, 'Ever-Ice',
  'Magic | PvP | Assault

Magic Unit DEF +18%
Legion HP+14%

Skill
: Ice-Cold Heart
Cooldown
: 1m 30s
Rage Cost
: 1,600

Casts on a designated circle. After a short charge-up, deals Artifact Skill damage to 2 enemy Legion(s) (Magic Damage Factor 600) and inflicts Freeze, reducing their March Speed by 10% for 5s.

A piece of ice that never melts, lasting longer any vow of love.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/crown-of-the-berserker.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 45, 'Crown of the Berserker',
  'Cavalry | PvP

Cavalry Unit ATK +18%
Legion ATK +14%

Skill
: Will of the Wolf
Cooldown
: 45s
Rage Cost
: 600

Casts immediately. Your Legion gains Keen and Haste, increasing their ATK by 20% and March Speed by 20%, while also inflicting DEF Break, reducing their DEF by 10%, for 10s.

A Berserker’s reward. Don this crown and greet your next bloody battle head-on.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/boots-of-swiftness.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 46, 'Boots of Swiftness',
  'Mobility

Legion March Speed +18%
Legion HP +14%

Skill
: Swiftness
Cooldown
: 45s
Rage Cost
: None

Casts immediately. Grants Haste to your Legion and up to 9 surrounding friendly Legions, increasing their March Speed by 30% for IOS. Afterward, the Legion is Fatigued and gains Slow, reducing their March Speed by for Ss.

These boots to allow soldiers to quickly race to the frontline—in exchange for total fatigue afterward.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/harlequin-mask.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 47, 'Harlequin Mask',
  'Infantry | Peacekeeping

Infantry unit DEF +18%
Legion DEF +14%

Skill
: Taunt
Cooldown
: 30s
Rage Cost
: None

Casts on a target Legion (Darklings, Dark Creatures, and Behemoths only). Attracts the target Legion’s hostility and forces it to attack the commanded Legion for 5s.

With a taunting expression and frantic movements, a true clown knows how to catch a hypocrite’s attention.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/veterans-diary.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 48, 'Veteran’s Diary',
  'Infantry | PvP

Infantry unit ATK +18%
Legion ATK +14%

Skill
: Battle Hardened
Cooldown
: 1m 30s
Rage Cost
: 400

Casts immediately. Your Legion gains Onslaught, increasing normal attack damage dealt by 60% for 10s.

It accompanied its master through life and death until a dagger separated them, and it was the one who survived.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/illusory-gems.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 49, 'Illusory Gems',
  'All-Rounder

Legion Load Capacity + 18.7%
Legion HP +11%

Skill
: Gemstravaganza
Cooldown
: 1m 30s
Rage Cost
: None

Casts immediately. Transforms you into the richest guy on the street.

A pain-reliever developed by a certain black-robed mage. Its joys, though sweet, are short-lived.

Advanced Artifacts',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/enchanted-coins.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 50, 'Enchanted Coins',
  'All-Rounder

Overall Gather Speed +10%
Legion ATK +9%

Skill
: Money Talks
Cooldown
: 1m 30s
Rage Cost
: None

Casts immediately. Donate generously, and scatter your gold upon the earth.

Developed by a certain black-robed mage, this pain-reliever cures all symptoms caused by poverty.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/storm-leaf.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 51, 'Storm Leaf',
  'All-Rounder

Legion Load Capacity +10%
Legion DEF +9%

Skill
: Fierce Gale
Cooldown
: 1m 30s
Rage Cost
: None

Casts immediately. Let them suffer the storm’s wrath… well, displeasure.

What can a leaf do if it doesn’t want • to be carried away by the wind? Only sit and wait to grow tall.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/joyous-fireworks.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 52, 'Joyous Fireworks',
  'All-Rounder

Building Engineering +10%
Legion HP +9%

Skill
: Perfect Moment
Cooldown
: 30s
Rage Cost
: None

Casts immediately. Sets off joyous fireworks.

“Some occasions call for fireworks,” said the shopkeeper. “Of course; I hope your life is filled with such moments.”',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/activating-artifact-1024x541.jpg']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 53, 'Cómo Activar Artefactos',
  'Once you have equipped your hero with an Artifact, you can access it by tapping on the small circled button located next to your hero’s avatar in the top-right corner of the game interface.

During the battle, you can activate the Artifact’s skill, or wait for the cooldown period to finish after its first usage.

Each Artifact has its unique skill, with various effects and powers.

These can range from dealing AoE dâmge to enemies, healing, to farming resources, among others.

Keep in mind that each Artifact’s skill has a cooldown period and rage requirement, so you will have to wait for some time before using it again.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/opening-artifact-in-tavern-1024x576.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 54, '¿Cómo Conseguir Objetos de Artefacto?',
  'To obtain Artifacts in Call of Dragons, you can use Universal Artifact Keys at the Tavern building, where you would normally recruit heroes. Once you have some keys, simply click on the Tavern building and then the second button with the “cards” icon.

This will take you to the Artifact Draw page, where you have two options: using your keys individually or in packs of 10.

Fact: Opening 1 Key or 10 keys at once has the same drop-rate.

Additionally, after 90 draws, you are guaranteed a Legendary Artifact drop.

Remember to use your free daily draw as soon as it becomes available because it doesn’t stack with accumulated keys.

By obtaining Artifacts, you can enhance your hero’s stats and abilities, ultimately leading to a more successful gameplay experience in Call of Dragons.',
  'https://cod.guide/artifacts/', false, ARRAY[]::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 55, 'Llaves de Artefacto',
  'Universal Artifact Keys can be collected through various means in Call of Dragons.

Daily Objectives, event missions, and challenges all offer opportunities to obtain these valuable items.

Additionally, you may be lucky enough to come across them in the Goblin Market, though keep in mind that the items available there are selected at random.

Another way to obtain Universal Artifact Keys is through the Honorary Membership Store. However, you must reach Membership level 6 before you can purchase them with either Gold or Gems.

It’s important to keep an eye out for these keys as they are a valuable resource for obtaining powerful Artifacts for your heroes.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/01/universal-artifact-key.png','https://cdn.cod.guide/wp-content/uploads/2023/02/how-to-equip-artifact-910x1024.jpg']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 56, 'Cómo Equipar Artefactos en Héroes',
  'After obtaining an Artifact, head to your hero’s profile page and click on the empty slot.

From there, choose the Artifact from the list on the left and press the Equip button to assign it to your hero. You can repeat this process to increase the Artifact’s Skill or Level.

To swap an Artifact for one of your heroes, follow the same steps and click the “Replace” button to select a new Artifact.

If you want to remove an Artifact without equipping another, simply click the “Remove” button that appears after pressing “Replace”.

It’s recommended to equip your Artifacts as soon as possible to reap their benefits and progress faster in Call of Dragons.',
  'https://cod.guide/artifacts/', false, ARRAY[]::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 57, 'Rareza de Artefactos',
  'Artifacts in Call of Dragons are classified into four different rarities: Advanced (green), Elite (blue), Epic (purple), and Legendary (gold).

As the rarity increases, the Artifacts become more powerful, with Legendary being the most potent.

The Advanced Artifacts are the most basic ones, and only three of them are available in the game. They do not offer any combat-related bonuses.

The Elite Artifacts have a better Damage Factor than the Advanced ones, but they are still not very powerful compared to the Epic and Legendary ones.

The Epic Artifacts offer a good Damage Factor and effective skills, making them suitable for any type of situation, whether it’s gathering, building, or combat.

On the other hand, the Legendary Artifacts are the most powerful items in the game, offering the highest Damage Factor and devastating active combat skill effects.

However, due to their low drop rate, Legendary Artifacts are the hardest to obtain.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/advanced-artifact-Call-of-Dragons.png','https://cdn.cod.guide/wp-content/uploads/2023/02/elite-artifacts.png','https://cdn.cod.guide/wp-content/uploads/2023/02/epic-artifacts.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 58, 'Cómo Mejorar Artefactos',
  'There are three ways to upgrade your Artifact: by increasing its level, star rating, and skill level.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/level-up-artifacts.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 59, 'Nivel de Artefacto',
  'Your Artifact can reach a maximum level of 40. To level it up, you’ll need Arcane Dust, which comes in various levels and can be obtained from events, defeating Dark Creatures, and opening Dark Chests.

The higher the level of Arcane Dust, the more EXP points it offers.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/upgrade-artifact-star-level-1024x576.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 60, 'Calificación de Estrellas',
  'Your Artifact can have a star rating of up to 4 stars, which is directly related to its level.

You can achieve the second star after increasing the level to 10, the third star at level 20, and the fourth star at level 40.

In addition, you’ll need Artifact Emblems (getting from duplicated artifacts), which come in four types depending on your Artifact’s rarity: Advanced, Elite, Epic, and Legendary.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/inscrease-artifact-skill-level-1024x576.png']::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 61, 'Nivel de Habilidad',
  'You can increase your Artifact’s Skill level up to 5 using Emblems, which are duplicates of the same Artifact.

These Emblems can be obtained from the Altar building.

For example, to upgrade your Artifact’s skill level to 5, you’ll need to collect the same Artifact five times.

To upgrade any of the three features above for your Artifacts, follow these simple steps:

If the Artifact is in your bag, tap the big chest icon at the bottom of the screen to access your bag. From there, tap on the Artifact you want to upgrade and then hit the “Details” button on the right side of the screen.
If the Artifact is currently equipped by a hero, visit the hero’s profile and tap on the Artifact slot to bring up its details.',
  'https://cod.guide/artifacts/', false, ARRAY[]::text[]);

INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
VALUES (v_section_id, 62, 'Cómo Elegir los Mejores Artefactos para tus Héroes',
  'When considering Artifacts, it’s important to pay attention to which type of unit they are best suited for as this can have a significant impact on combat bonuses.

You can find this information listed below the Artifact’s level EXP bar.

For example, it’s not advisable to equip an Artifact with a Magic HP buff on a hero who excels at leading Infantry, Cavalry, or Marksman units.

However, if you have a hero with an Overall talent, meaning they excel at leading all unit types, you can equip them with any Artifact as long as you have Magic units in your legion if the Artifact has a Magic ability.

This way, your Magic units will benefit from the Artifact’s skill.

Not all Artifacts require a specific type of unit, however. Some, such as the Giant’s Bone Artifact, can be equipped by any hero with the Peakeeper talent, regardless of the type of units in their legion.

Others are designed for productivity-related activities like Gathering or Building Engineering.

For example,
Kella
, an Elite hero with the Gather talent, is specialized in gathering Gold and has the Support talent. The ideal Artifact for her would be one suited for Gathering!

This blog is run by the community and for the community. If you want to contribute any Call of Dragons guides, tips, strategies, or any other information, please
contact us
and make the CoD community become better and better every day.',
  'https://cod.guide/artifacts/', false, ARRAY['https://cdn.cod.guide/wp-content/uploads/2023/02/magic-atk-artifact-1024x576.png','https://cdn.cod.guide/wp-content/uploads/2023/02/peacekeeping-artifact-1024x576.png','https://cdn.cod.guide/wp-content/uploads/2023/02/kella.png']::text[]);

END $sxsq$;