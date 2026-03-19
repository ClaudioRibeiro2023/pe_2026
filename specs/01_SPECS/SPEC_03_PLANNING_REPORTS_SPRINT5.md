# SPEC_03 - Planning Reports - Sprint 5

**Modulo:** Planning Module (SPEC_02)  
**Sprint:** 5  
**Data:** 2026-02-06  
**Status:** Draft  

---

## 1. Objetivo de Negocio

Permitir que gestores e direcao gerem relatorios consolidados sobre planos de acao, acoes, progresso e evidencias por area, pack ou periodo. Os relatorios devem ser exportaveis (PDF/Excel) e conter visualizacoes claras de status, progresso e alertas.

---

## 2. Escopo MVP

| Item | Descricao | Prioridade |
|------|-----------|------------|
| Relatorio Executivo por Area | Resumo de plano + acoes + progresso por area | P0 |
| Relatorio de Acoes por Pack | Lista de acoes filtrada por pack estrategico | P0 |
| Relatorio de Progresso Geral | Dashboard com metricas consolidadas (todas areas) | P0 |
| Export PDF | Exportar qualquer relatorio para PDF formatado | P1 |
| Export Excel/CSV | Exportar dados tabulares para Excel | P1 |
| Relatorio de Evidencias Pendentes | Backlog de evidencias por area/responsavel | P2 |
| Historico de Fechamentos Mensais | Snapshot mensal de progresso e status | P2 |

---

## 3. Paginas e Rotas

| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/reports` | ReportsPage | Hub central de relatorios (ja existe como placeholder) |
| `/reports` (tab/filtro) | - | Filtros por area, pack, periodo, tipo de relatorio |

**Nota:** Nesta sprint, toda funcionalidade fica dentro de `/reports` (ReportsPage.tsx). Sub-rotas podem ser criadas em sprints futuras se necessario.

---

## 4. Requisitos Funcionais

### 4.1 Hub de Relatorios (`/reports`)

- **RF-01:** Exibir cards de relatorios disponiveis (Executivo, Acoes, Progresso, Evidencias)
- **RF-02:** Cada card deve abrir uma secao expandida ou modal com o relatorio
- **RF-03:** Filtros globais: area (select), pack (select), periodo (date range)
- **RF-04:** Cada relatorio deve ter botoes de export (PDF + Excel)

### 4.2 Relatorio Executivo por Area

- **RF-05:** Mostrar: nome da area, plano ativo, total de acoes, progresso medio
- **RF-06:** Tabela resumo: status das acoes (PENDENTE, EM_ANDAMENTO, CONCLUIDA, etc.)
- **RF-07:** Grafico de progresso (barra horizontal ou pie chart)
- **RF-08:** Lista dos 5 maiores riscos/bloqueios

### 4.3 Relatorio de Acoes por Pack

- **RF-09:** Filtrar acoes pelo pack_id selecionado
- **RF-10:** Tabela com colunas: ID, titulo, programa, status, responsavel, progresso, due_date
- **RF-11:** Ordenacao por status e prioridade
- **RF-12:** Indicador visual de acoes atrasadas (due_date < hoje e status != CONCLUIDA)

### 4.4 Relatorio de Progresso Geral

- **RF-13:** Cards de metricas: total acoes, % concluidas, % atrasadas, areas com alerta
- **RF-14:** Grafico comparativo de progresso por area (bar chart)
- **RF-15:** Ranking de areas por progresso (de maior para menor)

### 4.5 Exportacao

- **RF-16:** PDF usa lib jsPDF + jspdf-autotable (ja existente em `shared/lib/export.ts`)
- **RF-17:** Excel usa CSV com BOM UTF-8 (ja existente em `shared/lib/export.ts`)
- **RF-18:** Nome do arquivo: `{tipo}-{area}-{data}.pdf` ou `.csv`

---

## 5. Requisitos Nao-Funcionais

- **RNF-01:** Pagina deve carregar em < 2s (dados mock em memoria)
- **RNF-02:** Consistencia visual com o restante do app (Card, Table, Button do design system)
- **RNF-03:** Responsivo: funcionar em telas >= 1024px (desktop-first)
- **RNF-04:** Acessibilidade: tabelas com `<thead>`, labels em filtros, roles ARIA em graficos
- **RNF-05:** Reutilizar componentes existentes: `ExportButtons`, `Card`, `Table`, `ProgressBar`

---

## 6. Criterios de Aceite

| ID | Criterio | Verificacao |
|----|----------|-------------|
| CA-01 | Hub de relatorios exibe >= 3 tipos de relatorio | Visual: cards visiveis na pagina |
| CA-02 | Filtro por area filtra corretamente os dados | Selecionar "RH" mostra apenas dados de RH |
| CA-03 | Relatorio executivo mostra metricas corretas | Comparar com dados do mockStore |
| CA-04 | Export PDF gera arquivo valido | Download funciona, PDF abre sem erro |
| CA-05 | Export Excel gera CSV com dados corretos | Abrir no Excel, verificar colunas e linhas |
| CA-06 | Acoes atrasadas tem indicador visual | Cor vermelha ou badge "Atrasada" |
| CA-07 | Build passa sem erros | `npm run build` exit code 0 |
| CA-08 | Nenhuma regressao em Planejamento/RH | Navegar por /planning e /planning/rh sem erros |

---

## 7. Riscos e Decisoes

| Risco | Mitigacao |
|-------|----------|
| Dados mock podem nao ter diversidade suficiente para testar todos os estados | Adicionar acoes com status variados no seed |
| Graficos podem aumentar bundle size | Reutilizar Chart.js ja presente no projeto |
| Sub-rotas podem ser necessarias no futuro | Manter arquitetura extensivel (componentes isolados) |

---

## 8. Dependencias

- `shared/lib/export.ts` - funcoes exportToPDF e exportToExcel (existem)
- `shared/components/export/ExportButtons.tsx` - botoes de export (existe)
- `features/area-plans/api-mock.ts` - dados mock de acoes, planos, areas (existe)
- `chart.js` + `react-chartjs-2` - graficos (ja no bundle)

---

## 9. Arquivos Envolvidos

| Arquivo | Acao |
|---------|------|
| `src/features/reports/pages/ReportsPage.tsx` | Reescrever (placeholder -> hub completo) |
| `src/features/reports/components/` | Criar: ReportCard, ExecutiveReport, ActionsReport, ProgressReport |
| `src/features/reports/hooks.ts` | Criar: useReportData (agregar dados do mockStore) |
| `src/shared/lib/export.ts` | Reutilizar (sem alteracao) |
| `src/shared/components/export/ExportButtons.tsx` | Reutilizar (sem alteracao) |
