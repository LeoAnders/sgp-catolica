# Visao do produto

> Resumo fiel da especificacao recebida (Sistema de Geracao de Provas, v1.10) e do
> relato do cliente. Este documento descreve o que foi pedido, nao decisoes tecnicas
> da equipe.

## Problema

Professores com carga horaria alta chegam a semanas de prova com centenas de provas
para corrigir. A correcao manual consome tempo e atrasa a devolutiva para o estudante.

## Produto

Plataforma web para professores e estudantes, com aplicativo nativo exclusivo do
professor usado na correcao via camera e QR Code. Foco em:

- criacao flexivel de provas (ate 20 questoes, pontuacao independente por questao);
- geracao de PDF com controle de versoes, embaralhamento e identificacao do estudante;
- correcao pelo aplicativo, lendo QR Code e cartao-resposta preenchido;
- atribuicao automatica da nota quando a prova foi gerada com identificacao;
- lancamento manual da nota quando a prova foi gerada sem identificacao.

## Personas

| Persona | Objetivos principais |
| --- | --- |
| Professor | Criar provas, gerar PDFs, corrigir pelo aplicativo, lancar notas, gerar relatorios. |
| Estudante | Entrar em turmas, consultar provas atribuidas e o historico de notas. |

## Features previstas na especificacao

1. Cadastro e autenticacao (professores e estudantes)
2. Anonimizacao de conta (LGPD)
3. Gerenciamento de questoes
4. Criacao de turmas e matriculas
5. Criacao de provas
6. Criacao de aplicacoes (prova aplicada a uma turma)
7. Geracao de PDF e versoes
8. Publicacao de gabarito
9. Correcao pelo aplicativo mobile
10. Lancamento manual de nota
11. Relatorios de notas
12. Historico de notas do estudante
