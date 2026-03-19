# Design System — Template App

## Visão geral
Este documento define o sistema de design mínimo viável do projeto. O objetivo é garantir consistência visual, manutenção simples e evolução segura.

---

## Tokens

### Cores semânticas (via CSS variables)
Usadas no Tailwind com classes: `bg-background`, `bg-surface`, `text-foreground`, `border-border`, `text-muted`, `bg-accent`.

```css
:root {
  --background: 248 250 252;
  --surface: 255 255 255;
  --foreground: 15 23 42;
  --border: 226 232 240;
  --muted: 148 163 184;
  --accent: 226 232 240;
  --primary-600: 37 99 235;
  --success-600: 22 163 74;
  --warning-600: 217 119 6;
  --danger-600: 220 38 38;
}
```

### Paleta de marca
- `primary`: azul principal (50–950)
- `success`, `warning`, `danger`: status
- `neutral`: escala de cinzas

### Tipografia
- `font-family`: Inter, system-ui
- `H1`: `text-3xl font-bold`
- `H2`: `text-2xl font-bold`
- `H3`: `text-lg font-semibold`
- `Body`: `text-sm/text-base`

### Espaçamento
Escala em múltiplos de 4px (Tailwind padrão) com exceções existentes:
- `18` (72px)
- `88` (352px)

---

## Componentes base

### Button
Variantes: `primary`, `secondary`, `outline`, `ghost`, `danger`
Tamanhos: `sm`, `md`, `lg`

Uso:
```tsx
<Button variant="primary">Salvar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
```

### Input
Suporta `label`, `error`, `hint`.

Uso:
```tsx
<Input label="Email" placeholder="seu@email.com" />
```

### Select
Suporta `label`, `options`, `error`, `hint`.

### Card
Composição: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.

### Modal
`open`, `onClose`, `title`, `description`, `size`.

### Table
Usar `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`.

### Toast
`useToast` + `ToastProvider`.

---

## Guidelines
- Prefira tokens semânticos (`bg-surface`, `border-border`) no lugar de cores diretas.
- Botões e inputs devem usar os componentes de `src/shared/ui`.
- Evite estilos inline quando houver componente base.

---

## Padrões finais
### Gráficos (Chart.js)
- Use CSS variables: `rgb(var(--primary-600))`, `rgb(var(--success-600))`, `rgb(var(--danger-600))`, `rgb(var(--muted))`, `rgb(var(--border))`.
- Evite hex hardcoded em datasets/axis.

### Calendar modifiers
- Preferir `rgb(var(--primary-600))` e `rgb(var(--surface))` para marcação de dias com eventos.

### Skeleton
- Gradiente usando `rgb(var(--accent))` e `rgb(var(--surface))`.

### Focus
- Usar `rgb(var(--primary-600))` para `outline` e `focus-visible`.

---

## Checklist final (concluído)
- [x] Tokens semânticos aplicados em páginas principais (Dashboard, Goals, Indicators, Action Plans, Strategy, Reports, Settings).
- [x] Layout global (Topbar/Sidebar/AppShell) alinhado ao design system.
- [x] Componentes base (Button, Input, Select, Card, Modal, Table, Toast, Empty/Error) padronizados.
- [x] Filtros e formulários (SearchBar, FilterSelect, forms) com tokens.
- [x] Estados vazios, loaders, paginação e toasts alinhados.
- [x] Charts e Calendar com cores via CSS vars.
- [x] Remoção de `neutral-*`, hex e `bg-white` residuais.

---

## Status da migração
- Migração concluída; sem pendências críticas no UI atual.
- Novos componentes devem seguir tokens e padrões acima.
