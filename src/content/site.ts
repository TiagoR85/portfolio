export const site = {
  name: 'Tiago Rodrigues',
  role: 'Engenheiro de Software · back-end .NET',
  tagline: 'sistemas .NET de ponta a ponta: do banco de dados ao deploy, com filas, integrações e testes',
  proof: [
    { value: '8+', label: 'anos em software' },
    { value: '20+', label: 'módulos no SAT/SEFAZ-SC' },
    { value: 'milhões', label: 'de documentos fiscais/mês' },
  ],
  email: 'Tiago.rds85@hotmail.com',
  github: 'https://github.com/TiagoR85',
  linkedin: 'https://www.linkedin.com/in/tiago-rodrigues-developerti',
  whatsapp: '5548984710744',
  services: [
    { n: '01', name: 'APIs e back-end sob medida', text: 'API, banco de dados e regras de negócio feitas para o seu processo, com autenticação, permissões e deploy incluso.' },
    { n: '02', name: 'Sistemas completos', text: 'API, painel, filas e integrações num sistema só — entregue, testado e no ar.' },
    { n: '03', name: 'DevOps e CI/CD', text: 'Pipelines reutilizáveis, Docker production-grade, quality gates de cobertura e scan de vulnerabilidades.' },
    { n: '04', name: 'Migração e arquitetura', text: 'Strangler fig, bridge SOAP→gRPC, sharding: tirar sistema legado da frente sem parar a operação.' },
    { n: '05', name: 'Filas e integrações', text: 'Kafka, RabbitMQ e gRPC com outbox, dedup, retry e DLQ — integração com o que você já usa.' },
  ],
  stack: ['C# 14 / .NET 10', 'PostgreSQL', 'Redis', 'Kafka', 'RabbitMQ', 'gRPC', 'Docker', 'Akka.NET', 'Prometheus', 'GitHub Actions', 'Azure DevOps', 'Jenkins', 'Blazor', 'Python', 'PowerShell'],
  cv: {
    profile: [
      'Engenheiro de software com 8+ anos de experiência, hoje sócio e engenheiro principal no SAT (Sistema de Administração Tributária) da SEFAZ-SC — mais de 20 módulos, 300+ contribuidores e dezenas de milhões de documentos fiscais processados por mês.',
      'Trabalho de ponta a ponta: API, mensageria, painel, testes e deploy. Cada família de projetos abaixo tem repositório próprio, com README, testes e CI.',
    ],
    availability: 'Remoto (Brasil) ou presencial em Florianópolis/SC · resposta em até 1 dia útil',
    experience: [
      {
        role: 'Sócio e Engenheiro de Software',
        company: 'DBY Desenvolvimento de Sistemas',
        place: 'Florianópolis, SC · prestação de serviços à SEFAZ-SC',
        period: '08/2019 — atual',
        bullets: [
          'Engenheiro principal no SAT: plataforma fiscal com 20+ módulos, 300+ contribuidores e milhões de documentos fiscais por mês.',
          'Product Owner e Scrum Master em projetos de grande porte, com múltiplos stakeholders governamentais.',
          'Bibliotecas .NET multi-target (net48 + net8.0) para migração gradual sem ruptura de integrações governamentais.',
          'APIs RESTful e serviços gRPC para integrações interagências com SSP, CPESC, TJSC e PRF.',
          'Jobs distribuídos com Akka.NET (actor model + cluster sharding) e autenticação OAuth 2.0 / OpenID Connect com OpenIddict.',
          'Filas de mensageria (RabbitMQ, Kafka) para pipelines assíncronos e geração de relatórios em Excel e PDF.',
          'Modernização de legado ASP.NET Web Forms (4.500+ páginas) para Blazor Server; CI/CD com Azure DevOps e Jenkins.',
        ],
      },
      {
        role: 'Analista de Suporte de TI — Software',
        company: 'EDM Softwares',
        place: 'Florianópolis, SC',
        period: '02/2018 — 07/2019',
        bullets: ['Suporte técnico e resolução de problemas em aplicações corporativas.', 'Transição para desenvolvimento com estudo autônomo de C# e .NET.'],
      },
      {
        role: 'Especialista em Suporte de Software Fiscal',
        company: 'Nacional Equipamentos de Automação',
        place: 'Florianópolis, SC',
        period: '04/2016 — 09/2017',
        bullets: ['Suporte técnico e treinamento de usuários em software de gestão fiscal — primeiro contato com o ecossistema fiscal brasileiro.'],
      },
    ],
    education: [
      { course: 'Bacharelado em Engenharia de Software', institution: 'Centro Universitário União das Américas (Descomplica)', period: '01/2024 — em andamento · conclusão prevista em 2027', detail: 'QEQ nível 6 · ~75% concluído · 2.240h cursadas' },
    ],
    languages: [
      { name: 'Português', level: 'nativo' },
      { name: 'Inglês', level: 'B1 — leitura, escrita e interação; produção oral A2' },
    ],
    certifications: [
      'Microsoft Certified: Azure Developer Associate (abr/2025)',
      'Governança Digital 4.0 — 240h (2026)',
      'Descomplica — trilha Engenharia de Software: 10 certificados (programação, POO, banco de dados, mobile, estruturas de dados, sistemas operacionais, UX, IoT e redes)',
      'DevOps I e II · Cloud Computing · Testes de Software (Descomplica)',
    ],
    skills: [
      { group: 'Linguagens', items: ['C#', 'TypeScript / JavaScript', 'Python', 'PowerShell', 'SQL'] },
      { group: 'Back-end e integrações', items: ['ASP.NET', 'Blazor', 'gRPC', 'REST', 'SOAP / WCF', 'Entity Framework', 'Dapper', 'OAuth 2.0 / JWT', 'OpenIddict'] },
      { group: 'Dados', items: ['SQL Server', 'PostgreSQL', 'Oracle', 'MySQL', 'Redis', 'MongoDB', 'Elasticsearch / Kibana', 'MinIO'] },
      { group: 'Mensageria', items: ['Kafka', 'RabbitMQ'] },
      { group: 'Cloud e DevOps', items: ['Azure', 'AWS (S3)', 'Docker', 'Kubernetes', 'Jenkins', 'Azure DevOps', 'GitHub Actions', 'OpenTelemetry / Prometheus'] },
      { group: 'Qualidade', items: ['TDD / DDD', 'MSTest / xUnit', 'Moq', 'WireMock', 'cobertura de código'] },
      { group: 'Fiscal', items: ['NF-e', 'CT-e', 'MDF-e', 'NFCom', 'NF3-e'] },
    ],
    families: [
      { name: 'jobforge', repos: [
        { name: 'jobforge-orchestrator', url: 'https://github.com/TiagoR85/jobforge-orchestrator', text: 'REST API + OpenIddict, outbox transacional para Kafka, scheduler cron com lease em Redis, status por gRPC.' },
        { name: 'jobforge-runner', url: 'https://github.com/TiagoR85/jobforge-runner', text: 'Consumer Kafka com dedup em Redis (SET NX), retry com backoff, DLQ e reporte por gRPC.' },
        { name: 'jobforge-ui', url: 'https://github.com/TiagoR85/jobforge-ui', text: 'Console Blazor Server: jobs, Run now, execuções com refresh.' } ] },
      { name: 'logpipe', repos: [
        { name: 'logpipe-ingest', url: 'https://github.com/TiagoR85/logpipe-ingest', text: 'Tier de ingestão do pipeline de logs.' },
        { name: 'logpipe-search', url: 'https://github.com/TiagoR85/logpipe-search', text: 'Tier de busca.' },
        { name: 'logpipe-contracts', url: 'https://github.com/TiagoR85/logpipe-contracts', text: 'Contrato gRPC versionado compartilhado entre os tiers.' },
        { name: 'logpipe-ui', url: 'https://github.com/TiagoR85/logpipe-ui', text: 'Interface do pipeline.' } ] },
      { name: 'einvoice', repos: [
        { name: 'einvoice-api', url: 'https://github.com/TiagoR85/einvoice-api', text: 'API do hub de notas fiscais.' },
        { name: 'einvoice-worker', url: 'https://github.com/TiagoR85/einvoice-worker', text: 'Worker RabbitMQ com ack manual, dedup, retry exponencial, DLQ e geração de PDF.' },
        { name: 'einvoice-ui', url: 'https://github.com/TiagoR85/einvoice-ui', text: 'UI Blazor Server com parties, faturas e download de PDF por proxy.' } ] },
      { name: 'Plataforma / DevOps', repos: [
        { name: 'ci-pipeline-templates', url: 'https://github.com/TiagoR85/ci-pipeline-templates', text: 'Pipelines reutilizáveis: GitHub Actions, Azure DevOps (DEV/HOM/PROD) e Jenkins com quality gate.' },
        { name: 'docker-dotnet-template', url: 'https://github.com/TiagoR85/docker-dotnet-template', text: 'Template Docker multi-stage, non-root, healthcheck, métricas e CI que bloqueia CVE alta.' },
        { name: 'contract-tests-wiremock', url: 'https://github.com/TiagoR85/contract-tests-wiremock', text: 'Testes de contrato contra APIs externas, offline.' } ] },
      { name: 'Estudos de arquitetura', repos: [
        { name: 'akka-cluster-jobs', url: 'https://github.com/TiagoR85/akka-cluster-jobs', text: 'Cluster sharding Akka.NET: 3 nós, 10k jobs, recuperação de nó.' },
        { name: 'soap-grpc-bridge', url: 'https://github.com/TiagoR85/soap-grpc-bridge', text: 'Ponte SOAP 1.2 → gRPC com WSDL automático.' },
        { name: 'vbnet-strangler-fig', url: 'https://github.com/TiagoR85/vbnet-strangler-fig', text: 'Strangler fig de VB.NET net48 para C#/.NET 10 com shadow traffic e golden-master.' },
        { name: 'nfe-xml-to-report', url: 'https://github.com/TiagoR85/nfe-xml-to-report', text: 'Validação de XML de NF-e em Python + relatórios .NET, com proteção XXE.' },
        { name: 'powerhell-deploy-kit', url: 'https://github.com/TiagoR85/powerhell-deploy-kit', text: 'Módulo PowerShell de deploys atômicos com rollback automático.' } ] },
      { name: 'Web', repos: [
        { name: 'brubru-nails', url: 'https://github.com/TiagoR85/brubru-nails', text: 'Site institucional em Astro + Tailwind, SEO e deploy por GitHub Actions.' } ] },
    ],
  },
} as const;
