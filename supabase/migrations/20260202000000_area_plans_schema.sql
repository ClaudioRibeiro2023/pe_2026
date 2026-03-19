-- ============================================================
-- MIGRAÇÃO: Sistema de Planos de Ação por Área
-- Versão: 1.0
-- Data: 2026-02-02
-- ============================================================

-- 1. Áreas organizacionais
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  owner TEXT,
  focus TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ajustes em perfis (vínculo com área)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES areas(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS area_role TEXT
  CHECK (area_role IN ('gestor', 'colaborador')) DEFAULT 'colaborador';

-- 3. Pilares estratégicos
CREATE TABLE IF NOT EXISTS pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  frontier TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Subpilares
CREATE TABLE IF NOT EXISTS subpillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID REFERENCES pillars(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  frontier TEXT
);

-- 5. OKRs Corporativos
CREATE TABLE IF NOT EXISTS corporate_okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
  objective TEXT NOT NULL,
  owner TEXT,
  priority TEXT CHECK (priority IN ('Crítica', 'Alta', 'Média', 'Baixa')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Key Results
CREATE TABLE IF NOT EXISTS key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID REFERENCES corporate_okrs(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  target TEXT,
  status TEXT CHECK (status IN ('NAO_INICIADO', 'EM_ANDAMENTO', 'ATENCAO', 'CONCLUIDO')) DEFAULT 'NAO_INICIADO',
  due_date DATE
);

-- 7. OKRs por Área
CREATE TABLE IF NOT EXISTS area_okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  objective TEXT NOT NULL,
  status TEXT CHECK (status IN ('NAO_INICIADO', 'EM_ANDAMENTO', 'ATENCAO', 'CONCLUIDO')) DEFAULT 'NAO_INICIADO'
);

-- 8. Vínculo OKR da área -> KR corporativo
CREATE TABLE IF NOT EXISTS area_okr_krs (
  area_okr_id UUID REFERENCES area_okrs(id) ON DELETE CASCADE,
  key_result_id UUID REFERENCES key_results(id) ON DELETE CASCADE,
  PRIMARY KEY (area_okr_id, key_result_id)
);

-- 9. Iniciativas (migradas do contexto)
CREATE TABLE IF NOT EXISTS initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('ENT', 'MET', 'SIS', 'ORG', 'COM')),
  priority TEXT CHECK (priority IN ('P0', 'P1', 'P2')),
  pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
  okr_code TEXT,
  kr_code TEXT,
  owner TEXT,
  sponsor TEXT,
  status TEXT CHECK (status IN ('PLANEJADA', 'EM_ANDAMENTO', 'BLOQUEADA', 'CONCLUIDA', 'CANCELADA')) DEFAULT 'PLANEJADA',
  start_date DATE,
  end_date DATE,
  effort TEXT CHECK (effort IN ('BAIXO', 'MEDIO', 'ALTO')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Planos de Ação por Área (1 por área por ano)
CREATE TABLE IF NOT EXISTS area_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('RASCUNHO', 'EM_APROVACAO', 'ATIVO', 'CONCLUIDO', 'ARQUIVADO')) DEFAULT 'RASCUNHO',
  created_by UUID REFERENCES auth.users(id),
  manager_approved_by UUID REFERENCES auth.users(id),
  manager_approved_at TIMESTAMPTZ,
  direction_approved_by UUID REFERENCES auth.users(id),
  direction_approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(area_id, year)
);

-- 11. Ações do Plano
CREATE TABLE IF NOT EXISTS plan_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES area_plans(id) ON DELETE CASCADE,
  pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
  area_okr_id UUID REFERENCES area_okrs(id) ON DELETE SET NULL,
  initiative_id UUID REFERENCES initiatives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN (
    'PENDENTE',
    'EM_ANDAMENTO',
    'BLOQUEADA',
    'AGUARDANDO_EVIDENCIA',
    'EM_VALIDACAO',
    'CONCLUIDA',
    'CANCELADA'
  )) DEFAULT 'PENDENTE',
  priority TEXT CHECK (priority IN ('P0', 'P1', 'P2')) DEFAULT 'P1',
  responsible TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  evidence_required BOOLEAN DEFAULT true,
  notes TEXT,
  cost_estimate NUMERIC,
  cost_actual NUMERIC,
  cost_type TEXT CHECK (cost_type IN ('CAPEX', 'OPEX')),
  currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Subtarefas (base do progresso automático)
CREATE TABLE IF NOT EXISTS action_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES plan_actions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0
);

-- 13. Dependências entre ações
CREATE TABLE IF NOT EXISTS action_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES plan_actions(id) ON DELETE CASCADE,
  depends_on_action_id UUID REFERENCES plan_actions(id) ON DELETE CASCADE,
  UNIQUE(action_id, depends_on_action_id)
);

-- 14. Evidências (arquivos no Storage)
CREATE TABLE IF NOT EXISTS action_evidences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES plan_actions(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  submitted_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  status TEXT CHECK (status IN ('PENDENTE', 'EM_VALIDACAO', 'APROVADA', 'REPROVADA')) DEFAULT 'PENDENTE'
);

-- 15. Aprovações de evidências
CREATE TABLE IF NOT EXISTS evidence_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID REFERENCES action_evidences(id) ON DELETE CASCADE,
  approver_role TEXT CHECK (approver_role IN ('gestor', 'direcao')) NOT NULL,
  status TEXT CHECK (status IN ('APROVADA', 'REPROVADA')) NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ DEFAULT now(),
  note TEXT
);

-- 16. Comentários por ação
CREATE TABLE IF NOT EXISTS action_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES plan_actions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 17. Histórico de alterações (auditoria)
CREATE TABLE IF NOT EXISTS action_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES plan_actions(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- 18. Vínculo com Indicadores (KPIs)
CREATE TABLE IF NOT EXISTS action_indicators (
  action_id UUID REFERENCES plan_actions(id) ON DELETE CASCADE,
  indicator_id UUID REFERENCES indicators(id) ON DELETE CASCADE,
  PRIMARY KEY (action_id, indicator_id)
);

-- 19. Riscos associados (governança)
CREATE TABLE IF NOT EXISTS action_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID REFERENCES plan_actions(id) ON DELETE CASCADE,
  risk_label TEXT NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('BAIXO', 'MEDIO', 'ALTO', 'CRITICO')) DEFAULT 'MEDIO',
  mitigation TEXT
);

-- ============================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_area_id ON profiles(area_id);
CREATE INDEX IF NOT EXISTS idx_area_plans_area_id ON area_plans(area_id);
CREATE INDEX IF NOT EXISTS idx_area_plans_year ON area_plans(year);
CREATE INDEX IF NOT EXISTS idx_area_plans_status ON area_plans(status);
CREATE INDEX IF NOT EXISTS idx_plan_actions_plan_id ON plan_actions(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_actions_status ON plan_actions(status);
CREATE INDEX IF NOT EXISTS idx_plan_actions_assigned_to ON plan_actions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_plan_actions_due_date ON plan_actions(due_date);
CREATE INDEX IF NOT EXISTS idx_plan_actions_pillar_id ON plan_actions(pillar_id);
CREATE INDEX IF NOT EXISTS idx_action_subtasks_action_id ON action_subtasks(action_id);
CREATE INDEX IF NOT EXISTS idx_action_evidences_action_id ON action_evidences(action_id);
CREATE INDEX IF NOT EXISTS idx_action_evidences_status ON action_evidences(status);
CREATE INDEX IF NOT EXISTS idx_action_comments_action_id ON action_comments(action_id);
CREATE INDEX IF NOT EXISTS idx_action_history_action_id ON action_history(action_id);
CREATE INDEX IF NOT EXISTS idx_area_okrs_area_id ON area_okrs(area_id);
CREATE INDEX IF NOT EXISTS idx_key_results_okr_id ON key_results(okr_id);
CREATE INDEX IF NOT EXISTS idx_corporate_okrs_pillar_id ON corporate_okrs(pillar_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_pillar_id ON initiatives(pillar_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_status ON initiatives(status);

-- ============================================================
-- FUNÇÕES HELPER PARA RLS
-- ============================================================

-- Retorna o area_id do usuário atual
CREATE OR REPLACE FUNCTION public.user_area_id() 
RETURNS UUID 
LANGUAGE SQL 
STABLE
SECURITY DEFINER
AS $$
  SELECT area_id FROM profiles WHERE user_id = auth.uid();
$$;

-- Verifica se o usuário é gestor de uma área específica
CREATE OR REPLACE FUNCTION public.is_area_manager(p_area_id UUID) 
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
      AND area_role = 'gestor' 
      AND area_id = p_area_id
  );
$$;

-- Retorna o area_id de uma ação específica
CREATE OR REPLACE FUNCTION public.action_area_id(p_action_id UUID) 
RETURNS UUID 
LANGUAGE SQL 
STABLE
SECURITY DEFINER
AS $$
  SELECT ap.area_id
  FROM plan_actions pa
  JOIN area_plans ap ON ap.id = pa.plan_id
  WHERE pa.id = p_action_id;
$$;

-- Verifica se o usuário é gestor da área de uma ação
CREATE OR REPLACE FUNCTION public.is_action_area_manager(p_action_id UUID) 
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE
SECURITY DEFINER
AS $$
  SELECT public.is_area_manager(public.action_area_id(p_action_id));
$$;

-- Verifica se o usuário pertence à área de uma ação
CREATE OR REPLACE FUNCTION public.user_belongs_to_action_area(p_action_id UUID) 
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE
SECURITY DEFINER
AS $$
  SELECT public.action_area_id(p_action_id) = public.user_area_id();
$$;

-- ============================================================
-- POLÍTICAS RLS
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE subpillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_okr_krs ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_risks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS: ÁREAS
-- ============================================================

CREATE POLICY "areas_select" ON areas FOR SELECT TO authenticated
  USING (public.is_admin() OR id = public.user_area_id());

CREATE POLICY "areas_insert" ON areas FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "areas_update" ON areas FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "areas_delete" ON areas FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: PILARES (visíveis para todos autenticados)
-- ============================================================

CREATE POLICY "pillars_select" ON pillars FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "pillars_insert" ON pillars FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "pillars_update" ON pillars FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "pillars_delete" ON pillars FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: SUBPILARES
-- ============================================================

CREATE POLICY "subpillars_select" ON subpillars FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "subpillars_insert" ON subpillars FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "subpillars_update" ON subpillars FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "subpillars_delete" ON subpillars FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: OKRs CORPORATIVOS
-- ============================================================

CREATE POLICY "corporate_okrs_select" ON corporate_okrs FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "corporate_okrs_insert" ON corporate_okrs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "corporate_okrs_update" ON corporate_okrs FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "corporate_okrs_delete" ON corporate_okrs FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: KEY RESULTS
-- ============================================================

CREATE POLICY "key_results_select" ON key_results FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "key_results_insert" ON key_results FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "key_results_update" ON key_results FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "key_results_delete" ON key_results FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: OKRs POR ÁREA
-- ============================================================

CREATE POLICY "area_okrs_select" ON area_okrs FOR SELECT TO authenticated
  USING (public.is_admin() OR area_id = public.user_area_id());

CREATE POLICY "area_okrs_insert" ON area_okrs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "area_okrs_update" ON area_okrs FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "area_okrs_delete" ON area_okrs FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: VÍNCULO OKR ÁREA -> KR
-- ============================================================

CREATE POLICY "area_okr_krs_select" ON area_okr_krs FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "area_okr_krs_insert" ON area_okr_krs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "area_okr_krs_delete" ON area_okr_krs FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: INICIATIVAS
-- ============================================================

CREATE POLICY "initiatives_select" ON initiatives FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "initiatives_insert" ON initiatives FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "initiatives_update" ON initiatives FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "initiatives_delete" ON initiatives FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: PLANOS DE AÇÃO POR ÁREA
-- ============================================================

CREATE POLICY "plans_select" ON area_plans FOR SELECT TO authenticated
  USING (public.is_admin() OR area_id = public.user_area_id());

CREATE POLICY "plans_insert" ON area_plans FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (public.is_area_manager(area_id) AND status = 'RASCUNHO')
  );

CREATE POLICY "plans_update" ON area_plans FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR (public.is_area_manager(area_id) AND status = 'RASCUNHO')
  );

CREATE POLICY "plans_delete" ON area_plans FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: AÇÕES DO PLANO
-- ============================================================

CREATE POLICY "actions_select" ON plan_actions FOR SELECT TO authenticated
  USING (
    public.is_admin() 
    OR plan_id IN (SELECT id FROM area_plans WHERE area_id = public.user_area_id())
  );

CREATE POLICY "actions_insert" ON plan_actions FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "actions_update" ON plan_actions FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR assigned_to = auth.uid()
    OR public.is_action_area_manager(id)
  );

CREATE POLICY "actions_delete" ON plan_actions FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: SUBTAREFAS
-- ============================================================

CREATE POLICY "subtasks_select" ON action_subtasks FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "subtasks_insert" ON action_subtasks FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR public.is_action_area_manager(action_id)
  );

CREATE POLICY "subtasks_update" ON action_subtasks FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "subtasks_delete" ON action_subtasks FOR DELETE TO authenticated
  USING (
    public.is_admin()
    OR public.is_action_area_manager(action_id)
  );

-- ============================================================
-- POLÍTICAS: DEPENDÊNCIAS
-- ============================================================

CREATE POLICY "dependencies_select" ON action_dependencies FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "dependencies_insert" ON action_dependencies FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "dependencies_delete" ON action_dependencies FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: EVIDÊNCIAS
-- ============================================================

CREATE POLICY "evidences_select" ON action_evidences FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "evidences_insert" ON action_evidences FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "evidences_update" ON action_evidences FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR public.is_action_area_manager(action_id)
  );

CREATE POLICY "evidences_delete" ON action_evidences FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: APROVAÇÕES DE EVIDÊNCIAS
-- ============================================================

CREATE POLICY "evidence_approvals_select" ON evidence_approvals FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "evidence_approvals_insert" ON evidence_approvals FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR approved_by = auth.uid());

CREATE POLICY "evidence_approvals_update" ON evidence_approvals FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "evidence_approvals_delete" ON evidence_approvals FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: COMENTÁRIOS
-- ============================================================

CREATE POLICY "action_comments_select" ON action_comments FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "action_comments_insert" ON action_comments FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "action_comments_update" ON action_comments FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "action_comments_delete" ON action_comments FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- ============================================================
-- POLÍTICAS: HISTÓRICO (somente leitura)
-- ============================================================

CREATE POLICY "action_history_select" ON action_history FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "action_history_insert" ON action_history FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============================================================
-- POLÍTICAS: INDICADORES VINCULADOS
-- ============================================================

CREATE POLICY "action_indicators_select" ON action_indicators FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "action_indicators_insert" ON action_indicators FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "action_indicators_delete" ON action_indicators FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: RISCOS
-- ============================================================

CREATE POLICY "action_risks_select" ON action_risks FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.user_belongs_to_action_area(action_id)
  );

CREATE POLICY "action_risks_insert" ON action_risks FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "action_risks_update" ON action_risks FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "action_risks_delete" ON action_risks FOR DELETE TO authenticated
  USING (public.is_admin());

-- ============================================================
-- TRIGGERS: UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_areas_updated_at
  BEFORE UPDATE ON areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_area_plans_updated_at
  BEFORE UPDATE ON area_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_actions_updated_at
  BEFORE UPDATE ON plan_actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_initiatives_updated_at
  BEFORE UPDATE ON initiatives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_comments_updated_at
  BEFORE UPDATE ON action_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TRIGGER: RECALCULAR PROGRESSO AUTOMÁTICO
-- ============================================================

CREATE OR REPLACE FUNCTION recalculate_action_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_action_id UUID;
  v_total INTEGER;
  v_completed INTEGER;
  v_new_progress INTEGER;
  v_current_status TEXT;
  v_has_pending_evidence BOOLEAN;
BEGIN
  -- Determinar action_id
  IF TG_OP = 'DELETE' THEN
    v_action_id := OLD.action_id;
  ELSE
    v_action_id := NEW.action_id;
  END IF;

  -- Contar subtarefas
  SELECT COUNT(*), COUNT(*) FILTER (WHERE completed = true)
  INTO v_total, v_completed
  FROM action_subtasks
  WHERE action_id = v_action_id;

  -- Calcular progresso
  IF v_total > 0 THEN
    v_new_progress := (v_completed * 100) / v_total;
  ELSE
    v_new_progress := 0;
  END IF;

  -- Obter status atual
  SELECT status, evidence_required INTO v_current_status, v_has_pending_evidence
  FROM plan_actions
  WHERE id = v_action_id;

  -- Atualizar progresso e status se necessário
  IF v_new_progress = 100 AND v_has_pending_evidence AND v_current_status = 'EM_ANDAMENTO' THEN
    UPDATE plan_actions
    SET progress = v_new_progress, status = 'AGUARDANDO_EVIDENCIA'
    WHERE id = v_action_id;
  ELSE
    UPDATE plan_actions
    SET progress = v_new_progress
    WHERE id = v_action_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_recalculate_progress
  AFTER INSERT OR UPDATE OR DELETE ON action_subtasks
  FOR EACH ROW EXECUTE FUNCTION recalculate_action_progress();

-- ============================================================
-- TRIGGER: AUDITORIA DE ALTERAÇÕES EM AÇÕES
-- ============================================================

CREATE OR REPLACE FUNCTION log_action_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO action_history (action_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'status', OLD.status, NEW.status, auth.uid());
  END IF;

  -- Log progress changes
  IF OLD.progress IS DISTINCT FROM NEW.progress THEN
    INSERT INTO action_history (action_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'progress', OLD.progress::TEXT, NEW.progress::TEXT, auth.uid());
  END IF;

  -- Log notes changes
  IF OLD.notes IS DISTINCT FROM NEW.notes THEN
    INSERT INTO action_history (action_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'notes', OLD.notes, NEW.notes, auth.uid());
  END IF;

  -- Log due_date changes
  IF OLD.due_date IS DISTINCT FROM NEW.due_date THEN
    INSERT INTO action_history (action_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'due_date', OLD.due_date::TEXT, NEW.due_date::TEXT, auth.uid());
  END IF;

  -- Log assigned_to changes
  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
    INSERT INTO action_history (action_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'assigned_to', OLD.assigned_to::TEXT, NEW.assigned_to::TEXT, auth.uid());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_log_action_changes
  AFTER UPDATE ON plan_actions
  FOR EACH ROW EXECUTE FUNCTION log_action_changes();

-- ============================================================
-- FIM DA MIGRAÇÃO
-- ============================================================
