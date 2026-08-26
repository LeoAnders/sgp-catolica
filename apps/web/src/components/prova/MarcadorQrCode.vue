<script setup lang="ts">
/**
 * Marcador visual do QR que só será gerado em RF06.
 *
 * Não codifica payload e não deve ser lido pelo aplicativo. Os três localizadores e
 * a matriz irregular reproduzem a silhueta de um QR sem fingir que a aplicação já
 * gerou versão ou identificação de estudante.
 */
interface Celula {
  linha: number;
  coluna: number;
}

const TAMANHO = 15;

function dentroDoLocalizador(linha: number, coluna: number, topo: number, esquerda: number): boolean {
  return linha >= topo && linha < topo + 5 && coluna >= esquerda && coluna < esquerda + 5;
}

function moduloDoLocalizador(linha: number, coluna: number, topo: number, esquerda: number): boolean {
  const y = linha - topo;
  const x = coluna - esquerda;
  return y === 0 || y === 4 || x === 0 || x === 4 || (y === 2 && x === 2);
}

function ativo(linha: number, coluna: number): boolean {
  for (const [topo, esquerda] of [[0, 0], [0, 10], [10, 0]] as const) {
    if (dentroDoLocalizador(linha, coluna, topo, esquerda)) {
      return moduloDoLocalizador(linha, coluna, topo, esquerda);
    }
  }
  return (linha * 7 + coluna * 11 + linha * coluna) % 5 < 2;
}

const celulas: Celula[] = [];
for (let linha = 0; linha < TAMANHO; linha += 1) {
  for (let coluna = 0; coluna < TAMANHO; coluna += 1) {
    if (ativo(linha, coluna)) celulas.push({ linha, coluna });
  }
}
</script>

<template>
  <span
    class="flex size-16 shrink-0 items-center justify-center rounded-lg border border-sheet-border bg-sheet text-sheet-foreground/35"
    role="img"
    aria-label="Espaço reservado para o QR Code gerado na aplicação"
    title="O QR Code válido será gerado ao criar uma aplicação da prova"
  >
    <svg viewBox="0 0 17 17" class="size-12" aria-hidden="true">
      <rect
        v-for="celula in celulas"
        :key="`${celula.linha}-${celula.coluna}`"
        :x="celula.coluna + 1.12"
        :y="celula.linha + 1.12"
        width="0.76"
        height="0.76"
        rx="0.12"
        fill="currentColor"
      />
    </svg>
  </span>
</template>
