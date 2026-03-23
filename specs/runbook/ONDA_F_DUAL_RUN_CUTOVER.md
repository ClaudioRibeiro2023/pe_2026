# Runbook — Onda F: Dual-Run, Cutover e Rollback PE2026

**Versão:** 1.1.0  
**Data:** 2026-03-21  
**Responsável técnico:** Cascade / Guardiã PE  
**Dependências:** Ondas A–F + Frentes 1–3 aplicadas no Supabase

> **Estado atual (2026-03-21):** ✅ Cutover completo — 10/10 módulos em `source=supabase`

---

## 1. Visão Geral

A Onda F implementa o padrão de **dual-run** para transição segura de mock → Supabase por módulo. Cada módulo tem um feature flag individual. O cutover pode ser feito módulo a módulo, validado, e revertido a qualquer momento.

```
MOCK → [validar] → HABILITAR FLAG → [monitorar] → CUTOVER COMPLETO
                                         ↓
                                    [ROLLBACK se falha]
```

---

## 2. Pré-requisitos

Antes de qualquer cutover, verificar:

```bash
# 1. Migrations aplicadas (em ordem)
supabase db status

# 2. Seeds canônicos executados (obrigatórios)
#    05 — Base canônica (pilares, OKRs, KRs, INITs, riscos, cenários)
#    06 — Verificador de integridade (15 asserções)
#    07 — Goals + Indicators canônicos
#    08 — Action Plans canônicos
#    09 — Institutional KPIs (27 KPIs A1-A4, P1-P5, C1-C7)
#    10 — Usuário admin local (só em desenvolvimento)
Get-Content supabase/seeds/05_canonical_pe2026_seed.sql | docker exec -i supabase_db_PE_2026 psql -U postgres -d postgres
Get-Content supabase/seeds/06_integrity_check.sql       | docker exec -i supabase_db_PE_2026 psql -U postgres -d postgres
Get-Content supabase/seeds/07_goals_indicators_seed.sql | docker exec -i supabase_db_PE_2026 psql -U postgres -d postgres
Get-Content supabase/seeds/08_action_plans_seed.sql     | docker exec -i supabase_db_PE_2026 psql -U postgres -d postgres
Get-Content supabase/seeds/09_institutional_kpis_seed.sql | docker exec -i supabase_db_PE_2026 psql -U postgres -d postgres

# 3. Validador de integridade
Get-Content supabase/seeds/06_integrity_check.sql | docker exec -i supabase_db_PE_2026 psql -U postgres -d postgres
```

---

## 3. Fluxo de Cutover por Módulo

### 3.1 Validação pré-cutover

Executar no Supabase SQL Editor:

```sql
-- Verificar integridade dos dados antes de habilitar o módulo
SELECT * FROM public.validate_cutover('area-plans');
```

Todos os checks devem retornar `OK`. Se qualquer um retornar `FALHA`, re-executar seeds.

### 3.2 Habilitar módulo (mock → supabase)

```sql
-- Habilitar um módulo específico
-- Módulos originais (Ondas A-F)
SELECT public.set_feature_flag('area-plans',   true, 'supabase', 'Claudio Ribeiro');
SELECT public.set_feature_flag('scoreboard',   true, 'supabase', 'Claudio Ribeiro');
SELECT public.set_feature_flag('initiatives',  true, 'supabase', 'Claudio Ribeiro');
SELECT public.set_feature_flag('okrs',         true, 'supabase', 'Claudio Ribeiro');
SELECT public.set_feature_flag('finance',      true, 'supabase', 'Claudio Ribeiro');
SELECT public.set_feature_flag('strategy',     true, 'supabase', 'Claudio Ribeiro');
-- Módulos Frentes 1-3
SELECT public.set_feature_flag('goals',        true, 'supabase', 'Claudio Ribeiro');
SELECT public.set_feature_flag('indicators',   true, 'supabase', 'Claudio Ribeiro');
SELECT public.set_feature_flag('action-plans', true, 'supabase', 'Claudio Ribeiro');
SELECT public.set_feature_flag('governance',   true, 'supabase', 'Claudio Ribeiro');
```

### 3.3 Monitorar status

```sql
-- Status em tempo real de todos os módulos
SELECT * FROM public.v_cutover_status;

-- Log de ações recentes
SELECT * FROM public.cutover_log ORDER BY created_at DESC LIMIT 20;
```

---

## 4. Ordem Recomendada de Cutover

Fazer módulo a módulo, validando a UI antes do próximo:

| Passo | Módulo         | Validação UI                                        |
|-------|----------------|-----------------------------------------------------|
| 1     | `scoreboard`   | Placar estratégico exibe guardrails A1-A4 reais     |
| 2     | `initiatives`  | Carteira exibe 22 INITs (INIT-001..022)             |
| 3     | `okrs`         | OKRs exibem 5 objetivos + 25 KRs reais              |
| 4     | `area-plans`   | Planos de área com dados setoriais reais            |
| 5     | `strategy`     | Overview e riscos RSK-2026-* carregam               |
| 6     | `goals`        | 6 metas canônicas PE2026 visíveis                   |
| 7     | `finance`      | Cenários BASE R$11.44M / OTIMISTA / PESSIMISTA      |
| 8     | `indicators`   | 8 indicadores setoriais com categorias reais        |
| 9     | `action-plans` | 7 planos canônicos (War Room, Pareto, DRE...)       |
| 10    | `governance`   | Decisões DEC-2026-* e cadências WBR/MBR/QBR         |

---

## 5. Rollback

### 5.1 Rollback de módulo individual

```sql
SELECT public.rollback_module('area-plans', 'Claudio Ribeiro', 'dados inconsistentes detectados');
```

### 5.2 Rollback global de emergência

```sql
-- ATENÇÃO: reverte TODOS os módulos para mock
SELECT public.rollback_all('Claudio Ribeiro', 'instabilidade detectada em produção');
```

### 5.3 Verificar após rollback

```sql
SELECT module, enabled, source, last_action, last_status FROM public.v_cutover_status;
-- Todos devem exibir: enabled=false, source=mock, last_action=ROLLBACK
```

---

## 6. Configuração no Frontend

O frontend usa `supabaseClient.ts` para determinar a fonte. Após habilitar os feature flags no banco, o cliente já usa Supabase automaticamente via `resolveAreaPlansSource()`.

Para ambientes onde variáveis de ambiente não estão configuradas:

```env
# .env.local (desenvolvimento)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

Em produção sem variáveis configuradas, `assertSupabaseAvailableForProd()` lança erro explícito — nunca fallback silencioso.

---

## 7. Checklist de Cutover Completo

```
[ ] Seeds 05-09 executados sem erros
[ ] 06_integrity_check.sql: 15/15 asserções OK
[ ] validate_cutover() retornou OK para todos os checks
[ ] 10 módulos habilitados (set_feature_flag x10)
[ ] v_cutover_status / vw_modules_status: todos enabled=true
[ ] cutover_log sem status=FAILED
[ ] UI em produção renderizando dados canônicos
[ ] Guardrails A1-A4 exibindo valores reais
[ ] 22 INITs visíveis na carteira
[ ] Score % PE2026 calculado pelo engine real
[ ] FinancePage: 3 cenários (BASE/OTIMISTA/PESSIMISTA) visíveis
[ ] GoalsPage: 6 metas canônicas PE2026
[ ] ActionPlansPage: 7 planos canônicos
[ ] GovernancePage: 5 decisões DEC-2026-*
[ ] AdminPage: banner mostra 10/10 módulos em Supabase
[ ] DataHealthPage: status dos módulos todos verdes
```

---

## 8. Tabelas e Views de Observabilidade

| Objeto                    | Uso                                                     |
|---------------------------|----------------------------------------------------------|
| `feature_flags`           | Estado atual de cada módulo (enabled, source)           |
| `cutover_log`             | Histórico de ações SET/ROLLBACK com responsável         |
| `v_cutover_status`        | View de status consolidado por módulo                   |
| `vw_modules_status`       | View simplificada (module, enabled, source, updated_at) |
| `institutional_kpis`      | 27 KPIs canônicos (A1-A4, P1-P5, C1-C7)                |
| `formal_decisions`        | 5 decisões DEC-2026-* auditáveis                        |
| `vw_traceability`         | Rastreabilidade Pilar → OKR → KR → INIT                 |
| `kpi_snapshots`           | Histórico de snapshots WBR/MBR/QBR                      |

---

## 9. Contatos e Escalada

| Situação                    | Ação                                    |
|-----------------------------|------------------------------------------|
| Dados inconsistentes        | `rollback_module()` + re-seed 05-09 + retry    |
| Erro de RLS / permissão     | Verificar políticas na Onda B migration  |
| Supabase inacessível        | `assertSupabaseAvailableForProd` captura |
| Rollback não funcionou      | `rollback_all()` + contato Cascade       |
| Usuário admin sem acesso    | Re-executar seed `10_local_admin_seed.sql` |
