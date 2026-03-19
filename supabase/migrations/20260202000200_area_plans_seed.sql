-- ============================================================
-- SEED: Dados Iniciais para Sistema de Planos de Ação
-- Versão: 1.0
-- Data: 2026-02-02
-- ============================================================

-- ============================================================
-- PILARES ESTRATÉGICOS
-- ============================================================

INSERT INTO pillars (code, title, frontier) VALUES
  ('P1', 'Estrutura corporativa e governança', 'Governança, separação Aero x Techdengue e padrão sell-ready.'),
  ('P2', 'Crescimento e diversificação', 'Monetização previsível e carteira diversificada.'),
  ('P3', 'Excelência operacional', 'Escala com qualidade, capacidade e margem sustentadas.'),
  ('P4', 'Produto, dados e IA', 'Provas de valor e automação orientada a resultados.'),
  ('P5', 'Pessoas e liderança', 'Densidade intelectual, liderança e cultura sustentável.')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SUBPILARES
-- ============================================================

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P1.S1', 'Governança e compliance', 'Rituais, decisões e controles de qualidade contínuos.'
FROM pillars p WHERE p.code = 'P1'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P1.S2', 'Finanças por unidade', 'P&L gerencial e disciplina de reporting por unidade.'
FROM pillars p WHERE p.code = 'P1'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P1.S3', 'Rastreabilidade e evidências', 'Mapas de rastreabilidade e evidências verificáveis.'
FROM pillars p WHERE p.code = 'P1'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P2.S1', 'Monetização Q1', 'War Room e execução do saldo com previsibilidade.'
FROM pillars p WHERE p.code = 'P2'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P2.S2', 'Novos contratos', 'Pipeline robusto e diversificado.'
FROM pillars p WHERE p.code = 'P2'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P3.S1', 'Capacidade e escala', 'Planejamento operacional e produtividade.'
FROM pillars p WHERE p.code = 'P3'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P3.S2', 'Qualidade e padronização', 'Processos replicáveis e auditoria interna.'
FROM pillars p WHERE p.code = 'P3'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P4.S1', 'Prova de valor', 'Biblioteca de evidências e painéis por cliente.'
FROM pillars p WHERE p.code = 'P4'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P4.S2', 'Automação aplicada', 'Eficiência operacional e uso de IA com governança.'
FROM pillars p WHERE p.code = 'P4'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P5.S1', 'People analytics', 'Indicadores de clima, retenção e performance.'
FROM pillars p WHERE p.code = 'P5'
ON CONFLICT DO NOTHING;

INSERT INTO subpillars (pillar_id, code, title, frontier)
SELECT p.id, 'P5.S2', 'Rituais de liderança', 'Cadência e desenvolvimento de líderes.'
FROM pillars p WHERE p.code = 'P5'
ON CONFLICT DO NOTHING;

-- ============================================================
-- ÁREAS ORGANIZACIONAIS
-- ============================================================

INSERT INTO areas (slug, name, owner, focus) VALUES
  ('rh', 'RH', 'RH', 'Liderança, retenção e people analytics'),
  ('marketing', 'Marketing', 'Marketing', 'Demanda qualificada e provas'),
  ('produto-dados', 'Produto/Dados', 'Produto/Dados', 'Evidência, IA e eficiência'),
  ('operacao', 'Operação', 'Operação', 'Capacidade e qualidade'),
  ('cs', 'CS', 'CS', 'Ativação de demanda e previsibilidade'),
  ('comercial', 'Comercial', 'Comercial', 'Pipeline qualificado e diversificação'),
  ('financeiro', 'Financeiro', 'Financeiro', 'Caixa, margem e previsibilidade'),
  ('direcao', 'Direção Executiva', 'Direção Executiva', 'Governança e estratégia corporativa')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- OKRs CORPORATIVOS
-- ============================================================

INSERT INTO corporate_okrs (pillar_id, objective, owner, priority)
SELECT p.id, 'Governança, separação Aero x Techdengue e padrão sell-ready', 'Direção Executiva', 'Alta'
FROM pillars p WHERE p.code = 'P1';

INSERT INTO corporate_okrs (pillar_id, objective, owner, priority)
SELECT p.id, 'Monetizar base contratual com previsibilidade (contrato → demanda → execução → caixa)', 'Direção Executiva', 'Crítica'
FROM pillars p WHERE p.code = 'P2';

INSERT INTO corporate_okrs (pillar_id, objective, owner, priority)
SELECT p.id, 'Escala operacional com margem, qualidade e prontidão', 'Operação', 'Alta'
FROM pillars p WHERE p.code = 'P3';

INSERT INTO corporate_okrs (pillar_id, objective, owner, priority)
SELECT p.id, 'Produto, dados e IA como prova de valor', 'Produto/Dados', 'Alta'
FROM pillars p WHERE p.code = 'P4';

INSERT INTO corporate_okrs (pillar_id, objective, owner, priority)
SELECT p.id, 'Densidade intelectual, liderança e capacidade humana', 'RH', 'Alta'
FROM pillars p WHERE p.code = 'P5';

-- ============================================================
-- KEY RESULTS
-- ============================================================

-- KRs do P1
INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P1-01', 'P&L gerencial por unidade com fechamento mensal até dia 10', 'Mar-Dez/2026', 'EM_ANDAMENTO', '2026-12-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Governança%';

INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P1-02', 'Alçadas e DEC ativos com registro formal', 'Fev/2026', 'EM_ANDAMENTO', '2026-02-28'
FROM corporate_okrs o WHERE o.objective LIKE 'Governança%';

INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P1-03', 'RSK críticos mapeados e revisados em MBR', 'Mar/2026', 'EM_ANDAMENTO', '2026-03-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Governança%';

INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P1-04', 'Disciplina de evidências com MAP-TRC atualizado', 'Jan/2026', 'EM_ANDAMENTO', '2026-01-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Governança%';

-- KRs do P2
INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P2-01', 'Executar mínimo 50.438 ha no Q1', 'Q1/2026', 'ATENCAO', '2026-03-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Monetizar%';

INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P2-02', 'Reduzir saldo para <= 37.910 ha até 31/mar', 'Mar/2026', 'EM_ANDAMENTO', '2026-03-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Monetizar%';

INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P2-03', 'Operar War Room Q1 semanal com Top-14', 'Fev/2026', 'EM_ANDAMENTO', '2026-02-28'
FROM corporate_okrs o WHERE o.objective LIKE 'Monetizar%';

-- KRs do P3
INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P3-01', 'Manter margem operacional anual >= 30%', '2026', 'EM_ANDAMENTO', '2026-12-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Escala operacional%';

INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P3-02', 'Planejamento semanal de capacidade no Q1', 'Fev-Mar/2026', 'EM_ANDAMENTO', '2026-03-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Escala operacional%';

-- KRs do P4
INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P4-01', 'Pacote de evidências Pareto Top-14 entregue mensalmente', 'Q1/2026', 'EM_ANDAMENTO', '2026-03-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Produto, dados%';

INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P4-02', 'Painel de monetização publicado até mar', 'Mar/2026', 'EM_ANDAMENTO', '2026-03-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Produto, dados%';

-- KRs do P5
INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P5-01', 'Turnover anual <= 35%', '2026', 'EM_ANDAMENTO', '2026-12-31'
FROM corporate_okrs o WHERE o.objective LIKE 'Densidade intelectual%';

INSERT INTO key_results (okr_id, code, title, target, status, due_date)
SELECT o.id, 'KR-P5-02', 'Rituais de liderança implantados com aderência >= 85%', 'Jun/2026', 'EM_ANDAMENTO', '2026-06-30'
FROM corporate_okrs o WHERE o.objective LIKE 'Densidade intelectual%';

-- ============================================================
-- OKRs POR ÁREA
-- ============================================================

-- RH
INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Reduzir rotatividade e estabilizar o time', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'rh';

INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Elevar engajamento e corrigir gaps', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'rh';

-- Marketing
INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Gerar demanda qualificada com previsibilidade', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'marketing';

INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Biblioteca de provas ativa', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'marketing';

-- Produto/Dados
INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Entregar provas e painéis de valor', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'produto-dados';

-- Operação
INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Pipeline operacional e aderência', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'operacao';

-- CS
INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Ativar demanda do Pareto', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'cs';

-- Comercial
INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Pipeline qualificado e diversificação', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'comercial';

-- Financeiro
INSERT INTO area_okrs (area_id, objective, status)
SELECT a.id, 'Previsibilidade de caixa e margem', 'EM_ANDAMENTO'
FROM areas a WHERE a.slug = 'financeiro';

-- ============================================================
-- INICIATIVAS
-- ============================================================

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-001', 'War Room Q1 - Pareto Top-14', 'MET', 'P0', p.id, 'OKR-P2', 'KR-P2-03', 'CS', 'Direção Executiva', 'EM_ANDAMENTO', '2026-01-15', '2026-03-31', 'ALTO'
FROM pillars p WHERE p.code = 'P2';

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-002', 'Execução Q1 - 50.438 ha', 'MET', 'P0', p.id, 'OKR-P2', 'KR-P2-01', 'Operação', 'Direção Executiva', 'EM_ANDAMENTO', '2026-01-01', '2026-03-31', 'ALTO'
FROM pillars p WHERE p.code = 'P2';

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-003', 'Painel de Monetização', 'SIS', 'P1', p.id, 'OKR-P4', 'KR-P4-02', 'Produto/Dados', 'Direção Executiva', 'EM_ANDAMENTO', '2026-01-15', '2026-03-31', 'MEDIO'
FROM pillars p WHERE p.code = 'P4';

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-004', 'Biblioteca de Evidências Top-14', 'SIS', 'P1', p.id, 'OKR-P4', 'KR-P4-01', 'Produto/Dados', 'Direção Executiva', 'EM_ANDAMENTO', '2026-01-01', '2026-03-31', 'MEDIO'
FROM pillars p WHERE p.code = 'P4';

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-005', 'Qualidade Padronizada + Auditoria', 'ORG', 'P1', p.id, 'OKR-P3', 'KR-P3-02', 'Operação', 'Operação', 'EM_ANDAMENTO', '2026-02-01', '2026-06-30', 'MEDIO'
FROM pillars p WHERE p.code = 'P3';

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-006', 'Alçadas e DEC Formalizados', 'ORG', 'P1', p.id, 'OKR-P1', 'KR-P1-02', 'Direção Executiva', 'Direção Executiva', 'EM_ANDAMENTO', '2026-01-15', '2026-02-28', 'BAIXO'
FROM pillars p WHERE p.code = 'P1';

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-007', 'P&L Gerencial por Unidade', 'SIS', 'P1', p.id, 'OKR-P1', 'KR-P1-01', 'Financeiro', 'Direção Executiva', 'EM_ANDAMENTO', '2026-02-01', '2026-03-31', 'ALTO'
FROM pillars p WHERE p.code = 'P1';

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-008', 'Pipeline 4-6 Semanas', 'ORG', 'P1', p.id, 'OKR-P3', 'KR-P3-02', 'Operação', 'Operação', 'EM_ANDAMENTO', '2026-01-15', '2026-03-31', 'MEDIO'
FROM pillars p WHERE p.code = 'P3';

INSERT INTO initiatives (code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort)
SELECT 'INIT-2026-009', 'MAP-TRC e Disciplina de Evidências', 'ORG', 'P1', p.id, 'OKR-P1', 'KR-P1-04', 'Direção Executiva', 'Direção Executiva', 'EM_ANDAMENTO', '2026-01-01', '2026-01-31', 'BAIXO'
FROM pillars p WHERE p.code = 'P1';

-- ============================================================
-- PLANOS DE AÇÃO DE EXEMPLO (para demonstração)
-- ============================================================

-- Plano da área RH para 2026
INSERT INTO area_plans (area_id, year, title, description, status)
SELECT a.id, 2026, 'Plano de Ação RH 2026', 'Plano anual da área de RH focado em retenção, engajamento e desenvolvimento de liderança.', 'RASCUNHO'
FROM areas a WHERE a.slug = 'rh';

-- Plano da área Operação para 2026
INSERT INTO area_plans (area_id, year, title, description, status)
SELECT a.id, 2026, 'Plano de Ação Operação 2026', 'Plano anual da área de Operação focado em capacidade, qualidade e margem.', 'RASCUNHO'
FROM areas a WHERE a.slug = 'operacao';

-- Plano da área CS para 2026
INSERT INTO area_plans (area_id, year, title, description, status)
SELECT a.id, 2026, 'Plano de Ação CS 2026', 'Plano anual da área de Customer Success focado em ativação de demanda e previsibilidade.', 'RASCUNHO'
FROM areas a WHERE a.slug = 'cs';

-- ============================================================
-- AÇÕES DE EXEMPLO (para demonstração)
-- ============================================================

-- Ações do plano RH
INSERT INTO plan_actions (plan_id, pillar_id, title, description, status, priority, responsible, start_date, due_date, evidence_required)
SELECT 
  ap.id, 
  p.id, 
  'Implementar People Analytics 1.0', 
  'Criar painel de indicadores de clima, turnover e retenção com atualização mensal.',
  'EM_ANDAMENTO',
  'P1',
  'RH',
  '2026-01-15',
  '2026-03-31',
  true
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN pillars p ON p.code = 'P5'
WHERE a.slug = 'rh' AND ap.year = 2026;

INSERT INTO plan_actions (plan_id, pillar_id, title, description, status, priority, responsible, start_date, due_date, evidence_required)
SELECT 
  ap.id, 
  p.id, 
  'Lançar Escola de Líderes', 
  'Programa de desenvolvimento de liderança com rituais mínimos e coaching trimestral.',
  'PENDENTE',
  'P1',
  'RH',
  '2026-02-01',
  '2026-06-30',
  true
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN pillars p ON p.code = 'P5'
WHERE a.slug = 'rh' AND ap.year = 2026;

INSERT INTO plan_actions (plan_id, pillar_id, title, description, status, priority, responsible, start_date, due_date, evidence_required)
SELECT 
  ap.id, 
  p.id, 
  'Estruturar Onboarding 45/90', 
  'Jornada de onboarding com checkpoints em 45 e 90 dias para retenção ativa.',
  'PENDENTE',
  'P2',
  'RH',
  '2026-02-15',
  '2026-04-30',
  true
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN pillars p ON p.code = 'P5'
WHERE a.slug = 'rh' AND ap.year = 2026;

-- Ações do plano Operação
INSERT INTO plan_actions (plan_id, pillar_id, title, description, status, priority, responsible, start_date, due_date, evidence_required, cost_estimate, cost_type)
SELECT 
  ap.id, 
  p.id, 
  'Implementar Pipeline 4-6 Semanas', 
  'Planejamento operacional semanal com visibilidade de 4-6 semanas e aderência por squad.',
  'EM_ANDAMENTO',
  'P0',
  'Operação',
  '2026-01-15',
  '2026-03-31',
  true,
  15000.00,
  'OPEX'
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN pillars p ON p.code = 'P3'
WHERE a.slug = 'operacao' AND ap.year = 2026;

INSERT INTO plan_actions (plan_id, pillar_id, title, description, status, priority, responsible, start_date, due_date, evidence_required, cost_estimate, cost_type)
SELECT 
  ap.id, 
  p.id, 
  'Estruturar Auditoria Interna', 
  'Checklist de qualidade e auditorias mensais com relatório de conformidade.',
  'PENDENTE',
  'P1',
  'Operação',
  '2026-02-01',
  '2026-06-30',
  true,
  8000.00,
  'OPEX'
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN pillars p ON p.code = 'P3'
WHERE a.slug = 'operacao' AND ap.year = 2026;

-- Ações do plano CS
INSERT INTO plan_actions (plan_id, pillar_id, title, description, status, priority, responsible, start_date, due_date, evidence_required)
SELECT 
  ap.id, 
  p.id, 
  'Operar War Room Q1', 
  'Reuniões semanais com Top-14 clientes para ativação de demanda e follow-up.',
  'EM_ANDAMENTO',
  'P0',
  'CS',
  '2026-01-15',
  '2026-03-31',
  true
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN pillars p ON p.code = 'P2'
WHERE a.slug = 'cs' AND ap.year = 2026;

INSERT INTO plan_actions (plan_id, pillar_id, title, description, status, priority, responsible, start_date, due_date, evidence_required)
SELECT 
  ap.id, 
  p.id, 
  'Criar Planos de Ativação por Cliente', 
  'Plano individual para cada cliente do Pareto com metas e ações específicas.',
  'PENDENTE',
  'P1',
  'CS',
  '2026-02-01',
  '2026-04-30',
  true
FROM area_plans ap
JOIN areas a ON a.id = ap.area_id
JOIN pillars p ON p.code = 'P2'
WHERE a.slug = 'cs' AND ap.year = 2026;

-- ============================================================
-- SUBTAREFAS DE EXEMPLO
-- ============================================================

-- Subtarefas para "Implementar People Analytics 1.0"
INSERT INTO action_subtasks (action_id, title, completed, sort_order)
SELECT pa.id, 'Definir indicadores-chave (turnover, clima, retenção)', true, 1
FROM plan_actions pa WHERE pa.title = 'Implementar People Analytics 1.0';

INSERT INTO action_subtasks (action_id, title, completed, sort_order)
SELECT pa.id, 'Criar dashboard no Power BI', false, 2
FROM plan_actions pa WHERE pa.title = 'Implementar People Analytics 1.0';

INSERT INTO action_subtasks (action_id, title, completed, sort_order)
SELECT pa.id, 'Integrar dados de folha e pesquisa de clima', false, 3
FROM plan_actions pa WHERE pa.title = 'Implementar People Analytics 1.0';

INSERT INTO action_subtasks (action_id, title, completed, sort_order)
SELECT pa.id, 'Validar com gestores e ajustar', false, 4
FROM plan_actions pa WHERE pa.title = 'Implementar People Analytics 1.0';

-- Subtarefas para "Operar War Room Q1"
INSERT INTO action_subtasks (action_id, title, completed, sort_order)
SELECT pa.id, 'Definir pauta e frequência das reuniões', true, 1
FROM plan_actions pa WHERE pa.title = 'Operar War Room Q1';

INSERT INTO action_subtasks (action_id, title, completed, sort_order)
SELECT pa.id, 'Criar template de acompanhamento', true, 2
FROM plan_actions pa WHERE pa.title = 'Operar War Room Q1';

INSERT INTO action_subtasks (action_id, title, completed, sort_order)
SELECT pa.id, 'Realizar primeira reunião com Top-14', false, 3
FROM plan_actions pa WHERE pa.title = 'Operar War Room Q1';

INSERT INTO action_subtasks (action_id, title, completed, sort_order)
SELECT pa.id, 'Documentar ações e follow-ups semanais', false, 4
FROM plan_actions pa WHERE pa.title = 'Operar War Room Q1';

-- ============================================================
-- FIM DO SEED
-- ============================================================
