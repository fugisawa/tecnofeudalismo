# site/ — fase 2 do projeto tecnofeudalismo

Site interativo que apresenta o dossiê, os briefings e o grafo de atores. Regras gerais do projeto (método, estrutura, busca): ver `../CLAUDE.md`.

## Stack

- **Astro 7** + `@astrojs/react` + `@astrojs/mdx` (o Astro usa Vite internamente — não trocar por Bun.serve/HTML imports)
- **React 19** apenas em ilhas interativas; o resto é Astro estático
- **D3 7** para o grafo de atores (dados em `../dados/atores-expansao.json`; protótipo de referência em `../prototipos/mapa-rede.tsx`)
- Fontes: Fraunces (títulos), Newsreader (texto), Space Mono (dados/tags) — via `@fontsource`

## Comandos

Gerenciador de pacotes e runner: **bun** (não npm/yarn/pnpm; `bunx` em vez de `npx`).

```bash
bun install
bun run dev        # dev server
bun run build      # build de produção
bun run preview    # servir o build
bun run check      # astro check
```

## Conteúdo

O conteúdo vem dos documentos em `../dossie/` — o site **apresenta** os documentos, não os reescreve. Correções de conteúdo acontecem lá, nunca em cópias dentro do site. Preservar as tags epistêmicas ([Confirmado]/[Reportado]/…) na apresentação: elas são parte do método, não ruído a esconder.
