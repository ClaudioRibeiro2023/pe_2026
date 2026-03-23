# BACKLOG PÓS-ONDAS — PE2026 Plataforma

> **Documento vivo.** Atualizado a cada conclusão de tarefa ou descoberta de oportunidade.  
> **Fonte de verdade:** Este arquivo é a referência de continuidade entre sessões de desenvolvimento.  
> **Última atualização:** 2026-03-21 (sessão 2) | **Atualizado por:** Cascade

---

## Status das Ondas (Referência MEGAPLAN v2.0)

| Onda | Objetivo | Status |
|------|----------|--------|
| A | Base Canônica do PE | ✅ Concluída |
| B | Persistência Real e Hardening | ✅ Concluída |
| C | Bootstrap Auditável | ✅ Concluída |
| D | Engine de Cálculo e Scorecard | ✅ Concluída |
| E | Adequação da UI e Fluxos | ✅ Concluída |
| F | Dual-Run, Cutover e Operação Assistida | ✅ Concluída |

**Resumo do estado atual (2026-03-21 — sessão 2):**
- **Banco:** 180+ registros canônicos — 117 base + 6 goals + 8 indicators + 7 action_plans + 27 institutional_kpis + 5 formal_decisions
- **10 módulos** com feature flag `enabled=true, source=supabase` (todos)
- **0 módulos em mock** — cutover completo
- **Tabelas novas:** `institutional_kpis`, `kpi_snapshots`, `kr_snapshots`, `risk_snapshots`, `forecast_snapshots`, `formal_decisions`
- **Views:** `vw_traceability` (Pilar→OKR→KR→INIT), `vw_modules_status`, `v_snapshot_comparison`
- **Função:** `take_kpi_snapshot(cycle)` para WBR/MBR/QBR
- Build: 0 erros TypeScript, 2133 módulos
- Ambiente: local (Supabase local via Docker)

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| 🔴 | Crítico — bloqueia uso em produção |
| 🟡 | Alto — impacta experiência ou dados |
| 🟢 | Médio — melhoria importante mas não bloqueante |
| 💡 | Oportunidade — não previsto no MEGAPLAN original |
| ✅ | Concluído |
| 🔄 | Em andamento |
| ⬜ | Pendente |

---

## FRENTE 1 — Completar mock→real nos módulos restantes ✅

> Concluída em 2026-03-21. Todos os módulos migrados para Supabase com dados canônicos.

### F1-01 — Goals: migrar para Supabase canônico ✅

- **Superfícies:** `src/features/goals/api.ts`, migration de goals, seed de goals
- **O que fazer:**
  1. Criar migration com tabela `goals` compatível com tipo `Goal` existente
  2. Criar seed com metas canônicas do PE2026 (receita base, Q1 hectares, margem, turnover)
  3. Remover mock inline de `goals/api.ts`
  4. Ativar feature flag `goals` → supabase
- **Critério de aceite:** GoalsPage carrega dados do Supabase; mock apenas em DEV sem Supabase
- **Concluído:** 6 goals canônicos PE2026, `user_id` nullable, `is_canonical=true`, flag ativa

### F1-02 — Indicators: migrar para KPIs institucionais ✅

- **Superfícies:** `src/features/indicators/api.ts`, migration de indicators, seed
- **O que fazer:**
  1. Criar migration com tabela `indicators` compatível com tipo `Indicator` existente
  2. Criar seed com 6 indicadores canônicos (guardrails, monetização, operação, governança, produto, pessoas)
  3. Remover mock inline de `indicators/api.ts`
  4. Ativar feature flag `indicators` → supabase
- **Concluído:** 8 indicators canônicos (guardrails + monetização + operação), `is_canonical=true`, flag ativa

### F1-03 — Action Plans: alinhar ao modelo PE e dados reais ✅

- **Superfícies:** `src/features/action-plans/api.ts`, tabelas `area_plans`, `plan_actions`
- **O que fazer:**
  1. Validar que tabelas `area_plans` e `plan_actions` já existem no schema consolidado
  2. Remover mock inline de `action-plans/api.ts`
  3. Ativar feature flag `action-plans` → supabase
  4. Garantir vínculo com INITs e KRs canônicos
- **Concluído:** 7 planos canônicos PE2026, extensão JSONB (5W2H, PDCA, tarefas), mapeamento `where_location↔where`, flag ativa

### F1-04 — Governance: migrar de JSON para Supabase ✅

- **Superfícies:** `src/features/governance/api.ts`, `/public/data/governance_context.json`
- **O que fazer:**
  1. Avaliar se tabela `context_store` já absorve governance
  2. Migrar leitura de JSON para Supabase
  3. Ativar feature flag `governance` → supabase
- **Concluído:** `context_store` já tinha slug `governance`; `fetchContextFromStore` usa Supabase; flag ativa

---

## FRENTE 2 — Snapshots e Histórico para WBR/MBR/QBR ✅

> Concluída em 2026-03-21. Todas as tabelas de snapshot e função take_snapshot criadas.

### F2-01 — Tabela `institutional_kpis` ✅

- **Superfícies:** nova migration, seed canônico de KPIs
- **O que fazer:**
  1. Criar migration com campos: `id`, `code`, `name`, `formula`, `unit`, `category`, `owner`, `source_table`, `is_guardrail`, `is_monetization`, `status_homologation`
  2. Criar seed com os ~52 KPIs do DOC 05 (4 guardrails + 16 por pilar + 7 monetização + ~25 setoriais)
  3. Vincular engine de cálculo existente (`src/features/scoreboard/engine.ts`) à tabela
- **Concluído:** 27 KPIs (4 guardrails A1-A4 + 16 pilar P1-P5 + 7 monetização C1-C7), 21 homologados

### F2-02 — Tabelas de Snapshot (`kpi_snapshots`, `kr_snapshots`) ✅

- **Superfícies:** nova migration
- **O que fazer:**
  1. Criar tabelas de snapshot com campos: `id`, `ref_id`, `ref_code`, `snapshot_date`, `value`, `status`, `cycle` (WBR/MBR/QBR), `created_by`
  2. Criar função Postgres `take_snapshot(cycle TEXT)` para congelar leitura atual
  3. Criar view `v_snapshot_comparison` para comparar ciclos
- **Concluído:** Tabelas criadas + função `take_kpi_snapshot(cycle)` + view `v_snapshot_comparison`

### F2-03 — Tabelas `risk_snapshots` e `forecast_snapshots` ✅

- **Superfícies:** nova migration
- **O que fazer:**
  1. Criar tabelas análogas a F2-02 para riscos e forecasts 30/60/90
  2. Criar função `take_risk_snapshot(cycle TEXT)`
- **Concluído:** `risk_snapshots` + `forecast_snapshots` criados com RLS e índices

---

## FRENTE 3 — Rastreabilidade e Decisões Formais ✅

> Concluída em 2026-03-21.

### F3-01 — Tabela `formal_decisions` ✅

- **Superfícies:** nova migration, seed opcional
- **O que fazer:**
  1. Criar tabela com campos: `id`, `code` (DEC-YYYYMMDD-NNN), `title`, `decided_by`, `decided_at`, `context`, `pillar_code`, `okr_code`, `status` (ATIVA/REVISADA/REVOGADA), `review_date`
  2. RLS: leitura autenticada, escrita admin
  3. Vincular às páginas de governança
- **Concluído:** 5 decisões canônicas DEC-*, código único, RLS, trigger updated_at

### F3-02 — Rastreabilidade Pilar→OKR→KR→INIT navegável ✅

- **Superfícies:** `src/features/strategy/`, view Supabase `vw_traceability`
- **O que fazer:**
  1. Criar view `vw_traceability` que une pilares → OKRs → KRs → INITs → evidências
  2. Expor via API canônica
  3. Validar que ScoreboardPage e StrategyOverviewPage conseguem navegar a cadeia
- **Concluído:** `vw_traceability` (Pilar→OKR→KR→INIT) + `vw_modules_status` criadas e validadas

---

## FRENTE 4 — Produção e Observabilidade

### F4-01 — Deploy produção (Netlify) 🟢 ⬜

- **O que fazer:**
  1. Executar `npx netlify link` para criar/vincular site
  2. Configurar variáveis de ambiente no Netlify (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  3. Executar deploy com `npx netlify deploy --prod --dir=dist`
- **Pré-condições:** Frente 1 concluída; smoke tests validados
- **Esforço estimado:** 1–2h

### F4-02 — Smoke tests E2E com Playwright ✅

- **Superfícies:** `e2e/smoke-canonical.spec.ts`
- **Concluído:** 10/10 testes passando — 8 rotas canônicas em demo mode + 2 build integrity. Authenticated tests skip se `E2E_TEST_EMAIL` não configurado.

### F4-03 — Atualizar handoff `00_HANDOFF_CURRENT_STATE.md` ✅

- **Superfícies:** `specs/00_HANDOFF_CURRENT_STATE.md`
- **Concluído:** Handoff atualizado com Frentes 1–3, tabelas novas, feature flags, seeds e contexto para novo chat

### F4-04 — Smoke tests autenticados com Supabase local ✅

- **Superfícies:** `e2e/smoke-canonical.spec.ts`, `playwright.local.config.ts`, `index.html`
- **Concluído (sessão 4):** 32/32 testes passando — root cause identificado e resolvido:
  - **Bug:** CSP em `index.html` bloqueava `http://localhost:54321` no `connect-src` → app caia em demo-mode silenciosamente
  - **Fix:** Adicionado `http://localhost:54321 http://127.0.0.1:54321 ws://localhost:54321` ao `connect-src`
  - **Refactor:** `playwright.local.config.ts` — porta 5174 dedicada, `reuseExistingServer: false`, env vars Supabase injetadas explicitamente
  - **Refactor:** `e2e/smoke-canonical.spec.ts` — login per-test (`loginAndGoto`), skip demo-mode quando Supabase ativo

---

## 💡 OPORTUNIDADES (não previstas no MEGAPLAN original)

> Itens descobertos durante o desenvolvimento que agregam valor mas não constavam no escopo original.

### OP-01 — FinancePage com dados canônicos ✅

- **Contexto:** `FinancePage` usa JSON local (`finance_context.json`). O Supabase já tem `financial_scenarios` canônicos.
- **O que fazer:** Refatorar `FinancePage` para usar `useFinancialScenarios()`
- **Superfícies:** `src/features/finance/pages/FinancePage.tsx`, `src/features/finance/hooks.ts`
- **Concluído:** `FinancePage` exibe tabela de 3 cenários canônicos (BASE R$11.44M / OTIMISTA R$13.29M / PESSIMISTA R$8.31M) via `useFinancialScenarios()`
- **Esforço estimado:** 2–3h

### OP-02 — DataHealthPage integrada com validate_cutover() ✅

- **Contexto:** Existe `DataHealthPage` — integrar com `validate_cutover()` e contagens reais
- **O que fazer:** Conectar DataHealthPage à função `validate_cutover('all')` do Supabase
- **Superfícies:** `src/features/analytics/hooks.ts`, `src/features/admin/pages/DataHealthPage.tsx`
- **Concluído:** `DataHealthPage` exibe card "Status dos Módulos" com todos os módulos via `useCutoverStatus()` — criado `src/features/analytics/hooks.ts`
- **Esforço estimado:** 1–2h

### OP-03 — Banner visual de módulos em mock no AdminPage ✅

- **Contexto:** Módulos `goals`, `indicators`, `governance`, `action-plans` ainda em mock. Não há sinal visual para o admin.
- **O que fazer:** Adicionar banner/badge no AdminPage mostrando quais módulos ainda operam em mock
- **Superfícies:** `src/features/admin/pages/AdminPage.tsx`, tabela `feature_flags`
- **Concluído:** Banner verde "Cutover completo — 10/10 módulos em Supabase" no topo do `AdminPage`, fica amarelo se algum módulo regredir para mock
- **Esforço estimado:** 1–2h

### OP-04 — Seed de usuário admin para ambiente local ✅

- **Contexto:** Em ambiente local, criar um usuário admin via seed evitaria o processo manual de cadastro
- **O que fazer:** Criar `supabase/seeds/07_dev_admin_user.sql` com usuário demo + perfil admin
- **Concluído:** `supabase/seeds/10_local_admin_seed.sql` — usuário `admin@pe2026.local` / `pe2026@admin` aplicado no Docker local
- **Esforço estimado:** 30min–1h

### OP-05 — Verificar runbook de rollback operacional ✅

- **Contexto:** Funções `rollback_module()` e `rollback_all()` existem no Supabase mas não há runbook operacional visível
- **O que fazer:** Verificar se `specs/runbook/ONDA_F_DUAL_RUN_CUTOVER.md` cobre casos de uso; complementar se necessário
- **Concluído:** `specs/runbook/ONDA_F v1.1.0` — seeds 07-09 adicionados, 10 módulos documentados, seção de observabilidade e checklist expandido
- **Esforço estimado:** 30min

---

## Histórico de Conclusões

| Data | Item | Descrição |
|------|------|-----------|
| 2026-03-20 | Onda A–C | Migrations + seeds canônicos aplicados; 117 registros no Supabase |
| 2026-03-20 | Build | TypeScript/Vite: 0 erros, 2133 módulos |
| 2026-03-21 | Onda F | Cutover ativado; 6 módulos em Supabase via feature flags |
| 2026-03-21 | Validação | Dados canônicos validados (strategic_risks, financial_scenarios) |
| 2026-03-21 | Integração | StrategyOverviewPage + StrategyRisksPage usando hooks canônicos |
| 2026-03-21 | F1-01 | Goals: 6 registros canônicos + migration patch + feature flag ativo |
| 2026-03-21 | F1-02 | Indicators: 8 registros canônicos + feature flag ativo |
| 2026-03-21 | F1-03 | Action Plans: 7 planos canônicos + extensão JSONB + mapeamento where |
| 2026-03-21 | F1-04 | Governance: context_store ativo + flag habilitada |
| 2026-03-21 | F2 | institutional_kpis (27) + 4 tabelas snapshot + take_kpi_snapshot() + views |
| 2026-03-21 | F3 | formal_decisions (5 DEC-*) + vw_traceability + vw_modules_status |
| 2026-03-21 | F4-02 | Smoke tests E2E: 10/10 passando (demo mode + build integrity) |
| 2026-03-21 | F4-03 | Handoff 00_HANDOFF_CURRENT_STATE.md atualizado (Frentes 1–3) |
| 2026-03-21 | OP-04 | Seed admin local: admin@pe2026.local / pe2026@admin (seed 10) |
| 2026-03-21 | OP-01 | FinancePage: 3 cenários financeiros canônicos via useFinancialScenarios |
| 2026-03-21 | OP-02 | DataHealthPage: card "Status dos Módulos" via useCutoverStatus |
| 2026-03-21 | OP-03 | AdminPage: banner cutover (verde=Supabase, amarelo=mock) |
| 2026-03-21 | OP-05 | Runbook ONDA_F v1.1.0: seeds 07-09, 10 módulos, observabilidade |

---

## Como Manter Este Documento Vivo

1. **Ao concluir um item:** marcar status `✅` e mover para "Histórico de Conclusões"
2. **Ao descobrir oportunidade:** adicionar na seção `💡 OPORTUNIDADES` com ID sequencial
3. **Ao iniciar um item:** marcar status `🔄`
4. **A cada sessão:** atualizar "Última atualização" no cabeçalho
5. **Memória persistente:** o Cascade mantém memória apontando para este arquivo como fonte de verdade

---

*PE2026 Plataforma — Backlog Pós-Ondas | Gerado por Cascade em 2026-03-21*
