---
name: Nova tarefa
about: Modelo padrão para issues do projeto (tela, ajuste técnico, infraestrutura, documentação)
title: ''
labels: ''
assignees: ''
---

<!--
Antes de preencher: veja .claude/rules/40-fluxo-de-issue-antes-de-implementar.md —
problema novo, proposta de mudança ou algo que exige decisão vira issue antes do
código, mesmo que a implementação saia no mesmo PR logo em seguida.

Prefixo sugerido no título: [web] ou [mobile] para tela; infra: para ferramental/CI/
hospedagem; docs: para documentação.
-->

## Contexto

<!--
Por que esta tarefa existe. Cite o requisito (RFxx/RNFxx de
docs/produto/requisitos-funcionais.md), o estado atual (rota marcador, arquivo
desatualizado, ausência de algo) e qualquer decisão/registro relacionado
(docs/pendencias.md, docs/decisoes/, issue anterior).
-->

## Escopo

<!--
O que entra, específico o bastante para implementar sem adivinhar: tela e rota,
componentes/padrões existentes a reaproveitar (não recriar), fonte de dados em
`@sgp/mocks`, arquivo de estado local a criar ou usar.
-->

### Fora de escopo

<!-- O que deliberadamente não entra aqui, e por quê (fase, RF ainda não implementado, decisão pendente). -->

## Documentação

<!-- Apagar o que não se aplicar a esta tarefa. -->

Atualizar na mesma entrega, não depois:

- **Técnica**: `docs/design/experiencia-web-atual.md` ou `docs/design/experiencia-mobile-atual.md`
  (mapa de rotas/situação); `docs/design/design-system-web.md` ou `-mobile.md` se
  nascer um padrão novo reutilizável.
- **Referência de IA**: `.claude/skills/sgp-catolica-web` ou `-mobile` — conferir que
  continua batendo com o que foi implementado.
- **Usuário**: print da tela em `docs/telas/` (via MCP `playwright`, ver
  `docs/telas/README.md`), referenciado em `docs/README.md`.

## Checklist

- [ ] <!-- item de escopo 1 -->
- [ ] <!-- item de escopo 2 -->
- [ ] Documentação atualizada conforme a seção acima
- [ ] `npm run typecheck --workspace @sgp/web` (ou `@sgp/mobile`) passa
- [ ] `npm run build --workspace @sgp/web` passa (quando aplicável)
- [ ] `git diff --check` sem problema de espaço em branco
