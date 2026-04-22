# Integração de Dados Reais do Plano de Ação - RH

## Resumo

Este documento descreve o processo de integração dos dados reais do plano de ação do RH (PE2026) ao sistema, incluindo as 6 iniciativas setoriais (INIT-RH-301 a INIT-RH-306) e suas evidências associadas.

## Estrutura dos Dados

### INITs Setoriais do RH (6 total)

| Código | Título | Tipo | Prioridade | Prazo | Orçamento |
|--------|--------|------|------------|-------|-----------|
| INIT-RH-301 | Pesquisa de engajamento e clima 2026 (baseline) | MET | P0 | Mar-Abr/26 | R$ 7.5K |
| INIT-RH-302 | Implantação de indicadores de turnover por área | SIS | P0 | Mar/26 | R$ 4K |
| INIT-RH-303 | Processo seletivo estruturado para posições P0/P1 | MET | P0 | Mar/26 | R$ 6.5K |
| INIT-RH-304 | Programa de reconhecimento e retenção | ENT | P1 | Abr-Jun/26 | R$ 20K |
| INIT-RH-305 | People Analytics: painel de pessoas | SIS | P1 | Abr-Jun/26 | R$ 15K |
| INIT-RH-306 | Programa de desenvolvimento de lideranças internas | MET | P1 | Abr-Set/26 | R$ 25K |

**Orçamento Total**: ~R$ 78.000

### INITs Corporativas do RH (5 total)

As seguintes iniciativas corporativas também estão vinculadas ao RH:

- `INIT-009`: Mapa de posições-chave e sucessão mínima
- `INIT-010`: Onboarding estruturado e rituais mínimos de liderança  
- `INIT-015`: Contratação COO / Diretor de Operações
- `INIT-016`: Contratação liderança Comercial
- `INIT-022`: Rituais mínimos de liderança (aderência >= 85%)

## Arquivos Criados

### 1. Seed SQL
**Arquivo**: `supabase/seeds/07_rh_action_plan_real_data.sql`

Contém:
- INSERT das 6 iniciativas setoriais na tabela `initiatives`
- INSERT das 6 evidências na tabela `evidences`
- UPDATE das INITs corporativas vinculando à área RH
- INSERT/UPDATE do registro em `area_plans`
- Verificação de integridade no final

### 2. Script de Validação Python
**Arquivo**: `scripts/validate_action_plan_integration.py`

Funcionalidades:
- Valida se INITs setoriais existem no seed
- Verifica integridade dos dados do Excel
- Valida consistência de orçamento
- Gera relatório de validação

Uso:
```bash
# Validar apenas RH
python scripts/validate_action_plan_integration.py --area rh

# Validar todas as áreas
python scripts/validate_action_plan_integration.py --all
```

### 3. Testes de Integração
**Arquivo**: `src/features/area-plans/__tests__/rh-action-plan.integration.test.ts`

Cobertura:
- Existência das 6 INITs setoriais
- Vinculação correta à área RH
- Vinculação a pilares (P5) e OKRs (OKR-P5)
- Distribuição de prioridades (3 P0, 3 P1)
- Evidências associadas
- Orçamento alocado
- INITs corporativas vinculadas

## Processo de Integração

### Passo 1: Aplicar o Seed no Supabase

```bash
# Via Supabase CLI
supabase db reset

# Ou aplicar apenas este seed
psql $SUPABASE_URL -f supabase/seeds/07_rh_action_plan_real_data.sql
```

### Passo 2: Validar a Integração

```bash
# Rodar validador Python
python scripts/validate_action_plan_integration.py --area rh

# Rodar testes de integração
npm test -- src/features/area-plans/__tests__/rh-action-plan.integration.test.ts
```

### Passo 3: Verificar na Aplicação

1. Acesse a área de administração
2. Vá para "Planos de Ação por Área"
3. Selecione "RH / Pessoas"
4. Verifique se as 11 iniciativas aparecem (5 corporativas + 6 setoriais)

## Mapeamento de Dados

### Excel → Banco de Dados

| Campo Excel | Campo SQL | Tabela |
|-------------|-----------|--------|
| Codigo | code | initiatives |
| Titulo da Acao | title | initiatives |
| Tipo | type | initiatives |
| Prioridade | priority | initiatives |
| Pilar | pillar_id (FK) | initiatives |
| Subpilar | subpillar_id (FK) | initiatives |
| Motor | motor_id (FK) | initiatives |
| OKR | okr_code | initiatives |
| KR Principal | kr_code | initiatives |
| Responsavel | owner | initiatives |
| Patrocinador | sponsor | initiatives |
| Prazo | end_date | initiatives |
| Custo (R$) | budget_allocated | initiatives |
| Status | status | initiatives |
| Evidencia | code | evidences |

### Tipos de Iniciativa

- **MET**: Metodologia/Processo
- **SIS**: Sistema/Dados
- **COM**: Comunicação/Marketing
- **ENT**: Entrega/Projeto
- **ORG**: Organização/Estrutura

### Prioridades

- **P0**: Crítica (90 dias) - 3 INITs
- **P1**: Estratégica do ano - 3 INITs
- **P2**: Importante - 0 INITs

## Validações Implementadas

### SQL (no próprio seed)
- Verificação de contagem de iniciativas
- Verificação de contagem de evidências
- Verificação de orçamento total
- Warnings se valores estiverem fora do esperado

### Python (script standalone)
- Validação de INITs setoriais esperadas
- Integridade de dados do Excel
- Consistência de orçamento
- Geração de relatório

### TypeScript (testes)
- Testes automatizados de integração
- Validação de relacionamentos (FKs)
- Verificação de regras de negócio

## Próximos Passos

Para replicar este processo para outras áreas:

1. **Marketing**: INIT-MKT-101 a INIT-MKT-107
2. **P&D**: INIT-PD-251 a INIT-PD-256
3. **Operação**: INIT-OP-151 a INIT-OP-158
4. **CS**: INIT-CS-201 a INIT-CS-208
5. **Comercial**: INIT-COM-401 a INIT-COM-405
6. **Financeiro**: INIT-FIN-351 a INIT-FIN-358

Template para criar seeds de outras áreas:
```sql
-- Copiar estrutura de 07_rh_action_plan_real_data.sql
-- Substituir:
--   - Códigos INIT-RH-* → INIT-{AREA}-*
--   - area_id do RH → area_id da área
--   - Pilar P5 → Pilar primário da área
--   - OKR-P5 → OKR primário da área
```

## Checklist de Validação

- [x] 6 INITs setoriais criadas
- [x] 6 evidências associadas
- [x] Vinculação à área RH
- [x] Vinculação ao pilar P5
- [x] Vinculação ao OKR-P5
- [x] Orçamento calculado
- [x] INITs corporativas vinculadas
- [x] Seed SQL documentado
- [x] Script de validação criado
- [x] Testes de integração escritos
- [ ] Seed aplicado no Supabase
- [ ] Testes passando
- [ ] Validação na UI

## Notas Técnicas

### UUIDs Utilizados

- Área RH: `a1000000-0000-0000-0000-000000000001`
- Pilar P5: `b1000000-0000-0000-0000-000000000005`
- Motor M5: `f1000000-0000-0000-0000-000000000005`

### Códigos de Subpilar

- P5.S1: `c1000000-0000-0000-0000-000000000501`
- P5.S2: `c1000000-0000-0000-0000-000000000502`
- P5.S3: `c1000000-0000-0000-0000-000000000503`
- P5.S4: `c1000000-0000-0000-0000-000000000504`

## Suporte

Em caso de dúvidas ou problemas:
1. Verificar logs do seed SQL
2. Rodar validador Python para diagnóstico
3. Executar testes de integração
4. Consultar documentação em `docs/implementation/`
