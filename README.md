# lanther.ai

Marketing site for Lanther, AI-native connectivity infrastructure.

Live at https://kubegraf.github.io/lanther.ai/ (GitHub Pages, deployed on every push to `main`).

## Run it

```bash
npm ci
npm run dev       # http://localhost:5173/lanther.ai/
npm run build     # typecheck + production build into dist/
npm run preview   # serve dist/ at http://localhost:4173/lanther.ai/
```

## Stack

React 18, TypeScript, Vite, Tailwind CSS 3, Framer Motion (via `LazyMotion`), Lucide icons.
Fonts are self-hosted from `@fontsource-variable`, so the page makes no third-party requests.

## Layout

```
src/
  sections/            one file per page section, in page order in App.tsx
  components/layout/   Navbar, Footer
  components/ui/       Button, Section, SectionHeader, Reveal, Logo, brand icons
  components/visuals/  the diagrams: hero topology, complexity map, incident console,
                       code panel, capability mini-visuals
  data/topology.ts     hero graph nodes, edges and the scripted failover loop
  lib/site.ts          every outbound URL and address, in one place
  lib/colors.ts        design tokens for SVG (mirrors src/styles/index.css)
  lib/hooks.ts         useSequence, useTickerInView, useScrolled, useMediaQuery
public/                favicon, icons, og.png, robots.txt, sitemap.xml, 404.html
scripts/og.html        source for public/og.png, rendered by scripts/render-og.sh
```

## Moving to the lanther.ai domain

Today the site is served from a subpath. To serve it at `https://lanther.ai/`:

1. Set `BASE` in `vite.config.ts` to `"/"`.
2. Add `public/CNAME` containing `lanther.ai`.
3. Replace `https://kubegraf.github.io/lanther.ai/` with `https://lanther.ai/` in `index.html`,
   `src/lib/site.ts`, `public/robots.txt`, `public/sitemap.xml`, `public/404.html` and
   `public/site.webmanifest`.
4. Update the base-path check and the URL check in `.github/workflows/deploy.yml`.
5. Point DNS at GitHub Pages and set the custom domain in the repo's Pages settings.
