-- ============================================================
-- SEED 07 — Metas e Indicadores Canônicos PE2026
-- Data: 2026-03-21
-- Fonte: DOC 07 (cenários e metas) + DOC 05 (KPIs e guardrails)
-- ============================================================

BEGIN;

-- ============================================================
-- L1 — METAS CANÔNICAS (goals)
-- ============================================================

INSERT INTO public.goals (
  id, title, description,
  target_value, current_value, unit,
  category, period, start_date, end_date,
  status, user_id, is_canonical
) VALUES

  -- GUARDRAIL FINANCEIRO
  (
    'a5000001-0000-0000-0000-000000000001',
    'Receita cenário base 2026',
    'Atingir a receita anual do cenário base aprovado no PE2026 (DOC 07)',
    11440000, 4052693, 'R$',
    'financeiro', 'yearly', '2026-01-01', '2026-12-31',
    'active', NULL, true
  ),

  -- GUARDRAIL OPERACIONAL
  (
    'a5000001-0000-0000-0000-000000000002',
    'Entregar Q1 fixo de 50.438 ha',
    'Garantir a execução do volume mínimo já contratado no primeiro trimestre (DOC 07)',
    50438, 28800, 'ha',
    'monetizacao', 'quarterly', '2026-01-01', '2026-03-31',
    'active', NULL, true
  ),

  -- GUARDRAIL A3 — Margem Operacional
  (
    'a5000001-0000-0000-0000-000000000003',
    'Sustentar margem operacional ≥ 30%',
    'Manter a margem anual dentro do guardrail principal do placar institucional A3 (DOC 05)',
    30, 30.4, '%',
    'guardrail', 'yearly', '2026-01-01', '2026-12-31',
    'active', NULL, true
  ),

  -- GUARDRAIL A4 — Saúde Organizacional
  (
    'a5000001-0000-0000-0000-000000000004',
    'Manter turnover anual ≤ 35%',
    'Meta de saúde organizacional ligada ao OKR de pessoas e liderança P5 (DOC 06)',
    35, 28, '%',
    'pessoas', 'yearly', '2026-01-01', '2026-12-31',
    'active', NULL, true
  ),

  -- CENÁRIO OTIMISTA
  (
    'a5000001-0000-0000-0000-000000000005',
    'Receita cenário otimista 2026',
    'Meta estendida do cenário otimista PE2026 — probabilidade 25% (DOC 07)',
    13290000, 4052693, 'R$',
    'financeiro', 'yearly', '2026-01-01', '2026-12-31',
    'paused', NULL, true
  ),

  -- MONETIZAÇÃO — Saldo contratual
  (
    'a5000001-0000-0000-0000-000000000006',
    'Monetizar saldo contratual remanescente',
    'Converter saldo de 37.911 ha em receita ao longo do ano via execução (MAP-TRC)',
    37911, 0, 'ha',
    'monetizacao', 'yearly', '2026-01-01', '2026-12-31',
    'active', NULL, true
  )

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- L2 — INDICADORES CANÔNICOS (indicators)
-- ============================================================

INSERT INTO public.indicators (
  id, name, description,
  value, previous_value, unit,
  category, trend, date,
  user_id, is_canonical
) VALUES

  -- GUARDRAIL A3
  (
    'a5000002-0000-0000-0000-000000000001',
    'Margem operacional',
    'Guardrail financeiro A3 — margem operacional consolidada do PE2026 (DOC 05)',
    30.4, 29.8, '%',
    'Guardrails', 'up', '2026-03-01',
    NULL, true
  ),

  -- MONETIZAÇÃO C1 — Saldo a executar
  (
    'a5000002-0000-0000-0000-000000000002',
    'Saldo contratual remanescente',
    'C1 — Saldo monetizável remanescente monitorado na Sala de Situação (MAP-TRC)',
    37911, 42150, 'ha',
    'Monetização', 'down', '2026-03-01',
    NULL, true
  ),

  -- GUARDRAIL A2 — Qualidade/SLA
  (
    'a5000002-0000-0000-0000-000000000003',
    'Qualidade e SLA operacional',
    'Guardrail A2 — aderência ao padrão mínimo de qualidade e SLA operacional (DOC 05)',
    91, 89, '%',
    'Operação', 'up', '2026-03-01',
    NULL, true
  ),

  -- GOVERNANÇA
  (
    'a5000002-0000-0000-0000-000000000004',
    'Cadências WBR/MBR/QBR executadas',
    'Aderência à rotina de governança — WBR, MBR e QBR realizados no ciclo (DOC 05)',
    83, 77, '%',
    'Governança', 'up', '2026-03-01',
    NULL, true
  ),

  -- P&D / PRODUTO / DADOS
  (
    'a5000002-0000-0000-0000-000000000005',
    'Painel de monetização com lastro',
    'Conciliação dos dados críticos no painel executivo — dado vivo vs documento fonte (DOC 05)',
    66, 58, '%',
    'P&D / Produto / Dados', 'up', '2026-03-01',
    NULL, true
  ),

  -- GUARDRAIL A4 — Saúde organizacional
  (
    'a5000002-0000-0000-0000-000000000006',
    'Engajamento organizacional',
    'Guardrail A4 — pulso de engajamento e saúde organizacional (DOC 05)',
    82, 84, '%',
    'Pessoas', 'down', '2026-03-01',
    NULL, true
  ),

  -- MONETIZAÇÃO C2 — Execução acumulada
  (
    'a5000002-0000-0000-0000-000000000007',
    'Execução acumulada de hectares',
    'C2 — Volume executado acumulado no ano (DOC 05 + MAP-TRC)',
    12527, 8200, 'ha',
    'Monetização', 'up', '2026-03-01',
    NULL, true
  ),

  -- MONETIZAÇÃO C3 — Vazão mensal
  (
    'a5000002-0000-0000-0000-000000000008',
    'Vazão mensal de execução',
    'C3 — Ritmo médio de execução mensal para atingir meta anual (DOC 05)',
    4175, 3890, 'ha/mês',
    'Monetização', 'up', '2026-03-01',
    NULL, true
  )

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================

DO $$
DECLARE
  v_goals      INT;
  v_indicators INT;
BEGIN
  SELECT COUNT(*) INTO v_goals      FROM public.goals      WHERE is_canonical = true;
  SELECT COUNT(*) INTO v_indicators FROM public.indicators WHERE is_canonical = true;

  RAISE NOTICE '[Seed 07] goals canônicos: % | indicators canônicos: %', v_goals, v_indicators;

  IF v_goals < 6 THEN
    RAISE EXCEPTION '[Seed 07] FALHA: esperado 6 goals, encontrado %', v_goals;
  END IF;

  IF v_indicators < 8 THEN
    RAISE EXCEPTION '[Seed 07] FALHA: esperado 8 indicators, encontrado %', v_indicators;
  END IF;

  RAISE NOTICE '[Seed 07] ✓ Seed canônico concluído com sucesso';
END $$;

COMMIT;
