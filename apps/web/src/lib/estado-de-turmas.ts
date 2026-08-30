/**
 * Estado do acervo de turmas, compartilhado entre `/turmas` e `/turmas/:id`.
 *
 * Segue o mesmo formato de `estado-de-provas.ts`: um módulo único e reativo, não um
 * gerenciador de estado real. Quando o backend existir, este arquivo é o ponto de
 * integração a substituir por chamadas à API (RF03) — nenhuma tela deve importar
 * `@sgp/mocks` diretamente para ler, criar ou alterar uma turma; deve passar por aqui.
 *
 * Grava em `localStorage` pelo mesmo motivo de `estado-de-provas.ts`: sobreviver ao F5
 * sem virar banco de dados, backend ou requisição de rede. A chave é versionada; mudar
 * o formato de `Turma`/`Matricula` exige subir o `v`.
 */
import { reactive, watch } from 'vue';
import { matriculasMock, turmasMock } from '@sgp/mocks';
import type { Matricula, Turma } from '@sgp/shared-types';

const CHAVE = 'sgp:estado-de-turmas:v1';

interface EstadoGravado {
  turmas: Turma[];
  matriculas: Matricula[];
}

function apartirDosMocks(): EstadoGravado {
  return {
    turmas: turmasMock.map((turma) => ({ ...turma })),
    matriculas: matriculasMock.map((matricula) => ({ ...matricula })),
  };
}

/** Leitura tolerante: qualquer coisa fora do formato esperado volta para os mocks. */
function ler(): EstadoGravado {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return apartirDosMocks();

    const lido = JSON.parse(bruto) as Partial<EstadoGravado>;
    if (!Array.isArray(lido.turmas) || !Array.isArray(lido.matriculas)) return apartirDosMocks();

    return { turmas: lido.turmas, matriculas: lido.matriculas };
  } catch {
    // localStorage indisponível (janela privada, cookies bloqueados) ou JSON inválido:
    // a aplicação segue funcionando, só sem sobreviver à recarga.
    return apartirDosMocks();
  }
}

const inicial = ler();

export const turmasNoNavegador = reactive<Turma[]>(inicial.turmas);
export const matriculasNoNavegador = reactive<Matricula[]>(inicial.matriculas);

function gravar(): void {
  try {
    window.localStorage.setItem(
      CHAVE,
      JSON.stringify({ turmas: turmasNoNavegador, matriculas: matriculasNoNavegador }),
    );
  } catch {
    // Cota estourada ou armazenamento bloqueado: não vale derrubar a tela por isso.
  }
}

watch([turmasNoNavegador, matriculasNoNavegador], gravar, { deep: true });

export function listarTurmas(): Turma[] {
  return turmasNoNavegador;
}

export function encontrarTurma(id: string): Turma | undefined {
  return turmasNoNavegador.find((turma) => turma.id === id);
}

/** Alunos com matrícula ativa numa turma, na ordem em que se matricularam. */
export function listarMatriculasDaTurma(classId: string): Matricula[] {
  return matriculasNoNavegador
    .filter((matricula) => matricula.classId === classId && matricula.status === 'active')
    .sort((a, b) => a.enrolledAt.localeCompare(b.enrolledAt));
}

/** Sem caracteres ambíguos (0/O, 1/I) para o código ser legível quando ditado ou copiado. */
function gerarCodigoDeConvite(): string {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let sufixo = '';
  for (let indice = 0; indice < 4; indice += 1) {
    sufixo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return `TURMA-${new Date().getFullYear()}-${sufixo}`;
}

export function criarTurma(): Turma {
  const turma: Turma = {
    id: `turma-local-${Date.now()}`,
    teacherId: 'prof-1',
    name: '',
    subject: '',
    term: '',
    status: 'active',
    inviteCode: gerarCodigoDeConvite(),
    createdAt: new Date().toISOString(),
  };
  turmasNoNavegador.unshift(turma);
  return turma;
}

export function atualizarTurma(
  id: string,
  dados: { name: string; subject: string; term: string },
): void {
  const turma = encontrarTurma(id);
  if (!turma) return;
  turma.name = dados.name;
  turma.subject = dados.subject;
  turma.term = dados.term;
}

export function arquivarTurma(id: string): void {
  const turma = encontrarTurma(id);
  if (turma) turma.status = 'archived';
}

export function regenerarCodigoDeConvite(id: string): string | undefined {
  const turma = encontrarTurma(id);
  if (!turma) return undefined;
  turma.inviteCode = gerarCodigoDeConvite();
  return turma.inviteCode;
}

export function removerMatricula(matriculaId: string): void {
  const matricula = matriculasNoNavegador.find((item) => item.id === matriculaId);
  if (matricula) matricula.status = 'removed';
}

/** Desfaz `removerMatricula`, chamada pela ação "Desfazer" do toast. */
export function restaurarMatricula(matriculaId: string): void {
  const matricula = matriculasNoNavegador.find((item) => item.id === matriculaId);
  if (matricula) matricula.status = 'active';
}

/** Descarta o que o navegador guardou e volta ao acervo de demonstração. */
export function reiniciarComOsMocks(): void {
  const zerado = apartirDosMocks();
  turmasNoNavegador.splice(0, turmasNoNavegador.length, ...zerado.turmas);
  matriculasNoNavegador.splice(0, matriculasNoNavegador.length, ...zerado.matriculas);
}
