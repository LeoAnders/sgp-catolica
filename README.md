<div align="center">

# SGP Catolica

**Sistema de Geracao de Provas: o professor monta e aplica provas, o aplicativo corrige o cartao-resposta e o estudante acompanha suas notas.**

Link do sistema hospedado: _a publicar na N1_

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-F5A623?style=flat-square)
![Entrega](https://img.shields.io/badge/entrega%20atual-N1-3D348B?style=flat-square)
![Licenca](https://img.shields.io/badge/licen%C3%A7a-uso%20acad%C3%AAmico-7B4FA6?style=flat-square)

</div>

## Equipe

| Nome completo | Papel / principais frentes no projeto |
| --- | --- |
| Cintia Wilbert Lorenzetti | _a definir_ |
| Gabriel Massaia de Oliveira | _a definir_ |
| Leonardo Matheus Anders | _a definir_ |
| Rian Carlos Odwazny Flexa | _a definir_ |
| Wesley Diorrani Ferreira | _a definir_ |

## Sumario

- [1. Visao Geral](#1-visao-geral)
- [2. Requisitos](#2-requisitos)
- [3. Modelagem (UML)](#3-modelagem-uml)
- [4. Telas do Sistema](#4-telas-do-sistema)
- [5. Arquitetura de Software](#5-arquitetura-de-software)
- [6. Decisoes Arquiteturais (ADRs)](#6-decisoes-arquiteturais-adrs)
- [7. Modelo de Dados](#7-modelo-de-dados)
- [8. Stack Tecnologica](#8-stack-tecnologica)
- [9. Estrutura de Pastas](#9-estrutura-de-pastas)
- [10. Como Executar o Projeto](#10-como-executar-o-projeto)
- [11. Especificacao da API](#11-especificacao-da-api)
- [12. Testes e Validacoes](#12-testes-e-validacoes)
- [13. Manual do Usuario](#13-manual-do-usuario)
- [14. Equipe e Contribuicoes](#14-equipe-e-contribuicoes)

---

## 1. Visao Geral

Professores com muitas turmas chegam as semanas de prova com centenas de provas para
corrigir a mao, o que atrasa a devolutiva para o estudante. O SGP Catolica permite ao
professor montar provas a partir de um banco de questoes, gerar o PDF impresso com
versoes embaralhadas e QR Code, corrigir o cartao-resposta pelo aplicativo e devolver
a nota rapidamente. O estudante entra na turma por codigo de convite e consulta suas
provas, notas e evolucao.

Resumo completo do produto em [`docs/produto/visao-do-produto.md`](docs/produto/visao-do-produto.md).

## 2. Requisitos

Levantamento em andamento a partir da especificacao do cliente. As tabelas de RF e RNF
serao registradas em `docs/produto/` e referenciadas aqui.

## 3. Modelagem (UML)

Prevista para a N2. Os diagramas ficarao em `docs/uml/`.

## 4. Telas do Sistema

Em construcao. Os prints das telas navegaveis ficarao em `docs/telas/` e serao
inseridos aqui na ordem do fluxo de navegacao.

## 5. Arquitetura de Software

Prevista para a N3, com os diagramas em `docs/arquitetura/`.

## 6. Decisoes Arquiteturais (ADRs)

Nenhuma decisao registrada ate o momento. O formato e o indice ficam em
[`docs/decisoes/`](docs/decisoes/README.md).

## 7. Modelo de Dados

Previsto para a N2, em `docs/modelo-dados/`. Na fase atual, as entidades do dominio
estao descritas como tipos em `packages/shared-types/src`.

## 8. Stack Tecnologica

O que ja esta no repositorio:

- **Vite + Vue + TypeScript**: aplicacao web (`apps/web`), alinhada a especificacao.
- **React Native + Expo + TypeScript**: aplicativo do professor (`apps/mobile`).
- **npm workspaces**: monorepo com pacotes compartilhados entre web e mobile.

Nao ha backend nem banco de dados nesta fase: as telas consomem dados estaticos de
`packages/mocks`. A web esta alinhada em Vite + Vue. Para o backend, os documentos ainda
divergem entre NestJS/Fastify na spec e Node.js + Express na disciplina; nenhuma dessas
alternativas deve ser escolhida por inferencia.

## 9. Estrutura de Pastas

```
apps/
  web/                 aplicacao web (professor e estudante)
  mobile/              aplicativo do professor
packages/
  design-tokens/       cores, espacamento, tipografia
  mocks/               dados estaticos da fase N1
  shared-types/        tipos do dominio
docs/
  produto/  design/  decisoes/
  telas/  uml/  arquitetura/  modelo-dados/  api/
```

## 10. Como Executar o Projeto

Requisitos: Node.js 20 ou superior e npm 10 ou superior.

```bash
git clone https://github.com/LeoAnders/sgp-catolica.git
cd sgp-catolica
npm install
```

Aplicacao web (abre em `http://localhost:5173`):

```bash
npm run web
```

Aplicativo do professor (Expo; leia o QR Code com o app Expo Go ou use um emulador):

```bash
npm run mobile
```

Verificacao de tipos em todos os pacotes:

```bash
npm run typecheck
```

## 11. Especificacao da API

Prevista para a N2, em `docs/api/`.

## 12. Testes e Validacoes

Previsto para a N3.

## 13. Manual do Usuario

Previsto para a N3.

## 14. Equipe e Contribuicoes

A preencher ao longo da fase, com as principais contribuicoes de cada integrante.

---

<div align="center">

*Projeto da disciplina de Projeto e Arquitetura de Software.*

</div>
