<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  FilePlus2,
  Files,
  Plus,
  Search,
  X,
} from '@lucide/vue';
import { toast } from 'vue-sonner';
import { aplicacoesMock, provasMock, turmasMock, versoesMock } from '@sgp/mocks';
import type { Prova, StatusProva } from '@sgp/shared-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  formatarData,
  formatarPontos,
  normalizar,
  statusDaAplicacao,
  statusDaProva,
} from '@/lib/dominio';

interface AplicacaoNaTela {
  id: string;
  turma: string;
  disciplina: string;
  status: keyof typeof statusDaAplicacao;
  versoes: number;
}

interface ProvaNaTela extends Prova {
  totalDePontos: number;
  aplicacoes: AplicacaoNaTela[];
}

const rota = useRoute();
const roteador = useRouter();
const provas = ref<ProvaNaTela[]>([]);
const carregando = ref(true);
const busca = ref('');
const statusEscolhido = ref<StatusProva | 'todas'>('todas');
const novaProvaAberta = ref(false);
const detalhesAbertos = ref(false);
const provaSelecionada = ref<ProvaNaTela | null>(null);
const tituloNovo = ref('');
const descricaoNova = ref('');
const erroTitulo = ref('');
const inputTitulo = ref<InstanceType<typeof Input> | null>(null);

function montar(prova: Prova): ProvaNaTela {
  const aplicacoes = aplicacoesMock
    .filter((aplicacao) => aplicacao.examId === prova.id)
    .map((aplicacao) => {
      const turma = turmasMock.find((item) => item.id === aplicacao.classId);
      return {
        id: aplicacao.id,
        turma: turma?.name ?? 'Turma indisponível',
        disciplina: turma?.subject ?? '',
        status: aplicacao.status,
        versoes: versoesMock.filter((versao) => versao.applicationId === aplicacao.id).length,
      };
    });

  return {
    ...prova,
    totalDePontos: prova.questions.reduce((total, questao) => total + questao.score, 0),
    aplicacoes,
  };
}

onMounted(() => {
  window.setTimeout(() => {
    provas.value = provasMock.map(montar);
    carregando.value = false;
  }, 350);
});

watch(
  () => rota.query.nova,
  (nova) => {
    if (nova === '1') novaProvaAberta.value = true;
  },
  { immediate: true },
);

watch(novaProvaAberta, (aberta) => {
  if (!aberta && rota.query.nova === '1') {
    const query = { ...rota.query };
    delete query.nova;
    void roteador.replace({ query });
  }
});

const provasFiltradas = computed(() => {
  const termo = normalizar(busca.value.trim());
  return provas.value.filter((prova) => {
    const correspondeABusca =
      termo === '' ||
      normalizar(prova.title).includes(termo) ||
      normalizar(prova.description ?? '').includes(termo);
    const correspondeAoStatus =
      statusEscolhido.value === 'todas' || prova.status === statusEscolhido.value;
    return correspondeABusca && correspondeAoStatus;
  });
});

const temFiltros = computed(() => busca.value.trim() !== '' || statusEscolhido.value !== 'todas');
const provasProntas = computed(() => provas.value.filter((prova) => prova.status === 'ready').length);
const aplicacoesGeradas = computed(() =>
  provas.value.reduce((total, prova) => total + prova.aplicacoes.length, 0),
);

function varianteDoStatus(status: StatusProva): 'default' | 'secondary' | 'outline' {
  if (status === 'ready') return 'default';
  if (status === 'draft') return 'secondary';
  return 'outline';
}

function limparFiltros(): void {
  busca.value = '';
  statusEscolhido.value = 'todas';
}

function abrirDetalhes(prova: ProvaNaTela): void {
  provaSelecionada.value = prova;
  detalhesAbertos.value = true;
}

async function criarRascunho(): Promise<void> {
  const titulo = tituloNovo.value.trim();
  if (titulo.length < 3) {
    erroTitulo.value = 'Informe um título com pelo menos 3 caracteres.';
    await nextTick();
    const elemento = inputTitulo.value?.$el as HTMLInputElement | undefined;
    elemento?.focus();
    return;
  }

  provas.value.unshift({
    id: `prova-local-${Date.now()}`,
    teacherId: 'prof-1',
    title: titulo,
    description: descricaoNova.value.trim() || undefined,
    questions: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
    totalDePontos: 0,
    aplicacoes: [],
  });

  tituloNovo.value = '';
  descricaoNova.value = '';
  erroTitulo.value = '';
  novaProvaAberta.value = false;
  toast.success('Rascunho criado', { description: `“${titulo}” foi adicionado ao acervo.` });
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Provas</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Organize avaliações, acompanhe aplicações e consulte as versões geradas.
        </p>
      </div>

      <Dialog v-model:open="novaProvaAberta">
        <DialogTrigger as-child>
          <Button>
            <Plus aria-hidden="true" />
            Nova prova
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-lg">
          <form @submit.prevent="criarRascunho">
            <DialogHeader>
              <DialogTitle>Criar rascunho de prova</DialogTitle>
              <DialogDescription>
                Defina as informações iniciais. As questões serão adicionadas na próxima etapa.
              </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-5">
              <div class="grid gap-2">
                <Label for="titulo-prova">Título</Label>
                <Input
                  id="titulo-prova"
                  ref="inputTitulo"
                  v-model="tituloNovo"
                  name="titulo-prova"
                  autocomplete="off"
                  placeholder="Ex.: Avaliação 02 — Modelagem…"
                  :aria-invalid="erroTitulo ? 'true' : undefined"
                  aria-describedby="erro-titulo"
                  @update:model-value="erroTitulo = ''"
                />
                <p v-if="erroTitulo" id="erro-titulo" class="text-sm text-destructive">
                  {{ erroTitulo }}
                </p>
              </div>

              <div class="grid gap-2">
                <Label for="descricao-prova">
                  Descrição <span class="text-muted-foreground">(opcional)</span>
                </Label>
                <Textarea
                  id="descricao-prova"
                  v-model="descricaoNova"
                  name="descricao-prova"
                  autocomplete="off"
                  placeholder="Conteúdo, período ou orientação breve…"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" @click="novaProvaAberta = false">
                Cancelar
              </Button>
              <Button type="submit">Criar rascunho</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <section
      class="grid auto-rows-min gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t md:grid-cols-3"
      aria-label="Resumo das provas"
    >
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Provas no acervo</CardDescription>
          <Files class="size-4 text-muted-foreground" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <CardTitle class="text-2xl tabular-nums">{{ provas.length }}</CardTitle>
          <p class="mt-1 text-xs text-muted-foreground">Materiais criados pelo docente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Prontas para aplicar</CardDescription>
          <CheckCircle2 class="size-4 text-muted-foreground" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <CardTitle class="text-2xl tabular-nums">{{ provasProntas }}</CardTitle>
          <p class="mt-1 text-xs text-muted-foreground">Avaliações fechadas para edição</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Aplicações registradas</CardDescription>
          <ClipboardCheck class="size-4 text-muted-foreground" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <CardTitle class="text-2xl tabular-nums">{{ aplicacoesGeradas }}</CardTitle>
          <p class="mt-1 text-xs text-muted-foreground">Aplicações vinculadas às turmas</p>
        </CardContent>
      </Card>
    </section>

    <Card>
      <CardHeader class="gap-4">
        <div>
          <CardTitle>Acervo de provas</CardTitle>
          <CardDescription>{{ provasFiltradas.length }} de {{ provas.length }} provas</CardDescription>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div class="relative w-full sm:max-w-sm">
            <Search class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              v-model="busca"
              class="pl-8"
              name="busca-prova"
              autocomplete="off"
              placeholder="Buscar por título ou descrição…"
              aria-label="Buscar por título ou descrição"
            />
          </div>

          <div class="flex items-center gap-2">
            <Select v-model="statusEscolhido">
              <SelectTrigger class="w-40" aria-label="Filtrar por situação">
                <SelectValue placeholder="Situação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
                <SelectItem value="ready">Prontas</SelectItem>
                <SelectItem value="closed">Encerradas</SelectItem>
              </SelectContent>
            </Select>
            <Button v-if="temFiltros" variant="ghost" size="sm" @click="limparFiltros">
              <X aria-hidden="true" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div v-if="carregando" class="grid gap-3 p-4" role="status">
          <span class="sr-only">Carregando provas…</span>
          <div v-for="item in 3" :key="item" class="flex items-center gap-4 py-2">
            <Skeleton class="h-10 w-10 rounded-lg" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-4 w-2/3" />
              <Skeleton class="h-3 w-1/3" />
            </div>
            <Skeleton class="h-7 w-20" />
          </div>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Prova</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead class="text-right">Questões</TableHead>
              <TableHead class="text-right">Pontos</TableHead>
              <TableHead>Aplicações</TableHead>
              <TableHead>Criada em</TableHead>
              <TableHead><span class="sr-only">Ações</span></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableEmpty v-if="provasFiltradas.length === 0" :colspan="7">
              <div class="flex flex-col items-center gap-3 text-center">
                <CircleDashed class="size-7 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p class="font-medium">Nenhuma prova encontrada</p>
                  <p class="mt-1 text-sm text-muted-foreground">Revise a busca ou remova os filtros.</p>
                </div>
                <Button variant="outline" size="sm" @click="limparFiltros">Limpar filtros</Button>
              </div>
            </TableEmpty>

            <TableRow v-for="prova in provasFiltradas" v-else :key="prova.id">
              <TableCell class="min-w-72">
                <div class="flex items-start gap-3">
                  <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <FilePlus2 class="size-4" aria-hidden="true" />
                  </span>
                  <div class="min-w-0">
                    <p class="font-medium text-foreground">{{ prova.title }}</p>
                    <p class="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {{ prova.description || 'Sem descrição' }}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="varianteDoStatus(prova.status)">
                  {{ statusDaProva[prova.status].rotulo }}
                </Badge>
              </TableCell>
              <TableCell class="text-right tabular-nums">{{ prova.questions.length }}</TableCell>
              <TableCell class="text-right tabular-nums">{{ formatarPontos(prova.totalDePontos) }}</TableCell>
              <TableCell>
                <span v-if="prova.aplicacoes.length" class="tabular-nums">
                  {{ prova.aplicacoes.length }} {{ prova.aplicacoes.length === 1 ? 'turma' : 'turmas' }}
                </span>
                <span v-else class="text-muted-foreground">Nenhuma</span>
              </TableCell>
              <TableCell class="whitespace-nowrap text-muted-foreground">
                {{ formatarData(prova.createdAt) }}
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="sm" @click="abrirDetalhes(prova)">
                  Abrir
                  <ArrowRight aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>

  <Dialog v-model:open="detalhesAbertos">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ provaSelecionada?.title }}</DialogTitle>
        <DialogDescription>{{ provaSelecionada?.description || 'Sem descrição.' }}</DialogDescription>
      </DialogHeader>

      <div v-if="provaSelecionada" class="grid gap-5">
        <div class="grid grid-cols-3 gap-3">
          <Card>
            <CardContent class="p-3 text-center">
              <p class="text-xl font-semibold tabular-nums">{{ provaSelecionada.questions.length }}</p>
              <p class="text-xs text-muted-foreground">Questões</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-3 text-center">
              <p class="text-xl font-semibold tabular-nums">{{ formatarPontos(provaSelecionada.totalDePontos) }}</p>
              <p class="text-xs text-muted-foreground">Pontos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-3 text-center">
              <p class="text-xl font-semibold tabular-nums">{{ provaSelecionada.aplicacoes.length }}</p>
              <p class="text-xs text-muted-foreground">Aplicações</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 class="text-sm font-medium">Aplicações por turma</h3>
          <div v-if="provaSelecionada.aplicacoes.length" class="mt-2 divide-y rounded-lg border">
            <div
              v-for="aplicacao in provaSelecionada.aplicacoes"
              :key="aplicacao.id"
              class="flex items-center justify-between gap-4 p-3"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-medium">{{ aplicacao.turma }}</p>
                <p class="truncate text-xs text-muted-foreground">{{ aplicacao.disciplina }}</p>
              </div>
              <div class="shrink-0 text-right">
                <Badge variant="outline">{{ statusDaAplicacao[aplicacao.status].rotulo }}</Badge>
                <p class="mt-1 text-xs text-muted-foreground">
                  {{ aplicacao.versoes }} {{ aplicacao.versoes === 1 ? 'versão' : 'versões' }}
                </p>
              </div>
            </div>
          </div>
          <p v-else class="mt-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Esta prova ainda não foi aplicada em uma turma.
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
