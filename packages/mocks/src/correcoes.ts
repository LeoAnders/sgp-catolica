import type { Correcao, NotaDoEstudante } from '@sgp/shared-types';

export const correcoesMock: Correcao[] = [
  {
    id: 'cor-0',
    examVersionId: 'versao-0',
    studentId: 'est-1',
    objectiveResults: [
      { questionId: 'q-1', correct: true, score: 3 },
      { questionId: 'q-2', correct: true, score: 3 },
      { questionId: 'q-3', correct: false, score: 0 },
    ],
    discursiveScores: [],
    totalScore: 6,
    confirmedAt: '2026-03-11T15:40:00.000Z',
    correctedBy: 'prof-1',
    isAutomaticallyAssigned: true,
    clientCorrectionId: 'c1f3a8de-0000',
    syncStatus: 'synced',
  },
  {
    id: 'cor-1',
    examVersionId: 'versao-1',
    studentId: 'est-1',
    objectiveResults: [
      { questionId: 'q-1', correct: true, score: 1.5 },
      { questionId: 'q-3', correct: true, score: 1.5 },
      { questionId: 'q-4', correct: false, score: 0 },
    ],
    discursiveScores: [
      { questionId: 'q-5', score: 2 },
      { questionId: 'q-6', score: 2.5 },
    ],
    totalScore: 7.5,
    confirmedAt: '2026-04-23T14:12:00.000Z',
    correctedBy: 'prof-1',
    isAutomaticallyAssigned: true,
    clientCorrectionId: 'c1f3a8de-0001',
    syncStatus: 'synced',
  },
  {
    id: 'cor-2',
    examVersionId: 'versao-2',
    studentId: 'est-2',
    objectiveResults: [
      { questionId: 'q-1', correct: true, score: 1.5 },
      { questionId: 'q-3', correct: false, score: 0 },
      { questionId: 'q-4', correct: true, score: 2 },
    ],
    discursiveScores: [
      { questionId: 'q-5', score: 1.5 },
      { questionId: 'q-6', score: 3 },
    ],
    totalScore: 8,
    confirmedAt: '2026-04-23T14:20:00.000Z',
    correctedBy: 'prof-1',
    isAutomaticallyAssigned: true,
    clientCorrectionId: 'c1f3a8de-0002',
    syncStatus: 'synced',
  },
  {
    /**
     * Correcao vinda de versao-3 (aplic-3), gerada sem identificacao do aluno.
     * O QR Code trouxe apenas a versao, entao nao ha studentId e a nota so entra
     * no historico depois da atribuicao manual (RF09).
     */
    id: 'cor-3',
    examVersionId: 'versao-3',
    reportedStudentName: 'Clara A.',
    reportedStudentRegistration: '2026103',
    objectiveResults: [
      { questionId: 'q-1', correct: true, score: 1.5 },
      { questionId: 'q-3', correct: true, score: 1.5 },
      { questionId: 'q-4', correct: true, score: 2 },
    ],
    discursiveScores: [
      { questionId: 'q-5', score: 1 },
      { questionId: 'q-6', score: 1.5 },
    ],
    totalScore: 7.5,
    confirmedAt: '2026-04-23T14:31:00.000Z',
    correctedBy: 'prof-1',
    isAutomaticallyAssigned: false,
    clientCorrectionId: 'c1f3a8de-0003',
    syncStatus: 'pending',
  },
];

export const notasDoEstudanteMock: NotaDoEstudante[] = [
  {
    applicationId: 'aplic-1',
    examTitle: 'Avaliacao 01 - Arquitetura e Requisitos',
    className: 'Projeto e Arquitetura de Software',
    subject: 'Engenharia de Software',
    teacherName: 'Helena Marques',
    date: '2026-04-22',
    totalScore: 7.5,
    maxScore: 10,
    answerKeyPublished: true,
  },
  {
    applicationId: 'aplic-0',
    examTitle: 'Diagnostica - Fundamentos',
    className: 'Projeto e Arquitetura de Software',
    subject: 'Engenharia de Software',
    teacherName: 'Helena Marques',
    date: '2026-03-11',
    totalScore: 6,
    maxScore: 10,
    answerKeyPublished: true,
  },
];
