# Feature: Action Plans (Planos de Ação)

Feature de exemplo demonstrando o padrão completo de CRUD no template.

## Estrutura

```
action-plans/
├── api.ts                  # Funções de API (Supabase + mock)
├── hooks.ts                # React Query hooks
├── schemas.ts              # Validação Zod
├── types.ts                # TypeScript types
├── components/
│   ├── ActionPlanCard.tsx  # Card de exibição
│   └── ActionPlanForm.tsx  # Formulário de criação/edição
└── pages/
    └── ActionPlansPage.tsx # Página principal
```

## Funcionalidades

- ✅ **Listagem** com cards responsivos
- ✅ **Criação** via modal com validação
- ✅ **Edição** inline com formulário pré-preenchido
- ✅ **Exclusão** com confirmação
- ✅ **Estados**: loading, empty, error
- ✅ **Modo demo** (funciona sem Supabase)
- ✅ **Validação** com Zod + React Hook Form
- ✅ **Notificações** toast para feedback

## Schema Supabase

```sql
create table action_plans (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text not null check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  responsible text,
  due_date date,
  completed_at timestamp with time zone,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS policies
alter table action_plans enable row level security;

create policy "Users can view their own action plans"
  on action_plans for select
  using (auth.uid() = user_id);

create policy "Users can create their own action plans"
  on action_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own action plans"
  on action_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own action plans"
  on action_plans for delete
  using (auth.uid() = user_id);
```

## Como usar como referência

1. **Copie a estrutura** para criar novas features
2. **Adapte os tipos** em `types.ts`
3. **Ajuste o schema** de validação em `schemas.ts`
4. **Implemente a API** em `api.ts` (Supabase + mock)
5. **Crie os hooks** em `hooks.ts` (React Query)
6. **Desenvolva os componentes** específicos
7. **Monte a página** principal com estados

## Padrões seguidos

- **Feature-first**: tudo relacionado à feature em uma pasta
- **Separação de concerns**: API, hooks, UI, validação
- **Mock data**: funciona sem backend configurado
- **TypeScript strict**: tipos bem definidos
- **Validação**: Zod + React Hook Form
- **Estados**: loading, error, empty tratados
- **Feedback**: toasts para ações do usuário
