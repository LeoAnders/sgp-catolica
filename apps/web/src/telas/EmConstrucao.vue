<script setup lang="ts">
/**
 * Marcador honesto para as seções que ainda não foram construídas.
 *
 * Herda a casca e o cabeçalho de página da linguagem nova, então parece produto em
 * vez de erro — mas continua sem nenhum controle que finja funcionar. A frase de
 * cada seção diz o que vai existir ali, sem prometer data.
 */
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowRight, Hammer } from '@lucide/vue';
import { Button } from '@/components/ui/button';

const rota = useRoute();

const oQueVemAqui: Record<string, string> = {
  '/banco-de-questoes': 'Cadastrar, marcar e reaproveitar questões objetivas e discursivas entre provas (RF02).',
  '/turmas': 'Criar turmas e matricular estudantes por e-mail ou código de convite (RF03).',
  '/correcoes': 'Acompanhar a correção feita no aplicativo do professor e publicar gabaritos (RF07, RF08).',
  '/relatorios': 'Ver desempenho por turma, por questão e por alternativa marcada (RF10).',
};

const descricao = computed(
  () => oQueVemAqui[rota.path] ?? 'Esta seção entra em uma próxima entrega.',
);
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:p-8">
    <h1 class="text-[1.375rem] font-medium">{{ rota.meta.titulo }}</h1>

    <div class="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-20 text-center">
      <Hammer class="size-7 text-muted-foreground" aria-hidden="true" />
      <div>
        <p class="font-medium">Esta seção entra em uma próxima entrega</p>
        <p class="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{{ descricao }}</p>
      </div>
      <Button as-child variant="outline" size="sm" class="mt-1">
        <RouterLink to="/provas">
          Ir para Provas
          <ArrowRight aria-hidden="true" />
        </RouterLink>
      </Button>
    </div>
  </div>
</template>
