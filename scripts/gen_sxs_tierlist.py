"""Construye el JSON canónico de la sección 'tier-list' de Sword x Staff a partir
de scripts/data/sxs_tierlist_es.json (ya traducido).

Cada región CLASS -> un item con content '__CTIER__{json}' y meta {tab,tier}.
La vista FANTOMON -> un item con content '__FTIER__{json}' y meta {tab}.
El visor ClassTierViewer (render_type 'class-tier') lee esos bloques.

Salida: scripts/data/canonical/sxs_tier_list.json
Uso   : python scripts/gen_sxs_tierlist.py
Luego : validate.py + build_sql.py (pipeline estándar).
"""
import json
import os

SRC = "https://eog.gg/games/sword-x-staff/"
COVER = "https://eog.gg/assets/sxs/classes/archmage.png"
ES = "scripts/data/sxs_tierlist_es.json"
OUT = "scripts/data/canonical/sxs_tier_list.json"

ICON = "https://eog.gg/assets/sxs/classes/{}.png"

# Árbol de evolución de clases. Datos CONFIRMADOS por la fuente: la pestaña
# Database de eog agrupa las 18 clases por línea en este orden (Warrior/Mage base
# + 4 etapas por línea), y el Tier List confirma las clases de T3/T4/T5. Los roles
# son un resumen en español de las descripciones reales scrapeadas (no inventados).
# Se muestra en T1/T2, que no tienen tabla de grados en la fuente (juego recién
# salido). Cada etapa lleva su icono (todas las URLs verificadas con HTTP 200).
TREE_LINES = [
    {
        "key": "duelist", "line": "Línea Duelist", "icon": ICON.format("berserker"),
        "role": "DPS cuerpo a cuerpo. Pega fuerte desde temprano y rinde más por recurso: la mejor relación coste/poder para empezar (F2P o gasto bajo).",
        "stages": ["Warrior", "Duelist", "Berserker", "Conqueror", "Ravager"],
    },
    {
        "key": "knight", "line": "Línea Knight", "icon": ICON.format("paladin"),
        "role": "Tanque. Mucha supervivencia, ancla el frente y controla el espacio; domina el 4v4. Su punto débil constante es Dragón y Caos.",
        "stages": ["Warrior", "Knight", "Paladin", "Guardian", "Templar"],
    },
    {
        "key": "sorcerer", "line": "Línea Sorcerer", "icon": ICON.format("archmage"),
        "role": "DPS mágico a distancia. AoE que limpia rápido y reina del PvP; necesita inversión alta para alcanzar su techo.",
        "stages": ["Mage", "Sorcerer", "Archmage", "Destroyer", "Magister"],
    },
    {
        "key": "sage", "line": "Línea Sage", "icon": ICON.format("arcanist"),
        "role": "Soporte y control. Debuffs, curas e invocaciones que brillan en grupo; arranca floja pero la rama llega al tope del endgame (Prophet).",
        "stages": ["Mage", "Sage", "Arcanist", "Dominator", "Prophet"],
    },
]
TIERS = ["T1", "T2", "T3", "T4", "T5"]


def build_tree(highlight):
    """Árbol con la etapa de la región actual resaltada (highlight = 'T1'/'T2')."""
    lines = []
    for L in TREE_LINES:
        stages = [
            {"tier": TIERS[i], "name": name, "icon": ICON.format(name.lower())}
            for i, name in enumerate(L["stages"])
        ]
        lines.append({"key": L["key"], "line": L["line"], "role": L["role"],
                      "icon": L["icon"], "stages": stages})
    return {"highlight": highlight, "lines": lines}


def compact(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))


def main():
    es = json.load(open(ES, encoding="utf-8"))
    items = []

    for r in es["class"]["regions"]:
        # T1/T2 no traen tabla de grados en la fuente -> añadimos el árbol de clases
        # (datos reales) para orientar a los jugadores nuevos.
        if not r.get("classes") and r["tier"] in ("T1", "T2"):
            r = {**r, "tree": build_tree(r["tier"])}
        items.append({
            "title": f"{r['tier']} · {r['region']}",
            "content": "__CTIER__" + compact(r),
            "source_url": SRC,
            "meta": {"tab": "class", "tier": r["tierKey"]},
        })

    if es.get("fantomon"):
        items.append({
            "title": "Fantomons",
            "content": "__FTIER__" + compact(es["fantomon"]),
            "source_url": SRC,
            "meta": {"tab": "fantomon"},
        })

    canonical = {
        "game": "sword-x-staff",
        "kind": "section",
        "slug": "tier-list",
        "title": "Tier List — Sword x Staff",
        "intro_title": "Clases y Fantomons por región",
        "intro": (
            "Calificaciones por estilo de combate (PvE · Dragón y Caos · PvP · 4v4) "
            "para cada región del juego (T1–T5), más la tier list de Fantomons.\n\n"
            "Las grades asumen una cuenta desarrollada. La línea Guerrero (Duelist) "
            "alcanza su techo antes y rinde mejor por recurso, así que es la mejor "
            "opción para cuentas F2P o de gasto bajo; las líneas mágicas escalan más "
            "alto pero exigen inversión pesada."
        ),
        "intro_images": [COVER],
        "source_url": SRC,
        "is_published": False,
        "label": "Tier List",
        "description": "Mejores clases por modo y región (T1–T5) + tier list de Fantomons",
        "icon": "shield",
        "cover_image": COVER,
        "render_type": "class-tier",
        "order_index": 1,
        "items": items,
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(canonical, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"OK -> {OUT}  ({len(items)} items)")


if __name__ == "__main__":
    main()
