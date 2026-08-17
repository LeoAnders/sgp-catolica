# Escopo da fase N1

## Vale

- Telas navegaveis na web (React) e no aplicativo do professor (React Native).
- Componentes de interface e tokens de design compartilhados.
- Dados estaticos vindos de `packages/mocks`.
- Fluxos de navegacao completos o suficiente para demonstrar o produto ao cliente.

## Nao vale nesta fase

- Banco de dados, ORM ou migracoes.
- Backend, API real, autenticacao real ou emissao de tokens.
- Leitura real de camera, QR Code ou processamento de imagem.
- Sincronizacao offline real (a fila local pode ser representada com dados estaticos).
- Kubernetes, Rancher, K3s ou qualquer orquestracao de containers.

Quando uma tela precisar de um comportamento que pertence a uma fase futura,
represente o estado com dado estatico e deixe o ponto de integracao explicito no
codigo, sem criar a implementacao real.
