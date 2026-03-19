# Design System v1 — PE_2026

**Data:** 2026-02-06  
**Versao:** v1  
**Baseline:** tokens.css + tailwind.config.ts + src/shared/ui/

---

## 1. Tokens

### 1.1 Cores Semanticas

> **Regra:** Zero `text-gray-*`, `bg-white`, `border-gray-*` fora do mapeamento tokens.css/tailwind.config.ts.  
> Conversao gradual: cada Onda do redesign elimina usos raw nos arquivos tocados.

| Token CSS | Classe Tailwind | Uso | Light | Dark |
|-----------|----------------|-----|-------|------|
| `--background` | `bg-background` | Body, page bg | gray-50 | gray-900 |
| `--surface` | `bg-surface` | Cards, panels, inputs | white | gray-800 |
| `--surface-elevated` | `bg-surface-elevated` | Dropdowns, popovers | gray-100 | gray-700 |
| `--foreground` | `text-foreground` | Texto principal | gray-900 | gray-50 |
| `--foreground-muted` | `text-muted` | Texto secundario, labels | gray-500 | gray-400 |
| `--border` | `border-border` | Bordas normais | gray-200 | gray-700 |
| `--border-strong` | `border-border-strong` | Bordas enfatizadas | gray-300 | gray-600 |
| `--corp-primary-600` | `text-primary-600` / `bg-primary-600` | Azul corporativo | #0062B8 | #0062B8 |
| `--corp-success-600` | `text-success-600` / `bg-success-600` | Verde status | #15803D | #15803D |
| `--corp-danger-600` | `text-danger-600` / `bg-danger-600` | Vermelho erro | #B91C1C | #B91C1C |
| `--corp-warning-600` | `text-warning-600` / `bg-warning-600` | Amarelo alerta | #A16207 | #A16207 |
| `--corp-info-600` | `text-info-600` / `bg-info-600` | Azul info | #0369A1 | #0369A1 |

### 1.2 Cores de Status de Acao

| Status | Token | Badge Variant | Cor (Light) |
|--------|-------|---------------|-------------|
| PENDENTE | `--status-pending` | `default` | gray-400 |
| EM_ANDAMENTO | `--status-in-progress` | `primary` | primary-500 |
| BLOQUEADA | `--status-blocked` | `danger` | danger-500 |
| AGUARDANDO_EVIDENCIA | `--status-awaiting` | `warning` | warning-500 |
| EM_VALIDACAO | `--status-validating` | `info` | info-500 |
| CONCLUIDA | `--status-done` | `success` | success-500 |
| CANCELADA | `--status-cancelled` | `default` | gray-500 |

### 1.3 Tipografia

| Scale | Class | Size | Weight | Uso |
|-------|-------|------|--------|-----|
| **Display** | `text-2xl font-bold` | 1.5rem / 24px | 700 | Page titles, hero numbers |
| **Title** | `text-lg font-semibold` | 1.125rem / 18px | 600 | Card headers, section titles |
| **Subtitle** | `text-base font-medium` | 1rem / 16px | 500 | Sub-headers (NOVO — escala intermediaria) |
| **Body** | `text-sm font-normal` | 0.875rem / 14px | 400 | Texto padrao, descricoes |
| **Label** | `text-sm font-medium` | 0.875rem / 14px | 500 | Labels, nav items |
| **Caption** | `text-xs text-muted` | 0.75rem / 12px | 400 | Metadados, hints |
| **Mono** | `text-sm font-mono` | 0.875rem / 14px | 400 | IDs, codigos, valores |

**Font stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`  
**Mono stack:** `'SF Mono', 'Fira Code', monospace`

### 1.4 Espacamento

| Token | Valor | Classe | Uso |
|-------|-------|--------|-----|
| `space-1` | 4px | `gap-1`, `p-1` | Spacing minimo (entre icone e texto) |
| `space-2` | 8px | `gap-2`, `p-2` | Gap padrao entre elementos inline |
| `space-3` | 12px | `gap-3`, `p-3` | Gap medio entre cards horizontais |
| `space-4` | 16px | `gap-4`, `p-4` | Padding interno de cards |
| `space-5` | 20px | `gap-5`, `p-5` | Padding interno de secoes |
| `space-6` | 24px | `gap-6`, `space-y-6` | Separador entre secoes |
| `space-8` | 32px | `gap-8`, `py-8` | Separador entre blocos de pagina |

### 1.5 Border Radius

| Token | Valor | Classe | Uso |
|-------|-------|--------|-----|
| `radius-sm` | 0.25rem / 4px | `rounded-sm` | Badges inline |
| `radius-md` | 0.375rem / 6px | `rounded-md` | Buttons, inputs |
| `radius-lg` | 0.5rem / 8px | `rounded-lg` | Cards, containers (PADRAO) |
| `radius-xl` | 0.75rem / 12px | `rounded-xl` | Modals, nav items |
| `radius-full` | 9999px | `rounded-full` | Avatars, progress bars, pills |

> **Decisao:** `rounded-lg` e o padrao para containers. Buttons usam `rounded-md`. Modals usam `rounded-xl`.

### 1.6 Sombras (Elevation System)

| Level | Token | Classe | Uso |
|-------|-------|--------|-----|
| 0 — Flat | nenhuma | - | Elementos inline, badges |
| 1 — Raised | `--shadow-xs` | `shadow-xs` | Cards em repouso |
| 2 — Elevated | `--shadow-sm` | `shadow-sm` | Cards hover, dropdowns |
| 3 — Overlay | `--shadow-md` | `shadow-md` | Popovers, tooltips |
| 4 — Modal | `--shadow-lg` | `shadow-lg` | Modals, dialogs |

### 1.7 Estados Interativos

| Estado | Estilo | Transicao |
|--------|--------|-----------|
| **Default** | Normal | - |
| **Hover** | `hover:shadow-sm` + `hover:border-primary-300` | `transition-all duration-150` |
| **Focus** | `focus-visible:ring-2 ring-primary-500 ring-offset-2` | instantaneo |
| **Active** | `active:scale-[0.98]` | `duration-75` |
| **Disabled** | `opacity-50 cursor-not-allowed` | - |
| **Loading** | Skeleton ou spinner | `animate-pulse` ou `animate-spin` |
| **Error** | `border-danger-500 text-danger-600` | - |
| **Success** | Toast + checkmark icon | `duration-200` |

---

## 2. Componentes Alvo

### 2.1 PageHeader (NOVO)

```
+----------------------------------------------------------+
| [Breadcrumbs: Planejamento > RH > Dashboard]             |
| [H1] Dashboard da Area RH              [Actions: + | PDF]|
| [Subtitle] Progresso e acoes do pack-rh-2026             |
+----------------------------------------------------------+
```

**Props:**
- `title: string` — Titulo da pagina (H1)
- `subtitle?: string` — Descricao curta
- `breadcrumbs: BreadcrumbItem[]` — Trilha de navegacao
- `actions?: ReactNode` — Botoes de acao (direita)
- `badge?: ReactNode` — Badge de contexto (ex: "RH", "42 acoes")

**Tokens:** `bg-surface`, `border-b border-border`, `py-5 px-6`

### 2.2 Breadcrumbs (NOVO)

```
Planejamento > RH > Dashboard
```

**Props:**
- `items: { label: string; href?: string }[]`
- Ultimo item sem link (pagina atual)
- Separador: `ChevronRight` icon (h-3 w-3 text-muted)

**Acessibilidade:** `<nav aria-label="Breadcrumbs">`, `<ol>`, item atual com `aria-current="page"`

### 2.3 FilterBar (NOVO)

```
+----------------------------------------------------------+
| [Area: RH v] [Pack: pack-rh-2026 v] [Periodo: __|__]    |
| [Status: Todos v] [Prioridade: Todas v]     [Limpar]    |
+----------------------------------------------------------+
```

**Props:**
- `filters: FilterConfig[]` — Array de filtros configurados
- `values: Record<string, any>` — Valores atuais
- `onChange: (key, value) => void`
- `onClear: () => void`

**Layout:** `flex flex-wrap gap-3`, responsivo com `sm:flex-row`

### 2.4 DataTable (NOVO)

```
+----------------------------------------------------------+
| [Search] [Filters]                    [Export PDF | CSV] |
|----------------------------------------------------------|
| ID▲  | Titulo      | Status    | Progresso | Prazo      |
|------|-------------|-----------|-----------|------------|
| RH-01| Acao 1      | [Badge]   | [Bar 75%] | 2026-03-15 |
| ...  | ...         | ...       | ...       | ...        |
|----------------------------------------------------------|
| < 1 2 3 ... 10 >                      42 itens          |
+----------------------------------------------------------+
```

**Props:**
- `data: T[]`
- `columns: ColumnDef<T>[]` — Header, accessor, sort, render
- `pagination?: { page, pageSize, total }`
- `onSort?: (key, direction) => void`
- `exportConfig?: { title, columns }` — Para ExportButtons
- `emptyMessage?: string`
- `loading?: boolean` — Mostra Skeleton

**Acessibilidade:** `<table>` semantico, `<caption>`, `<th scope="col">`, `aria-sort`

### 2.5 Card (AJUSTAR)

**Mudanca:** `bg-white dark:bg-gray-800` → `bg-surface`

```diff
- className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
+ className="bg-surface rounded-lg border border-border shadow-xs"
```

### 2.6 Input (AJUSTAR)

**Mudanca:** Cores hardcoded → tokens

```diff
- className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700"
+ className="bg-surface border-border text-foreground"
```

### 2.7 Badge (MANTER)

Badge ja usa tokens corretamente via variant system. Sem mudancas necessarias.

### 2.8 Toast (MANTER + EXPANDIR USO)

Toast ja funciona. Expandir para todos os CRUDs:
- Criar acao → `{ type: 'success', title: 'Acao criada' }`
- Editar acao → `{ type: 'success', title: 'Acao atualizada' }`
- Deletar acao → `{ type: 'success', title: 'Acao removida' }`
- Aprovar → `{ type: 'success', title: 'Aprovacao registrada' }`
- Erro → `{ type: 'error', title: 'Erro', message: error.message }`

### 2.9 EmptyState / ErrorState / Loading (MANTER)

Ja implementados corretamente. Sem mudancas.

### 2.10 Modal (AJUSTAR MENOR)

Ajustar cores hardcoded para tokens. Funcionalidade OK.

---

## 3. Padroes de Estados

| Estado | Componente | Comportamento |
|--------|-----------|---------------|
| **Loading (page)** | `PageLoader` | Spinner centralizado com texto |
| **Loading (section)** | `Skeleton` | Skeleton cards/table/chart conforme tipo |
| **Loading (button)** | `Button loading` | Spinner inline + texto "Salvando..." |
| **Empty** | `EmptyState` | Icone + titulo + descricao + CTA |
| **Error** | `ErrorState` | Icone + mensagem + botao Retry |
| **Success** | `Toast success` | Toast verde no canto superior direito, 5s |
| **Permission denied** | `EmptyState` customizado | "Voce nao tem permissao para acessar este recurso" |

---

## 4. Padroes de Responsividade

### 4.1 Breakpoints

| Breakpoint | Classe | Viewport | Uso |
|-----------|--------|----------|-----|
| Default | - | < 640px | Mobile (stack vertical) |
| `sm:` | 640px | Tablet portrait | 2 colunas em grids |
| `md:` | 768px | Tablet landscape | 2-3 colunas; sidebar visivel |
| `lg:` | 1024px | Desktop | Layout completo; sidebar + content |
| `xl:` | 1280px | Wide desktop | Grids de 4 colunas |

### 4.2 Padroes por Componente

| Componente | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **PageHeader** | Stack vertical | Inline | Inline com actions |
| **FilterBar** | Stack vertical | 2 por linha | Inline todos |
| **DataTable** | Cards list | Scroll horizontal | Tabela completa |
| **Stat Cards** | 2 colunas | 2 colunas | 4 colunas |
| **Charts** | Full width stacked | 2 colunas | 2 colunas |
| **Calendar** | Scroll horizontal | Full grid | Full grid |
| **Sidebar** | Escondida (hamburger) | Mini (icons only) | Expandida |

### 4.3 Regras

1. **Tabelas:** Sempre `overflow-x-auto` no wrapper
2. **Grids:** Nunca mais de 2 colunas em mobile; usar `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
3. **Formularios:** Stack vertical em mobile, inline em desktop
4. **Charts:** Full width em mobile, side-by-side em desktop

---

## 5. Microinteracoes

| Interacao | Animacao | Duracao | Easing |
|-----------|---------|---------|--------|
| Card hover | `shadow-xs → shadow-sm` | 150ms | ease-out |
| Button press | `scale(0.98)` | 75ms | ease-in |
| Tab switch | `opacity 0→1` + `translateY(-2→0)` | 200ms | ease-out |
| Toast enter | `translateX(100%) → 0` | 300ms | spring |
| Toast exit | `opacity 1→0` + `translateY(0→-8px)` | 200ms | ease-in |
| Modal open | `opacity 0→1` + `scale(0.95→1)` | 200ms | ease-out |
| Skeleton pulse | `opacity 0.5→1→0.5` | 1.5s loop | ease-in-out |
| Loading spinner | `rotate(0→360)` | 750ms loop | linear |

> **Nota:** Todas as animacoes sao desabilitadas se `prefers-reduced-motion: reduce` (ja implementado).

---

## 6. Changelog v1 → v1.1 (2026-02-08)

### Componentes Implementados (Wave1)

| Componente | Status | Wave | Notas |
|-----------|--------|------|-------|
| **PageHeader** | Implementado | W1 | `src/shared/ui/PageHeader.tsx` — 5 pages |
| **Breadcrumbs** | Implementado | W1 | `src/shared/ui/Breadcrumbs.tsx` — ARIA compliant |
| **Card** | Migrado (tokens) | W1 | `bg-surface`, `border-border` |
| **Input** | Migrado (tokens) | W1 | 13 raw colors removidos |
| **Progress** | Migrado (tokens) | W1 | `bg-accent` track, `text-accent` stroke |
| **Tooltip** | Migrado (tokens) | W1 | Dark mode fix |
| **FilterBar** | Pendente | W2 | P0 — proximo |
| **DataTable** | Pendente | W2 | P0 — proximo |

### Backlog DS Wave2 (P0)

| # | Componente | Descricao |
|---|-----------|----------|
| 1 | FilterBar.tsx | Filtros configurados via props (area, pack, status, periodo) |
| 2 | DataTable.tsx | Table + sort + pagination + export integrado |
| 3 | Pagination.tsx | Ajustar para integrar com DataTable |

### Regra Formal: tokens-first

> **A partir de Wave1, todo novo codigo em `src/` deve usar exclusivamente tokens semanticos.**  
> Cores raw (`text-gray-*`, `bg-white`, `border-gray-*`, `bg-gray-*`) sao proibidas em arquivos novos ou alterados.  
> Guardrail: `scripts/dev/ui_guardrail_no_raw_colors.ps1`  
> Modo atual: **nao-regressao** (falha esperada por legado — 852 usos restantes distribuidos no repo).

---

*Documento gerado como parte do Blueprint v1 do UI Redesign — PE_2026 (atualizado v1.1 em 2026-02-08)*
