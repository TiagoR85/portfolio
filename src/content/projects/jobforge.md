---
title: jobforge
category: sistema
order: 1
summary: Orquestração de jobs agendados com outbox transacional, leases em Redis e status por gRPC.
problem: Agendar e executar jobs sem perder pedido quando a API cai no meio do caminho, mantendo status confiável para o console.
stack: ['.NET 10', 'PostgreSQL', 'Redis', 'Kafka', 'gRPC', 'Blazor']
repo: https://github.com/TiagoR85/jobforge-orchestrator
prints:
  - { src: '/img/prints/jobforge-ui-1.avif', alt: 'Lista de jobs do jobforge com botões Run now e status' }
  - { src: '/img/prints/jobforge-ui-2.avif', alt: 'Detalhe de execução de job com status por etapa' }
diagram: /img/diagrams/jobforge.svg
takeaways:
  - 'Outbox transacional: o job só existe depois que a linha do banco e o evento Kafka estão no mesmo commit.'
  - 'Lease em Redis evita dois schedulers rodando o mesmo job.'
  - 'Status via server-streaming gRPC — console atualiza sem polling.'
---
A API recebe o pedido e grava job + evento de outbox na mesma transação. O scheduler pega o lease no Redis e publica no Kafka; o runner consome, executa com retry e reporta por gRPC. O console Blazor escuta o stream de status.
