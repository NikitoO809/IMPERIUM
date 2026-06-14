# Lee los datos de parejas directamente del archivo gen*-builds-es.json
# y detecta qué párrafos no matchean el regex de parsePairing.
import json, re, glob

PATTERN = re.compile(
    r'^([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s\-\']{1,35}?)\s*[,]?\s*'
    r'(es|está|como|funciona|también|puede|tiene|aporta|trabaja|va\s+bien|'
    r'debería|se\s+puede|sería|será|sirve|ofrece|añade|resulta|actúa|en\s+caso)'
)

all_heroes = {}
for f in ["scripts/gen5-builds-es.json", "scripts/gen14-builds-es.json", "scripts/missing-builds-es.json"]:
    try:
        d = json.load(open(f, encoding="utf-8"))
        all_heroes.update(d)
    except FileNotFoundError:
        pass

failing = {}
ok_heroes = []

for slug, data in all_heroes.items():
    secs = data.get("sections", [])
    name_label = data.get("name", slug)
    pairing_sec = next((s for s in secs if "pareja" in s["section"].lower() or "pairing" in s["section"].lower()), None)
    if not pairing_sec:
        continue

    paras = [p.strip() for p in pairing_sec["content"].split("\n\n") if p.strip()]
    bad = []
    for p in paras:
        m = PATTERN.match(p)
        if not m:
            bad.append(p[:100])
        else:
            extracted = m.group(1).strip()
            if len(extracted.split()) > 4:
                bad.append(f"[nombre largo '{extracted}'] {p[:80]}")
    if bad:
        failing[name_label] = bad
    else:
        ok_heroes.append(name_label)

print(f"OK ({len(ok_heroes)}): {', '.join(sorted(ok_heroes))}\n")
print(f"FALLAN ({len(failing)}):")
for hero, bads in sorted(failing.items()):
    print(f"\n  {hero}:")
    for b in bads:
        print(f"    -> {b}")
