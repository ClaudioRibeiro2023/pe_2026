-- ============================================================
-- MIGRATION FRENTE 1 — Extensão de action_plans para PE2026
-- Data: 2026-03-21
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Corrigir constraints de status e priority
-- ============================================================

ALTER TABLE public.action_plans DROP CONSTRAINT IF EXISTS action_plans_status_check;
ALTER TABLE public.action_plans ADD CONSTRAINT action_plans_status_check
  CHECK (status IN ('draft','planned','in_progress','blocked','completed','cancelled','pending'));

ALTER TABLE public.action_plans DROP CONSTRAINT IF EXISTS action_plans_priority_check;
ALTER TABLE public.action_plans ADD CONSTRAINT action_plans_priority_check
  CHECK (priority IN ('low','medium','high','critical','urgent'));

-- ============================================================
-- 2. Tornar user_id nullable (para registros canônicos)
-- ============================================================

ALTER TABLE public.action_plans ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS is_canonical BOOLEAN NOT NULL DEFAULT false;

-- ============================================================
-- 3. Adicionar colunas faltantes
-- ============================================================

-- Vinculações
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS area_id      TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS area_name    TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS parent_plan_id UUID;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS linked_kpis  JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS linked_goals JSONB NOT NULL DEFAULT '[]';

-- Status estendido
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS health       TEXT CHECK (health IN ('on_track','at_risk','off_track')) DEFAULT 'on_track';

-- PDCA
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS pdca_phase   TEXT CHECK (pdca_phase IN ('plan','do','check','act')) DEFAULT 'plan';
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS pdca_history JSONB NOT NULL DEFAULT '[]';

-- 5W2H
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS what             TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS why              TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS where_location   TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS when_start       DATE;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS when_end         DATE;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS who_responsible  TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS who_team         JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS how              TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS how_much         NUMERIC;

-- Progresso e marcos
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS progress    NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS milestones  JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS tasks       JSONB NOT NULL DEFAULT '[]';

-- Risco e responsabilidade
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS risk_level        TEXT CHECK (risk_level IN ('low','medium','high'));
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS risk_description  TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS mitigation_plan   TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS owner_id          TEXT;
ALTER TABLE public.action_plans ADD COLUMN IF NOT EXISTS sponsor_id        TEXT;

-- ============================================================
-- 4. RLS para canônicos
-- ============================================================

DROP POLICY IF EXISTS "action_plans_canonical_select" ON public.action_plans;
CREATE POLICY "action_plans_canonical_select"
  ON public.action_plans FOR SELECT
  TO authenticated
  USING (is_canonical = true);

-- ============================================================
-- 5. Índices
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_action_plans_area_id    ON public.action_plans (area_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_health     ON public.action_plans (health);
CREATE INDEX IF NOT EXISTS idx_action_plans_canonical  ON public.action_plans (is_canonical) WHERE is_canonical = true;

COMMIT;
