-- ============================================================
-- MIGRATION ONDA A — Base Canônica PE2026
-- Versão: 1.0.0
-- Data: 2026-03-19
-- Descrição: Entidades novas do domínio mestre PE2026:
--   strategic_themes, motors, strategic_risks, financial_scenarios
--   + extensões em initiatives (motor_id, budget_estimate, motor_codes)
-- ============================================================

-- ============================================================
-- 1. TEMAS ESTRATÉGICOS (TH-01 a TH-08) — DOC 02 v2
-- ============================================================

CREATE TABLE IF NOT EXISTS public.strategic_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,               -- ex: TH-01
  title TEXT NOT NULL,
  description TEXT,
  pillar_codes TEXT[],                     -- pilares relacionados ex: {'P1','P2'}
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_strategic_themes_code ON public.strategic_themes(code);

ALTER TABLE public.strategic_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "strategic_themes_select_all" ON public.strategic_themes
  FOR SELECT USING (true);

CREATE POLICY "strategic_themes_modify_admin" ON public.strategic_themes
  FOR ALL USING (public.is_admin());

DROP TRIGGER IF EXISTS set_strategic_themes_updated_at ON public.strategic_themes;
CREATE TRIGGER set_strategic_themes_updated_at
  BEFORE UPDATE ON public.strategic_themes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 2. MOTORES ESTRATÉGICOS (M1–M5) — DOC 08 v2
-- ============================================================

CREATE TABLE IF NOT EXISTS public.motors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,               -- ex: M1
  title TEXT NOT NULL,
  description TEXT,
  pillar_code TEXT,                        -- pilar âncora ex: P2
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_motors_code ON public.motors(code);

ALTER TABLE public.motors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "motors_select_all" ON public.motors
  FOR SELECT USING (true);

CREATE POLICY "motors_modify_admin" ON public.motors
  FOR ALL USING (public.is_admin());

DROP TRIGGER IF EXISTS set_motors_updated_at ON public.motors;
CREATE TRIGGER set_motors_updated_at
  BEFORE UPDATE ON public.motors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 3. RISCOS ESTRATÉGICOS (RSK-2026-01 a RSK-2026-13) — DOC 10 v2
-- ============================================================

CREATE TABLE IF NOT EXISTS public.strategic_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,               -- ex: RSK-2026-01
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,                           -- ex: Regulatório, Operacional
  severity TEXT NOT NULL DEFAULT 'ALTO'    -- CRITICO, ALTO, MONITORADO
    CHECK (severity IN ('CRITICO', 'ALTO', 'MONITORADO')),
  probability TEXT NOT NULL DEFAULT 'MEDIO'
    CHECK (probability IN ('ALTO', 'MEDIO', 'BAIXO')),
  impact TEXT NOT NULL DEFAULT 'ALTO'
    CHECK (impact IN ('CRITICO', 'ALTO', 'MEDIO', 'BAIXO')),
  owner TEXT,
  mitigation TEXT,
  pillar_code TEXT,
  status TEXT NOT NULL DEFAULT 'ATIVO'
    CHECK (status IN ('ATIVO', 'MITIGADO', 'ACEITO', 'ENCERRADO')),
  review_cadence TEXT DEFAULT 'MENSAL',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_strategic_risks_code ON public.strategic_risks(code);
CREATE INDEX IF NOT EXISTS idx_strategic_risks_severity ON public.strategic_risks(severity);
CREATE INDEX IF NOT EXISTS idx_strategic_risks_status ON public.strategic_risks(status);

ALTER TABLE public.strategic_risks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "strategic_risks_select_all" ON public.strategic_risks
  FOR SELECT USING (true);

CREATE POLICY "strategic_risks_modify_admin" ON public.strategic_risks
  FOR ALL USING (public.is_admin());

DROP TRIGGER IF EXISTS set_strategic_risks_updated_at ON public.strategic_risks;
CREATE TRIGGER set_strategic_risks_updated_at
  BEFORE UPDATE ON public.strategic_risks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 4. CENÁRIOS FINANCEIROS — DOC 07 v2 + DOC 09 v3
-- ============================================================

CREATE TABLE IF NOT EXISTS public.financial_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,               -- ex: PESSIMISTA, BASE, OTIMISTA
  label TEXT NOT NULL,
  probability_pct NUMERIC(5,2) NOT NULL,   -- % de probabilidade ex: 60.00
  revenue_target NUMERIC(14,2) NOT NULL,   -- ex: 11440000.00
  margin_target NUMERIC(5,2) NOT NULL,     -- % ex: 30.0
  description TEXT,
  is_reference BOOLEAN DEFAULT false,      -- TRUE para o cenário base
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financial_scenarios_code ON public.financial_scenarios(code);

ALTER TABLE public.financial_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "financial_scenarios_select_all" ON public.financial_scenarios
  FOR SELECT USING (true);

CREATE POLICY "financial_scenarios_modify_admin" ON public.financial_scenarios
  FOR ALL USING (public.is_admin());

DROP TRIGGER IF EXISTS set_financial_scenarios_updated_at ON public.financial_scenarios;
CREATE TRIGGER set_financial_scenarios_updated_at
  BEFORE UPDATE ON public.financial_scenarios
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 5. EXTENSÕES EM TABELAS EXISTENTES
-- ============================================================

-- 5.1 initiatives: adicionar motor_id, budget_estimate e motor_codes
ALTER TABLE public.initiatives
  ADD COLUMN IF NOT EXISTS motor_id UUID REFERENCES public.motors(id),
  ADD COLUMN IF NOT EXISTS budget_estimate NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS motor_codes TEXT[];

CREATE INDEX IF NOT EXISTS idx_initiatives_motor ON public.initiatives(motor_id);

-- 5.2 pillars: adicionar description (texto ampliado além de frontier)
ALTER TABLE public.pillars
  ADD COLUMN IF NOT EXISTS description TEXT;

-- 5.3 subpillars: garantir campo description
ALTER TABLE public.subpillars
  ADD COLUMN IF NOT EXISTS description TEXT;

-- 5.4 corporate_okrs: adicionar code canônico
ALTER TABLE public.corporate_okrs
  ADD COLUMN IF NOT EXISTS code TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_corporate_okrs_code ON public.corporate_okrs(code)
  WHERE code IS NOT NULL;

-- 5.5 key_results: adicionar current_value_numeric para cálculo de engine
ALTER TABLE public.key_results
  ADD COLUMN IF NOT EXISTS current_value_numeric NUMERIC(14,4),
  ADD COLUMN IF NOT EXISTS target_numeric NUMERIC(14,4),
  ADD COLUMN IF NOT EXISTS unit TEXT;

-- ============================================================
-- 6. TABELA DE SUBPILARES — garantir presença de updated_at trigger
-- ============================================================

DROP TRIGGER IF EXISTS set_subpillars_updated_at ON public.subpillars;
CREATE TRIGGER set_subpillars_updated_at
  BEFORE UPDATE ON public.subpillars
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- FIM DA MIGRATION ONDA A
-- ============================================================
