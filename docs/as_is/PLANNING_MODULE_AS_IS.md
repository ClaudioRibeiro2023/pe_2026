# AS-IS: Módulo de Planejamento por Área (area-plans / planning)

> Documentação do estado atual do módulo de planos de ação por área.  
> Última atualização: 05/02/2026

---

## 1. Visão Geral

### 1.1 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Framework** | React 18.2 + TypeScript |
| **Roteamento** | React Router DOM 6.21 |
| **Estado do Servidor** | TanStack React Query 5.17 |
| **Validação** | Zod 3.22 + React Hook Form 7.49 |
| **Estilização** | TailwindCSS + clsx + tailwind-merge |
| **Ícones** | Lucide React 0.303 |
| **Backend** | Supabase (com fallback mock local) |
| **Build** | Vite + TypeScript |

### 1.2 Estrutura de Pastas

```
src/features/
├── area-plans/                    # Feature principal (legada)
│   ├── api.ts                     # Re-exporta api-mock.ts
│   ├── api-mock.ts                # 26KB - Implementação mock completa
│   ├── hooks.ts                   # 18KB - 40+ hooks React Query
│   ├── types.ts                   # 13KB - Contratos de dados
│   ├── schemas.ts                 # 5KB - Validações Zod
│   ├── index.ts                   # Barrel exports
│   ├── components/                # 25 componentes
│   │   ├── ActionCard.tsx
│   │   ├── ActionForm.tsx
│   │   ├── ActionKanbanBoard.tsx
│   │   ├── ActionTimeline.tsx
│   │   ├── ActionTreeView.tsx
│   │   ├── ApprovalPanel.tsx      # + EvidenceBacklogList
│   │   ├── CreatePlanWizard.tsx
│   │   ├── UnifiedPlanWizard.tsx
│   │   ├── EvidencePanel.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StatusBadge.tsx
│   │   └── form/                  # 6 componentes de formulário
│   ├── pages/                     # 5 páginas
│   │   ├── AreaPlansListPage.tsx  # Listagem consolidada
│   │   ├── AreaPlanPage.tsx       # Detalhe do plano
│   │   ├── AreaPlansDashboard.tsx # Dashboard executivo
│   │   ├── AreaPlansKanban.tsx    # Kanban por área
│   │   └── AreaPlansTimeline.tsx  # Timeline por área
│   └── utils/
│       ├── mockData.ts            # 17KB dados mock
│       └── mockActions.ts         # 24KB ações mock
│
├── planning/                      # Módulo novo (wrapper)
│   ├── index.ts                   # Barrel exports
│   ├── contexts/
│   │   └── AreaContext.tsx        # Contexto de área selecionada
│   └── pages/
│       ├── PlanningDashboardPage.tsx   # Wrapper → AreaPlansDashboard
│       ├── PlanningKanbanPage.tsx      # Wrapper → AreaPlansListPage
│       ├── PlanningCalendarPage.tsx    # Calendário próprio (4.7KB)
│       ├── PlanningTimelinePage.tsx    # Wrapper → AreaPlansListPage
│       ├── actions/
│       │   ├── ActionsNewPage.tsx      # Wizard criação
│       │   ├── ActionsManagePage.tsx   # Wrapper → AreaPlansListPage
│       │   ├── ActionsTemplatesPage.tsx
│       │   ├── ActionsApprovalsPage.tsx
│       │   └── ActionsEvidencesPage.tsx
│       └── area/                       # Rotas por área específica
│           ├── PlanningAreaDashboardPage.tsx
│           ├── PlanningAreaKanbanPage.tsx
│           ├── PlanningAreaCalendarPage.tsx
│           └── PlanningAreaTimelinePage.tsx
│
└── areas/                         # Feature de áreas organizacionais
    ├── api.ts                     # CRUD de áreas
    ├── hooks.ts                   # useAreas, useAreaBySlug
    ├── types.ts                   # Area interface
    └── pages/
        └── AreasPage.tsx
```

---

## 2. Sitemap Real (Rotas)

### 2.1 Rotas Atuais no Router

**Definidas em:** `src/shared/config/routes.ts`  
**Configuradas em:** `src/app/router.tsx`

#### Rotas Legadas (area-plans)

| Rota | Componente | Status |
|------|------------|--------|
| `/area-plans` | `AreaPlansListPage` | ✅ Ativa |
| `/area-plans/dashboard` | `AreaPlansDashboard` | ✅ Ativa |
| `/area-plans/:areaSlug` | `AreaPlanPage` | ✅ Ativa |
| `/area-plans/:areaSlug/kanban` | `AreaPlansKanban` | ✅ Ativa |
| `/area-plans/:areaSlug/timeline` | `AreaPlansTimeline` | ✅ Ativa |
| `/area-plans/:areaSlug/approvals` | - | ⚠️ Definida mas sem componente |
| `/area-plans/kanban` | Redirect → `/area-plans?view=kanban` | ✅ Redirect |
| `/area-plans/timeline` | Redirect → `/area-plans?view=timeline` | ✅ Redirect |

#### Rotas Novas (planning)

| Rota | Componente | Status |
|------|------------|--------|
| `/planning` | Redirect → `/planning/dashboard` | ✅ Redirect |
| `/planning/dashboard` | `PlanningDashboardPage` | ✅ Ativa |
| `/planning/kanban` | `PlanningKanbanPage` | ✅ Ativa |
| `/planning/calendar` | `PlanningCalendarPage` | ✅ Ativa |
| `/planning/timeline` | `PlanningTimelinePage` | ✅ Ativa |
| `/planning/actions/new` | `ActionsNewPage` | ✅ Ativa |
| `/planning/actions/manage` | `ActionsManagePage` | ✅ Ativa |
| `/planning/actions/templates` | `ActionsTemplatesPage` | ✅ Ativa |
| `/planning/actions/approvals` | `ActionsApprovalsPage` | ✅ Ativa |
| `/planning/actions/evidences` | `ActionsEvidencesPage` | ✅ Ativa |
| `/planning/:areaSlug` | Redirect (parcial) | ⚠️ Bug no redirect |
| `/planning/:areaSlug/dashboard` | `PlanningAreaDashboardPage` | ✅ Ativa |
| `/planning/:areaSlug/kanban` | `PlanningAreaKanbanPage` | ✅ Ativa |
| `/planning/:areaSlug/calendar` | `PlanningAreaCalendarPage` | ✅ Ativa |
| `/planning/:areaSlug/timeline` | `PlanningAreaTimelinePage` | ✅ Ativa |

### 2.2 Constantes de Rota

```typescript
// src/shared/config/routes.ts:34-56
AREA_PLANS: '/area-plans',
AREA_PLAN_DETAIL: '/area-plans/:areaSlug',
AREA_PLAN_KANBAN: '/area-plans/:areaSlug/kanban',
AREA_PLAN_TIMELINE: '/area-plans/:areaSlug/timeline',
AREA_PLAN_APPROVALS: '/area-plans/:areaSlug/approvals',

PLANNING: '/planning',
PLANNING_DASHBOARD: '/planning/dashboard',
PLANNING_KANBAN: '/planning/kanban',
PLANNING_CALENDAR: '/planning/calendar',
PLANNING_TIMELINE: '/planning/timeline',
PLANNING_ACTIONS_NEW: '/planning/actions/new',
PLANNING_ACTIONS_MANAGE: '/planning/actions/manage',
PLANNING_ACTIONS_TEMPLATES: '/planning/actions/templates',
PLANNING_ACTIONS_APPROVALS: '/planning/actions/approvals',
PLANNING_ACTIONS_EVIDENCES: '/planning/actions/evidences',
PLANNING_AREA: '/planning/:areaSlug',
PLANNING_AREA_DASHBOARD: '/planning/:areaSlug/dashboard',
PLANNING_AREA_KANBAN: '/planning/:areaSlug/kanban',
PLANNING_AREA_CALENDAR: '/planning/:areaSlug/calendar',
PLANNING_AREA_TIMELINE: '/planning/:areaSlug/timeline',
```

---

## 3. Navegação Real (Menu)

**Definida em:** `src/shared/config/navigation.ts`

### 3.1 Seção "Gerencial" (management)

```typescript
// navigation.ts:92-118
{
  id: 'management',
  title: 'Gerencial',
  icon: Briefcase,
  items: [
    { label: 'Estratégia', href: ROUTES.STRATEGY, icon: Compass },
    { label: 'Metas', href: ROUTES.GOALS, icon: Target },
    { label: 'Indicadores', href: ROUTES.INDICATORS, icon: BarChart3 },
    { label: 'Áreas', href: ROUTES.AREAS, icon: Building2 },
  ],
}
```

### 3.2 Seção "Planejamento" (planning)

```typescript
// navigation.ts:119-177
{
  id: 'planning',
  title: 'Planejamento',
  icon: FolderKanban,
  items: [
    { label: 'Dashboard', href: '/planning/dashboard', icon: PieChart },
    { label: 'Kanban', href: '/planning/kanban', icon: Kanban },
    { label: 'Calendário', href: '/planning/calendar', icon: Calendar },
    { label: 'Timeline', href: '/planning/timeline', icon: GanttChart },
    {
      label: 'Plano de Ação',
      icon: ClipboardList,
      subItems: [
        { label: 'Criar Novo', href: '/planning/actions/new', icon: FilePlus },
        { label: 'Gerenciar', href: '/planning/actions/manage', icon: ClipboardList },
        { label: 'Templates', href: '/planning/actions/templates', icon: Layers },
        { label: 'Aprovações', href: '/planning/actions/approvals', icon: FileCheck },
        { label: 'Backlog de Evidências', href: '/planning/actions/evidences', icon: FileText },
      ],
      defaultOpen: true,
    },
  ],
}
```

### 3.3 Observações

- **Rotas legadas `/area-plans/*`** não aparecem no menu principal
- Menu aponta apenas para `/planning/*`
- Subitem "Plano de Ação" expande por padrão (`defaultOpen: true`)

---

## 4. Inventário de Componentes/Features

### 4.1 Páginas (area-plans)

| Arquivo | Função | Dependências | Em Uso |
|---------|--------|--------------|--------|
| `AreaPlansListPage.tsx` | Listagem consolidada de planos com stats | `useAreaPlanProgress`, `UnifiedPlanWizard`, `EvidenceBacklogList` | ✅ Sim |
| `AreaPlanPage.tsx` | Detalhe do plano com filtros e views | `useAreaPlanByAreaSlug`, `usePlanActions`, `ActionTreeView` | ✅ Sim |
| `AreaPlansDashboard.tsx` | Dashboard executivo | `useAreaPlanProgress` | ✅ Sim |
| `AreaPlansKanban.tsx` | Kanban por área | `useParams(areaSlug)`, `usePlanActions`, `useUpdateActionStatus` | ✅ Sim |
| `AreaPlansTimeline.tsx` | Timeline por área | `useParams(slug)`, `usePlanActions` | ✅ Sim |

### 4.2 Páginas (planning)

| Arquivo | Função | Dependências | Em Uso |
|---------|--------|--------------|--------|
| `PlanningDashboardPage.tsx` | Wrapper | `AreaPlansDashboard` | ✅ Sim |
| `PlanningKanbanPage.tsx` | Wrapper | `AreaPlansListPage` | ✅ Sim |
| `PlanningCalendarPage.tsx` | Calendário próprio | `useAreaPlanProgress`, `useNavigate` | ✅ Sim |
| `PlanningTimelinePage.tsx` | Wrapper | `AreaPlansListPage` | ✅ Sim |
| `ActionsNewPage.tsx` | Wizard de criação | `UnifiedPlanWizard` | ✅ Sim |
| `ActionsManagePage.tsx` | Wrapper | `AreaPlansListPage` | ✅ Sim |
| `ActionsTemplatesPage.tsx` | Gerenciar templates | `usePlanTemplates`, `TemplateSelector` | ✅ Sim |
| `ActionsApprovalsPage.tsx` | Aprovações | `useEvidenceBacklog`, `ApprovalPanel`, `EvidenceBacklogList` | ✅ Sim |
| `ActionsEvidencesPage.tsx` | Backlog evidências | `useEvidenceBacklog`, `EvidenceBacklogList` | ✅ Sim |
| `PlanningAreaDashboardPage.tsx` | Dashboard por área | `useAreaBySlug`, `AreaPlanPage` | ✅ Sim |
| `PlanningAreaKanbanPage.tsx` | Kanban por área | `useAreaBySlug`, `AreaPlansKanban` | ✅ Sim |
| `PlanningAreaCalendarPage.tsx` | Calendário por área | `useAreaBySlug` | ✅ Sim |
| `PlanningAreaTimelinePage.tsx` | Timeline por área | `useAreaBySlug`, `AreaPlansTimeline` | ✅ Sim |

### 4.3 Componentes Principais

| Componente | Função | Tamanho | Em Uso |
|------------|--------|---------|--------|
| `UnifiedPlanWizard.tsx` | Wizard simplificado | 10.7KB | ✅ |
| `CreatePlanWizard.tsx` | Wizard com templates | 12.2KB | ⚠️ Não usado |
| `ApprovalPanel.tsx` | Painel de aprovação + `EvidenceBacklogList` | 11.2KB | ✅ |
| `ActionForm.tsx` | Formulário de ação | 12.4KB | ✅ |
| `ActionTreeView.tsx` | Árvore hierárquica | 8.3KB | ✅ |
| `ActionTimeline.tsx` | Timeline de ações | 8.6KB | ✅ |
| `ActionCard.tsx` | Card de ação | 6.2KB | ✅ |
| `EvidencePanel.tsx` | Painel de evidências | 8KB | ✅ |
| `CommentsList.tsx` | Lista de comentários | 6.7KB | ✅ |
| `PlanAlertsWidget.tsx` | Alertas do plano | 5.8KB | ✅ |
| `ActionKanbanBoard.tsx` | Board Kanban | 2.7KB | ✅ |
| `ActionFormRefactored.tsx` | Form refatorado | 4.8KB | ⚠️ Não usado |
| `ActionTreeViewPaginated.tsx` | Tree paginada | 2KB | ⚠️ Não usado |
| `ActionTreeViewVirtualized.tsx` | Tree virtualizada | 7.2KB | ⚠️ Não usado |

---

## 5. Contratos de Dados e APIs

### 5.1 Tipos Principais (types.ts)

```typescript
// Enums de Status
type AreaPlanStatus = 'RASCUNHO' | 'EM_APROVACAO' | 'ATIVO' | 'CONCLUIDO' | 'ARQUIVADO'
type ActionStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'BLOQUEADA' | 'AGUARDANDO_EVIDENCIA' | 'EM_VALIDACAO' | 'CONCLUIDA' | 'CANCELADA'
type EvidenceStatus = 'PENDENTE' | 'APROVADA_GESTOR' | 'APROVADA' | 'REJEITADA'
type ActionPriority = 'P0' | 'P1' | 'P2'
type NodeType = 'macro' | 'area' | 'meta' | 'pilar' | 'acao'

// Entidades principais
interface Area { id, slug, name, owner, focus, color, created_at, updated_at }
interface AreaPlan { id, area_id, year, title, description, status, template_id, ... }
interface PlanAction { id, plan_id, node_type, title, status, priority, responsible, ... }
interface ActionEvidence { id, action_id, filename, status, submitted_by, approvals[] }
interface EvidenceApproval { id, evidence_id, role, decision, decided_by, note }

// Views agregadas
interface AreaPlanProgress { plan_id, area_slug, total_actions, completed_actions, ... }
interface EvidenceBacklogItem { evidence_id, action_title, area_slug, manager_approved, ... }
```

### 5.2 Hooks React Query (hooks.ts)

**Query Keys:**
```typescript
const areaPlansKeys = {
  all: ['area-plans'],
  areas: () => [...all, 'areas'],
  area: (slug) => [...areas(), slug],
  plans: (year?) => [...all, 'plans', { year }],
  planByArea: (areaSlug, year) => [...all, 'plan-by-area', areaSlug, year],
  actions: (planId, filters?) => [...all, 'actions', planId, filters],
  evidenceBacklog: () => [...all, 'evidence-backlog'],
  // ...
}
```

**Hooks de Query:**
| Hook | Função |
|------|--------|
| `useAreas()` | Lista todas as áreas |
| `useAreaBySlug(slug)` | Busca área por slug |
| `useAreaPlans(year?)` | Lista planos do ano |
| `useAreaPlanByAreaSlug(areaSlug, year)` | Plano específico |
| `usePlanActions(planId, filters?)` | Ações do plano |
| `useAreaPlanProgress(year?)` | Progresso agregado |
| `useEvidenceBacklog()` | Backlog de evidências |

**Hooks de Mutation:**
| Hook | Função |
|------|--------|
| `useCreateAreaPlan()` | Criar plano |
| `useUpdateAreaPlan()` | Atualizar plano |
| `useCreatePlanAction()` | Criar ação |
| `useUpdateActionStatus()` | Atualizar status |
| `useApproveEvidenceAsManager()` | Aprovar como gestor |
| `useApproveEvidenceAsDirection()` | Aprovar como direção |
| `useRejectEvidence()` | Rejeitar evidência |

### 5.3 API Functions (api-mock.ts)

**Modo atual:** Mock local (Supabase comentado)

```typescript
// Áreas
fetchAreas(): Promise<Area[]>
fetchAreaBySlug(slug): Promise<Area | null>

// Planos
fetchAreaPlans(year?): Promise<AreaPlan[]>
fetchAreaPlanByAreaSlug(areaSlug, year): Promise<AreaPlan | null>
createAreaPlan(data): Promise<AreaPlan>
updateAreaPlan(planId, data): Promise<AreaPlan>

// Ações
fetchPlanActions(planId, filters?, pagination?): Promise<PlanAction[]>
createPlanAction(data): Promise<PlanAction>
updateActionStatus(actionId, status): Promise<PlanAction>

// Evidências
fetchEvidenceBacklog(): Promise<EvidenceBacklogItem[]>
approveEvidenceAsManager(evidenceId, note?): Promise<void>
approveEvidenceAsDirection(evidenceId, note?): Promise<void>
rejectEvidence(evidenceId, role, reason): Promise<void>
```

---

## 6. Modelagem de Área

### 6.1 Interface Area

```typescript
// src/features/areas/types.ts
interface Area extends BaseEntity {
  slug: string       // Identificador URL-friendly (ex: "rh", "marketing")
  name: string       // Nome de exibição
  owner: string | null
  focus: string | null
  color?: string     // Cor para UI
}
```

### 6.2 Uso do areaSlug

| Contexto | Como obtém | Arquivo |
|----------|------------|---------|
| Rota `/area-plans/:areaSlug` | `useParams()` | `AreaPlanPage.tsx` |
| Rota `/area-plans/:areaSlug/kanban` | `useParams()` | `AreaPlansKanban.tsx` |
| Rota `/area-plans/:areaSlug/timeline` | `useParams()` (como `slug`) | `AreaPlansTimeline.tsx` |
| Rota `/planning/:areaSlug/*` | `useParams()` + `AreaContext` | `PlanningArea*.tsx` |
| Navegação na listagem | `onClick(area_slug)` | `AreaPlansListPage.tsx:225` |

### 6.3 AreaContext

**Localização:** `src/features/planning/contexts/AreaContext.tsx`

```typescript
interface AreaContextValue {
  area: Area | null
  areaSlug: string | null
  isLoading: boolean
  error: Error | null
  setAreaSlug: (slug: string | null) => void
}

// Hooks expostos
useAreaContext()          // Requer Provider
useOptionalAreaContext()  // Retorna null se fora do Provider
```

**Comportamento:**
- Lê `areaSlug` de `useParams()` automaticamente
- Permite set manual via `setAreaSlug()`
- Busca dados da área via React Query
- Cache de 10 minutos (`staleTime`)

### 6.4 Áreas Mock Disponíveis

```typescript
// src/features/areas/api.ts:4-55
const mockAreas = [
  { slug: 'rh', name: 'RH', color: '#3B82F6' },
  { slug: 'marketing', name: 'Marketing', color: '#10B981' },
  { slug: 'operacoes', name: 'Operações', color: '#F59E0B' },
  { slug: 'ti', name: 'Tecnologia da Informação', color: '#8B5CF6' },
  { slug: 'financeiro', name: 'Financeiro', color: '#EF4444' },
]
```

---

## 7. Lacunas e Bugs Conhecidos

### 7.1 Bugs

| ID | Descrição | Arquivo | Linha | Severidade |
|----|-----------|---------|-------|------------|
| **BUG-001** | Redirect de `/planning/:areaSlug` usa replace com string vazia | `router.tsx` | 623-624 | Média |
| **BUG-002** | `AreaPlansTimeline` usa `slug` em vez de `areaSlug` no useParams | `AreaPlansTimeline.tsx` | - | Baixa |
| **BUG-003** | Rota `/area-plans/:areaSlug/approvals` definida mas sem componente | `routes.ts` | 38 | Média |

### 7.2 Lacunas Funcionais

| ID | Descrição | Impacto |
|----|-----------|---------|
| **GAP-001** | `tab=evidences` em `AreaPlansListPage` não persiste ao voltar | UX |
| **GAP-002** | Links internos ainda apontam para `/area-plans/*` em alguns lugares | Navegação inconsistente |
| **GAP-003** | `AreaContext` não está integrado no `App.tsx` globalmente | Contexto limitado |
| **GAP-004** | `PlanningAreaCalendarPage` mostra placeholder em vez de calendário real | Funcionalidade incompleta |
| **GAP-005** | `CreatePlanWizard` com templates não está sendo usado | Código morto |

### 7.3 Links com Navegação Inconsistente

```typescript
// AreaPlansListPage.tsx:93-94
navigate(`/area-plans/${areaSlug}`)  // Deveria ser /planning/${areaSlug}/dashboard

// AreaPlansListPage.tsx:298
navigate(`/planning/actions/approvals?evidence=${id}`)  // OK

// AreaPlanPage.tsx:146
<Link to={`/area-plans/${areaSlug}/approvals`}>  // Rota não existe

// UnifiedPlanWizard.tsx:99
navigate(`/area-plans/${selectedArea?.slug}`)  // Deveria usar /planning

// CreatePlanWizard.tsx:105
navigate(`/areas/${selectedArea?.slug}/plano`)  // Rota não existe
```

---

## 8. Riscos de Refatoração

### 8.1 Alto Risco

| Risco | Descrição | Mitigação |
|-------|-----------|-----------|
| **Quebra de URLs** | Usuários com bookmarks em `/area-plans/*` | Manter redirects por 6 meses |
| **Perda de estado** | `useParams` vs `AreaContext` podem desincronizar | Unificar acesso via context |
| **Duplicação de lógica** | Wrappers em `/planning` replicam páginas | Refatorar para composição |

### 8.2 Médio Risco

| Risco | Descrição | Mitigação |
|-------|-----------|-----------|
| **Incoerência de Query Keys** | Dois módulos (`areas`, `area-plans`) com keys diferentes | Unificar em único namespace |
| **Mock vs Supabase** | Mudança de fonte pode quebrar tipos | Manter interface consistente |
| **Componentes não utilizados** | 3 componentes de tree view, 2 wizards | Remover após validação |

### 8.3 Baixo Risco

| Risco | Descrição | Mitigação |
|-------|-----------|-----------|
| **Tipagem duplicada** | `Area` definida em 2 arquivos | Unificar em `areas/types.ts` |
| **Imports circulares** | `area-plans` importa de `areas` e vice-versa | Verificar dependências |

---

## Apêndice: Arquivos Referenciados

| Arquivo | Propósito |
|---------|-----------|
| `src/shared/config/routes.ts` | Constantes de rota |
| `src/shared/config/navigation.ts` | Estrutura do menu |
| `src/app/router.tsx` | Configuração de rotas |
| `src/features/area-plans/types.ts` | Contratos de dados |
| `src/features/area-plans/hooks.ts` | Hooks React Query |
| `src/features/area-plans/api-mock.ts` | Implementação mock |
| `src/features/planning/contexts/AreaContext.tsx` | Contexto de área |
| `src/features/areas/api.ts` | API de áreas |
| `src/features/areas/types.ts` | Tipos de área |

---

*Documento gerado para suporte à refatoração do módulo de planejamento.*
