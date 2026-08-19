# Documentacao do projeto

Indice da documentacao oficial do SGP Catolica. O que esta aqui vale como fonte para a
equipe; rascunhos e ideias em discussao ficam fora do repositorio ate serem acordados.

Este arquivo e o ponto de entrada da documentacao. `CLAUDE.md` e `AGENTS.md`, na raiz,
apontam para ca.

## Documentos disponiveis

| Documento | Conteudo |
| --- | --- |
| [Visao do produto](produto/visao-do-produto.md) | Problema que o sistema resolve e publico atendido |
| [Requisitos funcionais](produto/requisitos-funcionais.md) | Os 12 requisitos com criterios de aceite |
| [Requisitos nao funcionais](produto/requisitos-nao-funcionais.md) | Os 9 requisitos de qualidade e restricao |
| [Dicionario de entidades](modelo-dados/dicionario-de-entidades.md) | Entidades do dominio e correspondencia com os tipos do codigo |
| [Pendencias](pendencias.md) | Divergencias entre fontes e definicoes ainda ausentes |

## Por onde comecar

- Para entender **o que o sistema faz**: visao do produto, depois requisitos funcionais.
- Para **implementar uma tela ou regra**: requisitos funcionais, depois o dicionario de
  entidades, e os tipos em `packages/shared-types`.
- Para saber **o que ainda nao esta decidido**: pendencias. Nada ali deve ser tratado
  como definido.

## Estrutura das pastas

| Pasta | Conteudo | Situacao |
| --- | --- | --- |
| `produto/` | Visao do produto, requisitos e escopo de cada fase | em uso |
| `modelo-dados/` | Dicionario de entidades; MER/DER a partir da N2 | em uso |
| `decisoes/` | Registro das decisoes ja tomadas pela equipe | vazio |
| `design/` | Design system, mapa de telas e fluxos de navegacao | vazio |
| `telas/` | Prints das telas, referenciados pelo README | vazio |
| `uml/` | Diagramas de casos de uso, classes e atividades | vazio |
| `arquitetura/` | Diagramas de arquitetura e camadas | vazio |
| `api/` | Especificacao de endpoints e colecoes de teste | vazio |

As pastas vazias entram no repositorio com um `.gitkeep` e sao preenchidas conforme as
fases avancam. Duas dependem de decisao registrada em [pendencias](pendencias.md): o
conteudo de `design/` depende do recorte de telas, e a nomenclatura de `decisoes/`
depende do item sobre `docs/adr/`.

A documentacao de endpoints entra quando a API entrar no escopo.
