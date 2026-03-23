-- ============================================================
-- MIGRATION CONSOLIDADA: PE Aero 2026
-- Versão: 1.0.0
-- Data: 2026-02-05
-- Descrição: Schema completo unificado para a plataforma PE Aero 2026
-- ============================================================

-- ============================================================
-- PARTE 1: FUNÇÕES UTILITÁRIAS
-- ============================================================

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Função para trigger de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- PARTE 2: TABELAS BASE
-- ============================================================

-- 2.1 Tabela: profiles (perfis de usuários)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gestor', 'colaborador', 'cliente')) DEFAULT 'colaborador',
  area_id UUID,
  area_role TEXT CHECK (area_role IN ('gestor', 'colaborador')) DEFAULT 'colaborador',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS area_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS area_role TEXT CHECK (area_role IN ('gestor', 'colaborador')) DEFAULT 'colaborador';

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_area_id ON public.profiles(area_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2.2 Tabela: areas (áreas organizacionais)
CREATE TABLE IF NOT EXISTS public.areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  owner TEXT,
  focus TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.areas ADD COLUMN IF NOT EXISTS owner TEXT;
ALTER TABLE public.areas ADD COLUMN IF NOT EXISTS focus TEXT;
ALTER TABLE public.areas ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6';

CREATE INDEX IF NOT EXISTS idx_areas_slug ON public.areas(slug);

ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "areas_select_all" ON public.areas;
CREATE POLICY "areas_select_all" ON public.areas
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "areas_insert_admin" ON public.areas;
CREATE POLICY "areas_insert_admin" ON public.areas
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "areas_update_admin" ON public.areas;
CREATE POLICY "areas_update_admin" ON public.areas
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "areas_delete_admin" ON public.areas;
CREATE POLICY "areas_delete_admin" ON public.areas
  FOR DELETE USING (public.is_admin());

DROP TRIGGER IF EXISTS set_areas_updated_at ON public.areas;
CREATE TRIGGER set_areas_updated_at
  BEFORE UPDATE ON public.areas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Adicionar FK de profiles para areas
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_area_id_fkey;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.areas(id);

-- 2.3 Tabela: pillars (pilares estratégicos)
CREATE TABLE IF NOT EXISTS public.pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  frontier TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.pillars ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.pillars ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Compatibilidade: adicionar constraint UNIQUE se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pillars_code_key'
  ) THEN
    ALTER TABLE public.pillars ADD CONSTRAINT pillars_code_key UNIQUE (code);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_pillars_code ON public.pillars(code);

ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pillars_select_all" ON public.pillars;
CREATE POLICY "pillars_select_all" ON public.pillars
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "pillars_modify_admin" ON public.pillars;
CREATE POLICY "pillars_modify_admin" ON public.pillars
  FOR ALL USING (public.is_admin());

DROP TRIGGER IF EXISTS set_pillars_updated_at ON public.pillars;
CREATE TRIGGER set_pillars_updated_at
  BEFORE UPDATE ON public.pillars
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2.4 Tabela: subpillars (subpilares)
CREATE TABLE IF NOT EXISTS public.subpillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  frontier TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.subpillars ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.subpillars ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Compatibilidade: adicionar constraint UNIQUE se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'subpillars_code_key'
  ) THEN
    ALTER TABLE public.subpillars ADD CONSTRAINT subpillars_code_key UNIQUE (code);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_subpillars_pillar ON public.subpillars(pillar_id);

ALTER TABLE public.subpillars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subpillars_select_all" ON public.subpillars;
CREATE POLICY "subpillars_select_all" ON public.subpillars
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "subpillars_modify_admin" ON public.subpillars;
CREATE POLICY "subpillars_modify_admin" ON public.subpillars
  FOR ALL USING (public.is_admin());

-- 2.5 Tabela: plan_templates (templates de hierarquia)
CREATE TABLE IF NOT EXISTS public.plan_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  structure JSONB NOT NULL DEFAULT '["acao"]',
  is_default BOOLEAN DEFAULT false,
  icon TEXT DEFAULT 'layers',
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.plan_templates ADD COLUMN IF NOT EXISTS structure JSONB NOT NULL DEFAULT '["acao"]';
ALTER TABLE public.plan_templates ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
ALTER TABLE public.plan_templates ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'layers';
ALTER TABLE public.plan_templates ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#8B5CF6';

ALTER TABLE public.plan_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plan_templates_select_all" ON public.plan_templates;
CREATE POLICY "plan_templates_select_all" ON public.plan_templates
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "plan_templates_modify_admin" ON public.plan_templates;
CREATE POLICY "plan_templates_modify_admin" ON public.plan_templates
  FOR ALL USING (public.is_admin());

DROP TRIGGER IF EXISTS set_plan_templates_updated_at ON public.plan_templates;
CREATE TRIGGER set_plan_templates_updated_at
  BEFORE UPDATE ON public.plan_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- PARTE 3: TABELAS DE OKRs
-- ============================================================

-- 3.1 Tabela: corporate_okrs (OKRs corporativos)
CREATE TABLE IF NOT EXISTS public.corporate_okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID REFERENCES public.pillars(id),
  objective TEXT NOT NULL,
  owner TEXT,
  priority TEXT DEFAULT 'Alta',
  status TEXT DEFAULT 'EM_ANDAMENTO',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.corporate_okrs ADD COLUMN IF NOT EXISTS owner TEXT;
ALTER TABLE public.corporate_okrs ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Alta';
ALTER TABLE public.corporate_okrs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'EM_ANDAMENTO';

CREATE INDEX IF NOT EXISTS idx_corporate_okrs_pillar ON public.corporate_okrs(pillar_id);

ALTER TABLE public.corporate_okrs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "corporate_okrs_select_all" ON public.corporate_okrs;
CREATE POLICY "corporate_okrs_select_all" ON public.corporate_okrs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "corporate_okrs_modify_admin" ON public.corporate_okrs;
CREATE POLICY "corporate_okrs_modify_admin" ON public.corporate_okrs
  FOR ALL USING (public.is_admin());

-- 3.2 Tabela: key_results (resultados-chave)
CREATE TABLE IF NOT EXISTS public.key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID NOT NULL REFERENCES public.corporate_okrs(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  target TEXT,
  current_value TEXT,
  status TEXT DEFAULT 'EM_ANDAMENTO',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.key_results ADD COLUMN IF NOT EXISTS current_value TEXT;
ALTER TABLE public.key_results ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'EM_ANDAMENTO';
ALTER TABLE public.key_results ADD COLUMN IF NOT EXISTS due_date DATE;

CREATE INDEX IF NOT EXISTS idx_key_results_okr ON public.key_results(okr_id);

ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "key_results_select_all" ON public.key_results;
CREATE POLICY "key_results_select_all" ON public.key_results
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "key_results_modify_admin" ON public.key_results;
CREATE POLICY "key_results_modify_admin" ON public.key_results
  FOR ALL USING (public.is_admin());

-- 3.3 Tabela: area_okrs (OKRs por área)
CREATE TABLE IF NOT EXISTS public.area_okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
  objective TEXT NOT NULL,
  status TEXT DEFAULT 'EM_ANDAMENTO',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.area_okrs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'EM_ANDAMENTO';
ALTER TABLE public.area_okrs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.area_okrs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_area_okrs_area ON public.area_okrs(area_id);

ALTER TABLE public.area_okrs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "area_okrs_select_all" ON public.area_okrs;
CREATE POLICY "area_okrs_select_all" ON public.area_okrs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "area_okrs_modify_admin" ON public.area_okrs;
CREATE POLICY "area_okrs_modify_admin" ON public.area_okrs
  FOR ALL USING (public.is_admin());

-- 3.4 Tabela: initiatives (iniciativas estratégicas)
CREATE TABLE IF NOT EXISTS public.initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('MET', 'SIS', 'ORG', 'PRO')),
  priority TEXT CHECK (priority IN ('P0', 'P1', 'P2')),
  pillar_id UUID REFERENCES public.pillars(id),
  okr_code TEXT,
  kr_code TEXT,
  owner TEXT,
  sponsor TEXT,
  status TEXT DEFAULT 'EM_ANDAMENTO',
  start_date DATE,
  end_date DATE,
  effort TEXT CHECK (effort IN ('BAIXO', 'MEDIO', 'ALTO')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('MET', 'SIS', 'ORG', 'PRO'));
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('P0', 'P1', 'P2'));
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS okr_code TEXT;
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS kr_code TEXT;
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS sponsor TEXT;
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'EM_ANDAMENTO';
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS effort TEXT CHECK (effort IN ('BAIXO', 'MEDIO', 'ALTO'));

CREATE INDEX IF NOT EXISTS idx_initiatives_pillar ON public.initiatives(pillar_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_status ON public.initiatives(status);

ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "initiatives_select_all" ON public.initiatives;
CREATE POLICY "initiatives_select_all" ON public.initiatives
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "initiatives_modify_admin" ON public.initiatives;
CREATE POLICY "initiatives_modify_admin" ON public.initiatives
  FOR ALL USING (public.is_admin());

-- ============================================================
-- PARTE 4: PLANOS DE AÇÃO POR ÁREA
-- ============================================================

-- 4.1 Tabela: area_plans (planos por área)
CREATE TABLE IF NOT EXISTS public.area_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'RASCUNHO' CHECK (status IN ('RASCUNHO', 'EM_APROVACAO', 'ATIVO', 'CONCLUIDO', 'ARQUIVADO')),
  template_id UUID REFERENCES public.plan_templates(id),
  created_by UUID REFERENCES auth.users(id),
  manager_approved_by UUID REFERENCES auth.users(id),
  manager_approved_at TIMESTAMPTZ,
  direction_approved_by UUID REFERENCES auth.users(id),
  direction_approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(area_id, year)
);

-- Compatibilidade: adicionar colunas opcionais se a tabela já existir
ALTER TABLE public.area_plans ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.plan_templates(id);
ALTER TABLE public.area_plans ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.area_plans ADD COLUMN IF NOT EXISTS manager_approved_by UUID REFERENCES auth.users(id);
ALTER TABLE public.area_plans ADD COLUMN IF NOT EXISTS manager_approved_at TIMESTAMPTZ;
ALTER TABLE public.area_plans ADD COLUMN IF NOT EXISTS direction_approved_by UUID REFERENCES auth.users(id);
ALTER TABLE public.area_plans ADD COLUMN IF NOT EXISTS direction_approved_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_area_plans_area ON public.area_plans(area_id);
CREATE INDEX IF NOT EXISTS idx_area_plans_year ON public.area_plans(year);
CREATE INDEX IF NOT EXISTS idx_area_plans_status ON public.area_plans(status);

ALTER TABLE public.area_plans ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_area_plans_updated_at ON public.area_plans;
CREATE TRIGGER set_area_plans_updated_at
  BEFORE UPDATE ON public.area_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4.2 Tabela: plan_actions (ações dos planos)
CREATE TABLE IF NOT EXISTS public.plan_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.area_plans(id) ON DELETE CASCADE,
  pillar_id UUID REFERENCES public.pillars(id),
  area_okr_id UUID REFERENCES public.area_okrs(id),
  initiative_id UUID REFERENCES public.initiatives(id),
  parent_action_id UUID REFERENCES public.plan_actions(id),
  node_type TEXT DEFAULT 'acao' CHECK (node_type IN ('macro', 'area', 'meta', 'pilar', 'acao')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'BLOQUEADA', 'AGUARDANDO_EVIDENCIA', 'EM_VALIDACAO', 'CONCLUIDA', 'CANCELADA')),
  priority TEXT NOT NULL DEFAULT 'P1' CHECK (priority IN ('P0', 'P1', 'P2')),
  responsible TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  evidence_required BOOLEAN DEFAULT true,
  notes TEXT,
  cost_estimate NUMERIC(12,2),
  cost_actual NUMERIC(12,2),
  cost_type TEXT CHECK (cost_type IN ('CAPEX', 'OPEX')),
  currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS pillar_id UUID REFERENCES public.pillars(id);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS area_okr_id UUID REFERENCES public.area_okrs(id);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS initiative_id UUID REFERENCES public.initiatives(id);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS parent_action_id UUID REFERENCES public.plan_actions(id);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS node_type TEXT DEFAULT 'acao' CHECK (node_type IN ('macro', 'area', 'meta', 'pilar', 'acao'));
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'BLOQUEADA', 'AGUARDANDO_EVIDENCIA', 'EM_VALIDACAO', 'CONCLUIDA', 'CANCELADA'));
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'P1' CHECK (priority IN ('P0', 'P1', 'P2'));
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS responsible TEXT;
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS evidence_required BOOLEAN DEFAULT true;
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS cost_estimate NUMERIC(12,2);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS cost_actual NUMERIC(12,2);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS cost_type TEXT CHECK (cost_type IN ('CAPEX', 'OPEX'));
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL';

CREATE INDEX IF NOT EXISTS idx_plan_actions_plan ON public.plan_actions(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_actions_status ON public.plan_actions(status);
CREATE INDEX IF NOT EXISTS idx_plan_actions_parent ON public.plan_actions(parent_action_id);
CREATE INDEX IF NOT EXISTS idx_plan_actions_node_type ON public.plan_actions(node_type);
CREATE INDEX IF NOT EXISTS idx_plan_actions_due_date ON public.plan_actions(due_date);
CREATE INDEX IF NOT EXISTS idx_plan_actions_pillar ON public.plan_actions(pillar_id);

ALTER TABLE public.plan_actions ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_plan_actions_updated_at ON public.plan_actions;
CREATE TRIGGER set_plan_actions_updated_at
  BEFORE UPDATE ON public.plan_actions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4.3 Tabela: action_subtasks (subtarefas)
CREATE TABLE IF NOT EXISTS public.action_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.plan_actions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.action_subtasks ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);
ALTER TABLE public.action_subtasks ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_action_subtasks_action ON public.action_subtasks(action_id);

ALTER TABLE public.action_subtasks ENABLE ROW LEVEL SECURITY;

-- 4.4 Tabela: action_evidences (evidências)
CREATE TABLE IF NOT EXISTS public.action_evidences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.plan_actions(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'EM_VALIDACAO', 'APROVADA', 'REPROVADA')),
  submitted_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.action_evidences ADD COLUMN IF NOT EXISTS storage_path TEXT;
ALTER TABLE public.action_evidences ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE public.action_evidences ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE public.action_evidences ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'EM_VALIDACAO', 'APROVADA', 'REPROVADA'));
ALTER TABLE public.action_evidences ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id);
ALTER TABLE public.action_evidences ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.action_evidences ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_action_evidences_action ON public.action_evidences(action_id);
CREATE INDEX IF NOT EXISTS idx_action_evidences_status ON public.action_evidences(status);

ALTER TABLE public.action_evidences ENABLE ROW LEVEL SECURITY;

-- 4.5 Tabela: evidence_approvals (aprovações de evidências)
CREATE TABLE IF NOT EXISTS public.evidence_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES public.action_evidences(id) ON DELETE CASCADE,
  approver_role TEXT NOT NULL CHECK (approver_role IN ('gestor', 'direcao')),
  status TEXT NOT NULL CHECK (status IN ('APROVADA', 'REPROVADA')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ DEFAULT now(),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.evidence_approvals ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE public.evidence_approvals ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.evidence_approvals ADD COLUMN IF NOT EXISTS note TEXT;

CREATE INDEX IF NOT EXISTS idx_evidence_approvals_evidence ON public.evidence_approvals(evidence_id);

ALTER TABLE public.evidence_approvals ENABLE ROW LEVEL SECURITY;

-- 4.6 Tabela: action_comments (comentários)
CREATE TABLE IF NOT EXISTS public.action_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.plan_actions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_action_comments_action ON public.action_comments(action_id);

ALTER TABLE public.action_comments ENABLE ROW LEVEL SECURITY;

-- 4.7 Tabela: action_risks (riscos)
CREATE TABLE IF NOT EXISTS public.action_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.plan_actions(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  probability TEXT CHECK (probability IN ('BAIXA', 'MEDIA', 'ALTA')),
  impact TEXT CHECK (impact IN ('BAIXO', 'MEDIO', 'ALTO')),
  mitigation TEXT,
  status TEXT DEFAULT 'ABERTO' CHECK (status IN ('ABERTO', 'MITIGADO', 'OCORRIDO', 'FECHADO')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar coluna created_by se a tabela já existir
ALTER TABLE public.action_risks ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_action_risks_action ON public.action_risks(action_id);

ALTER TABLE public.action_risks ENABLE ROW LEVEL SECURITY;

-- 4.8 Tabela: action_dependencies (dependências)
CREATE TABLE IF NOT EXISTS public.action_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.plan_actions(id) ON DELETE CASCADE,
  depends_on_action_id UUID NOT NULL REFERENCES public.plan_actions(id) ON DELETE CASCADE,
  dependency_type TEXT DEFAULT 'FINISH_TO_START',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(action_id, depends_on_action_id)
);

CREATE INDEX IF NOT EXISTS idx_action_dependencies_action ON public.action_dependencies(action_id);
CREATE INDEX IF NOT EXISTS idx_action_dependencies_depends ON public.action_dependencies(depends_on_action_id);

ALTER TABLE public.action_dependencies ENABLE ROW LEVEL SECURITY;

-- 4.9 Tabela: action_history (histórico de alterações)
CREATE TABLE IF NOT EXISTS public.action_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.plan_actions(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.action_history ADD COLUMN IF NOT EXISTS changed_by UUID REFERENCES auth.users(id);
ALTER TABLE public.action_history ADD COLUMN IF NOT EXISTS changed_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_action_history_action ON public.action_history(action_id);
CREATE INDEX IF NOT EXISTS idx_action_history_changed_at ON public.action_history(changed_at);

ALTER TABLE public.action_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PARTE 5: MÓDULO LEGADO (action_plans)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date DATE,
  assigned_to TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Flag para migração
  migrated_to_area_plan_id UUID REFERENCES public.area_plans(id),
  is_deprecated BOOLEAN DEFAULT false
);

-- Compatibilidade: adicionar colunas se a tabela já existir
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS migrated_to_area_plan_id UUID REFERENCES public.area_plans(id);
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS is_deprecated BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_action_plans_status ON public.action_plans(status);
CREATE INDEX IF NOT EXISTS idx_action_plans_created_by ON public.action_plans(created_by);

ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "action_plans_select_auth" ON public.action_plans;
CREATE POLICY "action_plans_select_auth" ON public.action_plans
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "action_plans_insert_auth" ON public.action_plans;
CREATE POLICY "action_plans_insert_auth" ON public.action_plans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "action_plans_update_auth" ON public.action_plans;
CREATE POLICY "action_plans_update_auth" ON public.action_plans
  FOR UPDATE TO authenticated USING (auth.uid() = created_by OR public.is_admin());

DROP TRIGGER IF EXISTS set_action_plans_updated_at ON public.action_plans;
CREATE TRIGGER set_action_plans_updated_at
  BEFORE UPDATE ON public.action_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Comentários do módulo legado
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id UUID NOT NULL REFERENCES public.action_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_auth" ON public.comments;
CREATE POLICY "comments_select_auth" ON public.comments
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert_auth" ON public.comments;
CREATE POLICY "comments_insert_auth" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Anexos do módulo legado
CREATE TABLE IF NOT EXISTS public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id UUID NOT NULL REFERENCES public.action_plans(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.attachments ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE public.attachments ADD COLUMN IF NOT EXISTS mime_type TEXT;
ALTER TABLE public.attachments ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id);

ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attachments_select_auth" ON public.attachments;
CREATE POLICY "attachments_select_auth" ON public.attachments
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "attachments_insert_auth" ON public.attachments;
CREATE POLICY "attachments_insert_auth" ON public.attachments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

-- ============================================================
-- PARTE 6: CONTEXT STORE E INDICADORES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.context_store (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_type TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.context_store ADD COLUMN IF NOT EXISTS context_type TEXT;
ALTER TABLE public.context_store ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE public.context_store ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_context_store_type ON public.context_store(context_type);

ALTER TABLE public.context_store ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "context_store_select_auth" ON public.context_store;
CREATE POLICY "context_store_select_auth" ON public.context_store
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "context_store_modify_admin" ON public.context_store;
CREATE POLICY "context_store_modify_admin" ON public.context_store
  FOR ALL USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  status TEXT DEFAULT 'active',
  due_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar coluna created_by se a tabela já existir
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "goals_select_auth" ON public.goals;
CREATE POLICY "goals_select_auth" ON public.goals
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "goals_modify_admin" ON public.goals;
CREATE POLICY "goals_modify_admin" ON public.goals
  FOR ALL USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  value NUMERIC,
  target NUMERIC,
  unit TEXT,
  frequency TEXT DEFAULT 'monthly',
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibilidade: adicionar colunas se a tabela já existir sem elas
ALTER TABLE public.indicators ADD COLUMN IF NOT EXISTS goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL;

ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "indicators_select_auth" ON public.indicators;
CREATE POLICY "indicators_select_auth" ON public.indicators
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "indicators_modify_admin" ON public.indicators;
CREATE POLICY "indicators_modify_admin" ON public.indicators
  FOR ALL USING (public.is_admin());

-- ============================================================
-- PARTE 7: FUNÇÕES AUXILIARES PARA RLS
-- ============================================================

-- Obter área do usuário atual
CREATE OR REPLACE FUNCTION public.user_area_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT area_id FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Verificar se usuário é gestor da área
CREATE OR REPLACE FUNCTION public.is_area_manager()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND area_role = 'gestor'
  );
$$;

-- Obter área de uma ação
CREATE OR REPLACE FUNCTION public.action_area_id(p_action_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT ap.area_id
  FROM public.plan_actions pa
  JOIN public.area_plans ap ON ap.id = pa.plan_id
  WHERE pa.id = p_action_id;
$$;

-- Verificar acesso ao plano
CREATE OR REPLACE FUNCTION public.can_access_plan(plan_area_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role TEXT;
  v_area_id UUID;
BEGIN
  SELECT role, area_id INTO v_role, v_area_id
  FROM public.profiles WHERE user_id = auth.uid();

  IF v_role = 'admin' THEN RETURN true; END IF;
  IF v_role IN ('gestor', 'colaborador') AND v_area_id = plan_area_id THEN RETURN true; END IF;
  RETURN false;
END;
$$;

-- ============================================================
-- PARTE 8: POLÍTICAS RLS PARA AREA_PLANS E ACTIONS
-- ============================================================

-- Políticas para area_plans
DROP POLICY IF EXISTS "area_plans_select" ON public.area_plans;
CREATE POLICY "area_plans_select" ON public.area_plans
  FOR SELECT USING (public.can_access_plan(area_id));

DROP POLICY IF EXISTS "area_plans_insert" ON public.area_plans;
CREATE POLICY "area_plans_insert" ON public.area_plans
  FOR INSERT WITH CHECK (
    public.is_admin() OR (public.is_area_manager() AND area_id = public.user_area_id())
  );

DROP POLICY IF EXISTS "area_plans_update" ON public.area_plans;
CREATE POLICY "area_plans_update" ON public.area_plans
  FOR UPDATE USING (
    public.can_access_plan(area_id) AND (public.is_admin() OR public.is_area_manager())
  );

DROP POLICY IF EXISTS "area_plans_delete" ON public.area_plans;
CREATE POLICY "area_plans_delete" ON public.area_plans
  FOR DELETE USING (public.is_admin());

-- Políticas para plan_actions
DROP POLICY IF EXISTS "plan_actions_select" ON public.plan_actions;
CREATE POLICY "plan_actions_select" ON public.plan_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.area_plans ap
      WHERE ap.id = plan_id AND public.can_access_plan(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "plan_actions_insert" ON public.plan_actions;
CREATE POLICY "plan_actions_insert" ON public.plan_actions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.area_plans ap
      WHERE ap.id = plan_id AND public.can_access_plan(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "plan_actions_update" ON public.plan_actions;
CREATE POLICY "plan_actions_update" ON public.plan_actions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.area_plans ap
      WHERE ap.id = plan_id AND public.can_access_plan(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "plan_actions_delete" ON public.plan_actions;
CREATE POLICY "plan_actions_delete" ON public.plan_actions
  FOR DELETE USING (
    public.is_admin() OR public.is_area_manager()
  );

-- Políticas para subtasks, evidences, comments, risks
DROP POLICY IF EXISTS "action_subtasks_all" ON public.action_subtasks;
CREATE POLICY "action_subtasks_all" ON public.action_subtasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plan_actions pa
      JOIN public.area_plans ap ON ap.id = pa.plan_id
      WHERE pa.id = action_id AND public.can_access_plan(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "action_evidences_all" ON public.action_evidences;
CREATE POLICY "action_evidences_all" ON public.action_evidences
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plan_actions pa
      JOIN public.area_plans ap ON ap.id = pa.plan_id
      WHERE pa.id = action_id AND public.can_access_plan(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "evidence_approvals_all" ON public.evidence_approvals;
CREATE POLICY "evidence_approvals_all" ON public.evidence_approvals
  FOR ALL USING (
    public.is_admin() OR public.is_area_manager()
  );

DROP POLICY IF EXISTS "action_comments_all" ON public.action_comments;
CREATE POLICY "action_comments_all" ON public.action_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plan_actions pa
      JOIN public.area_plans ap ON ap.id = pa.plan_id
      WHERE pa.id = action_id AND public.can_access_plan(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "action_risks_all" ON public.action_risks;
CREATE POLICY "action_risks_all" ON public.action_risks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plan_actions pa
      JOIN public.area_plans ap ON ap.id = pa.plan_id
      WHERE pa.id = action_id AND public.can_access_plan(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "action_dependencies_all" ON public.action_dependencies;
CREATE POLICY "action_dependencies_all" ON public.action_dependencies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.plan_actions pa
      JOIN public.area_plans ap ON ap.id = pa.plan_id
      WHERE pa.id = action_id AND public.can_access_plan(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "action_history_select" ON public.action_history;
CREATE POLICY "action_history_select" ON public.action_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.plan_actions pa
      JOIN public.area_plans ap ON ap.id = pa.plan_id
      WHERE pa.id = action_id AND public.can_access_plan(ap.area_id)
    )
  );

-- ============================================================
-- PARTE 9: RPCs DE ADMINISTRAÇÃO
-- ============================================================

-- Listar todos os perfis (apenas admin)
DROP FUNCTION IF EXISTS public.get_all_profiles();
CREATE OR REPLACE FUNCTION public.get_all_profiles()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  role TEXT,
  active BOOLEAN,
  area_id UUID,
  area_name TEXT,
  area_role TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    u.email,
    p.role,
    p.active,
    p.area_id,
    a.name as area_name,
    p.area_role,
    p.created_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.user_id
  LEFT JOIN public.areas a ON a.id = p.area_id
  ORDER BY p.created_at DESC;
END;
$$;

-- Atualizar role do usuário
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  IF new_role NOT IN ('admin', 'gestor', 'colaborador', 'cliente') THEN
    RAISE EXCEPTION 'Role inválido';
  END IF;

  UPDATE public.profiles
  SET role = new_role, updated_at = now()
  WHERE user_id = target_user_id;
END;
$$;

-- Atualizar área e role na área do usuário
CREATE OR REPLACE FUNCTION public.update_user_area(
  target_user_id UUID,
  new_area_id UUID,
  new_area_role TEXT DEFAULT 'colaborador'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  IF new_area_role NOT IN ('gestor', 'colaborador') THEN
    RAISE EXCEPTION 'Area role inválido';
  END IF;

  UPDATE public.profiles
  SET 
    area_id = new_area_id,
    area_role = new_area_role,
    updated_at = now()
  WHERE user_id = target_user_id;
END;
$$;

-- Ativar/desativar usuário
CREATE OR REPLACE FUNCTION public.toggle_user_active(
  target_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_status BOOLEAN;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  UPDATE public.profiles
  SET active = NOT active, updated_at = now()
  WHERE user_id = target_user_id
  RETURNING active INTO new_status;

  RETURN new_status;
END;
$$;

-- ============================================================
-- PARTE 10: RPCs DE APROVAÇÃO DE PLANOS
-- ============================================================

-- Aprovar plano como gestor
CREATE OR REPLACE FUNCTION public.approve_plan_as_manager(p_plan_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan RECORD;
  v_user_area_id UUID;
  v_is_manager BOOLEAN;
BEGIN
  SELECT * INTO v_plan FROM public.area_plans WHERE id = p_plan_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano não encontrado');
  END IF;

  SELECT area_id, (area_role = 'gestor') INTO v_user_area_id, v_is_manager
  FROM public.profiles WHERE user_id = auth.uid();

  IF NOT v_is_manager OR v_user_area_id != v_plan.area_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas o gestor da área pode aprovar');
  END IF;

  IF v_plan.status != 'RASCUNHO' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano deve estar em RASCUNHO');
  END IF;

  UPDATE public.area_plans
  SET status = 'EM_APROVACAO', manager_approved_by = auth.uid(), manager_approved_at = now()
  WHERE id = p_plan_id;

  RETURN jsonb_build_object('success', true, 'message', 'Plano enviado para aprovação da direção');
END;
$$;

-- Aprovar plano como direção
CREATE OR REPLACE FUNCTION public.approve_plan_as_direction(p_plan_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas a direção pode aprovar');
  END IF;

  SELECT * INTO v_plan FROM public.area_plans WHERE id = p_plan_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano não encontrado');
  END IF;

  IF v_plan.status != 'EM_APROVACAO' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano deve estar EM_APROVACAO');
  END IF;

  UPDATE public.area_plans
  SET status = 'ATIVO', direction_approved_by = auth.uid(), direction_approved_at = now()
  WHERE id = p_plan_id;

  RETURN jsonb_build_object('success', true, 'message', 'Plano ativado com sucesso');
END;
$$;

-- Rejeitar plano
CREATE OR REPLACE FUNCTION public.reject_plan(p_plan_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas a direção pode rejeitar');
  END IF;

  SELECT * INTO v_plan FROM public.area_plans WHERE id = p_plan_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano não encontrado');
  END IF;

  IF v_plan.status != 'EM_APROVACAO' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano deve estar EM_APROVACAO');
  END IF;

  UPDATE public.area_plans
  SET status = 'RASCUNHO', manager_approved_by = NULL, manager_approved_at = NULL
  WHERE id = p_plan_id;

  RETURN jsonb_build_object('success', true, 'message', 'Plano rejeitado', 'reason', p_reason);
END;
$$;

-- ============================================================
-- PARTE 11: RPCs DE APROVAÇÃO DE EVIDÊNCIAS
-- ============================================================

CREATE OR REPLACE FUNCTION public.approve_evidence_as_manager(p_evidence_id UUID, p_note TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_evidence RECORD;
  v_action_area_id UUID;
  v_is_manager BOOLEAN;
  v_user_area_id UUID;
BEGIN
  SELECT * INTO v_evidence FROM public.action_evidences WHERE id = p_evidence_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência não encontrada');
  END IF;

  SELECT public.action_area_id(v_evidence.action_id) INTO v_action_area_id;

  SELECT area_id, (area_role = 'gestor') INTO v_user_area_id, v_is_manager
  FROM public.profiles WHERE user_id = auth.uid();

  IF NOT v_is_manager OR v_user_area_id != v_action_area_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas o gestor da área pode aprovar');
  END IF;

  IF EXISTS (SELECT 1 FROM public.evidence_approvals WHERE evidence_id = p_evidence_id AND approver_role = 'gestor') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Já aprovada pelo gestor');
  END IF;

  INSERT INTO public.evidence_approvals (evidence_id, approver_role, status, approved_by, note)
  VALUES (p_evidence_id, 'gestor', 'APROVADA', auth.uid(), p_note);

  UPDATE public.action_evidences SET status = 'EM_VALIDACAO' WHERE id = p_evidence_id;

  RETURN jsonb_build_object('success', true, 'message', 'Evidência aprovada pelo gestor');
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_evidence_as_direction(p_evidence_id UUID, p_note TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_evidence RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas a direção pode aprovar');
  END IF;

  SELECT * INTO v_evidence FROM public.action_evidences WHERE id = p_evidence_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência não encontrada');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.evidence_approvals 
    WHERE evidence_id = p_evidence_id AND approver_role = 'gestor' AND status = 'APROVADA'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Precisa aprovação do gestor primeiro');
  END IF;

  INSERT INTO public.evidence_approvals (evidence_id, approver_role, status, approved_by, note)
  VALUES (p_evidence_id, 'direcao', 'APROVADA', auth.uid(), p_note);

  UPDATE public.action_evidences SET status = 'APROVADA' WHERE id = p_evidence_id;
  UPDATE public.plan_actions SET status = 'CONCLUIDA', completed_at = now() WHERE id = v_evidence.action_id;

  RETURN jsonb_build_object('success', true, 'message', 'Evidência aprovada, ação concluída');
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_evidence(p_evidence_id UUID, p_role TEXT, p_reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_evidence RECORD;
  v_action_area_id UUID;
  v_is_manager BOOLEAN;
  v_user_area_id UUID;
BEGIN
  SELECT * INTO v_evidence FROM public.action_evidences WHERE id = p_evidence_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência não encontrada');
  END IF;

  SELECT public.action_area_id(v_evidence.action_id) INTO v_action_area_id;

  SELECT area_id, (area_role = 'gestor') INTO v_user_area_id, v_is_manager
  FROM public.profiles WHERE user_id = auth.uid();

  IF p_role = 'gestor' AND (NOT v_is_manager OR v_user_area_id != v_action_area_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Sem permissão');
  END IF;

  IF p_role = 'direcao' AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Sem permissão');
  END IF;

  INSERT INTO public.evidence_approvals (evidence_id, approver_role, status, approved_by, note)
  VALUES (p_evidence_id, p_role, 'REPROVADA', auth.uid(), p_reason);

  UPDATE public.action_evidences SET status = 'REPROVADA' WHERE id = p_evidence_id;
  UPDATE public.plan_actions SET status = 'EM_ANDAMENTO' WHERE id = v_evidence.action_id;

  INSERT INTO public.action_history (action_id, field_changed, old_value, new_value, changed_by)
  VALUES (v_evidence.action_id, 'evidence_rejected', v_evidence.filename, p_reason, auth.uid());

  RETURN jsonb_build_object('success', true, 'message', 'Evidência rejeitada');
END;
$$;

-- ============================================================
-- PARTE 12: TRIGGERS DE PROGRESSO E HISTÓRICO
-- ============================================================

-- Recalcular progresso da ação baseado nas subtarefas
CREATE OR REPLACE FUNCTION public.recalculate_action_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_action_id UUID;
  v_total INTEGER;
  v_completed INTEGER;
  v_new_progress INTEGER;
BEGIN
  v_action_id := COALESCE(NEW.action_id, OLD.action_id);

  SELECT COUNT(*), COUNT(*) FILTER (WHERE completed = true)
  INTO v_total, v_completed
  FROM public.action_subtasks
  WHERE action_id = v_action_id;

  IF v_total > 0 THEN
    v_new_progress := ROUND((v_completed::NUMERIC / v_total) * 100);
  ELSE
    v_new_progress := 0;
  END IF;

  UPDATE public.plan_actions
  SET progress = v_new_progress
  WHERE id = v_action_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trigger_recalculate_progress ON public.action_subtasks;
CREATE TRIGGER trigger_recalculate_progress
  AFTER INSERT OR UPDATE OR DELETE ON public.action_subtasks
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_action_progress();

-- Log de alterações em plan_actions
CREATE OR REPLACE FUNCTION public.log_action_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.action_history (action_id, field_changed, old_value, new_value, changed_by)
      VALUES (NEW.id, 'status', OLD.status, NEW.status, auth.uid());
    END IF;
    IF OLD.progress IS DISTINCT FROM NEW.progress THEN
      INSERT INTO public.action_history (action_id, field_changed, old_value, new_value, changed_by)
      VALUES (NEW.id, 'progress', OLD.progress::TEXT, NEW.progress::TEXT, auth.uid());
    END IF;
    IF OLD.due_date IS DISTINCT FROM NEW.due_date THEN
      INSERT INTO public.action_history (action_id, field_changed, old_value, new_value, changed_by)
      VALUES (NEW.id, 'due_date', OLD.due_date::TEXT, NEW.due_date::TEXT, auth.uid());
    END IF;
    IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
      INSERT INTO public.action_history (action_id, field_changed, old_value, new_value, changed_by)
      VALUES (NEW.id, 'assigned_to', OLD.assigned_to::TEXT, NEW.assigned_to::TEXT, auth.uid());
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_log_action_changes ON public.plan_actions;
CREATE TRIGGER trigger_log_action_changes
  AFTER UPDATE ON public.plan_actions
  FOR EACH ROW EXECUTE FUNCTION public.log_action_changes();

-- ============================================================
-- PARTE 13: VIEWS DE RESUMO
-- ============================================================

CREATE OR REPLACE VIEW public.vw_area_plan_progress AS
SELECT 
  ap.id AS plan_id,
  ap.area_id,
  a.name AS area_name,
  a.slug AS area_slug,
  ap.year,
  ap.title AS plan_title,
  ap.status AS plan_status,
  COUNT(pa.id) AS total_actions,
  COUNT(pa.id) FILTER (WHERE pa.status = 'CONCLUIDA') AS completed_actions,
  COUNT(pa.id) FILTER (WHERE pa.status IN ('PENDENTE', 'EM_ANDAMENTO', 'BLOQUEADA')) AS pending_actions,
  COUNT(pa.id) FILTER (WHERE pa.status = 'AGUARDANDO_EVIDENCIA') AS awaiting_evidence,
  COUNT(pa.id) FILTER (WHERE pa.status = 'EM_VALIDACAO') AS in_validation,
  COUNT(pa.id) FILTER (WHERE pa.due_date < CURRENT_DATE AND pa.status NOT IN ('CONCLUIDA', 'CANCELADA')) AS overdue_actions,
  CASE 
    WHEN COUNT(pa.id) > 0 THEN ROUND((COUNT(pa.id) FILTER (WHERE pa.status = 'CONCLUIDA')::NUMERIC / COUNT(pa.id)) * 100, 1)
    ELSE 0
  END AS completion_percentage,
  COALESCE(SUM(pa.cost_estimate), 0) AS total_cost_estimate,
  COALESCE(SUM(pa.cost_actual), 0) AS total_cost_actual
FROM public.area_plans ap
JOIN public.areas a ON a.id = ap.area_id
LEFT JOIN public.plan_actions pa ON pa.plan_id = ap.id
GROUP BY ap.id, ap.area_id, a.name, a.slug, ap.year, ap.title, ap.status;

CREATE OR REPLACE VIEW public.vw_area_pillar_progress AS
SELECT 
  ap.area_id,
  a.name AS area_name,
  ap.year,
  p.id AS pillar_id,
  p.code AS pillar_code,
  p.title AS pillar_title,
  COUNT(pa.id) AS total_actions,
  COUNT(pa.id) FILTER (WHERE pa.status = 'CONCLUIDA') AS completed_actions,
  CASE 
    WHEN COUNT(pa.id) > 0 THEN ROUND((COUNT(pa.id) FILTER (WHERE pa.status = 'CONCLUIDA')::NUMERIC / COUNT(pa.id)) * 100, 1)
    ELSE 0
  END AS completion_percentage
FROM public.area_plans ap
JOIN public.areas a ON a.id = ap.area_id
JOIN public.plan_actions pa ON pa.plan_id = ap.id
JOIN public.pillars p ON p.id = pa.pillar_id
GROUP BY ap.area_id, a.name, ap.year, p.id, p.code, p.title;

DROP VIEW IF EXISTS public.vw_evidence_backlog;
CREATE OR REPLACE VIEW public.vw_evidence_backlog AS
SELECT 
  ae.id AS evidence_id,
  ae.action_id,
  pa.title AS action_title,
  ae.filename,
  ae.status AS evidence_status,
  ae.submitted_at,
  ae.submitted_by,
  ap.area_id,
  a.name AS area_name,
  a.slug AS area_slug,
  EXISTS (
    SELECT 1 FROM public.evidence_approvals ea 
    WHERE ea.evidence_id = ae.id AND ea.approver_role = 'gestor' AND ea.status = 'APROVADA'
  ) AS manager_approved,
  EXISTS (
    SELECT 1 FROM public.evidence_approvals ea 
    WHERE ea.evidence_id = ae.id AND ea.approver_role = 'direcao' AND ea.status = 'APROVADA'
  ) AS direction_approved
FROM public.action_evidences ae
JOIN public.plan_actions pa ON pa.id = ae.action_id
JOIN public.area_plans ap ON ap.id = pa.plan_id
JOIN public.areas a ON a.id = ap.area_id
WHERE ae.status IN ('PENDENTE', 'EM_VALIDACAO')
ORDER BY ae.submitted_at ASC;

CREATE OR REPLACE VIEW public.vw_blocked_actions AS
SELECT 
  pa.id AS action_id,
  pa.title AS action_title,
  pa.status,
  ap.area_id,
  a.name AS area_name,
  dep_pa.id AS blocking_action_id,
  dep_pa.title AS blocking_action_title,
  dep_pa.status AS blocking_action_status
FROM public.plan_actions pa
JOIN public.action_dependencies ad ON ad.action_id = pa.id
JOIN public.plan_actions dep_pa ON dep_pa.id = ad.depends_on_action_id
JOIN public.area_plans ap ON ap.id = pa.plan_id
JOIN public.areas a ON a.id = ap.area_id
WHERE dep_pa.status NOT IN ('CONCLUIDA', 'CANCELADA')
  AND pa.status = 'BLOQUEADA';

-- ============================================================
-- PARTE 14: STORAGE BUCKET PARA EVIDÊNCIAS
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'action-evidences',
  'action-evidences',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'text/csv']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
DROP POLICY IF EXISTS "Usuários podem ver evidências da sua área" ON storage.objects;
CREATE POLICY "storage_evidences_select" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'action-evidences'
  AND (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.action_evidences ae
      JOIN public.plan_actions pa ON ae.action_id = pa.id
      JOIN public.area_plans ap ON pa.plan_id = ap.id
      WHERE ae.storage_path = name AND ap.area_id = public.user_area_id()
    )
  )
);

DROP POLICY IF EXISTS "Usuários podem fazer upload de evidências" ON storage.objects;
CREATE POLICY "storage_evidences_insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'action-evidences'
  AND (
    public.is_admin()
    OR public.user_area_id() IS NOT NULL
  )
);

DROP POLICY IF EXISTS "Usuários podem excluir suas próprias evidências" ON storage.objects;
CREATE POLICY "storage_evidences_delete" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'action-evidences'
  AND (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.action_evidences ae
      WHERE ae.storage_path = name AND ae.submitted_by = auth.uid() AND ae.status = 'PENDENTE'
    )
    OR public.is_area_manager()
  )
);

-- ============================================================
-- PARTE 15: DADOS INICIAIS (SEED)
-- ============================================================

-- Pilares estratégicos
INSERT INTO public.pillars (code, title, frontier) VALUES
  ('P1', 'Estrutura corporativa e governança', 'Governança, separação Aero x Techdengue e padrão sell-ready.'),
  ('P2', 'Crescimento e diversificação', 'Monetização previsível e carteira diversificada.'),
  ('P3', 'Excelência operacional', 'Escala com qualidade, capacidade e margem sustentadas.'),
  ('P4', 'Produto, dados e IA', 'Provas de valor e automação orientada a resultados.'),
  ('P5', 'Pessoas e liderança', 'Densidade intelectual, liderança e cultura sustentável.')
ON CONFLICT (code) DO NOTHING;

-- Áreas organizacionais
INSERT INTO public.areas (slug, name, owner, focus, color) VALUES
  ('rh', 'RH', 'RH', 'Liderança, retenção e people analytics', '#3B82F6'),
  ('marketing', 'Marketing', 'Marketing', 'Demanda qualificada e provas', '#10B981'),
  ('produto-dados', 'Produto/Dados', 'Produto/Dados', 'Evidência, IA e eficiência', '#8B5CF6'),
  ('operacao', 'Operação', 'Operação', 'Capacidade e qualidade', '#F59E0B'),
  ('cs', 'CS', 'CS', 'Ativação de demanda e previsibilidade', '#EC4899'),
  ('comercial', 'Comercial', 'Comercial', 'Pipeline qualificado e diversificação', '#06B6D4'),
  ('financeiro', 'Financeiro', 'Financeiro', 'Caixa, margem e previsibilidade', '#EF4444'),
  ('direcao', 'Direção Executiva', 'Direção Executiva', 'Governança e estratégia corporativa', '#6366F1')
ON CONFLICT (slug) DO NOTHING;

-- Templates de planos
INSERT INTO public.plan_templates (name, description, structure, is_default, icon, color) VALUES
  ('Completo (5 níveis)', 'Hierarquia completa: Macro → Área → Meta → Pilar → Ação', '["macro", "area", "meta", "pilar", "acao"]', true, 'layers', '#8B5CF6'),
  ('Por Área (3 níveis)', 'Hierarquia simplificada: Área → Pilar → Ação', '["area", "pilar", "acao"]', false, 'building', '#3B82F6'),
  ('Por Meta (2 níveis)', 'Hierarquia focada: Meta → Ação', '["meta", "acao"]', false, 'target', '#10B981'),
  ('Livre (Ações diretas)', 'Sem hierarquia: apenas ações', '["acao"]', false, 'list', '#6B7280')
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DA MIGRATION CONSOLIDADA
-- ============================================================
