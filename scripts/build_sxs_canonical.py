"""Convierte las 11 guías ya traducidas de Sword x Staff (scripts/data/translated/)
al esquema canónico y genera el SQL con el pipeline (scripts/lib/build_sql.py).

Salida: scripts/sql/sxs-guides.sql (11 bloques DO idempotentes, en BORRADOR).
Las guías quedan is_published=false; Miguel las revisa y publica.
"""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "lib"))
from validate import validate_canonical  # noqa: E402
from build_sql import build_sql  # noqa: E402

BASE = "https://eog.gg/games/sword-x-staff/guides/"
TR = os.path.join("scripts", "data", "translated")

# Orden lógico para el listado de guías (inicio primero).
ORDER = [
    "beginner-guide", "reroll-guide", "important-tips", "gacha-and-pity",
    "daily-dungeons", "grand-treasure-hunt", "food-guide", "destiny-fruit",
    "companion-upgrade", "dps-dummy-test", "void-rifts",
]

blocks = []
for i, slug in enumerate(ORDER, start=1):
    path = os.path.join(TR, f"{slug}.json")
    d = json.load(open(path, encoding="utf-8"))
    url = f"{BASE}{slug}/"
    canon = {
        "game": "sword-x-staff",
        "kind": "guide",
        "slug": slug,
        "title": d["title"],
        "description": d.get("excerpt", ""),
        "intro_title": d.get("introTitle"),
        "intro": d.get("intro"),
        "intro_images": d.get("introImages", []),
        "source_url": url,
        "is_published": False,  # BORRADOR
        "order_index": i,
        "items": [
            {"title": s["title"], "content": s["content"],
             "images": s.get("images", []), "source_url": url}
            for s in d["sections"]
        ],
    }
    errs, warns = validate_canonical(canon)
    for w in warns:
        print(f"[{slug}] aviso: {w}", file=sys.stderr)
    if errs:
        print(f"[{slug}] ERRORES: {errs}", file=sys.stderr)
        sys.exit(1)
    blocks.append(build_sql(canon))
    print(f"[{i}/{len(ORDER)}] {slug}: {len(canon['items'])} pasos", file=sys.stderr)

os.makedirs(os.path.join("scripts", "sql"), exist_ok=True)
out = os.path.join("scripts", "sql", "sxs-guides.sql")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n\n".join(blocks) + "\n")
print(f"\nEscrito {out}: {len(blocks)} guías.", file=sys.stderr)
