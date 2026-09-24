import { m, useReducedMotion } from "framer-motion";
import { c, MONO } from "../../lib/colors";

/*
 * One small technical drawing per capability card. Each is 280x120 and shows
 * the mechanism rather than an icon for it.
 */

const Svg = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <svg viewBox="0 0 280 120" className="block h-auto w-full" role="img" aria-label={label}>
    {children}
  </svg>
);

const Chip = ({ x, y, w, text, tone = "muted" }: { x: number; y: number; w: number; text: string; tone?: "muted" | "ink" | "accent" }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={26} rx={7} fill={c("panel")} stroke={tone === "accent" ? c("accent", 0.6) : c("line", 0.14)} />
    <text x={w / 2} y={17} textAnchor="middle" fontSize="10.5" fontFamily={MONO} fill={tone === "accent" ? c("accent") : c(tone)}>
      {text}
    </text>
  </g>
);

export function TunnelVisual() {
  const reduced = useReducedMotion();
  const d = "M78 60 L202 60";
  return (
    <Svg label="Two environments joined by an encrypted tunnel">
      <Chip x={6} y={47} w={72} text="eks-prod" />
      <Chip x={202} y={47} w={72} text="dc-fra" />
      <rect x={82} y={50} width={116} height={20} rx={10} fill={c("accent", 0.06)} stroke={c("accent", 0.35)} />
      <path d={d} stroke={c("accent", 0.35)} strokeDasharray="2 4" />
      {!reduced &&
        [0, 0.6, 1.2].map((b) => (
          <circle key={b} r={2.4} fill={c("accent")}>
            <animateMotion dur="1.8s" begin={`${b}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}
      <g transform="translate(131 18)">
        <rect x={0} y={7} width={18} height={14} rx={3} fill={c("panel")} stroke={c("accent", 0.8)} />
        <path d="M4 7 V4 a5 5 0 0 1 10 0 V7" fill="none" stroke={c("accent", 0.8)} strokeWidth={1.5} />
      </g>
      <text x={140} y={96} textAnchor="middle" fontSize="10" fontFamily={MONO} fill={c("subtle")}>
        encrypted · outbound-only · no open ports
      </text>
    </Svg>
  );
}

export function RoutingVisual() {
  const routes = [
    { y: 22, label: "aws/eu-west-1", w: "70%", tone: "accent" as const },
    { y: 60, label: "gcp/us-east1", w: "30%", tone: "accent" as const },
    { y: 98, label: "azure/westeu", w: "standby", tone: "muted" as const },
  ];
  return (
    <Svg label="Traffic split 70/30 across two clouds with a third on standby">
      <Chip x={6} y={47} w={64} text="api" tone="ink" />
      {routes.map((r) => (
        <g key={r.label}>
          <path
            d={`M70 60 C110 60 110 ${r.y} 150 ${r.y}`}
            fill="none"
            stroke={r.tone === "accent" ? c("accent", r.w === "70%" ? 0.8 : 0.45) : c("line", 0.18)}
            strokeWidth={r.w === "70%" ? 2 : 1.2}
            strokeDasharray={r.tone === "muted" ? "3 4" : undefined}
          />
          <text x={156} y={r.y + 3.5} fontSize="9.5" fontFamily={MONO} fill={c(r.tone === "accent" ? "muted" : "subtle")}>
            {r.label}
          </text>
          <text x={274} y={r.y + 3.5} textAnchor="end" fontSize="9.5" fontFamily={MONO} fill={r.tone === "accent" ? c("accent") : c("subtle")}>
            {r.w}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export function ZeroTrustVisual() {
  const rows = [
    { who: "sre-oncall", to: "postgres-prod", ok: true },
    { who: "ci/deploy", to: "payments-api", ok: true },
    { who: "contractor", to: "postgres-prod", ok: false },
  ];
  return (
    <div className="space-y-1.5 font-mono text-[10.5px]" role="img" aria-label="Access decisions made per identity">
      {rows.map((r) => (
        <div key={r.who + r.to} className="flex items-center justify-between rounded-md border border-white/[0.07] bg-panel px-2.5 py-1.5">
          <span className="truncate text-muted">
            {r.who} <span className="text-subtle">→</span> {r.to}
          </span>
          <span className={`ml-2 shrink-0 rounded px-1.5 py-px ${r.ok ? "bg-ok/10 text-ok" : "bg-err/10 text-err"}`}>
            {r.ok ? "allow" : "deny"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TroubleshootVisual() {
  const checks = [
    { t: "dns resolve", s: "ok" },
    { t: "network policy", s: "ok" },
    { t: "security group", s: "ok" },
    { t: "route table", s: "fail" },
  ];
  return (
    <div className="font-mono text-[10.5px] leading-[1.9]" role="img" aria-label="A diagnostic run where the route table check fails">
      <p className="text-subtle">$ lanther why payments-api → postgres</p>
      {checks.map((ch, i) => (
        <m.p
          key={ch.t}
          initial={{ opacity: 0, x: -4 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.25 }}
          className="flex justify-between"
        >
          <span className="text-muted">{ch.t}</span>
          <span className={ch.s === "ok" ? "text-ok" : "text-warn"}>{ch.s === "ok" ? "✓ pass" : "✗ no route"}</span>
        </m.p>
      ))}
    </div>
  );
}

export function RemediationVisual() {
  return (
    <div className="font-mono text-[10.5px] leading-[1.8]" role="img" aria-label="A proposed route change waiting on approval policy">
      <div className="rounded-md border border-white/[0.07] bg-panel px-2.5 py-2">
        <p className="text-subtle">route-table/rtb-eks-private</p>
        <p className="text-ok">+ 10.40.0.0/16 → tgw-core</p>
        <p className="text-subtle">~ verify: tcp/5432 reachable</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-subtle">policy: network-routes</span>
        <span className="flex items-center gap-1.5 text-accent">
          <span className="relative inline-block h-3 w-5 rounded-full bg-accent/30">
            <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-accent" />
          </span>
          auto-apply
        </span>
      </div>
    </div>
  );
}

export function ObservabilityVisual() {
  const pts = [34, 30, 36, 31, 29, 33, 58, 74, 40, 30, 28, 31, 29, 27, 30];
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"}${6 + i * 19} ${110 - v}`).join(" ");
  return (
    <Svg label="Latency over time with a single spike above the p95 line">
      <line x1={6} x2={274} y1={60} y2={60} stroke={c("warn", 0.35)} strokeDasharray="3 4" />
      <text x={274} y={54} textAnchor="end" fontSize="9.5" fontFamily={MONO} fill={c("warn", 0.8)}>
        p95 50ms
      </text>
      <path d={`${path} L272 118 L6 118 Z`} fill={c("accent", 0.08)} />
      <m.path
        d={path}
        fill="none"
        stroke={c("accent")}
        strokeWidth={1.6}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <circle cx={6 + 7 * 19} cy={110 - 74} r={3} fill={c("warn")} />
      <text x={6} y={14} fontSize="10" fontFamily={MONO} fill={c("subtle")}>
        eks-prod → postgres · latency
      </text>
    </Svg>
  );
}
