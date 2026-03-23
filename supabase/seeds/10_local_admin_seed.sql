-- ============================================================
-- SEED 10 — Usuário Admin Local (ambiente de desenvolvimento)
-- Data: 2026-03-21
-- ATENÇÃO: Este seed é EXCLUSIVO para ambiente local/Docker.
--          NÃO aplicar em produção.
--
-- Credenciais:
--   Email:  admin@pe2026.local
--   Senha:  pe2026@admin
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_user_id UUID := 'a0000000-0000-0000-0000-000000000001';
  v_email   TEXT := 'admin@pe2026.local';
  v_now     TIMESTAMPTZ := now();
BEGIN
  -- Inserir usuário no auth.users (apenas se não existir)
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    is_sso_user,
    is_anonymous,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    phone
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    v_email,
    crypt('pe2026@admin', gen_salt('bf', 10)),
    v_now,
    v_now,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Admin PE2026","role":"admin"}'::jsonb,
    false,
    v_now,
    v_now,
    false,
    false,
    '',
    '',
    '',
    '',
    NULL
  )
  ON CONFLICT (id) DO UPDATE
    SET encrypted_password = crypt('pe2026@admin', gen_salt('bf', 10)),
        email_confirmed_at = COALESCE(auth.users.email_confirmed_at, v_now),
        updated_at         = v_now;

  -- Inserir identidade (necessário para Supabase GoTrue)
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_user_id,
    v_email,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
    'email',
    v_now,
    v_now,
    v_now
  )
  ON CONFLICT (provider_id, provider) DO NOTHING;

  -- Inserir perfil admin em public.profiles
  INSERT INTO public.profiles (
    id,
    user_id,
    role,
    active,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    'admin',
    true,
    v_now,
    v_now
  )
  ON CONFLICT (user_id) DO UPDATE
    SET role    = 'admin',
        active  = true,
        updated_at = v_now;

  RAISE NOTICE '[Seed 10] ✓ Usuário admin criado/atualizado';
  RAISE NOTICE '[Seed 10]   Email: %', v_email;
  RAISE NOTICE '[Seed 10]   Senha: pe2026@admin';
  RAISE NOTICE '[Seed 10]   UUID:  %', v_user_id;
END $$;

COMMIT;
