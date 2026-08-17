/**
 * Banco de questoes do professor. Ver Feature 2 da especificacao.
 */
export type TipoQuestao = 'objetiva' | 'discursiva';

export interface Alternativa {
  id: string;
  text: string;
}

export interface Questao {
  id: string;
  teacherId: string;
  type: TipoQuestao;
  /** Enunciado, com suporte a Markdown basico. */
  statement: string;
  tags: string[];
  /** Somente para questoes objetivas: 2 a 5 alternativas. */
  alternatives?: Alternativa[];
  correctAlternativeId?: string;
  /** Somente para questoes discursivas. */
  maxScore?: number;
  /** Soft-delete. */
  deletedAt?: string;
}
