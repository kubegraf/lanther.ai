import { useRef } from "react";
import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { Section, SectionHeader } from "../components/ui/Section";
import { fadeUp, stagger, viewport } from "../lib/motion";

type Step = { verb: string; title: string; body: string; detail: string };

const steps: Step[] = [
  {
    verb: "Connect",
    title: "Deploy Lanther",
    body: "Install the agent with one Helm chart or one binary. It makes an outbound connection to the control plane and nothing else.",
    detail: "helm install lanther-agent",
  },
  {
    verb: "Observe",
    title: "Connect your infrastructure",
    body: "Add clusters, VPCs and private networks. Lanther discovers the services, routes and policies already there.",
    detail: "3 environments · 214 services",
  },
  {
    verb: "Understand",
    title: "Lanther builds a live model",
    body: "Every route, rule and dependency becomes one graph that updates as your infrastructure changes.",
    detail: "graph updated 2s ago",
  },
  {
    verb: "Automate",
    title: "AI detects and resolves issues",
    body: "Failures are traced to a root cause. Fixes are proposed, or applied within the limits you set.",
    detail: "policy: propose-only",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="how-it-works" labelledBy="how-title" className="border-t border-white/[0.06]">
      <SectionHeader
        id="how-title"
        eyebrow="How it works"
        title="Connect → Observe → Understand → Automate"
        lead="Four steps from install to an operator that watches the network for you. You choose how far along that line Lanther is allowed to act."
      />

      <m.ol
        ref={ref}
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="relative mt-16 grid gap-10 pl-8 lg:grid-cols-4 lg:gap-6 lg:pl-0 lg:pt-10"
      >
        {/* progress rail: vertical on small screens, horizontal on large */}
        <div aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10 lg:hidden">
          <m.div style={{ height }} className="w-px bg-gradient-to-b from-accent to-violet" />
        </div>
        <div aria-hidden="true" className="absolute left-0 right-0 top-[5px] hidden h-px bg-white/10 lg:block">
          <m.div style={{ width }} className="h-px bg-gradient-to-r from-accent to-violet" />
        </div>

        {steps.map((s, i) => (
          <m.li key={s.verb} variants={fadeUp} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-8 top-1 h-[11px] w-[11px] rounded-full border border-accent/70 bg-bg lg:-top-[45px] lg:left-0"
            />
            <p className="font-mono text-[12px] text-accent">
              0{i + 1} · {s.verb}
            </p>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
            <p className="mt-4 inline-block rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 font-mono text-[11px] text-subtle">
              {s.detail}
            </p>
          </m.li>
        ))}
      </m.ol>
    </Section>
  );
}
