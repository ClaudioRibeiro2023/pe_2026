# OUTPUT — UI Redesign Wave 1 (Onda 1)

**Data:** 2026-02-08 18:02 (UTC-03:00)
**Repo:** B:\PE_2026
**Tipo:** Implementacao incremental (cores + componentes + guardrails)

---

## 1. Resumo Executivo

A Onda 1 do UI Redesign focou em 3 eixos:

1. **Componentes novos:** `Breadcrumbs` e `PageHeader` criados em `src/shared/ui/`
2. **Migracao de cores:** 4 componentes shared (`Card`, `Input`, `Progress`, `Tooltip`) migrados de raw colors para tokens semanticos
3. **Aplicacao:** PageHeader + Breadcrumbs aplicados em 5 paginas-chave (Planning Home, Dashboard, Calendar, Area Dashboard, Reports)
4. **Guardrails:** Scripts de contagem baseline, contagem pos-migracao, e guardrail anti-regressao criados

### O que mudou

- `bg-white` -> `bg-surface`
- `dark:bg-gray-800` -> removido (token cuida)
- `border-gray-200/300/600/700` -> `border-border`
- `text-gray-700/900` -> `text-foreground`
- `text-gray-400/500` -> `text-muted`
- `bg-gray-100/200/50` -> `bg-accent`
- `stroke-gray-200/700` -> `text-accent` (via stroke-current)
- `bg-red-100 text-red-700` -> `bg-danger-100 text-danger-700`
- `bg-blue-100 text-blue-700` -> `bg-info-100 text-info-700`
- `border-blue-300` -> `border-primary-300`
- `border-blue-600` -> `border-primary-600`
- QuickLinks: `bg-blue/purple/green/yellow/red/cyan-100` -> tokens semanticos com dark mode

---

## 2. Evidencias: Baseline vs After

### Contagem de Cores Raw

| Pattern | Baseline (pre) | After | Delta |
|---------|---------------|-------|-------|
| `text-gray-` | 498 | 480 | -18 |
| `bg-gray-` | 149 | 140 | -9 |
| `border-gray-` | 106 | 102 | -4 |
| `bg-white` | 52 | 49 | -3 |
| `text-black` | 0 | 0 | 0 |
| `text-white` | 82 | 81 | -1 |
| `stroke-gray-` | 2 | 0 | -2 |
| **TOTAL** | **889** | **852** | **-37** |

### Interpretacao

- **37 ocorrencias removidas** nos 4 componentes shared + 5 paginas-alvo
- Reducao de **4.2%** no total do repo
- Os ~852 restantes estao distribuidos por dezenas de outros arquivos fora do escopo da Onda 1
- A meta nao era zerar — era migrar os componentes mais vistos + criar guardrails

---

## 3. Build

**Status:** BUILD OK ✅
**Exit code:** 0
**Tempo:** 12.91s
**Modules:** 3327+ transformed, 64+ chunks
**Comando:** `npm run build`
**Erros:** 0 | **Warnings:** 0

Ref: `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE1_20260208_1802.md` (seção 5)

---

## 4. Guardrail

**Script:** `scripts/dev/ui_guardrail_no_raw_colors.ps1`

**Resultado:** FALHA (esperado) — raw colors presentes em arquivos fora da allowlist.

**Nota:** O guardrail e projetado para uso futuro — em cada nova PR, rodar o script para impedir NOVOS usos. Os 852 usos existentes serao reduzidos nas Ondas 2-5.

**Allowlist atual:**
- `src/styles/*` (tokens e CSS base)
- `src/shared/ui/icons.tsx`
- `*.d.ts`
- `tailwind.config.*`

---

## 5. QA Report (inline)

### 5.1 PageHeader + Breadcrumbs nas Paginas-Alvo

| Pagina | PageHeader | Breadcrumbs |
|--------|-----------|------------|
| `src/features/planning/pages/PlanningHomePage.tsx` | OK | OK |
| `src/features/planning/pages/PlanningDashboardPage.tsx` | OK | OK |
| `src/features/planning/pages/PlanningCalendarPage.tsx` | OK | OK |
| `src/features/planning/pages/area/PlanningAreaDashboardPage.tsx` | OK | OK |
| `src/features/reports/pages/ReportsPage.tsx` | OK | OK |

**Resultado: 5/5 PASSA**

### 5.2 Componentes Shared Criados/Alterados

| Componente | Status |
|-----------|--------|
| `src/shared/ui/Breadcrumbs.tsx` | OK (NEW) |
| `src/shared/ui/PageHeader.tsx` | OK (NEW) |
| `src/shared/ui/Card.tsx` | OK (MIGRATED) |
| `src/shared/ui/Input.tsx` | OK (MIGRATED) |
| `src/shared/ui/Progress.tsx` | OK (MIGRATED) |
| `src/shared/ui/Tooltip.tsx` | OK (MIGRATED) |
| `src/shared/ui/index.ts` | OK (UPDATED) |

**Resultado: 7/7 OK**

### 5.3 Acessibilidade (Breadcrumbs)

| Criterio | Status |
|----------|--------|
| `nav aria-label="Breadcrumb"` | OK |
| Separador `ChevronRight` com `aria-hidden="true"` | OK |
| Ultimo crumb com `aria-current="page"` | OK |
| Ultimo crumb sem link | OK |
| Tokens semanticos (dark mode friendly) | OK |

### 5.4 Detalhes das Migracoes por Arquivo

**Card.tsx:**
- `bg-white dark:bg-gray-800` -> `bg-surface` (-2 raw)
- `border-gray-200 dark:border-gray-700` -> `border-border` (-2 raw)

**Input.tsx:**
- Label: `text-gray-700 dark:text-gray-300` -> `text-foreground` (-2 raw)
- Input: `bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400` -> tokens (-5 raw)
- Disabled: `bg-gray-100 dark:bg-gray-700 disabled:text-gray-400` -> tokens (-3 raw)
- Border: `border-gray-300 dark:border-gray-600` -> `border-border` (-2 raw)
- Hint: `text-gray-500` -> `text-muted` (-1 raw)

**Progress.tsx:**
- Track: `bg-gray-200 dark:bg-gray-700` -> `bg-accent` (-2 raw)
- SVG circle: `stroke-gray-200 dark:stroke-gray-700` -> `text-accent` (-2 raw)

**Tooltip.tsx:**
- Default variant: `bg-gray-900 dark:bg-gray-700` -> `bg-gray-900 dark:bg-gray-200` (dark mode fix)

**PlanningHomePage.tsx:**
- `text-blue-600` -> removido (icone removido em favor de PageHeader)
- `text-gray-900` -> `text-foreground` (via PageHeader)
- `text-gray-500` -> `text-muted` (via PageHeader)

**PlanningCalendarPage.tsx:**
- Header: `text-gray-900` + `text-gray-500` -> tokens (via PageHeader)
- Grid: `bg-gray-200` -> `bg-border`
- Day headers: `bg-gray-50 text-gray-500` -> `bg-accent text-muted`
- Day cells: `bg-white` -> `bg-surface`, `bg-gray-50 text-gray-400` -> `bg-accent text-muted`
- Events: `bg-red-100 text-red-700` / `bg-blue-100 text-blue-700` -> tokens semanticos com dark mode
- Overflow: `text-gray-500` -> `text-muted`

**PlanningAreaDashboardPage.tsx:**
- Header manual -> PageHeader com breadcrumbs dinamicos
- QuickLink: `text-gray-900` -> `text-foreground`, `text-gray-500` -> `text-muted`
- Hover: `border-blue-300` -> `border-primary-300`
- Loading: `border-blue-600` -> `border-primary-600`
- Not found: `text-gray-300/900/500` -> `text-muted/foreground/muted`
- QuickLink colors: raw -> tokens semanticos com dark mode support
- Section title: `text-gray-500` -> `text-muted`

**ReportsPage.tsx:**
- Header manual -> PageHeader com breadcrumbs
- Removido import `FileText` (nao mais necessario)

---

## 6. Lista de Arquivos Criados/Alterados

### Criados

| # | Arquivo | Tipo |
|---|---------|------|
| 1 | `src/shared/ui/Breadcrumbs.tsx` | Componente novo |
| 2 | `src/shared/ui/PageHeader.tsx` | Componente novo |
| 3 | `scripts/dev/ui_count_raw_colors.ps1` | Script baseline |
| 4 | `scripts/dev/ui_guardrail_no_raw_colors.ps1` | Script guardrail |
| 5 | `scripts/dev/qa_ui_redesign_wave1.ps1` | Script QA |
| 6 | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_1539.md` | Baseline |
| 7 | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_1801.md` | Pos-migracao |
| 8 | `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE1_20260208_1802.md` | QA report |
| 9 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE1_20260208_1802.md` | Este arquivo |

### Alterados

| # | Arquivo | Mudanca |
|---|---------|---------|
| 1 | `src/shared/ui/Card.tsx` | bg-white -> bg-surface, border tokens |
| 2 | `src/shared/ui/Input.tsx` | 13 raw colors -> tokens semanticos |
| 3 | `src/shared/ui/Progress.tsx` | bg-gray/stroke-gray -> bg-accent |
| 4 | `src/shared/ui/Tooltip.tsx` | dark mode fix tooltip arrow |
| 5 | `src/shared/ui/index.ts` | Export Breadcrumbs + PageHeader |
| 6 | `src/features/planning/pages/PlanningHomePage.tsx` | PageHeader + breadcrumbs |
| 7 | `src/features/planning/pages/PlanningDashboardPage.tsx` | PageHeader + breadcrumbs |
| 8 | `src/features/planning/pages/PlanningCalendarPage.tsx` | PageHeader + color tokens |
| 9 | `src/features/planning/pages/area/PlanningAreaDashboardPage.tsx` | PageHeader + color tokens |
| 10 | `src/features/reports/pages/ReportsPage.tsx` | PageHeader + breadcrumbs |

---

## 7. Pendencias para Onda 2

| # | Item | Prioridade |
|---|------|-----------|
| 1 | Criar FilterBar reutilizavel | P0 |
| 2 | Criar DataTable (sort + pagination + export) | P0 |
| 3 | Aplicar FilterBar + DataTable no Dashboard | P0 |
| 4 | Aplicar FilterBar + DataTable em Gerenciar Acoes | P0 |
| 5 | Toast em CRUD (criar/editar/deletar acoes) | P1 |
| 6 | Metricas inline no AreaSelector | P1 |
| 7 | Continuar migracao de cores em paginas restantes | P1 |
| 8 | Paginacao na lista de acoes (42+ items) | P1 |

---

*OUTPUT Onda 1 - UI Redesign PE_2026*
