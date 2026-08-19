# Contribuindo com o SGP Católica

Obrigado por contribuir. Este guia mantém o trabalho da equipe pequeno,
rastreável e fácil de revisar.

Antes de começar, leia o [guia do repositório](CLAUDE.md) e o
[índice da documentação](docs/README.md). Requisitos aprovados ficam em `docs/`;
propostas individuais não devem ser promovidas a decisões da equipe.

## Preparação local

Requisitos: Node.js 20 ou superior e npm 10 ou superior.

```bash
npm ci
npm run typecheck
```

Para iniciar as aplicações:

```bash
npm run web
npm run mobile
```

## Fluxo de trabalho

1. Escolha ou crie uma Issue com objetivo e critério de aceite claros.
2. Crie uma branch pequena a partir de `main`.
3. Faça commits coesos seguindo Conventional Commits.
4. Abra um Pull Request vinculado à Issue.
5. Inclua evidências visuais quando alterar uma interface.
6. Solicite revisão de outro integrante da equipe.
7. Corrija os apontamentos e faça merge somente após a aprovação.

Exemplos de branches:

```text
feat/tela-banco-questoes
fix/mock-correcao-anonima
docs/atualiza-readme
```

Exemplos de commits:

```text
feat(web): adiciona banco de questões
fix(mocks): corrige versão sem identificação
docs: atualiza visão geral do produto
```

As mensagens usam tipo e escopo em inglês, descrição em português, no imperativo,
em letras minúsculas e sem ponto final.

## Pull Requests

Mantenha cada PR focado em uma mudança verificável. A descrição deve explicar o
objetivo, a motivação, como testar e quais limitações permanecem.

Antes de solicitar revisão, confirme:

- [ ] a Issue está vinculada;
- [ ] o escopo não inclui trabalho de outra fase;
- [ ] os dados de exemplo continuam fictícios;
- [ ] `npm run audit:mocks` passa, quando os dados de exemplo mudaram;
- [ ] tipos compartilhados foram conferidos na web e no mobile;
- [ ] tokens TypeScript e CSS continuam sincronizados quando alterados;
- [ ] `npm run typecheck` passa;
- [ ] o build da aplicação afetada passa;
- [ ] prints ou vídeo foram anexados quando houve mudança visual;
- [ ] a documentação relacionada foi atualizada.

## Limites da N1

A N1 entrega interfaces navegáveis usando `packages/mocks`. Não fazem parte desta
fase banco de dados, backend real, autenticação real, leitura real de câmera ou QR
Code, sincronização offline real e infraestrutura de produção.

Quando uma tela representar uma capacidade futura, simule o estado necessário e
deixe o ponto de integração explícito, sem implementar a integração.

## Conteúdo público e privacidade

Este repositório é público. Não inclua credenciais, tokens, caminhos locais,
configurações pessoais, anotações privadas ou dados reais de estudantes. Dados de
demonstração devem permanecer fictícios.

## Decisões e documentação

Mudanças de stack, arquitetura, escopo ou fluxo precisam de acordo da equipe. Após
a aprovação, a decisão deve ser registrada em [`docs/decisoes/`](docs/decisoes) e
removida da lista de pendências quando aplicável.
