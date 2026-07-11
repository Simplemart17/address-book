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
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import Logo from '@/components/ui/Logo'

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()

  const isAdmin = user?.publicMetadata?.role === 'admin'

  const navigation = [
    {
      name: 'Contacts',
      href: '/contact-lists',
      icon: UserGroupIcon,
    },
    ...(isAdmin
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
        <Link href="/contact-lists" className="rounded-lg">
          <Logo />
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
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/6 text-fg'
                  : 'text-fg-muted hover:bg-white/4 hover:text-fg',
              )}
            >
              {isActive && (
                <span
                  className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-linear-to-b from-primary-bright to-accent-2"
                  aria-hidden
                />
              )}
              <item.icon
                className={clsx(
                  'size-5 shrink-0',
                  isActive
                    ? 'text-primary-bright'
                    : 'text-fg-subtle group-hover:text-fg-muted',
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-edge p-3">
        <button
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-white/4 hover:text-fg"
        >
          <ArrowLeftStartOnRectangleIcon
            className="size-5 text-fg-subtle"
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
              <DialogPanel className="relative flex w-72 flex-col border-r border-edge bg-surface-2/95 backdrop-blur-xl">
                <div className="absolute right-0 top-0 flex pt-4 pr-3">
                  <button
                    type="button"
                    className="rounded-md text-fg-subtle transition-colors hover:text-fg"
                    onClick={onMobileClose}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="size-6" aria-hidden="true" />
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
        <div className="flex grow flex-col border-r border-edge bg-bg/70 backdrop-blur-md">
          {sidebarContent}
        </div>
      </div>
    </>
  )
}
