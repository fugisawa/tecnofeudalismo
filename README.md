# A máquina de captura

Dossiê investigativo sobre como plataformas, hyperscalers, bilionários e IA corroem democracia, economia e Estado — e o que já fizeram ao Brasil. Projeto em duas fases: os **documentos** (fase 1, versão 3.1) e um **site interativo** (fase 2, em construção). A pasta mantém o nome histórico `tecnofeudalismo`.

## Por onde começar

| Documento | O que é |
| --- | --- |
| [`dossie/tecnofeudalismo.md`](dossie/tecnofeudalismo.md) | O dossiê-mãe ("A máquina de captura", 3.1, jul/2026): as peças, as engrenagens, os efeitos, o laboratório brasileiro — com contraditório e critérios de falseabilidade |
| [`dossie/manual-decodificado.md`](dossie/manual-decodificado.md) | Documento-irmão: o repertório estratégico das plataformas decodificado em 6 jogadas, nas palavras das próprias empresas |
| [`dossie/briefings/`](dossie/briefings/README.md) | 5 briefings curtos e autossuficientes — os quatro mecanismos + as plataformas na eleição de 2026 (índice no README) |
| [`dossie/ensaios/`](dossie/ensaios/) | Ensaios derivados (discurso e intenção; survivalismo bilionário) |
| [`dossie/perfis/`](dossie/perfis/) | Perfis investigativos (visionário ou grifter) |
| [`dossie/registro-de-correcoes.md`](dossie/registro-de-correcoes.md) | A validação claim a claim que separou a v0.8 da 3.0 (29 confirmadas, 23 corrigidas, 7 desatualizadas) |

## Estrutura do repositório

- `dossie/` — todos os documentos finais da fase 1
- `dados/` — `atores-expansao.json`: grafo de 190+ atores com vínculos tipados (alimenta o Anexo A do dossiê e o site)
- `prototipos/` — `mapa-rede.tsx`: protótipo D3 do mapa de rede (insumo da fase 2)
- `site/` — o site da fase 2 (Astro + React + D3)
- `arquivo/` — material superado: a v0.8 original e rascunhos preservados por rastreabilidade

## Método

Toda afirmação factual carrega tag de confiança ([Confirmado]/[Reportado]/[Estimado]/[Contestado]/[Não corroborado]) e fonte linkada. Distinções de rigor: anunciado ≠ operacional; alegado ≠ provado em juízo; declaração corporativa nunca é evidência; relação documentada ≠ coordenação. O histórico de validação vive no registro de correções — o corpo dos documentos não carrega marcas de processo editorial. O debate teórico sobre os rótulos (tecnofeudalismo, capitalismo de vigilância) vive no Anexo B do dossiê; o corpo fala de mecanismos.
