/**
 * The same tokens as src/styles/index.css, for SVG. Presentation attributes
 * (`fill`, `stroke`, `stop-color`) do not resolve CSS variables in every
 * browser, so SVG gets literal values. Keep this in step with the CSS.
 */
const tokens = {
  bg: "7 8 11",
  elev: "12 14 19",
  panel: "17 20 27",
  ink: "237 239 245",
  muted: "154 163 181",
  subtle: "118 126 144",
  accent: "110 139 255",
  violet: "155 123 255",
  ok: "62 207 142",
  warn: "245 181 68",
  err: "242 85 90",
  line: "255 255 255",
} as const;

export type Token = keyof typeof tokens;

export const c = (name: Token, alpha?: number) =>
  alpha === undefined ? `rgb(${tokens[name]})` : `rgb(${tokens[name]} / ${alpha})`;

export const MONO = "JetBrains Mono Variable, ui-monospace, monospace";
