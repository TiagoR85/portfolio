---
title: doccheck
category: devops
order: 8
summary: Fiscal de documentação que falha o commit quando a doc e o código discordam — trata README como contrato executável, não como texto que envelhece em silêncio.
problem: Documentação desatualizada não quebra build, não gera 500 e não acorda ninguém. Ela apenas mente com confiança até alguém seguir o README, perder quarenta minutos e descobrir que a rota mudou há três meses. Revisar 31 repositórios na mão não escala; confiar na memória, menos ainda.
stack: ['Python (stdlib)', 'Git hooks', 'GitHub Actions', 'gitleaks']
repo: https://github.com/TiagoR85/doccheck
prints: []
diagram: /img/diagrams/doccheck.svg
takeaways:
  - 'Regra que não dá para avaliar é pulada, nunca falha: falso positivo crônico ensina o time a usar --no-verify e aí o mecanismo morreu.'
  - 'Checagem estrutural pega doc ausente; checagem de fato pega doc errada (endpoint que não existe). Doc incompleta continua sendo trabalho de gente.'
  - 'Vendorizado em .githooks: roda offline em 0,3 s e não transforma o build em dependência de rede.'
---
Três camadas, três níveis de honestidade. A primeira é estrutural: README existe, seção não está vazia, versão do STATUS bate com o topo do CHANGELOG. A segunda é factual: o endpoint citado na seção de API realmente existe no código — lido estaticamente de controllers ASP.NET (inclusive os que herdam `[Route]` da classe base), Flask/FastAPI, Express e rotas de arquivo do Astro. A terceira não existe, e o README diz isso: "a doc descreve o comportamento novo?" só revisão responde.

A regra de ouro veio de errar: um verificador genérico de caminhos acusou 242 problemas em 11 repositórios e praticamente todos eram falso positivo — placeholder `{video_id}`, elipse `src/.../`, plano congelado de 2026. Falso positivo crônico tem um efeito colateral previsível: o time aprende `--no-verify`. Daí o princípio que ficou no código — o que não dá para avaliar é **pulado**, com o motivo escrito na saída, e nunca vira bloqueio.

Hoje roda em 31 repositórios locais via `doccheck install`, que vendoriza o pacote em `.githooks/` (o repo continua self-contained e o hook funciona sem rede) e preserva qualquer hook que já existisse, encadeando em `pre-commit.local`. Encontrou rotas fantasma em projetos .NET, uma contagem de testes que contradizia o próprio STATUS e um `README` 42 commits atrás do código.
