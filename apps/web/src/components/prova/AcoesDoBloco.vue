<script setup lang="ts">
import { ChevronDown, ChevronUp, Copy, Trash2 } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

defineProps<{
  podeSubir: boolean;
  podeDescer: boolean;
}>();

const emit = defineEmits<{
  mover: [direcao: 'cima' | 'baixo'];
  duplicar: [];
  remover: [];
}>();
</script>

<template>
  <div
    class="absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-lg border bg-background p-1 text-foreground shadow-sm"
    role="toolbar"
    aria-label="Ações do bloco selecionado"
    @click.stop
  >
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon-xs"
          :disabled="!podeSubir"
          aria-label="Mover bloco para cima"
          @click="emit('mover', 'cima')"
        >
          <ChevronUp aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Mover para cima</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon-xs"
          :disabled="!podeDescer"
          aria-label="Mover bloco para baixo"
          @click="emit('mover', 'baixo')"
        >
          <ChevronDown aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Mover para baixo</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="icon-xs" aria-label="Duplicar bloco" @click="emit('duplicar')">
          <Copy aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Duplicar</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="destructive" size="icon-xs" aria-label="Excluir bloco" @click="emit('remover')">
          <Trash2 aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Excluir</TooltipContent>
    </Tooltip>
  </div>
</template>
