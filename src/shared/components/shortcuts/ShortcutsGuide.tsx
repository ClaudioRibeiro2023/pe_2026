import { useState } from 'react'
import { X, Keyboard } from '@/shared/ui/icons'

interface ShortcutItem {
  keys: string[]
  description: string
  category: string
}

const shortcuts: ShortcutItem[] = [
  { keys: ['Ctrl', 'K'], description: 'Abrir busca rápida', category: 'Navegação' },
  { keys: ['Ctrl', 'H'], description: 'Ir para Dashboard', category: 'Navegação' },
  { keys: ['Ctrl', 'G'], description: 'Ir para Metas', category: 'Navegação' },
  { keys: ['Ctrl', 'I'], description: 'Ir para Indicadores', category: 'Navegação' },
  { keys: ['Ctrl', 'P'], description: 'Ir para Planos de Ação', category: 'Navegação' },
  { keys: ['Ctrl', 'Shift', 'N'], description: 'Criar Nova Meta', category: 'Ações' },
  { keys: ['ESC'], description: 'Fechar modais/painéis', category: 'Geral' },
  { keys: ['↑', '↓'], description: 'Navegar em listas', category: 'Geral' },
  { keys: ['Enter'], description: 'Confirmar/Selecionar', category: 'Geral' },
]

const categories = Array.from(new Set(shortcuts.map(s => s.category)))

interface ShortcutsGuideProps {
  open: boolean
  onClose: () => void
}

export function ShortcutsGuide({ open, onClose }: ShortcutsGuideProps) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-accent/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <Keyboard className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Atalhos de Teclado</h2>
                <p className="text-sm text-muted">Navegue mais rápido com atalhos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcuts
                    .filter((s) => s.category === category)
                    .map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <span className="text-sm text-foreground">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <kbd className="px-2 py-1 text-xs font-medium bg-surface border border-border rounded shadow-sm">
                                {key}
                              </kbd>
                              {i < shortcut.keys.length - 1 && (
                                <span className="text-muted text-xs">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-accent/30">
            <p className="text-xs text-muted text-center">
              Pressione <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">?</kbd> para abrir este guia novamente
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShortcutsGuide() {
  const [open, setOpen] = useState(false)

  return {
    open,
    openGuide: () => setOpen(true),
    closeGuide: () => setOpen(false),
  }
}
