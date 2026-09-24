import { ArrowUpRight, BookOpen, Users } from "lucide-react";
import { Reveal, Section, SectionHeader } from "../components/ui/Section";
import { GitHubIcon } from "../components/ui/BrandIcons";
import { links } from "../lib/site";

/*
 * No customer names, logos, counts or quotes are shown until they are real and
 * we have permission. The slots are deliberately visible as empty.
 */
const PARTNER_SLOTS = 5;

const integrations = [
  "Kubernetes",
  "Helm",
  "Terraform",
  "AWS",
  "Google Cloud",
  "Azure",
  "Prometheus",
  "OpenTelemetry",
  "Grafana",
  "Slack",
  "PagerDuty",
  "GitHub Actions",
];

type Resource = { icon: React.ReactNode; title: string; body: string; href?: string; cta: string };

const resources: Resource[] = [
  {
    icon: <GitHubIcon className="h-5 w-5" />,
    title: "GitHub",
    body: "Follow development, open issues and read the source of this site.",
    href: links.github,
    cta: "kubegraf/lanther.ai",
  },
  {
    icon: <BookOpen className="h-5 w-5" strokeWidth={1.6} />,
    title: "Documentation",
    body: "Guides, API reference and architecture notes are being written alongside the product.",
    cta: "Coming soon",
  },
  {
    icon: <Users className="h-5 w-5" strokeWidth={1.6} />,
    title: "Community",
    body: "A place for platform and network engineers to share patterns and ask questions.",
    cta: "Coming soon",
  },
];

export function Ecosystem() {
  return (
    <Section id="ecosystem" labelledBy="eco-title" className="border-t border-white/[0.06]">
      <SectionHeader
        id="eco-title"
        eyebrow="Ecosystem"
        title="Built in the open, with the teams who run it."
        lead="Lanther is early. We would rather show you empty slots than logos we have not earned."
      />

      <Reveal className="mt-14">
        <div className="panel p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Design partners</p>
            <a href={links.contact} className="text-[13px] text-accent hover:text-ink">
              Become a design partner →
            </a>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: PARTNER_SLOTS }, (_, i) => (
              <li
                key={i}
                className={`flex h-16 items-center justify-center rounded-lg border border-dashed border-white/[0.12] font-mono text-[11px] text-subtle/80 ${i === PARTNER_SLOTS - 1 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                Reserved
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-subtle">Logos appear here only with the partner's written permission.</p>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {resources.map((r, i) => {
          const inner = (
            <>
              <span className="flex items-center justify-between text-muted">
                {r.icon}
                {r.href && <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
              </span>
              <h3 className="mt-5 text-[15px] font-semibold text-ink">{r.title}</h3>
              <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-muted">{r.body}</p>
              <p className={`mt-4 font-mono text-[11px] ${r.href ? "text-accent" : "text-subtle"}`}>{r.cta}</p>
            </>
          );
          const cls = "group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-elev/60 p-6 transition-colors";
          return (
            <Reveal key={r.title} delay={i * 0.06}>
              {r.href ? (
                <a href={r.href} target="_blank" rel="noreferrer" className={`${cls} hover:border-white/[0.18]`}>
                  {inner}
                </a>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-6">
        <div className="rounded-2xl border border-white/[0.08] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-ink">Designed to fit your stack</h3>
            <p className="font-mono text-[11px] text-subtle">planned integrations</p>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {integrations.map((n) => (
              <li key={n} className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-[13px] text-muted">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
