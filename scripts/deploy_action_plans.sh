#!/usr/bin/env bash
#
# Deploy Script: Aplicar Seeds de Planos de Ação PE2026
# 
# Uso:
#   ./scripts/deploy_action_plans.sh          # Ambiente local
#   ./scripts/deploy_action_plans.sh staging  # Ambiente staging
#   ./scripts/deploy_action_plans.sh prod     # Ambiente produção
#

set -e

ENVIRONMENT="${1:-local}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "DEPLOY: Planos de Ação PE2026"
echo "Ambiente: $ENVIRONMENT"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função de log
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependências
log_info "Verificando dependências..."

if ! command -v supabase &> /dev/null; then
    log_error "Supabase CLI não encontrado. Instale com: npm install -g supabase"
    exit 1
fi

if [ "$ENVIRONMENT" != "local" ] && ! command -v psql &> /dev/null; then
    log_error "psql não encontrado. Instale o PostgreSQL client."
    exit 1
fi

log_success "Dependências OK"
echo ""

# Configurar conexão baseada no ambiente
case "$ENVIRONMENT" in
    local)
        log_info "Usando Supabase local..."
        SUPABASE_URL="http://localhost:54321"
        SUPABASE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAJPxAE7SbDVVdU2Ul4KlmKqRBz_yCwtUUGxU}"
        ;;
    staging)
        log_info "Usando Supabase staging..."
        if [ -z "$SUPABASE_STAGING_URL" ] || [ -z "$SUPABASE_STAGING_KEY" ]; then
            log_error "Variáveis SUPABASE_STAGING_URL e SUPABASE_STAGING_KEY não definidas"
            exit 1
        fi
        SUPABASE_URL="$SUPABASE_STAGING_URL"
        SUPABASE_KEY="$SUPABASE_STAGING_KEY"
        ;;
    prod)
        log_info "Usando Supabase produção..."
        if [ -z "$SUPABASE_PROD_URL" ] || [ -z "$SUPABASE_PROD_KEY" ]; then
            log_error "Variáveis SUPABASE_PROD_URL e SUPABASE_PROD_KEY não definidas"
            exit 1
        fi
        SUPABASE_URL="$SUPABASE_PROD_URL"
        SUPABASE_KEY="$SUPABASE_PROD_KEY"
        
        # Confirmação para produção
        echo ""
        log_warn "⚠️  ATENÇÃO: Você está prestes a modificar o banco de PRODUÇÃO!"
        read -p "Digite 'DEPLOY' para confirmar: " confirm
        if [ "$confirm" != "DEPLOY" ]; then
            log_error "Deploy cancelado pelo usuário"
            exit 1
        fi
        ;;
    *)
        log_error "Ambiente desconhecido: $ENVIRONMENT"
        echo "Uso: $0 [local|staging|prod]"
        exit 1
        ;;
esac

echo ""

# Função para executar SQL
execute_sql() {
    local file="$1"
    local description="$2"
    
    log_info "Aplicando: $description..."
    
    if [ "$ENVIRONMENT" = "local" ]; then
        # Usar Supabase CLI para local
        cd "$PROJECT_DIR"
        if supabase db reset --debug 2>&1 | grep -q "error"; then
            log_error "Falha ao resetar banco local"
            exit 1
        fi
    else
        # Usar psql para remote
        if ! PGPASSWORD="$(echo "$SUPABASE_KEY" | base64 -d 2>/dev/null || echo "$SUPABASE_KEY")" \
             psql "$SUPABASE_URL" \
             -f "$file" \
             -v ON_ERROR_STOP=1 \
             -q; then
            log_error "Falha ao executar $file"
            exit 1
        fi
    fi
    
    log_success "$description aplicado"
}

# Sequência de seeds
SEEDS=(
    "05_canonical_pe2026_seed.sql:Base canônica PE2026 (pilares, OKRs, INITs corporativas)"
    "07_rh_action_plan_real_data.sql:Plano de Ação RH (6 INITs setoriais + 5 corporativas)"
    "08_all_areas_action_plan_real_data.sql:Planos de Ação todas as áreas (42 INITs setoriais)"
)

log_info "Iniciando deploy dos seeds..."
echo ""

# Para ambiente local, usar db reset
if [ "$ENVIRONMENT" = "local" ]; then
    log_info "Resetando banco local e aplicando todas as migrations..."
    cd "$PROJECT_DIR"
    
    # Verificar se supabase está rodando
    if ! supabase status &> /dev/null; then
        log_warn "Supabase não está rodando. Iniciando..."
        supabase start
    fi
    
    # Reset do banco (aplica migrations + seeds na ordem)
    supabase db reset
    
    log_success "Banco resetado com sucesso"
else
    # Para staging/prod, aplicar seeds manualmente
    for seed_info in "${SEEDS[@]}"; do
        IFS=':' read -r file description <<< "$seed_info"
        seed_path="$PROJECT_DIR/supabase/seeds/$file"
        
        if [ ! -f "$seed_path" ]; then
            log_error "Seed não encontrado: $seed_path"
            exit 1
        fi
        
        execute_sql "$seed_path" "$description"
    done
fi

echo ""
log_success "✅ Deploy concluído com sucesso!"
echo ""

# Validação pós-deploy
log_info "Executando validações..."
echo ""

if [ "$ENVIRONMENT" = "local" ]; then
    # Validar com script Python local
    if [ -f "$PROJECT_DIR/scripts/verify_all_action_plans.py" ]; then
        cd "$PROJECT_DIR"
        python scripts/verify_all_action_plans.py --verbose
    fi
else
    # Validação simples via SQL
    log_info "Validando contagem de iniciativas..."
    psql "$SUPABASE_URL" -c "SELECT 'Total INITs: ' || COUNT(*) FROM initiatives;" -q
fi

echo ""
echo "=========================================="
echo "Resumo do Deploy"
echo "=========================================="
echo "Ambiente: $ENVIRONMENT"
echo "Seeds aplicados: ${#SEEDS[@]}"
echo ""
echo "Próximos passos:"
echo "1. Acesse o dashboard: http://localhost:5173/planning/initiatives"
echo "2. Verifique os dados na tabela 'initiatives'"
echo "3. Execute os testes: npm test -- initiatives"
echo "=========================================="
