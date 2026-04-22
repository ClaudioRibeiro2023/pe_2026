-- ============================================================
-- SEED: DADOS REAIS DO PLANO DE AÇÃO - RH (PA.2026)
-- Versão: 1.0.0
-- Data: 2026-03-23
-- Fonte: PE2026_RH.xlsx (docs/planos-acao/pa.2026)
-- Responsável técnico: Cascade
-- ============================================================
-- Este seed importa as INITs setoriais do RH que complementam
-- as INITs corporativas já existentes no seed 05_canonical_pe2026_seed.sql
-- ============================================================

BEGIN;

-- ============================================================
-- INICIATIVAS SETORIAIS DO RH (6 INITs - DOC 11 v2)
-- Códigos: INIT-RH-301 a INIT-RH-306
-- Faixa: 300-349 (conforme guia de codificação)
-- ============================================================

INSERT INTO public.initiatives (
  id, code, title, type, priority,
  pillar_id, okr_code, kr_code,
  owner, sponsor, status,
  start_date, end_date,
  budget_estimate, effort,
  motor_id, motor_codes,
  created_at, updated_at
)
VALUES
  -- INIT-RH-301: Pesquisa de engajamento e clima 2026
  (
    'b2000000-0000-0000-0000-000000000301',
    'INIT-RH-301',
    'Pesquisa de engajamento e clima 2026 (baseline)',
    'MET',
    'P0',
    'b1000000-0000-0000-0000-000000000005',
    'OKR-P5',
    'P5.2',
    'RH / Pessoas',
    'Direção Executiva',
    'PLANEJADA',
    '2026-03-01',
    '2026-04-30',
    7500.00,
    'BAIXO',
    'a5000001-0000-0000-0000-000000000005',
    ARRAY['M5'],
    '2026-01-01T00:00:00Z',
    '2026-03-23T00:00:00Z'
  ),
  -- INIT-RH-302: Implantação de indicadores de turnover
  (
    'b2000000-0000-0000-0000-000000000302',
    'INIT-RH-302',
    'Implantação de indicadores de turnover por área',
    'SIS',
    'P0',
    'b1000000-0000-0000-0000-000000000005',
    'OKR-P5',
    'P5.1',
    'RH / Pessoas',
    'Direção Executiva',
    'EM_ANDAMENTO',
    '2026-03-01',
    '2026-03-31',
    4000.00,
    'BAIXO',
    'a5000001-0000-0000-0000-000000000005',
    ARRAY['M5'],
    '2026-01-01T00:00:00Z',
    '2026-03-23T00:00:00Z'
  ),
  -- INIT-RH-303: Processo seletivo estruturado
  (
    'b2000000-0000-0000-0000-000000000303',
    'INIT-RH-303',
    'Processo seletivo estruturado para posições P0/P1',
    'MET',
    'P0',
    'b1000000-0000-0000-0000-000000000005',
    'OKR-P5',
    'P5.4',
    'RH / Pessoas',
    'Direção Executiva',
    'EM_ANDAMENTO',
    '2026-03-01',
    '2026-03-31',
    6500.00,
    'MEDIO',
    'a5000001-0000-0000-0000-000000000005',
    ARRAY['M5'],
    '2026-01-01T00:00:00Z',
    '2026-03-23T00:00:00Z'
  ),
  -- INIT-RH-304: Programa de reconhecimento e retenção
  (
    'b2000000-0000-0000-0000-000000000304',
    'INIT-RH-304',
    'Programa de reconhecimento e retenção',
    'ENT',
    'P1',
    'b1000000-0000-0000-0000-000000000005',
    'OKR-P5',
    'P5.2',
    'RH / Pessoas',
    'Direção Executiva',
    'PLANEJADA',
    '2026-04-01',
    '2026-06-30',
    20000.00,
    'MEDIO',
    'a5000001-0000-0000-0000-000000000005',
    ARRAY['M5'],
    '2026-01-01T00:00:00Z',
    '2026-03-23T00:00:00Z'
  ),
  -- INIT-RH-305: People Analytics
  (
    'b2000000-0000-0000-0000-000000000305',
    'INIT-RH-305',
    'People Analytics: painel de pessoas (turnover, NPS, treinamento)',
    'SIS',
    'P1',
    'b1000000-0000-0000-0000-000000000005',
    'OKR-P5',
    'P5.1',
    'RH / Pessoas',
    'Direção Executiva',
    'PLANEJADA',
    '2026-04-01',
    '2026-06-30',
    15000.00,
    'MEDIO',
    'a5000001-0000-0000-0000-000000000005',
    ARRAY['M5'],
    '2026-01-01T00:00:00Z',
    '2026-03-23T00:00:00Z'
  ),
  -- INIT-RH-306: Programa de desenvolvimento de lideranças
  (
    'b2000000-0000-0000-0000-000000000306',
    'INIT-RH-306',
    'Programa de desenvolvimento de lideranças internas',
    'MET',
    'P1',
    'b1000000-0000-0000-0000-000000000005',
    'OKR-P5',
    'P5.3',
    'RH / Pessoas',
    'Direção Executiva',
    'PLANEJADA',
    '2026-04-01',
    '2026-09-30',
    25000.00,
    'ALTO',
    'a5000001-0000-0000-0000-000000000005',
    ARRAY['M5'],
    '2026-01-01T00:00:00Z',
    '2026-03-23T00:00:00Z'
  )
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  type = EXCLUDED.type,
  priority = EXCLUDED.priority,
  pillar_id = EXCLUDED.pillar_id,
  okr_code = EXCLUDED.okr_code,
  kr_code = EXCLUDED.kr_code,
  owner = EXCLUDED.owner,
  sponsor = EXCLUDED.sponsor,
  status = EXCLUDED.status,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  budget_estimate = EXCLUDED.budget_estimate,
  effort = EXCLUDED.effort,
  motor_id = EXCLUDED.motor_id,
  motor_codes = EXCLUDED.motor_codes,
  updated_at = EXCLUDED.updated_at;

-- ============================================================
-- EVIDÊNCIAS ASSOCIADAS ÀS INITs DO RH
-- ============================================================

-- Evidências: tabela pode ter schema diferente, inserir só se existir
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='evidences') THEN
    INSERT INTO public.evidences (id, code, title, description, initiative_code, status, due_date, owner, created_at, updated_at)
    VALUES
      ('e3000000-0000-0000-0000-000000000301','EVID-RH-301','Relatório de Pesquisa de Engajamento e Clima 2026','Baseline com NPS, eNPS, análise por área','INIT-RH-301','PENDENTE','2026-04-30','RH / Pessoas','2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
      ('e3000000-0000-0000-0000-000000000302','EVID-RH-302','Dashboard de Turnover por Área','Painel mensal turnover voluntário/involuntário','INIT-RH-302','PENDENTE','2026-03-31','RH / Pessoas','2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
      ('e3000000-0000-0000-0000-000000000303','EVID-RH-303','Playbook de Processo Seletivo','Etapas, critérios, scoring e checklist de decisão','INIT-RH-303','PENDENTE','2026-03-31','RH / Pessoas','2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
      ('e3000000-0000-0000-0000-000000000304','EVID-RH-304','Programa de Reconhecimento e Retenção (v1.0)','Regulamento, critérios e primeiros 3 meses','INIT-RH-304','PENDENTE','2026-06-30','RH / Pessoas','2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
      ('e3000000-0000-0000-0000-000000000305','EVID-RH-305','People Analytics Dashboard (v1.0)','Painel integrado: turnover, NPS, treinamentos','INIT-RH-305','PENDENTE','2026-06-30','RH / Pessoas','2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
      ('e3000000-0000-0000-0000-000000000306','EVID-RH-306','Programa de Desenvolvimento de Lideranças (v1.0)','Currículo, trilhas, mentoria, avaliação 360°','INIT-RH-306','PENDENTE','2026-09-30','RH / Pessoas','2026-01-01T00:00:00Z','2026-03-23T00:00:00Z')
    ON CONFLICT (code) DO UPDATE SET
      title = EXCLUDED.title, status = EXCLUDED.status, updated_at = EXCLUDED.updated_at;
  END IF;
END $$;

-- ============================================================
-- RELACIONAMENTO: INITs CORPORATIVAS DO RH
-- Atualiza as INITs corporativas já existentes vinculando à área RH
-- ============================================================

-- area_id não existe no schema atual — anotação apenas
-- INITs corporativas relacionadas ao RH: INIT-009, INIT-010, INIT-015, INIT-016, INIT-022

-- ============================================================
-- METADADOS DO PLANO DE AÇÃO DO RH
-- ============================================================

-- area_plans: inserir metadados do plano RH
INSERT INTO public.area_plans (id, area_id, year, title, description, status, created_at, updated_at)
SELECT
  'a9000001-0000-0000-0000-000000000001',
  a.id,
  2026,
  'Plano de Ação RH 2026',
  '6 INITs setoriais + 5 corporativas vinculadas. Total: 11 iniciativas.',
  'ATIVO',
  '2026-01-01T00:00:00Z',
  '2026-03-23T00:00:00Z'
FROM public.areas a
WHERE a.slug = 'rh'
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

-- ============================================================
-- VERIFICAÇÃO DE INTEGRIDADE
-- ============================================================

DO $$
DECLARE
  v_count_initiatives INTEGER;
  v_count_evidences INTEGER;
  v_budget_total NUMERIC;
BEGIN
  -- Contar iniciativas do RH
  SELECT COUNT(*) INTO v_count_initiatives
  FROM public.initiatives 
  WHERE code LIKE 'INIT-RH-%';
  
  -- Tabela evidences não existe no schema atual
  v_count_evidences := 0;
  
  -- Calcular orçamento
  SELECT COALESCE(SUM(budget_estimate), 0) INTO v_budget_total
  FROM public.initiatives 
  WHERE code LIKE 'INIT-RH-%';
  
  -- Log de verificação
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VERIFICAÇÃO DO PLANO DE AÇÃO DO RH';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Iniciativas importadas: %', v_count_initiatives;
  RAISE NOTICE 'Evidências criadas: %', v_count_evidences;
  RAISE NOTICE 'Orçamento total: R$ %', v_budget_total;
  RAISE NOTICE '========================================';
  
  -- Validações
  IF v_count_initiatives < 6 THEN
    RAISE WARNING 'ATENÇÃO: Esperado pelo menos 6 iniciativas setoriais do RH';
  END IF;
  
  -- Evidências: tabela não integrada nesta versão
  
  IF v_budget_total < 70000 THEN
    RAISE WARNING 'ATENÇÃO: Orçamento parece baixo (esperado ~R$ 78K)';
  END IF;
  
END $$;

COMMIT;
