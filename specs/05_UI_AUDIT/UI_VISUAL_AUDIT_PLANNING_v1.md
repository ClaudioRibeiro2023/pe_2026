# UI/UX Visual Audit - Modulo Planejamento (PE_2026)

**Data:** 2026-02-06  
**Versao:** v1  
**Escopo:** Modulo Planning + navegacao base + shared UI  
**Metodo:** Analise estatica de codigo (sem screenshots)  

---

## 1. Sumario Executivo

### Como a UI se comporta hoje

A plataforma PE_2026 apresenta uma interface corporativa limpa, construida com **React + TailwindCSS** sem dependencia de library UI externa (sem shadcn, sem Radix, sem MUI). Todos os componentes sao custom, localizados em `src/shared/ui/`. O design system e baseado em **CSS custom properties** (tokens) com suporte a dark mode via classe `.dark`.

**Pontos fortes:**
- Design token system bem estruturado (`tokens.css` + `tailwind.config.ts`)
- Componentes base com API consistente (variant/size pattern)
- Suporte a dark mode em todos os tokens
- Loading/Empty/Error states implementados
- Focus-visible styles globais
- Skip-to-main-content para acessibilidade
- Animacoes respeitam `prefers-reduced-motion`

**Pontos fracos:**
- **Inconsistencia de cor**: mistura `text-gray-*` (Tailwind raw) com `text-foreground`/`text-muted` (tokens) - 104 usos de `text-gray-500` vs 81 de `text-muted` para o mesmo proposito
- **Sem breadcrumbs** no modulo Planning
- **Sem feedback toast** em acoes CRUD (criar/editar/aprovar)
- **Responsive limitado**: grid usa `md:` e `lg:` mas tabelas nao tem scroll horizontal em mobile
- **Calendario hardcoded**: cores inline (`bg-red-100`, `bg-blue-100`) em vez de tokens
- **Pages thin-wrapper**: 4 das 5 sub-pages de Planning sao wrappers de 6 linhas que apenas renderizam `AreaPlansListPage`
- **Subnav duplica sidebar**: AreaSubnav repete links que ja existem na navegacao principal
- **Sem paginacao** em listas longas de acoes (42+ acoes RH renderizadas de uma vez)
- **Export buttons** existem como componente mas nao estao integrados em nenhuma page do Planning
- **Sem indicador de area ativa** alem do subnav (nao ha badge/tag persistente)

### 10 Prioridades de Redesign

| # | Prioridade | Impacto | Esforco |
|---|-----------|---------|---------|
| 1 | Unificar cores: eliminar `text-gray-*` inline, usar apenas tokens semanticos | Alto | Medio |
| 2 | Adicionar breadcrumbs no Planning (area > view) | Alto | Baixo |
| 3 | Integrar toast feedback em acoes CRUD | Alto | Baixo |
| 4 | Implementar paginacao/virtualizacao em listas de acoes | Alto | Medio |
| 5 | Redesign do ReportsPage (placeholder -> hub funcional) | Alto | Alto |
| 6 | Tornar calendario responsivo e usar tokens de cor | Medio | Medio |
| 7 | Consolidar pages thin-wrapper (Kanban/Timeline/Calendar) com tabs | Medio | Medio |
| 8 | Adicionar ExportButtons nas pages de dados (Dashboard, List) | Medio | Baixo |
| 9 | Melhorar AreaSelector com metricas inline (progresso, alertas) | Medio | Medio |
| 10 | Criar componente PageHeader padrao (titulo + descricao + actions) | Medio | Baixo |

---

## 2. Mapa de Navegacao e Paginas

### 2.1 Sidebar (navegacao principal)

5 secoes definidas em `src/shared/config/navigation.ts`:

| Secao | Roles | Itens |
|-------|-------|-------|
| Visao Geral | todos | Dashboard, Metas, Indicadores |
| Gerencial | todos | Calendario, Relatorios |
| Planejamento | todos | Planos por Area (com subitens: Dashboard, Kanban, Timeline, Calendar) |
| Analises | admin, direcao, gestor | Scoreboard, Insights, Data Health |
| Configuracoes | admin, gestor | Usuarios, Contextos, Migracao, Validacao, Templates |

### 2.2 Inventario de Paginas - Planning

| Rota | Arquivo | Objetivo | Componentes | Estados | Acoes |
|------|---------|----------|-------------|---------|-------|
| `/planning` | `PlanningHomePage.tsx` | Selecao de area | AreaSelector, Card, Button | loading, empty (sem areas), lista | Selecionar area, continuar ultima area, trocar area |
| `/planning/dashboard` | `PlanningDashboardPage.tsx` | Dashboard consolidado todas as areas | StatCards (4x), ProgressBar por area, AlertCards | loading (PageLoader), error (ErrorState), empty (EmptyState), dados | Navegar para area, ver acoes atrasadas |
| `/planning/kanban` | `PlanningKanbanPage.tsx` | Lista de acoes (wrapper) | AreaPlansListPage | (delegado) | (delegado) |
| `/planning/timeline` | `PlanningTimelinePage.tsx` | Timeline de acoes (wrapper) | AreaPlansListPage | (delegado) | (delegado) |
| `/planning/calendar` | `PlanningCalendarPage.tsx` | Calendario mensal de prazos | Card, Button, grid calendar | loading, dados | Navegar meses, filtrar, clicar evento |
| `/planning/actions/manage` | `ActionsManagePage.tsx` | Gerenciar acoes por pack | AreaPlansListPage | (delegado) | Filtrar por pack/area |
| `/planning/actions/new` | `ActionsNewPage.tsx` | Criar nova acao | - | - | Criar |
| `/planning/actions/templates` | `ActionsTemplatesPage.tsx` | Templates de acoes | - | - | - |
| `/planning/actions/approvals` | `ActionsApprovalsPage.tsx` | Aprovacoes pendentes | - | - | Aprovar/Rejeitar |
| `/planning/actions/evidences` | `ActionsEvidencesPage.tsx` | Evidencias pendentes | - | - | Enviar/Validar |
| `/planning/:areaSlug/dashboard` | `PlanningAreaDashboardPage.tsx` | Dashboard da area especifica | AreaSubnav, Cards, Progress | (delegado) | Navegar sub-views |
| `/planning/:areaSlug/kanban` | `PlanningAreaKanbanPage.tsx` | Kanban da area | AreaSubnav, Kanban board | (delegado) | Drag & drop, filtrar |
| `/planning/:areaSlug/calendar` | `PlanningAreaCalendarPage.tsx` | Calendario da area | AreaSubnav, Calendar | (delegado) | Navegar meses |
| `/planning/:areaSlug/timeline` | `PlanningAreaTimelinePage.tsx` | Timeline da area | AreaSubnav, Timeline | (delegado) | Filtrar |
| `/planning/:areaSlug/pe-2026` | `PlanningAreaStrategicPackPage.tsx` | Strategic Pack da area | AreaSubnav, Pack viewer | (delegado) | Ver secoes, acoes |
| `/reports` | `ReportsPage.tsx` | Hub de relatorios | Card (placeholder) | dados (placeholder) | Nenhuma (placeholder) |

### 2.3 Layout Planning Area

```
AppShell
  +-- Sidebar (nav principal)
  +-- Topbar
  +-- Main Content
       +-- PlanningAreaLayout
            +-- AreaSubnav (tabs: Dashboard, Kanban, Calendar, Timeline, PE-2026)
            +-- <Outlet/> (page da area)
```

---

## 3. Auditoria de Estilo (Design Tokens)

### 3.1 Tipografia

| Token/Classe | Uso | Frequencia |
|-------------|-----|-----------|
| Font family | `Inter`, system-ui, sans-serif | Global (html) |
| Font mono | `SF Mono`, Fira Code, monospace | StatCard values |
| `text-sm` (0.875rem) | Corpo de texto, labels, descricoes | **200x** (mais usado) |
| `text-xs` (0.75rem) | Badges, metadados, hints | 81x |
| `text-lg` (1.125rem) | Card titles | 23x |
| `text-2xl` (1.5rem) | Page titles, stat values | 24x |
| `text-3xl` (1.875rem) | Hero titles (ReportsPage) | 1x |
| `font-medium` (500) | Labels, nav items, body text | **128x** |
| `font-semibold` (600) | Subtitles, card headers | 29x |
| `font-bold` (700) | Page titles, stat numbers | 35x |
| `tracking-[0.16em]` | Nav section titles only | Via `.nav-section-title` |

**Achado:** Escala tipografica e minimalista (sm/xs dominam). Falta uma escala intermediaria — nao ha `text-base` (1rem) nos top 50, indicando que o texto padrao e `text-sm` em vez do `text-base` do Tailwind.

### 3.2 Espacamento

Padroes dominantes extraidos do script:

| Padrao | Classes | Frequencia |
|--------|---------|-----------|
| Gap padrao | `gap-2` (0.5rem) | 78x |
| Gap medio | `gap-3` (0.75rem) | 40x |
| Gap grande | `gap-4` (1rem) | 36x |
| Margin bottom | `mb-1` (0.25rem) | 53x |
| Padding card | `p-4` a `p-6` | 23x + 8x |
| Padding section | `py-12` (3rem) | 31x (empty states) |
| Space-y stack | `space-y-4` / `space-y-6` | 19x / 15x |

**Achado:** Espacamento consistente com 4px grid (gap-1=4px, gap-2=8px, gap-3=12px, gap-4=16px). O `space-y-6` (24px) e usado como separador de secoes. Nao ha tokens customizados de spacing alem de `18` (4.5rem) e `88` (22rem) no tailwind.config.

### 3.3 Cores

**Tokens semanticos definidos (tokens.css):**

| Token | Valor Light | Valor Dark | Uso |
|-------|-----------|-----------|-----|
| `--background` | gray-50 (250,250,250) | gray-900 | Body bg |
| `--surface` | white | gray-800 | Cards, modals |
| `--foreground` | gray-900 (23,23,23) | gray-50 | Texto principal |
| `--foreground-muted` | gray-500 (115,115,115) | gray-400 | Texto secundario |
| `--border` | gray-200 (229,229,229) | gray-700 | Bordas |
| `--corp-primary-600` | 0,98,184 | - | Azul corporativo |
| `--corp-success-600` | 21,128,61 | - | Verde status |
| `--corp-danger-600` | 185,28,28 | - | Vermelho erro |
| `--corp-warning-600` | 161,98,7 | - | Amarelo alerta |

**Inconsistencia critica de cores:**

| Classe Token | Frequencia | Classe Raw Equivalente | Frequencia |
|-------------|-----------|----------------------|-----------|
| `text-muted` | 81x | `text-gray-500` | **104x** |
| `text-foreground` | 34x | `text-gray-900` | **51x** |
| `border-border` | 40x | `border-gray-300` | **25x** |
| `bg-surface` | 21x | `bg-white` | ~15x |

**Achado:** As classes raw do Tailwind (`text-gray-*`) sao usadas MAIS do que os tokens semanticos. Isso significa que ~60% dos textos secundarios nao respondem ao dark mode corretamente. Prioridade #1 de refatoracao.

### 3.4 Bordas, Radius e Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-lg` (0.5rem) | Cards, containers | **78x** (padrao dominante) |
| `rounded-full` | Badges, avatars, progress | 37x |
| `rounded-md` (0.375rem) | Buttons | Via Button.tsx |
| `rounded-xl` (0.75rem) | Nav items, modal | Via index.css |
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.03)` | Sutil |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.05)` | Cards hover |
| `shadow-md` | `0 4px 6px ...` | Dropdowns |
| `shadow-lg` | `0 10px 15px ...` | Modals, tooltips |

**Achado:** Border radius tem 4 variantes (sm/md/lg/xl) mas na pratica `rounded-lg` domina (78x). Cards usam `rounded-lg`, modal usa `rounded-xl`, nav usa `rounded-xl` — inconsistencia menor. Sombras sao extremamente sutis (low opacity), alinhado com tendencia corporate clean.

### 3.5 Component Library e Tema

- **Framework CSS:** TailwindCSS v3 (via `tailwind.config.ts`)
- **UI Library externa:** Nenhuma (sem shadcn, sem Radix, sem MUI)
- **Todos os componentes sao custom:** `src/shared/ui/` (24 arquivos)
- **Tema definido em:**
  - `src/styles/tokens.css` — CSS custom properties (design tokens)
  - `src/styles/index.css` — Tailwind directives + component classes
  - `tailwind.config.ts` — Mapeamento tokens -> Tailwind classes
- **Dark mode:** Via classe `.dark` no `<html>` (`darkMode: 'class'`)
- **Utility helper:** `cn()` (wrapper de `clsx` + `tailwind-merge`)

### 3.6 Icones

- **Biblioteca:** Lucide React (tree-shakeable)
- **Importacao:** Re-exportados via `src/shared/ui/icons.tsx` (109 linhas)
- **Tamanhos padrao:** `h-4 w-4` (129x/126x), `h-5 w-5` (66x/64x), `h-8 w-8` (34x/31x)
- **Consistencia:** Alta — todos os icones vem de Lucide, nao ha SVGs inline ou icon fonts
- **Achado:** Alguns componentes importam diretamente de `lucide-react` em vez de `@/shared/ui/icons` (ex: `AreaSubnav.tsx`, `PlanningHomePage.tsx`), causando warnings de dynamic imports no build

---

## 4. Auditoria de Componentes (UI Kit Real)

### 4.1 Inventario Completo

| Componente | Arquivo | Variants | Sizes | Estados | Dark Mode |
|-----------|---------|----------|-------|---------|-----------|
| **Button** | Button.tsx | primary, secondary, outline, ghost, danger | sm, md, lg | loading, disabled | Sim |
| **Card** | Card.tsx | - | - | - | Parcial (hardcoded `bg-white`) |
| **Badge** | Badge.tsx | default, primary, success, warning, danger, info | sm, md, lg | pulse | Sim |
| **Input** | Input.tsx | - | - | error, disabled, hint | Parcial (hardcoded colors) |
| **Select** | Select.tsx | - | - | error, disabled, hint | Sim (usa tokens) |
| **Table** | Table.tsx | - | - | hover row | Sim (usa tokens) |
| **Modal** | Modal.tsx | - | sm, md, lg, xl | open/closed | Sim |
| **Toast** | Toast.tsx | success, error, warning, info | - | auto-dismiss (5s) | Parcial |
| **Tooltip** | Tooltip.tsx | default, card | - | visible/hidden | Sim |
| **Progress** | Progress.tsx | default, gradient, segmented | sm, md, lg | auto-status by value | Parcial |
| **CircularProgress** | Progress.tsx | - | configurable | auto-status | Parcial |
| **Skeleton** | Skeleton.tsx | Card, Table, Chart, List | - | - | Sim |
| **EmptyState** | EmptyState.tsx | - | - | - | Sim |
| **ErrorState** | ErrorState.tsx | - | - | retry action | Sim |
| **StatCard** | StatCard.tsx | - | - | trend (up/down/stable) | Sim |
| **Pagination** | Pagination.tsx | - | - | - | - |
| **VirtualizedList** | VirtualizedList.tsx | - | - | - | - |
| **InfoTooltip** | InfoTooltip.tsx | - | - | - | Sim |
| **PageLoader** | Loader.tsx | - | - | - | Sim |
| **Logo** | Logo.tsx | - | - | - | - |
| **ExportButtons** | ExportButtons.tsx | - | sm, md, lg | disabled | Sim |
| **PriorityBadge** | Badge.tsx | P0, P1, P2 | - | - | Sim |
| **NodeTypeBadge** | Badge.tsx | macro, area, meta, pilar, acao | - | - | Sim |

### 4.2 Inconsistencias Detectadas

| Componente | Inconsistencia | Severidade |
|-----------|----------------|-----------|
| **Card** | `bg-white dark:bg-gray-800` hardcoded em vez de `bg-surface` | Alta |
| **Input** | Usa `text-gray-700 dark:text-gray-300` em label em vez de `text-foreground` | Media |
| **Input** | Usa `bg-white dark:bg-gray-800` em vez de `bg-surface` | Media |
| **Input** | Usa `border-gray-300 dark:border-gray-600` em vez de `border-border` | Media |
| **Button** | `rounded-md` enquanto Cards usam `rounded-lg` e Nav usa `rounded-xl` | Baixa |
| **Progress** | `bg-gray-200 dark:bg-gray-700` hardcoded em vez de token | Media |
| **Tooltip** | Default variant usa `bg-gray-900 dark:bg-gray-700` hardcoded | Baixa |
| **AreaSubnav** | `bg-white border-gray-200` hardcoded | Alta |
| **Calendar** | Cores inline `bg-red-100 text-red-700` sem tokens | Alta |

---

## 5. Auditoria de UX (Heuristica)

### 5.1 Hierarquia Visual e Foco

- **Page titles:** `text-2xl font-bold` — clara hierarquia H1
- **Section titles:** `text-lg font-semibold` via CardTitle — boa separacao
- **Body text:** `text-sm font-medium` domina — pode ser denso demais para leitura longa
- **Achado:** Falta distintor visual entre niveis intermediarios. H2/H3 nao tem estilo padronizado.

### 5.2 Densidade Informacional

- **Dashboard:** 4 stat cards + tabela de progresso por area + cards de alerta — **densidade alta, bem organizada**
- **AreaSelector:** Cards de area com gradiente + info — **densidade confortavel**
- **Kanban/Timeline/Calendar:** Wrappers para AreaPlansListPage — **densidade delegada**
- **Achado:** PlanningCalendarPage tem celulas de `min-h-[100px]` que podem comprimir em viewports pequenos

### 5.3 Feedback (Loading/Success/Error)

| Estado | Implementacao | Cobertura |
|--------|-------------|-----------|
| **Loading** | `PageLoader` (spinner + text), `Skeleton` (4 variantes) | Alta — todas as queries tem loading state |
| **Empty** | `EmptyState` (icon + titulo + descricao + action) | Alta — dashboard, listas |
| **Error** | `ErrorState` (titulo + mensagem + retry) | Alta — queries com isError |
| **Success** | Toast system existe mas **nao e usado** em acoes CRUD | **Baixa** — gap critico |
| **In-progress** | `animate-spin` spinner (15 usos) | Media |

**Achado critico:** O sistema de Toast (`ToastProvider` + `useToast`) esta implementado mas praticamente nao e usado em acoes do usuario (criar, editar, aprovar, deletar). O usuario nao recebe confirmacao visual de que sua acao teve sucesso.

### 5.4 Navegacao

| Elemento | Status | Nota |
|---------|--------|------|
| **Sidebar** | Implementado | 5 secoes, collapse, scroll indicator, role-based filtering |
| **Breadcrumbs** | **Ausente** | Nao ha breadcrumbs em nenhuma page |
| **AreaSubnav** | Implementado | Tabs horizontais (Dashboard/Kanban/Calendar/Timeline/PE-2026) |
| **Quick actions** | Parcial | Botoes de acao no header de algumas pages, mas sem padronizacao |
| **Back navigation** | **Ausente** | Nao ha botao "Voltar" em sub-pages |
| **Active state** | Sidebar OK, Subnav OK | NavLink com `isActive` class |

### 5.5 Acessibilidade (10 achados)

| # | Achado | Tipo | Evidencia |
|---|--------|------|-----------|
| 1 | `skip-to-main` implementado | Positivo | `index.css` linhas 62-77 |
| 2 | `prefers-reduced-motion` respeitado | Positivo | `index.css` linhas 45-53 |
| 3 | `focus-visible` global com ring | Positivo | `index.css` linhas 145-147 |
| 4 | Modal tem `role="dialog"` e `aria-modal` | Positivo | `Modal.tsx` linhas 67-69 |
| 5 | Modal fecha com Escape | Positivo | `Modal.tsx` linhas 28-30 |
| 6 | Tooltip tem `role="tooltip"` | Positivo | `Tooltip.tsx` linha 121 |
| 7 | Input/Select tem `htmlFor` + `id` linkados | Positivo | `Input.tsx` linha 12, `Select.tsx` linha 21 |
| 8 | AreaCard nao tem `role="button"` nem `tabIndex` | **Negativo** | `AreaSelector.tsx` — div clicavel sem semantica |
| 9 | Calendar grid nao tem `role="grid"` nem aria-labels | **Negativo** | `PlanningCalendarPage.tsx` — grid de divs sem semantica |
| 10 | Tabelas do dashboard nao tem `<caption>` nem `aria-label` | **Negativo** | Progresso por area usa divs em vez de `<table>` |

---

## 6. CSS Architecture

### 6.1 Estrutura de Arquivos

```
src/styles/
  tokens.css         — Design tokens (CSS custom properties) - 96 linhas
  index.css          — Tailwind imports + base/components/utilities - 339 linhas

src/shared/styles/
  animations.css     — Animacoes customizadas

tailwind.config.ts   — Configuracao Tailwind (cores, fonts, spacing, shadows) - 119 linhas
```

### 6.2 Fluxo de Tema

```
tokens.css (CSS vars: --corp-primary-600, --background, etc.)
    |
    v
tailwind.config.ts (mapeia vars para classes: bg-primary-600, bg-surface, etc.)
    |
    v
index.css (@tailwind base/components/utilities + component classes como .nav-item)
    |
    v
Componentes TSX (usam classes Tailwind via className + cn())
```

### 6.3 Convencoes

- **Utility-first:** Tailwind classes diretamente no JSX
- **Composicao:** `cn()` (clsx + tailwind-merge) para merge condicional
- **Component classes:** Poucas, definidas em `@layer components` (`.nav-item`, `.nav-section-title`, `.calendar-custom`)
- **Sem CSS Modules**
- **Sem styled-components**
- **Sem SASS/LESS**

### 6.4 Riscos Atuais

| Risco | Severidade | Detalhes |
|-------|-----------|----------|
| **Cor inconsistente** | Alta | 60% dos textos secundarios usam `text-gray-*` raw em vez de `text-muted`/`text-foreground`. Dark mode quebra nessas areas. |
| **Duplicacao de estilos** | Media | Cards de stat no dashboard repetem o mesmo pattern de `flex items-center justify-between` + icon + texto em 4 blocos identicos sem componentizar. |
| **Acoplamento area-plans** | Media | 4 planning pages sao wrappers de 6 linhas para `AreaPlansListPage`. Forte acoplamento sem separacao de concerns. |
| **Inline styles** | Baixa | Progress bars usam `style={{ width: ... }}` para porcentagem — inevitavel mas mistura paradigmas. |
| **Import inconsistente** | Baixa | Alguns arquivos importam icones de `lucide-react` direto, outros de `@/shared/ui/icons`. Causa warnings no build. |

---

## 7. Recomendacoes para Redesign

### 7.1 Scorecard Proposto

| Criterio | Peso | Score Atual (1-5) | Target |
|----------|------|-------------------|--------|
| Consistencia de cor (tokens vs raw) | 20% | 2 | 5 |
| Feedback ao usuario (toast/loading) | 15% | 3 | 5 |
| Acessibilidade (WCAG 2.1 AA) | 15% | 3 | 4 |
| Responsividade (1024px-1920px) | 10% | 3 | 4 |
| Hierarquia visual | 10% | 4 | 5 |
| Navegacao e wayfinding | 10% | 3 | 5 |
| Component API consistency | 10% | 4 | 5 |
| Dark mode coverage | 10% | 2 | 4 |
| **Score Ponderado** | | **2.85** | **4.65** |

### 7.2 Direcao Visual Sugerida

- **Manter:** Tipografia Inter, paleta azul corporativa, layout sidebar+content, shadows sutis
- **Evoluir:** Unificar todas as cores para tokens semanticos, adicionar elevation system (0-4 niveis), padronizar border-radius (escolher 1 padrao: `rounded-lg`)
- **Adicionar:** Breadcrumbs, toast feedback consistente, PageHeader component, componente de filtro reutilizavel
- **Simplificar:** Remover wrappers thin de 6 linhas, consolidar views com tabs em vez de rotas separadas

### 7.3 Paginas Criticas para Comecar

| # | Pagina | Motivo |
|---|--------|--------|
| 1 | `/reports` | Placeholder — precisa ser construido do zero (Sprint 5) |
| 2 | `/planning/dashboard` | Pagina mais visitada, define o tom visual |
| 3 | `/planning/:area/dashboard` | Dashboard de area — alta visibilidade |
| 4 | `/planning/calendar` | Calendario com cores hardcoded, sem responsividade |
| 5 | `/planning` (Home) | AreaSelector define primeira impressao do modulo |

### 7.4 Componentes Criticos para Criar/Ajustar

| # | Componente | Acao | Impacto |
|---|-----------|------|---------|
| 1 | **PageHeader** | Criar (titulo + desc + breadcrumbs + actions) | Padroniza todas as pages |
| 2 | **Card** | Ajustar (`bg-white` -> `bg-surface`) | Corrige dark mode em todos os cards |
| 3 | **Input** | Ajustar (cores raw -> tokens) | Corrige dark mode em formularios |
| 4 | **FilterBar** | Criar (area + pack + periodo + status) | Reutilizavel em Reports e listas |
| 5 | **DataTable** | Criar (Table + sort + pagination + export) | Substitui tabelas manuais |
| 6 | **ReportCard** | Criar (titulo + preview + tipo + export actions) | Base para Sprint 5 Reports |
| 7 | **Breadcrumb** | Criar | Wayfinding em todo o Planning |
| 8 | **AreaBadge** | Criar (nome + cor + progresso inline) | Identificacao de area em contexto |

---

## Anexo A: Tailwind Classes Extraction

**Script:** `scripts/dev/extract_tailwind_classes_planning.cjs`  
**Files scanned:** 104  
**Unique classes:** 453  

### Top 20 (dominantes)

| # | Classe | Contagem | Categoria |
|---|--------|------:|-----------|
| 1 | `flex` | 256 | Layout |
| 2 | `items-center` | 216 | Layout |
| 3 | `text-sm` | 200 | Typography |
| 4 | `h-4` | 129 | Sizing |
| 5 | `font-medium` | 128 | Typography |
| 6 | `w-4` | 126 | Sizing |
| 7 | `text-gray-500` | 104 | Color (RAW) |
| 8 | `text-xs` | 81 | Typography |
| 9 | `text-muted` | 81 | Color (TOKEN) |
| 10 | `gap-2` | 78 | Spacing |
| 11 | `rounded-lg` | 78 | Border |
| 12 | `h-5` | 66 | Sizing |
| 13 | `w-5` | 64 | Sizing |
| 14 | `border` | 61 | Border |
| 15 | `mb-1` | 53 | Spacing |
| 16 | `text-gray-900` | 51 | Color (RAW) |
| 17 | `justify-between` | 49 | Layout |
| 18 | `text-gray-700` | 49 | Color (RAW) |
| 19 | `text-center` | 44 | Other |
| 20 | `flex-1` | 43 | Layout |

### Distribuicao por Categoria

| Categoria | Classes Unicas | Mais Frequente |
|-----------|---------------|---------------|
| Layout | ~25 | `flex` (256x) |
| Typography | ~15 | `text-sm` (200x) |
| Spacing | ~30 | `gap-2` (78x) |
| Colors | ~50 | `text-gray-500` (104x) |
| Sizing | ~20 | `h-4` (129x) |
| Borders | ~15 | `rounded-lg` (78x) |
| Effects | ~10 | `transition-colors` (23x) |

---

## Anexo B: Responsividade

### Breakpoints Usados

| Breakpoint | Classe | Usos Encontrados |
|-----------|--------|-----------------|
| `sm:` (640px) | `sm:flex-row`, `sm:items-center` | ~5 usos (Dashboard header) |
| `md:` (768px) | `md:grid-cols-2`, `md:grid-cols-4` | ~15 usos (stat cards, grids) |
| `lg:` (1024px) | `lg:grid-cols-3` | ~5 usos (AreaSelector) |
| `xl:` (1280px) | - | Nao encontrado |

### Elementos que Quebram

| Elemento | Breakpoint Critico | Problema |
|---------|-------------------|---------|
| Dashboard stat cards | < 768px | 4 colunas comprimem (usa `grid-cols-2 md:grid-cols-4`) |
| Calendar grid | < 768px | 7 colunas nao cabem, sem scroll horizontal |
| AreaSubnav tabs | < 640px | `overflow-x-auto` existe mas pode ficar apertado |
| Tabelas de acoes | < 1024px | Sem scroll horizontal em dados largos |

---

*Gerado automaticamente - PE_2026 UI Visual Audit v1*
