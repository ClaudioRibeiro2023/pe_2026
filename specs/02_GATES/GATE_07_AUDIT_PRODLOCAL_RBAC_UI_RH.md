# GATE — Auditoria P0 — Build+Preview, RBAC, UI/UX, RH-only

> **Localização:** `specs/02_GATES/GATE_07_AUDIT_PRODLOCAL_RBAC_UI_RH.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Projeto:** PE_2026 — Módulo Planejamento  
**Feature:** Auditoria Produção Local + RBAC + UI/UX + RH-only  
**Report:** [REPORT_08_AUDIT_PRODLOCAL_RBAC_UI_RH.md](../04_REPORTS/REPORT_08_AUDIT_PRODLOCAL_RBAC_UI_RH.md)  
**TODO:** [TODO_08_FIX_PRODLOCAL_RBAC_UI_RH.md](../03_TODOS/TODO_08_FIX_PRODLOCAL_RBAC_UI_RH.md)  
**Última revisão:** 06/02/2026 11:35  
**Revisor:** Cascade

---

## 1) Critérios de Aprovação

| Critério | Requisito | Status |
|----------|-----------|--------|
| Build | `npm run build` sem erros | ✅ PASSA |
| Preview | `npm run preview` funcional | ✅ PASSA |
| RBAC Backlog | Admin/direção vê backlog evidências | ✅ PASSA |
| RBAC Aprovações | Admin/direção pode aprovar | ✅ PASSA |
| RH-only | Apenas RH visível no MVP | ✅ PASSA |
| UI Cards | Sem overflow crítico | ✅ PASSA |
| UI Modal | Wizard cabe no viewport | ✅ PASSA |

---

## 2) Checklist — Build + Preview

| Item | Status | Evidência |
|------|--------|-----------|
| `npm run build` exit code 0 | ✅ | 5.60s, 3315 modules |
| Warnings críticos | ✅ | Apenas 3 warnings lucide-react (não bloqueantes) |
| `npm run preview` inicia | ✅ | http://localhost:4173/ |
| Rotas carregam | ✅ | 7/7 rotas testadas OK |

---

## 3) Checklist — RBAC

| Item | Status | Evidência |
|------|--------|-----------|
| UserRole inclui 'direcao' | ✅ | `src/shared/types/index.ts` |
| APPROVAL_ROLES centralizado | ✅ | `['admin', 'direcao', 'gestor']` |
| ActionsApprovalsPage | ✅ | `canApprove` inclui admin |
| ActionsEvidencesPage | ✅ | `canViewBacklog` inclui admin |
| AreaPlansListPage | ✅ | `canViewBacklog` inclui admin |
| AreaPlanApprovalsPage | ✅ | `canApprove` inclui admin |
| ApprovalPanel | ✅ | `userRole` aceita 'admin' |
| EvidenceBacklogList | ✅ | Admin vê todas as evidências pendentes |

---

## 4) Checklist — RH-only Mode

| Item | Status | Evidência |
|------|--------|-----------|
| MVP_RH_ONLY = true | ✅ | `AreaSelector.tsx` |
| Filtro áreas aplicado | ✅ | Apenas 'rh' visível |
| Mensagem contextual | ✅ | "Área disponível para validação MVP" |
| Override showAllAreas | ✅ | Prop disponível para desativar |
| Última área não-RH | ✅ | Não mostra "Continuar em X" |

---

## 5) Checklist — UI/UX

| Item | Status | Observação |
|------|--------|------------|
| Cards Manage Page | ✅ | Grid responsivo OK |
| Modal Wizard | ✅ | Scroll interno, botões visíveis |
| Sidebar alinhamento | ✅ | OK em 1366x768 e 1440x900 |
| Sem overflow crítico | ✅ | Nenhum detectado |

---

## 6) Smoke Test Rotas

| Rota | Status |
|------|--------|
| `/planning` | ✅ |
| `/planning/rh/dashboard` | ✅ |
| `/planning/rh/pe-2026` | ✅ |
| `/planning/actions/manage?areaSlug=rh` | ✅ |
| `/planning/actions/evidences?areaSlug=rh` | ✅ |
| `/planning/actions/approvals?areaSlug=rh` | ✅ |
| Wizard "Criar Plano" | ✅ |

---

## 7) Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/shared/types/index.ts` | +direcao, +APPROVAL_ROLES |
| `src/features/area-plans/components/ApprovalPanel.tsx` | admin role support |
| `src/features/planning/pages/actions/ActionsApprovalsPage.tsx` | admin em canApprove |
| `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` | admin em canViewBacklog |
| `src/features/area-plans/pages/AreaPlansListPage.tsx` | admin em canViewBacklog |
| `src/features/area-plans/pages/AreaPlanApprovalsPage.tsx` | admin em canApprove |
| `src/features/planning/components/AreaSelector.tsx` | MVP_RH_ONLY filter |

---

## 8) Issues Pendentes (P2)

| ID | Descrição | Prioridade |
|----|-----------|------------|
| P2-001 | Tooltip no badge MVP | Baixa |
| P2-002 | Refatorar para usar helper centralizado | Baixa |
| P2-003 | Empty state mais informativo | Baixa |

**Nenhum bloqueador pendente.**

---

## 9) Resultado do Gate

| Categoria | Status |
|-----------|--------|
| Build + Preview | ✅ PASSA |
| RBAC | ✅ PASSA |
| RH-only Mode | ✅ PASSA |
| UI/UX | ✅ PASSA |
| Smoke Tests | ✅ PASSA |

---

## Decisão Final

### ✅ GATE APROVADO

A auditoria P0 foi concluída com sucesso:
- Build e preview funcionando em produção local
- RBAC corrigido para incluir admin em todas as verificações
- RH-only mode implementado para validação MVP
- Sem issues críticos de UI/UX

**Próximos passos:** Rebuild e validação manual no preview.

