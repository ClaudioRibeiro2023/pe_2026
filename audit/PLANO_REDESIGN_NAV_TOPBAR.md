# Plano de Redesign — Navegação, Topbar e Padrões do Template Base

> **Base de comparação:** `b:\aero-studio\projects\.bases\template.base` (Next.js 14 + Design System compartilhado)  
> **Alvo:** `b:\aero-studio\projects\estrategico\planejamento-estrategico` (Vite + React Router)  
> **Data:** 22/04/2026  

---

## 1. Avaliação do Template Base

O template base (`.bases/template.base`) é um monorepo pnpm/turbo com `packages/design-system`, `packages/tokens`, `apps/web` e navegação/config dinâmica. É **consideravelmente mais maduro** que o shell atual do PE2026 em 12 dimensões.

### 1.1 Comparativo lado-a-lado

| Dimensão | PE2026 atual | Template base | Gap |
|---|---|---|---|
| **Persistência sidebar** | ✅ localStorage `sidebar-collapsed` | ✅ idem (`SIDEBAR_COLLAPSED_KEY`) | — |
| **Onboarding modal** | ⚠️ Dispara e bloqueia conteúdo; posicionamento falha quando alvo não visível | ✅ Wizard lazy-loaded + dismiss persistente + `UserOnboardingWizard` com steps progressivos | 🔴 Grande |
| **Tooltip sidebar colapsada** | ❌ Apenas `title` HTML | ✅ Tooltip custom com badge + contador de notificações | 🟠 Alto |
| **Badges no sidebar** | ❌ Nenhum | ✅ BETA/DEV/NEW com paleta semântica | 🟡 Médio |
| **Notification count no sidebar** | ❌ Nenhum | ✅ Badge red dot com contagem 99+ | 🟡 Médio |
| **Breadcrumb topbar** | ✅ Via `getBreadcrumbs()` mas sem label amigáveis automáticos | ✅ Dinâmico via pathname + `SEGMENT_LABELS` map | 🟢 Baixo |
| **Focus trap mobile drawer** | ❌ Ausente | ✅ `useFocusTrap` hook | 🟠 Alto (acessibilidade) |
| **Swipe gestures mobile** | ❌ Ausente | ✅ `useSwipe` — abre sidebar com swipe da borda | 🟡 Médio |
| **ScrollProgress indicator** | ❌ Ausente | ✅ Barra fina no topo mostrando scroll da página | 🟢 Baixo |
| **Tenant/Org switcher** | ❌ Ausente | ✅ `TenantSwitcher` na sidebar | 🟢 Baixo (futuro) |
| **Quick Search trigger visível** | ⚠️ Só no topbar | ✅ Também **dentro** da sidebar (pill grande "Buscar… ⌘K") | 🟡 Médio |
| **Grupos de nav com divisores** | ⚠️ Apenas label | ✅ Divisor + label uppercase + tracking | 🟢 Baixo |
| **Active state com glow** | ⚠️ Simples bg-primary-50 | ✅ Radial glow + barra vertical ativa à esquerda | 🟡 Médio |
| **Mobile drawer** | ✅ Existe via `MobileDrawer` | ✅ Embutido no AppSidebar + overlay + swipe + focus trap | 🟡 Médio |
| **Responsive breakpoints** | ⚠️ `hidden lg:flex` binário | ✅ `useScreenMode` (mobile/tablet/desktop) com auto-collapse no tablet | 🟠 Alto |
| **Design tokens centralizados** | ⚠️ Tailwind direto | ✅ Pacote `@template/tokens` com CSS vars + glass/glow/shadow | 🟢 Baixo (refactor maior) |
| **Height topbar** | 64px | 52px | Mais compacto no template |
| **Locale picker** | ❌ | ✅ PT/EN/ES | 🟢 Baixo (futuro) |
| **Role picker (dev)** | ✅ Sim, muito bom | ❌ Não existe | Vantagem PE2026 |

### 1.2 Padrões do template base que devem ser portados

**Alta prioridade — ganho imediato:**
1. Onboarding refatorado (lazy + dismiss por step + não bloqueante em páginas secundárias)
2. Tooltip customizado para sidebar colapsada (substitui `title` HTML)
3. `useScreenMode` (mobile/tablet/desktop) com auto-collapse no tablet
4. Focus trap no mobile drawer
5. Divisores visuais entre grupos da sidebar + tracking nos labels

**Média prioridade — refinamento:**
6. Badges (BETA/NEW) nos itens do menu
7. Notification count inline nos itens (ex.: Aprovações pendentes = 4)
8. Active state com barra vertical + glow
9. Quick Search trigger visível dentro da sidebar (reforça descobribilidade)
10. Breadcrumb com `SEGMENT_LABELS` map para rotulagem automática

**Baixa prioridade — estrutural (futuro):**
11. Centralizar design tokens em módulo próprio (`@/shared/tokens`)
12. ScrollProgress no topo do main
13. Swipe gestures mobile
14. Tenant switcher (se/quando multi-org virar requisito)

---

## 2. Redesign Proposto: Sidebar + Topbar

### 2.1 Princípios do redesign

- **Denso mas respirável:** topbar 52px + sidebar 240px expandida / 56px colapsada
- **Hierarquia visual clara:** grupos divididos, labels discretas, itens ativos com identidade forte
- **Descoberta em primeiro lugar:** Search acessível tanto no topbar quanto dentro da sidebar
- **Acessibilidade real:** focus trap, aria-labels, skip-to-main, tooltips custom em modo colapsado
- **Mobile first:** drawer com swipe, overlay com fade, focus trap e ESC para fechar
- **Personalidade Aero:** usar glow sutil na cor `brand-primary` para estados ativos e logo

### 2.2 Nova Sidebar — Estrutura

```
┌─────────────────────────────────┐  ← 240px expandida / 56px colapsada
│  [Logo Aero]   PE2026        ⟨  │  Header: 52px — logo + collapse toggle
├─────────────────────────────────┤
│  🔍 Buscar...              ⌘K   │  Quick Search trigger (pill)
├─────────────────────────────────┤
│  VISÃO GERAL                    │  Group label (10px, tracking, uppercase, opacity 60)
│  ▸ 📊 Dashboard                 │  Active: barra lateral + bg 12% + text brand
│    📅 Calendário                │  Hover: bg-item-hover + slide translateX 2px
│    📈 Relatórios    [BETA]      │  Badge inline
├─────────────────────────────────┤  ← Divisor 1px com mx-2.5
│  GERENCIAL                      │
│    🎯 Estratégia      [5]       │  Badge numérico inline
│    📐 Metas                     │
│    📊 Indicadores               │
│    🏢 Áreas                     │
├─────────────────────────────────┤
│  PLANEJAMENTO                   │
│    🏠 Dashboard                 │
│    🎴 Kanban                    │
│    📅 Calendário                │
│    ⏱ Timeline                   │
│  ▾ 📝 Plano de Ação             │  Expandable
│    │  › Criar Novo              │
│    │  › Gerenciar               │
│    │  › Templates               │
│    │  › Aprovações   [4]        │  Notification count
│    │  › Backlog de Evidências   │
├─────────────────────────────────┤
│  ⚙ Administração    [DEV]       │
├─────────────────────────────────┤
│  👤 demo@example.com            │  Footer: user + role badge
│     [Admin]                     │
│  v1.0.0        🔧 Diagnóstico   │
└─────────────────────────────────┘
```

**Modo colapsado (56px):**
- Ícones only, centralizados, 44×44 min-tap-area
- Tooltip custom ao hover: label + badge + counter (igual ao template)
- Chevron toggle no footer

### 2.3 Nova Topbar — Estrutura

```
┌──────────────────────────────────────────────────────────────────┐  ← 52px
│ ☰ │ VISÃO GERAL  /  Dashboard                 🔍 ⌘K  🔔 🌙 👤⌄ │
└──────────────────────────────────────────────────────────────────┘
```

**Mobile (< 768px):**
```
┌──────────────────────────────────────┐  ← 52px
│ ☰   Dashboard                 🔔 👤⌄ │
└──────────────────────────────────────┘
```

**Refinamentos:**
- Altura: **52px** (vs 64px atual) → mais conteúdo visível
- Breadcrumb: seção (caps, 10px, tracking) + path clicável (13px, semibold)
- Search: pill visível em ≥sm com `⌘K` badge; vira ícone em mobile
- Notificações: dot com count (99+)
- Theme toggle: Moon/Sun com transition
- User menu: avatar + email truncado + chevron → dropdown com profile, role, signout
- Demo banner: **abaixo da topbar, não dentro dela** (já está assim)
- **Quick Action contextual** (novo): botão primário que muda por rota (ex.: `/goals` → "Nova Meta"; `/planning/actions/manage` → "Nova Ação") — já existe via `getQuickAction()`, precisa melhorar consistência visual

### 2.4 Onboarding — Redesign completo

**Problema atual (P01):** O `OnboardingTour` é modal e dispara em toda sessão fresh, bloqueando conteúdo ao aparecer. Em Playwright (sem localStorage) ele sempre aparece.

**Proposta:**
- Transformar em **ProductTour não-bloqueante** com highlight + spotlight no elemento alvo + popover lateral
- Fechar automaticamente ao clicar em qualquer elemento da tela
- Adicionar botão "Pular tour" persistente
- Se alvo não existir (ex.: sidebar recolhida), **pular passo silenciosamente** em vez de centralizar modal
- Persistir em `localStorage` + reset via menu de ajuda (`?` → "Refazer tour")
- Lazy load (só carregar se `localStorage.onboarding-completed !== 'true'`)

---

## 3. Plano de Implementação Faseado

### Fase 0 — Correções bloqueantes da auditoria (sem redesign)
**Objetivo:** resolver os 4 criticais do relatório de auditoria sem mexer em arquitetura.

| # | Ação | Arquivo | Esforço |
|---|---|---|---|
| 0.1 | OnboardingTour: esconder por padrão se `data-tour` alvo não existe; fechar ao clicar fora | `OnboardingTour.tsx` | 30 min |
| 0.2 | Registrar 4 rotas 404 ou remover do menu: `/analytics/reports`, `/strategy/overview`, `/governance`, `/planning/rh/strategic-pack` | `routes.tsx` + `navigation.ts` | 1h |
| 0.3 | Adicionar `data-tour="sidebar"` correto e permitir tour só ao primeiro login real | `Sidebar.tsx` + `OnboardingTour.tsx` | 20 min |
| 0.4 | Resolver z-index do modal do tour para não bloquear scroll | `OnboardingTour.tsx` | 15 min |

**Entrega:** Fim do modal persistente + fim das rotas 404. **2h de trabalho total.**

---

### Fase 1 — Refactor Sidebar (estrutural)
**Objetivo:** portar padrões do template para a Sidebar atual.

| # | Ação | Arquivo | Esforço |
|---|---|---|---|
| 1.1 | Extrair `SidebarHeader.tsx` (logo + collapse toggle + quick search) | Novo | 1h |
| 1.2 | Extrair `SidebarFooter.tsx` (user + role picker + version + diagnostic) | Novo | 1h |
| 1.3 | Criar `SidebarTooltip.tsx` custom (substitui `title` HTML) | Novo | 1.5h |
| 1.4 | Adicionar divisores entre grupos + labels com `tracking-[0.15em]` | `Sidebar.tsx` | 30 min |
| 1.5 | Suporte a `badge` e `notificationCount` no tipo `NavItem` | `navigation.ts` + `Sidebar.tsx` | 1.5h |
| 1.6 | Active state visual: barra vertical + glow radial + slide translateX no hover | `Sidebar.tsx` + CSS | 1h |
| 1.7 | Quick Search pill dentro da sidebar (trigger do CommandPalette) | `SidebarHeader.tsx` | 45 min |

**Entrega:** Sidebar com padrão do template, tooltip custom, badges, contadores. **7h de trabalho.**

---

### Fase 2 — Refactor Topbar (estrutural)
**Objetivo:** enxugar e alinhar com template.

| # | Ação | Arquivo | Esforço |
|---|---|---|---|
| 2.1 | Altura 52px (de 64) + ajustar `main` offset | `Topbar.tsx` + `AppShell.tsx` | 30 min |
| 2.2 | Breadcrumb com `SEGMENT_LABELS` map (rotulagem automática + amigável) | `navigation.ts` | 1h |
| 2.3 | UserMenu dropdown polido (com avatar, role badge, signout com divider) | `Topbar.tsx` | 1h |
| 2.4 | NotificationBell com dot + count (reaproveitar `NotificationPanel`) | `Topbar.tsx` | 30 min |
| 2.5 | QuickAction contextual com estilo unificado (reaproveitar `getQuickAction()`) | `Topbar.tsx` | 30 min |
| 2.6 | Theme toggle com transition suave Moon↔Sun | `Topbar.tsx` + Tailwind | 30 min |

**Entrega:** Topbar compacto, polido, padrão enterprise. **4h de trabalho.**

---

### Fase 3 — Responsividade e Acessibilidade
**Objetivo:** portar responsividade avançada e a11y do template.

| # | Ação | Arquivo | Esforço |
|---|---|---|---|
| 3.1 | Hook `useScreenMode()` (mobile/tablet/desktop) com auto-collapse tablet | Novo | 1h |
| 3.2 | Hook `useFocusTrap()` para mobile drawer | Novo | 1h |
| 3.3 | ESC fecha mobile drawer + focus retorna ao botão de abertura | `AppShell.tsx` + `MobileDrawer.tsx` | 45 min |
| 3.4 | Swipe gesture: swipe da borda esquerda abre drawer | `AppShell.tsx` | 1.5h |
| 3.5 | Skip-to-main link visível só ao focar (já existe, validar estilo) | `AppShell.tsx` | 15 min |
| 3.6 | Tooltips custom em modo colapsado aceitando keyboard focus | `SidebarTooltip.tsx` | 1h |

**Entrega:** Experiência mobile de qualidade + WCAG AA compliance. **5.5h de trabalho.**

---

### Fase 4 — Refinamentos visuais (correções P08, P11, P13, P14, P15, P19 da auditoria)
**Objetivo:** aplicar correções médias e baixas do relatório.

| # | Ação | Esforço |
|---|---|---|
| 4.1 | Cards de risco com borda/header por severidade (P08) | 1h |
| 4.2 | Fundo dark consistente no Scoreboard mobile (P05) | 30 min |
| 4.3 | Subnav mobile com fade/seta de overflow horizontal (P15) | 1h |
| 4.4 | IconButton component com padding adequado em Goals/Indicators (P19) | 1.5h |
| 4.5 | Separar alert de mock-modules no Admin (P14) | 30 min |
| 4.6 | Contraste do `0%` em header de OKR azul (P16) | 15 min |
| 4.7 | Tooltips em colunas truncadas de `/initiatives` (P10) | 1h |
| 4.8 | Empty states elaborados (Kanban + Aprovações + Calendário) (P09, P17) | 2h |
| 4.9 | Unificar capitalização de badges (Crítica vs CRITICA) | 45 min |
| 4.10 | Padronizar banner Demo Mode com contraste maior (P13) | 20 min |

**Entrega:** Nível de acabamento enterprise. **9h de trabalho.**

---

### Fase 5 — Design tokens centralizados (opcional, estrutural)
**Objetivo:** centralizar tokens (brand, glass, glow, shadow) à la `@template/tokens`.

| # | Ação | Esforço |
|---|---|---|
| 5.1 | Criar `src/shared/tokens/index.ts` com brand/semantic/glass/glow | 1h |
| 5.2 | Gerar CSS vars via `tokensToCssVars()` em `ThemeProvider` | 1.5h |
| 5.3 | Migrar classes hardcoded para CSS vars | 3h |

**Entrega:** Design system unificado. **5.5h de trabalho.**

---

## 4. Resumo de Esforço e Valor

| Fase | Esforço | Impacto visual | Impacto funcional | Risco |
|---|---|---|---|---|
| **Fase 0** — Correções bloqueantes | 2h | 🔥🔥🔥🔥🔥 | Médio | Baixíssimo |
| **Fase 1** — Refactor Sidebar | 7h | 🔥🔥🔥🔥 | Médio | Baixo |
| **Fase 2** — Refactor Topbar | 4h | 🔥🔥🔥 | Médio | Baixo |
| **Fase 3** — Responsivo + a11y | 5.5h | 🔥🔥 | 🔥🔥🔥🔥 | Baixo |
| **Fase 4** — Refinamentos visuais | 9h | 🔥🔥🔥🔥 | Baixo | Baixíssimo |
| **Fase 5** — Design tokens (opcional) | 5.5h | 🔥 | 🔥🔥 | Médio (refactor amplo) |
| **Total (sem Fase 5)** | **27.5h** | — | — | — |
| **Total (completo)** | **33h** | — | — | — |

---

## 5. Autorizações Necessárias

Para prosseguir com a implementação, preciso de autorização explícita para:

### 🔵 Autorização A — Fase 0 (Correções bloqueantes)
- Refactor do `OnboardingTour` para não-bloqueante + skip de passos com alvo ausente
- Registro ou remoção das 4 rotas 404
- **Sem mudança visual significativa** além da correção dos bugs

### 🔵 Autorização B — Fases 1 + 2 (Redesign Sidebar + Topbar)
- Refactor estrutural: extração de `SidebarHeader`, `SidebarFooter`, `SidebarTooltip`
- Compactação da Topbar para 52px
- Adição de badges/contadores no tipo `NavItem` → implica editar `navigation.ts`
- **Mudança visual perceptível** — mas backward-compatible nos dados

### 🔵 Autorização C — Fase 3 (Responsividade + a11y)
- Hooks novos: `useScreenMode`, `useFocusTrap`, swipe gestures
- Ajustes no `AppShell.tsx` para integrar

### 🔵 Autorização D — Fase 4 (Refinamentos visuais)
- Correções pontuais por página; baixo risco estrutural
- Componente `IconButton` novo no design system

### 🔵 Autorização E — Fase 5 (Design tokens — opcional)
- Refactor amplo de estilos; recomendo adiar e só fazer depois que as fases anteriores estabilizarem

---

## 6. Recomendação de Execução

Sugiro a seguinte sequência:

```
1. Fase 0          → aprovar e executar IMEDIATAMENTE (2h, dor aguda resolvida)
2. Fase 2          → executar em seguida (Topbar, 4h, melhoria imediata de percepção)
3. Fase 1          → executar (Sidebar, 7h, maior volume mas muito perceptível)
4. Fase 3          → executar (mobile/a11y, 5.5h)
5. Fase 4          → executar (refinamentos por página, 9h)
6. Fase 5          → avaliar necessidade após fase 5 real (tokens)
```

**Total recomendado inicial: 27.5h** distribuídas em 5 blocos de entregas validáveis.

Cada fase é **autocontida e deployável separadamente** — você valida visualmente antes de seguir para a próxima.

---

## 7. Próximos Passos

**Aguardando sua decisão entre:**

1. **Autorizar Fase 0 agora** (correções bloqueantes, 2h) — recomendado começar por aqui
2. **Autorizar Fase 0 + Fase 2** (correções + Topbar, 6h) — bom pacote inicial validável
3. **Autorizar Fases 0 + 1 + 2** (shell completo novo, 13h) — mudança visual substancial
4. **Autorizar tudo até Fase 4** (27.5h) — entrega nível enterprise completa
5. **Revisar/ajustar o plano antes de autorizar**

Após autorização, procedo com implementação real-time, mostrando o resultado a cada entrega.
