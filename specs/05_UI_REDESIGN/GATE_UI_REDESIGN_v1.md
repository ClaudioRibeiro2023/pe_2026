# GATE UI Redesign v1 — Criterios PASSA/FALHA

**Data:** 2026-02-06  
**Versao:** v1  
**Aplica-se a:** Gate final apos Onda 5

---

## 1. Criterios Obrigatorios (PASSA/FALHA)

| # | Criterio | Comando/Verificacao | PASSA se... |
|---|----------|---------------------|-------------|
| G-01 | Build sem erros | `npm run build` | exit code 0 |
| G-02 | TypeScript sem erros | `npx tsc --noEmit` | exit code 0 |
| G-03 | Zero icon warnings | Build output | 0 linhas "dynamically imported" |
| G-04 | Zero `text-gray-*` em features/ | `grep -r "text-gray-" src/features/` | 0 matches |
| G-05 | Zero `bg-white` em features/ | `grep -r "bg-white" src/features/` | 0 matches |
| G-06 | Zero `border-gray-*` em features/ | `grep -r "border-gray-" src/features/` | 0 matches |
| G-07 | PageHeader em todas as planning pages | lint_page_headers.ps1 | 100% OK |
| G-08 | Breadcrumbs em todas as planning pages | lint_breadcrumbs.ps1 | 100% OK |
| G-09 | Toast em CRUD (criar/editar/deletar) | Verificacao manual | 3/3 toasts |
| G-10 | Dark mode funcional | Verificacao manual em 5 rotas | 5/5 OK |
| G-11 | Paginacao em lista de acoes | /planning/actions/manage | Pagina com 10 items |
| G-12 | Calendar usa tokens de cor | `grep "bg-red-100\|bg-blue-100" src/` | 0 matches |
| G-13 | Responsive: sem overflow em 768px | Verificacao manual | 0 overflows |
| G-14 | Score ponderado >= 4.5 | Re-auditoria heuristica | Score >= 4.5 |

### Regra de aprovacao

- **PASSA:** Todos os 14 criterios aprovados
- **PASSA CONDICIONAL:** 12+ criterios, desvios documentados com prazo
- **FALHA:** < 12 criterios

---

## 2. Criterios de Nao-Regressao

### 2.1 Planning Flows (obrigatorio)

| # | Flow | Rota | Esperado |
|---|------|------|----------|
| NR-01 | Selecionar area | `/planning` → RH | Navega para dashboard RH |
| NR-02 | Dashboard consolidado | `/planning/dashboard` | 4 stat cards + tabela |
| NR-03 | Gerenciar acoes | `/planning/actions/manage` | Lista com 42 acoes |
| NR-04 | Filtrar por status | Filtro "CONCLUIDA" | Subset correto |
| NR-05 | Calendario | `/planning/calendar` | Grid mensal com eventos |
| NR-06 | Strategic Pack | `/planning/rh/pe-2026` | Pack com secoes |
| NR-07 | Area subnav | Tabs na area | 5 tabs navegaveis |

### 2.2 Reports Flows (obrigatorio)

| # | Flow | Rota | Esperado |
|---|------|------|----------|
| NR-08 | Hub relatorios | `/reports` | 3 tabs de relatorio |
| NR-09 | Pack selector | Dropdown pack | Muda dados |
| NR-10 | Date range | Inputs date | Filtra por periodo |
| NR-11 | Charts | Tab Progresso | Bar + Doughnut renderizam |
| NR-12 | Export PDF | Botao PDF | Download + toast sucesso |
| NR-13 | Export CSV | Botao Excel | Download + toast sucesso |

### 2.3 Infra (obrigatorio)

| # | Check | Esperado |
|---|-------|----------|
| NR-14 | 42 acoes RH no mock | Regex `RH-[A-Z]{3}-\d{2}` = 42 unicos |
| NR-15 | Todas as rotas acessiveis | 16 rotas sem 404 |

---

## 3. Evidencias Obrigatorias

| # | Evidencia | Formato |
|---|-----------|---------|
| E-01 | Build log completo | Texto no .md |
| E-02 | Output lint cores (grep) | Texto no .md |
| E-03 | Output lint PageHeader | Texto no .md |
| E-04 | Output lint Breadcrumbs | Texto no .md |
| E-05 | Checklist regressao NR-01 a NR-15 | Tabela PASSA/FALHA |
| E-06 | Score heuristico H1-H7 | Tabela com notas |
| E-07 | Lista de arquivos alterados + hashes | Tabela |
| E-08 | Bundle size antes/depois | Numeros em KB |

---

## 4. Comandos de Verificacao

```powershell
# 1. Build
npm run build

# 2. TypeScript
npx tsc --noEmit

# 3. Cores raw em features/
grep -r "text-gray-\|bg-white\|border-gray-\|bg-gray-" src/features/ --include="*.tsx" --include="*.ts" -l

# 4. Icon warnings
npm run build 2>&1 | Select-String "dynamically imported"

# 5. PageHeader check
Get-ChildItem -Path "src/features/planning/pages","src/features/reports/pages" -Recurse -Include "*.tsx" | ForEach-Object {
  $has = (Get-Content -Raw $_.FullName) -match "PageHeader"
  "$($_.Name): $(if ($has) {'OK'} else {'FALTA'})"
}

# 6. Calendar cores hardcoded
grep -r "bg-red-100\|bg-blue-100\|bg-green-100\|bg-yellow-100" src/features/planning/ --include="*.tsx" -l

# 7. Mock data count
$mock = Get-Content -Raw "src/features/area-plans/utils/mockActions.ts"
$ids = [regex]::Matches($mock, "RH-[A-Z]{3}-\d{2}") | ForEach-Object { $_.Value } | Sort-Object -Unique
"IDs unicos: $($ids.Count)"

# 8. QA script completo
powershell -ExecutionPolicy Bypass -File scripts/dev/qa_ui_redesign.ps1
```

---

## 5. Arquivo de Saida

O gate report deve ser salvo em:
```
specs/05_UI_REDESIGN/GATE_REPORT_UI_REDESIGN_<timestamp>.md
```

---

## 6. Resultado Wave1 (oficial)

**Status: PASSA**
**Data: 2026-02-08 19:30 (UTC-03:00)**

| # | Criterio | Resultado |
|---|----------|-----------|
| 1 | Build | OK (exit 0, 12.91s) |
| 2 | Raw colors baseline | 889 |
| 3 | Raw colors after | 852 |
| 4 | Delta | -37 (-4.2%) |
| 5 | PageHeader aplicado | 5/5 |
| 6 | Breadcrumbs aplicado | 5/5 |
| 7 | Componentes shared migrados | 4/4 (Card, Input, Progress, Tooltip) |
| 8 | Componentes novos | 2/2 (Breadcrumbs, PageHeader) |
| 9 | Acessibilidade Breadcrumbs | OK (aria-label, aria-current, aria-hidden) |
| 10 | Imports limpos | OK (zero unused) |
| 11 | Guardrail | Modo nao-regressao (falha esperada por legado) |

**Evidencias:**
- `specs/05_UI_REDESIGN/GATE_UI_REDESIGN_WAVE1_RESULT_20260208_1930.md`
- `specs/05_UI_REDESIGN/QA_UI_REDESIGN_WAVE1_20260208_1802.md`
- `specs/05_UI_REDESIGN/OUTPUT_UI_REDESIGN_WAVE1_20260208_1802.md`

---

## 7. Pre-condicoes Wave2

Para que Wave2 seja considerada PASSA, deve atender:

| # | Criterio | Verificacao | PASSA se... |
|---|----------|-------------|-------------|
| W2-01 | Raw colors <= 760 | `ui_count_raw_colors.ps1` | Total <= 760 |
| W2-02 | FilterBar aplicado | Verificar presenca em codigo | >= 3 paginas |
| W2-03 | DataTable aplicado | Verificar presenca em codigo | >= 3 paginas |
| W2-04 | DataTable com sort | Clicar header muda ordem | >= 2 colunas |
| W2-05 | DataTable com paginacao | 10 items/page | 42 acoes = 5 pages |
| W2-06 | Heatmap gerado | Top-10 arquivos documentados | Arquivo .md gerado |
| W2-07 | Toast em CRUD | Criar/editar/deletar acoes | 3/3 toasts |
| W2-08 | Build OK | `npm run build` | exit 0 |
| W2-09 | Guardrail delta | Comparar pos-W1 vs pos-W2 | Reducao confirmada |

---

*Documento gerado como parte do Blueprint v1 do UI Redesign — PE_2026 (atualizado v1.1 em 2026-02-08)*
