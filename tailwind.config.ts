import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--surface-elevated) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        muted: 'rgb(var(--foreground-muted) / <alpha-value>)',
        accent: 'rgb(var(--surface-elevated) / <alpha-value>)',
        
        // Corporate Primary - Azul Sóbrio
        primary: {
          50: 'rgb(var(--corp-primary-50) / <alpha-value>)',
          100: 'rgb(var(--corp-primary-100) / <alpha-value>)',
          200: 'rgb(var(--corp-primary-200) / <alpha-value>)',
          300: 'rgb(var(--corp-primary-300) / <alpha-value>)',
          400: 'rgb(var(--corp-primary-400) / <alpha-value>)',
          500: 'rgb(var(--corp-primary-500) / <alpha-value>)',
          600: 'rgb(var(--corp-primary-600) / <alpha-value>)',
          700: 'rgb(var(--corp-primary-700) / <alpha-value>)',
          800: 'rgb(var(--corp-primary-800) / <alpha-value>)',
          900: 'rgb(var(--corp-primary-900) / <alpha-value>)',
        },
        
        // Corporate Gray - Neutros Clean
        gray: {
          50: 'rgb(var(--corp-gray-50) / <alpha-value>)',
          100: 'rgb(var(--corp-gray-100) / <alpha-value>)',
          200: 'rgb(var(--corp-gray-200) / <alpha-value>)',
          300: 'rgb(var(--corp-gray-300) / <alpha-value>)',
          400: 'rgb(var(--corp-gray-400) / <alpha-value>)',
          500: 'rgb(var(--corp-gray-500) / <alpha-value>)',
          600: 'rgb(var(--corp-gray-600) / <alpha-value>)',
          700: 'rgb(var(--corp-gray-700) / <alpha-value>)',
          800: 'rgb(var(--corp-gray-800) / <alpha-value>)',
          900: 'rgb(var(--corp-gray-900) / <alpha-value>)',
        },
        
        // Status Colors
        success: {
          50: 'rgb(var(--corp-success-50) / <alpha-value>)',
          100: 'rgb(var(--corp-success-100) / <alpha-value>)',
          500: 'rgb(var(--corp-success-500) / <alpha-value>)',
          600: 'rgb(var(--corp-success-600) / <alpha-value>)',
          700: 'rgb(var(--corp-success-700) / <alpha-value>)',
        },
        warning: {
          50: 'rgb(var(--corp-warning-50) / <alpha-value>)',
          100: 'rgb(var(--corp-warning-100) / <alpha-value>)',
          500: 'rgb(var(--corp-warning-500) / <alpha-value>)',
          600: 'rgb(var(--corp-warning-600) / <alpha-value>)',
          700: 'rgb(var(--corp-warning-700) / <alpha-value>)',
        },
        danger: {
          50: 'rgb(var(--corp-danger-50) / <alpha-value>)',
          100: 'rgb(var(--corp-danger-100) / <alpha-value>)',
          500: 'rgb(var(--corp-danger-500) / <alpha-value>)',
          600: 'rgb(var(--corp-danger-600) / <alpha-value>)',
          700: 'rgb(var(--corp-danger-700) / <alpha-value>)',
        },
        info: {
          50: 'rgb(var(--corp-info-50) / <alpha-value>)',
          100: 'rgb(var(--corp-info-100) / <alpha-value>)',
          500: 'rgb(var(--corp-info-500) / <alpha-value>)',
          600: 'rgb(var(--corp-info-600) / <alpha-value>)',
          700: 'rgb(var(--corp-info-700) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
