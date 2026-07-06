import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';

const W = 1180, H = 820;

const CLUSTERS = {
  techElite:    { label: 'Elite Tech & Investidores', fill: '#dbeafe', stroke: '#2563eb', cx: 400, cy: 320 },
  plataformas:  { label: 'Plataformas & Corporações', fill: '#d1fae5', stroke: '#059669', cx: 600, cy: 500 },
  ideologos:    { label: 'Ideólogos', fill: '#fee2e2', stroke: '#dc2626', cx: 830, cy: 195 },
  ideologias:   { label: 'Ideologias', fill: '#f3e8ff', stroke: '#9333ea', cx: 985, cy: 360 },
  politica:     { label: 'Política (EUA)', fill: '#ffedd5', stroke: '#ea580c', cx: 890, cy: 600 },
  inteligencia: { label: 'Inteligência & Defesa', fill: '#e0e7ff', stroke: '#4f46e5', cx: 330, cy: 645 },
  brasil:       { label: 'Brasil', fill: '#fef9c3', stroke: '#ca8a04', cx: 625, cy: 745 },
  criticos:     { label: 'Sociedade Civil & Críticos', fill: '#f1f5f9', stroke: '#64748b', cx: 145, cy: 425 },
};

const TIPOS = {
  financeira:  { label: 'Financeira', color: '#16a34a', dash: null },
  propriedade: { label: 'Propriedade / Controle', color: '#92400e', dash: null },
  ideologica:  { label: 'Ideológica', color: '#2563eb', dash: '5,4' },
  uso:         { label: 'Uso / Contrato', color: '#7c3aed', dash: '2,4' },
  cia:         { label: 'Inteligência / CIA', color: '#db2777', dash: '8,4' },
  critica:     { label: 'Crítica / Oposição', color: '#dc2626', dash: null },
  brasil:      { label: 'Vínculo Brasil', color: '#ca8a04', dash: null },
};

const NODES = [
  // Elite Tech & Investidores
  { id: 'thiel', label: 'Peter Thiel', cluster: 'techElite', imp: 10, desc: 'Co-fundador do PayPal e da Palantir; "kingmaker" republicano. Financiou Vance ($15M) e o Urbit de Yarvin. 1º investidor do Facebook.' },
  { id: 'musk', label: 'Elon Musk', cluster: 'techElite', imp: 10, desc: 'Dono de X, Tesla, SpaceX e xAI. Ex-líder do DOGE (jan–mai 2025). Maior doador de 2024 (~$290M).' },
  { id: 'ellison', label: 'Larry Ellison', cluster: 'techElite', imp: 9, desc: 'Co-fundador da Oracle (1977, com contrato da CIA). Chamado de "presidente-sombra". Lidera o consórcio do TikTok; doou $130M ao TBI.' },
  { id: 'altman', label: 'Sam Altman', cluster: 'techElite', imp: 8, desc: 'CEO da OpenAI; co-fundador do Stargate. Presente na posse de Trump (2025).' },
  { id: 'zuckerberg', label: 'Mark Zuckerberg', cluster: 'techElite', imp: 8, desc: 'CEO da Meta. Em 2025 encerrou a checagem de fatos, recuou em DEI, doou $1M à posse e levou Dana White ao conselho.' },
  { id: 'bezos', label: 'Jeff Bezos', cluster: 'techElite', imp: 7, desc: 'Fundador da Amazon, dono do Washington Post. Vetou o apoio editorial a Harris; aproximou-se de Trump.' },
  { id: 'pichai', label: 'Sundar Pichai', cluster: 'techElite', imp: 6, desc: 'CEO da Alphabet/Google. Presente na posse; Google doou ao fundo de posse.' },
  { id: 'cook', label: 'Tim Cook', cluster: 'techElite', imp: 5, desc: 'CEO da Apple. Presente na posse; doação pessoal a Trump.' },
  { id: 'sacks', label: 'David Sacks', cluster: 'techElite', imp: 7, desc: '"Czar de IA e Cripto" da Casa Branca. Ex-COO do PayPal; sócio da Craft Ventures.' },
  { id: 'andreessen', label: 'Marc Andreessen', cluster: 'techElite', imp: 8, desc: 'Sócio da a16z. Autor do "Manifesto Tecno-Otimista". Recruta quadros para o governo Trump.' },
  { id: 'karp', label: 'Alex Karp', cluster: 'techElite', imp: 7, desc: 'CEO e co-fundador da Palantir. Defende a "cadeia de morte digital".' },
  { id: 'lonsdale', label: 'Joe Lonsdale', cluster: 'techElite', imp: 5, desc: 'Co-fundador da Palantir e da 8VC. PayPal Mafia.' },
  { id: 'luckey', label: 'Palmer Luckey', cluster: 'techElite', imp: 5, desc: 'Fundador da Oculus e da Anduril. Protegido de Thiel.' },
  { id: 'mercer', label: 'Rebekah Mercer', cluster: 'techElite', imp: 6, desc: 'Financiadora da extrema-direita. Co-fundou o Parler; financia Breitbart, Heritage e a Cambridge Analytica.' },
  { id: 'srinivasan', label: 'Balaji Srinivasan', cluster: 'techElite', imp: 5, desc: 'Ex-CTO da Coinbase. Autor de "The Network State".' },

  // Plataformas & Corporações
  { id: 'x', label: 'X (Twitter)', cluster: 'plataformas', imp: 8, desc: 'Rede social comprada por Musk em 2022 ($44B). Canal central de Trump e aliados.' },
  { id: 'meta', label: 'Meta', cluster: 'plataformas', imp: 8, desc: 'Dona de Facebook, Instagram e WhatsApp; modelo LLaMA. Capex de IA >$100B/ano.' },
  { id: 'google', label: 'Google / Alphabet', cluster: 'plataformas', imp: 8, desc: 'Busca, YouTube, Android, Gemini/DeepMind, nuvem/TPU. Receita ~$350B (2024).' },
  { id: 'amazon', label: 'Amazon / AWS', cluster: 'plataformas', imp: 7, desc: 'Maior provedor de nuvem. Capex de IA de ~$200B previsto para 2026.' },
  { id: 'microsoft', label: 'Microsoft', cluster: 'plataformas', imp: 8, desc: 'Azure; principal investidora e parceira de nuvem da OpenAI.' },
  { id: 'apple', label: 'Apple', cluster: 'plataformas', imp: 6, desc: 'iPhone/App Store; postura mais reservada, mas Cook aproximou-se de Trump.' },
  { id: 'oracle', label: 'Oracle (OCI)', cluster: 'plataformas', imp: 9, desc: 'Hyperscaler. Nasceu (1977) de um contrato da CIA. Pilar do Stargate; supervisiona o TikTok.' },
  { id: 'palantir', label: 'Palantir', cluster: 'plataformas', imp: 9, desc: 'Vigilância/dados. Nasceu com $2M da CIA (In-Q-Tel). Gotham, Foundry, ImmigrationOS. Valor >$400B.' },
  { id: 'anduril', label: 'Anduril', cluster: 'plataformas', imp: 6, desc: 'Defesa autônoma e vigilância de fronteira. Fundada por Luckey; $1B do Founders Fund (2025).' },
  { id: 'openai', label: 'OpenAI', cluster: 'plataformas', imp: 8, desc: 'Criadora do ChatGPT. Virou for-profit (out/2025). Lidera o Stargate.' },
  { id: 'xai', label: 'xAI', cluster: 'plataformas', imp: 6, desc: 'IA de Musk (Grok), integrada ao X.' },
  { id: 'tiktok', label: 'TikTok EUA', cluster: 'plataformas', imp: 6, desc: '80,1% vendido a consórcio liderado pela Oracle; algoritmo "retreinado".' },
  { id: 'rumble', label: 'Rumble', cluster: 'plataformas', imp: 4, desc: 'Plataforma de vídeo alt-right. Investimento de Thiel e da a16z.' },
  { id: 'breitbart', label: 'Breitbart News', cluster: 'plataformas', imp: 5, desc: 'Site alt-right financiado por Mercer; dirigido por Bannon.' },
  { id: 'cambridge', label: 'Cambridge Analytica', cluster: 'plataformas', imp: 6, desc: 'Usou dados do Facebook para manipulação eleitoral (Trump 2016, Brexit). Encerrada em 2018.' },
  { id: 'spacex', label: 'SpaceX / Starlink', cluster: 'plataformas', imp: 6, desc: 'Foguetes e internet por satélite de Musk. Contratos com governo e defesa.' },
  { id: 'nvidia', label: 'NVIDIA', cluster: 'plataformas', imp: 7, desc: 'Dominante em GPUs de IA. Acordos "circulares" com a OpenAI.' },
  { id: 'stargate', label: 'Stargate', cluster: 'plataformas', imp: 6, desc: 'JV de IA ($500B): OpenAI 40%, SoftBank 40%, Oracle, MGX. Anunciada por Trump (jan/2025).' },
  { id: 'softbank', label: 'SoftBank', cluster: 'plataformas', imp: 5, desc: 'Conglomerado de Masayoshi Son; co-líder financeiro do Stargate.' },

  // Ideólogos
  { id: 'yarvin', label: 'Curtis Yarvin', cluster: 'ideologos', imp: 8, desc: '"Mencius Moldbug". Arquiteto do Dark Enlightenment; criou "A Catedral" e o RAGE.' },
  { id: 'land', label: 'Nick Land', cluster: 'ideologos', imp: 5, desc: 'Filósofo; cunhou "Dark Enlightenment"; aceleracionismo.' },
  { id: 'bannon', label: 'Steve Bannon', cluster: 'ideologos', imp: 8, desc: 'Ex-estrategista de Trump; co-fundou a Cambridge Analytica; dirigiu o Breitbart; assessorou Bolsonaro.' },
  { id: 'anton', label: 'Michael Anton', cluster: 'ideologos', imp: 5, desc: 'Diretor de Planejamento de Políticas do Depto. de Estado; entrevista Yarvin.' },

  // Ideologias
  { id: 'darkenlight', label: 'Dark Enlightenment (NRx)', cluster: 'ideologias', imp: 7, desc: 'Movimento neorreacionário antidemocrático; defende a "monarquia-CEO".' },
  { id: 'technoopt', label: 'Tecno-Otimismo', cluster: 'ideologias', imp: 6, desc: 'Manifesto de Andreessen (2023): tecnologia sem limites como motor do progresso.' },
  { id: 'eacc', label: 'Aceleracionismo (e/acc)', cluster: 'ideologias', imp: 6, desc: 'Progresso tecnológico irrestrito; "acelerar ou morrer" (G. Verdon / Beff Jezos).' },
  { id: 'networkstate', label: 'Network State', cluster: 'ideologias', imp: 5, desc: 'Tese de Balaji: comunidades digitais que se tornam Estados soberanos.' },
  { id: 'broligarchy', label: 'Broligarquia', cluster: 'ideologias', imp: 5, desc: 'Aliança de bilionários tech com o poder político; "tecnofeudalismo".' },

  // Política (EUA)
  { id: 'trump', label: 'Donald Trump', cluster: 'politica', imp: 10, desc: '47º Presidente dos EUA (2025–). Aproximou Big Tech e extrema-direita.' },
  { id: 'vance', label: 'JD Vance', cluster: 'politica', imp: 9, desc: 'Vice-Presidente. Protegido de Thiel; influenciado por Yarvin.' },
  { id: 'vought', label: 'Russell Vought', cluster: 'politica', imp: 6, desc: 'Diretor do OMB; arquiteto-chefe do Projeto 2025.' },
  { id: 'heritage', label: 'Heritage Foundation', cluster: 'politica', imp: 6, desc: 'Think tank conservador; criou o Projeto 2025; financiado por Mercer.' },
  { id: 'claremont', label: 'Instituto Claremont', cluster: 'politica', imp: 5, desc: 'Think tank que dá lastro intelectual ao MAGA.' },
  { id: 'doge', label: 'DOGE', cluster: 'politica', imp: 7, desc: 'Dept. of Government Efficiency. Musk liderou; cortou ~260 mil empregos federais.' },
  { id: 'project2025', label: 'Projeto 2025', cluster: 'politica', imp: 6, desc: 'Plano de reestruturação do Estado (Schedule F, demissões em massa).' },
  { id: 'maga', label: 'GOP / MAGA', cluster: 'politica', imp: 7, desc: 'Facção trumpista do Partido Republicano.' },

  // Inteligência & Defesa
  { id: 'cia', label: 'CIA', cluster: 'inteligencia', imp: 7, desc: 'Agência de inteligência. Contrato fundador da Oracle (1977); usa o Palantir Gotham.' },
  { id: 'inqtel', label: 'In-Q-Tel', cluster: 'inteligencia', imp: 7, desc: 'Braço de venture capital da CIA. Financiou Palantir, Anduril e a Keyhole (Google Earth).' },
  { id: 'ice', label: 'ICE', cluster: 'inteligencia', imp: 6, desc: 'Imigração. Contrato de $30M com a Palantir (ImmigrationOS).' },
  { id: 'dod', label: 'DoD / Pentágono', cluster: 'inteligencia', imp: 6, desc: 'Contratos: Palantir ($795M), Oracle (bilhões), Anduril.' },
  { id: 'nsa', label: 'NSA', cluster: 'inteligencia', imp: 5, desc: 'Agência de segurança; usa plataformas da Palantir.' },

  // Brasil
  { id: 'tbi', label: 'Tony Blair Institute', cluster: 'brasil', imp: 8, desc: 'Recebeu $130M de Ellison; 21+ reuniões com o governo Lula; promove a IA da Oracle no Sul Global.' },
  { id: 'blair', label: 'Tony Blair', cluster: 'brasil', imp: 7, desc: 'Ex-PM britânico. Reuniu-se com Lula, Esther Dweck e Marina Silva; férias com Ellison.' },
  { id: 'temer', label: 'Michel Temer', cluster: 'brasil', imp: 7, desc: 'Ex-presidente. Contratado pelo Google contra o PL das Fake News (2023); antes, pela Huawei (2021).' },
  { id: 'bolsonaro', label: 'Jair Bolsonaro', cluster: 'brasil', imp: 7, desc: 'Ex-presidente. A campanha de 2018 usou táticas no estilo Cambridge Analytica.' },
  { id: 'edubolso', label: 'Eduardo Bolsonaro', cluster: 'brasil', imp: 5, desc: 'Deputado; encontros com Bannon em Nova York (2018, 2021).' },
  { id: 'googlebr', label: 'Google Brasil', cluster: 'brasil', imp: 5, desc: 'Campanha contra o PL 2630; alvo de inquérito no STF.' },
  { id: 'metabr', label: 'Meta Brasil', cluster: 'brasil', imp: 5, desc: 'Lobby contra a regulação; lobista criou o documento da "Bíblia censurada".' },
  { id: 'moraes', label: 'Alexandre de Moraes (STF)', cluster: 'brasil', imp: 6, desc: 'Indicado por Temer ao STF; abriu inquérito sobre o Google; defende responsabilizar plataformas.' },
  { id: 'pl2630', label: 'PL 2630 (Fake News)', cluster: 'brasil', imp: 5, desc: 'Projeto de regulação de plataformas, travado após o lobby das Big Techs.' },

  // Sociedade Civil & Críticos
  { id: 'haugen', label: 'Frances Haugen', cluster: 'criticos', imp: 5, desc: 'Whistleblower da Meta (2021); expôs danos internos.' },
  { id: 'gebru', label: 'Timnit Gebru', cluster: 'criticos', imp: 5, desc: 'Ex-Google; demitida após criticar o viés de IA. Fundou o DAIR.' },
  { id: 'zuboff', label: 'Shoshana Zuboff', cluster: 'criticos', imp: 5, desc: 'Autora de "A Era do Capitalismo de Vigilância".' },
  { id: 'aclu', label: 'ACLU', cluster: 'criticos', imp: 5, desc: 'Processa a Palantir por contratos de vigilância com o ICE.' },
  { id: 'eff', label: 'EFF', cluster: 'criticos', imp: 4, desc: 'Defende liberdades civis digitais e privacidade.' },
];

const LINKS = [
  // PayPal Mafia / Thiel
  { s: 'thiel', t: 'musk', tipo: 'financeira', peso: 3, desc: 'Co-fundaram o PayPal; o Founders Fund investiu em SpaceX, Neuralink e Boring Co.' },
  { s: 'thiel', t: 'sacks', tipo: 'ideologica', peso: 2, desc: 'PayPal Mafia; co-autores de "The Diversity Myth" (1995).' },
  { s: 'thiel', t: 'vance', tipo: 'financeira', peso: 3, desc: '$15M na campanha de Vance ao Senado (2022) — recorde para um candidato.' },
  { s: 'thiel', t: 'yarvin', tipo: 'financeira', peso: 2, desc: 'Thiel financiou o projeto Urbit de Yarvin.' },
  { s: 'thiel', t: 'palantir', tipo: 'propriedade', peso: 3, desc: 'Co-fundador e presidente do conselho da Palantir.' },
  { s: 'thiel', t: 'anduril', tipo: 'financeira', peso: 3, desc: 'Founders Fund liderou rodadas; $1B em jun/2025.' },
  { s: 'thiel', t: 'karp', tipo: 'ideologica', peso: 2, desc: 'Co-fundaram a Palantir (2003).' },
  { s: 'thiel', t: 'trump', tipo: 'ideologica', peso: 2, desc: 'Apoiador em 2016; articulou a indicação de Vance a vice.' },
  { s: 'thiel', t: 'andreessen', tipo: 'ideologica', peso: 2, desc: 'Aliados; recrutam quadros para o governo Trump.' },
  { s: 'thiel', t: 'rumble', tipo: 'financeira', peso: 1, desc: 'Investimento via Founders Fund.' },
  { s: 'thiel', t: 'openai', tipo: 'financeira', peso: 1, desc: 'Investimento via Founders Fund.' },
  // Musk
  { s: 'musk', t: 'x', tipo: 'propriedade', peso: 3, desc: 'Comprou o Twitter (2022) e renomeou para X.' },
  { s: 'musk', t: 'spacex', tipo: 'propriedade', peso: 3, desc: 'Fundador e CEO.' },
  { s: 'musk', t: 'xai', tipo: 'propriedade', peso: 3, desc: 'Fundador; integrou ao X.' },
  { s: 'musk', t: 'doge', tipo: 'propriedade', peso: 3, desc: 'Liderou o DOGE de jan a mai/2025.' },
  { s: 'musk', t: 'trump', tipo: 'ideologica', peso: 3, desc: 'Aliado em 2024; rompeu em jun/2025; reconciliou em set/2025.' },
  { s: 'musk', t: 'openai', tipo: 'financeira', peso: 2, desc: 'Co-fundou a OpenAI (2015); saiu do conselho (2018).' },
  { s: 'musk', t: 'sacks', tipo: 'financeira', peso: 2, desc: 'A Craft Ventures investiu na xAI; amigos de longa data.' },
  { s: 'musk', t: 'technoopt', tipo: 'ideologica', peso: 2, desc: '"Governo é a maior corporação"; alinhado ao tecno-otimismo.' },
  // Ellison / Oracle
  { s: 'ellison', t: 'oracle', tipo: 'propriedade', peso: 3, desc: 'Co-fundador e CTO; detém ~40% das ações.' },
  { s: 'ellison', t: 'tbi', tipo: 'financeira', peso: 3, desc: 'A fundação de Ellison doou $130M ao TBI (2021–2023).' },
  { s: 'ellison', t: 'trump', tipo: 'ideologica', peso: 3, desc: 'Chamado de "CEO de tudo"; visitas frequentes à Casa Branca.' },
  { s: 'ellison', t: 'tiktok', tipo: 'propriedade', peso: 3, desc: 'Lidera o consórcio que comprou 80,1% do TikTok EUA.' },
  { s: 'ellison', t: 'stargate', tipo: 'propriedade', peso: 2, desc: 'Co-fundador do Stargate.' },
  { s: 'ellison', t: 'blair', tipo: 'ideologica', peso: 2, desc: 'Férias juntos na Sardenha (2024).' },
  { s: 'oracle', t: 'cia', tipo: 'cia', peso: 3, desc: 'A Oracle nasceu (1977) de um contrato da CIA p/ bancos de dados relacionais.' },
  { s: 'oracle', t: 'stargate', tipo: 'propriedade', peso: 3, desc: 'Pilar do Stargate; acordo de ~$300B com a OpenAI.' },
  { s: 'oracle', t: 'tiktok', tipo: 'uso', peso: 3, desc: 'Hospeda os dados e supervisiona o algoritmo do TikTok EUA.' },
  { s: 'oracle', t: 'dod', tipo: 'uso', peso: 2, desc: 'Contratos de nuvem com o Pentágono.' },
  { s: 'oracle', t: 'tbi', tipo: 'brasil', peso: 3, desc: 'Ex-funcionários dizem que o TBI faz "venda" de produtos Oracle a governos.' },
  // OpenAI / Stargate / infra de IA
  { s: 'altman', t: 'openai', tipo: 'propriedade', peso: 3, desc: 'CEO da OpenAI.' },
  { s: 'altman', t: 'stargate', tipo: 'propriedade', peso: 3, desc: 'Co-fundador do Stargate.' },
  { s: 'openai', t: 'stargate', tipo: 'propriedade', peso: 3, desc: 'Detém 40%; responsabilidade operacional.' },
  { s: 'softbank', t: 'stargate', tipo: 'financeira', peso: 3, desc: 'Detém 40%; responsabilidade financeira.' },
  { s: 'openai', t: 'microsoft', tipo: 'financeira', peso: 3, desc: 'Microsoft é principal investidora e provedora de nuvem.' },
  { s: 'openai', t: 'nvidia', tipo: 'uso', peso: 3, desc: 'Acordo de ~10GW; criticado como "circular".' },
  { s: 'openai', t: 'oracle', tipo: 'uso', peso: 3, desc: 'Acordo de nuvem de ~$300B.' },
  { s: 'nvidia', t: 'stargate', tipo: 'uso', peso: 2, desc: 'Parceira de tecnologia do Stargate.' },
  { s: 'altman', t: 'trump', tipo: 'ideologica', peso: 2, desc: 'Stargate anunciado na Casa Branca; presente na posse.' },
  // Big Tech: propriedade e alinhamento
  { s: 'zuckerberg', t: 'meta', tipo: 'propriedade', peso: 3, desc: 'CEO e controlador.' },
  { s: 'pichai', t: 'google', tipo: 'propriedade', peso: 3, desc: 'CEO da Alphabet/Google.' },
  { s: 'bezos', t: 'amazon', tipo: 'propriedade', peso: 3, desc: 'Fundador; controla o Washington Post.' },
  { s: 'cook', t: 'apple', tipo: 'propriedade', peso: 3, desc: 'CEO da Apple.' },
  { s: 'zuckerberg', t: 'trump', tipo: 'ideologica', peso: 2, desc: 'Reset MAGA: fim da checagem, recuo em DEI, $1M à posse, Dana White no conselho.' },
  { s: 'bezos', t: 'trump', tipo: 'ideologica', peso: 2, desc: 'Vetou o apoio do WaPo a Harris; aproximou-se de Trump.' },
  { s: 'pichai', t: 'trump', tipo: 'ideologica', peso: 1, desc: 'Presente na posse; Google doou ao fundo de posse.' },
  { s: 'cook', t: 'trump', tipo: 'ideologica', peso: 1, desc: 'Presente na posse; doação pessoal.' },
  { s: 'karp', t: 'palantir', tipo: 'propriedade', peso: 3, desc: 'CEO da Palantir.' },
  { s: 'lonsdale', t: 'palantir', tipo: 'propriedade', peso: 2, desc: 'Co-fundador.' },
  { s: 'luckey', t: 'anduril', tipo: 'propriedade', peso: 3, desc: 'Fundador e CEO.' },
  { s: 'palantir', t: 'anduril', tipo: 'ideologica', peso: 2, desc: 'Consórcio de defesa de nova geração (com SpaceX, OpenAI).' },
  { s: 'spacex', t: 'dod', tipo: 'uso', peso: 2, desc: 'Contratos de lançamento e Starlink para defesa.' },
  // Ideologias
  { s: 'srinivasan', t: 'networkstate', tipo: 'propriedade', peso: 3, desc: 'Autor de "The Network State".' },
  { s: 'srinivasan', t: 'thiel', tipo: 'ideologica', peso: 1, desc: 'Alinhamento libertário-tecnológico.' },
  { s: 'yarvin', t: 'darkenlight', tipo: 'propriedade', peso: 3, desc: 'Principal articulador do movimento.' },
  { s: 'land', t: 'darkenlight', tipo: 'propriedade', peso: 3, desc: 'Cunhou o termo "Dark Enlightenment".' },
  { s: 'land', t: 'yarvin', tipo: 'ideologica', peso: 2, desc: 'Inspiração mútua; aceleracionismo.' },
  { s: 'andreessen', t: 'technoopt', tipo: 'propriedade', peso: 3, desc: 'Autor do "Manifesto Tecno-Otimista".' },
  { s: 'andreessen', t: 'eacc', tipo: 'ideologica', peso: 3, desc: 'Abraça o aceleracionismo efetivo.' },
  { s: 'yarvin', t: 'vance', tipo: 'ideologica', peso: 3, desc: 'Vance afirma que Yarvin moldou seu pensamento.' },
  { s: 'yarvin', t: 'bannon', tipo: 'ideologica', peso: 2, desc: 'Bannon leu e admira a obra de Yarvin.' },
  { s: 'yarvin', t: 'anton', tipo: 'ideologica', peso: 2, desc: 'Anton entrevista Yarvin em podcasts.' },
  { s: 'darkenlight', t: 'doge', tipo: 'ideologica', peso: 2, desc: 'O DOGE é visto como um "hard reboot" do Estado à la Yarvin.' },
  { s: 'darkenlight', t: 'vance', tipo: 'ideologica', peso: 1, desc: 'Vance associado às ideias neorreacionárias.' },
  { s: 'broligarchy', t: 'trump', tipo: 'ideologica', peso: 2, desc: 'Aliança de bilionários tech com o governo.' },
  { s: 'broligarchy', t: 'musk', tipo: 'ideologica', peso: 1, desc: 'Musk como face da "broligarquia".' },
  { s: 'technoopt', t: 'eacc', tipo: 'ideologica', peso: 1, desc: 'Tecno-otimismo e e/acc são correntes irmãs.' },
  // Mercer
  { s: 'mercer', t: 'cambridge', tipo: 'financeira', peso: 3, desc: 'Principal financiadora da Cambridge Analytica.' },
  { s: 'mercer', t: 'breitbart', tipo: 'financeira', peso: 3, desc: 'Investidora do Breitbart.' },
  { s: 'mercer', t: 'heritage', tipo: 'financeira', peso: 2, desc: 'Doações à Heritage Foundation.' },
  { s: 'mercer', t: 'trump', tipo: 'financeira', peso: 2, desc: 'Financia super-PACs pró-Trump.' },
  { s: 'bannon', t: 'cambridge', tipo: 'propriedade', peso: 2, desc: 'Co-fundador e ex-vice-presidente.' },
  { s: 'bannon', t: 'breitbart', tipo: 'propriedade', peso: 3, desc: 'Ex-diretor executivo.' },
  // Política
  { s: 'vance', t: 'trump', tipo: 'propriedade', peso: 3, desc: 'Vice-Presidente.' },
  { s: 'vought', t: 'project2025', tipo: 'propriedade', peso: 3, desc: 'Arquiteto-chefe.' },
  { s: 'vought', t: 'heritage', tipo: 'ideologica', peso: 2, desc: 'Ligado à Heritage / Center for Renewing America.' },
  { s: 'heritage', t: 'project2025', tipo: 'propriedade', peso: 3, desc: 'A Heritage criou o Projeto 2025.' },
  { s: 'project2025', t: 'maga', tipo: 'ideologica', peso: 2, desc: 'Programa de governo do trumpismo.' },
  { s: 'claremont', t: 'anton', tipo: 'ideologica', peso: 2, desc: 'Anton é afiliado ao Claremont.' },
  { s: 'claremont', t: 'maga', tipo: 'ideologica', peso: 1, desc: 'Lastro intelectual do MAGA.' },
  { s: 'sacks', t: 'trump', tipo: 'propriedade', peso: 3, desc: 'Czar de IA e Cripto da Casa Branca.' },
  { s: 'maga', t: 'trump', tipo: 'propriedade', peso: 3, desc: 'Facção liderada por Trump.' },
  { s: 'doge', t: 'trump', tipo: 'propriedade', peso: 2, desc: 'Iniciativa do governo Trump.' },
  // Inteligência
  { s: 'inqtel', t: 'cia', tipo: 'propriedade', peso: 3, desc: 'Braço de venture capital da CIA.' },
  { s: 'inqtel', t: 'palantir', tipo: 'cia', peso: 3, desc: '$2M de capital semente (2004).' },
  { s: 'inqtel', t: 'anduril', tipo: 'cia', peso: 2, desc: 'Investimento inicial.' },
  { s: 'palantir', t: 'ice', tipo: 'uso', peso: 3, desc: '$30M pelo ImmigrationOS.' },
  { s: 'palantir', t: 'dod', tipo: 'uso', peso: 3, desc: 'Contrato de $795M.' },
  { s: 'palantir', t: 'cia', tipo: 'uso', peso: 3, desc: 'Gotham em operações de contraterrorismo.' },
  { s: 'palantir', t: 'nsa', tipo: 'uso', peso: 2, desc: 'Plataformas usadas pela NSA.' },
  // Brasil
  { s: 'tbi', t: 'blair', tipo: 'propriedade', peso: 3, desc: 'Blair fundou o instituto.' },
  { s: 'tbi', t: 'trump', tipo: 'ideologica', peso: 1, desc: 'O TBI trabalhou com Trump/Kushner no plano para Gaza.' },
  { s: 'temer', t: 'googlebr', tipo: 'brasil', peso: 3, desc: 'Contratado para o lobby contra o PL 2630.' },
  { s: 'temer', t: 'moraes', tipo: 'ideologica', peso: 2, desc: 'Temer indicou Moraes ao STF (2017).' },
  { s: 'googlebr', t: 'google', tipo: 'propriedade', peso: 2, desc: 'Subsidiária brasileira.' },
  { s: 'metabr', t: 'meta', tipo: 'propriedade', peso: 2, desc: 'Subsidiária brasileira.' },
  { s: 'googlebr', t: 'pl2630', tipo: 'critica', peso: 2, desc: 'Campanha na página de busca contra o PL.' },
  { s: 'metabr', t: 'pl2630', tipo: 'critica', peso: 2, desc: 'Lobby e doc da "Bíblia censurada" contra o PL.' },
  { s: 'moraes', t: 'pl2630', tipo: 'ideologica', peso: 2, desc: 'Defende responsabilizar plataformas; abriu inquérito.' },
  { s: 'moraes', t: 'googlebr', tipo: 'critica', peso: 2, desc: 'Inquérito do STF sobre a campanha do Google.' },
  { s: 'bannon', t: 'edubolso', tipo: 'brasil', peso: 3, desc: 'Encontros em Nova York (2018, 2021).' },
  { s: 'edubolso', t: 'bolsonaro', tipo: 'propriedade', peso: 3, desc: 'Filho e articulador internacional.' },
  { s: 'cambridge', t: 'bolsonaro', tipo: 'brasil', peso: 2, desc: 'Táticas semelhantes na campanha de 2018 (via WhatsApp).' },
  { s: 'bannon', t: 'bolsonaro', tipo: 'ideologica', peso: 2, desc: 'Conselheiro informal; elogios públicos.' },
  { s: 'bannon', t: 'maga', tipo: 'ideologica', peso: 2, desc: 'Exportou o modelo MAGA para a direita global.' },
  // Críticos
  { s: 'haugen', t: 'meta', tipo: 'critica', peso: 2, desc: 'Whistleblower; vazou documentos internos (2021).' },
  { s: 'gebru', t: 'google', tipo: 'critica', peso: 2, desc: 'Demitida após criticar o viés de IA.' },
  { s: 'gebru', t: 'openai', tipo: 'critica', peso: 1, desc: 'Críticas às práticas de desenvolvimento de IA.' },
  { s: 'zuboff', t: 'meta', tipo: 'critica', peso: 2, desc: 'Crítica ao modelo de capitalismo de vigilância.' },
  { s: 'aclu', t: 'palantir', tipo: 'critica', peso: 2, desc: 'Ação judicial sobre contratos com o ICE.' },
  { s: 'eff', t: 'palantir', tipo: 'critica', peso: 1, desc: 'Críticas à vigilância.' },
];

export default function RedeTecnoPolitica() {
  const svgRef = useRef(null);
  const zoomRef = useRef(null);
  const selRef = useRef({});
  const simRef = useRef(null);

  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filtroCluster, setFiltroCluster] = useState('all');
  const [filtroTipo, setFiltroTipo] = useState('all');
  const [labelMode, setLabelMode] = useState('key');
  const [showPanel, setShowPanel] = useState(true);

  const idToNode = useMemo(() => {
    const m = {};
    NODES.forEach(n => { m[n.id] = n; });
    return m;
  }, []);

  const adjacency = useMemo(() => {
    const m = new Map();
    NODES.forEach(n => m.set(n.id, new Set()));
    LINKS.forEach(l => { m.get(l.s).add(l.t); m.get(l.t).add(l.s); });
    return m;
  }, []);

  const tipoNodeSets = useMemo(() => {
    const m = {};
    Object.keys(TIPOS).forEach(t => { m[t] = new Set(); });
    LINKS.forEach(l => { m[l.tipo].add(l.s); m[l.tipo].add(l.t); });
    return m;
  }, []);

  const clusterNeighborSets = useMemo(() => {
    const m = {};
    Object.keys(CLUSTERS).forEach(c => {
      const s = new Set();
      NODES.forEach(n => {
        if (n.cluster === c) {
          s.add(n.id);
          adjacency.get(n.id).forEach(x => s.add(x));
        }
      });
      m[c] = s;
    });
    return m;
  }, [adjacency]);

  const R = useMemo(() => d3.scaleSqrt().domain([1, 10]).range([7, 27]), []);

  // Build the graph once
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simNodes = NODES.map(d => ({ ...d }));
    const simLinks = LINKS.map(l => ({ source: l.s, target: l.t, tipo: l.tipo, peso: l.peso, desc: l.desc }));

    simNodes.forEach(n => {
      const c = CLUSTERS[n.cluster];
      n.x = c.cx + (Math.random() - 0.5) * 120;
      n.y = c.cy + (Math.random() - 0.5) * 120;
    });

    const zoomLayer = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.4, 4])
      .filter(ev => {
        if (ev.type === 'mousedown' || ev.type === 'touchstart') {
          return !ev.target.closest('.node');
        }
        return true;
      })
      .on('zoom', ev => zoomLayer.attr('transform', ev.transform));
    svg.call(zoom);
    svg.on('click', () => setSelected(null));
    zoomRef.current = zoom;

    const linkSel = zoomLayer.append('g')
      .attr('fill', 'none')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', d => TIPOS[d.tipo].color)
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', d => TIPOS[d.tipo].dash);

    const nodeSel = zoomLayer.append('g')
      .selectAll('g.node')
      .data(simNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    const circleSel = nodeSel.append('circle')
      .attr('r', d => R(d.imp))
      .attr('fill', d => CLUSTERS[d.cluster].fill)
      .attr('stroke', d => CLUSTERS[d.cluster].stroke)
      .attr('stroke-width', d => (d.imp >= 8 ? 2.4 : 1.5));

    const labelSel = nodeSel.append('text')
      .attr('text-anchor', 'middle')
      .style('paint-order', 'stroke')
      .style('stroke', '#ffffff')
      .style('stroke-width', 3.2)
      .style('stroke-linejoin', 'round')
      .style('fill', '#0f172a')
      .style('font-weight', d => (d.imp >= 8 ? 700 : 600))
      .style('font-size', d => Math.min(13, 8 + d.imp * 0.5) + 'px')
      .style('pointer-events', 'none')
      .attr('transform', d => `translate(0, ${R(d.imp) + 12})`);

    labelSel.each(function (d) {
      const t = d3.select(this);
      const words = d.label.split(' ');
      if (d.label.length <= 15 || words.length === 1) {
        t.append('tspan').attr('x', 0).attr('dy', 0).text(d.label);
        return;
      }
      let best = 1, bestDiff = Infinity;
      for (let i = 1; i < words.length; i++) {
        const l1 = words.slice(0, i).join(' ').length;
        const l2 = words.slice(i).join(' ').length;
        const diff = Math.abs(l1 - l2);
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      }
      t.append('tspan').attr('x', 0).attr('dy', 0).text(words.slice(0, best).join(' '));
      t.append('tspan').attr('x', 0).attr('dy', '1.05em').text(words.slice(best).join(' '));
    });

    let dragMoved = false;
    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simLinks).id(d => d.id)
        .distance(d => 74 + (3 - d.peso) * 16)
        .strength(d => 0.14 + (d.peso - 1) * 0.1))
      .force('charge', d3.forceManyBody().strength(d => -150 - R(d.imp) * 7).distanceMax(440))
      .force('collide', d3.forceCollide().radius(d => R(d.imp) + 15).iterations(2))
      .force('x', d3.forceX(d => CLUSTERS[d.cluster].cx).strength(0.09))
      .force('y', d3.forceY(d => CLUSTERS[d.cluster].cy).strength(0.09))
      .velocityDecay(0.45)
      .alpha(0.9);

    simulation.on('tick', () => {
      simNodes.forEach(d => {
        d.x = Math.max(46, Math.min(W - 46, d.x));
        d.y = Math.max(34, Math.min(H - 40, d.y));
      });
      linkSel
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    const drag = d3.drag()
      .on('start', (ev, d) => { dragMoved = false; if (!ev.active) simulation.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (ev, d) => { dragMoved = true; d.fx = ev.x; d.fy = ev.y; })
      .on('end', (ev, d) => { if (!ev.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; });
    nodeSel.call(drag);

    nodeSel.on('click', (ev, d) => {
      ev.stopPropagation();
      if (dragMoved) return;
      setSelected(prev => (prev === d.id ? null : d.id));
    });
    nodeSel.on('mouseenter', (ev, d) => setHovered(d.id));
    nodeSel.on('mouseleave', () => setHovered(null));

    selRef.current = { linkSel, nodeSel, circleSel, labelSel };
    simRef.current = simulation;

    return () => {
      simulation.stop();
      svg.selectAll('*').remove();
    };
  }, [R]);

  // Styling: importance, filters and focus
  const applyStyles = useCallback(() => {
    const sel = selRef.current;
    if (!sel.circleSel) return;

    const getId = x => (typeof x === 'object' ? x.id : x);
    const focusId = hovered || selected;
    const cActive = filtroCluster !== 'all';
    const tActive = filtroTipo !== 'all';
    const cSet = cActive ? clusterNeighborSets[filtroCluster] : null;
    const tSet = tActive ? tipoNodeSets[filtroTipo] : null;
    const focusNodes = focusId ? new Set([focusId, ...adjacency.get(focusId)]) : null;

    const nodeVisible = n => {
      const cOK = !cActive || cSet.has(n.id);
      const tOK = !tActive || tSet.has(n.id);
      return cOK && tOK;
    };

    const nodeOp = n => {
      const vis = nodeVisible(n);
      if (!vis) return 0.06;
      if (focusId) return focusNodes.has(n.id) ? 1 : 0.12;
      return 1;
    };

    const labelOp = n => {
      const op = nodeOp(n);
      if (op < 0.9) return 0;
      let shown;
      if (labelMode === 'none') shown = !!(focusId && focusNodes.has(n.id));
      else if (labelMode === 'key') shown = n.imp >= 6 || !!(focusId && focusNodes.has(n.id));
      else shown = true;
      return shown ? 1 : 0;
    };

    sel.circleSel
      .attr('opacity', d => nodeOp(d))
      .attr('stroke-width', d => (focusId === d.id ? 3.6 : d.imp >= 8 ? 2.4 : 1.5));

    sel.labelSel.attr('opacity', d => labelOp(d));

    sel.linkSel
      .attr('stroke-opacity', l => {
        const lv = (!cActive || l.source.cluster === filtroCluster || l.target.cluster === filtroCluster)
          && (!tActive || l.tipo === filtroTipo);
        if (focusId) {
          const inF = getId(l.source) === focusId || getId(l.target) === focusId;
          return lv ? (inF ? 0.95 : 0.05) : 0.03;
        }
        return lv ? 0.34 + (l.peso - 1) * 0.13 : 0.03;
      })
      .attr('stroke-width', l => {
        const lv = (!cActive || l.source.cluster === filtroCluster || l.target.cluster === filtroCluster)
          && (!tActive || l.tipo === filtroTipo);
        let w = lv ? 0.9 + l.peso * 0.9 : 0.6;
        if (focusId && (getId(l.source) === focusId || getId(l.target) === focusId)) w *= 1.3;
        return w;
      });
  }, [hovered, selected, filtroCluster, filtroTipo, labelMode, adjacency, tipoNodeSets, clusterNeighborSets]);

  useEffect(() => { applyStyles(); }, [applyStyles]);

  const resetView = () => {
    setSelected(null); setHovered(null);
    setFiltroCluster('all'); setFiltroTipo('all');
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  const panelNode = (selected && idToNode[selected]) || (hovered && idToNode[hovered]) || null;
  const panelConns = panelNode
    ? LINKS.filter(l => l.s === panelNode.id || l.t === panelNode.id).map(l => {
        const isOut = l.s === panelNode.id;
        return { other: idToNode[isOut ? l.t : l.s], dir: isOut ? '→' : '←', tipo: l.tipo, desc: l.desc, peso: l.peso };
      }).sort((a, b) => b.peso - a.peso)
    : [];

  return (
    <div className="w-full flex flex-col bg-slate-50 text-slate-800" style={{ height: '78vh', minHeight: 560 }}>
      {/* Toolbar */}
      <div className="bg-white border-b px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-sm mr-1">Rede Tecno-Política</span>
        <span className="text-slate-400 hidden sm:inline">— Big Tech, extrema-direita & vigilância · jan/2026</span>
        <div className="flex-1" />
        <label className="flex items-center gap-1">
          <span className="text-slate-500">Grupo</span>
          <select className="border rounded px-1.5 py-1 bg-white" value={filtroCluster} onChange={e => setFiltroCluster(e.target.value)}>
            <option value="all">Todos</option>
            {Object.entries(CLUSTERS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1">
          <span className="text-slate-500">Vínculo</span>
          <select className="border rounded px-1.5 py-1 bg-white" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="all">Todos</option>
            {Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1">
          <span className="text-slate-500">Rótulos</span>
          <select className="border rounded px-1.5 py-1 bg-white" value={labelMode} onChange={e => setLabelMode(e.target.value)}>
            <option value="key">Principais</option>
            <option value="all">Todos</option>
            <option value="none">Mínimos</option>
          </select>
        </label>
        <button onClick={resetView} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded">Recentrar</button>
        <button onClick={() => setShowPanel(p => !p)} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded">{showPanel ? 'Ocultar painel' : 'Painel'}</button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Graph */}
        <div className="relative flex-1 bg-slate-100 overflow-hidden">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full" style={{ touchAction: 'none' }} />

          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur p-2 rounded-lg shadow text-[10px] leading-tight max-w-[230px]">
            <div className="font-bold mb-1 text-slate-600">Grupos</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {Object.entries(CLUSTERS).map(([k, v]) => (
                <button key={k} onClick={() => setFiltroCluster(filtroCluster === k ? 'all' : k)}
                  className={`flex items-center gap-1 px-1 py-0.5 rounded text-left ${filtroCluster === k ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-100'}`}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v.fill, border: `1.5px solid ${v.stroke}` }} />
                  <span className="truncate">{v.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
            <div className="font-bold mt-1.5 mb-1 text-slate-600">Vínculos</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {Object.entries(TIPOS).map(([k, v]) => (
                <button key={k} onClick={() => setFiltroTipo(filtroTipo === k ? 'all' : k)}
                  className={`flex items-center gap-1 px-1 py-0.5 rounded text-left ${filtroTipo === k ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-100'}`}>
                  <span className="w-4 flex-shrink-0" style={{ borderTop: `2.5px ${v.dash ? 'dashed' : 'solid'} ${v.color}` }} />
                  <span className="truncate">{v.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
            <div className="mt-1.5 pt-1 border-t text-slate-400">Tamanho do nó ∝ importância · espessura ∝ força do vínculo</div>
          </div>

          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] text-slate-500">
            Passe o mouse para destacar · clique para fixar · arraste · scroll = zoom
          </div>
        </div>

        {/* Detail panel */}
        {showPanel && (
          <div className="w-72 flex-shrink-0 bg-white border-l overflow-y-auto text-xs">
            {panelNode ? (
              <div className="p-3">
                <div className="flex items-start gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0" style={{ background: CLUSTERS[panelNode.cluster].fill, border: `2px solid ${CLUSTERS[panelNode.cluster].stroke}` }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm leading-tight">{panelNode.label}</h3>
                    <span className="text-[11px]" style={{ color: CLUSTERS[panelNode.cluster].stroke }}>{CLUSTERS[panelNode.cluster].label}</span>
                  </div>
                  {selected && <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700">✕</button>}
                </div>
                <p className="text-slate-700 leading-relaxed mb-3">{panelNode.desc}</p>
                <div className="border-t pt-2">
                  <h4 className="font-bold text-slate-500 mb-1.5">Conexões ({panelConns.length})</h4>
                  <div className="space-y-1.5">
                    {panelConns.map((c, i) => (
                      <div key={i} className="bg-slate-50 rounded p-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: TIPOS[c.tipo].color }} title={TIPOS[c.tipo].label} />
                          <span className="text-slate-400">{c.dir}</span>
                          <button onClick={() => setSelected(c.other.id)}
                            className="px-1.5 py-0.5 rounded font-medium hover:opacity-75 transition-opacity"
                            style={{ background: CLUSTERS[c.other.cluster].fill, border: `1px solid ${CLUSTERS[c.other.cluster].stroke}` }}>
                            {c.other.label}
                          </button>
                        </div>
                        <p className="text-slate-500 italic mt-1 leading-snug">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500 mt-6">
                <p className="font-medium mb-2">Explore a rede</p>
                <p className="text-slate-400 leading-relaxed">Mapa de convergência entre Big Tech, hyperscalers, ideólogos neorreacionários e a extrema-direita — com as ramificações no Brasil. Passe o mouse ou clique em um nó para ver os detalhes e vínculos.</p>
                <p className="text-slate-400 mt-3 leading-relaxed">Use os filtros de <b>grupo</b> e <b>vínculo</b> (ou a legenda) para isolar partes da rede.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-800 text-white text-[10px] px-3 py-1 flex justify-between items-center">
        <span>{NODES.length} entidades · {LINKS.length} vínculos documentados</span>
        <span className="text-slate-400">
          {filtroCluster !== 'all' && `Grupo: ${CLUSTERS[filtroCluster].label}`}
          {filtroCluster !== 'all' && filtroTipo !== 'all' && ' · '}
          {filtroTipo !== 'all' && `Vínculo: ${TIPOS[filtroTipo].label}`}
        </span>
      </div>
    </div>
  );
}
