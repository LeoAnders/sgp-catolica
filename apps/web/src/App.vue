<script setup lang="ts">
import { turmasMock } from '@sgp/mocks';
import Cartao from './components/Cartao.vue';
</script>

<template>
  <main class="conteudo-principal">
    <h1>SGP Catolica</h1>
    <p class="subtitulo">
      Sistema de Geracao de Provas. Ambiente Vue configurado; telas em construcao.
    </p>

    <Cartao titulo="Dados de exemplo carregados do pacote de mocks">
      <ul>
        <li v-for="turma in turmasMock" :key="turma.id">
          {{ turma.name }} — {{ turma.subject }} ({{ turma.term }})
        </li>
      </ul>
    </Cartao>
  </main>
</template>

<style scoped>
.conteudo-principal {
  max-width: 880px;
  margin: 0 auto;
  padding: var(--espaco-xl);
}

h1 {
  margin-bottom: var(--espaco-xs);
  font-size: var(--fonte-xxl);
}

.subtitulo {
  margin-top: 0;
  color: var(--cor-texto-secundario);
}
</style>
