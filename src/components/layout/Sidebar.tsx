'use client'

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import {
  XMarkIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, userType } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navigation = [
    {
      name: 'Contacts',
      href: '/contact-lists',
      icon: UserGroupIcon,
    },
    ...(userType === 'admin'
      ? [
          {
            name: 'Admin',
            href: '/admin',
            icon: ShieldCheckIcon,
          },
        ]
      : []),
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/contact-lists" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-display">
            ContactRef
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className={clsx(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <item.icon
                className={clsx(
                  'h-5 w-5 shrink-0',
                  isActive
                    ? 'text-violet-600'
                    : 'text-slate-400 group-hover:text-slate-500',
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeftStartOnRectangleIcon
            className="h-5 w-5 text-slate-400"
            aria-hidden="true"
          />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Transition show={mobileOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={onMobileClose}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative flex w-72 flex-col bg-white">
                <div className="absolute right-0 top-0 flex pt-4 pr-3">
                  <button
                    type="button"
                    className="rounded-md text-slate-400 hover:text-slate-500"
                    onClick={onMobileClose}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {sidebarContent}
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col border-r border-slate-200 bg-white">
          {sidebarContent}
        </div>
      </div>
    </>
  )
}
