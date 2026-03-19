# OUTPUT - Sprint 5 Kickoff + Hardening QA Build Capture

**Data:** 2026-02-06 17:41 (UTC-03:00)  
**Repo:** B:\PE_2026  

---

## Sumario

| Parte | Descricao | Status |
|-------|-----------|--------|
| A | Hardening build capture no script PS1 | Concluido |
| B | Sprint 5 Discovery + Docs canonicos | Concluido |
| C | Este OUTPUT | Concluido |

---

## PARTE A - Hardening Build Capture

### Bloco alterado em `scripts/dev/finalize_rh_actions_seed.ps1`

```powershell
# ---------- Optional: build capture (light) ----------
$buildOut = ""
try {
  $buildOutRaw = (npm run build 2>&1 | Out-String)
  $exit = $LASTEXITCODE
  if ($exit -ne 0) {
    $buildOut = "BUILD FAILED (exit $exit)`n$($buildOutRaw.Trim())"
  } else {
    $buildOut = "BUILD OK (exit $exit)`n$($buildOutRaw.Trim())"
  }
} catch {
  $buildOut = "ERRO no build (exception): $($_.Exception.Message)"
}
```

### QA Report anterior (referencia)

- **Arquivo:** `specs/04_REPORTS/QA_RH_ACTIONS_SEED_IMPORT_20260206_1738.md`
- **Secao Build:** Continha `ERRO no build: [plugin:vite:reporter]` (falso positivo - capturava warnings como erro)

### Correcao aplicada

- Agora captura `$LASTEXITCODE` apos `npm run build`
- Se exit code == 0: `BUILD OK (exit 0)` + warnings como informativo
- Se exit code != 0: `BUILD FAILED (exit N)` + output completo
- Proximo QA report gerado pelo script tera a secao correta

---

## PARTE B - Sprint 5 Discovery + Docs

### Discovery: Relatorios

#### Mapa de Rotas

| Rota | Pagina | Arquivo | Status |
|------|--------|---------|--------|
| `/reports` | ReportsPage | `src/features/reports/pages/ReportsPage.tsx` | Placeholder ("Em construcao") |

#### Navegacao (sidebar)

- Secao: **Gerencial**
- Item: "Relatorios" -> `/reports` (icon: FileText)
- Definido em `src/shared/config/navigation.ts` linha 86-88

#### Arquivos existentes

| Arquivo | Descricao |
|---------|-----------|
| `src/features/reports/pages/ReportsPage.tsx` | Pagina placeholder (31 linhas) - sera reescrita |
| `src/shared/lib/export.ts` | Funcoes exportToPDF (jsPDF) e exportToExcel (CSV) - 104 linhas |
| `src/shared/components/export/ExportButtons.tsx` | Botoes PDF + Excel reutilizaveis - 42 linhas |

#### Hooks/Services existentes

| Modulo | Descricao |
|--------|-----------|
| `shared/lib/export.ts` | `exportToPDF()`, `exportToExcel()`, `useExport()` hook |
| `features/area-plans/api-mock.ts` | Todos os dados mock (areas, planos, acoes, evidencias) |
| `features/area-plans/utils/mockData.ts` | mockStore com 5 areas, 5 pilares, 10 planos |
| `features/area-plans/utils/mockActions.ts` | 42 acoes RH + acoes exemplo MKT/OPS |

#### Dependencias ja no bundle

- `jspdf` + `jspdf-autotable` (PDF generation)
- `chart.js` + `react-chartjs-2` (graficos)
- `date-fns` (formatacao de datas)
- `html2canvas` (screenshot para PDF)

---

### Docs Canonicos Criados

---

#### SPEC_03_PLANNING_REPORTS_SPRINT5.md

```
Caminho: specs/01_SPECS/SPEC_03_PLANNING_REPORTS_SPRINT5.md

Conteudo:
- Objetivo de negocio: relatorios consolidados por area/pack/periodo
- Escopo MVP: 7 itens (P0: executivo, acoes, progresso | P1: exports | P2: evidencias, historico)
- Rotas: /reports (hub central)
- 18 requisitos funcionais (RF-01 a RF-18)
- 5 requisitos nao-funcionais (RNF-01 a RNF-05)
- 8 criterios de aceite (CA-01 a CA-08)
- 3 riscos documentados com mitigacao
- 8 dependencias mapeadas
- 5 arquivos envolvidos (1 rewrite + 4 novos componentes/hooks)
```

---

#### TODO_06_REPORTS_SPRINT5.md

```
Caminho: specs/03_TODOS/TODO_06_REPORTS_SPRINT5.md

Conteudo:
- WIP limit: 2 tasks simultaneas
- 11 tasks totais:
  - P0 (MVP): 5 tasks (hook, hub, executivo, acoes, progresso)
  - P1 (Export): 3 tasks (integrar ExportButtons em cada relatorio)
  - P2 (Refinamentos): 3 tasks (evidencias, historico, regressao)
- Sequencia recomendada com grafo de dependencias
- Definition of Done: 10 criterios
```

---

#### QA_06_REPORTS_SPRINT5.md

```
Caminho: specs/04_REPORTS/QA_06_REPORTS_SPRINT5.md

Conteudo:
- 17 casos de teste funcionais (FT-01 a FT-17)
  - Hub: 5 testes
  - Executivo: 3 testes
  - Acoes por Pack: 3 testes
  - Progresso Geral: 3 testes
  - Exportacao: 3 testes
- 5 testes de UI states (loading, empty, completo, responsive, dark mode)
- 7 checks de regressao (REG-01 a REG-07)
- 4 evidencias exigidas (QA report, build log, contagem, checklist)
```

---

#### GATE_09_REPORTS_SPRINT5.md

```
Caminho: specs/02_GATES/GATE_09_REPORTS_SPRINT5.md

Conteudo:
- 10 criterios PASSA/FALHA (G-01 a G-10)
- 4 comandos obrigatorios (tsc, build, preview, diagnostico)
- 4 evidencias exigidas (build output, diagnostico .md, QA report, checklist)
- Regra de aprovacao: PASSA se todos G-01 a G-10 passam
- Historico de gate
```

---

### INDEX atualizado

`specs/00_INDEX.md` alterado:
- **Proximo passo:** aponta para SPEC_03 Sprint 5 Relatorios com links para SPEC/TODO/QA/GATE
- **SPECS:** adicionado SPEC_03
- **GATES:** adicionado GATE_09
- **TODOs:** adicionado TODO_06
- **QA:** adicionado QA_06
- **Planning Module status:** adicionado Sprint 5 como "Em andamento"

---

## Lista Final de Arquivos

### Criados

| # | Arquivo |
|---|---------|
| 1 | `specs/01_SPECS/SPEC_03_PLANNING_REPORTS_SPRINT5.md` |
| 2 | `specs/03_TODOS/TODO_06_REPORTS_SPRINT5.md` |
| 3 | `specs/04_REPORTS/QA_06_REPORTS_SPRINT5.md` |
| 4 | `specs/02_GATES/GATE_09_REPORTS_SPRINT5.md` |
| 5 | `specs/04_REPORTS/OUTPUT_SPRINT5_KICKOFF_20260206_1741.md` |

### Alterados

| # | Arquivo | Alteracao |
|---|---------|-----------|
| 1 | `scripts/dev/finalize_rh_actions_seed.ps1` | Hardening build capture (exit code) |
| 2 | `specs/00_INDEX.md` | Adicionados SPEC_03, GATE_09, TODO_06, QA_06, Sprint 5 status |

---

*Gerado automaticamente - PE_2026 Sprint 5 Kickoff*
