import React, { useState, useEffect, useRef } from 'react';

const RedeAtoresVisualizacao = () => {
  // Paleta de cores melhorada para os nós
  const coresNos = {
    techElite: { fill: '#e0f2fe', stroke: '#0ea5e9', leve: '#e0f7ff', titulo: 'Elite Tecnológica & Investidores' },
    ideologos: { fill: '#fecaca', stroke: '#ef4444', leve: '#fff1f1', titulo: 'Ideólogos & Intelectuais' },
    plataformas: { fill: '#d1fae5', stroke: '#10b981', leve: '#f0fdf9', titulo: 'Plataformas & Corporações' },
    politica: { fill: '#ffedd5', stroke: '#f97316', leve: '#fff7ed', titulo: 'Política Institucional' },
    criticos: { fill: '#e5e7eb', stroke: '#6b7280', leve: '#f8fafc', titulo: 'Sociedade Civil & Críticos' }
  };

  // Estilos para os diferentes tipos de conexões
  const estilosConexoes = {
    financeira: { 
      stroke: '#166534', 
      strokeWidth: 1.5, 
      strokeDasharray: '0',
      labelIcon: '💰',
      descricao: 'Financeira'
    },
    ideologica: { 
      stroke: '#1d4ed8', 
      strokeWidth: 1.5, 
      strokeDasharray: '5,5',
      labelIcon: '💡',
      descricao: 'Ideológica'
    },
    propriedade: { 
      stroke: '#7c2d12', 
      strokeWidth: 2, 
      strokeDasharray: '0',
      labelIcon: '🔑',
      descricao: 'Propriedade/Controle'
    },
    uso: { 
      stroke: '#7c3aed', 
      strokeWidth: 1.5, 
      strokeDasharray: '3,3',
      labelIcon: '🔄',
      descricao: 'Uso de Plataforma'
    },
    critica: { 
      stroke: '#dc2626', 
      strokeWidth: 1.5, 
      strokeDasharray: '0',
      labelIcon: '⚠️',
      descricao: 'Crítica/Pressão'
    },
    brasil: { 
      stroke: '#047857', 
      strokeWidth: 2.5, 
      strokeDasharray: '0',
      labelIcon: '🇧🇷',
      descricao: 'Conexão com Brasil'
    }
  };

  // Dados dos nós - traduzidos para português e atualizados
  const nos = [
    // Cluster 1: Elite Tecnológica & Investidores (Azul Claro)
    { id: 'thiel', x: 350, y: 150, label: 'Peter Thiel', cluster: 'techElite', descricao: 'Investidor, cofundador do PayPal e da Palantir. Conhecido por posições libertárias e apoio político à direita.', importancia: 10 },
    { id: 'musk', x: 500, y: 100, label: 'Elon Musk', cluster: 'techElite', descricao: 'CEO da Tesla e SpaceX, proprietário do Twitter/X. Cofundador do X.com (depois PayPal) com Thiel.', importancia: 9 },
    { id: 'andreessen', x: 250, y: 250, label: 'Marc Andreessen', cluster: 'techElite', descricao: 'Investidor de capital de risco, cofundador da a16z. Investe em projetos de mídia "anti-woke".', importancia: 7 },
    { id: 'lonsdale', x: 450, y: 220, label: 'Joe Lonsdale', cluster: 'techElite', descricao: 'Cofundador da Palantir e 8VC. Membro da "PayPal Mafia" junto com Thiel.', importancia: 6 },
    { id: 'mercer', x: 150, y: 300, label: 'Rebekah Mercer', cluster: 'techElite', descricao: 'Investidora, apoiadora política da direita. Financia Breitbart, Cambridge Analytica, Parler.', importancia: 8 },
    { id: 'balaji', x: 400, y: 180, label: 'Balaji Srinivasan', cluster: 'techElite', descricao: 'Ex-CTO Coinbase, investidor e autor. Defensor do network state e descentralização.', importancia: 6 },
    { id: 'luckey', x: 300, y: 200, label: 'Palmer Luckey', cluster: 'techElite', descricao: 'Fundador da Oculus, vendida ao Facebook. Depois fundou Anduril (defesa/vigilância).', importancia: 5 },
    
    // Cluster 2: Ideólogos & Intelectuais (Vermelho Claro)
    { id: 'yarvin', x: 600, y: 200, label: 'Curtis Yarvin (Moldbug)', cluster: 'ideologos', descricao: 'Programador, escritor, teórico da Democracia Dirigida. Autor do blog Unqualified Reservations (UR).', importancia: 8 },
    { id: 'land', x: 750, y: 150, label: 'Nick Land', cluster: 'ideologos', descricao: 'Filósofo, teórico do Acelerationismo. Inspirou Yarvin e o movimento Dark Enlightenment.', importancia: 7 },
    { id: 'bannon', x: 650, y: 350, label: 'Steve Bannon', cluster: 'ideologos', descricao: 'Ex-estrategista da Casa Branca, ligado ao Breitbart. Adotou ideias do Dark Enlightenment.', importancia: 9 },
    { id: 'anton', x: 720, y: 250, label: 'Michael Anton', cluster: 'ideologos', descricao: 'Escritor do "Flight 93 Election". Afiliado ao Instituto Claremont, entrevista Yarvin em podcast.', importancia: 6 },
    { id: 'ur-blog', x: 550, y: 250, label: 'Blog UR (Yarvin)', cluster: 'ideologos', descricao: 'Unqualified Reservations, blog de Yarvin que articulou as ideias do Dark Enlightenment.', importancia: 5 },
    
    // Cluster 3: Plataformas & Corporações (Verde Claro)
    { id: 'x', x: 450, y: 30, label: 'Twitter / X', cluster: 'plataformas', descricao: 'Plataforma de mídia social adquirida por Musk em 2022 e renomeada para X em 2023.', importancia: 9 },
    { id: 'facebook', x: 250, y: 50, label: 'Facebook / Meta', cluster: 'plataformas', descricao: 'Maior plataforma de mídia social mundial. Thiel foi dos primeiros investidores (2005-2022).', importancia: 9 },
    { id: 'palantir', x: 350, y: 300, label: 'Palantir', cluster: 'plataformas', descricao: 'Empresa de análise de dados e vigilância. Tem contratos com ICE, governos e corporações.', importancia: 8 },
    { id: 'cambridge', x: 200, y: 400, label: 'Cambridge Analytica', cluster: 'plataformas', descricao: 'Empresa de análise de dados (fechada). Utilizou dados do Facebook para campanhas políticas.', importancia: 7 },
    { id: 'breitbart', x: 500, y: 400, label: 'Breitbart News', cluster: 'plataformas', descricao: 'Site de notícias de direita. Plataforma para estratégias de Bannon e financiado por Mercer.', importancia: 7 },
    { id: 'rumble', x: 150, y: 150, label: 'Rumble', cluster: 'plataformas', descricao: 'Plataforma de vídeo alternativa ao YouTube. Recebeu investimentos de Thiel e Andreessen.', importancia: 5 },
    { id: 'parler', x: 100, y: 350, label: 'Parler', cluster: 'plataformas', descricao: 'Rede social alternativa, cofundada e financiada por Mercer como alternativa ao Twitter.', importancia: 5 },
    { id: 'anduril', x: 300, y: 100, label: 'Anduril', cluster: 'plataformas', descricao: 'Empresa de tecnologia de defesa fundada por Palmer Luckey. Contratos com governo americano.', importancia: 6 },
    { id: 'gab', x: 150, y: 250, label: 'Gab', cluster: 'plataformas', descricao: 'Plataforma de mídia social alternativa, popular entre a extrema-direita.', importancia: 4 },
    { id: 'openai', x: 400, y: 80, label: 'OpenAI', cluster: 'plataformas', descricao: 'Empresa de IA. Recebeu investimentos de Musk (inicialmente) e Thiel via Founders Fund.', importancia: 7 },
    
    // Cluster 4: Política Institucional (Laranja Claro)
    { id: 'trump', x: 800, y: 350, label: 'Donald Trump', cluster: 'politica', descricao: 'Ex-presidente dos EUA (2017-2021), atual presidente (2025-). Central na fusão entre Big Tech e extrema-direita.', importancia: 10 },
    { id: 'vance', x: 850, y: 180, label: 'J.D. Vance', cluster: 'politica', descricao: 'Senador dos EUA, autor de "Hillbilly Elegy". Recebeu financiamento de Thiel, influenciado por Yarvin.', importancia: 7 },
    { id: 'masters', x: 900, y: 250, label: 'Blake Masters', cluster: 'politica', descricao: 'Ex-candidato ao Senado, associado de Thiel. Coautor de "Zero to One" com Thiel.', importancia: 5 },
    { id: 'claremont', x: 800, y: 250, label: 'Instituto Claremont', cluster: 'politica', descricao: 'Think tank conservador. Oferece mentoria ideológica para legisladores, associado a Anton.', importancia: 6 },
    { id: 'gop-maga', x: 750, y: 300, label: 'Republicanos (MAGA)', cluster: 'politica', descricao: 'Facção do Partido Republicano alinhada a Trump. "Make America Great Again".', importancia: 8 },
    { id: 'heritage', x: 850, y: 300, label: 'Heritage Foundation', cluster: 'politica', descricao: 'Think tank conservador. Recebe apoio dos Mercer e influencia legisladores republicanos.', importancia: 6 },
    
    // Cluster 5: Sociedade Civil & Críticos (Cinza Claro)
    { id: 'haugen', x: 150, y: 50, label: 'Frances Haugen', cluster: 'criticos', descricao: 'Whistleblower do Facebook. Expôs práticas prejudiciais da plataforma.', importancia: 6 },
    { id: 'eff', x: 50, y: 100, label: 'EFF', cluster: 'criticos', descricao: 'Electronic Frontier Foundation. Defende liberdades civis digitais, colabora com legisladores.', importancia: 5 },
    { id: 'zuboff', x: 50, y: 180, label: 'Shoshana Zuboff', cluster: 'criticos', descricao: 'Acadêmica, autora de "Capitalismo de Vigilância". Crítica da exploração de dados.', importancia: 6 },
    { id: 'lanier', x: 80, y: 230, label: 'Jaron Lanier', cluster: 'criticos', descricao: 'Pioneiro de VR, crítico das redes sociais e do modelo de negócio das plataformas.', importancia: 5 },
    { id: 'gebru', x: 100, y: 280, label: 'Timnit Gebru', cluster: 'criticos', descricao: 'Ex-pesquisadora do Google, demitida após críticas ao viés da IA. Fundadora da DAIR.', importancia: 6 },
    { id: 'google-walkout', x: 50, y: 330, label: 'Google Walkout', cluster: 'criticos', descricao: 'Protesto de funcionários do Google em 2018 contra assédio e políticas da empresa.', importancia: 4 },
    { id: 'aclu', x: 150, y: 380, label: 'ACLU', cluster: 'criticos', descricao: 'American Civil Liberties Union. Defende direitos civis, combate vigilância excessiva.', importancia: 5 },
  ];

  // Conexões - expandidas e atualizadas
  const conexoes = [
    // Conexões Financeiras (Verde Sólido)
    { id: 'e1', source: 'thiel', target: 'yarvin', label: 'Investimento (Urbit)', tipo: 'financeira', descricao: 'Peter Thiel financiou o projeto Urbit de Curtis Yarvin' },
    { id: 'e2', source: 'thiel', target: 'vance', label: 'Financiamento 2022', tipo: 'financeira', descricao: 'Thiel financiou a campanha de Vance ao Senado dos EUA com aproximadamente $15 milhões' },
    { id: 'e3', source: 'thiel', target: 'masters', label: 'Financiamento 2022', tipo: 'financeira', descricao: 'Thiel financiou a campanha ao Senado de Masters com valor semelhante ao de Vance' },
    { id: 'e4', source: 'mercer', target: 'cambridge', label: 'Financiamento', tipo: 'financeira', descricao: 'Família Mercer foi principal financiadora da Cambridge Analytica' },
    { id: 'e5', source: 'mercer', target: 'breitbart', label: 'Financiamento', tipo: 'financeira', descricao: 'Mercer é investidora principal do Breitbart desde 2016' },
    { id: 'e6', source: 'mercer', target: 'parler', label: 'Cofundadora', tipo: 'financeira', descricao: 'Rebekah Mercer cofundou e financiou o Parler como alternativa ao Twitter' },
    { id: 'e7', source: 'thiel', target: 'palantir', label: 'Cofundador', tipo: 'financeira', descricao: 'Thiel fundou e é principal investidor na Palantir Technologies' },
    { id: 'e8', source: 'lonsdale', target: 'palantir', label: 'Cofundador', tipo: 'financeira', descricao: 'Lonsdale cofundou a Palantir com Thiel e outros da "PayPal Mafia"' },
    { id: 'e9', source: 'thiel', target: 'facebook', label: 'Acionista (2005-2022)', tipo: 'financeira', descricao: 'Thiel foi dos primeiros investidores e membro do conselho do Facebook até 2022' },
    { id: 'e10', source: 'thiel', target: 'rumble', label: 'Investimento', tipo: 'financeira', descricao: 'Thiel investiu na plataforma Rumble, alternativa ao YouTube' },
    { id: 'e11', source: 'andreessen', target: 'rumble', label: 'Investimento', tipo: 'financeira', descricao: 'Andreessen Horowitz (a16z) investiu na plataforma Rumble' },
    { id: 'e12', source: 'mercer', target: 'trump', label: 'PACs', tipo: 'financeira', descricao: 'Família Mercer financia PACs pró-Trump e super-PACs de direita' },
    { id: 'e13', source: 'mercer', target: 'bannon', label: 'Apoio via Breitbart', tipo: 'financeira', descricao: 'Mercer apoia Bannon financeiramente via Breitbart' },
    { id: 'e14', source: 'luckey', target: 'anduril', label: 'Fundador', tipo: 'financeira', descricao: 'Palmer Luckey fundou a Anduril após vender a Oculus para o Facebook' },
    { id: 'e15', source: 'thiel', target: 'anduril', label: 'Investidor', tipo: 'financeira', descricao: 'Thiel é investidor na Anduril via Founders Fund' },
    { id: 'e16', source: 'musk', target: 'openai', label: 'Cofundador (saiu)', tipo: 'financeira', descricao: 'Musk cofundou a OpenAI em 2015, mas deixou o conselho em 2018' },
    { id: 'e17', source: 'thiel', target: 'openai', label: 'Investimento', tipo: 'financeira', descricao: 'Thiel investiu na OpenAI via Founders Fund' },
    { id: 'e18', source: 'andreessen', target: 'gab', label: 'Investimento rejeitado', tipo: 'financeira', descricao: 'Andreessen considerou investir na Gab, mas recuou após controvérsias' },
    { id: 'e19', source: 'mercer', target: 'heritage', label: 'Doações', tipo: 'financeira', descricao: 'Família Mercer faz doações substanciais à Heritage Foundation' },
    { id: 'e20', source: 'musk', target: 'gop-maga', label: 'Doações 2024', tipo: 'financeira', descricao: 'Musk doou para PACs alinhados a Trump e candidatos republicanos' },
    
    // Conexões Ideológicas (Azul Tracejado)
    { id: 'e21', source: 'yarvin', target: 'thiel', label: 'Influência', tipo: 'ideologica', descricao: 'Yarvin é influência ideológica significativa para Thiel e seus círculos' },
    { id: 'e22', source: 'yarvin', target: 'vance', label: 'Influência', tipo: 'ideologica', descricao: 'Yarvin influenciou posições políticas de Vance, admitido pelo próprio Vance' },
    { id: 'e23', source: 'land', target: 'yarvin', label: 'Inspiração', tipo: 'ideologica', descricao: 'Teorias aceleracionistas de Land inspiraram o trabalho de Yarvin' },
    { id: 'e24', source: 'bannon', target: 'breitbart', label: 'Ideias DE', tipo: 'ideologica', descricao: 'Bannon usou Breitbart para disseminar ideias do Dark Enlightenment' },
    { id: 'e25', source: 'anton', target: 'yarvin', label: 'Podcast 2024', tipo: 'ideologica', descricao: 'Anton entrevista Yarvin em podcast de 2024, compartilhando ideias' },
    { id: 'e26', source: 'claremont', target: 'anton', label: 'Afiliação', tipo: 'ideologica', descricao: 'Anton é pesquisador afiliado ao Instituto Claremont' },
    { id: 'e27', source: 'claremont', target: 'vance', label: 'Mentoria', tipo: 'ideologica', descricao: 'Instituto Claremont ofereceu mentoria ideológica a Vance' },
    { id: 'e28', source: 'thiel', target: 'trump', label: 'Conselheiro (2016-17)', tipo: 'ideologica', descricao: 'Thiel foi conselheiro informal de Trump e indicou pessoas no governo' },
    { id: 'e29', source: 'musk', target: 'thiel', label: 'Visões Compartilhadas', tipo: 'ideologica', descricao: 'Musk e Thiel compartilham visões sobre livre expressão e futuro tecnológico' },
    { id: 'e30', source: 'musk', target: 'trump', label: 'Conselho CEOs (2017)/Apoio', tipo: 'ideologica', descricao: 'Musk participou do Conselho de CEOs de Trump em 2017 e aproximou-se em 2024' },
    { id: 'e31', source: 'yarvin', target: 'ur-blog', label: 'Autor', tipo: 'ideologica', descricao: 'Yarvin escreveu o blog Unqualified Reservations (UR) sob o pseudônimo Mencius Moldbug' },
    { id: 'e32', source: 'ur-blog', target: 'bannon', label: 'Influência', tipo: 'ideologica', descricao: 'Blog UR influenciou estratégias de Bannon na campanha de Trump' },
    { id: 'e33', source: 'heritage', target: 'gop-maga', label: 'Projeto 2025', tipo: 'ideologica', descricao: 'Heritage Foundation desenvolve Projeto 2025 para administração Trump' },
    { id: 'e34', source: 'balaji', target: 'thiel', label: 'Alinhamento', tipo: 'ideologica', descricao: 'Balaji Srinivasan compartilha visão libertária de Thiel sobre tecnologia' },
    { id: 'e35', source: 'claremont', target: 'gop-maga', label: 'Suporte intelectual', tipo: 'ideologica', descricao: 'Claremont Institute fornece suporte intelectual à facção MAGA do partido' },
    
    // Conexões de Propriedade (Marrom Sólido)
    { id: 'e36', source: 'musk', target: 'x', label: 'Proprietário (2022-)', tipo: 'propriedade', descricao: 'Musk adquiriu o Twitter em 2022, renomeando para X em 2023' },
    { id: 'e37', source: 'thiel', target: 'palantir', label: 'Controle', tipo: 'propriedade', descricao: 'Thiel mantém controle significativo da Palantir como cofundador e presidente' },
    { id: 'e38', source: 'luckey', target: 'anduril', label: 'Controle', tipo: 'propriedade', descricao: 'Palmer Luckey mantém controle da Anduril como CEO e fundador' },
    { id: 'e39', source: 'facebook', target: 'openai', label: 'Parceria estratégica', tipo: 'propriedade', descricao: 'Meta (Facebook) tem parceria com OpenAI para implementação de IA' },
    
    // Conexões de Uso (Roxo Tracejado)
    { id: 'e40', source: 'bannon', target: 'facebook', label: 'Uso (via CA)', tipo: 'uso', descricao: 'Bannon usou Facebook via Cambridge Analytica para campanha de Trump' },
    { id: 'e41', source: 'trump', target: 'cambridge', label: 'Contrato 2016', tipo: 'uso', descricao: 'Campanha Trump 2016 contratou Cambridge Analytica oficialmente' },
    { id: 'e42', source: 'cambridge', target: 'facebook', label: 'Uso de dados', tipo: 'uso', descricao: 'Cambridge Analytica coletou e analisou dados do Facebook para campanhas' },
    { id: 'e43', source: 'gop-maga', target: 'breitbart', label: 'Plataforma de mensagem', tipo: 'uso', descricao: 'Facção MAGA usa Breitbart como canal de comunicação com a base' },
    { id: 'e44', source: 'gop-maga', target: 'x', label: 'Comunicação direta', tipo: 'uso', descricao: 'Trump e aliados usam X (Twitter) para comunicação direta com apoiadores' },
    { id: 'e45', source: 'palantir', target: 'gop-maga', label: 'Serviços de dados', tipo: 'uso', descricao: 'Governo Trump usou serviços da Palantir, especialmente para ICE' },
    
    // Conexões Críticas (Vermelho Sólido)
    { id: 'e46', source: 'haugen', target: 'facebook', label: 'Whistleblower', tipo: 'critica', descricao: 'Haugen expôs documentos internos e práticas do Facebook em 2021' },
    { id: 'e47', source: 'eff', target: 'gop-maga', label: 'Advocacy de políticas', tipo: 'critica', descricao: 'EFF critica políticas de vigilância e privacidade do governo' },
    { id: 'e48', source: 'zuboff', target: 'facebook', label: 'Crítica acadêmica', tipo: 'critica', descricao: 'Zuboff critica modelo de negócio do Facebook em "Capitalismo de Vigilância"' },
    { id: 'e49', source: 'gebru', target: 'openai', label: 'Crítica de IA', tipo: 'critica', descricao: 'Gebru critica práticas de desenvolvimento de IA, inclusive da OpenAI' },
    { id: 'e50', source: 'lanier', target: 'x', label: 'Crítica estrutural', tipo: 'critica', descricao: 'Lanier critica modelo fundamental do Twitter/X e redes sociais similares' },
    { id: 'e51', source: 'aclu', target: 'palantir', label: 'Litígio', tipo: 'critica', descricao: 'ACLU processa e critica contratos da Palantir com agências de imigração' },
    { id: 'e52', source: 'google-walkout', target: 'openai', label: 'Crítica ética', tipo: 'critica', descricao: 'Movimento que começou no Google se estendeu a críticas de ética na IA' },
    
    // Conexões com Brasil (destacadas)
    { id: 'e53', source: 'facebook', target: 'cambridge', label: 'Dados brasileiros', tipo: 'brasil', descricao: 'Dados de milhões de brasileiros foram coletados por Cambridge Analytica via Facebook' },
    { id: 'e54', source: 'bannon', target: 'breitbart', label: 'Influência no Brasil', tipo: 'brasil', descricao: 'Bannon via Breitbart influenciou movimentos políticos de direita no Brasil' },
    { id: 'e55', source: 'palantir', target: 'breitbart', label: 'Operações no Brasil', tipo: 'brasil', descricao: 'Palantir tem contratos governamentais e corporativos no Brasil' },
    { id: 'e56', source: 'thiel', target: 'x', label: 'Impacto na política BR', tipo: 'brasil', descricao: 'Visão de moderação de Thiel influencia políticas do X que afetam debate político brasileiro' },
    { id: 'e57', source: 'gop-maga', target: 'trump', label: 'Modelo exportado', tipo: 'brasil', descricao: 'Modelo político MAGA influenciou táticas e retórica da extrema-direita brasileira' },
  ];

  // Estado para controle de zoom e pan
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [viewBox, setViewBox] = useState("0 0 1000 700");
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [noDetalhe, setNoDetalhe] = useState(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filtroCluster, setFiltroCluster] = useState(null);
  const [filtroConexao, setFiltroConexao] = useState(null);
  const [mostrarPainel, setMostrarPainel] = useState(true);
  const [mostrarBrasil, setMostrarBrasil] = useState(false);
  const [nivelDetalhe, setNivelDetalhe] = useState('normal'); // 'simples', 'normal', 'detalhado'
  const [modo, setModo] = useState('normal'); // normal, destaque, apresentacao
  const [etapaApresentacao, setEtapaApresentacao] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  // Efeito para ajustar a altura do container
  useEffect(() => {
    if (containerRef.current) {
      // Calcula a altura disponível (viewport - altura do cabeçalho - altura do rodapé)
      const windowHeight = window.innerHeight;
      const headerHeight = 50; // Altura aproximada do cabeçalho
      const footerHeight = 30; // Altura aproximada do rodapé
      const availableHeight = windowHeight - headerHeight - footerHeight;
      
      setContainerHeight(Math.max(600, availableHeight));
      
      // Ajusta o viewBox
      setViewBox(`0 0 1000 ${Math.max(700, availableHeight * 1.2)}`);
    }
    
    // Listener para redimensionamento da janela
    const handleResize = () => {
      if (containerRef.current) {
        const windowHeight = window.innerHeight;
        const headerHeight = 50;
        const footerHeight = 30;
        const availableHeight = windowHeight - headerHeight - footerHeight;
        
        setContainerHeight(Math.max(600, availableHeight));
        setViewBox(`0 0 1000 ${Math.max(700, availableHeight * 1.2)}`);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cálculo de conexões para cada nó (para determinar o tamanho)
  const contarConexoes = (nodeId) => {
    return conexoes.filter(e => e.source === nodeId || e.target === nodeId).length;
  };

  // Manipulador de roda do mouse para zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale * scaleFactor))
    }));
  };

  // Manipulador de mouse down para pan
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Botão esquerdo do mouse
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Manipulador de mouse move para pan
  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setDragStart({ x: e.clientX, y: e.clientY });
      setTransform(prev => ({
        ...prev,
        x: prev.x + dx / prev.scale,
        y: prev.y + dy / prev.scale
      }));
    }
  };

  // Manipulador de mouse up para finalizar pan
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Manipulador de hover no nó
  const handleNodeHover = (nodeId) => {
    setSelectedNode(nodeId);
  };

  // Manipulador de clique no nó
  const handleNodeClick = (nodeId) => {
    try {
      const node = nos.find(n => n.id === nodeId);
      if (!node) {
        console.error(`Nó não encontrado: ${nodeId}`);
        return;
      }
      setNoDetalhe(node);
      
      if (modo === 'apresentacao') {
        // Avançar para próxima etapa se clicar no nó correto da apresentação
        const etapas = getEtapasApresentacao();
        if (etapas[etapaApresentacao]?.highlightNodes?.includes(nodeId)) {
          setEtapaApresentacao(prev => Math.min(prev + 1, etapas.length - 1));
        }
      }
    } catch (error) {
      console.error("Erro ao clicar no nó:", error);
      // Não permitir que o erro afete o restante da aplicação
    }
  };

  // Manipulador de clique na conexão
  const handleEdgeClick = (edgeId) => {
    setSelectedEdge(edgeId);
  };

  // Limpar hover do nó
  const handleNodeLeave = () => {
    setSelectedNode(null);
  };

  // Calcular o tamanho do nó baseado na importância, tamanho do texto e nível de detalhe
  const calcularTamanhoNo = (nodeId) => {
    const node = nos.find(n => n.id === nodeId);
    if (!node) return 20;
    
    // Calcular fator de tamanho baseado no comprimento do texto
    const textLength = node.label.length;
    const textFactor = Math.max(1, Math.min(2, textLength / 15)); // Fator entre 1 e 2 baseado no texto
    
    let tamanhoBase;
    switch (nivelDetalhe) {
      case 'simples':
        tamanhoBase = 8;
        break;
      case 'detalhado':
        tamanhoBase = 14;
        break;
      case 'normal':
      default:
        tamanhoBase = 12;
    }
    
    // Combinar importância com o fator de texto
    const importanceFactor = node.importancia * (nivelDetalhe === 'detalhado' ? 2.5 : 2);
    
    return tamanhoBase + importanceFactor * textFactor;
  };

  // Calcular caminho da conexão entre nós
  const calcularCaminhoConexao = (sourceNode, targetNode) => {
    const source = nos.find(n => n.id === sourceNode);
    const target = nos.find(n => n.id === targetNode);
    if (!source || !target) return '';

    // Calcular pontos de controle para curva
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calcular ponto médio com offset para caminho curvo
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    
    // Offset perpendicular à linha
    const offsetScale = 0.2;
    const offsetX = -dy * offsetScale;
    const offsetY = dx * offsetScale;
    
    return `M${source.x},${source.y} Q${midX + offsetX},${midY + offsetY} ${target.x},${target.y}`;
  };

  // Calcular posição e rotação da seta
  const calcularSeta = (sourceNode, targetNode) => {
    const source = nos.find(n => n.id === sourceNode);
    const target = nos.find(n => n.id === targetNode);
    if (!source || !target) return { x: 0, y: 0, rotation: 0 };

    // Calcular ângulo da linha
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Posicionar a seta um pouco antes do nó alvo
    const distance = Math.sqrt(dx * dx + dy * dy);
    const offset = calcularTamanhoNo(target.id) + 5; // Distância do nó alvo
    const ratio = (distance - offset) / distance;
    const x = source.x + dx * ratio;
    const y = source.y + dy * ratio;
    
    return { x, y, rotation: angle };
  };

  // Calcular posição para rótulos das conexões
  const calcularRotuloConexao = (sourceNode, targetNode) => {
    const source = nos.find(n => n.id === sourceNode);
    const target = nos.find(n => n.id === targetNode);
    if (!source || !target) return { x: 0, y: 0 };

    // Calcular ponto médio com offset para caminho curvo
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    
    // Offset perpendicular à linha
    const offsetScale = 0.2;
    const offsetX = -dy * offsetScale;
    const offsetY = dx * offsetScale;
    
    return { x: midX + offsetX, y: midY + offsetY };
  };

  // Verificar se uma conexão deve ser destacada
  const isConexaoDestacada = (edge) => {
    return selectedNode && (edge.source === selectedNode || edge.target === selectedNode) ||
           selectedEdge === edge.id ||
           (noDetalhe && (edge.source === noDetalhe.id || edge.target === noDetalhe.id));
  };

  // Verificar se um nó está filtrado
  const isNoFiltrado = (node) => {
    if (!filtroCluster && !filtroConexao) return true;
    
    if (filtroCluster && node.cluster !== filtroCluster) return false;
    
    if (filtroConexao) {
      // Verificar se o nó tem conexões do tipo filtrado
      return conexoes.some(e => 
        (e.tipo === filtroConexao && (e.source === node.id || e.target === node.id))
      );
    }
    
    return true;
  };

  // Verificar se uma conexão está filtrada
  const isConexaoFiltrada = (edge) => {
    try {
      if (mostrarBrasil && edge.tipo === 'brasil') return true;
      
      if (!filtroCluster && !filtroConexao) return true;
      
      if (filtroConexao && edge.tipo !== filtroConexao) return false;
      
      if (filtroCluster) {
        const sourceNode = nos.find(n => n.id === edge.source);
        const targetNode = nos.find(n => n.id === edge.target);
        
        // Se fonte ou destino não existe, não mostrar a conexão
        if (!sourceNode || !targetNode) return false;
        
        // Mostra a conexão se pelo menos um dos nós está no cluster filtrado
        return (sourceNode.cluster === filtroCluster) || (targetNode.cluster === filtroCluster);
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao filtrar conexão:", error);
      return false; // Em caso de erro, não mostrar a conexão
    }
  };

  // Verificar se um nó está destacado na apresentação
  const isNoDestacadoApresentacao = (nodeId) => {
    if (modo !== 'apresentacao') return false;
    
    const etapas = getEtapasApresentacao();
    const etapaAtual = etapas[etapaApresentacao];
    
    return etapaAtual && etapaAtual.highlightNodes && etapaAtual.highlightNodes.includes(nodeId);
  };

  // Verificar se uma conexão está destacada na apresentação
  const isConexaoDestacadaApresentacao = (edgeId) => {
    if (modo !== 'apresentacao') return false;
    
    const etapas = getEtapasApresentacao();
    const etapaAtual = etapas[etapaApresentacao];
    
    return etapaAtual && etapaAtual.highlightEdges && etapaAtual.highlightEdges.includes(edgeId);
  };

  // Calcular opacidade de nós e conexões com base nos filtros e seleções
  const calcularOpacidadeNo = (nodeId) => {
    try {
      const node = nos.find(n => n.id === nodeId);
      if (!node) return 0.2; // Se o nó não for encontrado, baixa opacidade
      
      // Nós não filtrados têm opacidade reduzida
      if (!isNoFiltrado(node)) return 0.2;
      
      // Nó selecionado ou conectado a ele tem opacidade total
      if (selectedNode === nodeId || noDetalhe?.id === nodeId) return 1;
      
      if (selectedNode || noDetalhe) {
        // Verificar se este nó está conectado ao nó selecionado
        const isConnected = conexoes.some(e => 
          ((e.source === selectedNode && e.target === nodeId) || 
          (e.target === selectedNode && e.source === nodeId) ||
          (noDetalhe && (e.source === noDetalhe.id && e.target === nodeId)) ||
          (noDetalhe && (e.target === noDetalhe.id && e.source === nodeId))) && 
          // Verificar que a fonte e o destino existem
          nos.some(n => n.id === e.source) && nos.some(n => n.id === e.target)
        );
        
        return isConnected ? 0.9 : 0.3;
      }
      
      // No modo apresentação, destacar apenas os nós relevantes
      if (modo === 'apresentacao') {
        return isNoDestacadoApresentacao(nodeId) ? 1 : 0.3;
      }
      
      return 0.9; // Opacidade padrão para nós quando nenhum está selecionado
    } catch (error) {
      console.error("Erro ao calcular opacidade do nó:", error);
      return 0.5; // Valor padrão em caso de erro
    }
  };

  // Calcular opacidade de conexões
  const calcularOpacidadeConexao = (edge) => {
    // Conexões não filtradas têm opacidade reduzida
    if (!isConexaoFiltrada(edge)) return 0.1;
    
    // Conexão selecionada tem opacidade total
    if (isConexaoDestacada(edge)) return 1;
    
    // No modo apresentação, destacar apenas as conexões relevantes
    if (modo === 'apresentacao') {
      return isConexaoDestacadaApresentacao(edge.id) ? 1 : 0.2;
    }
    
    return 0.7; // Opacidade padrão para conexões
  };

  // Botão de exportação simplificado que abre uma nova janela com o SVG
  const exportarPNG = () => {
    if (!svgRef.current) {
      alert('Erro: Elemento SVG não encontrado');
      return;
    }
    
    try {
      // Clone o SVG para evitar modificações no original
      const svgOriginal = svgRef.current;
      const svgClone = svgOriginal.cloneNode(true);
      
      // Adicione um fundo branco
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', 'white');
      svgClone.insertBefore(rect, svgClone.firstChild);
      
      // Obtenha o tamanho do SVG
      const bbox = svgOriginal.getBoundingClientRect();
      svgClone.setAttribute('width', bbox.width || 1200);
      svgClone.setAttribute('height', bbox.height || 800);
      
      // Converta o SVG para string
      const svgString = new XMLSerializer().serializeToString(svgClone);
      
      // Crie um HTML que inclui instruções para salvar a imagem
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Rede Tecno-Política - Exportar</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center;
              background-color: #f5f5f5;
              padding: 20px;
            }
            .container {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              margin-bottom: 20px;
              max-width: 800px;
              text-align: center;
            }
            h2 { color: #333; }
            p { color: #666; line-height: 1.5; }
            button {
              background-color: #4a6da7;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
              margin: 10px;
            }
            button:hover {
              background-color: #3a5d97;
            }
            .svg-container {
              margin: 20px 0;
              border: 1px solid #ddd;
              overflow: auto;
              max-width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Visualização da Rede Tecno-Política</h2>
            <p>Para salvar como imagem, clique com o botão direito na visualização abaixo e selecione "Salvar imagem como..." ou use a captura de tela do seu sistema operacional.</p>
            <p>Você também pode usar a ferramenta Captura do seu sistema operacional para obter uma imagem de melhor qualidade.</p>
            <button onclick="window.print()">Imprimir/Salvar como PDF</button>
            <button onclick="window.close()">Fechar</button>
          </div>
          <div class="svg-container">
            ${svgString}
          </div>
        </body>
        </html>
      `;
      
      // Abra uma nova janela e escreva o HTML
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        alert('Seu navegador bloqueou o popup. Por favor, permita popups para este site.');
        return;
      }
      
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Não foi possível exportar. Erro: ' + error.message);
    }
  };

  // Definir etapas da apresentação
  const getEtapasApresentacao = () => [
    {
      titulo: 'Elite Tecnológica & Investidores',
      descricao: 'Bilionários e investidores de tech que financiam o ecossistema e sua aproximação com a direita radical.',
      highlightNodes: ['thiel', 'musk', 'mercer', 'andreessen', 'lonsdale', 'balaji', 'luckey'],
      highlightEdges: ['e29', 'e8', 'e7', 'e9']
    },
    {
      titulo: 'Conexões com Ideólogos',
      descricao: 'Como a elite tech se conecta com teóricos e pensadores da nova direita radical.',
      highlightNodes: ['thiel', 'yarvin', 'land', 'ur-blog', 'bannon'],
      highlightEdges: ['e1', 'e21', 'e23', 'e31', 'e32']
    },
    {
      titulo: 'Influência em Políticos',
      descricao: 'Financiamento de campanhas e mentoria para candidatos alinhados ideologicamente.',
      highlightNodes: ['thiel', 'vance', 'masters', 'mercer', 'trump', 'claremont'],
      highlightEdges: ['e2', 'e3', 'e12', 'e22', 'e27', 'e28']
    },
    {
      titulo: 'Controle de Plataformas',
      descricao: 'Aquisição e controle de plataformas de mídia social, notícias e tecnologia.',
      highlightNodes: ['musk', 'x', 'mercer', 'breitbart', 'parler', 'thiel', 'palantir', 'luckey', 'anduril'],
      highlightEdges: ['e5', 'e6', 'e36', 'e37', 'e38']
    },
    {
      titulo: 'Operações de Dados',
      descricao: 'Como dados são coletados e utilizados para influência política e vigilância.',
      highlightNodes: ['cambridge', 'facebook', 'palantir', 'trump', 'bannon'],
      highlightEdges: ['e4', 'e40', 'e41', 'e42', 'e45']
    },
    {
      titulo: 'Movimento de Crítica',
      descricao: 'Resistência contra o poder das big techs e sua influência política.',
      highlightNodes: ['haugen', 'facebook', 'zuboff', 'gebru', 'lanier', 'aclu', 'eff', 'palantir'],
      highlightEdges: ['e46', 'e48', 'e49', 'e50', 'e51']
    },
    {
      titulo: 'Conexões com o Brasil',
      descricao: 'Impactos diretos no cenário brasileiro e exportação do modelo.',
      highlightNodes: ['bannon', 'cambridge', 'facebook', 'palantir', 'thiel', 'x', 'gop-maga', 'trump'],
      highlightEdges: ['e53', 'e54', 'e55', 'e56', 'e57']
    }
  ];

  // Avançar para a próxima etapa da apresentação
  const avancarApresentacao = () => {
    const etapas = getEtapasApresentacao();
    setEtapaApresentacao(prev => Math.min(prev + 1, etapas.length - 1));
  };

  // Voltar para a etapa anterior da apresentação
  const voltarApresentacao = () => {
    setEtapaApresentacao(prev => Math.max(prev - 1, 0));
  };

  // Preparar o atributo de transformação para o SVG
  const svgTransform = `scale(${transform.scale}) translate(${transform.x} ${transform.y})`;

  // Itens da legenda para tipos de nós
  const itensLegendaNos = [
    { label: 'Elite Tecnológica', color: coresNos.techElite.fill, borderColor: coresNos.techElite.stroke, cluster: 'techElite' },
    { label: 'Ideólogos', color: coresNos.ideologos.fill, borderColor: coresNos.ideologos.stroke, cluster: 'ideologos' },
    { label: 'Plataformas', color: coresNos.plataformas.fill, borderColor: coresNos.plataformas.stroke, cluster: 'plataformas' },
    { label: 'Política', color: coresNos.politica.fill, borderColor: coresNos.politica.stroke, cluster: 'politica' },
    { label: 'Críticos', color: coresNos.criticos.fill, borderColor: coresNos.criticos.stroke, cluster: 'criticos' }
  ];

  // Itens da legenda para tipos de conexões
  const itensLegendaConexoes = [
    { label: 'Financeira (💰)', style: estilosConexoes.financeira, tipo: 'financeira' },
    { label: 'Ideológica (💡)', style: estilosConexoes.ideologica, tipo: 'ideologica' },
    { label: 'Propriedade (🔑)', style: estilosConexoes.propriedade, tipo: 'propriedade' },
    { label: 'Uso de Plataforma (🔄)', style: estilosConexoes.uso, tipo: 'uso' },
    { label: 'Crítica (⚠️)', style: estilosConexoes.critica, tipo: 'critica' },
    { label: 'Conexão com Brasil (🇧🇷)', style: estilosConexoes.brasil, tipo: 'brasil' }
  ];

  // Estilo dinâmico para o cursor
  const cursorStyle = isDragging ? 'cursor-grabbing' : 'cursor-grab';

  // Dimensões do SVG
  const svgWidth = "100%";
  const svgHeight = containerHeight || 600; // Altura mínima ou altura do container

  // Componente principal
  return (
    <div className="w-full h-full flex flex-col bg-gray-50" ref={containerRef}>
      {/* Barra de ferramentas superior */}
      <div className="w-full bg-white shadow-sm p-2 flex items-center justify-between flex-wrap">
        <div className="flex items-center">
          <h2 className="text-lg font-bold text-gray-800 mr-4">Rede Tecno-Política</h2>
          
          <div className="ml-4 flex">
            <button 
              onClick={() => setModo('normal')} 
              className={`px-2 py-1 text-xs mr-1 rounded ${modo === 'normal' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Normal
            </button>
            <button 
              onClick={() => setModo('apresentacao')} 
              className={`px-2 py-1 text-xs mr-1 rounded ${modo === 'apresentacao' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Apresentação
            </button>
          </div>
          
          <div className="ml-4 flex">
            <select 
              value={nivelDetalhe} 
              onChange={(e) => setNivelDetalhe(e.target.value)}
              className="text-xs px-2 py-1 border rounded"
            >
              <option value="simples">Visualização Simples</option>
              <option value="normal">Visualização Normal</option>
              <option value="detalhado">Visualização Detalhada</option>
            </select>
          </div>
        </div>
          
          <div className="flex items-center">
            <div className="mr-4 flex items-center">
              <input 
                type="checkbox" 
                id="mostrarBrasil" 
                checked={mostrarBrasil} 
                onChange={(e) => setMostrarBrasil(e.target.checked)}
                className="mr-1"
              />
              <label htmlFor="mostrarBrasil" className="text-sm">Destacar Conexões Brasil</label>
            </div>
            
            <select 
              className="mr-2 text-sm py-1 px-2 border rounded"
              value={filtroCluster || ''}
              onChange={(e) => setFiltroCluster(e.target.value || null)}
            >
              <option value="">Todos os Grupos</option>
              <option value="techElite">Elite Tecnológica</option>
              <option value="ideologos">Ideólogos</option>
              <option value="plataformas">Plataformas</option>
              <option value="politica">Política</option>
              <option value="criticos">Críticos</option>
            </select>
            
            <select 
              className="mr-2 text-sm py-1 px-2 border rounded"
              value={filtroConexao || ''}
              onChange={(e) => setFiltroConexao(e.target.value || null)}
            >
              <option value="">Todas as Conexões</option>
              <option value="financeira">Financeiras</option>
              <option value="ideologica">Ideológicas</option>
              <option value="propriedade">Propriedade</option>
              <option value="uso">Uso de Plataforma</option>
              <option value="critica">Críticas</option>
              <option value="brasil">Conexões Brasil</option>
            </select>
            
            <button 
              onClick={exportarPNG} 
              className="ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded"
            >
              Exportar PNG
            </button>
            
            <button 
              onClick={() => setMostrarPainel(!mostrarPainel)} 
              className="ml-2 bg-gray-200 text-xs px-2 py-1 rounded"
            >
              {mostrarPainel ? 'Ocultar Painel' : 'Mostrar Painel'}
            </button>
          </div>
        </div>
      
      <div className="flex-1 flex" style={{ height: `${svgHeight}px` }}>
        {/* Visualização principal */}
        <div 
          className={`relative ${mostrarPainel ? 'w-3/4' : 'w-full'} bg-gray-100 overflow-hidden ${cursorStyle}`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ minHeight: '100%' }}
        >
          {/* Título dos dois polos */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex w-full justify-between px-16 pointer-events-none">
            <div className="bg-white bg-opacity-70 px-3 py-1 rounded shadow text-sm font-bold text-gray-700">
              Vale do Silício / Big Tech
            </div>
            <div className="bg-white bg-opacity-70 px-3 py-1 rounded shadow text-sm font-bold text-gray-700">
              Extrema-Direita Política
            </div>
          </div>
          
          <svg 
            ref={svgRef} 
            width={svgWidth} 
            height={svgHeight} 
            viewBox={viewBox} 
          >
            <g transform={svgTransform}>
              {/* Desenhar áreas de clusters */}
              {Object.entries(coresNos).map(([cluster, cores]) => {
                const clusternos = nos.filter(n => n.cluster === cluster);
                if (clusternos.length === 0) return null;
                
                // Calcular pontos do contorno do cluster
                const padding = 60;
                const minX = Math.min(...clusternos.map(n => n.x)) - padding;
                const minY = Math.min(...clusternos.map(n => n.y)) - padding;
                const maxX = Math.max(...clusternos.map(n => n.x)) + padding;
                const maxY = Math.max(...clusternos.map(n => n.y)) + padding;
                
                return (
                  <g key={`cluster-${cluster}`} opacity={filtroCluster && filtroCluster !== cluster ? 0.1 : 0.3}>
                    <path 
                      d={`M${minX},${minY} L${maxX},${minY} L${maxX},${maxY} L${minX},${maxY} Z`}
                      fill={cores.leve}
                      stroke={cores.stroke}
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      rx="20"
                      ry="20"
                    />
                    <text 
                      x={minX + 15} 
                      y={minY + 25} 
                      fontSize="14" 
                      fontWeight="bold" 
                      fill={cores.stroke}
                    >
                      {cores.titulo}
                    </text>
                  </g>
                );
              })}
              
              {/* Renderizar conexões primeiro para que apareçam atrás dos nós */}
              {nivelDetalhe !== 'simples' && conexoes.map(conexao => {
                const path = calcularCaminhoConexao(conexao.source, conexao.target);
                const arrowhead = calcularSeta(conexao.source, conexao.target);
                const labelPos = calcularRotuloConexao(conexao.source, conexao.target);
                const style = estilosConexoes[conexao.tipo];
                const destacada = isConexaoDestacada(conexao) || (modo === 'apresentacao' && isConexaoDestacadaApresentacao(conexao.id));
                const opacidade = calcularOpacidadeConexao(conexao);
                
                return (
                  <g key={conexao.id} opacity={opacidade}>
                    {/* Caminho da conexão */}
                    <path 
                      d={path} 
                      fill="none" 
                      stroke={style.stroke}
                      strokeWidth={destacada ? style.strokeWidth * 1.5 : style.strokeWidth}
                      strokeDasharray={style.strokeDasharray}
                      onClick={() => handleEdgeClick(conexao.id)}
                      className="hover:cursor-pointer"
                    />
                    
                    {/* Seta */}
                    <g 
                      transform={`translate(${arrowhead.x}, ${arrowhead.y}) rotate(${arrowhead.rotation})`}
                      onClick={() => handleEdgeClick(conexao.id)}
                      className="hover:cursor-pointer"
                    >
                      <polygon 
                        points="-8,-4 0,0 -8,4" 
                        fill={style.stroke}
                      />
                    </g>
                    
                    {/* Rótulo da conexão - só mostrar em conexões destacadas ou no nível detalhado */}
                    {(destacada || nivelDetalhe === 'detalhado') && (
                      <g 
                        transform={`translate(${labelPos.x}, ${labelPos.y})`}
                        onClick={() => handleEdgeClick(conexao.id)}
                        className="hover:cursor-pointer"
                      >
                        <rect 
                          x="-50" 
                          y="-12" 
                          width="100" 
                          height="24" 
                          rx="4" 
                          fill="white" 
                          opacity="0.9"
                          strokeWidth="1"
                          stroke={style.stroke}
                        />
                        <text 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          fontSize="10"
                          fontWeight="bold"
                          fill={style.stroke}
                        >
                          {style.labelIcon} {conexao.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
              
              {/* Renderizar nós */}
              {nos.map(no => {
                const cor = coresNos[no.cluster];
                const isSelecionado = selectedNode === no.id || noDetalhe?.id === no.id;
                const isDestacado = isSelecionado || 
                  (modo === 'apresentacao' && isNoDestacadoApresentacao(no.id));
                const opacidade = calcularOpacidadeNo(no.id);
                const tamanho = calcularTamanhoNo(no.id);
                
                // Largura do texto baseada no tamanho do nó
                const textWidth = tamanho * 3;
                const fontSize = nivelDetalhe === 'simples' ? 8 : (isDestacado ? 12 : 10);
                
                return (
                  <g 
                    key={no.id} 
                    transform={`translate(${no.x}, ${no.y})`}
                    onMouseEnter={() => handleNodeHover(no.id)}
                    onMouseLeave={handleNodeLeave}
                    onClick={() => handleNodeClick(no.id)}
                    opacity={opacidade}
                    className="transition-all duration-300 ease-in-out hover:cursor-pointer"
                  >
                    {/* Cálculo dinâmico do tamanho baseado no texto */}
                    {(() => {
                      // Estimar largura do texto baseada no número de caracteres
                      const textWidth = no.label.length * (fontSize * 0.6);
                      // Largura mínima do box
                      const minWidth = Math.max(tamanho * 3, textWidth * 1.2);
                      
                      return (
                        <>
                          {/* Fundo do nó */}
                          <rect 
                            x={-minWidth / 2}
                            y={-tamanho / 2}
                            width={minWidth}
                            height={tamanho}
                            rx="5"
                            fill={cor.fill}
                            stroke={cor.stroke}
                            strokeWidth={isDestacado ? 2 : 1}
                            filter={isDestacado ? "drop-shadow(0px 0px 5px rgba(0,0,0,0.3))" : "none"}
                            className="transition-all duration-300 ease-in-out"
                          />
                          
                          {/* Rótulo do nó */}
                          <text 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                            fontSize={fontSize}
                            fontWeight={isDestacado ? "bold" : "normal"}
                            className="transition-all duration-300 ease-in-out"
                          >
                            {no.label}
                          </text>
                        </>
                      );
                    })()}
                  </g>
                );
              })}
            </g>
          </svg>
          
          {/* Legenda */}
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 p-3 rounded shadow-md text-xs z-10 max-w-xs">
            <h4 className="text-sm font-bold mb-2 pb-1 border-b border-gray-200">Legenda</h4>
            
            {/* Tipos de nós */}
            <div className="mb-2">
              {itensLegendaNos.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center mb-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => setFiltroCluster(filtroCluster === item.cluster ? null : item.cluster)}
                >
                  <div 
                    className="w-4 h-4 mr-2 rounded" 
                    style={{
                      backgroundColor: item.color,
                      border: `1px solid ${item.borderColor}`
                    }}
                  ></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            
            <hr className="my-2" />
            
            {/* Tipos de conexões */}
            <div>
              {itensLegendaConexoes.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center mb-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => setFiltroConexao(filtroConexao === item.tipo ? null : item.tipo)}
                >
                  <div 
                    className="w-6 h-2 mr-2" 
                    style={{
                      backgroundColor: item.style.stroke,
                      height: `${item.style.strokeWidth}px`,
                      backgroundImage: item.style.strokeDasharray !== '0' ? 
                        `repeating-linear-gradient(90deg, ${item.style.stroke}, ${item.style.stroke} 3px, transparent 3px, transparent 6px)` : 
                        'none'
                    }}
                  ></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Instruções */}
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 rounded shadow-md text-xs">
            <p>Use a roda do mouse para zoom, clique e arraste para mover, passe o mouse sobre nós para detalhes</p>
          </div>
          
          {/* Modo apresentação controles */}
          {modo === 'apresentacao' && (
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-3 rounded shadow-md z-10">
              <div className="text-sm font-bold mb-2">
                {getEtapasApresentacao()[etapaApresentacao].titulo}
              </div>
              <p className="text-xs mb-2">
                {getEtapasApresentacao()[etapaApresentacao].descricao}
              </p>
              <div className="flex justify-between mt-2">
                <button 
                  onClick={voltarApresentacao} 
                  disabled={etapaApresentacao === 0}
                  className={`px-2 py-1 text-xs rounded ${etapaApresentacao === 0 ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}
                >
                  Anterior
                </button>
                <span className="text-xs mx-2 self-center">
                  {etapaApresentacao + 1} de {getEtapasApresentacao().length}
                </span>
                <button 
                  onClick={avancarApresentacao} 
                  disabled={etapaApresentacao === getEtapasApresentacao().length - 1}
                  className={`px-2 py-1 text-xs rounded ${etapaApresentacao === getEtapasApresentacao().length - 1 ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Painel lateral de detalhes */}
        {mostrarPainel && (
          <div className="w-1/4 bg-white p-4 shadow-inner overflow-y-auto" style={{ height: `${svgHeight}px` }}>
            {noDetalhe ? (
              <div className="animate-fadeIn">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-6 h-6 mr-2 rounded" 
                    style={{
                      backgroundColor: coresNos[noDetalhe.cluster].fill,
                      border: `2px solid ${coresNos[noDetalhe.cluster].stroke}`
                    }}
                  ></div>
                  <h3 className="text-lg font-bold">{noDetalhe.label}</h3>
                  <button 
                    onClick={() => setNoDetalhe(null)} 
                    className="ml-auto text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-sm mb-4">{noDetalhe.descricao}</p>
                
                <div className="mb-4">
                  <h4 className="font-bold text-sm mb-2 pb-1 border-b">Conexões:</h4>
                  
                  {/* Conexões de saída */}
                  {conexoes.filter(e => e.source === noDetalhe.id).map(conexao => {
                    const targetNode = nos.find(n => n.id === conexao.target);
                    const style = estilosConexoes[conexao.tipo];
                    
                    return (
                      <div key={conexao.id} className="mb-2 text-xs">
                        <div className="flex items-center">
                          <span className="font-bold mr-1">{style.labelIcon}</span>
                          <span 
                            className="inline-block w-4 h-1 mr-1"
                            style={{
                              backgroundColor: style.stroke,
                              height: `${style.strokeWidth}px`,
                              backgroundImage: style.strokeDasharray !== '0' ? 
                                `repeating-linear-gradient(90deg, ${style.stroke}, ${style.stroke} 3px, transparent 3px, transparent 6px)` : 
                                'none'
                            }}
                          ></span>
                          <span className="font-bold">→</span>
                          <span 
                            className="ml-1 px-1 py-0.5 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => setNoDetalhe(targetNode)}
                            style={{
                              backgroundColor: coresNos[targetNode.cluster].fill,
                              border: `1px solid ${coresNos[targetNode.cluster].stroke}`
                            }}
                          >
                            {targetNode.label}
                          </span>
                        </div>
                        <p className="ml-5 mt-1 text-gray-600 italic">{conexao.descricao}</p>
                      </div>
                    );
                  })}
                  
                  {/* Conexões de entrada */}
                  {conexoes.filter(e => e.target === noDetalhe.id).map(conexao => {
                    const sourceNode = nos.find(n => n.id === conexao.source);
                    const style = estilosConexoes[conexao.tipo];
                    
                    return (
                      <div key={conexao.id} className="mb-2 text-xs">
                        <div className="flex items-center">
                          <span 
                            className="px-1 py-0.5 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => setNoDetalhe(sourceNode)}
                            style={{
                              backgroundColor: coresNos[sourceNode.cluster].fill,
                              border: `1px solid ${coresNos[sourceNode.cluster].stroke}`
                            }}
                          >
                            {sourceNode.label}
                          </span>
                          <span className="font-bold mx-1">→</span>
                          <span 
                            className="inline-block w-4 h-1 mx-1"
                            style={{
                              backgroundColor: style.stroke,
                              height: `${style.strokeWidth}px`,
                              backgroundImage: style.strokeDasharray !== '0' ? 
                                `repeating-linear-gradient(90deg, ${style.stroke}, ${style.stroke} 3px, transparent 3px, transparent 6px)` : 
                                'none'
                            }}
                          ></span>
                          <span className="font-bold">{style.labelIcon}</span>
                        </div>
                        <p className="ml-5 mt-1 text-gray-600 italic">{conexao.descricao}</p>
                      </div>
                    );
                  })}
                  
                  {conexoes.filter(e => e.source === noDetalhe.id || e.target === noDetalhe.id).length === 0 && (
                    <p className="text-sm text-gray-500 italic">Nenhuma conexão encontrada.</p>
                  )}
                </div>
                
                {/* Destacar conexões específicas */}
                {conexoes.some(e => (e.source === noDetalhe.id || e.target === noDetalhe.id) && e.tipo === 'brasil') && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-bold text-sm text-green-800 flex items-center">
                      <span className="mr-1">🇧🇷</span> Conexões com o Brasil
                    </h4>
                    {conexoes
                      .filter(e => (e.source === noDetalhe.id || e.target === noDetalhe.id) && e.tipo === 'brasil')
                      .map(conexao => (
                        <p key={conexao.id} className="text-xs text-green-700 mt-1">{conexao.descricao}</p>
                      ))
                    }
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-10">
                <p className="mb-4">Selecione um nó para ver detalhes</p>
                <p className="text-xs">Esta visualização mapeia conexões entre elite tecnológica, ideólogos e figuras políticas, destacando um fenômeno de convergência entre Big Tech e extrema-direita através de relações financeiras, ideológicas e de propriedade.</p>
                <p className="text-xs mt-4">Explore diferentes modos para uma visualização mais clara, e experimente o modo de apresentação para um tour guiado.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Barra de status inferior */}
      <div className="w-full bg-gray-800 text-white text-xs px-4 py-1 flex justify-between">
        <div>
          {selectedNode ? `Selecionado: ${nos.find(n => n.id === selectedNode)?.label || 'Nó'}` : 
           selectedEdge ? `Conexão: ${conexoes.find(e => e.id === selectedEdge)?.descricao || 'Conexão'}` : 
           'Passe o mouse sobre os elementos para explorar'}
        </div>
        <div>
          {filtroCluster ? `Filtro: ${coresNos[filtroCluster]?.titulo || filtroCluster}` : ''}
          {filtroCluster && filtroConexao ? ' | ' : ''}
          {filtroConexao ? `Tipo: ${estilosConexoes[filtroConexao]?.descricao || filtroConexao}` : ''}
        </div>
      </div>
    </div>
  );
};

export default RedeAtoresVisualizacao;
