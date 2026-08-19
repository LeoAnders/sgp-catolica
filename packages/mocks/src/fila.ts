import type { GabaritoVersaoSnapshot, ItemFilaCorrecao } from '@sgp/shared-types';

/**
 * Fila local de correcoes do aplicativo do professor.
 *
 * Na N1 nada aqui e persistido nem sincronizado: os tres estados de
 * `syncStatus` existem para que a tela de fila possa ser navegada e
 * demonstrada com dados estaticos.
 *
 * Os snapshots reproduzem o gabarito de cada versao como o aplicativo o teria
 * baixado antes de corrigir: alternativa correta, ordem impressa das letras e
 * pontuacao de cada questao naquela prova.
 */
const gabaritoVersao1: GabaritoVersaoSnapshot = {
  examVersionId: 'versao-1',
  capturedAt: '2026-04-23T13:55:00.000Z',
  objectiveQuestions: [
    {
      questionId: 'q-1',
      correctAlternativeId: 'q-1-c',
      printedOrder: ['q-1-c', 'q-1-a', 'q-1-d', 'q-1-b'],
      score: 1.5,
    },
    {
      questionId: 'q-3',
      correctAlternativeId: 'q-3-b',
      printedOrder: ['q-3-d', 'q-3-b', 'q-3-a', 'q-3-c'],
      score: 1.5,
    },
    {
      questionId: 'q-4',
      correctAlternativeId: 'q-4-a',
      printedOrder: ['q-4-b', 'q-4-a', 'q-4-c', 'q-4-d'],
      score: 2,
    },
  ],
  discursiveQuestions: [
    { questionId: 'q-5', maxScore: 2 },
    { questionId: 'q-6', maxScore: 3 },
  ],
};

/** versao-2 saiu sem embaralhar alternativas: a ordem impressa e a de cadastro. */
const gabaritoVersao2: GabaritoVersaoSnapshot = {
  examVersionId: 'versao-2',
  capturedAt: '2026-04-23T13:55:00.000Z',
  objectiveQuestions: [
    {
      questionId: 'q-1',
      correctAlternativeId: 'q-1-c',
      printedOrder: ['q-1-a', 'q-1-b', 'q-1-c', 'q-1-d'],
      score: 1.5,
    },
    {
      questionId: 'q-3',
      correctAlternativeId: 'q-3-b',
      printedOrder: ['q-3-a', 'q-3-b', 'q-3-c', 'q-3-d'],
      score: 1.5,
    },
    {
      questionId: 'q-4',
      correctAlternativeId: 'q-4-a',
      printedOrder: ['q-4-a', 'q-4-b', 'q-4-c', 'q-4-d'],
      score: 2,
    },
  ],
  discursiveQuestions: [
    { questionId: 'q-5', maxScore: 2 },
    { questionId: 'q-6', maxScore: 3 },
  ],
};

/** versao-3 e a prova anonima: o gabarito e da versao, nunca de um aluno. */
const gabaritoVersao3: GabaritoVersaoSnapshot = {
  examVersionId: 'versao-3',
  capturedAt: '2026-04-23T14:05:00.000Z',
  objectiveQuestions: [
    {
      questionId: 'q-1',
      correctAlternativeId: 'q-1-c',
      printedOrder: ['q-1-b', 'q-1-d', 'q-1-c', 'q-1-a'],
      score: 1.5,
    },
    {
      questionId: 'q-3',
      correctAlternativeId: 'q-3-b',
      printedOrder: ['q-3-c', 'q-3-a', 'q-3-d', 'q-3-b'],
      score: 1.5,
    },
    {
      questionId: 'q-4',
      correctAlternativeId: 'q-4-a',
      printedOrder: ['q-4-d', 'q-4-c', 'q-4-a', 'q-4-b'],
      score: 2,
    },
  ],
  discursiveQuestions: [
    { questionId: 'q-5', maxScore: 2 },
    { questionId: 'q-6', maxScore: 3 },
  ],
};

export const filaCorrecoesMock: ItemFilaCorrecao[] = [
  {
    /** Ja registrada no servidor: corresponde a cor-1. */
    clientCorrectionId: 'c1f3a8de-0001',
    examVersionId: 'versao-1',
    studentId: 'est-1',
    objectiveAnswers: [
      { questionId: 'q-1', selectedAlternativeId: 'q-1-c' },
      { questionId: 'q-3', selectedAlternativeId: 'q-3-b' },
      { questionId: 'q-4', selectedAlternativeId: 'q-4-c' },
    ],
    discursiveScores: [
      { questionId: 'q-5', score: 2 },
      { questionId: 'q-6', score: 2.5 },
    ],
    answerKeySnapshot: gabaritoVersao1,
    capturedAt: '2026-04-23T14:12:00.000Z',
    syncStatus: 'synced',
  },
  {
    /**
     * Corrigida sem sinal: corresponde a cor-3. Como versao-3 nao tem
     * identificacao, o item carrega apenas o nome e a matricula lidos na folha,
     * e nenhum studentId (RF09).
     */
    clientCorrectionId: 'c1f3a8de-0003',
    examVersionId: 'versao-3',
    reportedStudentName: 'Clara A.',
    reportedStudentRegistration: '2026103',
    objectiveAnswers: [
      { questionId: 'q-1', selectedAlternativeId: 'q-1-c' },
      { questionId: 'q-3', selectedAlternativeId: 'q-3-b' },
      { questionId: 'q-4', selectedAlternativeId: 'q-4-a' },
    ],
    discursiveScores: [
      { questionId: 'q-5', score: 1 },
      { questionId: 'q-6', score: 1.5 },
    ],
    answerKeySnapshot: gabaritoVersao3,
    capturedAt: '2026-04-23T14:31:00.000Z',
    syncStatus: 'pending',
  },
  {
    /**
     * Rejeitada na validacao do servidor, entao nao existe Correcao
     * correspondente em correcoesMock: o item fica na fila com o erro e o
     * professor reenvia depois de ajustar os dados (RF08).
     */
    clientCorrectionId: 'c1f3a8de-0004',
    examVersionId: 'versao-2',
    studentId: 'est-4',
    objectiveAnswers: [
      { questionId: 'q-1', selectedAlternativeId: 'q-1-c' },
      { questionId: 'q-3', selectedAlternativeId: 'q-3-d' },
      { questionId: 'q-4', selectedAlternativeId: 'q-4-a' },
    ],
    discursiveScores: [{ questionId: 'q-5', score: 1.5 }],
    answerKeySnapshot: gabaritoVersao2,
    capturedAt: '2026-04-23T14:44:00.000Z',
    syncStatus: 'error',
    syncError: 'Falta a nota da questao discursiva q-6.',
  },
];
