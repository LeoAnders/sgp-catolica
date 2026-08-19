# Requisitos Funcionais

Requisitos derivados da especificacao do produto (v1.10). Cada requisito corresponde a
uma funcionalidade descrita pelo cliente.

A coluna **Fase** indica em qual entrega o requisito deve estar pronto. Os documentos
recebidos ate agora nao definem o recorte por fase, entao todos aparecem como
`a definir`. Esse recorte precisa ser acordado com a equipe e com a professora — nao
deve ser inferido.

## Resumo

| ID | Requisito | Fase |
| --- | --- | --- |
| RF01 | Cadastro e autenticacao de professor e estudante | a definir |
| RF01.1 | Anonimizacao de conta (LGPD) | a definir |
| RF02 | Gerenciamento de questoes | a definir |
| RF03 | Criacao de turmas e matriculas | a definir |
| RF04 | Criacao de provas | a definir |
| RF05 | Criacao de aplicacoes | a definir |
| RF06 | Geracao de PDF e versoes | a definir |
| RF07 | Publicacao de gabarito | a definir |
| RF08 | Correcao via aplicativo mobile | a definir |
| RF09 | Lancamento manual de nota | a definir |
| RF10 | Relatorios de notas | a definir |
| RF11 | Historico de notas do estudante | a definir |

## RF01 — Cadastro e autenticacao

Professor e estudante se cadastram e fazem login; usuario autenticado consulta os
proprios dados.

- Cadastro separado por tipo: `professor` ou `estudante`
- Campos: nome completo, e-mail e senha com no minimo 8 caracteres
- E-mail unico no sistema
- Dominio `@catolicasc.edu.br` para estudante e `@catolicasc.org.br` para professor
- Login retorna JWT e refresh token
- Recuperacao de senha por e-mail
- Rate limiting contra ataque de forca bruta
- Logout do dispositivo atual: revoga apenas o refresh token daquele dispositivo
- Sair de todos os dispositivos: revoga todos os refresh tokens do usuario
- Endpoint autenticado para consulta dos proprios dados

## RF01.1 — Anonimizacao de conta (LGPD)

O usuario anonimiza a propria conta para que seus dados pessoais deixem de estar
associados as notas ja registradas.

- Operacao autenticada, solicitada pelo proprio usuario
- Nome e e-mail viram valores substitutos nao reversiveis; senha invalidada; todos os
  refresh tokens revogados; data de anonimizacao registrada
- **Nao e exclusao**: correcoes, notas e matriculas sao preservadas, para nao invalidar
  relatorios e o historico de terceiros
- Conta anonimizada nao faz login; o e-mail original fica livre para novo cadastro
- Operacao irreversivel

## RF02 — Gerenciamento de questoes

O professor cria, edita, lista e exclui questoes objetivas e discursivas.

- Tipos: `objetiva` e `discursiva`
- Objetiva: de 2 a 5 alternativas, com exatamente uma correta
- Discursiva: enunciado e pontuacao maxima
- Suporte a Markdown basico no enunciado
- Classificacao por tags
- Exclusao logica (soft-delete)
- Filtros por tipo, tags e texto

## RF03 — Criacao de turmas e matriculas

O professor cria turmas e matricula alunos, para aplicar provas a um grupo especifico.

- Turma tem nome, disciplina e periodo letivo; pertence a um unico professor
- Toda turma nasce com codigo de convite unico, gerado automaticamente
- O professor pode ver e regenerar o codigo; o anterior e invalidado imediatamente
- O professor matricula, por e-mail, aluno ja cadastrado
- O aluno se matricula sozinho com o codigo; se o e-mail nao tiver conta, o sistema cria
  a conta (validando o dominio de estudante), matricula na mesma operacao e retorna o
  estudante ja autenticado, com JWT e refresh token
- Listar e remover alunos, sem apagar o historico de notas
- Editar nome, disciplina e periodo; arquivar a turma sem apagar as aplicacoes
- Um aluno pode estar em varias turmas; o mesmo codigo nao duplica a matricula

## RF04 — Criacao de provas

O professor monta uma prova definindo o valor de cada questao. A prova e conteudo
reutilizavel, aplicavel a varias turmas depois.

- Titulo e descricao
- Ate 20 questoes, objetivas e/ou discursivas
- Pontuacao individual por questao, sem exigencia de valores uniformes
- A soma das pontuacoes **nao e validada** pelo sistema; e responsabilidade do professor
- Ordem inicial das questoes definida pelo professor
- Estado `draft` ate a primeira aplicacao, quando passa a `ready` automaticamente; nao ha
  operacao dedicada para essa transicao
- Arquivar fecha a prova (`closed`): nao aceita novas aplicacoes, mas as existentes
  seguem funcionando
- Fechar **nao exclui** a prova: ela continua listada e filtravel por status
- A prova pertence a um professor e **nao** e ligada diretamente a uma turma

## RF05 — Criacao de aplicacoes

O professor aplica uma prova existente a uma turma, para gerar o PDF, distribuir e
corrigir aquela aplicacao.

- Combina uma prova existente e uma turma de destino
- Cada aplicacao pertence a exatamente um professor, uma prova e uma turma
- A mesma prova pode ir para varias turmas, ou ser reaplicada a mesma turma (segunda
  chamada); as aplicacoes sao independentes entre si
- Nasce em `draft` e passa a `generated` quando o PDF e gerado
- Toda configuracao de PDF, gabarito, correcao e nota pertence a **aplicacao**, nao a
  prova

## RF06 — Geracao de PDF e versoes

Gerar o PDF de uma aplicacao para impressao, com controle de versoes, embaralhamento e
identificacao.

### Opcoes de geracao

- **Quantidade de versoes**: uma ou mais
- **Embaralhamento por versao**: ordem das questoes e/ou das alternativas, podendo
  diferir entre versoes
- **Identificacao do aluno**
  - com identificacao: nome (e opcionalmente matricula) impresso; cada aluno recebe uma
    versao especifica e um QR Code unico, combinando versao e aluno
  - sem identificacao: prova anonima; o QR Code identifica apenas a versao, e a nota
    exige lancamento manual (RF09)

### Regras de geracao

- Com identificacao, o sistema gera uma atribuicao para **cada estudante matriculado** na
  turma da aplicacao: uma prova por estudante
- O PDF e um **unico arquivo consolidado**, com todas as provas em sequencia; nao e
  separado por aluno nem por versao
- A ordem embaralhada e materializada e persistida no momento da geracao: qual questao
  em qual posicao e qual alternativa virou a letra A, B ou C. Sem isso o aplicativo nao
  consegue interpretar a marcacao
- A regeneracao so e permitida enquanto nao houver nenhuma correcao confirmada; caso
  contrario, o sistema orienta a criar uma nova aplicacao
- Ao regenerar, versoes e atribuicoes antigas sao substituidas, os QR Codes antigos
  deixam de valer e o arquivo PDF e sobrescrito
- O conteudo do QR Code e de uso exclusivo do aplicativo; o codigo publico de gabarito e
  um valor separado

## RF07 — Publicacao de gabarito

O professor publica o gabarito de uma aplicacao.

- Publicacao por aplicacao inteira ou por versao
- O aluno so visualiza o gabarito depois de publicado
- Acesso por rota publica com codigo proprio, ou autenticada para o aluno

## RF08 — Correcao via aplicativo mobile

O professor corrige a prova pelo aplicativo, lendo QR Code e cartao-resposta, com a nota
calculada automaticamente. E a **unica superficie do sistema com leitura de QR Code**.

### Leitura inicial

- O aplicativo le o QR Code impresso e identifica a versao e, quando houver, o aluno
- Busca o gabarito oficial da versao
- Ao abrir uma aplicacao com conexao, baixa antecipadamente o gabarito de todas as
  versoes, para permitir correcao sem sinal
- Sem conexao e sem copia local, nao permite confirmar a correcao

### Leitura do cartao-resposta

- Camera sobre os campos preenchidos a caneta
- Detecta as marcacoes, confronta com o gabarito e mostra o acerto ou erro questao a
  questao
- Calcula a nota total respeitando a pontuacao individual de cada questao
- O professor pode corrigir manualmente uma leitura antes de confirmar

### Questoes discursivas

Depois da parte objetiva, o professor informa as notas discursivas e a nota final e
recalculada.

### Prova sem identificacao

O professor pode digitar nome e matricula lidos na prova fisica. E apenas auxiliar:
**nao** atribui a nota, que continua dependendo do lancamento manual (RF09).

### Confirmacao

- Com identificacao: a nota e registrada e atribuida ao aluno na sincronizacao
- Sem identificacao: a nota e apenas calculada e exibida

### Fila local e sincronizacao

- Toda correcao e salva **primeiro** no dispositivo, com ou sem internet
- Cada item tem identificador gerado no dispositivo, garantindo deduplicacao idempotente
- Guarda copia do gabarito usado no momento da correcao
- Havendo gabarito atualizado na API, ele tem **precedencia sobre a copia local** no
  recalculo, e o professor e avisado da divergencia
- Sincroniza em segundo plano ao reconectar, enviando em lote
- O reenvio de uma correcao ja registrada e tratado de forma **idempotente**: nao gera
  registro duplicado
- Erro de validacao na sincronizacao mantem o item na fila com status de erro, para
  ajuste e nova tentativa
- Status por item: `pending`, `synced` ou `error`, com nova tentativa manual disponivel
- Havendo duas correcoes para o mesmo aluno e versao, mantem a primeira e sinaliza para
  revisao; **nunca sobrescreve em silencio**
- A fila sobrevive ao fechamento do aplicativo

### Requisitos tecnicos

Leitura e calculo totalmente offline apos o download do gabarito; feedback visual da
area detectada; erro de leitura inferior a 1%; tolerancia a variacao de iluminacao,
rotacao e distorcao leve.

## RF09 — Lancamento manual de nota

Quando a prova foi gerada sem identificacao, associar a nota ja calculada ao aluno
correspondente, identificado pelo nome ou matricula escritos a mao.

- A correcao sem identificacao fica registrada sem vinculo com aluno
- A atribuicao manual pode ser feita tanto pela aplicacao web quanto pelo aplicativo
- Listar, por aplicacao, todas as correcoes pendentes de atribuicao
- Nome e matricula digitados no aplicativo vem pre-preenchidos, para agilizar a busca
- Atribuir **preenche o vinculo na correcao existente**, sem criar novo registro,
  evitando nota duplicada em relatorio e exportacao
- Permite registrar observacoes
- Depois de atribuida, a nota aparece no historico do aluno como qualquer outra
- Nao e possivel atribuir duas correcoes da mesma versao ao mesmo aluno

## RF10 — Relatorios de notas

O professor gera relatorios de notas de uma ou de varias aplicacoes.

- Relatorio por aplicacao: lista de alunos, notas, media, mediana, desvio padrao e
  distribuicao
- Relatorio consolidado de varias aplicacoes
- Filtros por turma, disciplina e periodo
- Exportacao em CSV, Excel e PDF
- Graficos simples

O cliente solicitou itens adicionais para esta area que a especificacao nao incorporou
como criterio de aceite. Eles seguem pendentes de validacao e serao registrados junto
das demais pendencias documentais.

## RF11 — Historico de notas do estudante

O aluno consulta o proprio historico completo de notas.

- Lista de todas as provas realizadas, com nota, data e professor
- Detalhamento por prova, com acertos por questao, **apenas quando o gabarito estiver
  publicado** (RF07)
- Filtros por disciplina e periodo
- Grafico de evolucao ao longo do tempo
- **Isolamento total**: o aluno acessa exclusivamente as proprias notas
