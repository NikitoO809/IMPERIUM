"""Convierte un HTML en PNG. Sirve para dibujar infografias con el diseno de
IMPERIUM y publicarlas donde sea (foro de Discord, guias de la web).

    python scripts/html_a_png.py <entrada.html> <salida.png> [ancho] [alto] [--transparente]

Se captura al doble de resolucion para que se vea nitido en pantallas buenas y
en el movil, que es donde lo va a leer casi toda la gente.

Con --transparente el fondo se deja vacio en vez de blanco. Hace falta para los
iconos de rol y cualquier cosa que Discord vaya a poner sobre su propio fondo.
"""

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


def main() -> None:
    if len(sys.argv) < 3:
        print("uso: python scripts/html_a_png.py <entrada.html> <salida.png> [ancho] [alto]")
        raise SystemExit(1)

    transparente = "--transparente" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]

    entrada = Path(args[0]).resolve()
    salida = Path(args[1]).resolve()
    ancho = int(args[2]) if len(args) > 2 else 1280
    alto = int(args[3]) if len(args) > 3 else 720

    if not entrada.exists():
        print(f"no encuentro {entrada}")
        raise SystemExit(1)
    salida.parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        navegador = p.chromium.launch()
        pagina = navegador.new_page(
            viewport={"width": ancho, "height": alto},
            device_scale_factor=2,
        )
        pagina.goto(entrada.as_uri())
        # Esperar a las fuentes de Google: sin esto la captura sale con la
        # tipografia de reserva y el diseno se descoloca.
        pagina.wait_for_load_state("networkidle")
        pagina.wait_for_timeout(600)
        pagina.screenshot(path=str(salida), omit_background=transparente)
        navegador.close()

    print(f"hecha: {salida}  ({ancho}x{alto} @2x)")


if __name__ == "__main__":
    main()
