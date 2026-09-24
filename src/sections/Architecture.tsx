import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Activity, BrainCircuit, KeyRound, Network } from "lucide-react";
import { Reveal, Section, SectionHeader } from "../components/ui/Section";

const controlPlane = [
  { icon: KeyRound, label: "Identity & policy" },
  { icon: Network, label: "Connectivity model" },
  { icon: BrainCircuit, label: "AI operator" },
  { icon: Activity, label: "Observability" },
];

const environments = [
  { name: "AWS", sub: "VPC · EKS · RDS" },
  { name: "GCP", sub: "VPC · GKE · Cloud SQL" },
  { name: "Azure", sub: "VNet · AKS · SQL" },
  { name: "On-prem", sub: "DC · VMs · bare metal" },
];

const workloads = ["Applications", "Services", "Databases", "Internal APIs"];

const specs = [
  {
    title: "Outbound-only agents",
    body: "Agents open an outbound TLS connection on 443. No inbound firewall rules, no public IPs, no bastion hosts.",
  },
  {
    title: "Traffic stays on your path",
    body: "Service traffic moves between agents through encrypted tunnels. The control plane holds configuration and telemetry, not your requests.",
  },
  {
    title: "Policy decides everything",
    body: "Who can reach what, which routes exist and what the AI operator may change are all policy, versioned as code.",
  },
  {
    title: "Every action is audited",
    body: "Each connection, policy change and automated fix is recorded with who or what made it and why.",
  },
];

export function Architecture() {
  return (
    <Section id="architecture" labelledBy="arch-title" className="border-t border-white/[0.06]">
      <SectionHeader
        id="arch-title"
        eyebrow="Architecture"
        title="A control plane you can reason about."
        lead="A small agent in each environment, one control plane above them and a clear boundary between the two. Nothing about it needs to be taken on trust."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-12">
        <Reveal>
          <figure className="panel p-4 sm:p-6" aria-label="Architecture: developers use the Lanther control plane, which manages agents in AWS, GCP, Azure and on-prem over outbound-only tunnels. Agents connect applications, services and databases.">
            <Layer label="Developers">
              <div className="flex flex-wrap gap-1.5">
                {["CLI", "API", "Terraform", "Kubernetes CRDs", "Console"].map((t) => (
                  <span key={t} className="rounded-md border border-white/[0.09] bg-panel px-2 py-1 font-mono text-[11px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </Layer>

            <Connector label="API · SSO" />

            <div className="rounded-xl bg-gradient-to-br from-accent/60 via-white/10 to-violet/60 p-px">
              <div className="rounded-[11px] bg-elev p-4">
                <p className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-ink">Lanther control plane</span>
                  <span className="font-mono text-[10.5px] text-subtle">managed</span>
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {controlPlane.map(({ icon: Icon, label }) => (
                    <li key={label} className="rounded-lg border border-white/[0.08] bg-bg/60 p-3">
                      <Icon aria-hidden="true" className="h-4 w-4 text-accent" strokeWidth={1.6} />
                      <p className="mt-2 text-[12px] leading-snug text-muted">{label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Connector label="secure tunnels · outbound-only :443" accent />

            <Layer label="Lanther agents">
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {environments.map((e) => (
                  <li key={e.name} className="rounded-lg border border-white/[0.09] bg-panel p-3">
                    <p className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-ink">{e.name}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-label="agent connected" />
                    </p>
                    <p className="mt-1 font-mono text-[10.5px] text-subtle">{e.sub}</p>
                    <p className="mt-2.5 inline-block rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                      agent
                    </p>
                  </li>
                ))}
              </ul>
            </Layer>

            <Connector label="private addresses" />

            <Layer label="Your workloads">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {workloads.map((w) => (
                  <span key={w} className="rounded-lg border border-dashed border-white/[0.12] px-3 py-2.5 text-center text-[12px] text-muted">
                    {w}
                  </span>
                ))}
              </div>
            </Layer>
          </figure>
        </Reveal>

        <ul className="space-y-7">
          {specs.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.06} className="border-l border-white/10 pl-5">
              <h3 className="text-[15px] font-semibold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Layer({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      {children}
    </div>
  );
}

function Connector({ label, accent }: { label: string; accent?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex items-center gap-3 py-2 pl-6" aria-hidden="true">
      <div className={`relative h-10 w-px overflow-hidden ${accent ? "bg-accent/40" : "bg-white/15"}`}>
        {!reduced && (
          <m.span
            className={`absolute left-0 h-3 w-px ${accent ? "bg-accent" : "bg-white/70"}`}
            animate={{ top: ["-20%", "110%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
      <span className={`font-mono text-[10.5px] ${accent ? "text-accent" : "text-subtle"}`}>{label}</span>
    </div>
  );
}
