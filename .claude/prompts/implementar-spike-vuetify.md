# Handoff para o Claude Code — spike da biblioteca de componentes web

Este arquivo e uma ordem de trabalho para executar uma avaliacao tecnica. Ele nao
registra Vuetify como decisao aprovada da equipe e nao substitui os requisitos e as
regras versionadas do projeto.

## Prompt para execucao

Voce esta trabalhando no repositorio SGP Catolica. Execute integralmente o plano
abaixo, com autonomia para implementar, testar e preparar a revisao. Nao trate a
recomendacao como decisao definitiva e nao faca merge.

Antes de alterar qualquer arquivo:

1. Leia integralmente `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`,
   `docs/README.md`, `docs/pendencias.md` e todos os arquivos em `.claude/rules/`.
2. Leia e aplique a skill local `.claude/skills/frontend-design/SKILL.md` durante
   o planejamento e a implementacao visual.
3. Ao concluir a interface, use
   `.claude/skills/web-design-guidelines/SKILL.md` para a revisao. Se a skill
   depender de acesso externo indisponivel, registre a limitacao; nao invente o
   resultado.
4. Inspecione o estado atual do repositorio, os pacotes, os tokens, os mocks e a
   implementacao web antes de propor mudancas.
5. Preserve qualquer alteracao preexistente do usuario. Este arquivo de handoff e
   intencional e nao deve ser incluido nos commits do spike sem pedido expresso.

## Objetivo

Implementar uma tela experimental de **Banco de Questoes** com **Vuetify 4** para
avaliar se a biblioteca deve se tornar o padrao da aplicacao web na N1.

A tela deve provar, com dados e evidencias, quatro pontos:

- aderencia a identidade visual do SGP Catolica;
- integracao com `@sgp/design-tokens`;
- responsividade e acessibilidade;
- custo aceitavel de bundle, configuracao e codigo proprio.

Vuetify e apenas a candidata da spike. A alternativa definida para uma eventual
reprovacao por identidade visual ou integracao de tokens e Naive UI. Nao instale
Naive UI agora.

## Limites obrigatorios

- Trabalhe somente em `apps/web` e nos arquivos de dependencia necessarios.
- Use exclusivamente `questoesMock` importado de `@sgp/mocks`.
- Nao crie nem amplie mocks apenas para simular volume; as seis questoes atuais
  bastam para esta avaliacao.
- Nao implemente backend, API, banco, autenticacao, camera, QR Code ou integracao
  de rede.
- Nao instale biblioteca no mobile e nao altere `apps/mobile`.
- Nao instale roteador, gerenciador de estado, biblioteca de graficos, Sass ou
  framework de testes apenas para esta spike.
- Nao use templates, componentes ou recursos premium. Use somente o core com
  licenca compativel com o repositorio.
- Nao crie wrappers genericos para botoes, campos, tabelas ou filtros.
- Nao crie camada de API, repository, service, CRUD generico ou estado global.
- Nao registre ADR e nao altere `docs/decisoes`, `docs/design` ou
  `docs/pendencias`. Essas alteracoes dependem da aprovacao posterior da equipe.
- Nao altere requisitos ou tipos de dominio para acomodar a interface.
- Nao misture a decisao sobre a biblioteca web com a pendencia do mobile.

## Fluxo Git e GitHub

1. Confirme que a base local esta sincronizada com `origin/main` e que nao ha
   mudancas do usuario que possam ser sobrescritas. Nunca descarte mudancas.
2. Execute a validacao inicial antes de instalar dependencias:

   ```bash
   npm ci
   npm run typecheck
   npm run audit:mocks
   npm run web:build
   ```

3. Registre no relatorio final o tamanho e o tempo aproximado do build-base. Nao
   versione `dist/` nem qualquer artefato de build.
4. Se `gh` estiver autenticado, crie uma Issue com o titulo:

   ```text
   [Spike] Avaliar Vuetify 4 no Banco de Questoes
   ```

   A Issue deve explicar objetivo, limites, criterios de aceite e que a escolha
   continua provisoria. Se `gh` nao estiver disponivel, prepare o corpo da Issue
   em sua resposta e continue localmente; isso nao bloqueia a implementacao.
5. Crie, a partir de `main`, a branch:

   ```text
   spike/web-banco-questoes-vuetify
   ```

6. Nao faca merge, nao feche a Issue e nao declare a biblioteca aprovada. Ao fim,
   abra no maximo um **Draft Pull Request**, vinculado a Issue, para receber a
   avaliacao da equipe.

## Fase 1 — confirmar e instalar a integracao minima

Antes de instalar, consulte a documentacao oficial e os metadados do npm para
confirmar as versoes estaveis e os peer dependencies compativeis com Vue 3.5,
Vite 5, TypeScript 5.6 e Node 20. Use Vuetify no major 4 e registre as versoes
exatas resolvidas pelo lockfile.

A integracao esperada e apenas:

- `vuetify`;
- o plugin oficial para Vite, se exigido pela instalacao recomendada;
- o conjunto de icones MDI necessario, preferencialmente por SVG/path para evitar
  uma fonte inteira de icones.

Configure um plugin local, por exemplo `apps/web/src/plugins/vuetify.ts`, e conecte-o
em `main.ts`. Nao adicione dependencias auxiliares sem justificar tecnicamente.

Crie o tema a partir dos valores exportados por `@sgp/design-tokens`. O pacote
continua sendo a fonte unica. Nao copie cores para um novo arquivo nem crie uma
terceira colecao de tokens. Cores, fonte, raios e espacamentos proprios devem vir
dos tokens existentes; os breakpoints e comportamentos internos podem usar as APIs
do Vuetify.

Evite alterar `packages/design-tokens`. Se uma alteracao for realmente necessaria,
pare e explique a necessidade antes de faze-la, pois os arquivos TypeScript e CSS
precisam permanecer sincronizados e os tokens atuais ainda nao sao uma decisao
visual fechada.

## Fase 2 — planejar a direcao visual

Antes de escrever a tela, produza internamente o plano curto exigido pela skill
`frontend-design` e revise-o contra estas orientacoes:

- produto: Sistema de Geracao de Provas da Catolica;
- publico da tela: professor que administra seu banco de questoes;
- tarefa principal: localizar, filtrar e administrar questoes com rapidez;
- direcao: institucional, clara, academica e profissional;
- evitar: dashboard generico, excesso de cards, gradientes decorativos, tema
  Material padrao apenas recolorido e animacoes sem funcao;
- preservar a cor institucional e a sobriedade dos tokens existentes;
- concentrar a personalidade em um unico elemento visual justificavel, mantendo
  o restante simples.

Nao introduza novas fontes remotas. Use a pilha tipografica ja definida nos tokens.

## Fase 3 — implementar Banco de Questoes

A tela deve substituir temporariamente o conteudo demonstrativo atual de `App.vue`
e conter:

- shell da aplicacao com barra superior, navegacao lateral e area principal;
- titulo, descricao curta e acao `Nova questao`;
- busca pelo enunciado;
- filtro por tipo (`objetiva` ou `discursiva`);
- filtro por tag;
- contador de resultados e acao para limpar filtros;
- listagem em tabela no desktop;
- apresentacao legivel e compacta em telas estreitas, podendo virar cards;
- badge de tipo que nao dependa apenas de cor;
- menu ou botoes para editar e excluir;
- dialogo de confirmacao contendo trecho identificavel da questao;
- exclusao simulada apenas no estado local;
- snackbar confirmando a exclusao simulada;
- estado vazio com orientacao e acao para limpar os filtros;
- estado de carregamento simulado e curto, com o comentario:

  ```ts
  // N1: estado simulado; ponto de integracao com a API em fase futura.
  ```

Use nomes do dominio em portugues. Busca e filtros devem ser `computed` ou logica
local simples. Nao implemente paginacao como requisito obrigatorio: seis itens sao
suficientes, e a avaliacao da biblioteca nao deve ampliar o escopo dos mocks.

Componentes proprios permitidos, somente quando trouxerem semantica ou repeticao
real:

- `LayoutApp.vue`;
- `CabecalhoPagina.vue`;
- `BadgeTipoQuestao.vue`;
- `DialogoConfirmacao.vue`.

Nao extraia todos obrigatoriamente. Extraia apenas os comprovados pela implementacao.
Use os componentes do Vuetify diretamente quando um wrapper nao adicionar regra de
dominio. O `Cartao.vue` atual nao precisa ser removido nesta spike se deixar de ser
usado; registre-o como limpeza posterior caso a biblioteca seja aprovada.

Editar e `Nova questao` podem abrir um estado demonstrativo acessivel, sem router e
sem persistencia. Rotule claramente o comportamento como demonstracao da N1.

## Fase 4 — acessibilidade, responsividade e qualidade

Verifique no minimo:

- 360 px: sem scroll horizontal; navegacao recolhida; listagem legivel;
- 768 px: filtros e acoes utilizaveis sem sobreposicao;
- 1440 px: navegacao aberta e tabela com largura controlada;
- ordem de Tab logica e foco visivel;
- todas as operacoes executaveis sem mouse;
- botoes somente com icone possuem nome acessivel em portugues;
- chips e estados nao comunicam informacao apenas por cor;
- dialogo recebe o foco, o mantem enquanto aberto, fecha com Escape e devolve o
  foco ao acionador;
- contraste WCAG AA nos textos e controles relevantes;
- `prefers-reduced-motion` respeitado caso alguma animacao seja usada;
- zero violacoes `critical` ou `serious` no axe, se a ferramenta estiver
  disponivel.

Se axe ou outra verificacao automatizada nao estiver disponivel, marque o criterio
como pendente de validacao humana. Nunca declare que uma verificacao passou sem
executa-la.

Revise o codigo com a skill `web-design-guidelines` e corrija os achados aplicaveis.

## Fase 5 — verificacoes e evidencias

Execute ao final:

```bash
npm run typecheck
npm run audit:mocks
npm run web:build
```

Tambem verifique que nao foram introduzidos `fetch`, Axios ou `XMLHttpRequest` na
aplicacao e inspecione as licencas das novas dependencias.

Compare com o build-base e informe:

- versoes das dependencias adicionadas;
- quantidade de dependencias diretas adicionadas;
- tamanho final dos assets JS e CSS, inclusive gzip quando a ferramenta permitir;
- diferenca em relacao ao build-base;
- tempo aproximado de build antes e depois;
- quantidade e motivo das sobrescritas visuais necessarias;
- limitacoes encontradas.

Use como orcamento inicial de avaliacao, nao como requisito aprovado do produto:

- ate 200 KiB gzip adicionais em JavaScript;
- ate 100 KiB gzip adicionais em CSS;
- no maximo cinco dependencias diretas novas.

Gere evidencias visuais em 360, 768 e 1440 px. Nao versione capturas contendo
caminhos locais ou dados reais. Se nao for possivel anexar imagens automaticamente
ao Draft PR, informe ao usuario onde estao os arquivos temporarios e deixe um
checklist claro para anexa-los manualmente.

## Fase 6 — commits e Draft PR

Revise o diff e separe os commits por responsabilidade, sem incluir este arquivo de
handoff. Use Conventional Commits em portugues. Segmentacao sugerida:

```text
build(web): integra vuetify ao spike de componentes
feat(web): adiciona banco de questoes experimental
```

Adapte a segmentacao ao diff real, mantendo commits atomicos. Nao inclua coautoria
de IA. Nao use merge commit.

Se todas as verificacoes automatizaveis passarem, faca push da branch e abra um
Draft Pull Request. A descricao deve conter:

- referencia `Closes #NUMERO` somente se a Issue de spike tiver sido criada;
- objetivo e limites;
- como executar e testar;
- checklist dos criterios funcionais, responsivos e de acessibilidade;
- tabela com medidas antes/depois;
- evidencias visuais;
- itens que dependem de revisao humana;
- declaracao explicita: `Vuetify ainda nao e uma decisao aprovada do projeto`.

## Gate de encerramento

Finalize sua execucao com um relatorio objetivo contendo:

1. branch, commits, Issue e Draft PR criados;
2. arquivos alterados e justificativa;
3. comandos executados e resultados reais;
4. medidas de bundle e build;
5. evidencias de 360, 768 e 1440 px;
6. resultados de acessibilidade;
7. criterios aprovados, reprovados e pendentes;
8. recomendacao tecnica: aprovar Vuetify, testar Naive UI ou corrigir e reavaliar;
9. passos que exigem decisao humana.

Mesmo que os criterios tecnicos passem, pare no Draft PR. Nao faca merge, nao crie
ADR e nao distribua as demais telas. A aprovacao final exige revisao visual de pelo
menos dois integrantes que nao tenham implementado a spike, especialmente para
responder se a interface parece SGP Catolica ou apenas Material padrao.

Se a spike reprovar principalmente por identidade ou dificuldade de integrar os
tokens, nao instale Naive UI na mesma branch. Registre a reprovacao e proponha uma
segunda spike isolada usando a mesma tela e os mesmos criterios.
