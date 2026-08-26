<script setup lang="ts">
/**
 * Banco de questões como painel lateral (RF02), no lugar do `Sheet` que cobria a
 * folha: assim o docente vê a prova crescer enquanto escolhe, e pode adicionar
 * várias questões em sequência sem fechar nada.
 *
 * Cada questão só entra uma vez por prova; depois de adicionada, a linha mostra que
 * já está na folha em vez de permitir duplicar.
 */
import { computed, ref } from 'vue';
import { CircleDashed, Plus, Search, X } from '@lucide/vue';
import type { Questao, TipoQuestao } from '@sgp/shared-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { normalizar } from '@/lib/dominio';
import { listarQuestoesDoBanco } from '@/lib/estado-de-questoes';

const props = defineProps<{
  idsJaNaProva: string[];
  /** Bloqueia a adição quando a prova atingiu o limite de RF04. */
  noLimite: boolean;
}>();

const emit = defineEmits<{
  adicionar: [questao: Questao];
  fechar: [];
}>();

const busca = ref('');
const tipoEscolhido = ref<TipoQuestao | 'todas'>('todas');

const questoesFiltradas = computed(() => {
  const termo = normalizar(busca.value.trim());
  return listarQuestoesDoBanco()
    .filter((questao) => !questao.deletedAt)
    .filter((questao) => {
      const correspondeABusca =
        termo === '' ||
        normalizar(questao.statement).includes(termo) ||
        questao.tags.some((tag) => normalizar(tag).includes(termo));
      const correspondeAoTipo = tipoEscolhido.value === 'todas' || questao.type === tipoEscolhido.value;
      return correspondeABusca && correspondeAoTipo;
    });
});

function jaEstaNaProva(questaoId: string): boolean {
  return props.idsJaNaProva.includes(questaoId);
}
</script>

<template>
  <aside
    aria-label="Banco de questões"
    class="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border bg-card lg:w-80"
  >
    <div class="flex items-center gap-2 border-b px-4 py-3">
      <p class="mr-auto text-sm font-medium">Banco de questões</p>
      <Button variant="ghost" size="icon-sm" aria-label="Fechar o banco de questões" @click="emit('fechar')">
        <X aria-hidden="true" />
      </Button>
    </div>

    <div class="flex flex-col gap-2 border-b p-3">
      <div class="relative">
        <Search
          class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          v-model="busca"
          class="pl-9"
          name="busca-questao"
          autocomplete="off"
          placeholder="Buscar por enunciado ou tag…"
          aria-label="Buscar por enunciado ou tag"
        />
      </div>
      <Select v-model="tipoEscolhido">
        <SelectTrigger size="sm" class="w-full" aria-label="Filtrar por tipo">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todos os tipos</SelectItem>
          <SelectItem value="objetiva">Objetiva</SelectItem>
          <SelectItem value="discursiva">Discursiva</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <p v-if="noLimite" class="border-b bg-secondary px-4 py-2.5 text-xs text-secondary-foreground">
      A prova atingiu o limite de 20 questões definido em RF04. Remova uma para adicionar outra.
    </p>

    <div class="scrollbar-sutil min-h-0 flex-1 overflow-y-auto p-3">
      <div v-if="questoesFiltradas.length === 0" class="flex flex-col items-center gap-2 py-12 text-center">
        <CircleDashed class="size-6 text-muted-foreground" aria-hidden="true" />
        <p class="text-sm text-muted-foreground">Nenhuma questão encontrada.</p>
      </div>

      <ul v-else class="flex flex-col gap-2">
        <li
          v-for="questao in questoesFiltradas"
          :key="questao.id"
          class="rounded-lg border p-3"
        >
          <div class="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">
              {{ questao.type === 'objetiva' ? 'Objetiva' : 'Discursiva' }}
            </Badge>
            <Badge v-for="tag in questao.tags" :key="tag" variant="secondary">{{ tag }}</Badge>
          </div>
          <p class="line-clamp-3 text-sm">{{ questao.statement }}</p>

          <Button
            v-if="!jaEstaNaProva(questao.id)"
            variant="outline"
            size="sm"
            class="mt-2 w-full"
            :disabled="noLimite"
            @click="emit('adicionar', questao)"
          >
            <Plus aria-hidden="true" />
            Adicionar à folha
          </Button>
          <p v-else class="mt-2 text-center text-xs text-muted-foreground">Já está na folha</p>
        </li>
      </ul>
    </div>
  </aside>
</template>
