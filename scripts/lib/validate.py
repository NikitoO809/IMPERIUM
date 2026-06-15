"""Validador del JSON canónico de contenido de IMPERIUM.

Un único "esquema canónico" describe TODO el contenido montable (guías y
secciones), de modo que un solo generador (build_sql.py) pueda producir el SQL.
Este módulo revisa el JSON ANTES de generar el SQL y avisa de problemas:

  - errores  -> bloquean la generación (romperían el SQL o la página)
  - avisos   -> no bloquean, pero conviene revisarlos (p. ej. falta portada)

Esquema canónico (un objeto por guía/sección):

  {
    "game": "call-of-dragons",        # slug del juego (obligatorio)
    "kind": "section",                 # "section" | "guide" (obligatorio)
    "slug": "war-pets",                # slug del catálogo / de la guía (obligatorio)
    "title": "War Pets",               # título (obligatorio)
    "description": "...",              # solo guías; resumen corto (opcional)
    "intro_title": "...",              # bloque intro (opcional)
    "intro": "...",                    # párrafos separados por \\n\\n (opcional)
    "intro_images": ["https://..."],   # [0] = portada del card (recomendado)
    "source_url": "https://...",       # fuente; cae a cada item si éste no la trae
    "is_published": false,             # opcional (def. false)
    "order_index": 0,                  # solo guías: orden entre guías (opcional)
    "items": [                          # pasos (guide) o bloques (section), EN ORDEN
      {
        "title": "Shadowblades",
        "content": "texto limpio en español...",
        "images": ["https://..."],
        "source_url": "https://...",
        "meta": { "tier": "Legendary" }  # metadatos estructurados (p. ej. tier)
      }
    ]
  }
"""
from __future__ import annotations

import json
from typing import Any

# Etiqueta única de dollar-quoting que usa build_sql.py para el bloque DO.
# Si el contenido la contiene, cerraría el bloque antes de tiempo -> error.
DOLLAR_TAG = "$IMPERIUM$"

# Secciones del Hub que SÍ usan el modelo genérico game_sections/section_blocks.
# (guias y heroes tienen su propia implementación y no se montan por aquí.)
KNOWN_SECTION_SLUGS = {
    # Call of Dragons
    "facciones", "war-pets", "behemoths", "artefactos",
    "codigos", "eventos", "herramientas",
    # Sword x Staff
    "tier-list", "builds", "roadmap", "habilidades",
    "fantomons", "companeros", "veredicto", "resumen",
}

# Prefijos mágicos cuyo resto del contenido debe ser JSON válido.
JSON_PREFIXES = ("__ARTIFACT_TABLE__", "__TABLE__")


def _has_dollar_tag(value: Any) -> bool:
    return isinstance(value, str) and DOLLAR_TAG in value


def validate_canonical(data: dict) -> tuple[list[str], list[str]]:
    """Devuelve (errores, avisos). Lista vacía de errores = listo para generar SQL."""
    errors: list[str] = []
    warnings: list[str] = []

    # ── Campos de cabecera ──────────────────────────────────────────────────
    game = data.get("game")
    if not game or not isinstance(game, str):
        errors.append("Falta 'game' (slug del juego).")

    kind = data.get("kind")
    if kind not in ("section", "guide"):
        errors.append("'kind' debe ser 'section' o 'guide'.")

    slug = data.get("slug")
    if not slug or not isinstance(slug, str):
        errors.append("Falta 'slug'.")
    elif slug != slug.lower() or " " in slug:
        warnings.append(f"'slug' debería ser kebab-case en minúsculas: {slug!r}.")

    if not data.get("title"):
        errors.append("Falta 'title'.")

    if kind == "section" and isinstance(slug, str) and slug not in KNOWN_SECTION_SLUGS:
        warnings.append(
            f"La sección '{slug}' no está en el catálogo del Hub "
            f"({', '.join(sorted(KNOWN_SECTION_SLUGS))}); no aparecerá como panel salvo que la añadas."
        )

    intro_images = data.get("intro_images") or []
    if not intro_images:
        warnings.append("Sin 'intro_images[0]': el card del Hub/cabecera no tendrá portada.")

    # ── Items (pasos o bloques) ─────────────────────────────────────────────
    items = data.get("items")
    if not isinstance(items, list) or not items:
        errors.append("'items' debe ser una lista no vacía.")
        items = []

    top_source = data.get("source_url")
    for i, it in enumerate(items, start=1):
        where = f"item #{i} ({it.get('title', 'sin título')!r})"
        if not isinstance(it, dict):
            errors.append(f"{where}: no es un objeto.")
            continue
        if not it.get("title"):
            errors.append(f"{where}: falta 'title' (columna NOT NULL).")

        content = it.get("content") or ""
        images = it.get("images") or []
        if not content and not images:
            warnings.append(f"{where}: sin 'content' ni 'images' (bloque vacío).")

        if not it.get("source_url") and not top_source:
            warnings.append(f"{where}: sin 'source_url' (ni a nivel raíz). Conviene la trazabilidad.")

        # Prefijos mágicos -> el resto debe ser JSON válido.
        for prefix in JSON_PREFIXES:
            if content.startswith(prefix):
                raw = content[len(prefix):]
                try:
                    json.loads(raw)
                except json.JSONDecodeError as e:
                    errors.append(f"{where}: JSON inválido tras {prefix}: {e}.")
                break

        # meta debe ser un objeto.
        meta = it.get("meta")
        if meta is not None and not isinstance(meta, dict):
            errors.append(f"{where}: 'meta' debe ser un objeto JSON.")

        # La etiqueta de dollar-quoting NO puede aparecer en el contenido.
        for field in ("title", "content", "source_url"):
            if _has_dollar_tag(it.get(field)):
                errors.append(f"{where}: el campo '{field}' contiene {DOLLAR_TAG}, rompería el SQL.")

    # Cabecera también libre de la etiqueta.
    for field in ("title", "intro_title", "intro"):
        if _has_dollar_tag(data.get(field)):
            errors.append(f"El campo de cabecera '{field}' contiene {DOLLAR_TAG}, rompería el SQL.")

    return errors, warnings


def _print_report(name: str, errors: list[str], warnings: list[str]) -> None:
    import sys
    if warnings:
        print(f"[{name}] AVISOS:", file=sys.stderr)
        for w in warnings:
            print(f"  - {w}", file=sys.stderr)
    if errors:
        print(f"[{name}] ERRORES:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
    if not errors and not warnings:
        print(f"[{name}] OK: sin problemas.", file=sys.stderr)


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Uso: python scripts/lib/validate.py <archivo.json>", file=sys.stderr)
        sys.exit(2)
    path = sys.argv[1]
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    errors, warnings = validate_canonical(data)
    _print_report(path, errors, warnings)
    sys.exit(1 if errors else 0)
