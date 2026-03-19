import { lazy, Suspense } from 'react'
import type { ModalProps } from './Modal'

const Modal = lazy(() => import('./Modal').then((m) => ({ default: m.Modal })))

function ModalFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
    </div>
  )
}

export function LazyModal({ open, ...rest }: ModalProps) {
  if (!open) return null

  return (
    <Suspense fallback={<ModalFallback />}>
      <Modal open={open} {...rest} />
    </Suspense>
  )
}
