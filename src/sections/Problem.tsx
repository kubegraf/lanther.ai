import { Boxes, Cloud, Database, Network, Server, Workflow } from "lucide-react";
import { Reveal, Section, SectionHeader } from "../components/ui/Section";
import { ComplexityMap } from "../components/visuals/ComplexityMap";

const spans = [
  { icon: Cloud, label: "Multiple clouds" },
  { icon: Boxes, label: "Kubernetes clusters" },
  { icon: Network, label: "Private services" },
  { icon: Database, label: "Databases" },
  { icon: Workflow, label: "Internal APIs" },
  { icon: Server, label: "On-prem systems" },
];

export function Problem() {
  return (
    <Section id="problem" labelledBy="problem-title" className="border-t border-white/[0.06]">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeader
            id="problem-title"
            eyebrow="The problem"
            title={
              <>
                Infrastructure was built for connectivity.{" "}
                <span className="text-muted">Not for complexity.</span>
              </>
            }
            lead="A single request can cross three networks and two clouds before it reaches a database. Every hop was wired by hand, by a different team, with a different tool."
          />
          <Reveal>
            <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {spans.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-[13px] text-muted">
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-subtle" strokeWidth={1.6} />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <p className="mt-8 border-l-2 border-accent/60 pl-4 text-lg font-medium leading-snug text-ink">
              Lanther gives your infrastructure a connectivity layer that can understand itself.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <ComplexityMap />
        </Reveal>
      </div>
    </Section>
  );
}
