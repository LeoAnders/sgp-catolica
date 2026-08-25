# Pacotes compartilhados

- `@sgp/shared-types`: tipos do dominio. Alteracao aqui afeta web e mobile; revise os
  dois antes de mudar um tipo existente.
- `@sgp/mocks`: dados estaticos da fase N1. Depende de `@sgp/shared-types` e de mais
  nada. Nao coloque logica de tela aqui.
- `@sgp/design-tokens`: valores visuais consumidos pelo mobile por `src/index.ts`. A
  web nao consome este pacote: seu tema e seus tokens semanticos ficam em
  `apps/web/src/styles/global.css`, conforme o design system web
  (`docs/design/design-system-web.md`). O `src/tokens.css` existe para um consumo CSS
  futuro; enquanto os dois arquivos coexistirem, mantenha-os em sincronia manualmente.

Nenhum pacote deve importar `apps/*`. A dependencia e sempre de aplicacao para pacote.
