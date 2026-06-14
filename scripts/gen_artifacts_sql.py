import json, sys, io, re

sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding="utf-8")
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

with open("scripts/artifacts_data.json", encoding="utf-8") as f:
    d = json.load(f)

GAME_ID = "7137eaf9-fbc4-4ade-b36f-cf73221d10cd"
SECTION_SLUG = "artefactos"

# Traducciones de títulos clave
TITLE_MAP = {
    "Artifacts Ultimate Guide": "Guía Definitiva de Artefactos",
    "What are artifacts in Call of Dragons?": "¿Qué son los Artefactos en Call of Dragons?",
    "Best Heroes to Use with Artifacts": "Mejores Héroes para Usar con Artefactos",
    "Complete List of All Artifacts": "Lista Completa de Artefactos",
    "How to Activate Artifacts": "Cómo Activar Artefactos",
    "How to get artifact Items?": "¿Cómo Conseguir Objetos de Artefacto?",
    "Artifact keys": "Llaves de Artefacto",
    "How to Equip Artifacts on Heroes": "Cómo Equipar Artefactos en Héroes",
    "Artifacts Rarity": "Rareza de Artefactos",
    "How to upgrade artifacts": "Cómo Mejorar Artefactos",
    "Artifact Level": "Nivel de Artefacto",
    "Star Rating": "Calificación de Estrellas",
    "Skill Level": "Nivel de Habilidad",
    "How to pick the best artifacts for your Heroes": "Cómo Elegir los Mejores Artefactos para tus Héroes",
}

def tr_title(t):
    return TITLE_MAP.get(t, t)

def esc(s):
    return s.replace("'", "''").replace("\x00", "").replace("﻿", "").strip()

# Intro
intro_title_es = tr_title(d["title"])
intro_es = (
    "Los artefactos en Call of Dragons son objetos especiales que se pueden equipar en los héroes para potenciar sus habilidades en batalla. "
    "Esta guía cubre todo sobre los artefactos: cómo obtenerlos, activarlos, equiparlos, mejorarlos y cuáles son los mejores para cada héroe."
)
intro_img = d["intro_images"][0] if d["intro_images"] else ""

lines = []
lines.append("DO $sxsq$")
lines.append("DECLARE v_section_id uuid;")
lines.append("BEGIN")
lines.append("")
lines.append("-- Borrar si ya existe")
lines.append(f"DELETE FROM section_blocks sb USING game_sections gs")
lines.append(f"  WHERE sb.section_id = gs.id AND gs.game_id = '{GAME_ID}' AND gs.slug = '{SECTION_SLUG}';")
lines.append(f"DELETE FROM game_sections WHERE game_id = '{GAME_ID}' AND slug = '{SECTION_SLUG}';")
lines.append("")
lines.append("INSERT INTO game_sections (game_id, slug, title, intro_title, intro, intro_images, is_published)")
lines.append(f"VALUES ('{GAME_ID}', '{SECTION_SLUG}', 'Artefactos', '{esc(intro_title_es)}',")
lines.append(f"  '{esc(intro_es)}',")
lines.append(f"  ARRAY['{esc(intro_img)}']::text[], true)")
lines.append("RETURNING id INTO v_section_id;")
lines.append("")

for i, b in enumerate(d["blocks"], 1):
    title_es = tr_title(b["title"])
    content_es = esc(b["content"])
    # Limitar a 3 imágenes por bloque para no saturar
    imgs = [esc(x) for x in b["images"][:3] if x and not x.startswith("data:")]
    imgs_sql = "ARRAY[" + ",".join(f"'{u}'" for u in imgs) + "]::text[]" if imgs else "ARRAY[]::text[]"

    lines.append(f"INSERT INTO section_blocks (section_id, order_index, title, content, source_url, is_verified, images)")
    lines.append(f"VALUES (v_section_id, {i}, '{esc(title_es)}',")
    lines.append(f"  '{content_es}',")
    lines.append(f"  'https://cod.guide/artifacts/', false, {imgs_sql});")
    lines.append("")

lines.append("END $sxsq$;")

sql = "\n".join(lines)
with open("scripts/artifacts_insert.sql", "w", encoding="utf-8") as f:
    f.write(sql)
print(f"SQL generado: {len(lines)} líneas, {len(d['blocks'])} bloques")
