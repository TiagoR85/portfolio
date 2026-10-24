---
title: dashboard-king
category: sistema
order: 7
summary: Clone do Apex Blazor Dashboard com 50+ rotas, tema dark/light, auth client-side e deploy automático por CI/CD.
problem: Dashboards admin prontos vêm com licença, design datado ou SaaS fechado; montar um do zero com tema, gráficos e CRUDs cobra semanas de trabalho repetido a cada cliente.
stack: ['.NET 10', 'Blazor WASM', 'Tailwind CSS v4', 'ApexCharts', 'Docker']
repo: https://github.com/TiagoR85/DashboardTheKingThePower-public
prints:
  - { src: '/img/prints/dashboard-king-1.avif', alt: 'Dashboard SaaS com receita recorrente, área de crescimento e donut de planos' }
  - { src: '/img/prints/dashboard-king-2.avif', alt: 'Analytics com KPIs de receita, gráfico de barras e fontes de tráfego' }
diagram: /img/diagrams/dashboard-king.svg
takeaways:
  - 'CI/CD fecha o ciclo: push roda testes, publica e troca o container no ar sem intervenção manual.'
  - 'Tailwind v4 com tokens OKLCh permite trocar tema e cor de destaque inteira sem tocar nos componentes.'
  - 'Auth client-side resolve o protótipo; para dado sensível, a camada de API é o próximo passo.'
---
O painel recria um dashboard admin completo com Kanban, calendário, CRUDs de clientes e serviços, biblioteca de gráficos e command palette (Ctrl+K). O build é 100% estático (WebAssembly), servido por nginx em container Docker; o GitHub Actions roda os testes e troca a release na VPS a cada push em `master`.
