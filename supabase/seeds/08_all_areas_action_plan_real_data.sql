-- ============================================================
-- SEED: DADOS REAIS DOS PLANOS DE AÇÃO - TODAS AS ÁREAS (PA.2026)
-- Versão: 2.0.0 (adaptado ao schema real)
-- Data: 2026-03-24
-- Colunas usadas: id, code, title, type, priority, pillar_id,
--   okr_code, kr_code, owner, sponsor, status, start_date, end_date,
--   budget_estimate, effort, motor_id, motor_codes, created_at, updated_at
-- IDs reais: pillar b1000000-*-000000P, motor a5000001-*-000000M
-- ============================================================

BEGIN;

-- ============================================================
-- MARKETING - 7 INITs Setoriais
-- ============================================================

INSERT INTO public.initiatives (id, code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, budget_estimate, effort, motor_id, motor_codes, created_at, updated_at)
VALUES
  ('b2000000-0000-0000-0000-000000000101','INIT-MKT-101','Plano de comunicação institucional 2026','MET','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.5','Marketing','Direção Executiva','PLANEJADA','2026-03-01','2026-03-31',7500,'BAIXO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000102','INIT-MKT-102','Calendário de feiras e eventos (envelope R$ 500K)','COM','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.x','Marketing','Direção Executiva','PLANEJADA','2026-03-01','2026-03-31',250000,'ALTO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000103','INIT-MKT-103','Contratação Marketing #1 e #2','ORG','P0','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.4','RH + Marketing','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-04-30',123500,'ALTO','a5000001-0000-0000-0000-000000000005',ARRAY['M5'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000104','INIT-MKT-104','Pacote mensal de prova de valor (co-exec P&D/CS)','COM','P0','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.1','Marketing + CS','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-06-30',11500,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000105','INIT-MKT-105','Campanha 10 anos Techdengue (execução)','COM','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.x','Marketing','Direção Executiva','PLANEJADA','2026-04-01','2026-06-30',90000,'ALTO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000106','INIT-MKT-106','Material de posicionamento institucional atualizado','COM','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.5','Marketing','Direção Executiva','PLANEJADA','2026-04-01','2026-06-30',12500,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000107','INIT-MKT-107','Estratégia de conteúdo digital (blog, redes, relatórios)','MET','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.1','Marketing','Direção Executiva','PLANEJADA','2026-04-01','2026-12-31',15000,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title=EXCLUDED.title,type=EXCLUDED.type,priority=EXCLUDED.priority,
  pillar_id=EXCLUDED.pillar_id,okr_code=EXCLUDED.okr_code,kr_code=EXCLUDED.kr_code,
  owner=EXCLUDED.owner,sponsor=EXCLUDED.sponsor,status=EXCLUDED.status,
  start_date=EXCLUDED.start_date,end_date=EXCLUDED.end_date,
  budget_estimate=EXCLUDED.budget_estimate,effort=EXCLUDED.effort,
  motor_id=EXCLUDED.motor_id,motor_codes=EXCLUDED.motor_codes,updated_at=EXCLUDED.updated_at;

-- ============================================================
-- P&D / PRODUTO / DADOS - 6 INITs Setoriais
-- ============================================================

INSERT INTO public.initiatives (id, code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, budget_estimate, effort, motor_id, motor_codes, created_at, updated_at)
VALUES
  ('b2000000-0000-0000-0000-000000000251','INIT-PD-251','Arquitetura de dados: modelo canônico e governança','SIS','P0','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.4','Direção + Consultoria','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-04-30',27500,'ALTO','a5000001-0000-0000-0000-000000000004',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000252','INIT-PD-252','Dashboard interno métricas operacionais (v1.0)','SIS','P0','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.3','Direção + Consultoria','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-04-30',20000,'MEDIO','a5000001-0000-0000-0000-000000000004',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000253','INIT-PD-253','Baseline de uso do produto Techdengue (métricas adoção)','SIS','P0','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.4','Direção + Consultoria','Direção Executiva','PLANEJADA','2026-04-01','2026-04-30',12500,'BAIXO','a5000001-0000-0000-0000-000000000004',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000254','INIT-PD-254','Roadmap de produto 2026 com prioridades definidas','MET','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.4','Direção + Consultoria','Direção Executiva','PLANEJADA','2026-04-01','2026-04-30',7500,'BAIXO','a5000001-0000-0000-0000-000000000004',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000255','INIT-PD-255','Automação de relatório de prova de valor (v2.0)','SIS','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.2','Direção + Consultoria','Direção Executiva','PLANEJADA','2026-05-01','2026-09-30',32500,'ALTO','a5000001-0000-0000-0000-000000000004',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000256','INIT-PD-256','Estudo e PoC IA aplicada a operação de campo','SIS','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.5','Direção + Consultoria','Direção Executiva','PLANEJADA','2026-06-01','2026-09-30',50000,'ALTO','a5000001-0000-0000-0000-000000000004',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title=EXCLUDED.title,type=EXCLUDED.type,priority=EXCLUDED.priority,
  pillar_id=EXCLUDED.pillar_id,okr_code=EXCLUDED.okr_code,kr_code=EXCLUDED.kr_code,
  owner=EXCLUDED.owner,sponsor=EXCLUDED.sponsor,status=EXCLUDED.status,
  start_date=EXCLUDED.start_date,end_date=EXCLUDED.end_date,
  budget_estimate=EXCLUDED.budget_estimate,effort=EXCLUDED.effort,
  motor_id=EXCLUDED.motor_id,motor_codes=EXCLUDED.motor_codes,updated_at=EXCLUDED.updated_at;

-- ============================================================
-- OPERAÇÃO - 8 INITs Setoriais
-- ============================================================

INSERT INTO public.initiatives (id, code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, budget_estimate, effort, motor_id, motor_codes, created_at, updated_at)
VALUES
  ('b2000000-0000-0000-0000-000000000151','INIT-OP-151','Implantação de agenda e planejamento semanal Q1','MET','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.2','Operação','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',4000,'BAIXO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000152','INIT-OP-152','Baseline de retrabalho por tipo de serviço (mar/26)','SIS','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.3','Operação','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',4000,'BAIXO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000153','INIT-OP-153','Padrão mínimo de SLA e qualidade por contratante','ENT','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.4','Operação','Direção Executiva','PLANEJADA','2026-04-01','2026-04-30',7500,'MEDIO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000154','INIT-OP-154','Estrutura de relatório de execução semanal (war room)','MET','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.3','Operação','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',2500,'BAIXO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000155','INIT-OP-155','Protocolo de interface com CS (pontos de passagem)','MET','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.5','Operação + CS','Direção Executiva','PLANEJADA','2026-04-01','2026-04-30',4000,'BAIXO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000156','INIT-OP-156','Planejamento de capacidade Q2/Q3 (pós COO)','MET','P1','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.2','Operação (COO)','Direção Executiva','PLANEJADA','2026-05-01','2026-06-30',7500,'MEDIO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000157','INIT-OP-157','Mapeamento e padronização de processos operacionais','MET','P1','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.3','Operação','Direção Executiva','PLANEJADA','2026-04-01','2026-06-30',12500,'MEDIO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000158','INIT-OP-158','Indicadores de produtividade por equipe/região','SIS','P1','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.1','Operação','Direção Executiva','PLANEJADA','2026-04-01','2026-06-30',10000,'MEDIO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title=EXCLUDED.title,type=EXCLUDED.type,priority=EXCLUDED.priority,
  pillar_id=EXCLUDED.pillar_id,okr_code=EXCLUDED.okr_code,kr_code=EXCLUDED.kr_code,
  owner=EXCLUDED.owner,sponsor=EXCLUDED.sponsor,status=EXCLUDED.status,
  start_date=EXCLUDED.start_date,end_date=EXCLUDED.end_date,
  budget_estimate=EXCLUDED.budget_estimate,effort=EXCLUDED.effort,
  motor_id=EXCLUDED.motor_id,motor_codes=EXCLUDED.motor_codes,updated_at=EXCLUDED.updated_at;

-- ============================================================
-- CS / RELACIONAMENTO - 8 INITs Setoriais
-- ============================================================

INSERT INTO public.initiatives (id, code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, budget_estimate, effort, motor_id, motor_codes, created_at, updated_at)
VALUES
  ('b2000000-0000-0000-0000-000000000201','INIT-CS-201','Mapeamento Pareto Top-14 com plano ativação por cliente','MET','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.3','CS','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',4000,'BAIXO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000202','INIT-CS-202','Implantação de previsão 30/60/90 por contratante','SIS','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.3','CS','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',6500,'BAIXO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000203','INIT-CS-203','Ritual semanal de war room com agenda padronizada','MET','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.5','CS + Operação','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',2500,'BAIXO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000204','INIT-CS-204','Playbook de ativação de demanda (co-construção)','MET','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.4','CS','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-04-30',12500,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000205','INIT-CS-205','SLA de atendimento e resposta ao contratante','ENT','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.4','CS','Direção Executiva','PLANEJADA','2026-04-01','2026-04-30',4000,'BAIXO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000206','INIT-CS-206','Base de conhecimento de clientes Pareto (perfil+histórico)','SIS','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.1','CS','Direção Executiva','PLANEJADA','2026-04-01','2026-06-30',10000,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000207','INIT-CS-207','Protocolo de entrega de prova de valor mensalmente','MET','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.2','CS + Marketing','Direção Executiva','PLANEJADA','2026-04-01','2026-06-30',4000,'BAIXO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000208','INIT-CS-208','Estruturação de pipeline de renovações e expansão','MET','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.1','CS','Direção Executiva','PLANEJADA','2026-04-01','2026-06-30',6500,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title=EXCLUDED.title,type=EXCLUDED.type,priority=EXCLUDED.priority,
  pillar_id=EXCLUDED.pillar_id,okr_code=EXCLUDED.okr_code,kr_code=EXCLUDED.kr_code,
  owner=EXCLUDED.owner,sponsor=EXCLUDED.sponsor,status=EXCLUDED.status,
  start_date=EXCLUDED.start_date,end_date=EXCLUDED.end_date,
  budget_estimate=EXCLUDED.budget_estimate,effort=EXCLUDED.effort,
  motor_id=EXCLUDED.motor_id,motor_codes=EXCLUDED.motor_codes,updated_at=EXCLUDED.updated_at;

-- ============================================================
-- COMERCIAL - 5 INITs Setoriais
-- ============================================================

INSERT INTO public.initiatives (id, code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, budget_estimate, effort, motor_id, motor_codes, created_at, updated_at)
VALUES
  ('b2000000-0000-0000-0000-000000000401','INIT-COM-401','Definição de processos comerciais e pipeline','MET','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.x','Liderança Comercial','Direção Executiva','PLANEJADA','2026-06-01','2026-07-31',12500,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000402','INIT-COM-402','Implantação de CRM (seleção + configuração)','SIS','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.x','Liderança Comercial','Direção Executiva','PLANEJADA','2026-06-01','2026-08-31',20000,'ALTO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000403','INIT-COM-403','Playbook comercial v1.0 (proposta, negociação, fechamento)','MET','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.4','Liderança Comercial','Direção Executiva','PLANEJADA','2026-07-01','2026-08-31',10000,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000404','INIT-COM-404','Mapeamento de prospects Aero (diversificação)','MET','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.x','Liderança Comercial','Direção Executiva','PLANEJADA','2026-07-01','2026-09-30',6500,'MEDIO','a5000001-0000-0000-0000-000000000001',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000405','INIT-COM-405','Integração Comercial <> CS <> Marketing','MET','P2','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.5','Liderança Comercial','Direção Executiva','PLANEJADA','2026-07-01','2026-09-30',4000,'BAIXO','a5000001-0000-0000-0000-000000000003',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title=EXCLUDED.title,type=EXCLUDED.type,priority=EXCLUDED.priority,
  pillar_id=EXCLUDED.pillar_id,okr_code=EXCLUDED.okr_code,kr_code=EXCLUDED.kr_code,
  owner=EXCLUDED.owner,sponsor=EXCLUDED.sponsor,status=EXCLUDED.status,
  start_date=EXCLUDED.start_date,end_date=EXCLUDED.end_date,
  budget_estimate=EXCLUDED.budget_estimate,effort=EXCLUDED.effort,
  motor_id=EXCLUDED.motor_id,motor_codes=EXCLUDED.motor_codes,updated_at=EXCLUDED.updated_at;

-- ============================================================
-- FINANCEIRO - 8 INITs Setoriais
-- ============================================================

INSERT INTO public.initiatives (id, code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, budget_estimate, effort, motor_id, motor_codes, created_at, updated_at)
VALUES
  ('b2000000-0000-0000-0000-000000000351','INIT-FIN-351','DRE gerencial por unidade (Aero x TD) - implantação','ENT','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.1','Financeiro','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',10000,'MEDIO','a5000001-0000-0000-0000-000000000002',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000352','INIT-FIN-352','Centros de custo e alçadas formalizados','MET','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.2','Financeiro','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',4000,'BAIXO','a5000001-0000-0000-0000-000000000002',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000353','INIT-FIN-353','Projeção de caixa 30/60/90 semanal (rotina)','MET','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','G-02','Financeiro','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',2500,'BAIXO','a5000001-0000-0000-0000-000000000002',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000354','INIT-FIN-354','Dashboard financeiro gerencial (margem, receita, caixa)','SIS','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.1','Financeiro','Direção Executiva','PLANEJADA','2026-03-01','2026-04-30',12500,'MEDIO','a5000001-0000-0000-0000-000000000002',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000355','INIT-FIN-355','Registro de riscos financeiros e gatilhos (RSK-*)','MET','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.3','Financeiro','Direção Executiva','EM_ANDAMENTO','2026-03-01','2026-03-31',2500,'BAIXO','a5000001-0000-0000-0000-000000000002',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000356','INIT-FIN-356','Relatório mensal de desempenho financeiro (MBR)','MET','P1','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.1','Financeiro','Direção Executiva','PLANEJADA','2026-04-01','2026-04-30',4000,'BAIXO','a5000001-0000-0000-0000-000000000002',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000357','INIT-FIN-357','Orçamento trimestral rolling + revisão cenários','MET','P1','b1000000-0000-0000-0000-000000000001','OKR-P3','P3.1','Financeiro','Direção Executiva','PLANEJADA','2026-04-01','2026-06-30',6500,'MEDIO','a5000001-0000-0000-0000-000000000002',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z'),
  ('b2000000-0000-0000-0000-000000000358','INIT-FIN-358','Compliance fiscal e documental para padrão auditável','ENT','P1','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.4','Financeiro','Direção Executiva','PLANEJADA','2026-04-01','2026-12-31',12500,'ALTO','a5000001-0000-0000-0000-000000000002',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-03-23T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title=EXCLUDED.title,type=EXCLUDED.type,priority=EXCLUDED.priority,
  pillar_id=EXCLUDED.pillar_id,okr_code=EXCLUDED.okr_code,kr_code=EXCLUDED.kr_code,
  owner=EXCLUDED.owner,sponsor=EXCLUDED.sponsor,status=EXCLUDED.status,
  start_date=EXCLUDED.start_date,end_date=EXCLUDED.end_date,
  budget_estimate=EXCLUDED.budget_estimate,effort=EXCLUDED.effort,
  motor_id=EXCLUDED.motor_id,motor_codes=EXCLUDED.motor_codes,updated_at=EXCLUDED.updated_at;

-- ============================================================
-- ATUALIZAÇÃO DAS INITs CORPORATIVAS - Vinculação às Áreas
-- ============================================================

-- area_id não existe no schema atual — mapeamento de referência apenas:
-- Marketing: INIT-004, INIT-007, INIT-008, INIT-017, INIT-018
-- P&D: INIT-003, INIT-010, INIT-011, INIT-014, INIT-020
-- Operação: INIT-001, INIT-005, INIT-008, INIT-009, INIT-015, INIT-016, INIT-017
-- CS: INIT-001, INIT-002, INIT-004, INIT-005, INIT-011, INIT-017
-- Comercial: INIT-021, INIT-018, INIT-019
-- Financeiro: INIT-006, INIT-007, INIT-019, INIT-012, INIT-013

-- ============================================================
-- METADADOS DOS PLANOS DE AÇÃO POR ÁREA
-- ============================================================

INSERT INTO public.area_plans (id, area_id, year, title, description, status, created_at, updated_at)
SELECT 'a9000001-0000-0000-0000-000000000002'::uuid, id, 2026, 'Plano de Ação Marketing 2026', '7 INITs setoriais', 'ATIVO', '2026-01-01T00:00:00Z', '2026-03-23T00:00:00Z' FROM public.areas WHERE slug='marketing'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, updated_at=EXCLUDED.updated_at;

INSERT INTO public.area_plans (id, area_id, year, title, description, status, created_at, updated_at)
SELECT 'a9000001-0000-0000-0000-000000000003'::uuid, id, 2026, 'Plano de Ação P&D 2026', '6 INITs setoriais', 'ATIVO', '2026-01-01T00:00:00Z', '2026-03-23T00:00:00Z' FROM public.areas WHERE slug='pd'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, updated_at=EXCLUDED.updated_at;

INSERT INTO public.area_plans (id, area_id, year, title, description, status, created_at, updated_at)
SELECT 'a9000001-0000-0000-0000-000000000004'::uuid, id, 2026, 'Plano de Ação Operação 2026', '8 INITs setoriais', 'ATIVO', '2026-01-01T00:00:00Z', '2026-03-23T00:00:00Z' FROM public.areas WHERE slug='operacoes'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, updated_at=EXCLUDED.updated_at;

INSERT INTO public.area_plans (id, area_id, year, title, description, status, created_at, updated_at)
SELECT 'a9000001-0000-0000-0000-000000000005'::uuid, id, 2026, 'Plano de Ação CS 2026', '8 INITs setoriais', 'ATIVO', '2026-01-01T00:00:00Z', '2026-03-23T00:00:00Z' FROM public.areas WHERE slug='cs'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, updated_at=EXCLUDED.updated_at;

INSERT INTO public.area_plans (id, area_id, year, title, description, status, created_at, updated_at)
SELECT 'a9000001-0000-0000-0000-000000000006'::uuid, id, 2026, 'Plano de Ação Comercial 2026', '5 INITs setoriais', 'ATIVO', '2026-01-01T00:00:00Z', '2026-03-23T00:00:00Z' FROM public.areas WHERE slug='comercial'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, updated_at=EXCLUDED.updated_at;

INSERT INTO public.area_plans (id, area_id, year, title, description, status, created_at, updated_at)
SELECT 'a9000001-0000-0000-0000-000000000007'::uuid, id, 2026, 'Plano de Ação Financeiro 2026', '8 INITs setoriais', 'ATIVO', '2026-01-01T00:00:00Z', '2026-03-23T00:00:00Z' FROM public.areas WHERE slug='financeiro'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, updated_at=EXCLUDED.updated_at;

COMMIT;

-- ============================================================
-- VERIFICAÇÃO DE INTEGRIDADE
-- ============================================================

DO $$
DECLARE
  v_count_mkt INTEGER;
  v_count_pd INTEGER;
  v_count_op INTEGER;
  v_count_cs INTEGER;
  v_count_com INTEGER;
  v_count_fin INTEGER;
  v_total_budget NUMERIC;
BEGIN
  -- Contar iniciativas por área
  SELECT COUNT(*) INTO v_count_mkt FROM public.initiatives WHERE code LIKE 'INIT-MKT-%';
  SELECT COUNT(*) INTO v_count_pd FROM public.initiatives WHERE code LIKE 'INIT-PD-%';
  SELECT COUNT(*) INTO v_count_op FROM public.initiatives WHERE code LIKE 'INIT-OP-%';
  SELECT COUNT(*) INTO v_count_cs FROM public.initiatives WHERE code LIKE 'INIT-CS-%';
  SELECT COUNT(*) INTO v_count_com FROM public.initiatives WHERE code LIKE 'INIT-COM-%';
  SELECT COUNT(*) INTO v_count_fin FROM public.initiatives WHERE code LIKE 'INIT-FIN-%';
  
  -- Calcular orçamento total das setoriais
  SELECT COALESCE(SUM(budget_estimate), 0) INTO v_total_budget
  FROM public.initiatives 
  WHERE code LIKE 'INIT-MKT-%' OR code LIKE 'INIT-PD-%' OR code LIKE 'INIT-OP-%'
     OR code LIKE 'INIT-CS-%' OR code LIKE 'INIT-COM-%' OR code LIKE 'INIT-FIN-%';
  
  -- Log de verificação
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VERIFICAÇÃO DOS PLANOS DE AÇÃO';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Marketing: % INITs (esperado: 7)', v_count_mkt;
  RAISE NOTICE 'P&D: % INITs (esperado: 6)', v_count_pd;
  RAISE NOTICE 'Operação: % INITs (esperado: 8)', v_count_op;
  RAISE NOTICE 'CS: % INITs (esperado: 8)', v_count_cs;
  RAISE NOTICE 'Comercial: % INITs (esperado: 5)', v_count_com;
  RAISE NOTICE 'Financeiro: % INITs (esperado: 8)', v_count_fin;
  RAISE NOTICE '----------------------------------------';
  RAISE NOTICE 'Orçamento total setoriais: R$ %', v_total_budget;
  RAISE NOTICE '========================================';
  
  -- Validações
  IF v_count_mkt != 7 THEN RAISE WARNING 'Marketing: esperado 7 INITs'; END IF;
  IF v_count_pd != 6 THEN RAISE WARNING 'P&D: esperado 6 INITs'; END IF;
  IF v_count_op != 8 THEN RAISE WARNING 'Operação: esperado 8 INITs'; END IF;
  IF v_count_cs != 8 THEN RAISE WARNING 'CS: esperado 8 INITs'; END IF;
  IF v_count_com != 5 THEN RAISE WARNING 'Comercial: esperado 5 INITs'; END IF;
  IF v_count_fin != 8 THEN RAISE WARNING 'Financeiro: esperado 8 INITs'; END IF;
  
END $$;
