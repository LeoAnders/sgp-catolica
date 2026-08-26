<script setup lang="ts">
/**
 * Trilha de estrutura — a prova inteira em um olhar.
 *
 * A estrutura espelha as folhas calculadas. Cada grupo “Página N” lista os blocos
 * daquela página; clicar seleciona e rola a folha até ele.
 * Reordenar é por teclado e por clique (setas), não só por arrastar: gesto de
 * arrastar sempre precisa de equivalente acessível, e aqui o equivalente é a
 * própria forma primária.
 *
 * O cabeçalho aparece no grupo da primeira página, sem número, porque não é conteúdo
 * que o docente reordena — ele é a moldura impressa da folha.
 */
import { ChevronDown, ChevronUp, FileText } from '@lucide/vue';
import type { Questao } from '@sgp/shared-types';
import { Button } from '@/components/ui/button';
import type { BlocoDaProva } from '@/lib/blocos-da-prova';
import { iconePorTipoDeBloco, rotuloPorTipoDeBloco } from './icones-de-bloco';

const props = defineProps<{
  blocos: BlocoDaProva[];
  paginas: BlocoDaProva[][];
  numeracao: Record<string, number>;
  selecionado: string | null;
  questaoPorBloco: (bloco: BlocoDaProva) => Questao | undefined;
}>();

defineEmits<{
  selecionar: [id: string | null];
  mover: [indice: number, direcao: 'cima' | 'baixo'];
}>();

/** Resumo de uma linha da trilha: o suficiente para reconhecer o bloco. */
function resumo(bloco: BlocoDaProva): string {
  switch (bloco.type) {
    case 'questao':
      return props.questaoPorBloco(bloco)?.statement ?? 'Questão indisponível';
    case 'titulo':
      return bloco.titulo.trim() || 'Título de seção vazio';
    case 'texto':
      return bloco.conteudo.trim() || 'Texto de apoio vazio';
    case 'imagem':
      return bloco.legenda.trim() || (bloco.url ? 'Imagem sem legenda' : 'Imagem não escolhida');
    case 'espaco':
      return `Espaço ${bloco.tamanho}`;
  }
}

function indiceDoBloco(blocoId: string): number {
  return props.blocos.findIndex((bloco) => bloco.id === blocoId);
}

function totalDeItens(pagina: BlocoDaProva[], indiceDaPagina: number): number {
  return pagina.length + (indiceDaPagina === 0 ? 1 : 0);
}
</script>

<template>
  <nav
    aria-label="Estrutura da prova"
    class="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border bg-card lg:w-60"
  >
    <p
      class="px-4 pb-2 pt-3 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground"
    >
      Estrutura
    </p>

    <div class="scrollbar-sutil min-h-0 flex-1 overflow-y-auto px-2 pb-2">
      <section
        v-for="(pagina, indiceDaPagina) in paginas"
        :key="`estrutura-pagina-${indiceDaPagina}`"
        class="pb-3 last:pb-0"
        :class="indiceDaPagina > 0 ? 'border-t pt-2' : ''"
        :aria-label="`Página ${indiceDaPagina + 1}`"
      >
        <div
          class="flex h-7 items-center gap-2 px-2 text-[0.6875rem] font-medium text-muted-foreground"
        >
          <FileText class="size-3.5" aria-hidden="true" />
          <span>Página {{ indiceDaPagina + 1 }}</span>
          <span class="ml-auto tabular-nums">
            {{ totalDeItens(pagina, indiceDaPagina) }}
            {{ totalDeItens(pagina, indiceDaPagina) === 1 ? 'item' : 'itens' }}
          </span>
        </div>

        <button
          v-if="indiceDaPagina === 0"
          type="button"
          :aria-pressed="selecionado === null"
          class="mb-0.5 flex w-full items-center gap-2.5 rounded-lg border border-dashed px-2.5 py-2 text-left text-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          :class="
            selecionado === null
              ? 'border-primary/50 bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          "
          @click="$emit('selecionar', null)"
        >
          <span class="w-4 shrink-0 text-center">—</span>
          <span class="truncate">Cabeçalho da prova</span>
        </button>

        <ul class="flex flex-col gap-0.5">
          <li v-for="bloco in pagina" :key="bloco.id" class="group/linha relative">
            <button
              type="button"
              :aria-pressed="selecionado === bloco.id"
              class="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              :class="
                selecionado === bloco.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              "
              @click="$emit('selecionar', bloco.id)"
            >
              <span
                class="mt-px w-4 shrink-0 text-center text-xs font-semibold tabular-nums"
                :class="selecionado === bloco.id ? 'text-primary' : 'text-muted-foreground'"
              >
                <template v-if="numeracao[bloco.id]">{{ numeracao[bloco.id] }}</template>
                <component
                  :is="iconePorTipoDeBloco[bloco.type]"
                  v-else
                  class="size-3.5"
                  aria-hidden="true"
                />
              </span>
              <span class="min-w-0 flex-1">
                <span class="line-clamp-2 text-xs leading-snug">{{ resumo(bloco) }}</span>
                <span
                  v-if="!numeracao[bloco.id]"
                  class="mt-0.5 block text-[0.65rem] text-muted-foreground"
                >
                  {{ rotuloPorTipoDeBloco[bloco.type] }}
                </span>
              </span>
            </button>

            <span
              class="absolute right-1 top-1 hidden gap-0.5 group-focus-within/linha:flex group-hover/linha:flex"
            >
              <Button
                variant="ghost"
                size="icon-xs"
                class="bg-background/90"
                :disabled="indiceDoBloco(bloco.id) === 0"
                :aria-label="`Mover ${rotuloPorTipoDeBloco[bloco.type]} para cima`"
                @click="$emit('mover', indiceDoBloco(bloco.id), 'cima')"
              >
                <ChevronUp aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                class="bg-background/90"
                :disabled="indiceDoBloco(bloco.id) === blocos.length - 1"
                :aria-label="`Mover ${rotuloPorTipoDeBloco[bloco.type]} para baixo`"
                @click="$emit('mover', indiceDoBloco(bloco.id), 'baixo')"
              >
                <ChevronDown aria-hidden="true" />
              </Button>
            </span>
          </li>
        </ul>
      </section>
    </div>
  </nav>
</template>
