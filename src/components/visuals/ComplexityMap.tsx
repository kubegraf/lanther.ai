import { useEffect, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "../../lib/hooks";
import { c, MONO } from "../../lib/colors";

type Pt = { x: number; y: number };
type Item = { id: string; label: string; before: Pt; after: Pt };

/*
 * Two geometries. Wide is a landscape card. Compact is portrait, for phones:
 * the same drawing scaled down to 340px would leave 5px text, so it gets its
 * own coordinates and larger type instead.
 */
type Layout = { w: number; h: number; cx: number; cy: number; rx: number; ry: number; font: number; tag: number; scattered: Pt[] };

const WIDE: Layout = {
  w: 560,
  h: 400,
  cx: 280,
  cy: 200,
  rx: 196,
  ry: 150,
  font: 11,
  tag: 9.5,
  scattered: [
    { x: 92, y: 70 },
    { x: 420, y: 58 },
    { x: 470, y: 250 },
    { x: 150, y: 318 },
    { x: 300, y: 150 },
    { x: 356, y: 344 },
    { x: 70, y: 196 },
    { x: 232, y: 250 },
  ],
};

const COMPACT: Layout = {
  w: 340,
  h: 460,
  cx: 170,
  cy: 230,
  rx: 106,
  ry: 180,
  font: 12,
  tag: 10.5,
  scattered: [
    { x: 76, y: 50 },
    { x: 262, y: 84 },
    { x: 264, y: 250 },
    { x: 84, y: 330 },
    { x: 170, y: 170 },
    { x: 236, y: 410 },
    { x: 70, y: 196 },
    { x: 150, y: 270 },
  ],
};

const labels = ["EKS prod", "GKE analytics", "AKS eu", "Postgres", "Internal API", "On-prem DC", "Partner API", "Redis"];

function itemsFor(l: Layout): Item[] {
  return labels.map((label, i) => {
    const a = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
    return {
      id: label,
      label,
      before: l.scattered[i]!,
      after: { x: Math.round(l.cx + Math.cos(a) * l.rx), y: Math.round(l.cy + Math.sin(a) * l.ry) },
    };
  });
}

/** Point-to-point glue, each with the mechanism a team had to set up by hand. */
const mesh: [number, number, string][] = [
  [0, 1, "VPN"],
  [0, 3, "SG rule"],
  [0, 4, ""],
  [1, 2, "peering"],
  [1, 4, "IP allowlist"],
  [2, 5, "VPN"],
  [2, 7, ""],
  [3, 5, ""],
  [3, 6, "NAT"],
  [4, 5, "bastion"],
  [4, 7, ""],
  [5, 6, "port-forward"],
  [6, 0, "transit gw"],
  [7, 3, ""],
  [1, 6, ""],
];

type Mode = "before" | "after";

export function ComplexityMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("before");
  const touched = useRef(false);

  // Show the mess first, then resolve it once. If the reader has already
  // clicked, leave their choice alone.
  useEffect(() => {
    if (!inView || reduced) return;
    const t = setTimeout(() => !touched.current && setMode("after"), 2600);
    return () => clearTimeout(t);
  }, [inView, reduced]);

  const pick = (next: Mode) => {
    touched.current = true;
    setMode(next);
  };

  const compact = useMediaQuery("(max-width: 639px)");
  const L = compact ? COMPACT : WIDE;
  const items = itemsFor(L);
  const CX = L.cx;
  const CY = L.cy;
  const pos = (i: number) => (mode === "before" ? items[i]!.before : items[i]!.after);
  const spring = { type: "spring", stiffness: 70, damping: 16 } as const;

  return (
    <div ref={ref} className="panel overflow-hidden">
      <div className="flex items-center justify-end gap-3 border-b border-white/[0.07] px-4 py-3 sm:justify-between">
        <p className="hidden font-mono text-[11px] text-subtle sm:block">
          {mode === "before" ? "15 hand-built links · 7 mechanisms" : "1 connectivity layer · 8 links"}
        </p>
        <div role="group" aria-label="Compare" className="flex rounded-lg border border-white/10 bg-bg p-0.5 text-[12px]">
          {(["before", "after"] as Mode[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={mode === k}
              onClick={() => pick(k)}
              className={`rounded-md px-3 py-1 transition-colors ${mode === k ? "bg-white/10 text-ink" : "text-subtle hover:text-muted"}`}
            >
              {k === "before" ? "Today" : "With Lanther"}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${L.w} ${L.h}`} className="block h-auto w-full" role="img" aria-label={mode === "before"
        ? "Eight systems joined by fifteen separate links: VPNs, peering, NAT, bastions, allowlists and security group rules."
        : "The same eight systems, each connected once to Lanther in the centre."}>
        {/* mesh */}
        {mesh.map(([a, b, label], i) => {
          const p = pos(a);
          const q = pos(b);
          return (
            <g key={`m${i}`}>
              <m.line
                initial={false}
                animate={{ x1: p.x, y1: p.y, x2: q.x, y2: q.y, opacity: mode === "before" ? 1 : 0 }}
                transition={spring}
                stroke={c("err", 0.35)}
                strokeWidth={1}
                strokeDasharray="3 4"
              />
              {label && (
                <m.g initial={false} animate={{ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, opacity: mode === "before" ? 1 : 0 }} transition={spring}>
                  <rect x={-label.length * L.tag * 0.33 - 6} y={-L.tag * 0.85} width={label.length * L.tag * 0.66 + 12} height={L.tag * 1.7} rx={4} fill={c("bg")} stroke={c("err", 0.25)} />
                  <text textAnchor="middle" y={L.tag * 0.36} fontSize={L.tag} fontFamily={MONO} fill={c("err", 0.85)}>
                    {label}
                  </text>
                </m.g>
              )}
            </g>
          );
        })}

        {/* hub */}
        {items.map((_, i) => {
          const p = pos(i);
          return (
            <m.line
              key={`h${i}`}
              initial={false}
              animate={{ x1: CX, y1: CY, x2: p.x, y2: p.y, opacity: mode === "after" ? 1 : 0 }}
              transition={spring}
              stroke={c("accent", 0.5)}
              strokeWidth={1.2}
            />
          );
        })}
        <m.g initial={false} animate={{ opacity: mode === "after" ? 1 : 0, scale: mode === "after" ? 1 : 0.6 }} style={{ originX: `${CX}px`, originY: `${CY}px` }} transition={spring}>
          <circle cx={CX} cy={CY} r={46} fill={c("accent", 0.08)} />
          <rect x={CX - 52} y={CY - 18} width={104} height={36} rx={10} fill={c("panel")} stroke={c("accent", 0.8)} />
          <text x={CX} y={CY + 5} textAnchor="middle" fontSize="13" fontWeight="600" fill={c("ink")}>
            Lanther
          </text>
        </m.g>

        {items.map((it, i) => {
          const p = pos(i);
          const w = it.label.length * L.font * 0.6 + 22;
          const h = L.font * 2.4;
          return (
            <m.g key={it.id} initial={false} animate={{ x: p.x, y: p.y }} transition={spring}>
              <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={7} fill={c("elev")} stroke={c("line", 0.16)} />
              <text textAnchor="middle" y={L.font * 0.36} fontSize={L.font} fontFamily={MONO} fill={c("muted")}>
                {it.label}
              </text>
            </m.g>
          );
        })}
      </svg>
    </div>
  );
}
