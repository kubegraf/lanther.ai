import { m } from "framer-motion";
import { Database, Globe, Lock, Server } from "lucide-react";
import { Reveal, Section, SectionHeader } from "../components/ui/Section";
import { fadeUp, stagger, viewport } from "../lib/motion";

type Cluster = { name: string; where: string; parts: string[] };

const clusters: Cluster[] = [
  { name: "EKS", where: "aws · eu-west-1", parts: ["ingress-nginx", "svc/payments", "svc/orders"] },
  { name: "GKE", where: "gcp · us-central1", parts: ["gateway/public", "svc/events", "svc/search"] },
  { name: "AKS", where: "azure · westeurope", parts: ["gateway/internal", "svc/reports", "svc/auth"] },
];

const beyond = [
  { icon: Database, label: "Managed databases", sub: "RDS · Cloud SQL · Azure SQL" },
  { icon: Globe, label: "External APIs", sub: "partners · SaaS · webhooks" },
  { icon: Lock, label: "Private networks", sub: "VPCs · VNets · peered ranges" },
  { icon: Server, label: "On-prem systems", sub: "data centres · legacy apps" },
];

const notes = [
  { title: "Service to service, across clusters", body: "A service in EKS reaches a service in GKE by name. No shared flat network and no public load balancer in between." },
  { title: "Out of the cluster, safely", body: "Pods reach databases and on-prem systems through identity-checked tunnels instead of wide egress rules." },
  { title: "Fits what you run", body: "Works beside your ingress controller, Gateway API, CNI and service mesh. It does not replace them." },
];

export function Kubernetes() {
  return (
    <Section id="kubernetes" labelledBy="k8s-title" className="border-t border-white/[0.06]">
      <SectionHeader
        id="k8s-title"
        eyebrow="Kubernetes"
        title="Built for Kubernetes. Designed for everything around it."
        lead="Kubernetes solves networking inside one cluster. Most outages happen at the edges: between clusters, and between a cluster and everything it depends on."
      />

      <Reveal className="mt-14">
        <div className="panel relative p-4 sm:p-6">
          <m.ul variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={viewport} className="grid gap-3 md:grid-cols-3">
            {clusters.map((cl) => (
              <m.li key={cl.name} variants={fadeUp} className="rounded-xl border border-white/[0.09] bg-bg/60 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-semibold text-ink">{cl.name}</span>
                  <span className="font-mono text-[10.5px] text-subtle">{cl.where}</span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {cl.parts.map((p) => (
                    <li key={p} className="rounded-md border border-white/[0.08] bg-panel px-2 py-1 font-mono text-[11px] text-muted">
                      {p}
                    </li>
                  ))}
                </ul>
              </m.li>
            ))}
          </m.ul>

          {/* the layer between the clusters and everything else */}
          <div className="relative my-5 flex items-center justify-center">
            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px overflow-hidden">
              <m.div
                className="h-px w-1/4 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="relative rounded-full border border-accent/40 bg-elev px-3 py-1 font-mono text-[11px] text-accent">
              Lanther connectivity layer
            </span>
          </div>

          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {beyond.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="rounded-xl border border-dashed border-white/[0.12] p-4">
                <Icon aria-hidden="true" className="h-4 w-4 text-subtle" strokeWidth={1.6} />
                <p className="mt-3 text-[13px] font-medium text-ink">{label}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-subtle">{sub}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {notes.map((n, i) => (
          <Reveal key={n.title} delay={i * 0.08}>
            <h3 className="text-[15px] font-semibold text-ink">{n.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{n.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
