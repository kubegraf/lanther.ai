import type { ComponentType } from "react";
import { m } from "framer-motion";
import { Section, SectionHeader } from "../components/ui/Section";
import {
  ObservabilityVisual,
  RemediationVisual,
  RoutingVisual,
  TroubleshootVisual,
  TunnelVisual,
  ZeroTrustVisual,
} from "../components/visuals/CapabilityVisuals";
import { fadeUp, stagger, viewport } from "../lib/motion";

type Capability = {
  title: string;
  body: string;
  Visual: ComponentType;
};

const capabilities: Capability[] = [
  {
    title: "Secure tunnels",
    body: "Private, encrypted connectivity between services and environments. Agents dial out, so nothing needs an open inbound port.",
    Visual: TunnelVisual,
  },
  {
    title: "Intelligent routing",
    body: "Route traffic between clouds, clusters and services. Weight it, fail it over and move it without touching DNS.",
    Visual: RoutingVisual,
  },
  {
    title: "Zero-trust access",
    body: "Identity-aware access to internal services. Every connection is checked against who is asking, not which network they are on.",
    Visual: ZeroTrustVisual,
  },
  {
    title: "AI troubleshooting",
    body: "When a connection fails, Lanther walks every layer between the two ends and tells you which one broke, and why.",
    Visual: TroubleshootVisual,
  },
  {
    title: "Automated remediation",
    body: "When you enable it, Lanther applies the fix itself. Every change is scoped by policy, verified after and reversible.",
    Visual: RemediationVisual,
  },
  {
    title: "Network observability",
    body: "Traffic, latency, failures, routes and dependencies for every connection, in one model rather than six dashboards.",
    Visual: ObservabilityVisual,
  },
];

export function Capabilities() {
  return (
    <Section id="platform" labelledBy="platform-title">
      <SectionHeader
        id="platform-title"
        eyebrow="Platform"
        title="One connectivity layer. Six things it does well."
        lead="Lanther replaces the VPNs, bastions, allowlists and runbooks between your environments with one layer that connects, secures and explains itself."
      />
      <m.ul
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {capabilities.map(({ title, body, Visual }) => (
          <m.li
            key={title}
            variants={fadeUp}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-elev/70 transition-colors duration-300 hover:border-white/[0.16]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex h-[168px] items-center border-b border-white/[0.06] bg-bg/40 px-5 py-5">
              <div className="w-full">
                <Visual />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-[17px] font-semibold tracking-tight text-ink">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
            </div>
          </m.li>
        ))}
      </m.ul>
    </Section>
  );
}
