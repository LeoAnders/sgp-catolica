/**
 * Usuarios do sistema. Ver Feature 1 e 1.1 da especificacao.
 */
export type PapelUsuario = 'professor' | 'estudante';

export interface Usuario {
  id: string;
  role: PapelUsuario;
  fullName: string;
  /** Unico no sistema. Dominio validado por papel no cadastro. */
  email: string;
  createdAt: string;
  /** Preenchido quando a conta e anonimizada (LGPD). */
  anonymizedAt?: string;
}

export interface Professor extends Usuario {
  role: 'professor';
}

export interface Estudante extends Usuario {
  role: 'estudante';
  /** Matricula academica, escrita a mao nas provas sem identificacao. */
  registration?: string;
}
