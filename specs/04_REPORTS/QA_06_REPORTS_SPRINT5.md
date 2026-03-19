# QA_06 - Reports Sprint 5

**Spec:** SPEC_03_PLANNING_REPORTS_SPRINT5  
**Data:** 2026-02-06  
**Status:** Pendente  

---

## 1. Casos de Teste Funcionais

### 1.1 Hub de Relatorios (`/reports`)

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|-------------------|
| FT-01 | Pagina carrega sem erros | Navegar para /reports | Hub exibe >= 3 cards de relatorio |
| FT-02 | Filtro por area | Selecionar "RH" no filtro | Apenas dados de RH exibidos |
| FT-03 | Filtro por pack | Selecionar "pack-rh-2026" | Apenas acoes do pack exibidas |
| FT-04 | Filtro limpo | Limpar todos os filtros | Dados de todas as areas exibidos |
| FT-05 | Card clicavel | Clicar em card de relatorio | Secao correspondente expande/abre |

### 1.2 Relatorio Executivo

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|-------------------|
| FT-06 | Metricas corretas | Abrir executivo para RH | Total acoes = 42, progresso medio coerente |
| FT-07 | Tabela de status | Abrir executivo | Tabela mostra contagem por status (PENDENTE, EM_ANDAMENTO, etc.) |
| FT-08 | Grafico de progresso | Abrir executivo | Grafico renderiza sem erro |

### 1.3 Relatorio de Acoes por Pack

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|-------------------|
| FT-09 | Tabela de acoes | Selecionar pack RH | 42 linhas exibidas |
| FT-10 | Indicador de atraso | Acao com due_date < hoje e status != CONCLUIDA | Badge vermelha "Atrasada" |
| FT-11 | Ordenacao | Clicar header da coluna | Reordena corretamente |

### 1.4 Relatorio de Progresso Geral

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|-------------------|
| FT-12 | Cards de metricas | Abrir progresso geral | Total acoes, % concluidas, % atrasadas, areas com alerta |
| FT-13 | Bar chart por area | Abrir progresso | Grafico com 1 barra por area |
| FT-14 | Ranking de areas | Abrir progresso | Lista ordenada por progresso desc |

### 1.5 Exportacao

| ID | Caso | Entrada | Resultado Esperado |
|----|------|---------|-------------------|
| FT-15 | Export PDF executivo | Clicar "PDF" no executivo | Download de .pdf valido |
| FT-16 | Export Excel acoes | Clicar "Excel" no acoes | Download de .csv com 42 linhas |
| FT-17 | Export com filtro | Filtrar RH + exportar | Arquivo contem apenas dados RH |

---

## 2. Testes de UI States

| ID | Estado | Verificacao |
|----|--------|-------------|
| UI-01 | Loading | Skeleton/spinner enquanto dados carregam |
| UI-02 | Empty (area sem plano) | Mensagem "Nenhum plano encontrado" |
| UI-03 | Dados completos | Todos os componentes renderizam |
| UI-04 | Responsive (1024px) | Layout nao quebra em tela minima |
| UI-05 | Dark mode | Cores e contrastes corretos |

---

## 3. Checklist de Regressao

| ID | Area | Verificacao | Metodo |
|----|------|-------------|--------|
| REG-01 | Dashboard | /dashboard carrega sem erros | Navegar |
| REG-02 | Planejamento Home | /planning/dashboard carrega | Navegar |
| REG-03 | Planejamento RH | /planning/rh/dashboard carrega | Navegar |
| REG-04 | Strategic Pack RH | /planning/rh/pe-2026 carrega com 42 acoes | Navegar |
| REG-05 | Sidebar | Todas as 5 secoes visiveis (admin) | Visual |
| REG-06 | Build | npm run build exit 0 | Terminal |
| REG-07 | Preview | localhost funcional | Browser |

---

## 4. Evidencias Exigidas

| Evidencia | Formato | Descricao |
|-----------|---------|-----------|
| QA report .md | Markdown | Gerado via diagnostico da plataforma (ValidationPage) |
| Build log | Texto | Output de `npm run build` mostrando exit 0 |
| Contagem de acoes | Texto | Output confirmando 42 IDs RH no bundle |
| Checklist regressao | Markdown | Todos os REG-XX marcados como pass |
