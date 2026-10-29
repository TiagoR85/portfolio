---
title: logpipe
category: sistema
order: 2
summary: Pipeline de logs em tiers independentes com contrato gRPC versionado entre ingestão e busca.
problem: Aplicações espalhadas geram logs em formatos e destinos diferentes; sem um contrato versionado, o tier de busca quebra a cada deploy de ingestão.
stack: ['.NET 10', 'gRPC', 'Docker', 'PostgreSQL']
repo: https://github.com/TiagoR85/logpipe-ingest
prints:
  - { src: '/img/prints/logpipe-ui-1.avif', alt: 'Busca de logs com filtro por serviço e nível' }
  - { src: '/img/prints/logpipe-ui-2.avif', alt: 'Detalhe de trace no logpipe com eventos correlacionados' }
diagram: /img/diagrams/logpipe.svg
takeaways:
  - 'Tiers evoluem e escalam separados; o contrato versionado é a única dependência.'
  - 'Contrato em repositório próprio impede breaking change silencioso.'
---
Ingestão recebe logs das aplicações e grava no seu tier; busca consome pelo contrato gRPC versionado (`logpipe-contracts`). UI consulta a busca. Cada tier tem Dockerfile e deploy próprio.
