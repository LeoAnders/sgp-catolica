---
name: sgp-catolica-web
description: Padroes obrigatorios para criar ou revisar telas da aplicacao web do SGP Catolica (apps/web, Vue + Tailwind v4 + shadcn-vue). Use ao implementar tela, ajustar UI, revisar layout, tema, paleta, componentes, acessibilidade ou estados de carregamento, vazio e erro na web.
---

# UI da web do SGP Católica

Aplicação acadêmica sóbria e consistente. Aqui não se cria identidade visual nova:
a fundação já está decidida e documentada.

## Fonte de verdade

Leia antes de escrever código de tela — não deduza padrão a partir de uma tela isolada:

| Documento                                                                             | Quando                                                                                           |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [docs/design/design-system-web.md](../../../docs/design/design-system-web.md)         | Tokens, superfícies, paleta, layout, grades, controles, mapa de componentes e checklist de tela. |
| [docs/design/experiencia-web-atual.md](../../../docs/design/experiencia-web-atual.md) | Rotas existentes, casca de navegação, fluxo de Provas e limites do que está implementado.        |
| [docs/design/README.md](../../../docs/design/README.md)                               | Índice de design.                                                                                |

`apps/web/src/telas/Provas.vue` é a referência executável de interação; a implementação em
`apps/web` e o tema em `apps/web/src/styles/global.css` valem como referência quando o
documento for genérico. Um padrão novo e reutilizável exige atualizar o design system na
mesma entrega.

## Antes de desenhar uma tela

1. Requisito e critérios de aceite: [docs/produto/requisitos-funcionais.md](../../../docs/produto/requisitos-funcionais.md).
2. Domínio: [docs/modelo-dados/dicionario-de-entidades.md](../../../docs/modelo-dados/dicionario-de-entidades.md) e os tipos de `packages/shared-types`; não invente campo nem entidade.
3. Rota e situação: `apps/web/src/router/index.ts` e o mapa de navegação da experiência atual — várias seções ainda são marcadores, e marcador não deve ganhar controle que finja funcionar.
4. Dados: somente `packages/mocks`. Nenhuma tela faz requisição de rede na fase N1.
5. Aberto em [docs/pendencias.md](../../../docs/pendencias.md) não se resolve por inferência.

## Limites que não se negociam

- **Componentes**: use os primitivos de `@/components/ui`. Faltando um, adicione pelo CLI
  do shadcn-vue com `apps/web/components.json`; nunca recrie à mão Button, Card, Input,
  Select, Dialog, Table, Sidebar ou overlay com posicionamento próprio.
- **Paleta**: só tokens semânticos (`background`, `card`, `popover`, `primary`, `muted`,
  `accent`, `destructive`, `border`, `ring`, `sidebar*`). Sem hex, cor arbitrária, sombra
  ou raio manual. O vinho Católica fica em ação primária, foco e no degradê
  `from-primary/5 to-card bg-gradient-to-t` **apenas** no contêiner dos cards de resumo —
  estrutura, sidebar, grids e cartões comuns permanecem neutros. `destructive` é erro ou
  remoção, não ação institucional.
- **Casca**: `SidebarProvider` + `AppSidebar` + `SidebarInset`, sidebar `inset`
  colapsável para ícones com tooltips, breadcrumb e alternância direta claro/escuro. Não
  existe modo “sistema”.
- **Layout**: `flex flex-1 flex-col gap-4 p-4`; resumo em `grid auto-rows-min gap-4
md:grid-cols-3`; `min-w-0` no contêiner e `overflow-x-auto` no conteúdo largo. Sem
  espaçamento ad hoc para corrigir uma tela.
- **Estados**: `Skeleton` no carregamento, `TableEmpty` no vazio com ação de recuperação
  quando ela existir de fato, erro explicando o que fazer, `vue-sonner` para confirmação.
  Validação junto ao campo, com `aria-invalid` e foco no campo com problema.
- **Acessibilidade**: “Ir para o conteúdo”, foco visível preservado, hierarquia de
  títulos, nome acessível em todo controle (ícone só decorativo com `aria-hidden`,
  `Button size="icon"` sempre com `aria-label` ou tooltip).
- **Responsividade**: verificar largura estreita, teclado e os dois temas antes de
  concluir.

## Fechamento

- `npm run typecheck --workspace @sgp/web`, `npm run build --workspace @sgp/web` e
  `git diff --check`.
- Não crie commit sem pedido explícito do usuário; quando pedirem, siga
  `.claude/rules/30-convencao-de-commits.md`.

## Relação com as outras skills

- `frontend-design` busca identidade visual distintiva e escolhas autorais de paleta e
  tipografia: **não se aplica** a `apps/web`, cuja fundação (Inter Variable, tema shadcn,
  vinho institucional) já está decidida. Use-a apenas fora deste app.
- `web-design-guidelines` serve como revisão externa de acessibilidade e UX; em conflito,
  `docs/design/` prevalece.
