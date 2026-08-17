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

/** Item da fila local do aplicativo do professor (simulada na fase N1). */
export interface ItemFilaCorrecao {
  clientCorrectionId: string;
  examVersionId: string;
  studentId?: string;
  reportedStudentName?: string;
  reportedStudentRegistration?: string;
  objectiveAnswers: { questionId: string; selectedAlternativeId: string }[];
  discursiveScores: NotaDiscursiva[];
  capturedAt: string;
  syncStatus: StatusSincronizacao;
  syncError?: string;
}
