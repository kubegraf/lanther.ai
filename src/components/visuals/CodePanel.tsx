import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { useSequence } from "../../lib/hooks";

type Tab = { id: string; label: string; file: string; copy: string; render: () => ReactNode };

const connectCmd = "lanther connect postgres-prod";

const k8sYaml = `apiVersion: lanther.ai/v1alpha1
kind: Connection
metadata:
  name: payments-to-ledger
  namespace: payments
spec:
  from:
    serviceAccount: payments-api
  to:
    target: onprem/db-ledger   # dc-frankfurt
    port: 5432
  access:
    identity: required
  routing:
    primary: tunnel/onprem-a
    failover: tunnel/onprem-b`;

const policyYaml = `apiVersion: lanther.ai/v1alpha1
kind: OperatorPolicy
metadata:
  name: network-routes
spec:
  mode: auto-apply   # observe | propose | auto-apply
  scope:
    environments: [aws/eu-west-1, onprem/dc-frankfurt]
    actions:
      - route.create
      - tunnel.failover
  guardrails:
    verifyAfterChange: true
    rollbackOnFailure: true
    requireApproval: [route.delete, policy.update]`;

const tabs: Tab[] = [
  { id: "cli", label: "CLI", file: "zsh", copy: connectCmd, render: () => <Terminal /> },
  { id: "k8s", label: "Kubernetes", file: "connection.yaml", copy: k8sYaml, render: () => <Yaml source={k8sYaml} /> },
  { id: "policy", label: "Operator policy", file: "operator-policy.yaml", copy: policyYaml, render: () => <Yaml source={policyYaml} /> },
];

export function CodePanel() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = tabs[active]!;

  // WAI-ARIA tabs: arrow keys move between tabs, Home and End jump.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tab.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). Nothing to do.
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0A0B0F] shadow-[0_30px_100px_-40px_rgb(0_0_0/0.8)]">
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.07] pr-2">
        <div role="tablist" aria-label="Examples" onKeyDown={onKey} className="flex overflow-x-auto">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative shrink-0 px-4 py-3 text-[13px] transition-colors ${i === active ? "text-ink" : "text-subtle hover:text-muted"}`}
            >
              {t.label}
              {i === active && <span className="absolute inset-x-3 -bottom-px h-px bg-accent" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[11px] text-subtle sm:inline">{tab.file}</span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle hover:bg-white/5 hover:text-ink"
            aria-label={copied ? "Copied" : `Copy ${tab.label} example`}
          >
            {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div
        role="tabpanel"
        id={`panel-${tab.id}`}
        aria-labelledby={`tab-${tab.id}`}
        tabIndex={0}
        className="min-h-[380px] overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.75]"
      >
        {tab.render()}
      </div>
    </div>
  );
}

const outputLines: { mark: string; tone: string; label: string; detail: string }[] = [
  { mark: "✓", tone: "text-ok", label: "Tunnel established", detail: "eks/prod-eu ⇄ vpc-data · 38ms" },
  { mark: "✓", tone: "text-ok", label: "Identity verified", detail: "sre-oncall via SSO" },
  { mark: "✓", tone: "text-ok", label: "Route configured", detail: "localhost:5432 → 10.40.3.12:5432" },
  { mark: "✓", tone: "text-ok", label: "Connectivity verified", detail: "tcp/5432 · 11ms" },
];

function Terminal() {
  // Steps: 0..n typing the command, then one step per output line, then the tail.
  const typeSteps = connectCmd.length;
  const total = typeSteps + outputLines.length + 3;
  // Type quickly, then let each result line land at a readable pace.
  const { ref, step } = useSequence(total, (s) => (s < typeSteps ? 42 : s === typeSteps ? 380 : 520), {
    once: true,
  });
  const typed = connectCmd.slice(0, Math.min(step, typeSteps));
  const outStep = step - typeSteps;

  return (
    <div ref={ref} aria-label={`Terminal: ${connectCmd}`}>
      <p className="whitespace-pre text-ink">
        <span className="text-accent">❯</span> {typed}
        {step < typeSteps && <span className="caret ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-ink/80" />}
      </p>
      {outStep >= 1 && <p className="text-subtle">  resolving postgres-prod (rds · eu-west-1)</p>}
      {outputLines.map((l, i) =>
        outStep >= i + 2 ? (
          <p key={l.label} className="whitespace-pre">
            <span className={l.tone}>{l.mark}</span> <span className="inline-block w-[22ch] text-ink">{l.label}</span>
            <span className="text-subtle">{l.detail}</span>
          </p>
        ) : null,
      )}
      {outStep >= outputLines.length + 2 && (
        <>
          <p className="mt-4 text-muted">Ready. Connect with:</p>
          <p className="whitespace-pre text-ink">  psql -h localhost -p 5432 -U app ledger</p>
          <p className="mt-4 text-subtle">
            <span className="text-accent">❯</span> <span className="caret inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-ink/60" />
          </p>
        </>
      )}
    </div>
  );
}

/** Just enough YAML highlighting: comments, keys, strings/values, list dashes. */
function Yaml({ source }: { source: string }) {
  return (
    <pre className="text-muted">
      {source.split("\n").map((line, i) => {
        const [code, comment] = splitComment(line);
        const m = code.match(/^(\s*)(- )?([\w.-]+)(:)(.*)$/);
        return (
          <div key={i} className="whitespace-pre">
            {m ? (
              <>
                {m[1]}
                {m[2] && <span className="text-subtle">{m[2]}</span>}
                <span className="text-accent">{m[3]}</span>
                <span className="text-subtle">{m[4]}</span>
                <span className="text-ink">{m[5]}</span>
              </>
            ) : (
              <ListLine code={code} />
            )}
            {comment && <span className="text-subtle/80">{comment}</span>}
          </div>
        );
      })}
    </pre>
  );
}

function ListLine({ code }: { code: string }) {
  const lead = code.match(/^\s*/)?.[0] ?? "";
  const rest = code.slice(lead.length);
  return (
    <>
      {lead}
      {rest.startsWith("- ") ? (
        <>
          <span className="text-subtle">- </span>
          <span className="text-ink">{rest.slice(2)}</span>
        </>
      ) : (
        <span className="text-ink">{rest}</span>
      )}
    </>
  );
}

function splitComment(line: string): [string, string] {
  const idx = line.indexOf(" #");
  return idx === -1 ? [line, ""] : [line.slice(0, idx), line.slice(idx)];
}
