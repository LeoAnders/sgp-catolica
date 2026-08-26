<script setup lang="ts">
/**
 * Painel direito — tudo que é propriedade do bloco selecionado, e nada que seja
 * conteúdo.
 *
 * A regra de corte: se sai impresso na folha, edita-se na folha; se decide *como* a
 * folha se comporta, edita-se aqui. Por isso pontuação, altura do espaço e estilo
 * moram neste painel, enquanto texto de apoio e legenda ficam na folha. As ações
 * de mover, duplicar e excluir ficam sobre o bloco selecionado.
 *
 * Sem seleção, o painel mostra as propriedades da prova — é o estado de repouso,
 * não um vazio.
 */
import { computed, ref } from 'vue';
import { Save } from '@lucide/vue';
import type { Questao } from '@sgp/shared-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type {
  CabecalhoDaProva,
  CamposDoCabecalho,
  ModeloDeCabecalho,
} from '@/lib/cabecalhos-da-prova';
import { formatarPontos } from '@/lib/dominio';
import type {
  BlocoDaProva,
  BlocoDeEspaco,
  BlocoDeQuestao,
  BlocoDeTexto,
  EstiloDeTexto,
  FormatoDeResposta,
  TamanhoDeEspaco,
} from '@/lib/blocos-da-prova';
import { rotuloPorTipoDeBloco } from './icones-de-bloco';

const props = defineProps<{
  bloco: BlocoDaProva | null;
  questao?: Questao;
  numero?: number;
  posicao: number;
  total: number;
  totalDePontos: number;
  descricaoDaProva: string;
  cabecalho: CabecalhoDaProva;
  modelosDeCabecalho: ModeloDeCabecalho[];
  questaoEstaNoBanco?: boolean;
}>();

const emit = defineEmits<{
  'update:bloco': [bloco: BlocoDaProva];
  'update:descricao': [valor: string];
  'update:cabecalho': [cabecalho: CabecalhoDaProva];
  aplicarModelo: [modeloId: string];
  salvarModelo: [nome: string];
  salvarNoBanco: [];
}>();

const nomeDoModelo = ref('');

function atualizarCabecalho<K extends keyof Omit<CabecalhoDaProva, 'campos'>>(
  campo: K,
  valor: CabecalhoDaProva[K],
): void {
  emit('update:cabecalho', { ...props.cabecalho, campos: { ...props.cabecalho.campos }, [campo]: valor });
}

function atualizarCampo(campo: keyof CamposDoCabecalho, valor: boolean): void {
  emit('update:cabecalho', {
    ...props.cabecalho,
    campos: { ...props.cabecalho.campos, [campo]: valor },
  });
}

function salvarModelo(): void {
  if (!nomeDoModelo.value.trim()) return;
  emit('salvarModelo', nomeDoModelo.value.trim());
  nomeDoModelo.value = '';
}

const camposConfiguraveis: Array<{ campo: keyof CamposDoCabecalho; rotulo: string }> = [
  { campo: 'nome', rotulo: 'Nome' },
  { campo: 'matricula', rotulo: 'Matrícula' },
  { campo: 'turma', rotulo: 'Turma' },
  { campo: 'data', rotulo: 'Data' },
  { campo: 'nota', rotulo: 'Nota' },
];

const letrasDasAlternativas = ['A', 'B', 'C', 'D', 'E'];

const gabarito = computed(() => {
  const questao = props.questao;
  if (questao?.type !== 'objetiva' || !questao.alternatives) return null;
  const indice = questao.alternatives.findIndex(
    (alternativa) => alternativa.id === questao.correctAlternativeId,
  );
  if (indice < 0) return null;
  return { letra: letrasDasAlternativas[indice], texto: questao.alternatives[indice].text };
});

/** Descrição do tipo, já resolvida aqui para o template não precisar estreitar o tipo. */
const formatoDaQuestao = computed<FormatoDeResposta>(() => {
  if (props.bloco?.type !== 'questao') return 'objetiva';
  if (props.bloco.formatoResposta) return props.bloco.formatoResposta;
  return props.questao?.type === 'objetiva' ? 'objetiva' : 'longa';
});

const podeSalvarNoBanco = computed(() => {
  const questao = props.questao;
  if (!questao?.statement.trim()) return false;
  if (questao.type !== 'objetiva') return true;
  return Boolean(
    questao.correctAlternativeId
      && questao.alternatives
      && questao.alternatives.length >= 2
      && questao.alternatives.every((alternativa) => alternativa.text.trim()),
  );
});

function atualizarFormatoDaQuestao(formato: FormatoDeResposta): void {
  if (props.bloco?.type !== 'questao' || !props.questao) return;
  const atual = props.questao;
  const base = {
    id: atual.id,
    teacherId: atual.teacherId,
    statement: atual.statement,
    tags: [...atual.tags],
  };
  const rascunho: Questao = formato === 'objetiva'
    ? {
        ...base,
        type: 'objetiva',
        alternatives: atual.type === 'objetiva' && atual.alternatives?.length
          ? atual.alternatives.map((alternativa) => ({ ...alternativa }))
          : Array.from({ length: 4 }, (_, indice) => ({
              id: `${atual.id}-alternativa-${indice + 1}`,
              text: '',
            })),
        correctAlternativeId: atual.type === 'objetiva' ? atual.correctAlternativeId : undefined,
      }
    : {
        ...base,
        type: 'discursiva',
        maxScore: props.bloco.pontuacao,
      };
  emit('update:bloco', { ...props.bloco, formatoResposta: formato, rascunho });
}

const titulo = computed(() => {
  if (!props.bloco) return 'Cabeçalho da prova';
  if (props.bloco.type === 'questao') return `Questão ${props.numero}`;
  return rotuloPorTipoDeBloco[props.bloco.type];
});
</script>

<template>
  <aside
    aria-label="Propriedades"
    class="scrollbar-sutil flex w-full shrink-0 flex-col gap-4 rounded-xl border bg-card p-4 lg:w-80 lg:overflow-y-auto"
  >
    <p class="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
      {{ titulo }}
    </p>

    <!-- Sem bloco selecionado: propriedades da prova -->
    <template v-if="!bloco">
      <div v-if="modelosDeCabecalho.length" class="flex flex-col gap-1.5">
        <Label for="modelo-cabecalho">Usar modelo salvo</Label>
        <Select @update:model-value="emit('aplicarModelo', String($event))">
          <SelectTrigger id="modelo-cabecalho" class="w-full">
            <SelectValue placeholder="Escolher modelo…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="modelo in modelosDeCabecalho" :key="modelo.id" :value="modelo.id">
              {{ modelo.nome }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="instituicao-cabecalho">Instituição</Label>
        <Input
          id="instituicao-cabecalho"
          :model-value="cabecalho.instituicao"
          placeholder="Nome da instituição"
          @update:model-value="atualizarCabecalho('instituicao', String($event))"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="complemento-cabecalho">Curso, disciplina ou período</Label>
        <Input
          id="complemento-cabecalho"
          :model-value="cabecalho.linhaComplementar"
          placeholder="Ex.: Sistemas de Informação · 2026/2"
          @update:model-value="atualizarCabecalho('linhaComplementar', String($event))"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="professor-cabecalho">Professor(a)</Label>
        <Input
          id="professor-cabecalho"
          :model-value="cabecalho.professor"
          placeholder="Nome exibido na prova"
          @update:model-value="atualizarCabecalho('professor', String($event))"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="descricao-prova">Descrição</Label>
        <Textarea
          id="descricao-prova"
          class="min-h-20 text-sm"
          placeholder="Conteúdo, período ou instruções gerais…"
          :model-value="descricaoDaProva"
          @update:model-value="emit('update:descricao', String($event))"
        />
        <p class="text-xs text-muted-foreground">Sai impressa abaixo do título, na primeira página.</p>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="instrucoes-cabecalho">Instruções no cabeçalho</Label>
        <Textarea
          id="instrucoes-cabecalho"
          class="min-h-20"
          :model-value="cabecalho.instrucoes"
          placeholder="Ex.: use caneta azul ou preta e não rasure o cartão-resposta."
          @update:model-value="atualizarCabecalho('instrucoes', String($event))"
        />
      </div>

      <fieldset class="flex flex-col gap-3 border-t pt-4">
        <legend class="mb-1 text-sm font-medium">Campos de identificação</legend>

        <div v-for="item in camposConfiguraveis" :key="item.campo" class="flex items-center justify-between gap-4">
          <Label :for="`campo-${item.campo}`" class="font-normal">{{ item.rotulo }}</Label>
          <Switch
            :id="`campo-${item.campo}`"
            size="sm"
            :model-value="cabecalho.campos[item.campo]"
            @update:model-value="atualizarCampo(item.campo, Boolean($event))"
          />
        </div>
      </fieldset>

      <div class="flex flex-col gap-2 border-t pt-4">
        <Label for="nome-modelo">Salvar este cabeçalho como modelo</Label>
        <div class="flex gap-2">
          <Input
            id="nome-modelo"
            v-model="nomeDoModelo"
            placeholder="Ex.: Avaliação semestral"
            @keydown.enter.prevent="salvarModelo"
          />
          <Button variant="outline" :disabled="!nomeDoModelo.trim()" @click="salvarModelo">
            Salvar
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">O modelo fica disponível para outras provas neste navegador.</p>
      </div>

      <div class="flex items-center justify-between border-t pt-3 text-sm">
        <span class="text-muted-foreground">Total da prova</span>
        <span class="font-semibold tabular-nums">{{ formatarPontos(totalDePontos) }} pontos</span>
      </div>
    </template>

    <!-- Questão -->
    <template v-else-if="bloco.type === 'questao'">
      <div class="flex flex-col gap-1.5">
        <Label :for="`formato-${bloco.id}`">Tipo de resposta</Label>
        <Select
          :model-value="formatoDaQuestao"
          @update:model-value="atualizarFormatoDaQuestao($event as FormatoDeResposta)"
        >
          <SelectTrigger :id="`formato-${bloco.id}`" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="objetiva">Múltipla escolha</SelectItem>
            <SelectItem value="curta">Resposta curta</SelectItem>
            <SelectItem value="longa">Resposta longa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label :for="`pontos-${bloco.id}`">Pontuação</Label>
        <Input
          :id="`pontos-${bloco.id}`"
          type="number"
          min="0"
          step="0.5"
          name="pontuacao"
          autocomplete="off"
          :model-value="(bloco as BlocoDeQuestao).pontuacao"
          @update:model-value="emit('update:bloco', { ...(bloco as BlocoDeQuestao), pontuacao: Number($event) || 0 })"
        />
        <p class="text-xs text-muted-foreground">
          De {{ formatarPontos(totalDePontos) }} na prova. A soma não é validada (RF04).
        </p>
      </div>

      <div v-if="gabarito" class="flex flex-col gap-1.5">
        <span class="text-sm font-medium">Gabarito</span>
        <p class="text-sm text-muted-foreground">
          <span class="font-semibold text-primary">{{ gabarito.letra }}</span> — {{ gabarito.texto }}
        </p>
        <p class="text-xs text-muted-foreground">Não sai impresso na folha.</p>
      </div>

      <div v-if="questao?.tags.length" class="flex flex-col gap-1.5">
        <span class="text-sm font-medium">Tags</span>
        <div class="flex flex-wrap gap-1.5">
          <Badge v-for="tag in questao.tags" :key="tag" variant="secondary">{{ tag }}</Badge>
        </div>
      </div>

      <div class="flex flex-col gap-2 border-t pt-4">
        <Button
          variant="outline"
          :disabled="!podeSalvarNoBanco"
          @click="emit('salvarNoBanco')"
        >
          <Save aria-hidden="true" />
          {{ questaoEstaNoBanco ? 'Atualizar no banco' : 'Salvar no banco' }}
        </Button>
        <p class="text-xs leading-relaxed text-muted-foreground">
          <template v-if="podeSalvarNoBanco">
            Cria uma questão reutilizável neste navegador sem removê-la desta prova.
          </template>
          <template v-else-if="questao?.type === 'objetiva'">
            Preencha o enunciado, todas as alternativas e marque a correta.
          </template>
          <template v-else>Escreva o enunciado para salvar.</template>
        </p>
      </div>
    </template>

    <!-- Espaço para resposta -->
    <template v-else-if="bloco.type === 'espaco'">
      <div class="flex flex-col gap-1.5">
        <Label :for="`tamanho-${bloco.id}`">Altura do espaço</Label>
        <Select
          :model-value="(bloco as BlocoDeEspaco).tamanho"
          @update:model-value="emit('update:bloco', { ...(bloco as BlocoDeEspaco), tamanho: $event as TamanhoDeEspaco })"
        >
          <SelectTrigger :id="`tamanho-${bloco.id}`" class="w-full" aria-label="Altura do espaço">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pequeno">Pequeno — 5 linhas / 40 mm</SelectItem>
            <SelectItem value="medio">Médio — 8 linhas / 64 mm</SelectItem>
            <SelectItem value="grande">Grande — 12 linhas / 96 mm</SelectItem>
          </SelectContent>
        </Select>
        <p class="text-xs text-muted-foreground">As medidas representam o espaço ocupado no papel A4.</p>
      </div>
    </template>

    <template v-else-if="bloco.type === 'texto'">
      <div class="flex flex-col gap-1.5">
        <Label :for="`estilo-${bloco.id}`">Apresentação</Label>
        <Select
          :model-value="(bloco as BlocoDeTexto).estilo ?? 'paragrafo'"
          @update:model-value="emit('update:bloco', { ...(bloco as BlocoDeTexto), estilo: $event as EstiloDeTexto })"
        >
          <SelectTrigger :id="`estilo-${bloco.id}`" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragrafo">Parágrafo</SelectItem>
            <SelectItem value="instrucoes">Instrução</SelectItem>
            <SelectItem value="destaque">Aviso em destaque</SelectItem>
          </SelectContent>
        </Select>
        <p class="text-xs text-muted-foreground">O conteúdo continua sendo editado diretamente na folha.</p>
      </div>
    </template>

    <template v-else-if="bloco.type === 'titulo'">
      <p class="text-sm text-muted-foreground">
        Título e descrição são editados diretamente na folha. Este bloco organiza a leitura,
        mas não altera o embaralhamento da aplicação.
      </p>
    </template>

    <template v-else-if="bloco.type === 'imagem'">
      <p class="text-sm text-muted-foreground">
        A imagem e a legenda são editadas direto na folha, porque as duas saem impressas.
      </p>
    </template>

    <!-- Ações ficam sobre o bloco selecionado; o painel mantém apenas contexto. -->
    <div v-if="bloco" class="mt-auto flex flex-col gap-2 border-t pt-4">
      <p class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">Posição na folha</span>
        <span class="tabular-nums">{{ posicao }} de {{ total }}</span>
      </p>
      <p class="text-xs leading-relaxed text-muted-foreground">
        Mover, duplicar e excluir aparecem na barra do bloco selecionado.
      </p>
    </div>
  </aside>
</template>
