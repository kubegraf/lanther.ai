import { Logo } from "../ui/Logo";
import { GitHubIcon, LinkedInIcon, XIcon } from "../ui/BrandIcons";
import { footerColumns, links } from "../../lib/site";

// Only GitHub has a real address today. LinkedIn and X render as disabled
// until the accounts exist, rather than linking to a profile that is not ours.
const social = [
  { label: "GitHub", href: links.github as string | undefined, Icon: GitHubIcon },
  { label: "LinkedIn", href: undefined, Icon: LinkedInIcon },
  { label: "X", href: undefined, Icon: XIcon },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="company" className="border-t border-white/[0.06] pb-10 pt-16 sm:pt-20">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[14px] leading-relaxed text-muted">
              Lanther builds AI-native connectivity infrastructure. We connect services across clouds, clusters and private
              networks, then operate the network underneath.
            </p>
            <ul className="mt-6 flex gap-2">
              {social.map(({ label, href, Icon }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-muted transition-colors hover:border-white/20 hover:text-ink"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ) : (
                    <span
                      aria-label={`${label} (coming soon)`}
                      title={`${label}: coming soon`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-subtle/50"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="text-[13px] font-medium text-ink">{col.title}</h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <a
                          href={l.href}
                          {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                          className="text-[14px] text-muted transition-colors hover:text-ink"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <span className="text-[14px] text-subtle/70">
                          {l.label} <span className="ml-1 font-mono text-[10px] uppercase tracking-wider text-subtle/60">soon</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[13px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Lanther. All rights reserved.</p>
          <p className="font-mono text-[11px]">lanther.ai</p>
        </div>
      </div>
    </footer>
  );
}
