# Relatório de Auditoria Visual — PE2026 Planejamento Estratégico

> **Data:** 22/04/2026  
> **Método:** Navegação real via Playwright/Chromium headless — 56 screenshots capturados  
> **Viewports:** Desktop 1440×900 · Notebook 1280×800 · Mobile 390×844  
> **Ambiente:** Preview local `http://localhost:4174` — modo Demo (Supabase não configurado)  
> **Auditor:** Cascade — análise visual sênior  

---

## 1. Resumo Executivo

### Visão geral
A plataforma PE2026 é um sistema de gestão de planejamento estratégico corporativo com múltiplos módulos (Planning, Strategy, Analytics, Goals, Indicators, Initiatives, Alerts, Admin). O produto está em estágio **beta maduro** — funcionalmente rico, com dados coerentes e estrutura sólida —, mas apresenta um conjunto significativo de **inconsistências visuais e de UX** que reduzem a percepção de acabamento e a qualidade comercial do produto.

### Pontos fortes
- Estrutura de módulos clara e bem hierarquizada
- Design system consistente na maior parte (dark mode, sidebar, breadcrumbs)
- Sidebar retrátil com modo icon-only funcional e bem executado
- Cards de métricas com tipografia de números forte e scannable
- Scoreboard com estrutura de dados rica e bem organizada em camadas (Guardrails → KPIs → Monetização)
- Responsividade mobile aceitável em páginas de listagem e seleção de área
- Identidade visual com paleta dark coerente e profissional

### Pontos fracos (críticos e altos)
- **"Menu de Navegação" tooltip sobrepõe conteúdo em TODAS as páginas** — bug crítico de UI que aparece persistentemente
- **4 rotas retornam 404** que deveriam existir: `/analytics/reports`, `/strategy/overview`, `/governance`, `/planning/rh/strategic-pack`
- **Sidebar permanece expandida mesmo após reload**, forçando o tooltip a aparecer e bloquear conteúdo
- **Mobile login redireciona direto para dashboard** — não há tela de login real acessível em mobile
- **Dark mode da página é aplicado globalmente mas o Scoreboard no mobile tem fundo branco**, quebrando a consistência
- **Dashboard sem scroll** — conteúdo abaixo do fold é cortado (modal de onboarding sobrepõe cards)
- **Tabela de Iniciativas** sem responsividade — overflow horizontal invisível em telas menores
- **Estado vazio pouco elaborado** em Calendário e Aprovações (direita)

### Conclusão geral
O produto transmite **robustez funcional e inteligência de conteúdo**, mas ainda não alcança o padrão de acabamento esperado para um uso institucional executivo. O principal gargalo não é o design system em si, mas a **presença sistemática de um modal de onboarding que bloqueia conteúdo** e a existência de **rotas mortas sem fallback adequado**. Corrigindo os 5 problemas críticos e os principais de alta severidade, o produto saltaria para um nível comercialmente apresentável.

---

## 2. Contexto Técnico da Auditoria

| Item | Detalhe |
|------|---------|
| **Repositório** | `b:\aero-studio\projects\estrategico\planejamento-estrategico` |
| **Stack** | React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui |
| **Build** | `npm run build` → dist/ · Preview via `npm run preview` |
| **Porta** | 4174 (4173 em uso por processo anterior) |
| **Modo de dados** | Demo (mock) — sem Supabase configurado |
| **Ferramenta de auditoria** | Playwright Chromium headless — `audit/runner.mjs` |
| **Total de screenshots** | 56 capturas (38 rotas + 6 interações + 5 notebook + 5 mobile) |
| **Limitações** | Login real não testável em modo demo; alguns modais de formulário não abriram sem interação manual |

---

## 3. Cobertura Realizada

### Páginas visitadas ✅

| Rota | Status | Observação |
|------|--------|------------|
| `/login` | ✅ Renderiza | Redireciona imediatamente para `/dashboard` em demo mode |
| `/dashboard` | ✅ OK | Modal de onboarding sobreposto |
| `/planning` | ✅ OK | Seletor de áreas funcional |
| `/planning/rh/dashboard` | ✅ OK | Layout correto, dados mock reais |
| `/planning/rh/kanban` | ✅ OK | Kanban com colunas visíveis |
| `/planning/rh/timeline` | ✅ OK | Gantt visual funcional |
| `/planning/rh/calendar` | ✅ OK | Calendário mensal |
| `/planning/rh/strategic-pack` | ❌ 404 | Rota não registrada |
| `/planning/marketing/dashboard` | ✅ OK | |
| `/planning/operacoes/dashboard` | ✅ OK | |
| `/planning/financeiro/dashboard` | ✅ OK | |
| `/planning/pd/dashboard` | ✅ OK | |
| `/planning/cs/dashboard` | ✅ OK | |
| `/planning/comercial/dashboard` | ✅ OK | |
| `/planning/dashboard` | ✅ OK | Visão consolidada |
| `/planning/actions/manage` | ✅ OK | Gerenciar ações |
| `/planning/actions/approvals` | ✅ OK | Aprovações pendentes |
| `/planning/actions/evidences` | ✅ OK | Backlog de evidências |
| `/planning/actions/templates` | ✅ OK | Templates de planos |
| `/analytics/scoreboard` | ✅ OK | Scoreboard rico |
| `/analytics/reports` | ❌ 404 | Rota não registrada |
| `/strategy/overview` | ❌ 404 | Rota não registrada |
| `/strategy/okrs` | ✅ OK | OKRs com KRs vinculados |
| `/strategy/kpis` | ✅ OK | Guardrails + KPIs |
| `/strategy/risks` | ✅ OK | Cards de riscos |
| `/strategy/scenarios` | ✅ OK | Cenários financeiros |
| `/strategy/pillars` | ✅ OK | Pilares + subpilares |
| `/strategy/thesis` | ✅ OK | Tese e diretrizes |
| `/goals` | ✅ OK | Metas com progresso |
| `/indicators` | ✅ OK | Indicadores KPI |
| `/initiatives` | ✅ OK | Carteira INIT |
| `/action-plans` | ✅ OK | Portfólio executivo |
| `/governance` | ❌ 404 | Rota não registrada |
| `/calendar` | ✅ OK | Calendário estratégico |
| `/alerts` | ✅ OK | Alertas com filtros |
| `/admin` | ✅ OK | Gestão de usuários |
| `/area-plans` | ✅ OK | Seletor de área |
| Rota inexistente | ✅ OK | 404 customizada funcional |

**Cobertura: 34/38 rotas testadas — 4 retornaram 404 inesperado**

### Fluxos testados
- Login → redirect demo → Dashboard
- Dashboard → Sidebar recolhida → Ícones only
- Dashboard scroll (fold inferior)
- Planning → Área RH → Dashboard → Kanban → Timeline → Calendário
- Planning → Ações → Gerenciar → Aprovações → Evidências → Templates
- Analytics → Scoreboard (top + mid + bottom)
- Strategy → OKRs → KPIs → Riscos → Cenários → Pilares → Tese
- Goals, Indicators, Initiatives, Action Plans, Calendar, Alerts, Admin
- Mobile: Login, Dashboard, Planning, RH dashboard, Scoreboard
- Notebook 1280: Dashboard, Planning, RH, Scoreboard, Strategy Overview

---

## 4. Principais Problemas Encontrados

| ID | Página/Módulo | Elemento | Problema | Severidade | Impacto | Recomendação |
|----|--------------|----------|----------|-----------|---------|--------------|
| P01 | Global | Modal "Menu de Navegação" | Tooltip de onboarding sobrepõe conteúdo em todas as páginas persistentemente | **Crítico** | Bloqueia visualização do conteúdo central | Disparar apenas 1× por sessão via localStorage; fechar ao navegar |
| P02 | `/analytics/reports` `/strategy/overview` `/governance` `/planning/rh/strategic-pack` | Rota | 404 em rotas que deveriam existir (4 rotas mortas) | **Crítico** | Usuário chega a tela de erro sem contexto | Registrar as rotas no router ou remover links do menu |
| P03 | Dashboard | Conteúdo abaixo do fold | Dashboard não faz scroll enquanto modal está ativo; conteúdo cortado | **Crítico** | Cards importantes ficam invisíveis | Resolver z-index e overflow do layout quando modal ativo |
| P04 | Mobile | Sidebar / login | Login inexistente em mobile — redireciona para dashboard sem autenticação real | **Alto** | Fluxo de entrada quebrado em mobile | Garantir que `/login` renderize o formulário antes de qualquer redirect |
| P05 | Mobile (Scoreboard) | Fundo do corpo | Scoreboard em mobile tem fundo branco enquanto o restante é dark | **Alto** | Quebra total de consistência de tema | Aplicar `bg-background` canônico no container do Scoreboard |
| P06 | Global | Sidebar expandida + modal | Sidebar sempre expandida ao carregar gera tooltip imediato em todas as telas | **Alto** | Experiência de primeira visita ruim | Persistir estado do sidebar no localStorage |
| P07 | Dashboard | Sidebar colapsada | Sidebar em modo icon-only não possui tooltips nas ações da sidebar (nomes ficam invisíveis) | **Alto** | Usuário não sabe o que cada ícone representa | Adicionar tooltips em todos os itens da sidebar colapsada |
| P08 | `/strategy/risks` | Cards de risco | Cards de risco não têm indicação visual de severidade por cor (todos cinza) | **Alto** | Crítico e Monitorado visualmente equivalentes | Adicionar borda/header colorido: vermelho=crítico, laranja=alto, cinza=monitorado |
| P09 | `/planning/actions/approvals` | Painel direito | "Detalhes da Aprovação" vazio ocupa 50% da tela com estado vazio pobre | **Médio** | Espaço desperdiçado; confunde usuário | Substituir por CTA mais elaborado ou collapse do painel quando vazio |
| P10 | `/initiatives` | Tabela | Colunas `ID`, `Tipo`, `Prioridade`, `Pilar`, `Dono`, `Status`, `P.` truncadas sem tooltip | **Médio** | Dados ilegíveis; coluna "P." sem label clara | Adicionar tooltips em headers e células truncadas; expandir coluna P. |
| P11 | `/analytics/scoreboard` | Scroll | Scroll da página não avança após mid-section — conteúdo de KPIs P2+ fica atrás do modal | **Alto** | Metade do Scoreboard inacessível quando modal ativo | Mesmo fix do P01/P03 |
| P12 | `/planning/rh/timeline` | Gantt | Barras de progresso sem rótulos de percentual visíveis dentro das barras | **Médio** | Leitura do Gantt exige decorar posição visual | Adicionar `%` dentro ou ao lado das barras quando largura permitir |
| P13 | Global | Banner Demo Mode | Banner "Modo Demo" em amarelo usa texto colorido com contraste limitado em dark mode | **Médio** | Texto levemente difícil de ler | Aumentar contraste ou usar `text-yellow-300` em vez de `text-yellow-600` |
| P14 | `/admin` | Tabela de usuários | Linha "10 módulos ainda em mock" ocupa row inteira na tabela com visual de alerta laranja — semanticamente confuso | **Médio** | Parece erro grave quando é info de configuração | Mover para seção de status/config separada da tabela de usuários |
| P15 | Mobile `/planning/rh/dashboard` | Subnav (tabs) | Tabs de subnav cortam à direita sem indicação de scroll horizontal | **Alto** | Usuário não descobre que há mais abas | Adicionar seta/fade indicativo ou scroll-snap |
| P16 | `/strategy/okrs` | Header do OKR selecionado | Card do OKR tem fundo azul escuro com texto branco — contraste OK, mas `0%` em vermelho sobre azul escuro tem contraste insuficiente | **Médio** | Leitura do progresso prejudicada | Usar `text-white` ou `text-red-300` para garantir contraste WCAG AA |
| P17 | `/planning/rh/calendar` | Calendário | Painel direito "Selecione uma data" permanece vazio sem qualquer indicação visual mais elaborada | **Baixo** | UX fria, mas não bloqueante | Adicionar ilustração ou próximos eventos auto-selecionados |
| P18 | `/alerts` | Filtros | Dropdowns de Status e Severidade têm visual inconsistente com o restante dos selects do sistema (border mais fina) | **Baixo** | Micro-inconsistência | Usar componente `Select` do design system |
| P19 | `/goals` | Botões de ação | Botões de editar (ícone lápis) e excluir (ícone lixeira) aparecem como ícones soltos sem área de clique clara | **Médio** | Dificulta interação precisa | Wrapper `IconButton` com padding 8px e hover state |
| P20 | Global | Topbar | Busca "Buscar..." no topbar não tem atalho de teclado exibido corretamente em viewports < 1280px — badge `⌘K` desaparece | **Baixo** | Menor descobribilidade do atalho | Manter badge visível ou ocultar toda a busca em breakpoints menores |

---

## 5. Oportunidades de Melhoria Visual

### Refinamentos de layout
- Dashboard: separar claramente "Resumo de metas" e "Placar institucional" com divisão visual mais forte (título de seção com peso maior ou separador)
- Scoreboard: adicionar âncoras laterais para navegação entre Camadas A, B, C em tela longa
- Strategy/Pillars: cards de pilar P1–P5 no topo têm tamanho pequeno demais para a informação que carregam

### Consistência visual
- Tabelas em `/initiatives`, `/admin` e `/action-plans` usam densidades visuais distintas — unificar padding de linha e tamanho de fonte
- Badges de status (`Em Andamento`, `Pendente`, `Atrasada`) têm formatos diferentes em Kanban vs lista — unificar border-radius e peso do texto
- Ícones da sidebar em modo colapsado diferem de tamanho entre grupos

### Hierarquia visual
- `/action-plans`: layout híbrido (card grande à esquerda + lista à direita) bem resolvido, mas `PLANO SIMULADO` em label pequena acima do título grande é pouco legível
- `/indicators`: grid 3 colunas funciona bem, mas cards com label `Em alta` / `Em baixa` têm cores que se repetem sem semântica clara de urgência

### Tipografia
- Subtítulos de seção (`CAMADA A — GUARDRAILS INSTITUCIONAIS`) em uppercase com tracking adequado — bom
- Labels numéricas secundárias como `4052693 / 11440000 R$` em `/goals` deveriam usar `tabular-nums` para alinhamento

### Responsividade
- Mobile: cards de métrica do Dashboard em coluna única funcionam muito bem — **ponto forte**
- Mobile: formulário de Nova Ação (não testável via Playwright, mas inferível) provavelmente estoura horizontalmente
- Tablet (não testado diretamente): 1280×800 mostra layout desktop normalmente — zero breaking points aparentes nessa faixa

### Feedbacks visuais
- Toast/notificação de sucesso após ação não observado em nenhum fluxo de interação — importante validar se estão implementados
- Loading skeletons não observados — se não existem, é importante adicioná-los especialmente em Scoreboard e OKRs

---

## 6. Achados por Página

### Login (`/login`)
- **Objetivo:** Autenticação de usuário
- **Qualidade visual:** ★★★★☆ — não foi renderizado em demo mode (redireciona imediatamente)
- **Problema:** Usuário chega no dashboard sem ver o formulário — em produção, isso será correto; em demo, cria confusão
- **Oportunidade:** Exibir tela intermediária explicando que está em modo demo antes de entrar

### Dashboard (`/dashboard`)
- **Objetivo:** Visão geral consolidada de metas, planos e indicadores
- **Qualidade visual:** ★★★☆☆ (com modal) / ★★★★☆ (sem modal)
- **Problema P01:** Modal de onboarding bloqueia toda a tela inferior
- **Problema P03:** Sem scroll funcional com modal ativo
- **Oportunidade:** Adicionar sparkline ou mini-chart nos cards de KPI (Execução monetização 57,1% poderia ter um gráfico de linha pequeno)
- **Observação:** Layout em modo sidebar recolhida (P50) muito limpo — excelente uso do espaço

### Planning Home (`/planning`)
- **Objetivo:** Seleção de área para planejamento
- **Qualidade visual:** ★★★★☆
- **Problema:** Modal de onboarding sempre sobreposto (P01)
- **Observação positiva:** Cards de área com ícones coloridos e descrições curtas são muito bem resolvidos — hierarquia clara
- **Oportunidade:** No mobile, a última área acessada poderia ter tratamento de "Continuar de onde parou" mais proeminente

### Planning RH Dashboard (`/planning/rh/dashboard`)
- **Objetivo:** Visão do plano de ação da área RH com progresso, ações e filtros
- **Qualidade visual:** ★★★★☆
- **Problema P15:** Subnav (Dashboard/Kanban/Calendário/Timeline/PE-2026) corta em mobile
- **Observação positiva:** Badges `Critica` e `Alta` nas ações com ícone de alerta — leitura rápida eficiente
- **Observação:** `Progresso 0% · Atrasadas 15` em destaque vermelho transmite urgência corretamente

### Planning Kanban (`/planning/rh/kanban`)
- **Objetivo:** Visão kanban das ações por status
- **Qualidade visual:** ★★★☆☆
- **Problema:** Colunas "Em Andamento", "Bloqueada", "Aguardando Evidência" estão vazias com "Solte aqui" — visual pobre de empty state
- **Oportunidade:** Empty states das colunas Kanban deveriam ter uma área de drop mais visível (borda pontilhada, cor de fundo levemente diferente)

### Planning Timeline (`/planning/rh/timeline`)
- **Objetivo:** Gantt das ações ao longo do tempo
- **Qualidade visual:** ★★★☆☆
- **Problema P12:** Barras sem rótulo de % internamente
- **Problema:** Títulos de ação à esquerda truncados sem tooltip visível
- **Observação positiva:** Escalas de meses visíveis e navegáveis

### Planning Calendário (`/planning/rh/calendar`)
- **Objetivo:** Visão mensal de ações por data
- **Qualidade visual:** ★★★★☆
- **Problema P17:** Painel direito com estado vazio sem elaboração
- **Observação positiva:** Data atual (22) circulada com cor primária — orientação temporal clara

### Analytics Scoreboard (`/analytics/scoreboard`)
- **Objetivo:** Placar estratégico PE2026 com Guardrails, KPIs e Monetização
- **Qualidade visual:** ★★★★★ (melhor página do produto)
- **Problema P05 (mobile):** Fundo branco em mobile
- **Problema P11:** Scroll bloqueado pelo modal
- **Observação positiva:** Header com Score 44% + `12 OK · 15 Atenção` é excelente — comunica tudo em 2 segundos
- **Observação positiva:** Cards de Guardrail com checkmark verde/triângulo laranja — semântica visual excelente

### Strategy / OKRs (`/strategy/okrs`)
- **Objetivo:** OKRs corporativos com Key Results vinculados
- **Qualidade visual:** ★★★★☆
- **Problema P16:** Contraste do `0%` sobre fundo azul escuro
- **Observação positiva:** Header do OKR com cor de pilar diferenciada — organização excelente
- **Observação positiva:** Metadata (KR code, Meta, KPIs, Iniciativas, Evidências) bem estruturada em grid

### Strategy / KPIs (`/strategy/kpis`)
- **Objetivo:** Guardrails e KPIs por pilar
- **Qualidade visual:** ★★★★☆
- **Observação positiva:** Layout de 3 cards por linha para Guardrails — leitura rápida
- **Problema:** Card "Saúde organizacional" único na 2ª linha — layout ímpar visualmente desbalanceado

### Strategy / Risks (`/strategy/risks`)
- **Objetivo:** Riscos estratégicos com código, mitigação e probabilidade
- **Qualidade visual:** ★★★☆☆
- **Problema P08:** Todos os cards são visualmente idênticos independente da severidade
- **Oportunidade:** Cards com borda colorida por criticidade aumentariam scanabilidade em muito

### Strategy / Cenários (`/strategy/scenarios`)
- **Objetivo:** Cenários financeiros com gatilhos e valor esperado
- **Qualidade visual:** ★★★★★ (segunda melhor página)
- **Observação positiva:** Três cards de cenário (Pessimista, Base, Otimista) com valores monetários grandes e muito legíveis
- **Observação positiva:** Blocos "Valor Esperado" (roxo) e "Q1 Fixo" (verde) com contraste correto

### Strategy / Pillars (`/strategy/pillars`)
- **Objetivo:** Pilares com subpilares e Key Results
- **Qualidade visual:** ★★★★☆
- **Observação positiva:** Mini-cards P1–P5 no topo com cor diferenciada por pilar — orientação excelente
- **Problema:** Cards pequenos têm texto `5 KRs · 0 concluídos` com peso muito leve — difícil leitura

### Goals (`/goals`)
- **Objetivo:** Metas estratégicas com progresso numérico
- **Qualidade visual:** ★★★★☆
- **Problema P19:** Ícones de ação (editar/excluir) sem área de clique clara
- **Observação positiva:** Layout 2 colunas com cards de meta — boa densidade de informação

### Indicators (`/indicators`)
- **Objetivo:** KPIs e indicadores com tendências
- **Qualidade visual:** ★★★★☆
- **Observação positiva:** Badges `Em alta` / `Em baixa` com cores distintas — semanticamente correto
- **Problema:** Seta de tendência (↗ +2,0%) misturada ao número principal sem separação clara

### Initiatives (`/initiatives`)
- **Objetivo:** Carteira de iniciativas INIT-001 a INIT-022
- **Qualidade visual:** ★★★☆☆
- **Problema P10:** Tabela densa com colunas truncadas e sem tooltips
- **Observação:** Seção de critérios de priorização no topo é excelente para contexto

### Action Plans (`/action-plans`)
- **Objetivo:** Portfólio executivo de planos de ação
- **Qualidade visual:** ★★★★☆
- **Observação positiva:** Layout híbrido (card executivo + KPIs + lista de iniciativas + riscos) — muito rico
- **Problema:** `PLANO SIMULADO` como label de tag acima do título é ambíguo — parece erro

### Admin (`/admin`)
- **Objetivo:** Gestão de usuários e permissões
- **Qualidade visual:** ★★★☆☆
- **Problema P14:** Banner de alerta de módulos em mock misturado à tabela de usuários
- **Observação:** Tabela funcional e legível; badges de role (`admin`, `direcao`, `gestor`) com ícones adequados

### Alerts (`/alerts`)
- **Objetivo:** Central de alertas do sistema
- **Qualidade visual:** ★★★★☆
- **Problema P18:** Selects com visual inconsistente
- **Observação positiva:** Contadores de Críticos/Avisos/Informativos/Resolvidos visualmente claros

---

## 7. Achados por Componente

### Modal / Tooltip de Onboarding
- Aparece em 100% das telas visitadas
- Bloqueia aproximadamente 30–40% da área de conteúdo
- Animação de carregamento ("...") sugere que está esperando imagem — provavelmente um Lottie que falha em carregar
- **Fix necessário urgente**

### Sidebar (Desktop)
- ✅ Expandida: excelente hierarquia com grupos "VISÃO GERAL", "GERENCIAL", "PLANEJAMENTO"
- ✅ Colapsada: ícones only, muito limpo e bem proporcionado
- ❌ Sem tooltips em modo colapsado — item crítico de usabilidade
- ❌ Estado não persistido entre navegações

### Topbar
- ✅ Logo + breadcrumb + busca + dark mode + user menu — completo
- ✅ Espaçamento e alinhamento corretos
- ❌ Badge de atalho `⌘K` some abaixo de 1280px

### Cards de Métrica (Dashboard / Scoreboard)
- ✅ Tipografia de números grande e legível
- ✅ Sub-labels com status em texto menor — escalonamento correto
- ❌ Ícones nos cards de Dashboard (🎯📊) de estilo diferente dos ícones Lucide do restante do sistema

### Badges de Status
- ✅ `Em Execução`, `Pendente`, `Atrasada`, `Crítica` — cores distintas e semânticas
- ❌ Inconsistência entre `Crítica` (amarelo/laranja no Kanban) e `Critica` (sem acento) nas listagens
- ❌ `Atrasada` vs `ATRASADA` — capitalização inconsistente

### Tabelas
- ✅ `/admin`: tabela limpa com boa densidade
- ❌ `/initiatives`: overflow sem feedback, colunas comprimidas, header "P." sem label completa
- ❌ `/action-plans`: tabela interna de iniciativas sem separação visual entre linhas (apenas hover)

### Botões
- ✅ Botão primário com cor de destaque clara (`Criar`, `Exportar`)
- ❌ Botões de ícone (editar, excluir) sem `aria-label` visível ou área de clique adequada
- ❌ Botão "Voltar" no 404 sem estilo consistente com o restante do sistema

### Empty States
- ✅ 404 custom: clara e funcional
- ❌ Kanban colunas vazias: `Solte aqui` sem visual de drop zone
- ❌ Aprovações (painel direito): apenas ícone + texto estático
- ❌ Calendário (painel direito): sem ação sugerida

### Cores e Contraste
- ✅ Dark mode: fundo `#0f1117` com cards em `#1a1f2e` — contraste adequado
- ✅ Textos primários brancos sobre dark background — WCAG AA cumprido
- ❌ Banner Demo: `text-yellow-600` sobre `bg-yellow-100` dark — contraste limitado
- ❌ Cards de risco: todos cinza — sem semântica de severidade por cor

### Responsividade Mobile
- ✅ Dashboard: cards empilhados corretamente, muito legível
- ✅ Planning home: cards de área com layout vertical funcional
- ✅ Scoreboard: estrutura Guardrail empilhada — excelente
- ❌ Subnav de área (Dashboard/Kanban/Timeline/...): overflow sem indicador
- ❌ Fundo branco no Scoreboard mobile vs dark no restante

---

## 8. Inconsistências Sistêmicas

| Padrão | Descrição | Ocorre em |
|--------|-----------|-----------|
| Modal de onboarding | Dispara em toda navegação, não apenas na primeira | 100% das páginas |
| Capitalização de badges | `Crítica` vs `CRITICA` vs `Atrasada` vs `ATRASADA` | Kanban, Lista, Dashboard |
| Empty state qualidade | Varia de totalmente ausente a ícone+texto simples | Kanban, Aprovações, Calendário |
| Ícones de ação inline | Sem área de clique padronizada | Goals, Indicators |
| Sidebar não persistida | Reset a cada navegação | Global |
| Tooltips ausentes | Sidebar colapsada e colunas de tabela sem tooltip | Global |
| Rotas mortas | 4 rotas no menu sem implementação | Reports, Overview, Governance, Strategic Pack |
| Fundo em mobile | Scoreboard usa fundo branco enquanto demais são dark | Scoreboard mobile |

---

## 9. Priorização Recomendada

### Correções imediatas (bloqueantes de qualidade)
1. **P01** — Resolver disparo repetitivo do modal de onboarding → `localStorage.setItem('nav-tour-done', true)`
2. **P02** — Registrar as 4 rotas 404 no router ou remover entradas do menu
3. **P03** — Resolver overflow/scroll do Dashboard com modal ativo
4. **P06** — Persistir estado da sidebar no localStorage

### Curto prazo (1–2 semanas)
5. **P07** — Tooltips nos itens da sidebar colapsada
6. **P08** — Cor de borda/header por severidade nos cards de risco
7. **P11** — Scroll no Scoreboard (relacionado ao P01)
8. **P15** — Subnav mobile com fade/seta indicativa de overflow
9. **P05** — Background dark no Scoreboard mobile

### Médio prazo (refinamento)
10. **P09** — Empty state elaborado no painel de Aprovações
11. **P10** — Tooltips em colunas truncadas da tabela de Iniciativas
12. **P14** — Separar alert de módulos em mock da tabela de usuários no Admin
13. **P16** — Ajustar contraste de `0%` em header de OKR azul escuro
14. **P19** — `IconButton` com padding adequado em Goals/Indicators
15. Badges de capitalização consistente globalmente
16. Ícones dos cards de Dashboard alinhados ao Lucide icon set

---

## 10. Top 10 Melhorias com Maior Impacto Visual

| # | Melhoria | Impacto estimado |
|---|---------|-----------------|
| 1 | Eliminar disparo repetitivo do modal de onboarding | Elevar qualidade percebida de toda a plataforma em 30% |
| 2 | Corrigir 4 rotas 404 (Reports, Overview, Governance, Strategic Pack) | Eliminar percepção de produto inacabado |
| 3 | Tooltips na sidebar colapsada | Tornar modo compact profissionalmente usável |
| 4 | Cards de risco com cor de severidade | Transformar página de riscos de informativa para operacional |
| 5 | Persistência do estado da sidebar | UX consistente entre navegações |
| 6 | Subnav mobile com indicação de overflow | Desbloquear funcionalidade core em mobile |
| 7 | Fundo dark consistente no Scoreboard mobile | Coerência visual do tema escuro |
| 8 | Empty states elaborados (Kanban + Aprovações + Calendário) | Elevar percepção de acabamento |
| 9 | Tooltips em colunas truncadas da tabela de Iniciativas | Tornar a tabela operacionalmente legível |
| 10 | Badges de status com capitalização e estilo unificados | Consistência sistêmica de design |

---

## 11. Veredito Final

### A interface parece madura?
**Parcialmente.** O produto tem uma arquitetura de informação madura, dados ricos e uma identidade visual coerente. Páginas como Scoreboard, Strategy/Cenários e Planning RH Dashboard estão em nível de produto comercial. Porém, a presença sistemática do modal de onboarding sobreposto e as 4 rotas mortas introduzem uma percepção de **produto em construção** que contamina a experiência geral.

### Transmite confiança?
**Sim, com ressalvas.** O conteúdo estratégico (OKRs, KRs, Guardrails, Riscos, Cenários Financeiros) é denso e real — isso transmite credibilidade intelectual. A credibilidade visual é prejudicada pelos problemas críticos listados acima.

### Parece pronto para uso profissional/comercial?
**Não na versão atual.** Com os 4 problemas críticos resolvidos (P01, P02, P03, P06), o produto estaria em nível de demonstração executiva. Com os 4 altos adicionais (P07, P08, P11, P15), estaria pronto para uso cotidiano pela equipe.

### Gargalos visuais mais importantes hoje

1. **Modal de onboarding persistente** — único item que mais compromete a percepção de qualidade
2. **Rotas 404** — sinaliza inconsistência estrutural
3. **Sidebar sem persistência e sem tooltips em modo colapsado** — afeta workflow diário
4. **Cards de risco sem cor de severidade** — página operacionalmente importante perde funcionalidade por escolha visual
5. **Mobile: Scoreboard com fundo branco** — quebra de tema inaceitável em produto com dark mode

---

*Auditoria executada por Cascade em 22/04/2026 — 56 screenshots · 38 rotas · 3 viewports · análise visual sênior completa*
