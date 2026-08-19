# Requisitos Nao Funcionais

Requisitos derivados da especificacao do produto (v1.10). Descrevem qualidade,
restricao e capacidade esperadas do sistema, nao funcionalidades.

Nenhum deles e implementado na fase N1, que trabalha com interfaces navegaveis e dados
estaticos. Entram aqui como requisitos declarados do produto.

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

- **RNF05** depende de RF01.1 para a anonimizacao e de RF11 para o isolamento do
  historico do estudante.
- **RNF06** e o requisito mais restritivo do produto: condiciona o desenho da correcao
  mobile descrito em RF08, incluindo cache de gabarito, fila persistente e deduplicacao.
- **RNF09** fala em regras criticas de negocio, sem enumerar quais. A definicao desse
  conjunto ainda nao existe nos documentos recebidos.
