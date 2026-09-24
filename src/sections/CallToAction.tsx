import { Button } from "../components/ui/Button";
import { Reveal, Section } from "../components/ui/Section";
import { LogoMark } from "../components/ui/Logo";
import { links } from "../lib/site";

export function PricingCTA() {
  return (
    <Section id="pricing" labelledBy="pricing-title" className="border-t border-white/[0.06]">
      <Reveal>
        <div className="grid items-center gap-8 rounded-2xl border border-white/[0.08] bg-elev/60 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2 id="pricing-title" className="mt-3 text-balance text-[28px] font-semibold leading-tight tracking-tightest text-ink sm:text-[36px]">
              Start building your connectivity layer
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Pricing is not public yet. Tell us what you are connecting and we will set you up with early access.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={links.getStarted} size="lg" arrow>
              Get started
            </Button>
            <Button href={links.talkToTeam} size="lg" variant="secondary">
              Talk to the team
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function FinalCTA() {
  return (
    <section id="get-started" aria-labelledby="final-title" className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000_20%,transparent_70%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(110 139 255 / 0.2), rgb(155 123 255 / 0.08) 60%, transparent)" }}
      />
      <div className="container-site relative text-center">
        <Reveal>
          <LogoMark size={44} className="mx-auto" />
          <h2 id="final-title" className="mx-auto mt-8 max-w-3xl text-balance text-[36px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[52px] lg:text-[60px]">
            Your infrastructure should connect itself.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[17px] leading-relaxed text-muted sm:text-lg">
            Deploy Lanther and give your infrastructure an intelligent connectivity layer.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={links.contact} size="lg" arrow>
              Get started with Lanther
            </Button>
            <Button href={links.talkToTeam} size="lg" variant="ghost">
              Talk to the team
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
