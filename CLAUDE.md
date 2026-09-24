# CLAUDE.md — lanther.ai

The Lanther marketing site. Vite + React + TypeScript + Tailwind + Framer Motion,
deployed to GitHub Pages at https://kubegraf.github.io/lanther.ai/ on every push
to main.

## Things to know before changing anything

1. **The site is served from a SUBPATH.** `base` in `vite.config.ts` is
   `/lanther.ai/` and must equal the repo name. Get it wrong and the deploy goes
   green while every visitor gets an unstyled page. `deploy.yml` greps the built
   HTML and fails instead. Moving to the apex domain is a checklist in README.md.
2. **Do not invent facts.** No customer names or logos, user counts, uptime
   figures, certifications, compliance claims, benchmarks, funding, testimonials
   or prices. The design partner slots are empty on purpose and say so. Footer
   links with no real target render as "soon" text, not dead links.
3. **Every outbound link lives in `src/lib/site.ts`.** Sign in points at the
   access request because there is no product console yet. Do not point it at a
   hostname that does not resolve.
4. **This repo uses `ubuntu-latest`**, not `kubegraf-org-runners`. It is public,
   and the org runner group does not serve public repos. The reasoning is in the
   header of `.github/workflows/deploy.yml`. Same exception as agentenx.com.

## Brand identity

The logo is "Vector": a forward-leaning L cut once at the heel on the diagonal.
The site uses the FLAT DARK-COLOUR version: white upright, blade lit blue to
violet, white wordmark. `LogoMark`/`Logo` default to that tone.

The logo is GENERATED. `scripts/brand/build.py` draws the symbol and the
wordmark with shapely and writes every SVG in `public/brand/logo/`,
`public/favicon.svg` and `src/brand/marks.ts` (the paths React uses).
`scripts/brand/render.sh` makes the PNGs. Never hand-edit a generated file.

    python3 -m venv .venv && .venv/bin/pip install -r scripts/brand/requirements.txt
    .venv/bin/python scripts/brand/build.py && ./scripts/brand/render.sh

- The blue to violet gradient is on the blade only. Never the upright, never the wordmark.
- The `*-lit*` files (a glowing beam through the cut) are for dark backgrounds at
  64px and up: launch visuals, slides, splash screens. Everywhere else, flat.
- The wordmark is drawn, not a font. The A is a lambda. Never retype it.
- The brand guidelines page is a second Vite entry, `brand/index.html`, served
  at /lanther.ai/brand/. The exploration sheets are static PNGs in
  `public/brand/exploration/`.

## Design system

Dark only. Tokens are RGB triplets in `src/styles/index.css`, exposed to Tailwind
through `tailwind.config.js`. SVG cannot rely on CSS variables in presentation
attributes, so `src/lib/colors.ts` holds the same values for SVG. Change both.

One accent (blue `#6E8BFF`) with violet only inside gradients.

## Motion

- Use `m.*` from framer-motion, never `motion.*`. `LazyMotion strict` in
  `App.tsx` throws on `motion.*`, which keeps the bundle small.
- `useSequence` drives the scripted demos (incident console, terminal). Under
  `prefers-reduced-motion` it jumps to the LAST step, since the finished state
  is the informative one. Packets and pulses are not rendered at all then.
- Packet animation is SVG `<animateMotion>`, not JS, so it costs nothing per frame.

## Mobile is designed, not shrunk

The hero topology, complexity map and incident path each have a separate phone
layout (a route list, a portrait geometry and a hop list). A landscape SVG scaled
to 390px leaves 5px text. If you change one of these diagrams, change both
layouts.

Grids that hold code or `whitespace-pre` text need `grid-cols-[minmax(0,1fr)]`
on mobile. The default track lets long lines widen the page, and the
`overflow-x: hidden` on body hides that from `scrollWidth`.

## Verify by rendering

`npm run build` passing says nothing about how the page looks. Screenshot it at
390, 430, 1024 and 1440 before calling a visual change done, and check no element
extends past the viewport. Every layout bug found while building this was
visible in a screenshot and invisible to the type checker.
