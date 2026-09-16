-- Rode isso no SQL Editor do Supabase (Project > SQL Editor > New query)

create table if not exists assuntos (
  id bigint generated always as identity primary key,
  nome text not null unique
);

create table if not exists respostas (
  id bigint generated always as identity primary key,
  pergunta text not null,
  resposta text not null,
  data date not null default current_date,
  assunto_id bigint not null references assuntos (id) on delete cascade
);

create index if not exists idx_respostas_assunto_id on respostas (assunto_id);

-- Seed opcional dos assuntos que vocês já usam:
insert into assuntos (nome) values ('ESTAGIO'), ('FINANCEIRO'), ('SIMULADO')
on conflict (nome) do nothing;

-- Observação sobre RLS (Row Level Security):
-- Se você criar as tabelas pela UI do Supabase (Table Editor), o RLS costuma vir
-- desabilitado por padrão; criando via SQL Editor também vem desabilitado.
-- Isso não afeta esta aplicação porque o Next.js acessa o banco pela
-- SUPABASE_SERVICE_ROLE_KEY (só no servidor), que ignora RLS.
-- Só ative RLS se, no futuro, algum código do navegador for falar direto
-- com o Supabase usando a chave anônima.
