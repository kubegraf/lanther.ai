"""Lanther identity ("Vector"). Generates every logo file from one geometry.

Symbol "Vector": a forward-leaning L, sliced at the heel by one 45 degree cut.
The cut is a light source: a beam escapes through the gap and lights the mark.
Flat files are for small sizes, print and light surfaces. Lit files are for
display sizes on dark backgrounds.

    python3 -m venv .venv && .venv/bin/pip install -r scripts/brand/requirements.txt
    .venv/bin/python scripts/brand/build.py && ./scripts/brand/render.sh   (repo root)

Writes public/brand/logo/*.svg, public/favicon.svg and src/brand/marks.ts.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shapely.geometry import Polygon, LineString
from shapely.ops import unary_union
from shapely import affinity
from wordmark import wordmark

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "brand", "logo")
os.makedirs(OUT, exist_ok=True)
INK, WHITE, BLUE, VIOLET = "#0B0D12", "#FFFFFF", "#3D6BFF", "#8A5CFF"
SLANT = 14

def line(pts, w):
    return LineString(pts).buffer(w / 2, cap_style="flat", join_style="mitre")

def path(g, prec=2):
    g = g.simplify(0.01)
    polys = [g] if g.geom_type == "Polygon" else list(g.geoms)
    d = ""
    for p in polys:
        for r in [p.exterior, *p.interiors]:
            c = list(r.coords)
            d += "M" + "L".join(f"{x:.{prec}f} {y:.{prec}f}".replace(".00", "") for x, y in c[:-1]) + "Z"
    return d

# ---- symbol ----------------------------------------------------------------
L = Polygon([(0, 0), (12.5, 0), (12.5, 26.5), (36, 26.5), (36, 38), (0, 38)])
cut = line([(-6, 44), (19, 19)], 3.4)
heel, body = sorted(L.difference(cut).geoms, key=lambda p: p.area)
body = affinity.skew(body, xs=-SLANT, origin=(0, 38))
heel = affinity.skew(heel, xs=-SLANT, origin=(0, 38))
minx, miny, maxx, maxy = unary_union([body, heel]).bounds
dx, dy = (48 - (maxx - minx)) / 2 - minx, (48 - (maxy - miny)) / 2 - miny
body, heel = affinity.translate(body, dx, dy), affinity.translate(heel, dx, dy)
B, H = path(body), path(heel)

# ---- wordmark ----------------------------------------------------------------
S = 12.0
wg, _ = wordmark(S=S, track=26, fillet=0, wx=1.42, lf=0, lam=True)
wg = wg.difference(line([(-8, 108), (S * 2.2 + 2, 100 - S * 2.2 - 2)], S * 0.3))
wg = affinity.skew(wg, xs=-SLANT, origin=(0, 100))
wg = affinity.translate(wg, -wg.bounds[0], 0)
WW = wg.bounds[2]
W = path(wg)

def grad(i="g"):
    return (f'<linearGradient id="{i}" x1="0" y1="48" x2="20" y2="28" gradientUnits="userSpaceOnUse">'
            f'<stop stop-color="{BLUE}"/><stop offset="1" stop-color="{VIOLET}"/></linearGradient>')

def svg(vb, inner, title="Lanther"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}"><title>{title}</title>{inner}</svg>\n'

def save(name, s):
    open(os.path.join(OUT, name), "w").write(s)

# ---- flat files -------------------------------------------------------------
sym = lambda c, h=None: f'<path d="{B}" fill="{c}"/><path d="{H}" fill="{h or c}"/>'
save("symbol.svg", svg("0 0 48 48", sym(INK)))
save("symbol-white.svg", svg("0 0 48 48", sym(WHITE)))
save("symbol-black.svg", svg("0 0 48 48", sym("#000")))
save("symbol-color.svg", svg("0 0 48 48", f"<defs>{grad()}</defs>" + sym(INK, "url(#g)")))
save("symbol-color-dark.svg", svg("0 0 48 48", f"<defs>{grad()}</defs>" + sym(WHITE, "url(#g)")))
wvb = f"0 0 {WW:.1f} 100"
save("wordmark.svg", svg(wvb, f'<path d="{W}" fill="{INK}"/>'))
save("wordmark-white.svg", svg(wvb, f'<path d="{W}" fill="{WHITE}"/>'))
save("wordmark-black.svg", svg(wvb, f'<path d="{W}" fill="#000"/>'))
cap, gap = 22.0, 12.0
s = cap / 100
hw = 48 + gap + WW * s
def hlock(c, h=None, defs=""):
    return svg(f"0 0 {hw:.1f} 48", defs + sym(c, h) + f'<path transform="translate({48 + gap} {(48 - cap) / 2}) scale({s})" d="{W}" fill="{c}"/>')
save("lockup-horizontal.svg", hlock(INK))
save("lockup-horizontal-white.svg", hlock(WHITE))
save("lockup-horizontal-black.svg", hlock("#000"))
save("lockup-horizontal-color.svg", hlock(INK, "url(#g)", f"<defs>{grad()}</defs>"))
save("lockup-horizontal-color-dark.svg", hlock(WHITE, "url(#g)", f"<defs>{grad()}</defs>"))
scap = 13.0; ss = scap / 100; sw = WW * ss; stw = max(sw, 48)
stack = lambda c, h=None, defs="": svg(f"0 0 {stw:.1f} {48 + scap * 2.4:.1f}", defs +
    f'<g transform="translate({(stw - 48) / 2} 0)">{sym(c, h)}</g>'
    f'<path transform="translate({(stw - sw) / 2} {48 + scap * 1.4}) scale({ss})" d="{W}" fill="{c}"/>')
save("lockup-stacked.svg", stack(INK))
save("lockup-stacked-white.svg", stack(WHITE))
save("lockup-stacked-color-dark.svg", stack(WHITE, "url(#g)", f"<defs>{grad()}</defs>"))
tile = ('<linearGradient id="t" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">'
        '<stop stop-color="#20242F"/><stop offset="1" stop-color="#0B0D12"/></linearGradient>')
flat_inner = f'<g transform="translate(24 24) scale(0.66) translate(-24 -24)">{sym(WHITE, "url(#g)")}</g>'
save("app-icon.svg", svg("0 0 48 48", f"<defs>{grad()}{tile}</defs><rect width='48' height='48' fill='url(#t)'/>{flat_inner}"))
save("app-icon-rounded.svg", svg("0 0 48 48", f"<defs>{grad()}{tile}</defs><rect width='48' height='48' rx='11' fill='url(#t)'/>{flat_inner}"))
open(os.path.join(ROOT, "public", "favicon.svg"), "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><style>path{{fill:{INK}}}@media (prefers-color-scheme:dark){{path{{fill:{WHITE}}}}}</style><path d="{B}"/><path d="{H}"/></svg>\n')

# ==== LIGHTING ===============================================================
def placed_line(p0, p1):
    g = affinity.skew(LineString([p0, p1]), xs=-SLANT, origin=(0, 38))
    return list(affinity.translate(g, dx, dy).coords)
(b0x, b0y), (b1x, b1y) = placed_line((-4.5, 42.5), (17, 21.5))   # beam, leaking past the gap
(c0x, c0y), (c1x, c1y) = placed_line((0, 38), (12.5, 26.5))      # the gap itself
mx, my = (c0x + c1x) / 2, (c0y + c1y) / 2
BEAM = f"M{b0x:.2f} {b0y:.2f}L{b1x:.2f} {b1y:.2f}"

def lit_defs(p):
    """Every id is prefixed so several lit marks can share one page."""
    return f'''
<linearGradient id="{p}stem" x1="0" y1="{miny + dy:.1f}" x2="0" y2="{maxy + dy:.1f}" gradientUnits="userSpaceOnUse">
 <stop stop-color="#FFFFFF"/><stop offset=".65" stop-color="#E6EBFF"/><stop offset="1" stop-color="#AFBEFF"/></linearGradient>
<linearGradient id="{p}blade" x1="{c0x:.1f}" y1="{c0y:.1f}" x2="{c0x + 26:.1f}" y2="{c0y - 8:.1f}" gradientUnits="userSpaceOnUse">
 <stop stop-color="#5B8CFF"/><stop offset=".55" stop-color="#6F6BFF"/><stop offset="1" stop-color="#A06BFF"/></linearGradient>
<linearGradient id="{p}bladeTop" x1="0" y1="{c1y:.1f}" x2="0" y2="{c1y + 9:.1f}" gradientUnits="userSpaceOnUse">
 <stop stop-color="#FFFFFF" stop-opacity=".5"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="{p}beam" x1="{b0x:.2f}" y1="{b0y:.2f}" x2="{b1x:.2f}" y2="{b1y:.2f}" gradientUnits="userSpaceOnUse">
 <stop stop-color="#9FB4FF" stop-opacity="0"/><stop offset=".22" stop-color="#DCE5FF"/><stop offset=".55" stop-color="#FFFFFF"/>
 <stop offset=".85" stop-color="#D2C2FF"/><stop offset="1" stop-color="#D2C2FF" stop-opacity="0"/></linearGradient>
<radialGradient id="{p}ambient" cx="{mx:.1f}" cy="{my:.1f}" r="27" gradientUnits="userSpaceOnUse">
 <stop stop-color="#5B6CFF" stop-opacity=".45"/><stop offset=".45" stop-color="#6A4DFF" stop-opacity=".14"/><stop offset="1" stop-color="#6A4DFF" stop-opacity="0"/></radialGradient>
<filter id="{p}bloom" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="{p}bloomWide" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="{p}soft" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation=".8"/></filter>'''

def lit_symbol(p="l", animated=False):
    core_anim = packet = sheen_def = sheen = ""
    if animated:
        core_anim = '<animate attributeName="opacity" values=".7;1;.7" dur="3.2s" repeatCount="indefinite"/>'
        packet = (f'<circle r="1.5" fill="#FFFFFF" filter="url(#{p}soft)" opacity="0">'
                  f'<animateMotion dur="3.2s" repeatCount="indefinite" path="{BEAM}" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".6 0 .4 1"/>'
                  f'<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.2;.75;1" dur="3.2s" repeatCount="indefinite"/></circle>')
        sheen_def = (f'<linearGradient id="{p}sheen" x1="{c0x:.1f}" y1="0" x2="{c0x + 10:.1f}" y2="0" gradientUnits="userSpaceOnUse">'
                     f'<stop stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>'
                     f'<animateTransform attributeName="gradientTransform" type="translate" values="-14 0;34 0;34 0" keyTimes="0;.6;1" dur="3.2s" repeatCount="indefinite"/></linearGradient>')
        sheen = f'<path d="{H}" fill="url(#{p}sheen)"/>'
    return f'''<defs>{lit_defs(p)}{sheen_def}</defs>
<circle cx="{mx:.1f}" cy="{my:.1f}" r="27" fill="url(#{p}ambient)"/>
<path d="{H}" fill="#6B6BFF" opacity=".55" filter="url(#{p}bloomWide)"/>
<path d="{BEAM}" stroke="#6F86FF" stroke-width="5" stroke-linecap="round" filter="url(#{p}bloomWide)" opacity=".9"/>
<path d="{B}" fill="url(#{p}stem)"/>
<path d="{H}" fill="url(#{p}blade)"/>
<path d="{H}" fill="url(#{p}bladeTop)"/>
{sheen}
<path d="{BEAM}" stroke="#9DB2FF" stroke-width="2.2" stroke-linecap="round" filter="url(#{p}bloom)"/>
<path d="{BEAM}" stroke="url(#{p}beam)" stroke-width=".9" stroke-linecap="round">{core_anim}</path>
{packet}'''

save("symbol-lit.svg", svg("-24 -20 96 88", lit_symbol()))
save("symbol-lit-animated.svg", svg("-24 -20 96 88", lit_symbol(animated=True)))

def wm_lit(p):
    return (f'<defs><linearGradient id="{p}wmg" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">'
            f'<stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#C3CDFF"/></linearGradient>'
            f'<filter id="{p}halo" x="-5%" y="-40%" width="110%" height="180%"><feGaussianBlur stdDeviation="5"/></filter></defs>'
            f'<path d="{W}" fill="#7C8CFF" opacity=".32" filter="url(#{p}halo)"/><path d="{W}" fill="url(#{p}wmg)"/>')

lw = 48 + 24 + 16 + gap + WW * s
def lit_lockup(animated=False):
    return svg(f"-24 -20 {lw:.1f} 88", lit_symbol("l", animated) +
               f'<g transform="translate({48 + gap} {(48 - cap) / 2}) scale({s})">{wm_lit("w")}</g>')
save("lockup-horizontal-lit.svg", lit_lockup())
save("lockup-horizontal-lit-animated.svg", lit_lockup(True))

pool = ("<radialGradient id='pool' cx='24' cy='30' r='26' gradientUnits='userSpaceOnUse'>"
        "<stop stop-color='#3B4BFF' stop-opacity='.3'/><stop offset='1' stop-color='#3B4BFF' stop-opacity='0'/></radialGradient>")
lit_inner = f"<g transform='translate(24 24) scale(0.62) translate(-24 -24)'>{lit_symbol('a')}</g>"
save("app-icon-lit.svg", svg("0 0 48 48", f"<defs>{tile}{pool}</defs><rect width='48' height='48' fill='url(#t)'/><rect width='48' height='48' fill='url(#pool)'/>{lit_inner}"))
save("app-icon-lit-rounded.svg", svg("0 0 48 48", f"<defs>{tile}{pool}<clipPath id='r'><rect width='48' height='48' rx='11'/></clipPath></defs><g clip-path='url(#r)'><rect width='48' height='48' fill='url(#t)'/><rect width='48' height='48' fill='url(#pool)'/>{lit_inner}</g>"))
# ---- React -----------------------------------------------------------------
ts = f"""// Generated by scripts/brand/build.py. Do not edit by hand: change the
// geometry there and re-run it, so the SVG files and the site stay identical.

/** The Lanther symbol on a 48-unit grid: a forward-leaning L cut once at the heel.
 *  body is the upright, heel the detached blade (the only part that takes colour). */
export const SYMBOL = {{ viewBox: "0 0 48 48", body: {json.dumps(B)}, heel: {json.dumps(H)} }} as const;

/** LANTHER wordmark on a 100-unit cap height, already slanted 14 degrees. */
export const WORDMARK = {{ viewBox: "{wvb}", width: {WW:.1f}, d: {json.dumps(W)} }} as const;

/** Lockup ratios: wordmark cap height and gap, as fractions of the symbol size. */
export const LOCKUP = {{ cap: {cap / 48:.4f}, gap: {gap / 48:.4f} }} as const;

export const BRAND_COLORS = {{ ink: "{INK}", blue: "{BLUE}", violet: "{VIOLET}" }} as const;
"""
open(os.path.join(ROOT, "src", "brand", "marks.ts"), "w").write(ts)
print("ok", round(WW, 1))
