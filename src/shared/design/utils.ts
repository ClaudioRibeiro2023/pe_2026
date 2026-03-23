import { colors, spacing, borders, shadows } from './tokens'
import type { ActionPriority, NodeType } from '@/features/area-plans/types'

// Utilitários de cores
export const getColorClasses = {
  // Status
  status: (status: 'success' | 'warning' | 'error' | 'info') => {
    const theme = colors.status[status]
    return {
      bg: `bg-[${theme.bg}]`,
      border: `border-[${theme.border}]`,
      text: `text-[${theme.text}]`,
    }
  },

  // Prioridade
  priority: (priority: ActionPriority) => {
    const theme = colors.priority[priority]
    return {
      bg: `bg-[${theme.bg}]`,
      border: `border-[${theme.border}]`,
      text: `text-[${theme.text}]`,
      label: theme.label,
    }
  },

  // Tipo de Nó
  nodeType: (type: NodeType) => {
    const theme = colors.nodeType[type]
    return {
      bg: `bg-[${theme.bg}]`,
      border: `border-[${theme.border}]`,
      text: `text-[${theme.text}]`,
      label: theme.label,
    }
  },
}

// Utilitários de espaçamento
export const getSpacing = (size: keyof typeof spacing) => spacing[size]

// Utilitários de tipografia
export const getTypography = {
  heading: (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const sizes = {
      1: 'text-3xl font-bold',
      2: 'text-2xl font-bold',
      3: 'text-xl font-semibold',
      4: 'text-lg font-semibold',
      5: 'text-base font-medium',
      6: 'text-sm font-medium',
    }
    return sizes[level]
  },
  
  body: (size: 'xs' | 'sm' | 'base' | 'lg') => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    }
    return sizes[size]
  },
}

// Utilitários de bordas
export const getBorderRadius = (size: keyof typeof borders.radius) => {
  const radiusMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }
  return radiusMap[size]
}

// Utilitários de sombras
export const getShadow = (size: keyof typeof shadows) => {
  const shadowMap = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }
  return shadowMap[size]
}

// Classes CSS combinadas para componentes comuns
export const componentClasses = {
  // Card
  card: `
    bg-surface border border-border rounded-lg shadow-sm
    hover:shadow-md transition-shadow duration-200
  `,

  // Button variants
  button: {
    primary: `
      bg-primary-600 text-white px-4 py-2 rounded-lg
      hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:bg-primary-300 disabled:cursor-not-allowed
      transition-colors duration-200
    `,
    secondary: `
      bg-accent text-foreground px-4 py-2 rounded-lg
      hover:bg-accent/80 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:bg-accent/50 disabled:text-muted disabled:cursor-not-allowed
      transition-colors duration-200
    `,
    outline: `
      border border-border text-foreground px-4 py-2 rounded-lg
      hover:bg-accent focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:bg-accent/50 disabled:text-muted disabled:cursor-not-allowed
      transition-colors duration-200
    `,
    ghost: `
      text-muted px-3 py-2 rounded-lg
      hover:bg-accent hover:text-foreground focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:text-muted/50 disabled:cursor-not-allowed
      transition-colors duration-200
    `,
    danger: `
      bg-danger-600 text-white px-4 py-2 rounded-lg
      hover:bg-danger-700 focus:ring-2 focus:ring-danger-500 focus:ring-offset-2
      disabled:bg-danger-300 disabled:cursor-not-allowed
      transition-colors duration-200
    `,
  },

  // Input
  input: `
    w-full px-3 py-2 border border-border rounded-lg
    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none
    disabled:bg-accent/50 disabled:text-muted disabled:cursor-not-allowed
    transition-colors duration-200
  `,

  // Badge
  badge: (variant: 'success' | 'warning' | 'error' | 'info') => {
    const colors = getColorClasses.status(variant)
    return `
      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
      ${colors.bg} ${colors.text} border ${colors.border}
    `
  },

  // Status indicators
  statusIndicator: {
    online: 'w-2 h-2 bg-green-500 rounded-full',
    offline: 'w-2 h-2 bg-muted rounded-full',
    busy: 'w-2 h-2 bg-red-500 rounded-full',
    away: 'w-2 h-2 bg-yellow-500 rounded-full',
  },

  // Loading states
  loading: {
    overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    spinner: 'animate-spin rounded-full border-2 border-border border-t-primary-600',
    skeleton: 'animate-pulse bg-accent rounded',
  },

  // Transições
  transition: {
    default: 'transition-all duration-200 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out',
    opacity: 'transition-opacity duration-200 ease-in-out',
  },
}

// Responsive utilities
export const responsive = {
  // Mobile-first responsive classes
  mobileOnly: 'block md:hidden',
  desktopOnly: 'hidden md:block',
  
  // Grid layouts
  grid: {
    auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    two: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    three: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    four: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  },
  
  // Flex layouts
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
  },
}

// Theme provider utilities
export const createTheme = (customColors?: Partial<typeof colors>) => ({
  ...colors,
  ...customColors,
})
