<script setup lang="ts">
/**
 * Modo de leitura imersivo da prova.
 *
 * Usa os mesmos renderizadores do editor para que a prévia não forme uma segunda
 * implementação da folha. O Dialog fornece foco contido e saída por Escape; visualmente,
 * porém, a experiência é um canvas em tela cheia com controles flutuantes, como em
 * ferramentas de criação.
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { Expand, Minus, Plus, X } from '@lucide/vue';
import type { Questao } from '@sgp/shared-types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { CabecalhoDaProva } from '@/lib/cabecalhos-da-prova';
import type { BlocoDaProva } from '@/lib/blocos-da-prova';
import BlocoNaFolha from './BlocoNaFolha.vue';
import CabecalhoNaFolha from './CabecalhoNaFolha.vue';

const props = defineProps<{
  aberto: boolean;
  titulo: string;
  descricao?: string;
  totalDePontos: number;
  cabecalho: CabecalhoDaProva;
  blocos: BlocoDaProva[];
  paginas: BlocoDaProva[][];
  numeracao: Record<string, number>;
  questaoPorBloco: (bloco: BlocoDaProva) => Questao | undefined;
}>();

const emit = defineEmits<{ 'update:aberto': [valor: boolean] }>();

const canvas = ref<HTMLElement | null>(null);
const escala = ref(1);
const ajustado = ref(true);
const percentual = computed(() => `${Math.round(escala.value * 100)}%`);
let observador: ResizeObserver | null = null;

function limitar(valor: number): number {
  return Math.min(1.4, Math.max(0.4, valor));
}

function alterarZoom(delta: number): void {
  ajustado.value = false;
  escala.value = limitar(Math.round((escala.value + delta) * 10) / 10);
}

function ajustarATela(): void {
  const elemento = canvas.value;
  if (!elemento) return;
  // 210 × 297 mm em 96 dpi. A folga mantém as barras flutuantes fora do papel.
  const larguraA4 = 210 * (96 / 25.4);
  const alturaA4 = 297 * (96 / 25.4);
  const pelaLargura = (elemento.clientWidth - 48) / larguraA4;
  const pelaAltura = (elemento.clientHeight - 112) / alturaA4;
  escala.value = limitar(Math.min(1, pelaLargura, pelaAltura));
  ajustado.value = true;
}

function fechar(): void {
  emit('update:aberto', false);
}

watch(
  () => props.aberto,
  async (aberto) => {
    if (!aberto) {
      observador?.disconnect();
      observador = null;
      return;
    }
    await nextTick();
    ajustarATela();
    observador?.disconnect();
    if (canvas.value) {
      observador = new ResizeObserver(() => {
        if (ajustado.value) ajustarATela();
      });
      observador.observe(canvas.value);
    }
  },
);

onBeforeUnmount(() => observador?.disconnect());
</script>

<template>
  <Dialog :open="aberto" @update:open="emit('update:aberto', $event)">
    <DialogContent
      :show-close-button="false"
      class="h-svh w-screen max-w-none gap-0 rounded-none border-0 bg-field p-0 ring-0 sm:max-w-none"
    >
      <DialogTitle class="sr-only"
        >Pré-visualização de {{ titulo || 'prova sem título' }}</DialogTitle
      >
      <DialogDescription class="sr-only">
        Visualização somente leitura da prova em uma folha A4.
      </DialogDescription>

      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3"
      >
        <div
          class="pointer-events-auto flex min-w-0 items-center gap-2 rounded-lg border bg-background/95 p-1 shadow-sm backdrop-blur-sm"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Sair da pré-visualização"
            @click="fechar"
          >
            <X aria-hidden="true" />
          </Button>
          <div class="min-w-0 border-l pl-3 pr-2">
            <p class="truncate text-sm font-medium">{{ titulo || 'Prova sem título' }}</p>
            <p class="text-xs text-muted-foreground">Pré-visualização</p>
          </div>
        </div>
      </div>

      <main
        ref="canvas"
        class="canvas-da-previa scrollbar-sutil h-svh overflow-auto px-6 pb-24 pt-20"
      >
        <div class="mx-auto flex w-fit flex-col gap-5" :style="{ zoom: escala }">
          <article
            v-for="(pagina, indiceDaPagina) in paginas"
            :key="`preview-pagina-${indiceDaPagina}`"
            class="folha-a4-preview relative flex flex-col gap-5 border border-sheet-border bg-sheet text-sheet-foreground shadow-sm"
          >
            <CabecalhoNaFolha
              v-if="indiceDaPagina === 0"
              :titulo="titulo"
              :descricao="descricao"
              :total-de-pontos="totalDePontos"
              :cabecalho="cabecalho"
            />

            <p
              v-if="blocos.length === 0 && indiceDaPagina === 0"
              class="py-10 text-center text-sm text-sheet-foreground/50"
            >
              A folha está em branco.
            </p>

            <BlocoNaFolha
              v-for="bloco in pagina"
              :key="bloco.id"
              :bloco="bloco"
              :questao="questaoPorBloco(bloco)"
              :numero="numeracao[bloco.id]"
              :selecionado="false"
              somente-leitura
            />

            <span class="numero-da-pagina" aria-label="Página">
              {{ indiceDaPagina + 1 }} / {{ paginas.length }}
            </span>
          </article>
        </div>
      </main>

      <div class="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4">
        <div
          class="pointer-events-auto flex items-center gap-1 rounded-lg border bg-background/95 p-1 shadow-sm backdrop-blur-sm"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            :disabled="escala <= 0.4"
            aria-label="Reduzir zoom"
            @click="alterarZoom(-0.1)"
          >
            <Minus aria-hidden="true" />
          </Button>
          <span class="w-12 text-center text-xs font-medium tabular-nums">{{ percentual }}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            :disabled="escala >= 1.4"
            aria-label="Aumentar zoom"
            @click="alterarZoom(0.1)"
          >
            <Plus aria-hidden="true" />
          </Button>
          <span class="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <Button
            variant="ghost"
            size="sm"
            :aria-pressed="ajustado"
            aria-label="Ajustar página à tela"
            @click="ajustarATela"
          >
            <Expand aria-hidden="true" />
            Ajustar
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.canvas-da-previa {
  background-image: radial-gradient(
    color-mix(in srgb, var(--border) 75%, transparent) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}

.folha-a4-preview {
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  padding: 16mm;
}

.numero-da-pagina {
  position: absolute;
  right: 16mm;
  bottom: 6mm;
  color: color-mix(in oklab, var(--sheet-foreground) 48%, transparent);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}
</style>
