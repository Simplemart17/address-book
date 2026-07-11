'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

type ToastVariant = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DISMISS_AFTER_MS = 4000

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, variant }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), DISMISS_AFTER_MS),
      )
    },
    [dismiss],
  )

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((timer) => clearTimeout(timer))
      pending.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-3 p-6"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role={item.variant === 'error' ? 'alert' : undefined}
            className="animate-toast-in pointer-events-auto w-full rounded-xl border border-edge bg-surface-2/90 p-4 shadow-elevated backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              {item.variant === 'success' ? (
                <CheckCircleIcon
                  className="size-6 shrink-0 text-success"
                  aria-hidden="true"
                />
              ) : (
                <ExclamationCircleIcon
                  className="size-6 shrink-0 text-danger"
                  aria-hidden="true"
                />
              )}
              <p className="flex-1 pt-0.5 text-sm text-fg first-letter:capitalize">
                {item.message}
              </p>
              <button
                type="button"
                className="shrink-0 rounded-md text-fg-subtle transition-colors hover:text-fg"
                onClick={() => dismiss(item.id)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
