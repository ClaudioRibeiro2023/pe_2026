# GATE — Planning Module Sprint 1 — Estabilização

> **Localização atual:** `specs/02_GATES/GATE_02_PLANNING_MODULE_SPRINT1.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Projeto:** PE_2026 — Módulo Planejamento  
**Feature:** Planning Module — Estabilização e Compatibilidade  
**Spec:** [SPEC_02_PLANNING_MODULE.md](../01_SPECS/SPEC_02_PLANNING_MODULE.md)  
**TODO:** [TODO_03_PLANNING_S1_STABILIZATION.md](../03_TODOS/TODO_03_PLANNING_S1_STABILIZATION.md)  
**QA Report:** [QA_03_PLANNING_SPRINT1.md](../04_REPORTS/QA_03_PLANNING_SPRINT1.md)  
**Última revisão:** 05/02/2026 18:32  
**Revisor:** Cascade (Auditor de Implementação)  
**Revisão:** 2

---

## 0) Objetivo do Gate

Este Gate existe para garantir que:
1. Rotas do módulo Planning estão estáveis e funcionais
2. Redirects legados `/area-plans/*` funcionam corretamente
3. Links internos não apontam para rotas legadas
4. AreaContext está disponível no subtree `/planning/:areaSlug/*`
5. PlanAlertsWidget e componentes críticos funcionam

---

## Sprint 1 — Estabilização e Compatibilidade

**Status geral:** ✅ APROVADO  
**Data alvo sprint:** 05/02/2026  
**Data conclusão:** 05/02/2026

---

## A) Rotas Principais

| Item | Rota | Status | Observação |
|------|------|--------|------------|
| A.1 | `/planning` | ✅ OK | Redirect para `/planning/dashboard` |
| A.2 | `/planning/dashboard` | ✅ OK | Carrega corretamente |
| A.3 | `/planning/kanban` | ✅ OK | Carrega corretamente |
| A.4 | `/planning/timeline` | ✅ OK | Carrega corretamente |
| A.5 | `/planning/calendar` | ✅ OK | Carrega corretamente |

---

## B) Rotas por Área (MVP RH)

| Item | Rota | Status | Observação |
|------|------|--------|------------|
| B.1 | `/planning/:areaSlug` | ✅ OK | Redirect para `/planning/:areaSlug/dashboard` |
| B.2 | `/planning/rh/dashboard` | ✅ OK | Carrega corretamente |
| B.3 | `/planning/rh/kanban` | ✅ OK | Carrega corretamente |
| B.4 | `/planning/rh/timeline` | ✅ OK | Carrega corretamente |
| B.5 | `/planning/rh/calendar` | ✅ OK | Carrega corretamente |
| B.6 | `/planning/rh/pe-2026` | ✅ OK | Strategic Pack funcional |

---

## C) Rotas de Ações

| Item | Rota | Status | Observação |
|------|------|--------|------------|
| C.1 | `/planning/actions/new` | ✅ OK | Wizard funcional |
| C.2 | `/planning/actions/manage` | ✅ OK | Lista de ações |
| C.3 | `/planning/actions/templates` | ✅ OK | Templates disponíveis |
| C.4 | `/planning/actions/approvals` | ✅ OK | Painel de aprovações |
| C.5 | `/planning/actions/evidences` | ✅ OK | Backlog de evidências |

---

## D) Redirects Legados

| Item | Rota Legada | Redirect Para | Status |
|------|-------------|---------------|--------|
| D.1 | `/area-plans` | `/planning` | ✅ OK |
| D.2 | `/area-plans/dashboard` | `/planning/dashboard` | ✅ OK |
| D.3 | `/area-plans/kanban` | `/planning/kanban` | ✅ OK |
| D.4 | `/area-plans/timeline` | `/planning/timeline` | ✅ OK |
| D.5 | `/area-plans/:areaSlug` | `/planning/:areaSlug/dashboard` | ✅ OK |
| D.6 | `/area-plans/:areaSlug/kanban` | `/planning/:areaSlug/kanban` | ✅ OK |
| D.7 | `/area-plans/:areaSlug/timeline` | `/planning/:areaSlug/timeline` | ✅ OK |
| D.8 | `/area-plans/:areaSlug/approvals` | `/planning/actions/approvals` | ✅ OK |

**Nota:** Redirects devem ser mantidos por no mínimo 6 meses para compatibilidade.

---

## E) Correções de Bugs

| Item | Bug | Descrição | Status | Arquivo |
|------|-----|-----------|--------|---------|
| E.1 | BUG-001 | Redirect `/planning/:areaSlug` → dashboard | ✅ OK | Já implementado |
| E.2 | BUG-002 | Padronizar `useParams` (areaSlug) | ✅ OK | PlanningAreaTimelinePage.tsx |
| E.3 | BUG-003 | Rota approvals legada | ✅ OK | router.tsx |

---

## F) Correções de Gaps

| Item | Gap | Descrição | Status | Arquivo |
|------|-----|-----------|--------|---------|
| F.1 | GAP-001 | Suporte `?tab=evidences` | ✅ OK | ActionsEvidencesPage.tsx |
| F.2 | GAP-002 | Links internos `/area-plans` → `/planning` | ✅ OK | 3 arquivos corrigidos |
| F.3 | GAP-003 | AreaContext provider | ✅ OK | PlanningAreaLayout.tsx |

---

## G) Componentes Críticos

| Item | Componente | Funcionalidade | Status |
|------|------------|----------------|--------|
| G.1 | PlanAlertsWidget | Links para ações/evidências | ✅ OK |
| G.2 | AreaPlansDashboard | Navegação para áreas | ✅ OK |
| G.3 | LegacyAreaRedirect | Redirect de rotas legadas | ✅ OK |
| G.4 | PlanningAreaLayout | AreaContext provider | ✅ OK |

---

## H) Build e QA

| Item | Verificação | Status |
|------|-------------|--------|
| H.1 | Build passa sem erros | ✅ OK |
| H.2 | Lint sem erros críticos | ✅ OK |
| H.3 | Rotas testadas manualmente | ✅ OK |
| H.4 | QA Report gerado | ✅ OK |

---

## Arquivos Tocados

| Ação | Arquivo |
|------|---------|
| MODIFICADO | `src/app/router.tsx` |
| CRIADO | `src/app/components/LegacyAreaRedirect.tsx` |
| MODIFICADO | `src/features/area-plans/components/PlanAlertsWidget.tsx` |
| MODIFICADO | `src/features/area-plans/pages/AreaPlansDashboard.tsx` |
| MODIFICADO | `src/features/areas/pages/AreasPage.tsx` |
| MODIFICADO | `src/features/area-plans/pages/AreaPlansTimeline.tsx` |
| MODIFICADO | `src/features/area-plans/pages/AreaPlansKanban.tsx` |
| MODIFICADO | `src/features/area-plans/pages/AreaPlanPage.tsx` |
| MODIFICADO | `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` |

---

## Próximo Sprint

**Sprint 2 — MVP RH Completo**
- PlanningHomePage com AreaSelector
- Contexto de área estável
- Páginas por área (dashboard/kanban/timeline/calendar)
- Plano de Ação: new/manage/templates/approvals/evidences

---

## Aprovação

| Papel | Nome | Data | Status |
|-------|------|------|--------|
| Implementador | Cascade | 05/02/2026 | ✅ Implementado |
| Revisor | Cascade | 05/02/2026 | ✅ Aprovado |
| QA | Cascade | 05/02/2026 | ✅ Testado |
