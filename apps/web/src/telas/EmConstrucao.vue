<script setup lang="ts">
/** Marcador honesto para as secoes que ainda nao foram construidas. */
import { useRoute } from 'vue-router';
import { Hammer } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const rota = useRoute();
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
    <h1 class="text-3xl font-bold tracking-tight">{{ rota.meta.titulo }}</h1>
    <Card class="mt-6">
      <CardContent class="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Hammer class="size-8 text-muted-foreground" aria-hidden="true" />
        <h2 class="text-lg font-semibold">Esta secao entra em uma proxima entrega</h2>
        <p class="max-w-sm text-sm text-muted-foreground">
          A navegacao ja mostra onde ela vai ficar. Por enquanto, o trabalho comeca pelas
          provas.
        </p>
        <Button as-child variant="outline" class="mt-1">
          <RouterLink to="/provas">Ir para Provas</RouterLink>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
