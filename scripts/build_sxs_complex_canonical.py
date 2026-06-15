"""Parsea scripts/data/sxs_deep.json y genera los canónicos JSON para las
secciones complejas de Sword x Staff:

  tier-list   → TierListViewer (4 líneas de clase × regiones en __TABLE__)
  builds      → SectionContent (4 loadouts)
  habilidades → TierListViewer (264 habilidades con íconos)
  fantomons   → TierListViewer (13 Fantomons, reemplaza los 4 anteriores)
  companeros  → SectionContent (35 compañeros)
  roadmap     → SectionContent (4 temporadas)

Uso: python scripts/build_sxs_complex_canonical.py
"""
import json, os, re

os.makedirs("scripts/data/canonical", exist_ok=True)

deep   = json.load(open("scripts/data/sxs_deep.json", encoding="utf-8"))
SOURCE = "https://eog.gg/games/sword-x-staff/"
BASE   = "https://eog.gg"


# ─── Helpers ──────────────────────────────────────────────────────────────────
def to_kebab(name: str) -> str:
    n = name.lower()
    n = re.sub(r"[''']", "", n)
    n = re.sub(r"[^a-z0-9]+", "-", n)
    return n.strip("-")

def skill_img(name: str) -> str:
    return f"{BASE}/assets/sxs/skills/{to_kebab(name)}.webp"

def class_img(slug: str) -> str:
    return f"{BASE}/assets/sxs/classes/{slug}.png"

def table_content(headers: list, rows: list) -> str:
    return "__TABLE__" + json.dumps({"headers": headers, "rows": rows},
                                    ensure_ascii=False, separators=(",", ":"))


# ─── 1. TIER LIST ─────────────────────────────────────────────────────────────
# Para cada línea de clase extraemos sus grades en cada región (T3+).
# Estructura del bloque: un bloque por línea de clase, __TABLE__ con las regiones.

REGION_TIERS = {
    # region_key: (tier_num, region_name_es, unlock_es)
    "verdantglade": ("T1", "Verdantglade",  "1ª clase · Guerrero y Mago"),
    "cinder-ridge": ("T2", "Cinder Ridge",  "2ª clase (nv. 44)"),
    "aqualis":      ("T3", "Aqualis",        "3ª clase + reclase desbloqueada"),
    "loong-haven":  ("T4", "Loong Haven",    "4ª clase"),
    "aethyris":     ("T5", "Aethyris",       "5ª clase"),
}

CLASS_LINES = [
    # (slug, es_label, icon_slug, aliases_in_text)
    ("berserker-duelist",  "Berserker / Guerrero",    "berserker",
     ["BERSERKER", "DUELIST", "CONQUEROR", "RAVAGER"]),
    ("paladin-knight",     "Paladín / Caballero",     "paladin",
     ["PALADIN", "KNIGHT", "GUARDIAN", "TEMPLAR"]),
    ("archmage-sorcerer",  "Archimago / Hechicero",   "archmage",
     ["ARCHMAGE", "SORCERER", "DESTROYER", "MAGISTER"]),
    ("arcanist-sage",      "Arcanista / Sabio",       "arcanist",
     ["ARCANIST", "SAGE", "DOMINATOR", "PROPHET"]),
]

GRADES_VALID = {"SSS", "SS", "S", "A", "B", "C", "D", "-"}

def class_grade_in_text(lines: list[str], class_aliases: list[str]) -> dict:
    """Devuelve {pve, dragon, pvp, pvp4v4} para una línea de clase en el texto."""
    # Buscamos la línea que contiene alguno de los alias
    for i, line in enumerate(lines):
        if any(alias in line.upper() for alias in class_aliases):
            # Intentamos leer las 4 siguientes líneas como grades
            grds = []
            for j in range(i+1, min(i+5, len(lines))):
                if lines[j].strip().upper() in GRADES_VALID:
                    grds.append(lines[j].strip().upper())
            if len(grds) >= 1:
                return {
                    "pve":   grds[0] if len(grds) > 0 else "?",
                    "dragon": grds[1] if len(grds) > 1 else "?",
                    "pvp":   grds[2] if len(grds) > 2 else "?",
                    "pvp4v4": grds[3] if len(grds) > 3 else "?",
                }
    return {"pve": "—", "dragon": "—", "pvp": "—", "pvp4v4": "—"}

def parse_t1(text: str) -> dict | None:
    m = re.search(r"EARLY GAME\s*\n(.+?)(?:\n\n|\Z)", text, re.S)
    if m:
        return {"note": m.group(1).replace("\n", " ").strip()}
    return None

def parse_t2(text: str) -> dict:
    """T2 solo tiene tabla simple S/A/B sin breakdown por modo."""
    result = {}
    for line_slug, label_es, _, aliases in CLASS_LINES:
        grade = "?"
        lines = text.split("\n")
        for i, ln in enumerate(lines):
            if any(a in ln.upper() for a in aliases):
                # Buscar el grade que viene ANTES (puede estar 2-4 líneas atrás)
                for back in range(1, 5):
                    if i - back >= 0 and lines[i - back].strip().upper() in GRADES_VALID:
                        grade = lines[i - back].strip().upper()
                        break
                break
        result[line_slug] = grade
    return result

def build_tier_list():
    tier_regions_data = deep.get("tier-list", {}).get("regions", {})
    base_images = deep["tier-list"]["base"]["images"]
    # Imagen de portada: primera clase
    cover = f"{BASE}/assets/sxs/classes/archmage.png"

    # Para cada línea de clase, armamos filas por región
    items = []
    TIER_HINT = {"SSS": 0, "SS": 1, "S": 2, "A": 3, "B": 4, "C": 5, "D": 6, "—": 7, "?": 8}

    for line_slug, label_es, icon_slug, aliases in CLASS_LINES:
        rows_table = []  # para __TABLE__
        best_tier = "?"
        best_rank = 99

        t1_data = parse_t1(tier_regions_data.get("verdantglade", {}).get("text", ""))
        rows_table.append(["T1 Verdantglade", "—", "—", "—", "—"])

        # T2: solo grade general
        t2_text  = tier_regions_data.get("cinder-ridge", {}).get("text", "")
        t2_grades = parse_t2(t2_text)
        t2g = t2_grades.get(line_slug, "?")
        rows_table.append(["T2 Cinder Ridge", t2g, "—", "—", "—"])
        if TIER_HINT.get(t2g, 99) < best_rank:
            best_rank, best_tier = TIER_HINT[t2g], t2g

        # T3, T4, T5: breakdown por modo
        for rkey, (tnum, rname_es, _) in list(REGION_TIERS.items())[2:]:  # T3,T4,T5
            rtext = tier_regions_data.get(rkey, {}).get("text", "")
            lines = [l.strip() for l in rtext.split("\n") if l.strip()]
            g = class_grade_in_text(lines, aliases)
            pve, dragon, pvp, p4v4 = g["pve"], g["dragon"], g["pvp"], g["pvp4v4"]
            rows_table.append([f"{tnum} {rname_es}", pve, dragon, pvp, p4v4])
            for gval in [pve, pvp, p4v4]:
                if TIER_HINT.get(gval, 99) < best_rank:
                    best_rank, best_tier = TIER_HINT[gval], gval

        # intro para el bloque
        intro_lines = {
            "berserker-duelist":  "Línea físico-daño. Alcanza sus grados rápidamente incluso con inversión baja. Mejor valor por recurso en cuentas F2P y de gasto medio.",
            "paladin-knight":     "Línea tanque-soporte. Domina PVE de endgame (SS en T3 Aqualis) y es una de las mejores opciones en PVP 4v4 en T4 Loong Haven.",
            "archmage-sorcerer":  "Línea maga de daño. Reina del PVP (SSS en T3+). Requiere inversión pesada para alcanzar su techo, pero escala hasta convertirse en la clase más poderosa en T4+.",
            "arcanist-sage":      "Línea de magia de soporte y debuff. Sólida en PVE temprano pero no alcanza las alturas de las otras líneas sin un rol de nicho en PVP.",
        }

        # Descripción de clases
        class_descriptions = {
            "berserker-duelist":  "Duelist → Berserker (T3) → Conqueror / Ravager (T4)",
            "paladin-knight":     "Knight → Paladin (T3) → Guardian / Templar (T4)",
            "archmage-sorcerer":  "Sorcerer → Archmage (T3) → Destroyer / Magister (T4)",
            "arcanist-sage":      "Sage → Arcanist (T3) → Dominator / Prophet (T4)",
        }

        content = (
            f"{intro_lines[line_slug]}\n\n"
            f"Evolución: {class_descriptions[line_slug]}\n\n"
            + table_content(
                ["Región", "PVE", "Dragon & Caos", "PVP", "PVP 4v4"],
                rows_table,
            )
        )

        items.append({
            "title":      label_es,
            "content":    content,
            "images":     [class_img(icon_slug)],
            "source_url": SOURCE,
            "meta":       {"tier": best_tier, "rol": "Guerrero" if "berserker" in line_slug or "paladin" in line_slug else "Mago"},
        })

    return {
        "game": "sword-x-staff", "kind": "section",
        "slug": "tier-list", "title": "Tier List de Clases — Sword x Staff",
        "intro_title": "Clases por Región",
        "intro": (
            "Calificaciones por estilo de combate (PVE · Dragon y Caos · PVP · PVP 4v4) "
            "para cada región. Las grades asumen una cuenta desarrollada. "
            "La línea Guerrero llega a sus grades más rápidamente que la Mago; "
            "para cuentas F2P o de gasto bajo es la opción con mejor relación inversión/poder."
        ),
        "intro_images": [cover],
        "source_url": SOURCE, "is_published": False,
        "render_type": "tier-list", "order_index": 1,
        "label": "Tier List", "icon": "shield", "cover_image": cover,
        "description": "Mejores clases por modo de juego y región (T1–T5)",
        "items": items,
    }


# ─── 2. BUILDS ────────────────────────────────────────────────────────────────
def build_builds():
    text = deep["builds"]["text"]
    images = deep["builds"]["images"]

    # Los builds aparecen como: PVE / TIPO / TECHNIQUES / skills... / CHARMS / skills... / descripción
    BUILDS_PATTERN = re.compile(
        r"(PVE|PVP)\s*\n([\w\s]+?)\n(?:TECHNIQUES\n.*?\n)(4 / 4\n([\w ']+\n){1,8})"
        r"(?:CHARMS\n.*?\n)(4 / 4\n([\w ']+\n){1,8})([\w\W]+?)(?=\nCOPY|\nPVE|\nPVP|\Z)",
        re.S,
    )

    # Parseo manual del texto (más robusto que regex complejo)
    lines = [l.strip() for l in text.split("\n") if l.strip() and l.strip() not in
             {"CURATED BUILDS", "BUILD MAKER", "UNDER CONSTRUCTION", "COPY BUILD MAKER LINK"}]

    BUILD_STARTS = ["BEGINNERS", "AOE DAMAGE", "SINGLE TARGET DPS", "TEAM SUPPORT"]
    builds_raw = []
    cur = None
    for line in lines:
        if line.upper() in BUILD_STARTS:
            if cur:
                builds_raw.append(cur)
            cur = {"name": line, "techs": [], "charms": [], "desc": "", "phase": None}
        elif cur:
            if line == "TECHNIQUES":
                cur["phase"] = "tech"
            elif line == "CHARMS":
                cur["phase"] = "charm"
            elif line == "4 / 4":
                pass
            elif line.startswith("PVE") or line.startswith("PVP"):
                pass
            elif cur["phase"] == "tech" and len(cur["techs"]) < 4:
                cur["techs"].append(line)
            elif cur["phase"] == "charm" and len(cur["charms"]) < 4:
                cur["charms"].append(line)
            elif cur["phase"] == "charm" and len(cur["charms"]) == 4 and not cur["desc"]:
                cur["desc"] = line
    if cur:
        builds_raw.append(cur)

    BUILD_TRANSLATIONS = {
        "BEGINNERS":       "Principiantes (PVE)",
        "AOE DAMAGE":      "Daño en Área (PVE)",
        "SINGLE TARGET DPS": "DPS Objetivo Único (PVE)",
        "TEAM SUPPORT":    "Soporte de Equipo (PVE)",
    }
    BUILD_DESC_ES = {
        "BEGINNERS":       "Carga equilibrada para el primer trabajo. Cubre daño único, AoE y supervivencia básica antes de comprometerte con un perfil de daño.",
        "AOE DAMAGE":      "Build de limpieza multi-objetivo. Mana Surge sostiene el tiempo de actividad de hechizos para que la rotación AoE nunca se interrumpa.",
        "SINGLE TARGET DPS": "Carga enfocada en jefes. Wind's Delight y Tempest Sphere acumulan daño en objetivos prioritarios; Mana Surge mantiene la rotación.",
        "TEAM SUPPORT":    "Kit para contenido grupal. Stonechief Summon y Healing Touch cuidan el HP del equipo; Flaming Path e Iron Thorn controlan y dañan.",
    }

    items = []
    img_list = [f"{BASE}{i}" for i in images]
    for b in builds_raw:
        bname = b["name"].upper()
        title_es = BUILD_TRANSLATIONS.get(bname, b["name"])
        desc_es  = BUILD_DESC_ES.get(bname, b["desc"])
        techs = " · ".join(b["techs"]) if b["techs"] else "Por confirmar"
        charms = " · ".join(b["charms"]) if b["charms"] else "Por confirmar"
        content = (
            f"Técnicas (×4): {techs}\n"
            f"Encantos (×4): {charms}\n\n"
            f"{desc_es}"
        )
        # Imágenes de este build (los íconos de skills)
        build_imgs = [skill_img(t) for t in b["techs"]] + [skill_img(c) for c in b["charms"]]
        items.append({
            "title": title_es, "content": content,
            "images": build_imgs, "source_url": SOURCE, "meta": {},
        })

    cover = f"{BASE}/assets/sxs/classes/warrior.png"
    return {
        "game": "sword-x-staff", "kind": "section",
        "slug": "builds", "title": "Builds — Sword x Staff",
        "intro_title": "Cargas Curadas (En desarrollo)",
        "intro": (
            "Estos loadouts son los mismos que usan los miembros del guild de mayor rango de EOG ahora mismo. "
            "Espera ajustes y clases adicionales a medida que el meta se consolide."
        ),
        "intro_images": [cover],
        "source_url": SOURCE, "is_published": False,
        "render_type": "generic", "order_index": 4,
        "label": "Builds", "icon": "wrench", "cover_image": cover,
        "description": "Loadouts curados por el equipo de EOG — en desarrollo",
        "items": items,
    }


# ─── 3. HABILIDADES (264 skills) ──────────────────────────────────────────────
def build_habilidades():
    text = deep["database"]["subtabs"]["skills"]["text"]
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    # Formato: "C Aberrancy DOMINATOR" / "T Abyssal Hand ARCANIST"
    # Pero el innerText pone cada parte en su propia línea, no en la misma.
    # El texto real parece ser alternando: tipo(C/T), nombre, clase
    skills = []
    i = 0
    while i < len(lines):
        ln = lines[i]
        # Detectar entrada de tipo C o T seguida del nombre y clase
        if ln in ("C", "T"):
            skill_type = "Encanto" if ln == "C" else "Técnica"
            if i + 2 < len(lines):
                name = lines[i + 1]
                klass = lines[i + 2]
                # Filtrar: el nombre no debe ser una palabra reservada del UI
                if name not in ("SKILLS", "FANTOMONS", "COMPANIONS", "ALL", "CHARM", "TECHNIQUE") \
                        and klass not in ("ALL", "CHARM", "TECHNIQUE", "SKILLS", "264") \
                        and len(name) > 1:
                    skills.append({"type": skill_type, "name": name, "class": klass,
                                   "raw_type": ln})
                    i += 3
                    continue
        i += 1

    # También intentar parsear entradas "C Aberrancy DOMINATOR" en una línea
    if len(skills) < 50:
        skills = []
        for ln in lines:
            m = re.match(r'^([CT])\s+(.+?)\s+([A-Z][A-Z]+)$', ln)
            if m:
                t, name, klass = m.groups()
                skills.append({"type": "Encanto" if t == "C" else "Técnica",
                                "name": name, "class": klass, "raw_type": t})

    # Si aun hay pocos, parsear del texto completo de forma diferente
    if len(skills) < 50:
        # Extraer directamente de la sección de imágenes (más confiable)
        skill_images_from_db = deep["database"]["base"]["images"]
        # Las imágenes son /assets/sxs/skills/{name-kebab}.webp
        skills = []
        # Usar el texto original para mapear tipo y clase
        raw_text = text
        # Extraer el patron tipo + nombre + clase
        for m in re.finditer(r'\b([CT])\s+(\w[\w\s'']+?)\s+([A-Z][A-Z]+)\b', raw_text):
            t, name, klass = m.groups()
            name = name.strip()
            if name and klass and len(name) > 1:
                skills.append({"type": "Encanto" if t == "C" else "Técnica",
                                "name": name, "class": klass, "raw_type": t})

    CLASS_ES = {
        "WARRIOR": "Guerrero", "MAGE": "Mago", "KNIGHT": "Caballero",
        "PALADIN": "Paladín", "GUARDIAN": "Guardián", "TEMPLAR": "Templario",
        "DUELIST": "Duelista", "BERSERKER": "Berserker",
        "CONQUEROR": "Conquistador", "RAVAGER": "Devastador",
        "SAGE": "Sabio", "ARCANIST": "Arcanista",
        "DOMINATOR": "Dominador", "PROPHET": "Profeta",
        "SORCERER": "Hechicero", "ARCHMAGE": "Archimago",
        "DESTROYER": "Destructor", "MAGISTER": "Magistro",
        "MONSTER": "Monstruo", "OTHER": "Otro",
    }

    items = []
    for s in skills[:264]:  # máximo 264
        class_es = CLASS_ES.get(s["class"].upper(), s["class"])
        items.append({
            "title": s["name"],
            "content": f"Tipo: {s['type']}\nClase: {class_es}",
            "images": [skill_img(s["name"])],
            "source_url": SOURCE,
            "meta": {"tipo": s["type"], "clase": class_es},
        })

    cover = f"{BASE}/assets/sxs/skills/aqua-vortex.webp"
    return {
        "game": "sword-x-staff", "kind": "section",
        "slug": "habilidades",
        "title": f"Habilidades — Sword x Staff ({len(items)} indexadas)",
        "intro_title": "Base de Datos de Habilidades",
        "intro": (
            f"{len(items)} habilidades indexadas. Filtra por Tipo (Técnica / Encanto) "
            "y por Clase para encontrar las que necesitas."
        ),
        "intro_images": [cover],
        "source_url": SOURCE, "is_published": False,
        "render_type": "tier-list", "order_index": 2,
        "label": "Habilidades", "icon": "gem", "cover_image": cover,
        "description": f"{len(items)} habilidades con íconos — filtrables por tipo y clase",
        "items": items,
    }


# ─── 4. FANTOMONS (reemplaza los 4 anteriores con los 13 reales) ──────────────
def build_fantomons():
    text = deep["database"]["subtabs"]["fantomons"]["text"]
    images = deep["database"]["subtabs"]["fantomons"]["images"]

    RARITY_MAP = {"RAINBOW": "Rainbow", "SSR": "SSR", "SR": "SR", "R": "R"}

    # Parsear el texto de fantomons
    # Formato esperado: {Nombre}\n{RARITY}\n{skill1_name}\n{type}\n{desc}\n{skill2_name}...
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    KNOWN_RARITIES = {"RAINBOW", "SSR", "SR", "R"}
    KNOWN_SKILL_TYPES = {"PASSIVE", "TECHNIQUE"}
    SKIP_LINES = {"SKILLS", "FANTOMONS", "COMPANIONS", "RARITY", "ALL",
                  "RAINBOW", "SSR", "SR", "RARITY ALL RAINBOW SSR SR"}

    fantomons = []
    i = 0
    while i < len(lines):
        ln = lines[i]
        # Detectar inicio de Fantomon: línea de nombre seguida de rareza
        if (i + 1 < len(lines) and
                lines[i + 1].strip().upper() in KNOWN_RARITIES and
                ln not in SKIP_LINES and
                ln[0].isupper() and
                not ln.startswith("SXS") and
                "of" not in ln.lower()):
            name = ln
            rarity = lines[i + 1].strip()
            # Recoger habilidades del Fantomon hasta el siguiente Fantomon
            skills_text = []
            j = i + 2
            while j < len(lines):
                # Detectar fin: si la siguiente línea es otro nombre de Fantomon
                if (j + 1 < len(lines) and
                        lines[j + 1].strip().upper() in KNOWN_RARITIES):
                    skills_text.append(lines[j])
                    break
                skills_text.append(lines[j])
                j += 1
            fantomons.append({"name": name, "rarity": rarity,
                               "skills_text": " · ".join(skills_text[:5])})
            i = j + 1
            continue
        i += 1

    # Fantomons conocidos (los 13 confirmados por sus imágenes en el scraper).
    # Raridades de los 7 primeros: del texto. Los 6 restantes: SSR/SR como aproximación.
    ALL_FANTOMON_NAMES = [
        ("Aegiswing",  "RAINBOW"), ("Armopi",    "SSR"), ("Boaro",    "SR"),
        ("Chomusuke",  "SR"),      ("Falko",     "SR"),  ("Herbote",  "SSR"),
        ("Kels",       "SSR"),     ("Mandragora","SSR"), ("Nyxarchon","SSR"),
        ("Pandarial",  "SR"),      ("Sylvaerie", "SR"),  ("Terragon", "SR"),
        ("Zeioletus",  "SSR"),
    ]
    # Merge: los parseados tienen descripción completa; los hardcodeados la rellenan
    parsed_names = {f["name"]: f for f in fantomons}
    fantomons = []
    for name, rarity in ALL_FANTOMON_NAMES:
        if name in parsed_names:
            fantomons.append(parsed_names[name])
        else:
            fantomons.append({"name": name, "rarity": rarity, "skills_text": ""})

    RARITY_TIER = {"RAINBOW": "SSS", "SSR": "S", "SR": "A", "R": "B"}

    items = []
    img_by_name = {to_kebab(i.split("/")[-1].split(".")[0]): f"{BASE}{i}"
                   for i in images}

    for ft in fantomons:
        name_kebab = to_kebab(ft["name"])
        img = img_by_name.get(name_kebab, f"{BASE}/assets/sxs/fantomons/{name_kebab}.webp")
        items.append({
            "title": ft["name"],
            "content": f"Rareza: {RARITY_MAP.get(ft['rarity'], ft['rarity'])}\n\n{ft['skills_text']}".strip(),
            "images": [img],
            "source_url": SOURCE,
            "meta": {"tier": RARITY_TIER.get(ft["rarity"].upper(), "A"),
                     "rareza": RARITY_MAP.get(ft["rarity"].upper(), ft["rarity"])},
        })

    cover = images[0] if images else None
    cover_url = f"{BASE}{cover}" if cover and cover.startswith("/") else cover

    return {
        "game": "sword-x-staff", "kind": "section",
        "slug": "fantomons",
        "title": f"Fantomons — Sword x Staff ({len(items)} indexados)",
        "intro_title": "Fantomons",
        "intro": (
            "Las criaturas compañeras de Sword x Staff. "
            "Cada Fantomon tiene habilidades pasivas y técnicas activas que complementan tu estilo de juego. "
            "Rainbow > SSR > SR > R. El desbloqueo adulto se produce en el nivel 108 (Loong Haven, Día 47+)."
        ),
        "intro_images": [cover_url] if cover_url else [],
        "source_url": SOURCE, "is_published": False,
        "render_type": "tier-list", "order_index": 3,
        "label": "Fantomons", "icon": "paw",
        "cover_image": cover_url,
        "description": f"{len(items)} Fantomons con rareza y habilidades",
        "items": items,
    }


# ─── 5. COMPAÑEROS ────────────────────────────────────────────────────────────
def build_companeros():
    text = deep["database"]["subtabs"]["companions"]["text"]
    images = deep["database"]["subtabs"]["companions"]["images"]

    lines = [l.strip() for l in text.split("\n") if l.strip()]

    KNOWN_CLASSES = {"WARRIOR", "MAGE", "KNIGHT", "PALADIN", "GUARDIAN", "TEMPLAR",
                     "DUELIST", "BERSERKER", "CONQUEROR", "RAVAGER",
                     "SAGE", "ARCANIST", "DOMINATOR", "PROPHET",
                     "SORCERER", "ARCHMAGE", "DESTROYER", "MAGISTER"}
    SKIP_UI = {"SKILLS", "FANTOMONS", "COMPANIONS", "CLASS", "ALL", "STARTING",
               "WARRIOR PATH", "MAGE PATH", "KNIGHT PATH", "DUELIST PATH",
               "SAGE PATH", "SORCERER PATH"}

    CLASS_ES_MAP = {
        "WARRIOR": "Guerrero", "MAGE": "Mago", "KNIGHT": "Caballero",
        "PALADIN": "Paladín", "GUARDIAN": "Guardián", "TEMPLAR": "Templario",
        "DUELIST": "Duelista", "BERSERKER": "Berserker",
        "CONQUEROR": "Conquistador", "RAVAGER": "Devastador",
        "SAGE": "Sabio", "ARCANIST": "Arcanista",
        "DOMINATOR": "Dominador", "PROPHET": "Profeta",
        "SORCERER": "Hechicero", "ARCHMAGE": "Archimago",
        "DESTROYER": "Destructor", "MAGISTER": "Magistro",
    }

    # Parsear compañeros: nombre, rango (N RANKS · X → Y), clases compatibles
    companions = []
    i = 0
    while i < len(lines):
        ln = lines[i]
        # Detectar inicio de compañero: nombre seguido de "N RANKS · …"
        if (i + 1 < len(lines) and
                re.match(r'^\d+ RANKS', lines[i + 1]) and
                ln not in SKIP_UI and
                ln[0].isupper() and
                not ln.startswith("SXS") and
                "of " not in ln.lower()):
            name = ln
            ranks_info = lines[i + 1]
            compatible_classes = []
            j = i + 2
            while j < len(lines):
                nln = lines[j]
                if nln.upper() in KNOWN_CLASSES:
                    compatible_classes.append(CLASS_ES_MAP.get(nln.upper(), nln))
                elif nln == "›":
                    j += 1
                    break
                elif re.match(r'^\d+ RANKS', nln) or (j > i + 2 and nln[0].isupper()
                        and nln not in SKIP_UI and nln not in KNOWN_CLASSES
                        and "of " not in nln.lower()):
                    break
                j += 1
            companions.append({"name": name, "ranks": ranks_info,
                                "classes": compatible_classes})
            i = j
            continue
        i += 1

    items = []
    img_urls = [f"{BASE}{x}" if x.startswith("/") else x for x in images[:35]]

    for idx, c in enumerate(companions[:35]):
        classes_str = " · ".join(c["classes"]) if c["classes"] else "Universal"
        content = (
            f"Rangos: {c['ranks']}\n"
            f"Clases compatibles: {classes_str}"
        )
        img = img_urls[idx] if idx < len(img_urls) else ""
        items.append({
            "title": c["name"],
            "content": content,
            "images": [img] if img else [],
            "source_url": SOURCE,
            "meta": {},
        })

    cover = img_urls[0] if img_urls else None
    return {
        "game": "sword-x-staff", "kind": "section",
        "slug": "companeros",
        "title": f"Compañeros — Sword x Staff ({len(items)} indexados)",
        "intro_title": "Compañeros",
        "intro": (
            f"{len(items)} compañeros indexados. Cada compañero progresa de Blackiron hasta Saint. "
            "Son distintos de los Fantomons: los compañeros son personajes del mundo del juego, "
            "cada uno compatible con líneas de clase específicas."
        ),
        "intro_images": [cover] if cover else [],
        "source_url": SOURCE, "is_published": False,
        "render_type": "generic", "order_index": 5,
        "label": "Compañeros", "icon": "users",
        "cover_image": cover,
        "description": f"{len(items)} compañeros con clases compatibles y rangos",
        "items": items,
    }


# ─── 6. ROADMAP ───────────────────────────────────────────────────────────────
def build_roadmap():
    text = deep["roadmap"]["text"]
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    # Los bloques del roadmap están organizados por temporada (01 LAUNCH, 02 SEASON 1, etc.)
    SEASONS = [
        ("01", "Ventana de Lanzamiento — Verdantglade + Cinder Ridge (Días 1–8)"),
        ("02", "Temporada 1 — Aqualis (Días 12–43)"),
        ("03", "Temporada 2 — Loong Haven (Días 47–113)"),
        ("04", "Temporada 3 — Aethyris (Días 114+)"),
        ("05", "Temporada 4 — Hapadi"),
    ]

    # Extraer el texto completo de la sección de roadmap (sin el header del hub)
    rm_start = 0
    for i, ln in enumerate(lines):
        if "ENDGAME ROADMAP" in ln or "215" in ln:
            rm_start = i
            break

    rm_lines = lines[rm_start:]
    rm_text = "\n".join(rm_lines)

    # Dividir por número de temporada
    season_splits = re.split(r'\n(?=0[1-9]\n)', rm_text)

    items = []
    for chunk in season_splits:
        chunk = chunk.strip()
        if not chunk:
            continue
        # Primer línea es el número de temporada
        chunk_lines = chunk.split("\n")
        season_num = chunk_lines[0].strip() if chunk_lines else ""
        # Buscar nombre de temporada
        season_label_es = next(
            (label for num, label in SEASONS if num == season_num),
            f"Temporada {season_num}"
        )
        # Contenido del resto
        body = "\n".join(chunk_lines[1:]).strip()
        if not body and not season_num:
            continue

        # Traducir keywords comunes
        body = (body
            .replace("LAUNCH WINDOW", "Ventana de Lanzamiento")
            .replace("ENDGAME ROADMAP", "Roadmap de Endgame")
            .replace("DAYS MAPPED", "días mapeados")
            .replace("SEASONS", "temporadas")
            .replace("JOB CHANGES", "cambios de trabajo")
            .replace("FINAL POWER WALL", "Muro de Poder Final")
            .replace("REGION", "Región")
            .replace("DUNGEON", "Mazmorra")
            .replace("JOB CHANGE", "Cambio de Trabajo")
            .replace("TREASURE HUNT", "Caza del Tesoro")
            .replace("MINI-GAME", "Minijuego")
            .replace("SEASONAL MAP", "Mapa Estacional")
            .replace("SPECULATION", "Especulación")
            .replace("UNLOCK", "Desbloqueo")
            .replace("ESTIMATED", "ESTIMADO")
            .replace("Region unlock", "Desbloqueo de región")
            .replace("Season 1 Start", "Inicio Temporada 1")
            .replace("Season 2 Start", "Inicio Temporada 2")
            .replace("DAY\n", "Día ")
        )

        items.append({
            "title": season_label_es if season_label_es != f"Temporada {season_num}" else f"Bloque {season_num}",
            "content": body[:3000],
            "images": [],
            "source_url": SOURCE,
            "meta": {},
        })

    # Si el parseo no dio buen resultado, usar bloques generales
    if len(items) < 2:
        items = [
            {
                "title": "Ventana de Lanzamiento — Días 1–8 (T1+T2)",
                "content": (
                    "Día 1 (Mar. 19 mayo 2026) — REGIÓN: Verdantglade desbloqueada. "
                    "MAZMORRA: Auroradrasil (Normal/Hard, poder 36K).\n\n"
                    "Día 4 (Vie. 22 mayo 2026) — REGIÓN: Cinder Ridge desbloqueada. "
                    "CAMBIO DE TRABAJO: 2º trabajo (Nv. 44, clase Nv. 20 + 1º trabajo Nv. 18). "
                    "MAZMORRA: Mecha Summit (Normal/Hard, 180K).\n\n"
                    "Día 8 (Mar. 26 mayo 2026) — CAZA DEL TESORO: Grand Treasure Hunt. "
                    "Elección: Mythic Relic Box - Cinder Ridge."
                ),
                "images": [], "source_url": SOURCE, "meta": {},
            },
            {
                "title": "Temporada 1 — Aqualis (Días 12–43)",
                "content": (
                    "Día 12 (Sáb. 30 mayo 2026) — REGIÓN: Aqualis. Inicio Temporada 1. "
                    "CAMBIO DE TRABAJO: 3er trabajo (Nv. 82, clase Nv. 48 + 2º trabajo Nv. 16). "
                    "MAZMORRA: Ocean Palace Ruins (Normal/Hard, 580K).\n\n"
                    "Día 14 — ESPECULACIÓN: Posible Evento de Verano (~300 Destiny Fruits, sin confirmar).\n\n"
                    "Día 15 — CAZA DEL TESORO + MINIJUEGO: Bingo Draw.\n\n"
                    "Día 22 — CAZA DEL TESORO: 3er Job Skill Fragment ×180 + Lucky Scratch.\n\n"
                    "Día 24 — MAZMORRA: Aquaorigin Shrine (Nv. 100+, Normal 930K / Hard 1.45M / Nightmare 2.05M).\n\n"
                    "Día 26 — MAPA ESTACIONAL: Whaleback Island.\n\n"
                    "Días 29–43 (estimados): más caza de tesoro, Hellhold (hasta 6.2M Nightmare/Inferno), "
                    "Feneck's Puzzle y Lucky Scratch."
                ),
                "images": [], "source_url": SOURCE, "meta": {},
            },
            {
                "title": "Temporada 2 — Loong Haven (Días 47–113)",
                "content": (
                    "Día 47 (~Sáb. 4 jul. 2026, ESTIMADO) — REGIÓN: Loong Haven. Inicio Temporada 2. "
                    "CAMBIO DE TRABAJO: 4º trabajo (Nv. 106). "
                    "MAZMORRA: Demonseal Gorge (Normal/Hard, 2.35M). "
                    "DESBLOQUEO: Fantomon Adulto (Nv. 108), Torre de Gemas.\n\n"
                    "Los días siguientes incluyen más mazmorras de alto nivel, "
                    "cazas de tesoro y minijuegos a lo largo de 66 días hasta el límite de Loong Haven."
                ),
                "images": [], "source_url": SOURCE, "meta": {},
            },
            {
                "title": "Temporada 3–4 — Aethyris y Hapadi",
                "content": (
                    "El roadmap mapea 215 días en total con 4 temporadas y 6 cambios de trabajo. "
                    "El muro de poder final es de 350M, alcanzado en la Temporada 4 (Hapadi). "
                    "Las fechas de T3+ son estimadas, basadas en la cadencia de T1–T2 y pueden "
                    "cambiar con parches o mantenimiento."
                ),
                "images": [], "source_url": SOURCE, "meta": {},
            },
        ]

    cover = f"{BASE}/assets/games/sword-x-staff/kingdoms/mountain.webp"
    return {
        "game": "sword-x-staff", "kind": "section",
        "slug": "roadmap",
        "title": "Roadmap — Sword x Staff",
        "intro_title": "Roadmap de Progresión (215 días)",
        "intro": (
            "Ruta de progresión día a día desde la ventana de lanzamiento (Verdantglade) hasta el "
            "desbloqueo de la Temporada 5 (Hapadi). 4 temporadas · 6 cambios de trabajo · "
            "350M de muro de poder final. Las fechas están en horario del servidor (Asia, GMT+7). "
            "Las fechas pasadas son reales; las futuras son estimaciones marcadas con ~."
        ),
        "intro_images": [cover],
        "source_url": SOURCE, "is_published": False,
        "render_type": "generic", "order_index": 7,
        "label": "Roadmap", "icon": "calendar", "cover_image": cover,
        "description": "Progresión día a día de las 4 temporadas (215 días mapeados)",
        "items": items,
    }


# ─── Main ──────────────────────────────────────────────────────────────────────
SECTIONS = [
    ("sxs_tier_list",  build_tier_list),
    ("sxs_builds",     build_builds),
    ("sxs_habilidades", build_habilidades),
    ("sxs_fantomons",  build_fantomons),
    ("sxs_companeros", build_companeros),
    ("sxs_roadmap",    build_roadmap),
]

for fname, fn in SECTIONS:
    print(f"Generando {fname}...", end=" ")
    try:
        data = fn()
        path = f"scripts/data/canonical/{fname}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"[ok] {len(data['items'])} items -> {path}")
    except Exception as e:
        import traceback
        print(f"[ERROR] {e}")
        traceback.print_exc()
