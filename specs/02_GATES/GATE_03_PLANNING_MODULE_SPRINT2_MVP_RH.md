# GATE — Planning Module Sprint 2 — MVP RH Área-first

> **Localização atual:** `specs/02_GATES/GATE_03_PLANNING_MODULE_SPRINT2_MVP_RH.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Projeto:** PE_2026 — Módulo Planejamento  
**Feature:** Planning Module — MVP RH Área-first  
**Spec:** [SPEC_02_PLANNING_MODULE.md](../01_SPECS/SPEC_02_PLANNING_MODULE.md)  
**TODO:** [TODO_04_PLANNING_SPRINT2_MVP_RH.md](../03_TODOS/TODO_04_PLANNING_SPRINT2_MVP_RH.md)  
**QA Report:** [QA_04_PLANNING_SPRINT2_MVP_RH.md](../04_REPORTS/QA_04_PLANNING_SPRINT2_MVP_RH.md)  
**Última revisão:** 06/02/2026 10:35  
**Revisor:** Cascade (Auditor de Implementação)

---

## 0) Objetivo do Gate

Este Gate existe para garantir que:
1. `/planning` apresenta home com seleção de área (área-first)
2. Persistência da área selecionada funciona (localStorage)
3. Dashboard da área tem atalhos úteis (quick links)
4. Páginas actions suportam filtro `?areaSlug=`
5. Navegação contextual mantém contexto de área

---

## 1) Checklist de Funcionalidades

### A) Área-first Entry
| Item | Status | Evidência |
|------|--------|-----------|
| `/planning` mostra AreaSelector | ✅ | `PlanningHomePage.tsx` |
| Cards de áreas com cores | ✅ | `AreaSelector.tsx` |
| RH destacado como MVP | ✅ | Badge "MVP" no card |
| "Continuar em [Área]" se lastAreaSlug existe | ✅ | `useLastArea` hook |
| Opção "Trocar área" | ✅ | Botão limpa localStorage |

### B) Persistência localStorage
| Item | Status | Evidência |
|------|--------|-----------|
| Hook `useLastArea` criado | ✅ | `hooks/useLastArea.ts` |
| Salva `planning_lastAreaSlug` | ✅ | localStorage |
| Sincroniza entre abas | ✅ | `storage` event listener |
| Dashboard salva área ao entrar | ✅ | `useEffect` em `PlanningAreaDashboardPage` |

### C) Dashboard com Quick Links
| Item | Status | Evidência |
|------|--------|-----------|
| Quick links no topo | ✅ | `PlanningAreaDashboardPage.tsx` |
| Kanban da área | ✅ | `/planning/:areaSlug/kanban` |
| Timeline da área | ✅ | `/planning/:areaSlug/timeline` |
| Gerenciar Planos (filtrado) | ✅ | `/planning/actions/manage?areaSlug=` |
| Evidências (filtrado) | ✅ | `/planning/actions/evidences?areaSlug=` |
| Aprovações (filtrado) | ✅ | `/planning/actions/approvals?areaSlug=` |
| Pacote Estratégico | ✅ | `/planning/:areaSlug/pe-2026` |

### D) Filtro por Área nas Páginas Actions
| Item | Status | Evidência |
|------|--------|-----------|
| `/planning/actions/manage?areaSlug=rh` filtra | ✅ | `ActionsManagePage.tsx` |
| `/planning/actions/evidences?areaSlug=rh` filtra | ✅ | `ActionsEvidencesPage.tsx` |
| `/planning/actions/approvals?areaSlug=rh` filtra | ✅ | `ActionsApprovalsPage.tsx` |
| Sem param = comportamento global | ✅ | Filtro condicional |

### E) Rotas Específicas por Área
| Item | Status | Evidência |
|------|--------|-----------|
| `/planning/rh/dashboard` | ✅ | Route + Layout |
| `/planning/rh/kanban` | ✅ | Route |
| `/planning/rh/timeline` | ✅ | Route |
| `/planning/rh/pe-2026` | ✅ | Route |

---

## 2) Build e Testes

| Item | Status |
|------|--------|
| `npm run build` | ✅ Exit code 0 (11.85s) |
| Lint | ✅ Sem erros |
| Rotas testadas | ✅ 20+ rotas verificadas |
| Filtros testados | ✅ 6 combinações |
| localStorage testado | ✅ Persistência OK |

---

## 3) Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/features/planning/hooks/useLastArea.ts` | Hook para persistência de área |
| `src/features/planning/hooks/index.ts` | Exports do módulo hooks |
| `src/features/planning/components/AreaSelector.tsx` | Componente seletor de área |
| `src/features/planning/pages/PlanningHomePage.tsx` | Home do módulo Planning |

---

## 4) Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/app/router.tsx` | PlanningHomePage em `/planning` |
| `src/features/planning/components/index.ts` | Export AreaSelector |
| `src/features/planning/pages/actions/ActionsManagePage.tsx` | Filtro areaSlug |
| `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` | Filtro areaSlug |
| `src/features/planning/pages/actions/ActionsApprovalsPage.tsx` | Filtro areaSlug |
| `src/features/area-plans/pages/AreaPlansListPage.tsx` | Prop areaSlugFilter |
| `src/features/planning/pages/area/PlanningAreaDashboardPage.tsx` | Quick links + localStorage |

---

## 5) Resultado do Gate

| Critério | Status |
|----------|--------|
| Área-first entry | ✅ PASSA |
| Persistência localStorage | ✅ PASSA |
| Quick links no dashboard | ✅ PASSA |
| Filtro por área | ✅ PASSA |
| Build sem erros | ✅ PASSA |

### Decisão Final

**✅ GATE APROVADO** — Sprint 2 MVP RH concluído com sucesso.

---

## 6) Próximos Passos (Sprint 3+)

- Implementar wizard de criação de plano por área
- Adicionar calendário avançado
- Expandir para outras áreas além de RH
- Implementar templates por área
- Adicionar relatórios por área

