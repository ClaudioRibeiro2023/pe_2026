-- ============================================================
-- MIGRATION ONDA F — Dual-Run, Cutover e Rollback PE2026
-- Versão: 1.0.0
-- Data: 2026-03-21
-- Base: Onda A (canonical base) + Onda B (hardening)
-- ============================================================
-- Objetivo:
--   Preparar infraestrutura para operação assistida com dual-run:
--   - Tabela feature_flags para controle de cutover por módulo
--   - Tabela cutover_log para rastrear cada transição mock→prod
--   - Função set_feature_flag para ativar/desativar módulos
--   - Função rollback_module para reverter cutover individual
--   - View v_cutover_status para monitoramento em tempo real
-- ============================================================

BEGIN;

-- ============================================================
-- 1. FEATURE FLAGS — controle granular de cutover por módulo
-- ============================================================

CREATE TABLE IF NOT EXISTS public.feature_flags (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module       text NOT NULL UNIQUE,    -- ex: 'area-plans', 'scoreboard', 'initiatives'
  enabled      boolean NOT NULL DEFAULT false,
  source       text NOT NULL DEFAULT 'mock'  CHECK (source IN ('mock', 'supabase', 'hybrid')),
  description  text,
  enabled_at   timestamptz,
  enabled_by   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Trigger updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'feature_flags_updated_at'
      AND tgrelid = 'public.feature_flags'::regclass
  ) THEN
    CREATE TRIGGER feature_flags_updated_at
      BEFORE UPDATE ON public.feature_flags
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- ============================================================
-- 2. CUTOVER LOG — rastreabilidade de cada transição
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cutover_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module       text NOT NULL,
  action       text NOT NULL CHECK (action IN ('ENABLE', 'DISABLE', 'ROLLBACK', 'VALIDATE')),
  from_source  text NOT NULL,
  to_source    text NOT NULL,
  status       text NOT NULL DEFAULT 'OK' CHECK (status IN ('OK', 'FAILED', 'ROLLED_BACK')),
  performed_by text,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. SEEDS DE FEATURE FLAGS — todos módulos em mock por padrão
-- ============================================================

INSERT INTO public.feature_flags (module, enabled, source, description) VALUES
  ('area-plans',   false, 'mock',     'Planos de ação e INITs por área'),
  ('scoreboard',   false, 'mock',     'Placar institucional — guardrails A1-A4, KPIs B, Monetização C1-C7'),
  ('initiatives',  false, 'mock',     'Carteira de iniciativas INIT-001..INIT-022'),
  ('okrs',         false, 'mock',     'OKRs corporativos OKR-P1..OKR-P5 e 25 KRs'),
  ('finance',      false, 'mock',     'Cenários financeiros e riscos estratégicos'),
  ('goals',        false, 'mock',     'Metas operacionais e guardrails'),
  ('indicators',   false, 'mock',     'Indicadores setoriais e KPIs de monetização'),
  ('governance',   false, 'mock',     'Cadências WBR/MBR/QBR e registros DEC-*/RSK-*'),
  ('action-plans', false, 'mock',     'Planos de ação setoriais'),
  ('strategy',     false, 'mock',     'Contexto estratégico e temas estratégicos')
ON CONFLICT (module) DO NOTHING;

-- ============================================================
-- 4. FUNÇÃO set_feature_flag — ativar módulo com log
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_feature_flag(
  p_module      text,
  p_enabled     boolean,
  p_source      text DEFAULT 'supabase',
  p_performed_by text DEFAULT current_user
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_from_source text;
  v_from_enabled boolean;
BEGIN
  SELECT source, enabled INTO v_from_source, v_from_enabled
  FROM public.feature_flags
  WHERE module = p_module;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Módulo % não encontrado em feature_flags', p_module;
  END IF;

  UPDATE public.feature_flags
  SET enabled    = p_enabled,
      source     = CASE WHEN p_enabled THEN p_source ELSE 'mock' END,
      enabled_at = CASE WHEN p_enabled THEN now() ELSE NULL END,
      enabled_by = CASE WHEN p_enabled THEN p_performed_by ELSE NULL END
  WHERE module = p_module;

  INSERT INTO public.cutover_log (module, action, from_source, to_source, performed_by, notes)
  VALUES (
    p_module,
    CASE WHEN p_enabled THEN 'ENABLE' ELSE 'DISABLE' END,
    v_from_source,
    CASE WHEN p_enabled THEN p_source ELSE 'mock' END,
    p_performed_by,
    format('Módulo %s: %s → %s', p_module,
      CASE WHEN v_from_enabled THEN 'habilitado' ELSE 'desabilitado' END,
      CASE WHEN p_enabled THEN 'habilitado' ELSE 'desabilitado' END
    )
  );

  RAISE NOTICE 'Feature flag [%] atualizado: enabled=%, source=%', p_module, p_enabled, p_source;
END;
$$;

-- ============================================================
-- 5. FUNÇÃO rollback_module — reverter cutover individual
-- ============================================================

CREATE OR REPLACE FUNCTION public.rollback_module(
  p_module      text,
  p_performed_by text DEFAULT current_user,
  p_reason       text DEFAULT 'rollback manual'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_source text;
BEGIN
  SELECT source INTO v_current_source
  FROM public.feature_flags
  WHERE module = p_module;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Módulo % não encontrado em feature_flags', p_module;
  END IF;

  UPDATE public.feature_flags
  SET enabled    = false,
      source     = 'mock',
      enabled_at = NULL,
      enabled_by = NULL
  WHERE module = p_module;

  INSERT INTO public.cutover_log (module, action, from_source, to_source, status, performed_by, notes)
  VALUES (
    p_module,
    'ROLLBACK',
    v_current_source,
    'mock',
    'ROLLED_BACK',
    p_performed_by,
    format('ROLLBACK: %s. Razão: %s', p_module, p_reason)
  );

  RAISE NOTICE 'ROLLBACK concluído para módulo [%]: retornou para mock. Razão: %', p_module, p_reason;
END;
$$;

-- ============================================================
-- 6. FUNÇÃO rollback_all — rollback global de emergência
-- ============================================================

CREATE OR REPLACE FUNCTION public.rollback_all(
  p_performed_by text DEFAULT current_user,
  p_reason       text DEFAULT 'rollback global de emergência'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_module text;
  v_source text;
BEGIN
  FOR v_module, v_source IN
    SELECT module, source FROM public.feature_flags WHERE enabled = true
  LOOP
    UPDATE public.feature_flags
    SET enabled    = false,
        source     = 'mock',
        enabled_at = NULL,
        enabled_by = NULL
    WHERE module = v_module;

    INSERT INTO public.cutover_log (module, action, from_source, to_source, status, performed_by, notes)
    VALUES (v_module, 'ROLLBACK', v_source, 'mock', 'ROLLED_BACK', p_performed_by,
      format('ROLLBACK GLOBAL: %s', p_reason));
  END LOOP;

  RAISE NOTICE 'ROLLBACK GLOBAL concluído. Todos os módulos retornaram para mock. Razão: %', p_reason;
END;
$$;

-- ============================================================
-- 7. FUNÇÃO validate_cutover — verifica integridade antes do cutover
-- ============================================================

CREATE OR REPLACE FUNCTION public.validate_cutover(p_module text)
RETURNS TABLE(check_name text, status text, detail text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_areas       int; v_pillars   int; v_okrs      int;
  v_krs         int; v_inits     int; v_risks     int;
  v_scenarios   int; v_themes    int;
BEGIN
  -- Verifica presença dos dados canônicos antes de liberar cutover
  SELECT COUNT(*) INTO v_areas       FROM public.areas;
  SELECT COUNT(*) INTO v_pillars     FROM public.pillars;
  SELECT COUNT(*) INTO v_okrs        FROM public.corporate_okrs;
  SELECT COUNT(*) INTO v_krs         FROM public.key_results;
  SELECT COUNT(*) INTO v_inits       FROM public.initiatives;
  SELECT COUNT(*) INTO v_risks       FROM public.strategic_risks;
  SELECT COUNT(*) INTO v_scenarios   FROM public.financial_scenarios;
  SELECT COUNT(*) INTO v_themes      FROM public.strategic_themes;

  RETURN QUERY VALUES
    ('areas',     CASE WHEN v_areas     >= 7  THEN 'OK' ELSE 'FALHA' END, format('%s/7',     v_areas)),
    ('pillars',   CASE WHEN v_pillars   >= 5  THEN 'OK' ELSE 'FALHA' END, format('%s/5',     v_pillars)),
    ('okrs',      CASE WHEN v_okrs      >= 5  THEN 'OK' ELSE 'FALHA' END, format('%s/5',     v_okrs)),
    ('key_results',CASE WHEN v_krs      >= 25 THEN 'OK' ELSE 'FALHA' END, format('%s/25',    v_krs)),
    ('initiatives',CASE WHEN v_inits    >= 22 THEN 'OK' ELSE 'FALHA' END, format('%s/22',    v_inits)),
    ('risks',     CASE WHEN v_risks     >= 13 THEN 'OK' ELSE 'FALHA' END, format('%s/13',    v_risks)),
    ('scenarios', CASE WHEN v_scenarios >= 3  THEN 'OK' ELSE 'FALHA' END, format('%s/3',     v_scenarios)),
    ('themes',    CASE WHEN v_themes    >= 8  THEN 'OK' ELSE 'FALHA' END, format('%s/8',     v_themes));

  -- Log da validação
  INSERT INTO public.cutover_log (module, action, from_source, to_source, performed_by, notes)
  VALUES (p_module, 'VALIDATE', 'mock', 'supabase', current_user,
    format('Pré-validação de cutover: areas=%s pillars=%s okrs=%s krs=%s inits=%s',
      v_areas, v_pillars, v_okrs, v_krs, v_inits));
END;
$$;

-- ============================================================
-- 8. VIEW v_cutover_status — monitoramento em tempo real
-- ============================================================

CREATE OR REPLACE VIEW public.v_cutover_status AS
SELECT
  ff.module,
  ff.enabled,
  ff.source,
  ff.description,
  ff.enabled_at,
  ff.enabled_by,
  COALESCE(recent.last_action, '—')  AS last_action,
  COALESCE(recent.last_status, '—')  AS last_status,
  recent.last_at
FROM public.feature_flags ff
LEFT JOIN LATERAL (
  SELECT action AS last_action, status AS last_status, created_at AS last_at
  FROM public.cutover_log
  WHERE module = ff.module
  ORDER BY created_at DESC
  LIMIT 1
) recent ON true
ORDER BY ff.module;

-- ============================================================
-- 9. RLS para feature_flags e cutover_log
-- ============================================================

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cutover_log   ENABLE ROW LEVEL SECURITY;

-- Apenas admins leem e modificam feature_flags
DROP POLICY IF EXISTS "feature_flags_admin_all" ON public.feature_flags;
CREATE POLICY "feature_flags_admin_all"
  ON public.feature_flags FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Todos autenticados leem cutover_log (auditoria), só admins inserem
DROP POLICY IF EXISTS "cutover_log_read"   ON public.cutover_log;
DROP POLICY IF EXISTS "cutover_log_insert" ON public.cutover_log;

CREATE POLICY "cutover_log_read"
  ON public.cutover_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "cutover_log_insert"
  ON public.cutover_log FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ============================================================
-- 10. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_cutover_log_module    ON public.cutover_log (module);
CREATE INDEX IF NOT EXISTS idx_cutover_log_created   ON public.cutover_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_flags_module  ON public.feature_flags (module);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON public.feature_flags (enabled) WHERE enabled = true;

COMMIT;
