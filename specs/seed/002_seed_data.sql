-- ============================================================
-- PE_2026 — Seed Data v1
-- Dados iniciais para pilares, áreas e templates
-- Executar APÓS 001_schema_migration.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PILARES ESTRATÉGICOS
-- ────────────────────────────────────────────────────────────
INSERT INTO public.pillars (code, title, frontier) VALUES
  ('PIL-01', 'Excelência Operacional', 'Eficiência e qualidade em todos os processos'),
  ('PIL-02', 'Inovação e Tecnologia', 'Transformação digital e automação'),
  ('PIL-03', 'Capital Humano', 'Desenvolvimento de pessoas e cultura'),
  ('PIL-04', 'Sustentabilidade', 'ESG e responsabilidade socioambiental'),
  ('PIL-05', 'Crescimento', 'Expansão de mercado e novos negócios')
ON CONFLICT (code) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 2. ÁREAS
-- ────────────────────────────────────────────────────────────
INSERT INTO public.areas (slug, name, owner, focus, color) VALUES
  ('rh', 'Recursos Humanos', 'Renata Silvestre', 'Gestão de pessoas e desenvolvimento organizacional', '#3B82F6'),
  ('ti', 'Tecnologia da Informação', NULL, 'Infraestrutura, sistemas e segurança', '#8B5CF6'),
  ('financeiro', 'Financeiro', NULL, 'Controladoria, tesouraria e planejamento financeiro', '#10B981'),
  ('comercial', 'Comercial', NULL, 'Vendas, marketing e relacionamento com cliente', '#F59E0B'),
  ('operacoes', 'Operações', NULL, 'Produção, logística e qualidade', '#EF4444'),
  ('engenharia', 'Engenharia', NULL, 'Projetos, P&D e inovação técnica', '#06B6D4')
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 3. TEMPLATES DE PLANO
-- ────────────────────────────────────────────────────────────
INSERT INTO public.plan_templates (id, name, description, structure) VALUES
  (gen_random_uuid(), 'Plano Padrão 2026', 'Template base para planos de ação anuais', '{"sections": ["diagnostico", "objetivos", "acoes", "cronograma", "indicadores"]}'),
  (gen_random_uuid(), 'Plano Simplificado', 'Template reduzido para áreas com menos complexidade', '{"sections": ["objetivos", "acoes", "cronograma"]}')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 4. CONTEXTOS ESTRATÉGICOS
-- ────────────────────────────────────────────────────────────
INSERT INTO public.context_store (slug, data) VALUES
  ('strategic', '{"vision": "Ser referência em engenharia aeronáutica na América Latina até 2030", "mission": "Entregar soluções de engenharia de alta performance com segurança e inovação", "values": ["Segurança", "Inovação", "Excelência", "Sustentabilidade"]}'),
  ('okrs', '{"period": "2026", "objectives": [{"title": "Aumentar eficiência operacional em 20%", "key_results": ["Reduzir retrabalho em 30%", "Automatizar 5 processos-chave"]}, {"title": "Expandir carteira de clientes", "key_results": ["Fechar 3 novos contratos internacionais", "Aumentar NPS para 85"]}]}'),
  ('governance', '{"committees": ["Comitê Estratégico", "Comitê de Riscos", "Comitê de Inovação"], "review_cadence": "mensal", "approval_flow": ["gestor", "direcao"]}')
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 5. ATUALIZAR ROLE DO USUÁRIO PARA ADMIN (opcional)
-- Descomentar e ajustar o email para promover um usuário
-- ────────────────────────────────────────────────────────────
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'claudio.ribeiro@aeroengenharia.com');
