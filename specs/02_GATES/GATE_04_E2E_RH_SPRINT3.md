# GATE — Sprint 3 — E2E RH + Hardening

> **Localização atual:** `specs/02_GATES/GATE_04_E2E_RH_SPRINT3.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Projeto:** PE_2026 — Módulo Planejamento  
**Feature:** E2E RH + Hardening + Preparação Replicação  
**Specs relacionadas:**
- [SPEC_01_STRATEGIC_PACK.md](../01_SPECS/SPEC_01_STRATEGIC_PACK.md)
- [SPEC_02_PLANNING_MODULE.md](../01_SPECS/SPEC_02_PLANNING_MODULE.md)

**TODO:** [TODO_05_E2E_RH_SPRINT3.md](../03_TODOS/TODO_05_E2E_RH_SPRINT3.md)  
**QA Report:** [QA_05_E2E_RH_SPRINT3.md](../04_REPORTS/QA_05_E2E_RH_SPRINT3.md)  
**Última revisão:** 06/02/2026 11:00  
**Revisor:** Cascade (Auditor de Implementação)

---

## 0) Objetivo do Gate

Este Gate valida:
1. Fluxo E2E completo para área RH (Strategic Pack → Gerar Plano → Gerenciar)
2. Hardening do modelo AreaPlan com container adequado
3. Idempotência robusta por (areaSlug, year, packId)
4. Estrutura genérica para replicação (mock Marketing funcional)

---

## 1) Checklist — Fluxo E2E RH

### A) Strategic Pack → Gerar Plano
| Item | Status | Evidência |
|------|--------|-----------|
| "Gerar Plano" cria AreaPlan container | ✅ | `getOrCreatePlanForPack()` |
| Ações vinculadas ao plan_id correto | ✅ | `createPlanAction({ plan_id: plan.id })` |
| Mensagem "X ações criadas" | ✅ | `GeneratePlanButton.tsx` |
| Link "Gerenciar Plano" com areaSlug e packId | ✅ | `/planning/actions/manage?areaSlug=X&packId=Y` |

### B) Gerenciar Plano com Filtros
| Item | Status | Evidência |
|------|--------|-----------|
| Query param `?packId=` aceito | ✅ | `ActionsManagePage.tsx` |
| Ações filtradas por pack_id | ✅ | `useActionsByPackId()` |
| Badge "Pack: X..." visível | ✅ | `AreaPlansListPage.tsx` |
| Botão limpar filtro funciona | ✅ | Remove packId da URL |

### C) Dashboard com Atalhos
| Item | Status | Evidência |
|------|--------|-----------|
| Atalho "Pacote Estratégico" | ✅ | Quick links |
| Atalho "Gerenciar Planos" com areaSlug | ✅ | Quick links |

---

## 2) Checklist — Hardening

### A) AreaPlan Container
| Item | Status | Evidência |
|------|--------|-----------|
| Campo `pack_id` em AreaPlan type | ✅ | `types.ts` |
| Campo `pack_id` em mockStore.plans | ✅ | `mockData.ts` |
| API `getOrCreatePlanForPack` | ✅ | `api-mock.ts` |
| Hook `useGetOrCreatePlanForPack` | ✅ | `hooks.ts` |

### B) Idempotência
| Item | Status | Evidência |
|------|--------|-----------|
| Busca plano por (area_id, year, pack_id) | ✅ | `getOrCreatePlanForPack()` |
| Verifica ações existentes antes de criar | ✅ | `fetchActionsByPackId()` |
| 2ª tentativa mostra "Plano já existe" | ✅ | `GeneratePlanButton.tsx` |

---

## 3) Checklist — Preparação Replicação

| Item | Status | Evidência |
|------|--------|-----------|
| Área Marketing em mockStore | ✅ | `slug: "marketing"` |
| `/planning` lista Marketing | ✅ | AreaSelector |
| `/planning/marketing/dashboard` carrega | ✅ | Rotas genéricas |
| Filtro `?areaSlug=marketing` funciona | ✅ | Sem hardcode |
| Estrutura aceita qualquer areaSlug | ✅ | Código genérico |

---

## 4) Build e Testes

| Item | Status |
|------|--------|
| `npm run build` | ✅ Exit code 0 (6.18s) |
| Lint | ✅ Sem erros |
| Fluxo E2E testado | ✅ |
| Idempotência testada | ✅ |
| Mock Marketing testado | ✅ |

---

## 5) Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/features/area-plans/types.ts` | +1 campo `pack_id` |
| `src/features/area-plans/api-mock.ts` | +2 funções API |
| `src/features/area-plans/hooks.ts` | +2 hooks |
| `src/features/area-plans/utils/mockData.ts` | `pack_id` nos plans |
| `src/features/area-plans/pages/AreaPlansListPage.tsx` | Filtro packId + UI |
| `src/features/strategic-pack/components/GeneratePlanButton.tsx` | Hardening completo |
| `src/features/strategic-pack/pages/StrategicPackPage.tsx` | Props |
| `src/features/planning/pages/actions/ActionsManagePage.tsx` | packId param |

---

## 6) Idempotência — Resumo

A idempotência do fluxo "Gerar Plano" foi reforçada:

```
1. Buscar AreaPlan por (areaSlug → area_id, year, pack_id)
2. Se não existe → criar AreaPlan com título "Plano {área} {ano} - Strategic Pack"
3. Verificar ações existentes por pack_id
4. Se existem → mostrar "Plano já existe com X ações"
5. Se não existem → criar ações e vincular ao plan_id
```

Isso garante que múltiplas chamadas a "Gerar Plano" não duplicam dados.

---

## 7) Resultado do Gate

| Critério | Status |
|----------|--------|
| Fluxo E2E RH | ✅ PASSA |
| Hardening AreaPlan | ✅ PASSA |
| Idempotência | ✅ PASSA |
| Mock Marketing | ✅ PASSA |
| Build sem erros | ✅ PASSA |

### Decisão Final

**✅ GATE APROVADO** — Sprint 3 E2E RH + Hardening concluído.

---

## 8) Próximos Passos (Sprint 4+)

- Implementar UI completa para Marketing
- Criar wizard de novo plano com área pré-selecionada
- Adicionar relatórios por área/pack
- Expandir para demais áreas (Operações, TI, Financeiro)

