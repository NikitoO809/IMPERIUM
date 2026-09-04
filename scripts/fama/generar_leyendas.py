"""
Genera el arte de las Leyendas del Salón de la Fama con AI Horde (gratis, sin
clave: usuario anónimo "0000000000"). Modelo AlbedoBase XL: renders estilo
"personaje 3D de videojuego" sobre fondo gris liso, que luego recorta
procesar_leyendas.py.

Uso:
  python scripts/fama/generar_leyendas.py              # todas las que falten
  python scripts/fama/generar_leyendas.py --solo oni   # solo una (o varias: oni,glou)
  python scripts/fama/generar_leyendas.py --solo oni --seed 4242   # otra tirada
  python scripts/fama/generar_leyendas.py --forzar     # rehace todas

Salida: scripts/fama/raw/<id>.webp (+ .json con la semilla y el worker).
La carpeta raw/ NO se sube a Git; el arte final vive en public/fama/leyendas/.
"""
from __future__ import annotations

import argparse
import base64
import json
import sys
import time
from pathlib import Path

import requests

# La consola de Windows viene en cp1252 y se atraganta con "→" y "✓".
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = "https://aihorde.net/api/v2"
HEADERS = {
    "apikey": "0000000000",  # anónimo: sin kudos, cola lenta pero gratis
    "Client-Agent": "imperium-fama:1.0:miguel",
    "Content-Type": "application/json",
}
MODEL = "AlbedoBase XL 3.1"
RAW = Path(__file__).parent / "raw"

# Mismo "estilo de cámara" para las 16, así parecen renders del mismo juego.
PREFIX = (
    "Unreal Engine 5 cinematic 3D character render, AAA MMORPG hero, "
    "full body head to toe, standing heroic pose facing the camera, "
)
SUFFIX = (
    ", dramatic rim light, ultra detailed, sharp focus, "
    "isolated on a plain flat light gray studio background, feet on the floor"
    " ### blurry, deformed, extra limbs, bad hands, text, watermark, cropped, "
    "out of frame, multiple people, low quality, background scenery, duplicate"
)

# id, nombre, descripción del personaje, semilla fija (reproducible)
LEYENDAS: list[tuple[str, str, str, int]] = [
    ("seiya", "Seiya",
     "young human male paladin with short dark hair, white and gold ornate plate armor "
     "with a crimson cape, holding a longsword in the right hand and a tall kite shield in the left", 101),
    ("hennesy", "Hennesy",
     "male human tank warrior with short dark hair and a stern face, heavy ornate steel and gold "
     "plate armor with a thick pauldron, holding a large tower shield in front of him and a "
     "longsword, sturdy guarding stance", 302),
    ("nikitoo", "NikitoO",
     "hooded male assassin, black leather armor with violet trim, half mask covering the lower face, "
     "holding two curved daggers low at the sides", 103),
    ("skyy", "SkyY",
     "female assassin with a hooded cloak, sleek fully covered pale sky blue and silver leather armor "
     "with dark straps, short silver hair under the hood, sharp eyes, holding two curved daggers "
     "low at her sides, light athletic stance", 304),
    ("terra", "Terra",
     "elven female ranger with long platinum hair, silver and emerald ornate armor with feathered "
     "pauldrons, holding an elegant recurve longbow at her side", 105),
    ("oriana", "Oriana",
     "female spirit summoner fully covered in dark violet and silver ornate robe armor with a high "
     "collar and crescent moon motifs, holding a glowing lantern staff, small wisps of spirit light around her", 206),
    ("oni", "ONI",
     "massive male warrior in red and black lacquered samurai plate armor with a horned oni mask, "
     "wielding a huge greatsword resting on his shoulder", 107),
    ("veint", "Veint",
     "male monk with shaved tattooed head, sleeveless white and jade robes with prayer beads, "
     "holding a long wooden staff with metal rings", 108),
    ("bomber", "Bomber",
     "female gunner engineer with short red hair and goggles, brass and leather armor, "
     "holding a huge aether cannon rifle across her body", 109),
    ("glou", "Glou",
     "ice sorceress with white hair and frost crystals in her hair, pale blue and white crystal "
     "armor gown, holding a frozen crystal staff", 110),
    ("blackats", "Blackats",
     "dark knight in full black gothic plate armor with glowing red runes, red eyes glowing inside "
     "the helmet, holding a greatsword with a red glowing blade, standing directly on the floor, no pedestal", 211),
    ("serpiente", "Serpiente",
     "male fighter in green and gold snake scale armor with a serpent shaped helmet, "
     "holding two curved blades with a faint green glow", 112),
    ("godofwar", "GodOfWar",
     "muscular berserker in bronze spartan armor with a red war cape, war paint and scars, "
     "holding a giant double bladed battle axe", 113),
    ("hanamichi", "Hanamichi",
     "male blade dancer in red and white oriental armor with cherry blossom motifs, long black "
     "ponytail, holding a katana elegantly in one hand", 114),
    ("dnavits", "Dnavits",
     "dragon knight in dark teal and gold scale plate armor with a horned dragon helmet, "
     "holding a long lance and a dragon wing shaped shield", 115),
    ("truma", "Truma",
     "tall broad male battle priest with a short grey beard and a calm stern face, white and gold "
     "heavy robe armor over steel plate, holding a massive ornate warhammer with both hands, "
     "holy light glinting on the hammer head", 119),
    ("godplayer", "Godplayer",
     "male dark sorcerer with a confident smirk and long white hair, black and gold high collared "
     "robe armor with glowing violet runes, a floating crystal orb hovering over his raised hand", 120),
    # (arte de prueba que no se usa en la web: un bardo; se conserva por si sirve)
    ("bardo", "Bardo",
     "charismatic male bard adventurer with a feathered hat, teal and gold leather coat, "
     "holding a golden lyre harp weapon, confident smile", 116),
    # Los dos que vuelan (Daevas con las alas desplegadas). "nashin" es Nash, el líder.
    ("nashin", "Nash",
     "male Daeva knight flying in mid air with huge glowing golden feathered wings spread wide, "
     "ornate white and gold plate armor with a flowing blue cape, holding a golden spear, legs "
     "trailing behind him, dynamic hovering pose seen from the front, whole body and both wings "
     "fully visible, floating with no ground under his feet", 117),
    # Ojo: la tirada con el pelo rojo (seed 318) salió con un ala sola, así que
    # se volvió a esta. Si se reintenta, revisar que tenga LAS DOS alas.
    ("celeris", "Celeris",
     "female Daeva archmage flying in mid air with large luminous pale blue feathered wings spread "
     "wide, fully covered flowing silver and sky blue robe armor, long white hair and cloth streaming "
     "in the wind, holding a glowing crystal staff, graceful hovering pose seen from the front, whole "
     "body and both wings fully visible, floating with no ground under her feet", 118),
]


def enviar(prompt: str, seed: int) -> str:
    """Encola un trabajo; devuelve su id. Reintenta si el Horde nos frena (429)."""
    payload = {
        "prompt": PREFIX + prompt + SUFFIX,
        "params": {
            "width": 832, "height": 1216, "steps": 28, "cfg_scale": 5.5,
            "sampler_name": "k_dpmpp_2m", "karras": True, "n": 1, "seed": str(seed),
        },
        "nsfw": False, "censor_nsfw": True, "models": [MODEL],
        "r2": True, "shared": False, "slow_workers": True,
    }
    while True:
        r = requests.post(f"{BASE}/generate/async", json=payload, headers=HEADERS, timeout=60)
        if r.status_code == 202:
            return r.json()["id"]
        if r.status_code == 429 or "too many" in r.text.lower():
            print("  el Horde pide calma, espero 20 s…", flush=True)
            time.sleep(20)
            continue
        raise RuntimeError(f"AI Horde {r.status_code}: {r.text[:300]}")


def recoger(job_id: str) -> tuple[bytes, dict]:
    s = requests.get(f"{BASE}/generate/status/{job_id}", timeout=60).json()
    gens = s.get("generations") or []
    if not gens:
        raise RuntimeError(f"sin resultado: {json.dumps(s)[:300]}")
    g = gens[0]
    img = g["img"]
    data = requests.get(img, timeout=120).content if img.startswith("http") else base64.b64decode(img)
    return data, {"worker": g.get("worker_name"), "model": g.get("model"), "censored": g.get("censored")}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo", help="ids separados por coma")
    ap.add_argument("--seed", type=int, help="semilla alternativa (solo con --solo)")
    ap.add_argument("--forzar", action="store_true", help="rehacer aunque ya exista")
    args = ap.parse_args()

    RAW.mkdir(parents=True, exist_ok=True)
    ids = set(args.solo.split(",")) if args.solo else None
    pendientes = []
    for lid, nombre, prompt, seed in LEYENDAS:
        if ids and lid not in ids:
            continue
        out = RAW / f"{lid}.webp"
        if out.exists() and not args.forzar and not ids:
            print(f"· {lid}: ya existe, salto")
            continue
        pendientes.append((lid, nombre, prompt, args.seed if (args.seed and ids) else seed))

    if not pendientes:
        print("Nada que generar.")
        return 0

    trabajos: dict[str, tuple[str, int]] = {}
    for lid, nombre, prompt, seed in pendientes:
        jid = enviar(prompt, seed)
        trabajos[jid] = (lid, seed)
        print(f"→ {nombre}: encolado {jid} (seed {seed})", flush=True)
        time.sleep(1.5)

    t0 = time.time()
    while trabajos and time.time() - t0 < 60 * 40:
        time.sleep(10)
        for jid, (lid, seed) in list(trabajos.items()):
            try:
                c = requests.get(f"{BASE}/generate/check/{jid}", timeout=30).json()
            except Exception as e:  # red inestable: seguimos
                print(f"  {lid}: check falló ({e}), sigo")
                continue
            if c.get("faulted"):
                print(f"✗ {lid}: el Horde marcó el trabajo como fallido")
                del trabajos[jid]
                continue
            if c.get("done"):
                try:
                    data, meta = recoger(jid)
                except Exception as e:
                    print(f"✗ {lid}: no pude recoger ({e})")
                    del trabajos[jid]
                    continue
                (RAW / f"{lid}.webp").write_bytes(data)
                (RAW / f"{lid}.json").write_text(json.dumps({"seed": seed, **meta}, indent=2))
                print(f"✓ {lid}: {len(data) // 1024} KB · worker {meta['worker']} · {int(time.time() - t0)} s", flush=True)
                del trabajos[jid]
            else:
                print(f"  {lid}: espera ~{c.get('wait_time')} s, cola {c.get('queue_position')} · {int(time.time() - t0)} s", flush=True)

    if trabajos:
        print("Quedaron sin terminar:", [v[0] for v in trabajos.values()])
        return 1
    print("Listo. Ahora: python scripts/fama/procesar_leyendas.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
