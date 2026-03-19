# TODO — Sprint 3 — E2E RH + Hardening

> **Localização atual:** `specs/03_TODOS/TODO_05_E2E_RH_SPRINT3.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Data:** 06/02/2026  
**Status:** ✅ Concluído  
**Atualizado:** 06/02/2026 11:00  
**Responsável:** Cascade  
**Specs relacionadas:**
- [SPEC_01_STRATEGIC_PACK.md](../01_SPECS/SPEC_01_STRATEGIC_PACK.md)
- [SPEC_02_PLANNING_MODULE.md](../01_SPECS/SPEC_02_PLANNING_MODULE.md)

---

## Objetivo do Sprint 3

Fechar o ciclo E2E para área RH e preparar modelo para replicação:

1. **E2E RH** — Link direto após "Gerar Plano", filtro packId, atalhos no dashboard
2. **Hardening** — AreaPlan container, idempotência robusta
3. **Replicação** — Mock 2ª área (marketing) para validar estrutura genérica

---

## Tarefas

### FEAT-001: Link após "Gerar Plano" em /planning/rh/pe-2026

**Arquivo:** `src/features/strategic-pack/components/GeneratePlanButton.tsx`

**Requisitos:**
- Após gerar plano, mostrar link para `/planning/actions/manage?areaSlug=X&packId=Y`
- Mostrar quantidade de ações criadas
- Se plano já existe, mostrar link direto para gerenciar

**Teste:**
1. Acessar `/planning/rh/pe-2026`
2. Clicar "Gerar Plano" (1ª vez)
3. Verificar mensagem "X ações criadas" + link "Gerenciar Plano"
4. Clicar "Gerar Plano" (2ª vez)
5. Verificar mensagem "Plano já existe" + link "Gerenciar Plano"

---

### FEAT-002: Filtro packId em /planning/actions/manage

**Arquivo:** `src/features/planning/pages/actions/ActionsManagePage.tsx`

**Requisitos:**
- Aceitar query param `?packId=`
- Filtrar ações por pack_id quando presente
- Mostrar badge indicando filtro ativo
- Botão para limpar filtro

**Teste:**
1. Acessar `/planning/actions/manage?areaSlug=rh&packId=pack-rh-2026`
2. Verificar que apenas ações do pack são exibidas
3. Verificar badge "Filtrado por Pack"
4. Clicar "Limpar filtro" → volta a mostrar todos

---

### FEAT-003: Atalhos no Dashboard da Área

**Arquivo:** `src/features/planning/pages/area/PlanningAreaDashboardPage.tsx`

**Requisitos:**
- Adicionar atalho "Criar novo plano" (navega para wizard com área pré-selecionada)
- Adicionar atalho "Strategic Pack" com indicador se existe pack ativo
- Se existir pack com ações geradas, mostrar "Gerenciar Plano do Pack"

**Teste:**
1. Acessar `/planning/rh/dashboard`
2. Verificar atalho "Criar novo plano"
3. Verificar atalho "Strategic Pack RH"
4. Se houver pack com ações, verificar atalho "Gerenciar Plano do Pack"

---

### FEAT-004: Hardening — AreaPlan Container

**Arquivos:**
- `src/features/strategic-pack/components/GeneratePlanButton.tsx`
- `src/features/area-plans/hooks.ts`
- `src/features/area-plans/api-mock.ts`

**Requisitos:**
- Antes de criar ações, verificar/criar AreaPlan container
- AreaPlan deve ser identificado por: `areaSlug + year + packId`
- Se AreaPlan já existe para essa combinação, reutilizar
- Ações são vinculadas ao `plan_id` do AreaPlan (não do pack)

**Lógica:**
```
1. Buscar AreaPlan por (area_id, year, pack_id)
2. Se não existe → criar AreaPlan com title "Plano {areaName} {year} - Pack"
3. Usar plan.id como plan_id das ações
4. Idempotência: verificar ações por (pack_id) E (plan_id)
```

**Teste:**
1. Gerar plano 1ª vez → AreaPlan criado
2. Verificar mockStore.plans tem novo plano com pack_id
3. Gerar plano 2ª vez → mesmo AreaPlan reutilizado
4. Ações vinculadas ao plan_id correto

---

### FEAT-005: Hook useGetOrCreatePlanForPack

**Arquivo:** `src/features/area-plans/hooks.ts`

**Requisitos:**
- Hook que busca ou cria AreaPlan para um pack
- Parâmetros: `areaSlug`, `year`, `packId`, `areaId`
- Retorna `plan_id` para uso no GeneratePlanButton

---

### FEAT-006: API getOrCreatePlanForPack

**Arquivo:** `src/features/area-plans/api-mock.ts`

**Requisitos:**
- Função que implementa lógica de buscar/criar AreaPlan
- Adicionar campo `pack_id` no AreaPlan type se necessário
- Garantir idempotência por (area_id, year, pack_id)

---

### FEAT-007: Mock 2ª Área (Marketing)

**Arquivos:**
- `src/features/area-plans/utils/mockData.ts`
- `src/features/strategic-pack/utils/mockData.ts` (se existir)

**Requisitos:**
- Adicionar área "marketing" com slug "marketing"
- Criar pack mock mínimo para marketing
- NÃO criar UI específica, apenas dados

**Teste:**
1. Acessar `/planning` → verificar que Marketing aparece na lista
2. Selecionar Marketing → `/planning/marketing/dashboard` carrega
3. Acessar `/planning/marketing/pe-2026` → pack mock carrega (ou erro tratado)
4. Filtros `?areaSlug=marketing` funcionam

---

### FEAT-008: Smoke Test Estrutura Genérica

**Teste manual:**
1. `/planning` → lista RH e Marketing
2. `/planning/rh/dashboard` → quick links funcionam
3. `/planning/marketing/dashboard` → quick links funcionam
4. `/planning/actions/manage?areaSlug=rh` → filtra RH
5. `/planning/actions/manage?areaSlug=marketing` → filtra Marketing
6. Estrutura não tem hardcode de "rh"

---

## Arquivos a Modificar

| Ação | Arquivo |
|------|---------|
| MODIFICAR | `src/features/strategic-pack/components/GeneratePlanButton.tsx` |
| MODIFICAR | `src/features/planning/pages/actions/ActionsManagePage.tsx` |
| MODIFICAR | `src/features/planning/pages/area/PlanningAreaDashboardPage.tsx` |
| MODIFICAR | `src/features/area-plans/hooks.ts` |
| MODIFICAR | `src/features/area-plans/api-mock.ts` |
| MODIFICAR | `src/features/area-plans/types.ts` |
| MODIFICAR | `src/features/area-plans/utils/mockData.ts` |

---

## Ordem de Execução

1. ✅ FEAT-006 (API getOrCreatePlanForPack)
2. ✅ FEAT-005 (Hook useGetOrCreatePlanForPack)
3. ✅ FEAT-004 (Hardening GeneratePlanButton)
4. ✅ FEAT-001 (Link após gerar)
5. ✅ FEAT-002 (Filtro packId)
6. ✅ FEAT-003 (Atalhos dashboard)
7. ✅ FEAT-007 (Mock Marketing - já existia)
8. ✅ FEAT-008 (Smoke test)
9. ✅ QA e validação final

---

## Artefatos Finais

| Artefato | Path |
|----------|------|
| QA Report | `specs/04_REPORTS/QA_05_E2E_RH_SPRINT3.md` |
| Gate | `specs/02_GATES/GATE_04_E2E_RH_SPRINT3.md` |

