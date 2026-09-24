import { Braces, FileCode2, Terminal as TerminalIcon } from "lucide-react";
import { Reveal, Section, SectionHeader } from "../components/ui/Section";
import { CodePanel } from "../components/visuals/CodePanel";

const surfaces = [
  { icon: TerminalIcon, title: "CLI", body: "Open a connection to any private service from your laptop, with the same identity checks as production." },
  { icon: FileCode2, title: "Kubernetes CRDs", body: "Declare connections and policies next to the workloads that need them. GitOps friendly." },
  { icon: Braces, title: "API and Terraform", body: "Everything in the console is an API call first, so your platform can drive it." },
];

export function Developers() {
  return (
    <Section id="developers" labelledBy="dev-title" className="border-t border-white/[0.06]">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <div>
          <SectionHeader
            id="dev-title"
            eyebrow="Developers"
            title="One command to reach anything."
            lead="No VPN client, no bastion, no ticket to open a port. Lanther checks who you are, builds the route and tells you when it works."
          />
          <ul className="mt-10 space-y-6">
            {surfaces.map(({ icon: Icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={i * 0.06} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Icon aria-hidden="true" className="h-4 w-4 text-accent" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal className="lg:pt-10">
          <CodePanel />
        </Reveal>
      </div>
    </Section>
  );
}
