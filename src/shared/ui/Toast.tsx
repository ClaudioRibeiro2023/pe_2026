import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  lazy,
  Suspense,
} from 'react'
import type { Toast } from './ToastTypes'

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ToastContainer = lazy(() =>
  import('./ToastContainer').then((m) => ({ default: m.ToastContainer }))
)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="contents">
        {toasts.length > 0 && (
          <Suspense fallback={null}>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
          </Suspense>
        )}
      </div>
    </ToastContext.Provider>
  )
}
