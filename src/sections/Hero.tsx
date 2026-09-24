import { m } from "framer-motion";
import { Button } from "../components/ui/Button";
import { HeroTopology } from "../components/visuals/HeroTopology";
import { links } from "../lib/site";
import { ease, fadeUp, stagger } from "../lib/motion";

const platforms = ["AWS", "GCP", "Azure", "Kubernetes", "Private Networks"];

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-20 pt-[calc(var(--nav-h)+48px)] sm:pb-28 sm:pt-[calc(var(--nav-h)+80px)]"
    >
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-260px] h-[620px] w-[1200px] max-w-[200vw] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(110 139 255 / 0.22), rgb(155 123 255 / 0.08) 55%, transparent)" }}
      />

      <div className="container-site relative">
        <m.div variants={stagger(0.09)} initial="hidden" animate="show" className="mx-auto max-w-5xl text-center">
          <m.a
            variants={fadeUp}
            href="#ai-operator"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 text-[13px] text-muted transition-colors hover:border-white/20 hover:text-ink"
          >
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[11px] font-medium text-accent">New</span>
            Introducing the Lanther AI operator
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </m.a>

          <m.h1
            variants={fadeUp}
            id="hero-title"
            className="mt-7 text-balance text-[40px] font-semibold leading-[1.03] tracking-tightest text-ink sm:text-[60px] lg:text-[76px]"
          >
            Connect your infrastructure.
            <br className="hidden sm:block" /> <span className="text-gradient">Let AI operate the network.</span>
          </m.h1>

          <m.p variants={fadeUp} className="mx-auto mt-7 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted sm:text-[19px]">
            Lanther is an AI-native connectivity platform. It connects services across Kubernetes, clouds, private networks
            and on-prem infrastructure, then understands and troubleshoots the network underneath.
          </m.p>

          <m.div variants={fadeUp} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={links.getStarted} size="lg" arrow>
              Get started
            </Button>
            <Button href="#platform" size="lg" variant="secondary">
              Explore the platform
            </Button>
          </m.div>

          <m.ul
            variants={fadeUp}
            aria-label="Works across"
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[12px] text-subtle"
          >
            {platforms.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent/60" />
                {p}
              </li>
            ))}
          </m.ul>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.35 }}
          className="mx-auto mt-16 max-w-[1120px] sm:mt-20"
        >
          <HeroTopology />
        </m.div>
      </div>
    </section>
  );
}
