-- ============================================
-- EXTENSÕES PARA ADMINISTRAÇÃO E COMENTÁRIOS
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- para adicionar funcionalidades de admin e comentários

-- ============================================
-- 1. TABELA DE COMENTÁRIOS
-- ============================================
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  action_plan_id uuid references action_plans(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Índices para performance
create index if not exists comments_action_plan_id_idx on comments(action_plan_id);
create index if not exists comments_user_id_idx on comments(user_id);
create index if not exists comments_created_at_idx on comments(created_at desc);

-- RLS para comments
alter table comments enable row level security;

drop policy if exists "Usuários podem ver comentários dos seus planos" on comments;
drop policy if exists "Usuários podem criar comentários" on comments;
drop policy if exists "Usuários podem atualizar seus comentários" on comments;
drop policy if exists "Usuários podem deletar seus comentários" on comments;

-- Usuários podem ver comentários dos planos que têm acesso
create policy "Usuários podem ver comentários dos seus planos"
  on comments for select
  using (
    exists (
      select 1 from action_plans
      where action_plans.id = comments.action_plan_id
      and action_plans.user_id = auth.uid()
    )
  );

-- Usuários podem criar comentários nos seus planos
create policy "Usuários podem criar comentários"
  on comments for insert
  with check (
    exists (
      select 1 from action_plans
      where action_plans.id = comments.action_plan_id
      and action_plans.user_id = auth.uid()
    )
    and user_id = auth.uid()
  );

-- Usuários podem atualizar seus próprios comentários
create policy "Usuários podem atualizar seus comentários"
  on comments for update
  using (user_id = auth.uid());

-- Usuários podem deletar seus próprios comentários
create policy "Usuários podem deletar seus comentários"
  on comments for delete
  using (user_id = auth.uid());

-- Trigger para updated_at
drop trigger if exists update_comments_updated_at on comments;
create trigger update_comments_updated_at
  before update on comments
  for each row
  execute procedure update_updated_at_column();

-- ============================================
-- 2. TABELA DE ANEXOS
-- ============================================
create table if not exists attachments (
  id uuid default gen_random_uuid() primary key,
  filename text not null,
  file_path text not null,
  file_size integer not null,
  mime_type text not null,
  action_plan_id uuid references action_plans(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now()
);

-- Índices
create index if not exists attachments_action_plan_id_idx on attachments(action_plan_id);
create index if not exists attachments_user_id_idx on attachments(user_id);

-- RLS para attachments
alter table attachments enable row level security;

drop policy if exists "Usuários podem ver anexos dos seus planos" on attachments;
drop policy if exists "Usuários podem criar anexos" on attachments;
drop policy if exists "Usuários podem deletar seus anexos" on attachments;

-- Políticas similares aos comentários
create policy "Usuários podem ver anexos dos seus planos"
  on attachments for select
  using (
    exists (
      select 1 from action_plans
      where action_plans.id = attachments.action_plan_id
      and action_plans.user_id = auth.uid()
    )
  );

create policy "Usuários podem criar anexos"
  on attachments for insert
  with check (
    exists (
      select 1 from action_plans
      where action_plans.id = attachments.action_plan_id
      and action_plans.user_id = auth.uid()
    )
    and user_id = auth.uid()
  );

create policy "Usuários podem deletar seus anexos"
  on attachments for delete
  using (user_id = auth.uid());

-- ============================================
-- 3. FUNÇÃO PARA ADMINS GERENCIAREM USUÁRIOS
-- ============================================

-- Função para listar todos os perfis (apenas admins)
create or replace function get_all_profiles()
returns table (
  id uuid,
  user_id uuid,
  email text,
  role text,
  active boolean,
  created_at timestamp with time zone
)
language plpgsql
security definer
as $$
begin
  -- Verificar se o usuário é admin
  if not public.is_admin() then
    raise exception 'Acesso negado: apenas administradores';
  end if;

  return query
  select 
    p.id,
    p.user_id,
    u.email,
    p.role,
    p.active,
    p.created_at
  from profiles p
  join auth.users u on u.id = p.user_id
  order by p.created_at desc;
end;
$$;

-- Função para atualizar role de usuário (apenas admins)
create or replace function update_user_role(
  target_user_id uuid,
  new_role text
)
returns void
language plpgsql
security definer
as $$
begin
  -- Verificar se o usuário é admin
  if not public.is_admin() then
    raise exception 'Acesso negado: apenas administradores';
  end if;

  -- Validar role
  if new_role not in ('admin', 'gestor', 'colaborador', 'cliente') then
    raise exception 'Role inválida';
  end if;

  -- Atualizar role
  update profiles
  set role = new_role, updated_at = now()
  where user_id = target_user_id;
end;
$$;

-- Função para ativar/desativar usuário (apenas admins)
create or replace function toggle_user_active(
  target_user_id uuid,
  is_active boolean
)
returns void
language plpgsql
security definer
as $$
begin
  -- Verificar se o usuário é admin
  if not public.is_admin() then
    raise exception 'Acesso negado: apenas administradores';
  end if;

  -- Atualizar status
  update profiles
  set active = is_active, updated_at = now()
  where user_id = target_user_id;
end;
$$;

-- ============================================
-- 4. VIEWS ÚTEIS
-- ============================================

-- View de comentários com informações do usuário
create or replace view comments_with_user
with (security_invoker = true) as
select 
  c.id,
  c.content,
  c.action_plan_id,
  c.user_id,
  c.created_at,
  c.updated_at,
  u.email as user_email,
  p.role as user_role
from comments c
join auth.users u on u.id = c.user_id
join profiles p on p.user_id = c.user_id;

-- View de anexos com informações
create or replace view attachments_with_user
with (security_invoker = true) as
select 
  a.id,
  a.filename,
  a.file_path,
  a.file_size,
  a.mime_type,
  a.action_plan_id,
  a.user_id,
  a.created_at,
  u.email as user_email
from attachments a
join auth.users u on u.id = a.user_id;

-- ============================================
-- CONCLUÍDO
-- ============================================
-- Agora você tem:
-- ✅ Tabela de comentários com RLS
-- ✅ Tabela de anexos com RLS
-- ✅ Funções para admins gerenciarem usuários
-- ✅ Views úteis para consultas

-- Próximos passos no código:
-- 1. Criar componentes de comentários
-- 2. Criar componente de upload
-- 3. Criar página de administração
