<script setup lang="ts">
/**
 * Tipo da questao apresentado com icone e rotulo, nunca so por cor.
 * Usado na tabela, no cartao compacto e no dialogo de confirmacao.
 */
import { computed } from 'vue';
import { mdiFormatListBulletedSquare, mdiTextLong } from '@mdi/js';
import type { TipoQuestao } from '@sgp/shared-types';

const props = defineProps<{ tipo: TipoQuestao }>();

const apresentacao = computed(() =>
  props.tipo === 'objetiva'
    ? { rotulo: 'Objetiva', icone: mdiFormatListBulletedSquare }
    : { rotulo: 'Discursiva', icone: mdiTextLong },
);
</script>

<template>
  <v-chip
    class="badge"
    :class="`badge--${tipo}`"
    size="small"
    variant="flat"
    :prepend-icon="apresentacao.icone"
  >
    {{ apresentacao.rotulo }}
  </v-chip>
</template>

<style scoped>
.badge {
  font-size: var(--fonte-xs);
  font-weight: var(--peso-medio);
  border-radius: var(--raio-sm);
}

.badge--objetiva {
  background: var(--cor-marca-suave);
  color: var(--cor-marca-forte);
}

.badge--discursiva {
  background: var(--cor-informacao-suave);
  color: var(--cor-informacao);
}
</style>
