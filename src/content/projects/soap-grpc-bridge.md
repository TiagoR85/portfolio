---
title: soap-grpc-bridge
category: estudo
order: 5
summary: Ponte SOAP 1.2 → gRPC para integrações legadas de ERP com a SEFAZ, com WSDL automático e falha estável.
problem: ERP legado só fala SOAP; times novos querem gRPC. Reescrever a integração é caro e arriscado.
stack: ['.NET 10', 'SOAP/WCF', 'gRPC', 'Docker']
repo: https://github.com/TiagoR85/soap-grpc-bridge
prints: []
diagram: /img/diagrams/soap-grpc-bridge.svg
takeaways:
  - 'WSDL lido em runtime: contrato gRPC acompanha o serviço legado sem recompilar.'
  - 'Falha mapeada para status code estável — cliente novo não depende de string do SOAP.'
---
A ponte expõe gRPC e traduz para o SOAP 1.2 do ERP/SEFAZ, lendo o WSDL automaticamente. Erros do SOAP viram `Status` gRPC estável, com teste de contrato.
