# HANDOFF — PE2026 — Estado Atual Pós-Ondas A–F + Frentes 1–4 + OPs 01–05

> **Localização:** `specs/00_HANDOFF_CURRENT_STATE.md`  
> **Última atualização:** 21/03/2026 (sessão 4)  
> **Plano de referência:** [MEGAPLAN_PE_REAL_v1.md](./10_MEGAPLAN/MEGAPLAN_PE_REAL_v1.md)  
> **Backlog vivo:** [BACKLOG_POS_ONDAS.md](./BACKLOG_POS_ONDAS.md)

---

## BLOCO 1 — Ondas + Frentes Concluídas

### Ondas MEGAPLAN (A–F)

| Onda | Escopo | Status |
|------|--------|--------|
| A — Base Canônica | tipos TS, mockData (22 INITs/5 OKRs/25 KRs/13 RSKs/3 cenários), api-mock, api.ts, migration | ✅ |
| B — Hardening | migration RLS + FK + audit_log, assertSupabaseAvailableForProd | ✅ |
| C — Bootstrap Auditável | seed 05 (8 lotes canônicos), seed 06 (15 asserções de integridade) | ✅ |
| D — Engine de Cálculo | scoreboard/engine.ts (guardrails A1-A4, KPIs P1-P5, monetização C1-C7, EWS) | ✅ |
| E — Adequação da UI | ScoreboardPage, InitiativesPage, StrategyRisksPage, StrategyOverviewPage + hooks canônicos | ✅ |
| F — Dual-Run e Cutover | migration feature_flags + cutover_log + validate_cutover + runbook operacional | ✅ |

### Frentes Pós-Ondas (21/03/2026)

| Frente | Escopo | Status |
|--------|--------|--------|
| F1-01 | Goals: 6 canônicos + `is_canonical` + user_id nullable + flag | ✅ |
| F1-02 | Indicators: 8 canônicos + `is_canonical` + flag | ✅ |
| F1-03 | Action Plans: 7 canônicos + extensão JSONB 5W2H/PDCA/tarefas + mapeamento `where_location` + flag | ✅ |
| F1-04 | Governance: `context_store` slug `governance` ativo + flag | ✅ |
| F2 | `institutional_kpis` (27) + `kpi_snapshots` + `kr_snapshots` + `risk_snapshots` + `forecast_snapshots` + `take_kpi_snapshot()` + `v_snapshot_comparison` | ✅ |
| F3 | `formal_decisions` (5 DEC-*) + `vw_traceability` (Pilar→OKR→KR→INIT) + `vw_modules_status` | ✅ |
| F4-02 | Smoke tests E2E: 10/10 passando (demo mode + build integrity) | ✅ |
| F4-03 | Handoff atualizado (sessão 2) | ✅ |
| F4-04 | Smoke tests autenticados: 32/32 passando — root cause CSP resolvido (sessão 4) | ✅ |

### Oportunidades Operacionais (21/03/2026 — sessão 3)

| OP | Escopo | Status |
|----|--------|--------|
| OP-04 | Seed admin local: `admin@pe2026.local` / `pe2026@admin` no Docker | ✅ |
| OP-01 | `FinancePage` + cenários canônicos BASE/OTIMISTA/PESSIMISTA via `useFinancialScenarios()` | ✅ |
| OP-02 | `DataHealthPage` + card "Status dos Módulos" via `useCutoverStatus()` | ✅ |
| OP-03 | `AdminPage` + banner verde/amarelo de cutover (10/10 módulos em Supabase) | ✅ |
| OP-05 | Runbook `ONDA_F` v1.1.0 — seeds 07-09, 10 módulos, observabilidade | ✅ |

---

## BLOCO 2 — Arquivos Críticos por Onda

### Onda A
- `src/features/area-plans/types.ts` — Motor, StrategicTheme, StrategicRisk, FinancialScenario, Subpillar
- `src/features/area-plans/utils/mockData.ts` — mockStore canônico completo
- `src/features/area-plans/api-mock.ts` — fetchSubpillars, fetchCorporateOkrs, fetchKeyResults, fetchMotors, fetchStrategicThemes, fetchStrategicRisks, fetchFinancialScenarios
- `src/features/area-plans/api.ts` — endpoints canônicos com fallback mock/supabase
- `supabase/migrations/20260319_onda_a_canonical_base.sql`

### Onda B
- `src/shared/lib/supabaseClient.ts` — assertSupabaseAvailableForProd()
- `supabase/migrations/20260320_onda_b_hardening.sql`

### Onda C
- `supabase/seeds/05_canonical_pe2026_seed.sql`
- `supabase/seeds/06_integrity_check.sql`

### Onda D
- `src/features/scoreboard/engine.ts` — calcStatus, recalcGuardrails, computeScoreResult, applyEngineToContext
- `src/features/scoreboard/hooks.ts` — useScoreboardWithEngine
- `src/features/scoreboard/api.ts`

### Onda E
- `src/features/analytics/pages/ScoreboardPage.tsx`
- `src/features/initiatives/hooks.ts` — useCanonicalInitiatives + useMotors
- `src/features/initiatives/pages/InitiativesPage.tsx`
- `src/features/okrs/hooks.ts` — useCorporateOkrs + useCanonicalKeyResults
- `src/features/finance/hooks.ts` — useFinancialScenarios + useStrategicRisks
- `src/features/area-plans/hooks.ts` — useSubpillars, useCorporateOkrs, useKeyResults, useMotors, useStrategicThemes, useStrategicRisks, useFinancialScenarios
- `src/features/strategy/pages/StrategyRisksPage.tsx` — 13 RSKs canônicos
- `src/features/strategy/pages/StrategyOverviewPage.tsx` — alertas críticos canônicos

### Onda F
- `supabase/migrations/20260321_onda_f_cutover.sql`
- `specs/runbook/ONDA_F_DUAL_RUN_CUTOVER.md`

### Frentes 1–3 (21/03/2026)
- `supabase/migrations/20260321_frente1_goals_indicators.sql` — colunas faltantes goals/indicators
- `supabase/migrations/20260321_frente1_goals_canonical_patch.sql` — `is_canonical` + `user_id` nullable
- `supabase/migrations/20260321_frente1_action_plans_extend.sql` — extensão JSONB completa + constraints
- `supabase/migrations/20260321_frente2_institutional_kpis.sql` — KPIs + 4 snapshots + função + view
- `supabase/migrations/20260321_frente3_decisions_traceability.sql` — formal_decisions + vw_traceability
- `supabase/seeds/07_goals_indicators_seed.sql` — 6 goals + 8 indicators canônicos
- `supabase/seeds/08_action_plans_seed.sql` — 7 planos canônicos PE2026
- `supabase/seeds/09_institutional_kpis_seed.sql` — 27 KPIs (A1-A4, P1-P5, C1-C7)
- `src/features/goals/types.ts` — `user_id: string | null`, `is_canonical?`
- `src/features/indicators/types.ts` — `user_id: string | null`, `is_canonical?`
- `src/features/action-plans/types.ts` — `user_id: string | null`, `is_canonical?`
- `src/features/action-plans/api.ts` — `mapDbToActionPlan()` mapeando `where_location↔where`

### OPs (21/03/2026 — sessão 3)
- `supabase/seeds/10_local_admin_seed.sql` — usuário admin local (auth.users + profiles)
- `src/features/analytics/hooks.ts` — `useCutoverStatus()` (feature_flags → ModuleStatus[])
- `src/features/analytics/types.ts` — interface `ModuleStatus` adicionada
- `src/features/finance/pages/FinancePage.tsx` — seção "Cenários Financeiros PE2026"
- `src/features/analytics/pages/DataHealthPage.tsx` — card "Status dos Módulos (Cutover)"
- `src/features/admin/pages/AdminPage.tsx` — banner de cutover status
- `specs/runbook/ONDA_F_DUAL_RUN_CUTOVER.md` — v1.1.0 (atualizado)
- `e2e/smoke-canonical.spec.ts` — 10/10 smoke tests passando

---

## BLOCO 3 — Estado do Banco (21/03/2026)

### Feature Flags — todos ativos
```
action-plans | enabled=t | source=supabase
area-plans   | enabled=t | source=supabase
finance      | enabled=t | source=supabase
goals        | enabled=t | source=supabase
governance   | enabled=t | source=supabase
indicators   | enabled=t | source=supabase
initiatives  | enabled=t | source=supabase
okrs         | enabled=t | source=supabase
scoreboard   | enabled=t | source=supabase
strategy     | enabled=t | source=supabase
```

### Seeds aplicados (por ordem)
| Seed | Conteúdo | Registros |
|------|----------|-----------|
| 05_canonical_pe2026_seed.sql | 7 áreas, 5 pilares, 20 subpilares, 5 OKRs, 25 KRs, 5 motores, 22 INITs, 13 riscos, 3 cenários, 8 temas, 12 OKRs área | 117 |
| 06_integrity_check.sql | 15 asserções de integridade | OK |
| 07_goals_indicators_seed.sql | 6 goals + 8 indicators canônicos | 14 |
| 08_action_plans_seed.sql | 7 planos de ação canônicos (1 por área) | 7 |
| 09_institutional_kpis_seed.sql | 27 KPIs (4 guardrails + 16 pilar + 7 monetização) | 27 |
| formal_decisions (inline na migration F3) | 5 decisões DEC-* | 5 |
| 10_local_admin_seed.sql | Usuário admin local (auth.users + profiles) — apenas dev | 1 |

### Próximos passos operacionais
```powershell
# 1. Build (validado — 0 erros)
npm run build

# 2. Smoke tests E2E (10/10 passando)
npx playwright test e2e/smoke-canonical.spec.ts

# 3. Snapshot WBR (primeiro ciclo operacional)
# SELECT take_kpi_snapshot('WBR-2026-W12');

# 4. Deploy produção (F4-01 — aguarda variáveis do usuário)
# npx netlify link && npx netlify deploy --prod --dir=dist

# Login admin local (para testar Supabase real)
# Email: admin@pe2026.local
# Senha: pe2026@admin
```

### Critérios de sucesso — estado atual (sessão 3):
- [x] `npm run build` zero erros TypeScript
- [x] Seed 06: 15/15 asserções OK
- [x] 10/10 módulos `enabled=true, source=supabase`
- [x] `vw_traceability` retornando cadeia Pilar→OKR→KR→INIT
- [x] Smoke tests E2E: 10/10 passando (demo mode + build integrity)
- [x] `FinancePage` exibindo 3 cenários canônicos
- [x] `DataHealthPage` + `AdminPage` com status de cutover em tempo real
- [x] Usuário admin local criado no Supabase Docker
- [ ] Deploy Netlify produção (F4-01 — aguarda VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)

---

## BLOCO 4 — Contexto para Novo Chat

```
CONTEXTO — PE2026 — Pós-Ondas A–F + Frentes 1–3 + OPs 01–05 — 21/03/2026

Repo: B:\PE_2026
Estado: Ondas A–F + Frentes 1–3 + OPs 01–05 TODAS concluídas.
Cutover completo — 10/10 módulos em Supabase.
Build: ✅ 0 erros | Smoke E2E: ✅ 10/10

✅ ENTREGUE (ondas A–F):
- A: Base canônica, B: Hardening, C: Seeds, D: Engine, E: UI, F: Cutover/Flags

✅ ENTREGUE (Frentes 1–3 — 21/03/2026 sessão 2):
- F1: goals + indicators + action-plans + governance → todos em Supabase
- F2: institutional_kpis (27) + 4 tabelas snapshot + take_kpi_snapshot() + view
- F3: formal_decisions (5 DEC-*) + vw_traceability + vw_modules_status
- F4-02: Smoke tests E2E 10/10 | F4-03: Handoff atualizado

✅ ENTREGUE (OPs 01–05 — 21/03/2026 sessão 3):
- OP-04: seed 10_local_admin_seed.sql (admin@pe2026.local / pe2026@admin)
- OP-01: FinancePage + cenários canônicos BASE/OTIMISTA/PESSIMISTA
- OP-02: DataHealthPage + useCutoverStatus() (src/features/analytics/hooks.ts)
- OP-03: AdminPage + banner cutover verde/amarelo
- OP-05: Runbook ONDA_F v1.1.0 atualizado

🎯 ÚNICA PENDÊNCIA:
- F4-01: Deploy Netlify produção
  → Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Netlify
  → Execute: npx netlify deploy --prod --dir=dist

📋 HANDOFF: specs/00_HANDOFF_CURRENT_STATE.md
📋 BACKLOG VIVO: specs/BACKLOG_POS_ONDAS.md
📋 MEGAPLAN: specs/10_MEGAPLAN/MEGAPLAN_PE_REAL_v1.md
📋 RUNBOOK: specs/runbook/ONDA_F_DUAL_RUN_CUTOVER.md
```

---

## BLOCO 5 — Convenções

| Tipo | Pasta |
|------|-------|
| Especificações | `specs/01_SPECS/` |
| Gates | `specs/02_GATES/` |
| TODOs | `specs/03_TODOS/` |
| QA/Reports | `specs/04_REPORTS/` |
| Megaplan | `specs/10_MEGAPLAN/` |
| Runbook | `specs/runbook/` |
| Archive | `specs/99_ARCHIVE/` |

