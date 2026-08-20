<script setup lang="ts">
/**
 * Shell da aplicacao web: barra superior, navegacao lateral e area principal.
 * Separa a moldura da aplicacao do conteudo de cada tela.
 *
 * N1: nao ha roteador. Apenas o Banco de questoes esta implementado; as demais
 * secoes aparecem desabilitadas para mostrar o recorte da navegacao.
 */
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import {
  mdiAccountGroupOutline,
  mdiChartBoxOutline,
  mdiCheckboxMarkedOutline,
  mdiClipboardTextOutline,
  mdiFileDocumentOutline,
} from '@mdi/js';

const { mdAndUp } = useDisplay();
const navegacaoAberta = ref(mdAndUp.value);

const secoes = [
  { rotulo: 'Banco de questoes', icone: mdiClipboardTextOutline, disponivel: true },
  { rotulo: 'Provas', icone: mdiFileDocumentOutline, disponivel: false },
  { rotulo: 'Turmas', icone: mdiAccountGroupOutline, disponivel: false },
  { rotulo: 'Correcoes', icone: mdiCheckboxMarkedOutline, disponivel: false },
  { rotulo: 'Relatorios', icone: mdiChartBoxOutline, disponivel: false },
];
</script>

<template>
  <v-app>
    <v-app-bar class="barra" color="primary" flat :height="60">
      <v-app-bar-nav-icon
        :aria-label="navegacaoAberta ? 'Fechar a navegacao' : 'Abrir a navegacao'"
        :aria-expanded="navegacaoAberta"
        @click="navegacaoAberta = !navegacaoAberta"
      />
      <span class="marca">
        <strong>SGP</strong>
        <span class="marca__separador" aria-hidden="true"></span>
        <span class="marca__instituicao">Catolica</span>
      </span>
    </v-app-bar>

    <v-navigation-drawer
      v-model="navegacaoAberta"
      :temporary="!mdAndUp"
      :permanent="mdAndUp"
      width="252"
      color="surface"
      aria-label="Secoes do sistema"
    >
      <!-- Sem itens interativos, a lista nao precisa de parada propria no Tab. -->
      <v-list class="navegacao" density="comfortable" nav tabindex="-1">
        <v-list-item
          v-for="secao in secoes"
          :key="secao.rotulo"
          :prepend-icon="secao.icone"
          :title="secao.rotulo"
          :aria-current="secao.disponivel ? 'page' : undefined"
          class="navegacao__item"
          :class="{ 'navegacao__item--ativo': secao.disponivel }"
        />
      </v-list>

      <template #append>
        <p class="navegacao__aviso">
          Demonstracao da N1. Apenas o Banco de questoes esta implementado.
        </p>
      </template>
    </v-navigation-drawer>

    <v-main class="area-principal">
      <slot />
    </v-main>
  </v-app>
</template>

<style scoped>
.barra {
  border-bottom: 1px solid var(--cor-marca-forte);
}

.marca {
  display: inline-flex;
  align-items: center;
  gap: var(--espaco-sm);
  font-size: var(--fonte-lg);
  letter-spacing: 0.02em;
}

.marca strong {
  font-weight: var(--peso-forte);
}

.marca__separador {
  width: 1px;
  height: 1.1em;
  background: currentcolor;
  opacity: 0.5;
}

.marca__instituicao {
  font-weight: var(--peso-regular);
}

.navegacao {
  padding: var(--espaco-md) var(--espaco-sm);
}

/*
  Assinatura visual do SGP: a mesma faixa vertical que marca cada questao na
  listagem identifica a secao atual, ligando a moldura ao conteudo.

  Os itens nao sao interativos: sem roteador, a lista descreve as secoes do
  sistema. A secao atual e marcada por `aria-current`; o recorte da demonstracao
  e dito por escrito no rodape, e nao pelo esmaecimento dos demais itens, que
  manteriam contraste insuficiente.
*/
.navegacao__item {
  border-radius: var(--raio-sm);
  color: var(--cor-texto-secundario);
}

.navegacao__item--ativo {
  color: var(--cor-marca-forte);
  background: var(--cor-marca-suave);
  border-inline-start: 3px solid var(--cor-marca);
  font-weight: var(--peso-medio);
}

.navegacao__aviso {
  margin: 0;
  padding: var(--espaco-md);
  border-top: 1px solid var(--cor-borda);
  color: var(--cor-texto-secundario);
  font-size: var(--fonte-xs);
  line-height: 1.5;
}

.area-principal {
  background: var(--cor-fundo-alternativo);
}
</style>
