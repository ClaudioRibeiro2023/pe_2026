# TODO — Fixes Auditoria P0 — RBAC, UI, RH-only

> **Localização:** `specs/03_TODOS/TODO_08_FIX_PRODLOCAL_RBAC_UI_RH.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Data:** 06/02/2026  
**Status:** ✅ Concluído  
**Report:** [REPORT_08_AUDIT_PRODLOCAL_RBAC_UI_RH.md](../04_REPORTS/REPORT_08_AUDIT_PRODLOCAL_RBAC_UI_RH.md)  
**Gate:** [GATE_07_AUDIT_PRODLOCAL_RBAC_UI_RH.md](../02_GATES/GATE_07_AUDIT_PRODLOCAL_RBAC_UI_RH.md)

---

## Objetivo

Corrigir issues P0/P1 identificados na auditoria de produção local, RBAC, UI/UX e RH-only mode.

---

## P0 — Bloqueadores (Críticos)

### RBAC-001: Admin não via backlog de evidências ✅

**Problema:** Usuário com `role: 'admin'` não conseguia ver backlog nem aprovar evidências.

**Causa:** Verificações de role não incluíam 'admin':
```typescript
// Antes
const canApprove = userRole === 'gestor' || userRole === 'direcao'
```

**Solução:**
```typescript
// Depois
const canApprove = userRole === 'admin' || userRole === 'gestor' || userRole === 'direcao'
```

**Arquivos:**
- [x] `src/shared/types/index.ts` — Adicionar 'direcao' ao UserRole
- [x] `src/features/area-plans/components/ApprovalPanel.tsx` — admin em props
- [x] `src/features/planning/pages/actions/ActionsApprovalsPage.tsx`
- [x] `src/features/planning/pages/actions/ActionsEvidencesPage.tsx`
- [x] `src/features/area-plans/pages/AreaPlansListPage.tsx`
- [x] `src/features/area-plans/pages/AreaPlanApprovalsPage.tsx`

---

### RBAC-002: Centralizar lógica de permissões ✅

**Problema:** Verificação de roles duplicada em múltiplos arquivos.

**Solução:** Criar helpers centralizados em `src/shared/types/index.ts`:

```typescript
export const APPROVAL_ROLES: UserRole[] = ['admin', 'direcao', 'gestor']

export function canApproveEvidence(role?: UserRole): boolean {
  return !!role && APPROVAL_ROLES.includes(role)
}
```

**Status:** Implementado, mas ainda há duplicação inline. Refatoração completa pendente para Sprint 4.

---

## P1 — Melhorias Importantes

### RH-001: RH-only mode para validação MVP ✅

**Problema:** Outras áreas (Marketing, TI, etc.) visíveis no UI durante validação MVP.

**Solução:** Filtro no `AreaSelector.tsx`:

```typescript
const MVP_RH_ONLY = true
const MVP_ALLOWED_AREAS = ['rh']

const filteredAreas = MVP_RH_ONLY 
  ? areas.filter(a => MVP_ALLOWED_AREAS.includes(a.slug))
  : areas
```

**Arquivos:**
- [x] `src/features/planning/components/AreaSelector.tsx`

---

### UI-001: Verificar overflow cards Manage Page ✅

**Problema:** Potencial corte no último card em resoluções menores.

**Verificação:** Grid `lg:grid-cols-4` funciona corretamente. Sem overflow detectado.

**Status:** OK, nenhuma alteração necessária.

---

### UI-002: Modal Wizard cabe no viewport ✅

**Problema:** Potencial overflow do modal em telas pequenas.

**Verificação:** `LazyModal` usa scroll interno. Header e botões sempre visíveis.

**Status:** OK, nenhuma alteração necessária.

---

## P2 — Refinamentos (Futuros)

### P2-001: Tooltip no badge MVP

**Descrição:** Adicionar tooltip explicativo ao badge "MVP" no AreaSelector.

**Status:** Pendente (não crítico)

---

### P2-002: Usar helper canApproveEvidence em todos os arquivos

**Descrição:** Refatorar verificações inline para usar o helper centralizado.

**Arquivos afetados:**
- `ActionsApprovalsPage.tsx`
- `ActionsEvidencesPage.tsx`
- `AreaPlansListPage.tsx`
- `AreaPlanApprovalsPage.tsx`
- `ApprovalPanel.tsx`

**Status:** Pendente para Sprint 4

---

### P2-003: Empty state mais informativo

**Descrição:** Quando não há evidências pendentes, mostrar mensagem mais contextual.

**Status:** Pendente (não crítico)

---

## Execução

| ID | Descrição | Prioridade | Status |
|----|-----------|------------|--------|
| RBAC-001 | Admin em verificações de role | P0 | ✅ |
| RBAC-002 | Centralizar APPROVAL_ROLES | P0 | ✅ |
| RH-001 | RH-only mode | P1 | ✅ |
| UI-001 | Verificar overflow cards | P1 | ✅ OK |
| UI-002 | Modal viewport | P1 | ✅ OK |
| P2-001 | Tooltip MVP | P2 | ⏳ Pendente |
| P2-002 | Refatorar helpers | P2 | ⏳ Pendente |
| P2-003 | Empty state | P2 | ⏳ Pendente |

---

## Conclusão

**P0/P1 concluídos.** P2 são refinamentos para sprints futuros.

