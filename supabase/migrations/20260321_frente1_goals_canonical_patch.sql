-- ============================================================
-- MIGRATION FRENTE 1 PATCH — Suporte a dados canônicos em
--   goals e indicators (sem owner de usuário)
-- Data: 2026-03-21
-- ============================================================
-- Problema: user_id UUID NOT NULL FK→auth.users impede inserção
--   de registros canônicos do PE (que não pertencem a nenhum usuário).
-- Solução: tornar user_id nullable + adicionar is_canonical flag
--   + ajustar RLS para leitura de canônicos por todos autenticados.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. GOALS — suporte a registros canônicos
-- ============================================================

ALTER TABLE public.goals ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS is_canonical BOOLEAN NOT NULL DEFAULT false;

-- RLS: canônicos visíveis para todos autenticados
DROP POLICY IF EXISTS "goals_canonical_select" ON public.goals;
CREATE POLICY "goals_canonical_select"
  ON public.goals FOR SELECT
  TO authenticated
  USING (is_canonical = true);

-- ============================================================
-- 2. INDICATORS — suporte a registros canônicos
-- ============================================================

ALTER TABLE public.indicators ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.indicators ADD COLUMN IF NOT EXISTS is_canonical BOOLEAN NOT NULL DEFAULT false;

-- RLS: canônicos visíveis para todos autenticados
DROP POLICY IF EXISTS "indicators_canonical_select" ON public.indicators;
CREATE POLICY "indicators_canonical_select"
  ON public.indicators FOR SELECT
  TO authenticated
  USING (is_canonical = true);

-- ============================================================
-- 3. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_goals_canonical      ON public.goals      (is_canonical) WHERE is_canonical = true;
CREATE INDEX IF NOT EXISTS idx_indicators_canonical ON public.indicators (is_canonical) WHERE is_canonical = true;

COMMIT;
