> **Espelho público, somente leitura.** Fonte em repositório privado; site em https://portfolio.tiagords.com.br.

# Portfólio — Tiago Rodrigues

> Software engineer focado em **backends .NET**, **arquitetura distribuída** e **DevOps**.
> Este repositório é a **vitrine**: cada projeto abaixo tem o seu próprio repositório, com código, testes, CI e documentação própria.

[![.NET 10](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![Kafka](https://img.shields.io/badge/Kafka-231F20?logo=apachekafka&logoColor=white)](https://kafka.apache.org)
[![gRPC](https://img.shields.io/badge/gRPC-244C5A?logo=grpc&logoColor=white)](https://grpc.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)

---

## Visão geral

| Família | Repositórios | O que demonstra |
|---|---|---|
| **jobforge** | 3 | Orquestração de jobs: API + outbox transacional → Kafka → runner, leases em Redis, status por gRPC |
| **logpipe** | 4 | Pipeline de logs distribuído (ingestão → busca) com contratos gRPC versionados |
| **einvoice** | 3 | Nota fiscal: API, worker assíncrono (RabbitMQ) e interface Blazor |
| **Plataforma / DevOps** | 3+ | Pipelines CI/CD reutilizáveis, template Docker production-grade, testes de contrato |
| **Estudos de arquitetura** | 6 | Strangler fig, bridge SOAP→gRPC, cluster sharding, parsing de XML, deploy atômico |
| **Web** | 1 | Site institucional em Astro com CI/CD e deploy automático |

---

## 1. jobforge — orquestração de jobs

Plataforma de execução de jobs agendados: a API recebe o pedido, o orquestrador publica na fila, o runner executa e reporta o status.

| Repositório | Descrição |
|---|---|
| [`jobforge-orchestrator`](https://github.com/TiagoR85/jobforge-orchestrator) | REST API + OpenIddict, **outbox transacional** para Kafka, scheduler cron com lease em Redis, stream de status por gRPC |
| [`jobforge-runner`](https://github.com/TiagoR85/jobforge-runner) | Consumer Kafka com **dedup em Redis** (`SET NX`), retry inline com backoff, **DLQ** e reporte por gRPC |
| [`jobforge-ui`](https://github.com/TiagoR85/jobforge-ui) | Console em Blazor Server (jobs, *Run now*, execuções com refresh) + hub de `docker compose` da família |

## 2. logpipe — pipeline de logs

Sistema que apanha logs das aplicações e encaminha-os para um arquivo pesquisável, em tiers independentes.

| Repositório | Descrição |
|---|---|
| [`logpipe-ingest`](https://github.com/TiagoR85/logpipe-ingest) | Tier de ingestão do pipeline |
| [`logpipe-search`](https://github.com/TiagoR85/logpipe-search) | Tier de busca |
| [`logpipe-contracts`](https://github.com/TiagoR85/logpipe-contracts) | Contrato gRPC **versionado** compartilhado entre os tiers |
| [`logpipe-ui`](https://github.com/TiagoR85/logpipe-ui) | Interface do pipeline |

## 3. einvoice — notas fiscais

Fluxo completo de emissão: API que orquestra, worker que gera o PDF e publica o resultado, interface para o atendimento.

| Repositório | Descrição |
|---|---|
| [`einvoice-api`](https://github.com/TiagoR85/einvoice-api) | API do hub de notas fiscais |
| [`einvoice-worker`](https://github.com/TiagoR85/einvoice-worker) | Worker RabbitMQ com ack manual, dedup em Redis, retry exponencial e DLQ; gera o PDF |
| [`einvoice-ui`](https://github.com/TiagoR85/einvoice-ui) | Interface Blazor Server: parties, faturas, badge de estado e download do PDF por proxy |

## 4. Plataforma / DevOps

| Repositório | Descrição |
|---|---|
| [`ci-pipeline-templates`](https://github.com/TiagoR85/ci-pipeline-templates) | Pipelines reutilizáveis para .NET: **GitHub Actions**, **Azure DevOps** (aprovação DEV/HOM/PROD) e **Jenkins**, com quality gate de cobertura e scan de vulnerabilidades |
| [`docker-dotnet-template`](https://github.com/TiagoR85/docker-dotnet-template) | Template Docker production-grade: multi-stage sem SDK no runtime, **non-root**, healthcheck, métricas Prometheus e CI que bloqueia cobertura baixa e CVEs altas |
| [`contract-tests-wiremock`](https://github.com/TiagoR85/contract-tests-wiremock) | Testes de contrato contra APIs externas (WireMock), a correr offline |

## 5. Estudos de arquitetura

| Repositório | Descrição |
|---|---|
| [`akka-cluster-jobs`](https://github.com/TiagoR85/akka-cluster-jobs) | Cluster sharding do Akka.NET: 3 nós em Docker, 10k jobs, recuperação de falha de nó |
| [`soap-grpc-bridge`](https://github.com/TiagoR85/soap-grpc-bridge) | Ponte **SOAP 1.2 → gRPC** para integrações legadas de ERP com a SEFAZ, com WSDL automático e contrato de falha estável |
| [`vbnet-strangler-fig`](https://github.com/TiagoR85/vbnet-strangler-fig) | Migração *strangler fig* de um serviço VB.NET (net48) para C#/.NET 10, com façade, shadow traffic e testes golden-master |
| [`nfe-xml-to-report`](https://github.com/TiagoR85/nfe-xml-to-report) | Validação de XMLs de nota fiscal em Python + geração de relatórios em .NET, com proteção contra XXE |
| [`powerhell-deploy-kit`](https://github.com/TiagoR85/powerhell-deploy-kit) | Módulo PowerShell para deploys atómicos, com estado junto ao alvo, histórico append-only e rollback automático |
| [`baileys-fork`](https://github.com/TiagoR85/Baileys) | Fork do [Baileys](https://github.com/WhiskeySockets/Baileys) (WhatsApp) usado como estudo de protocolo |

## 6. Web

| Repositório | Descrição |
|---|---|
| [`brubru-nails`](https://github.com/TiagoR85/brubru-nails) | Site institucional da Brubru Nails — Astro + Tailwind, SEO, animações e deploy por GitHub Actions/Pages |

---

## Stack

- **Linguagens:** C# 14 / .NET 10, Python, TypeScript, PowerShell
- **Dados e mensageria:** PostgreSQL, Redis, RabbitMQ, Kafka, SQLite
- **Transporte:** REST (ASP.NET Core), gRPC, SOAP/WCF, SignalR
- **Front-end:** Blazor Server, Blazor WebAssembly, Astro, Tailwind
- **Infra:** Docker / Docker Compose, Akka.NET, Prometheus, GitHub Actions, Azure DevOps, Jenkins
- **Práticas:** TDD, testes de contrato, quality gates (cobertura mínima), least privilege, observabilidade

## Como este repositório é mantido

- Cada projeto vive no seu próprio repositório, com `README`, testes e CI próprios.
- O índice acima é a única fonte de verdade deste repositório; ao concluir ou iniciar um projeto, atualize a tabela correspondente.
- Documentação de estudo (guias longas, notas pessoais) fica **fora** do GitHub, em repositório privado.
- **Espelho público**: `github.com/TiagoR85/portfolio` é gerado pelo `mirror.yml` a cada push na `main` (snapshot por allowlist, 1 commit, force-push). Nunca editar lá — a próxima publicação sobrescreve. `docs/`, `deploy/`, `.github/` e `.impeccable/` ficam só aqui.

## Contato

- GitHub: [@TiagoR85](https://github.com/TiagoR85)
- E-mail: [Tiago.rds85@hotmail.com](mailto:Tiago.rds85@hotmail.com)
- Localização: São José — SC, Brasil

## Licença

Código sob licença [MIT](LICENSE).
