# SGP Catolica

Sistema de Geracao de Provas. Monorepo com a aplicacao web, o aplicativo mobile do
professor e os pacotes compartilhados entre os dois.

## Fase atual: N1 — interfaces navegaveis

- O objetivo da fase e ter telas navegaveis (a tela A leva a tela B) com dados
  estaticos, para o cliente visualizar o sistema tomando forma.
- Nao ha banco de dados, backend real, autenticacao real ou infraestrutura de
  orquestracao nesta fase.
- Todo dado exibido vem de `packages/mocks`. Nenhuma tela faz requisicao de rede.
- Arquitetura simples e direta, sem camadas de abstracao antecipadas, mas organizada
  para que o backend possa ser ligado depois sem reescrever as telas.

## Estrutura

```
apps/web       aplicacao web (React), para professor e estudante
apps/mobile    aplicativo do professor (React Native), correcao de provas
packages/design-tokens  tokens visuais compartilhados (cores, espacamento, tipografia)
packages/mocks          dados estaticos da fase N1
packages/shared-types   tipos do dominio, derivados da especificacao
docs                    documentacao oficial do projeto
```

## Como trabalhar aqui

- Tipos de dominio ficam em `packages/shared-types` e sao a referencia unica; eles
  seguem a especificacao do cliente e nao devem ser inventados caso a caso.
- Dados de exemplo ficam em `packages/mocks`, nunca embutidos dentro de uma tela.
- Valores visuais (cor, espacamento, raio, fonte) vem de `packages/design-tokens`,
  nao de literais espalhados no codigo.
- O idioma do dominio e o portugues (turma, prova, aplicacao, correcao, questao).
- Comentarios e documentacao em portugues.

## Limites do repositorio

Este repositorio e compartilhado com a equipe e sera publico. Nao inclua:

- caminhos absolutos de maquinas locais;
- arquivos de workspace, configuracao pessoal de editor ou de ferramentas de anotacao
  individuais;
- credenciais, tokens ou dados pessoais reais de estudantes.

## Decisoes

`docs/decisoes/` registra apenas decisoes ja acordadas pela equipe. Propostas
individuais e ideias em estudo nao entram no repositorio antes disso: descreva a
proposta no PR ou na issue correspondente e traga para `docs/` depois do acordo.

Regras adicionais em `.claude/rules/`.
