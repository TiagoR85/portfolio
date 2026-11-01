---
title: plataforma DevOps
category: devops
order: 4
summary: Pipelines CI/CD reutilizáveis e template Docker production-grade com quality gate e scan de CVE.
problem: Cada projeto .NET reinventava pipeline e Dockerfile; cobertura e vulnerabilidade eram descobertas em produção.
stack: ['GitHub Actions', 'Azure DevOps', 'Jenkins', 'Docker', 'Prometheus']
repo: https://github.com/TiagoR85/ci-pipeline-templates
prints: []
diagram: /img/diagrams/devops.svg
takeaways:
  - 'Template único: build, testes com cobertura mínima e scan de vulnerabilidade em toda PR.'
  - 'Imagem runtime sem SDK, non-root, healthcheck e métricas Prometheus.'
  - 'Aprovação por ambiente (DEV/HOM/PROD) no Azure DevOps.'
---
`ci-pipeline-templates` centraliza pipelines para GitHub Actions, Azure DevOps e Jenkins; `docker-dotnet-template` entrega o Dockerfile multi-stage com gate de cobertura e CVE. `contract-tests-wiremock` roda contrato offline contra APIs externas.
