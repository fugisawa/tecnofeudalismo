# Política de Uso de Ferramentas de Busca e Extração

## Data: 2026-01-09

## Ferramentas Disponíveis e Status

**ATUALIZADO: 2026-01-09 após testes sistemáticos (ver `docs/resultado_teste_ferramentas.md`)**

| Ferramenta | Tipo | Status | Uso Primário |
|------------|------|--------|--------------|
| **WebSearch** | Nativo | ✅ Funcional (9.0/10) | Busca web geral, artigos, notícias |
| **web-fetch (imageFetch)** | MCP | ✅ Funcional | Extração de conteúdo de URLs específicas |
| **context7** | MCP | ✅ Funcional | Documentação técnica de bibliotecas |
| **brave-search** | MCP | ❌ API keys inválidas | Testado 2x, ambas falharam |
| **tavily** | MCP | ❌ Incompatível (MCP remoto) | Servidor conecta mas funções não carregam |
| **exa** | MCP | ❌ Incompatível (HTTP) | Formato HTTP não suportado pelo Claude Code |

---

## Estratégia de Uso por Caso

### 1. Pesquisa Acadêmica e Notícias (Fase 2 do Relatório)

**Ferramenta primária**: `WebSearch`

**Por que:**
- ✅ Funcional e confiável
- ✅ Retorna múltiplos resultados com URLs
- ✅ Suporta queries complexas
- ✅ Inclui resultados de fontes respeitáveis (Stanford, McKinsey, Gartner, Carnegie Endowment)

**Quando usar:**
- Pesquisar estudos acadêmicos recentes (2024-2025)
- Encontrar estatísticas de consultorias (Gartner, McKinsey, Forrester)
- Buscar notícias sobre tecnologia e política
- Verificar doações políticas, contratos governamentais
- Investigar controvérsias e reações públicas

**Exemplo de query:**
```
WebSearch("ChatGPT political bias research studies 2024 2025")
WebSearch("Microsoft Copilot forced adoption enterprise criticism ROI 2024")
```

**Limitações:**
- Não fornece resumos automáticos (precisa ler resultados manualmente)
- Limitado a ~10 resultados por query
- Requer múltiplas buscas para cobertura abrangente

**Vantagens sobre alternativas:**
- Mais confiável que brave-search (que está quebrado)
- Resultados mais atualizados que bases de conhecimento estáticas

---

### 2. Extração de Conteúdo de URLs Conhecidas

**Ferramenta primária**: `web-fetch (imageFetch)`

**Por que:**
- ✅ Extrai texto completo de páginas específicas
- ✅ Converte HTML para Markdown
- ✅ Pode extrair imagens se necessário

**Quando usar:**
- Após WebSearch retornar URLs interessantes
- Para extrair conteúdo completo de artigos, papers, relatórios
- Verificar claims específicos em páginas conhecidas
- Extrair dados de páginas com tabelas ou estruturas complexas

**Exemplo de uso:**
```
# 1. WebSearch encontra: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
# 2. web-fetch extrai conteúdo completo
imageFetch(url="https://www.mckinsey.com/...", text={maxLength: 50000})
```

**Limitações:**
- Requer URL específica (não faz busca)
- Pode falhar em sites com paywall ou proteção anti-bot
- Lento para múltiplas páginas (fazer sequencialmente)

---

### 3. Documentação Técnica de Bibliotecas

**Ferramenta primária**: `context7`

**Por que:**
- ✅ Documentação atualizada e oficial
- ✅ Exemplos de código específicos
- ✅ Versionamento correto

**Quando usar:**
- Pesquisar sobre React, TypeScript, Vitest (Fase 2-5 do código)
- Verificar APIs e sintaxe atualizadas
- Encontrar best practices de bibliotecas específicas

**Exemplo de uso:**
```
# 1. Resolver library ID
resolve-library-id(libraryName="react", query="React performance optimization hooks")

# 2. Query docs
query-docs(libraryId="/facebook/react", query="useMemo vs useCallback performance")
```

**Limitações:**
- Apenas para bibliotecas/frameworks de programação
- Não útil para pesquisa de conteúdo político/social
- Requer dois passos (resolve → query)

---

## Workflow Recomendado para Fase 2 (IA Generativa)

### Passo 1: Busca Ampla com WebSearch

```
Queries paralelas (5-6 ao mesmo tempo):
1. "generative AI authoritarian applications 2024"
2. "ChatGPT political bias research 2024"
3. "Microsoft Copilot enterprise ROI negative 2024"
4. "enterprise AI adoption failure rates Gartner McKinsey"
5. "Windows 365 subscription model criticism"
```

**Resultado esperado:** 50-60 URLs de fontes diversas

### Passo 2: Triagem de Resultados

Priorizar URLs de:
- ✅ Instituições acadêmicas (.edu)
- ✅ Think tanks (Carnegie, Brookings, Freedom House)
- ✅ Consultorias (McKinsey, Gartner, Forrester)
- ✅ Veículos respeitáveis (Stanford Report, CNBC, CNN)
- ✅ Papers peer-reviewed (arXiv, Springer, JAMA)
- ❌ Blogs pessoais sem credibilidade
- ❌ Sites sensacionalistas

### Passo 3: Extração Seletiva com web-fetch

Para URLs prioritárias (5-10 por tópico):
```
imageFetch(url="URL_PRIORITARIA", text={maxLength: 30000, raw: false})
```

### Passo 4: Documentação de Fontes

Criar arquivo `docs/fontes_faseN.md` com:
- Título do artigo/estudo
- Fonte e URL
- Data de publicação
- **Dados-chave** extraídos
- Nível de confiança (Alta/Média/Baixa)

---

## Critérios de Qualidade para Fontes

### ⭐⭐⭐ Alta Confiança
- Papers peer-reviewed em journals respeitados
- Relatórios de consultorias (McKinsey, Gartner, Forrester, Deloitte)
- Estudos de universidades (Stanford, MIT, Oxford, Harvard)
- Dados governamentais oficiais (OpenSecrets, SEC filings)
- Think tanks estabelecidos (Carnegie, Brookings, Freedom House)

### ⭐⭐ Média Confiança
- Veículos de notícias respeitáveis (NYT, Guardian, CNBC, Reuters)
- Blogs técnicos de empresas (Microsoft, Google, Oracle - sobre seus próprios produtos)
- Análises de analistas de mercado
- Relatórios de ONGs (EFF, ACLU)

### ⭐ Baixa Confiança (usar com cautela)
- Blogs pessoais
- Sites sem credenciais claras
- Fontes secundárias sem citação de primárias
- Conteúdo opinativo sem dados

---

## Regras de Ouro

1. **Mínimo 3 fontes por claim quantitativo**
   - Exemplo: "80% das empresas reportam ROI negativo" → precisa 3 fontes corroborando

2. **Preferir fontes primárias**
   - Relatório McKinsey > Artigo sobre relatório McKinsey

3. **Datar todas as informações**
   - "Em 2024..." não "Recentemente..."
   - "Segundo estudo de outubro de 2024..." não "Segundo estudo recente..."

4. **Incluir URLs completas**
   - Sempre documentar URL exata em `docs/fontes_faseN.md`
   - Facilita fact-checking posterior

5. **Usar WebSearch em paralelo quando possível**
   - 5-6 queries simultâneas para maximizar eficiência
   - Depois triar e extrair sequencialmente

6. **Documentar imediatamente**
   - Não deixar para depois
   - Criar `fontes_faseN.md` antes de começar a escrever

7. **Fact-check valores numéricos**
   - Se dois estudos divergem (ex: "55%" vs "60%"), verificar metodologia
   - Reportar range quando há divergência: "entre 55-60% segundo diferentes estudos"

---

## Troubleshooting

### Problema: brave-search retorna "Token inválido"
**Solução:** Usar WebSearch como alternativa. Funcionalidade similar.

### Problema: WebSearch não encontra informação específica
**Solução:**
1. Refinar query (adicionar ano, termos específicos)
2. Tentar variações de termos
3. Se após 3 tentativas não encontrar, usar web-fetch em URLs conhecidas

### Problema: web-fetch timeout ou erro 403
**Solução:**
1. Verificar se URL é acessível (não paywall)
2. Tentar URL alternativa da mesma fonte
3. Buscar versão em repositórios alternativos (arXiv para papers, Archive.org para artigos)

### Problema: Muitos resultados irrelevantes
**Solução:**
1. Adicionar ano explicitamente: "2024" ou "2025"
2. Adicionar termos exclusivos: "study", "research", "report"
3. Excluir termos: "-advertisement" "-blog"

---

## Métricas de Sucesso

### Para Fase 2 (IA Generativa)
- **Mínimo**: 30 fontes documentadas
- **Ideal**: 40+ fontes
- **Distribuição**:
  - 50% Alta Confiança (papers, relatórios consultoria)
  - 30% Média Confiança (notícias, blogs técnicos)
  - 20% Baixa Confiança (apenas para contexto, sempre corroborado)

### Para Fact-Checking (Fase 6)
- **100% dos claims quantitativos** com 3+ fontes
- **100% das datas** verificadas
- **100% das URLs** testadas (não quebradas)

---

## Atualização desta Política

Esta política deve ser revisada:
- ✅ Quando novas ferramentas forem configuradas (Tavily, Exa)
- ✅ Quando ferramentas existentes quebrarem (como brave-search)
- ✅ Ao final de cada fase do projeto (lições aprendidas)

**Última atualização:** 2026-01-09 14:35
**Próxima revisão:** Após Fase 2 (IA Generativa)
