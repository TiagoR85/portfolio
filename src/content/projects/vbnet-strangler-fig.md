---
title: vbnet-strangler-fig
category: estudo
order: 6
summary: Migração strangler fig de VB.NET (net48) para C#/.NET 10 com fachada, shadow traffic e testes golden-master.
problem: Serviço VB.NET em produção não pode parar; migrar de uma vez é inviável e sem rede de segurança.
stack: ['VB.NET', 'C# 14 / .NET 10', 'Docker', 'xUnit']
repo: https://github.com/TiagoR85/vbnet-strangler-fig
prints: []
diagram: /img/diagrams/vbnet-strangler-fig.svg
takeaways:
  - 'Fachada roteia por rota: legado e novo convivem, migração rota a rota.'
  - 'Shadow traffic compara respostas antes do corte — golden-master pega divergência.'
  - 'Rollback por configuração, sem redeploy.'
---
A fachada recebe o tráfego e encaminha para o legado VB.NET ou o serviço novo em C#/.NET 10. Shadow traffic espelha requisições e compara respostas; o corte é por configuração.
