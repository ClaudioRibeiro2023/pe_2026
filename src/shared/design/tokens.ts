// Design Tokens - Sistema unificado de design

// Cores
export const colors = {
  // Primárias
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Status
  status: {
    success: {
      bg: '#dcfce7',
      border: '#22c55e',
      text: '#15803d',
    },
    warning: {
      bg: '#fef3c7',
      border: '#f59e0b',
      text: '#d97706',
    },
    error: {
      bg: '#fee2e2',
      border: '#ef4444',
      text: '#dc2626',
    },
    info: {
      bg: '#dbeafe',
      border: '#3b82f6',
      text: '#1d4ed8',
    },
  },

  // Prioridades
  priority: {
    P0: {
      bg: '#fee2e2',
      border: '#ef4444',
      text: '#dc2626',
      label: 'Crítica',
    },
    P1: {
      bg: '#fef3c7',
      border: '#f59e0b',
      text: '#d97706',
      label: 'Alta',
    },
    P2: {
      bg: '#dcfce7',
      border: '#22c55e',
      text: '#15803d',
      label: 'Média',
    },
  },

  // Tipos de Nó
  nodeType: {
    macro: {
      bg: '#fce7f3',
      border: '#ec4899',
      text: '#be185d',
      label: 'Macro Ação',
    },
    area: {
      bg: '#e0e7ff',
      border: '#6366f1',
      text: '#4338ca',
      label: 'Área',
    },
    meta: {
      bg: '#f3e8ff',
      border: '#a855f7',
      text: '#7c3aed',
      label: 'Meta',
    },
    pilar: {
      bg: '#fed7aa',
      border: '#fb923c',
      text: '#ea580c',
      label: 'Pilar',
    },
    acao: {
      bg: '#e5e7eb',
      border: '#6b7280',
      text: '#374151',
      label: 'Ação',
    },
  },

  // Neutras
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
}

// Espaçamento
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
}

// Tipografia
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
}

// Bordas
export const borders = {
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  width: {
    none: '0',
    thin: '1px',
    normal: '2px',
    thick: '4px',
  },
}

// Sombras
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
}

// Animações
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Z-index
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}
