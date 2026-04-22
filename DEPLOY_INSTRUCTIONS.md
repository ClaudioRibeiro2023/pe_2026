# Deploy Planos de Ação PE2026 - Instruções

## Status Atual

✅ **Dashboard de Iniciativas**: Implementado com filtros avançados  
✅ **Script de Deploy**: Criado (`scripts/deploy_action_plans.ps1`)  
✅ **Build TypeScript**: Passando sem erros  
⏳ **Deploy Seeds**: Aguardando Docker

## Seeds Prontos para Deploy

| Arquivo | Área | INITs |
|---------|------|-------|
| `07_rh_action_plan_real_data.sql` | RH | 6 setoriais + 5 corporativas |
| `08_all_areas_action_plan_real_data.sql` | Marketing, P&D, Operação, CS, Comercial, Financeiro | 48 setoriais |

## Como Executar o Deploy

### Opção 1: Script PowerShell (Recomendado - Windows)

```powershell
# PowerShell como Administrador
powershell -ExecutionPolicy Bypass -File scripts/deploy_action_plans.ps1
```

### Opção 2: Comandos Manuais

```bash
# 1. Verificar se Docker está rodando
docker info

# 2. Iniciar Supabase (se não estiver rodando)
npx supabase start

# 3. Aplicar seeds (reset aplica migrations + seeds)
npx supabase db reset

# 4. Validar dados
python scripts/verify_all_action_plans.py --verbose
```

## Após o Deploy

1. **Inicie o app**: `npm run dev`
2. **Acesse**: http://localhost:5173/planning/initiatives
3. **Verifique**: 84 iniciativas carregadas (36 corporativas + 48 setoriais)

## Filtros Disponíveis no Dashboard

- **Prioridade**: P0, P1, P2
- **Status**: Planejada, Em Andamento, Concluída
- **Tipo**: Corporativas vs Setoriais
- **Pilar**: P1-P5
- **Motor**: M1-M5
- **Tipo de Iniciativa**: MET, SIS, COM, ENT, ORG
- **Período**: Data início/fim
- **Ordenação**: Prioridade, Data, Orçamento

## Validação

Execute o validador Python para verificar integridade:

```bash
python scripts/verify_all_action_plans.py
```

---

**Data**: 2026-03-23  
**Sessão**: 4  
**Status**: Código pronto, aguardando deploy dos seeds
