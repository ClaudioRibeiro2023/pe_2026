-- ============================================================
-- MIGRAÇÃO: Áreas e Templates de Planos
-- Data: 2026-02-04
-- ============================================================

-- ============================================================
-- TABELA: areas
-- Áreas organizacionais para RBAC e planos por área
-- ============================================================

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

-- Adicionar coluna color se tabela já existir sem ela
ALTER TABLE public.areas ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6';

-- Índices
CREATE INDEX IF NOT EXISTS idx_areas_slug ON public.areas(slug);

-- RLS
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

-- Políticas: todos podem ler, apenas admin pode modificar
CREATE POLICY "areas_select_all" ON public.areas
  FOR SELECT USING (true);

CREATE POLICY "areas_insert_admin" ON public.areas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "areas_update_admin" ON public.areas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "areas_delete_admin" ON public.areas
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Dados iniciais
INSERT INTO public.areas (slug, name, owner, focus, color) VALUES
  ('rh', 'RH', 'Ana Paula', 'Liderança, retenção e people analytics', '#3B82F6'),
  ('marketing', 'Marketing', 'Carlos Silva', 'Demanda qualificada e provas', '#10B981'),
  ('operacoes', 'Operações', 'Roberto Lima', 'Eficiência operacional e automação', '#F59E0B'),
  ('ti', 'Tecnologia da Informação', 'Carlos Mendes', 'Infraestrutura, segurança e inovação', '#8B5CF6'),
  ('financeiro', 'Financeiro', 'Maria Santos', 'Gestão financeira e compliance', '#EF4444')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TABELA: plan_templates
-- Templates de hierarquia para planos de ação
-- ============================================================

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

-- RLS
ALTER TABLE public.plan_templates ENABLE ROW LEVEL SECURITY;

-- Políticas: todos podem ler, apenas admin pode modificar
CREATE POLICY "plan_templates_select_all" ON public.plan_templates
  FOR SELECT USING (true);

CREATE POLICY "plan_templates_insert_admin" ON public.plan_templates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "plan_templates_update_admin" ON public.plan_templates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "plan_templates_delete_admin" ON public.plan_templates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Dados iniciais
INSERT INTO public.plan_templates (name, description, structure, is_default, icon, color) VALUES
  ('Completo (5 níveis)', 'Hierarquia completa: Macro → Área → Meta → Pilar → Ação', '["macro", "area", "meta", "pilar", "acao"]', true, 'layers', '#8B5CF6'),
  ('Por Área (3 níveis)', 'Hierarquia simplificada: Área → Pilar → Ação', '["area", "pilar", "acao"]', false, 'building', '#3B82F6'),
  ('Por Meta (2 níveis)', 'Hierarquia focada: Meta → Ação', '["meta", "acao"]', false, 'target', '#10B981'),
  ('Livre (Ações diretas)', 'Sem hierarquia: apenas ações', '["acao"]', false, 'list', '#6B7280')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ATUALIZAÇÃO: profiles
-- Adicionar area_id para RBAC por área
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'area_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN area_id UUID REFERENCES public.areas(id);
  END IF;
END $$;

-- Índice para filtrar por área
CREATE INDEX IF NOT EXISTS idx_profiles_area_id ON public.profiles(area_id);

-- ============================================================
-- TABELA: area_plans
-- Planos de ação por área
-- ============================================================

CREATE TABLE IF NOT EXISTS public.area_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES public.areas(id),
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'RASCUNHO',
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_area_plans_area ON public.area_plans(area_id);
CREATE INDEX IF NOT EXISTS idx_area_plans_year ON public.area_plans(year);
CREATE INDEX IF NOT EXISTS idx_area_plans_status ON public.area_plans(status);

-- RLS
ALTER TABLE public.area_plans ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TABELA: plan_actions
-- Ações dentro dos planos por área
-- ============================================================

CREATE TABLE IF NOT EXISTS public.plan_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.area_plans(id) ON DELETE CASCADE,
  pillar_id UUID,
  area_okr_id UUID,
  initiative_id UUID,
  parent_action_id UUID REFERENCES public.plan_actions(id),
  node_type TEXT DEFAULT 'acao',
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'PENDENTE',
  priority TEXT NOT NULL DEFAULT 'MEDIA',
  responsible TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  evidence_required BOOLEAN DEFAULT false,
  notes TEXT,
  cost_estimate NUMERIC(12,2),
  cost_actual NUMERIC(12,2),
  cost_type TEXT,
  currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar colunas que podem estar faltando em tabela existente
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS parent_action_id UUID REFERENCES public.plan_actions(id);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS node_type TEXT DEFAULT 'acao';
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS cost_estimate NUMERIC(12,2);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS cost_actual NUMERIC(12,2);
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS cost_type TEXT;
ALTER TABLE public.plan_actions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL';

-- Índices
CREATE INDEX IF NOT EXISTS idx_plan_actions_plan ON public.plan_actions(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_actions_status ON public.plan_actions(status);
CREATE INDEX IF NOT EXISTS idx_plan_actions_parent ON public.plan_actions(parent_action_id);
CREATE INDEX IF NOT EXISTS idx_plan_actions_node_type ON public.plan_actions(node_type);
CREATE INDEX IF NOT EXISTS idx_plan_actions_due_date ON public.plan_actions(due_date);

-- RLS
ALTER TABLE public.plan_actions ENABLE ROW LEVEL SECURITY;

-- Políticas para plan_actions
CREATE POLICY "plan_actions_select_all" ON public.plan_actions
  FOR SELECT USING (true);

CREATE POLICY "plan_actions_insert_by_role" ON public.plan_actions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'gestor', 'colaborador')
    )
  );

CREATE POLICY "plan_actions_update_by_role" ON public.plan_actions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'gestor', 'colaborador')
    )
  );

CREATE POLICY "plan_actions_delete_admin" ON public.plan_actions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- ============================================================
-- FUNÇÃO: can_access_plan
-- Verifica se usuário pode acessar plano baseado na área
-- ============================================================

CREATE OR REPLACE FUNCTION public.can_access_plan(plan_area_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
  user_area_id UUID;
BEGIN
  -- Buscar role e área do usuário
  SELECT role, area_id INTO user_role, user_area_id
  FROM public.profiles
  WHERE user_id = auth.uid();

  -- Admin tem acesso total
  IF user_role = 'admin' THEN
    RETURN true;
  END IF;

  -- Gestor da área tem acesso
  IF user_role = 'gestor' AND user_area_id = plan_area_id THEN
    RETURN true;
  END IF;

  -- Colaborador da área tem acesso
  IF user_role = 'colaborador' AND user_area_id = plan_area_id THEN
    RETURN true;
  END IF;

  -- Cliente não tem acesso a planos específicos
  RETURN false;
END;
$$;

-- ============================================================
-- FUNÇÃO: get_all_profiles (atualizada)
-- Retorna todos os perfis com nome da área
-- ============================================================

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
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se usuário é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  ) THEN
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
    p.created_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.user_id
  LEFT JOIN public.areas a ON a.id = p.area_id
  ORDER BY p.created_at DESC;
END;
$$;

-- ============================================================
-- FUNÇÃO: update_user_area
-- Atualiza a área de um usuário
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_user_area(
  target_user_id UUID,
  new_area_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se usuário é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  -- Atualizar área
  UPDATE public.profiles
  SET area_id = new_area_id, updated_at = now()
  WHERE user_id = target_user_id;
END;
$$;

-- ============================================================
-- RLS: area_plans (atualizado)
-- Acesso baseado em área do usuário
-- ============================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "area_plans_select_by_area" ON public.area_plans;
DROP POLICY IF EXISTS "area_plans_insert_by_role" ON public.area_plans;
DROP POLICY IF EXISTS "area_plans_update_by_role" ON public.area_plans;

-- Política de leitura: admin vê tudo, outros veem só sua área
CREATE POLICY "area_plans_select_by_area" ON public.area_plans
  FOR SELECT USING (
    public.can_access_plan(area_id)
  );

-- Política de inserção: admin e gestor podem criar
CREATE POLICY "area_plans_insert_by_role" ON public.area_plans
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- Política de atualização: admin e gestor podem atualizar
CREATE POLICY "area_plans_update_by_role" ON public.area_plans
  FOR UPDATE USING (
    public.can_access_plan(area_id)
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'gestor')
    )
  );

-- ============================================================
-- Trigger: updated_at automático
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers para as novas tabelas
DROP TRIGGER IF EXISTS set_areas_updated_at ON public.areas;
CREATE TRIGGER set_areas_updated_at
  BEFORE UPDATE ON public.areas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_plan_templates_updated_at ON public.plan_templates;
CREATE TRIGGER set_plan_templates_updated_at
  BEFORE UPDATE ON public.plan_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
