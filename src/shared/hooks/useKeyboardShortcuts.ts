import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const altMatch = shortcut.alt ? e.altKey : !e.altKey
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export function useGlobalShortcuts() {
  const navigate = useNavigate()

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'g',
      ctrl: true,
      description: 'Ir para Metas',
      action: () => navigate('/goals'),
    },
    {
      key: 'i',
      ctrl: true,
      description: 'Ir para Indicadores',
      action: () => navigate('/indicators'),
    },
    {
      key: 'p',
      ctrl: true,
      description: 'Ir para Planos de Ação',
      action: () => navigate('/action-plans'),
    },
    {
      key: 'h',
      ctrl: true,
      description: 'Ir para Dashboard',
      action: () => navigate('/'),
    },
    {
      key: 'n',
      ctrl: true,
      shift: true,
      description: 'Nova Meta',
      action: () => navigate('/goals?create=1'),
    },
  ]

  useKeyboardShortcuts(shortcuts)

  return shortcuts
}
