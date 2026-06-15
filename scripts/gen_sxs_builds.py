#!/usr/bin/env python3
"""Genera scripts/sql/sxs_builds.sql con builds para todas las clases."""
import pathlib

BASE = "https://eog.gg/assets/sxs/skills/"

def img(*slugs):
    return [f"{BASE}{s}.webp" for s in slugs]

BUILDS = [
    # ── GUERRERO ─────────────────────────────────────────────────────────────
    {
        "title": "Guerrero — Principiante (PVE)",
        "content": (
            "Tecnicas (x4): Whirlwind Slash · Leap Attack · Heavy Impact · Edge Strike\n"
            "Encantos (x4): Warrior's Essence · Iron Fortress · Crystal Armor · Life Blessing\n\n"
            "Carga de inicio para el Guerrero base. Whirlwind Slash y Leap Attack cubren AoE; "
            "Crystal Armor e Iron Fortress sostienen la defensa antes del 2nd Job Change."
        ),
        "images": img(
            "whirlwind-slash", "leap-attack", "heavy-impact", "edge-strike",
            "warriors-essence", "iron-fortress", "crystal-armor", "life-blessing",
        ),
    },
    {
        "title": "Guerrero — DPS Sostenido (PVE)",
        "content": (
            "Tecnicas (x4): Whirlwind Slash · Lion Combo · Mountain Collapse · Quadrant Slash\n"
            "Encantos (x4): Blade Tempest · Relentless Frenzy · Warrior's Essence · Feline Dance\n\n"
            "Carga orientada al DPS. Lion Combo y Mountain Collapse maximizan el burst; "
            "Blade Tempest y Relentless Frenzy amplian el techo de dano total en dungeons."
        ),
        "images": img(
            "whirlwind-slash", "lion-combo", "mountain-collapse", "quadrant-slash",
            "blade-tempest", "relentless-frenzy", "warriors-essence", "feline-dance",
        ),
    },
    # ── DUELISTA ─────────────────────────────────────────────────────────────
    {
        "title": "Duelista — Bruiser (PVE)",
        "content": (
            "Tecnicas (x4): Fire Slash · Flame Aura · Flash Dash · Shattering Sigil\n"
            "Encantos (x4): Crit Mastery · Frame of Battles · Indomitable Will · Blazing Clash\n\n"
            "Build equilibrada: ataque y supervivencia. Indomitable Will da margen ante errores "
            "de timing; Blazing Clash amplifica el dano de fuego en ventanas de Flame Aura."
        ),
        "images": img(
            "fire-slash", "flame-aura", "flash-dash", "shattering-sigil",
            "crit-mastery", "frame-of-battles", "indomitable-will", "blazing-clash",
        ),
    },
    {
        "title": "Duelista — Burst (PVE)",
        "content": (
            "Tecnicas (x4): Darkness Descends · Sunset Sword · Fire Slash · Flash Dash\n"
            "Encantos (x4): Crit Mastery · Blazing Clash · Potential Vitality · Frame of Battles\n\n"
            "Maximo techo de dano. Darkness Descends y Sunset Sword en combo producen los picos mas altos; "
            "Potential Vitality cubre la fragilidad que resulta de no llevar encantos defensivos."
        ),
        "images": img(
            "darkness-descends", "sunset-sword", "fire-slash", "flash-dash",
            "crit-mastery", "blazing-clash", "potential-vitality", "frame-of-battles",
        ),
    },
    # ── CABALLERO ─────────────────────────────────────────────────────────────
    {
        "title": "Caballero — Tank (PVE)",
        "content": (
            "Tecnicas (x4): Guardian Ring · Stunning Strike · Ricocheting Shield · Heart of Challenge\n"
            "Encantos (x4): Defensive Assault · Ripple Impact · Eye for an Eye · Rebound\n\n"
            "Kit de agro y supervivencia pura. Guardian Ring y Ricocheting Shield mantienen el escudo activo; "
            "Eye for an Eye y Rebound devuelven dano al atacante y sostienen el agro en raids de guild."
        ),
        "images": img(
            "guardian-ring", "stunning-strike", "ricocheting-shield", "heart-of-challenge",
            "defensive-assault", "ripple-impact", "eye-for-an-eye", "rebound",
        ),
    },
    # ── MAGO ──────────────────────────────────────────────────────────────────
    {
        "title": "Mago — Principiante (PVE)",
        "content": (
            "Tecnicas (x4): Cyclone · Ice Spike · Fireball · Iron Thorn\n"
            "Encantos (x4): Unstable Aura · Elemental Mystery · Elemental Body · Tough Soul\n\n"
            "Carga equilibrada para el primer trabajo. Cubre dano unico, AoE y supervivencia basica "
            "antes de comprometerte con un perfil de dano."
        ),
        "images": img(
            "cyclone", "ice-spike", "fireball", "iron-thorn",
            "unstable-aura", "elemental-mystery", "elemental-body", "tough-soul",
        ),
    },
    {
        "title": "Mago — Dano en Area (PVE)",
        "content": (
            "Tecnicas (x4): Cyclone · Water Assault · Blazing Fire Ring · Fireball\n"
            "Encantos (x4): Elemental Mystery · Unstable Aura · Mana Surge · Gale Shield\n\n"
            "Build de limpieza multi-objetivo. Mana Surge sostiene el tiempo de actividad de hechizos "
            "para que la rotacion AoE nunca se interrumpa."
        ),
        "images": img(
            "cyclone", "water-assault", "blazing-fire-ring", "fireball",
            "elemental-mystery", "unstable-aura", "mana-surge", "gale-shield",
        ),
    },
    {
        "title": "Mago — DPS Objetivo Unico (PVE)",
        "content": (
            "Tecnicas (x4): Wind's Delight · Tempest Sphere · Flame Jet · Water Shot\n"
            "Encantos (x4): Elemental Mystery · Unstable Aura · Mana Surge · Gale Shield\n\n"
            "Carga enfocada en jefes. Wind's Delight y Tempest Sphere acumulan dano en objetivos "
            "prioritarios; Mana Surge mantiene la rotacion."
        ),
        "images": img(
            "winds-delight", "tempest-sphere", "flame-jet", "water-shot",
            "elemental-mystery", "unstable-aura", "mana-surge", "gale-shield",
        ),
    },
    {
        "title": "Mago — Soporte de Equipo (PVE)",
        "content": (
            "Tecnicas (x4): Stonechief Summon · Void Blessing · Iron Thorn · Healing Touch\n"
            "Encantos (x4): Flaming Path · Tough Soul · Elemental Body · Gale Shield\n\n"
            "Kit para contenido grupal. Stonechief Summon y Healing Touch cuidan el HP del equipo; "
            "Flaming Path e Iron Thorn controlan y danan."
        ),
        "images": img(
            "stonechief-summon", "void-blessing", "iron-thorn", "healing-touch",
            "flaming-path", "tough-soul", "elemental-body", "gale-shield",
        ),
    },
    # ── HECHICERO ─────────────────────────────────────────────────────────────
    {
        "title": "Hechicero — AoE Farmer (PVE)",
        "content": (
            "Tecnicas (x4): Flickering Stars · Energy Burst · Fiery Star Trail · Frosty Nova\n"
            "Encantos (x4): Raging Wildfire · Elemental Harmony · Wind's Shadow · Lightning Mystery\n\n"
            "La carga de farm mas rapida del juego. Flickering Stars y Fiery Star Trail limpian "
            "salas completas antes de que los enemigos respondan; Raging Wildfire y Elemental Harmony "
            "amplifican el multiplicador elemental."
        ),
        "images": img(
            "flickering-stars", "energy-burst", "fiery-star-trail", "frosty-nova",
            "raging-wildfire", "elemental-harmony", "winds-shadow", "lightning-mystery",
        ),
    },
    # ── SABIO ─────────────────────────────────────────────────────────────────
    {
        "title": "Sabio — Soporte (PVE)",
        "content": (
            "Tecnicas (x4): Radiant Restoration · Weakening Hex · Flame Wolf Summon · Treantling Summon\n"
            "Encantos (x4): Healing Mastery · Soul Impact · Resurrection · Soul Spark\n\n"
            "Kit de curacion y debuffs. Radiant Restoration mantiene el HP del equipo; "
            "Weakening Hex y Soul Impact debilitan a los enemigos; Resurrection cubre las bajas "
            "criticas en Fantasy Ladder y jefes de guild."
        ),
        "images": img(
            "radiant-restoration", "weakening-hex", "flame-wolf-summon", "treantling-summon",
            "healing-mastery", "soul-impact", "resurrection", "soul-spark",
        ),
    },
]


def escape_sql(s: str) -> str:
    return s.replace("'", "''")


def build_images_sql(imgs: list[str]) -> str:
    escaped = [f"'{i}'" for i in imgs]
    return "array[" + ", ".join(escaped) + "]::text[]"


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
    (v_game, 'builds', 'Builds — Sword x Staff', 'Builds por Clase',
     'Cargas para las 6 clases jugables (Guerrero, Duelista, Caballero, Mago, Hechicero, Sabio). Los builds de Mago estan curados por EOG; los demas estan construidos con el pool de habilidades y las descripciones de clase oficiales de eog.gg. El meta evoluciona: ajusta segun el parche.',
     array['https://eog.gg/assets/sxs/classes/warrior.png']::text[], false,
     'Builds', 'Loadouts para Guerrero, Duelista, Caballero, Mago, Hechicero y Sabio', 'wrench',
     'https://eog.gg/assets/sxs/classes/warrior.png', 'generic', 4)
  returning id into v_section;

  insert into public.section_blocks
    (section_id, order_index, title, content, source_url, is_verified, images, meta)
  values"""

rows = []
for i, b in enumerate(BUILDS, 1):
    title_sql = escape_sql(b["title"])
    content_sql = escape_sql(b["content"])
    images_sql = build_images_sql(b["images"])
    row = (
        f"    (v_section, {i}, '{title_sql}', '{content_sql}', "
        f"'https://eog.gg/games/sword-x-staff/', false, {images_sql}, " + "'{}'::jsonb)"
    )
    rows.append(row)

footer = "\nend\n$IMPERIUM$;"

sql = header + "\n" + ",\n".join(rows) + ";\n" + footer

out = pathlib.Path(__file__).parent / "sql" / "sxs_builds.sql"
out.write_text(sql, encoding="utf-8")
print(f"[ok] {out}  ({len(sql)} bytes, {len(rows)} builds)")
