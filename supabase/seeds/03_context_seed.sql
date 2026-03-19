-- ============================================
-- CONTEXT STORE SEED (MODELO)
-- Cole cada JSON de /public/data no bloco indicado
-- ============================================

-- ✅ Exemplos: scoreboard_context.json, strategic_context.json, okrs_context.json,
-- capacity_context.json, finance_context.json, governance_context.json,
-- initiatives_context.json, monetization_context.json

-- 1) Placar institucional
INSERT INTO context_store (slug, data)
VALUES (
  'scoreboard',
  $$PASTE_SCOREBOARD_JSON_HERE$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- 2) Contexto estratégico
INSERT INTO context_store (slug, data)
VALUES (
  'strategic',
  $$PASTE_STRATEGIC_JSON_HERE$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- 3) OKRs
INSERT INTO context_store (slug, data)
VALUES (
  'okrs',
  $$PASTE_OKRS_JSON_HERE$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- 4) Capacidade
INSERT INTO context_store (slug, data)
VALUES (
  'capacity',
  $$PASTE_CAPACITY_JSON_HERE$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- 5) Financeiro
INSERT INTO context_store (slug, data)
VALUES (
  'finance',
  $$PASTE_FINANCE_JSON_HERE$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- 6) Governança
INSERT INTO context_store (slug, data)
VALUES (
  'governance',
  $$PASTE_GOVERNANCE_JSON_HERE$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- 7) Iniciativas
INSERT INTO context_store (slug, data)
VALUES (
  'initiatives',
  $$PASTE_INITIATIVES_JSON_HERE$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- 8) Monetização
INSERT INTO context_store (slug, data)
VALUES (
  'monetization',
  $$PASTE_MONETIZATION_JSON_HERE$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = now();
