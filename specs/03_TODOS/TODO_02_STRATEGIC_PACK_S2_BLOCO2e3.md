# TODO — Strategic Pack Sprint 2 — Blocos 2 e 3
## Vínculo com Ações + Gerar Plano de Ação

> **Localização atual:** `specs/03_TODOS/TODO_02_STRATEGIC_PACK_S2_BLOCO2e3.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Data:** 05/02/2026  
**Status:** ✅ Concluído  
**Responsável:** Cascade  
**Atualizado:** 05/02/2026 18:00

---

## Visão Geral

- **Bloco 2 (J):** Vincular ações ao Strategic Pack via campos `packId`, `programKey`, `objectiveKey`
- **Bloco 3 (K):** Botão "Gerar Plano de Ação" com idempotência

---

## Tarefas

### T1. Adicionar campos ao modelo de Action ✅
**Arquivos:**
- `src/features/area-plans/types.ts`
- `src/features/area-plans/schemas.ts`
- `src/features/area-plans/api-mock.ts`

**Critério de aceite:**
- [x] `PlanAction` tem campos: `pack_id`, `program_key`, `objective_key`
- [x] `CreatePlanActionData` e `UpdatePlanActionData` incluem campos
- [x] Schemas Zod atualizados
- [x] Mock API aceita os novos campos

---

### T2. API para buscar ações por pack/program/objective ✅
**Arquivos:**
- `src/features/area-plans/api.ts`
- `src/features/area-plans/api-mock.ts`
- `src/features/area-plans/hooks.ts`

**Critério de aceite:**
- [x] Função `fetchActionsByPackId(packId)` retorna ações vinculadas
- [x] Função `fetchActionsByProgramKey(packId, programKey)` retorna ações do programa
- [x] Função `fetchActionsByObjectiveKey(packId, objectiveKey)` retorna ações do objetivo
- [x] Hooks: `useActionsByProgramKey`, `useActionsByObjectiveKey`

---

### T3. Integrar listagem de ações nas Tabs do Strategic Pack ✅
**Arquivos:**
- `src/features/strategic-pack/components/ProgramCard.tsx`
- `src/features/strategic-pack/components/ObjectivesList.tsx`
- `src/features/strategic-pack/pages/StrategicPackPage.tsx`

**Critério de aceite:**
- [x] Tab "programs": cada ProgramCard lista ações onde `program_key == programa.key`
- [x] Tab "objectives": cada Objective lista ações onde `objective_key == objetivo.key` (estrutura preparada)
- [x] Ações exibidas com status e link para detalhes

---

### T4. Criar componente GeneratePlanButton ✅
**Arquivos:**
- `src/features/strategic-pack/components/GeneratePlanButton.tsx`
- `src/features/strategic-pack/components/index.ts`

**Critério de aceite:**
- [x] Botão "Gerar Plano de Ação" visível no PackHeader ou página
- [x] Ao clicar, verifica se já existe plano vinculado (idempotência)
- [x] Se existe, mostra mensagem "Plano já gerado"
- [x] Se não existe, gera ações baseadas em Programs e Objectives

---

### T5. Lógica de geração de plano ✅
**Arquivos:**
- `src/features/strategic-pack/components/GeneratePlanButton.tsx` (lógica inline no componente)

**Critério de aceite:**
- [x] Lógica de geração implementada via `useCreatePlanAction`
- [x] Cria ações para cada Programa com `program_key` preenchido
- [x] Cria ações para cada Objetivo com `objective_key` preenchido
- [x] Retorna `{ created: boolean, message: string }`
- [x] Usa hooks existentes do area-plans

---

### T6. Idempotência ✅
**Critério de aceite:**
- [x] Antes de gerar, busca ações existentes com `pack_id == packId`
- [x] Se encontrar, retorna `{ created: false, message: "Plano já existe" }`
- [x] Se não encontrar, gera e retorna `{ created: true, ... }`

---

### T7. Atualizar Gate ✅
**Arquivo:** `specs/GATE_STRATEGIC_PACK_MVP_RH.md`
**Critério de aceite:**
- [x] Item J) marcado conforme implementado
- [x] Item K) marcado conforme implementado
- [x] Arquivos tocados listados

---

### T8. QA ✅
**Critério de aceite:**
- [x] Build passa sem erros (exit code 0)
- [x] `/planning/rh/pe-2026` carrega
- [x] Clicar "Gerar Plano" (primeira vez) → cria ações
- [x] Clicar "Gerar Plano" (segunda vez) → mensagem "já existe"
- [x] Ações aparecem em Programs e Objectives

---

## Arquivos a Criar/Modificar

| Ação | Arquivo |
|------|---------|
| MODIFICAR | `src/features/area-plans/types.ts` |
| MODIFICAR | `src/features/area-plans/schemas.ts` |
| MODIFICAR | `src/features/area-plans/api.ts` |
| MODIFICAR | `src/features/area-plans/api-mock.ts` |
| MODIFICAR | `src/features/area-plans/hooks.ts` |
| MODIFICAR | `src/features/strategic-pack/components/ProgramCard.tsx` |
| MODIFICAR | `src/features/strategic-pack/components/ObjectivesList.tsx` |
| CRIAR | `src/features/strategic-pack/components/GeneratePlanButton.tsx` |
| MODIFICAR | `src/features/strategic-pack/components/index.ts` |
| MODIFICAR | `src/features/strategic-pack/api.ts` |
| MODIFICAR | `src/features/strategic-pack/api-mock.ts` |
| MODIFICAR | `src/features/strategic-pack/hooks.ts` |
| MODIFICAR | `src/features/strategic-pack/pages/StrategicPackPage.tsx` |
| MODIFICAR | `specs/GATE_STRATEGIC_PACK_MVP_RH.md` |

---

## Estratégia de Geração (MVP)

1. Buscar programas do pack (structured_data.programs)
2. Buscar objetivos do pack (structured_data.objectives)
3. Buscar/criar AreaPlan para a área + ano
4. Para cada programa: criar ação com `program_key = programa.key`
5. Para cada objetivo: criar ação com `objective_key = objetivo.key`
6. Marcar pack_id em todas as ações criadas

---

*Gerado em 05/02/2026 por Cascade*
