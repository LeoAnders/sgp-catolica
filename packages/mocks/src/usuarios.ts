import type { Estudante, Professor } from '@sgp/shared-types';

/**
 * Usuarios do sistema. Ver Feature 1 e 1.1 da especificacao.
 *
 * Dados ficticios: nomes, e-mails e matriculas nao correspondem a pessoas reais.
 * Os dominios usam faixas reservadas para documentacao (RFC 2606) e nunca resolvem.
 * Professor e estudante usam dominios distintos, como a especificacao exige.
 */
export const professorMock: Professor = {
  id: 'prof-1',
  role: 'professor',
  fullName: 'Helena Marques',
  email: 'helena.marques@docente.example.org',
  createdAt: '2026-02-10T12:00:00.000Z',
};

export const estudantesMock: Estudante[] = [
  {
    id: 'est-1',
    role: 'estudante',
    fullName: 'Alice Ferreira',
    email: 'alice.ferreira@aluno.example.com',
    registration: '2026101',
    createdAt: '2026-02-12T12:00:00.000Z',
  },
  {
    id: 'est-2',
    role: 'estudante',
    fullName: 'Bernardo Costa',
    email: 'bernardo.costa@aluno.example.com',
    registration: '2026102',
    createdAt: '2026-02-12T12:00:00.000Z',
  },
  {
    id: 'est-3',
    role: 'estudante',
    fullName: 'Clara Antunes',
    email: 'clara.antunes@aluno.example.com',
    registration: '2026103',
    createdAt: '2026-02-12T12:00:00.000Z',
  },
  {
    id: 'est-4',
    role: 'estudante',
    fullName: 'Daniel Moraes',
    email: 'daniel.moraes@aluno.example.com',
    registration: '2026104',
    createdAt: '2026-02-13T12:00:00.000Z',
  },
  {
    id: 'est-5',
    role: 'estudante',
    fullName: 'Elisa Barbosa',
    email: 'elisa.barbosa@aluno.example.com',
    registration: '2026105',
    createdAt: '2026-02-13T12:00:00.000Z',
  },
  {
    id: 'est-6',
    role: 'estudante',
    fullName: 'Gustavo Ramos',
    email: 'gustavo.ramos@aluno.example.com',
    registration: '2026106',
    createdAt: '2026-02-13T12:00:00.000Z',
  },
];

/** Estudante usado como usuario logado nas telas da area do estudante. */
export const estudanteLogadoMock = estudantesMock[0];
