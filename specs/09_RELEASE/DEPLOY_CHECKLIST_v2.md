# Deploy Checklist — PE-2026 (Ondas A–F)

**Data:** 2026-04-22  
**Versão:** pós Onda F  
**Projeto:** `b:\aero-studio\projects\estrategico\planejamento-estrategico`

---

## TL;DR — Smoke rápido

```powershell
node -v                    # >= 20.x
npm ci                     # exit 0
npx tsc --noEmit           # 0 erros
npm run build              # exit 0
npm run preview            # porta 4173
# Abrir: /dashboard, /planning, /planning/rh/dashboard, /analytics/scoreboard
```

---

## 1. Pré-Deploy (Local)

### 1.1 Ambiente

| Check | Comando | Esperado |
|-------|---------|----------|
| Node | `node -v` | >= 20.x |
| npm | `npm -v` | >= 9.x |
| Diretório | confirmar cwd | raiz do projeto |

### 1.2 Dependências

| Check | Comando | Esperado |
|-------|---------|----------|
| Install limpo | `npm ci` | exit 0 |
| Lock file | verificar `package-lock.json` | presente |

### 1.3 TypeScript

| Check | Comando | Esperado |
|-------|---------|----------|
| Type check | `npx tsc --noEmit` | exit 0 — **0 erros** |

### 1.4 Build

| Check | Comando | Esperado |
|-------|---------|----------|
| Build prod | `npm run build` | exit 0 |
| Tempo | (observar) | < 20s |
| Output | `dist/index.html` presente | ✓ |

### 1.5 Testes

| Check | Comando | Esperado |
|-------|---------|----------|
| Unit tests | `npm run test` | 0 falhas |
| E2E default | `npm run test:e2e` | 14/14 pass |
| E2E local (Supabase) | `npm run test:e2e:local` | 32/32 pass (requer Supabase local) |

---

## 2. Variáveis de Ambiente

### Modo Demo (sem Supabase)
Nenhuma variável necessária. A aplicação funciona 100% com dados mock.  
**Banner "Modo Demo"** aparecerá automaticamente no topo da UI.

### Modo Supabase (produção real)

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Sim |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima Supabase | Sim |
| `VITE_APP_NAME` | Nome exibido na UI | Não (default: `Template App`) |
| `VITE_APP_VERSION` | Versão exibida | Não |
| `VITE_SENTRY_DSN` | DSN do Sentry (observabilidade) | Não |

> **Netlify:** Configurar em Site Settings → Environment Variables.  
> Ausência de `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` ativa modo demo — válido para preview/staging.

---

## 3. Netlify — Headers e Redirects

Verificar `netlify.toml` contém:
- `index.html` → `Cache-Control: no-cache, no-store, must-revalidate` ✓
- `/assets/*` → `Cache-Control: public, max-age=31536000, immutable` ✓
- SPA fallback `/* → /index.html` status 200 (deve ser **último**) ✓
- Security headers em `/*` (X-Frame-Options, X-Content-Type-Options) ✓

---

## 4. Smoke Pós-Deploy

### 4.1 Rotas Críticas

| # | Rota | O que verificar |
|---|------|----------------|
| 1 | `/` → redireciona para `/dashboard` | Redirect correto |
| 2 | `/dashboard` | KPIs, sidebar, dark mode toggle |
| 3 | `/planning` | AreaSelector exibe áreas canônicas (7) |
| 4 | `/planning/rh/dashboard` | Plano RH carrega, quick links visíveis |
| 5 | `/planning/rh/kanban` | Kanban renderiza colunas |
| 6 | `/planning/rh/timeline` | Timeline renderiza ações |
| 7 | `/planning/dashboard` | Dashboard multiárea com stats |
| 8 | `/planning/actions/manage` | DataTable com ações |
| 9 | `/planning/actions/approvals` | Lista de evidências pendentes |
| 10 | `/planning/actions/evidences` | Backlog de evidências |
| 11 | `/analytics/scoreboard` | Guardrails A1-A4, KPIs P1-P5, EWS |
| 12 | `/governance` | Closings, calendário, rituais |
| 13 | `/login` | Formulário, modo demo banner na UI pós-login |
| 14 | `/404` (rota inválida) | NotFoundPage |

### 4.2 Redirects Legacy (verificar que não quebram)

| Rota antiga | Destino esperado |
|-------------|-----------------|
| `/area-plans` | `/planning` |
| `/area-plans/dashboard` | `/planning/dashboard` |
| `/area-plans/rh` | `/planning/rh/dashboard` (via LegacyAreaRedirect) |

### 4.3 Modo Demo

| Check | Como verificar |
|-------|---------------|
| Banner visível | Após login sem Supabase configurado |
| Banner dismissível | Clicar ✕ — some por toda a sessão |
| Dados fictícios | Dashboard exibe dados mock (não vazio) |
| Login aceita qualquer credencial | Qualquer email/senha funciona |

### 4.4 Modo Supabase (quando configurado)

| Check | Como verificar |
|-------|---------------|
| Sem banner demo | Banner não aparece |
| Login com credencial real | Só aceita usuário Supabase válido |
| Erro 401 tratado | Redireciona para `/login` sem erro no console |
| Sessão persistida | Recarregar página mantém sessão |

---

## 5. Migrations Supabase (Ondas A–F)

Aplicar em ordem ao ativar Supabase:

```sql
-- Onda A — base canônica
\i supabase/migrations/20260319_onda_a_canonical_base.sql

-- Onda B — hardening (RLS, FK, índices, audit_log)
\i supabase/migrations/20260320_onda_b_hardening.sql

-- Onda F — feature flags, cutover, rollback
\i supabase/migrations/20260321_onda_f_cutover.sql

-- Seeds canônicos (7 áreas, 5 pilares, 22 INITs, 25 KRs, etc.)
\i supabase/seeds/05_canonical_pe2026_seed.sql

-- Verificador de integridade (15 asserções)
\i supabase/seeds/06_integrity_check.sql
```

Validar cutover módulo a módulo:
```sql
SELECT validate_cutover('area-plans');
-- Quando OK:
SELECT set_feature_flag('area-plans', true);
```

---

## 6. Rollback

| Passo | Ação |
|-------|------|
| 1 | No Netlify: "Publish deploy" na versão anterior |
| 2 | Se Supabase: `SELECT rollback_module('area-plans')` |
| 3 | Se dados corrompidos: limpar `localStorage` do browser |
| 4 | Verificar console JS (F12) para erros |

---

## 7. Observabilidade

| Check | Onde |
|-------|------|
| Erros JS | Console DevTools (F12) |
| Network errors | Aba Network DevTools |
| Modo mock ativo | Console — `[Area Plans API] Modo mock ativo` (1x por sessão) |
| Env vars ausentes | Console — `[PE2026] PROD: Variáveis de ambiente ausentes: ...` |
| Supabase inacessível | Console — `[Supabase] Network unreachable` |
| Sentry (se DSN configurado) | painel.sentry.io |

---

## 8. Performance

| Métrica | Esperado |
|---------|---------|
| Build time | < 20s |
| First Contentful Paint | < 3s (Lighthouse) |
| `index.html` | sem cache (no-cache) |
| Assets JS/CSS | cache 1 ano (hash no nome) |

---

## 9. Segurança

| Check | Descrição |
|-------|-----------|
| `VITE_SUPABASE_ANON_KEY` | Nunca hardcoded — via env var |
| CSP `connect-src` | Inclui `*.supabase.co`, `*.supabase.in`, localhost para DEV |
| `X-Frame-Options: DENY` | Protege contra clickjacking |
| `X-Content-Type-Options: nosniff` | Protege contra MIME sniffing |
| Role override | `pe2026-role-override` no localStorage — **DEV only** |
| Mock fallback em PROD | **Bloqueado** se Supabase configurado mas inacessível |

---

**Versão:** 2.0  
**Data:** 2026-04-22  
**Cobre:** Ondas A–F, roteamento `/planning`, modo demo, Supabase runtime state
