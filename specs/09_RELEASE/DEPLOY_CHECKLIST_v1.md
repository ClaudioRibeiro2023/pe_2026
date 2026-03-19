# Deploy Checklist — PE-2026 v1.0.6

**Data:** 2026-02-09  
**Versao:** 1.0.6  
**Repositorio:** B:\PE_2026

---

## TL;DR

```
node -v                        # >= 18.x
npm ci                         # instalar deps
npx tsc --noEmit               # 0 erros TS
npm run build                  # exit 0 (~6s)
npm run preview                # porta 4173 (ou proxima livre)
# Validar: /dashboard, /reports, /planning/rh/dashboard, /governance/closings
```

---

## 1. Pre-Deploy (Local)

### 1.1 Ambiente

| Check | Comando | Esperado |
|-------|---------|----------|
| Node version | `node -v` | >= 18.x (recomendado 20.x) |
| npm version | `npm -v` | >= 9.x |
| Diretorio | `cd B:\PE_2026` | Raiz do projeto |

### 1.2 Dependencias

| Check | Comando | Esperado |
|-------|---------|----------|
| Install limpo | `npm ci` | exit 0, sem vulnerabilidades criticas |
| Lock file | Verificar `package-lock.json` existe | Presente |

### 1.3 Type Check

| Check | Comando | Esperado |
|-------|---------|----------|
| TypeScript | `npx tsc --noEmit` | exit 0, 0 erros |

### 1.4 Build

| Check | Comando | Esperado |
|-------|---------|----------|
| Build producao | `npm run build` | exit 0 |
| Tempo | (observar) | < 15s |
| Output dir | `dist/` | Populado com index.html + assets |
| Modules | (observar) | ~2100+ |

### 1.5 QA Automatizado

| Check | Comando | Esperado |
|-------|---------|----------|
| QA Multiarea | `powershell -File scripts/dev/qa_multiarea_sprint8.ps1` | 35/35 PASS |
| QA Release | `powershell -ExecutionPolicy Bypass -File scripts/dev/qa_release_readiness.ps1` | All PASS |

---

## 2. Deploy Steps (Ambiente)

### 2.1 Variaveis de Ambiente

| Variavel | Descricao | Default |
|----------|-----------|---------|
| `VITE_APP_ENV` | Ambiente (production/staging) | production |
| `VITE_SUPABASE_URL` | URL do Supabase (se ativo) | Mock mode se ausente |
| `VITE_SUPABASE_ANON_KEY` | Chave anonima Supabase | Mock mode se ausente |

> **Nota:** A aplicacao funciona 100% em mock mode sem Supabase configurado.

### 2.2 Build Command

```bash
npm run build
# Equivale a: tsc -b && vite build
```

### 2.3 Artefatos

| Artefato | Path | Descricao |
|----------|------|-----------|
| HTML | `dist/index.html` | Entry point SPA |
| CSS | `dist/assets/index-*.css` | ~82 KB (13 KB gzip) |
| JS | `dist/assets/*.js` | Chunks code-split |
| Assets | `dist/assets/` | Icons, fonts |

### 2.4 Servidor

- **SPA routing:** Todas as rotas devem redirecionar para `index.html` (fallback)
- **Porta default:** 4173 (preview) — pode variar se ocupada
- **Preview local:** `npm run preview`

---

## 3. Pos-Deploy Smoke

### 3.1 Rotas Criticas

| # | Rota | O que verificar |
|---|------|----------------|
| 1 | `/dashboard` | KPIs carregam, sidebar visivel, dark mode toggle |
| 2 | `/reports` | 3 tabs (Executivo/Acoes/Progresso), filtros de area/pack |
| 3 | `/planning/dashboard` | Dashboard planning com metricas |
| 4 | `/planning/calendar` | Calendario renderiza, eventos visiveis |
| 5 | `/planning/actions/manage` | Lista de acoes com DataTable |
| 6 | `/governance/closings` | Lista de fechamentos |
| 7 | `/planning/rh/dashboard` | Dashboard area RH com 42+ acoes |
| 8 | `/planning/marketing/dashboard` | Dashboard area MKT com 20+ acoes |
| 9 | `/planning/operacoes/dashboard` | Dashboard area OPS com 20+ acoes |
| 10 | `/planning/financeiro/dashboard` | Dashboard area FIN com 20+ acoes |

### 3.2 Exports

| # | Export | Como testar |
|---|--------|------------|
| 1 | Report PDF | `/reports` -> Tab Executivo -> Botao PDF |
| 2 | Report CSV | `/reports` -> Tab Acoes -> Botao CSV |
| 3 | Closing PDF | `/governance/closings` -> Detalhe -> PDF |
| 4 | Closing CSV | `/governance/closings` -> Detalhe -> CSV |
| 5 | Pack PDF | `/planning/rh/pe-2026` -> Botao PDF |

### 3.3 RBAC Toggle

| # | Check | Como testar |
|---|-------|------------|
| 1 | `MULTIAREA_ENABLED = true` | Sidebar mostra 5 areas em "Planos por Area" |
| 2 | `MULTIAREA_ENABLED = false` | Sidebar mostra apenas RH |
| 3 | Role override | localStorage `pe2026-role-override` = `colaborador` -> botoes de edicao ocultos (P1) |

---

## 4. Rollback

| Passo | Acao |
|-------|------|
| 1 | Manter build anterior em `dist.bak/` antes de deploy |
| 2 | Se falhar: `mv dist.bak dist` e reiniciar servidor |
| 3 | Se dados corrompidos: limpar `localStorage` do navegador |
| 4 | Verificar console do navegador para erros JS |

---

## 5. Observabilidade

| Check | Onde |
|-------|------|
| Erros JS | Console do navegador (F12) |
| Network errors | Aba Network do DevTools |
| Mock API logs | Console — prefixo `[Mock API]` |
| Build warnings | Output do `npm run build` |
| Bundle size | Output do build (gzip sizes) |

---

## 6. Performance

| Metrica | Valor Esperado | Como medir |
|---------|---------------|------------|
| Build time | < 15s | Output do `npm run build` |
| First paint | < 3s | DevTools Lighthouse |
| Bundle CSS | ~82 KB / 13 KB gzip | Output do build |
| Bundle JS total | ~1.5 MB / ~400 KB gzip | Output do build |
| Modules | ~2100+ | Output do build |

---

## 7. Seguranca (RBAC)

| Check | Descricao |
|-------|-----------|
| Roles definidos | admin, direcao, gestor, colaborador, cliente |
| Role-area matrix | `src/shared/config/rbac.ts` — ROLE_AREA_ACCESS |
| Feature permissions | 11 features com matrix por role |
| Flag RH-only | `MULTIAREA_ENABLED = false` restringe a RH |
| Role override | Dev-only via localStorage — nao expor em producao |
| API keys | Nenhuma hardcoded — via env vars |

---

## 8. Dados (Seeds)

| Check | Descricao | Evidencia |
|-------|-----------|-----------|
| Seeds idempotentes | Closings verificam ID antes de inserir | `closings/api-mock.ts` |
| Acoes por area | RH=59, MKT=25, OPS=27, FIN=21, TI=15 | QA Sprint 8 |
| Packs | 4 packs com 5 secoes cada | `strategic-pack/api-mock.ts` |
| Plans linkados | MKT/OPS/FIN vinculados a pack_id | `mockData.ts` |
| IDs padronizados | AREA-PROG-NN | Sem IDs legados |

---

## 9. Acessibilidade Minima

| Check | Resultado | Referencia |
|-------|-----------|------------|
| A11y smoke | 9/10 PASS | Wave 5 OUTPUT |
| focus-visible | 11 ocorrencias | PASS |
| aria-label | 30 ocorrencias | PASS |
| role= | 23 ocorrencias | PASS |
| skip-to-main | 2 ocorrencias | PASS |
| sr-only | 1 ocorrencia | WARN (expandir em P2) |

---

**Versao:** 1.0.6  
**Data:** 2026-02-09 08:44 UTC-3
