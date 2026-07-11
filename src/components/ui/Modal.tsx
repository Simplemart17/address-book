'use client'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Fragment } from 'react'
import Button from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'md' | 'lg'
}

// Generic content modal — glass panel over a dimmed backdrop.
export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={clsx(
                  'w-full transform rounded-2xl border border-edge bg-surface-2/90 p-6 text-left shadow-elevated inset-shadow-highlight backdrop-blur-xl transition-all sm:my-8',
                  size === 'lg' ? 'max-w-lg' : 'max-w-md',
                )}
              >
                <DialogTitle
                  as="h3"
                  className="font-display text-lg font-semibold text-fg"
                >
                  {title}
                </DialogTitle>
                <div className="mt-4">{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  loading?: boolean
  variant?: 'danger' | 'primary'
}

// Confirmation dialog built on Modal.
export default function ConfirmModal({
  open,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  loading = false,
  variant = 'danger',
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start gap-4">
        <div
          className={clsx(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            variant === 'danger'
              ? 'bg-danger/15 text-danger'
              : 'bg-primary/15 text-primary-bright',
          )}
        >
          {variant === 'danger' ? (
            <ExclamationTriangleIcon className="size-6" aria-hidden="true" />
          ) : (
            <InformationCircleIcon className="size-6" aria-hidden="true" />
          )}
        </div>
        <p className="pt-2 text-sm text-fg-muted">{message}</p>
      </div>
      <div className="mt-6 flex flex-row-reverse gap-3">
        <Button
          variant={variant}
          size="sm"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
