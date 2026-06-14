import json, re

NOT_NAMES = {
    "Si","En","Con","Sin","Al","El","La","Lo","Los","Las",
    "Un","Una","Para","Por","De","Del","Que","Como","Cuando",
    "Empareja","Emparéjala","Emparéjalo","Usar","Reunir",
}

PATTERN = re.compile(
    r'^((?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ\-\']+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ\-\']+){0,2})'
)

def parse(para):
    m = PATTERN.match(para)
    if not m: return None
    name = m.group(1).strip()
    first = name.split()[0]
    if first in NOT_NAMES: return None
    if len(name) < 3: return None
    return name

all_heroes = {}
for f in ["scripts/gen5-builds-es.json","scripts/gen14-builds-es.json","scripts/missing-builds-es.json"]:
    try:
        all_heroes.update(json.load(open(f, encoding="utf-8")))
    except FileNotFoundError:
        pass

still_failing = {}
ok = []

for slug, data in all_heroes.items():
    secs = data.get("sections", [])
    label = data.get("name", slug)
    pairing = next((s for s in secs if "pareja" in s["section"].lower() or "pairing" in s["section"].lower()), None)
    if not pairing: continue
    paras = [p.strip() for p in pairing["content"].split("\n\n") if p.strip()]
    bad = [(p, parse(p)) for p in paras if parse(p) is None]
    if bad:
        still_failing[label] = [b[0][:90] for b in bad]
    else:
        ok.append(label)

print(f"OK ahora: {len(ok)}")
if still_failing:
    print(f"\nAun sin nombre detectado ({len(still_failing)} heroes):")
    for hero, bads in sorted(still_failing.items()):
        print(f"  {hero}:")
        for b in bads:
            print(f"    -> {b}")
else:
    print("Todos los parrafos tienen nombre detectado!")
