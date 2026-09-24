import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ROWS, VIEW, edges, nodes, phases, type Phase, type TopoEdge, type TopoNode } from "../../data/topology";
import { useTickerInView } from "../../lib/hooks";
import { c, MONO } from "../../lib/colors";
import { BRAND_COLORS, SYMBOL } from "../../brand/marks";

const PHASE_MS = 2600;

type LogEntry = { id: number; time: string; text: string; tone: Tone };
type Tone = "ok" | "warn" | "err" | "info";

const toneFor = (p: Phase): Tone =>
  p.ai === "investigating" ? "warn" : p.ai === "rerouting" ? "err" : p.ai === "recovered" ? "ok" : "info";

const clock = (d: Date) => d.toISOString().slice(11, 19);

/** Small deterministic jitter so latency labels move without looking random. */
const jitter = (seed: number, amp: number) => Math.round(Math.sin(seed * 12.9898) * 43758.5453 % 1 * amp);

/**
 * Drives the scenario: which phase we are in, the latency per edge and the
 * rolling event log. Shared by the desktop and mobile layouts so they tell the
 * same story.
 */
function useTopology() {
  const { ref, tick, reduced } = useTickerInView(PHASE_MS);
  const phase = phases[reduced ? 0 : tick % phases.length]!;
  const [log, setLog] = useState<LogEntry[]>(() => {
    const now = Date.now();
    return [phases[0]!, phases[5]!].map((p, i) => ({
      id: -i - 1,
      time: clock(new Date(now - (i + 1) * 9000)),
      text: p.event,
      tone: "info" as Tone,
    }));
  });
  const last = useRef(-1);

  useEffect(() => {
    if (tick === 0 || tick === last.current) return;
    last.current = tick;
    setLog((l) => [{ id: tick, time: clock(new Date()), text: phase.event, tone: toneFor(phase) }, ...l].slice(0, 3));
  }, [tick, phase]);

  const latency = useMemo(() => {
    const out: Record<string, number> = {};
    for (const e of edges) {
      if (!e.latency) continue;
      let v = e.latency + Math.abs(jitter(tick + e.id.length, 4));
      if (e.id === "onprem-a" && phase.primary === "warn") v = 212; // matches the event log line
      out[e.id] = v;
    }
    return out;
  }, [tick, phase]);

  return { ref, phase, log, latency, reduced };
}

const aiTone: Record<Phase["ai"], { dot: string; text: string; label: string }> = {
  nominal: { dot: "bg-ok", text: "text-ok", label: "AI · nominal" },
  investigating: { dot: "bg-warn", text: "text-warn", label: "AI · investigating" },
  rerouting: { dot: "bg-accent", text: "text-accent", label: "AI · rerouting" },
  recovered: { dot: "bg-ok", text: "text-ok", label: "AI · recovered" },
};

const toneText: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn",
  err: "text-err",
  info: "text-subtle",
};

export function HeroTopology() {
  const t = useTopology();
  return (
    <div ref={t.ref} className="relative">
      <Frame phase={t.phase} log={t.log}>
        <div className="hidden lg:block">
          <div className="px-4 py-4">
            <DesktopGraph phase={t.phase} latency={t.latency} reduced={t.reduced} />
          </div>
        </div>
        <div className="lg:hidden">
          <MobileGraph phase={t.phase} latency={t.latency} reduced={t.reduced} />
        </div>
      </Frame>
    </div>
  );
}

function Frame({ phase, log, children }: { phase: Phase; log: LogEntry[]; children: React.ReactNode }) {
  const tone = aiTone[phase.ai];
  return (
    <figure
      className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-elev/90 shadow-[0_40px_120px_-40px_rgb(110_139_255/0.35)]"
      aria-label="Live connectivity map: developers reach services in AWS, GCP and on-prem through Lanther, which detects a degraded tunnel and fails over to a standby path."
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-subtle">
          <span className="text-muted">topology</span>
          <span aria-hidden="true">/</span>
          <span className="truncate">production</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`hidden items-center gap-1.5 font-mono text-[11px] sm:inline-flex ${tone.text}`} aria-live="polite">
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
            {phase.status}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-ok/70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-ok" />
            </span>
            live
          </span>
        </div>
      </div>

      {children}

      <div className="border-t border-white/[0.07] px-4 py-3">
        <ol className="space-y-1.5 font-mono text-[11px] leading-5" aria-label="Recent events">
          <AnimatePresence initial={false}>
            {log.map((e) => (
              <m.li
                key={e.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-3"
              >
                <span className="shrink-0 text-subtle/70">{e.time}</span>
                <span className={`truncate ${toneText[e.tone]}`}>{e.text}</span>
              </m.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </figure>
  );
}

/* ---------------------------------- desktop --------------------------------- */

function edgeState(e: TopoEdge, phase: Phase): "ok" | "warn" | "down" | "idle" {
  if (e.id === "onprem-a") return phase.primary;
  if (e.id === "onprem-b") return phase.standby === "active" ? "ok" : "idle";
  return "ok";
}

const strokeFor = { ok: c("accent", 0.45), warn: c("warn", 0.8), down: c("err", 0.7), idle: c("line", 0.12) };

function DesktopGraph({ phase, latency, reduced }: { phase: Phase; latency: Record<string, number>; reduced: boolean }) {
  return (
    <svg viewBox={`0 36 ${VIEW.w} ${VIEW.h - 72}`} className="block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="core-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c("accent")} />
          <stop offset="1" stopColor={c("violet")} />
        </linearGradient>
        <linearGradient id="heel-lit" x1="0" y1="48" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor={BRAND_COLORS.blue} />
          <stop offset="1" stopColor={BRAND_COLORS.violet} />
        </linearGradient>
        <radialGradient id="core-glow">
          <stop offset="0" stopColor={c("accent")} stopOpacity="0.28" />
          <stop offset="1" stopColor={c("accent")} stopOpacity="0" />
        </radialGradient>
        <filter id="packet-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="318" cy="220" rx="200" ry="130" fill="url(#core-glow)" />

      {/* Environment boundaries */}
      {ROWS.map((y) => (
        <rect key={y} x={500} y={y - 42} width={552} height={84} rx={14} fill={c("line", 0.015)} stroke={c("line", 0.06)} strokeDasharray="3 5" />
      ))}

      {edges.map((e) => {
        const s = edgeState(e, phase);
        return (
          <g key={e.id}>
            <path
              d={e.d}
              fill="none"
              stroke={strokeFor[s]}
              strokeWidth={s === "idle" ? 1 : 1.4}
              strokeDasharray={s === "down" || s === "idle" ? "4 5" : undefined}
              style={{ transition: "stroke 400ms" }}
            />
            {!reduced && (s === "ok" || s === "warn") && <Packets edge={e} tone={s} />}
            {e.label && latency[e.id] !== undefined && s !== "idle" && (
              <LatencyTag x={e.label.x} y={e.label.y} ms={s === "down" ? null : latency[e.id]!} tone={s} />
            )}
          </g>
        );
      })}

      {nodes.map((n) => (
        <NodeBox key={n.id} node={n} phase={phase} reduced={reduced} />
      ))}
    </svg>
  );
}

function Packets({ edge, tone }: { edge: TopoEdge; tone: "ok" | "warn" }) {
  const count = edge.id === "dev" ? 3 : 2;
  const dur = tone === "warn" ? 3.6 : 1.8 + (edge.id.length % 3) * 0.35;
  const color = tone === "warn" ? c("warn") : edge.id === "dev" ? c("ink") : c("accent");
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <circle key={`${edge.id}-${tone}-${i}`} r={2.2} fill={color} filter="url(#packet-glow)" opacity={0}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${(i * dur) / count}s`} path={edge.d} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={`${(i * dur) / count}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function LatencyTag({ x, y, ms, tone }: { x: number; y: number; ms: number | null; tone: string }) {
  const color = tone === "warn" ? c("warn") : tone === "down" ? c("err") : c("muted");
  const text = ms === null ? "down" : `${ms}ms`;
  const w = text.length * 6.4 + 12;
  return (
    <g transform={`translate(${x - w / 2} ${y - 9})`}>
      <rect width={w} height={18} rx={9} fill={c("bg")} stroke={c("line", 0.1)} />
      <text x={w / 2} y={12.5} textAnchor="middle" fontSize="10.5" fontFamily={MONO} fill={color}>
        {text}
      </text>
    </g>
  );
}

const kindStyle: Record<Exclude<TopoNode["kind"], "core">, { fill: string; stroke: string }> = {
  entry: { fill: c("panel"), stroke: c("line", 0.16) },
  cloud: { fill: c("panel"), stroke: c("line", 0.14) },
  workload: { fill: c("elev"), stroke: c("line", 0.12) },
  service: { fill: c("bg"), stroke: c("line", 0.1) },
};

function NodeBox({ node: n, phase, reduced }: { node: TopoNode; phase: Phase; reduced: boolean }) {
  const x = n.x - n.w / 2;
  const y = n.y - n.h / 2;

  if (n.kind === "core") {
    const tone = phase.ai === "investigating" ? c("warn") : phase.ai === "rerouting" ? c("accent") : c("ok");
    return (
      <g>
        {!reduced && (
          <rect x={x} y={y} width={n.w} height={n.h} rx={14} fill="none" stroke={c("accent", 0.5)} className="pulse-ring" />
        )}
        <rect x={x} y={y} width={n.w} height={n.h} rx={14} fill={c("panel")} stroke="url(#core-stroke)" strokeWidth={1.4} />
        <g transform={`translate(${x + 16} ${y + 20})`}>
          <g transform="scale(0.6667)">
            <path d={SYMBOL.body} fill="#FFFFFF" />
            <path d={SYMBOL.heel} fill="url(#heel-lit)" />
          </g>
        </g>
        <text x={x + 60} y={y + 32} fontSize="15" fontWeight="600" fill={c("ink")}>
          {n.label}
        </text>
        <g transform={`translate(${x + 60} ${y + 41})`}>
          <circle cx={4} cy={6} r={3} fill={tone} style={{ transition: "fill 400ms" }} />
          <text x={12} y={9.5} fontSize="10.5" fontFamily={MONO} fill={tone}>
            {aiTone[phase.ai].label}
          </text>
        </g>
      </g>
    );
  }

  const s = kindStyle[n.kind];
  const degraded = n.id === "onprem" && phase.primary === "warn";

  if (n.kind === "service") {
    return (
      <g>
        <rect x={x} y={y} width={n.w} height={n.h} rx={8} fill={s.fill} stroke={s.stroke} />
        <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontFamily={MONO} fill={c("muted")}>
          {n.label}
        </text>
      </g>
    );
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={n.w}
        height={n.h}
        rx={10}
        fill={s.fill}
        stroke={degraded ? c("warn", 0.7) : s.stroke}
        style={{ transition: "stroke 400ms" }}
      />
      <circle cx={x + 16} cy={n.y} r={3} fill={degraded ? c("warn") : c("ok")} style={{ transition: "fill 400ms" }} />
      <text x={x + 28} y={n.y - 3} fontSize="12.5" fontWeight="600" fill={c("ink")}>
        {n.label}
      </text>
      <text x={x + 28} y={n.y + 12} fontSize="10.5" fontFamily={MONO} fill={c("subtle")}>
        {n.sub}
      </text>
    </g>
  );
}

/* ---------------------------------- mobile ---------------------------------- */
/*
 * On a phone the tree becomes a list of routes. Each row is one path from
 * Lanther to a service, which is what someone actually cares about at 390px:
 * where does it go, how fast, is it healthy.
 */

type Route = { id: string; env: string; region: string; hops: string[]; edge: string };

const routes: Route[] = [
  { id: "aws", env: "AWS", region: "eu-west-1", hops: ["EKS prod-eu", "svc/payments"], edge: "aws" },
  { id: "gcp", env: "GCP", region: "us-central1", hops: ["GKE analytics", "svc/events"], edge: "gcp" },
  { id: "onprem", env: "On-prem", region: "dc-frankfurt", hops: ["Private API", "db/ledger"], edge: "onprem" },
];

function MobileGraph({ phase, latency, reduced }: { phase: Phase; latency: Record<string, number>; reduced: boolean }) {
  const tone = aiTone[phase.ai];
  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-lg border border-white/10 bg-panel px-3 py-2.5">
        <span className="text-[13px] font-medium text-ink">Developers</span>
        <span className="font-mono text-[10.5px] text-subtle">cli · api · internet</span>
      </div>
      <Rail reduced={reduced} />
      <div className="relative mx-auto max-w-md rounded-xl border border-accent/40 bg-panel px-3 py-3 shadow-[0_0_40px_-12px_rgb(110_139_255/0.5)]">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-ink">Lanther</span>
          <span className={`inline-flex items-center gap-1.5 font-mono text-[10.5px] ${tone.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
            {tone.label}
          </span>
        </div>
        <p className={`mt-1 font-mono text-[10.5px] ${tone.text}`}>{phase.status}</p>
      </div>
      <Rail reduced={reduced} />
      <ul className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0">
        {routes.map((r) => {
          const isOnprem = r.id === "onprem";
          const state = isOnprem ? (phase.primary === "ok" ? "ok" : phase.primary === "warn" ? "warn" : "failover") : "ok";
          const ms = isOnprem
            ? state === "failover"
              ? latency["onprem-b"]
              : latency["onprem-a"]
            : latency[r.edge];
          const color = state === "warn" ? "text-warn" : state === "failover" ? "text-accent" : "text-ok";
          const dot = state === "warn" ? "bg-warn" : state === "failover" ? "bg-accent" : "bg-ok";
          return (
            <li key={r.id} className={`rounded-lg border bg-elev px-3 py-2.5 transition-colors ${state === "warn" ? "border-warn/50" : "border-white/[0.08]"}`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                  <span className="text-[13px] font-semibold text-ink">{r.env}</span>
                  <span className="font-mono text-[10.5px] text-subtle">{r.region}</span>
                </span>
                <span className={`font-mono text-[11px] ${color}`}>
                  {state === "failover" ? `via onprem-b · ${ms}ms` : `${ms}ms`}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10.5px] text-muted">
                {r.hops.map((h, i) => (
                  <span key={h} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-subtle" aria-hidden="true">→</span>}
                    {h}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Rail({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative mx-auto h-6 w-px bg-white/15" aria-hidden="true">
      {!reduced && (
        <m.span
          className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_rgb(110_139_255)]"
          initial={{ top: -3, opacity: 0 }}
          animate={{ top: [-3, 21], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
