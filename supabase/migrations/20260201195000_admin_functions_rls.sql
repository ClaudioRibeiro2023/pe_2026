-- ============================================
-- AJUSTE DAS FUNÇÕES ADMIN (RLS)
-- ============================================
-- Garante uso de public.is_admin() para evitar recursão de RLS.

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

create or replace function update_user_role(
  target_user_id uuid,
  new_role text
)
returns void
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso negado: apenas administradores';
  end if;

  if new_role not in ('admin', 'gestor', 'colaborador', 'cliente') then
    raise exception 'Role inválida';
  end if;

  update profiles
  set role = new_role, updated_at = now()
  where user_id = target_user_id;
end;
$$;

create or replace function toggle_user_active(
  target_user_id uuid,
  is_active boolean
)
returns void
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso negado: apenas administradores';
  end if;

  update profiles
  set active = is_active, updated_at = now()
  where user_id = target_user_id;
end;
$$;
