import { Section, SectionHeader, Reveal } from "../components/ui/Section";
import { IncidentConsole } from "../components/visuals/IncidentConsole";

const points = [
  {
    title: "Traces, not guesses",
    body: "It walks the real path a packet takes: DNS, policy, security groups, route tables, gateways. Each check is shown with its evidence.",
  },
  {
    title: "Acts inside your limits",
    body: "Remediation is off until you turn it on. Policies decide what it may change, where, and whether a human approves first.",
  },
  {
    title: "Proves the fix",
    body: "Every change is followed by a live connectivity test. If recovery is not verified, the change is rolled back.",
  },
];

export function AIOperator() {
  return (
    <Section id="ai-operator" labelledBy="ai-title" className="overflow-hidden border-t border-white/[0.06]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 h-[480px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(155 123 255 / 0.18), transparent)" }}
      />
      <div className="relative">
        <SectionHeader
          id="ai-title"
          eyebrow="AI operator"
          title="Your network gets an AI operator."
          lead="When a connection breaks, Lanther does what your best network engineer would do. It traces the path, finds the layer that failed, fixes it safely and checks that it worked."
        />
        <Reveal className="mt-14">
          <IncidentConsole />
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <h3 className="text-[15px] font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
