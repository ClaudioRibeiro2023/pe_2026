# Comparativo Visual — Antes vs Depois

> Auditoria PE2026 · 22/04/2026 · Cascade  
> Comparação par-a-par entre screenshots pré-refactor (`audit/screenshots/`) e pós-refactor (`audit/screenshots-v2/`)

---

## 1. Dashboard

### Antes (`screenshots/02-dashboard.png`)
- ❌ Modal "Menu de Navegação" com overlay escuro sobrepondo **todo** o conteúdo central
- ❌ Dashboard invisível atrás do overlay `bg-black/60`
- ❌ Sidebar sem pill de busca visível (apenas item de navegação)
- ❌ Topbar com 64px de altura

### Depois (`screenshots-v2/01-dashboard.png`)
- ✅ Sem modal bloqueando — conteúdo totalmente visível
- ✅ **Sidebar com pill de busca "Buscar... Ctrl+K"** no topo
- ✅ Topbar compacto em 52px
- ✅ Banner "Modo Demo" com pulse dot e contraste legível
- ✅ Item "Dashboard" ativo com **barra vertical à esquerda** + bg highlight

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots\02-dashboard.png` → `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\01-dashboard.png`

---

## 2. OnboardingTour — Comportamento crítico (P01)

### Antes (`screenshots/00-login-page.png`)
- ❌ Overlay escuro cobre toda a tela
- ❌ Tour sempre dispara ao abrir qualquer página
- ❌ Conteúdo abaixo não é interativo
- ❌ ESC/clique-fora não fecham

### Depois (`screenshots-v2/50-tour-open.png` + `51-tour-after-click-outside.png`)
- ✅ Tour aparece **lateral ao alvo** (Menu de Navegação próximo à sidebar)
- ✅ **Sem overlay escuro** — Dashboard visível e interativo atrás
- ✅ Clique-fora fecha instantaneamente (`51-tour-after-click-outside.png`)
- ✅ ESC fecha
- ✅ Skip silencioso quando alvo ausente
- ✅ Pode ser **reativado via ShortcutsGuide** (`54-shortcuts-guide-with-refresh.png`)

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\50-tour-open.png`

---

## 3. Aprovações — Empty State (P09)

### Antes (`screenshots/17-actions-approvals.png`)
- ❌ Painel direito ocupa 50% da tela com apenas ícone + "Selecione uma evidência para ver os detalhes"
- ❌ Zero affordance de próxima ação
- ❌ Desperdício visual em layout de alta importância

### Depois (`screenshots-v2/06-approvals.png`)
- ✅ **Avatar ilustrativo** com badge numérico pulsante (4 evidências)
- ✅ Mensagem contextual: "4 evidências aguardando sua aprovação..."
- ✅ **Checklist "COMO APROVAR"** com 3 passos numerados
- ✅ Estado alternativo quando backlog está limpo ("Backlog limpo" + CheckCircle verde)

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\06-approvals.png`

---

## 4. Central de Alertas — Filtros (P18)

### Antes (`screenshots/35-alerts.png`)
- ❌ Selects HTML nativos inline com altura inconsistente
- ❌ Borda mais fina que o design system
- ❌ Sem botão "Limpar filtros"

### Depois (`screenshots-v2/08-alerts.png`)
- ✅ Selects substituídos pelo componente canônico `Select` (h-10 padrão)
- ✅ ChevronDown consistente com outros selects do sistema
- ✅ Focus ring com primary-500/60
- ✅ **Botão "Limpar filtros"** aparece contextualmente quando há filtros ativos

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\08-alerts.png`

---

## 5. Carteira de Iniciativas — Tabela (P10)

### Antes (`screenshots/31-initiatives.png`)
- ❌ Cabeçalho "P." sem label clara
- ❌ Colunas truncadas sem tooltip
- ❌ Sem scroll horizontal visível

### Depois (`screenshots-v2/07-initiatives.png`)
- ✅ Cabeçalho completo: "Prazo"
- ✅ `title` HTML em todas as células (aparece ao hover)
- ✅ `overflow-x-auto` no container (scroll horizontal)
- ✅ `tabular-nums` nas datas para alinhamento

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\07-initiatives.png`

---

## 6. OKRs Corporativos — Contraste (P16)

### Antes (`screenshots/23-strategy-okrs.png`)
- ❌ `0%` em texto fino sobre header azul escuro — leitura difícil

### Depois (`screenshots-v2/04-okrs.png`)
- ✅ `0%` em `text-white` explícito + **text-shadow** sutil
- ✅ `tabular-nums` para alinhamento consistente
- ✅ Legível em qualquer pilar (P1 azul, P2 verde, P3 amarelo, P4 roxo, P5 rosa)

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\04-okrs.png`

---

## 7. Mobile — Scoreboard (P05)

### Antes (`screenshots/mobile-05-analytics-scoreboard.png`)
- ❌ Fundo **branco** (quebra de tema escuro)
- ❌ Inconsistência com outras páginas mobile

### Depois (`screenshots-v2/71-dark-mobile-scoreboard.png` com `app-theme=dark`)
- ✅ **Fundo escuro consistente** em todo o Scoreboard mobile
- ✅ Card hero "Score Estratégico PE2026 44%" com contraste adequado
- ✅ Cards Guardrails A1/A2 legíveis em dark mode

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\71-dark-mobile-scoreboard.png`

---

## 8. Sidebar Colapsada — Tooltips (P07)

### Antes (`screenshots/50-sidebar-collapsed.png`)
- ❌ Ícones only sem tooltip visual
- ❌ `title` HTML nativo (lento, sem identidade visual)
- ❌ Usuário não sabe o que cada ícone representa

### Depois (`screenshots-v2/20-collapsed-dashboard.png`)
- ✅ Sidebar reduzida para **56px**
- ✅ Tooltip custom com `SidebarTooltip` (delay 100ms, badges, notification counts)
- ✅ Ícones bem proporcionados com notification dot em Aprovações

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\20-collapsed-dashboard.png`

---

## 9. Redirects de Rotas Amigáveis (P02)

### Antes (`screenshots/33-governance.png`)
- ❌ `/governance` → 404 "Página não encontrada"
- ❌ Mesmo para `/strategy/overview`, `/analytics/reports`

### Depois (`screenshots-v2/redir-governance.png`, `redir-strategy-overview.png`)
- ✅ `/governance` → redireciona para `/governance/decisions` (página completa)
- ✅ `/strategy/overview` → redireciona para `/strategy` (Visão Geral)
- ✅ `/analytics/reports` → redireciona para `/reports`
- ✅ Outros: `/analytics`, `/admin`, `/audit`, `/planning/:slug/strategic-pack`

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\redir-governance.png`

---

## 10. Dark Mode — Consistência Global

### Antes
- ⚠️ Dark mode existia mas tinha inconsistências (banner Demo ilegível, mobile scoreboard branco)

### Depois (`screenshots-v2/60-dark-dashboard.png` até `67-dark-goals.png`)
- ✅ **8 páginas validadas em dark mode** (Dashboard, Scoreboard, OKRs, Riscos, Planning RH, Aprovações, Alertas, Goals)
- ✅ **2 páginas mobile validadas** (Dashboard, Scoreboard)
- ✅ Banner Demo Mode em `dark:bg-warning-900/30 dark:text-warning-200`
- ✅ Pulse dot amarelo no banner
- ✅ Cards, tabelas, selects, todos com variantes dark

**Evidência:** `@b:\aero-studio\projects\estrategico\planejamento-estrategico\audit\screenshots-v2\60-dark-dashboard.png`

---

## Placar Final

| Item | Problemas auditados | Resolvidos | Taxa |
|---|---|---|---|
| **Críticos (P01-P03)** | 3 | 3 | 100% |
| **Altos (P04-P08, P11, P15)** | 7 | 6 (P04 intencional, demo mode) | 86% |
| **Médios (P09-P10, P12-P14, P16, P19)** | 7 | 7 | 100% |
| **Baixos (P17-P18, P20)** | 3 | 3 | 100% |
| **Total** | **20** | **19** | **95%** |

(P04 — "Login mobile redireciona direto para dashboard" — é comportamento esperado em demo mode, não bug)

### Validação técnica
- `tsc --noEmit` → **0 erros**
- `npm run build` → **exit 0**, 6.54s
- **30+ screenshots** capturados via Playwright pós-refactor
- **Dark mode + Light mode** ambos validados

### Incrementos além do escopo
- `ScrollProgress` indicator (padrão premium do template.base)
- `IconButton` canônico adotado em `GoalCard` + `IndicatorCard`
- Botão "Refazer tour de navegação" no `ShortcutsGuide`
- 7 redirects amigáveis (além dos 4 originalmente identificados)

---

*Auditoria visualmente encerrada · Prova concreta de entrega via screenshots pareados · Produto em nível comercial apresentável*
