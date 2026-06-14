# Regenera el SQL para REEMPLAZAR las guías de "Sword x Staff" en Supabase con la
# estructura fiel (intro de guía + secciones reales). Borra las guías/pasos
# previos del juego y reinserta. El registro del juego (games) se reutiliza.
import json

SLUGS = [
    "beginner-guide", "companion-upgrade", "daily-dungeons", "destiny-fruit",
    "dps-dummy-test", "food-guide", "gacha-and-pity", "grand-treasure-hunt",
    "important-tips", "reroll-guide", "void-rifts",
]
BASE_GUIDE_URL = "https://eog.gg/games/sword-x-staff/guides/{}/"
TAG = "sxsq"


def dq(s):
    s = s or ""
    delim = f"${TAG}$"
    if delim in s:
        raise ValueError("El texto contiene el delimitador de dollar-quoting; cambia TAG.")
    return f"{delim}{s}{delim}"


def sql_array(urls):
    if not urls:
        return "'{}'::text[]"
    inner = ", ".join(dq(u) for u in urls)
    return f"array[{inner}]::text[]"


def main():
    L = []
    L.append("do $do$")
    L.append("declare")
    L.append("  gid uuid;")
    L.append("  guideid uuid;")
    L.append("begin")
    # El juego ya existe: recuperamos su id (y lo creamos si no existiera).
    L.append("  select id into gid from public.games where slug = 'sword-x-staff';")
    L.append("  if gid is null then")
    L.append("    insert into public.games (slug, name, description, is_published) "
             "values ('sword-x-staff', 'Sword x Staff', "
             f"{dq('Guías de la comunidad para Sword x Staff: primeros pasos, clases, gacha, mazmorras diarias y más. Traducidas al español desde eog.gg (sin verificar).')}, true) "
             "returning id into gid;")
    L.append("  end if;")
    # Borrar guías y pasos previos del juego (limpieza para reemplazar).
    L.append("  delete from public.guide_steps where guide_id in "
             "(select id from public.guides where game_id = gid);")
    L.append("  delete from public.guides where game_id = gid;")

    for gi, slug in enumerate(SLUGS):
        with open(f"scripts/translated/{slug}.json", encoding="utf-8") as f:
            g = json.load(f)
        url = BASE_GUIDE_URL.format(slug)
        L.append(
            "  insert into public.guides "
            "(game_id, slug, title, description, order_index, is_published, intro_title, intro, intro_images) "
            f"values (gid, '{slug}', {dq(g['title'])}, {dq(g.get('excerpt',''))}, {gi+1}, true, "
            f"{dq(g.get('introTitle',''))}, {dq(g.get('intro',''))}, {sql_array(g.get('introImages') or [])}) "
            "returning id into guideid;"
        )
        rows = []
        for si, sec in enumerate(g["sections"]):
            rows.append(
                f"    (guideid, {si+1}, {dq(sec['title'])}, {dq(sec['content'])}, "
                f"'{url}', false, {sql_array(sec.get('images') or [])})"
            )
        if rows:
            L.append("  insert into public.guide_steps "
                     "(guide_id, order_index, title, content, source_url, is_verified, images) values")
            L.append(",\n".join(rows) + ";")

    L.append("end")
    L.append("$do$;")

    sql = "\n".join(L)
    with open("scripts/sxs-insert.sql", "w", encoding="utf-8") as f:
        f.write(sql)
    total = sum(len(json.load(open(f'scripts/translated/{s}.json', encoding='utf-8'))['sections']) for s in SLUGS)
    print(f"SQL generado: {len(sql)} chars, {total} pasos -> scripts/sxs-insert.sql")


if __name__ == "__main__":
    main()
