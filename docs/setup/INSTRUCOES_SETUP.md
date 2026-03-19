# Instruções de Setup - Template com Supabase

## 1. Configuração do Supabase

### Passo 1: Executar o SQL no Supabase

1. Acesse o **SQL Editor** do seu projeto Supabase
2. Abra o arquivo `SUPABASE_SETUP.sql`
3. Copie todo o conteúdo e execute no SQL Editor
4. Aguarde a confirmação de sucesso

Isso criará:
- ✅ Tabela `profiles` (perfis de usuário)
- ✅ Tabela `action_plans` (planos de ação)
- ✅ Tabela `goals` (metas)
- ✅ Tabela `indicators` (indicadores)
- ✅ Políticas RLS (Row Level Security)
- ✅ Triggers automáticos
- ✅ Índices de performance

### Passo 2: Configurar variáveis de ambiente

1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. As credenciais já estão configuradas em `.env.example`:
   ```
   VITE_SUPABASE_URL=https://hdchebbmdrcogtuvbskz.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Passo 3: Criar primeiro usuário

1. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3000/login`

3. **Crie uma conta** usando qualquer email/senha
   - O perfil será criado automaticamente via trigger
   - Role padrão: `colaborador`

4. Para tornar um usuário **admin**:
   - Acesse o SQL Editor do Supabase
   - Execute:
     ```sql
     UPDATE profiles 
     SET role = 'admin' 
     WHERE user_id = 'ID_DO_USUARIO';
     ```

## 2. Estrutura das Features

O template inclui 3 features completas:

### 📋 Action Plans (Planos de Ação)
- CRUD completo
- Status: pending, in_progress, completed, cancelled
- Prioridade: low, medium, high, urgent
- Rota: `/action-plans`

### 🎯 Goals (Metas)
- Acompanhamento de progresso
- Períodos: daily, weekly, monthly, quarterly, yearly
- Barra de progresso visual
- Rota: `/goals`

### 📊 Indicators (Indicadores)
- KPIs e métricas
- Tendências: up, down, stable
- Comparação com valor anterior
- Rota: `/indicators`

## 3. Testando as Features

### Testar Action Plans
1. Acesse `/action-plans`
2. Clique em "Novo Plano"
3. Preencha o formulário
4. Teste edição e exclusão

### Testar Goals
1. Acesse `/goals`
2. Clique em "Nova Meta"
3. Configure valor atual e meta
4. Veja a barra de progresso

### Testar Indicators
1. Acesse `/indicators`
2. Clique em "Novo Indicador"
3. Configure valor atual e anterior
4. Veja a tendência calculada

## 4. Modo Demo (sem Supabase)

Se você **não configurar** o Supabase:
- ✅ O app funciona normalmente
- ✅ Dados são mockados localmente
- ✅ Login aceita qualquer credencial
- ⚠️ Dados não persistem (apenas em memória)

## 5. Roles e Permissões

### Roles disponíveis:
- `admin` - Acesso total
- `gestor` - Gerenciamento de equipe
- `colaborador` - Uso padrão
- `cliente` - Acesso limitado

### Alterar role de um usuário:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = 'uuid-do-usuario';
```

## 6. Próximos Passos

### Adicionar nova feature
1. Copie a estrutura de `src/features/action-plans/`
2. Adapte types, schemas, api, hooks
3. Crie componentes e página
4. Adicione rota em `router.tsx`
5. Adicione item no menu em `Sidebar.tsx`

### Deploy no Netlify
1. Conecte o repositório ao Netlify
2. Configure variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Build command: `npm run build`
4. Publish directory: `dist`

## 7. Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Supabase not configured"
- Verifique se `.env` existe
- Confirme que as variáveis estão corretas
- Reinicie o servidor de dev

### Erro: "RLS policy violation"
- Verifique se o usuário está autenticado
- Confirme que as políticas RLS foram criadas
- Verifique se o `user_id` está correto

### Dados não aparecem
- Verifique se executou o `SUPABASE_SETUP.sql`
- Confirme que está logado
- Veja o console do navegador para erros

## 8. Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 9. Senha Configurada

**Senha do projeto Supabase:** `aeroeng@2026`

Use esta senha para acessar o dashboard do Supabase se necessário.
