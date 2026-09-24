"""Symbol geometry for the Lanther mark.

The mark is a solid tile with one passage cut through it. The passage enters
through the top face, turns, and leaves through the right face. It is wider at
the mouth than at the exit, so it reads as a tunnel receding: one continuous
route, with depth and forward motion, carved out of solid infrastructure. What
is left of the tile is an L and a block, with the connectivity layer between.
"""
import math
from shapely.geometry import Polygon, box

def arc(cx, cy, r, a0, a1, steps=48):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / steps)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / steps))) for i in range(steps + 1)]

def tile(size=48.0, r=11.5, smooth=2, square=False):
    """Rounded square with Chaikin-softened corners (no hard tangent break)."""
    if square:
        return box(0, 0, size, size)
    b = box(r, r, size - r, size - r).buffer(r, quad_segs=16)
    pts = list(b.exterior.coords)[:-1]
    for _ in range(smooth):
        new = []
        for i in range(len(pts)):
            p, q = pts[i], pts[(i + 1) % len(pts)]
            new += [(0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]),
                    (0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1])]
        pts = new
    return Polygon(pts)

def passage(stem, mouth, exit_y, exit_w, r_in, size=48.0):
    xo, xi = stem, stem + mouth
    yi, yo = exit_y, exit_y + exit_w
    ci = (xi + r_in, yi - r_in)
    inner = [(xi, -10), (xi, ci[1])] + arc(ci[0], ci[1], r_in, 180, 90)[1:] + [(size + 10, yi)]
    R = ci[0] - xo
    co = (ci[0], yo - R)
    outer = [(size + 10, yo), (co[0], yo)] + arc(co[0], co[1], R, 90, 180)[1:] + [(xo, -10)]
    return Polygon(inner + outer)

# Display cut, 48px and up.
DISPLAY = dict(stem=13.5, mouth=9, exit_y=28.5, exit_w=4.5, r_in=11)
# Small cut, 32px and below: wider exit so the passage survives pixel snapping.
SMALL = dict(stem=13, mouth=10, exit_y=27.5, exit_w=6.5, r_in=10)

def symbol(cut=DISPLAY, square=False):
    t = tile(square=square)
    p = passage(**cut)
    return t.difference(p), t.intersection(p)

def to_path(geom, prec=2, tol=0.015):
    def ring(coords):
        pts = list(coords)
        d = f"M{pts[0][0]:.{prec}f} {pts[0][1]:.{prec}f}"
        for x, y in pts[1:-1]:
            d += f"L{x:.{prec}f} {y:.{prec}f}"
        return d + "Z"
    geom = geom.simplify(tol)
    polys = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    out = ""
    for p in polys:
        out += ring(p.exterior.coords)
        for h in p.interiors:
            out += ring(h.coords)
    return out.replace(".00", "")
