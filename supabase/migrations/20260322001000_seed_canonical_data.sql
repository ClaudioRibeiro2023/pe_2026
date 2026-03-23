-- ============================================================
-- SEED CANÔNICO PE2026 — Migration (aplicado via db push)
-- Limpa dados legados e insere dados canônicos com UUIDs fixos
-- ============================================================

BEGIN;

-- ============================================================
-- LIMPEZA DE DADOS LEGADOS (ordem correta de cascata)
-- ============================================================

-- Tabelas filhas de key_results
DELETE FROM public.area_okr_krs;
DELETE FROM public.kr_snapshots;

-- Tabelas filhas de pillars / areas
DELETE FROM public.plan_actions;
DELETE FROM public.area_plans;
DELETE FROM public.area_okrs;
DELETE FROM public.subpillars;
DELETE FROM public.initiatives;
DELETE FROM public.key_results;
DELETE FROM public.corporate_okrs;

-- Pilares (agora sem FKs apontando)
DELETE FROM public.pillars;

-- Áreas não canônicas + canônicas com UUID errado
DELETE FROM public.areas
WHERE slug NOT IN ('rh','marketing','pd','operacoes','cs','comercial','financeiro');

DELETE FROM public.areas
WHERE slug IN ('rh','marketing','pd','operacoes','cs','comercial','financeiro')
  AND id NOT IN (
    'a1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000007'
  );

-- ============================================================
-- L1 — ÁREAS (7 canônicas)
-- ============================================================

INSERT INTO public.areas (id, slug, name, owner, focus, color, created_at, updated_at)
VALUES
  ('a1000000-0000-0000-0000-000000000001','rh',        'RH / Pessoas',         NULL,'Liderança, retenção, people analytics e capacidade intelectual','#3B82F6','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000002','marketing', 'Marketing',            NULL,'Marca, narrativa de evidência e suporte à expansão e renovação','#10B981','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000003','pd',        'P&D / Produto / Dados','Direção Executiva','Evidência, produto e inteligência via Direção e consultorias','#8B5CF6','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000004','operacoes', 'Operação',             NULL,'Capacidade, produtividade, qualidade e prontidão para execução','#F59E0B','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000005','cs',        'CS / Relacionamento',  NULL,'Ativação de demanda e previsibilidade 30/60/90','#06B6D4','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000006','comercial', 'Comercial',            NULL,'Expansão e diversificação com tese','#EC4899','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000007','financeiro','Financeiro',           NULL,'Previsibilidade, DRE gerencial por unidade, controles e guardrails','#EF4444','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (slug) DO UPDATE SET
  name       = EXCLUDED.name,
  focus      = EXCLUDED.focus,
  color      = EXCLUDED.color,
  updated_at = EXCLUDED.updated_at;

-- ============================================================
-- L2 — PILARES (5 canônicos)
-- ============================================================

INSERT INTO public.pillars (id, code, title, frontier, created_at, updated_at)
VALUES
  ('b1000000-0000-0000-0000-000000000001','P1','Estrutura Corporativa, Governança e Preparação para Transação','Organização gerenciável, auditável e pronta para separação Aero × Techdengue','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('b1000000-0000-0000-0000-000000000002','P2','Crescimento, Expansão e Diversificação','Expandir com tese, reduzir concentração e monetizar a base contratual','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('b1000000-0000-0000-0000-000000000003','P3','Excelência Operacional e Escala com Margem','Executar com qualidade, produtividade e previsibilidade','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('b1000000-0000-0000-0000-000000000004','P4','Produto, Dados e IA como Vantagem Defensável','Transformar tecnologia em vantagem competitiva duradoura','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('b1000000-0000-0000-0000-000000000005','P5','Pessoas, Liderança e Capacidade Intelectual','Capacidade de sustentar crescimento com método e densidade intelectual','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title    = EXCLUDED.title,
  frontier = EXCLUDED.frontier;

-- ============================================================
-- L2b — SUBPILARES (20 canônicos)
-- ============================================================

INSERT INTO public.subpillars (id, pillar_id, code, title, frontier, created_at, updated_at)
VALUES
  ('c1000000-0000-0000-0000-000000000101','b1000000-0000-0000-0000-000000000001','P1.S1','Separação Aero × Techdengue','Separação societária progressiva com rastreabilidade legal e financeira','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000102','b1000000-0000-0000-0000-000000000001','P1.S2','Governança e Registro de Decisões','Decisões formalizadas com DEC-*, alçadas e trilha auditável','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000103','b1000000-0000-0000-0000-000000000001','P1.S3','Controles e Apuração Gerencial','DRE por unidade, centros de custo e fechamento mensal até dia 10','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000104','b1000000-0000-0000-0000-000000000001','P1.S4','Preparação para Transação','Documentação, compliance e padrão auditável para eventual exit ou parceria','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000201','b1000000-0000-0000-0000-000000000002','P2.S1','Monetização da Base Contratual','Executar e reduzir saldo, ativar Pareto Top-14, operar war room semanal','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000202','b1000000-0000-0000-0000-000000000002','P2.S2','Expansão e Novos Contratos TD','Crescer receita TD com tese de expansão e novas praças','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000203','b1000000-0000-0000-0000-000000000002','P2.S3','Diversificação Aero','Ampliar portfólio Aero e reduzir dependência de poucos clientes','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000204','b1000000-0000-0000-0000-000000000002','P2.S4','Previsibilidade de Receita 30/60/90','Operar forecasting estruturado e early warning de desvio','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000301','b1000000-0000-0000-0000-000000000003','P3.S1','Capacidade e Planejamento Operacional','Planejar semana a semana, garantir prontidão e evitar gargalos','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000302','b1000000-0000-0000-0000-000000000003','P3.S2','Qualidade e SLA','Padrão mínimo rastreável por operação, retrabalho controlado','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000303','b1000000-0000-0000-0000-000000000003','P3.S3','Margem e Eficiência','Margem operacional ≥ 30%, controle de custo operacional','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000304','b1000000-0000-0000-0000-000000000003','P3.S4','Integração Operação ↔ CS ↔ Dados','Pontos de passagem, responsabilidade de interface e fluidez operacional','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000401','b1000000-0000-0000-0000-000000000004','P4.S1','Produto e Experiência do Cliente','Maturidade do produto, adoção e melhoria contínua de experiência','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000402','b1000000-0000-0000-0000-000000000004','P4.S2','Dados e Inteligência Operacional','Pipeline de dados, dashboards e analytics que viram decisão','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000403','b1000000-0000-0000-0000-000000000004','P4.S3','IA e Automação de Processos','Aplicações de IA que reduzem esforço manual e ampliam capacidade','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000404','b1000000-0000-0000-0000-000000000004','P4.S4','Vantagem Competitiva via Tecnologia','Diferenciais de produto que não são facilmente replicados','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000501','b1000000-0000-0000-0000-000000000005','P5.S1','Retenção e Gestão de Talentos','Reduzir turnover, identificar e reter top performers','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000502','b1000000-0000-0000-0000-000000000005','P5.S2','Liderança e Desenvolvimento de Gestores','Capacitar gestores para liderança, método e cultura de resultado','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000503','b1000000-0000-0000-0000-000000000005','P5.S3','Onboarding e Transferência de Conhecimento','Onboarding estruturado que preserve conhecimento crítico operacional','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000504','b1000000-0000-0000-0000-000000000005','P5.S4','Cultura de Método e Densidade Intelectual','Criar ambiente de aprendizado contínuo e padrão intelectual elevado','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title      = EXCLUDED.title,
  frontier   = EXCLUDED.frontier;

-- ============================================================
-- L3 — OKRs CORPORATIVOS (5) + KRs (25)
-- ============================================================

INSERT INTO public.corporate_okrs (id, pillar_id, code, objective, owner, priority, created_at)
VALUES
  ('d1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001','OKR-P1','Tornar a organização gerenciável, auditável e pronta para separação Aero × Techdengue','Direção','Alta','2026-01-01T00:00:00Z'),
  ('d1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000002','OKR-P2','Monetizar a base contratual e crescer receita com expansão e diversificação','Direção','Alta','2026-01-01T00:00:00Z'),
  ('d1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000003','OKR-P3','Operar com excelência, margem ≥ 30% e SLA controlado em todas as frentes','Direção','Alta','2026-01-01T00:00:00Z'),
  ('d1000000-0000-0000-0000-000000000004','b1000000-0000-0000-0000-000000000004','OKR-P4','Transformar dados, produto e IA em vantagem competitiva defensável','Direção','Alta','2026-01-01T00:00:00Z'),
  ('d1000000-0000-0000-0000-000000000005','b1000000-0000-0000-0000-000000000005','OKR-P5','Construir a equipe de alta performance que sustenta o crescimento do PE2026','Direção','Alta','2026-01-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  objective = EXCLUDED.objective;

INSERT INTO public.key_results (id, okr_id, code, title, target, unit, current_value, status, due_date)
VALUES
  -- OKR-P1 KRs
  ('e1000000-0000-0000-0000-000000000101','d1000000-0000-0000-0000-000000000001','P1.1','Separação societária Aero × Techdengue formalizada','100','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000102','d1000000-0000-0000-0000-000000000001','P1.2','DRE gerencial por unidade operando até dia 10 de cada mês','100','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000103','d1000000-0000-0000-0000-000000000001','P1.3','100% das decisões estratégicas registradas com DEC-* e alçada','100','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000104','d1000000-0000-0000-0000-000000000001','P1.4','Padrão auditável estabelecido para due diligence','100','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000105','d1000000-0000-0000-0000-000000000001','P1.5','WBR, MBR e QBR operando com cadência e ata registrada','100','%','0','NAO_INICIADO','2026-12-31'),
  -- OKR-P2 KRs
  ('e1000000-0000-0000-0000-000000000201','d1000000-0000-0000-0000-000000000002','P2.1','Saldo de ha executado ≥ 70% do contratado (vs 45% atual)','70','%','45','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000202','d1000000-0000-0000-0000-000000000002','P2.2','Receita total ≥ R$ 11,44M (cenário base)','11440000','R$','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000203','d1000000-0000-0000-0000-000000000002','P2.3','Top-14 clientes com taxa de ativação ≥ 80%','80','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000204','d1000000-0000-0000-0000-000000000002','P2.4','Forecast 30/60/90 operando com desvio ≤ 10%','10','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000205','d1000000-0000-0000-0000-000000000002','P2.5','2 novas frentes de diversificação Aero estruturadas','2','un','0','NAO_INICIADO','2026-12-31'),
  -- OKR-P3 KRs
  ('e1000000-0000-0000-0000-000000000301','d1000000-0000-0000-0000-000000000003','P3.1','Margem operacional ≥ 30% em todos os meses de Q2 a Q4','30','%','18','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000302','d1000000-0000-0000-0000-000000000003','P3.2','SLA de qualidade ≥ 95% medido mensalmente','95','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000303','d1000000-0000-0000-0000-000000000003','P3.3','Capacidade planejada executada ≥ 90%','90','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000304','d1000000-0000-0000-0000-000000000003','P3.4','Retrabalho ≤ 5% das ordens de serviço','5','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000305','d1000000-0000-0000-0000-000000000003','P3.5','Envelope de custo operacional ≤ R$ 8,0M','8000000','R$','0','NAO_INICIADO','2026-12-31'),
  -- OKR-P4 KRs
  ('e1000000-0000-0000-0000-000000000401','d1000000-0000-0000-0000-000000000004','P4.1','Produto com NPS ≥ 50 em Q4','50','pts','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000402','d1000000-0000-0000-0000-000000000004','P4.2','3 automações de processo entregues e operacionais','3','un','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000403','d1000000-0000-0000-0000-000000000004','P4.3','Pipeline de dados com ≥ 5 dashboards operacionais','5','un','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000404','d1000000-0000-0000-0000-000000000004','P4.4','1 aplicação de IA em produção com resultado mensurável','1','un','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000405','d1000000-0000-0000-0000-000000000004','P4.5','Plataforma de dados documentada e com governança definida','100','%','0','NAO_INICIADO','2026-12-31'),
  -- OKR-P5 KRs
  ('e1000000-0000-0000-0000-000000000501','d1000000-0000-0000-0000-000000000005','P5.1','Turnover voluntário ≤ 10% no ano','10','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000502','d1000000-0000-0000-0000-000000000005','P5.2','100% dos gestores com PDI ativo e revisado trimestralmente','100','%','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000503','d1000000-0000-0000-0000-000000000005','P5.3','Onboarding estruturado com duração ≤ 30 dias para posições-chave','30','dias','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000504','d1000000-0000-0000-0000-000000000005','P5.4','eNPS ≥ 30 em Q4','30','pts','0','NAO_INICIADO','2026-12-31'),
  ('e1000000-0000-0000-0000-000000000505','d1000000-0000-0000-0000-000000000005','P5.5','≥ 3 líderes internos promovidos ou ampliados em responsabilidade','3','un','0','NAO_INICIADO','2026-12-31')
ON CONFLICT (id) DO UPDATE SET
  title   = EXCLUDED.title,
  target  = EXCLUDED.target,
  status  = EXCLUDED.status;

-- ============================================================
-- L4 — INICIATIVAS (22 canônicas — P0 + P1)
-- ============================================================

INSERT INTO public.initiatives (id, code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, motor_codes, created_at, updated_at)
VALUES
  -- P0 (13 críticas 90 dias)
  ('f1000000-0000-0000-0000-000000000001','INIT-001','War Room Monetização — ativação Top-14 e redução de saldo','ENT','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.1',NULL,NULL,'EM_ANDAMENTO',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000002','INIT-002','Separação societária Aero × Techdengue — fase 1','ORG','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.1',NULL,NULL,'EM_ANDAMENTO',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000003','INIT-003','DRE gerencial por unidade — implantação e fechamento mensal','ORG','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.2',NULL,NULL,'EM_ANDAMENTO',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000004','INIT-004','Planejamento de capacidade operacional Q1-Q2','ENT','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.1',NULL,NULL,'EM_ANDAMENTO',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000005','INIT-005','Forecast 30/60/90 — implantação do modelo de previsão','SIS','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.4',NULL,NULL,'EM_ANDAMENTO',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000006','INIT-006','Registro de decisões DEC-* — implantação e cultura','ORG','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.3',NULL,NULL,'EM_ANDAMENTO',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000007','INIT-007','Contratações críticas Q1 — posições bloqueantes','ORG','P0','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.1',NULL,NULL,'EM_ANDAMENTO',ARRAY['M5'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000008','INIT-008','Guardrail de qualidade — padrão mínimo rastreável','ENT','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.2',NULL,NULL,'EM_ANDAMENTO',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000009','INIT-009','Onboarding estruturado — posições-chave','ORG','P0','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.3',NULL,NULL,'EM_ANDAMENTO',ARRAY['M5'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000010','INIT-010','Dashboard operacional — visibilidade em tempo real','SIS','P0','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.3',NULL,NULL,'EM_ANDAMENTO',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000011','INIT-011','Gestão de interfaces Operação ↔ CS ↔ Dados','ENT','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.4',NULL,NULL,'EM_ANDAMENTO',ARRAY['M3'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000012','INIT-012','Pareto Top-14 — análise e plano de ativação por cliente','COM','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.3',NULL,NULL,'EM_ANDAMENTO',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000013','INIT-013','Automação de processo crítico #1 — redução de retrabalho','SIS','P0','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.2',NULL,NULL,'PLANEJADA',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  -- P1 (9 estratégicas do ano)
  ('f1000000-0000-0000-0000-000000000014','INIT-014','Estrutura comercial — criação da área e processo','ORG','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.2',NULL,NULL,'PLANEJADA',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000015','INIT-015','Diversificação Aero — 2 novas frentes estruturadas','ENT','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.5',NULL,NULL,'PLANEJADA',ARRAY['M1'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000016','INIT-016','Produto — roadmap Q2-Q4 e NPS baseline','MET','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.1',NULL,NULL,'PLANEJADA',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000017','INIT-017','IA aplicada #1 — automação de diagnóstico','SIS','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.4',NULL,NULL,'PLANEJADA',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000018','INIT-018','PDI de gestores — implantação e revisão trimestral','ORG','P1','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.2',NULL,NULL,'PLANEJADA',ARRAY['M5'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000019','INIT-019','Governança de dados — documentação e ownership','SIS','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.5',NULL,NULL,'PLANEJADA',ARRAY['M4'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000020','INIT-020','Controles financeiros — envelope R$ 8M e centros de custo','ENT','P1','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.5',NULL,NULL,'PLANEJADA',ARRAY['M2'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000021','INIT-021','eNPS e pesquisa de clima — baseline e ação','MET','P1','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.4',NULL,NULL,'PLANEJADA',ARRAY['M5'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000022','INIT-022','Promoções e reconhecimento — ≥ 3 líderes ampliados','ORG','P1','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.5',NULL,NULL,'PLANEJADA',ARRAY['M5'],'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title       = EXCLUDED.title,
  type        = EXCLUDED.type,
  priority    = EXCLUDED.priority,
  status      = EXCLUDED.status,
  motor_codes = EXCLUDED.motor_codes;

-- ============================================================
-- L5 — RISCOS ESTRATÉGICOS (13)
-- ============================================================

INSERT INTO public.strategic_risks (id, code, title, category, severity, probability, impact, mitigation, status)
VALUES
  ('a2000001-0000-0000-0000-000000000001','RSK-01','Risco regulatório — mudanças na legislação de controle de pragas','Regulatório','CRITICO','MEDIO','ALTO','Monitoramento contínuo legislativo; consultor jurídico especializado','ATIVO'),
  ('a2000001-0000-0000-0000-000000000002','RSK-02','Baixa ativação da base contratual — saldo não executado','Financeiro','CRITICO','ALTO','ALTO','War room semanal; Pareto Top-14; forecast 30/60/90','ATIVO'),
  ('a2000001-0000-0000-0000-000000000003','RSK-03','Capacidade operacional insuficiente em Q1','Operacional','CRITICO','ALTO','ALTO','Planejamento antecipado; contratações críticas; banco de talentos','ATIVO'),
  ('a2000001-0000-0000-0000-000000000004','RSK-04','Queda de qualidade e retrabalho elevado','Operacional','CRITICO','MEDIO','ALTO','Guardrail de qualidade; SLA rastreável; auditoria periódica','ATIVO'),
  ('a2000001-0000-0000-0000-000000000005','RSK-05','Concentração de receita em poucos clientes','Financeiro','CRITICO','ALTO','ALTO','Diversificação Aero; expansão TD; estrutura comercial','ATIVO'),
  ('a2000001-0000-0000-0000-000000000006','RSK-06','Pressão de caixa e desvio do envelope de custo','Financeiro','ALTO','MEDIO','ALTO','DRE gerencial; controles semanais; envelope R$ 8M','ATIVO'),
  ('a2000001-0000-0000-0000-000000000007','RSK-07','Falhas nas interfaces Operação ↔ CS ↔ Dados','Operacional','ALTO','MEDIO','MEDIO','Protocolo de passagem; responsabilidade de interface definida','ATIVO'),
  ('a2000001-0000-0000-0000-000000000008','RSK-08','Turnover elevado em posições críticas','Pessoas','ALTO','MEDIO','ALTO','PDI; plano de retenção; mapeamento de sucessores','ATIVO'),
  ('a2000001-0000-0000-0000-000000000009','RSK-09','Separação societária mal executada','Governança','ALTO','BAIXO','ALTO','Consultoria jurídica; cronograma faseado; validação mensal','ATIVO'),
  ('a2000001-0000-0000-0000-000000000010','RSK-10','Perda ou vazamento de dados operacionais críticos','Dados','ALTO','BAIXO','ALTO','Governança de dados; backup; acesso controlado','ATIVO'),
  ('a2000001-0000-0000-0000-000000000011','RSK-11','Crescimento sem tese — expansão descoordenada','Estratégico','MONITORADO','BAIXO','MEDIO','Critérios de expansão definidos; aprovação em QBR','ATIVO'),
  ('a2000001-0000-0000-0000-000000000012','RSK-12','Dependência de pessoas-chave sem sucessores','Pessoas','MONITORADO','MEDIO','MEDIO','Mapeamento de criticidade; onboarding; documentação de processos','ATIVO'),
  ('a2000001-0000-0000-0000-000000000013','RSK-13','Ritmo de contratações abaixo do necessário','Pessoas','ALTO','MEDIO','ALTO','Banco de talentos ativo; processo seletivo acelerado; parceria RH','ATIVO')
ON CONFLICT (code) DO UPDATE SET
  title    = EXCLUDED.title,
  severity = EXCLUDED.severity,
  status   = EXCLUDED.status;

-- ============================================================
-- L6 — CENÁRIOS FINANCEIROS (3)
-- ============================================================

INSERT INTO public.financial_scenarios (id, code, label, probability_pct, revenue_target, margin_target, description, is_reference)
VALUES
  ('a3000001-0000-0000-0000-000000000001','PESSIMISTA','Pessimista',15,8310000,18.2,'Execução abaixo de 60% do saldo, perda de contratos relevantes',false),
  ('a3000001-0000-0000-0000-000000000002','BASE','Base',60,11440000,30.0,'Execução de 70% do saldo + crescimento moderado com novos contratos',true),
  ('a3000001-0000-0000-0000-000000000003','OTIMISTA','Otimista',25,13290000,36.4,'Execução plena + diversificação Aero + 2 novas praças TD',false)
ON CONFLICT (code) DO UPDATE SET
  label           = EXCLUDED.label,
  probability_pct = EXCLUDED.probability_pct,
  revenue_target  = EXCLUDED.revenue_target,
  margin_target   = EXCLUDED.margin_target;

-- ============================================================
-- L7 — TEMAS ESTRATÉGICOS (8)
-- ============================================================

INSERT INTO public.strategic_themes (id, code, title, description, pillar_codes, priority)
VALUES
  ('a4000001-0000-0000-0000-000000000001','TH-01','Separação Aero × Techdengue','Separação societária progressiva com rastreabilidade',ARRAY['P1'],1),
  ('a4000001-0000-0000-0000-000000000002','TH-02','Techdengue sell-ready','Preparação para eventual exit ou parceria estratégica',ARRAY['P1'],2),
  ('a4000001-0000-0000-0000-000000000003','TH-03','Monetização da base','Ativar e executar o saldo contratual com Pareto Top-14',ARRAY['P2'],3),
  ('a4000001-0000-0000-0000-000000000004','TH-04','Expansão permanência TD','Crescer receita TD com expansão geográfica e novas contas',ARRAY['P2'],4),
  ('a4000001-0000-0000-0000-000000000005','TH-05','Diversificação Aero','Ampliar portfólio Aero e reduzir concentração',ARRAY['P2'],5),
  ('a4000001-0000-0000-0000-000000000006','TH-06','Densidade intelectual','Construir equipe de alta performance e cultura de método',ARRAY['P5'],6),
  ('a4000001-0000-0000-0000-000000000007','TH-07','Governança e disciplina','Decisões registradas, cadências operando e controles ativos',ARRAY['P1'],7),
  ('a4000001-0000-0000-0000-000000000008','TH-08','Produto, Dados e IA','Transformar tecnologia em vantagem competitiva defensável',ARRAY['P4'],8)
ON CONFLICT (code) DO UPDATE SET
  title       = EXCLUDED.title,
  description = EXCLUDED.description;

-- ============================================================
-- L8 — MOTORES (5)
-- ============================================================

INSERT INTO public.motors (id, code, title, description, created_at, updated_at)
VALUES
  ('a5000001-0000-0000-0000-000000000001','M1','Monetização','Ativar base contratual, reduzir saldo e maximizar receita existente','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000001-0000-0000-0000-000000000002','M2','Governança','Formalizar decisões, separação societária e controles auditáveis','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000001-0000-0000-0000-000000000003','M3','Escala','Operar com margem, qualidade e capacidade planejada','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000001-0000-0000-0000-000000000004','M4','Produto/IA','Transformar tecnologia em vantagem competitiva','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000001-0000-0000-0000-000000000005','M5','Pessoas','Capacidade humana que sustenta o crescimento','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (code) DO UPDATE SET
  title       = EXCLUDED.title,
  description = EXCLUDED.description;

-- ============================================================
-- FEATURE FLAGS — Onda F (ativa todos os módulos)
-- ============================================================

INSERT INTO public.feature_flags (module, enabled, source, description)
VALUES
  ('area-plans',     true, 'supabase', 'Planos de ação por área — dados Supabase canônicos'),
  ('goals',          true, 'supabase', 'Goals canônicas — Frente 1'),
  ('indicators',     true, 'supabase', 'Indicadores canônicos — Frente 1'),
  ('institutional-kpis', true, 'supabase', 'KPIs institucionais — Frente 2'),
  ('decisions',      true, 'supabase', 'Decisões formais — Frente 3'),
  ('scoreboard',     true, 'supabase', 'Scorecard canônico — Onda D')
ON CONFLICT (module) DO UPDATE SET
  enabled     = EXCLUDED.enabled,
  source      = EXCLUDED.source,
  description = EXCLUDED.description;

COMMIT;
