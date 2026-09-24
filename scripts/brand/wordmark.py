"""LANTHER wordmark, drawn letter by letter on a 100-unit cap height."""
import math
from shapely.geometry import Polygon, box, Point
from shapely.ops import unary_union
from shapely import affinity

def closing(g, r):
    # Rounds concave (inside) corners, keeps convex corners sharp.
    return g.buffer(r, quad_segs=24, join_style="round").buffer(-r, quad_segs=24, join_style="round")

def diag(x_top, x_bot, w_perp, y0=0, y1=100, anchor="left"):
    """A diagonal stroke between two x positions, with true perpendicular weight."""
    dx, dy = x_bot - x_top, y1 - y0
    L = math.hypot(dx, dy)
    hw = w_perp * L / dy  # horizontal width that yields w_perp perpendicular
    return Polygon([(x_top, y0), (x_top + hw, y0), (x_bot + hw, y1), (x_bot, y1)])

def letters(S=15.0, k_h=0.9, fillet=0.42, wx=1.0, lf=0.95, lam=False):
    Sh = S * k_h           # horizontals slightly thinner, so they look equal
    Sd = S * 1.02          # diagonals
    G = {}
    # L — the inside corner carries the passage's curve, larger than the others
    W = wx * 58
    L = unary_union([box(0, 0, S, 100), box(0, 100 - Sh, W, 100)])
    G["L"] = (closing(L, S * lf) if lf else L, W)
    # A — flat apex, crossbar set low so the counter reads as an opening
    W = wx * 84
    apex = S * 1.15
    outer = Polygon([(W/2 - apex/2, 0), (W/2 + apex/2, 0), (W, 100), (0, 100)])
    # left diagonal: outer edge (W/2-apex/2,0)->(0,100); right mirrored
    ld = diag(W/2 - apex/2, 0, Sd)
    rd = affinity.scale(ld, xfact=-1, origin=(W/2, 50))
    bar_y = 66
    bar = box(0, bar_y, W, bar_y + Sh).intersection(outer)
    A = unary_union([ld, rd] + ([] if lam else [bar])).intersection(box(0, 0, W, 100))
    G["A"] = (A, W)
    # N
    W = wx * 76
    N = unary_union([box(0, 0, S, 100), box(W - S, 0, W, 100), diag(0, W - Sd * 1.25, Sd)])
    N = N.intersection(box(0, 0, W, 100))
    G["N"] = (N, W)
    # T
    W = wx * 72
    G["T"] = (unary_union([box(0, 0, W, Sh), box(W/2 - S/2, 0, W/2 + S/2, 100)]), W)
    # H — crossbar a touch above centre
    W = wx * 76
    G["H"] = (unary_union([box(0, 0, S, 100), box(W - S, 0, W, 100), box(0, 47 - Sh/2, W, 47 + Sh/2)]), W)
    # E — shorter middle arm
    W = wx * 58
    G["E"] = (unary_union([box(0, 0, S, 100), box(0, 0, W, Sh), box(0, 47 - Sh/2, W * 0.86, 47 + Sh/2), box(0, 100 - Sh, W, 100)]), W)
    # R — bowl to 56, straight leg from the bowl join
    W = wx * 72
    bh = 56
    rr = bh / 2
    cx = W - 4 - rr
    bowl_outer = unary_union([box(0, 0, cx, bh), affinity.scale(Point(cx, rr).buffer(rr, quad_segs=48), xfact=1.0, yfact=1.0).intersection(box(cx, 0, W, bh))])
    bowl_inner = unary_union([box(S, Sh, cx, bh - Sh),
                              affinity.scale(Point(cx, rr).buffer(1, quad_segs=48), xfact=rr - S, yfact=rr - Sh, origin=(cx, rr)).intersection(box(cx, 0, W, bh))])
    bowl = bowl_outer.difference(bowl_inner)
    leg = diag(cx - S * 0.9, W - Sd * 1.28, Sd, y0=bh - Sh, y1=100)
    R = unary_union([box(0, 0, S, 100), bowl, leg]).intersection(box(0, 0, W, 100))
    G["R"] = (R, W)
    out = {}
    for ch, (g, w) in G.items():
        r = S * fillet if (ch != "L" and fillet) else 0
        out[ch] = ((closing(g, r) if r else g), w)
    return out

def wordmark(text="LANTHER", S=15.0, track=17.0, **kw):
    wx = kw.get("wx", 1.0)
    G = letters(S, **kw)
    x = 0
    parts = []
    for i, ch in enumerate(text):
        g, w = G[ch]
        # optical kerning: open shapes need less space
        kern = {("L","A"): -14, ("A","N"): -3, ("T","H"): -4, ("H","E"): 0, ("E","R"): 0, ("N","T"): -2}
        if i:
            x += kern.get((text[i-1], ch), 0) * wx
        parts.append(affinity.translate(g, xoff=x))
        x += w + track
    return unary_union(parts), x - track
