/** @type {import('tailwindcss').Config} */
// Every colour is a CSS variable defined in src/styles/index.css. Change the
// token there, not here.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        elev: v("elev"),
        panel: v("panel"),
        ink: v("ink"),
        muted: v("muted"),
        subtle: v("subtle"),
        accent: v("accent"),
        violet: v("violet"),
        ok: v("ok"),
        warn: v("warn"),
        err: v("err"),
        line: v("line"),
      },
      fontFamily: {
        sans: ['"Inter Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: { site: "1200px" },
      letterSpacing: { tightest: "-0.035em" },
    },
  },
  plugins: [],
};
