-- ============================================================
-- PE_2026 — Schema Migration v2 (corrigido)
-- Gerado a partir do diagnóstico de 2026-02-06
-- ============================================================
-- Execução: Supabase SQL Editor → colar e rodar
-- IMPORTANTE: Executar ESTE arquivo INTEIRO de uma vez.
-- Ordem de dependências está correta nesta versão.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. COLUNA: profiles.area_id (PRIMEIRO — outras deps usam isso)
-- ────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'area_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN area_id uuid;
  END IF;
END $$;

-- Adicionar FK só se areas existir (seguro)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'areas')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_area_id_fkey' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.areas(id);
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- 2. FUNÇÃO: user_area_id() (APÓS coluna area_id existir)
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.user_area_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT area_id FROM public.profiles WHERE user_id = auth.uid()
$$;

-- ────────────────────────────────────────────────────────────
-- 3. TABELA: pillars (pilares estratégicos)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pillars (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code       text NOT NULL UNIQUE,
  title      text NOT NULL,
  frontier   text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pillars_select_all" ON public.pillars;
CREATE POLICY "pillars_select_all" ON public.pillars
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "pillars_admin_all" ON public.pillars;
CREATE POLICY "pillars_admin_all" ON public.pillars
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- 4. TABELA: plan_actions (ações dos planos)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plan_actions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id           uuid NOT NULL REFERENCES public.area_plans(id) ON DELETE CASCADE,
  pillar_id         uuid REFERENCES public.pillars(id),
  area_okr_id       uuid,
  initiative_id     uuid,
  parent_action_id  uuid REFERENCES public.plan_actions(id),
  pack_id           text,
  program_key       text,
  objective_key     text,
  section_id        text,
  node_type         text NOT NULL DEFAULT 'acao',
  title             text NOT NULL,
  description       text,
  status            text NOT NULL DEFAULT 'PENDENTE',
  priority          text NOT NULL DEFAULT 'P1',
  responsible       text,
  assigned_to       text,
  start_date        date,
  due_date          date,
  completed_at      timestamptz,
  progress          integer NOT NULL DEFAULT 0,
  evidence_required boolean NOT NULL DEFAULT false,
  notes             text,
  cost_estimate     numeric,
  cost_actual       numeric,
  cost_type         text,
  currency          text NOT NULL DEFAULT 'BRL',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plan_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plan_actions_select_all" ON public.plan_actions;
CREATE POLICY "plan_actions_select_all" ON public.plan_actions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "plan_actions_admin_all" ON public.plan_actions;
CREATE POLICY "plan_actions_admin_all" ON public.plan_actions
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- 5. TABELA: context_store
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.context_store (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,
  data       jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.context_store ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "context_store_select_all" ON public.context_store;
CREATE POLICY "context_store_select_all" ON public.context_store
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "context_store_admin_all" ON public.context_store;
CREATE POLICY "context_store_admin_all" ON public.context_store
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- 6. STORAGE: bucket action-evidences
-- ────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('action-evidences', 'action-evidences', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "evidence_upload" ON storage.objects;
CREATE POLICY "evidence_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'action-evidences' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "evidence_select" ON storage.objects;
CREATE POLICY "evidence_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'action-evidences' AND auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────
-- 7. INDEXES
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_plan_actions_plan_id ON public.plan_actions(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_actions_status ON public.plan_actions(status);
CREATE INDEX IF NOT EXISTS idx_plan_actions_pack_id ON public.plan_actions(pack_id);
CREATE INDEX IF NOT EXISTS idx_context_store_slug ON public.context_store(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_area_id ON public.profiles(area_id);
