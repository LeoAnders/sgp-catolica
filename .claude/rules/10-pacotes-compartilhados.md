# Pacotes compartilhados

- `@sgp/shared-types`: tipos do dominio. Alteracao aqui afeta web e mobile; revise os
  dois antes de mudar um tipo existente.
- `@sgp/mocks`: dados estaticos da fase N1. Depende de `@sgp/shared-types` e de mais
  nada. Nao coloque logica de tela aqui.
- `@sgp/design-tokens`: valores visuais. O arquivo `src/index.ts` (consumido pelo
  mobile) e o `src/tokens.css` (consumido pela web) precisam ser mantidos em sincronia
  manualmente; ao alterar um, altere o outro.

Nenhum pacote deve importar `apps/*`. A dependencia e sempre de aplicacao para pacote.
