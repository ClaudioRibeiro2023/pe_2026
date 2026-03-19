import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { navSections } from '@/shared/config/navigation'

interface HistoryItem {
  path: string
  label: string
  timestamp: number
}

interface NavigationHistoryContextValue {
  history: HistoryItem[]
  addToHistory: (path: string) => void
  clearHistory: () => void
}

const NavigationHistoryContext = createContext<NavigationHistoryContextValue | undefined>(undefined)

const STORAGE_KEY = 'navigation-history'
const MAX_HISTORY = 10

function loadHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load navigation history:', error)
  }
  return []
}

function saveHistory(history: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save navigation history:', error)
  }
}

function getPageLabel(path: string): string {
  for (const section of navSections) {
    const item = section.items.find((i) => i.href === path)
    if (item) return item.label
  }
  return path
}

interface NavigationHistoryProviderProps {
  children: ReactNode
}

export function NavigationHistoryProvider({ children }: NavigationHistoryProviderProps) {
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory)
  const location = useLocation()

  const addToHistory = useCallback((path: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.path !== path)
      const newHistory = [
        {
          path,
          label: getPageLabel(path),
          timestamp: Date.now(),
        },
        ...filtered,
      ].slice(0, MAX_HISTORY)
      
      saveHistory(newHistory)
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    saveHistory([])
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') {
      addToHistory(location.pathname)
    }
  }, [location.pathname, addToHistory])

  return (
    <NavigationHistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </NavigationHistoryContext.Provider>
  )
}

export function useNavigationHistory() {
  const context = useContext(NavigationHistoryContext)
  if (!context) {
    throw new Error('useNavigationHistory must be used within NavigationHistoryProvider')
  }
  return context
}
