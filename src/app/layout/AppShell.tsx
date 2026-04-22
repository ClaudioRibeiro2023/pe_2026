import { Suspense, lazy, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CommandPalette } from '@/shared/components/command-palette/CommandPalette'
import { PageTransition } from '@/shared/components/transitions/PageTransition'
import { OnboardingTour } from '@/shared/components/onboarding/OnboardingTour'
import { ShortcutsGuide, useShortcutsGuide } from '@/shared/components/shortcuts/ShortcutsGuide'
import { UpdateNotification } from '@/shared/components/electron/UpdateNotification'
import { ScrollProgress } from '@/shared/components/layout/ScrollProgress'
import { useCommandPalette } from '@/shared/hooks/useCommandPalette'
import { useGlobalShortcuts } from '@/shared/hooks/useKeyboardShortcuts'
import { isSupabaseConfigured } from '@/shared/lib/supabaseClient'

const Sidebar = lazy(() => import('./Sidebar').then((m) => ({ default: m.Sidebar })))
const Topbar = lazy(() => import('./Topbar').then((m) => ({ default: m.Topbar })))

function SidebarFallback() {
  return <div className="hidden lg:block w-64 bg-surface border-r border-border" />
}

function TopbarFallback() {
  return <div className="h-16 bg-surface border-b border-border" />
}

const SESSION_BANNER_KEY = 'pe2026-demo-banner-dismissed'

function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(() =>
    typeof window !== 'undefined' && sessionStorage.getItem(SESSION_BANNER_KEY) === '1'
  )

  if (isSupabaseConfigured() || dismissed) return null

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_BANNER_KEY, '1')
    setDismissed(true)
  }

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-4 px-6 py-2 bg-warning-100 dark:bg-warning-900/30 border-b border-warning-300 dark:border-warning-700/50 text-warning-800 dark:text-warning-200 text-sm"
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex h-1.5 w-1.5 rounded-full bg-warning-500 dark:bg-warning-400 animate-pulse"
        />
        <span>
          <strong className="font-semibold">Modo Demo:</strong> Supabase não configurado — exibindo dados fictícios. Dados não são persistidos.
        </span>
      </span>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 px-2 -mr-2 rounded text-warning-700 dark:text-warning-300 hover:text-warning-900 dark:hover:text-warning-100 hover:bg-warning-200/60 dark:hover:bg-warning-800/40 font-medium transition-colors"
        aria-label="Fechar aviso de modo demo"
      >
        ✕
      </button>
    </div>
  )
}

export function AppShell() {
  const commandPalette = useCommandPalette()
  const shortcutsGuide = useShortcutsGuide()
  useGlobalShortcuts()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault()
        shortcutsGuide.openGuide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcutsGuide])

  return (
    <>
      <a href="#main-content" className="skip-to-main">
        Pular para o conteúdo principal
      </a>
      <div className="flex h-screen bg-background">
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar />
        </Suspense>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Suspense fallback={<TopbarFallback />}>
            <Topbar onOpenSearch={commandPalette.toggle} />
          </Suspense>
          <DemoModeBanner />
          <main id="main-content" className="flex-1 overflow-auto p-6">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>
      <CommandPalette open={commandPalette.open} onClose={commandPalette.close} />
      <ShortcutsGuide open={shortcutsGuide.open} onClose={shortcutsGuide.closeGuide} />
      <OnboardingTour />
      <UpdateNotification />
      <ScrollProgress />
    </>
  )
}
