-- =============================================================
-- SEED 11 — Validação de integridade do banco remoto
-- Executa contagens e asserções para confirmar dados canônicos
-- Uso: copiar e executar no SQL Editor do Supabase Dashboard
-- =============================================================

DO $$
DECLARE
  v_areas         INT;
  v_pillars       INT;
  v_subpillars    INT;
  v_okrs          INT;
  v_key_results   INT;
  v_initiatives   INT;
  v_risks         INT;
  v_scenarios     INT;
  v_themes        INT;
  v_motors        INT;
  v_goals         INT;
  v_indicators    INT;
  v_action_plans  INT;
  v_kpis          INT;
  v_decisions     INT;
  v_flags         INT;
  v_errors        TEXT := '';
BEGIN
  SELECT COUNT(*) INTO v_areas         FROM areas             WHERE is_canonical = true OR slug IN ('rh','marketing','pd','operacoes','cs','comercial','financeiro');
  SELECT COUNT(*) INTO v_pillars       FROM pillars;
  SELECT COUNT(*) INTO v_subpillars    FROM subpillars;
  SELECT COUNT(*) INTO v_okrs          FROM corporate_okrs;
  SELECT COUNT(*) INTO v_key_results   FROM key_results;
  SELECT COUNT(*) INTO v_initiatives   FROM initiatives        WHERE code LIKE 'INIT-%';
  SELECT COUNT(*) INTO v_risks         FROM strategic_risks    WHERE code LIKE 'RSK-%';
  SELECT COUNT(*) INTO v_scenarios     FROM financial_scenarios;
  SELECT COUNT(*) INTO v_themes        FROM strategic_themes   WHERE code LIKE 'TH-%';
  SELECT COUNT(*) INTO v_motors        FROM motors             WHERE code LIKE 'M%';
  SELECT COUNT(*) INTO v_goals         FROM goals              WHERE is_canonical = true;
  SELECT COUNT(*) INTO v_indicators    FROM indicators         WHERE is_canonical = true;
  SELECT COUNT(*) INTO v_action_plans  FROM area_plans         WHERE is_canonical = true;
  SELECT COUNT(*) INTO v_kpis          FROM institutional_kpis WHERE is_canonical = true;
  SELECT COUNT(*) INTO v_decisions     FROM formal_decisions;
  SELECT COUNT(*) INTO v_flags         FROM feature_flags      WHERE enabled = true;

  -- Asserções mínimas
  IF v_areas        < 7  THEN v_errors := v_errors || '❌ areas: '         || v_areas        || ' (esperado ≥7)\n'; END IF;
  IF v_pillars      < 5  THEN v_errors := v_errors || '❌ pillars: '       || v_pillars      || ' (esperado ≥5)\n'; END IF;
  IF v_subpillars   < 20 THEN v_errors := v_errors || '❌ subpillars: '    || v_subpillars   || ' (esperado ≥20)\n'; END IF;
  IF v_okrs         < 5  THEN v_errors := v_errors || '❌ okrs: '          || v_okrs         || ' (esperado ≥5)\n'; END IF;
  IF v_key_results  < 25 THEN v_errors := v_errors || '❌ key_results: '   || v_key_results  || ' (esperado ≥25)\n'; END IF;
  IF v_initiatives  < 22 THEN v_errors := v_errors || '❌ initiatives: '   || v_initiatives  || ' (esperado ≥22)\n'; END IF;
  IF v_risks        < 13 THEN v_errors := v_errors || '❌ risks: '         || v_risks        || ' (esperado ≥13)\n'; END IF;
  IF v_scenarios    < 3  THEN v_errors := v_errors || '❌ scenarios: '     || v_scenarios    || ' (esperado ≥3)\n'; END IF;
  IF v_themes       < 8  THEN v_errors := v_errors || '❌ themes: '        || v_themes       || ' (esperado ≥8)\n'; END IF;
  IF v_motors       < 5  THEN v_errors := v_errors || '❌ motors: '        || v_motors       || ' (esperado ≥5)\n'; END IF;
  IF v_goals        < 6  THEN v_errors := v_errors || '❌ goals: '         || v_goals        || ' (esperado ≥6)\n'; END IF;
  IF v_indicators   < 8  THEN v_errors := v_errors || '❌ indicators: '    || v_indicators   || ' (esperado ≥8)\n'; END IF;
  IF v_action_plans < 7  THEN v_errors := v_errors || '❌ action_plans: '  || v_action_plans || ' (esperado ≥7)\n'; END IF;
  IF v_kpis         < 27 THEN v_errors := v_errors || '❌ kpis: '          || v_kpis         || ' (esperado ≥27)\n'; END IF;
  IF v_flags        < 6  THEN v_errors := v_errors || '❌ feature_flags: ' || v_flags        || ' (esperado ≥6)\n'; END IF;

  -- Relatório
  RAISE NOTICE '============================================';
  RAISE NOTICE 'VALIDAÇÃO REMOTA PE2026 — CONTAGENS';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'areas:          %', v_areas;
  RAISE NOTICE 'pillars:        %', v_pillars;
  RAISE NOTICE 'subpillars:     %', v_subpillars;
  RAISE NOTICE 'okrs:           %', v_okrs;
  RAISE NOTICE 'key_results:    %', v_key_results;
  RAISE NOTICE 'initiatives:    %', v_initiatives;
  RAISE NOTICE 'risks:          %', v_risks;
  RAISE NOTICE 'scenarios:      %', v_scenarios;
  RAISE NOTICE 'themes:         %', v_themes;
  RAISE NOTICE 'motors:         %', v_motors;
  RAISE NOTICE 'goals:          %', v_goals;
  RAISE NOTICE 'indicators:     %', v_indicators;
  RAISE NOTICE 'action_plans:   %', v_action_plans;
  RAISE NOTICE 'kpis:           %', v_kpis;
  RAISE NOTICE 'decisions:      %', v_decisions;
  RAISE NOTICE 'feature_flags:  %', v_flags;
  RAISE NOTICE '--------------------------------------------';

  IF v_errors = '' THEN
    RAISE NOTICE '✅ TODOS OS CHECKS PASSARAM — banco remoto OK';
  ELSE
    RAISE NOTICE '⚠️  CHECKS FALHARAM:';
    RAISE NOTICE '%', v_errors;
    RAISE EXCEPTION 'Validação remota falhou — verifique seeds pendentes';
  END IF;
END $$;
