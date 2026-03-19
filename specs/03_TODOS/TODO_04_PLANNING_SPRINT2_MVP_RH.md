# TODO — Planning Module Sprint 2 — MVP RH Área-first

> **Localização atual:** `specs/03_TODOS/TODO_04_PLANNING_SPRINT2_MVP_RH.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Data:** 06/02/2026  
**Status:** ✅ Concluído  
**Atualizado:** 06/02/2026 10:35  
**Responsável:** Cascade  
**Spec:** [SPEC_02_PLANNING_MODULE.md](../01_SPECS/SPEC_02_PLANNING_MODULE.md)  
**Gate Sprint 1:** [GATE_02_PLANNING_MODULE_SPRINT1.md](../02_GATES/GATE_02_PLANNING_MODULE_SPRINT1.md)

---

## Objetivo do Sprint 2

Implementar o MVP RH com experiência "área-first":
1. `/planning` deve mostrar home com AreaSelector (RH no MVP)
2. Persistir área selecionada em localStorage
3. Navegação contextual por área com breadcrumbs
4. Dashboard da área com atalhos úteis
5. Páginas globais de ações com filtro `?areaSlug=`

---

## Tarefas

### FEAT-001: Criar componente AreaSelector
**Arquivos:**
- `src/features/planning/components/AreaSelector.tsx` (criar)
- `src/features/planning/components/index.ts` (exportar)

**Requisitos:**
- [x] Listar áreas disponíveis (usar `useAreas()`)
- [x] Mostrar área RH como destaque no MVP
- [x] Botão "Continuar em [Área]" se lastAreaSlug existir
- [x] Opção de trocar área
- [x] Cards visuais para cada área

**Como testar:**
```
1. Acessar /planning
2. Ver AreaSelector com cards de áreas
3. Verificar que RH está visível
```

---

### FEAT-002: Persistência localStorage (lastAreaSlug)
**Arquivos:**
- `src/features/planning/hooks/useLastArea.ts` (criar)
- `src/features/planning/hooks/index.ts` (criar/exportar)

**Requisitos:**
- [x] Hook `useLastArea()` que lê/escreve `planning_lastAreaSlug` no localStorage
- [x] Retorna `{ lastAreaSlug, setLastArea, clearLastArea }`

**Como testar:**
```
1. Selecionar área RH
2. Recarregar página
3. Ver que "Continuar em RH" aparece
```

---

### FEAT-003: PlanningHomePage com AreaSelector
**Arquivos:**
- `src/features/planning/pages/PlanningHomePage.tsx` (criar)
- `src/features/planning/pages/PlanningDashboardPage.tsx` (alterar para redirect)
- `src/app/router.tsx` (ajustar rota /planning)

**Requisitos:**
- [x] Nova página PlanningHomePage com:
  - Título "Planejamento"
  - Se lastAreaSlug existe: "Continuar em [Área]" + "Trocar área"
  - Se não: AreaSelector com cards
- [x] Ao selecionar área: navegar para `/planning/:areaSlug/dashboard`
- [x] Salvar área em localStorage

**Como testar:**
```
1. Acessar /planning
2. Ver home com seleção de área
3. Selecionar RH -> /planning/rh/dashboard
4. Voltar para /planning
5. Ver "Continuar em RH"
```

---

### FEAT-004: Filtro ?areaSlug nas páginas actions/manage
**Arquivos:**
- `src/features/planning/pages/actions/ActionsManagePage.tsx`

**Requisitos:**
- [x] Ler `?areaSlug=` da URL
- [x] Filtrar lista de planos pela área
- [x] Se não houver param, mostrar todos (comportamento atual)

**Como testar:**
```
1. Acessar /planning/actions/manage?areaSlug=rh
2. Ver apenas planos da área RH
3. Acessar /planning/actions/manage (sem param)
4. Ver todos os planos
```

---

### FEAT-005: Filtro ?areaSlug nas páginas actions/evidences
**Arquivos:**
- `src/features/planning/pages/actions/ActionsEvidencesPage.tsx`

**Requisitos:**
- [x] Ler `?areaSlug=` da URL
- [x] Filtrar evidências pela área
- [x] Se não houver param, mostrar todas (comportamento atual)

**Como testar:**
```
1. Acessar /planning/actions/evidences?areaSlug=rh
2. Ver apenas evidências da área RH
3. Acessar /planning/actions/evidences (sem param)
4. Ver todas as evidências
```

---

### FEAT-006: Filtro ?areaSlug nas páginas actions/approvals
**Arquivos:**
- `src/features/planning/pages/actions/ActionsApprovalsPage.tsx`

**Requisitos:**
- [x] Ler `?areaSlug=` da URL
- [x] Filtrar aprovações pela área
- [x] Se não houver param, mostrar todas (comportamento atual)

**Como testar:**
```
1. Acessar /planning/actions/approvals?areaSlug=rh
2. Ver apenas aprovações da área RH
3. Acessar /planning/actions/approvals (sem param)
4. Ver todas as aprovações
```

---

### FEAT-007: Dashboard da área com atalhos (área-first)
**Arquivos:**
- `src/features/planning/pages/area/PlanningAreaDashboardPage.tsx`

**Requisitos:**
- [x] Adicionar cards/atalhos para:
  - Kanban da área
  - Timeline da área
  - Plano de Ação (manage filtrado)
  - Evidências pendentes (atalho)
  - Aprovações (atalho)
- [x] Manter conteúdo existente (AreaPlanPage)

**Como testar:**
```
1. Acessar /planning/rh/dashboard
2. Ver cards de atalhos no topo
3. Clicar em cada atalho e verificar navegação
```

---

### FEAT-008: Garantir /planning/rh/pe-2026 acessível
**Arquivos:**
- Verificar `src/app/router.tsx`

**Requisitos:**
- [x] Rota `/planning/:areaSlug/pe-2026` existe e funciona
- [x] Página `PlanningAreaStrategicPackPage` renderiza corretamente

**Como testar:**
```
1. Acessar /planning/rh/pe-2026
2. Verificar que Strategic Pack da área RH carrega
```

---

## Arquivos a Criar/Modificar

| Ação | Arquivo |
|------|---------|
| CRIAR | `src/features/planning/components/AreaSelector.tsx` |
| CRIAR | `src/features/planning/hooks/useLastArea.ts` |
| CRIAR | `src/features/planning/hooks/index.ts` |
| CRIAR | `src/features/planning/pages/PlanningHomePage.tsx` |
| MODIFICAR | `src/features/planning/pages/PlanningDashboardPage.tsx` |
| MODIFICAR | `src/features/planning/pages/actions/ActionsManagePage.tsx` |
| MODIFICAR | `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` |
| MODIFICAR | `src/features/planning/pages/actions/ActionsApprovalsPage.tsx` |
| MODIFICAR | `src/features/planning/pages/area/PlanningAreaDashboardPage.tsx` |
| MODIFICAR | `src/app/router.tsx` |
| MODIFICAR | `src/features/planning/components/index.ts` |

---

## Ordem de Execução

1. ✅ FEAT-002 (hook useLastArea)
2. ✅ FEAT-001 (AreaSelector)
3. ✅ FEAT-003 (PlanningHomePage + router)
4. ✅ FEAT-004 (filtro manage)
5. ✅ FEAT-005 (filtro evidences)
6. ✅ FEAT-006 (filtro approvals)
7. ✅ FEAT-007 (dashboard atalhos)
8. ✅ FEAT-008 (verificar pe-2026)
9. ✅ QA e validação final

---

## Artefatos Finais

| Artefato | Path |
|----------|------|
| QA Report | `specs/04_REPORTS/QA_04_PLANNING_SPRINT2_MVP_RH.md` |
| Gate | `specs/02_GATES/GATE_03_PLANNING_MODULE_SPRINT2_MVP_RH.md` |

