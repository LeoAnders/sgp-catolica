# Padrão de issue

Toda issue nova segue a estrutura de
[`.github/ISSUE_TEMPLATE/nova-tarefa.md`](../../.github/ISSUE_TEMPLATE/nova-tarefa.md).
Isso vale tanto para quem abre pela interface do GitHub quanto para a IA abrindo via
`gh issue create` — usar o template como corpo, não inventar estrutura livre a cada
issue.

## Seções obrigatórias

- **Contexto**: por que a tarefa existe. Cite o RF/RNF de
  `docs/produto/requisitos-funcionais.md` quando houver um, o estado atual (rota
  marcador, arquivo desatualizado, ausência de algo) e qualquer pendência ou decisão
  relacionada (`docs/pendencias.md`, `docs/decisoes/`).
- **Escopo** (+ **Fora de escopo**): específico o bastante para implementar sem
  adivinhar — tela e rota, componentes/padrões existentes a reaproveitar, fonte de
  dados em `@sgp/mocks`. "Fora de escopo" existe para deixar explícito o que essa
  issue deliberadamente não resolve, e por quê.
- **Documentação**: toda issue que muda comportamento ou tela responde três
  perguntas, apagando o que não se aplicar:
  - **Técnica**: o que muda em `docs/design/experiencia-web-atual.md` (ou
    `-mobile-atual.md`) e, se nascer um padrão novo reutilizável, em
    `docs/design/design-system-web.md` (ou `-mobile.md`).
  - **Referência de IA**: o que conferir/atualizar em `.claude/skills/sgp-catolica-web`
    ou `-mobile`, para o arquivo não ficar desatualizado como aconteceu depois do
    redesign (issue #20).
  - **Usuário**: print em `docs/telas/` (capturado com o MCP `playwright`, ver
    `docs/telas/README.md`), referenciado em `docs/README.md` — ou, quando a tarefa
    for conteúdo consumido dentro do produto (ex.: FAQ de uma tela de suporte), onde
    esse conteúdo vive (não é `docs/`, que é documentação da equipe).
- **Checklist**: lista de `- [ ]` no fim da issue, marcável no GitHub, resumindo o que
  precisa estar feito — escopo, documentação e os comandos de verificação
  (`typecheck`, `build`, `git diff --check`).

## Relações entre issues

Quando uma tarefa não pode ser implementada sem outra existir antes (ex.: uma tela sem
a arquitetura/navegação do app), registrar isso como dependência estruturada do
GitHub, não só como texto no Contexto:

```bash
# bloqueada_id e bloqueadora_id sao o "id" numerico da issue (gh api .../issues/N --jq '.id'),
# nao o numero visivel (#N)
gh api repos/OWNER/REPO/issues/BLOQUEADA/dependencies/blocked_by -X POST -F issue_id=BLOQUEADORA
```

Isso aparece no board e na página da issue como "Blocked by"/"Blocking" de verdade, não
como uma menção solta.

## Board e milestone

Toda issue nova é adicionada ao project (`gh project item-add`), recebe a milestone da
fase (N1/N2/N3) e uma data prevista no campo "Data prevista" do board, coerente com a
complexidade relativa das outras tarefas da mesma leva.
