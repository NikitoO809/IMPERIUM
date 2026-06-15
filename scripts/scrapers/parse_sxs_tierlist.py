"""Parsea el HTML crudo del tier list (sxs_tierlist_raw.json) -> JSON estructurado
en INGLÉS (tal cual la fuente). La traducción al español es un paso posterior.

Salida: scripts/data/sxs_tierlist_parsed.json
Uso   : python scripts/scrapers/parse_sxs_tierlist.py
"""
import json
import sys
from bs4 import BeautifulSoup

ASSET_BASE = "https://eog.gg"
RAW = "scripts/data/sxs_tierlist_raw.json"
OUT = "scripts/data/sxs_tierlist_parsed.json"

REGION_META = {
    "t1": "T1", "t2": "T2", "t3": "T3", "t4": "T4", "t5": "T5",
}


def txt(el):
    return el.get_text(" ", strip=True) if el else ""


def abs_url(src):
    if not src:
        return None
    return src if src.startswith("http") else ASSET_BASE + src


def parse_class_region(html, tier_key):
    soup = BeautifulSoup(html, "lxml")
    ctier = soup.select_one(".sxs-ctier")
    if not ctier:
        return None
    banner = ctier.select_one(".sxs-ctier__banner")
    region = txt(ctier.select_one(".sxs-ctier__banner-name"))
    subtitle = txt(ctier.select_one(".sxs-ctier__banner-subtitle"))

    # Notas (Investment, Early game, ...) — pueden ser varias
    notes = []
    for note in ctier.select(".sxs-ctier__early-note"):
        tag = txt(note.select_one(".sxs-ctier__early-note-tag"))
        body = txt(note.select_one(".sxs-ctier__early-note-text"))
        if body:
            notes.append({"tag": tag, "text": body})

    # Tabla CLASS BREAKDOWN (clase x 4 modos). Puede no existir (T1/T2).
    classes = []
    matrix = ctier.select_one(".sxs-ctier__matrix")
    if matrix:
        for row in matrix.select(".sxs-ctier__matrix-row"):
            name = txt(row.select_one(".sxs-ctier__chip-name"))
            line = txt(row.select_one(".sxs-ctier__chip-line"))
            img = row.select_one(".sxs-ctier__chip-icon img")
            icon = abs_url(img.get("src")) if img else None
            grades = {}
            for cell in row.select(".sxs-ctier__matrix-cell"):
                mode = txt(cell.select_one(".sxs-ctier__matrix-cell-label"))
                pill = cell.select_one(".sxs-ctier__pill")
                empty = cell.select_one(".sxs-ctier__mtx-empty")
                if pill:
                    grade = (pill.find(string=True, recursive=False) or "").strip()
                    desc = txt(cell.select_one(".sxs-ctier__pop-body"))
                else:
                    grade = txt(empty) or "—"
                    desc = ""
                if mode:
                    grades[mode] = {"grade": grade, "desc": desc}
            if name:
                classes.append({"name": name, "line": line, "icon": icon, "grades": grades})

    return {
        "tier": REGION_META.get(tier_key, tier_key.upper()),
        "tierKey": tier_key,
        "region": region,
        "subtitle": subtitle,
        "notes": notes,
        "classes": classes,
    }


def parse_fantomon(html):
    soup = BeautifulSoup(html, "lxml")
    # El article correcto es el que contiene "Tier Overview" (no la vista class oculta)
    article = None
    for art in soup.select("div.sxs-article"):
        if "Tier Overview" in art.get_text():
            article = art
            break
    if not article:
        return None

    updated = ""
    for p in article.find_all("p", recursive=False):
        if "Updated" in txt(p):
            updated = txt(p)
            break

    ctx = article.select_one(".sxs-context")
    context = None
    if ctx:
        context = {
            "title": txt(ctx.select_one(".sxs-context__title")),
            "text": txt(ctx.select_one(".sxs-context__text")),
        }
    intro = txt(article.select_one(".sxs-intro"))

    groups = []
    for g in article.select(".sxs-fant-group"):
        gtitle = txt(g.select_one(".sxs-fant-group__title"))
        fants = []
        for li in g.select(".sxs-fant-row"):
            img = li.select_one(".sxs-portrait img")
            fants.append({
                "name": txt(li.select_one(".sxs-fant-row__name")),
                "type": txt(li.select_one(".sxs-fant-row__type")),
                "note": txt(li.select_one(".sxs-fant-row__note")),
                "icon": abs_url(img.get("src")) if img else None,
            })
        groups.append({"title": gtitle, "fantomons": fants})

    # Sección Level Breakpoints
    breakpoints, bp_intro, plans = [], "", []
    for sec in article.select(".sxs-section"):
        stitle = txt(sec.select_one(".sxs-section__title"))
        if "Breakpoint" in stitle:
            bodies = sec.select(".sxs-section__body")
            if bodies:
                bp_intro = txt(bodies[0])
            for r in sec.select(".sxs-details-row"):
                breakpoints.append({
                    "label": txt(r.select_one(".sxs-details-row__label")),
                    "val": txt(r.select_one(".sxs-details-row__val")),
                })
            # planes F2P / Whale (los párrafos con <strong>)
            for b in bodies:
                strong = b.find("strong")
                if strong:
                    plans.append({"tag": txt(strong).rstrip(":"), "text": txt(b)})

    return {
        "updated": updated,
        "context": context,
        "intro": intro,
        "groups": groups,
        "breakpointsIntro": bp_intro,
        "breakpoints": breakpoints,
        "plans": plans,
    }


def main():
    raw = json.load(open(RAW, encoding="utf-8"))
    out = {"class": {"regions": []}, "fantomon": None}

    for reg in ["t1", "t2", "t3", "t4", "t5"]:
        html = raw["class"][reg].get("html")
        if not html:
            continue
        r = parse_class_region(html, reg)
        if r:
            out["class"]["regions"].append(r)
            n = len(r["classes"])
            print(f"  CLASS {reg}: region={r['region']!r} classes={n} notes={len(r['notes'])}", file=sys.stderr)

    fhtml = raw["fantomon"]["t1"].get("html")
    if fhtml:
        out["fantomon"] = parse_fantomon(fhtml)
        f = out["fantomon"]
        if f:
            nf = sum(len(g["fantomons"]) for g in f["groups"])
            print(f"  FANTOMON: groups={len(f['groups'])} fantomons={nf} breakpoints={len(f['breakpoints'])} plans={len(f['plans'])}", file=sys.stderr)

    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"\nOK -> {OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
