# Requisitos Nao Funcionais

Requisitos derivados da especificacao do produto (v1.10). Descrevem qualidade,
restricao e capacidade esperadas do sistema, nao funcionalidades.

A N1 nao exige a implementacao real destes requisitos de producao. Entram aqui como
requisitos declarados do produto.

| ID | Categoria | Requisito |
| --- | --- | --- |
| RNF01 | Escalabilidade | 500 a 600 professores e 10.000 alunos ativos no primeiro ano |
| RNF02 | Performance | API com p95 abaixo de 300 ms nas operacoes comuns |
| RNF03 | Disponibilidade | 99,5% de uptime mensal |
| RNF04 | Seguranca | HTTPS, autenticacao com JWT e refresh token, rate limiting e isolamento total entre alunos |
| RNF05 | Privacidade (LGPD) | Aluno acessa apenas os proprios dados; registro de acesso a notas; anonimizacao sob demanda (RF01.1); exclusao fisica fora do MVP |
| RNF06 | Operacao offline | O aplicativo de correcao funciona totalmente offline, com fila local e sincronizacao automatica |
| RNF07 | Observabilidade | Logs estruturados, metricas e alertas |
| RNF08 | Backup | Backup diario do banco de dados, com retencao de 30 dias |
| RNF09 | Testes | Cobertura minima de 80% nas regras criticas de negocio |

## Observacoes

- A especificacao trata a anonimizacao em RF01.1 e o isolamento do historico do estudante
  em RF11; ambos os temas aparecem em **RNF05**.
- **RNF06** condiciona o desenho de RF08 e da sincronizacao.
- **RNF09** fala em regras criticas de negocio, sem enumerar quais. A definicao desse
  conjunto ainda nao existe nos documentos recebidos.
