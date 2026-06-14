# Genera SQL de inserción de builds Gen 1-4 en español desde gen14-builds-es.json
import json

TAG = "hb14"

def dq(s):
    s = (s or "").replace("'", "''")
    return f"${TAG}${s}${TAG}$"

def arr(urls):
    if not urls:
        return "'{}'::text[]"
    return "array[" + ", ".join(dq(u) for u in urls) + "]::text[]"

data = json.load(open("scripts/gen14-builds-es.json", encoding="utf-8"))

lines = [
    "do $do$",
    "declare",
    "  gid uuid;",
    "  hid uuid;",
    "begin",
    "  select id into gid from public.games where slug='call-of-dragons';",
]

inserted = 0
skipped = 0
for hero_slug, hero_data in data.items():
    secs = hero_data.get("sections", [])
    if not secs:
        skipped += 1
        continue

    url = hero_data["url"]
    lines.append(f"  -- {hero_slug}")
    lines.append(f"  select id into hid from public.heroes where game_id=gid and slug={dq(hero_slug)};")
    lines.append(f"  delete from public.hero_builds where hero_id=hid;")

    for i, s in enumerate(secs):
        lines.append(
            f"  insert into public.hero_builds (hero_id, order_index, section, content, images, source_url, is_verified) "
            f"values (hid, {i}, {dq(s['section'])}, {dq(s['content'])}, {arr(s['images'])}, {dq(url)}, false);"
        )
    inserted += 1

lines += ["end", "$do$;"]
sql = "\n".join(lines)
open("scripts/gen14-builds-es-insert.sql", "w", encoding="utf-8").write(sql)
print(f"SQL generado: {len(sql)} chars")
print(f"  {inserted} héroes con build, {skipped} sin página (mostrarán 'próximamente')")
