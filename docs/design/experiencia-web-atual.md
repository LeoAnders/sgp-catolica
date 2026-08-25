# Experiência web atual

## Escopo

Este documento descreve a experiência que existe na aplicação web agora. Ele separa
comportamentos implementados de marcadores de futuras entregas para que uma tela em
construção não seja interpretada como funcionalidade concluída.

O público atual é o docente. A tela de Provas é a referência de interação para as próximas
telas do produto.

## Mapa de navegação

| Rota | Situação | Propósito atual |
| --- | --- | --- |
| `/` | Implementada | Redireciona para `/provas`. |
| `/provas` | Implementada | Consultar, filtrar, criar rascunho e abrir detalhes de provas. |
| `/banco-de-questoes` | Marcador | Reserva o lugar da seção; ainda não contém o fluxo de questões. |
| `/turmas` | Marcador | Reserva o lugar da seção; ainda não contém gestão de turmas. |
| `/correcoes` | Marcador | Reserva o lugar da seção; ainda não contém o fluxo de correção. |
| `/relatorios` | Marcador | Reserva o lugar da seção; ainda não contém relatórios. |
| Rota inexistente | Implementada | Redireciona para `/provas`. |

As cinco seções ficam na sidebar para apresentar a arquitetura do produto sem fingir que
as áreas futuras estão prontas. As quatro seções marcadas exibem uma mensagem honesta e
uma ação para retornar a Provas.

## Casca de navegação

| Elemento | Comportamento | Limite atual |
| --- | --- | --- |
| Sidebar | É `inset`, mostra a seção ativa e pode ser recolhida para ícones; tooltips preservam o significado no modo recolhido. | Não há permissões nem itens por perfil. |
| Barra superior | Reúne gatilho da sidebar, breadcrumb `SGP Católica > tela atual` e troca direta de tema. | Não há busca global. |
| Tema | Um clique alterna entre claro e escuro; a escolha usa o estado de cor do navegador. | Não há opção “seguir sistema”. |
| Perfil | Abre menu com identificação genérica e “Sair”. | Não há autenticação; Sair apenas informa que a conexão será implementada. |
| Configurações e Ajuda | Estão visíveis como destinos previstos. | Não executam ação nem possuem rota nesta fase. |

## Fluxo de Provas

### Consultar e encontrar uma prova

1. Ao abrir a página, os dados de demonstração exibem `Skeleton` por aproximadamente
   350 ms.
2. A página mostra três cartões de resumo: total no acervo, prontas para aplicar e
   aplicações registradas.
3. O docente pode buscar por título ou descrição e filtrar por situação.
4. A contagem do acervo acompanha os filtros ativos. Quando há filtros, a ação Limpar
   os remove sem sair da página.
5. Sem resultado, a tabela mostra estado vazio e oferece Limpar filtros.

### Criar rascunho

1. O docente seleciona **Nova prova**.
2. O diálogo pede título e aceita descrição opcional.
3. O título precisa ter ao menos três caracteres. Em erro, a mensagem aparece junto ao
   campo e o foco retorna a ele.
4. Ao criar, o rascunho entra no início da tabela, o diálogo fecha e uma notificação
   confirma a ação.

O endereço `/provas?nova=1` abre esse diálogo diretamente. Fechá-lo remove o parâmetro da
URL; isso permite compartilhar a intenção sem manter o diálogo aberto indevidamente.

### Consultar detalhes

1. O docente seleciona **Abrir** em uma linha.
2. Um diálogo mostra total de questões, pontos, aplicações e a lista de turmas vinculadas.
3. Caso não existam aplicações, o diálogo informa a ausência em vez de exibir uma lista
   vazia.

## Estados e feedback

| Situação | Padrão adotado |
| --- | --- |
| Carregando | `Skeleton` no espaço da tabela; evita saltos grandes de layout. |
| Sem resultado | `TableEmpty`, explicação curta e ação de recuperação quando há filtros. |
| Validação | Texto próximo ao campo, `aria-invalid` e foco no campo com problema. |
| Ação concluída | `Sonner` no canto superior direito. |
| Área futura | Card de “próxima entrega”, sem controles que simulem uma funcionalidade. |

## Diretrizes de UI aplicadas à experiência

- Estrutura, sidebar, tabelas e cartões comuns usam as superfícies neutras do shadcn-vue.
- O vinho Católica é usado em ações primárias, foco e no degradê de 5% dos cartões de
  resumo. Ele não colore a sidebar, a tabela ou a casca inteira.
- A página usa `gap-4`; o resumo passa a três colunas a partir de `md`.
- A tabela mantém as colunas e pode rolar horizontalmente quando não couber na largura.
- Diálogos, selects, menus, estados vazios e tooltips usam os primitivos shadcn-vue;
  não há overlays ou controles equivalentes construídos à mão.

## Acessibilidade

- Há atalho de teclado “Ir para o conteúdo”, foco visível e região principal identificada.
- Ícones decorativos são ocultos de leitores de tela; controles só com ícone têm nome
  acessível.
- A navegação recolhida continua disponível por ícones e tooltips.
- A alternância de tema, filtros, diálogos e menus usam os comportamentos acessíveis dos
  componentes baseados em Reka UI.

## Próximos pontos de UX

Antes de implementar Banco de questões, Turmas, Correções ou Relatórios, registrar neste
arquivo o fluxo principal, estados vazios/erro e a relação com Provas. Quando Ajuda ou
Configurações ganharem uma ação real, remover o limite correspondente da tabela de casca
de navegação e documentar a rota ou comportamento.
