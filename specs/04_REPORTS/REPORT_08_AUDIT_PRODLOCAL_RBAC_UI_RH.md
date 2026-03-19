# REPORT — Auditoria P0 — Build+Preview, RBAC, UI/UX, RH-only

> **Localização:** `specs/04_REPORTS/REPORT_08_AUDIT_PRODLOCAL_RBAC_UI_RH.md`  
> **Índice geral:** [00_INDEX.md](../00_INDEX.md)

**Projeto:** PE_2026 — Módulo Planejamento  
**Data:** 06/02/2026 11:30  
**Executor:** Cascade  
**Scope:** Build + Preview (produção local), RBAC/Permissões, UI/UX/CSS, RH-only mode

---

## A) Identificação de "Produção Local"

### Comandos Executados

```bash
npm run build    # Compila TypeScript + Vite build
npm run preview  # Serve dist/ em modo produção
```

### Resultado do Build

| Item | Status | Detalhes |
|------|--------|----------|
| TypeScript (`tsc -b`) | ✅ OK | Sem erros |
| Vite Build | ✅ OK | 5.60s, 3315 modules |
| Warnings | ⚠️ | 3 warnings sobre dynamic imports de lucide-react (não críticos) |

### Preview

| Item | Valor |
|------|-------|
| Porta padrão | 4173 (ou próxima disponível) |
| URL local | `http://localhost:4173/` |

### Diferença Dev vs Preview

| Aspecto | Dev (`npm run dev`) | Preview (`npm run preview`) |
|---------|---------------------|----------------------------|
| Hot Reload | ✅ Sim | ❌ Não |
| Source Maps | ✅ Completo | ⚠️ Limitado |
| Bundling | ESM dev | Chunks otimizados |
| Performance | Mais lento | Produção-like |

---

## B) Smoke Test em Preview

### Rotas Testadas

| Rota | Status | Console Errors | Network Errors |
|------|--------|----------------|----------------|
| `/planning` | ✅ OK | Nenhum | Nenhum |
| `/planning/rh/dashboard` | ✅ OK | Nenhum | Nenhum |
| `/planning/rh/pe-2026` | ✅ OK | Nenhum | Nenhum |
| `/planning/actions/manage?areaSlug=rh` | ✅ OK | Nenhum | Nenhum |
| `/planning/actions/evidences?areaSlug=rh` | ✅ OK | Nenhum | Nenhum |
| `/planning/actions/approvals?areaSlug=rh` | ✅ OK | Nenhum | Nenhum |
| `/planning/actions/new` (Wizard) | ✅ OK | Nenhum | Nenhum |

### Observações

- Todas as rotas carregam corretamente
- Mock data funciona em modo demo (sem Supabase)
- Navegação lateral e quick links funcionais

---

## C) Auditoria RBAC (P0)

### Problema Identificado

O usuário em modo demo recebia `role: 'admin'`, mas as verificações de permissão nas páginas de Backlog e Aprovações só consideravam `'gestor'` e `'direcao'`.

### Lógica Antes

```typescript
// Em ActionsApprovalsPage.tsx, ActionsEvidencesPage.tsx, etc.
const canApprove = userRole === 'gestor' || userRole === 'direcao'
// ❌ Admin não estava incluído!
```

### Lógica Depois

```typescript
// Corrigido para incluir admin
const canApprove = userRole === 'admin' || userRole === 'gestor' || userRole === 'direcao'
// ✅ Admin agora tem acesso
```

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/shared/types/index.ts` | Adicionado `'direcao'` ao `UserRole`, criado `APPROVAL_ROLES` e `canApproveEvidence()` |
| `src/features/area-plans/components/ApprovalPanel.tsx` | `userRole` agora aceita `'admin'`, lógica de filtro atualizada |
| `src/features/planning/pages/actions/ActionsApprovalsPage.tsx` | `canApprove` inclui `'admin'` |
| `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` | `canViewBacklog` inclui `'admin'` |
| `src/features/area-plans/pages/AreaPlansListPage.tsx` | `canViewBacklog` inclui `'admin'` |
| `src/features/area-plans/pages/AreaPlanApprovalsPage.tsx` | `canApprove` inclui `'admin'` |

### Centralização RBAC

Criado em `src/shared/types/index.ts`:

```typescript
export const APPROVAL_ROLES: UserRole[] = ['admin', 'direcao', 'gestor']

export function canApproveEvidence(role?: UserRole): boolean {
  return !!role && APPROVAL_ROLES.includes(role)
}
```

### Resultado

| Antes | Depois |
|-------|--------|
| Admin não via backlog | ✅ Admin vê backlog |
| Admin não podia aprovar | ✅ Admin pode aprovar em qualquer etapa |

---

## D) RH-only Mode (Frente Única)

### Implementação

Adicionado filtro MVP no `AreaSelector.tsx`:

```typescript
// MVP Mode: mostrar apenas RH durante validação
const MVP_RH_ONLY = true
const MVP_ALLOWED_AREAS = ['rh']

// Filtrar áreas para MVP RH-only
const filteredAreas = (MVP_RH_ONLY && !showAllAreas)
  ? areas.filter((a: Area) => MVP_ALLOWED_AREAS.includes(a.slug.toLowerCase()))
  : areas
```

### Comportamento

| Cenário | Antes | Depois |
|---------|-------|--------|
| `/planning` | Mostra todas as áreas | Mostra apenas RH |
| Última área = Marketing | Mostrava "Continuar em Marketing" | Não mostra (área não permitida) |
| Mensagem | "Selecione uma área" | "Área disponível para validação MVP:" |
| Rodapé | Não tinha | "* Outras áreas estarão disponíveis após validação do MVP RH" |

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/features/planning/components/AreaSelector.tsx` | Filtro MVP, mensagens contextuais |

### Desativação Futura

Para habilitar todas as áreas após validação:

```typescript
const MVP_RH_ONLY = false  // Alterar para false
```

Ou passar prop `showAllAreas={true}` no componente.

---

## E) Auditoria UI/UX/CSS

### Cards de Estatísticas (Manage Page)

| Item | Status | Observação |
|------|--------|------------|
| Grid responsivo | ✅ OK | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| Overflow último card | ✅ OK | Sem corte |
| Breakpoints | ✅ OK | Funciona em 1366x768 e 1440x900 |

### Wizard/Modal "Criar Novo Plano"

| Item | Status | Observação |
|------|--------|------------|
| Modal no viewport | ✅ OK | `LazyModal` com scroll interno |
| Header visível | ✅ OK | Steps fixos no topo |
| Botões acessíveis | ✅ OK | Footer com Anterior/Próximo |

### Sidebar + Conteúdo

| Item | Status | Observação |
|------|--------|------------|
| Alinhamento | ✅ OK | Layout flex correto |
| Espaçamentos | ✅ OK | Consistentes |
| 1366x768 | ✅ OK | Sidebar colapsável funciona |
| 1440x900 | ✅ OK | Layout completo |

### Issues Encontrados

| Prioridade | Issue | Arquivo | Status |
|------------|-------|---------|--------|
| P2 | Badge "MVP" poderia ter tooltip explicativo | AreaSelector.tsx | Não crítico |
| P2 | Filtro por status no Kanban poderia ser mais visível | PlanningAreaKanbanPage.tsx | Não crítico |

### Melhorias Recomendadas (P2)

1. Adicionar tooltip no badge "MVP" explicando que é área de validação
2. Highlight visual mais forte quando RH-only está ativo
3. Considerar empty state mais informativo quando não há evidências

---

## F) Resumo de Arquivos Modificados

| Arquivo | Tipo | Alteração |
|---------|------|-----------|
| `src/shared/types/index.ts` | RBAC | +direcao, +APPROVAL_ROLES, +canApproveEvidence |
| `src/features/area-plans/components/ApprovalPanel.tsx` | RBAC | admin em userRole, filtro evidências |
| `src/features/planning/pages/actions/ActionsApprovalsPage.tsx` | RBAC | canApprove + admin |
| `src/features/planning/pages/actions/ActionsEvidencesPage.tsx` | RBAC | canViewBacklog + admin |
| `src/features/area-plans/pages/AreaPlansListPage.tsx` | RBAC | canViewBacklog + admin |
| `src/features/area-plans/pages/AreaPlanApprovalsPage.tsx` | RBAC | canApprove + admin |
| `src/features/planning/components/AreaSelector.tsx` | RH-only | MVP_RH_ONLY filter |

---

## G) Conclusão

| Categoria | Status |
|-----------|--------|
| Build | ✅ Passa (5.60s) |
| Preview | ✅ Funcional |
| RBAC | ✅ Corrigido (admin incluído) |
| RH-only | ✅ Implementado |
| UI/UX | ✅ Sem issues críticos |

**Resultado Geral:** ✅ **APROVADO**

