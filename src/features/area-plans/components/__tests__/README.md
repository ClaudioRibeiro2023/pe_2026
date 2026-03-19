# Testes para Módulo de Planejamento

## Configuração do Ambiente de Testes

Para configurar testes neste projeto, siga os passos abaixo:

### 1. Instalar Dependências

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 2. Configurar Vitest

Crie o arquivo `vitest.config.ts` na raiz do projeto:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### 3. Setup de Testes

Crie o arquivo `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'

// Mocks globais se necessário
global.matchMedia = global.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }
}
```

## Exemplo de Teste - BasicInfoSection

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planActionSchema } from '../../schemas'
import { BasicInfoSection } from '../form/BasicInfoSection'

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    resolver: zodResolver(planActionSchema),
    defaultValues: {
      plan_id: 'test-plan-id',
      title: '',
      description: '',
      priority: 'P1',
      node_type: 'acao',
    },
  })

  return (
    <FormProvider {...methods}>
      <form>
        {children}
      </form>
    </FormProvider>
  )
}

describe('BasicInfoSection', () => {
  it('renderiza campos básicos corretamente', () => {
    render(
      <TestWrapper>
        <BasicInfoSection />
      </TestWrapper>
    )

    expect(screen.getByLabelText('Título da Ação *')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
    expect(screen.getByLabelText('Prioridade *')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo de Nó *')).toBeInTheDocument()
  })

  it('valida campo título obrigatório', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <BasicInfoSection />
      </TestWrapper>
    )

    const titleInput = screen.getByLabelText('Título da Ação *')
    await user.type(titleInput, 'A')
    await user.clear(titleInput)
    
    // Verificar mensagem de erro
    expect(screen.getByText(/título deve ter pelo menos/i)).toBeInTheDocument()
  })

  it('preenche formulário corretamente', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <BasicInfoSection />
      </TestWrapper>
    )

    await user.type(screen.getByLabelText('Título da Ação *'), 'Nova Ação de Teste')
    await user.type(screen.getByLabelText('Descrição'), 'Descrição detalhada da ação')
    
    // Selecionar prioridade P0
    fireEvent.change(screen.getByLabelText('Prioridade *'), { target: { value: 'P0' } })
    
    // Verificar valores
    expect(screen.getByDisplayValue('Nova Ação de Teste')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Descrição detalhada da ação')).toBeInTheDocument()
  })
})
```

## Estrutura de Testes Recomendada

### 1. Testes de Componentes

- **Renderização**: Componente renderiza corretamente
- **Props**: Funciona com diferentes props
- **Interação**: Usuário pode interagir com elementos
- **Estados**: Comportamento em diferentes estados
- **Acessibilidade**: Labels, ARIA, navegação por teclado

### 2. Testes de Hooks

- **Estado inicial**: Hook começa com estado correto
- **Ações**: Funções do funcionam como esperado
- **Side effects**: Efeitos colaterais são tratados
- **Loading**: Estados de carregamento
- **Error**: Tratamento de erros

### 3. Testes de API

- **Requisições**: Chamadas à API funcionam
- **Respostas**: Dados são processados corretamente
- **Erros**: Falhas são tratadas
- **Cache**: Funcionamento do cache

## Comandos Úteis

```bash
# Rodar todos os testes
npm run test

# Rodar em modo watch
npm run test:watch

# Rodar com coverage
npm run test:coverage

# Rodar teste específico
npm run test BasicInfoSection
```

## Boas Práticas

1. **Testes isolados**: Cada teste deve ser independente
2. **Nomes descritivos**: `it('deve fazer X quando Y')`
3. **Arrange-Act-Assert**: Organizar, Agir, Verificar
4. **Mockar dependências**: APIs externas, módulos
5. **Testar happy path e edge cases**
6. **Manter testes rápidos** e simples

## Coverage

Mantenha um bom coverage:
- **Statements**: > 80%
- **Branches**: > 80%
- **Functions**: > 80%
- **Lines**: > 80%

Foque em testar código crítico e de negócio, não implementação interna.
