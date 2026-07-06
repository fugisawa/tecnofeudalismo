import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Fonte da verdade = markdown fora de site/ (ver ../CLAUDE.md e site/CLAUDE.md).
// base é resolvido a partir da raiz do projeto (site/); '../dossie' = repo/dossie.
// Os arquivos não têm frontmatter — o glob loader gera id a partir do nome.

const dossie = defineCollection({
  loader: glob({ pattern: '*.md', base: '../dossie' }),
});

const briefings = defineCollection({
  loader: glob({ pattern: ['*.md', '!README.md'], base: '../dossie/briefings' }),
});

const ensaios = defineCollection({
  loader: glob({ pattern: '*.md', base: '../dossie/ensaios' }),
});

const perfis = defineCollection({
  loader: glob({ pattern: '*.md', base: '../dossie/perfis' }),
});

export const collections = { dossie, briefings, ensaios, perfis };
