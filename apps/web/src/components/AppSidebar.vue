<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  CircleHelp,
  ChartNoAxesCombined,
  ClipboardList,
  Files,
  GraduationCap,
  LogOut,
  ScanLine,
  Settings,
  UserRound,
  UsersRound,
} from '@lucide/vue';
import { toast } from 'vue-sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

const rota = useRoute();

const secoes = [
  { rotulo: 'Provas', para: '/provas', icone: Files },
  { rotulo: 'Banco de questões', para: '/banco-de-questoes', icone: ClipboardList },
  { rotulo: 'Turmas', para: '/turmas', icone: UsersRound },
  { rotulo: 'Correções', para: '/correcoes', icone: ScanLine },
  { rotulo: 'Relatórios', para: '/relatorios', icone: ChartNoAxesCombined },
];

function itemAtivo(caminho: string): boolean {
  return rota.path === caminho || rota.path.startsWith(`${caminho}/`);
}

function solicitarLogout(): void {
  toast.info('Logout ainda não disponível', {
    description: 'A ação será conectada quando a autenticação for implementada.',
  });
}
</script>

<template>
  <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child tooltip="SGP Católica">
            <RouterLink to="/provas">
              <span class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GraduationCap class="size-4" aria-hidden="true" />
              </span>
              <span class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">SGP Católica</span>
                <span class="truncate text-xs text-muted-foreground">Gestão de provas</span>
              </span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Trabalho docente</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="gap-1">
            <SidebarMenuItem v-for="secao in secoes" :key="secao.para">
              <SidebarMenuButton
                as-child
                :is-active="itemAtivo(secao.para)"
                :tooltip="secao.rotulo"
              >
                <RouterLink :to="secao.para">
                  <component :is="secao.icone" aria-hidden="true" />
                  <span>{{ secao.rotulo }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu class="gap-1">
        <SidebarMenuItem>
          <SidebarMenuButton as="div" tooltip="Configurações">
            <Settings aria-hidden="true" />
            <span>Configurações</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton as="div" tooltip="Ajuda">
            <CircleHelp aria-hidden="true" />
            <span>Ajuda</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                title="Perfil docente"
              >
                <Avatar class="-ml-2 size-8 rounded-lg group-data-[collapsible=icon]:ml-0">
                  <AvatarFallback class="rounded-lg">
                    <UserRound class="size-4" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
                <span class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">Perfil docente</span>
                  <span class="truncate text-xs text-muted-foreground">Acesso acadêmico</span>
                </span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-56 rounded-lg"
              side="right"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                  <Avatar class="size-8 rounded-lg">
                    <AvatarFallback class="rounded-lg">
                      <UserRound class="size-4" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                  <span class="grid flex-1 leading-tight">
                    <span class="truncate font-medium">Perfil docente</span>
                    <span class="truncate text-xs text-muted-foreground">Acesso acadêmico</span>
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @select="solicitarLogout">
                <LogOut class="size-4" aria-hidden="true" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
