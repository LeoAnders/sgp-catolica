import type { Matricula, Turma } from '@sgp/shared-types';
import { estudantesMock } from './usuarios';

export const turmasMock: Turma[] = [
  {
    id: 'turma-1',
    teacherId: 'prof-1',
    name: 'Projeto e Arquitetura de Software',
    subject: 'Engenharia de Software',
    term: '2026/1',
    status: 'active',
    inviteCode: 'PAS-2026-7QK4',
    createdAt: '2026-02-20T12:00:00.000Z',
  },
  {
    id: 'turma-2',
    teacherId: 'prof-1',
    name: 'Banco de Dados II',
    subject: 'Banco de Dados',
    term: '2026/1',
    status: 'active',
    inviteCode: 'BD2-2026-M3XZ',
    createdAt: '2026-02-20T12:00:00.000Z',
  },
  {
    id: 'turma-3',
    teacherId: 'prof-1',
    name: 'Estrutura de Dados',
    subject: 'Algoritmos',
    term: '2025/2',
    status: 'archived',
    inviteCode: 'EDA-2025-P0LB',
    createdAt: '2025-08-01T12:00:00.000Z',
  },
];

export const matriculasMock: Matricula[] = estudantesMock.map((estudante, indice) => ({
  id: `mat-${indice + 1}`,
  classId: 'turma-1',
  studentId: estudante.id,
  enrolledAt: '2026-02-21T12:00:00.000Z',
  status: 'active',
  enrolledVia: indice % 2 === 0 ? 'teacher' : 'invite_code',
}));
