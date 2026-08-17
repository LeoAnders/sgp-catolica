import type { Estudante, Professor } from '@sgp/shared-types';

export const professorMock: Professor = {
  id: 'prof-1',
  role: 'professor',
  fullName: 'Tassiana Kautzmann',
  email: 'tassiana.kautzmann@catolicasc.org.br',
  createdAt: '2026-02-10T12:00:00.000Z',
};

export const estudantesMock: Estudante[] = [
  { id: 'est-1', role: 'estudante', fullName: 'Ana Clara Borchardt', email: 'ana.borchardt@catolicasc.edu.br', registration: '2026001', createdAt: '2026-02-12T12:00:00.000Z' },
  { id: 'est-2', role: 'estudante', fullName: 'Bruno Rovani Marcelino', email: 'bruno.marcelino@catolicasc.edu.br', registration: '2026002', createdAt: '2026-02-12T12:00:00.000Z' },
  { id: 'est-3', role: 'estudante', fullName: 'Camila Lorenzetti', email: 'camila.lorenzetti@catolicasc.edu.br', registration: '2026003', createdAt: '2026-02-12T12:00:00.000Z' },
  { id: 'est-4', role: 'estudante', fullName: 'Diego Dornelles', email: 'diego.dornelles@catolicasc.edu.br', registration: '2026004', createdAt: '2026-02-13T12:00:00.000Z' },
  { id: 'est-5', role: 'estudante', fullName: 'Eloisa Fazzio Rocha', email: 'eloisa.rocha@catolicasc.edu.br', registration: '2026005', createdAt: '2026-02-13T12:00:00.000Z' },
  { id: 'est-6', role: 'estudante', fullName: 'Gabriel Koehler', email: 'gabriel.koehler@catolicasc.edu.br', registration: '2026006', createdAt: '2026-02-13T12:00:00.000Z' },
];

/** Estudante usado como usuario logado nas telas da area do estudante. */
export const estudanteLogadoMock = estudantesMock[0];
