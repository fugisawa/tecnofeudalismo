# Resultado do Teste de Ferramentas de Busca

## Data: 2026-01-09
## Status: Concluído após 3 reinicializações

---

## Resumo Executivo

**Ferramenta vencedora: WebSearch (nativo)**

**Razão:** Única ferramenta totalmente funcional e confiável no ambiente atual do Claude Code.

**Decisão:** Continuar Fase 2 usando WebSearch exclusivamente, sem refazer pesquisas (já obtivemos 30 fontes de alta qualidade).

---

## Tentativas de Configuração

### Tentativa 1: Pacotes NPM Locais
**Configuração:**
```json
{
  "tavily": {
    "command": "npx",
    "args": ["-y", "tavily-mcp"],
    "env": {"TAVILY_API_KEY": "tvly-..."}
  },
  "exa": {
    "command": "npx",
    "args": ["-y", "exa-mcp-server"],
    "env": {"EXA_API_KEY": "ea0a..."}
  }
}
```

**Resultado:** ❌ Falhou
- Tavily: Erro "TAVILY_API_KEY environment variable is required"
- Exa: Não carregou funções
- Problema: Variáveis de ambiente não sendo passadas corretamente

### Tentativa 2: Servidores Remotos
**Configuração:**
```json
{
  "tavily": {
    "command": "npx",
    "args": ["-y", "mcp-remote", "https://mcp.tavily.com/mcp/?tavilyApiKey=tvly-..."]
  },
  "exa": {
    "type": "http",
    "url": "https://mcp.exa.ai/mcp?exaApiKey=ea0a...&tools=web_search_exa,get_code_context_exa"
  }
}
```

**Resultado:** ❌ Falhou
- Tavily: `mcp-remote` conecta ao servidor mas Claude Code não registra funções
- Exa: Formato HTTP não suportado pelo Claude Code (não carrega funções)
- Teste manual confirmou que servidores remotos respondem corretamente

**Diagnóstico técnico:**
```bash
# Teste manual bem-sucedido:
$ npx -y mcp-remote "https://mcp.tavily.com/mcp/?tavilyApiKey=..."
[328083] Connected to remote server using StreamableHTTPClientTransport
[328083] Proxy established successfully

# Mas funções não aparecem em ListMcpResourcesTool
```

### Tentativa 3: Brave Search
**API Keys testadas:**
1. `BSAmjXCgEaW5YjKE6_dSk15daMuJv4M` ❌
2. `BSA_fdhXkVwdsEyCmRWwgqa94hnYVPf` ❌

**Erro persistente:**
```json
{
  "error": {
    "code": "SUBSCRIPTION_TOKEN_INVALID",
    "detail": "The provided subscription token is invalid.",
    "status": 422
  }
}
```

**Conclusão:** API keys inválidas ou conta Brave Search não está ativa.

---

## Análise das Ferramentas

### ✅ WebSearch (Nativo)

**Status:** Totalmente funcional

**Testes realizados:**
- Query 1: "generative AI authoritarian applications government surveillance 2024 2025"
- Query 2: "ChatGPT political bias research studies 2024 2025"
- Query 3: "Microsoft Copilot forced adoption enterprise criticism ROI 2024"
- Query 4: "enterprise AI ROI negative returns Gartner McKinsey Forrester 2024"
- Query 5: "Windows 365 Office 365 subscription mandatory perpetual license end 2024"

**Resultados (da pesquisa inicial da Fase 2):**
- **URLs obtidas:** ~50 URLs
- **URLs úteis:** 30 fontes (alta qualidade)
- **Tempo:** ~6 segundos para 5 queries paralelas
- **Resumos:** Não (precisa processar manualmente)
- **Qualidade:** 8/10

**Fontes obtidas incluem:**
- ✅ Carnegie Endowment for International Peace
- ✅ University of Oxford AI Governance Initiative
- ✅ CNN, Euronews, Stanford Report
- ✅ McKinsey, Gartner, Forrester (consultorias)
- ✅ Springer, ArXiv (journals acadêmicos)
- ✅ Freedom House, National Endowment for Democracy

**Pontos fortes:**
- Confiável e sempre disponível
- Resultados de alta qualidade
- Rápido para múltiplas queries paralelas
- Suporta 10 resultados por query
- Fontes respeitáveis (acadêmicas, consultorias, think tanks)

**Pontos fracos:**
- Sem resumos automáticos (precisa ler manualmente)
- Limitado a ~10 resultados por query
- Precisa usar web-fetch para conteúdo completo

**Avaliação final:**
- Qualidade: 8/10
- Confiabilidade: 10/10
- Velocidade: 9/10
- Facilidade de uso: 9/10
- **NOTA GERAL: 9.0/10**

---

### ❌ Tavily

**Status:** Não funcional no ambiente atual

**Problema identificado:**
- Servidor remoto conecta via `mcp-remote`
- Proxy estabelecido com sucesso
- Mas Claude Code não registra as funções
- `ListMcpResourcesTool` retorna lista vazia

**Causa raiz:**
- Claude Code pode não suportar servidores MCP que usam `mcp-remote` como proxy
- Ou há problema na inicialização durante startup

**Recursos esperados (não disponíveis):**
- Resumos automáticos otimizados para LLMs
- Citações transparentes
- Dados em tempo real

**Impacto:**
- Não afeta trabalho (WebSearch já forneceu fontes excelentes)

---

### ❌ Exa

**Status:** Não funcional no ambiente atual

**Problema identificado:**
- Formato HTTP (`"type": "http"`) não é suportado pelo Claude Code
- Endpoint remoto responde (HTTP/2 405) mas funções não são carregadas
- `ListMcpResourcesTool` retorna lista vazia

**Causa raiz:**
- Claude Code pode não suportar servidores MCP via HTTP puro
- Formato de configuração HTTP não é reconhecido

**Recursos esperados (não disponíveis):**
- Busca semântica/neural
- Encontrar conteúdo por significado
- `get_code_context_exa` para busca de código

**Impacto:**
- Não afeta trabalho atual (Fase 2 é sobre pesquisa acadêmica, não código)

---

### ❌ Brave Search

**Status:** API keys inválidas

**Problema identificado:**
- Duas API keys testadas, ambas retornam erro 422
- "SUBSCRIPTION_TOKEN_INVALID"

**Causa raiz:**
- API keys podem estar expiradas
- Conta Brave Search pode não estar ativa
- Pode requerer plano pago não ativo

**Recursos esperados (não disponíveis):**
- Busca web alternativa
- 10-20 resultados por query

**Impacto:**
- Não afeta trabalho (WebSearch é suficiente)

---

## Decisão Final: Cenário C

**Cenário escolhido:** C - WebSearch continua SUPERIOR

**Justificativa:**

1. **WebSearch já provou eficácia:**
   - 30 fontes de alta qualidade coletadas
   - Fontes acadêmicas, consultorias, think tanks
   - Diversidade de perspectivas
   - Atualidade (2024-2025)

2. **Ferramentas alternativas não funcionam:**
   - Tavily: Problema de compatibilidade MCP remoto
   - Exa: Formato HTTP não suportado
   - Brave: API keys inválidas

3. **Tempo já investido:**
   - 3 reinicializações do Claude Code
   - Múltiplas tentativas de configuração
   - Documentação extensa pesquisada

4. **ROI negativo de continuar tentando:**
   - Resultados atuais já são excelentes (8/10 de qualidade)
   - Tempo gasto em configuração >> benefício marginal esperado
   - Fase 2 precisa avançar

**Ação a tomar:** Continuar Fase 2 com WebSearch, sem refazer pesquisas.

---

## Política de Uso Atualizada

### Ferramenta Primária: WebSearch

**Quando usar:**
- ✅ Pesquisa acadêmica e estudos
- ✅ Notícias e artigos recentes (2024-2025)
- ✅ Dados de consultorias (Gartner, McKinsey, Forrester)
- ✅ Verificação de claims e fact-checking
- ✅ Busca de estatísticas e números

**Como usar:**
```javascript
// 5-6 queries paralelas para eficiência
WebSearch("generative AI authoritarian applications 2024")
WebSearch("ChatGPT political bias research 2024")
WebSearch("Microsoft Copilot ROI negative 2024")
// etc.
```

**Best practices:**
1. Executar queries em paralelo (5-6 ao mesmo tempo)
2. Incluir ano explicitamente (2024, 2025)
3. Priorizar fontes acadêmicas e consultorias
4. Documentar todas as URLs em `docs/fontes_faseN.md`
5. Usar web-fetch para extrair conteúdo completo de URLs específicas

### Ferramenta Secundária: web-fetch (imageFetch)

**Quando usar:**
- Após WebSearch retornar URLs interessantes
- Para extrair conteúdo completo de artigos/papers
- Quando precisar de texto completo (não apenas snippet)

**Como usar:**
```javascript
imageFetch({
  url: "https://example.com/article",
  text: { maxLength: 30000 }
})
```

### Ferramenta Terciária: context7

**Quando usar:**
- Documentação de bibliotecas (React, TypeScript, etc)
- Apenas para Fases 2-5 do código (não relevante para relatório)

---

## Lições Aprendidas

### O que funcionou:
✅ WebSearch nativo é confiável e suficiente
✅ Documentação sistemática em `docs/fontes_faseN.md`
✅ Queries paralelas maximizam eficiência
✅ Backup de configuração antes de mudanças

### O que não funcionou:
❌ Servidores MCP remotos via `mcp-remote`
❌ Formato HTTP para servidores MCP
❌ API keys do Brave Search fornecidas

### O que evitar no futuro:
❌ Gastar tempo excessivo configurando ferramentas alternativas
❌ Múltiplas reinicializações sem validar funcionalidade primeiro
❌ Assumir que pacotes MCP funcionarão sem testar

### O que fazer diferente:
✅ Validar que ferramenta funciona ANTES de configurar
✅ Ter plano B (WebSearch) desde o início
✅ Limitar tentativas de configuração (máximo 2 reinicializações)

---

## Impacto na Fase 2

**Pesquisas existentes:** Mantidas (30 fontes de alta qualidade)

**Próximos passos:**
1. ✅ Marcar teste de ferramentas como concluído
2. ✅ Atualizar `docs/politica_busca.md` com decisão final
3. ✅ Continuar escrevendo Seção 7.5 sobre IA Generativa
4. ✅ Usar WebSearch para queries adicionais se necessário

**Qualidade esperada ao final da Fase 2:**
- Baseline: 8.0/10 (após Fase 1)
- Target: 8.4/10 (após Fase 2)
- Impacto: +0.4 pontos

**Estimativa de fontes adicionais necessárias:**
- Já coletadas: 30 fontes
- Target total: 40-50 fontes
- Faltam: 10-20 fontes (2-3 queries adicionais)

---

## Recomendações Futuras

### Para o projeto:
1. **Manter WebSearch como ferramenta principal**
   - Confiável, rápida, eficaz
   - Não depende de configuração externa
   - Resultados de alta qualidade

2. **Não tentar configurar Tavily/Exa novamente**
   - Incompatibilidade com Claude Code atual
   - Tempo gasto não justifica benefício marginal

3. **Obter API key válida do Brave (opcional)**
   - Apenas se houver necessidade específica
   - WebSearch é suficiente para 99% dos casos

### Para usuários Claude Code:
1. **Sempre testar ferramentas MCP antes de confiar nelas**
2. **Preferir ferramentas nativas quando possível**
3. **Ter plano B para ferramentas críticas**
4. **Documentar problemas de compatibilidade**

---

## Conclusão

**WebSearch (nativo) é a ferramenta ideal para pesquisa acadêmica neste projeto.**

Após 3 reinicializações e múltiplas tentativas de configuração, ficou claro que:
- Servidores MCP remotos não funcionam no ambiente atual
- WebSearch já forneceu resultados excelentes (30 fontes de alta qualidade)
- ROI de continuar tentando configurar alternativas é negativo

**Decisão final:** Continuar Fase 2 usando WebSearch exclusivamente.

**Status das pesquisas:** ✅ Suficientes (não precisa refazer)

**Próximo passo:** Retomar escrita da Seção 7.5 sobre IA Generativa.

---

**Última atualização:** 2026-01-09 14:30
**Tempo total gasto em configuração:** ~2 horas
**ROI:** Negativo (mas aprendizado valioso sobre limitações MCP)
