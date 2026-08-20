<script setup lang="ts">
/**
 * Banco de questoes do professor.
 *
 * Spike da N1: tela navegavel com dado estatico de `@sgp/mocks`. Nao ha rede,
 * persistencia nem roteador; busca, filtros e exclusao vivem no estado local.
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import {
  mdiFilterRemoveOutline,
  mdiMagnify,
  mdiPencilOutline,
  mdiPlus,
  mdiTrashCanOutline,
} from '@mdi/js';
import { questoesMock } from '@sgp/mocks';
import type { Questao, TipoQuestao } from '@sgp/shared-types';
import BadgeTipoQuestao from '../components/BadgeTipoQuestao.vue';

const { mdAndUp } = useDisplay();

const questoes = ref<Questao[]>([]);
const carregando = ref(true);

// N1: estado simulado; ponto de integracao com a API em fase futura.
onMounted(() => {
  window.setTimeout(() => {
    questoes.value = questoesMock.filter((questao) => !questao.deletedAt);
    carregando.value = false;
  }, 450);
});

const busca = ref<string | null>('');
const tipoSelecionado = ref<TipoQuestao | null>(null);
const tagSelecionada = ref<string | null>(null);

const tiposDisponiveis = [
  { title: 'Objetiva', value: 'objetiva' },
  { title: 'Discursiva', value: 'discursiva' },
];

const tagsDisponiveis = computed(() =>
  [...new Set(questoes.value.flatMap((questao) => questao.tags))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  ),
);

/** Compara ignorando caixa e acentuacao, para a busca nao depender da digitacao. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR');
}

const questoesFiltradas = computed(() => {
  const termo = normalizar((busca.value ?? '').trim());

  return questoes.value.filter((questao) => {
    const casaBusca = termo === '' || normalizar(questao.statement).includes(termo);
    const casaTipo = tipoSelecionado.value === null || questao.type === tipoSelecionado.value;
    const casaTag = tagSelecionada.value === null || questao.tags.includes(tagSelecionada.value);
    return casaBusca && casaTipo && casaTag;
  });
});

const temFiltros = computed(
  () =>
    (busca.value ?? '') !== '' || tipoSelecionado.value !== null || tagSelecionada.value !== null,
);

const contagem = computed(() => {
  const exibidas = questoesFiltradas.value.length;
  const total = questoes.value.length;
  const plural = total === 1 ? 'questao' : 'questoes';
  return temFiltros.value
    ? `${exibidas} de ${total} ${plural}`
    : `${total} ${plural} no banco`;
});

function limparFiltros(): void {
  busca.value = '';
  tipoSelecionado.value = null;
  tagSelecionada.value = null;
}

/** O identificador do mock (`q-1`) vira o codigo de catalogo exibido (`Q-1`). */
function codigo(questao: Questao): string {
  return questao.id.toUpperCase();
}

function composicao(questao: Questao): string {
  if (questao.type === 'objetiva') {
    const total = questao.alternatives?.length ?? 0;
    return `${total} ${total === 1 ? 'alternativa' : 'alternativas'}`;
  }
  const pontos = questao.maxScore;
  if (pontos === undefined) return 'Pontuacao nao definida';
  return `${pontos} ${pontos === 1 ? 'ponto' : 'pontos'}`;
}

/*
  O Vuetify so devolve o foco sozinho quando o dialogo e aberto pelo slot de
  ativador. Como estes sao abertos pelos botoes de cada linha, o retorno do foco
  fica por conta da tela.
*/
let acionador: HTMLElement | null = null;

function guardarAcionador(evento: Event): void {
  acionador = evento.currentTarget as HTMLElement | null;
}

const questaoParaExcluir = ref<Questao | null>(null);
const demonstracao = ref<{ titulo: string; texto: string } | null>(null);

const dialogoAberto = computed(
  () => questaoParaExcluir.value !== null || demonstracao.value !== null,
);

watch(dialogoAberto, async (aberto) => {
  if (aberto) return;
  await nextTick();
  acionador?.focus();
  acionador = null;
});

function pedirExclusao(questao: Questao, evento: Event): void {
  guardarAcionador(evento);
  questaoParaExcluir.value = questao;
}

const avisoAberto = ref(false);
const aviso = ref('');

async function confirmarExclusao(): Promise<void> {
  const alvo = questaoParaExcluir.value;
  if (!alvo) return;

  const posicao = questoesFiltradas.value.findIndex((questao) => questao.id === alvo.id);

  // N1: exclusao simulada apenas no estado local, sem persistencia.
  questoes.value = questoes.value.filter((questao) => questao.id !== alvo.id);
  aviso.value = `Questao ${codigo(alvo)} excluida nesta demonstracao.`;
  avisoAberto.value = true;

  // O acionador sai do DOM com a linha, entao o foco e reposicionado aqui.
  acionador = null;
  questaoParaExcluir.value = null;
  await nextTick();

  const restantes = questoesFiltradas.value;
  const vizinha = restantes[posicao] ?? restantes[restantes.length - 1];
  const seletor = vizinha ? `[data-excluir="${vizinha.id}"]` : '[data-nova-questao]';
  document.querySelector<HTMLElement>(seletor)?.focus();
}

function abrirDemonstracao(titulo: string, texto: string, evento: Event): void {
  guardarAcionador(evento);
  demonstracao.value = { titulo, texto };
}

function editar(questao: Questao, evento: Event): void {
  abrirDemonstracao(
    `Editar a questao ${codigo(questao)}`,
    'O formulario de edicao entra em uma fase seguinte. Nesta demonstracao da N1 a tela mostra apenas o ponto de entrada.',
    evento,
  );
}

function criar(evento: Event): void {
  abrirDemonstracao(
    'Nova questao',
    'O cadastro de questoes entra em uma fase seguinte. Nesta demonstracao da N1 a tela mostra apenas o ponto de entrada.',
    evento,
  );
}

/** Trecho curto para o professor reconhecer a questao no dialogo. */
function trecho(questao: Questao): string {
  const limite = 120;
  return questao.statement.length > limite
    ? `${questao.statement.slice(0, limite).trimEnd()}…`
    : questao.statement;
}
</script>

<template>
  <div class="tela">
    <header class="cabecalho">
      <div class="cabecalho__texto">
        <h1 class="cabecalho__titulo">Banco de questoes</h1>
        <p class="cabecalho__descricao">
          Questoes reaproveitaveis nas provas das suas turmas. Busque pelo enunciado ou
          filtre por tipo e tag.
        </p>
      </div>
      <v-btn
        color="primary"
        data-nova-questao
        :prepend-icon="mdiPlus"
        @click="criar"
      >
        Nova questao
      </v-btn>
    </header>

    <section class="filtros" aria-label="Busca e filtros">
      <v-text-field
        v-model="busca"
        class="filtros__busca"
        label="Buscar pelo enunciado"
        name="busca-enunciado"
        autocomplete="off"
        :prepend-inner-icon="mdiMagnify"
        clearable
        clear-icon-label="Limpar a busca"
      />
      <v-select
        v-model="tipoSelecionado"
        class="filtros__campo"
        label="Tipo"
        :items="tiposDisponiveis"
        clearable
        clear-icon-label="Limpar o filtro de tipo"
      />
      <v-select
        v-model="tagSelecionada"
        class="filtros__campo"
        label="Tag"
        :items="tagsDisponiveis"
        clearable
        clear-icon-label="Limpar o filtro de tag"
      />
    </section>

    <div class="resumo">
      <p class="resumo__contagem" role="status">{{ contagem }}</p>
      <v-btn
        variant="text"
        color="primary"
        :prepend-icon="mdiFilterRemoveOutline"
        :disabled="!temFiltros"
        @click="limparFiltros"
      >
        Limpar filtros
      </v-btn>
    </div>

    <div v-if="carregando" class="estado" role="status">
      <v-progress-circular class="estado__indicador" indeterminate color="primary" />
      <p class="estado__texto">Carregando as questoes…</p>
    </div>

    <div v-else-if="questoes.length === 0" class="estado estado--vazio">
      <h2 class="estado__titulo">O banco esta vazio</h2>
      <p class="estado__texto">
        Todas as questoes foram excluidas nesta demonstracao. Recarregue a pagina para
        voltar ao conjunto inicial.
      </p>
    </div>

    <div v-else-if="questoesFiltradas.length === 0" class="estado estado--vazio">
      <h2 class="estado__titulo">Nenhuma questao corresponde aos filtros</h2>
      <p class="estado__texto">
        Ajuste a busca ou escolha outro tipo ou tag para ver mais questoes.
      </p>
      <v-btn color="primary" :prepend-icon="mdiFilterRemoveOutline" @click="limparFiltros">
        Limpar filtros
      </v-btn>
    </div>

    <v-table v-else-if="mdAndUp" class="listagem">
      <caption class="apenas-leitor-de-tela">
        Questoes do banco, com codigo, enunciado, tipo, composicao e acoes.
      </caption>
      <thead>
        <tr>
          <th scope="col" class="coluna-codigo">Codigo</th>
          <th scope="col">Enunciado</th>
          <th scope="col">Tipo</th>
          <th scope="col">Composicao</th>
          <th scope="col" class="coluna-acoes">Acoes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="questao in questoesFiltradas" :key="questao.id" class="linha">
          <th scope="row" class="celula-codigo" :class="`faixa faixa--${questao.type}`">
            <span class="codigo">{{ codigo(questao) }}</span>
          </th>
          <td class="celula-enunciado">
            <p class="enunciado">{{ questao.statement }}</p>
            <ul class="tags">
              <li v-for="tag in questao.tags" :key="tag" class="tags__item">{{ tag }}</li>
            </ul>
          </td>
          <td><BadgeTipoQuestao :tipo="questao.type" /></td>
          <td class="celula-composicao">{{ composicao(questao) }}</td>
          <td class="celula-acoes">
            <v-btn
              variant="text"
              size="small"
              :icon="mdiPencilOutline"
              :aria-label="`Editar a questao ${codigo(questao)}`"
              @click="editar(questao, $event)"
            />
            <v-btn
              variant="text"
              size="small"
              :data-excluir="questao.id"
              :icon="mdiTrashCanOutline"
              :aria-label="`Excluir a questao ${codigo(questao)}`"
              @click="pedirExclusao(questao, $event)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>

    <ul v-else class="cartoes">
      <li
        v-for="questao in questoesFiltradas"
        :key="questao.id"
        class="cartao faixa"
        :class="`faixa--${questao.type}`"
      >
        <div class="cartao__topo">
          <span class="codigo">{{ codigo(questao) }}</span>
          <BadgeTipoQuestao :tipo="questao.type" />
        </div>
        <p class="enunciado">{{ questao.statement }}</p>
        <ul class="tags">
          <li v-for="tag in questao.tags" :key="tag" class="tags__item">{{ tag }}</li>
        </ul>
        <div class="cartao__rodape">
          <span class="cartao__composicao">{{ composicao(questao) }}</span>
          <div class="cartao__acoes">
            <v-btn
              variant="text"
              size="small"
              :icon="mdiPencilOutline"
              :aria-label="`Editar a questao ${codigo(questao)}`"
              @click="editar(questao, $event)"
            />
            <v-btn
              variant="text"
              size="small"
              :data-excluir="questao.id"
              :icon="mdiTrashCanOutline"
              :aria-label="`Excluir a questao ${codigo(questao)}`"
              @click="pedirExclusao(questao, $event)"
            />
          </div>
        </div>
      </li>
    </ul>

    <!--
      O `role="dialog"` fica no overlay do Vuetify, nao no cartao: o nome
      acessivel precisa ser declarado aqui para chegar ao elemento certo.
    -->
    <v-dialog
      :model-value="questaoParaExcluir !== null"
      aria-labelledby="titulo-exclusao"
      @update:model-value="questaoParaExcluir = null"
    >
      <v-card v-if="questaoParaExcluir">
        <v-card-title id="titulo-exclusao" class="dialogo__titulo">
          Excluir a questao {{ codigo(questaoParaExcluir) }}?
        </v-card-title>
        <v-card-text class="dialogo__corpo">
          <p class="dialogo__trecho">{{ trecho(questaoParaExcluir) }}</p>
          <p class="dialogo__nota">
            A exclusao vale so nesta demonstracao da N1: nada e gravado e o banco volta ao
            estado inicial ao recarregar a pagina.
          </p>
        </v-card-text>
        <v-card-actions class="dialogo__acoes">
          <v-btn variant="text" @click="questaoParaExcluir = null">Manter questao</v-btn>
          <v-btn color="error" variant="flat" @click="confirmarExclusao">Excluir questao</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      :model-value="demonstracao !== null"
      aria-labelledby="titulo-demonstracao"
      @update:model-value="demonstracao = null"
    >
      <v-card v-if="demonstracao">
        <v-card-title id="titulo-demonstracao" class="dialogo__titulo">
          {{ demonstracao.titulo }}
        </v-card-title>
        <v-card-text class="dialogo__corpo">
          <p class="dialogo__nota">{{ demonstracao.texto }}</p>
        </v-card-text>
        <v-card-actions class="dialogo__acoes">
          <v-btn color="primary" variant="flat" @click="demonstracao = null">Entendi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- O VSnackbar nao declara regiao viva; sem isso o aviso nao e anunciado. -->
    <v-snackbar
      v-model="avisoAberto"
      :timeout="5000"
      color="superficie-invertida"
      role="status"
      aria-live="polite"
    >
      {{ aviso }}
      <template #actions>
        <v-btn variant="text" @click="avisoAberto = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.tela {
  max-width: 1120px;
  margin: 0 auto;
  padding: var(--espaco-xl) var(--espaco-lg) var(--espaco-xxl);
}

.cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--espaco-md);
  padding-bottom: var(--espaco-lg);
  border-bottom: 1px solid var(--cor-borda);
}

.cabecalho__texto {
  min-width: 0;
  max-width: 56ch;
}

.cabecalho__titulo {
  margin: 0 0 var(--espaco-xs);
  text-wrap: balance;
  font-size: var(--fonte-xl);
  font-weight: var(--peso-forte);
  letter-spacing: -0.01em;
}

.cabecalho__descricao {
  margin: 0;
  color: var(--cor-texto-secundario);
  line-height: 1.5;
}

.filtros {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--espaco-md);
  margin-top: var(--espaco-lg);
}

.resumo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--espaco-sm);
  margin: var(--espaco-lg) 0 var(--espaco-md);
}

.resumo__contagem {
  margin: 0;
  color: var(--cor-texto-secundario);
  font-size: var(--fonte-sm);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/*
  Assinatura visual: cada questao e ancorada por uma faixa institucional cuja
  forma tambem informa o tipo, sem depender de cor. Objetiva usa faixa continua;
  discursiva usa faixa segmentada, como as linhas de uma resposta escrita.
  A faixa e recuada nas pontas para marcar cada questao, e nao a borda da lista.
*/
.faixa {
  position: relative;
}

.faixa::before {
  content: '';
  position: absolute;
  inset-block: var(--espaco-md);
  inset-inline-start: 0;
  width: 3px;
  border-radius: var(--raio-pill);
}

.faixa--objetiva::before {
  background: var(--cor-marca);
}

.faixa--discursiva::before {
  background: repeating-linear-gradient(
    to bottom,
    var(--cor-marca) 0 5px,
    transparent 5px 10px
  );
}

.codigo {
  font-size: var(--fonte-xs);
  font-variant-numeric: tabular-nums;
  font-weight: var(--peso-forte);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cor-texto-secundario);
}

.listagem {
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-md);
  overflow: hidden;
}

.listagem :deep(th) {
  font-size: var(--fonte-xs);
  font-weight: var(--peso-forte);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--cor-texto-secundario);
}

.listagem :deep(td),
.listagem :deep(th) {
  vertical-align: top;
  padding-block: var(--espaco-md);
}

.celula-codigo {
  padding-inline-start: var(--espaco-lg);
  text-align: start;
  white-space: nowrap;
}

.coluna-acoes,
.celula-acoes {
  text-align: end;
  white-space: nowrap;
}

.celula-enunciado {
  min-width: 22rem;
}

.celula-composicao {
  font-variant-numeric: tabular-nums;
  color: var(--cor-texto-secundario);
  font-size: var(--fonte-sm);
  white-space: nowrap;
}

.enunciado {
  margin: 0;
  max-width: 60ch;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--espaco-xs);
  margin: var(--espaco-sm) 0 0;
  padding: 0;
  list-style: none;
}

.tags__item {
  padding: 2px var(--espaco-sm);
  overflow-wrap: anywhere;
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-pill);
  color: var(--cor-texto-secundario);
  font-size: var(--fonte-xs);
}

.cartoes {
  display: grid;
  gap: var(--espaco-md);
  margin: 0;
  padding: 0;
  list-style: none;
}

.cartao {
  padding: var(--espaco-md) var(--espaco-md) var(--espaco-md) var(--espaco-lg);
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-md);
  overflow: hidden;
}

.cartao__topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--espaco-sm);
  margin-bottom: var(--espaco-sm);
}

.cartao__rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--espaco-sm);
  margin-top: var(--espaco-md);
  padding-top: var(--espaco-sm);
  border-top: 1px solid var(--cor-borda);
}

.cartao__composicao {
  font-variant-numeric: tabular-nums;
  color: var(--cor-texto-secundario);
  font-size: var(--fonte-sm);
}

.estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--espaco-md);
  padding: var(--espaco-xxl) var(--espaco-lg);
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-md);
  text-align: center;
}

.estado__titulo {
  margin: 0;
  text-wrap: balance;
  font-size: var(--fonte-lg);
  font-weight: var(--peso-forte);
}

.estado__texto {
  margin: 0;
  max-width: 48ch;
  color: var(--cor-texto-secundario);
  line-height: 1.5;
}

.dialogo__titulo {
  padding: var(--espaco-lg) var(--espaco-lg) var(--espaco-sm);
  font-size: var(--fonte-lg);
  font-weight: var(--peso-forte);
  white-space: normal;
}

.dialogo__corpo {
  padding: 0 var(--espaco-lg);
}

.dialogo__trecho {
  margin: 0 0 var(--espaco-md);
  padding: var(--espaco-md);
  background: var(--cor-fundo-alternativo);
  border-inline-start: 3px solid var(--cor-marca);
  border-radius: var(--raio-sm);
  line-height: 1.5;
}

.dialogo__nota {
  margin: 0;
  color: var(--cor-texto-secundario);
  font-size: var(--fonte-sm);
  line-height: 1.5;
}

.dialogo__acoes {
  justify-content: flex-end;
  gap: var(--espaco-sm);
  padding: var(--espaco-lg);
}

.apenas-leitor-de-tela {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 599px) {
  .tela {
    padding: var(--espaco-lg) var(--espaco-md) var(--espaco-xl);
  }

  .filtros {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .filtros {
    grid-template-columns: 1fr 1fr;
  }

  .filtros__busca {
    grid-column: 1 / -1;
  }
}
</style>
