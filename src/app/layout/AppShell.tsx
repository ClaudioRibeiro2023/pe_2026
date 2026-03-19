import { Suspense, lazy, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { CommandPalette } from '@/shared/components/command-palette/CommandPalette'
import { PageTransition } from '@/shared/components/transitions/PageTransition'
import { OnboardingTour } from '@/shared/components/onboarding/OnboardingTour'
import { ShortcutsGuide, useShortcutsGuide } from '@/shared/components/shortcuts/ShortcutsGuide'
import { UpdateNotification } from '@/shared/components/electron/UpdateNotification'
import { useCommandPalette } from '@/shared/hooks/useCommandPalette'
import { useGlobalShortcuts } from '@/shared/hooks/useKeyboardShortcuts'

const Sidebar = lazy(() => import('./Sidebar').then((m) => ({ default: m.Sidebar })))
const Topbar = lazy(() => import('./Topbar').then((m) => ({ default: m.Topbar })))

function SidebarFallback() {
  return <div className="hidden lg:block w-64 bg-surface border-r border-border" />
}

function TopbarFallback() {
  return <div className="h-16 bg-surface border-b border-border" />
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
    </>
  )
}
