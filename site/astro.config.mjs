import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// Dossiê Tecnofeudalismo — jornalismo investigativo narrativo.
// Static output, ilhas React só onde há interação (grafo, timeline, dataviz).
export default defineConfig({
  site: 'https://tecnofeudalismo.example',
  output: 'static',
  integrations: [react(), mdx()],
  markdown: {
    shikiConfig: { theme: 'css-variables', wrap: true },
  },
  vite: {
    // Conteúdo-fonte vive fora de site/ (../briefings, ../ensaios, ...).
    server: { fs: { allow: ['..'] } },
  },
});
