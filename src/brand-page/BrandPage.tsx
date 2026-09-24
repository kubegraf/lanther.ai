import type { ReactNode } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { LogoMark, Wordmark, Logo } from "../components/ui/Logo";
import { Reveal } from "../components/ui/Section";
import { BRAND_COLORS, CONCEPTS, SYMBOL, SYMBOL_SMALL } from "../brand/marks";
import { Contexts } from "./Contexts";

const BASE = import.meta.env.BASE_URL;
const file = (name: string) => `${BASE}brand/logo/${name}`;
const INK = BRAND_COLORS.ink;

export default function BrandPage() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-bg/80 backdrop-blur-xl">
          <div className="container-site flex h-16 items-center justify-between">
            <a href={BASE} className="flex items-center gap-3 rounded-md">
              <Logo size={24} />
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-subtle sm:inline">Identity</span>
            </a>
            <a href={BASE} className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to site
            </a>
          </div>
        </header>
        <main>
          <Intro />
          <Idea />
          <Exploration />
          <Finalists />
          <RecognitionTest />
          <Construction />
          <WordmarkSection />
          <Lockups />
          <Colour />
          <Versions />
          <Usage />
          <Contexts />
          <Downloads />
        </main>
        <footer className="border-t border-white/[0.06] py-10">
          <div className="container-site flex flex-col justify-between gap-3 text-[13px] text-subtle sm:flex-row">
            <p>Lanther identity. Every file on this page is generated from one geometry in scripts/brand/.</p>
            <p className="font-mono text-[11px]">lanther.ai</p>
          </div>
        </footer>
      </MotionConfig>
    </LazyMotion>
  );
}

/* ------------------------------------------------------------------ layout */

function Block({ id, eyebrow, title, lead, children }: { id: string; eyebrow: string; title: ReactNode; lead?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="border-t border-white/[0.06] py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-t`} className="mt-4 text-balance text-[30px] font-semibold leading-[1.1] tracking-tightest sm:text-[40px]">
            {title}
          </h2>
          {lead && <p className="mt-4 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted">{lead}</p>}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function Tile({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark" | "black" | "white" | "paper"; className?: string }) {
  const bg = {
    light: "bg-[#F4F5F7]",
    paper: "bg-[#F4F5F7]",
    white: "bg-white",
    dark: "bg-[#0B0D12] border border-white/[0.08]",
    black: "bg-black border border-white/[0.08]",
  }[tone];
  return <div className={`flex items-center justify-center rounded-2xl ${bg} ${className ?? ""}`}>{children}</div>;
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-3 font-mono text-[11px] text-subtle">{children}</p>;
}

/* ------------------------------------------------------------------ sections */

function Intro() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Reveal>
          <p className="eyebrow">Brand identity</p>
          <h1 className="mt-5 text-balance text-[40px] font-semibold leading-[1.03] tracking-tightest sm:text-[56px]">
            A tile with one passage cut through it.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-muted sm:text-lg">
            The Lanther symbol is a solid block of infrastructure with a single route carved through it. The route
            enters through one face, turns, and leaves through another. What is left is an L, a block, and the layer
            between them.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Tile tone="dark" className="aspect-square p-[18%]">
            <LogoMark size={320} tone="color-dark" className="h-auto w-full" />
          </Tile>
        </Reveal>
      </div>
    </section>
  );
}

function Idea() {
  const steps = [
    { n: "01", title: "Infrastructure", body: "Start from something solid. A tile, the way servers, clusters and networks are solid and separate." },
    { n: "02", title: "Connection", body: "Cut one continuous route through it, from one face to another. The cut leaves an L behind." },
    { n: "03", title: "Movement", body: "Taper the route. Wide at the mouth, narrower at the exit, so it reads as a tunnel receding: depth and direction." },
  ];
  return (
    <Block id="idea" eyebrow="The idea" title="Connection, then movement, then intelligence." lead="The mark is built in three moves. Each one is visible in the final drawing and nothing else is added.">
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <Tile tone="light" className="aspect-[4/3] p-10">
              <IdeaStep step={i} />
            </Tile>
            <p className="mt-5 font-mono text-[12px] text-accent">{s.n}</p>
            <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </Block>
  );
}

/** The three construction moves, drawn from the real geometry. */
function IdeaStep({ step }: { step: number }) {
  // Step 2 uses an untapered channel so the taper in step 3 is visible as a change.
  const straight = "M22.5 -2V17.5A11 11 0 0 0 33.5 28.5H50V35.5H33.5A18 18 0 0 1 15.5 17.5V-2Z";
  return (
    <svg viewBox="-2 -2 52 52" className="h-full w-auto" aria-hidden="true">
      <defs>
        <clipPath id={`tile-${step}`}>
          <rect width="48" height="48" rx="11.5" />
        </clipPath>
      </defs>
      {step === 0 && <rect width="48" height="48" rx="11.5" fill={INK} />}
      {step === 1 && (
        <g clipPath={`url(#tile-${step})`}>
          <rect width="48" height="48" fill={INK} />
          <path d={straight} fill="#F4F5F7" />
        </g>
      )}
      {step === 2 && <path d={SYMBOL.body} fill={INK} />}
    </svg>
  );
}

function Exploration() {
  return (
    <Block
      id="exploration"
      eyebrow="Exploration"
      title="Eleven directions, one survivor."
      lead="Each concept was drawn at display size and checked at 16px. Most failed one of two tests: it looked like a diagram, or it stopped being recognisable when small."
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CONCEPTS.map((c, i) => {
          const chosen = c.verdict === "Selected.";
          const finalist = c.verdict === "Finalist.";
          return (
            <Reveal as="li" key={c.file} delay={(i % 4) * 0.04}>
              <div className={`rounded-2xl bg-[#F4F5F7] p-5 ${chosen ? "ring-2 ring-accent" : ""}`}>
                <img src={`${BASE}brand/concepts/${c.file}`} alt={`${c.name} concept`} className="mx-auto h-24 w-24 sm:h-28 sm:w-28" loading="lazy" />
                <div className="mt-4 flex items-center gap-2">
                  <img src={`${BASE}brand/concepts/${c.file}`} alt="" className="h-4 w-4" loading="lazy" />
                  <img src={`${BASE}brand/concepts/${c.file}`} alt="" className="h-6 w-6" loading="lazy" />
                  <span className="ml-auto font-mono text-[10px] text-[#6B7280]">16 · 24</span>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[14px] font-semibold">
                {String(i + 1).padStart(2, "0")} {c.name}
                {(chosen || finalist) && (
                  <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${chosen ? "bg-accent/15 text-accent" : "bg-white/10 text-muted"}`}>
                    {chosen ? "selected" : "finalist"}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{c.idea}</p>
              {!chosen && !finalist && <p className="mt-1 text-[12px] text-subtle">{c.verdict}</p>}
            </Reveal>
          );
        })}
      </ul>
    </Block>
  );
}

function Finalists() {
  const items = [
    {
      name: "Junction",
      file: "02-junction.svg",
      logic:
        "A tile split by a right-angled channel into an L and a block. The channel is the layer between two pieces of infrastructure, which is exactly Lanther's position.",
      strength: "The most architectural and exact of the three. Excellent at 16px.",
      weakness: "Static. The channel is the same width everywhere, so nothing moves. It could belong to a storage or a design tool company.",
    },
    {
      name: "Portal",
      file: "03-portal.svg",
      logic: "A quarter-arc passage sweeps from the top face to the side. The curve carries movement, the taper makes it a portal seen at an angle.",
      strength: "The most dynamic silhouette, and the most unusual.",
      weakness: "The L is gone. Without the letter it reads as a clock face or an eclipse, and loses the link to the name.",
    },
    {
      name: "Passage",
      file: "11-passage.svg",
      logic:
        "The Junction's L and block, with the Portal's movement. The route bends on a curve and tapers from mouth to exit, so it reads as a tunnel receding into the tile.",
      strength: "Keeps the letter, the route and the motion in one cut. Nothing is added to the tile, only removed.",
      weakness: "The taper is subtle below 24px, so small sizes use a dedicated cut with a wider exit.",
      chosen: true,
    },
  ];
  return (
    <Block id="finalists" eyebrow="Three finalists" title="Junction, Portal and Passage." lead="All three share one principle: the symbol is made by removing material, never by adding lines or dots. That is what keeps them from looking like network diagrams.">
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.name} delay={i * 0.06}>
            <article className={`flex h-full flex-col rounded-2xl border p-6 ${it.chosen ? "border-accent/50 bg-accent/[0.04]" : "border-white/[0.08] bg-elev/60"}`}>
              <div className="flex gap-3">
                <Tile tone="light" className="aspect-square flex-1 p-8">
                  <img src={`${BASE}brand/concepts/${it.file}`} alt={`${it.name}`} className="h-full w-full" />
                </Tile>
                <Tile tone="dark" className="aspect-square w-1/3 self-end p-3">
                  <img src={`${BASE}brand/concepts/${it.file}`} alt="" className="h-6 w-6 invert" />
                </Tile>
              </div>
              <h3 className="mt-6 flex items-center gap-2 text-xl font-semibold">
                {it.name}
                {it.chosen && <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] text-accent">selected</span>}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{it.logic}</p>
              <dl className="mt-5 space-y-3 border-t border-white/[0.07] pt-5 text-[14px]">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-ok">Works</dt>
                  <dd className="mt-1 text-muted">{it.strength}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-warn">Costs</dt>
                  <dd className="mt-1 text-muted">{it.weakness}</dd>
                </div>
              </dl>
            </article>
          </Reveal>
        ))}
      </div>
    </Block>
  );
}

function RecognitionTest() {
  return (
    <section aria-label="Recognition test" className="border-t border-white/[0.06] bg-black py-24 sm:py-32">
      <div className="container-site text-center">
        <Reveal>
          <LogoMark size={200} className="mx-auto h-auto w-40 sm:w-52" />
          <p className="mx-auto mt-12 max-w-xl text-pretty text-[17px] leading-relaxed text-muted">
            Remove the word. The symbol still has one silhouette nobody else owns: a tile with a bent, tapering passage,
            open on two faces.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Construction() {
  const grid = Array.from({ length: 13 }, (_, i) => i * 4);
  const dims = [
    ["Grid", "48 units"],
    ["Tile corner", "11.5, softened"],
    ["Stem", "13.5"],
    ["Mouth", "9.0"],
    ["Exit", "4.5 (small cut 6.5)"],
    ["Inner bend", "r 11"],
  ];
  return (
    <Block id="construction" eyebrow="Construction" title="Drawn on a 48-unit grid." lead="The passage is two concentric-looking arcs of different radii, which is what makes it taper without any slanted lines. Below 32px a second cut with a wider exit takes over.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Reveal>
          <Tile tone="light" className="aspect-square p-[8%]">
            <svg viewBox="-4 -4 56 56" className="h-full w-full" role="img" aria-label="The symbol on its construction grid">
              {grid.map((g) => (
                <g key={g}>
                  <line x1={g} y1={-4} x2={g} y2={52} stroke="#C9CDD6" strokeWidth={0.12} />
                  <line x1={-4} y1={g} x2={52} y2={g} stroke="#C9CDD6" strokeWidth={0.12} />
                </g>
              ))}
              <path d={SYMBOL.body} fill={INK} fillOpacity={0.92} />
              <path d={SYMBOL.passage} fill={BRAND_COLORS.blue} fillOpacity={0.18} stroke={BRAND_COLORS.blue} strokeWidth={0.2} />
              <circle cx={33.5} cy={17.5} r={11} fill="none" stroke={BRAND_COLORS.violet} strokeWidth={0.2} strokeDasharray="0.8 0.8" />
              <circle cx={33.5} cy={13} r={20} fill="none" stroke={BRAND_COLORS.blue} strokeWidth={0.2} strokeDasharray="0.8 0.8" />
              <g fontFamily="JetBrains Mono Variable, monospace" fontSize={1.8} fill={BRAND_COLORS.blue}>
                <text x={13.5} y={-1.2}>mouth 9</text>
                <text x={36} y={37.4}>exit 4.5</text>
                <text x={0.5} y={51}>stem 13.5</text>
              </g>
            </svg>
          </Tile>
        </Reveal>
        <div className="flex flex-col gap-6">
          <Reveal>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]">
              {dims.map(([k, v]) => (
                <div key={k} className="bg-bg p-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-subtle">{k}</dt>
                  <dd className="mt-1 text-[15px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal>
            <div className="rounded-2xl border border-white/[0.08] p-5">
              <p className="text-[15px] font-semibold">Two cuts</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">Display cut from 48px. Small cut at 32px and below, where a 4.5-unit exit would close up.</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {[
                  { g: SYMBOL, label: "display" },
                  { g: SYMBOL_SMALL, label: "small" },
                ].map(({ g, label }) => (
                  <div key={label}>
                    <div className="flex items-end gap-3 rounded-xl bg-[#F4F5F7] p-4">
                      {[16, 24, 32].map((s) => (
                        <svg key={s} width={s} height={s} viewBox="0 0 48 48" aria-hidden="true">
                          <path d={g.body} fill={INK} />
                        </svg>
                      ))}
                    </div>
                    <div className="mt-2 flex items-end gap-3 rounded-xl bg-[#0B0D12] p-4">
                      {[16, 24, 32].map((s) => (
                        <svg key={s} width={s} height={s} viewBox="0 0 48 48" aria-hidden="true">
                          <path d={g.body} fill="#fff" />
                        </svg>
                      ))}
                    </div>
                    <Caption>{label} cut · 16 · 24 · 32px</Caption>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Block>
  );
}

function WordmarkSection() {
  const details = [
    { t: "L", d: "The inside corner carries the same curve as the symbol's bend. The one letter that repeats the mark." },
    { t: "A", d: "Flat apex and a low crossbar, so the counter reads as an opening rather than a closed triangle." },
    { t: "T H E", d: "Horizontals are drawn 10% thinner than verticals, so they look equal. Middle arm of the E is shorter." },
    { t: "All", d: "Outside corners are sharp. Inside corners get a small fillet, a quiet echo of the passage." },
  ];
  return (
    <Block id="wordmark" eyebrow="Wordmark" title="Drawn, not typed." lead="LANTHER is drawn letter by letter as geometric capitals. It is not set in a font, and it will not match any font exactly. Use the files, never retype it.">
      <Reveal>
        <Tile tone="light" className="px-6 py-16 sm:py-24">
          <Wordmark height={96} color={INK} className="h-auto w-full max-w-3xl" />
        </Tile>
      </Reveal>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {details.map((d, i) => (
          <Reveal key={d.t} delay={i * 0.05}>
            <p className="font-mono text-[13px] text-accent">{d.t}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{d.d}</p>
          </Reveal>
        ))}
      </div>
    </Block>
  );
}

function Lockups() {
  return (
    <Block id="lockups" eyebrow="Lockups" title="Four arrangements. Use them as they are." lead="The symbol is about 1.65 times the cap height of the wordmark in the horizontal lockup. The gap is one third of the symbol.">
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <Tile tone="light" className="aspect-[16/9] p-10">
            <img src={file("lockup-horizontal.svg")} alt="Lanther horizontal lockup" className="h-auto w-4/5" />
          </Tile>
          <Caption>Horizontal · primary</Caption>
        </Reveal>
        <Reveal delay={0.05}>
          <Tile tone="light" className="aspect-[16/9] p-10">
            <img src={file("lockup-stacked.svg")} alt="Lanther stacked lockup" className="h-3/5 w-auto" />
          </Tile>
          <Caption>Stacked · square spaces, signage</Caption>
        </Reveal>
        <Reveal>
          <Tile tone="light" className="aspect-[16/9] p-10">
            <img src={file("symbol.svg")} alt="Lanther symbol" className="h-2/5 w-auto" />
          </Tile>
          <Caption>Symbol only · favicons, avatars, small spaces</Caption>
        </Reveal>
        <Reveal delay={0.05}>
          <Tile tone="light" className="aspect-[16/9] flex-col gap-6 p-10">
            <img src={file("lockup-horizontal.svg")} alt="Lanther with descriptor" className="h-auto w-3/5" />
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#4B5160]">AI-native infrastructure</p>
          </Tile>
          <Caption>With descriptor · optional, only where the product needs explaining</Caption>
        </Reveal>
      </div>
    </Block>
  );
}

function Colour() {
  const swatches = [
    { name: "Graphite", hex: "#0B0D12", use: "Primary. The mark, text and dark surfaces.", cls: "bg-[#0B0D12] border border-white/10" },
    { name: "Paper", hex: "#F4F5F7", use: "Light surfaces behind the mark.", cls: "bg-[#F4F5F7]" },
    { name: "Signal Blue", hex: "#3D6BFF", use: "Accent. Links, focus, the mouth of the passage.", cls: "bg-[#3D6BFF]" },
    { name: "Route Violet", hex: "#8A5CFF", use: "Only as the far end of the passage gradient.", cls: "bg-[#8A5CFF]" },
    { name: "Signal Blue, on dark", hex: "#6E8BFF", use: "The accent on dark UI. 6.3:1 on the site background.", cls: "bg-[#6E8BFF]" },
  ];
  return (
    <Block id="colour" eyebrow="Colour" title="Graphite first. Colour lives in the passage." lead="The identity is black and white. The blue to violet gradient appears in one place only, inside the passage, where it reads as light travelling through the tunnel. It never fills the tile and never sits on the wordmark.">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Reveal>
          <div className="grid grid-cols-2 gap-4">
            <Tile tone="light" className="aspect-square p-[22%]">
              <img src={file("symbol-color.svg")} alt="Colour symbol on light" className="h-full w-full" />
            </Tile>
            <Tile tone="dark" className="aspect-square p-[22%]">
              <img src={file("symbol-color-dark.svg")} alt="Colour symbol on dark" className="h-full w-full" />
            </Tile>
          </div>
          <div className="mt-4 h-12 rounded-xl" style={{ background: "linear-gradient(90deg, #3D6BFF, #8A5CFF)" }} />
          <Caption>Passage gradient · #3D6BFF → #8A5CFF · mouth to exit</Caption>
        </Reveal>
        <ul className="grid gap-3">
          {swatches.map((s, i) => (
            <Reveal as="li" key={s.name} delay={i * 0.04} className="flex items-center gap-4 rounded-xl border border-white/[0.07] p-3">
              <span className={`h-14 w-14 shrink-0 rounded-lg ${s.cls}`} />
              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-[15px] font-semibold">{s.name}</span>
                  <span className="font-mono text-[12px] text-subtle">{s.hex}</span>
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">{s.use}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Block>
  );
}

function Versions() {
  const v = [
    { f: "lockup-horizontal.svg", tone: "light" as const, label: "Light background · graphite" },
    { f: "lockup-horizontal-white.svg", tone: "dark" as const, label: "Dark background · white" },
    { f: "lockup-horizontal-black.svg", tone: "white" as const, label: "Pure black · print, one colour" },
    { f: "lockup-horizontal-white.svg", tone: "black" as const, label: "Pure white · reversed" },
    { f: "lockup-horizontal-color.svg", tone: "light" as const, label: "Colour · light" },
    { f: "lockup-horizontal-color-dark.svg", tone: "dark" as const, label: "Colour · dark mode" },
  ];
  return (
    <Block id="versions" eyebrow="Versions" title="Excellent without colour." lead="The one-colour versions are the identity. The colour versions are an accent for screens and never the only option.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {v.map((x, i) => (
          <Reveal key={x.label} delay={(i % 3) * 0.05}>
            <Tile tone={x.tone} className="aspect-[16/10] p-10">
              <img src={file(x.f)} alt={x.label} className="h-auto w-4/5" />
            </Tile>
            <Caption>{x.label}</Caption>
          </Reveal>
        ))}
      </div>
    </Block>
  );
}

function Usage() {
  const donts = [
    { label: "Don't fill the tile with the gradient", style: "gradient" },
    { label: "Don't retype the wordmark", style: "typed" },
    { label: "Don't outline or add strokes", style: "outline" },
    { label: "Don't rotate or skew", style: "rotate" },
  ] as const;
  return (
    <Block id="usage" eyebrow="Usage" title="Clear space, minimum size, and what not to do.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <Tile tone="light" className="aspect-[16/10] p-8">
            <svg viewBox="-24 -24 96 96" className="h-full w-auto" role="img" aria-label="Clear space equals half the symbol on every side">
              <rect x={-24} y={-24} width={96} height={96} fill="none" stroke={BRAND_COLORS.blue} strokeDasharray="2 2" strokeWidth={0.4} />
              <rect x={0} y={0} width={48} height={48} fill={BRAND_COLORS.blue} fillOpacity={0.06} />
              <path d={SYMBOL.body} fill={INK} />
              <g fontFamily="JetBrains Mono Variable, monospace" fontSize={3.2} fill={BRAND_COLORS.blue}>
                <text x={-22} y={-19}>½ symbol clear space</text>
              </g>
            </svg>
          </Tile>
          <Caption>Clear space is half the symbol's height on every side. Nothing enters it.</Caption>
        </Reveal>
        <Reveal delay={0.05}>
          <Tile tone="light" className="aspect-[16/10] flex-col gap-6 p-8">
            <div className="flex items-end gap-6">
              <div className="text-center">
                <svg width={16} height={16} viewBox="0 0 48 48" aria-hidden="true">
                  <path d={SYMBOL_SMALL.body} fill={INK} />
                </svg>
                <p className="mt-2 font-mono text-[10px] text-[#4B5160]">16px</p>
              </div>
              <div className="text-center">
                <img src={file("lockup-horizontal.svg")} alt="" style={{ height: 20 }} />
                <p className="mt-2 font-mono text-[10px] text-[#4B5160]">20px high</p>
              </div>
              <div className="text-center">
                <img src={file("wordmark.svg")} alt="" style={{ height: 9 }} />
                <p className="mt-2 font-mono text-[10px] text-[#4B5160]">9px cap</p>
              </div>
            </div>
          </Tile>
          <Caption>Minimum sizes. Symbol 16px (small cut). Horizontal lockup 20px high. Wordmark 9px cap height.</Caption>
        </Reveal>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {donts.map((d) => (
          <Reveal as="li" key={d.label}>
            <Tile tone="light" className="relative aspect-square p-[26%]">
              <DontExample kind={d.style} />
              <span aria-hidden="true" className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-err font-mono text-[12px] text-white">
                ×
              </span>
            </Tile>
            <Caption>{d.label}</Caption>
          </Reveal>
        ))}
      </ul>
    </Block>
  );
}

function DontExample({ kind }: { kind: "gradient" | "typed" | "outline" | "rotate" }) {
  if (kind === "typed")
    return <span className="font-sans text-[22px] font-bold tracking-tight text-[#0B0D12]" style={{ fontFamily: "Georgia, serif" }}>Lanther</span>;
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true" style={kind === "rotate" ? { transform: "rotate(-18deg) skewX(8deg)" } : undefined}>
      <defs>
        <linearGradient id="dont-g" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D6BFF" />
          <stop offset="1" stopColor="#8A5CFF" />
        </linearGradient>
      </defs>
      {kind === "gradient" && <path d={SYMBOL.body} fill="url(#dont-g)" />}
      {kind === "outline" && <path d={SYMBOL.body} fill="none" stroke={INK} strokeWidth={1.2} />}
      {kind === "rotate" && <path d={SYMBOL.body} fill={INK} />}
    </svg>
  );
}

function Downloads() {
  const groups = [
    { title: "Symbol", files: ["symbol.svg", "symbol-white.svg", "symbol-black.svg", "symbol-color.svg", "symbol-color-dark.svg", "symbol-small.svg", "symbol-512.png"] },
    { title: "Wordmark", files: ["wordmark.svg", "wordmark-white.svg", "wordmark-black.svg"] },
    { title: "Lockups", files: ["lockup-horizontal.svg", "lockup-horizontal-white.svg", "lockup-horizontal-black.svg", "lockup-horizontal-color.svg", "lockup-horizontal-color-dark.svg", "lockup-stacked.svg", "lockup-stacked-white.svg", "lockup-horizontal.png"] },
    { title: "App and avatar", files: ["app-icon.svg", "app-icon-rounded.svg", "app-icon-1024.png", "avatar-512.png"] },
  ];
  return (
    <Block id="downloads" eyebrow="Files" title="Download the marks." lead="SVG for everything on screen. PNG only where a platform asks for it.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g) => (
          <Reveal key={g.title}>
            <h3 className="text-[15px] font-semibold">{g.title}</h3>
            <ul className="mt-3 space-y-1.5">
              {g.files.map((f) => (
                <li key={f}>
                  <a href={file(f)} download className="group inline-flex items-center gap-2 font-mono text-[12px] text-muted hover:text-ink">
                    <Download className="h-3.5 w-3.5 text-subtle group-hover:text-accent" aria-hidden="true" />
                    {f}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Block>
  );
}
