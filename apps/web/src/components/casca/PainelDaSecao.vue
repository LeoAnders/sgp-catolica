<script setup lang="ts">
/**
 * Painel esquerdo de uma seção — o andar do "o que estou fazendo e sobre qual fatia".
 *
 * Ordem fixa, de cima para baixo: ação principal, busca, recortes. É o lugar da
 * contagem por recorte, que substitui os cartões de métrica: ver "1 pronta" e
 * filtrar por elas passa a ser o mesmo gesto.
 *
 * Dentro da moldura, ele é uma coluna da mesma superfície cinza, delimitada apenas
 * por uma linha. Em telas estreitas vira uma faixa acima do conteúdo.
 */
</script>

<template>
  <aside
    class="flex shrink-0 flex-col gap-1 border-b bg-field p-4 lg:w-64 lg:border-b-0 lg:border-r"
    aria-label="Ações e filtros da seção"
  >
    <div v-if="$slots.acao" class="mb-1">
      <slot name="acao" />
    </div>

    <div v-if="$slots.busca" class="mb-2 border-b pb-3">
      <slot name="busca" />
    </div>

    <slot />

    <div v-if="$slots.rodape" class="mt-auto hidden border-t pt-3 lg:block">
      <slot name="rodape" />
    </div>
  </aside>
</template>
