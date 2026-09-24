/**
 * One place for every URL and address the page points at. Anything a visitor
 * can click that leaves the page is defined here, so swapping a placeholder for
 * the real thing is a one-line change.
 */

/** Where the page is actually served today. Used for canonical and OG tags. */
export const SITE_URL = "https://kubegraf.github.io/lanther.ai/";

export const CONTACT_EMAIL = "hello@lanther.ai";

export const links = {
  github: "https://github.com/kubegraf/lanther.ai",
  contact: `mailto:${CONTACT_EMAIL}?subject=Lanther%20early%20access`,
  talkToTeam: `mailto:${CONTACT_EMAIL}?subject=Talk%20to%20the%20Lanther%20team`,
  security: `mailto:${CONTACT_EMAIL}?subject=Security`,
  getStarted: "#get-started",
  // There is no product console yet. Sign in goes to the same access request
  // as Get started rather than to a hostname that does not exist.
  signIn: "#get-started",
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Product", href: "#platform" },
  { label: "Solutions", href: "#use-cases" },
  { label: "Developers", href: "#developers" },
  { label: "Docs", href: "#architecture" },
  { label: "Pricing", href: "#pricing" },
  { label: "Company", href: "#company" },
];

/** A footer link with no href renders as "soon" text rather than a dead link. */
export type FooterLink = { label: string; href?: string; external?: boolean };
export type FooterColumn = { title: string; links: FooterLink[] };

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Platform", href: "#platform" },
      { label: "Solutions", href: "#use-cases" },
      { label: "Developers", href: "#developers" },
      { label: "Architecture", href: "#architecture" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#company" },
      { label: "Contact", href: links.talkToTeam },
      { label: "Security", href: links.security },
      { label: "Brand", href: "brand/" },
      { label: "Status" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation" },
      { label: "GitHub", href: links.github, external: true },
      { label: "Blog" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy" }, { label: "Terms" }],
  },
];
