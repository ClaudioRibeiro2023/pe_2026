# QA UI Redesign v1 — Heuristica + Checklist + Regressoes

**Data:** 2026-02-06  
**Versao:** v1  
**Aplica-se a:** Ondas 1-5 do Redesign

---

## 1. Heuristica de Avaliacao (por Onda)

Cada onda deve ser avaliada contra os seguintes criterios antes de ser considerada concluida:

| # | Heuristica | Descricao | Peso |
|---|-----------|-----------|------|
| H1 | **Consistencia visual** | Cores, tipografia, espacamento seguem tokens | 25% |
| H2 | **Feedback** | Toda acao do usuario tem resposta visual (toast, loading, error) | 20% |
| H3 | **Navegacao** | Breadcrumbs corretos, sidebar ativa, back funciona | 15% |
| H4 | **Acessibilidade** | Focus, ARIA, semantica, contraste | 15% |
| H5 | **Responsividade** | Layout nao quebra em 375px-1920px | 10% |
| H6 | **Dark mode** | Todas as pages funcionam em .dark | 10% |
| H7 | **Performance** | Build rapido, sem re-renders extras, bundle compact | 5% |

### Escala de avaliacao

| Score | Descricao |
|-------|-----------|
| 5 | Excelente — nenhum problema encontrado |
| 4 | Bom — problemas cosmeticos menores |
| 3 | Aceitavel — problemas que nao bloqueiam uso |
| 2 | Insuficiente — problemas visiveis que afetam UX |
| 1 | Critico — funcionalidade comprometida |

---

## 2. Checklist de Acessibilidade (WCAG 2.1 AA)

### 2.1 Percepcao

| # | Criterio | Verificacao | Status |
|---|----------|-------------|--------|
| A1 | Contraste texto normal >= 4.5:1 | Verificar com DevTools color picker | |
| A2 | Contraste texto grande >= 3:1 | Titulos e headers | |
| A3 | Informacao nao depende apenas de cor | Status tem label + cor + icone | |
| A4 | Imagens tem alt text | Icones decorativos: `aria-hidden="true"` | |

### 2.2 Operabilidade

| # | Criterio | Verificacao | Status |
|---|----------|-------------|--------|
| A5 | Tudo acessivel por teclado | Tab navega todos os interativos | |
| A6 | Focus visivel em todos os interativos | `focus-visible` ring azul | |
| A7 | Skip-to-main-content funciona | Tab no primeiro focus | |
| A8 | Ordem de tab logica | Segue layout visual | |
| A9 | Escape fecha modais/dropdowns | Testar em Modal, Select | |
| A10 | Nao ha armadilha de foco | Focus nao fica preso em nenhum componente | |

### 2.3 Compreensao

| # | Criterio | Verificacao | Status |
|---|----------|-------------|--------|
| A11 | Labels em todos os inputs | `<label>` com `htmlFor` | |
| A12 | Erros identificados e descritos | `aria-describedby` em campos com erro | |
| A13 | Instrucoes para entrada de dados | Placeholder ou hint text | |

### 2.4 Robustez

| # | Criterio | Verificacao | Status |
|---|----------|-------------|--------|
| A14 | HTML semantico | `<nav>`, `<main>`, `<section>`, `<table>` | |
| A15 | ARIA roles corretos | `role="dialog"`, `role="tablist"`, etc. | |
| A16 | Tabelas com `<caption>` e `<th scope>` | Todas as DataTables | |
| A17 | `aria-current="page"` em breadcrumbs | Ultimo item sem link | |

---

## 3. Checklist de Regressao (por Onda)

### 3.1 Planning Flows

| # | Flow | Verificacao |
|---|------|-------------|
| R1 | Selecionar area RH | /planning → clicar RH → /planning/rh/dashboard |
| R2 | Ver dashboard consolidado | /planning/dashboard → 4 stats + tabela |
| R3 | Ver acoes por lista | /planning/actions/manage → lista com 42 acoes |
| R4 | Filtrar acoes | Filtro por status "CONCLUIDA" → subset |
| R5 | Ver calendario | /planning/calendar → grid com eventos |
| R6 | Navegar meses | Anterior/proximo mudam mes |
| R7 | Ver strategic pack | /planning/rh/pe-2026 → pack com secoes |
| R8 | Ver aprovacoes | /planning/actions/approvals → lista |
| R9 | Ver evidencias | /planning/actions/evidences → backlog |
| R10 | Area subnav | Tabs Dashboard/Kanban/Calendar/Timeline/PE-2026 funcionam |

### 3.2 Reports Flows

| # | Flow | Verificacao |
|---|------|-------------|
| R11 | Selecionar area | /reports → dropdown area → muda pack |
| R12 | Selecionar pack | Dropdown pack → atualiza dados |
| R13 | Mudar periodo | Date inputs → filtra acoes |
| R14 | Ver relatorio executivo | Tab Executivo → KPIs + distribuicao |
| R15 | Ver acoes por pack | Tab Acoes → lista filtrada |
| R16 | Ver progresso | Tab Progresso → charts + tabelas |
| R17 | Exportar PDF | Botao PDF → download + toast |
| R18 | Exportar CSV | Botao Excel → download + toast |

### 3.3 Build & Infra

| # | Check | Comando |
|---|-------|---------|
| R19 | Build sem erros | `npm run build` → exit 0 |
| R20 | Zero icon warnings | Build output sem "dynamically imported" |
| R21 | TypeScript sem erros | `npx tsc --noEmit` → exit 0 |

---

## 4. Scripts de Lint Sugeridos

### 4.1 Bloquear text-gray-* novo

```powershell
# lint_no_raw_colors.ps1
# Roda apos cada onda para garantir zero cores raw em arquivos alterados

$files = Get-ChildItem -Path "src/" -Recurse -Include "*.tsx","*.ts" |
  Where-Object { $_.FullName -notmatch "tokens\.css|tailwind\.config" }

$violations = @()
$patterns = @("text-gray-", "bg-white", "border-gray-", "bg-gray-")

foreach ($file in $files) {
  $content = Get-Content -Raw $file.FullName
  foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
      $matches = [regex]::Matches($content, $pattern)
      $violations += "$($file.Name): $($matches.Count)x $pattern"
    }
  }
}

if ($violations.Count -eq 0) {
  Write-Host "OK — Zero cores raw encontradas"
} else {
  Write-Host "ALERTA — $($violations.Count) violacoes:"
  $violations | ForEach-Object { Write-Host "  $_" }
}
```

### 4.2 Verificar PageHeader em todas as pages

```powershell
# lint_page_headers.ps1
$pages = Get-ChildItem -Path "src/features/planning/pages","src/features/reports/pages" -Recurse -Include "*.tsx"

foreach ($page in $pages) {
  $content = Get-Content -Raw $page.FullName
  $hasPageHeader = $content -match "PageHeader"
  $status = if ($hasPageHeader) { "OK" } else { "FALTA PageHeader" }
  Write-Host "$($page.Name): $status"
}
```

### 4.3 Verificar breadcrumbs

```powershell
# lint_breadcrumbs.ps1
$pages = Get-ChildItem -Path "src/features/planning/pages","src/features/reports/pages" -Recurse -Include "*.tsx"

foreach ($page in $pages) {
  $content = Get-Content -Raw $page.FullName
  $hasBreadcrumbs = $content -match "breadcrumbs|Breadcrumb|getBreadcrumbs"
  $status = if ($hasBreadcrumbs) { "OK" } else { "FALTA Breadcrumbs" }
  Write-Host "$($page.Name): $status"
}
```

---

## 5. Evidencias Exigidas (em .md)

Cada onda deve gerar um report em:
```
specs/05_UI_REDESIGN/QA_ONDA_N_<timestamp>.md
```

O report deve conter:

| Secao | Conteudo |
|-------|---------|
| Build log | Output de `npm run build` (exit code + warnings) |
| Lint cores | Output do lint_no_raw_colors.ps1 |
| Lint PageHeader | Output do lint_page_headers.ps1 |
| Checklist regressao | R1-R21 com PASSA/FALHA |
| Checklist a11y | A1-A17 com score |
| Score heuristico | H1-H7 com nota 1-5 |
| Arquivos alterados | Lista com hash SHA256 parcial |
| Decisoes tomadas | Qualquer desvio do blueprint |

---

## 6. Evidencias Wave1 (DONE)

A Wave1 foi concluida em 2026-02-08 com status **PASSA**. Evidencias:

| Documento | Path |
|-----------|------|
| Baseline metrics | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_1539.md` |
| Post-migration metrics | `specs/05_UI_REDESIGN/METRICS_RAW_COLORS_20260208_1801.md` |
| QA Report Wave1 | `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE1_20260208_1802.md` |
| OUTPUT Wave1 | `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE1_20260208_1802.md` |
| GATE Result Wave1 | `specs/05_UI_REDESIGN/GATE_UI_REDESIGN_WAVE1_RESULT_20260208_1930.md` |

### Resumo Wave1

| Metrica | Valor |
|---------|-------|
| Raw colors | 889 → 852 (-37, -4.2%) |
| PageHeader | 5/5 |
| Breadcrumbs | 5/5 |
| Build | OK (exit 0) |
| Guardrail | Modo nao-regressao |

---

## 7. Wave2 QA — Requisitos

A Wave2 deve gerar um QA report em `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE2_<timestamp>.md` contendo:

| Secao | Conteudo obrigatorio |
|-------|---------------------|
| Heatmap raw colors | Top-10 arquivos com mais usos raw ANTES da migracao |
| Delta raw colors | Contagem pos-W1 (852) vs pos-W2 (target <= 760) |
| FilterBar verificacao | Presente em >= 3 paginas com >= 3 filtros cada |
| DataTable verificacao | Presente em >= 3 paginas com sort + pagination |
| Build log | `npm run build` exit 0 |
| Guardrail | `ui_guardrail_no_raw_colors.ps1` — reducao confirmada |
| Checklist regressao | R1-R21 com PASSA/FALHA |
| Toast CRUD | Criar/editar/deletar acoes mostram toast |

---

*Documento gerado como parte do Blueprint v1 do UI Redesign — PE_2026 (atualizado v1.1 em 2026-02-08)*
