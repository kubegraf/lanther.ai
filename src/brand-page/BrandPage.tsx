import type { ReactNode } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { LogoMark, Wordmark, Logo } from "../components/ui/Logo";
import { Reveal } from "../components/ui/Section";
import { BRAND_COLORS, SYMBOL } from "../brand/marks";
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
              <Logo size={26} />
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
          <RecognitionTest />
          <Construction />
          <WordmarkSection />
          <Lockups />
          <Colour />
          <Lighting />
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

function Tile({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark" | "black" | "white"; className?: string }) {
  const bg = {
    light: "bg-[#F4F5F7]",
    white: "bg-white",
    dark: "bg-[#0B0D12] border border-white/[0.08]",
    black: "bg-black border border-white/[0.08]",
  }[tone];
  return <div className={`flex min-w-0 items-center justify-center rounded-2xl ${bg} ${className ?? ""}`}>{children}</div>;
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-3 font-mono text-[11px] text-subtle">{children}</p>;
}

/* ------------------------------------------------------------------ sections */

function Intro() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-24 sm:pt-24">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div className="container-site relative">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Brand identity</p>
          <h1 className="mt-5 text-balance text-[40px] font-semibold leading-[1.03] tracking-tightest sm:text-[56px]">
            Vector. An L at speed, cut once.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted sm:text-lg">
            A forward-leaning L, sliced at the heel by a single 45° cut. Two pieces, one route between them. The lean is
            speed. The cut is the passage. The blade is the leading edge, and it is the only part that carries colour.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center rounded-3xl border border-white/[0.08] bg-[radial-gradient(ellipse_60%_70%_at_30%_60%,rgb(70_90_255/0.16),transparent_70%),#05060A] px-5 py-16 sm:py-24">
            <img src={file("lockup-horizontal-lit-animated.svg")} alt="Lanther" className="w-full max-w-3xl" />
          </div>
          <Caption>The lit, animated lockup. The everyday logo is the flat version below.</Caption>
        </Reveal>
      </div>
    </section>
  );
}

function Idea() {
  const steps = [
    { n: "01", title: "Velocity", body: "An L leaning forward at 14°. The symbol and the wordmark share that angle, so everything moves the same way." },
    { n: "02", title: "The cut", body: "One diagonal through the outer heel and the inner corner. It separates the upright from the blade and is the route between them." },
    { n: "03", title: "Leading edge", body: "The blade meets what comes next. It is lit blue to violet in colour, and still reads in one colour because the cut does the work." },
  ];
  return (
    <Block id="idea" eyebrow="The idea" title="Speed, a route, and a leading edge." lead="Three moves, all visible in the final drawing. Nothing decorative is added.">
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <Tile tone="dark" className="aspect-[4/3] p-10">
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

function IdeaStep({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-auto" aria-hidden="true">
      <defs>
        <linearGradient id="idea-h" x1="0" y1="48" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor={BRAND_COLORS.blue} />
          <stop offset="1" stopColor={BRAND_COLORS.violet} />
        </linearGradient>
      </defs>
      {step === 0 && (
        // The same two pieces with the cut closed, so step 2 reads as a change.
        <g stroke="#FFFFFF" strokeWidth={3.6} strokeLinejoin="miter">
          <path d={SYMBOL.body} fill="#FFFFFF" />
          <path d={SYMBOL.heel} fill="#FFFFFF" />
        </g>
      )}
      {step >= 1 && (
        <>
          <path d={SYMBOL.body} fill="#FFFFFF" />
          <path d={SYMBOL.heel} fill={step === 2 ? "url(#idea-h)" : "#FFFFFF"} />
        </>
      )}
    </svg>
  );
}

function Exploration() {
  return (
    <Block
      id="exploration"
      eyebrow="Exploration"
      title="Eight directions, then three refinements."
      lead="Each concept was checked at display size and at 16px. Monolith and Warp gate were too close to stock cube and spiral logos. Orbit read as a pie chart. Prism was strong but reads like a media 'next' button. Vector had the most speed and stayed clearly an L."
    >
      <div className="grid gap-4">
        <Reveal>
          <img src={`${BASE}brand/exploration/round-1.png`} alt="Round one: eight symbol concepts" className="w-full rounded-2xl" loading="lazy" />
          <Caption>Round one</Caption>
        </Reveal>
        <Reveal>
          <img src={`${BASE}brand/exploration/round-2.png`} alt="Round two: Prism, Vector and Hyperlane refinements" className="w-full rounded-2xl" loading="lazy" />
          <Caption>Round two · Prism, Vector and Hyperlane</Caption>
        </Reveal>
      </div>
    </Block>
  );
}

function RecognitionTest() {
  return (
    <section aria-label="Recognition test" className="border-t border-white/[0.06] bg-black py-24 sm:py-32">
      <div className="container-site text-center">
        <Reveal>
          <LogoMark size={200} tone="white" className="mx-auto h-auto w-40 sm:w-52" />
          <p className="mx-auto mt-12 max-w-xl text-pretty text-[17px] leading-relaxed text-muted">
            Remove the word. It is still one shape nobody else owns: a leaning L with its heel cut away on the diagonal.
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
    ["Lean", "14°, shared with the wordmark"],
    ["Cut", "45°, 3.4 units wide"],
    ["Upright", "12.5 wide"],
    ["Blade", "11.5 high"],
    ["Pieces", "2, never joined"],
  ];
  return (
    <Block id="construction" eyebrow="Construction" title="Drawn on a 48-unit grid." lead="The cut runs exactly through the outer heel and the inner corner, so it reads as intentional at every size rather than as a gap.">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
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
              <path d={SYMBOL.heel} fill={BRAND_COLORS.blue} fillOpacity={0.85} />
            </svg>
          </Tile>
        </Reveal>
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]">
            {dims.map(([k, v]) => (
              <div key={k} className="bg-bg p-4">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-subtle">{k}</dt>
                <dd className="mt-1 text-[15px] text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex items-end gap-4 rounded-2xl bg-[#F4F5F7] p-5">
            {[16, 24, 32, 48].map((s) => (
              <LogoMark key={s} size={s} tone="ink" />
            ))}
            <span className="ml-auto font-mono text-[10px] text-[#4B5160]">16 · 24 · 32 · 48</span>
          </div>
        </Reveal>
      </div>
    </Block>
  );
}

function WordmarkSection() {
  const details = [
    { t: "Λ", d: "The A is drawn as a lambda. In context it still reads LANTHER, and it gives the word its edge." },
    { t: "L", d: "Carries a small version of the symbol's heel cut, so the mark and the word are visibly one family." },
    { t: "Lean", d: "The same 14° as the symbol. Nothing in the identity stands upright." },
    { t: "Width", d: "Extended capitals with open spacing: calm and wide, so the lean reads as speed rather than haste." },
  ];
  return (
    <Block id="wordmark" eyebrow="Wordmark" title="Drawn, not typed." lead="LANTHER is drawn letter by letter. It is not set in a font and will not match one. Use the files, never retype it.">
      <Reveal>
        <Tile tone="dark" className="px-6 py-16 sm:py-24">
          <Wordmark height={80} color="#FFFFFF" className="h-auto w-full max-w-3xl" />
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
    <Block id="lockups" eyebrow="Lockups" title="The flat dark-colour lockup is the default." lead="White upright, lit blade, white wordmark, on a dark surface. It is what the site uses. The others are for light surfaces and single-colour use.">
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <Tile tone="dark" className="aspect-[16/9] p-10">
            <img src={file("lockup-horizontal-color-dark.svg")} alt="Lanther horizontal lockup, dark colour" className="h-auto w-4/5" />
          </Tile>
          <Caption>Horizontal · dark colour · primary</Caption>
        </Reveal>
        <Reveal delay={0.05}>
          <Tile tone="light" className="aspect-[16/9] p-10">
            <img src={file("lockup-horizontal-color.svg")} alt="Lanther horizontal lockup, light colour" className="h-auto w-4/5" />
          </Tile>
          <Caption>Horizontal · light colour</Caption>
        </Reveal>
        <Reveal>
          <Tile tone="dark" className="aspect-[16/9] p-10">
            <img src={file("lockup-stacked-color-dark.svg")} alt="Lanther stacked lockup" className="h-3/5 w-auto" />
          </Tile>
          <Caption>Stacked · square spaces, signage</Caption>
        </Reveal>
        <Reveal delay={0.05}>
          <Tile tone="dark" className="aspect-[16/9] flex-col gap-6 p-10">
            <img src={file("lockup-horizontal-color-dark.svg")} alt="Lanther with descriptor" className="h-auto w-3/5" />
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">AI-native infrastructure</p>
          </Tile>
          <Caption>With descriptor · only where the product needs explaining</Caption>
        </Reveal>
      </div>
    </Block>
  );
}

function Colour() {
  const swatches = [
    { name: "Graphite", hex: "#0B0D12", use: "Dark surfaces, and the mark on light backgrounds.", cls: "bg-[#0B0D12] border border-white/10" },
    { name: "White", hex: "#FFFFFF", use: "The upright and the wordmark on dark surfaces.", cls: "bg-white" },
    { name: "Signal Blue", hex: "#3D6BFF", use: "The near end of the blade. Links and focus.", cls: "bg-[#3D6BFF]" },
    { name: "Route Violet", hex: "#8A5CFF", use: "Only as the far end of the blade gradient.", cls: "bg-[#8A5CFF]" },
    { name: "Signal Blue, on dark UI", hex: "#6E8BFF", use: "The accent in dark interfaces. 6.3:1 on the site background.", cls: "bg-[#6E8BFF]" },
  ];
  return (
    <Block id="colour" eyebrow="Colour" title="Colour lives on the blade." lead="The identity is black and white. The blue to violet gradient appears on the blade only, never on the upright and never on the wordmark.">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Reveal>
          <div className="grid grid-cols-2 gap-4">
            <Tile tone="dark" className="aspect-square p-[22%]">
              <img src={file("symbol-color-dark.svg")} alt="Colour symbol on dark" className="h-full w-full" />
            </Tile>
            <Tile tone="light" className="aspect-square p-[22%]">
              <img src={file("symbol-color.svg")} alt="Colour symbol on light" className="h-full w-full" />
            </Tile>
          </div>
          <div className="mt-4 h-12 rounded-xl" style={{ background: "linear-gradient(90deg, #3D6BFF, #8A5CFF)" }} />
          <Caption>Blade gradient · #3D6BFF → #8A5CFF · heel to tip</Caption>
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

function Lighting() {
  return (
    <Block
      id="lighting"
      eyebrow="Lighting"
      title="Lit is a moment. Flat is the system."
      lead="For launch visuals, keynote slides, social banners and splash screens, the cut becomes a light source: a white beam through the gap, a glowing blade, the upright lit from above. Dark backgrounds and 64px and up only. Everywhere else, use the flat files."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Reveal>
          <Tile tone="black" className="aspect-square p-6">
            <img src={file("symbol-lit-animated.svg")} alt="Lit symbol, animated" className="h-full w-full" />
          </Tile>
          <Caption>symbol-lit-animated.svg</Caption>
        </Reveal>
        <Reveal delay={0.05}>
          <Tile tone="black" className="aspect-square p-6">
            <img src={file("symbol-lit.svg")} alt="Lit symbol" className="h-full w-full" />
          </Tile>
          <Caption>symbol-lit.svg</Caption>
        </Reveal>
        <Reveal delay={0.1}>
          <Tile tone="black" className="aspect-square p-[18%]">
            <img src={file("app-icon-lit-rounded.svg")} alt="Lit app icon" className="h-full w-full" />
          </Tile>
          <Caption>app-icon-lit-rounded.svg</Caption>
        </Reveal>
      </div>
    </Block>
  );
}

function Versions() {
  const v = [
    { f: "lockup-horizontal-color-dark.svg", tone: "dark" as const, label: "Dark colour · primary" },
    { f: "lockup-horizontal-color.svg", tone: "light" as const, label: "Light colour" },
    { f: "lockup-horizontal-white.svg", tone: "dark" as const, label: "White · one colour on dark" },
    { f: "lockup-horizontal.svg", tone: "light" as const, label: "Graphite · one colour on light" },
    { f: "lockup-horizontal-black.svg", tone: "white" as const, label: "Pure black · print" },
    { f: "lockup-horizontal-white.svg", tone: "black" as const, label: "Pure white · reversed" },
  ];
  return (
    <Block id="versions" eyebrow="Versions" title="Excellent without colour." lead="Every lockup has a one-colour version that carries the whole identity. Colour is an accent, never a requirement.">
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
    { label: "Don't colour the upright", kind: "upright" },
    { label: "Don't close the cut", kind: "closed" },
    { label: "Don't stand it upright", kind: "upright-lean" },
    { label: "Don't use glow on light backgrounds", kind: "glow-light" },
  ] as const;
  return (
    <Block id="usage" eyebrow="Usage" title="Clear space, minimum size, and what not to do.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <Tile tone="dark" className="aspect-[16/10] p-8">
            <svg viewBox="-24 -24 96 96" className="h-full w-auto" role="img" aria-label="Clear space equals half the symbol on every side">
              <rect x={-24} y={-24} width={96} height={96} fill="none" stroke="#6E8BFF" strokeDasharray="2 2" strokeWidth={0.4} />
              <rect x={0} y={0} width={48} height={48} fill="#6E8BFF" fillOpacity={0.06} />
              <path d={SYMBOL.body} fill="#FFFFFF" />
              <path d={SYMBOL.heel} fill="#6E8BFF" />
              <text x={-22} y={-19} fontFamily="JetBrains Mono Variable, monospace" fontSize={3.2} fill="#6E8BFF">
                ½ symbol clear space
              </text>
            </svg>
          </Tile>
          <Caption>Clear space is half the symbol's height on every side.</Caption>
        </Reveal>
        <Reveal delay={0.05}>
          <Tile tone="dark" className="aspect-[16/10] p-8">
            <div className="flex flex-wrap items-end justify-center gap-6">
              <div className="text-center">
                <LogoMark size={16} />
                <p className="mt-2 font-mono text-[10px] text-subtle">16px</p>
              </div>
              <div className="text-center">
                <Logo size={24} />
                <p className="mt-2 font-mono text-[10px] text-subtle">24px lockup</p>
              </div>
              <div className="text-center">
                <Wordmark height={9} color="#FFFFFF" />
                <p className="mt-2 font-mono text-[10px] text-subtle">9px cap</p>
              </div>
            </div>
          </Tile>
          <Caption>Minimum sizes. Symbol 16px. Horizontal lockup 24px high. Wordmark 9px cap height.</Caption>
        </Reveal>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {donts.map((d) => (
          <Reveal as="li" key={d.label}>
            <Tile tone={d.kind === "glow-light" ? "light" : "dark"} className="relative aspect-square p-[24%]">
              <DontExample kind={d.kind} />
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

function DontExample({ kind }: { kind: "upright" | "closed" | "upright-lean" | "glow-light" }) {
  if (kind === "glow-light") return <img src={file("symbol-lit.svg")} alt="" className="h-full w-full" />;
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true" style={kind === "upright-lean" ? { transform: "skewX(14deg)" } : undefined}>
      <defs>
        <linearGradient id="dont-g" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D6BFF" />
          <stop offset="1" stopColor="#8A5CFF" />
        </linearGradient>
      </defs>
      {kind === "upright" && (
        <>
          <path d={SYMBOL.body} fill="url(#dont-g)" />
          <path d={SYMBOL.heel} fill="#FFFFFF" />
        </>
      )}
      {kind === "closed" && (
        <g stroke="#FFFFFF" strokeWidth={3.6}>
          <path d={SYMBOL.body} fill="#FFFFFF" />
          <path d={SYMBOL.heel} fill="#FFFFFF" />
        </g>
      )}
      {kind === "upright-lean" && (
        <>
          <path d={SYMBOL.body} fill="#FFFFFF" />
          <path d={SYMBOL.heel} fill="#FFFFFF" />
        </>
      )}
    </svg>
  );
}

function Downloads() {
  const groups = [
    { title: "Symbol", files: ["symbol-color-dark.svg", "symbol-color.svg", "symbol-white.svg", "symbol.svg", "symbol-black.svg", "symbol-512.png"] },
    { title: "Wordmark", files: ["wordmark-white.svg", "wordmark.svg", "wordmark-black.svg"] },
    { title: "Lockups", files: ["lockup-horizontal-color-dark.svg", "lockup-horizontal-color.svg", "lockup-horizontal-white.svg", "lockup-horizontal.svg", "lockup-horizontal-black.svg", "lockup-stacked-color-dark.svg", "lockup-stacked-white.svg", "lockup-stacked.svg", "lockup-horizontal-color-dark.png"] },
    { title: "Lit and app", files: ["lockup-horizontal-lit.svg", "lockup-horizontal-lit-animated.svg", "symbol-lit.svg", "symbol-lit-animated.svg", "lockup-horizontal-lit-2400.png", "app-icon.svg", "app-icon-rounded.svg", "app-icon-lit.svg", "app-icon-1024.png", "app-icon-lit-1024.png", "avatar-512.png"] },
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
                  <a href={file(f)} download className="group inline-flex items-center gap-2 break-all font-mono text-[12px] text-muted hover:text-ink">
                    <Download className="h-3.5 w-3.5 shrink-0 text-subtle group-hover:text-accent" aria-hidden="true" />
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
