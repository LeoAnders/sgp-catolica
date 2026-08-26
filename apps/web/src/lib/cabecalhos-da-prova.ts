/**
 * Cabeçalhos personalizáveis da fase N1.
 *
 * Este estado é local e não amplia `@sgp/shared-types`: RF04 não define modelos de
 * cabeçalho e RF06 só define o QR final na aplicação. O objetivo aqui é validar a
 * autoria e a reutilização antes de existir persistência no backend.
 */
import { reactive, watch } from 'vue';
import { professorMock } from '@sgp/mocks';

export interface CamposDoCabecalho {
  nome: boolean;
  matricula: boolean;
  turma: boolean;
  data: boolean;
  nota: boolean;
}

export interface CabecalhoDaProva {
  instituicao: string;
  linhaComplementar: string;
  professor: string;
  instrucoes: string;
  campos: CamposDoCabecalho;
}

export interface ModeloDeCabecalho {
  id: string;
  nome: string;
  conteudo: CabecalhoDaProva;
}

interface EstadoDeCabecalhos {
  porProva: Record<string, CabecalhoDaProva>;
  modelos: ModeloDeCabecalho[];
}

const CHAVE = 'sgp:cabecalhos-da-prova:v1';

export function criarCabecalhoPadrao(): CabecalhoDaProva {
  return {
    instituicao: 'Católica de Santa Catarina',
    linhaComplementar: '',
    professor: professorMock.fullName,
    instrucoes: '',
    campos: {
      nome: true,
      matricula: false,
      turma: true,
      data: true,
      nota: true,
    },
  };
}

function clonar(cabecalho: CabecalhoDaProva): CabecalhoDaProva {
  const padrao = criarCabecalhoPadrao();
  return {
    instituicao: cabecalho.instituicao ?? padrao.instituicao,
    linhaComplementar: cabecalho.linhaComplementar ?? padrao.linhaComplementar,
    professor: cabecalho.professor ?? padrao.professor,
    instrucoes: cabecalho.instrucoes ?? padrao.instrucoes,
    campos: {
      nome: cabecalho.campos?.nome ?? padrao.campos.nome,
      matricula: cabecalho.campos?.matricula ?? padrao.campos.matricula,
      turma: cabecalho.campos?.turma ?? padrao.campos.turma,
      data: cabecalho.campos?.data ?? padrao.campos.data,
      nota: cabecalho.campos?.nota ?? padrao.campos.nota,
    },
  };
}

function ler(): EstadoDeCabecalhos {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return { porProva: {}, modelos: [] };
    const lido = JSON.parse(bruto) as Partial<EstadoDeCabecalhos>;
    const porProva =
      lido.porProva && typeof lido.porProva === 'object'
        ? Object.fromEntries(
            Object.entries(lido.porProva).map(([provaId, cabecalho]) => [
              provaId,
              clonar(cabecalho),
            ]),
          )
        : {};
    const modelos = Array.isArray(lido.modelos)
      ? lido.modelos.map((modelo) => ({ ...modelo, conteudo: clonar(modelo.conteudo) }))
      : [];
    return { porProva, modelos };
  } catch {
    return { porProva: {}, modelos: [] };
  }
}

const inicial = ler();
const cabecalhosPorProva = reactive<Record<string, CabecalhoDaProva>>(inicial.porProva);
export const modelosDeCabecalho = reactive<ModeloDeCabecalho[]>(inicial.modelos);

watch(
  [cabecalhosPorProva, modelosDeCabecalho],
  () => {
    try {
      window.localStorage.setItem(
        CHAVE,
        JSON.stringify({ porProva: cabecalhosPorProva, modelos: modelosDeCabecalho }),
      );
    } catch {
      // O editor continua utilizável quando o armazenamento local está indisponível.
    }
  },
  { deep: true },
);

export function obterCabecalhoDaProva(provaId: string): CabecalhoDaProva {
  if (!cabecalhosPorProva[provaId]) cabecalhosPorProva[provaId] = criarCabecalhoPadrao();
  return cabecalhosPorProva[provaId];
}

export function atualizarCabecalhoDaProva(provaId: string, atualizado: CabecalhoDaProva): void {
  cabecalhosPorProva[provaId] = clonar(atualizado);
}

export function salvarModeloDeCabecalho(
  nome: string,
  cabecalho: CabecalhoDaProva,
): ModeloDeCabecalho {
  const modelo: ModeloDeCabecalho = {
    id: `cabecalho-${Date.now()}`,
    nome: nome.trim(),
    conteudo: clonar(cabecalho),
  };
  modelosDeCabecalho.unshift(modelo);
  return modelo;
}

export function conteudoDoModelo(modeloId: string): CabecalhoDaProva | undefined {
  const modelo = modelosDeCabecalho.find((item) => item.id === modeloId);
  return modelo ? clonar(modelo.conteudo) : undefined;
}
