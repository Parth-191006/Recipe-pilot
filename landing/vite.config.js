import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Tailwind v4 is wired in as a Vite plugin (no postcss config, no JS config
// file — the design tokens live in src/index.css under @theme).
//
// base: './' so the built page also works from a subdirectory. That keeps the
// door open for publishing it as a GitHub Pages project site
// (https://<user>.github.io/Recipe-pilot/) without touching any asset URLs.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // The page is one screenful of static markup; keep the output honest and
    // small so it stays fast on an average phone.
    chunkSizeWarningLimit: 700,
  },
});
