-- ============================================================
-- SEED CANÔNICO PE2026 — Onda C (Bootstrap Auditável)
-- Versão: 1.0.0
-- Data: 2026-03-19
-- Base documental: DOC 02, 04, 06, 07, 08, 09, 10, 11 v2/v3
-- Responsável técnico: Cascade
-- ============================================================
-- Lote L1: Áreas (7)
-- Lote L2: Pilares (5) + Subpilares (20)
-- Lote L3: OKRs Corporativos (5) + KRs (25)
-- Lote L4: Motores (5) + Iniciativas (22)
-- Lote L5: Riscos Estratégicos (13)
-- Lote L6: Cenários Financeiros (3)
-- Lote L7: Temas Estratégicos (8)
-- Lote L8: OKRs por Área (12)
-- ============================================================

BEGIN;

-- ============================================================
-- L1 — ÁREAS (DOC 11 + estrutura organizacional)
-- ============================================================

INSERT INTO public.areas (id, slug, name, owner, focus, color, created_at, updated_at)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'rh',         'RH / Pessoas',          NULL,                  'Liderança, retenção, people analytics e capacidade intelectual',                   '#3B82F6', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000002', 'marketing',  'Marketing',              NULL,                  'Marca, narrativa de evidência e suporte à expansão e renovação',                    '#10B981', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000003', 'pd',         'P&D / Produto / Dados',  'Direção Executiva',   'Evidência, produto e inteligência via Direção e consultorias',                      '#8B5CF6', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000004', 'operacoes',  'Operação',               NULL,                  'Capacidade, produtividade, qualidade e prontidão para execução',                   '#F59E0B', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000005', 'cs',         'CS / Relacionamento',    NULL,                  'Ativação de demanda e previsibilidade 30/60/90',                                    '#06B6D4', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000006', 'comercial',  'Comercial',              NULL,                  'Expansão e diversificação com tese',                                                '#EC4899', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('a1000000-0000-0000-0000-000000000007', 'financeiro', 'Financeiro',             NULL,                  'Previsibilidade, DRE gerencial por unidade, controles e guardrails',               '#EF4444', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- L2 — PILARES INSTITUCIONAIS (DOC 04)
-- ============================================================

INSERT INTO public.pillars (id, code, title, frontier, description, created_at, updated_at)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'P1', 'Estrutura Corporativa, Governança e Preparação para Transação',
   'Organização gerenciável, auditável e pronta para separação Aero × Techdengue',
   'Estabelecer governança formal, separação societária, controles auditáveis e cultura de decisão registrada.', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('b1000000-0000-0000-0000-000000000002', 'P2', 'Crescimento, Expansão e Diversificação',
   'Expandir com tese, reduzir concentração e monetizar a base contratual',
   'Crescer com inteligência: ativar a base, reduzir baixa execução, estruturar diversificação Aero e expansão TD.', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('b1000000-0000-0000-0000-000000000003', 'P3', 'Excelência Operacional e Escala com Margem',
   'Executar com qualidade, produtividade e previsibilidade',
   'Operar com capacidade planejada, qualidade rastreável, SLA controlado e margem sustentável acima de 30%.', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('b1000000-0000-0000-0000-000000000004', 'P4', 'Produto, Dados e IA como Vantagem Defensável',
   'Transformar tecnologia em vantagem competitiva duradoura',
   'Construir ativos de produto, dados e automação que gerem prova de valor e ampliem o diferencial competitivo.', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('b1000000-0000-0000-0000-000000000005', 'P5', 'Pessoas, Liderança e Capacidade Intelectual',
   'Capacidade de sustentar crescimento com método e densidade intelectual',
   'Reter talentos, estruturar liderança, reduzir turnover e garantir onboarding que preserve conhecimento operacional.', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- L2b — SUBPILARES (DOC 04 — 4 por pilar = 20 total)
-- ============================================================

INSERT INTO public.subpillars (id, pillar_id, code, title, frontier, created_at, updated_at)
VALUES
  -- P1 Subpilares
  ('c1000000-0000-0000-0000-000000000101', 'b1000000-0000-0000-0000-000000000001', 'P1.S1', 'Separação Aero × Techdengue', 'Separação societária progressiva com rastreabilidade legal e financeira', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000102', 'b1000000-0000-0000-0000-000000000001', 'P1.S2', 'Governança e Registro de Decisões', 'Decisões formalizadas com DEC-*, alçadas e trilha auditável', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000103', 'b1000000-0000-0000-0000-000000000001', 'P1.S3', 'Controles e Apuração Gerencial', 'DRE por unidade, centros de custo e fechamento mensal até dia 10', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000104', 'b1000000-0000-0000-0000-000000000001', 'P1.S4', 'Preparação para Transação', 'Documentação, compliance e padrão auditável para eventual exit ou parceria', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  -- P2 Subpilares
  ('c1000000-0000-0000-0000-000000000201', 'b1000000-0000-0000-0000-000000000002', 'P2.S1', 'Monetização da Base Contratual', 'Executar e reduzir saldo, ativar Pareto Top-14, operar war room semanal', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000202', 'b1000000-0000-0000-0000-000000000002', 'P2.S2', 'Expansão e Novos Contratos TD', 'Crescer receita TD com tese de expansão e novas praças', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000203', 'b1000000-0000-0000-0000-000000000002', 'P2.S3', 'Diversificação Aero', 'Ampliar portfólio Aero e reduzir dependência de poucos clientes', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000204', 'b1000000-0000-0000-0000-000000000002', 'P2.S4', 'Previsibilidade de Receita 30/60/90', 'Operar forecasting estruturado e early warning de desvio', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  -- P3 Subpilares
  ('c1000000-0000-0000-0000-000000000301', 'b1000000-0000-0000-0000-000000000003', 'P3.S1', 'Capacidade e Planejamento Operacional', 'Planejar semana a semana, garantir prontidão e evitar gargalos', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000302', 'b1000000-0000-0000-0000-000000000003', 'P3.S2', 'Qualidade e SLA', 'Padrão mínimo rastreável por operação, retrabalho controlado', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000303', 'b1000000-0000-0000-0000-000000000003', 'P3.S3', 'Margem e Eficiência', 'Margem operacional ≥ 30%, controle de custo operacional', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000304', 'b1000000-0000-0000-0000-000000000003', 'P3.S4', 'Integração Operação ↔ CS ↔ Dados', 'Pontos de passagem, responsabilidade de interface e fluidez operacional', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  -- P4 Subpilares
  ('c1000000-0000-0000-0000-000000000401', 'b1000000-0000-0000-0000-000000000004', 'P4.S1', 'Produto e Experiência do Cliente', 'Maturidade do produto, adoção e melhoria contínua de experiência', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000402', 'b1000000-0000-0000-0000-000000000004', 'P4.S2', 'Dados e Inteligência Operacional', 'Dados como ativo: painel de gestão, rastreabilidade e capacidade analítica', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000403', 'b1000000-0000-0000-0000-000000000004', 'P4.S3', 'IA e Automação', 'Frentes de automação e IA com ganho mensurável em produtividade ou qualidade', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000404', 'b1000000-0000-0000-0000-000000000004', 'P4.S4', 'Prova de Valor e Evidência', 'Pacote mensal de evidências, relatório executivo e diferencial competitivo', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  -- P5 Subpilares
  ('c1000000-0000-0000-0000-000000000501', 'b1000000-0000-0000-0000-000000000005', 'P5.S1', 'Retenção e Saúde Organizacional', 'Turnover ≤ 35%, engajamento ≥ 85% e saúde medida como guardrail', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000502', 'b1000000-0000-0000-0000-000000000005', 'P5.S2', 'Liderança e Rituais Mínimos', 'Rituais de liderança ≥ 85%, 1:1, QBR pessoal e feedback estruturado', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000503', 'b1000000-0000-0000-0000-000000000005', 'P5.S3', 'Posições-Chave e Sucessão', 'Mapa de posições críticas ≥ 80% preenchidas com plano de sucessão', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('c1000000-0000-0000-0000-000000000504', 'b1000000-0000-0000-0000-000000000005', 'P5.S4', 'Onboarding e Densidade Intelectual', 'Onboarding estruturado, cultura de aprendizado e densidade de conhecimento', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- L3a — OKRs CORPORATIVOS (DOC 06 v2)
-- ============================================================

INSERT INTO public.corporate_okrs (id, pillar_id, code, objective, owner, priority, status, created_at, updated_at)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'OKR-P1',
   'Governança, Separação Aero × Techdengue e Padrão de Empresa Auditável',
   'Direção Executiva', 'Crítica', 'EM_ANDAMENTO', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'OKR-P2',
   'Crescimento com Tese e Monetização da Base Contratual',
   'Direção Executiva + CS', 'Crítica', 'EM_ANDAMENTO', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('d1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'OKR-P3',
   'Escala Operacional com Margem, Qualidade e Prontidão',
   'Operação + Direção', 'Crítica', 'EM_ANDAMENTO', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('d1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 'OKR-P4',
   'Produto, Dados e IA como Vantagem Defensável',
   'Direção Executiva', 'Alta', 'EM_ANDAMENTO', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('d1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005', 'OKR-P5',
   'Densidade Intelectual, Liderança e Capacidade Humana',
   'RH + Direção', 'Crítica', 'EM_ANDAMENTO', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- L3b — KEY RESULTS (DOC 06 v2 — 5 por OKR = 25 total)
-- ============================================================

INSERT INTO public.key_results (id, okr_id, code, title, target, unit, status, due_date, created_at, updated_at)
VALUES
  -- OKR-P1 (5 KRs)
  ('e1000000-0000-0000-0000-000000000101', 'd1000000-0000-0000-0000-000000000001', 'P1.1', 'Apuração gerencial por unidade implantada',           'Fechamento mensal até dia 10',     'ritual',   'EM_ANDAMENTO', '2026-12-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000102', 'd1000000-0000-0000-0000-000000000001', 'P1.2', 'Centros de custo e alçadas formalizados',              'DEC-* ativo',                      'decisão',  'EM_ANDAMENTO', '2026-03-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000103', 'd1000000-0000-0000-0000-000000000001', 'P1.3', 'Registro de riscos (RSK-*) ativo',                    '100% dos riscos críticos com dono','%',        'EM_ANDAMENTO', '2026-03-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000104', 'd1000000-0000-0000-0000-000000000001', 'P1.4', 'Trilha de evidências (EVID-*) operante',               '100% dos KRs com evidência/trim', '%',        'NAO_INICIADO','2026-12-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000105', 'd1000000-0000-0000-0000-000000000001', 'P1.5', 'Modelo de separação por fases definido',               'v1.0 formalizada',                 'versão',   'NAO_INICIADO','2026-04-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  -- OKR-P2 (5 KRs)
  ('e1000000-0000-0000-0000-000000000201', 'd1000000-0000-0000-0000-000000000002', 'P2.1', 'Executar mínimo 50.438 ha no Q1',                     '50438',                            'ha',       'EM_ANDAMENTO', '2026-03-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000202', 'd1000000-0000-0000-0000-000000000002', 'P2.2', 'Reduzir saldo para ≤ 37.911 ha',                      '37911',                            'ha',       'EM_ANDAMENTO', '2026-03-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000203', 'd1000000-0000-0000-0000-000000000002', 'P2.3', 'Sala de Situação operante semanalmente',               '100% Pareto Top-14 com plano',    '%',        'EM_ANDAMENTO', '2026-02-28', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000204', 'd1000000-0000-0000-0000-000000000002', 'P2.4', 'Reduzir Baixa Execução para ≤ 25%',                   '25',                               '%',        'EM_ANDAMENTO', '2026-06-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000205', 'd1000000-0000-0000-0000-000000000002', 'P2.5', 'Ativação Pareto Top-14 ≥ 70%',                        '70',                               '%',        'EM_ANDAMENTO', '2026-06-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  -- OKR-P3 (5 KRs)
  ('e1000000-0000-0000-0000-000000000301', 'd1000000-0000-0000-0000-000000000003', 'P3.1', 'Margem operacional anual ≥ 30%',                      '30',                               '%',        'EM_ANDAMENTO', '2026-12-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000302', 'd1000000-0000-0000-0000-000000000003', 'P3.2', 'Planejamento semanal de capacidade Q1 implantado',    'Semanas registradas',              'semanas',  'EM_ANDAMENTO', '2026-03-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000303', 'd1000000-0000-0000-0000-000000000003', 'P3.3', 'Reduzir retrabalho em 20%',                           '-20',                              '%',        'EM_ANDAMENTO', '2026-06-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000304', 'd1000000-0000-0000-0000-000000000003', 'P3.4', 'Padrão mínimo de qualidade/SLA ≥ 90%',                '90',                               '%',        'NAO_INICIADO', '2026-12-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000305', 'd1000000-0000-0000-0000-000000000003', 'P3.5', 'Integração Operação ↔ CS ↔ Dados definida',           'Pontos de passagem definidos',     'entrega',  'NAO_INICIADO', '2026-04-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  -- OKR-P4 (5 KRs)
  ('e1000000-0000-0000-0000-000000000401', 'd1000000-0000-0000-0000-000000000004', 'P4.1', 'Pacote de evidências Top-14 mensal',                  'Prova de valor ≥ 70%',             '%',        'EM_ANDAMENTO', '2026-06-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000402', 'd1000000-0000-0000-0000-000000000004', 'P4.2', 'Relatório executivo de prova de valor publicado',     'v1.0 publicada',                   'versão',   'EM_ANDAMENTO', '2026-03-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000403', 'd1000000-0000-0000-0000-000000000004', 'P4.3', 'Painel de gestão da monetização implantado',          'Saldo, vazão e 30/60/90 ativos',   'painel',   'EM_ANDAMENTO', '2026-04-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000404', 'd1000000-0000-0000-0000-000000000004', 'P4.4', 'Baseline de uso de produto com melhoria ≥ 15%',      '15',                               '%',        'NAO_INICIADO', '2026-12-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000405', 'd1000000-0000-0000-0000-000000000004', 'P4.5', 'Duas frentes de automação/IA com ganho mensurável',   '2',                                'frentes',  'NAO_INICIADO', '2026-09-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  -- OKR-P5 (5 KRs)
  ('e1000000-0000-0000-0000-000000000501', 'd1000000-0000-0000-0000-000000000005', 'P5.1', 'Turnover anual ≤ 35%',                                '35',                               '%',        'EM_ANDAMENTO', '2026-12-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000502', 'd1000000-0000-0000-0000-000000000005', 'P5.2', 'Engajamento ≥ 85%',                                   '85',                               '%',        'NAO_INICIADO', '2026-12-31', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000503', 'd1000000-0000-0000-0000-000000000005', 'P5.3', 'Rituais mínimos de liderança ≥ 85%',                  '85',                               '%',        'NAO_INICIADO', '2026-06-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000504', 'd1000000-0000-0000-0000-000000000005', 'P5.4', 'Posições-chave ≥ 80% preenchidas',                   '80',                               '%',        'EM_ANDAMENTO', '2026-06-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('e1000000-0000-0000-0000-000000000505', 'd1000000-0000-0000-0000-000000000005', 'P5.5', 'Onboarding estruturado e mensurável',                 'Processo padrão implantado',       'entrega',  'NAO_INICIADO', '2026-04-30', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- L4a — MOTORES ESTRATÉGICOS (DOC 08 v2)
-- ============================================================

INSERT INTO public.motors (id, code, title, description, pillar_code, created_at, updated_at)
VALUES
  ('f1000000-0000-0000-0000-000000000001', 'M1', 'Motor de Monetização',   'Ativar e reduzir saldo, Pareto Top-14, previsão 30/60/90',        'P2', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000002', 'M2', 'Motor de Governança',    'Separação Aero×TD, registros formais, controles auditáveis',       'P1', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000003', 'M3', 'Motor de Escala',        'Capacidade planejada, qualidade, SLA, margem ≥ 30%',              'P3', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000004', 'M4', 'Motor de Produto/IA',    'Produto, dados, automação e prova de valor defensável',            'P4', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('f1000000-0000-0000-0000-000000000005', 'M5', 'Motor de Pessoas',       'Retenção, liderança, onboarding e densidade intelectual',         'P5', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- L4b — INICIATIVAS CORPORATIVAS (DOC 08 v2 — 22 INITs)
--   P0 (13): INIT-001 a INIT-013
--   P1  (9): INIT-014 a INIT-022
-- ============================================================

INSERT INTO public.initiatives (id, code, title, type, priority, pillar_id, okr_code, kr_code, owner, sponsor, status, start_date, end_date, effort, motor_id, created_at, updated_at)
VALUES
  -- P0 — Críticas 90 dias
  ('a2000000-0000-0000-0000-000000000001','INIT-001','Apuração gerencial por unidade e estrutura de centros de custo',         'SIS','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.1','Financeiro',           'Direção Executiva','EM_ANDAMENTO','2026-01-15','2026-04-30','ALTO', 'f1000000-0000-0000-0000-000000000002','2026-01-01T00:00:00Z','2026-01-15T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000002','INIT-002','Formalização de alçadas, decisões e registro de riscos',                  'MET','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.3','Direção Executiva',    'Direção Executiva','EM_ANDAMENTO','2026-01-10','2026-03-31','MEDIO','f1000000-0000-0000-0000-000000000002','2026-01-01T00:00:00Z','2026-01-10T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000003','INIT-003','Sala de Situação e gestão semanal do Pareto Top-14',                     'MET','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.3','CS / Relacionamento',  'Direção Executiva','EM_ANDAMENTO','2026-01-01','2026-03-31','ALTO', 'f1000000-0000-0000-0000-000000000001','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000004','INIT-004','Modelo de ativação e previsão 30/60/90 da base contratual',              'COM','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.5','CS / Relacionamento',  'Direção Executiva','EM_ANDAMENTO','2026-01-20','2026-06-30','ALTO', 'f1000000-0000-0000-0000-000000000001','2026-01-01T00:00:00Z','2026-01-20T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000005','INIT-005','Planejamento semanal de capacidade operacional Q1',                      'MET','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.2','Operação',             'Direção Executiva','EM_ANDAMENTO','2026-01-15','2026-03-31','MEDIO','f1000000-0000-0000-0000-000000000003','2026-01-01T00:00:00Z','2026-01-15T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000006','INIT-006','Implantação do registro semanal de capacidade 4–6 semanas à frente',     'MET','P0','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.2','Operação',             'Direção Executiva','EM_ANDAMENTO','2026-01-15','2026-03-31','MEDIO','f1000000-0000-0000-0000-000000000003','2026-01-01T00:00:00Z','2026-01-15T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000007','INIT-007','Pacote mensal de evidências e prova de valor',                           'COM','P0','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.1','Marketing',            'Direção Executiva','EM_ANDAMENTO','2026-01-01','2026-12-31','MEDIO','f1000000-0000-0000-0000-000000000004','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000008','INIT-008','Relatório executivo de prova de valor Top-14',                           'COM','P0','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.2','Marketing',            'Direção Executiva','EM_ANDAMENTO','2026-02-01','2026-03-31','BAIXO','f1000000-0000-0000-0000-000000000004','2026-01-01T00:00:00Z','2026-02-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000009','INIT-009','Mapa de posições-chave e sucessão mínima',                               'ORG','P0','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.4','RH / Pessoas',         'Direção Executiva','EM_ANDAMENTO','2026-02-01','2026-07-31','MEDIO','f1000000-0000-0000-0000-000000000005','2026-01-01T00:00:00Z','2026-02-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000010','INIT-010','Onboarding estruturado e rituais mínimos de liderança',                  'ORG','P0','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.5','RH / Pessoas',         'Direção Executiva','PLANEJADA',  '2026-02-15','2026-06-30','MEDIO','f1000000-0000-0000-0000-000000000005','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000011','INIT-011','Processo de cobrança e reativação da base com baixa execução',           'COM','P0','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.4','CS / Relacionamento',  'Direção Executiva','EM_ANDAMENTO','2026-01-20','2026-06-30','ALTO', 'f1000000-0000-0000-0000-000000000001','2026-01-01T00:00:00Z','2026-01-20T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000012','INIT-012','Definição do modelo de separação societária Aero × Techdengue v1',       'MET','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.5','Direção Executiva',    'Direção Executiva','PLANEJADA','2026-02-01','2026-04-30','ALTO', 'f1000000-0000-0000-0000-000000000002','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000013','INIT-013','Implantação da trilha de evidências EVID-* para KRs',                    'MET','P0','b1000000-0000-0000-0000-000000000001','OKR-P1','P1.4','Direção Executiva',    'Direção Executiva','EM_ANDAMENTO','2026-01-15','2026-12-31','MEDIO','f1000000-0000-0000-0000-000000000002','2026-01-01T00:00:00Z','2026-01-15T00:00:00Z'),
  -- P1 — Estratégicas do ano
  ('a2000000-0000-0000-0000-000000000014','INIT-014','Painel de gestão da monetização, saldo e vazão',                         'SIS','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.3','P&D / Produto / Dados','Direção Executiva','PLANEJADA',  '2026-03-01','2026-07-31','ALTO', 'f1000000-0000-0000-0000-000000000004','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000015','INIT-015','Padrão mínimo de qualidade e SLA por operação',                          'ORG','P1','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.4','Operação',             'Direção Executiva','PLANEJADA',  '2026-04-01','2026-09-30','ALTO', 'f1000000-0000-0000-0000-000000000003','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000016','INIT-016','Redução de retrabalho em 20% com rastreamento por operação',             'ORG','P1','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.3','Operação',             'Direção Executiva','PLANEJADA',  '2026-04-01','2026-09-30','MEDIO','f1000000-0000-0000-0000-000000000003','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000017','INIT-017','Integração formal Operação ↔ CS ↔ Dados (pontos de passagem)',            'ORG','P1','b1000000-0000-0000-0000-000000000003','OKR-P3','P3.5','Operação + CS',        'Direção Executiva','PLANEJADA',  '2026-04-01','2026-07-31','MEDIO','f1000000-0000-0000-0000-000000000003','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000018','INIT-018','Estruturação da área Comercial e processo de pipeline com tese',         'ORG','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.2','Comercial',            'Direção Executiva','PLANEJADA','2026-04-01','2026-09-30','ALTO', 'f1000000-0000-0000-0000-000000000001','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000019','INIT-019','Baseline de uso de produto e melhoria ≥ 15%',                            'SIS','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.4','P&D / Produto / Dados','Direção Executiva','PLANEJADA','2026-06-01','2026-12-31','ALTO', 'f1000000-0000-0000-0000-000000000004','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000020','INIT-020','Duas frentes de automação/IA com ganho mensurável',                      'SIS','P1','b1000000-0000-0000-0000-000000000004','OKR-P4','P4.5','P&D / Produto / Dados','Direção Executiva','PLANEJADA','2026-06-01','2026-12-31','ALTO', 'f1000000-0000-0000-0000-000000000004','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000021','INIT-021','Diversificação Aero — mapeamento de novos serviços e clientes',           'COM','P1','b1000000-0000-0000-0000-000000000002','OKR-P2','P2.3','Comercial + Operação',  'Direção Executiva','PLANEJADA','2026-06-01','2026-12-31','MEDIO','f1000000-0000-0000-0000-000000000001','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a2000000-0000-0000-0000-000000000022','INIT-022','Programa de engajamento e retenção de talentos',                         'ORG','P1','b1000000-0000-0000-0000-000000000005','OKR-P5','P5.2','RH / Pessoas',         'Direção Executiva','PLANEJADA','2026-05-01','2026-12-31','MEDIO','f1000000-0000-0000-0000-000000000005','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- L5 — RISCOS ESTRATÉGICOS (DOC 10 v2 — 13 riscos)
-- ============================================================

INSERT INTO public.strategic_risks (id, code, title, category, severity, probability, impact, owner, mitigation, pillar_code, status, review_cadence, created_at, updated_at)
VALUES
  -- Críticos (5)
  ('a3000000-0000-0000-0000-000000000001','RSK-2026-01','Risco Regulatório Agroquímico — mudanças de licenciamento afetam operação Aero',                     'Regulatório',    'CRITICO','MEDIO','CRITICO','Direção Executiva',  'Monitorar legislação, formalizar compliance e mapear impacto por produto',   'P1','ATIVO','MENSAL',   '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000002','RSK-2026-02','Falha de ativação da base contratual — saldo se acumula sem execução',                               'Operacional',    'CRITICO','ALTO', 'CRITICO','CS / Relacionamento','Operar Pareto Top-14, war room semanal e modelo 30/60/90',                    'P2','ATIVO','SEMANAL',  '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000003','RSK-2026-03','Gargalo de capacidade operacional no Q1 — demanda > oferta',                                         'Operacional',    'CRITICO','ALTO', 'CRITICO','Operação',           'Planejamento semanal de capacidade, antecipação de contratações',            'P3','ATIVO','SEMANAL',  '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000004','RSK-2026-04','Queda de qualidade e SLA — impacto na renovação e expansão',                                         'Qualidade',      'CRITICO','MEDIO','CRITICO','Operação',           'Implantar padrão mínimo de qualidade, medir SLA por operação',               'P3','ATIVO','MENSAL',   '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000005','RSK-2026-05','Concentração em poucos clientes — risco de receita por perda de cliente-chave',                     'Comercial',      'CRITICO','MEDIO','CRITICO','Direção Executiva',  'Estruturar diversificação Aero e expansão TD com tese',                      'P2','ATIVO','TRIMESTRAL','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  -- Altos (6)
  ('a3000000-0000-0000-0000-000000000006','RSK-2026-06','Risco de caixa por desvio de execução e inadimplência',                                              'Financeiro',     'ALTO',  'MEDIO','ALTO',  'Financeiro',         'Guardrail de caixa 30/60/90, acompanhamento semanal do forecast',            'P1','ATIVO','SEMANAL',  '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000007','RSK-2026-07','Falha de interfaces entre Operação, CS e Dados — perda de rastreabilidade',                         'Operacional',    'ALTO',  'MEDIO','ALTO',  'Operação + CS',      'Formalizar pontos de passagem e responsabilidades de interface',             'P3','ATIVO','MENSAL',   '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000008','RSK-2026-08','Turnover elevado de pessoas-chave — perda de conhecimento operacional',                              'Pessoas',        'ALTO',  'MEDIO','ALTO',  'RH / Pessoas',       'Mapa de sucessão, programa de retenção e rituais de engajamento',            'P5','ATIVO','MENSAL',   '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000009','RSK-2026-09','Atraso ou falha na separação societária Aero × Techdengue',                                         'Governança',     'ALTO',  'BAIXO','ALTO',  'Direção Executiva',  'Definir modelo de separação v1, acompanhar cronograma legal',               'P1','ATIVO','MENSAL',   '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000010','RSK-2026-10','Qualidade e governança dos dados — decisões baseadas em dados incorretos',                          'Dados',          'ALTO',  'MEDIO','ALTO',  'P&D / Produto',      'Implantar governança de dados, validar fontes críticas por domínio',        'P4','ATIVO','MENSAL',   '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000013','RSK-2026-13','Atraso em contratações críticas — gargalo humano em posições estratégicas',                         'Pessoas',        'ALTO',  'MEDIO','ALTO',  'RH / Pessoas',       'Antecipar contratações, operar mapa de posições-chave',                     'P5','ATIVO','MENSAL',   '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  -- Monitorados (2)
  ('a3000000-0000-0000-0000-000000000011','RSK-2026-11','Crescimento sem tese — expansão comercial sem critério de seleção',                                  'Estratégico',    'MONITORADO','BAIXO','MEDIO','Direção Executiva', 'Definir tese de expansão e critérios de elegibilidade por segmento',        'P2','ATIVO','TRIMESTRAL','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a3000000-0000-0000-0000-000000000012','RSK-2026-12','Dependência excessiva de pessoas-chave sem backup definido',                                         'Pessoas',        'MONITORADO','BAIXO','MEDIO','RH / Pessoas',     'Mapa de sucessão mínima e documentação de processos críticos',              'P5','ATIVO','TRIMESTRAL','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- L6 — CENÁRIOS FINANCEIROS (DOC 07 v2 + DOC 09 v3)
-- ============================================================

INSERT INTO public.financial_scenarios (id, code, label, probability_pct, revenue_target, margin_target, description, is_reference, created_at, updated_at)
VALUES
  ('a4000000-0000-0000-0000-000000000001','PESSIMISTA','Pessimista',15.00, 8310000.00,18.20,'Execução abaixo da meta, inadimplência elevada, gargalo Q1 não resolvido',           false,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a4000000-0000-0000-0000-000000000002','BASE',      'Base',      60.00,11440000.00,30.00,'Execução dentro do plano, ativação da base, margem sustentável acima de 30%',        true, '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a4000000-0000-0000-0000-000000000003','OTIMISTA',  'Otimista',  25.00,13290000.00,36.40,'Aceleração de execução, ativação plena do Pareto, diversificação em curso antes do prazo',false,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- L7 — TEMAS ESTRATÉGICOS (DOC 02 v2 — 8 temas)
-- ============================================================

INSERT INTO public.strategic_themes (id, code, title, description, pillar_codes, priority, created_at, updated_at)
VALUES
  ('a5000000-0000-0000-0000-000000000001','TH-01','Separação Aero × Techdengue',        'Separação societária progressiva, governança dual, rastreabilidade legal e financeira',      ARRAY['P1'],       1,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000000-0000-0000-0000-000000000002','TH-02','TD Sell-Ready',                       'Techdengue pronta para crescimento, separação e eventual transação societária',               ARRAY['P1','P2'],  2,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000000-0000-0000-0000-000000000003','TH-03','Monetização da Base Contratual',      'Ativar, reduzir saldo e operar Pareto Top-14 com disciplina semanal',                        ARRAY['P2'],       1,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000000-0000-0000-0000-000000000004','TH-04','Expansão com Permanência',            'Crescer novos contratos mantendo qualidade, SLA e margem adequada',                         ARRAY['P2','P3'],  2,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000000-0000-0000-0000-000000000005','TH-05','Diversificação Aero',                 'Ampliar portfólio Aero, reduzir concentração e explorar novos segmentos',                   ARRAY['P2'],       3,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000000-0000-0000-0000-000000000006','TH-06','Densidade Intelectual',               'Pessoas como vantagem competitiva: retenção, liderança e capacidade de geração de valor',  ARRAY['P5'],       2,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000000-0000-0000-0000-000000000007','TH-07','Governança e Disciplina Operacional', 'Registros formais, decisões auditáveis e rituais de acompanhamento ativos',                 ARRAY['P1','P3'],  1,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a5000000-0000-0000-0000-000000000008','TH-08','Produto, Dados e IA',                 'Tecnologia como ativo defensável: produto, evidência, automação e inteligência operacional',ARRAY['P4'],       2,'2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- L8 — OKRs POR ÁREA (DOC 11-A a 11-G)
-- ============================================================

INSERT INTO public.area_okrs (id, area_id, objective, status, created_at, updated_at)
VALUES
  ('a6000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000001','Estruturar mapa de posições-chave e rituais mínimos de liderança',                    'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000001','Reduzir turnover e estruturar onboarding mensurável',                                  'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000002','Fortalecer narrativa de evidência e prova de valor',                                  'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000002','Apoiar expansão e diversificação com tese',                                            'NAO_INICIADO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000003','Estruturar produto, dados e IA como vantagem defensável',                             'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000004','Escalar operação com margem, qualidade e prontidão',                                  'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000007','a1000000-0000-0000-0000-000000000004','Planejar capacidade e reduzir retrabalho',                                             'ATENCAO',     '2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000008','a1000000-0000-0000-0000-000000000005','Ativar demanda e previsão 30/60/90 com disciplina',                                    'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000009','a1000000-0000-0000-0000-000000000005','Operar Pareto Top-14 e monetização da base contratual',                                'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000010','a1000000-0000-0000-0000-000000000006','Estruturar área comercial e pipeline com tese',                                        'NAO_INICIADO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000011','a1000000-0000-0000-0000-000000000007','Implantar apuração gerencial por unidade (DRE Aero + DRE TD)',                        'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'),
  ('a6000000-0000-0000-0000-000000000012','a1000000-0000-0000-0000-000000000007','Operar guardrails de margem e caixa com previsibilidade',                             'EM_ANDAMENTO','2026-01-01T00:00:00Z','2026-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICAÇÃO DE INTEGRIDADE (relatório inline)
-- ============================================================

DO $$
DECLARE
  v_areas       INT; v_pillars     INT; v_subpillars  INT;
  v_okrs        INT; v_krs         INT; v_motors      INT;
  v_initiatives INT; v_risks       INT; v_scenarios   INT;
  v_themes      INT; v_area_okrs   INT;
BEGIN
  SELECT COUNT(*) INTO v_areas       FROM public.areas;
  SELECT COUNT(*) INTO v_pillars     FROM public.pillars;
  SELECT COUNT(*) INTO v_subpillars  FROM public.subpillars;
  SELECT COUNT(*) INTO v_okrs        FROM public.corporate_okrs;
  SELECT COUNT(*) INTO v_krs         FROM public.key_results;
  SELECT COUNT(*) INTO v_motors      FROM public.motors;
  SELECT COUNT(*) INTO v_initiatives FROM public.initiatives;
  SELECT COUNT(*) INTO v_risks       FROM public.strategic_risks;
  SELECT COUNT(*) INTO v_scenarios   FROM public.financial_scenarios;
  SELECT COUNT(*) INTO v_themes      FROM public.strategic_themes;
  SELECT COUNT(*) INTO v_area_okrs   FROM public.area_okrs;

  RAISE NOTICE '=== RECONCILIAÇÃO PE2026 SEED ===';
  RAISE NOTICE 'Áreas:        % / 7  esperado', v_areas;
  RAISE NOTICE 'Pilares:      % / 5  esperado', v_pillars;
  RAISE NOTICE 'Subpilares:   % / 20 esperado', v_subpillars;
  RAISE NOTICE 'OKRs corp.:   % / 5  esperado', v_okrs;
  RAISE NOTICE 'KRs:          % / 25 esperado', v_krs;
  RAISE NOTICE 'Motores:      % / 5  esperado', v_motors;
  RAISE NOTICE 'Iniciativas:  % / 22 esperado', v_initiatives;
  RAISE NOTICE 'Riscos:       % / 13 esperado', v_risks;
  RAISE NOTICE 'Cenários:     % / 3  esperado', v_scenarios;
  RAISE NOTICE 'Temas:        % / 8  esperado', v_themes;
  RAISE NOTICE 'OKRs área:    % / 12 esperado', v_area_okrs;
  RAISE NOTICE '=================================';

  -- Asserções de integridade
  IF v_areas       < 7  THEN RAISE EXCEPTION 'FALHA: áreas incompletas (% / 7)',        v_areas;       END IF;
  IF v_pillars     < 5  THEN RAISE EXCEPTION 'FALHA: pilares incompletos (% / 5)',      v_pillars;     END IF;
  IF v_subpillars  < 20 THEN RAISE EXCEPTION 'FALHA: subpilares incompletos (% / 20)',  v_subpillars;  END IF;
  IF v_okrs        < 5  THEN RAISE EXCEPTION 'FALHA: OKRs incompletos (% / 5)',         v_okrs;        END IF;
  IF v_krs         < 25 THEN RAISE EXCEPTION 'FALHA: KRs incompletos (% / 25)',         v_krs;         END IF;
  IF v_motors      < 5  THEN RAISE EXCEPTION 'FALHA: motores incompletos (% / 5)',      v_motors;      END IF;
  IF v_initiatives < 22 THEN RAISE EXCEPTION 'FALHA: iniciativas incompletas (% / 22)', v_initiatives; END IF;
  IF v_risks       < 13 THEN RAISE EXCEPTION 'FALHA: riscos incompletos (% / 13)',       v_risks;       END IF;
  IF v_scenarios   < 3  THEN RAISE EXCEPTION 'FALHA: cenários incompletos (% / 3)',     v_scenarios;   END IF;
  IF v_themes      < 8  THEN RAISE EXCEPTION 'FALHA: temas incompletos (% / 8)',         v_themes;      END IF;

  RAISE NOTICE 'OK: todas as asserções de integridade passaram.';
END $$;

COMMIT;
