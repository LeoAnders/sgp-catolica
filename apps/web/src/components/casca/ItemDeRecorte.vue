<script setup lang="ts">
/**
 * Um recorte do painel esquerdo, com a contagem colada nele.
 *
 * É um botão de filtro, não navegação: por isso `aria-pressed` em vez de
 * `aria-current`. A contagem usa `tabular-nums` para as unidades alinharem entre
 * as linhas.
 */
defineProps<{
  rotulo: string;
  total: number;
  ativo: boolean;
}>();

defineEmits<{ selecionar: [] }>();
</script>

<template>
  <button
    type="button"
    :aria-pressed="ativo"
    class="flex h-8 w-full items-center justify-between gap-2 rounded-lg px-2.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
    :class="ativo
      ? 'bg-background font-medium text-foreground'
      : 'font-normal text-muted-foreground hover:bg-background/70 hover:text-foreground'"
    @click="$emit('selecionar')"
  >
    <span class="truncate">{{ rotulo }}</span>
    <span class="shrink-0 text-xs tabular-nums text-muted-foreground">
      {{ total }}
    </span>
  </button>
</template>
