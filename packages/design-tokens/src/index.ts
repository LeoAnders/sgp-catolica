/**
 * Fonte unica dos tokens visuais do SGP.
 *
 * O objeto abaixo e consumido diretamente pelo aplicativo mobile (React Native)
 * e espelhado em variaveis CSS em ./tokens.css para a aplicacao web.
 * Qualquer alteracao precisa ser feita nos dois arquivos.
 */

export const cores = {
  /** Identidade institucional. */
  marca: '#7B1A24',
  marcaForte: '#5C1119',
  marcaSuave: '#F4E6E8',

  fundo: '#FFFFFF',
  fundoAlternativo: '#F6F7F9',
  superficie: '#FFFFFF',
  borda: '#E2E5EA',

  texto: '#1B1F24',
  textoSecundario: '#5B6572',
  textoInvertido: '#FFFFFF',

  sucesso: '#1F7A4D',
  sucessoSuave: '#E4F3EB',
  alerta: '#B26A00',
  alertaSuave: '#FBF0DD',
  erro: '#B3261E',
  erroSuave: '#FBE7E6',
  informacao: '#1B5FA8',
  informacaoSuave: '#E5EFF9',
} as const;

export const espacamento = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const raio = {
  sm: 4,
  md: 8,
  lg: 16,
  pill: 999,
} as const;

export const tipografia = {
  familia: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  tamanho: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 26,
    xxl: 32,
  },
  peso: {
    regular: '400',
    medio: '500',
    forte: '700',
  },
} as const;

export const sombra = {
  cartao: '0 1px 2px rgba(27, 31, 36, 0.06), 0 2px 8px rgba(27, 31, 36, 0.06)',
} as const;

export const tokens = { cores, espacamento, raio, tipografia, sombra } as const;

export type Tokens = typeof tokens;
