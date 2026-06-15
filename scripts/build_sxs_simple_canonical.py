"""Genera los canónicos JSON para las secciones simples de Sword x Staff
cuyos datos ya están disponibles en el preview (_sxs_sections_preview.json).

Secciones: codigos · veredicto · resumen

Salida: scripts/data/canonical/sxs_{slug}.json
Uso   : python scripts/build_sxs_simple_canonical.py
"""
import json, os

os.makedirs("scripts/data/canonical", exist_ok=True)

SOURCE = "https://eog.gg/games/sword-x-staff/"

# ── CÓDIGOS ──────────────────────────────────────────────────────────────────
# 16 códigos extraídos del preview (codeRows count = 16, texto completo visible).
CODES_TABLE = {
    "headers": ["Código", "Recompensas"],
    "rows": [
        ["SS000",            "Por confirmar"],
        ["SS888",            "Por confirmar"],
        ["ZJ888",            "Por confirmar"],
        ["ZJ999",            "Por confirmar"],
        ["ZJ777",            "Por confirmar"],
        ["SS999",            "Por confirmar"],
        ["SXSPARTNER",       "1x Stellatie · 1x Destiny Fruit · 20x Auroral Badge Raro"],
        ["VANOSSTEAM",       "1x Stellatie · 1x Destiny Fruit · 20x Auroral Badge Raro"],
        ["CARBOTANIMATIONS", "Por confirmar"],
        ["SS777",            "Por confirmar"],
        ["SXSCREATOR",       "1x Stellatie · 1x Destiny Fruit · 20x Auroral Badge Raro"],
        ["SXSAMBASSADOR",    "1x Stellatie · 1x Destiny Fruit · 20x Auroral Badge Raro"],
        ["SXSREDDIT",        "160x Dawnium"],
        ["SXSFBTHANKS",      "Por confirmar"],
        ["SXSDCTHANKS",      "Por confirmar"],
        ["THEGAMETHEORIST",  "Por confirmar"],
    ],
}

codigos = {
    "game": "sword-x-staff",
    "kind": "section",
    "slug": "codigos",
    "title": "Códigos de Canje — Sword x Staff",
    "intro_title": "Códigos Activos",
    "intro": (
        "16 códigos públicos disponibles en la ventana de lanzamiento. "
        "Canjea en: Inicio → Menú principal (esquina inferior derecha) → "
        "Centro de usuario → Código de regalo."
    ),
    "intro_images": [],
    "source_url": SOURCE,
    "is_published": False,
    "render_type": "generic",
    "order_index": 6,
    "label": "Códigos",
    "description": "16 códigos de canje gratuitos de la ventana de lanzamiento",
    "icon": "gift",
    "cover_image": None,
    "items": [
        {
            "title": "Tabla de Códigos",
            "content": "__TABLE__" + json.dumps(CODES_TABLE, ensure_ascii=False, separators=(",", ":")),
            "images": [],
            "source_url": SOURCE,
            "meta": {},
        }
    ],
}

# ── VEREDICTO ─────────────────────────────────────────────────────────────────
MOUNTAIN = "https://eog.gg/assets/games/sword-x-staff/kingdoms/mountain.webp"

veredicto = {
    "game": "sword-x-staff",
    "kind": "section",
    "slug": "veredicto",
    "title": "Veredicto — Sword x Staff",
    "intro_title": "Veredicto de Lanzamiento EOG.GG",
    "intro": "Análisis del equipo de analistas de Eden of Gaming. Actualizado el 20 de mayo de 2026.",
    "intro_images": [MOUNTAIN],
    "source_url": SOURCE,
    "is_published": False,
    "render_type": "generic",
    "order_index": 8,
    "label": "Veredicto",
    "description": "Análisis de lanzamiento de Sword x Staff por el equipo de EOG.GG",
    "icon": "wrench",
    "cover_image": MOUNTAIN,
    "items": [
        {
            "title": "Análisis General",
            "content": (
                "Sword x Staff es el gacha más paciente que ha lanzado esta temporada. "
                "Boltray bloquea casi todos los sistemas significativos hasta el segundo mapa, "
                "lo que significa que las primeras dos semanas recompensan la exploración y la "
                "experimentación de clases por encima del gasto. La colaboración de lanzamiento "
                "de KonoSuba hace que el punto de entrada sea económico.\n\n"
                "La estructura de obtención de habilidades es el verdadero diferenciador respecto "
                "a todos los demás juegos en EOG.GG. Si quieres evaluarlo: elige Guerrero o Mago, "
                "avanza en la exploración del mapa, reclama todos los pulls gratuitos de 10 y no "
                "gastes Dawnium en Stellaties.\n\n"
                "El bosque de Verdantglade es un filtro por diseño. Aproximadamente la mitad de la "
                "base de jugadores abandonará antes de llegar a Cinder Ridge. La mitad que se queda "
                "es el público para el que fue diseñado este juego."
            ),
            "images": [MOUNTAIN],
            "source_url": SOURCE,
            "meta": {},
        },
        {
            "title": "Recomendado para",
            "content": (
                "Pruébalo si quieres un RPG idle de fantasía que respete tu tiempo, "
                "te permita cambiar de rol libremente y trate la colección de habilidades "
                "(en lugar de la colección de personajes) como el gancho del gacha. "
                "La colaboración de lanzamiento de KonoSuba es la mayor oferta de entrada del mercado.\n\n"
                "Evítalo si buscas gráficos de personajes premium, acción en tiempo real o una "
                "dificultad que requiera grind activo.\n\n"
                "Gasta si llegas a Cinder Ridge y quieres una clase maga de alto nivel: "
                "los Fantomons de calidad y la Stellatie correcta marcan la diferencia."
            ),
            "images": [],
            "source_url": SOURCE,
            "meta": {},
        },
        {
            "title": "Calificación del Equipo EOG",
            "content": (
                "Guarda y juega gratis · Amigable para F2P · Jugadores pacientes\n\n"
                "Cinder Ridge es donde se desbloquean el Banner Premium y las Subastas. "
                "Es el punto de decisión real: hasta ahí el juego es completamente disfrutable "
                "sin gastar. A partir de ese punto, la inversión en Fantomons y la Stellatie "
                "correcta marcan la diferencia en el contenido de alto nivel."
            ),
            "images": [],
            "source_url": SOURCE,
            "meta": {},
        },
    ],
}

# ── RESUMEN ───────────────────────────────────────────────────────────────────
FOREST = "https://eog.gg/assets/games/sword-x-staff/kingdoms/forest.webp"

resumen = {
    "game": "sword-x-staff",
    "kind": "section",
    "slug": "resumen",
    "title": "Resumen — Sword x Staff",
    "intro_title": "Sword x Staff en EOG",
    "intro": (
        "Hub de Sword x Staff en Eden of Gaming. Parche 1.0 activo. "
        "Servidor: mundo de Kanstein, cinco reinos, cuatro clases avanzadas. "
        "Desarrollado por Boltray Games."
    ),
    "intro_images": [FOREST],
    "source_url": SOURCE,
    "is_published": False,
    "render_type": "generic",
    "order_index": 9,
    "label": "Resumen del Juego",
    "description": "Vista general, actualizaciones recientes y estado del meta en SxS",
    "icon": "book",
    "cover_image": FOREST,
    "items": [
        {
            "title": "¿Qué contiene este Hub?",
            "content": (
                "Recursos disponibles en IMPERIUM para Sword x Staff:\n\n"
                "• Tier List de Clases — mejor clase por estilo de combate, para todas las regiones\n"
                "• Guías — de principiante a endgame, incluyendo clases y sistemas\n"
                "• Builds — cargas curadas y Build Maker por rol\n"
                "• Habilidades — base de datos de habilidades, Fantomons y Compañeros\n"
                "• Roadmap — progresión día a día hasta la Temporada 5\n"
                "• Códigos — canjea recompensas gratuitas del período de lanzamiento\n"
                "• Veredicto — análisis de lanzamiento por el equipo de EOG"
            ),
            "images": [FOREST],
            "source_url": SOURCE,
            "meta": {},
        },
        {
            "title": "Actualizaciones Recientes",
            "content": (
                "19 mayo 2026 — LANZAMIENTO GLOBAL: Sword x Staff disponible en iOS, Android y PC "
                "(vía emulador). Desarrollado por Boltray Games. Mundo de Kanstein, cinco reinos, "
                "cuatro clases avanzadas.\n\n"
                "19 mayo 2026 — COLABORACIÓN KonoSuba: evento de lanzamiento activo. Más de 650 "
                "pulls gratuitos distribuidos entre recompensas de inicio de sesión e hitos de eventos.\n\n"
                "29 julio 2026 (estimado) — PRÓXIMO: Segundo arco de KonoSuba programado. "
                "Guarda Wish Stones y Destiny Fruits para la rotación."
            ),
            "images": [],
            "source_url": SOURCE,
            "meta": {},
        },
        {
            "title": "Sobre el Juego",
            "content": (
                "Sword x Staff es un RPG idle de fantasía con sistema de habilidades intercambiables. "
                "A diferencia de otros gachas, la rareza que se colecciona son las habilidades — "
                "no los personajes. Esto permite personalizar libremente el rol de tu personaje "
                "sin importar qué clase elegiste al inicio.\n\n"
                "El juego progresa por regiones: cada región desbloquea nuevas clases avanzadas "
                "(job changes) y sistemas de contenido. Las primeras dos semanas están diseñadas "
                "para exploración sin necesidad de gastar."
            ),
            "images": [],
            "source_url": SOURCE,
            "meta": {},
        },
    ],
}

# ── Guardar ───────────────────────────────────────────────────────────────────
for name, data in [("sxs_codigos", codigos), ("sxs_veredicto", veredicto), ("sxs_resumen", resumen)]:
    path = f"scripts/data/canonical/{name}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[ok] {path}")

print("\nListo. Ahora ejecuta:")
print("  python scripts/lib/build_sql.py scripts/data/canonical/sxs_codigos.json   > scripts/sql/sxs_codigos.sql")
print("  python scripts/lib/build_sql.py scripts/data/canonical/sxs_veredicto.json > scripts/sql/sxs_veredicto.sql")
print("  python scripts/lib/build_sql.py scripts/data/canonical/sxs_resumen.json   > scripts/sql/sxs_resumen.sql")
