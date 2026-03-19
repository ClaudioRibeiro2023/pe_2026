# TODO — Planning Module Sprint 1 — Estabilização e Compatibilidade

> **Localização atual:** `specs/03_TODOS/TODO_03_PLANNING_S1_STABILIZATION.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Data:** 05/02/2026  
**Status:** ✅ Concluído  
**Responsável:** Cascade  
**Atualizado:** 05/02/2026 18:32 (rev 2)  
**Spec:** [SPEC_02_PLANNING_MODULE.md](../01_SPECS/SPEC_02_PLANNING_MODULE.md)  
**AS-IS:** `docs/as_is/PLANNING_MODULE_AS_IS.md`

---

## Objetivo do Sprint 1

Estabilizar rotas, redirects e compatibilidade legado (`/area-plans` → `/planning`), garantindo que:
1. Rotas legadas redirecionam corretamente
2. Links internos não apontam para `/area-plans` (exceto redirect)
3. Parâmetros de rota padronizados (`areaSlug` vs `slug`)
4. `?tab=evidences` funciona corretamente
5. `PlanAlertsWidget` e links de evidências/aprovações continuam funcionando

---

## Tarefas

### BUG-001: Redirect `/planning/:areaSlug` → `/planning/:areaSlug/dashboard` ✅
**Arquivos:**
- `src/app/router.tsx` (linha ~647)

**Problema:** Redirect já existe via `<Route index element={<Navigate to="dashboard" replace />} />`

**Critério de aceite:**
- [x] Acessar `/planning/rh` redireciona para `/planning/rh/dashboard`

**Status:** ✅ Já implementado corretamente

---

### BUG-002: Padronizar `useParams` (`slug` vs `areaSlug`) em timeline ✅
**Arquivos:**
- `src/features/area-plans/pages/AreaPlansTimeline.tsx`
- `src/features/planning/pages/area/PlanningAreaTimelinePage.tsx`

**Problema:** Alguns componentes usam `slug` em vez de `areaSlug` no `useParams`

**Critério de aceite:**
- [x] Todos os componentes usam `areaSlug` consistentemente
- [x] Timeline funciona corretamente em `/planning/:areaSlug/timeline`

**Status:** ✅ Verificado — ambos arquivos já usam `areaSlug` corretamente

**Evidência:** `AreaPlansTimeline.tsx:21` e `PlanningAreaTimelinePage.tsx:8` usam `useParams<{ areaSlug: string }>()`

---

### BUG-003: Rota `/area-plans/:areaSlug/approvals` sem componente ✅
**Arquivos:**
- `src/app/router.tsx`

**Problema:** A rota legada `/area-plans/:areaSlug/approvals` existe mas precisa redirecionar para `/planning/actions/approvals`

**Critério de aceite:**
- [x] `/area-plans/rh/approvals` redireciona para `/planning/actions/approvals`
- [x] Componente `AreaPlanApprovalsPage` continua funcionando

**Status:** ✅ Implementado

**Evidência:** `router.tsx:504` — `<Route path="/area-plans/:areaSlug/approvals" element={<Navigate to="/planning/actions/approvals" replace />} />`

---

### GAP-001: Suportar `?tab=evidences` e abrir backlog corretamente ✅
**Arquivos:**
- `src/features/area-plans/pages/AreaPlansListPage.tsx`
- `src/features/planning/pages/actions/ActionsEvidencesPage.tsx`

**Problema:** `?tab=evidences` não persiste ou não abre a aba correta

**Critério de aceite:**
- [x] Acessar `/planning/actions/evidences?tab=pending` filtra corretamente
- [x] `PlanAlertsWidget` abre o backlog correto

**Status:** ✅ Implementado

**Evidência:** `ActionsEvidencesPage.tsx:14-29` — adicionado `useSearchParams()` e lógica para `?tab=pending`

---

### GAP-002: Corrigir links internos `/area-plans` → `/planning` ✅
**Arquivos:**
- `src/features/area-plans/components/PlanAlertsWidget.tsx`
- `src/features/area-plans/pages/*.tsx` (verificar navigate/Link)
- `src/shared/config/navigation.ts`

**Problema:** Links internos ainda apontam para `/area-plans/*`

**Critério de aceite:**
- [x] Todos os `navigate('/area-plans/...')` alterados para `/planning/...`
- [x] Todos os `<Link to="/area-plans/...">` alterados para `/planning/...`
- [x] Navegação interna não usa rotas legadas

**Status:** ✅ Implementado

**Evidência:** Arquivos corrigidos:
- `PlanAlertsWidget.tsx` — 3 links
- `AreaPlansDashboard.tsx` — 5 links
- `AreasPage.tsx` — 1 link
- `AreaPlansTimeline.tsx` — 1 link
- `AreaPlansKanban.tsx` — 1 link
- `AreaPlanPage.tsx` — 2 links

---

### GAP-003: Garantir `AreaContext` provider no subtree `/planning/:areaSlug/*` ✅
**Arquivos:**
- `src/features/planning/layouts/PlanningAreaLayout.tsx`
- `src/features/planning/contexts/AreaContext.tsx`

**Problema:** AreaContext pode não estar integrado globalmente no subtree

**Critério de aceite:**
- [x] `PlanningAreaLayout` fornece `AreaContext` para todas as rotas filhas
- [x] Componentes conseguem acessar `useAreaContext()` sem erros

**Status:** ✅ Já implementado corretamente

**Evidência:** `PlanningAreaLayout.tsx:18-23` — `<AreaProvider>` envolve `<Outlet />`

---

### REDIRECT-001: Adicionar redirects legados `/area-plans/*` → `/planning/*` ✅
**Arquivos:**
- `src/app/router.tsx`
- `src/app/components/LegacyAreaRedirect.tsx` (criado)

**Problema:** Rotas legadas `/area-plans/*` devem redirecionar para equivalentes em `/planning/*`

**Mapeamento:**
| Legado | Novo |
|--------|------|
| `/area-plans` | `/planning` |
| `/area-plans/:areaSlug` | `/planning/:areaSlug/dashboard` |
| `/area-plans/:areaSlug/kanban` | `/planning/:areaSlug/kanban` |
| `/area-plans/:areaSlug/timeline` | `/planning/:areaSlug/timeline` |
| `/area-plans/:areaSlug/approvals` | `/planning/actions/approvals` |

**Critério de aceite:**
- [x] Todas as rotas legadas redirecionam para equivalentes
- [x] Redirects usam `replace` para não poluir histórico

**Status:** ✅ Implementado

**Evidência:** 
- `router.tsx:497-504` — rotas legadas com `<Navigate replace />`
- `LegacyAreaRedirect.tsx` — componente para redirect dinâmico

---

## Arquivos a Modificar

| Ação | Arquivo |
|------|---------|
| MODIFICAR | `src/app/router.tsx` |
| VERIFICAR | `src/features/area-plans/pages/AreaPlansTimeline.tsx` |
| VERIFICAR | `src/features/planning/pages/area/PlanningAreaTimelinePage.tsx` |
| VERIFICAR | `src/features/area-plans/components/PlanAlertsWidget.tsx` |
| VERIFICAR | `src/features/planning/layouts/PlanningAreaLayout.tsx` |

---

## Ordem de Execução

1. ✅ BUG-001 (já implementado)
2. ✅ REDIRECT-001 (adicionar redirects legados)
3. ✅ BUG-002 (padronizar useParams)
4. ✅ BUG-003 (resolver rota approvals)
5. ✅ GAP-002 (corrigir links internos)
6. ✅ GAP-003 (verificar AreaContext)
7. ✅ GAP-001 (suportar tab=evidences)
8. ✅ QA e validação final

---

## Artefatos Finais

| Artefato | Path |
|----------|------|
| QA Report | `specs/04_REPORTS/QA_03_PLANNING_SPRINT1.md` |
| Gate | `specs/02_GATES/GATE_02_PLANNING_MODULE_SPRINT1.md` |
