<script setup lang="ts">
/**
 * Acervo de turmas — mesmo padrão de seção de `Provas.vue`: painel esquerdo com ação
 * principal, busca e recorte por situação; conteúdo em lista de cartões clicáveis, já
 * que aqui a linha é o objeto que se abre (o detalhe da turma), não um registro
 * comparado coluna a coluna.
 */
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { BookOpen, ChevronRight, CircleDashed, Plus, Search } from '@lucide/vue';
import type { StatusTurma } from '@sgp/shared-types';
import PainelDaSecao from '@/components/casca/PainelDaSecao.vue';
import ItemDeRecorte from '@/components/casca/ItemDeRecorte.vue';
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
import { Skeleton } from '@/components/ui/skeleton';
import { normalizar, statusDaTurma, varianteDoStatusDaTurma } from '@/lib/dominio';
import { criarTurma, listarMatriculasDaTurma, listarTurmas } from '@/lib/estado-de-turmas';

const roteador = useRouter();
const carregando = ref(true);
const busca = ref('');
const recorte = ref<StatusTurma | 'todas'>('todas');
const ordem = ref<'recentes' | 'nome'>('recentes');

const turmas = computed(() => listarTurmas());

onMounted(() => {
  window.setTimeout(() => {
    carregando.value = false;
  }, 350);
});

/** Contagem por recorte: substitui os cartões de métrica, como em `Provas.vue`. */
const totalPorStatus = computed<Record<StatusTurma | 'todas', number>>(() => ({
  todas: turmas.value.length,
  active: turmas.value.filter((turma) => turma.status === 'active').length,
  archived: turmas.value.filter((turma) => turma.status === 'archived').length,
}));

const totalDeAlunosMatriculados = computed(() =>
  turmas.value.reduce((total, turma) => total + listarMatriculasDaTurma(turma.id).length, 0),
);

const turmasFiltradas = computed(() => {
  const termo = normalizar(busca.value.trim());
  const lista = turmas.value.filter((turma) => {
    const correspondeABusca =
      termo === '' ||
      normalizar(turma.name).includes(termo) ||
      normalizar(turma.subject).includes(termo);
    const correspondeAoRecorte = recorte.value === 'todas' || turma.status === recorte.value;
    return correspondeABusca && correspondeAoRecorte;
  });

  return [...lista].sort((a, b) =>
    ordem.value === 'nome'
      ? (a.name || 'Turma sem nome').localeCompare(b.name || 'Turma sem nome', 'pt-BR')
      : b.createdAt.localeCompare(a.createdAt),
  );
});

const temFiltros = computed(() => busca.value.trim() !== '' || recorte.value !== 'todas');

function limparFiltros(): void {
  busca.value = '';
  recorte.value = 'todas';
}

async function criarENavegar(): Promise<void> {
  const turma = criarTurma();
  await roteador.push(`/turmas/${turma.id}`);
}

/** Grade única para o cabeçalho de colunas e para os cartões, como em `Provas.vue`. */
const GRADE =
  'grid grid-cols-[2.5rem_minmax(0,1fr)_1.25rem] items-center gap-4 ' +
  'lg:grid-cols-[2.5rem_minmax(0,1fr)_6rem_7.5rem_6.5rem_5rem_1.25rem]';

const recortes = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'active', rotulo: statusDaTurma.active.rotulo },
  { valor: 'archived', rotulo: statusDaTurma.archived.rotulo },
] as const;
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
    <PainelDaSecao>
      <template #acao>
        <Button class="w-full" @click="criarENavegar">
          <Plus aria-hidden="true" />
          Nova turma
        </Button>
      </template>

      <template #busca>
        <div class="relative">
          <Search
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            v-model="busca"
            class="border-none bg-transparent pl-9 shadow-none focus-visible:ring-0 dark:bg-transparent"
            name="busca-turma"
            autocomplete="off"
            placeholder="Buscar…"
            aria-label="Buscar por nome ou disciplina"
          />
        </div>
      </template>

      <p
        class="px-2.5 pb-1 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground"
      >
        Situação
      </p>
      <ItemDeRecorte
        v-for="item in recortes"
        :key="item.valor"
        :rotulo="item.rotulo"
        :total="totalPorStatus[item.valor]"
        :ativo="recorte === item.valor"
        @selecionar="recorte = item.valor"
      />

      <template #rodape>
        <p class="flex items-center justify-between px-2.5 text-xs text-muted-foreground">
          <span>Alunos matriculados</span>
          <span class="tabular-nums">{{ totalDeAlunosMatriculados }}</span>
        </p>
      </template>
    </PainelDaSecao>

    <div class="flex min-w-0 flex-1 flex-col bg-field">
      <div class="flex flex-wrap items-center gap-3 px-5 pb-6 pt-7 sm:px-8 sm:pt-8">
        <div class="mr-auto min-w-0">
          <h1 class="text-[1.375rem] font-medium leading-tight">Turmas</h1>
          <p class="mt-1 text-sm text-muted-foreground">Turmas criadas e suas matrículas.</p>
        </div>

        <Select v-model="ordem">
          <SelectTrigger size="sm" class="w-44" aria-label="Ordenar o acervo">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais recentes</SelectItem>
            <SelectItem value="nome">Nome (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div v-if="carregando" class="flex flex-col gap-2 px-5 pb-6 sm:px-8" role="status">
        <span class="sr-only">Carregando turmas…</span>
        <div
          v-for="item in 3"
          :key="item"
          class="flex items-center gap-4 rounded-xl border bg-card px-4 py-3"
        >
          <Skeleton class="size-10 rounded-lg" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-1/2" />
            <Skeleton class="h-3 w-1/4" />
          </div>
          <Skeleton class="h-6 w-20 rounded-4xl" />
        </div>
      </div>

      <div
        v-else-if="turmasFiltradas.length === 0"
        class="mx-5 mb-6 flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card px-6 py-20 text-center sm:mx-8"
      >
        <CircleDashed class="size-7 text-muted-foreground" aria-hidden="true" />
        <div>
          <p class="font-medium">Nenhuma turma encontrada</p>
          <p class="mt-1 text-sm text-muted-foreground">
            {{
              temFiltros
                ? 'Revise a busca ou remova os filtros.'
                : 'Crie a primeira turma para começar a matricular alunos.'
            }}
          </p>
        </div>
        <Button v-if="temFiltros" variant="outline" size="sm" @click="limparFiltros">
          Limpar filtros
        </Button>
        <Button v-else size="sm" @click="criarENavegar">
          <Plus aria-hidden="true" />
          Nova turma
        </Button>
      </div>

      <template v-else>
        <div class="px-5 pb-6 sm:px-8">
          <div :class="GRADE" class="px-4 pb-2 text-xs font-normal text-muted-foreground">
            <span aria-hidden="true" />
            <span>Turma</span>
            <span class="hidden text-right lg:block">Período</span>
            <span class="hidden text-right lg:block">Convite</span>
            <span class="hidden text-right lg:block">Situação</span>
            <span class="hidden text-right lg:block">Alunos</span>
            <span class="hidden lg:block" aria-hidden="true" />
          </div>

          <ul class="flex flex-col gap-2">
            <li
              v-for="turma in turmasFiltradas"
              :key="turma.id"
              :class="GRADE"
              class="group relative rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-accent/40 focus-within:bg-accent/40"
            >
              <span
                class="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
              >
                <BookOpen class="size-5" aria-hidden="true" />
              </span>

              <div class="min-w-0">
                <RouterLink
                  :to="`/turmas/${turma.id}`"
                  class="font-medium outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
                >
                  {{ turma.name || 'Turma sem nome' }}
                </RouterLink>
                <p class="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                  {{ turma.subject || 'Sem disciplina' }}
                </p>
              </div>

              <span class="hidden text-right text-sm text-muted-foreground lg:block">
                {{ turma.term || '—' }}
              </span>
              <span
                class="hidden whitespace-nowrap text-right font-mono text-xs text-muted-foreground lg:block"
              >
                {{ turma.inviteCode }}
              </span>

              <div class="hidden justify-end lg:flex">
                <Badge :variant="varianteDoStatusDaTurma(turma.status)">
                  {{ statusDaTurma[turma.status].rotulo }}
                </Badge>
              </div>

              <span class="hidden text-right text-sm tabular-nums text-muted-foreground lg:block">
                {{ listarMatriculasDaTurma(turma.id).length }}
              </span>

              <ChevronRight
                class="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>
