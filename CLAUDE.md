# Projeto Tecnofeudalismo - Instruções para Claude

## Visão Geral

Projeto de pesquisa acadêmica sobre convergência entre elite tecnológica do Vale do Silício e ideologias autoritárias (1998-2025).

**Componentes:**
1. Relatório acadêmico detalhado (Tecnofeudalismo.md)
2. Visualização interativa em React (rede de atores)

## Estrutura do Projeto

```
tecnofeudalismo/
├── Tecnofeudalismo.md          # Relatório principal
├── remixed-8ded6ded.tsx        # Visualização (legacy)
├── src/                        # Código refatorado (em desenvolvimento)
├── docs/                       # Documentação adicional
└── CLAUDE.md                   # Este arquivo
```

## MCPs Prioritários

### Pesquisa e Atualização
- **brave-search**: Buscar artigos recentes (2024-2025)
- **tavily**: Busca web especializada com resumos automáticos, ideal para pesquisa acadêmica
- **exa**: Busca semântica/neural, encontra conteúdo por significado não apenas palavras-chave
- **web-fetch**: Extrair conteúdo de URLs específicas
- **context7**: Documentação técnica atualizada

### Análise e Verificação
- **github**: Buscar código-fonte, issues relacionadas
- **memory**: Manter conhecimento do projeto persistente

### Desenvolvimento
- **filesystem**: Manipular arquivos do projeto

## Agentes Especializados

### Para o Relatório
- **academic-researcher**: Papers e literatura acadêmica
- **search-specialist**: Pesquisa web profunda
- **fact-checker**: Verificação de claims
- **research-synthesizer**: Consolidar pesquisas
- **report-generator**: Gerar seções novas

### Para o Código React
- **frontend-developer**: Refatoração React
- **react-performance-optimization**: Otimização
- **ui-ux-designer**: Melhorar UX
- **test-engineer**: Criar testes
- **documentation-expert**: Documentar

## Workflow de Trabalho

### Relatório (7 Fases)
1. Atores ausentes + vigilância extrema
2. IA generativa + modelos de negócio
3. Investimentos cruzados + oligopólio
4. Interseccionalidade + Sul Global
5. Militarismo tech
6. Atualização + fact-checking
7. Contrapuntos + balanceamento

### Código React (5 Fases)
1. Fundação: Extrair dados, types, hooks básicos
2. Performance: Memoização, useCallback
3. Arquitetura: Modularização, componentes
4. Qualidade: Testes, documentação
5. UX: Acessibilidade, responsividade

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Servidor local
npm run build                  # Build produção
npm test                       # Testes
npm run test:coverage          # Coverage

# Git
git status
git add .
git commit -m "tipo: descrição"
git push

# Deploy (Netlify automático via push)
```

## Convenções de Código

- **TypeScript** obrigatório
- **ESLint + Prettier** para formatação
- **Conventional Commits** para mensagens
- **JSDoc** para documentação de funções
- **Vitest** para testes

## Fontes de Dados

### Relatório
- OpenSecrets.org (doações políticas)
- SEC filings (acionistas)
- Papers acadêmicos (preferência: peer-reviewed)
- Reportagens de veículos respeitáveis (Guardian, NYT, etc)

### Visualização
- `/src/data/networkData.ts` (fonte única de verdade)
- Atualizar aqui quando adicionar novos atores/conexões

## Notas Importantes

- **Rigor acadêmico**: Mínimo 3 fontes por claim
- **Fact-checking**: Verificar todas as estatísticas
- **Balanceamento**: Incluir perspectivas diversas
- **Atualização**: Priorizar eventos 2024-2025
- **Performance**: Testar com React DevTools Profiler
- **Acessibilidade**: ARIA labels obrigatórios

## Informações do Ambiente

- **Sistema**: Linux (Ubuntu)
- **Usuário**: fugisawa
- **Repositório**: https://github.com/fugisawa/tecnofeudalismo
- **Senha sudo**: a (para instalação de pacotes se necessário)

## Referências Rápidas

- Plano completo: `.claude/plans/vivid-questing-catmull.md`
- Issues GitHub: https://github.com/fugisawa/tecnofeudalismo/issues
- Deploy Netlify: [será configurado]

## Contato

Para questões sobre direcionamento do projeto, sempre consultar o usuário antes de decisões maiores.
