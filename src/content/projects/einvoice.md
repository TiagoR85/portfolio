---
title: einvoice
category: sistema
order: 3
summary: 'Emissão de nota fiscal de ponta a ponta: API, worker RabbitMQ que gera o PDF e interface de atendimento.'
problem: Emitir nota e gerar PDF é lento e falha; sem dedup e DLQ, retry duplica nota e atrasa o atendimento.
stack: ['.NET 10', 'RabbitMQ', 'Redis', 'Blazor', 'PostgreSQL']
repo: https://github.com/TiagoR85/einvoice-api
prints: []
diagram: /img/diagrams/einvoice.svg
takeaways:
  - 'Ack manual + dedup em Redis: reprocessamento não duplica nota.'
  - 'Retry exponencial com DLQ deixa falha visível em vez de travar a fila.'
  - 'PDF servido por proxy na UI evita expor storage.'
---
API grava a fatura e publica na fila. O worker consome com ack manual, dedup em Redis e retry exponencial; na falha final vai para DLQ. O PDF é gerado pelo worker e baixado pelo proxy da UI Blazor.
