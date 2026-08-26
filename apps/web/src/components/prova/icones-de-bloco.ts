/** Ícone por tipo de bloco, compartilhado entre o menu de adicionar e a estrutura. */
import { FileText, Heading2, Image, ListChecks, Rows3 } from '@lucide/vue';
import type { TipoDeBloco } from '@/lib/blocos-da-prova';

export const iconePorTipoDeBloco: Record<TipoDeBloco, typeof FileText> = {
  titulo: Heading2,
  texto: FileText,
  imagem: Image,
  questao: ListChecks,
  espaco: Rows3,
};

export const rotuloPorTipoDeBloco: Record<TipoDeBloco, string> = {
  titulo: 'Título de seção',
  texto: 'Texto ou instrução',
  imagem: 'Imagem',
  questao: 'Questão',
  espaco: 'Espaço para resposta',
};
