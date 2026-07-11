'use client'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function SlideOver({
  open,
  onClose,
  title,
  children,
}: SlideOverProps) {
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

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <TransitionChild
                as={Fragment}
                enter="transform transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto border-l border-edge bg-surface-2/95 shadow-elevated backdrop-blur-xl">
                    <div className="border-b border-edge px-6 py-5">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="font-display text-lg font-semibold text-fg">
                          {title}
                        </DialogTitle>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-fg-subtle transition-colors hover:bg-white/10 hover:text-fg"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="size-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 px-4 py-6 sm:px-6">{children}</div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
