<script setup lang="ts">
/** Seletor de autoria: questões primeiro; apoios impressos em segundo plano. */
import {
  AlignLeft,
  FileText,
  Heading2,
  Image,
  ListChecks,
  Plus,
  TextCursorInput,
  X,
} from '@lucide/vue';
import { Button } from '@/components/ui/button';
import type { TipoDeInsercao } from '@/lib/blocos-da-prova';

const emit = defineEmits<{
  adicionar: [tipo: TipoDeInsercao];
  fechar: [];
}>();

const grupos: Array<{
  rotulo: string;
  descricao: string;
  itens: Array<{
    tipo: TipoDeInsercao;
    rotulo: string;
    descricao: string;
    icone: typeof FileText;
  }>;
}> = [
  {
    rotulo: 'Questões',
    descricao: 'Cada opção cria uma questão completa e numerada.',
    itens: [
      {
        tipo: 'questao-objetiva',
        rotulo: 'Múltipla escolha',
        descricao: 'Enunciado, alternativas e seleção da resposta correta.',
        icone: ListChecks,
      },
      {
        tipo: 'questao-curta',
        rotulo: 'Resposta curta',
        descricao: 'Enunciado com espaço compacto para resposta escrita.',
        icone: TextCursorInput,
      },
      {
        tipo: 'questao-longa',
        rotulo: 'Resposta longa',
        descricao: 'Enunciado com área pautada para desenvolvimento.',
        icone: AlignLeft,
      },
    ],
  },
  {
    rotulo: 'Apoio',
    descricao: 'Não recebe número nem pontuação.',
    itens: [
      {
        tipo: 'titulo',
        rotulo: 'Título de seção',
        descricao: 'Organiza assuntos ou partes da prova.',
        icone: Heading2,
      },
      {
        tipo: 'texto',
        rotulo: 'Texto ou instrução',
        descricao: 'Contexto, orientação ou texto-base.',
        icone: FileText,
      },
      {
        tipo: 'imagem',
        rotulo: 'Imagem',
        descricao: 'Figura, gráfico ou mapa de apoio.',
        icone: Image,
      },
    ],
  },
];
</script>

<template>
  <aside
    aria-label="Adicionar à prova"
    class="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border bg-card lg:w-80"
  >
    <div class="flex items-center gap-2 border-b px-4 py-3">
      <div class="mr-auto">
        <p class="text-sm font-medium">Adicionar à prova</p>
        <p class="mt-0.5 text-xs text-muted-foreground">Crie uma questão ou insira um apoio.</p>
      </div>
      <Button variant="ghost" size="icon-sm" aria-label="Fechar opções" @click="emit('fechar')">
        <X aria-hidden="true" />
      </Button>
    </div>

    <div class="scrollbar-sutil min-h-0 flex-1 overflow-y-auto p-3">
      <section v-for="grupo in grupos" :key="grupo.rotulo" class="mb-5 last:mb-0">
        <div class="mb-2 px-1">
          <h2 class="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
            {{ grupo.rotulo }}
          </h2>
          <p class="mt-0.5 text-xs text-muted-foreground">{{ grupo.descricao }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <button
            v-for="item in grupo.itens"
            :key="item.tipo"
            type="button"
            class="group flex w-full items-start gap-3 rounded-lg border bg-background p-3 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/40"
            @click="emit('adicionar', item.tipo)"
          >
            <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <component :is="item.icone" class="size-4" aria-hidden="true" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium">{{ item.rotulo }}</span>
              <span class="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                {{ item.descricao }}
              </span>
            </span>
            <Plus class="mt-1 size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  </aside>
</template>
