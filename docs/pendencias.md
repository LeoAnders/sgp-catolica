# Pendencias

Pontos que os documentos recebidos nao resolvem, ou nos quais as fontes divergem entre
si. Nenhum item aqui e decisao: sao perguntas em aberto.

Cada divergencia esta registrada com o que cada fonte diz, sem escolher uma como valida.
Uma fonte ser mais recente e evidencia cronologica, nao autorizacao para substituir a
outra.

Quando um item for resolvido, a decisao vai para `docs/decisoes/` com a evidencia
correspondente, e sai desta lista.

## Divergencias entre fontes

| # | Tema | O que cada fonte diz |
| --- | --- | --- |
| 1 | Pesos da N1 | A metodologia indica 25% para cada um dos quatro criterios. O documento de escopo indica 10% para o codigo-fonte, 20% para o sistema hospedado, 20% para o README e 50% para o diario individual com PRs. |
| 2 | UML na N1 | A metodologia inclui casos de uso e diagrama de classes na N1. O documento de escopo pede esboco inicial de classes. O modelo de README posiciona UML na N2. |
| 3 | Stack do backend | A especificacao do produto descreve NestJS ou Fastify para a API. Os documentos da disciplina apresentam Node.js com Express e MySQL como stack obrigatoria. |

## Definicoes ausentes

| # | Tema | Situacao |
| --- | --- | --- |
| 4 | Recorte de telas da N1 | Nenhum documento define quais telas formam o conjunto minimo da entrega. A N1 exige telas principais navegaveis, sem enumerar quais. |
| 5 | Recorte da N3 | Nenhum documento define quais das funcionalidades precisam estar completas na entrega final. |
| 6 | Avaliacao do aplicativo mobile | O criterio de avaliacao fala em sistema web hospedado. Nao esta definido como o aplicativo do professor entra na demonstracao ou na nota. |
| 7 | Calendario oficial | A metodologia cita 11/09/2026 para a N1, 23/10/2026 para a N2 e 27/11/2026 para a N3. Falta confirmacao oficial dessas datas. |
| 8 | Servico de hospedagem | Nao definido. O criterio aceita hospedagem gratuita, sem indicar qual. |
| 9 | Ferramenta de backlog | Os documentos exigem Issues no repositorio e aceitam ferramenta externa com visualizacao publica sem login, sem indicar qual. |
| 10 | Nomenclatura de decisoes | O modelo de README pede uma pasta `docs/adr/`. Este repositorio usa `docs/decisoes/`. Falta decidir se renomeia. |
| 11 | Regras criticas de negocio | RNF09 exige cobertura minima de testes nas regras criticas, sem enumerar quais compoem esse conjunto. |

## Pedidos do cliente nao incorporados como criterio de aceite

Itens levantados pelo cliente na entrevista que a especificacao do produto nao converteu
em criterio de aceite. Precisam de validacao antes de entrar no escopo.

| # | Pedido | Observacao |
| --- | --- | --- |
| 12 | Importar lista de alunos por planilha | A especificacao preve matricula por e-mail e por codigo de convite (RF03). |
| 13 | Exportar no formato aceito pelo sistema academico | Falta a definicao das colunas que o sistema academico aceita. |
| 14 | Gerar a prova em formato editavel de texto | Motivado por ajuste de layout, para evitar questao cortada entre paginas. |
| 15 | Estatistica de qual alternativa foi mais marcada | O cliente trata como diferencial pedagogico. Nao aparece de forma explicita nos criterios de aceite de RF10. |

## Pendencias do repositorio

| # | Tema | Situacao |
| --- | --- | --- |
| 16 | Dados pessoais no historico do Git | Dados pessoais foram identificados no historico deste repositorio publico. O estado atual ja foi corrigido, mas a eventual reescrita do historico precisa ser decidida e coordenada pela equipe. |
