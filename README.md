# Digital Signage

Um painel de digital signage em tempo real, com cara de produto de verdade e sem aquele cheiro de `create-next-app` esquecido no tempo.

Aqui voce encontra duas experiencias separadas, mas conectadas:

- um admin para cadastrar displays, subir midias, organizar playlists e abrir previews
- um player publico que roda o conteudo do display, respeita rotacao e reage a atualizacoes em tempo real

## O que esse projeto faz

- cadastra displays com nome e rotacao
- faz upload de imagem, video e PDF
- organiza a ordem de exibicao do conteudo
- atualiza duracao por item
- remove displays e conteudos
- abre preview administrativo embutido no painel
- mantem um player publico isolado e sensivel a runtime
- propaga mudancas para o player via WebSocket bridge

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth com credenciais LDAP via `ldapjs`
- Playwright para validacao e checks visuais
- `ws-server` separado com Express + WebSocket

## Estrutura mental do app

### Admin

Rotas principais:

- `/admin/displays`
- `/admin/displays/new`
- `/admin/displays/[id]`
- `/admin/displays/[id]/contents`
- `/admin/displays/[id]/preview`

O admin usa componentes compartilhados em `src/components/ui` e componentes de dominio em `src/components/admin/displays`.

### Player publico

Rota principal:

- `/display/[displayId]`

Essa parte deve ser tratada com cuidado. Ela controla:

- autoplay
- rotacao
- refresh por WebSocket
- renderizacao de imagem, video e PDF

## Pastas importantes

```text
src/
  app/
    admin/displays/
    api/
    display/[displayId]/
    globals.css
    layout.tsx

  components/
    ui/
    admin/displays/
    auth/

  lib/
    prisma.ts
    ws.ts
    auth/ad.ts

  types/
    display.ts
    content.ts

prisma/
ws-server/
```

## Como rodar

### 1. Instale as dependencias

```bash
npm install
```

### 2. Configure o ambiente

Crie o `.env` com os valores necessarios para banco, auth e conexoes do player/admin.

Exemplos de variaveis esperadas pelo projeto:

```env
DATABASE_URL=
NEXT_PUBLIC_WS_URL=
AD_URL=
AD_DOMAIN=
```

### 3. Rode o app web

```bash
npm run dev
```

App principal:

- `http://localhost:3000`

### 4. Rode o servidor de WebSocket

Em outro terminal:

```bash
cd ws-server
npm install
node server.js
```

## Scripts uteis

```bash
npm run dev
npm run build
npm run start
npx tsc --noEmit
```

## Como o realtime funciona

1. o admin altera display ou conteudo
2. a API grava no banco com Prisma
3. `src/lib/ws.ts` envia um evento para o bridge HTTP do `ws-server`
4. o player inscrito naquele display recebe o evento
5. `DisplayClient` refaz o fetch de `/api/display/[displayId]`

Simples, direto e suficientemente nervoso para nao sair mexendo sem pensar.

## Preview vs Visualizar

- `Visualizar` abre o player publico real em `/display/[id]`
- `Abrir preview` na tela de conteudos abre o preview administrativo em `/admin/displays/[id]/preview`
- a pagina de preview admin incorpora o player real em um `iframe`

Ou seja: preview admin e player publico nao sao a mesma tela, mas usam o mesmo runtime por baixo.

## Validacao recomendada

Sempre que mexer em estrutura, layout ou fluxo de admin, rode pelo menos:

```bash
npx tsc --noEmit
npm run build
```

E, quando tocar no fluxo de displays:

- validar `/admin/displays`
- validar `/admin/displays/new`
- validar `/admin/displays/[id]`
- validar `/admin/displays/[id]/contents`
- validar `/admin/displays/[id]/preview`
- validar `/display/[displayId]`

## Observacoes importantes

- o player publico e sensivel a runtime; evite misturar layout administrativo nele
- o campo `duration` tem semantica importante no fluxo de conteudos
- mutacoes que alteram o que aparece no display devem continuar emitindo eventos WS
- o design atual do admin segue os tokens e a direcao visual vindos do Pencil

## Quer continuar evoluindo?

Bom sinal. Antes de sair abrindo arquivos aleatorios, leia `AGENTS.md`.

Ele documenta:

- os padroes globais da aplicacao
- a organizacao por pastas
- o papel de cada componente importante
- as regras de implementacao para novos agentes
- os cuidados para nao quebrar o player publico

Em resumo: o projeto esta organizado, funcional e com um layout novo decente. Agora a ideia e evoluir sem voltar para o caos.
