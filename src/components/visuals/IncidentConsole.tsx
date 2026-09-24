import { AnimatePresence, m } from "framer-motion";
import { AlertTriangle, Check, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { useSequence } from "../../lib/hooks";
import { c, MONO } from "../../lib/colors";

/*
 * A scripted incident, played once when it scrolls into view.
 *
 * The story has to be technically right, because the people this is for will
 * check it: the subnet route table on the EKS side sends 10.40.0.0/16 to the
 * transit gateway, so that check passes. The transit gateway's own route table
 * has no route to the database attachment, so the packet dies there and the
 * client sees a timeout, not a refusal.
 */

type Probe = { label: string; detail: string; result: "pass" | "warn" };

const checks: Probe[] = [
  { label: "DNS resolution", detail: "postgres.internal → 10.40.3.12", result: "pass" },
  { label: "Network policy", detail: "egress tcp/5432 allowed", result: "pass" },
  { label: "Security group", detail: "sg-db inbound from 10.20.0.0/16", result: "pass" },
  { label: "Route table", detail: "rtb-eks-private: 10.40.0.0/16 → tgw-core", result: "pass" },
  { label: "Connection", detail: "tcp/5432 timeout after 3s at tgw-core", result: "warn" },
];

// Step indices into the sequence.
const S = {
  detected: 0,
  investigating: 1,
  firstCheck: 2,
  rootCause: 2 + checks.length, // 7
  action: 8,
  applying: 9,
  recovered: 10,
} as const;
const STEPS = S.recovered + 1;

const stages = [
  { label: "Detect", from: S.detected },
  { label: "Trace", from: S.firstCheck },
  { label: "Root cause", from: S.rootCause },
  { label: "Remediate", from: S.action },
  { label: "Verify", from: S.recovered },
];

export function IncidentConsole() {
  const { ref, step, replay, reduced } = useSequence(STEPS, 750, { loopDelay: 7000 });
  const linkState = step >= S.recovered ? "ok" : step >= S.applying ? "applying" : "down";
  const stageIndex = stages.reduce((acc, s, i) => (step >= s.from ? i : acc), 0);

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-white/[0.09] bg-elev shadow-[0_40px_120px_-50px_rgb(110_139_255/0.4)]">
      {/* stage bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3">
        <ol className="flex min-w-0 items-center gap-1 overflow-x-auto font-mono text-[11px]" aria-label="Incident stages">
          <li className="shrink-0 pr-1 text-subtle sm:hidden" aria-hidden="true">
            {stageIndex + 1}/{stages.length}
          </li>
          {stages.map((s, i) => (
            <li key={s.label} className={`shrink-0 items-center gap-1 ${i === stageIndex ? "flex" : "hidden sm:flex"}`}>
              {i > 0 && <span aria-hidden="true" className="hidden text-white/15 sm:inline">/</span>}
              <span
                aria-current={i === stageIndex ? "step" : undefined}
                className={`rounded px-1.5 py-0.5 transition-colors ${
                  i === stageIndex ? "bg-accent/15 text-accent" : i < stageIndex ? "text-muted" : "text-subtle/70"
                }`}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
        {!reduced && (
          <button
            type="button"
            onClick={replay}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-subtle hover:bg-white/5 hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Replay</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="border-b border-white/[0.07] p-4 lg:border-b-0 lg:border-r">
          <div className="hidden sm:block">
            <PathGraph state={linkState} reduced={reduced} />
          </div>
          <div className="sm:hidden">
            <PathList state={linkState} />
          </div>
        </div>
        <Investigation step={step} />
      </div>
    </div>
  );
}

const hops = [
  { title: "payment-api", sub: "eks/prod-eu · 10.20.14.7" },
  { title: "rtb-eks-private", sub: "10.40.0.0/16 → tgw-core" },
  { title: "tgw-core", sub: "transit gateway · eu-west-1" },
  { title: "postgres", sub: "rds · 10.40.3.12:5432" },
];

/** Phone layout of the same path: a vertical list of hops, readable at 390px. */
function PathList({ state }: { state: "down" | "applying" | "ok" }) {
  const ok = state === "ok";
  return (
    <div className="font-mono text-[11px]">
      <div className="mb-3 flex gap-6">
        <p>
          <span className="block text-subtle">p99 latency</span>
          <span className={`text-[14px] ${ok ? "text-ok" : "text-err"}`}>{ok ? "11ms" : "timeout"}</span>
        </p>
        <p>
          <span className="block text-subtle">error rate</span>
          <span className={`text-[14px] ${ok ? "text-ok" : "text-err"}`}>{ok ? "0.0%" : "100%"}</span>
        </p>
      </div>
      <ol className="space-y-0">
        {hops.map((h, i) => {
          const last = i === hops.length - 1;
          const linkTone = i === hops.length - 2 ? (ok ? "bg-ok" : state === "applying" ? "bg-accent" : "bg-err/70") : "bg-accent/50";
          return (
            <li key={h.title}>
              <div className={`rounded-lg border bg-panel px-3 py-2 ${last && !ok ? "border-err/50" : "border-white/[0.1]"}`}>
                <p className="font-sans text-[13px] font-semibold text-ink">{h.title}</p>
                <p className="text-[10.5px] text-subtle">{h.sub}</p>
              </div>
              {!last && (
                <div className="flex items-center gap-2 py-1 pl-5" aria-hidden="true">
                  <span className={`h-4 w-px ${linkTone}`} />
                  {i === hops.length - 2 && !ok && (
                    <span className={state === "applying" ? "text-accent" : "text-err"}>{state === "applying" ? "adding route…" : "✗ no route"}</span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PathGraph({ state, reduced }: { state: "down" | "applying" | "ok"; reduced: boolean }) {
  const broken = "M280 196 L280 262";
  const linkColor = state === "ok" ? c("ok") : state === "applying" ? c("accent") : c("err");
  const ys = [34, 120, 196, 262];
  return (
    <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img" aria-label={`Request path from payment-api to postgres. The last hop is ${state === "ok" ? "healthy" : state === "applying" ? "being repaired" : "failing"}.`}>
      {/* subnet boundaries */}
      <rect x={16} y={8} width={368} height={140} rx={12} fill="none" stroke={c("line", 0.07)} strokeDasharray="3 5" />
      <text x={28} y={140} fontSize="9.5" fontFamily={MONO} fill={c("subtle")}>vpc-eks · 10.20.0.0/16</text>
      <rect x={16} y={236} width={368} height={56} rx={12} fill="none" stroke={c("line", 0.07)} strokeDasharray="3 5" />
      <text x={28} y={285} fontSize="9.5" fontFamily={MONO} fill={c("subtle")}>vpc-data · 10.40.0.0/16</text>

      <path d="M280 52 L280 102 M280 138 L280 178" stroke={c("accent", 0.5)} strokeWidth={1.4} />
      <path d={broken} stroke={linkColor} strokeWidth={1.6} strokeDasharray={state === "ok" ? undefined : "4 4"} className={state === "applying" && !reduced ? "dash-flow" : undefined} style={{ transition: "stroke 400ms" }} />
      {state === "down" && (
        <g transform="translate(280 229)">
          <circle r={9} fill={c("bg")} stroke={c("err", 0.8)} />
          <path d="M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5" stroke={c("err")} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      )}
      {state === "ok" && !reduced &&
        [0, 0.7].map((b) => (
          <circle key={b} r={2.4} fill={c("ok")}>
            <animateMotion dur="1.4s" begin={`${b}s`} repeatCount="indefinite" path="M280 52 L280 262" />
          </circle>
        ))}

      {hops.map((h, i) => {
        const failing = i === 3 && state !== "ok";
        return (
          <g key={h.title} transform={`translate(176 ${ys[i]! - 18})`}>
            <rect width={208} height={36} rx={9} fill={c("panel")} stroke={failing ? c("err", 0.5) : c("line", 0.14)} style={{ transition: "stroke 400ms" }} />
            <text x={14} y={15} fontSize="11.5" fontWeight="600" fill={c("ink")}>{h.title}</text>
            <text x={14} y={28} fontSize="9.5" fontFamily={MONO} fill={c("subtle")}>{h.sub}</text>
          </g>
        );
      })}

      <g transform="translate(28 30)">
        <text fontSize="9.5" fontFamily={MONO} fill={c("subtle")}>p99 latency</text>
        <text y={20} fontSize="15" fontFamily={MONO} fill={state === "ok" ? c("ok") : c("err")}>
          {state === "ok" ? "11ms" : "timeout"}
        </text>
        <text y={50} fontSize="9.5" fontFamily={MONO} fill={c("subtle")}>error rate</text>
        <text y={70} fontSize="15" fontFamily={MONO} fill={state === "ok" ? c("ok") : c("err")}>
          {state === "ok" ? "0.0%" : "100%"}
        </text>
      </g>
    </svg>
  );
}

function Investigation({ step }: { step: number }) {
  const show = (at: number) => step >= at;
  return (
    <div className="flex min-h-[420px] flex-col p-4 font-mono text-[12px] leading-relaxed sm:p-5" aria-live="polite">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-err">
            <span className="h-1.5 w-1.5 rounded-full bg-err" />
            Incident detected
          </p>
          <p className="mt-1 text-[13px] text-ink">payment-api → postgres</p>
        </div>
        <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10.5px] text-subtle">INC-2041</span>
      </div>

      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <p className="flex items-center gap-2 text-muted">
          {step < S.rootCause ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" aria-hidden="true" />
          ) : (
            <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          )}
          {step < S.rootCause ? "Investigating…" : `Traced ${checks.length} layers`}
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {checks.map((ch, i) => (
            <AnimatePresence key={ch.label}>
              {show(S.firstCheck + i) && (
                <m.li initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="flex gap-2.5">
                  {ch.result === "pass" ? (
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" aria-label="pass" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" aria-label="warning" />
                  )}
                  <span className="min-w-0">
                    <span className={ch.result === "pass" ? "text-ink" : "text-warn"}>{ch.label}</span>
                    <span className="block truncate text-[11px] text-subtle">{ch.detail}</span>
                  </span>
                </m.li>
              )}
            </AnimatePresence>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {show(S.rootCause) && (
          <m.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg border border-warn/25 bg-warn/[0.05] p-3">
            <p className="text-[10.5px] uppercase tracking-wider text-warn">Root cause</p>
            <p className="mt-1 font-sans text-[13px] leading-snug text-ink">
              Missing route between the EKS subnet and the private database network. Transit gateway route table{" "}
              <span className="font-mono text-[12px]">tgw-rtb-core</span> has no entry for 10.40.0.0/16.
            </p>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show(S.action) && (
          <m.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-lg border border-white/[0.08] bg-panel p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10.5px] uppercase tracking-wider text-subtle">Action</p>
              <span className="inline-flex items-center gap-1 text-[10.5px] text-accent">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                allowed by policy network-routes
              </span>
            </div>
            <p className="mt-1.5 text-ok">+ 10.40.0.0/16 → tgw-attach-data</p>
            <p className="text-subtle">then verify tcp/5432 from payment-api</p>
          </m.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-subtle">Status</span>
          <StatusPill step={step} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ step }: { step: number }) {
  const s =
    step >= S.recovered
      ? { text: "Recovered · verified", cls: "bg-ok/10 text-ok" }
      : step >= S.applying
        ? { text: "Applying remediation", cls: "bg-accent/10 text-accent" }
        : step >= S.rootCause
          ? { text: "Root cause found", cls: "bg-warn/10 text-warn" }
          : { text: "Investigating", cls: "bg-white/5 text-muted" };
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] ${s.cls}`}>{s.text}</span>;
}
