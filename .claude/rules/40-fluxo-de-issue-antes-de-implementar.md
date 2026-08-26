# Issue antes de implementar

Este repositorio rastreia decisao e trabalho pelo GitHub Issues. Codigo sem issue
correspondente perde o historico de "por que" para quem le depois.

## Regra

- Encontrou um problema novo, uma proposta de mudanca ou uma situacao que exige decisao
  (nao so um typo ou ajuste trivial)? Abra uma issue descrevendo o problema/proposta antes
  de implementar, mesmo que a implementacao va sair no mesmo PR logo em seguida.
- Trabalho que ja existe como issue: leia a issue antes de comecar, para nao divergir do
  que foi combinado la.
- Ajuste minimo e obviamente correto (typo, formatacao, correcao de link) nao precisa de
  issue.

## PRs referenciam issues, nao as reescrevem

- A descricao do PR deve linkar a(s) issue(s) relacionada(s) (`Closes #N` para a que o PR
  resolve, `Relacionado a #N` para contexto) em vez de copiar ou reescrever o conteudo da
  issue.
- O corpo do PR foca no que mudou de fato e no plano de teste; o "por que" fica na issue.
- Use o template em `.github/pull_request_template.md`.

## Quando nao houver issue para um trabalho ja feito

- Se perceber, durante revisao ou ao abrir o PR, que o trabalho nao tem issue, crie uma
  issue retroativa antes de abrir/atualizar o PR e referencie-a. Isso mantem o historico
  rastreavel mesmo quando a decisao foi tomada em conversa fora do GitHub.
