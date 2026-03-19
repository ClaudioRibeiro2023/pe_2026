import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Plus } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import { navSections } from '@/shared/config/navigation'
import type { NavItem } from '@/shared/config/navigation'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

interface CommandItem {
  id: string
  label: string
  sectionTitle: string
  icon: NavItem['icon']
  href?: string
  action?: () => void
}

const navigationCommands: CommandItem[] = navSections.flatMap((section) =>
  section.items.map((item) => ({
    id: `nav-${item.href}`,
    label: item.label,
    sectionTitle: section.title,
    icon: item.icon,
    href: item.href,
  }))
)

const quickActions: CommandItem[] = [
  {
    id: 'action-create-goal',
    label: 'Criar Nova Meta',
    sectionTitle: 'Ações Rápidas',
    icon: Plus,
    href: '/goals?create=1',
  },
  {
    id: 'action-create-indicator',
    label: 'Criar Novo Indicador',
    sectionTitle: 'Ações Rápidas',
    icon: Plus,
    href: '/indicators?create=1',
  },
  {
    id: 'action-create-action-plan',
    label: 'Criar Novo Plano de Ação',
    sectionTitle: 'Ações Rápidas',
    icon: Plus,
    href: '/action-plans?create=1',
  },
]

const allCommands: CommandItem[] = [...navigationCommands, ...quickActions]

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCommands = query.trim()
    ? allCommands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.sectionTitle.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault()
        handleSelect(filteredCommands[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredCommands, selectedIndex, onClose])

  const handleSelect = (command: CommandItem) => {
    if (command.action) {
      command.action()
    } else if (command.href) {
      navigate(command.href)
    }
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
        <div
          className="w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
            <Search className="h-5 w-5 text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar páginas e ações..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted outline-none text-base"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted bg-accent rounded border border-border">
              ESC
            </kbd>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm text-muted">Nenhum resultado encontrado</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((command, index) => {
                  const Icon = command.icon
                  const isSelected = index === selectedIndex

                  return (
                    <button
                      key={command.href}
                      onClick={() => handleSelect(command)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                        isSelected
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-foreground hover:bg-accent'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
                          isSelected
                            ? 'border-primary-200 bg-primary-100 text-primary-700'
                            : 'border-border bg-muted/30 text-muted'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{command.label}</p>
                        <p className="text-xs text-muted truncate">{command.sectionTitle}</p>
                      </div>
                      <ArrowRight
                        className={cn(
                          'h-4 w-4 flex-shrink-0',
                          isSelected ? 'text-primary-600' : 'text-muted'
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-border bg-accent/30">
            <div className="flex items-center gap-4 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-surface rounded border border-border">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-surface rounded border border-border">↓</kbd>
                <span>Navegar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-surface rounded border border-border">Enter</kbd>
                <span>Selecionar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-surface rounded border border-border">ESC</kbd>
                <span>Fechar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
