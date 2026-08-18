# Convencao de commits

Aplique esta convencao sempre que for solicitado a criar um commit neste
repositorio.

## Formato

Padrao [Conventional Commits](https://www.conventionalcommits.org/), compativel
com commitlint (`@commitlint/config-conventional`):

```
<tipo>(<escopo opcional>): <descricao>

<corpo opcional>

<rodape opcional>
```

## Tipos

- `feat`: nova funcionalidade
- `fix`: correcao de bug
- `docs`: documentacao
- `style`: formatacao, sem mudanca de logica
- `refactor`: mudanca de codigo sem alterar comportamento
- `perf`: melhoria de performance
- `test`: testes
- `build`: build, dependencias, ferramentas de build
- `ci`: integracao continua
- `chore`: tarefas gerais, manutencao, ferramental
- `revert`: reversao de commit anterior

## Regras

- Mensagens em portugues (pt-br). Tipo e escopo ficam em ingles (convencao do
  commitlint); descricao e corpo em portugues.
- Descricao no imperativo, minuscula, sem ponto final: `adiciona X`, nao
  `Adicionado X.` nem `Adiciona X.`.
- Escopo opcional entre parenteses referencia o app ou pacote afetado (`web`,
  `mobile`, `shared-types`, `mocks`, `design-tokens`) quando fizer sentido.
- Corpo explica o motivo da mudanca, nao o que mudou — o diff ja mostra o que
  mudou.
- Nao citar coautoria de IA ou Claude Code na mensagem de commit.
- Commits atomicos: cada commit representa uma mudanca logicamente coesa.

## Exemplos

```
feat(mobile): adiciona tela de fila de correcao offline

fix(web): corrige navegacao da tela de aplicacao de prova

chore: adiciona skills e mcp de design ao ferramental de ia

docs: documenta decisao sobre estrutura de pacotes
```
