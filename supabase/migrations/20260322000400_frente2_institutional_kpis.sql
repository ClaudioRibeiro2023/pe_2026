-- ============================================================
-- MIGRATION FRENTE 2 — institutional_kpis + Snapshots
-- Data: 2026-03-21
-- Objetivo: Operacionalizar o placar institucional com KPIs
--   homologados, engine de cálculo e histórico por ciclo.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. TABELA institutional_kpis
-- ============================================================

CREATE TABLE IF NOT EXISTS public.institutional_kpis (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                  TEXT NOT NULL UNIQUE,        -- ex: A1, P2.KPI-03, C7
  name                  TEXT NOT NULL,
  description           TEXT,
  formula               TEXT,                        -- definição da fórmula oficial
  unit                  TEXT,                        -- %, R$, ha, ha/mês, dias
  category              TEXT NOT NULL,               -- guardrail | pillar | monetization | sectoral
  pillar_code           TEXT,                        -- P1..P5 (null para guardrails)
  is_guardrail          BOOLEAN NOT NULL DEFAULT false,
  is_monetization       BOOLEAN NOT NULL DEFAULT false,
  threshold             NUMERIC,                     -- valor de corte (ok → atenção)
  critical_threshold    NUMERIC,                     -- valor de corte crítico
  direction             TEXT CHECK (direction IN ('above','below')),  -- qual direção é ruim
  granularity           TEXT DEFAULT 'monthly',      -- daily | weekly | monthly | quarterly
  temporal_window       TEXT,                        -- ex: 30/60/90, ciclo anual
  owner_functional      TEXT,                        -- owner funcional (área/pessoa)
  owner_technical       TEXT,                        -- owner técnico (sistema/API)
  source_table          TEXT,                        -- tabela Supabase de origem
  status_homologation   TEXT NOT NULL DEFAULT 'pending'
    CHECK (status_homologation IN ('pending','homologated','deprecated')),
  sort_order            INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.institutional_kpis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ikpis_select_auth" ON public.institutional_kpis;
CREATE POLICY "ikpis_select_auth"
  ON public.institutional_kpis FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "ikpis_modify_admin" ON public.institutional_kpis;
CREATE POLICY "ikpis_modify_admin"
  ON public.institutional_kpis FOR ALL
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_ikpis_code         ON public.institutional_kpis (code);
CREATE INDEX IF NOT EXISTS idx_ikpis_category     ON public.institutional_kpis (category);
CREATE INDEX IF NOT EXISTS idx_ikpis_guardrail    ON public.institutional_kpis (is_guardrail) WHERE is_guardrail = true;
CREATE INDEX IF NOT EXISTS idx_ikpis_monetization ON public.institutional_kpis (is_monetization) WHERE is_monetization = true;

-- ============================================================
-- 2. TABELA kpi_snapshots
-- ============================================================

CREATE TABLE IF NOT EXISTS public.kpi_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id        UUID NOT NULL REFERENCES public.institutional_kpis(id) ON DELETE CASCADE,
  kpi_code      TEXT NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cycle         TEXT NOT NULL,                   -- ex: WBR-2026-W12, MBR-2026-03, QBR-2026-Q1
  value         NUMERIC,
  status        TEXT CHECK (status IN ('ok','attention','critical','no_data')),
  notes         TEXT,
  created_by    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kpi_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kpi_snapshots_select_auth" ON public.kpi_snapshots;
CREATE POLICY "kpi_snapshots_select_auth"
  ON public.kpi_snapshots FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "kpi_snapshots_insert_admin" ON public.kpi_snapshots;
CREATE POLICY "kpi_snapshots_insert_admin"
  ON public.kpi_snapshots FOR ALL
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_kpi_id ON public.kpi_snapshots (kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_cycle  ON public.kpi_snapshots (cycle);
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_date   ON public.kpi_snapshots (snapshot_date DESC);

-- ============================================================
-- 3. TABELA kr_snapshots
-- ============================================================

CREATE TABLE IF NOT EXISTS public.kr_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kr_id         UUID NOT NULL REFERENCES public.key_results(id) ON DELETE CASCADE,
  kr_code       TEXT NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cycle         TEXT NOT NULL,
  value         NUMERIC,
  status        TEXT CHECK (status IN ('ok','attention','critical','no_data')),
  notes         TEXT,
  created_by    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kr_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kr_snapshots_select_auth" ON public.kr_snapshots;
CREATE POLICY "kr_snapshots_select_auth"
  ON public.kr_snapshots FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "kr_snapshots_insert_admin" ON public.kr_snapshots;
CREATE POLICY "kr_snapshots_insert_admin"
  ON public.kr_snapshots FOR ALL
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_kr_snapshots_kr_id ON public.kr_snapshots (kr_id);
CREATE INDEX IF NOT EXISTS idx_kr_snapshots_cycle ON public.kr_snapshots (cycle);

-- ============================================================
-- 4. TABELA risk_snapshots
-- ============================================================

CREATE TABLE IF NOT EXISTS public.risk_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id       UUID NOT NULL REFERENCES public.strategic_risks(id) ON DELETE CASCADE,
  risk_code     TEXT NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cycle         TEXT NOT NULL,
  severity      TEXT CHECK (severity IN ('CRITICO','ALTO','MONITORADO','BAIXO')),
  probability   TEXT CHECK (probability IN ('ALTA','MEDIA','BAIXA')),
  impact        TEXT CHECK (impact IN ('ALTO','MEDIO','BAIXO')),
  status        TEXT CHECK (status IN ('ATIVO','MITIGADO','ACEITO','ENCERRADO')),
  notes         TEXT,
  created_by    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.risk_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "risk_snapshots_select_auth" ON public.risk_snapshots;
CREATE POLICY "risk_snapshots_select_auth"
  ON public.risk_snapshots FOR SELECT
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_risk_snapshots_risk_id ON public.risk_snapshots (risk_id);
CREATE INDEX IF NOT EXISTS idx_risk_snapshots_cycle   ON public.risk_snapshots (cycle);

-- ============================================================
-- 5. TABELA forecast_snapshots
-- ============================================================

CREATE TABLE IF NOT EXISTS public.forecast_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  cycle           TEXT NOT NULL,
  horizon         TEXT NOT NULL CHECK (horizon IN ('30d','60d','90d')),
  scenario        TEXT CHECK (scenario IN ('BASE','OTIMISTA','PESSIMISTA')),
  forecast_value  NUMERIC,
  actual_value    NUMERIC,
  variance_pct    NUMERIC,
  notes           TEXT,
  created_by      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.forecast_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "forecast_snapshots_select_auth" ON public.forecast_snapshots;
CREATE POLICY "forecast_snapshots_select_auth"
  ON public.forecast_snapshots FOR SELECT
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_forecast_snapshots_cycle ON public.forecast_snapshots (cycle);

-- ============================================================
-- 6. FUNÇÃO take_snapshot — congela leitura atual de KPIs
-- ============================================================

CREATE OR REPLACE FUNCTION public.take_kpi_snapshot(p_cycle TEXT, p_created_by TEXT DEFAULT current_user)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT := 0;
BEGIN
  INSERT INTO public.kpi_snapshots (kpi_id, kpi_code, snapshot_date, cycle, created_by)
  SELECT id, code, CURRENT_DATE, p_cycle, p_created_by
  FROM public.institutional_kpis
  WHERE status_homologation = 'homologated'
  ON CONFLICT DO NOTHING;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RAISE NOTICE '[take_kpi_snapshot] Ciclo % — % KPIs snapshotados', p_cycle, v_count;
  RETURN v_count;
END;
$$;

-- ============================================================
-- 7. VIEW v_snapshot_comparison
-- ============================================================

CREATE OR REPLACE VIEW public.v_snapshot_comparison AS
SELECT
  k.code,
  k.name,
  k.category,
  s.cycle,
  s.snapshot_date,
  s.value,
  s.status,
  LAG(s.value)  OVER (PARTITION BY k.id ORDER BY s.snapshot_date) AS prev_value,
  LAG(s.status) OVER (PARTITION BY k.id ORDER BY s.snapshot_date) AS prev_status
FROM public.kpi_snapshots s
JOIN public.institutional_kpis k ON k.id = s.kpi_id
ORDER BY k.code, s.snapshot_date DESC;

COMMIT;
