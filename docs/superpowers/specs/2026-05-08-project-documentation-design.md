# Project Documentation Design

**Objetivo:** estruturar a documentação do projeto `digital-signage` em PT-BR, seguindo `DOCUMENTATION_RULES.md`, cobrindo visão geral, documentação por módulo, decisões arquiteturais implícitas, diagramas Mermaid e runbooks operacionais.

## Escopo aprovado

Adotar a abordagem 2: documentação modular completa.

Isso inclui:

- `README.md` principal reescrito no padrão obrigatório
- `README.md` por módulo relevante
- documentação transversal em `docs/architecture`
- ADRs em `docs/adr`
- runbooks em `docs/runbooks`
- diagramas Mermaid nos documentos em que agregarem clareza

## Idioma e estilo editorial

- Idioma padrão: português pt-BR
- Público-alvo: desenvolvedores junior, pleno e senior
- Ordem de explicação obrigatória em cada documento:
  1. visão de alto nível
  2. fluxo técnico
  3. detalhe de implementação
- Evitar repetição literal de código
- Explicar responsabilidades, integrações, regras de negócio, eventos e dependências

## Estrutura documental alvo

### 1. README principal

O `README.md` da raiz deve conter:

1. objetivo do projeto
2. stack utilizada
3. arquitetura geral
4. estrutura de diretórios
5. fluxo principal da aplicação
6. como executar
7. variáveis de ambiente
8. integrações
9. convenções
10. troubleshooting

### 2. READMEs por módulo

Arquivos planejados:

- `src/app/admin/README.md`
- `src/app/display/README.md`
- `src/app/api/admin/README.md`
- `src/app/api/display/README.md`
- `src/app/api/file/README.md`
- `src/components/admin/displays/README.md`
- `src/components/auth/README.md`
- `src/components/ui/README.md`
- `src/lib/auth/README.md`
- `src/lib/README.md`
- `prisma/README.md`
- `ws-server/README.md`

Cada README modular seguirá esta estrutura:

1. responsabilidade
2. fluxo interno
3. dependências
4. eventos
5. regras importantes
6. pontos críticos
7. exemplo de uso

### 3. Documentos de arquitetura

Arquivos planejados em `docs/architecture`:

- visão geral da arquitetura
- autenticação e proteção de rotas
- fluxo de displays, conteúdos e playback
- realtime e sincronização por display
- mapa de módulos e dependências

### 4. ADRs inferidas do código

Arquivos planejados em `docs/adr`:

- middleware como fronteira central de autenticação
- LDAP como fonte de verdade para credenciais
- `AdminUser` local como espelho operacional
- separação entre admin e player público
- preview admin reutilizando o player público via `iframe`
- websocket como mecanismo de invalidação e sinalização
- `ws-server` como sidecar separado do Next.js
- sincronização de displays por `displayId` com `startAt` agendado

### 5. Runbooks operacionais

Arquivos planejados em `docs/runbooks`:

- execução local completa
- troubleshooting de autenticação LDAP
- troubleshooting de websocket e realtime
- troubleshooting de uploads e arquivos servidos
- troubleshooting de playback e tela preta
- validação operacional da sincronização entre displays
- checagem de banco, Prisma e consistência de dados

## Diagramas Mermaid planejados

Os seguintes diagramas devem ser incluídos onde fizer mais sentido:

- visão geral dos módulos
- sequência de autenticação e login
- fluxo de proteção de rotas
- ciclo de vida do conteúdo
- fluxo de atualização realtime
- sequência de sincronização de displays
- máquina de estados simplificada do player

## Módulos identificados para documentação

### Superfícies principais

- admin autenticado sob `/admin/**`
- player público sob `/display/[displayId]`

### Infraestrutura e integração

- autenticação LDAP + NextAuth
- middleware de proteção
- Prisma + PostgreSQL
- armazenamento em `public/uploads`
- `ws-server` para rooms por `displayId`

### Módulos funcionais

- login e sessão
- gestão de displays
- gestão de conteúdos
- preview administrativo
- runtime do player
- APIs públicas e administrativas
- bridge de eventos websocket

## Princípios de documentação

- descrever o que o módulo faz, quando é usado e do que depende
- explicar o fluxo real observado no código, não um fluxo idealizado
- registrar decisões arquiteturais já embutidas no projeto
- destacar riscos operacionais e pontos sensíveis do runtime
- usar Mermaid para reduzir ambiguidade em fluxos e fronteiras

## Fora de escopo

- reescrever código ou refatorar módulos apenas para acomodar documentação
- inventar decisões arquiteturais não sustentadas pelo código
- criar documentação genérica sem apontar arquivos e responsabilidades reais

## Resultado esperado

Ao final, o projeto terá documentação navegável por camadas:

- entrada rápida via `README.md`
- aprofundamento por módulo via READMEs locais
- visão sistêmica em `docs/architecture`
- histórico de decisões em `docs/adr`
- operação e suporte em `docs/runbooks`

Essa documentação deve permitir onboarding mais rápido, manutenção mais segura e entendimento claro do comportamento do sistema em runtime.
