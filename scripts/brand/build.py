"""Generate every Lanther logo file from one geometry.

    python3 -m venv .venv && .venv/bin/pip install shapely
    .venv/bin/python scripts/brand/build.py        (from the repo root)

Writes:
  public/brand/logo/*.svg         symbol, wordmark, lockups, app icon, in every colourway
  public/brand/concepts/*.svg     the exploration shown on the brand page
  public/favicon.svg              adaptive favicon (dark ink on light tabs, white on dark)
  src/brand/marks.ts              the same paths, for React
PNG renders are made afterwards by scripts/brand/render.sh (needs rsvg-convert).
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from geom import DISPLAY, SMALL, symbol, to_path  # noqa: E402
from wordmark import wordmark  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LOGO = os.path.join(ROOT, "public", "brand", "logo")
CONCEPTS = os.path.join(ROOT, "public", "brand", "concepts")
os.makedirs(LOGO, exist_ok=True)
os.makedirs(CONCEPTS, exist_ok=True)

INK = "#0B0D12"
BLACK = "#000000"
WHITE = "#FFFFFF"
BLUE = "#3D6BFF"
VIOLET = "#8A5CFF"

# Wordmark: 100-unit cap height.
WM_KW = dict(S=14, track=20, fillet=0.15, wx=1.12, lf=0.6)
wm_geom, WM_W = wordmark(**WM_KW)
WM = to_path(wm_geom, tol=0.04)

body, chan = symbol(DISPLAY)
SYM, CHAN = to_path(body), to_path(chan)
sbody, schan = symbol(SMALL)
SYM_S, CHAN_S = to_path(sbody), to_path(schan)
fbody, fchan = symbol(DISPLAY, square=True)
SYM_FULL, CHAN_FULL = to_path(fbody), to_path(fchan)


def grad(gid):
    # Runs from the mouth of the passage to its exit.
    return (f'<linearGradient id="{gid}" x1="18" y1="0" x2="48" y2="31" gradientUnits="userSpaceOnUse">'
            f'<stop stop-color="{BLUE}"/><stop offset="1" stop-color="{VIOLET}"/></linearGradient>')


def svg(vb, inner, title="Lanther"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}">'
            f"<title>{title}</title>{inner}</svg>\n")


def write(name, content, folder=LOGO):
    with open(os.path.join(folder, name), "w") as f:
        f.write(content)


# ---- symbol ---------------------------------------------------------------
for suffix, col in [("", INK), ("-black", BLACK), ("-white", WHITE)]:
    write(f"symbol{suffix}.svg", svg("0 0 48 48", f'<path d="{SYM}" fill="{col}"/>'))
    write(f"symbol-small{suffix}.svg", svg("0 0 48 48", f'<path d="{SYM_S}" fill="{col}"/>'))
# Colour: the passage is lit. The gradient never carries the identity on its own.
write("symbol-color.svg", svg("0 0 48 48", f'<defs>{grad("g")}</defs><path d="{SYM}" fill="{INK}"/><path d="{CHAN}" fill="url(#g)"/>'))
write("symbol-color-dark.svg", svg("0 0 48 48", f'<defs>{grad("g")}</defs><path d="{SYM}" fill="{WHITE}"/><path d="{CHAN}" fill="url(#g)"/>'))

# ---- wordmark -------------------------------------------------------------
wm_vb = f"0 0 {WM_W:.1f} 100"
for suffix, col in [("", INK), ("-black", BLACK), ("-white", WHITE)]:
    write(f"wordmark{suffix}.svg", svg(wm_vb, f'<path d="{WM}" fill="{col}"/>'))

# ---- lockups --------------------------------------------------------------
# Horizontal: symbol is about 1.65x the cap height; gap is a third of the symbol.
cap = 29.0
s = cap / 100
gap = 16.0
hw = 48 + gap + WM_W * s
H_INNER = (f'<path d="{SYM}" fill="C"/>'
           f'<path transform="translate({48 + gap} {(48 - cap) / 2}) scale({s})" d="{WM}" fill="C"/>')
# Stacked: wordmark cap height is 0.4 of the symbol, gap equals the cap height.
scap = 19.2
ss = scap / 100
sw = WM_W * ss
st_w = max(sw, 48)
S_INNER = (f'<path transform="translate({(st_w - 48) / 2} 0)" d="{SYM}" fill="C"/>'
           f'<path transform="translate({(st_w - sw) / 2} {48 + scap}) scale({ss})" d="{WM}" fill="C"/>')
for suffix, col in [("", INK), ("-black", BLACK), ("-white", WHITE)]:
    write(f"lockup-horizontal{suffix}.svg", svg(f"0 0 {hw:.1f} 48", H_INNER.replace('"C"', f'"{col}"')))
    write(f"lockup-stacked{suffix}.svg", svg(f"0 0 {st_w:.1f} {48 + scap * 2:.1f}", S_INNER.replace('"C"', f'"{col}"')))
write("lockup-horizontal-color.svg", svg(f"0 0 {hw:.1f} 48",
      f'<defs>{grad("g")}</defs><path d="{SYM}" fill="{INK}"/><path d="{CHAN}" fill="url(#g)"/>'
      + H_INNER.split("/>", 1)[1].replace('"C"', f'"{INK}"')))
write("lockup-horizontal-color-dark.svg", svg(f"0 0 {hw:.1f} 48",
      f'<defs>{grad("g")}</defs><path d="{SYM}" fill="{WHITE}"/><path d="{CHAN}" fill="url(#g)"/>'
      + H_INNER.split("/>", 1)[1].replace('"C"', f'"{WHITE}"')))

# ---- app icon -------------------------------------------------------------
# Full bleed: the platform applies its own mask, and the tile IS the mark.
# The tile is lit from above (graphite to ink) so it does not vanish on a dark
# wallpaper. This is the only place the tile carries a gradient.
TILE = ('<linearGradient id="t" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">'
        '<stop stop-color="#1E2230"/><stop offset="1" stop-color="#0B0D12"/></linearGradient>')
write("app-icon.svg", svg("0 0 48 48", f'<defs>{grad("g")}{TILE}</defs><path d="{SYM_FULL}" fill="url(#t)"/><path d="{CHAN_FULL}" fill="url(#g)"/>'))
write("app-icon-rounded.svg", svg("0 0 48 48", f'<defs>{grad("g")}{TILE}</defs><path d="{SYM}" fill="url(#t)"/><path d="{CHAN}" fill="url(#g)"/>'))

# ---- favicon --------------------------------------------------------------
favicon = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">'
           f'<style>path{{fill:{INK}}}@media (prefers-color-scheme:dark){{path{{fill:{WHITE}}}}}</style>'
           f'<path d="{SYM_S}"/></svg>\n')
with open(os.path.join(ROOT, "public", "favicon.svg"), "w") as f:
    f.write(favicon)

# ---- exploration ----------------------------------------------------------
# The concepts considered before choosing. Kept as drawn, not refined, on purpose.
concepts = [
    ("route", "Route", "An L drawn as a line between two endpoints.", "Reads as a network diagram. Rejected.",
     '<rect width="48" height="48" rx="11" fill="I"/><path d="M17 12v15a8 8 0 0 0 8 8h11" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="17" cy="12" r="4.2" fill="#fff"/><circle cx="36" cy="35" r="4.2" fill="B"/>'),
    ("junction", "Junction", "A tile split by a right-angled channel into an L and a block.", "Finalist.",
     '<mask id="m"><rect width="48" height="48" fill="#fff"/><path d="M15 -4V29a4 4 0 0 0 4 4H52" stroke="#000" stroke-width="5" fill="none"/></mask><rect width="48" height="48" rx="11" fill="I" mask="url(#m)"/>'),
    ("portal", "Portal", "A quarter-arc passage sweeping from the top face to the side.", "Finalist.",
     '<mask id="m"><rect width="48" height="48" fill="#fff"/><path d="M17 -1 H23.5 A24.5 24.5 0 0 0 48 23.5 V29 A31 31 0 0 1 17 -1 Z" fill="#000"/></mask><rect width="48" height="48" rx="11" fill="I" mask="url(#m)"/>'),
    ("depth", "Depth", "Nested L strokes receding toward the corner.", "Busy at small sizes. Rejected.",
     '<rect width="48" height="48" rx="11" fill="I"/><path d="M12 8v28h28" stroke="#fff" stroke-width="4.5" fill="none"/><path d="M20 8v20h20" stroke="#fff" stroke-opacity=".55" stroke-width="4.5" fill="none"/><path d="M28 8v12h12" stroke="B" stroke-width="4.5" fill="none"/>'),
    ("prompt", "Prompt", "An L turned to point forward, like a shell prompt.", "Too close to every terminal glyph. Rejected.",
     '<rect width="48" height="48" rx="11" fill="I"/><path d="M13 11l17 13-10.5 10.5" stroke="#fff" stroke-width="6" fill="none"/><rect x="30" y="33" width="7" height="5" fill="B"/>'),
    ("orbit", "Orbit", "A disc split by a bent channel.", "Reads as a pie chart. Rejected.",
     '<mask id="m"><rect width="48" height="48" fill="#fff"/><path d="M18 -4V25a6 6 0 0 0 6 6H52" stroke="#000" stroke-width="6" fill="none"/></mask><circle cx="24" cy="24" r="24" fill="I" mask="url(#m)"/>'),
    ("fold", "Fold", "An L ribbon folding at the corner.", "Dated, and the fold is decoration. Rejected.",
     '<rect width="48" height="48" rx="11" fill="I"/><path d="M12 9h10v21l-10 10z" fill="#fff"/><path d="M12 40l10-10h17v10z" fill="B"/>'),
    ("bridge", "Bridge", "Two unlike endpoints joined by an L route.", "Literal, and weak without colour. Rejected.",
     '<rect x="6" y="6" width="12" height="12" rx="2" fill="I"/><circle cx="36" cy="36" r="6.5" fill="B"/><path d="M12 18v12a6 6 0 0 0 6 6h11.5" stroke="I" stroke-width="5" fill="none"/>'),
    ("interlock", "Interlock", "Two L shapes locked into one square.", "Reads as a window or a cross. Rejected.",
     '<mask id="m"><rect width="48" height="48" fill="#fff"/><path d="M-4 17H31V52" stroke="#000" stroke-width="5" fill="none"/><path d="M17 -4V31" stroke="#000" stroke-width="5"/></mask><rect width="48" height="48" rx="11" fill="I" mask="url(#m)"/>'),
    ("gate", "Gate", "A solid L beside a ring, an open gate.", "Two ideas, not one. Rejected.",
     '<path d="M8 6h13v22a6 6 0 0 0 6 6h15v12H8z" fill="I"/><circle cx="37" cy="14" r="7" fill="none" stroke="B" stroke-width="4"/>'),
    ("passage", "Passage", "A tile with one tapered passage cut through it.", "Selected.",
     f'<path d="{SYM}" fill="I"/>'),
]
meta = []
for i, (slug, name, idea, verdict, body_svg) in enumerate(concepts, 1):
    fn = f"{i:02d}-{slug}.svg"
    write(fn, svg("0 0 48 48", body_svg.replace('"I"', f'"{INK}"').replace('"B"', f'"{BLUE}"'), name), CONCEPTS)
    meta.append({"file": fn, "name": name, "idea": idea, "verdict": verdict})

# ---- React ----------------------------------------------------------------
ts = f"""// Generated by scripts/brand/build.py. Do not edit by hand: change the
// geometry there and re-run it, so the SVG files and the site stay identical.

/** The Lanther symbol on a 48-unit grid. `body` is the tile, `passage` the cut. */
export const SYMBOL = {{ viewBox: "0 0 48 48", body: {json.dumps(SYM)}, passage: {json.dumps(CHAN)} }} as const;

/** Small cut, for 32px and below. Wider exit so the passage survives pixel snapping. */
export const SYMBOL_SMALL = {{ viewBox: "0 0 48 48", body: {json.dumps(SYM_S)}, passage: {json.dumps(CHAN_S)} }} as const;

/** LANTHER wordmark on a 100-unit cap height. */
export const WORDMARK = {{ viewBox: "{wm_vb}", width: {WM_W:.1f}, d: {json.dumps(WM)} }} as const;

export const BRAND_COLORS = {{ ink: "{INK}", blue: "{BLUE}", violet: "{VIOLET}" }} as const;

export type Concept = {{ file: string; name: string; idea: string; verdict: string }};
export const CONCEPTS: Concept[] = {json.dumps(meta, indent=2)};
"""
with open(os.path.join(ROOT, "src", "brand", "marks.ts"), "w") as f:
    f.write(ts)

print("symbol path", len(SYM), "wordmark path", len(WM), "wordmark width", round(WM_W, 1))
