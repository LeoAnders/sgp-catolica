/**
 * Correcao e lancamento de notas. Ver Features 8, 9 e 11 da especificacao.
 */
export type StatusSincronizacao = 'pending' | 'synced' | 'error';

export interface ResultadoObjetivo {
  questionId: string;
  correct: boolean;
  score: number;
}

export interface NotaDiscursiva {
  questionId: string;
  score: number;
}

export interface Correcao {
  id: string;
  examVersionId: string;
  /** Ausente enquanto a correcao estiver pendente de atribuicao manual. */
  studentId?: string;
  /** Lido na prova fisica, quando a prova foi gerada sem identificacao. */
  reportedStudentName?: string;
  reportedStudentRegistration?: string;
  objectiveResults: ResultadoObjetivo[];
  discursiveScores: NotaDiscursiva[];
  totalScore: number;
  notes?: string;
  confirmedAt: string;
  correctedBy: string;
  /** true quando veio de prova com identificacao do aluno. */
  isAutomaticallyAssigned: boolean;
  /** UUID gerado no dispositivo, usado para deduplicacao na sincronizacao. */
  clientCorrectionId: string;
  syncStatus: StatusSincronizacao;
}

/**
 * Copia do gabarito de uma questao objetiva, como o aplicativo a recebeu.
 *
 * `printedOrder` guarda as letras efetivamente impressas naquela versao: sem ela
 * o aplicativo nao consegue traduzir a letra marcada a caneta de volta para a
 * alternativa correspondente (RF06).
 */
export interface GabaritoObjetivo {
  questionId: string;
  correctAlternativeId: string;
  /** alternativeIds na ordem impressa (A, B, C...) nesta versao. */
  printedOrder: string[];
  /** Pontuacao da questao nesta prova. */
  score: number;
}

/** Copia do gabarito de uma questao discursiva: so a pontuacao maxima. */
export interface GabaritoDiscursivo {
  questionId: string;
  maxScore: number;
}

/**
 * Copia do gabarito usado no momento da correcao (RF08).
 *
 * O aplicativo grava esta copia junto do item da fila. Se o gabarito oficial mudar
 * entre a correcao local e a sincronizacao, o servidor recalcula a nota a partir
 * deste snapshot e sinaliza o professor, em vez de aplicar o gabarito novo em
 * silencio.
 */
export interface GabaritoVersaoSnapshot {
  examVersionId: string;
  /** Momento em que o aplicativo obteve esta copia do gabarito. */
  capturedAt: string;
  objectiveQuestions: GabaritoObjetivo[];
  discursiveQuestions: GabaritoDiscursivo[];
}

/** Item da fila local do aplicativo do professor (simulada na fase N1). */
export interface ItemFilaCorrecao {
  clientCorrectionId: string;
  examVersionId: string;
  studentId?: string;
  reportedStudentName?: string;
  reportedStudentRegistration?: string;
  objectiveAnswers: { questionId: string; selectedAlternativeId: string }[];
  discursiveScores: NotaDiscursiva[];
  /**
   * Obrigatorio: sem copia local do gabarito o aplicativo nao permite confirmar a
   * correcao (RF08), entao todo item que chega a fila carrega o seu snapshot.
   */
  answerKeySnapshot: GabaritoVersaoSnapshot;
  capturedAt: string;
  syncStatus: StatusSincronizacao;
  syncError?: string;
}
