-- ============================================
-- SETUP INICIAL DO SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- para criar as tabelas e políticas RLS

-- ============================================
-- 1. TABELA DE PERFIS (profiles)
-- ============================================
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  role text not null check (role in ('admin', 'gestor', 'colaborador', 'cliente')) default 'colaborador',
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS para profiles
alter table profiles enable row level security;

-- Função helper para checar admin sem recursão de RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Usuários podem ver seu próprio perfil" on profiles;
drop policy if exists "Admins podem ver todos os perfis" on profiles;
drop policy if exists "Admins podem atualizar perfis" on profiles;

create policy "Usuários podem ver seu próprio perfil"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Admins podem ver todos os perfis"
  on profiles for select
  using (public.is_admin());

create policy "Admins podem atualizar perfis"
  on profiles for update
  using (public.is_admin());

-- Trigger para criar perfil automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, role)
  values (new.id, 'colaborador');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 2. TABELA DE PLANOS DE AÇÃO (action_plans)
-- ============================================
create table if not exists action_plans (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text not null check (status in ('pending', 'in_progress', 'completed', 'cancelled')) default 'pending',
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  responsible text,
  due_date date,
  completed_at timestamp with time zone,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS para action_plans
alter table action_plans enable row level security;

drop policy if exists "Usuários podem ver seus próprios planos" on action_plans;
drop policy if exists "Usuários podem criar seus próprios planos" on action_plans;
drop policy if exists "Usuários podem atualizar seus próprios planos" on action_plans;
drop policy if exists "Usuários podem deletar seus próprios planos" on action_plans;

create policy "Usuários podem ver seus próprios planos"
  on action_plans for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar seus próprios planos"
  on action_plans for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios planos"
  on action_plans for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios planos"
  on action_plans for delete
  using (auth.uid() = user_id);

-- ============================================
-- 3. TABELA DE METAS (goals)
-- ============================================
create table if not exists goals (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  target_value numeric not null,
  current_value numeric default 0,
  unit text not null, -- Ex: 'R$', '%', 'unidades'
  category text not null, -- Ex: 'vendas', 'producao', 'qualidade'
  period text not null check (period in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  start_date date not null,
  end_date date not null,
  status text not null check (status in ('active', 'paused', 'completed', 'cancelled')) default 'active',
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS para goals
alter table goals enable row level security;

drop policy if exists "Usuários podem ver suas próprias metas" on goals;
drop policy if exists "Usuários podem criar suas próprias metas" on goals;
drop policy if exists "Usuários podem atualizar suas próprias metas" on goals;
drop policy if exists "Usuários podem deletar suas próprias metas" on goals;

create policy "Usuários podem ver suas próprias metas"
  on goals for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar suas próprias metas"
  on goals for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias metas"
  on goals for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias metas"
  on goals for delete
  using (auth.uid() = user_id);

-- ============================================
-- 4. TABELA DE INDICADORES (indicators)
-- ============================================
create table if not exists indicators (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  value numeric not null,
  previous_value numeric,
  unit text not null,
  category text not null,
  trend text check (trend in ('up', 'down', 'stable')),
  date date not null default current_date,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS para indicators
alter table indicators enable row level security;

drop policy if exists "Usuários podem ver seus próprios indicadores" on indicators;
drop policy if exists "Usuários podem criar seus próprios indicadores" on indicators;
drop policy if exists "Usuários podem atualizar seus próprios indicadores" on indicators;
drop policy if exists "Usuários podem deletar seus próprios indicadores" on indicators;

create policy "Usuários podem ver seus próprios indicadores"
  on indicators for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar seus próprios indicadores"
  on indicators for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios indicadores"
  on indicators for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios indicadores"
  on indicators for delete
  using (auth.uid() = user_id);

-- ============================================
-- 5. TABELA DE CONTEXTOS (context_store)
-- ============================================
create table if not exists context_store (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  data jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS para context_store
alter table context_store enable row level security;

drop policy if exists "Usuários autenticados podem ler contextos" on context_store;
drop policy if exists "Admins podem inserir contextos" on context_store;
drop policy if exists "Admins podem atualizar contextos" on context_store;
drop policy if exists "Admins podem deletar contextos" on context_store;

create policy "Usuários autenticados podem ler contextos"
  on context_store for select
  to authenticated
  using (true);

create policy "Admins podem inserir contextos"
  on context_store for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins podem atualizar contextos"
  on context_store for update
  to authenticated
  using (public.is_admin());

create policy "Admins podem deletar contextos"
  on context_store for delete
  to authenticated
  using (public.is_admin());

-- ============================================
-- 6. ÍNDICES PARA PERFORMANCE
-- ============================================
create index if not exists idx_profiles_user_id on profiles(user_id);
create index if not exists idx_action_plans_user_id on action_plans(user_id);
create index if not exists idx_action_plans_status on action_plans(status);
create index if not exists idx_goals_user_id on goals(user_id);
create index if not exists idx_goals_period on goals(period);
create index if not exists idx_indicators_user_id on indicators(user_id);
create index if not exists idx_indicators_date on indicators(date);

-- ============================================
-- 7. FUNÇÕES AUXILIARES
-- ============================================

-- Atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_action_plans_updated_at on action_plans;
create trigger update_action_plans_updated_at before update on action_plans
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_goals_updated_at on goals;
create trigger update_goals_updated_at before update on goals
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_indicators_updated_at on indicators;
create trigger update_indicators_updated_at before update on indicators
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_context_store_updated_at on context_store;
create trigger update_context_store_updated_at before update on context_store
  for each row execute procedure update_updated_at_column();

-- ============================================
-- SETUP CONCLUÍDO!
-- ============================================
-- Próximos passos:
-- 1. Copie .env.example para .env
-- 2. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
-- 3. Rode npm install && npm run dev
-- 4. Crie um usuário via tela de login
-- 5. O perfil será criado automaticamente
-- 6. Alimente a tabela context_store com os JSONs de /public/data
