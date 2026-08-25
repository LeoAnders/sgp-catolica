<script setup lang="ts">
import { computed } from 'vue';
import { useColorMode } from '@vueuse/core';
import { Moon, Sun } from '@lucide/vue';
import { useRoute } from 'vue-router';
import AppSidebar from '@/components/AppSidebar.vue';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

const rota = useRoute();
const titulo = computed(() => (rota.meta.titulo as string | undefined) ?? 'SGP Católica');
const modo = useColorMode();

function alternarTema(): void {
  modo.value = modo.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <Button
    as-child
    class="fixed left-3 top-3 z-50 -translate-y-20 focus-visible:translate-y-0"
  >
    <a href="#conteudo-principal">Ir para o conteúdo</a>
  </Button>

  <SidebarProvider>
    <AppSidebar />

    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      >
        <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger class="-ml-1" />
          <Separator
            orientation="vertical"
            class="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink as-child>
                  <RouterLink to="/provas">SGP Católica</RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage class="text-base font-medium">{{ titulo }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Button
          variant="ghost"
          size="icon"
          class="ml-auto mr-2"
          aria-label="Alternar entre tema claro e escuro"
          @click="alternarTema"
        >
          <Sun class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
          <Moon class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
        </Button>
      </header>

      <main id="conteudo-principal" class="min-w-0 flex-1" tabindex="-1">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>

  <Toaster rich-colors position="top-right" />
</template>
