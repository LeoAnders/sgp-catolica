<script setup lang="ts">
import { computed } from 'vue';
import type { CabecalhoDaProva } from '@/lib/cabecalhos-da-prova';
import { formatarPontos } from '@/lib/dominio';
import MarcadorQrCode from './MarcadorQrCode.vue';

const props = defineProps<{
  titulo: string;
  descricao?: string;
  totalDePontos: number;
  cabecalho: CabecalhoDaProva;
}>();

const camposAtivos = computed(() => {
  const rotulos: Record<keyof CabecalhoDaProva['campos'], string> = {
    nome: 'Nome',
    matricula: 'Matrícula',
    turma: 'Turma',
    data: 'Data',
    nota: 'Nota',
  };
  return (Object.keys(rotulos) as Array<keyof CabecalhoDaProva['campos']>)
    .filter((campo) => props.cabecalho.campos[campo])
    .map((campo) => ({ campo, rotulo: rotulos[campo] }));
});
</script>

<template>
  <header class="flex flex-col gap-4 border-b border-sheet-border pb-5">
    <div class="flex items-start justify-between gap-6">
      <div class="min-w-0 flex-1">
        <p
          v-if="cabecalho.instituicao"
          class="text-xs font-medium uppercase tracking-wide text-sheet-foreground/60"
        >
          {{ cabecalho.instituicao }}
        </p>
        <p v-if="cabecalho.linhaComplementar" class="mt-1 text-xs text-sheet-foreground/60">
          {{ cabecalho.linhaComplementar }}
        </p>
        <h1 class="mt-3 text-lg font-bold leading-tight">{{ titulo || 'Prova sem título' }}</h1>
        <p v-if="descricao" class="mt-1 text-sm text-sheet-foreground/70">{{ descricao }}</p>
        <p v-if="cabecalho.professor" class="mt-2 text-xs text-sheet-foreground/60">
          Professor(a): {{ cabecalho.professor }}
        </p>
        <p class="mt-1 text-xs text-sheet-foreground/60">
          {{ formatarPontos(totalDePontos) }} pontos
        </p>
      </div>

      <MarcadorQrCode />
    </div>

    <dl v-if="camposAtivos.length" class="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
      <div
        v-for="item in camposAtivos"
        :key="item.campo"
        class="flex min-w-0 items-end gap-2"
        :class="item.campo === 'nome' ? 'sm:col-span-2' : ''"
      >
        <dt class="shrink-0 text-sheet-foreground/60">{{ item.rotulo }}:</dt>
        <dd class="h-5 min-w-12 flex-1 border-b border-dotted border-sheet-border" />
      </div>
    </dl>

    <p
      v-if="cabecalho.instrucoes"
      class="border-t border-sheet-border pt-3 text-xs leading-relaxed text-sheet-foreground/70"
    >
      {{ cabecalho.instrucoes }}
    </p>
  </header>
</template>
