-- ============================================================
-- MIGRATION FRENTE 3 — Decisões Formais + Rastreabilidade
-- Data: 2026-03-21
-- ============================================================

BEGIN;

-- ============================================================
-- 1. TABELA formal_decisions (DEC-YYYYMMDD-NNN)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.formal_decisions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           TEXT NOT NULL UNIQUE,   -- DEC-20260321-001
  title          TEXT NOT NULL,
  context        TEXT,
  decided_by     TEXT NOT NULL,          -- nome ou cargo do decisor
  decided_at     DATE NOT NULL DEFAULT CURRENT_DATE,
  pillar_code    TEXT,                   -- P1..P5
  okr_code       TEXT,                   -- ex: P1-OKR-01
  initiative_code TEXT,                  -- ex: INIT-001
  status         TEXT NOT NULL DEFAULT 'ATIVA'
    CHECK (status IN ('ATIVA','REVISADA','REVOGADA')),
  review_date    DATE,
  is_canonical   BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.formal_decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "decisions_select_auth" ON public.formal_decisions;
CREATE POLICY "decisions_select_auth"
  ON public.formal_decisions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "decisions_modify_admin" ON public.formal_decisions;
CREATE POLICY "decisions_modify_admin"
  ON public.formal_decisions FOR ALL
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_decisions_code       ON public.formal_decisions (code);
CREATE INDEX IF NOT EXISTS idx_decisions_status     ON public.formal_decisions (status);
CREATE INDEX IF NOT EXISTS idx_decisions_pillar     ON public.formal_decisions (pillar_code);
CREATE INDEX IF NOT EXISTS idx_decisions_decided_at ON public.formal_decisions (decided_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'formal_decisions_updated_at'
      AND tgrelid = 'public.formal_decisions'::regclass
  ) THEN
    CREATE TRIGGER formal_decisions_updated_at
      BEFORE UPDATE ON public.formal_decisions
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- ============================================================
-- 2. SEED: Decisões canônicas iniciais do PE2026
-- ============================================================

INSERT INTO public.formal_decisions (
  code, title, context, decided_by, decided_at,
  pillar_code, status, is_canonical
) VALUES
(
  'DEC-20260101-001',
  'Aprovação do PE2026 como plano oficial',
  'Planejamento Estratégico 2026 aprovado pela Direção com 5 pilares, 5 OKRs corporativos e 22 iniciativas. Referência: DOC 04, DOC 06, DOC 08.',
  'Cláudio Ribeiro / Direção',
  '2026-01-01',
  NULL, 'ATIVA', true
),
(
  'DEC-20260101-002',
  'Adoção do cenário BASE como referência orçamentária',
  'Cenário BASE (R$ 11,44M, 60% probabilidade) definido como baseline para metas e envelopes. Cenários OTIMISTA e PESSIMISTA como balizadores. Referência: DOC 07.',
  'Cláudio Ribeiro / Direção + Financeiro',
  '2026-01-01',
  'P2', 'ATIVA', true
),
(
  'DEC-20260205-001',
  'Implantação da Sala de Situação Pareto Top-14',
  'Decisão de instalar governança semanal de monetização com WBR focado nos 14 maiores saldos. Referência: AP-05 + MAP-TRC.',
  'CS / Relacionamento + Direção',
  '2026-02-05',
  'P2', 'ATIVA', true
),
(
  'DEC-20260210-001',
  'Separação econômica Aero × Techdengue',
  'Aprovação do DRE gerencial por unidade de negócio para preparação de transação e visibilidade de margem. Referência: AP-07 + DOC 09.',
  'Financeiro + Direção Executiva',
  '2026-02-10',
  'P1', 'ATIVA', true
),
(
  'DEC-20260321-001',
  'Cutover da plataforma PE2026 para Supabase',
  'Todos os 10 módulos da plataforma ativados com source=supabase via feature flags. Dados canônicos carregados e validados. Rollback disponível via rollback_module().',
  'Cascade / Direção Técnica',
  '2026-03-21',
  NULL, 'ATIVA', true
)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 3. VIEW vw_traceability — cadeia Pilar→OKR→KR→INIT→Plano
-- ============================================================

CREATE OR REPLACE VIEW public.vw_traceability AS
SELECT
  p.code         AS pillar_code,
  p.title        AS pillar_name,
  o.code         AS okr_code,
  o.objective    AS okr_objective,
  kr.code        AS kr_code,
  kr.title       AS kr_title,
  kr.target      AS kr_target,
  kr.current_value AS kr_current,
  kr.status      AS kr_status,
  i.code         AS initiative_code,
  i.title        AS initiative_title,
  i.status       AS initiative_status,
  i.priority     AS initiative_priority,
  i.type         AS initiative_type,
  i.owner        AS initiative_owner
FROM public.pillars p
LEFT JOIN public.corporate_okrs o  ON o.pillar_id = p.id
LEFT JOIN public.key_results    kr ON kr.okr_id   = o.id
LEFT JOIN public.initiatives    i  ON i.kr_code   = kr.code
ORDER BY p.code, o.code, kr.code, i.code;

-- ============================================================
-- 4. VIEW vw_modules_status — status de todos os módulos
-- ============================================================

CREATE OR REPLACE VIEW public.vw_modules_status AS
SELECT
  ff.module,
  ff.enabled,
  ff.source,
  ff.enabled_at,
  ff.enabled_by,
  ff.description,
  (SELECT COUNT(*) FROM public.cutover_log cl WHERE cl.module = ff.module) AS total_cutover_events,
  (SELECT MAX(cl.created_at) FROM public.cutover_log cl WHERE cl.module = ff.module) AS last_event_at
FROM public.feature_flags ff
ORDER BY ff.module;

COMMIT;
