-- ============================================================
-- MIGRATION ONDA B — Persistência Real e Hardening
-- Versão: 1.0.0
-- Data: 2026-03-20
-- Descrição:
--   1. FK constraints entre entidades canônicas
--   2. RLS granular por role (gestor pode editar sua área)
--   3. Índices de performance para queries críticas
--   4. Constraint de integridade em iniciativas (motor_id válido)
--   5. Auditoria: tabela audit_log para DEC-*, RSK-*, INIT-*
--   6. Funções auxiliares: fn_area_manager, fn_own_area
--   7. Políticas de escrita granulares para gestores de área
-- ============================================================

-- ============================================================
-- 1. FUNÇÕES AUXILIARES PARA RLS
-- ============================================================

-- Retorna o area_id do profile do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_my_area_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT area_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Verifica se o usuário autenticado é gestor (role gestor ou admin)
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role IN ('admin', 'gestor')
  );
$$;

-- Verifica se o usuário é gestor da área especificada
CREATE OR REPLACE FUNCTION public.is_area_manager(p_area_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND area_id = p_area_id
      AND role IN ('admin', 'gestor')
  );
$$;

-- ============================================================
-- 2. FK CONSTRAINTS ENTRE ENTIDADES CANÔNICAS ONDA A
-- ============================================================

-- motors.pillar_code → não é FK UUID (é código texto P1..P5), mantido como texto intencional
-- strategic_themes.pillar_codes → array texto, sem FK direta (normalizado por código)
-- strategic_risks.pillar_code → idem, código texto intencional

-- initiatives.motor_id já tem FK para motors(id) da migration Onda A
-- Garantir ON DELETE SET NULL para motor deletado
ALTER TABLE public.initiatives
  DROP CONSTRAINT IF EXISTS initiatives_motor_id_fkey;

ALTER TABLE public.initiatives
  ADD CONSTRAINT initiatives_motor_id_fkey
  FOREIGN KEY (motor_id) REFERENCES public.motors(id)
  ON DELETE SET NULL;

-- ============================================================
-- 3. ÍNDICES DE PERFORMANCE PARA QUERIES CRÍTICAS
-- ============================================================

-- Iniciativas por motor e prioridade
CREATE INDEX IF NOT EXISTS idx_initiatives_priority ON public.initiatives(priority);
CREATE INDEX IF NOT EXISTS idx_initiatives_status ON public.initiatives(status);
CREATE INDEX IF NOT EXISTS idx_initiatives_pillar ON public.initiatives(pillar_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_motor_codes ON public.initiatives USING GIN(motor_codes);

-- Key results por código e status
CREATE INDEX IF NOT EXISTS idx_key_results_code ON public.key_results(code);
CREATE INDEX IF NOT EXISTS idx_key_results_status ON public.key_results(status);

-- Corporate OKRs por código
CREATE INDEX IF NOT EXISTS idx_corporate_okrs_code ON public.corporate_okrs(code)
  WHERE code IS NOT NULL;

-- Area plans por area + year (query mais frequente)
CREATE INDEX IF NOT EXISTS idx_area_plans_area_year ON public.area_plans(area_id, year);

-- Plan actions por plano, status, due_date
CREATE INDEX IF NOT EXISTS idx_plan_actions_plan_status ON public.plan_actions(plan_id, status);
CREATE INDEX IF NOT EXISTS idx_plan_actions_due_date ON public.plan_actions(due_date)
  WHERE due_date IS NOT NULL;

-- Strategic risks por severity e status
CREATE INDEX IF NOT EXISTS idx_strategic_risks_severity_status
  ON public.strategic_risks(severity, status);

-- ============================================================
-- 4. RLS GRANULAR — PLANOS DE AÇÃO (gestores escrevem na própria área)
-- ============================================================

-- Area plans: gestor pode criar/editar planos da sua área
DROP POLICY IF EXISTS "area_plans_insert_manager" ON public.area_plans;
CREATE POLICY "area_plans_insert_manager" ON public.area_plans
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR public.is_area_manager(area_id)
  );

DROP POLICY IF EXISTS "area_plans_update_manager" ON public.area_plans;
CREATE POLICY "area_plans_update_manager" ON public.area_plans
  FOR UPDATE USING (
    public.is_admin()
    OR public.is_area_manager(area_id)
  );

DROP POLICY IF EXISTS "area_plans_delete_admin" ON public.area_plans;
CREATE POLICY "area_plans_delete_admin" ON public.area_plans
  FOR DELETE USING (public.is_admin());

-- Plan actions: gestor da área pode criar/editar ações do plano da sua área
DROP POLICY IF EXISTS "plan_actions_insert_manager" ON public.plan_actions;
CREATE POLICY "plan_actions_insert_manager" ON public.plan_actions
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.area_plans ap
      WHERE ap.id = plan_id
        AND public.is_area_manager(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "plan_actions_update_manager" ON public.plan_actions;
CREATE POLICY "plan_actions_update_manager" ON public.plan_actions
  FOR UPDATE USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.area_plans ap
      WHERE ap.id = plan_id
        AND public.is_area_manager(ap.area_id)
    )
  );

-- Action subtasks: mesmo escopo do plan_action
DROP POLICY IF EXISTS "action_subtasks_insert_manager" ON public.action_subtasks;
CREATE POLICY "action_subtasks_insert_manager" ON public.action_subtasks
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.plan_actions pa
      JOIN public.area_plans ap ON ap.id = pa.plan_id
      WHERE pa.id = action_id
        AND public.is_area_manager(ap.area_id)
    )
  );

DROP POLICY IF EXISTS "action_subtasks_update_manager" ON public.action_subtasks;
CREATE POLICY "action_subtasks_update_manager" ON public.action_subtasks
  FOR UPDATE USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.plan_actions pa
      JOIN public.area_plans ap ON ap.id = pa.plan_id
      WHERE pa.id = action_id
        AND public.is_area_manager(ap.area_id)
    )
  );

-- ============================================================
-- 5. TABELA DE AUDITORIA (audit_log)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type TEXT NOT NULL,     -- ex: INIT, DEC, RSK, EVID, KR
  record_code TEXT,              -- ex: INIT-003, RSK-2026-02
  record_id UUID,
  action TEXT NOT NULL           -- INSERT, UPDATE, DELETE, STATUS_CHANGE
    CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'APPROVE', 'REJECT')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_log_record_type ON public.audit_log(record_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_code ON public.audit_log(record_code);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON public.audit_log(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by ON public.audit_log(changed_by);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_select_admin" ON public.audit_log
  FOR SELECT USING (public.is_admin() OR public.is_manager());

CREATE POLICY "audit_log_insert_authenticated" ON public.audit_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 6. FUNÇÃO DE AUDITORIA AUTOMÁTICA
-- ============================================================

CREATE OR REPLACE FUNCTION public.fn_audit_record()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log(record_type, record_code, record_id, action, new_values, changed_by)
    VALUES (
      TG_TABLE_NAME,
      CASE
        WHEN TG_TABLE_NAME = 'initiatives' THEN NEW.code
        WHEN TG_TABLE_NAME = 'strategic_risks' THEN NEW.code
        WHEN TG_TABLE_NAME = 'key_results' THEN NEW.code
        ELSE NULL
      END,
      NEW.id,
      'INSERT',
      to_jsonb(NEW),
      auth.uid()
    );
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log(record_type, record_code, record_id, action, old_values, new_values, changed_by)
    VALUES (
      TG_TABLE_NAME,
      CASE
        WHEN TG_TABLE_NAME = 'initiatives' THEN NEW.code
        WHEN TG_TABLE_NAME = 'strategic_risks' THEN NEW.code
        WHEN TG_TABLE_NAME = 'key_results' THEN NEW.code
        ELSE NULL
      END,
      NEW.id,
      CASE
        WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'STATUS_CHANGE'
        ELSE 'UPDATE'
      END,
      to_jsonb(OLD),
      to_jsonb(NEW),
      auth.uid()
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log(record_type, record_code, record_id, action, old_values, changed_by)
    VALUES (
      TG_TABLE_NAME,
      CASE
        WHEN TG_TABLE_NAME = 'initiatives' THEN OLD.code
        WHEN TG_TABLE_NAME = 'strategic_risks' THEN OLD.code
        WHEN TG_TABLE_NAME = 'key_results' THEN OLD.code
        ELSE NULL
      END,
      OLD.id,
      'DELETE',
      to_jsonb(OLD),
      auth.uid()
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers de auditoria nas entidades críticas
DROP TRIGGER IF EXISTS audit_initiatives ON public.initiatives;
CREATE TRIGGER audit_initiatives
  AFTER INSERT OR UPDATE OR DELETE ON public.initiatives
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_record();

DROP TRIGGER IF EXISTS audit_key_results ON public.key_results;
CREATE TRIGGER audit_key_results
  AFTER INSERT OR UPDATE OR DELETE ON public.key_results
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_record();

DROP TRIGGER IF EXISTS audit_strategic_risks ON public.strategic_risks;
CREATE TRIGGER audit_strategic_risks
  AFTER INSERT OR UPDATE OR DELETE ON public.strategic_risks
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_record();

-- ============================================================
-- 7. CONSTRAINT DE INTEGRIDADE — financial_scenarios
-- ============================================================

-- Garantir que apenas um cenário seja marcado como referência
CREATE UNIQUE INDEX IF NOT EXISTS idx_financial_scenarios_reference
  ON public.financial_scenarios(is_reference)
  WHERE is_reference = true;

-- ============================================================
-- 8. COMENTÁRIOS DESCRITIVOS NAS TABELAS CANÔNICAS
-- ============================================================

COMMENT ON TABLE public.strategic_themes IS
  'Temas estratégicos PE2026 — TH-01 a TH-08 (DOC 02 v2)';

COMMENT ON TABLE public.motors IS
  'Motores estratégicos PE2026 — M1-Monetização, M2-Governança, M3-Escala, M4-Produto/IA, M5-Pessoas (DOC 08 v2)';

COMMENT ON TABLE public.strategic_risks IS
  'Riscos estratégicos PE2026 — RSK-2026-01 a RSK-2026-13 (DOC 10 v2)';

COMMENT ON TABLE public.financial_scenarios IS
  'Cenários financeiros PE2026 — Pessimista/Base/Otimista (DOC 07 v2 + DOC 09 v3)';

COMMENT ON TABLE public.audit_log IS
  'Log de auditoria para registros formais PE2026 (DEC-*, RSK-*, INIT-*, EVID-*)';

-- ============================================================
-- FIM DA MIGRATION ONDA B
-- ============================================================
