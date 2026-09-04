"""
Genera el paisaje de fondo del Salón de la Fama (AI Horde, gratis) y lo deja
listo para el escenario: un poco desenfocado (está lejos), más oscuro por
arriba y por los lados para fundirse con la página, y con el horizonte en el
tercio inferior, que es donde lo cruza la línea del suelo del escenario.

  python scripts/fama/generar_fondo.py            # genera + procesa
  python scripts/fama/generar_fondo.py --seed 77  # otra tirada
  python scripts/fama/generar_fondo.py --solo-procesar   # solo el retoque

Salida: public/fama/fondo.webp (y el bruto en scripts/fama/raw/fondo.webp).
"""
from __future__ import annotations

import argparse
import io
import sys
import time
from pathlib import Path

import numpy as np
import requests
from PIL import Image, ImageFilter

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, str(Path(__file__).parent))
from generar_leyendas import BASE, HEADERS, MODEL, RAW, recoger  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SALIDA = ROOT / "public" / "fama" / "fondo.webp"

PROMPT = (
    "epic fantasy landscape matte painting, wide panoramic view, floating sky islands with long "
    "waterfalls pouring into a still dark lake, a distant crystal citadel with glowing golden "
    "windows, dramatic dusk sky with deep blue clouds and a warm golden sunset glow at the center "
    "of the horizon, the horizon line in the lower third of the image, cinematic lighting, "
    "ultra detailed, Unreal Engine 5 render"
    " ### people, characters, figures, text, watermark, blurry, low quality, frame, border"
)


def generar(seed: int) -> bytes:
    payload = {
        "prompt": PROMPT,
        "params": {"width": 1536, "height": 640, "steps": 30, "cfg_scale": 5.5,
                   "sampler_name": "k_dpmpp_2m", "karras": True, "n": 1, "seed": str(seed)},
        "nsfw": False, "censor_nsfw": True, "models": [MODEL],
        "r2": True, "shared": False, "slow_workers": True,
    }
    r = requests.post(f"{BASE}/generate/async", json=payload, headers=HEADERS, timeout=60)
    if r.status_code != 202:
        raise RuntimeError(f"AI Horde {r.status_code}: {r.text[:300]}")
    jid = r.json()["id"]
    print(f"→ fondo encolado {jid} (seed {seed})", flush=True)
    t0 = time.time()
    while time.time() - t0 < 60 * 25:
        time.sleep(10)
        c = requests.get(f"{BASE}/generate/check/{jid}", timeout=30).json()
        if c.get("faulted"):
            raise RuntimeError("el Horde marcó el trabajo como fallido")
        if c.get("done"):
            data, meta = recoger(jid)
            print(f"✓ fondo: {len(data) // 1024} KB · worker {meta['worker']} · {int(time.time() - t0)} s")
            return data
        print(f"  espera ~{c.get('wait_time')} s, cola {c.get('queue_position')} · {int(time.time() - t0)} s", flush=True)
    raise RuntimeError("se agotó el tiempo de espera")


def procesar(bruto: Path) -> None:
    im = Image.open(bruto).convert("RGB")
    w, h = im.size
    # está lejos: un pelín desenfocado para que los personajes queden nítidos delante
    im = im.filter(ImageFilter.GaussianBlur(radius=w * 0.0009))
    a = np.asarray(im).astype(np.float32) / 255.0
    ys = np.linspace(0, 1, h)[:, None, None]
    xs = np.linspace(-1, 1, w)[None, :, None]
    # más oscuro arriba (cielo) y en los bordes, y algo más apagado en general
    arriba = 0.55 + 0.45 * np.clip(ys / 0.5, 0, 1)
    lados = 0.55 + 0.45 * np.clip(1.25 - np.abs(xs) ** 2.2, 0, 1)
    a = a * arriba * lados * 0.9
    # el borde inferior se funde con el suelo oscuro del escenario
    abajo = 1.0 - 0.7 * np.clip((ys - 0.88) / 0.12, 0, 1)
    a = a * abajo
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), "RGB")
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    out.save(SALIDA, "WEBP", quality=82, method=6)
    print(f"  {out.size[0]}×{out.size[1]} · {SALIDA.stat().st_size // 1024} KB → {SALIDA.relative_to(ROOT)}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=501)
    ap.add_argument("--solo-procesar", action="store_true")
    args = ap.parse_args()
    RAW.mkdir(parents=True, exist_ok=True)
    bruto = RAW / "fondo.webp"
    if not args.solo_procesar:
        bruto.write_bytes(generar(args.seed))
    procesar(bruto)
    return 0


if __name__ == "__main__":
    sys.exit(main())
