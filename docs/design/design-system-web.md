# Design system web — SGP Católica

## Objetivo e fonte de verdade

Este documento define a fundação de interface do SGP Católica. Ele vale para novas telas,
ajustes de UI e revisões visuais. O objetivo é manter uma aplicação acadêmica sóbria,
consistente e acessível, sem criar bibliotecas paralelas de componentes.

A implementação atual está em `apps/web`; seus componentes instalados e o tema são a
referência executável. Uma mudança que crie um novo padrão deve atualizar este documento
na mesma entrega.

## Fundação técnica

| Decisão | Padrão |
| --- | --- |
| Componentes | shadcn-vue sobre Reka UI; reutilizar os primitivos existentes em `apps/web/src/components/ui`. |
| Ícones | `@lucide/vue`; ícones são decorativos com `aria-hidden` ou têm rótulo acessível. |
| Tipografia | Inter Variable, carregada globalmente em `src/styles/global.css`. |
| Estilos | Tailwind v4 e tokens CSS semânticos do shadcn. |
| Temas | claro e escuro; troca direta por botão na barra superior. Não há modo “sistema” na interface. |
| Notificações | `vue-sonner`, pelo `Toaster` único na raiz. |

`apps/web/components.json` é a configuração do shadcn-vue. Ao precisar de um primitivo
ausente, adicionar o componente pelo CLI do shadcn-vue usando essa configuração; não
recriar manualmente um equivalente de Button, Card, Input, Select, Dialog, Table ou
Sidebar.

## Tokens e superfícies

Usar nomes semânticos — `background`, `foreground`, `card`, `popover`, `primary`,
`secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` e tokens
`sidebar`. Não usar hexadecimal, cor arbitrária, sombra manual ou raio manual em telas.

| Papel | Classe/token | Regra |
| --- | --- | --- |
| Canvas da página | `bg-background` | No tema escuro é preto. Abriga conteúdo operacional e a área livre da página. |
| Superfície elevada | `bg-card` | Superfície neutra padrão do shadcn para cartões, filtros e grids. |
| Sobreposição | `bg-popover` | Somente menus, diálogos, selects e tooltips. |
| Separação | `border`, `ring-border` | Contorno neutro e discreto em cartões e sobreposições. |
| Texto secundário | `text-muted-foreground` | Descrições, metadados e conteúdo de apoio. |

No tema escuro, a diferença entre canvas preto e `card` escuro é intencional: os blocos
ganham hierarquia sem parecerem um dashboard genérico.

## Paleta vinho Católica

O vermelho institucional é aplicado pelos tokens globais de `src/styles/global.css` e é
reservado para ações, foco e destaque pontual. Caso o manual institucional forneça um
valor oficial mais específico, a alteração deve ocorrer somente nesses tokens.

| Papel | Tema claro | Tema escuro | Uso |
| --- | --- | --- | --- |
| Ação institucional | Vinho profundo | Vinho mais luminoso | `primary`, `sidebar-primary`, ações principais e ícone da marca. |
| Estrutura | Neutra | Neutra | `background`, `card`, `sidebar`, `border`, `input`, `accent` e `sidebar-accent`. |
| Destaque de resumo | Gradiente vinho de 5% | Gradiente vinho de 5% | Somente cartões de métrica: `from-primary/5 to-card bg-gradient-to-t`. |
| Seleção e hover | Neutra | Neutra | `accent` e `sidebar-accent`; o estado não deve colorir a navegação de vermelho. |
| Foco | Vinho profundo | Vinho luminoso | `ring`; nunca remover o foco visível. |

`destructive` continua reservado para erro ou remoção: ele não é o vermelho institucional
de ação primária.

O degradê não pertence ao componente `Card`: ele é aplicado no contêiner de um grupo de
resumos. Por isso não se propaga a tabelas, cards de formulários, grids ou à casca da
aplicação.

## Estrutura da aplicação

| Região | Composição obrigatória | Local atual |
| --- | --- | --- |
| Casca | `SidebarProvider` + `AppSidebar` + `SidebarInset` | `src/App.vue` |
| Barra superior | `SidebarTrigger`, `Separator`, `Breadcrumb` e botão de tema | `src/App.vue` |
| Navegação | `Sidebar` com `variant="inset"` e `collapsible="icon"` | `src/components/AppSidebar.vue` |
| Perfil | `Avatar` + `DropdownMenu`; avatar genérico enquanto não houver dados de usuário confiáveis | `src/components/AppSidebar.vue` |
| Conteúdo | `main` com `min-w-0 flex-1`; cada rota determina o conteúdo | `src/App.vue` |

A sidebar fechada preserva os ícones e os tooltips; ela não desaparece. Configurações e
Ajuda são itens visuais já previstos. Não conectar ações fictícias: Ajuda só vira navegação
quando a rota de documentação existir, e Configurações só recebe comportamento quando o
requisito for definido.

## Layout e responsividade

| Caso | Padrão |
| --- | --- |
| Página comum | `flex flex-1 flex-col gap-4 p-4`. |
| Cabeçalho de página | Título, descrição curta e ação principal; em telas pequenas, empilhar antes de comprimir. |
| Resumo/KPIs | `grid auto-rows-min gap-4 md:grid-cols-3`; cada métrica é um `Card`. |
| Blocos adjacentes | `gap-4`; não usar espaçamentos ad hoc para “corrigir” uma tela isolada. |
| Conteúdo largo | `min-w-0` no contêiner e `overflow-x-auto` no trecho que exceder a largura. |
| Dados tabulares | Manter as colunas relevantes com rolagem horizontal; ocultar ou resumir coluna requer decisão de UX. |

## Grades de dados

Neste estágio, uma grade operacional usa a mesma superfície `card` dos cartões. A
hierarquia vem da moldura, das linhas e do espaçamento nativos da tabela, sem separar
artificialmente o cabeçalho em outra superfície.

| Parte da grade | Padrão |
| --- | --- |
| Contêiner | `Card` nativo; mantém ring, borda, raio e `overflow` nativos. |
| Cabeçalho e filtros | `CardHeader` nativo, com título, descrição e filtros organizados por layout. |
| Cabeçalho da tabela | `TableHeader` nativo. |
| Corpo, linhas e células | `Table` nativa na superfície do cartão, usando bordas e hover nativos. |
| Estados | `Skeleton` no carregamento; `TableEmpty` no vazio; mensagem curta e ação de recuperação quando fizer sentido. |
| Ações por linha | `Button` `ghost`/`sm` ou `DropdownMenu` quando houver várias ações. |

Em uma etapa futura, uma grade pode receber superfície própria se houver uma razão de
produto e uma validação visual; isso não é o padrão atual.

## Controles e hierarquia de ações

| Necessidade | Componente/variante |
| --- | --- |
| Ação principal da página | `Button` padrão, com texto e ícone somente quando o ícone acrescentar significado. |
| Ação secundária | `Button variant="outline"`. |
| Ação discreta | `Button variant="ghost"`. |
| Ação só com ícone | `Button size="icon"`, sempre com `aria-label` ou tooltip. |
| Ação de linha | `Button size="sm"`; não reduzir a altura por CSS próprio. |
| Busca e texto curto | `Input`; ícone de busca posicionado como elemento decorativo. |
| Escolha entre opções | `Select`; nunca simular select com um `div`. |
| Campo multilinha | `Textarea`. |
| Situação/estado | `Badge`; variantes devem representar semântica, não decoração. |
| Separação de ações | `Separator`, não bordas ou espaços improvisados. |

Usar os tamanhos, estados de foco, disabled e hover fornecidos pelos componentes shadcn.
Uma classe de layout pode controlar largura, grid e alinhamento, mas não deve reproduzir a
aparência de um primitivo existente.

## Mapa de componentes instalados

| Grupo | Componentes disponíveis | Aplicação esperada |
| --- | --- | --- |
| Ações e formulário | `Button`, `Input`, `Textarea`, `Label`, `Select` | Formulários, filtros e ações. |
| Conteúdo | `Card`, `Badge`, `Tabs`, `Separator`, `Skeleton` | Resumos, agrupamento e estados de carregamento. |
| Dados | `Table` e subcomponentes | Listagens, grids operacionais e estados vazios. |
| Navegação | `Sidebar`, `Breadcrumb`, `Sheet`, `Tooltip` | Casca, navegação contextual e experiência mobile. |
| Sobreposições | `Dialog`, `DropdownMenu`, `Sheet`, `Tooltip` | Confirmações, detalhes, ações adicionais e ajuda contextual. |
| Identidade e feedback | `Avatar`, `Sonner` | Perfil e retorno de ações. |

Os imports devem vir de `@/components/ui/<nome>`. Componentes de domínio podem compor
primitivos (por exemplo, uma linha de aplicação), mas não duplicar os primitivos acima.

## Acessibilidade e conteúdo

- Preservar o link “Ir para o conteúdo”, foco visível e estrutura semântica de títulos.
- Todo controle interativo deve ter texto visível ou nome acessível.
- Ícones isolados não substituem rótulos em ações críticas.
- Usar `Dialog` para fluxo modal e `DropdownMenu` para ações compactas; não criar overlays
  com posicionamento manual.
- Mensagens de vazio e carregamento devem explicar o estado e oferecer próximo passo
  apenas quando ele existir de verdade.

## Checklist para criar ou revisar uma tela

1. Conferir requisito, rota e dados disponíveis antes de desenhar a interface.
2. Escolher componentes instalados no mapa; se faltar um primitivo, adicionar pelo shadcn-vue.
3. Compor a página com o layout, superfícies e grid definidos acima.
4. Implementar os estados carregando, vazio, erro quando aplicável, e responsividade.
5. Verificar teclado, foco, nomes acessíveis, tema claro/escuro e largura estreita.
6. Rodar `npm run typecheck --workspace @sgp/web`, `npm run build --workspace @sgp/web` e
   `git diff --check`.
7. Atualizar este documento se a entrega introduzir um padrão reutilizável novo.
