/**
 * Relatorios do professor e historico do estudante.
 * Ver Features 10 e 11 da especificacao.
 */
export interface EstatisticaAplicacao {
  applicationId: string;
  media: number;
  mediana: number;
  desvioPadrao: number;
  /** Quantidade de notas por faixa, ex: "0-2", "2-4". */
  distribuicao: { faixa: string; quantidade: number }[];
}

export interface EstatisticaQuestao {
  questionId: string;
  /** Percentual de acerto (0 a 100). */
  percentualAcerto: number;
  /** Quantas vezes cada alternativa foi marcada. */
  marcacoesPorAlternativa: { alternativeId: string; quantidade: number }[];
}

export interface NotaDoEstudante {
  applicationId: string;
  examTitle: string;
  className: string;
  subject: string;
  teacherName: string;
  date: string;
  totalScore: number;
  maxScore: number;
  answerKeyPublished: boolean;
}
