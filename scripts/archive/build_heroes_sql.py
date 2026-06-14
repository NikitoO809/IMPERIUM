# Genera el SQL para montar la tier list de héroes de Call of Dragons como una
# SECCIÓN de contenido (game_sections slug='heroes' + section_blocks, un bloque por
# héroe). Empareja descripciones traducidas (heroes-es/<gen>.json) con los datos
# scrapeados (allclash-heroes.json). Reemplaza la sección si ya existía.
import json

SRC_URL = "https://www.allclash.com/call-of-dragons-best-heroes-tier-list/"
TAG = "cod"

GENS = ["GENERATION 5", "GENERATION 4", "GENERATION 3", "GENERATION 2", "GENERATION 1"]
GEN_ES = {f"GENERATION {n}": f"Generación {n}" for n in range(1, 6)}
CLASS_ES = {"Magic": "Mago", "Infantry": "Infantería", "Cavalry": "Caballería",
            "Marksman": "Tirador", "Overall": "Universal"}
ROLE_ES = {"PvP": "PvP", "Garrison": "Guarnición", "Rally": "Rally",
           "Peacekeeping": "Pacificación", "Gathering": "Recolección",
           "Engineering": "Ingeniería"}


def dq(s):
    s = s or ""
    d = f"${TAG}$"
    if d in s:
        raise ValueError("texto contiene el delimitador; cambia TAG")
    return f"{d}{s}{d}"


def arr(urls):
    if not urls:
        return "'{}'::text[]"
    return "array[" + ", ".join(dq(u) for u in urls) + "]::text[]"


def main():
    heroes = json.load(open("scripts/allclash-heroes.json", encoding="utf-8"))
    # Traducciones por (generación, name)
    es = {}
    for g in GENS:
        try:
            for h in json.load(open(f"scripts/heroes-es/{g}.json", encoding="utf-8")):
                es[(g, h["name"])] = h.get("descriptionEs", "")
        except FileNotFoundError:
            print(f"AVISO: falta traducción de {g}")

    L = ["do $do$", "declare", "  gid uuid;", "  sid uuid;", "begin"]
    L.append("  select id into gid from public.games where slug='call-of-dragons';")
    # Reemplazar la sección heroes si existía
    L.append("  delete from public.game_sections where game_id=gid and slug='heroes';")
    intro = ("Tier list de héroes por generaciones (de la 5, la más reciente, a la 1). "
             "Cada héroe indica su tier, clase, facción y mejor rol. "
             "Traducida de allclash.com — contenido sin verificar.")
    L.append(
        "  insert into public.game_sections (game_id, slug, title, intro_title, intro, intro_images, is_published) "
        f"values (gid, 'heroes', {dq('Tier List de Héroes')}, {dq('Tier List de Héroes de Call of Dragons')}, "
        f"{dq(intro)}, '{{}}', true) returning id into sid;"
    )

    rows = []
    order = 0
    for h in heroes:
        order += 1
        gen_es = GEN_ES.get(h["generation"], h["generation"])
        cls = CLASS_ES.get(h["heroClass"], h["heroClass"])
        role = ROLE_ES.get(h["role"], h["role"])
        desc = es.get((h["generation"], h["name"]), h["description"])
        meta = f"{gen_es} · {cls} · {h['faction']} · Mejor rol: {role}"
        content = f"{meta}\n\n{desc}" if desc else meta
        title = f"{h['name']} — {h['tier']}"
        imgs = [h["image"]] if h.get("image") else []
        rows.append(
            f"    (sid, {order}, {dq(title)}, {dq(content)}, '{SRC_URL}', false, {arr(imgs)})"
        )

    L.append("  insert into public.section_blocks "
             "(section_id, order_index, title, content, source_url, is_verified, images) values")
    L.append(",\n".join(rows) + ";")
    L += ["end", "$do$;"]

    sql = "\n".join(L)
    open("scripts/heroes-insert.sql", "w", encoding="utf-8").write(sql)
    print(f"SQL generado: {len(sql)} chars, {order} héroes -> scripts/heroes-insert.sql")


if __name__ == "__main__":
    main()
