DO $BEH$
DECLARE
  v_game_id uuid;
  v_section_id uuid;
BEGIN

  -- Obtener game_id de Call of Dragons
  SELECT id INTO v_game_id FROM games WHERE slug = 'call-of-dragons';

  -- Borrar sección anterior si existe
  DELETE FROM section_blocks WHERE section_id IN (
    SELECT id FROM game_sections WHERE game_id = v_game_id AND slug = 'behemoths'
  );
  DELETE FROM game_sections WHERE game_id = v_game_id AND slug = 'behemoths';

  -- Insertar game_section
  INSERT INTO game_sections (game_id, slug, title, intro_title, intro, intro_images, is_published)
  VALUES (
    v_game_id,
    'behemoths',
    'Behemoths',
    $IT$Behemoths en Call of Dragons$IT$,
    $IN$Behemoths are unique creatures in Call of Dragons that alliances can capture and control. Currently, there are eight different types of Behemoth available in the game. Each one of them has unique skills and stats. When alliances capture Behemoth, they are able to upgrade their skills and research additional buffs and stats.

Behemoths are not that easy to defeat in Call of Dragons, especially if your alliance is new. To defeat Behemoth, you will need good alliance coordination and strong players. Some behemoths are easy to defeat, while others are incredibly hard. To capture Behemoth, your alliance will need to make numerous preparations, such as informing all players about the time of capture, developing tactics on which troops to use, whatbest heroesto use, where to position troops, what Behemoth skills to avoid, and much more.

Once your alliance successfully captures Behemoth, it can start researching and upgrading Behemoth’s skills, and it is then able to summon it to help you in war. Sometimes when you are trying to capture Behemoths with your alliance, there is a chance that you will lag or will not be able to see, so we recommend youdownload and play Call of Dragons on PC. Do not forget toredeem all codesthat will give you free rewards like gems, resources, and keys.

In order to upgrade it, your alliance members will have to donate resources. When they donate, they will getMember Points. That is why it is important to have an alliance with a lot of active players who will donate every day.

There are some rules that you have to follow when it comes to summoning Behemoth:

Only alliance leaders and officers can summon them.

Each alliance can only summon one Behemoth on the map, which means that you can not have more than one on the map.

When you summon Behemoth it will start a cooldown. You have to wait for that cooldown to summon it again.$IN$,
    ARRAY[]::text[],
    true
  ) RETURNING id INTO v_section_id;

  -- Bloque 1: Flame Dragon
  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
  VALUES (
    v_section_id,
    1,
    $B1T$Flame Dragon$B1T$,
    $B1C$## Cómo derrotar al Flame Dragon

Coming Soon.

## Flame Dragon Habilidades en guarida

### Lair of the Firedancer
10m after entering battle, the Flame Dragon becomes Enraged, casting Dragonglass Barrage and instantly killing all Legions within its Lair.
### Dragonclaw Strike
Flame Dragon slashes with its mighty claws, dealing Magic Skill damage to all enemy Legions in a forward arc (Damage Factor 1,000).
### Flame Charge
Flame Dragon exhales a surging jet of flame, dealing Magic Skill damage to all enemy Legions in a forward arc (Damage Factor 1,500).
### Tail Strike
Flame Dragon swings its mighty tail, dealing Magic Skill damage to all enemy Legions in a backward arc (Damage Factor 1,000).
### Leaping Strike
Flame Dragon leaps into the air and slams the ground, dealing Magic Skill damage to all surrounding Legions (Damage Factor 2,000).
### Blazing Breath
Flame Dragon breathes fire, knocking away and stunning all troops in a forward arc and dealing Magic Skill damage (30% ofthe Legion’s maximum Unit Count), and generating Shadowflame within radius. Legions caught in Shadowflame take continuous damage (Damage Factor 1,000) for 3s.
### Abyssal Summon
In the second phase, Flame Dragon summons Abyss Lizards to its Lair.
### Shadowflame Charge
Flame Dragon takes flight. After a short charge-up, it plunges toward the ground while exhaling fire, dealing Magic Skill damage to all Legions caught in its flames (40% ofthe Legion’s maximum Unit Count), and generating Shadowflame along its path. Legions caught in Shadowflame take continuous damage (Damage Factor 1,000) for 3s.
### Fireball
Flame Dragon launches a fireball at a random Legion’s location, dealing Magic Skill damage to all nearby Legions (50% of the Legion’s maximum Unit Count).
### Dragon Roar
Flame Dragon gives a terrifying roar, inflicting Terror on all surrounding Legions, causing them to move uncontrollably.
### Conflagration
Flame Dragon launches a devastating fireball at a random Legion’s location, dealing Magic Skill damage to all nearby Legions (100% of the Legion’s maximum Unit Count).
### Shattering Flame
When the Flame Dragon casts Dragonclaw Strike or Flame Charge, all Legions that take damage gain one stack of Shattering Flame, reducing their DEF by 5% for 30s, up to a maximum of 10 stacks. Shattering Flame inflicts a one-hit kill upon reaching the maximum number of stacks.
### Abyssal Strike
The Abyss Lizard slashes with its claws, dealing Magic Skill damage to all surrounding Legions (Damage Factor 500).
### Reptilian Rage
When Abyss Lizards are close together, they form an abyssal bond that increases their ATK and DEF.
### Severing Strike
The Abyss Lizard unleashes an all-out assault, dealing Magic Skill damage to all surrounding Legions (Damage Factor 800).
### Force Detonation
The Abyss Lizard cannot be defeated. When its HP goes below a certain level, it will explode in IOS, dealing Magic Skill damage to all surrounding Legions (15% of the Legion’s maximum Unit Count), and generating 1 Healing Manastone.
### Healing Manastone
When the Abyss Lizard triggers an explosion, it produces 1 Healing Manastone. When gathered, it heals a Legion’s lightly wounded units.

## Flame Dragon Habilidades en Alianza

### Dragonclaw Strike
Flame Dragon deals Magic Skill damage to all surrounding enemy Legions, or all Legions in a forward arc (Damage Factor 600).
Upgrade Preview:Skill Damage Factor600 / 1200 / 1800 / 2400 / 3600
### Burn Out
Flame Dragon flies into the air and breathes fire, dealing Magic Skill damage to all enemy Legions in a forward rectangle (Damage Factor 2,500).
Upgrade Preview:
Skill Damage Factor 2500 / 5000 / 7500 / 10000 / 15000
### Scorch Mark
Flame Dragon casts Scorch Mark when summoned, increasing nearby friendly Legions’ Skill damage dealt by 10% and granting them immunity to control effects for 30s.
Upgrade Preview:Skill damage bonus 10%/ 15%/ / 25%/Duration 30 / 40 / 50 / 60 / 80

## $B1C$,
    'https://callofdragonsguides.com/flame-dragon/',
    false,
    ARRAY['data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2046'%3E%3C/svg%3E']
  );

  -- Bloque 2: Giant Bear
  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
  VALUES (
    v_section_id,
    2,
    $B2T$Giant Bear$B2T$,
    $B2C$## Cómo derrotar al Giant Bear

Giant Bear is one of the firstBehemothsthat you will capture in Call of Dragons, and it is one of the easiest. The problem is that your alliance will try to capture it in the early stages when you will have low-level heroes. So it is important to know how to capture a giant bear in Call of Dragons. The first thing that your alliance, especially your alliance officers, must do is prepare a plan and time of the attack. They have to send the exact time when you will start capturing Giant Bear so alliance members can be online.
Range units and magic commanders are best for fighting against all behemoths, including Giant Bear. So make sure that you use thebest magic heroes in Call of Dragonsandgood hero pairings. You need a few tank pairings that will tank most of the Giant Bear damage. When it comes to artifacts, make sure that you do not use artifacts that have peacekeeping. The reason is that peacekeeping does not work on behemoths. Use artifacts that have bonus damage against behemoths, but if you do not have them, then use any pvpartifact.
Now, Giant Bear is relatively easy to destroy, but you have to know a few mechanics that you have to dodge and avoid. The first one is a red circle that will spawn on the ground. If you stay inside it, you will take a lot of damage, and that is why we recommend you use archers so you will never get hit by it.
The next skill that you have to avoid is a bear charge. You will recognize this skill by 2 straight lines. After a few seconds, the bear will charge, and if he does not hit any players, he will become stunned.
Tanks must use a taunt artifact if they have one. With taunt artifacts, they will pull the bear away from the player so they can not be hit by aoe Giant Bear attacks.
After some time, Giant Bear will spawn a mana stone that you and your alliance members can collect, and it will heal your troops. So if you are getting low on your troop, make sure that you collect it. If you need a visual guide, you can always watch avideo by Hulksden Gamingon how to defeat Giant Bear.

## Giant Bear Habilidades en guarida

### Primal Strength
Giant Bear is immune to all debuff effects and impairment effects.
### Claw Strike
Giant Bear brandishes its deadly claws, dealing Physical Skill damage to all enemy Legions in a forward arc (Damage Factor 300).
### Paw Stomp
Giant Bear stomps on the ground with its paws, dealing Physical Skill damage to all surrounding enemy Legions (Damage Factor 500).
### Earthbreaker
After charging up, Giant Bear smashes the ground, knocking surrounding Legions Airborne and dealing Physical Skill damage (15% of the Legion’s maximum Unit Count).
### Mad Dash
After a short charge-up, Giant Bear rushes forward, dealing Physical Skill damage to all enemy Legions in its path (50% of the Legion’s maximum Unit Count).
### Dumbstruck
If Giant Bear does not hit any Legions while charging, then it is briefly Stunned, and its DEF is reduced by 20%. Healing Manastone also appears in its Lair; gather it to heal lightly wounded units.
### Frenzy
If Giant Bear hits Legions while charging, it is briefly Frenzied, and will continuously cast the Skill “Rend”.
### Rend
Giant Bear tears at the enemy with its teeth, dealing Physical Skill damage to all Legions in a forward arc (Damage Factor 900), then immediately bites all Legions in the same range, dealing Physical Skill damage a second time (Damage Factor 900). All targets in range of the two attacks take equal damage.
### Healing Manastone
Each time Giant Bear loses 20% HP, its Lair produces Healing Manastone. When gathered, it heals a Legion’s lightly wounded units.
### Primal
6m after Giant Bear enters battle, it becomes Enraged, increasing all damage it deals by 1,000%.

## Giant Bear Habilidades en Alianza

### Fury Strike
Giant Bear deals Physical Skill damage to all enemy Legions nearby or those in a forward arc (Damage Factor 500).
Upgrade Preview:Skill Damage Factor: 500 / 1000 / 1500 / 2000 / 3000
### Mad Dash
After a short charge-up, Giant Bear rushes forward, dealing Physical Skill damage to all enemy Legions in its path (Damage Factor 1,500).
Upgrade Preview:Skill Damage Factor: 1500 / 3000 / 4500 / 6000 / 9000
### Earth Protector
Giant Bear casts Earth Protector upon being summoned, gaining a shield that absorbs a massive amount of damage (Shield Factor 10,000) for 30s.
Upgrade Preview:Shield Factor: 10000 / 15000 / 20000 / 28000 / 40000Duration: 30/40/50/60/80

## Giant Bear Ubicación y Bonificaciones$B2C$,
    'https://callofdragonsguides.com/giant-bear-guide/',
    false,
    ARRAY['data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2046'%3E%3C/svg%3E']
  );

  -- Bloque 3: Giant
  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
  VALUES (
    v_section_id,
    3,
    $B3T$Giant$B3T$,
    $B3C$## Cómo derrotar al Giant

The Giant is a relatively easy behemoth to defeat. Before you decide to attack Giant Behemoth, you want to inform your whole alliance so they can join. The reason for this is that having more players makes defeating the giant easier and faster. You have 8 minutes from the first attack to kill him, and if you fail, all troops inside will be destroyed.
When you are attacking giants, you want to bring a few melee tank units, and the rest of the players will have to use range units with commanders that are dealing huge damage.
Tanks will pull the giant and take all the damage. If you have to use taunting artifacts. Players with range units will simply attack the boss from a distance. When you attack him from a distance, you reduce the chance of getting hit by his skills.
There are a few skills that you have to avoid, but you will manage to do that without problems. Just make sure that you are keeping your distance with range units.
Now the most important thing that you have to do is kill all trolls when they spawn. They are not that hard to kill.

## Giant Habilidades en guarida

### Primal Strength
Giant is immune to all debuff effects and impairment effects.
### Reckless Blow
Giant swings its mighty arms, dealing Physical Skill damage to all enemy Legions in a forward arc (Damage Factor 300).
### Wild Swing
Giant swings its hammer, dealing Physical Skill damage to all enemy Legions in a forward arc (Damage Factor 400).
### Whirlwind of Ferocity
Giant raises its stone hammer and spins, dealing Physical Skill damage to all surrounding enemy Legions (Damage Factor 500).
### All Out Strike
Giant charges up briefly before successively hammering the ground in four directions. Legions in an arc in front of the strike are knocked Airborne and take Physical Skill damage (20% of the Legion’s maximum Unit Count).
### Shockwave
Giant slams its enormous hammer into the ground, knocking all surrounding Legions Airborne.
### Feast of Gluttony
Giant devours the Legion with the most units remaining in the Lair and gains a Rock Shield for a period of time. If the Shield remains unbroken at the end of its duration, the devoured Legion is instantly killed, and all surrounding Legions take Skill damage (40% of the Legion’s maximum Unit Count). If the Shield is destroyed in time, the devoured Legion escapes, and Giant is briefly Stunned.
### King of the Giants
During the second stage, Giant becomes Invulnerable and summons Hammer Trolls within the Lair. It also casts Mountain Aura, increasing the ATK and DEF of Hammer Trolls within its range. Invulnerability and Mountain Aura last for 90 seconds. Each defeated Hammer Troll drops Healing Manastone; gather it to heal lightly wounded units in your Legion. Giant’s invulnerability expires as soon as all Hammer Trolls have been defeated.
### Aftershock
Giant charges up briefly before knocking all Legions Airborne along three forward straight lines, dealing Physical Skill damage (30% ofthe Legion’s maximum Unit Count).
### Earthsunder
8m after entering battle, Giant becomes Enraged, casting Groundspike and instantly killing all Legions within its Lair.
### Swing for the Fences
The Hammer Troll swings its hammer wildly at the ground, dealing Physical Skill damage to all enemy Legions in a forward arc (Damage Factor 800).
### Sweeping Strike
The Hammer Troll swings its hammer around like a scythe, dealing Physical Skill damage to all enemy Legions in a forward arc (Damage Factor 600).
### Brothers of One Mind
When a Hammer Troll is killed, other Hammer Trolls recover to full HP.

## Giant Habilidades en Alianza

### Tremor Attack
Giant deals Physical Skill damage to all enemy Legions nearby or those in a forward arc (Damage Factor 600).
Upgrade Preview:Skill Damage Factor 600 / 1200 / 1800 / 2400 / 3600
### Aftershock
Giant charges up briefly before knocking all Legions Airborne along three forward straight lines, dealing Physical Skill damage (Damage Factor 2,000).
Upgrade Preview:Skill Damage Factor 2000 / 4000 / 6000 / 8000 / 12000
### Mountain Aura
2m after being summoned, Giant casts Mountain Aura, increasing damage dealt by itself and surrounding allies for 30s.
Upgrade Preview:Damage bonus: 5%/8%/11%/15%/20%/Duration: 30/45/60/75/90

## Giant Ubicación y Bonificaciones$B3C$,
    'https://callofdragonsguides.com/giant-guide/',
    false,
    ARRAY['data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2046'%3E%3C/svg%3E']
  );

  -- Bloque 4: Magma Daemon
  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
  VALUES (
    v_section_id,
    4,
    $B4T$Magma Daemon$B4T$,
    $B4C$## Cómo derrotar al Magma Daemon

Magma Daemon is hard to kill in Call of Dragons, and there is a lot of planning and teamwork needed in order to kill it. If you are a leader or officer, you have to inform your alliance members and share a plan with them at least one day before. So everyone knows what to do and when to be online. Magma Daemon requires a lot of teamwork, and without it, there is no chance that you will be able to defeat it.
In the Magma Daemon layer, you will find 4 different magma demons. Two demons are magical, while the other two are physical. Now you should have at least 8 tanks, and the rest of the units should be archers.
Each magma demon has its own circle around it. When you are inside a circle, demons will apply stacks to your troops. Now when you get five stacks, the next one will kill you instantly. So to avoid that, when you get 4 stacks, it is best to leave the circle of the first demon that you are attacking by going to the middle or by going to other demons. Stacks will be removed, but you will start getting stacks from new demons that you are attacking. So when you again get four stacks, go to the middle or go to another demon.
Now, why do you need eight tanks? The reason is that every demon has a ranged attack that will hit players if there are no units inside the circle. So each demon should have at least two tanks. When the first tank reaches four stacks, he will move to the center, where his stacks will be removed, while the other tank will take his place and begin attacking the demon. Once he gets 4 stacks he should go to the middle and the first tanks should take his position. You have to do this all the time until you defeat all demons.
That is all you have to know about how to defeat it. It requires a lot of teamwork, and everyone must know what they are doing, especially tanks. It is hard to explain what to do without an example, so if you still do not understand, we recommend you watch the awesome video down below. It explains everything with a live example of what you should do. So watch it and share it with your alliance members so they can also know what to do. If you need a visual guide, you can always watch avideo by Hulksden Gamingon how to defeat Magma Daemon.

## Magma Daemon Habilidades en guarida

### Primal Strength
Magma Daemons are immune to all debuff effects and impairment effects.
### Gluttony
The Magma Devourer indulges its boundless hunger, dealing Magic Skill damage to all enemy Legions in a forward arc (Damage Factor 1,500).
### Avarice
The Magma Devourer releases a shower of lava with a wave of its hand, dealing Magic Skill damage to all enemy Legions in a forward arc (Damage Factor 2,000).
### Bacchanal
The Magma Devourer summons torrents of lava that rush around it, dealing Magic Skill damage to all surrounding enemy Legions (Damage Factor 1,200).
### Blazing Wave
When its target Legion is too far away, the Magma Devourer switches to ranged attacks, launching a wave of lava at the target, dealing Magic Skill damage (1% of the Legion’s maximum Unit Count) to all Legions caught in its wake, and to all Legions at its endpoint (2% of the Legion’s maximum Unit Count).
### Sacrificial Ritual
The Magma Devourer summons 3 Acolytes, which move toward it and eventually sacrifice themselves to its flames, healing it by 2.5%.
### Scourging Field: Devourer’s Mark
The Magma Devourer creates a circular Scourging Field around itself, launching a Scourging Strike every 18s at Legions within the field. Scourging Strike applies a stack of Devourer’s Mark to the target, lasting 90s and dealing Magic Skill damage (1% of the Legion’s maximum Unit Count). The more stacks of Devourer’s Mark there are, the more damage is dealt. When Devourer’s Mark reaches 5 stacks, the Magma Devourer’s next Scourging Strike instantly kills the Legion. When Legions are located outside the field, damage dealt to the Magma Devourer is significantly reduced. If there are no Legions in the Scourging Field, the effective range of Scourging Strike is extended to the entire Lair.
### Magma Covenant
When a Magma Daemon is defeated, all remaining Magma Daemons gain one stack of Magma Covenant, increasing their ATK and DEF.
### Healing Manastone
Every time a Magma Daemon loses 20% of its HP, its Lair produces Healing Manastone, which can be gathered to heal lightly wounded units.
### Magma Manifest: Devourer’s Rage
10m after entering battle, the Magma Devourer becomes Enraged, and continuously casts a strengthened version of Blazing Wave.

## Magma Daemon Habilidades en Alianza

### Hand of the Devourer
The Magma Devourer deals Magic Skill damage to all Legions surrounding it, or in a forward arc (Damage Factor 600). When its target Legion is too far away, the Magma Devourer switches to ranged attacks, launching a wave of lava at the target, dealing Magic Skill damage to all Legions caught in its wake, and to all Legions at its endpoint (Damage Factor 600).
Upgrade Preview:Skill Damage Factor 600 / 1200 / 1800 / 2400 / 3600
### Hot Spring
The Magma Devourer heals all surrounding friendly Legions (Healing Factor 300).
Upgrade Preview:
Healing Factor: 300 / 400 / 500 / 600 / 800
### Magma Destruction
The Magma Devourer self-destructs when its Battle Duration ends, dealing Magic Skill damage to all surrounding Legions (Damage Factor 5,000).
Upgrade Preview:Skill Damage Factor 5000 / 10000 / 15000 / 20000 / 30000

## Magma Daemon Ubicación y Bonificaciones$B4C$,
    'https://callofdragonsguides.com/magma-daemon-guide/',
    false,
    ARRAY['data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201120%20630'%3E%3C/svg%3E','data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2046'%3E%3C/svg%3E']
  );

  -- Bloque 5: Thunder Roc
  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
  VALUES (
    v_section_id,
    5,
    $B5T$Thunder Roc$B5T$,
    $B5C$## Cómo derrotar al Thunder Roc

Thunder Roc is not a particularly difficult behemoth in Call of Dragons, but still, you have to know how to defeat it. Thunder Roc has a lot of skills that will deal a nice amount of damage if you do not avoid them. The first thing that you have to keep in mind when you are fighting Thunder Roc is that you have 8 minutes to defeat it. If you fail, all troops inside will be destroyed, and Thunder Roc will regain all of his HP.
So make sure to notify your alliance members that you will be attacking Thunder Roc in order to gather as many players as possible. More players mean more damage, so you will be able to destroy it faster and easier.
When it comes to the units and heroes that you will bring, it is simple. You want a few tanks to take damage from attacks while other players deal damage with nuking range heroes and units. With ranged heroes and units, you will be able to move faster and dodge skills.
The Thunder Roc layer is divided into four different sections that are filled with water. So after some time, Thunder Roc will use the skill in one of the sections. If you do not leave that section, you will suffer significant damage over time.
When Thunder Roc flies in the air, he will drop four mana stones. You will have to gather them as soon as possible. You want to do that so Thunder Roc goes back to the ground, and when he does, he will be stunned for a short amount of time. Skill Fall Back.
One more skill that you have to be careful of is when Thunder Roc shoots a ball. Simply avoid it otherwise, you will take a lot of damage. It is not that hard, just pay attention.
Electronic Blast is the most important skill to know who to avoid and who to dodge. Thunder Roc will target three different players and put circles around them. After some time, they will explode and deal a lot of damage. So if you have it, make sure that you move away from your alliance members.
Also, do not get close to the other 2 players that have it because if it is stacked, it will deal a lot of damage that will kill you and all nearby players. So always run far away from your alliance members if you have this skill. If you need a visual guide, you can always watch avideo by Hulksden Gamingon how to defeat Thunder Roc.

## Thunder Roc Habilidades en guarida

### Wing Strike
Thunder Roc beats its powerful wings, dealing Magic Skill damage to all Legions in a forward arc (Damage Factor 300).
### Zealous Blow
Thunder Roc shakes its wings, dealing Magic Skill damage to all surrounding Legions (Damage Factor 500).
### Gathering Storm
After a short charge-up, Thunder Roc unleashes a powerful burst of lightning, dealing Magic Skill damage to all surrounding Legions (Damage Factor 1,000). If Thunder Roc is in water, it will cast Electrostatic Discharge on the water.
### Electrostatic Discharge
Thunder Roc deals Magic Skill damage to all enemy Legions within the water it is located in (40% of the Legion’s maximum Unit Count), and reduces the March Speed of damaged Legions.
### Storm Cage
Thunder Roc fires ball lightning toward two bodies of water. The lightning blockades the whole area of water, reducing the March Speed of all Legions inside it and dealing continuous Magic Skill damage (4% of the Legion’s maximum Unit Count) every second for 20s.
### Scatter
Thunder Roc takes to the skies before swooping down, knocking all Legions Airborne toward the edges of its Lair when it lands.
### Soar
Thunder Roc beats back all Legions with its powerful wings before immediately flying into the air. At the same time, all bodies of water produce 1 Manastone. Thunder Roc cannot be targeted while in the air—gather Manastone to unleash a lightning attack on it. Once all Manastone has been gathered, it will fall.
### Electronic Blast
Thunder Roc circles around in the air, then Shocks 3 random enemy Legions. After IOS, lightning strikes the inflicted Legions, dealing Magic Skill damage to all nearby Legions (Damage Factor 500). If the inflicted Legions are in water, Electrostatic Discharge is triggered.
### Fall Back
After all Manastone has been gathered, Thunder Roc will fall into the center of its Lair and be Stunned for a short time.
### Thunderous Cry
8m after entering battle, Thunder Roc becomes Enraged, unleashing Scarlet Lightning and instantly killing all Legions within its Lair.

## Thunder Roc Habilidades en Alianza

### Thunder Wings
Thunder Roc deals Magic Skill damage to all enemy Legions nearby or those in a forward arc (Damage Factor 600).
Upgrade Preview:Skill Damage Factor 600 / 1200 / 1800 / 2400 / 3600
### Gathering Storm
After a short charge-up, Thunder Roc unleashes a powerful lightning attack, dealing Magic Skill damage to all enemy Legions in its path (Damage Factor 1,800)
Upgrade Preview:Skill Damage Factor 1800 / 3600 / 5400 / 7200 / 10800
### Predator Spirit
Thunder Roc casts Predator Spirit upon being summoned, increasing its ATK by 40%, and increasing surrounding friendly Legions’ March Speed by 20%, lasting 30s.
Upgrade Preview:ATK bonus: 40%/ 50%/ 65%/ 80%/ 100%March Speed bonus: 20%/30%/40%/50%/60%

## Thunder Roc Ubicación y Bonificaciones$B5C$,
    'https://callofdragonsguides.com/thunder-roc-guide/',
    false,
    ARRAY['data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2046'%3E%3C/svg%3E']
  );

  -- Bloque 6: Necrogiant
  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
  VALUES (
    v_section_id,
    6,
    $B6T$Necrogiant$B6T$,
    $B6C$## Cómo derrotar al Necrogiant

Necrogiant is one of thehardest Behemothto defeat in Call of Dragons. In order to defeat it, every alliance member should know what to do, how to dodge abilities, and what to target. So if you are an alliance leader or officer, you should make a lot of preparations. First, you should inform all members at least one day before the attack that you will attack Necrogiant so they can prepare.
Secondly, you should give tactics and tips on how to defeat it. With good preparation and when players know what to do, you will be able to defeat Necrogiant. Without good preparation and having random players inside, there is almost zero chance that you will manage to defeat it.
The first and most important thing that you should know is that with Necrogiant you will find giants, and they take different types of damage. So to deal damage, you have to know what troops and heroes you should use. What you should remember is that Necrogiants and Giants share health. This means that damage you deal to Necrogiant will also damage the giant.
Giant: he will only take magic damage. This means that alliance members should only attack it using units and heroes that are dealing magic damage.
Necrogiant: He will only take physical damage. This means that you should attack it only with units and heroes that are dealing physical damage.
It is best to divide players into two groups. Now because Necrogiant and giant are sharing damage you should make one smaller group of magic damage that will attack giant and other groups should have a lot of high physical damage that will attack Necrogiant. We recommend using archers because they have the highest physical damage, but you can use infantry or cavalry if you do not have strong archers.
Necrogiant and Giant are getting buffs if they are together, so you have to pull them apart, or else you will have a hard time killing them. As a result, one group will pull Necrogiant to one side, while other groups will pull the giant to the other.
Now it is time to explain the most important skills of the Necrogiant and how to dodge them. We did our best to explain, but without an example, it can be confusing. So if you do not understand something, go to the video down below, where everything is explained perfectly.
Malevolence: This skill deals a lot of damage if you get hit. Now your main goal is to dodge it. This skill will go from one side of the arena to another, but there will be a small gap where you can cross it without getting hit. So it will take you some time to learn how to dodge it, but it is not that hard.
The barrier of withering: this skill can hurt if you get hit. Now there are four different beams that will rotate on one side. So to avoid his skill, make sure that you go as far as you can to the edge of the arena and walk in the same direction as the beam. This way, you will not get hit by the beam.
Haunting of Ill Intent: You will recognize this skill by its purple orbs. If you get hit by purple orbs, you will take damage. There are no special tactics for this, all you have to do is make sure that you do not get hit by them.
Darkfire: This is the easiest skill to dodge. This skill will turn the whole arena purple, and there will be only 2 circles that are not purple. All you have to do is stand in circles to avoid getting hit.
If you still do not understand something, you can always watch the video down below that shows live examples and tips. Share it with your alliance members so they can understand and manage to defeat the necro giant easier. If you need a visual guide, you can always watch avideo by Hulksden Gamingon how to defeat Necrogiant.

## Necrogiant Habilidades en guarida

### Blood Oath
Necrogiants and Giants share HP.
### Occult Resilience
Necrogiant is immune to Magic damage, debuff effects, and impairment effects.
### Dark Benediction
Synergy forms between Necrogiants and Giants when they get close to each other, significantly reducing the damage they take.
### Deadly Shadows
Necrogiants and Giants start channeling teleportation and cast a random Skill at certain intervals. They are both Invulnerable while channeling teleportation, and will switch places when channeling finishes.
### Staffstrike
Necrogiant swings its giant staff, dealing Magic Skill damage to all enemy Legions in a forward arc (Damage Factor 300).
### Punisher
Necrogiant slams its giant staff into the ground, dealing Magic Skill damage to all enemy Legions in a forward arc (Damage Factor 300).
### Manastone Dagger Strike
Necrogiant sinks Manastone Daggers into the ground, dealing Magic Skill damage to all surrounding enemy Legions (Damage Factor 500).
### Malevolence
Necrogiant summons a row of Eyes of Ill Intent on a random side of the Lair while channeling teleportation. These Eyes continuously launch orbs towards the opposite side, dealing Magic Skill damage to Legions they touch (8% of the Legion’s maximum Unit Count).
### Barrier of Withering
Necrogiant summons revolving cross-shaped barriers in the middle of the Lair while channeling teleportation. Legions that touch the barrier take continuous Magic Skill damage (1% of the Legion’s maximum Unit Count).
### Haunting of Ill Intent
Necrogiant summons four Eyes of Ill Intent in the Lair while channeling teleportation, launching orbs in random directions. Legions struck by the orb take Magic Skill damage (5% of the
### Darkfire
Darkfire covers the Necrogiant’s Lair while channeling teleportation, dealing continuous Magic Skill damage to Legions touched (3% of the Legion’s maximum Unit Count). Meanwhile, Necrogiants and Stone Giants create circular Twisting Seals around targeted Legions; Legions inside them are immune to Darkfire damage.
### Disruptive Necro Currents
Disruptive Necro-Currents While channeling teleportation in the third stage, random currents generate within the Necrogiant’s Lair, affecting Legions’ March Speed.
### Healing Manastone
Upon entering the next stage, the Lair produces Healing Manastone. When gathered, it heals a Legion’s lightly wounded units.
### Last Rites
10m after entering battle, Necrogiant becomes Enraged, summoning a meteor and instantly killing all Legions within its Lair.

## Necrogiant Habilidades en Alianza

### Grievous Attack
Necrogiant deals Magic Skill damage to all enemy Legions nearby or those in a forward arc (Damage Factor 600).
Upgrade Preview:Skill Damage Factor 600 / 1200 / 1800 / 2400 / 3600
### Shadowsphere
Necrogiant charges up briefly before casting a huge, slow-moving magic orb at the target Legion, dealing continuous Magic Skill damage (Damage Factor 600) when it touches its target. The orb vanishes after moving for some time.
Upgrade Preview:Skill Damage Factor 600 / 1200 / 1800 / 2400 / 3200
### Tome of Infernal Secrets
Necrogiant increases all damage dealt by 5% every 30s after being summoned.
Upgrade Preview:Damage dealt bonus: 5%/10%/15%/20%/25%

## Necrogiant Ubicación y Bonificaciones$B6C$,
    'https://callofdragonsguides.com/necrogiant-guide/',
    false,
    ARRAY['data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2046'%3E%3C/svg%3E']
  );

  -- Bloque 7: Hydra
  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
  VALUES (
    v_section_id,
    7,
    $B7T$Hydra$B7T$,
    $B7C$## Cómo derrotar al Hydra

Hydra is one of thebest behemothsto have in the alliance. It deals a lot of AOE damage, and it will definitely help you fight other enemies in big field fights.
Hydra is a hard behemoth to defeat if you or your alliance members do not know what they are doing. There are a lot of skills and mechanics that you have to avoid and use. The first thing that you have to keep in mind is that you have 8 minutes to defeat Hydra. If you do not manage, all your troops will die, and Hydra’s health will come back to 100%. So you have to start from the beginning.
When it comes to heroes and units that you have to use, it is relatively simple. You want to have a few tanks that will take damage from Hydra, while the rest of the players will use ranged units and heroes that will deal nuke damage to Hydra. Also, make sure that you inform your alliance members that you are going to attack Hydra so you can have as many players as possible. The more players you have, the more damage you will deal, which means that it will be easier to defeat it.
When you are fighting Hydra, you will notice 2 different mana stones on the ground. The first is red and has a timer, while the second is green and has charges.
Red stone: Red stone has different buffs and debuffs. First, if nobody picks it up and the timer goes to zero, you and your alliance member will get debuffs that will increase the damage you take. They are stackable, so if you get a lot of debuffs, you will take a lot of damage and die pretty fast. If the player picks it up, only he will get the debuff, but he will deal 25% more damage. So make sure that you or your alliance member pick it up as soon as it spawns.
Greenstone: There are 10 charges in greenstone. When you gather it, you will heal your troops, and all debuffs will be removed. So make sure that you pick it up if you are getting low on troops or have a lot of debuffs.
Agony Blast is a Hydra skill that will deal AOE damage. The problem with this skill is that there is no chance to avoid it. You will always take damage. So that is why it is important not to have debuffs on your troops. To avoid taking damage, make sure that you pick up the red mana stone so your members do not get buffs for taking more damage, and pick up the green stone if your troops are low or you have the debuff. This way, you will take normal damage and not die quickly.
Poisonous Crevices are also one skill that you have to know how to defeat. You will recognize this skill by the circular cracks in the ground. If they explode, all teammates will take damage, and debuff stacks that increase the damage taken. So to counter this skill, you have to stand on top of the cracks. When players stand on it, it will not explode, and you will not take damage. So make sure that you and your alliance members stand on each crack on the gourd. Every crack that explodes adds one stack to all players.
Big red attack. When you see a big red attack from Hydra, you have to run from it. If you do not, you will take a huge amount of damage and die. If you need a visual guide, you can always watch avideo by Hulksden Gamingon how to defeat Hydra.

## Hydra Habilidades en guarida

### Primal Strength
Hydra is immune to debuff effects and impairment effects.
### Unstable Manastone
In the first phase, multiple pieces of Unstable Manastone periodically appear within Hydra’s Lair. Shortly after appearing, ungathered Unstable Manastone will explode, dealing Magic Skill damage to all Legions within the Lair (Damage Factor 1,200) and inflicting one stack of Poison on all Legions who take damage. If Unstable Manastone is gathered, the Legion that gathered it will take one stack of Poison and one stack of Mana Infusion. Each stack of Mana Infusion increases’ Legion’s damage dealt by 25%.
### Fang Strike
Hydra tears at enemies with its deadly fangs, dealing Magic Skill damage to all enemy Legions in a forward arc (Damage Factor 300).
### Tail Sweep
Hydra sweeps its powerful tail, dealing Magic Skill damage to surrounding Legions (Damage Factor 500).
### Miasma
Hydra’s three heads unleash a cloud of poisonous vapor, dealing Magic Skill damage to all Legions in a forward arc (20% of the Legion’s maximum Unit Count), and inflicting one stack of Poison on all Legions who take damage.
### Poisonous Pulse
Hydra launches a poisonous globule at a random Legion’s location, dealing Magic Skill damage to all nearby Legions (Damage Factor 800), and inflicting one stack of Poison on all Legions who take damage.
### Rancorous Strike
After a short charge-up, Hydra rushes forward, knocking all Legions in its path Airborne and dealing Magic Skill damage (Damage Factor 500).
### Poison Barbs
Hydra unleashes a series of poisonous barbs, dealing Magic Skill damage to all Legions hit by them (Damage Factor 800), and inflicting one stack of Poison.
### Dispelling Manastone
Each time Hydra casts Poisonous Barbs, two pieces of Dispelling Manastone will appear in its Lair. Once gathered they can heal a Legion’s lightly wounded units and clear all Poison and Mana Infusion effects.
### Poisonous Crevices
In the second phase, Hydra opens up multiple poisonous crevices in the ground. Shortly after opening up, crevices where no Legions are standing will explode, dealing Magic Skill damage to all Legions within the Lair (Damage Factor 1,200), and inflicting one stack of Poison. If Legions are standing on a crevice, this will prevent it from exploding; the Legion will absorb the poison from the crevice, inflicting one stack of Poison.
### Agony Blast
Every 20s, Hydra deals Magic Skill damage to all Legions within its Lair (1% of the Legion’s maximum Unit Count). Legions take increased damage for each stack of Poison.
### Plaguebearer
8m after entering battle, Hydra becomes Enraged, unleashing Agony Blast with much greater frequency.

## Hydra Habilidades en Alianza

### Hydra Stinger
Hydra deals Magic Skill damage to all enemy Legions nearby or those in a forward arc (Damage Factor 600).
Upgrade Preview:Skill Damage Factor 600 / 1200 / 1800 / 2400 / 3600
### Poison Barbs
Hydra unleashes a series of poisonous barbs, dealing Magic Skill damage to all Legions hit by them (Damage Factor 2,000).
Upgrade Preview:Skill Damage Factor 2000 / 4000 / 6000 / 8000 / 12000
### Poison Cloud
Hydra casts Poison Cloud 1m after being summoned, dealing Magic Skill damage to surrounding enemy Legions (Damage Factor 300) for 30s. The Legion taking damage also gains Decay, reducing their DEF by 5%. Decay adds an extra stack every 3s.
Upgrade Preview:Skill Damage Factor 300 / 600 / 900 / 1200 /1800DEF reduction: 5%/7%/9%/11%/15%

## Hydra Ubicación y Bonificaciones$B7C$,
    'https://callofdragonsguides.com/hydra-guide/',
    false,
    ARRAY['data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2046'%3E%3C/svg%3E']
  );

  -- Bloque 8: Direbear
  INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)
  VALUES (
    v_section_id,
    8,
    $B8T$Direbear$B8T$,
    $B8C$## Cómo derrotar al Direbear

Direbear is one of the easiestBehemothsto defeat in Call of Dragons. Still, you want to know what things you have to avoid and do in order to defeat it easily.
To defeat Direbear you want to take a few tanks that will move it far away from other members. The reason is that Direbear has a lot of AOE damage, so you want to move it far away from other troops. Tanks must have taunt artifacts so they can pull and control Direbear easier. Other members will use ranged units and heroes so they can attack from a distance, and there is less chance that you will be hit by AOE damage.
After some time, Direbear will spawn a purple circle on the ground that you have to avoid. If you stay inside, you will sustain constant damage.So make sure that you stay away from it.
Now the most important skill that you have to avoid is Dark Rush. Direbear, after some time, will charge. You will recognize this skill by a bear jumping to the middle, pushing all players away, and spawning two red lines. Red lines are paths where Direbear will charge. You and all your alliance members must avoid it. If Direbear does not hit anyone in charge, he will be stunned. If he hits someone, he will deal damage and leave poison on the ground that will cause damage.
Manastne: After some time, there will be a mana stone on the ground. When you or an alliance member pick it up, it will heal all units nearby. So make sure that you gather it when you see it.
If you need a visual guide, you can always watch a video byHulksden Gaming on how to defeat Direbear.

## Direbear Habilidades en guarida

### Primal Strength
Direbear is immune to all debuff effects and impairment effects.
### Claw Strike
Direbear brandishes its deadly claws, dealing Magic Skill damage to all enemy Legions in a forward arc (Damage Factor 300).
### Berserker Cyclone
Direbear unleashes a whirling claw attack, dealing Magic Skill damage to all surrounding Legions (Damage Factor 500).
### Darkseal
Direbear smashes the ground with dark energy. Seconds later, a Darkseal forms in a circle on the ground. Legions within the Darkseal take Magic Skill damage every second (3% of the Legion’s maximum Unit Count). The Darkseal can be dispelled.
### Dark Rush
After a short charge-up, Direbear rushes forward, dealing Magic Skill damage to all Legions in its path (50% of the Legion’s maximum Unit Count) and creating a Darkseal along its path. All Legions within the Darkseal take Magic Skill damage (3% of the Legion’s maximum Unit Count) every second for 100s. The Darkseal can be dispelled.
### Dumbstuck
If Direbear does not hit any Legions while charging, then it is briefly Stunned, and its DEF is reduced by 40%. Healing Manastone also appears in its Lair; gather it to heal lightly wounded units.
### Frenzy
If Direbear hits Legions while charging, it is briefly Frenzied, and will continuously cast th
### Rend
Direbear tears at the enemy with its teeth, dealing Magic Skill damage to all Legions in a forward arc (Damage Factor 1,800), then immediately bites all Legions in the same range, dealing Magic Skill damage a second time (Damage Factor 1,800). All targets in range of the two attacks take equal damage.
### Healing Manastone
Each time Direbear loses 25% HP, its Lair produces Healing Manastone. When gathered, it heals a Legion’s lightly wounded units.
### Dark Brutality
8m after Direbear enters battle, it becomes Enraged, increasing all damage it deals by 1,000%.

## Direbear Habilidades en Alianza

### Dark Strike
Direbear deals Magic Skill damage to all enemy Legions nearby or those in a forward arc (Damage Factor 500).
Upgrade Preview:Skill Damage Factor 500 / 1000 / 1500 / 2000 / 3000
### Phantom Charge
Direbear conjures a phantom that rushes forward, dealing Magic Skill damage to all enemy Legions in its path (Damage Factor 2,200).
Upgrade Preview:Skill Damage Factor 2200 / 4400 / 6600 / 9000 / 13000
### Poison Cloud
Direbear casts Boiling Blood 1m after being summoned, causing surrounding friendly Legions to gain 10 Rage every 30s.
Upgrade Preview:Extra Rage gained 30/40/50/60/80

## Direbear Ubicación y Bonificaciones$B8C$,
    'https://callofdragonsguides.com/direbear-guide/',
    false,
    ARRAY['data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2046'%3E%3C/svg%3E']
  );

END $BEH$;