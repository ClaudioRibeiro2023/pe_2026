import { 
  LayoutDashboard, 
  FileSearch, 
  Target, 
  Boxes, 
  Shield, 
  Files 
} from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import type { SectionKey } from '../types'

interface PackTabsProps {
  activeTab: SectionKey
  onTabChange: (tab: SectionKey) => void
  commentCounts?: Record<SectionKey, number>
}

const TABS: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { key: 'diagnosis', label: 'Diagnóstico', icon: FileSearch },
  { key: 'objectives', label: 'Objetivos e Metas', icon: Target },
  { key: 'programs', label: 'Programas', icon: Boxes },
  { key: 'governance', label: 'Governança', icon: Shield },
  { key: 'docs', label: 'Documentos', icon: Files },
]

export function PackTabs({ activeTab, onTabChange, commentCounts }: PackTabsProps) {
  return (
    <div className="border-b border-border bg-surface">
      <nav className="flex space-x-1 px-4" aria-label="Tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          const commentCount = commentCounts?.[tab.key] || 0

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-muted hover:text-foreground hover:border-primary-300'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {commentCount > 0 && (
                <span className={cn(
                  'ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full',
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-accent text-muted'
                )}>
                  {commentCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
