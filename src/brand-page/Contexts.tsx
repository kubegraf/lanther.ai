import type { ReactNode } from "react";
import { Activity, Book, GitBranch, LayoutGrid, Network, Search, Settings, Star } from "lucide-react";
import { LogoMark, Wordmark } from "../components/ui/Logo";
import { Reveal } from "../components/ui/Section";
import { BRAND_COLORS, SYMBOL_SMALL } from "../brand/marks";

/*
 * The identity in the places it will actually live. These are mock-ups drawn in
 * HTML, not screenshots of third-party products, and they carry no invented
 * people, customers or numbers.
 */

const BASE = import.meta.env.BASE_URL;
const INK = BRAND_COLORS.ink;

function Frame({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <Reveal className={className}>
      <figure>
        {children}
        <figcaption className="mt-3 font-mono text-[11px] text-subtle">{label}</figcaption>
      </figure>
    </Reveal>
  );
}

export function Contexts() {
  return (
    <section id="contexts" aria-labelledby="contexts-t" className="border-t border-white/[0.06] py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">In context</p>
          <h2 id="contexts-t" className="mt-4 text-balance text-[30px] font-semibold leading-[1.1] tracking-tightest sm:text-[40px]">
            From a 16px tab to a conference stage.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2">
          <Frame label="Website navbar · dark and light">
            <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
              <Navbar dark />
              <Navbar />
            </div>
          </Frame>
          <Frame label="Browser tabs · the favicon switches to white on dark tab bars">
            <div className="space-y-3">
              <Tabs dark />
              <Tabs />
            </div>
          </Frame>
          <Frame label="Dark SaaS dashboard" className="lg:col-span-2">
            <Dashboard />
          </Frame>
          <Frame label="GitHub organisation (mock-up)">
            <GitHubOrg />
          </Frame>
          <Frame label="Terminal">
            <Terminal />
          </Frame>
          <Frame label="Mobile app icon">
            <Phone />
          </Frame>
          <Frame label="Business card · front and back">
            <Cards />
          </Frame>
          <Frame label="Presentation · black and white" className="lg:col-span-2">
            <Slides />
          </Frame>
        </div>
      </div>
    </section>
  );
}

function Navbar({ dark }: { dark?: boolean }) {
  const fg = dark ? "#EDEFF5" : INK;
  return (
    <div className={`flex h-14 items-center justify-between px-5 ${dark ? "bg-[#07080B]" : "border-t border-black/5 bg-white"}`}>
      <span className="flex items-center gap-2.5">
        <LogoMark size={22} tone={dark ? "white" : "ink"} />
        <Wordmark height={13} color={fg} />
      </span>
      <span className={`hidden gap-5 text-[12px] sm:flex ${dark ? "text-[#9AA3B5]" : "text-[#4B5160]"}`}>
        <span>Product</span>
        <span>Developers</span>
        <span>Docs</span>
        <span>Pricing</span>
      </span>
      <span className={`rounded-md px-3 py-1.5 text-[12px] font-medium ${dark ? "bg-white text-black" : "bg-[#0B0D12] text-white"}`}>Get started</span>
    </div>
  );
}

function Tabs({ dark }: { dark?: boolean }) {
  const bar = dark ? "bg-[#1B1D23]" : "bg-[#DEE1E6]";
  const active = dark ? "bg-[#2A2C33] text-[#E8EAED]" : "bg-white text-[#1F1F1F]";
  const idle = dark ? "text-[#9AA0A6]" : "text-[#5F6368]";
  return (
    <div className={`flex items-end gap-1 overflow-hidden rounded-xl px-2 pt-2 ${bar}`}>
      <div className={`flex h-9 w-56 min-w-0 shrink items-center gap-2 rounded-t-lg px-3 text-[12px] ${active}`}>
        <svg width={16} height={16} viewBox="0 0 48 48" aria-hidden="true">
          <path d={SYMBOL_SMALL.body} fill={dark ? "#FFFFFF" : INK} />
        </svg>
        <span className="truncate">Lanther · Connect your infrastructure</span>
      </div>
      <div className={`flex h-9 w-40 min-w-0 shrink items-center gap-2 px-3 text-[12px] ${idle}`}>
        <span className="h-4 w-4 rounded-full bg-current opacity-30" />
        <span className="truncate">New tab</span>
      </div>
    </div>
  );
}

function Dashboard() {
  const nav = [
    { icon: LayoutGrid, label: "Overview", active: true },
    { icon: Network, label: "Connections" },
    { icon: GitBranch, label: "Routes" },
    { icon: Activity, label: "Incidents" },
    { icon: Settings, label: "Settings" },
  ];
  return (
    <div className="grid min-h-[340px] grid-cols-[minmax(0,1fr)] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07080B] sm:grid-cols-[200px_minmax(0,1fr)]">
      <aside className="hidden border-r border-white/[0.07] bg-[#0B0D12] p-4 sm:block">
        <div className="flex items-center gap-2">
          <LogoMark size={22} />
          <Wordmark height={11} color="#EDEFF5" />
        </div>
        <ul className="mt-8 space-y-1 text-[13px]">
          {nav.map(({ icon: Icon, label, active }) => (
            <li key={label} className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 ${active ? "bg-white/[0.06] text-ink" : "text-muted"}`}>
              <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.7} />
              {label}
            </li>
          ))}
        </ul>
      </aside>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold">Overview</p>
          <span className="flex items-center gap-2 rounded-md border border-white/10 px-2.5 py-1 text-[12px] text-subtle">
            <Search className="h-3.5 w-3.5" aria-hidden="true" /> Search
          </span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {["Connections", "Routes", "Open incidents"].map((k) => (
            <div key={k} className="rounded-xl border border-white/[0.07] bg-[#0B0D12] p-3">
              <p className="text-[11px] text-subtle">{k}</p>
              <p className="mt-2 h-4 w-10 rounded bg-white/10" aria-hidden="true" />
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-white/[0.07] bg-[#0B0D12] p-4">
          <p className="text-[11px] text-subtle">Route health</p>
          <svg viewBox="0 0 300 60" className="mt-2 h-16 w-full" aria-hidden="true" preserveAspectRatio="none">
            <path d="M0 40 L30 38 L60 42 L90 36 L120 39 L150 22 L180 37 L210 35 L240 38 L270 34 L300 36" fill="none" stroke="#6E8BFF" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function GitHubOrg() {
  const repos = [
    { name: "lanther-cli", desc: "Connect to any private service from your terminal." },
    { name: "lanther-agent", desc: "The outbound-only agent that runs in each environment." },
    { name: "helm-charts", desc: "Helm charts for installing Lanther on Kubernetes." },
  ];
  return (
    <div className="rounded-2xl border border-[#D0D7DE] bg-white p-5 text-[#1F2328]">
      <div className="flex items-center gap-4">
        <img src={`${BASE}brand/logo/app-icon-rounded.svg`} alt="" className="h-16 w-16 rounded-xl" />
        <div>
          <p className="text-[20px] font-semibold">Lanther</p>
          <p className="text-[13px] text-[#59636E]">AI-native infrastructure · lanther.ai</p>
        </div>
      </div>
      <p className="mt-5 border-b border-[#D0D7DE] pb-2 text-[13px] font-semibold">Repositories</p>
      <ul className="divide-y divide-[#D0D7DE]">
        {repos.map((r) => (
          <li key={r.name} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-[#0969DA]">
                <Book className="h-4 w-4 text-[#59636E]" aria-hidden="true" />
                {r.name}
                <span className="rounded-full border border-[#D0D7DE] px-1.5 text-[11px] font-normal text-[#59636E]">Public</span>
              </p>
              <p className="mt-1 truncate text-[12px] text-[#59636E]">{r.desc}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-md border border-[#D0D7DE] px-2 py-0.5 text-[12px]">
              <Star className="h-3.5 w-3.5" aria-hidden="true" /> Star
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Terminal() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0A0B0F]">
      <div className="flex items-center justify-center gap-2 border-b border-white/[0.07] py-2.5 text-[12px] text-subtle">
        <svg width={14} height={14} viewBox="0 0 48 48" aria-hidden="true">
          <path d={SYMBOL_SMALL.body} fill="#9AA3B5" />
        </svg>
        lanther · zsh
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.8] text-muted">
        <span className="text-accent">❯</span> <span className="text-ink">lanther status</span>
        {"\n"}
        {"  "}
        <span className="text-ink">lanther</span> <span className="text-subtle">0.1.0 · signed in via SSO</span>
        {"\n\n"}
        <span className="text-ok">✓</span> control plane reachable
        {"\n"}
        <span className="text-ok">✓</span> 3 environments connected
        {"\n"}
        <span className="text-ok">✓</span> all routes healthy
      </pre>
    </div>
  );
}

function Phone() {
  const apps = Array.from({ length: 11 }, (_, i) => i);
  return (
    <div className="flex justify-center rounded-2xl bg-gradient-to-b from-[#3A4A7A] via-[#1E2544] to-[#10131C] p-8">
      <div className="w-[240px] rounded-[36px] border border-white/15 bg-black/30 p-5">
        <p className="text-center text-[12px] font-semibold text-white/80">9:41</p>
        <ul className="mt-6 grid grid-cols-4 gap-x-3 gap-y-4">
          {apps.map((i) => (
            <li key={i} className="flex flex-col items-center gap-1">
              {i === 5 ? (
                <img src={`${BASE}brand/logo/app-icon.svg`} alt="Lanther app icon" className="h-11 w-11 rounded-[11px] shadow-[0_0_0_1px_rgb(255_255_255/0.08)]" />
              ) : (
                <span className="h-11 w-11 rounded-[11px] bg-white/[0.14]" />
              )}
              <span className={`text-[9px] ${i === 5 ? "text-white" : "text-transparent"}`}>{i === 5 ? "Lanther" : "."}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Cards() {
  return (
    <div className="grid gap-4 rounded-2xl bg-[#E9EBEF] p-6 sm:grid-cols-2">
      <div className="flex aspect-[1.75] flex-col justify-between rounded-lg bg-white p-5 shadow-[0_12px_30px_-12px_rgb(0_0_0/0.35)]">
        <img src={`${BASE}brand/logo/lockup-horizontal.svg`} alt="" className="h-5 w-auto self-start" />
        <div className="text-[#0B0D12]">
          <p className="text-[12px] font-semibold">Name Surname</p>
          <p className="text-[10px] text-[#4B5160]">Role</p>
          <p className="mt-2 font-mono text-[9px] text-[#4B5160]">hello@lanther.ai · lanther.ai</p>
        </div>
      </div>
      <div className="relative aspect-[1.75] overflow-hidden rounded-lg bg-[#0B0D12] shadow-[0_12px_30px_-12px_rgb(0_0_0/0.5)]">
        {/* The passage runs off the card: the mark at architectural scale. */}
        <svg viewBox="0 0 48 48" className="absolute -right-[18%] -top-[40%] h-[170%] w-auto" aria-hidden="true">
          <defs>
            <linearGradient id="card-g" x1="18" y1="0" x2="48" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor={BRAND_COLORS.blue} />
              <stop offset="1" stopColor={BRAND_COLORS.violet} />
            </linearGradient>
          </defs>
          <path d="M13.5 0H22.5V17.5A11 11 0 0 0 33.5 28.5H48V33H33.5A20 20 0 0 1 13.5 13Z" fill="url(#card-g)" />
        </svg>
      </div>
    </div>
  );
}

function Slides() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex aspect-video flex-col items-center justify-center gap-6 rounded-2xl bg-black">
        <LogoMark size={96} className="h-auto w-[18%]" />
        <Wordmark height={28} color="#FFFFFF" className="h-auto w-[36%]" />
      </div>
      <div className="flex aspect-video flex-col justify-between rounded-2xl bg-white p-[6%]">
        <LogoMark size={40} tone="ink" className="h-auto w-[7%]" />
        <p className="text-balance text-[clamp(18px,3.2vw,34px)] font-semibold leading-tight tracking-tight text-[#0B0D12]">
          The networking layer
          <br />
          for the AI era.
        </p>
      </div>
    </div>
  );
}
