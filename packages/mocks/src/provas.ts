import type { Aplicacao, AtribuicaoVersao, Prova, VersaoProva } from '@sgp/shared-types';

export const provasMock: Prova[] = [
  {
    id: 'prova-1',
    teacherId: 'prof-1',
    title: 'Avaliacao 01 - Arquitetura e Requisitos',
    description: 'Conteudo das aulas 1 a 8.',
    questions: [
      { questionId: 'q-1', order: 1, score: 1.5 },
      { questionId: 'q-3', order: 2, score: 1.5 },
      { questionId: 'q-4', order: 3, score: 2 },
      { questionId: 'q-5', order: 4, score: 2 },
      { questionId: 'q-6', order: 5, score: 3 },
    ],
    status: 'ready',
    createdAt: '2026-03-15T12:00:00.000Z',
  },
  {
    id: 'prova-2',
    teacherId: 'prof-1',
    title: 'Avaliacao 02 - Modelagem de Dados',
    description: 'MER/DER e normalizacao.',
    questions: [
      { questionId: 'q-2', order: 1, score: 4 },
      { questionId: 'q-5', order: 2, score: 6 },
    ],
    status: 'draft',
    createdAt: '2026-04-02T12:00:00.000Z',
  },
];

export const aplicacoesMock: Aplicacao[] = [
  {
    id: 'aplic-1',
    examId: 'prova-1',
    classId: 'turma-1',
    teacherId: 'prof-1',
    status: 'generated',
    pdfUrl: 'mock://aplicacoes/aplic-1.pdf',
    createdAt: '2026-04-10T12:00:00.000Z',
  },
  {
    id: 'aplic-2',
    examId: 'prova-1',
    classId: 'turma-2',
    teacherId: 'prof-1',
    status: 'draft',
    createdAt: '2026-04-18T12:00:00.000Z',
  },
];

export const versoesMock: VersaoProva[] = [
  {
    id: 'versao-1',
    applicationId: 'aplic-1',
    versionNumber: 1,
    shuffleQuestions: true,
    shuffleAlternatives: true,
    withStudentIdentification: true,
    layout: {
      questionOrder: ['q-3', 'q-1', 'q-4', 'q-6', 'q-5'],
      alternativeOrder: [
        { questionId: 'q-1', printedOrder: ['q-1-c', 'q-1-a', 'q-1-d', 'q-1-b'] },
        { questionId: 'q-3', printedOrder: ['q-3-d', 'q-3-b', 'q-3-a', 'q-3-c'] },
        { questionId: 'q-4', printedOrder: ['q-4-b', 'q-4-a', 'q-4-c', 'q-4-d'] },
      ],
    },
    answerKeyPublished: true,
    answerKeyPublishedAt: '2026-04-24T18:00:00.000Z',
    publicCode: 'GAB-1A2B3C',
    qrCodePayload: 'mock-qr-versao-1',
    createdAt: '2026-04-11T12:00:00.000Z',
  },
  {
    id: 'versao-2',
    applicationId: 'aplic-1',
    versionNumber: 2,
    shuffleQuestions: true,
    shuffleAlternatives: false,
    withStudentIdentification: true,
    layout: {
      questionOrder: ['q-4', 'q-3', 'q-1', 'q-5', 'q-6'],
      alternativeOrder: [],
    },
    answerKeyPublished: false,
    publicCode: 'GAB-4D5E6F',
    qrCodePayload: 'mock-qr-versao-2',
    createdAt: '2026-04-11T12:00:00.000Z',
  },
];

export const atribuicoesMock: AtribuicaoVersao[] = [
  { id: 'atr-1', examVersionId: 'versao-1', studentId: 'est-1', qrCodePayload: 'mock-qr-est-1' },
  { id: 'atr-2', examVersionId: 'versao-2', studentId: 'est-2', qrCodePayload: 'mock-qr-est-2' },
  { id: 'atr-3', examVersionId: 'versao-1', studentId: 'est-3', qrCodePayload: 'mock-qr-est-3' },
  { id: 'atr-4', examVersionId: 'versao-2', studentId: 'est-4', qrCodePayload: 'mock-qr-est-4' },
  { id: 'atr-5', examVersionId: 'versao-1', studentId: 'est-5', qrCodePayload: 'mock-qr-est-5' },
  { id: 'atr-6', examVersionId: 'versao-2', studentId: 'est-6', qrCodePayload: 'mock-qr-est-6' },
];
