"""
Convierte las tablas escritas con separador ' · ' a ' | ' en el contenido
canónico, para que RichText (guías y secciones) las renderice como cuadrícula HUD.

Criterio block-aware idéntico al de RichText: un "bloque" (separado por línea en
blanco) es tabla si tiene ≥2 líneas y ≥60% de ellas contienen el separador. Solo
en esos bloques se sustituye ' · ' -> ' | '. Así no se toca el texto normal.

Uso: python scripts/lib/tables_to_pipe.py scripts/data/<archivo>.json [...]
"""
import json, sys, math, re

SEP = " · "


def convert_block(block: str) -> tuple[str, bool]:
    lines = [l for l in block.split("\n")]
    nonempty = [l for l in lines if l.strip()]
    if len(nonempty) < 2:
        return block, False
    sep_lines = [l for l in nonempty if SEP in l]
    if len(sep_lines) >= math.ceil(len(nonempty) * 0.6):
        # Es una tabla: convertir el separador de columnas a barra.
        new = block.replace(SEP, " | ")
        return new, True
    return block, False


def convert_content(content: str) -> tuple[str, int]:
    if not content or SEP not in content:
        return content, 0
    blocks = re.split(r"(\n\s*\n)", content)  # conserva los separadores
    out, n = [], 0
    for b in blocks:
        if b.strip() == "" or "\n" not in b and SEP not in b:
            out.append(b); continue
        nb, changed = convert_block(b)
        out.append(nb)
        if changed:
            n += 1
    return "".join(out), n


def process(path: str) -> None:
    d = json.load(open(path, encoding="utf-8"))
    total = 0
    for key in ("intro",):
        if d.get(key):
            d[key], n = convert_content(d[key]); total += n
    for it in d.get("items", []):
        it["content"], n = convert_content(it.get("content", "")); total += n
    json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"{path}: {total} tabla(s) convertida(s)")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        process(p)
