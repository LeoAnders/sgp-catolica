<script setup lang="ts">
/**
 * Casca da aplicação — uma barra branca em torno de um campo de trabalho cinza.
 *
 * A barra externa recebe marca, integrações, ajuda e perfil. Dentro dela, a moldura
 * arredondada reúne as seções e o conteúdo sobre o mesmo cinza. A borda e o branco
 * que sobra em volta da moldura são parte da hierarquia, como na referência.
 *
 * O editor de prova é um **modo**, não uma seção: rotas com `meta.telaCheia`
 * dispensam a casca e assumem a janela inteira, com a própria barra
 * (breadcrumb "Provas › título", sem botão de voltar) e a saída explícita ali.
 */
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BarraSuperior from '@/components/casca/BarraSuperior.vue';
import AbasDeSecao from '@/components/casca/AbasDeSecao.vue';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const rota = useRoute();
const telaCheia = computed(() => rota.meta.telaCheia === true);
</script>

<template>
  <Button as-child class="fixed left-3 top-3 z-50 -translate-y-24 focus-visible:translate-y-0">
    <a href="#conteudo-principal">Ir para o conteúdo</a>
  </Button>

  <!-- A casca antiga recebia este contexto do `SidebarProvider`; agora ele é explícito. -->
  <TooltipProvider>
    <main
      v-if="telaCheia"
      id="conteudo-principal"
      class="flex min-h-svh min-w-0 flex-col"
      tabindex="-1"
    >
      <RouterView />
    </main>

    <div v-else class="flex min-h-svh flex-col bg-background">
      <BarraSuperior />

      <div
        class="mx-3 mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-field sm:mx-4 sm:mb-4"
      >
        <AbasDeSecao />
        <main id="conteudo-principal" class="flex min-w-0 flex-1 flex-col" tabindex="-1">
          <RouterView />
        </main>
      </div>
    </div>
  </TooltipProvider>

  <Toaster rich-colors position="top-right" />
</template>
