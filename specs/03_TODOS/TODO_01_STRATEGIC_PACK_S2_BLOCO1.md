# TODO — Strategic Pack Sprint 2 — Bloco 1
## Campos Estruturados (Mandato, Objetivos, Metas/KPIs, Programas, Governança)

> **Localização atual:** `specs/03_TODOS/TODO_01_STRATEGIC_PACK_S2_BLOCO1.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Data:** 05/02/2026  
**Status:** ✅ Concluído  
**Responsável:** Cascade  
**Atualizado:** 05/02/2026 17:45

---

## Visão Geral

Implementar campos estruturados mínimos usando `structured_data` (JSON) por seção, com UI editável.

---

## Tarefas

### T1. Schema/Types ✅
**Arquivo:** `src/features/strategic-pack/types.ts`  
**Critério de aceite:**
- [x] Tipos `Objective`, `Kpi`, `Program`, `Ritual`, `MeetingMinutes` definidos
- [x] Interfaces `ObjectivesData`, `ProgramsData`, `GovernanceData` definidas
- [x] Patch via `Record<string, unknown>` (suficiente para MVP)

**Arquivo:** `src/features/strategic-pack/schemas.ts`  
**Critério de aceite:**
- [x] Schema Zod para `ObjectivesData` (`objectivesDataSchema`)
- [x] Schema Zod para `ProgramsData` (`programsDataSchema`)
- [x] Schema Zod para `GovernanceData` (`governanceDataSchema`)

---

### T2. API/Hooks ✅
**Arquivo:** `src/features/strategic-pack/api.ts`  
**Critério de aceite:**
- [x] Função `updateSectionStructuredData(sectionId, patch)` implementada
- [x] Fallback para mock quando Supabase não configurado

**Arquivo:** `src/features/strategic-pack/api-mock.ts`  
**Critério de aceite:**
- [x] Mock de `updateSectionStructuredData` funciona e persiste em memória

**Arquivo:** `src/features/strategic-pack/hooks.ts`  
**Critério de aceite:**
- [x] Hook `useUpdateSectionStructuredData` (mutation)
- [x] Invalidação de cache após update

---

### T3. Componentes UI ✅
**Pasta:** `src/features/strategic-pack/components/`

#### T3.1 ObjectivesList.tsx ✅
**Critério de aceite:**
- [x] Lista objetivos O1-O5
- [x] Permite editar título e descrição inline
- [x] Permite adicionar/remover objetivo
- [x] Salva via hook

#### T3.2 KpiTable.tsx ✅
**Critério de aceite:**
- [x] Tabela com colunas: Nome, Meta, Cadência, Dono, Gatilho
- [x] Permite editar valores inline
- [x] Permite adicionar/remover KPI
- [x] Salva via hook

#### T3.3 ProgramCard.tsx ✅
**Critério de aceite:**
- [x] Card de programa com nome, descrição, status
- [x] Lista de goals do programa
- [x] Permite editar inline
- [x] Salva via hook

#### T3.4 GovernanceRituals.tsx ✅
**Critério de aceite:**
- [x] Lista rituais (WBR/MBR/QBR)
- [x] Permite adicionar ata simples
- [x] Lista atas existentes
- [x] Salva via hook

---

### T4. Integração nas Tabs ✅
**Arquivo:** `src/features/strategic-pack/pages/StrategicPackPage.tsx`  
**Critério de aceite:**
- [x] Tab "objectives": renderiza `ObjectivesList` + `KpiTable`
- [x] Tab "programs": renderiza lista de `ProgramCard`
- [x] Tab "governance": renderiza `GovernanceRituals`
- [x] Mantém editor markdown como opção

---

### T5. Config ✅
**Arquivo:** `src/features/strategic-pack/config/sections.ts`  
**Critério de aceite:**
- [x] Campo `structuredComponents` indicando quais componentes cada seção usa no MVP-2

---

### T6. Testes ✅
**Critério de aceite:**
- [x] Build passa sem erros (exit code 0)
- [x] `/planning/rh/pe-2026` carrega
- [x] Editar objetivo → salva e recarrega
- [x] Editar KPI → salva e recarrega
- [x] Editar programa → salva e recarrega
- [x] Adicionar ata → salva e recarrega

---

### T7. Gate ✅
**Arquivo:** `specs/GATE_STRATEGIC_PACK_MVP_RH.md`  
**Critério de aceite:**
- [x] Item I) marcado como "em andamento" com arquivos citados

---

## Arquivos a Criar/Modificar

| Ação | Arquivo |
|------|---------|
| MODIFICAR | `src/features/strategic-pack/types.ts` |
| MODIFICAR | `src/features/strategic-pack/schemas.ts` |
| MODIFICAR | `src/features/strategic-pack/api.ts` |
| MODIFICAR | `src/features/strategic-pack/api-mock.ts` |
| MODIFICAR | `src/features/strategic-pack/hooks.ts` |
| CRIAR | `src/features/strategic-pack/components/ObjectivesList.tsx` |
| CRIAR | `src/features/strategic-pack/components/KpiTable.tsx` |
| CRIAR | `src/features/strategic-pack/components/ProgramCard.tsx` |
| CRIAR | `src/features/strategic-pack/components/GovernanceRituals.tsx` |
| MODIFICAR | `src/features/strategic-pack/components/index.ts` |
| MODIFICAR | `src/features/strategic-pack/pages/StrategicPackPage.tsx` |
| MODIFICAR | `src/features/strategic-pack/config/sections.ts` |
| MODIFICAR | `specs/GATE_STRATEGIC_PACK_MVP_RH.md` |

---

## Dependências

- Tipos já existem em `types.ts` (Objective, Kpi, Program, Ritual, etc.)
- API base já existe (`api.ts`, `api-mock.ts`)
- Hooks base já existem (`hooks.ts`)

---

## Riscos

1. **Performance:** structured_data pode crescer; considerar paginação futura
2. **Validação:** Zod schemas devem ser flexíveis para evolução
3. **UX:** Edição inline pode ser complexa; começar simples

---

*Gerado em 05/02/2026 por Cascade*
