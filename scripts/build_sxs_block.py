# Genera el bloque TypeScript del juego "Sword x Staff" para demo-data.ts (respaldo
# legible; la web real lee de Supabase). Estructura fiel: intro de guía + secciones.
import json
import io

SLUGS = [
    "beginner-guide", "companion-upgrade", "daily-dungeons", "destiny-fruit",
    "dps-dummy-test", "food-guide", "gacha-and-pity", "grand-treasure-hunt",
    "important-tips", "reroll-guide", "void-rifts",
]
BASE_GUIDE_URL = "https://eog.gg/games/sword-x-staff/guides/{}/"


def js(s):
    return json.dumps(s if s is not None else "", ensure_ascii=False)


def js_arr(a):
    return json.dumps(a or [], ensure_ascii=False)


def main():
    out = io.StringIO()
    w = out.write
    w("  {\n")
    w('    slug: "sword-x-staff",\n')
    w('    name: "Sword x Staff",\n')
    w('    tag: "RPG / Gacha",\n')
    w('    rank: "S",\n')
    w("    locked: false,\n")
    w('    description:\n')
    w('      "Guías de la comunidad para Sword x Staff: primeros pasos, clases, gacha, '
      'mazmorras diarias y más. Traducidas al español desde eog.gg (sin verificar).",\n')
    w("    guides: [\n")

    for gi, slug in enumerate(SLUGS):
        with open(f"scripts/translated/{slug}.json", encoding="utf-8") as f:
            g = json.load(f)
        url = BASE_GUIDE_URL.format(slug)
        w("      {\n")
        w(f"        slug: {js(slug)},\n")
        w(f"        title: {js(g['title'])},\n")
        w(f"        description: {js(g.get('excerpt',''))},\n")
        w(f"        orderIndex: {gi + 1},\n")
        if g.get("introTitle"):
            w(f"        introTitle: {js(g['introTitle'])},\n")
        if g.get("intro"):
            w(f"        intro: {js(g['intro'])},\n")
        if g.get("introImages"):
            w(f"        introImages: {js_arr(g['introImages'])},\n")
        w("        steps: [\n")
        for si, sec in enumerate(g["sections"]):
            w("          {\n")
            w(f"            id: {js(f'{slug}-{si + 1}')},\n")
            w(f"            orderIndex: {si + 1},\n")
            w(f"            title: {js(sec['title'])},\n")
            w(f"            content: {js(sec['content'])},\n")
            w(f"            sourceUrl: {js(url)},\n")
            w("            isVerified: false,\n")
            if sec.get("images"):
                w(f"            images: {js_arr(sec['images'])},\n")
            w("          },\n")
        w("        ],\n")
        w("      },\n")

    w("    ],\n")
    w("  },\n")

    with open("scripts/sxs-block.txt", "w", encoding="utf-8") as f:
        f.write(out.getvalue())
    total = sum(len(json.load(open(f'scripts/translated/{s}.json', encoding='utf-8'))['sections']) for s in SLUGS)
    print(f"Bloque generado: 11 guías, {total} pasos -> scripts/sxs-block.txt")


if __name__ == "__main__":
    main()
