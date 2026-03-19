import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { ToastProvider } from '@/shared/ui/Toast'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'
import { NotificationProvider } from '@/shared/contexts/NotificationContext'
import { FavoritesProvider } from '@/shared/contexts/FavoritesContext'
import { NavigationHistoryProvider } from '@/shared/contexts/NavigationHistoryContext'
import { AreaProvider } from '@/features/planning/contexts/AreaContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Detect if running in Electron or file:// (packaged)
const isElectron =
  typeof window !== 'undefined' &&
  (window.electronAPI !== undefined || window.location.protocol === 'file:')

// Router component that uses HashRouter for Electron, BrowserRouter for web
function RouterProvider({ children }: { children: React.ReactNode }) {
  const futureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }

  if (isElectron) {
    return <HashRouter future={futureFlags}>{children}</HashRouter>
  }

  return <BrowserRouter future={futureFlags}>{children}</BrowserRouter>
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider>
        <ThemeProvider>
          <NotificationProvider>
            <FavoritesProvider>
              <NavigationHistoryProvider>
                <AuthProvider>
                  <AreaProvider>
                    <ToastProvider>
                      <AppRouter />
                    </ToastProvider>
                  </AreaProvider>
                </AuthProvider>
              </NavigationHistoryProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </ThemeProvider>
      </RouterProvider>
    </QueryClientProvider>
  )
}
