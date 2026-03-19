import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface FavoritesContextValue {
  favorites: string[]
  isFavorite: (path: string) => boolean
  toggleFavorite: (path: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

const STORAGE_KEY = 'app-favorites'

function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load favorites:', error)
  }
  return []
}

function saveFavorites(favorites: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Failed to save favorites:', error)
  }
}

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites)

  const isFavorite = useCallback(
    (path: string) => favorites.includes(path),
    [favorites]
  )

  const toggleFavorite = useCallback((path: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path]
      saveFavorites(updated)
      return updated
    })
  }, [])

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
