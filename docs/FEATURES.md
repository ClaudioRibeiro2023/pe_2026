# 🚀 Guia de Funcionalidades - Painel Estratégico 2026

## 📱 Interface e Navegação

### Menu Lateral (Sidebar)
- **Navegação Agrupada**: Organizada por seções (Visão Geral, Gestão, Estratégia)
- **Modo Colapsável**: Clique no ícone `⟨⟨` para recolher/expandir
- **Favoritos**: Clique na estrela ⭐ ao passar o mouse sobre um item
- **Persistência**: Estado do menu é salvo automaticamente

### Barra Superior (Topbar)
- **Breadcrumbs Dinâmicos**: Mostra caminho atual da navegação
- **Ações Rápidas**: Botões contextuais por módulo (ex: "Nova Meta")
- **Busca Global**: Botão com atalho `⌘K` / `Ctrl+K`
- **Notificações**: Sino com badge de não lidas
- **Tema**: Alternância entre modo claro/escuro
- **Menu do Usuário**: Perfil e logout

### Menu Mobile
- **Drawer Lateral**: Acesso completo em dispositivos móveis
- **Botão Hamburger**: Toque no ☰ para abrir
- **Navegação Completa**: Todas as funcionalidades do desktop

---

## 🔍 Busca e Navegação Rápida

### Command Palette (Ctrl+K)
Abra com `Ctrl+K` (Windows/Linux) ou `Cmd+K` (Mac)

**Funcionalidades:**
- 🔎 Busca por páginas e seções
- ⚡ Ações rápidas (Criar Meta, Criar Indicador, etc.)
- 📜 Histórico de navegação (últimas 10 páginas)
- ⌨️ Navegação por teclado (↑↓ Enter ESC)

**Ações Disponíveis:**
- `Criar Nova Meta` → `/goals?create=1`
- `Criar Novo Indicador` → `/indicators?create=1`
- `Criar Novo Plano de Ação` → `/action-plans?create=1`

---

## ⌨️ Atalhos de Teclado

### Navegação Global
| Atalho | Ação |
|--------|------|
| `Ctrl+K` | Abrir busca rápida |
| `Ctrl+H` | Ir para Dashboard |
| `Ctrl+G` | Ir para Metas |
| `Ctrl+I` | Ir para Indicadores |
| `Ctrl+P` | Ir para Planos de Ação |
| `Ctrl+Shift+N` | Criar Nova Meta |
| `ESC` | Fechar modais/painéis |

### Dentro do Command Palette
| Atalho | Ação |
|--------|------|
| `↑` `↓` | Navegar entre opções |
| `Enter` | Selecionar opção |
| `ESC` | Fechar |

---

## 🔔 Sistema de Notificações

### Tipos de Notificação
- **Info** (ℹ️): Informações gerais
- **Success** (✓): Ações concluídas
- **Warning** (⚠️): Alertas importantes
- **Error** (✕): Erros e falhas

### Gerenciamento
- **Badge**: Contador de não lidas no ícone do sino
- **Marcar como Lida**: Clique no ✓ em cada notificação
- **Marcar Todas**: Botão "Marcar todas como lidas"
- **Limpar**: Botão "Limpar todas"
- **Ações**: Links diretos para páginas relacionadas

### Uso Programático
```typescript
import { useNotifications } from '@/shared/contexts/NotificationContext'

const { addNotification } = useNotifications()

addNotification({
  title: 'Meta Criada',
  message: 'Meta "Aumentar vendas" foi criada com sucesso',
  type: 'success',
  actionLabel: 'Ver meta',
  actionUrl: '/goals'
})
```

---

## ⭐ Sistema de Favoritos

### Como Usar
1. Passe o mouse sobre qualquer item do menu
2. Clique na estrela ⭐ que aparece
3. Item é adicionado à seção "Favoritos" no topo
4. Clique novamente para remover

### Persistência
- Favoritos salvos no `localStorage`
- Sincronizados entre abas
- Máximo recomendado: 5-7 itens

---

## 🎨 Temas

### Alternância
- **Botão**: Ícone ☀️/🌙 na Topbar
- **Detecção Automática**: Respeita preferência do sistema
- **Persistência**: Escolha salva no `localStorage`

### Modo Escuro
- Cores otimizadas para baixa luminosidade
- Contraste WCAG AA compliant
- Reduz fadiga visual

---

## 🎓 Tour de Onboarding

### Primeira Visita
- Tour automático em 4 passos
- Destaca funcionalidades principais
- Navegação: Próximo/Anterior/Pular

### Passos do Tour
1. **Menu de Navegação**: Sidebar e colapso
2. **Busca Rápida**: Command Palette (Ctrl+K)
3. **Notificações**: Sistema de alertas
4. **Tema**: Alternância claro/escuro

### Reativar Tour
```javascript
// No console do navegador
localStorage.removeItem('onboarding-completed')
// Recarregue a página
```

---

## 📱 PWA (Progressive Web App)

### Instalação
1. Acesse via HTTPS
2. Navegador oferece "Instalar aplicativo"
3. Ícone adicionado à tela inicial

### Funcionalidades Offline
- Cache de assets estáticos
- Navegação offline
- Sincronização quando online

### Atalhos do App
- Dashboard
- Metas
- Indicadores

---

## ♿ Acessibilidade

### Navegação por Teclado
- `Tab`: Navegar entre elementos
- `Enter`/`Space`: Ativar botões
- `ESC`: Fechar modais
- Todos os atalhos globais funcionam

### Leitores de Tela
- ARIA labels em todos os botões
- Landmarks semânticos (`<nav>`, `<main>`)
- Skip to main content link

### Preferências do Sistema
- `prefers-reduced-motion`: Desabilita animações
- `prefers-color-scheme`: Tema automático

---

## 🎯 Skeleton Loaders

### Uso em Componentes
```typescript
import { SkeletonCard, SkeletonTable, SkeletonList } from '@/shared/ui'

function MyComponent() {
  const { data, isLoading } = useQuery(...)
  
  if (isLoading) return <SkeletonCard />
  
  return <Card data={data} />
}
```

### Tipos Disponíveis
- `Skeleton`: Base genérica
- `SkeletonCard`: Cards de métricas
- `SkeletonTable`: Tabelas de dados
- `SkeletonChart`: Gráficos
- `SkeletonList`: Listas de itens

---

## 🔄 Transições de Página

### Animações Suaves
- Fade in/out automático
- Duração: 200ms
- Respeita `prefers-reduced-motion`

### Desabilitar Animações
```css
/* Preferência do sistema */
@media (prefers-reduced-motion: reduce) {
  /* Animações desabilitadas automaticamente */
}
```

---

## 📊 Histórico de Navegação

### Rastreamento Automático
- Últimas 10 páginas visitadas
- Persistência no `localStorage`
- Integrado ao Command Palette (futuro)

### Uso Programático
```typescript
import { useNavigationHistory } from '@/shared/contexts/NavigationHistoryContext'

const { history, clearHistory } = useNavigationHistory()

// history: Array<{ path, label, timestamp }>
```

---

## 🛠️ Tooltips

### Uso
```typescript
import { Tooltip } from '@/shared/ui/Tooltip'

<Tooltip content="Descrição detalhada" side="top">
  <button>Hover me</button>
</Tooltip>
```

### Opções
- `side`: 'top' | 'right' | 'bottom' | 'left'
- `delay`: Tempo em ms (padrão: 300)

---

## 🔐 Boas Práticas

### Performance
- Lazy loading de rotas e componentes
- Code splitting automático
- Service Worker para cache

### Segurança
- Autenticação via Supabase
- Protected routes
- CSRF protection

### UX
- Feedback visual imediato
- Estados de loading
- Mensagens de erro claras
- Confirmações para ações destrutivas

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte esta documentação
2. Verifique o console do navegador
3. Limpe cache e localStorage se necessário
4. Contate o suporte técnico

---

**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2026
