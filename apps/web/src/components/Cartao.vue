<script setup lang="ts">
defineProps<{
  titulo: string;
}>();
</script>

<template>
  <section class="cartao">
    <h2>{{ titulo }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.cartao {
  padding: var(--espaco-lg);
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-lg);
  box-shadow: var(--sombra-cartao);
}

h2 {
  margin-top: 0;
  font-size: var(--fonte-lg);
}
</style>
