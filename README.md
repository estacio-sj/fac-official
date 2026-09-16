# FAQ — Next.js + TypeScript + Supabase

Painel para os mediadores cadastrarem e editarem respostas de FAQ. Tudo em um
projeto só: o front (React/Next) e o "backend" (Route Handlers do Next,
rodando como funções serverless) que fala com o Supabase.

## Estrutura

```
src/
├── app/
│   ├── page.tsx              # painel (client component)
│   ├── layout.tsx            # layout raiz + script anti-flash do tema
│   ├── globals.css
│   └── api/
│       ├── assuntos/route.ts         # GET, POST
│       ├── assuntos/[id]/route.ts    # DELETE
│       ├── respostas/route.ts        # GET, POST
│       └── respostas/[id]/route.ts   # PUT, DELETE
├── components/                # Sidebar, FaqList, FaqForm, FilterBar, ThemeToggle
├── hooks/useTheme.ts
├── lib/
│   ├── api.ts                 # cliente HTTP do navegador (chama /api/*)
│   ├── dateUtils.ts           # dd/mm/aaaa <-> aaaa-mm-dd (lado do navegador)
│   ├── respostas.ts           # mesma conversão + validação (lado do servidor)
│   └── supabaseServer.ts      # cliente Supabase com a service role key
└── types/index.ts
supabase/schema.sql            # SQL para criar as tabelas no Supabase
```

## 1. Criar o projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com) (plano free).
2. Vá em **SQL Editor** → New query, cole o conteúdo de `supabase/schema.sql`
   e rode. Isso cria as tabelas `assuntos` e `respostas` (com FK e cascade
   delete) e já insere ESTAGIO/FINANCEIRO/SIMULADO.
3. Vá em **Project Settings → API** e copie:
   - **Project URL** → vai virar `SUPABASE_URL`
   - **service_role key** (não é a `anon`/`public`!) → vai virar
     `SUPABASE_SERVICE_ROLE_KEY`

## 2. Rodar localmente

```bash
npm install
cp .env.local.example .env.local
# edite .env.local com a URL e a service role key copiadas acima
npm run dev
```

Acesse `http://localhost:3000`.

## 3. Deploy na Vercel

1. Suba este projeto pra um repositório Git (GitHub/GitLab/Bitbucket).
2. Na Vercel, **New Project** → importe o repositório (ele detecta Next.js
   automaticamente, não precisa configurar build command).
3. Em **Environment Variables**, adicione:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. Pronto — front e API estão no mesmo domínio (`*.vercel.app` ou o
   domínio que você configurar), então **não existe problema de CORS**: as
   chamadas de `lib/api.ts` são para o mesmo domínio (`/api/...`).

## Por que a service role key é segura aqui

Ela só é importada em `lib/supabaseServer.ts`, que só é usado dentro de
`src/app/api/**/route.ts` (código que roda no servidor da Vercel). Nenhum
componente `"use client"` importa esse arquivo, então a chave nunca é
enviada ao navegador. Por isso a variável **não** tem o prefixo
`NEXT_PUBLIC_` — variáveis sem esse prefixo ficam só no servidor.

## Observações

- Não há autenticação — qualquer pessoa com o link do deploy consegue ler e
  editar as respostas. Se o painel for ficar acessível publicamente, vale
  adicionar login antes (ex.: Supabase Auth com um middleware do Next
  protegendo `/`).
- RLS (Row Level Security) do Supabase não entra em jogo aqui porque o
  acesso é sempre via service role key (servidor), que ignora RLS. Só
  precisa se preocupar com isso se um dia algum código do navegador passar
  a falar direto com o Supabase usando a chave `anon`.
- O filtro por palavra-chave e por data (De/Até) roda no navegador, sobre os
  dados já carregados — mesmo comportamento da versão anterior em React puro.
