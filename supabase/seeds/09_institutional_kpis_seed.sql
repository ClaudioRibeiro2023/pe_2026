-- ============================================================
-- SEED 09 — KPIs Institucionais Canônicos PE2026
-- Data: 2026-03-21
-- Fonte: DOC 05 (KPIs, guardrails e monetização)
-- ============================================================

BEGIN;

INSERT INTO public.institutional_kpis (
  id, code, name, description, formula, unit,
  category, pillar_code,
  is_guardrail, is_monetization,
  threshold, critical_threshold, direction,
  granularity, temporal_window,
  owner_functional, owner_technical, source_table,
  status_homologation, sort_order
) VALUES

-- ============================================================
-- GUARDRAILS (A1–A4)
-- ============================================================

(
  'a7000001-0000-0000-0000-000000000001',
  'A1', 'Margem operacional consolidada',
  'Guardrail financeiro: margem operacional líquida consolidada Aero + Techdengue',
  '(Receita - Custo Operacional) / Receita × 100',
  '%', 'guardrail', NULL, true, false,
  30, 25, 'below',
  'monthly', 'ciclo anual',
  'Financeiro', 'financial_scenarios', 'financial_scenarios',
  'homologated', 10
),
(
  'a7000001-0000-0000-0000-000000000002',
  'A2', 'Previsibilidade 30/60/90',
  'Guardrail de caixa: acurácia do forecast de receita nos horizontes 30, 60 e 90 dias',
  'Σ(forecast_confirmado) / Σ(forecast_planejado) × 100',
  '%', 'guardrail', NULL, true, false,
  70, 50, 'below',
  'monthly', '30/60/90 dias',
  'Financeiro + CS', 'forecast_snapshots', 'forecast_snapshots',
  'homologated', 20
),
(
  'a7000001-0000-0000-0000-000000000003',
  'A3', 'Qualidade e SLA operacional',
  'Guardrail operacional: aderência ao padrão mínimo de qualidade e SLA de entrega',
  'Entregas_conformes / Total_entregas × 100',
  '%', 'guardrail', NULL, true, false,
  90, 80, 'below',
  'weekly', 'ciclo semanal',
  'Operação', 'indicators', 'indicators',
  'homologated', 30
),
(
  'a7000001-0000-0000-0000-000000000004',
  'A4', 'Saúde organizacional',
  'Guardrail de pessoas: índice composto de engajamento, turnover e capacidade de liderança',
  '(Engajamento + (100 - Turnover%) + Sucessão%) / 3',
  '%', 'guardrail', NULL, true, false,
  85, 70, 'below',
  'monthly', 'ciclo mensal / MBR RH',
  'RH / Pessoas', 'indicators', 'indicators',
  'homologated', 40
),

-- ============================================================
-- P1 — Governança e Transação
-- ============================================================

(
  'a7000001-0000-0000-0000-000000000011',
  'P1.KPI-01', 'Aderência ao ritual de governança',
  'Percentual de rituais WBR/MBR/QBR realizados no ciclo vs planejados',
  'Rituais_realizados / Rituais_planejados × 100',
  '%', 'pillar', 'P1', false, false,
  80, 60, 'below',
  'monthly', 'ciclo mensal',
  'Direção', 'context_store', 'institutional_kpis',
  'homologated', 110
),
(
  'a7000001-0000-0000-0000-000000000012',
  'P1.KPI-02', 'Decisões formais registradas',
  'Volume de decisões executivas formalizadas com código DEC-* no ciclo',
  'COUNT(formal_decisions WHERE cycle = atual)',
  'qtd', 'pillar', 'P1', false, false,
  75, 50, 'below',
  'monthly', 'ciclo mensal',
  'Direção', 'formal_decisions', 'formal_decisions',
  'pending', 120
),
(
  'a7000001-0000-0000-0000-000000000013',
  'P1.KPI-03', 'Rastreabilidade Pilar→INIT ativa',
  'Percentual de iniciativas com rastreabilidade completa até o pilar de origem',
  'INITs_rastreáveis / INITs_totais × 100',
  '%', 'pillar', 'P1', false, false,
  80, 60, 'below',
  'quarterly', 'ciclo trimestral',
  'P&D / Produto / Dados', 'initiatives', 'initiatives',
  'pending', 130
),

-- ============================================================
-- P2 — Crescimento e Monetização
-- ============================================================

(
  'a7000001-0000-0000-0000-000000000021',
  'P2.KPI-01', 'Taxa de ativação Pareto Top-14',
  'Percentual dos 14 principais clientes com agenda ativa no ciclo',
  'Clientes_Top14_com_agenda / 14 × 100',
  '%', 'pillar', 'P2', false, false,
  65, 50, 'below',
  'weekly', 'ciclo semanal (WBR)',
  'CS / Relacionamento', 'indicators', 'indicators',
  'homologated', 210
),
(
  'a7000001-0000-0000-0000-000000000022',
  'P2.KPI-02', 'Saldo envelhecido (> 120 dias)',
  'Volume de hectares contratados mas não executados há mais de 120 dias',
  'SUM(ha_contratados WHERE data_contrato < hoje - 120)',
  'ha', 'pillar', 'P2', false, false,
  25, 40, 'above',
  'weekly', 'ciclo semanal',
  'CS / Relacionamento', 'indicators', 'indicators',
  'homologated', 220
),
(
  'a7000001-0000-0000-0000-000000000023',
  'P2.KPI-03', 'Receita acumulada vs meta base',
  'Percentual de avanço da receita acumulada sobre a meta do cenário base anual',
  'Receita_acumulada / Meta_base_anual × 100',
  '%', 'pillar', 'P2', false, false,
  75, 60, 'below',
  'monthly', 'ciclo mensal (MBR)',
  'Financeiro', 'financial_scenarios', 'financial_scenarios',
  'homologated', 230
),

-- ============================================================
-- P3 — Escala com Margem
-- ============================================================

(
  'a7000001-0000-0000-0000-000000000031',
  'P3.KPI-01', 'Capacidade operacional utilizada',
  'Percentual de capacidade operacional efetivamente comprometida com agenda',
  'Capacidade_agenda / Capacidade_total × 100',
  '%', 'pillar', 'P3', false, false,
  85, 70, 'below',
  'weekly', 'ciclo semanal',
  'Operação', 'indicators', 'indicators',
  'homologated', 310
),
(
  'a7000001-0000-0000-0000-000000000032',
  'P3.KPI-02', 'SLA de qualidade na entrega',
  'Percentual de entregas dentro do padrão mínimo de qualidade definido',
  'Entregas_sem_retrabalho / Total_entregas × 100',
  '%', 'pillar', 'P3', false, false,
  80, 65, 'below',
  'weekly', 'ciclo semanal',
  'Operação', 'indicators', 'indicators',
  'homologated', 320
),
(
  'a7000001-0000-0000-0000-000000000033',
  'P3.KPI-03', 'Índice de retrabalho',
  'Percentual de entregas que exigiram retrabalho ou revisão material',
  'Entregas_retrabalho / Total_entregas × 100',
  '%', 'pillar', 'P3', false, false,
  10, 20, 'above',
  'weekly', 'ciclo semanal',
  'Operação', 'indicators', 'indicators',
  'homologated', 330
),

-- ============================================================
-- P4 — Produto, Dados e IA
-- ============================================================

(
  'a7000001-0000-0000-0000-000000000041',
  'P4.KPI-01', 'Painel de monetização com lastro',
  'Nível de conciliação dos dados críticos do painel executivo vs documentos-fonte',
  'Indicadores_conciliados / Total_indicadores × 100',
  '%', 'pillar', 'P4', false, false,
  70, 50, 'below',
  'monthly', 'ciclo mensal',
  'P&D / Produto / Dados', 'indicators', 'indicators',
  'homologated', 410
),
(
  'a7000001-0000-0000-0000-000000000042',
  'P4.KPI-02', 'Cobertura de evidências executivas',
  'Percentual de decisões e resultados com evidência formal registrada',
  'Decisões_com_evidência / Total_decisões × 100',
  '%', 'pillar', 'P4', false, false,
  80, 60, 'below',
  'monthly', 'ciclo mensal',
  'P&D / Produto / Dados', 'action_evidences', 'action_evidences',
  'pending', 420
),
(
  'a7000001-0000-0000-0000-000000000043',
  'P4.KPI-03', 'Velocidade de entrega de produto',
  'Número de releases ou melhorias entregues no ciclo mensal',
  'COUNT(releases WHERE cycle = atual)',
  'qtd/mês', 'pillar', 'P4', false, false,
  10, 5, 'below',
  'monthly', 'ciclo mensal',
  'P&D / Produto / Dados', 'initiatives', 'initiatives',
  'pending', 430
),

-- ============================================================
-- P5 — Pessoas e Liderança
-- ============================================================

(
  'a7000001-0000-0000-0000-000000000051',
  'P5.KPI-01', 'Turnover anualizado',
  'Taxa de saída voluntária e involuntária anualizada da equipe',
  'Saídas_período / Headcount_médio × (12/meses) × 100',
  '%', 'pillar', 'P5', false, false,
  35, 50, 'above',
  'monthly', 'ciclo anual (rolling)',
  'RH / Pessoas', 'indicators', 'indicators',
  'homologated', 510
),
(
  'a7000001-0000-0000-0000-000000000052',
  'P5.KPI-02', 'Posições críticas com sucessor mapeado',
  'Percentual de posições críticas com pelo menos um sucessor identificado',
  'Posições_com_sucessor / Total_posições_críticas × 100',
  '%', 'pillar', 'P5', false, false,
  85, 70, 'below',
  'quarterly', 'ciclo trimestral (QBR)',
  'RH / Pessoas', 'indicators', 'indicators',
  'homologated', 520
),
(
  'a7000001-0000-0000-0000-000000000053',
  'P5.KPI-03', 'Onboarding 30/60/90 concluído',
  'Percentual de novas contratações que completaram o programa de onboarding',
  'Colaboradores_com_onboarding_completo / Total_contratações × 100',
  '%', 'pillar', 'P5', false, false,
  80, 60, 'below',
  'monthly', 'ciclo mensal',
  'RH / Pessoas', 'indicators', 'indicators',
  'pending', 530
),
(
  'a7000001-0000-0000-0000-000000000054',
  'P5.KPI-04', 'eNPS (Engajamento)',
  'Employee Net Promoter Score — índice de recomendação da empresa como lugar para trabalhar',
  'Promotores% - Detratores%',
  'score', 'pillar', 'P5', false, false,
  75, 55, 'below',
  'quarterly', 'ciclo trimestral (QBR)',
  'RH / Pessoas', 'indicators', 'indicators',
  'pending', 540
),

-- ============================================================
-- MONETIZAÇÃO (C1–C7)
-- ============================================================

(
  'a7000001-0000-0000-0000-000000000061',
  'C1', 'Saldo contratual remanescente',
  'Volume total de hectares contratados ainda não executados — base da Sala de Situação',
  'SUM(ha_contratados) - SUM(ha_executados)',
  'ha', 'monetization', NULL, false, true,
  37911, 45000, 'above',
  'weekly', 'ciclo semanal (WBR)',
  'CS / Relacionamento', 'indicators', 'indicators',
  'homologated', 610
),
(
  'a7000001-0000-0000-0000-000000000062',
  'C2', 'Execução acumulada (% vs meta)',
  'Percentual do volume total executado no ano vs meta do cenário base',
  'ha_executados_acumulados / meta_ha_anual × 100',
  '%', 'monetization', NULL, false, true,
  65, 50, 'below',
  'monthly', 'ciclo mensal (MBR)',
  'CS / Relacionamento + Operação', 'indicators', 'indicators',
  'homologated', 620
),
(
  'a7000001-0000-0000-0000-000000000063',
  'C3', 'Vazão mensal de execução',
  'Volume médio de hectares executados por mês no ciclo atual',
  'ha_executados_ciclo / meses_corridos',
  'ha/mês', 'monetization', NULL, false, true,
  3500, 2500, 'below',
  'monthly', 'ciclo mensal',
  'Operação', 'indicators', 'indicators',
  'homologated', 630
),
(
  'a7000001-0000-0000-0000-000000000064',
  'C4', 'Taxa de ativação da base',
  'Percentual de clientes com saldo ativo que executaram pelo menos 1 ha no ciclo',
  'Clientes_com_execução / Total_clientes_com_saldo × 100',
  '%', 'monetization', NULL, false, true,
  70, 55, 'below',
  'weekly', 'ciclo semanal (WBR)',
  'CS / Relacionamento', 'indicators', 'indicators',
  'homologated', 640
),
(
  'a7000001-0000-0000-0000-000000000065',
  'C5', 'Forecast 30/60/90 confirmado',
  'Volume de hectares com agenda confirmada nos próximos 30, 60 e 90 dias',
  'SUM(ha_agenda_confirmada WHERE horizonte IN (30,60,90))',
  'ha', 'monetization', NULL, false, true,
  25000, 15000, 'below',
  'weekly', '30/60/90 dias',
  'CS / Relacionamento', 'forecast_snapshots', 'forecast_snapshots',
  'homologated', 650
),
(
  'a7000001-0000-0000-0000-000000000066',
  'C6', 'Idade média do saldo',
  'Média ponderada de dias desde a contratação para o saldo remanescente',
  'Σ(ha_remanescente × dias_desde_contrato) / Σ(ha_remanescente)',
  'dias', 'monetization', NULL, false, true,
  120, 150, 'above',
  'monthly', 'ciclo mensal',
  'CS / Relacionamento + Financeiro', 'indicators', 'indicators',
  'homologated', 660
),
(
  'a7000001-0000-0000-0000-000000000067',
  'C7', 'Pareto Top-14 ativados',
  'Percentual dos 14 maiores saldos com execução confirmada no ciclo',
  'Top14_com_execução / 14 × 100',
  '%', 'monetization', NULL, false, true,
  70, 50, 'below',
  'weekly', 'ciclo semanal (WBR)',
  'CS / Relacionamento', 'indicators', 'indicators',
  'homologated', 670
)

ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================

DO $$
DECLARE
  v_total         INT;
  v_guardrails    INT;
  v_pillar_kpis   INT;
  v_monetization  INT;
  v_homologated   INT;
BEGIN
  SELECT COUNT(*) INTO v_total        FROM public.institutional_kpis;
  SELECT COUNT(*) INTO v_guardrails   FROM public.institutional_kpis WHERE is_guardrail = true;
  SELECT COUNT(*) INTO v_pillar_kpis  FROM public.institutional_kpis WHERE category = 'pillar';
  SELECT COUNT(*) INTO v_monetization FROM public.institutional_kpis WHERE is_monetization = true;
  SELECT COUNT(*) INTO v_homologated  FROM public.institutional_kpis WHERE status_homologation = 'homologated';

  RAISE NOTICE '[Seed 09] Total: % | Guardrails: % | Pilar: % | Monetização: % | Homologados: %',
    v_total, v_guardrails, v_pillar_kpis, v_monetization, v_homologated;

  IF v_total < 26 THEN
    RAISE EXCEPTION '[Seed 09] FALHA: esperado >= 26 KPIs, encontrado %', v_total;
  END IF;
  IF v_guardrails <> 4 THEN
    RAISE EXCEPTION '[Seed 09] FALHA: esperado 4 guardrails, encontrado %', v_guardrails;
  END IF;
  IF v_monetization <> 7 THEN
    RAISE EXCEPTION '[Seed 09] FALHA: esperado 7 KPIs monetização, encontrado %', v_monetization;
  END IF;

  RAISE NOTICE '[Seed 09] ✓ KPIs institucionais inseridos com sucesso';
END $$;

COMMIT;
