-- ============================================================
-- MIGRATION FRENTE 1 — Goals e Indicators para Supabase
-- Versão: 1.0.0
-- Data: 2026-03-21
-- Objetivo: Estender tabelas goals e indicators com colunas
--   compatíveis com os tipos TypeScript existentes, para
--   eliminar o mock inline e usar Supabase como fonte oficial.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. GOALS — adicionar colunas faltantes
-- ============================================================

ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS category    TEXT;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS period      TEXT CHECK (period IN ('daily','weekly','monthly','quarterly','yearly'));
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS start_date  DATE;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS end_date    DATE;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS user_id     TEXT;

-- Garantir CHECK no status para alinhar com GoalStatus do TypeScript
ALTER TABLE public.goals DROP CONSTRAINT IF EXISTS goals_status_check;
ALTER TABLE public.goals ADD CONSTRAINT goals_status_check
  CHECK (status IN ('active', 'paused', 'completed', 'cancelled'));

-- Trigger updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'goals_updated_at'
      AND tgrelid = 'public.goals'::regclass
  ) THEN
    CREATE TRIGGER goals_updated_at
      BEFORE UPDATE ON public.goals
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- ============================================================
-- 2. INDICATORS — adicionar colunas faltantes
-- ============================================================

ALTER TABLE public.indicators ADD COLUMN IF NOT EXISTS previous_value NUMERIC;
ALTER TABLE public.indicators ADD COLUMN IF NOT EXISTS category       TEXT;
ALTER TABLE public.indicators ADD COLUMN IF NOT EXISTS trend          TEXT CHECK (trend IN ('up','down','stable'));
ALTER TABLE public.indicators ADD COLUMN IF NOT EXISTS date           DATE;
ALTER TABLE public.indicators ADD COLUMN IF NOT EXISTS user_id        TEXT;

-- Trigger updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'indicators_updated_at'
      AND tgrelid = 'public.indicators'::regclass
  ) THEN
    CREATE TRIGGER indicators_updated_at
      BEFORE UPDATE ON public.indicators
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- ============================================================
-- 3. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_goals_status    ON public.goals (status);
CREATE INDEX IF NOT EXISTS idx_goals_category  ON public.goals (category);
CREATE INDEX IF NOT EXISTS idx_goals_period    ON public.goals (period);
CREATE INDEX IF NOT EXISTS idx_indicators_category ON public.indicators (category);
CREATE INDEX IF NOT EXISTS idx_indicators_date     ON public.indicators (date DESC);

COMMIT;
