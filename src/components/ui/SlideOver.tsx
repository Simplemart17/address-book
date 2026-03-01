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
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold text-slate-900">
                          {title}
                        </DialogTitle>
                        <button
                          type="button"
                          className="rounded-md text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
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
