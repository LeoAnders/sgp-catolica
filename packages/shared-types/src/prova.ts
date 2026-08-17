/**
 * Prova (conteudo reutilizavel) e Aplicacao (prova x turma).
 * Ver Features 4, 5 e 6 da especificacao.
 */
export type StatusProva = 'draft' | 'ready' | 'closed';
export type StatusAplicacao = 'draft' | 'generated' | 'closed';

export interface QuestaoDaProva {
  questionId: string;
  order: number;
  /** Pontuacao individual. A soma nao e validada pelo sistema. */
  score: number;
}

export interface Prova {
  id: string;
  teacherId: string;
  title: string;
  description?: string;
  /** Ate 20 questoes. */
  questions: QuestaoDaProva[];
  status: StatusProva;
  createdAt: string;
}

export interface Aplicacao {
  id: string;
  examId: string;
  classId: string;
  teacherId: string;
  status: StatusAplicacao;
  /** PDF unico consolidado desta aplicacao; sobrescrito a cada regeneracao. */
  pdfUrl?: string;
  createdAt: string;
}

export interface LayoutVersao {
  /** questionIds na ordem impressa nesta versao. */
  questionOrder: string[];
  /** Apenas para questoes objetivas. */
  alternativeOrder: {
    questionId: string;
    /** alternativeIds na ordem/letras impressas (A, B, C...). */
    printedOrder: string[];
  }[];
}

export interface VersaoProva {
  id: string;
  applicationId: string;
  versionNumber: number;
  shuffleQuestions: boolean;
  shuffleAlternatives: boolean;
  withStudentIdentification: boolean;
  /** Ordem efetivamente impressa, materializada na geracao. */
  layout: LayoutVersao;
  answerKeyPublished: boolean;
  answerKeyPublishedAt?: string;
  /** Codigo de acesso publico ao gabarito, distinto do payload do QR Code. */
  publicCode: string;
  /** Uso exclusivo do app do professor. */
  qrCodePayload: string;
  createdAt: string;
}

/** Somente quando withStudentIdentification = true. */
export interface AtribuicaoVersao {
  id: string;
  examVersionId: string;
  studentId: string;
  qrCodePayload: string;
}
