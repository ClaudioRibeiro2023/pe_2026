-- ============================================================
-- SEED 06 — Validador de Integridade PE2026
-- Versão: 1.0.0
-- Data: 2026-03-20
-- Descrição:
--   Script autônomo de verificação de integridade do banco.
--   Pode ser executado a qualquer momento sem efeito colateral.
--   Retorna RAISE EXCEPTION se qualquer contagem estiver abaixo do esperado.
--   Retorna RAISE NOTICE com relatório completo ao final.
-- ============================================================

DO $$
DECLARE
  -- Contagens de entidades canônicas
  v_areas              INT; v_pillars           INT; v_subpillars        INT;
  v_okrs               INT; v_krs               INT; v_motors            INT;
  v_initiatives        INT; v_risks             INT; v_scenarios         INT;
  v_themes             INT; v_area_okrs         INT; v_audit_log         INT;

  -- Contagens de FK integrity
  v_inits_no_pillar    INT;
  v_inits_no_okr       INT;
  v_krs_no_okr         INT;
  v_subpillars_no_pillar INT;

  -- Cenário de referência
  v_ref_scenarios      INT;

  -- OKRs sem code
  v_okrs_no_code       INT;
BEGIN
  -- ============================================================
  -- 1. CONTAGENS CANÔNICAS
  -- ============================================================
  SELECT COUNT(*) INTO v_areas              FROM public.areas;
  SELECT COUNT(*) INTO v_pillars            FROM public.pillars;
  SELECT COUNT(*) INTO v_subpillars         FROM public.subpillars;
  SELECT COUNT(*) INTO v_okrs               FROM public.corporate_okrs;
  SELECT COUNT(*) INTO v_krs                FROM public.key_results;
  SELECT COUNT(*) INTO v_motors             FROM public.motors;
  SELECT COUNT(*) INTO v_initiatives        FROM public.initiatives;
  SELECT COUNT(*) INTO v_risks              FROM public.strategic_risks;
  SELECT COUNT(*) INTO v_scenarios          FROM public.financial_scenarios;
  SELECT COUNT(*) INTO v_themes             FROM public.strategic_themes;
  SELECT COUNT(*) INTO v_area_okrs          FROM public.area_okrs;

  -- Audit log pode estar vazio em ambiente fresh
  SELECT COUNT(*) INTO v_audit_log          FROM public.audit_log;

  -- ============================================================
  -- 2. VERIFICAÇÕES DE INTEGRIDADE REFERENCIAL
  -- ============================================================

  -- Iniciativas sem pilar
  SELECT COUNT(*) INTO v_inits_no_pillar
  FROM public.initiatives
  WHERE pillar_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.pillars p WHERE p.id = initiatives.pillar_id);

  -- Iniciativas sem OKR code correspondente em corporate_okrs
  SELECT COUNT(*) INTO v_inits_no_okr
  FROM public.initiatives
  WHERE okr_code IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.corporate_okrs o WHERE o.code = initiatives.okr_code);

  -- Key results sem OKR pai
  SELECT COUNT(*) INTO v_krs_no_okr
  FROM public.key_results
  WHERE NOT EXISTS (SELECT 1 FROM public.corporate_okrs o WHERE o.id = key_results.okr_id);

  -- Subpilares sem pilar pai
  SELECT COUNT(*) INTO v_subpillars_no_pillar
  FROM public.subpillars
  WHERE NOT EXISTS (SELECT 1 FROM public.pillars p WHERE p.id = subpillars.pillar_id);

  -- Cenário de referência único
  SELECT COUNT(*) INTO v_ref_scenarios
  FROM public.financial_scenarios
  WHERE is_reference = true;

  -- OKRs sem code canônico
  SELECT COUNT(*) INTO v_okrs_no_code
  FROM public.corporate_okrs
  WHERE code IS NULL OR code = '';

  -- ============================================================
  -- 3. RELATÓRIO
  -- ============================================================
  RAISE NOTICE '╔══════════════════════════════════════════════════════╗';
  RAISE NOTICE '║   RELATÓRIO DE INTEGRIDADE PE2026 — %                 ║', to_char(now(), 'YYYY-MM-DD HH24:MI');
  RAISE NOTICE '╠══════════════════════════════════════════════════════╣';
  RAISE NOTICE '║ ENTIDADES CANÔNICAS                                   ║';
  RAISE NOTICE '╠══════════════════════════════════════════════════════╣';
  RAISE NOTICE '  Áreas:              % / 7   esperado',  v_areas;
  RAISE NOTICE '  Pilares:            % / 5   esperado',  v_pillars;
  RAISE NOTICE '  Subpilares:         % / 20  esperado',  v_subpillars;
  RAISE NOTICE '  OKRs corporativos:  % / 5   esperado',  v_okrs;
  RAISE NOTICE '  Key Results:        % / 25  esperado',  v_krs;
  RAISE NOTICE '  Motores:            % / 5   esperado',  v_motors;
  RAISE NOTICE '  Iniciativas:        % / 22  esperado',  v_initiatives;
  RAISE NOTICE '  Riscos estratég.:   % / 13  esperado',  v_risks;
  RAISE NOTICE '  Cenários financ.:   % / 3   esperado',  v_scenarios;
  RAISE NOTICE '  Temas estratég.:    % / 8   esperado',  v_themes;
  RAISE NOTICE '  OKRs por área:      % / 12  esperado',  v_area_okrs;
  RAISE NOTICE '  Audit log:          % entradas', v_audit_log;
  RAISE NOTICE '╠══════════════════════════════════════════════════════╣';
  RAISE NOTICE '║ INTEGRIDADE REFERENCIAL                               ║';
  RAISE NOTICE '╠══════════════════════════════════════════════════════╣';
  RAISE NOTICE '  Iniciativas sem pilar FK:    %', v_inits_no_pillar;
  RAISE NOTICE '  Iniciativas sem OKR code:    %', v_inits_no_okr;
  RAISE NOTICE '  KRs sem OKR pai:             %', v_krs_no_okr;
  RAISE NOTICE '  Subpilares sem pilar pai:    %', v_subpillars_no_pillar;
  RAISE NOTICE '  Cenários referência:         % (esperado: 1)', v_ref_scenarios;
  RAISE NOTICE '  OKRs sem code canônico:      %', v_okrs_no_code;
  RAISE NOTICE '╠══════════════════════════════════════════════════════╣';

  -- ============================================================
  -- 4. ASSERÇÕES — falha atômica se qualquer check não passar
  -- ============================================================

  -- Contagens mínimas
  IF v_areas       < 7  THEN RAISE EXCEPTION 'FALHA integridade: áreas % / 7',        v_areas;       END IF;
  IF v_pillars     < 5  THEN RAISE EXCEPTION 'FALHA integridade: pilares % / 5',      v_pillars;     END IF;
  IF v_subpillars  < 20 THEN RAISE EXCEPTION 'FALHA integridade: subpilares % / 20',  v_subpillars;  END IF;
  IF v_okrs        < 5  THEN RAISE EXCEPTION 'FALHA integridade: OKRs % / 5',         v_okrs;        END IF;
  IF v_krs         < 25 THEN RAISE EXCEPTION 'FALHA integridade: KRs % / 25',         v_krs;         END IF;
  IF v_motors      < 5  THEN RAISE EXCEPTION 'FALHA integridade: motores % / 5',      v_motors;      END IF;
  IF v_initiatives < 22 THEN RAISE EXCEPTION 'FALHA integridade: iniciativas % / 22', v_initiatives; END IF;
  IF v_risks       < 13 THEN RAISE EXCEPTION 'FALHA integridade: riscos % / 13',       v_risks;       END IF;
  IF v_scenarios   < 3  THEN RAISE EXCEPTION 'FALHA integridade: cenários % / 3',     v_scenarios;   END IF;
  IF v_themes      < 8  THEN RAISE EXCEPTION 'FALHA integridade: temas % / 8',         v_themes;      END IF;

  -- Integridade referencial
  IF v_inits_no_pillar  > 0 THEN RAISE EXCEPTION 'FALHA FK: % iniciativas com pillar_id inválido',    v_inits_no_pillar;  END IF;
  IF v_krs_no_okr       > 0 THEN RAISE EXCEPTION 'FALHA FK: % key results sem OKR pai válido',        v_krs_no_okr;       END IF;
  IF v_subpillars_no_pillar > 0 THEN RAISE EXCEPTION 'FALHA FK: % subpilares sem pilar pai válido',   v_subpillars_no_pillar; END IF;

  -- Regra de negócio: exatamente 1 cenário de referência
  IF v_ref_scenarios <> 1 THEN RAISE EXCEPTION 'FALHA regra: % cenários de referência (esperado: 1)', v_ref_scenarios; END IF;

  -- OKRs devem ter code canônico
  IF v_okrs_no_code > 0 THEN RAISE EXCEPTION 'FALHA: % OKRs sem code canônico (OKR-P1..OKR-P5)',      v_okrs_no_code; END IF;

  RAISE NOTICE '║ STATUS: ✓ TODAS AS ASSERÇÕES PASSARAM                ║';
  RAISE NOTICE '╚══════════════════════════════════════════════════════╝';
END $$;
