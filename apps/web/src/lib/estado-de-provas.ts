/**
 * Estado do acervo de provas, compartilhado entre `/provas` e `/provas/:id`.
 *
 * Não é um gerenciador de estado real: é um módulo único e reativo que existe só
 * para a navegação entre as duas telas não perder o que foi criado. Quando o backend
 * existir, este arquivo é o ponto de integração a substituir por chamadas à API
 * (RF04/RF05/RF06) — nenhuma tela deve importar `@sgp/mocks` diretamente para ler ou
 * criar uma prova; deve passar por aqui.
 *
 * ## Por que grava no navegador
 *
 * Só em memória, uma prova criada desaparecia a cada recarga da página: abrir o
 * editor, atualizar e cair em "Prova não encontrada" — inclusive no recarregamento
 * automático do Vite durante o desenvolvimento. Para demonstrar o produto ao cliente
 * isso inviabiliza o fluxo mais básico, criar uma prova e voltar a ela.
 *
 * `localStorage` resolve sem violar o escopo da N1: não é banco de dados, não é
 * backend e não há requisição de rede — é o mesmo estado da sessão, só que
 * sobrevivendo ao F5. Os dados continuam vindo de `@sgp/mocks`, que semeiam o
 * primeiro acesso.
 *
 * A chave é versionada: mudar o formato de `Prova` ou dos blocos exige subir o `v`,
 * senão o navegador de quem já usou a aplicação continuaria lendo o formato antigo.
 * Pelo mesmo motivo, alterações em `packages/mocks` não aparecem para quem já tem
 * estado gravado — use `reiniciarComOsMocks()` ou suba a versão da chave.
 */
import { reactive, watch } from 'vue';
import { provasMock } from '@sgp/mocks';
import type { Prova } from '@sgp/shared-types';
import { type BlocoDaProva, blocosIniciaisApartirDeProva } from './blocos-da-prova';

const CHAVE = 'sgp:estado-de-provas:v1';

interface EstadoGravado {
  provas: Prova[];
  blocos: Record<string, BlocoDaProva[]>;
}

function apartirDosMocks(): EstadoGravado {
  return {
    provas: provasMock.map((prova) => ({ ...prova, questions: [...prova.questions] })),
    blocos: {},
  };
}

/** Leitura tolerante: qualquer coisa fora do formato esperado volta para os mocks. */
function ler(): EstadoGravado {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return apartirDosMocks();

    const lido = JSON.parse(bruto) as Partial<EstadoGravado>;
    if (!Array.isArray(lido.provas)) return apartirDosMocks();

    return {
      provas: lido.provas,
      blocos: lido.blocos && typeof lido.blocos === 'object' ? lido.blocos : {},
    };
  } catch {
    // localStorage indisponível (janela privada, cookies bloqueados) ou JSON inválido:
    // a aplicação segue funcionando, só sem sobreviver à recarga.
    return apartirDosMocks();
  }
}

const inicial = ler();

export const provasNoNavegador = reactive<Prova[]>(inicial.provas);

const blocosPorProva = reactive<Record<string, BlocoDaProva[]>>(inicial.blocos);

function gravar(): void {
  try {
    window.localStorage.setItem(
      CHAVE,
      JSON.stringify({ provas: provasNoNavegador, blocos: blocosPorProva }),
    );
  } catch {
    // Cota estourada ou armazenamento bloqueado: não vale derrubar a tela por isso.
  }
}

watch([provasNoNavegador, blocosPorProva], gravar, { deep: true });

export function listarProvas(): Prova[] {
  return provasNoNavegador;
}

export function encontrarProva(id: string): Prova | undefined {
  return provasNoNavegador.find((prova) => prova.id === id);
}

export function criarProva(dados: { title: string; description?: string }): Prova {
  const prova: Prova = {
    id: `prova-local-${Date.now()}`,
    teacherId: 'prof-1',
    title: dados.title,
    description: dados.description,
    questions: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
  provasNoNavegador.unshift(prova);
  return prova;
}

export function atualizarQuestoesDaProva(id: string, questions: Prova['questions']): void {
  const prova = encontrarProva(id);
  if (prova) prova.questions = questions;
}

/**
 * Blocos de uma prova, criados a partir das questões existentes na primeira visita e
 * preservados a partir daí.
 */
export function obterBlocosDaProva(prova: Prova): BlocoDaProva[] {
  if (!blocosPorProva[prova.id]) {
    blocosPorProva[prova.id] = blocosIniciaisApartirDeProva(prova);
  }
  return blocosPorProva[prova.id];
}

/** Descarta o que o navegador guardou e volta ao acervo de demonstração. */
export function reiniciarComOsMocks(): void {
  const zerado = apartirDosMocks();
  provasNoNavegador.splice(0, provasNoNavegador.length, ...zerado.provas);
  for (const id of Object.keys(blocosPorProva)) delete blocosPorProva[id];
}
