#!/usr/bin/env python3
"""Genera scripts/sql/sxs_builds.sql con builds organizados por Tier (T1-T3) y Clase."""
import json, pathlib

BASE   = "https://eog.gg/assets/sxs/skills/"
CLS    = "https://eog.gg/assets/sxs/classes/"

def sk(name, slug):
    return {"name": name, "img": f"{BASE}{slug}.webp"}

TIERS = [
    {
        "tier": "T1",
        "label": "1er Trabajo",
        "classes": [
            {
                "class": "Warrior",
                "class_es": "Guerrero",
                "icon": f"{CLS}warrior.png",
                "builds": [
                    {
                        "name": "Principiante",
                        "mode": "PvE",
                        "techniques": [
                            sk("Whirlwind Slash",   "whirlwind-slash"),
                            sk("Leap Attack",        "leap-attack"),
                            sk("Heavy Impact",       "heavy-impact"),
                            sk("Edge Strike",        "edge-strike"),
                        ],
                        "enchants": [
                            sk("Warrior's Essence", "warriors-essence"),
                            sk("Iron Fortress",      "iron-fortress"),
                            sk("Crystal Armor",      "crystal-armor"),
                            sk("Life Blessing",      "life-blessing"),
                        ],
                        "desc": "Carga de inicio para el Guerrero base. Whirlwind Slash y Leap Attack cubren AoE; Crystal Armor e Iron Fortress sostienen la defensa antes del 2nd Job Change.",
                    },
                    {
                        "name": "DPS Sostenido",
                        "mode": "PvE",
                        "techniques": [
                            sk("Whirlwind Slash",   "whirlwind-slash"),
                            sk("Lion Combo",         "lion-combo"),
                            sk("Mountain Collapse",  "mountain-collapse"),
                            sk("Quadrant Slash",     "quadrant-slash"),
                        ],
                        "enchants": [
                            sk("Blade Tempest",      "blade-tempest"),
                            sk("Relentless Frenzy",  "relentless-frenzy"),
                            sk("Warrior's Essence",  "warriors-essence"),
                            sk("Feline Dance",       "feline-dance"),
                        ],
                        "desc": "Carga orientada al DPS. Lion Combo y Mountain Collapse maximizan el burst; Blade Tempest y Relentless Frenzy amplian el techo de dano total en dungeons.",
                    },
                ],
            },
            {
                "class": "Mage",
                "class_es": "Mago",
                "icon": f"{CLS}mage.png",
                "builds": [
                    {
                        "name": "Principiante",
                        "mode": "PvE",
                        "techniques": [
                            sk("Cyclone",    "cyclone"),
                            sk("Ice Spike",  "ice-spike"),
                            sk("Fireball",   "fireball"),
                            sk("Iron Thorn", "iron-thorn"),
                        ],
                        "enchants": [
                            sk("Unstable Aura",      "unstable-aura"),
                            sk("Elemental Mystery",  "elemental-mystery"),
                            sk("Elemental Body",     "elemental-body"),
                            sk("Tough Soul",         "tough-soul"),
                        ],
                        "desc": "Carga equilibrada para el primer trabajo. Cubre dano unico, AoE y supervivencia basica antes de comprometerte con un perfil de dano.",
                    },
                    {
                        "name": "Dano en Area",
                        "mode": "PvE",
                        "techniques": [
                            sk("Cyclone",           "cyclone"),
                            sk("Water Assault",     "water-assault"),
                            sk("Blazing Fire Ring", "blazing-fire-ring"),
                            sk("Fireball",          "fireball"),
                        ],
                        "enchants": [
                            sk("Elemental Mystery", "elemental-mystery"),
                            sk("Unstable Aura",     "unstable-aura"),
                            sk("Mana Surge",        "mana-surge"),
                            sk("Gale Shield",       "gale-shield"),
                        ],
                        "desc": "Build de limpieza multi-objetivo. Mana Surge sostiene el tiempo de actividad de hechizos para que la rotacion AoE nunca se interrumpa.",
                    },
                    {
                        "name": "DPS Objetivo Unico",
                        "mode": "PvE",
                        "techniques": [
                            sk("Wind's Delight",  "winds-delight"),
                            sk("Tempest Sphere",  "tempest-sphere"),
                            sk("Flame Jet",       "flame-jet"),
                            sk("Water Shot",      "water-shot"),
                        ],
                        "enchants": [
                            sk("Elemental Mystery", "elemental-mystery"),
                            sk("Unstable Aura",     "unstable-aura"),
                            sk("Mana Surge",        "mana-surge"),
                            sk("Gale Shield",       "gale-shield"),
                        ],
                        "desc": "Carga enfocada en jefes. Wind's Delight y Tempest Sphere acumulan dano en objetivos prioritarios; Mana Surge mantiene la rotacion.",
                    },
                    {
                        "name": "Soporte de Equipo",
                        "mode": "PvE",
                        "techniques": [
                            sk("Stonechief Summon", "stonechief-summon"),
                            sk("Void Blessing",     "void-blessing"),
                            sk("Iron Thorn",        "iron-thorn"),
                            sk("Healing Touch",     "healing-touch"),
                        ],
                        "enchants": [
                            sk("Flaming Path",   "flaming-path"),
                            sk("Tough Soul",     "tough-soul"),
                            sk("Elemental Body", "elemental-body"),
                            sk("Gale Shield",    "gale-shield"),
                        ],
                        "desc": "Kit para contenido grupal. Stonechief Summon y Healing Touch cuidan el HP del equipo; Flaming Path e Iron Thorn controlan y danan.",
                    },
                ],
            },
        ],
    },
    {
        "tier": "T2",
        "label": "2do Trabajo",
        "classes": [
            {
                "class": "Duelist",
                "class_es": "Duelista",
                "icon": f"{CLS}duelist.png",
                "builds": [
                    {
                        "name": "Bruiser",
                        "mode": "PvE",
                        "techniques": [
                            sk("Fire Slash",       "fire-slash"),
                            sk("Flame Aura",       "flame-aura"),
                            sk("Flash Dash",       "flash-dash"),
                            sk("Shattering Sigil", "shattering-sigil"),
                        ],
                        "enchants": [
                            sk("Crit Mastery",       "crit-mastery"),
                            sk("Frame of Battles",   "frame-of-battles"),
                            sk("Indomitable Will",   "indomitable-will"),
                            sk("Blazing Clash",      "blazing-clash"),
                        ],
                        "desc": "Build equilibrada: ataque y supervivencia. Indomitable Will da margen ante errores de timing; Blazing Clash amplifica el dano de fuego en ventanas de Flame Aura.",
                    },
                    {
                        "name": "Burst",
                        "mode": "PvE",
                        "techniques": [
                            sk("Darkness Descends", "darkness-descends"),
                            sk("Sunset Sword",      "sunset-sword"),
                            sk("Fire Slash",        "fire-slash"),
                            sk("Flash Dash",        "flash-dash"),
                        ],
                        "enchants": [
                            sk("Crit Mastery",      "crit-mastery"),
                            sk("Blazing Clash",     "blazing-clash"),
                            sk("Potential Vitality","potential-vitality"),
                            sk("Frame of Battles",  "frame-of-battles"),
                        ],
                        "desc": "Maximo techo de dano. Darkness Descends y Sunset Sword en combo producen los picos mas altos; Potential Vitality cubre la fragilidad de no llevar encantos defensivos.",
                    },
                    {
                        "name": "PvP",
                        "mode": "PvP",
                        "techniques": [
                            sk("Flame Aura",        "flame-aura"),
                            sk("Leap Attack",       "leap-attack"),
                            sk("Darkness Descends", "darkness-descends"),
                            sk("Sunset Sword",      "sunset-sword"),
                        ],
                        "enchants": [
                            sk("Counter Blade",    "counter-blade"),
                            sk("Frame of Battles", "frame-of-battles"),
                            sk("Insightful Eye",   "insightful-eye"),
                            sk("Indomitable Will", "indomitable-will"),
                        ],
                        "desc": "Arena loadout de ventanas de burst. Flame Aura acumula dano en objetivos unicos, Leap Attack cierra distancia, Darkness Descends explota con Dark Affinity y Sunset Sword remata. Insightful Eye sobre Block Awareness porque en arena el techo de crit supera la reduccion de dano.",
                    },
                ],
            },
            {
                "class": "Knight",
                "class_es": "Caballero",
                "icon": f"{CLS}knight.png",
                "builds": [
                    {
                        "name": "Tank",
                        "mode": "PvE",
                        "techniques": [
                            sk("Guardian Ring",       "guardian-ring"),
                            sk("Stunning Strike",     "stunning-strike"),
                            sk("Ricocheting Shield",  "ricocheting-shield"),
                            sk("Heart of Challenge",  "heart-of-challenge"),
                        ],
                        "enchants": [
                            sk("Defensive Assault", "defensive-assault"),
                            sk("Ripple Impact",     "ripple-impact"),
                            sk("Eye for an Eye",    "eye-for-an-eye"),
                            sk("Rebound",           "rebound"),
                        ],
                        "desc": "Kit de agro y supervivencia pura. Guardian Ring y Ricocheting Shield mantienen el escudo activo; Eye for an Eye y Rebound devuelven dano al atacante y sostienen el agro en raids de guild.",
                    },
                    {
                        "name": "PvP",
                        "mode": "PvP",
                        "techniques": [
                            sk("Valor Surge",     "valor-surge"),
                            sk("Heavy Impact",    "heavy-impact"),
                            sk("Leap Attack",     "leap-attack"),
                            sk("Stunning Strike", "stunning-strike"),
                        ],
                        "enchants": [
                            sk("Rebound",         "rebound"),
                            sk("Iron Fortress",   "iron-fortress"),
                            sk("Eye for an Eye",  "eye-for-an-eye"),
                            sk("Block Awareness", "block-awareness"),
                        ],
                        "desc": "Arena loadout de burst y stun. Elimina tecnicas de escudo por abridores ofensivos: Heavy Impact, Leap Attack y Stunning Strike encadenan un combo stun-burst mientras los encantos defensivos dan margen para sobrevivir el intercambio. Valor Surge amplifica la ventana de burst.",
                    },
                ],
            },
            {
                "class": "Sorcerer",
                "class_es": "Hechicero",
                "icon": f"{CLS}sorcerer.png",
                "builds": [
                    {
                        "name": "AoE Farmer",
                        "mode": "PvE",
                        "techniques": [
                            sk("Flickering Stars",  "flickering-stars"),
                            sk("Energy Burst",      "energy-burst"),
                            sk("Fiery Star Trail",  "fiery-star-trail"),
                            sk("Frosty Nova",       "frosty-nova"),
                        ],
                        "enchants": [
                            sk("Raging Wildfire",    "raging-wildfire"),
                            sk("Elemental Harmony",  "elemental-harmony"),
                            sk("Wind's Shadow",      "winds-shadow"),
                            sk("Lightning Mystery",  "lightning-mystery"),
                        ],
                        "desc": "La carga de farm mas rapida del juego. Flickering Stars y Fiery Star Trail limpian salas completas; Raging Wildfire y Elemental Harmony amplifican el multiplicador elemental.",
                    },
                    {
                        "name": "PvP",
                        "mode": "PvP",
                        "techniques": [
                            sk("Flickering Stars", "flickering-stars"),
                            sk("Wind's Delight",   "winds-delight"),
                            sk("Tempest Sphere",   "tempest-sphere"),
                            sk("Light of Dawn",    "light-of-dawn"),
                        ],
                        "enchants": [
                            sk("Lightning Mystery",  "lightning-mystery"),
                            sk("Unstable Aura",      "unstable-aura"),
                            sk("Elemental Harmony",  "elemental-harmony"),
                            sk("Mana Surge",         "mana-surge"),
                        ],
                        "desc": "Arena loadout. Sustituye Lightning Chain (posicional en PvE) por Tempest Sphere para mas instancias de dano en duelo. Elemental Harmony sigue aplicando su bonus multi-elemento en arena. Juega como caster de presion multi-golpe.",
                    },
                ],
            },
            {
                "class": "Sage",
                "class_es": "Sabio",
                "icon": f"{CLS}sage.png",
                "builds": [
                    {
                        "name": "Soporte",
                        "mode": "PvE",
                        "techniques": [
                            sk("Radiant Restoration", "radiant-restoration"),
                            sk("Weakening Hex",       "weakening-hex"),
                            sk("Flame Wolf Summon",   "flame-wolf-summon"),
                            sk("Treantling Summon",   "treantling-summon"),
                        ],
                        "enchants": [
                            sk("Healing Mastery", "healing-mastery"),
                            sk("Soul Impact",     "soul-impact"),
                            sk("Resurrection",   "resurrection"),
                            sk("Soul Spark",     "soul-spark"),
                        ],
                        "desc": "Kit de curacion y debuffs. Radiant Restoration mantiene el HP del equipo; Weakening Hex y Soul Impact debilitan a los enemigos; Resurrection cubre las bajas criticas en Fantasy Ladder y jefes de guild.",
                    },
                    {
                        "name": "PvP",
                        "mode": "PvP",
                        "techniques": [
                            sk("Void Blessing",       "void-blessing"),
                            sk("Healing Touch",       "healing-touch"),
                            sk("Radiant Restoration", "radiant-restoration"),
                            sk("Dark Bullet",         "dark-bullet"),
                        ],
                        "enchants": [
                            sk("Unstable Aura",   "unstable-aura"),
                            sk("Tough Soul",      "tough-soul"),
                            sk("Healing Mastery", "healing-mastery"),
                            sk("Resurrection",    "resurrection"),
                        ],
                        "desc": "Arena healer loadout. Mantiene los tres nucleos de curacion del build PvE pero cambia el slot de utilidad por Dark Bullet para tener boton de dano. Unstable Aura extrae dano extra de sus golpes; Tough Soul, Healing Mastery y Resurrection sostienen el soporte en presion 2v2 y 3v3.",
                    },
                ],
            },
        ],
    },
    {
        "tier": "T3",
        "label": "3er Trabajo",
        "classes": [
            {
                "class": "Berserker",
                "class_es": "Berserker",
                "icon": f"{CLS}berserker.png",
                "builds": [
                    {
                        "name": "AOE Centric",
                        "mode": "PvE",
                        "techniques": [
                            sk("Eclipse Slash",       "eclipse-slash"),
                            sk("Boiling Bloodlust",   "boiling-bloodlust"),
                            sk("Hunter's Judgment",   "hunters-judgment"),
                            sk("Sunset Sword",        "sunset-sword"),
                        ],
                        "enchants": [
                            sk("Insightful Eye",      "insightful-eye"),
                            sk("Blade of Judgment",   "blade-of-judgment"),
                            sk("Indomitable Will",    "indomitable-will"),
                            sk("Blade Siphon",        "blade-siphon"),
                        ],
                        "desc": "Build centrada en AoE. Eclipse Slash y Boiling Bloodlust barren múltiples objetivos; Blade of Judgment e Insightful Eye amplifican el daño sostenido.",
                    },
                    {
                        "name": "Judgement-Chao Invasion",
                        "mode": "PvE",
                        "techniques": [
                            sk("Sunset Sword",        "sunset-sword"),
                            sk("Lion Combo",          "lion-combo"),
                            sk("Eclipse Slash",       "eclipse-slash"),
                            sk("Flame Aura",          "flame-aura"),
                        ],
                        "enchants": [
                            sk("Desperate Valor",     "desperate-valor"),
                            sk("Crit Mastery",        "crit-mastery"),
                            sk("Blazing Clash",       "blazing-clash"),
                            sk("Blade of Judgment",   "blade-of-judgment"),
                        ],
                        "desc": "Build de invasión. Sunset Sword y Lion Combo producen el burst; Desperate Valor y Blazing Clash maximizan el techo de daño en oleadas densas.",
                    },
                    {
                        "name": "High Critical AoE",
                        "mode": "PvE",
                        "techniques": [
                            sk("Sunset Sword",        "sunset-sword"),
                            sk("Eclipse Slash",       "eclipse-slash"),
                            sk("Boiling Bloodlust",   "boiling-bloodlust"),
                            sk("Hunter's Judgment",   "hunters-judgment"),
                        ],
                        "enchants": [
                            sk("Crit Mastery",        "crit-mastery"),
                            sk("Blade Siphon",        "blade-siphon"),
                            sk("Blade of Judgment",   "blade-of-judgment"),
                            sk("Indomitable Will",    "indomitable-will"),
                        ],
                        "desc": "AoE de alto crítico. Crit Mastery y Blade Siphon elevan la tasa de crítico; Indomitable Will da margen de supervivencia en packs densos.",
                    },
                    {
                        "name": "Whale",
                        "mode": "PvE",
                        "techniques": [
                            sk("Doom Blade",          "doom-blade"),
                            sk("Lion Combo",          "lion-combo"),
                            sk("Eclipse Slash",       "eclipse-slash"),
                            sk("Sunset Sword",        "sunset-sword"),
                        ],
                        "enchants": [
                            sk("Blade Siphon",        "blade-siphon"),
                            sk("Indomitable Will",    "indomitable-will"),
                            sk("Insightful Eye",      "insightful-eye"),
                            sk("Blade of Judgment",   "blade-of-judgment"),
                        ],
                        "desc": "Build de alto presupuesto. Doom Blade añade una quinta fuente de daño; Insightful Eye y Blade Siphon sostienen el ciclo ofensivo indefinidamente.",
                    },
                    {
                        "name": "Dragon",
                        "mode": "PvE",
                        "techniques": [
                            sk("Lion Combo",          "lion-combo"),
                            sk("Flame Aura",          "flame-aura"),
                            sk("Sunset Sword",        "sunset-sword"),
                            sk("Eclipse Slash",       "eclipse-slash"),
                        ],
                        "enchants": [
                            sk("Blazing Clash",       "blazing-clash"),
                            sk("Blade of Judgment",   "blade-of-judgment"),
                            sk("Insightful Eye",      "insightful-eye"),
                            sk("Crit Mastery",        "crit-mastery"),
                        ],
                        "desc": "Build para combate de dragón. Flame Aura activa Blazing Clash en cada ventana; Lion Combo y Sunset Sword cubren el burst de objetivo único.",
                    },
                    {
                        "name": "F2P",
                        "mode": "PvE",
                        "techniques": [
                            sk("Hunter's Judgment",   "hunters-judgment"),
                            sk("Sunset Sword",        "sunset-sword"),
                            sk("Eclipse Slash",       "eclipse-slash"),
                            sk("Whirlwind Slash",     "whirlwind-slash"),
                        ],
                        "enchants": [
                            sk("Blade of Judgment",   "blade-of-judgment"),
                            sk("Insightful Eye",      "insightful-eye"),
                            sk("Blade Siphon",        "blade-siphon"),
                            sk("Life Blessing",       "life-blessing"),
                        ],
                        "desc": "Carga sin inversión. Skills accesibles de T1/T3; Life Blessing cubre supervivencia y Blade Siphon mantiene el sustain sin encantos de pago.",
                    },
                    {
                        "name": "F2P Elemental",
                        "mode": "PvE",
                        "techniques": [
                            sk("Flame Aura",          "flame-aura"),
                            sk("Doom Blade",          "doom-blade"),
                            sk("Diving Gale",         "diving-gale"),
                            sk("Darkness Descends",   "darkness-descends"),
                        ],
                        "enchants": [
                            sk("Insightful Eye",      "insightful-eye"),
                            sk("Blade of Lament",     "blade-of-lament"),
                            sk("Blazing Clash",       "blazing-clash"),
                            sk("Feline Dance",        "feline-dance"),
                        ],
                        "desc": "Variante F2P elemental. Flame Aura activa Blazing Clash; Diving Gale y Darkness Descends aportan control y burst sin requerir skills de alto coste.",
                    },
                    {
                        "name": "Tank Buster Build",
                        "mode": "PvP",
                        "techniques": [
                            sk("Eclipse Slash",   "eclipse-slash"),
                            sk("Doom Blade",      "doom-blade"),
                            sk("Sunset Sword",    "sunset-sword"),
                            sk("Lion Combo",      "lion-combo"),
                        ],
                        "enchants": [
                            sk("Blade of Judgment",  "blade-of-judgment"),
                            sk("Insightful Eye",     "insightful-eye"),
                            sk("Frame of Battles",   "frame-of-battles"),
                            sk("Indomitable Will",   "indomitable-will"),
                        ],
                        "desc": "Anti-tanque PvP. Doom Blade y Blade of Judgment acumulan Marks; Eclipse Slash y Lion Combo detonan el burst antes de que el tanque pueda curar o bloquear.",
                    },
                    {
                        "name": "Tournament Build",
                        "mode": "PvP",
                        "techniques": [
                            sk("Eclipse Slash",      "eclipse-slash"),
                            sk("Hunter's Judgment",  "hunters-judgment"),
                            sk("Phantom Assault",    "phantom-assault"),
                            sk("Sunset Sword",       "sunset-sword"),
                        ],
                        "enchants": [
                            sk("Frame of Battles",   "frame-of-battles"),
                            sk("Blade of Judgment",  "blade-of-judgment"),
                            sk("Indomitable Will",   "indomitable-will"),
                            sk("Insightful Eye",     "insightful-eye"),
                        ],
                        "desc": "Carga de torneo. Phantom Assault reposiciona al Berserker para abrir el multi-hit; Blade of Judgment apila Marks en la cadena y Frame of Battles escala el daño en cada golpe.",
                    },
                    {
                        "name": "Melee Slayer Build",
                        "mode": "PvP",
                        "techniques": [
                            sk("Darkness Descends",  "darkness-descends"),
                            sk("Sunset Sword",       "sunset-sword"),
                            sk("Lion Combo",         "lion-combo"),
                            sk("Eclipse Slash",      "eclipse-slash"),
                        ],
                        "enchants": [
                            sk("Insightful Eye",    "insightful-eye"),
                            sk("Frame of Battles",  "frame-of-battles"),
                            sk("Blade of Judgment", "blade-of-judgment"),
                            sk("Indomitable Will",  "indomitable-will"),
                        ],
                        "desc": "Counter de melee. Darkness Descends dispela el escudo del rival y aplica Dark; Lion Combo y Eclipse Slash cierran con burst sostenido antes de que el rival se recupere.",
                    },
                    {
                        "name": "Healer Slayer Build",
                        "mode": "PvP",
                        "techniques": [
                            sk("Sunset Sword",      "sunset-sword"),
                            sk("Hunter's Judgment", "hunters-judgment"),
                            sk("Eclipse Slash",     "eclipse-slash"),
                            sk("Lion Combo",        "lion-combo"),
                        ],
                        "enchants": [
                            sk("Blade of Judgment",  "blade-of-judgment"),
                            sk("Frame of Battles",   "frame-of-battles"),
                            sk("Insightful Eye",     "insightful-eye"),
                            sk("Indomitable Will",   "indomitable-will"),
                        ],
                        "desc": "Elimina healers antes de que actúen. Hunter's Judgment irrumpe en retaguardia; Blade of Judgment apila daño que supera el healing tick a tick hasta eliminar al soporte.",
                    },
                    {
                        "name": "Mage Slayer Build",
                        "mode": "PvP",
                        "techniques": [
                            sk("Eclipse Slash",      "eclipse-slash"),
                            sk("Doom Blade",         "doom-blade"),
                            sk("Hunter's Judgment",  "hunters-judgment"),
                            sk("Sunset Sword",       "sunset-sword"),
                        ],
                        "enchants": [
                            sk("Insightful Eye",    "insightful-eye"),
                            sk("Blade of Judgment", "blade-of-judgment"),
                            sk("Frame of Battles",  "frame-of-battles"),
                            sk("Indomitable Will",  "indomitable-will"),
                        ],
                        "desc": "Counter de magos ranged. Doom Blade y Hunter's Judgment alcanzan el fondo antes de que el mago lance; Blade of Judgment y Frame of Battles hacen el burst irresistible.",
                    },
                ],
            },
            {
                "class": "Paladin",
                "class_es": "Paladín",
                "icon": f"{CLS}paladin.png",
                "builds": [
                    {
                        "name": "Shield Build",
                        "mode": "PvE",
                        "techniques": [
                            sk("Guardian Ring",          "guardian-ring"),
                            sk("Heart of Challenge",     "heart-of-challenge"),
                            sk("Star Shattering Slash",  "star-shattering-slash"),
                            sk("Desperate Protection",   "desperate-protection"),
                        ],
                        "enchants": [
                            sk("Defensive Assault",  "defensive-assault"),
                            sk("Eye for an Eye",     "eye-for-an-eye"),
                            sk("Black Mastery",      "black-mastery"),
                            sk("Black Awareness",    "black-awareness"),
                        ],
                        "desc": "Build de tanque ofensivo. Guardian Ring genera escudo en cada turno; Star Shattering Slash y Black Awareness amplifican el daño mientras Defensive Assault mantiene el agro.",
                    },
                    {
                        "name": "F2P Build",
                        "mode": "PvE",
                        "techniques": [
                            sk("Luminous Shield",       "luminous-shield"),
                            sk("Guardian Ring",         "guardian-ring"),
                            sk("Heart of Challenge",    "heart-of-challenge"),
                            sk("Desperate Protection",  "desperate-protection"),
                        ],
                        "enchants": [
                            sk("Iron Fortress",   "iron-fortress"),
                            sk("Stone Skin",      "stone-skin"),
                            sk("Black Mastery",   "black-mastery"),
                            sk("Black Awareness", "black-awareness"),
                        ],
                        "desc": "Carga gratuita para el Paladín. Luminous Shield aporta defensa adicional; Iron Fortress y Stone Skin sostienen la supervivencia sin encantos de alto coste.",
                    },
                    {
                        "name": "Dungeon Build",
                        "mode": "PvE",
                        "techniques": [
                            sk("Water Surge",          "water-surge"),
                            sk("Luminous Threads",     "luminous-threads"),
                            sk("Heart of Challenge",   "heart-of-challenge"),
                            sk("Desperate Protection", "desperate-protection"),
                        ],
                        "enchants": [
                            sk("Iron Fortress",   "iron-fortress"),
                            sk("Stone Skin",      "stone-skin"),
                            sk("Black Awareness", "black-awareness"),
                            sk("Black Mastery",   "black-mastery"),
                        ],
                        "desc": "Kit optimizado para mazmorras. Water Surge y Luminous Threads controlan el espacio; Iron Fortress y Stone Skin absorben el daño de packs densos.",
                    },
                    {
                        "name": "Reflecting Wall Build",
                        "mode": "PvE",
                        "techniques": [
                            sk("Heart of Challenge",   "heart-of-challenge"),
                            sk("Forceful Charge",      "forceful-charge"),
                            sk("Blackthorn Shield",    "blackthorn-shield"),
                            sk("Desperate Protection", "desperate-protection"),
                        ],
                        "enchants": [
                            sk("Rebound",         "rebound"),
                            sk("Eye for an Eye",  "eye-for-an-eye"),
                            sk("Black Awareness", "black-awareness"),
                            sk("Black Mastery",   "black-mastery"),
                        ],
                        "desc": "Build de reflejo de daño. Blackthorn Shield y Rebound devuelven daño al atacante; Eye for an Eye y Forceful Charge sostienen el agro en combate prolongado.",
                    },
                    {
                        "name": "Water Balloon Build",
                        "mode": "PvE",
                        "techniques": [
                            sk("Guardian Ring",         "guardian-ring"),
                            sk("Luminous Threads",      "luminous-threads"),
                            sk("Water Surge",           "water-surge"),
                            sk("Star Shattering Slash", "star-shattering-slash"),
                        ],
                        "enchants": [
                            sk("Ripple Impact",      "ripple-impact"),
                            sk("Defensive Assault",  "defensive-assault"),
                            sk("Eye for an Eye",     "eye-for-an-eye"),
                            sk("Insightful Eye",     "insightful-eye"),
                        ],
                        "desc": "Build de agua ofensiva. Water Surge y Luminous Threads concentran enemigos; Ripple Impact amplifica el daño en área e Insightful Eye sostiene el ciclo.",
                    },
                    {
                        "name": "Water Grenade Build",
                        "mode": "PvE",
                        "techniques": [
                            sk("Boiling Bloodlust",    "boiling-bloodlust"),
                            sk("Guardian Ring",        "guardian-ring"),
                            sk("Luminous Threads",     "luminous-threads"),
                            sk("Desperate Protection", "desperate-protection"),
                        ],
                        "enchants": [
                            sk("Ripple Impact",      "ripple-impact"),
                            sk("Defensive Assault",  "defensive-assault"),
                            sk("Insightful Eye",     "insightful-eye"),
                            sk("Potential Rebirth",  "potential-rebirth"),
                        ],
                        "desc": "Variante agresiva de agua. Boiling Bloodlust añade burst; Potential Rebirth cubre las bajas críticas sin reducir el output ofensivo.",
                    },
                    {
                        "name": "Watching Paint Dry",
                        "mode": "PvE",
                        "techniques": [
                            sk("Leap Attack",           "leap-attack"),
                            sk("Holy Purification",     "holy-purification"),
                            sk("Star Shattering Slash", "star-shattering-slash"),
                            sk("Valor Surge",           "valor-surge"),
                        ],
                        "enchants": [
                            sk("Iron Fortress",     "iron-fortress"),
                            sk("Black Mastery",     "black-mastery"),
                            sk("Black Awareness",   "black-awareness"),
                            sk("Potential Rebirth", "potential-rebirth"),
                        ],
                        "desc": "Build de attrition. Leap Attack y Valor Surge mantienen presión constante; Holy Purification elimina debuffs y Potential Rebirth garantiza sobrevivir el intercambio largo.",
                    },
                    {
                        "name": "Bonking Healers",
                        "mode": "PvP",
                        "techniques": [
                            sk("Leap Attack",           "leap-attack"),
                            sk("Star Shattering Slash", "star-shattering-slash"),
                            sk("Luminous Shield",       "luminous-shield"),
                            sk("Valor Surge",           "valor-surge"),
                        ],
                        "enchants": [
                            sk("Iron Fortress",     "iron-fortress"),
                            sk("Black Awareness",   "black-awareness"),
                            sk("Black Mastery",     "black-mastery"),
                            sk("Potential Rebirth", "potential-rebirth"),
                        ],
                        "desc": "Anti-soporte PvP. Leap Attack cierra distancia; Star Shattering Slash y Black Mastery interrumpen y eliminan healers antes de que puedan responder.",
                    },
                    {
                        "name": "Reflect the PewPew",
                        "mode": "PvP",
                        "techniques": [
                            sk("Leap Attack",           "leap-attack"),
                            sk("Luminous Shield",       "luminous-shield"),
                            sk("Holy Purification",     "holy-purification"),
                            sk("Star Shattering Slash", "star-shattering-slash"),
                        ],
                        "enchants": [
                            sk("Rebound",         "rebound"),
                            sk("Black Awareness", "black-awareness"),
                            sk("Black Mastery",   "black-mastery"),
                            sk("Iron Fortress",   "iron-fortress"),
                        ],
                        "desc": "Contraataque anti-DPS ranged. Rebound y Luminous Shield reflejan el daño recibido; Holy Purification limpia debuffs para mantener la eficiencia de bloqueo.",
                    },
                    {
                        "name": "Warriors Nightmare",
                        "mode": "PvP",
                        "techniques": [
                            sk("Leap Attack",           "leap-attack"),
                            sk("Luminous Shield",       "luminous-shield"),
                            sk("Star Shattering Slash", "star-shattering-slash"),
                            sk("Valor Surge",           "valor-surge"),
                        ],
                        "enchants": [
                            sk("Rebound",         "rebound"),
                            sk("Stone Skin",      "stone-skin"),
                            sk("Black Awareness", "black-awareness"),
                            sk("Black Mastery",   "black-mastery"),
                        ],
                        "desc": "Pesadilla para guerreros. Stone Skin reduce el daño físico entrante y Rebound lo devuelve amplificado en cada impacto recibido.",
                    },
                    {
                        "name": "Whale Tournament",
                        "mode": "PvP",
                        "techniques": [
                            sk("Luminous Threads",  "luminous-threads"),
                            sk("Heart of Challenge","heart-of-challenge"),
                            sk("Valor Surge",       "valor-surge"),
                            sk("Luminous Shield",   "luminous-shield"),
                        ],
                        "enchants": [
                            sk("Feline Dance",    "feline-dance"),
                            sk("Iron Fortress",   "iron-fortress"),
                            sk("Black Awareness", "black-awareness"),
                            sk("Black Mastery",   "black-mastery"),
                        ],
                        "desc": "Carga de torneo premium. Feline Dance y Luminous Threads controlan el orden de turnos; Heart of Challenge mantiene el agro y Valor Surge limpia el campo en la apertura.",
                    },
                ],
            },
            {
                "class": "Archmage",
                "class_es": "Archimago",
                "icon": f"{CLS}archmage.png",
                "builds": [
                    {
                        "name": "Elemental Harmony",
                        "mode": "PvE",
                        "techniques": [
                            sk("Aqua Vortex",      "aqua-vortex"),
                            sk("Divine Wrath",     "divine-wrath"),
                            sk("Meteoric Flames",  "meteoric-flames"),
                            sk("Wind's Delight",   "winds-delight"),
                        ],
                        "enchants": [
                            sk("Elemental Harmony", "elemental-harmony"),
                            sk("Radiant Sear",      "radiant-sear"),
                            sk("Rapid Cast",        "rapid-cast"),
                            sk("Mana Surge",        "mana-surge"),
                        ],
                        "desc": "El build META del Archimago. Agua, Luz, Fuego y Viento activan Elemental Harmony en cada hechizo; Rapid Cast y Mana Surge sostienen el cooldown para limpias sin interrupción.",
                    },
                    {
                        "name": "Dragon Build",
                        "mode": "PvE",
                        "techniques": [
                            sk("Wind's Delight",    "winds-delight"),
                            sk("Howling Hurricane", "howling-hurricane"),
                            sk("Divine Wrath",      "divine-wrath"),
                            sk("Meteoric Flames",   "meteoric-flames"),
                        ],
                        "enchants": [
                            sk("Wind's Shadow",  "winds-shadow"),
                            sk("Wind's Whisper", "winds-whisper"),
                            sk("Rapid Cast",     "rapid-cast"),
                            sk("Mana Surge",     "mana-surge"),
                        ],
                        "desc": "Build mono-Viento de objetivo único. Wind's Shadow y Wind's Whisper acumulan stacks; Rapid Cast encadena los hits de viento para el burst final.",
                    },
                    {
                        "name": "Fire Centric",
                        "mode": "PvE",
                        "techniques": [
                            sk("Fiery Star Trail",  "fiery-star-trail"),
                            sk("Meteoric Flames",   "meteoric-flames"),
                            sk("Blazing Fire Ring", "blazing-fire-ring"),
                            sk("Fire Blast",        "fire-blast"),
                        ],
                        "enchants": [
                            sk("Heart of Flame",   "heart-of-flame"),
                            sk("Raging Wildfire",  "raging-wildfire"),
                            sk("Flaming Path",     "flaming-path"),
                            sk("Mana Surge",       "mana-surge"),
                        ],
                        "desc": "Kit mono-Fuego para limpieza AoE. Heart of Flame amplifica todo hechizo de fuego; Raging Wildfire y Flaming Path apilan Burn entre oleadas.",
                    },
                    {
                        "name": "Dungeon Build",
                        "mode": "PvE",
                        "techniques": [
                            sk("Meteoric Flames",   "meteoric-flames"),
                            sk("Fiery Star Trail",  "fiery-star-trail"),
                            sk("Fire Blast",        "fire-blast"),
                            sk("Blazing Fire Ring", "blazing-fire-ring"),
                        ],
                        "enchants": [
                            sk("Rapid Cast",      "rapid-cast"),
                            sk("Heart of Flame",  "heart-of-flame"),
                            sk("Raging Wildfire", "raging-wildfire"),
                            sk("Mana Surge",      "mana-surge"),
                        ],
                        "desc": "Variante de mazmorra del kit de fuego. Rapid Cast activa la rotación completa desde el turno 1; misma base de Burn que Fire Centric con cooldown reducido.",
                    },
                    {
                        "name": "Light Element Focus",
                        "mode": "PvE",
                        "techniques": [
                            sk("Divine Wrath",      "divine-wrath"),
                            sk("Lightning Chain",   "lightning-chain"),
                            sk("Light of Dawn",     "light-of-dawn"),
                            sk("Flickering Stars",  "flickering-stars"),
                        ],
                        "enchants": [
                            sk("Radiant Sear",          "radiant-sear"),
                            sk("Lightning Mystery",     "lightning-mystery"),
                            sk("Incarnation of Light",  "incarnation-of-light"),
                            sk("Rapid Cast",            "rapid-cast"),
                        ],
                        "desc": "Build mono-Luz de objetivo único. Incarnation of Light activa procs de Luz adicionales; Lightning Chain y Radiant Sear amplifican cada golpe de luz lanzado.",
                    },
                    {
                        "name": "AoE Crowd Control",
                        "mode": "PvE",
                        "techniques": [
                            sk("Energy Burst",      "energy-burst"),
                            sk("Divine Wrath",      "divine-wrath"),
                            sk("Howling Hurricane", "howling-hurricane"),
                            sk("Aqua Vortex",       "aqua-vortex"),
                        ],
                        "enchants": [
                            sk("Repelling Wind",    "repelling-wind"),
                            sk("Radiant Sear",      "radiant-sear"),
                            sk("Lightning Mystery", "lightning-mystery"),
                            sk("Rapid Cast",        "rapid-cast"),
                        ],
                        "desc": "Control de masas y burst AoE. Repelling Wind y Howling Hurricane desplazan enemigos; Energy Burst precarga el siguiente hechizo con 30% más de daño.",
                    },
                    {
                        "name": "Battle Mage",
                        "mode": "PvE",
                        "techniques": [
                            sk("Divine Wrath",      "divine-wrath"),
                            sk("Howling Hurricane", "howling-hurricane"),
                            sk("Frosty Nova",       "frosty-nova"),
                            sk("Fire Blast",        "fire-blast"),
                        ],
                        "enchants": [
                            sk("Elemental Harmony", "elemental-harmony"),
                            sk("Repelling Wind",    "repelling-wind"),
                            sk("Radiant Sear",      "radiant-sear"),
                            sk("Rapid Cast",        "rapid-cast"),
                        ],
                        "desc": "Kit multi-elemento de control. Frosty Nova congela el pack; Fire Blast y Divine Wrath golpean mientras Elemental Harmony acumula daño en los 4 elementos.",
                    },
                    {
                        "name": "You're a Wizard Harry!",
                        "mode": "PvE",
                        "techniques": [
                            sk("Wind's Delight",    "winds-delight"),
                            sk("Divine Wrath",      "divine-wrath"),
                            sk("Howling Hurricane", "howling-hurricane"),
                            sk("Fire Blast",        "fire-blast"),
                        ],
                        "enchants": [
                            sk("Void Bubble",       "void-bubble"),
                            sk("Radiant Sear",      "radiant-sear"),
                            sk("Elemental Harmony", "elemental-harmony"),
                            sk("Rapid Cast",        "rapid-cast"),
                        ],
                        "desc": "El kit del hechicero superviviente. Void Bubble otorga escudo al caer bajo 50% HP; Fire Blast activa Elemental Harmony para sostener el output sin morir.",
                    },
                    {
                        "name": "Watch the World Burn",
                        "mode": "PvP",
                        "techniques": [
                            sk("Fiery Star Trail",  "fiery-star-trail"),
                            sk("Meteoric Flames",   "meteoric-flames"),
                            sk("Flickering Stars",  "flickering-stars"),
                            sk("Fire Blast",        "fire-blast"),
                        ],
                        "enchants": [
                            sk("Heart of Flame",  "heart-of-flame"),
                            sk("Repelling Wind",  "repelling-wind"),
                            sk("Mana Surge",      "mana-surge"),
                            sk("Rapid Cast",      "rapid-cast"),
                        ],
                        "desc": "Build PvP de fuego puro. Incendia todo el equipo rival desde turno 1; Repelling Wind aleja a los melee y Mana Surge sostiene la rotación de fuego.",
                    },
                    {
                        "name": "Divine Intervention",
                        "mode": "PvP",
                        "techniques": [
                            sk("Energy Burst",     "energy-burst"),
                            sk("Divine Wrath",     "divine-wrath"),
                            sk("Light of Dawn",    "light-of-dawn"),
                            sk("Flickering Stars", "flickering-stars"),
                        ],
                        "enchants": [
                            sk("Radiant Sear",      "radiant-sear"),
                            sk("Repelling Wind",    "repelling-wind"),
                            sk("Lightning Mystery", "lightning-mystery"),
                            sk("Rapid Cast",        "rapid-cast"),
                        ],
                        "desc": "Burst PvP de Luz. Energy Burst precarga el siguiente hechizo; Divine Wrath y Light of Dawn acumulan procs dobles que el rival no puede bloquear.",
                    },
                ],
            },
            {
                "class": "Arcanist",
                "class_es": "Arcanista",
                "icon": f"{CLS}arcanist.png",
                "builds": [
                    {
                        "name": "AoE Damage",
                        "mode": "PvE",
                        "techniques": [
                            sk("Mana Blast",    "mana-blast"),
                            sk("Weakening Hex", "weakening-hex"),
                            sk("Shadow Impact", "shadow-impact"),
                            sk("Abyssal Hand",  "abyssal-hand"),
                        ],
                        "enchants": [
                            sk("Linked Misfortune", "linked-misfortune"),
                            sk("Night's Blessing",  "nights-blessing"),
                            sk("Shadow Vengeance",  "shadow-vengeance"),
                            sk("Shadow Erosion",    "shadow-erosion"),
                        ],
                        "desc": "Build AoE oscura. Mana Blast expande Erosión a todo el pack; Linked Misfortune multiplica cada aplicación y Shadow Vengeance convierte los stacks en burst final.",
                    },
                    {
                        "name": "Single Target DoT",
                        "mode": "PvE",
                        "techniques": [
                            sk("Mana Blast",             "mana-blast"),
                            sk("Weakening Hex",          "weakening-hex"),
                            sk("Abyssal Hand",           "abyssal-hand"),
                            sk("Shadow of Termination",  "shadow-of-termination"),
                        ],
                        "enchants": [
                            sk("Shadow Erosion",    "shadow-erosion"),
                            sk("Linked Misfortune", "linked-misfortune"),
                            sk("Night's Blessing",  "nights-blessing"),
                            sk("Shadow Vengeance",  "shadow-vengeance"),
                        ],
                        "desc": "DoT de objetivo único para jefes. Shadow of Termination acumula Erosión en un solo objetivo; Abyssal Hand convierte el efecto a eliminación en una activación.",
                    },
                    {
                        "name": "Summoner",
                        "mode": "PvE",
                        "techniques": [
                            sk("Stonechief Summon",  "stonechief-summon"),
                            sk("Treantling Summon",  "treantling-summon"),
                            sk("Warbling Summon",    "warbling-summon"),
                            sk("Flame Wolf Summon",  "flame-wolf-summon"),
                        ],
                        "enchants": [
                            sk("Summoner's Frenzy", "summoners-frenzy"),
                            sk("Soul Impact",       "soul-impact"),
                            sk("Elemental Mystery", "elemental-mystery"),
                            sk("Resurrection",      "resurrection"),
                        ],
                        "desc": "Kit de invocaciones para contenido grupal. Cuatro summons cubren el campo desde retaguardia; Summoner's Frenzy y Soul Impact escalan el daño de cada montura activa.",
                    },
                    {
                        "name": "Everyone Loves You",
                        "mode": "PvE",
                        "techniques": [
                            sk("Radiant Restoration", "radiant-restoration"),
                            sk("Healing Touch",       "healing-touch"),
                            sk("Warbling Summon",     "warbling-summon"),
                            sk("Dark Bullet",         "dark-bullet"),
                        ],
                        "enchants": [
                            sk("Healing Mastery", "healing-mastery"),
                            sk("Overhealing",     "overhealing"),
                            sk("Tough Soul",      "tough-soul"),
                            sk("Resurrection",    "resurrection"),
                        ],
                        "desc": "Soporte híbrido de equipo. Radiant Restoration y Healing Touch curan al grupo; Dark Bullet presiona al rival y Overhealing convierte el exceso en escudo.",
                    },
                    {
                        "name": "Burst",
                        "mode": "PvP",
                        "techniques": [
                            sk("Dark Bullet",            "dark-bullet"),
                            sk("Mana Blast",             "mana-blast"),
                            sk("Weakening Hex",          "weakening-hex"),
                            sk("Shadow of Termination",  "shadow-of-termination"),
                        ],
                        "enchants": [
                            sk("Shadow Vengeance",  "shadow-vengeance"),
                            sk("Shadow Erosion",    "shadow-erosion"),
                            sk("Linked Misfortune", "linked-misfortune"),
                            sk("Night's Blessing",  "nights-blessing"),
                        ],
                        "desc": "Burst PvP oscuro. Dark Bullet inicia Erosión a distancia; Shadow of Termination convierte los stacks a eliminación instantánea antes de que el rival responda.",
                    },
                    {
                        "name": "Tournament",
                        "mode": "PvP",
                        "techniques": [
                            sk("Warbling Summon",       "warbling-summon"),
                            sk("Abyssal Hand",          "abyssal-hand"),
                            sk("Weakening Hex",         "weakening-hex"),
                            sk("Shadow of Termination", "shadow-of-termination"),
                        ],
                        "enchants": [
                            sk("Shadow Vengeance",  "shadow-vengeance"),
                            sk("Shadow Erosion",    "shadow-erosion"),
                            sk("Night's Blessing",  "nights-blessing"),
                            sk("Resurrection",      "resurrection"),
                        ],
                        "desc": "Kit de torneo formal. Warbling Summon y Abyssal Hand anclan al objetivo; Resurrection como revive grupal cambia el intercambio en brackets con aliados.",
                    },
                    {
                        "name": "Support DPS",
                        "mode": "PvP",
                        "techniques": [
                            sk("Frenzy Totem",        "frenzy-totem"),
                            sk("Weakening Hex",       "weakening-hex"),
                            sk("Radiant Restoration", "radiant-restoration"),
                            sk("Healing Touch",       "healing-touch"),
                        ],
                        "enchants": [
                            sk("Healing Mastery",  "healing-mastery"),
                            sk("Overhealing",      "overhealing"),
                            sk("Shadow Vengeance", "shadow-vengeance"),
                            sk("Resurrection",     "resurrection"),
                        ],
                        "desc": "Soporte ofensivo PvP. Frenzy Totem debuffa al rival mientras curas al equipo; Weakening Hex y Shadow Vengeance mantienen presión sin dejar de sanar.",
                    },
                ],
            },
        ],
    },
    {
        "tier": "T4",
        "label": "4to Trabajo",
        "coming_soon": True,
        "classes": [],
    },
    {
        "tier": "T5",
        "label": "5to Trabajo",
        "coming_soon": True,
        "classes": [],
    },
]


def escape_sql(s: str) -> str:
    return s.replace("'", "''")


header = """\
do $IMPERIUM$
declare
  v_game uuid;
  v_section uuid;
begin
  select id into v_game from public.games where slug = 'sword-x-staff';
  if v_game is null then
    raise exception 'IMPERIUM: juego no encontrado: %', 'sword-x-staff';
  end if;

  delete from public.section_blocks where section_id in (
    select id from public.game_sections where game_id = v_game and slug = 'builds');
  delete from public.game_sections where game_id = v_game and slug = 'builds';

  insert into public.game_sections
    (game_id, slug, title, intro_title, intro, intro_images, is_published,
     label, description, icon, cover_image, render_type, order_index)
  values
    (v_game, 'builds', 'Builds — Sword x Staff', 'Builds por Clase y Tier',
     'Cargas para las 6 clases jugables organizadas por tier de trabajo (T1→T2). Los builds de Mago están curados por EOG; los demás están construidos con el pool de habilidades y descripciones oficiales de eog.gg. El meta evoluciona: ajusta según el parche.',
     array['https://eog.gg/assets/sxs/classes/warrior.png']::text[], false,
     'Builds', 'Loadouts por tier y clase: Guerrero, Duelista, Caballero, Mago, Hechicero, Sabio', 'wrench',
     'https://eog.gg/assets/sxs/classes/warrior.png', 'builds', 4)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values"""

rows = []
for i, tier in enumerate(TIERS, 1):
    tier_json = json.dumps(tier, ensure_ascii=False, separators=(",", ":"))
    content_sql = escape_sql("__BUILDS__" + tier_json)
    title_sql = escape_sql(f"{tier['tier']} — {tier['label']}")
    rows.append(
        f"    (v_section, {i}, '{title_sql}', '{content_sql}', "
        f"'https://eog.gg/games/sword-x-staff/', false, array[]::text[], '{{}}'::jsonb)"
    )

footer = "\nend\n$IMPERIUM$;"
sql = header + "\n" + ",\n".join(rows) + ";\n" + footer

out = pathlib.Path(__file__).parent / "sql" / "sxs_builds.sql"
out.write_text(sql, encoding="utf-8")
total_builds = sum(len(c["builds"]) for t in TIERS for c in t["classes"])
print(f"[ok] {out}  ({len(sql)} bytes, {len(TIERS)} tiers, {total_builds} builds)")
