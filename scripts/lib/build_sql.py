"""Generador de SQL genérico para IMPERIUM.

Convierte UN JSON canónico (ver scripts/lib/validate.py) en un único bloque
`do $IMPERIUM$ … end $IMPERIUM$;` listo para ejecutar en Supabase (vía el MCP
mcp__supabase__execute_sql o el editor SQL).

Ventajas frente a los scripts a medida antiguos:
  - UNA sola etiqueta de dollar-quoting ($IMPERIUM$), validada (no se rompe con
    acentos, comillas ni saltos de línea).
  - Idempotente: borra por slug y reinserta -> re-montar no duplica.
  - Siempre is_verified=false, order_index secuencial (1,2,3…), source_url en
    cada item (cae al source_url raíz si el item no trae).
  - Soporta secciones (game_sections/section_blocks, con meta jsonb) y guías
    (guides/guide_steps).

OJO: re-montar una GUÍA borra y recrea sus guide_steps; como step_progress
referencia esos pasos con ON DELETE CASCADE, el progreso de los usuarios en esa
guía se reinicia. Es el comportamiento esperado al reemplazar contenido.

Uso:
    python scripts/lib/build_sql.py scripts/data/<algo>.json > scripts/sql/<algo>.sql
"""
from __future__ import annotations

import json
import sys
from typing import Any

# Permite ejecutar el archivo directamente (sin instalar el paquete).
sys.path.insert(0, __file__.rsplit("lib", 1)[0] + "lib")
from validate import DOLLAR_TAG, validate_canonical  # noqa: E402


# ── Helpers de emisión de literales SQL ─────────────────────────────────────
def lit(value: Any) -> str:
    """Literal de texto SQL con comillas simples escapadas. None -> NULL."""
    if value is None:
        return "null"
    s = str(value)
    return "'" + s.replace("'", "''") + "'"


def arr(values: list[str] | None) -> str:
    """Literal de text[] : array['a','b']::text[] (vacío -> array[]::text[])."""
    values = values or []
    if not values:
        return "array[]::text[]"
    inner = ", ".join(lit(v) for v in values)
    return f"array[{inner}]::text[]"


def jsonb(meta: dict | None) -> str:
    """Literal jsonb. None/{} -> '{}'::jsonb."""
    if not meta:
        return "'{}'::jsonb"
    raw = json.dumps(meta, ensure_ascii=False, sort_keys=True)
    return lit(raw) + "::jsonb"


# ── Constructores por tipo ──────────────────────────────────────────────────
def _build_section(data: dict) -> str:
    game = data["game"]
    slug = data["slug"]
    top_source = data.get("source_url")
    is_pub = "true" if data.get("is_published") else "false"

    lines: list[str] = []
    lines.append(f"do {DOLLAR_TAG}")
    lines.append("declare")
    lines.append("  v_game uuid;")
    lines.append("  v_section uuid;")
    lines.append("begin")
    lines.append(f"  select id into v_game from public.games where slug = {lit(game)};")
    lines.append("  if v_game is null then")
    lines.append(f"    raise exception 'IMPERIUM: juego no encontrado: %', {lit(game)};")
    lines.append("  end if;")
    lines.append("")
    lines.append("  -- Reemplazo idempotente: borra la sección y sus bloques, luego reinserta.")
    lines.append("  delete from public.section_blocks where section_id in (")
    lines.append(f"    select id from public.game_sections where game_id = v_game and slug = {lit(slug)});")
    lines.append(f"  delete from public.game_sections where game_id = v_game and slug = {lit(slug)};")
    lines.append("")
    lines.append("  insert into public.game_sections")
    lines.append("    (game_id, slug, title, intro_title, intro, intro_images, is_published)")
    lines.append("  values")
    lines.append(
        f"    (v_game, {lit(slug)}, {lit(data['title'])}, {lit(data.get('intro_title'))}, "
        f"{lit(data.get('intro'))}, {arr(data.get('intro_images'))}, {is_pub})"
    )
    lines.append("  returning id into v_section;")
    lines.append("")
    lines.append("  insert into public.section_blocks")
    lines.append("    (section_id, order_index, title, content, source_url, is_verified, images, meta)")
    lines.append("  values")
    rows = []
    for i, it in enumerate(data["items"], start=1):
        src = it.get("source_url") or top_source
        rows.append(
            f"    (v_section, {i}, {lit(it.get('title'))}, {lit(it.get('content'))}, "
            f"{lit(src)}, false, {arr(it.get('images'))}, {jsonb(it.get('meta'))})"
        )
    lines.append(",\n".join(rows) + ";")
    lines.append("end")
    lines.append(f"{DOLLAR_TAG};")
    return "\n".join(lines)


def _build_guide(data: dict) -> str:
    game = data["game"]
    slug = data["slug"]
    top_source = data.get("source_url")
    is_pub = "true" if data.get("is_published") else "false"
    order_index = int(data.get("order_index") or 0)

    lines: list[str] = []
    lines.append(f"do {DOLLAR_TAG}")
    lines.append("declare")
    lines.append("  v_game uuid;")
    lines.append("  v_guide uuid;")
    lines.append("begin")
    lines.append(f"  select id into v_game from public.games where slug = {lit(game)};")
    lines.append("  if v_game is null then")
    lines.append(f"    raise exception 'IMPERIUM: juego no encontrado: %', {lit(game)};")
    lines.append("  end if;")
    lines.append("")
    lines.append("  -- Reemplazo idempotente. OJO: borra los pasos -> reinicia step_progress de esta guía.")
    lines.append("  delete from public.guide_steps where guide_id in (")
    lines.append(f"    select id from public.guides where game_id = v_game and slug = {lit(slug)});")
    lines.append(f"  delete from public.guides where game_id = v_game and slug = {lit(slug)};")
    lines.append("")
    lines.append("  insert into public.guides")
    lines.append("    (game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images)")
    lines.append("  values")
    lines.append(
        f"    (v_game, {lit(slug)}, {lit(data['title'])}, {lit(data.get('description'))}, "
        f"{order_index}, {is_pub}, {lit(data.get('intro_title'))}, {lit(data.get('intro'))}, "
        f"{arr(data.get('intro_images'))})"
    )
    lines.append("  returning id into v_guide;")
    lines.append("")
    lines.append("  insert into public.guide_steps")
    lines.append("    (guide_id, order_index, title, content, source_url, is_verified, images)")
    lines.append("  values")
    rows = []
    for i, it in enumerate(data["items"], start=1):
        src = it.get("source_url") or top_source
        rows.append(
            f"    (v_guide, {i}, {lit(it.get('title'))}, {lit(it.get('content'))}, "
            f"{lit(src)}, false, {arr(it.get('images'))})"
        )
    lines.append(",\n".join(rows) + ";")
    lines.append("end")
    lines.append(f"{DOLLAR_TAG};")
    return "\n".join(lines)


def build_sql(data: dict) -> str:
    if data["kind"] == "guide":
        return _build_guide(data)
    return _build_section(data)


def main() -> int:
    # Forzar UTF-8 en la salida para que los acentos no se corrompan al
    # redirigir a un .sql en Windows (cp1252 por defecto al no ser consola).
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except Exception:
        pass

    if len(sys.argv) != 2:
        print("Uso: python scripts/lib/build_sql.py <archivo.json>", file=sys.stderr)
        return 2
    with open(sys.argv[1], encoding="utf-8") as f:
        data = json.load(f)

    errors, warnings = validate_canonical(data)
    for w in warnings:
        print(f"[aviso] {w}", file=sys.stderr)
    if errors:
        print("[ABORTADO] El JSON tiene errores; corrígelos antes de generar SQL:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    print(
        f"[ok] {data['kind']} '{data['slug']}' ({data['game']}) -> "
        f"{len(data['items'])} items. SQL en stdout.",
        file=sys.stderr,
    )
    print(build_sql(data))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
