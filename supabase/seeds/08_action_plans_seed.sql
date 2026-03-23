-- ============================================================
-- SEED 08 — Planos de Ação Canônicos PE2026
-- Data: 2026-03-21
-- Fonte: DOC 08 + DOC 11-A a 11-G (cadernos setoriais)
-- Nota: coluna `where_location` mapeia o campo `where` do TS
-- ============================================================

BEGIN;

INSERT INTO public.action_plans (
  id, title, description,
  area_id, area_name,
  linked_kpis, linked_goals,
  status, priority, health,
  pdca_phase, pdca_history,
  what, why, where_location,
  when_start, when_end,
  who_responsible, who_team,
  how, how_much,
  progress, milestones, tasks,
  risk_level, risk_description, mitigation_plan,
  owner_id, sponsor_id, responsible,
  due_date, user_id, is_canonical
) VALUES

-- ============================================================
-- AP-01 — RH: Rituais mínimos de liderança e onboarding
-- ============================================================
(
  'a6000001-0000-0000-0000-000000000001',
  'Rituais mínimos de liderança e onboarding 30/60/90',
  'Implantar rituais mínimos de liderança, sucessão mínima e onboarding mensurável para posições críticas',
  'rh', 'RH / Pessoas',
  '["P5.KPI-02","P5.KPI-03","P5.KPI-04"]',
  '["a5000001-0000-0000-0000-000000000004"]',
  'in_progress', 'critical', 'at_risk',
  'do',
  '[{"id":"pdca-rh-1","phase":"plan","description":"Mapeadas posições-chave, rituais mínimos e desenho de onboarding 30/60/90","findings":"","actions_taken":"","date":"2026-02-06","user_id":"canonical"},{"id":"pdca-rh-2","phase":"do","description":"Piloto iniciado com líderes e duas funções críticas","findings":"Aderência inicial abaixo do esperado","actions_taken":"Reforço de rotina com check-ins quinzenais","date":"2026-03-01","user_id":"canonical"}]',
  'Implantar rituais mínimos, mapa de posições-chave e onboarding 30/60/90',
  'Sustentar capacidade humana e reduzir risco de turnover em posições críticas',
  'RH / Pessoas + lideranças das áreas',
  '2026-02-06', '2026-06-30',
  'Renata Silvestre', '["Fernanda Xavier","Lideranças de área"]',
  'Mapa de críticos → rituais mínimos → piloto de onboarding → expansão por área',
  68000,
  48,
  '[{"id":"ms-rh-1","title":"Mapa de posições-chave publicado","due_date":"2026-03-15","completed":true,"completed_at":"2026-03-12"},{"id":"ms-rh-2","title":"Onboarding 30/60/90 em piloto","due_date":"2026-04-30","completed":false},{"id":"ms-rh-3","title":"Rituais mínimos com aderência ≥ 75%","due_date":"2026-06-30","completed":false}]',
  '[{"id":"tsk-rh-1","title":"Fechar baseline de posições críticas","status":"done","assignee_id":"canonical","due_date":"2026-03-10","order":1},{"id":"tsk-rh-2","title":"Rodar piloto onboarding em funções críticas","status":"doing","assignee_id":"canonical","due_date":"2026-04-30","order":2},{"id":"tsk-rh-3","title":"Publicar checklist de rituais mínimos","status":"todo","assignee_id":"canonical","due_date":"2026-05-15","order":3}]',
  'high', 'Baixa aderência dos líderes e sobrecarga operacional das áreas',
  'Cadência quinzenal com diretoria e acompanhamento por área no MBR RH',
  'canonical', 'canonical', 'Renata Silvestre',
  '2026-06-30', NULL, true
),

-- ============================================================
-- AP-02 — Marketing: Biblioteca de provas e agenda nacional
-- ============================================================
(
  'a6000001-0000-0000-0000-000000000002',
  'Biblioteca de provas e agenda nacional com tese',
  'Consolidar provas de valor, kits de decisão e agenda de expansão com narrativa única',
  'marketing', 'Marketing',
  '["P4.KPI-01","P2.KPI-03"]',
  '["a5000001-0000-0000-0000-000000000001"]',
  'in_progress', 'high', 'on_track',
  'do',
  '[{"id":"pdca-mkt-1","phase":"plan","description":"Definida biblioteca de provas por tese e agenda nacional 2026","findings":"","actions_taken":"","date":"2026-02-12","user_id":"canonical"}]',
  'Publicar kits de decisão e sustentar agenda nacional com tese',
  'Aumentar prova de valor e apoiar expansão com coerência estratégica',
  'Marketing + interface com Comercial e P&D / Produto / Dados',
  '2026-02-12', '2026-06-30',
  'Time de Marketing', '["Comercial","P&D / Produto / Dados"]',
  'Biblioteca de provas → kits de decisão → agenda nacional → pós-evento com rastreabilidade',
  54000,
  58,
  '[{"id":"ms-mkt-1","title":"Kits de decisão da tese publicados","due_date":"2026-03-31","completed":true,"completed_at":"2026-03-28"},{"id":"ms-mkt-2","title":"Agenda nacional Q2 operacional","due_date":"2026-04-30","completed":false}]',
  '[{"id":"tsk-mkt-1","title":"Validar biblioteca de provas","status":"done","assignee_id":"canonical","due_date":"2026-03-20","order":1},{"id":"tsk-mkt-2","title":"Conectar agenda a pipeline rastreado","status":"doing","assignee_id":"canonical","due_date":"2026-04-25","order":2}]',
  'low', 'Desalinhamento entre narrativa e tese comercial',
  'Revisão quinzenal com Comercial e Direção',
  'canonical', 'canonical', 'Time de Marketing',
  '2026-06-30', NULL, true
),

-- ============================================================
-- AP-03 — P&D: Painel de monetização e evidências executivas
-- ============================================================
(
  'a6000001-0000-0000-0000-000000000003',
  'Painel de monetização e evidências executivas',
  'Consolidar painel executivo com saldo, vazão, previsão 30/60/90 e biblioteca de evidências',
  'pd', 'P&D / Produto / Dados',
  '["P4.KPI-01","P4.KPI-02","P4.KPI-03"]',
  '["a5000001-0000-0000-0000-000000000001","a5000001-0000-0000-0000-000000000002"]',
  'in_progress', 'high', 'on_track',
  'do',
  '[{"id":"pdca-pd-1","phase":"plan","description":"Definido escopo do painel executivo e camada de evidências","findings":"","actions_taken":"","date":"2026-02-15","user_id":"canonical"},{"id":"pdca-pd-2","phase":"do","description":"Primeira versão conectada ao War Room","findings":"Diferença entre fontes de saldo e agenda","actions_taken":"Criada rotina de reconciliação semanal","date":"2026-03-01","user_id":"canonical"}]',
  'Implantar painel de monetização com lastro e trilha de evidências',
  'Transformar produto e dados em prova de valor e inteligência de gestão',
  'Direção + P&D / Produto / Dados + CS / Relacionamento',
  '2026-02-15', '2026-05-31',
  'Direção Executiva', '["CS / Relacionamento","Marketing"]',
  'Painel de saldo/vazão → forecast com lastro → evidências executivas por cliente',
  92000,
  52,
  '[{"id":"ms-pd-1","title":"Painel de saldo e vazão publicado","due_date":"2026-03-31","completed":true,"completed_at":"2026-03-29"},{"id":"ms-pd-2","title":"Forecast 30/60/90 reconciliado","due_date":"2026-04-30","completed":false}]',
  '[{"id":"tsk-pd-1","title":"Conciliar fontes de saldo","status":"done","assignee_id":"canonical","due_date":"2026-03-25","order":1},{"id":"tsk-pd-2","title":"Publicar trilha de evidências executivas","status":"doing","assignee_id":"canonical","due_date":"2026-04-20","order":2}]',
  'medium', 'Baixa confiabilidade dos dados de origem em ciclos semanais',
  'Reconciliação semanal com dono por fonte e trilha de correção',
  'canonical', 'canonical', 'Direção Executiva',
  '2026-05-31', NULL, true
),

-- ============================================================
-- AP-04 — Operação: Planejamento semanal de capacidade e SLA
-- ============================================================
(
  'a6000001-0000-0000-0000-000000000004',
  'Planejamento semanal de capacidade e padrão SLA',
  'Instalar rotina semanal de capacidade, padronização de qualidade e leitura de gargalos',
  'operacoes', 'Operação',
  '["A3","P3.KPI-01","P3.KPI-02","P3.KPI-03"]',
  '["a5000001-0000-0000-0000-000000000002","a5000001-0000-0000-0000-000000000003"]',
  'in_progress', 'critical', 'at_risk',
  'check',
  '[{"id":"pdca-op-1","phase":"plan","description":"Estruturado pipeline de 4 a 6 semanas com leitura de capacidade","findings":"","actions_taken":"","date":"2026-02-08","user_id":"canonical"},{"id":"pdca-op-2","phase":"check","description":"Verificada aderência e retrabalho em ciclos críticos","findings":"Retrabalho acima do limite em duas frentes","actions_taken":"Criado checklist mínimo e auditoria interna","date":"2026-03-01","user_id":"canonical"}]',
  'Operar capacidade semanal, checklist mínimo de qualidade e integração com CS',
  'Garantir margem, qualidade e prontidão operacional',
  'Operação + interface com CS / Relacionamento e Dados',
  '2026-02-08', '2026-06-30',
  'Liderança de Operação', '["CS / Relacionamento","P&D / Produto / Dados"]',
  'Pipeline semanal → checklists → auditoria → revisão no War Room e MBR',
  110000,
  44,
  '[{"id":"ms-op-1","title":"Pipeline semanal implantado","due_date":"2026-03-15","completed":true,"completed_at":"2026-03-10"},{"id":"ms-op-2","title":"Checklist mínimo de qualidade ativo","due_date":"2026-04-15","completed":false},{"id":"ms-op-3","title":"Integração com CS estabilizada","due_date":"2026-06-30","completed":false}]',
  '[{"id":"tsk-op-1","title":"Atualizar leitura semanal de gargalos","status":"doing","assignee_id":"canonical","due_date":"2026-04-05","order":1},{"id":"tsk-op-2","title":"Aplicar checklist mínimo em frentes críticas","status":"todo","assignee_id":"canonical","due_date":"2026-04-20","order":2}]',
  'high', 'Capacidade crítica no pico do Q1 e retrabalho acima do limite',
  'Repriorização semanal, auditoria interna e escalonamento no War Room',
  'canonical', 'canonical', 'Liderança de Operação',
  '2026-06-30', NULL, true
),

-- ============================================================
-- AP-05 — CS: Sala de Situação Pareto Top-14
-- ============================================================
(
  'a6000001-0000-0000-0000-000000000005',
  'Sala de Situação Pareto Top-14 e forecast 30/60/90',
  'Instalar governança de monetização com Pareto Top-14, ativação e previsão com lastro',
  'cs', 'CS / Relacionamento',
  '["A2","P2.KPI-01","P2.KPI-02","C1","C4","C5","C7"]',
  '["a5000001-0000-0000-0000-000000000002","a5000001-0000-0000-0000-000000000001"]',
  'in_progress', 'critical', 'at_risk',
  'do',
  '[{"id":"pdca-cs-1","phase":"plan","description":"Definidos Pareto Top-14, cadência semanal e indicadores de ativação","findings":"","actions_taken":"","date":"2026-02-05","user_id":"canonical"},{"id":"pdca-cs-2","phase":"do","description":"Sala de Situação em operação com revisão semanal","findings":"Ativação ainda abaixo do alvo de 70%","actions_taken":"Escalonamento de clientes com saldo envelhecido","date":"2026-03-01","user_id":"canonical"}]',
  'Operar Pareto Top-14 com plano por cliente e forecast 30/60/90 com lastro',
  'Converter saldo em agenda, execução e caixa com previsibilidade',
  'CS / Relacionamento + Operação + Direção',
  '2026-02-05', '2026-06-30',
  'CS / Relacionamento', '["Operação","P&D / Produto / Dados"]',
  'War Room semanal → plano por cliente → agenda confirmada → reconciliação de forecast',
  74000,
  55,
  '[{"id":"ms-cs-1","title":"Pareto Top-14 validado","due_date":"2026-02-28","completed":true,"completed_at":"2026-02-26"},{"id":"ms-cs-2","title":"Ativação do Pareto ≥ 70%","due_date":"2026-04-30","completed":false},{"id":"ms-cs-3","title":"Forecast 30/60/90 com lastro estável","due_date":"2026-06-30","completed":false}]',
  '[{"id":"tsk-cs-1","title":"Escalonar clientes com saldo envelhecido","status":"doing","assignee_id":"canonical","due_date":"2026-04-10","order":1},{"id":"tsk-cs-2","title":"Consolidar 30/60/90 com agenda confirmada","status":"doing","assignee_id":"canonical","due_date":"2026-04-18","order":2}]',
  'high', 'Saldo envelhecido e baixa ativação em clientes prioritários',
  'Escalonamento por cliente, plano ativo e revisão semanal com direção',
  'canonical', 'canonical', 'CS / Relacionamento',
  '2026-06-30', NULL, true
),

-- ============================================================
-- AP-06 — Comercial: Estruturação com ICP e handover CS
-- ============================================================
(
  'a6000001-0000-0000-0000-000000000006',
  'Estruturação comercial com ICP e handover para CS',
  'Estruturar pipeline com tese, ICP, oferta replicável e transição disciplinada para CS',
  'comercial', 'Comercial',
  '["P2.KPI-03"]',
  '["a5000001-0000-0000-0000-000000000001"]',
  'planned', 'high', 'on_track',
  'plan',
  '[{"id":"pdca-com-1","phase":"plan","description":"Estruturado escopo inicial da área comercial com tese, ICP e handover","findings":"","actions_taken":"","date":"2026-03-01","user_id":"canonical"}]',
  'Implantar rotina comercial com ICP, contas-alvo e checklist de handover',
  'Reduzir concentração e apoiar expansão com previsibilidade',
  'Comercial + interface com Marketing e CS / Relacionamento',
  '2026-03-01', '2026-08-31',
  'Comercial', '["Marketing","CS / Relacionamento"]',
  'ICP → contas-alvo → proposta replicável → checklist de transição para CS',
  88000,
  18,
  '[{"id":"ms-com-1","title":"ICP e contas-alvo publicados","due_date":"2026-04-15","completed":false},{"id":"ms-com-2","title":"Checklist de handover ativo","due_date":"2026-06-15","completed":false}]',
  '[{"id":"tsk-com-1","title":"Fechar ICP e lista de contas-alvo","status":"doing","assignee_id":"canonical","due_date":"2026-04-10","order":1},{"id":"tsk-com-2","title":"Desenhar checklist de transição para CS","status":"todo","assignee_id":"canonical","due_date":"2026-05-15","order":2}]',
  'medium', 'Área ainda em estruturação e sem rotina comercial consolidada',
  'Escopo inicial reduzido, cadência semanal e governança com direção',
  'canonical', 'canonical', 'Comercial',
  '2026-08-31', NULL, true
),

-- ============================================================
-- AP-07 — Financeiro: DRE gerencial e separação Aero×Techdengue
-- ============================================================
(
  'a6000001-0000-0000-0000-000000000007',
  'DRE gerencial por unidade e separação Aero × Techdengue',
  'Consolidar DRE por unidade, centros de custo e leitura econômica para preparação de transação',
  'financeiro', 'Financeiro',
  '["A1","P1.KPI-01","P1.KPI-02"]',
  '["a5000001-0000-0000-0000-000000000001","a5000001-0000-0000-0000-000000000003"]',
  'in_progress', 'critical', 'on_track',
  'do',
  '[{"id":"pdca-fin-1","phase":"plan","description":"Definido desenho de centros de custo e leitura econômica por unidade","findings":"","actions_taken":"","date":"2026-02-10","user_id":"canonical"},{"id":"pdca-fin-2","phase":"do","description":"Primeiro fechamento por unidade executado","findings":"Alguns custos ainda sem alocação consistente","actions_taken":"Criada revisão mensal de rateios","date":"2026-03-01","user_id":"canonical"}]',
  'Implantar DRE gerencial por unidade e separação econômica Aero × Techdengue',
  'Dar previsibilidade de margem e preparar a empresa para separação e transação',
  'Financeiro + Direção Executiva',
  '2026-02-10', '2026-06-30',
  'Financeiro', '["Direção Executiva"]',
  'Centros de custo → regras de alocação → fechamento por unidade → revisão mensal',
  97000,
  61,
  '[{"id":"ms-fin-1","title":"Centros de custo definidos","due_date":"2026-03-10","completed":true,"completed_at":"2026-03-07"},{"id":"ms-fin-2","title":"Primeiro fechamento por unidade concluído","due_date":"2026-03-31","completed":true,"completed_at":"2026-03-30"},{"id":"ms-fin-3","title":"Separação econômica estabilizada","due_date":"2026-06-30","completed":false}]',
  '[{"id":"tsk-fin-1","title":"Revisar rateios sem alocação consistente","status":"doing","assignee_id":"canonical","due_date":"2026-04-12","order":1},{"id":"tsk-fin-2","title":"Formalizar leitura gerencial mensal","status":"todo","assignee_id":"canonical","due_date":"2026-04-25","order":2}]',
  'medium', 'Rateios e fronteiras econômicas ainda em estabilização',
  'Revisão mensal com direção e trilha documental de decisões',
  'canonical', 'canonical', 'Financeiro',
  '2026-06-30', NULL, true
)

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================

DO $$
DECLARE v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.action_plans WHERE is_canonical = true;
  RAISE NOTICE '[Seed 08] action_plans canônicos: %', v_count;
  IF v_count < 7 THEN
    RAISE EXCEPTION '[Seed 08] FALHA: esperado 7, encontrado %', v_count;
  END IF;
  RAISE NOTICE '[Seed 08] ✓ Seed canônico concluído com sucesso';
END $$;

COMMIT;
