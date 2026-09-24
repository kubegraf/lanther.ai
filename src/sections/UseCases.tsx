import type { LucideIcon } from "lucide-react";
import { Boxes, Building2, Cloud, KeyRound, LifeBuoy, Layers } from "lucide-react";
import { m } from "framer-motion";
import { Section, SectionHeader } from "../components/ui/Section";
import { fadeUp, stagger, viewport } from "../lib/motion";

type UseCase = { icon: LucideIcon; title: string; body: string; replaces: string };

const useCases: UseCase[] = [
  {
    icon: Cloud,
    title: "Multi-cloud connectivity",
    body: "Connect services in AWS, GCP and Azure as if they shared one private network, without merging the networks.",
    replaces: "site-to-site VPNs · peering meshes",
  },
  {
    icon: Boxes,
    title: "Kubernetes networking",
    body: "Service-to-service traffic between clusters, and from clusters to the databases and APIs they depend on.",
    replaces: "public load balancers · wide egress rules",
  },
  {
    icon: KeyRound,
    title: "Private service access",
    body: "Give engineers and CI jobs access to internal services by identity, with every session recorded.",
    replaces: "bastion hosts · shared VPN accounts",
  },
  {
    icon: Building2,
    title: "Hybrid infrastructure",
    body: "Bring on-prem systems into the same connectivity model as the cloud, with no inbound firewall changes.",
    replaces: "IP allowlists · MPLS change requests",
  },
  {
    icon: LifeBuoy,
    title: "Production troubleshooting",
    body: "When something cannot reach something else, get the failing layer and the evidence in seconds, not a bridge call.",
    replaces: "traceroute · five dashboards · guesswork",
  },
  {
    icon: Layers,
    title: "Internal platform engineering",
    body: "Offer connectivity as a self-service product to your teams, with guardrails your security team signs off once.",
    replaces: "network tickets · hand-written runbooks",
  },
];

export function UseCases() {
  return (
    <Section id="use-cases" labelledBy="uc-title" className="border-t border-white/[0.06]">
      <SectionHeader
        id="uc-title"
        eyebrow="Solutions"
        title="Where teams use Lanther."
        lead="Different starting points, same problem underneath: services that need to reach each other across boundaries nobody designed together."
      />
      <m.ul
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3"
      >
        {useCases.map(({ icon: Icon, title, body, replaces }) => (
          <m.li key={title} variants={fadeUp} className="group flex flex-col bg-bg p-6 transition-colors duration-300 hover:bg-elev sm:p-7">
            <Icon aria-hidden="true" className="h-5 w-5 text-accent" strokeWidth={1.6} />
            <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-ink">{title}</h3>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{body}</p>
            <p className="mt-5 font-mono text-[11px] text-subtle">
              <span className="text-subtle/70">replaces </span>
              {replaces}
            </p>
          </m.li>
        ))}
      </m.ul>
    </Section>
  );
}
