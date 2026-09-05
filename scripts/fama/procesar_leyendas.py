"""
Convierte los renders en bruto de las Leyendas (scripts/fama/raw/<id>.webp)
en el arte que usa el escenario 3D del Salón de la Fama:

  public/fama/leyendas/<id>.webp        color + transparencia (recorte con rembg)
  public/fama/leyendas/<id>-relieve.png  mapa de relieve (gris): 0 en el borde de
                                        la silueta, 1 en el centro. El shader lo
                                        usa para dar volumen, luz y reflejos.
  src/lib/fama/leyendas-arte.json       tamaño y proporción de cada imagen.
  scripts/fama/raw/rejilla/<id>.png     la imagen con una rejilla 0..1 encima,
                                        para leer a ojo dónde está la mano, el
                                        arma o la cabeza y apuntarlo en
                                        src/lib/fama/leyendas.ts (anclas).

Uso: python scripts/fama/procesar_leyendas.py [--solo oni,glou]
"""
from __future__ import annotations

import argparse
import io
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# La consola de Windows viene en cp1252 y se atraganta con "→" y "✓".
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "scripts" / "fama" / "raw"
OUT = ROOT / "public" / "fama" / "leyendas"
META = ROOT / "src" / "lib" / "fama" / "leyendas-arte.json"
REJILLA = RAW / "rejilla"

ALTO = 768           # alto final de la figura (px); en pantalla se ven a ~275 px
MARGEN = 0.02        # aire alrededor de la silueta (fracción del alto)
CAP_RELIEVE = 0.075  # a esta distancia del borde (fracción del alto) el relieve ya es 1


def recortar_fondo(img: Image.Image) -> Image.Image:
    from rembg import new_session, remove

    for modelo in ("isnet-general-use", "u2net"):
        try:
            session = new_session(modelo)
            return remove(img, session=session, post_process_mask=True).convert("RGBA")
        except Exception as e:  # el modelo no bajó, probamos el siguiente
            print(f"  rembg {modelo} falló: {e}")
    raise RuntimeError("rembg no pudo recortar la imagen")


def limpiar_alpha(rgba: np.ndarray) -> np.ndarray:
    """Quita motas sueltas: se queda con el componente conectado mayor (y los
    que pesan al menos un 0,5 % del total, por si un arma queda separada)."""
    a = rgba[:, :, 3]
    binaria = (a > 40).astype(np.uint8)
    n, etiquetas, stats, _ = cv2.connectedComponentsWithStats(binaria, 8)
    if n <= 2:
        return rgba
    areas = stats[1:, cv2.CC_STAT_AREA]
    total = areas.sum()
    conservar = {i + 1 for i, area in enumerate(areas) if area >= total * 0.005 or area == areas.max()}
    mascara = np.isin(etiquetas, list(conservar))
    rgba = rgba.copy()
    rgba[:, :, 3] = np.where(mascara, a, 0)
    return rgba


def recortar_y_escalar(rgba: np.ndarray) -> np.ndarray:
    a = rgba[:, :, 3]
    ys, xs = np.where(a > 8)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    fig = rgba[y0:y1, x0:x1]
    h, w = fig.shape[:2]
    escala = ALTO * (1 - 2 * MARGEN) / h
    nw, nh = max(1, round(w * escala)), max(1, round(h * escala))
    fig = cv2.resize(fig, (nw, nh), interpolation=cv2.INTER_AREA)
    m = round(ALTO * MARGEN)
    lienzo = np.zeros((nh + 2 * m, nw + 2 * m, 4), np.uint8)
    lienzo[m:m + nh, m:m + nw] = fig
    return lienzo


def relieve(rgba: np.ndarray) -> np.ndarray:
    """Distancia al borde de la silueta → perfil redondeado, con un poco de
    detalle de la propia imagen (bordes de armadura) para que la luz 'lea' el
    metal. Sale en gris de 8 bits, a media resolución."""
    a = rgba[:, :, 3]
    h = rgba.shape[0]
    mascara = (a > 128).astype(np.uint8)
    dist = cv2.distanceTransform(mascara, cv2.DIST_L2, 5)
    cap = max(1.0, CAP_RELIEVE * h)
    base = np.sqrt(np.clip(dist / cap, 0, 1))
    base = cv2.GaussianBlur(base, (0, 0), sigmaX=h * 0.004)

    lum = cv2.cvtColor(rgba[:, :, :3], cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
    detalle = lum - cv2.GaussianBlur(lum, (0, 0), sigmaX=h * 0.006)
    detalle = cv2.GaussianBlur(detalle, (0, 0), sigmaX=h * 0.0015)
    r = np.clip(base + detalle * 0.35 * mascara, 0, 1)
    r = (r * 255).astype(np.uint8)
    return cv2.resize(r, (rgba.shape[1] // 2, h // 2), interpolation=cv2.INTER_AREA)


def rejilla(rgba: np.ndarray, lid: str) -> None:
    """Imagen de apoyo: fondo gris, rejilla cada 0,1 y coordenadas, para
    apuntar a ojo las anclas (u, v) de cada leyenda."""
    im = Image.fromarray(rgba, "RGBA")
    fondo = Image.new("RGBA", im.size, (70, 70, 78, 255))
    fondo.alpha_composite(im)
    d = ImageDraw.Draw(fondo)
    w, h = fondo.size
    try:
        font = ImageFont.truetype("arial.ttf", 18)
    except Exception:
        font = ImageFont.load_default()
    for i in range(1, 10):
        x, y = round(w * i / 10), round(h * i / 10)
        d.line([(x, 0), (x, h)], fill=(255, 220, 120, 110), width=1)
        d.line([(0, y), (w, y)], fill=(255, 220, 120, 110), width=1)
        d.text((x + 3, 3), f"{i / 10:.1f}", fill=(255, 235, 170, 255), font=font)
        d.text((3, y + 3), f"{i / 10:.1f}", fill=(255, 235, 170, 255), font=font)
    d.text((8, h - 26), lid, fill=(255, 255, 255, 255), font=font)
    REJILLA.mkdir(parents=True, exist_ok=True)
    fondo.convert("RGB").save(REJILLA / f"{lid}.png")


def procesar(lid: str) -> dict:
    src = RAW / f"{lid}.webp"
    print(f"→ {lid}")
    img = Image.open(src).convert("RGB")
    rgba = np.array(recortar_fondo(img))
    rgba = limpiar_alpha(rgba)
    rgba = recortar_y_escalar(rgba)

    OUT.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(OUT / f"{lid}.webp", "WEBP", quality=86, method=6)
    Image.fromarray(relieve(rgba), "L").save(OUT / f"{lid}-relieve.png", optimize=True)
    rejilla(rgba, lid)

    h, w = rgba.shape[:2]
    kb = (OUT / f"{lid}.webp").stat().st_size // 1024
    print(f"  {w}×{h} · {kb} KB")
    return {"w": w, "h": h}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo", help="ids separados por coma")
    args = ap.parse_args()
    ids = set(args.solo.split(",")) if args.solo else None

    meta = json.loads(META.read_text("utf-8")) if META.exists() else {}
    for src in sorted(RAW.glob("*.webp")):
        lid = src.stem
        if ids and lid not in ids:
            continue
        try:
            meta[lid] = procesar(lid)
        except Exception as e:
            print(f"✗ {lid}: {e}")
    META.parent.mkdir(parents=True, exist_ok=True)
    META.write_text(json.dumps(meta, indent=2, sort_keys=True) + "\n", "utf-8")
    print(f"Metadatos en {META.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
