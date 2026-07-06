# CLAUDE.md

Guia para o Claude Code neste repositório.

## O projeto

Dossiê investigativo "A máquina de captura" — como plataformas, hyperscalers, bilionários e IA corroem democracia, economia e Estado, com o Brasil como laboratório (a pasta mantém o nome histórico `tecnofeudalismo`). Duas fases:

1. **Fase 1 — documentos** (`dossie/`): dossiê-mãe + documento-irmão + briefings/ensaios/perfis derivados, em markdown pt-BR com rigor de checagem. Estrutura do dossiê: peças → engrenagens → efeitos → Brasil → contraditório; o debate teórico é Anexo, não hipótese organizadora.
2. **Fase 2 — site** (`site/`): site interativo (Astro + React + D3) que apresentará dossiê, briefings e o grafo de atores. Em scaffold; ver `site/CLAUDE.md`.

## Estrutura

```
dossie/                      Fase 1 — todos os documentos finais
  tecnofeudalismo.md         Dossiê 3.1 "A máquina de captura" (documento-mãe, ~890 linhas)
  manual-decodificado.md     Documento-irmão: o repertório estratégico das plataformas (6 jogadas)
  registro-de-correcoes.md   Changelog claim a claim da validação v0.8 → 3.0
  briefings/                 5 briefings temáticos + README (índice)
  ensaios/                   Ensaios derivados
  perfis/                    Perfis investigativos
dados/
  atores-expansao.json       Grafo de atores (190+ nós, vínculos tipados) — alimenta o Anexo A e o site
prototipos/
  mapa-rede.tsx              Artifact D3 original do mapa de rede — insumo da fase 2, não é código do site
site/                        Fase 2 — pacote Astro (tem CLAUDE.md próprio)
arquivo/                     Material superado (v0.8, rascunhos) — não editar, não citar como fonte
```

## Regras de método (inegociáveis)

- **Busca:** NUNCA usar WebSearch/WebFetch nativos como default. Pesquisa via MCP **Exa + Tavily** (`mcp__exa__*`, `mcp__tavily__*`), inclusive nos prompts de subagentes. `mcp__fetch__fetch` só como fallback para URL primária conhecida.
- **Tags epistêmicas** em toda afirmação factual dos documentos: `[Confirmado]` / `[Reportado]` / `[Estimado]` / `[Contestado]` / `[Não corroborado]`. Distinções de rigor: anunciado ≠ operacional; alegado ≠ provado em juízo; RPO ≠ receita.
- **Declaração corporativa/de CEO nunca é evidência** — entra apenas como registro do que o ator quer que se acredite. Contraponto sério = fricção institucional documentada (tribunais, auditorias, cancelamentos de contrato), nunca autorregulação prometida.
- **Corpo do texto limpo de marcas de processo editorial**: nada de `[corrigido]`, `[mantido]`, referências a versões anteriores ou comentários sobre a checagem no corpo. Histórico vive em `dossie/registro-de-correcoes.md`.
- **Coocorrência ≠ coordenação**: relação documentada e tipada (financeira ≠ ideológica ≠ contratual); presença no mapa de atores não é imputação.
- Nunca apresentar conteúdo de memória paramétrica como pesquisa verificada.

## Convenções

- Documentos em **português (pt-BR)**; evitar anglicismos quando houver termo corrente em português.
- Nomes de arquivo em kebab-case, sem acentos.
- Referências cruzadas entre documentos por caminho relativo — ao mover arquivos, atualizar os links (grep por `](` e caminhos com crase).

## Site (fase 2)

```bash
cd site/
bun install        # dependências
bun run dev        # servidor de desenvolvimento
bun run build      # build de produção
bun run check      # astro check (tipos)
```

Stack: Astro 7 + @astrojs/react + @astrojs/mdx, D3 para o grafo, fontes Fraunces/Newsreader/Space Mono. Gerenciador de pacotes: **bun** (não npm/yarn/pnpm).
