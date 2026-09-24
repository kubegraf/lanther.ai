import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://kubegraf.github.io/lanther.ai/, a SUBPATH, so every asset
// URL has to carry that prefix. Set it wrong and the page loads with no CSS,
// no fonts and no JavaScript. deploy.yml checks the built HTML for it.
// If the site moves to the lanther.ai apex, this becomes "/" (see README).
const BASE = "/lanther.ai/";

export default defineConfig({
  base: BASE,
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: false,
  },
});
