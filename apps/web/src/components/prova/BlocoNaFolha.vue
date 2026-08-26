<script setup lang="ts">
/**
 * Um bloco como ele sai no papel.
 *
 * A folha mostra e edita o conteúdo que será impresso: enunciado, alternativas,
 * título de seção, texto de apoio e legenda. Durante a autoria, a objetiva também
 * permite marcar a alternativa correta; o modo somente leitura volta a mostrá-la
 * como o aluno receberá, sem revelar o gabarito. Pontuação e tipo vivem no painel.
 *
 * A folha é papel, então usa os tokens `sheet` e não inverte no tema escuro; as
 * cores daqui são sempre as do papel.
 */
import { nextTick, ref } from 'vue';
import { ImageIcon, Plus, Trash2 } from '@lucide/vue';
import type { Questao } from '@sgp/shared-types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatarPontos } from '@/lib/dominio';
import type {
  BlocoDaProva,
  BlocoDeEspaco,
  BlocoDeImagem,
  BlocoDeQuestao,
  BlocoDeTitulo,
  BlocoDeTexto,
  EstiloDeTexto,
  TamanhoDeEspaco,
} from '@/lib/blocos-da-prova';

const props = defineProps<{
  bloco: BlocoDaProva;
  /** Só presente quando `bloco.type === 'questao'`. */
  questao?: Questao;
  /** Número impresso, quando o bloco é uma questão. */
  numero?: number;
  selecionado: boolean;
  somenteLeitura?: boolean;
}>();

const emit = defineEmits<{ 'update:bloco': [bloco: BlocoDaProva] }>();

const letrasDasAlternativas = ['A', 'B', 'C', 'D', 'E'];
const linhasPorTamanho: Record<TamanhoDeEspaco, number> = { pequeno: 5, medio: 8, grande: 12 };

const inputArquivo = ref<HTMLInputElement | null>(null);

function abrirSeletorDeArquivo(): void {
  inputArquivo.value?.click();
}

function onArquivoSelecionado(evento: Event): void {
  const arquivo = (evento.target as HTMLInputElement).files?.[0];
  if (!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = () => {
    emit('update:bloco', { ...(props.bloco as BlocoDeImagem), url: String(leitor.result) });
  };
  leitor.readAsDataURL(arquivo);
  (evento.target as HTMLInputElement).value = '';
}

const areaDeTexto = ref<InstanceType<typeof Textarea> | null>(null);

/** Foca o texto de apoio ao selecioná-lo, para o bloco já nascer editável. */
async function focarTexto(): Promise<void> {
  await nextTick();
  (areaDeTexto.value?.$el as HTMLTextAreaElement | undefined)?.focus();
}

defineExpose({ focarTexto });

function classeDoTexto(estilo: EstiloDeTexto | undefined): string {
  if (estilo === 'instrucoes') return 'border-l-2 border-sheet-border pl-3 italic';
  if (estilo === 'destaque') return 'rounded-sm border border-sheet-border bg-sheet-foreground/5 p-3';
  return '';
}

function atualizarQuestao(atualizada: Questao): void {
  if (props.bloco.type !== 'questao') return;
  emit('update:bloco', { ...props.bloco, rascunho: atualizada });
}

function atualizarEnunciado(valor: string): void {
  if (props.questao) atualizarQuestao({ ...props.questao, statement: valor });
}

function atualizarAlternativa(id: string, texto: string): void {
  if (props.questao?.type !== 'objetiva') return;
  atualizarQuestao({
    ...props.questao,
    alternatives: props.questao.alternatives?.map((alternativa) =>
      alternativa.id === id ? { ...alternativa, text: texto } : { ...alternativa },
    ),
  });
}

function marcarCorreta(id: string): void {
  if (props.questao?.type === 'objetiva') {
    atualizarQuestao({ ...props.questao, correctAlternativeId: id });
  }
}

function adicionarAlternativa(): void {
  if (props.questao?.type !== 'objetiva') return;
  const alternativas = props.questao.alternatives ?? [];
  if (alternativas.length >= 5) return;
  atualizarQuestao({
    ...props.questao,
    alternatives: [
      ...alternativas.map((alternativa) => ({ ...alternativa })),
      { id: `${props.questao.id}-alternativa-${Date.now()}`, text: '' },
    ],
  });
}

function removerAlternativa(id: string): void {
  if (props.questao?.type !== 'objetiva' || (props.questao.alternatives?.length ?? 0) <= 2) return;
  atualizarQuestao({
    ...props.questao,
    alternatives: props.questao.alternatives?.filter((alternativa) => alternativa.id !== id),
    correctAlternativeId: props.questao.correctAlternativeId === id
      ? undefined
      : props.questao.correctAlternativeId,
  });
}

function formatoDaResposta(): 'curta' | 'longa' {
  if (props.bloco.type !== 'questao') return 'curta';
  return props.bloco.formatoResposta === 'longa' ? 'longa' : 'curta';
}
</script>

<template>
  <div
    class="rounded-sm px-2 py-1.5 transition-shadow"
    :class="selecionado && !somenteLeitura ? 'ring-2 ring-primary ring-offset-2 ring-offset-sheet' : ''"
  >
    <!-- Questão completa: autoria na folha, propriedades no painel. -->
    <div v-if="bloco.type === 'questao'" class="flex gap-3">
      <span class="w-6 shrink-0 text-sm font-bold tabular-nums">{{ numero }}.</span>
      <div class="min-w-0 flex-1">
        <div v-if="questao" class="flex items-start gap-2">
          <p v-if="somenteLeitura" class="min-w-0 flex-1 text-sm leading-relaxed whitespace-pre-line">
            {{ questao.statement || 'Questão sem enunciado' }}
          </p>
          <Textarea
            v-else
            class="min-h-0 flex-1 resize-none border-none bg-transparent px-0 py-0 text-sm leading-relaxed text-sheet-foreground shadow-none placeholder:text-sheet-foreground/40 focus-visible:ring-0 md:text-sm dark:bg-transparent"
            placeholder="Escreva o enunciado da questão…"
            :model-value="questao.statement"
            :aria-label="`Enunciado da questão ${numero}`"
            @update:model-value="atualizarEnunciado(String($event))"
          />
          <span class="shrink-0 text-xs font-semibold text-sheet-foreground/60">
            ({{ formatarPontos((bloco as BlocoDeQuestao).pontuacao) }})
          </span>
        </div>
        <p v-else class="text-sm italic text-sheet-foreground/50">
          Questão não encontrada no banco.
        </p>

        <fieldset v-if="questao?.type === 'objetiva'" class="mt-3 flex flex-col gap-1.5">
          <legend v-if="!somenteLeitura" class="mb-1 text-xs font-medium text-sheet-foreground/60">
            Marque a alternativa correta
          </legend>
          <div
            v-for="(alternativa, indice) in questao.alternatives"
            :key="alternativa.id"
            class="group/alternativa flex min-w-0 items-center gap-2 text-sm leading-relaxed"
          >
            <template v-if="somenteLeitura">
              <span class="size-3.5 shrink-0 rounded-full border border-sheet-border" aria-hidden="true" />
              <span class="shrink-0 font-medium text-sheet-foreground/70">{{ letrasDasAlternativas[indice] }})</span>
              <span>{{ alternativa.text || 'Alternativa sem texto' }}</span>
            </template>
            <template v-else>
              <input
                type="radio"
                :name="`gabarito-${bloco.id}`"
                :checked="questao.correctAlternativeId === alternativa.id"
                :aria-label="`Marcar alternativa ${letrasDasAlternativas[indice]} como correta`"
                class="size-4 shrink-0 accent-current"
                @change="marcarCorreta(alternativa.id)"
              >
              <span class="shrink-0 font-medium text-sheet-foreground/70">{{ letrasDasAlternativas[indice] }})</span>
              <input
                class="min-w-0 flex-1 border-0 border-b border-sheet-border bg-transparent px-0 py-1 text-sm outline-none placeholder:text-sheet-foreground/35 focus:border-primary"
                :value="alternativa.text"
                :aria-label="`Texto da alternativa ${letrasDasAlternativas[indice]}`"
                placeholder="Escreva a alternativa"
                @input="atualizarAlternativa(alternativa.id, ($event.target as HTMLInputElement).value)"
              >
              <Button
                v-if="(questao.alternatives?.length ?? 0) > 2"
                variant="ghost"
                size="icon-xs"
                class="opacity-0 group-focus-within/alternativa:opacity-100 group-hover/alternativa:opacity-100"
                :aria-label="`Remover alternativa ${letrasDasAlternativas[indice]}`"
                @click.stop="removerAlternativa(alternativa.id)"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </template>
          </div>
          <Button
            v-if="!somenteLeitura && (questao.alternatives?.length ?? 0) < 5"
            variant="ghost"
            size="sm"
            class="mt-1 self-start"
            @click.stop="adicionarAlternativa"
          >
            <Plus aria-hidden="true" />
            Adicionar alternativa
          </Button>
        </fieldset>

        <div
          v-else-if="questao"
          class="area-de-resposta mt-3"
          :class="formatoDaResposta() === 'longa' ? 'area-de-resposta--longa' : 'area-de-resposta--curta'"
          aria-label="Espaço para resposta"
        >
          <span v-for="linha in formatoDaResposta() === 'longa' ? 8 : 4" :key="linha" class="linha-de-resposta" />
        </div>
      </div>
    </div>

    <!-- Título de seção: organização impressa, sem comportamento de embaralhamento. -->
    <div v-else-if="bloco.type === 'titulo'" class="border-b border-sheet-border pb-2">
      <template v-if="somenteLeitura">
        <h2 class="text-base font-semibold leading-tight">
          {{ (bloco as BlocoDeTitulo).titulo || 'Título da seção' }}
        </h2>
        <p v-if="(bloco as BlocoDeTitulo).descricao" class="mt-1 text-xs text-sheet-foreground/65">
          {{ (bloco as BlocoDeTitulo).descricao }}
        </p>
      </template>
      <input
        v-else
        class="w-full border-none bg-transparent p-0 text-base font-semibold leading-tight text-sheet-foreground outline-none placeholder:text-sheet-foreground/40 focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Título da seção"
        aria-label="Título da seção"
        :value="(bloco as BlocoDeTitulo).titulo"
        @input="emit('update:bloco', { ...(bloco as BlocoDeTitulo), titulo: ($event.target as HTMLInputElement).value })"
      >
      <input
        v-if="!somenteLeitura"
        class="mt-1 w-full border-none bg-transparent p-0 text-xs text-sheet-foreground/65 outline-none placeholder:text-sheet-foreground/35 focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Descrição opcional"
        aria-label="Descrição da seção"
        :value="(bloco as BlocoDeTitulo).descricao"
        @input="emit('update:bloco', { ...(bloco as BlocoDeTitulo), descricao: ($event.target as HTMLInputElement).value })"
      >
    </div>

    <!-- Texto de apoio -->
    <div v-else-if="bloco.type === 'texto'" :class="classeDoTexto((bloco as BlocoDeTexto).estilo)">
      <p v-if="somenteLeitura" class="text-sm leading-relaxed whitespace-pre-line">
        {{ (bloco as BlocoDeTexto).conteudo }}
      </p>
      <Textarea
        v-else
        ref="areaDeTexto"
        class="min-h-0 resize-none border-none bg-transparent px-0 py-0 text-sm leading-relaxed text-sheet-foreground shadow-none placeholder:text-sheet-foreground/40 focus-visible:ring-0 md:text-sm dark:bg-transparent"
        placeholder="Escreva uma instrução, epígrafe ou trecho de apoio…"
        :model-value="(bloco as BlocoDeTexto).conteudo"
        aria-label="Texto de apoio"
        @update:model-value="emit('update:bloco', { ...(bloco as BlocoDeTexto), conteudo: String($event) })"
      />
    </div>

    <!-- Imagem -->
    <figure
      v-else-if="bloco.type === 'imagem' && (!somenteLeitura || (bloco as BlocoDeImagem).url)"
      class="flex flex-col items-center gap-2"
    >
      <input ref="inputArquivo" type="file" accept="image/*" class="hidden" @change="onArquivoSelecionado">

      <button
        v-if="!(bloco as BlocoDeImagem).url && !somenteLeitura"
        type="button"
        class="flex w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-sheet-border py-10 text-sheet-foreground/50 transition-colors outline-none hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
        @click="abrirSeletorDeArquivo"
      >
        <ImageIcon class="size-6" aria-hidden="true" />
        <span class="text-sm font-medium">Escolher imagem</span>
      </button>

      <img
        v-else
        :src="(bloco as BlocoDeImagem).url"
        :alt="(bloco as BlocoDeImagem).legenda || 'Imagem da prova, sem legenda'"
        class="max-h-80 w-auto max-w-full object-contain"
      >

      <figcaption v-if="(bloco as BlocoDeImagem).url" class="w-full">
        <p v-if="somenteLeitura && (bloco as BlocoDeImagem).legenda" class="text-center text-xs text-sheet-foreground/70">
          {{ (bloco as BlocoDeImagem).legenda }}
        </p>
        <input
          v-else-if="!somenteLeitura"
          class="w-full border-none bg-transparent text-center text-xs text-sheet-foreground/70 outline-none placeholder:text-sheet-foreground/40 focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Legenda (opcional, sai impressa)"
          aria-label="Legenda da imagem"
          :value="(bloco as BlocoDeImagem).legenda"
          @input="emit('update:bloco', { ...(bloco as BlocoDeImagem), legenda: ($event.target as HTMLInputElement).value })"
        >
      </figcaption>
    </figure>

    <!-- Espaço para resposta -->
    <div
      v-else-if="bloco.type === 'espaco'"
      class="area-de-resposta"
      :class="`area-de-resposta--${(bloco as BlocoDeEspaco).tamanho}`"
      aria-hidden="true"
    >
      <span
        v-for="linha in linhasPorTamanho[(bloco as BlocoDeEspaco).tamanho]"
        :key="linha"
        class="linha-de-resposta"
      />
    </div>
  </div>
</template>

<style scoped>
.area-de-resposta {
  display: grid;
  grid-auto-rows: 1fr;
  padding-block: 1mm;
}

.area-de-resposta--pequeno,
.area-de-resposta--pequena {
  min-height: 40mm;
}

.area-de-resposta--curta {
  min-height: 28mm;
}

.area-de-resposta--longa {
  min-height: 64mm;
}

.area-de-resposta--medio {
  min-height: 64mm;
}

.area-de-resposta--grande {
  min-height: 96mm;
}

.linha-de-resposta {
  border-bottom: 1px solid var(--sheet-border);
}
</style>
