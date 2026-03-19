-- ============================================================
-- MIGRAÇÃO: Workflow de Aprovação e Views
-- Versão: 1.0
-- Data: 2026-02-02
-- ============================================================

-- ============================================================
-- RPCs DE APROVAÇÃO DE PLANOS
-- ============================================================

-- Aprovar plano como gestor (primeira aprovação)
CREATE OR REPLACE FUNCTION approve_plan_as_manager(p_plan_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan RECORD;
  v_user_area_id UUID;
  v_is_manager BOOLEAN;
BEGIN
  -- Buscar plano
  SELECT * INTO v_plan FROM area_plans WHERE id = p_plan_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano não encontrado');
  END IF;

  -- Verificar se usuário é gestor da área
  SELECT area_id, (area_role = 'gestor') INTO v_user_area_id, v_is_manager
  FROM profiles WHERE user_id = auth.uid();

  IF NOT v_is_manager OR v_user_area_id != v_plan.area_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas o gestor da área pode aprovar');
  END IF;

  -- Verificar status
  IF v_plan.status != 'RASCUNHO' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano deve estar em RASCUNHO para aprovação do gestor');
  END IF;

  -- Atualizar plano
  UPDATE area_plans
  SET 
    status = 'EM_APROVACAO',
    manager_approved_by = auth.uid(),
    manager_approved_at = now(),
    updated_at = now()
  WHERE id = p_plan_id;

  RETURN jsonb_build_object('success', true, 'message', 'Plano enviado para aprovação da direção');
END;
$$;

-- Aprovar plano como direção (segunda aprovação - ativa o plano)
CREATE OR REPLACE FUNCTION approve_plan_as_direction(p_plan_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan RECORD;
  v_is_admin BOOLEAN;
BEGIN
  -- Verificar se é admin
  SELECT public.is_admin() INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas a direção pode aprovar');
  END IF;

  -- Buscar plano
  SELECT * INTO v_plan FROM area_plans WHERE id = p_plan_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano não encontrado');
  END IF;

  -- Verificar status
  IF v_plan.status != 'EM_APROVACAO' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano deve estar EM_APROVACAO para aprovação da direção');
  END IF;

  -- Atualizar plano
  UPDATE area_plans
  SET 
    status = 'ATIVO',
    direction_approved_by = auth.uid(),
    direction_approved_at = now(),
    updated_at = now()
  WHERE id = p_plan_id;

  RETURN jsonb_build_object('success', true, 'message', 'Plano ativado com sucesso');
END;
$$;

-- Rejeitar plano (volta para rascunho)
CREATE OR REPLACE FUNCTION reject_plan(p_plan_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan RECORD;
  v_is_admin BOOLEAN;
BEGIN
  SELECT public.is_admin() INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas a direção pode rejeitar');
  END IF;

  SELECT * INTO v_plan FROM area_plans WHERE id = p_plan_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano não encontrado');
  END IF;

  IF v_plan.status != 'EM_APROVACAO' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plano deve estar EM_APROVACAO para rejeição');
  END IF;

  UPDATE area_plans
  SET 
    status = 'RASCUNHO',
    manager_approved_by = NULL,
    manager_approved_at = NULL,
    updated_at = now()
  WHERE id = p_plan_id;

  RETURN jsonb_build_object('success', true, 'message', 'Plano rejeitado e devolvido para rascunho', 'reason', p_reason);
END;
$$;

-- ============================================================
-- RPCs DE APROVAÇÃO DE EVIDÊNCIAS
-- ============================================================

-- Aprovar evidência como gestor
CREATE OR REPLACE FUNCTION approve_evidence_as_manager(p_evidence_id UUID, p_note TEXT DEFAULT NULL)
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
  -- Buscar evidência
  SELECT * INTO v_evidence FROM action_evidences WHERE id = p_evidence_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência não encontrada');
  END IF;

  -- Obter área da ação
  SELECT public.action_area_id(v_evidence.action_id) INTO v_action_area_id;

  -- Verificar se usuário é gestor da área
  SELECT area_id, (area_role = 'gestor') INTO v_user_area_id, v_is_manager
  FROM profiles WHERE user_id = auth.uid();

  IF NOT v_is_manager OR v_user_area_id != v_action_area_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas o gestor da área pode aprovar');
  END IF;

  -- Verificar se já foi aprovada pelo gestor
  IF EXISTS (
    SELECT 1 FROM evidence_approvals 
    WHERE evidence_id = p_evidence_id AND approver_role = 'gestor'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência já aprovada pelo gestor');
  END IF;

  -- Inserir aprovação
  INSERT INTO evidence_approvals (evidence_id, approver_role, status, approved_by, note)
  VALUES (p_evidence_id, 'gestor', 'APROVADA', auth.uid(), p_note);

  -- Atualizar status da evidência
  UPDATE action_evidences
  SET status = 'EM_VALIDACAO'
  WHERE id = p_evidence_id;

  RETURN jsonb_build_object('success', true, 'message', 'Evidência aprovada pelo gestor, aguardando direção');
END;
$$;

-- Aprovar evidência como direção
CREATE OR REPLACE FUNCTION approve_evidence_as_direction(p_evidence_id UUID, p_note TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_evidence RECORD;
  v_action_id UUID;
  v_is_admin BOOLEAN;
  v_manager_approved BOOLEAN;
BEGIN
  SELECT public.is_admin() INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'error', 'Apenas a direção pode aprovar');
  END IF;

  SELECT * INTO v_evidence FROM action_evidences WHERE id = p_evidence_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência não encontrada');
  END IF;

  -- Verificar se gestor já aprovou
  SELECT EXISTS (
    SELECT 1 FROM evidence_approvals 
    WHERE evidence_id = p_evidence_id AND approver_role = 'gestor' AND status = 'APROVADA'
  ) INTO v_manager_approved;

  IF NOT v_manager_approved THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência precisa ser aprovada pelo gestor primeiro');
  END IF;

  -- Verificar se já foi aprovada pela direção
  IF EXISTS (
    SELECT 1 FROM evidence_approvals 
    WHERE evidence_id = p_evidence_id AND approver_role = 'direcao'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência já aprovada pela direção');
  END IF;

  -- Inserir aprovação
  INSERT INTO evidence_approvals (evidence_id, approver_role, status, approved_by, note)
  VALUES (p_evidence_id, 'direcao', 'APROVADA', auth.uid(), p_note);

  -- Atualizar status da evidência
  UPDATE action_evidences
  SET status = 'APROVADA'
  WHERE id = p_evidence_id;

  -- Atualizar status da ação para CONCLUIDA
  UPDATE plan_actions
  SET status = 'CONCLUIDA', completed_at = now()
  WHERE id = v_evidence.action_id;

  RETURN jsonb_build_object('success', true, 'message', 'Evidência aprovada, ação concluída');
END;
$$;

-- Rejeitar evidência
CREATE OR REPLACE FUNCTION reject_evidence(p_evidence_id UUID, p_role TEXT, p_reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_evidence RECORD;
  v_action_area_id UUID;
  v_is_admin BOOLEAN;
  v_is_manager BOOLEAN;
  v_user_area_id UUID;
BEGIN
  SELECT * INTO v_evidence FROM action_evidences WHERE id = p_evidence_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Evidência não encontrada');
  END IF;

  SELECT public.action_area_id(v_evidence.action_id) INTO v_action_area_id;
  SELECT public.is_admin() INTO v_is_admin;
  
  SELECT area_id, (area_role = 'gestor') INTO v_user_area_id, v_is_manager
  FROM profiles WHERE user_id = auth.uid();

  -- Validar permissão
  IF p_role = 'gestor' AND (NOT v_is_manager OR v_user_area_id != v_action_area_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Sem permissão para rejeitar como gestor');
  END IF;

  IF p_role = 'direcao' AND NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'error', 'Sem permissão para rejeitar como direção');
  END IF;

  -- Inserir rejeição
  INSERT INTO evidence_approvals (evidence_id, approver_role, status, approved_by, note)
  VALUES (p_evidence_id, p_role, 'REPROVADA', auth.uid(), p_reason);

  -- Atualizar status da evidência
  UPDATE action_evidences
  SET status = 'REPROVADA'
  WHERE id = p_evidence_id;

  -- Voltar ação para EM_ANDAMENTO
  UPDATE plan_actions
  SET status = 'EM_ANDAMENTO'
  WHERE id = v_evidence.action_id;

  -- Registrar no histórico
  INSERT INTO action_history (action_id, field_changed, old_value, new_value, changed_by)
  VALUES (v_evidence.action_id, 'evidence_rejected', v_evidence.filename, p_reason, auth.uid());

  RETURN jsonb_build_object('success', true, 'message', 'Evidência rejeitada');
END;
$$;

-- ============================================================
-- VIEWS DE RESUMO
-- ============================================================

-- View: Progresso do plano por área
CREATE OR REPLACE VIEW vw_area_plan_progress AS
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
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
LEFT JOIN plan_actions pa ON pa.plan_id = ap.id
GROUP BY ap.id, ap.area_id, a.name, a.slug, ap.year, ap.title, ap.status;

-- View: Progresso por pilar
CREATE OR REPLACE VIEW vw_area_pillar_progress AS
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
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN plan_actions pa ON pa.plan_id = ap.id
JOIN pillars p ON p.id = pa.pillar_id
GROUP BY ap.area_id, a.name, ap.year, p.id, p.code, p.title;

-- View: Backlog de evidências pendentes
CREATE OR REPLACE VIEW vw_evidence_backlog AS
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
  (SELECT COUNT(*) FROM evidence_approvals ea WHERE ea.evidence_id = ae.id AND ea.status = 'APROVADA') AS approval_count,
  EXISTS (
    SELECT 1 FROM evidence_approvals ea 
    WHERE ea.evidence_id = ae.id AND ea.approver_role = 'gestor' AND ea.status = 'APROVADA'
  ) AS manager_approved,
  EXISTS (
    SELECT 1 FROM evidence_approvals ea 
    WHERE ea.evidence_id = ae.id AND ea.approver_role = 'direcao' AND ea.status = 'APROVADA'
  ) AS direction_approved
FROM action_evidences ae
JOIN plan_actions pa ON pa.id = ae.action_id
JOIN area_plans ap ON ap.id = pa.plan_id
JOIN areas a ON a.id = ap.area_id
WHERE ae.status IN ('PENDENTE', 'EM_VALIDACAO')
ORDER BY ae.submitted_at ASC;

-- View: Resumo de custos por área
CREATE OR REPLACE VIEW vw_area_cost_summary AS
SELECT 
  ap.area_id,
  a.name AS area_name,
  ap.year,
  pa.cost_type,
  COUNT(pa.id) AS action_count,
  COALESCE(SUM(pa.cost_estimate), 0) AS total_estimate,
  COALESCE(SUM(pa.cost_actual), 0) AS total_actual,
  COALESCE(SUM(pa.cost_actual), 0) - COALESCE(SUM(pa.cost_estimate), 0) AS variance
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN plan_actions pa ON pa.plan_id = ap.id
WHERE pa.cost_type IS NOT NULL
GROUP BY ap.area_id, a.name, ap.year, pa.cost_type;

-- View: Ações com dependências bloqueantes
CREATE OR REPLACE VIEW vw_blocked_actions AS
SELECT 
  pa.id AS action_id,
  pa.title AS action_title,
  pa.status,
  ap.area_id,
  a.name AS area_name,
  dep_pa.id AS blocking_action_id,
  dep_pa.title AS blocking_action_title,
  dep_pa.status AS blocking_action_status
FROM plan_actions pa
JOIN action_dependencies ad ON ad.action_id = pa.id
JOIN plan_actions dep_pa ON dep_pa.id = ad.depends_on_action_id
JOIN area_plans ap ON ap.id = pa.plan_id
JOIN areas a ON a.id = ap.area_id
WHERE dep_pa.status NOT IN ('CONCLUIDA', 'CANCELADA')
  AND pa.status = 'BLOQUEADA';

-- ============================================================
-- STORAGE BUCKET PARA EVIDÊNCIAS
-- ============================================================

-- Nota: Este comando deve ser executado via Supabase Dashboard ou CLI
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('action-evidences', 'action-evidences', false);

-- Políticas de storage (executar no dashboard):
-- CREATE POLICY "Users can upload evidences to their area"
-- ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK (
--   bucket_id = 'action-evidences' AND
--   (storage.foldername(name))[1] = public.user_area_id()::text
-- );

-- CREATE POLICY "Users can view evidences from their area"
-- ON storage.objects FOR SELECT TO authenticated
-- USING (
--   bucket_id = 'action-evidences' AND
--   (public.is_admin() OR (storage.foldername(name))[1] = public.user_area_id()::text)
-- );

-- ============================================================
-- FIM DA MIGRAÇÃO
-- ============================================================
