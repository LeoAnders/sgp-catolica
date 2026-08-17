/**
 * Turmas e matriculas. Ver Feature 3 da especificacao.
 */
export type StatusTurma = 'active' | 'archived';
export type OrigemMatricula = 'teacher' | 'invite_code';
export type StatusMatricula = 'active' | 'removed';

export interface Turma {
  id: string;
  teacherId: string;
  name: string;
  /** Disciplina. */
  subject: string;
  /** Periodo/ano letivo, ex: "2026/1". */
  term: string;
  status: StatusTurma;
  /** Codigo de convite unico, regeneravel pelo professor. */
  inviteCode: string;
  createdAt: string;
}

export interface Matricula {
  id: string;
  classId: string;
  studentId: string;
  enrolledAt: string;
  status: StatusMatricula;
  enrolledVia: OrigemMatricula;
}
