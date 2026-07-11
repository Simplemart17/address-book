'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'
import { UserButton } from '@clerk/nextjs'

interface TopBarProps {
  onMenuClick: () => void
  title: string
  actions?: React.ReactNode
}

export default function TopBar({ onMenuClick, title, actions }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-edge bg-bg/60 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-md text-fg-muted transition-colors hover:text-fg lg:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="size-6" aria-hidden="true" />
        </button>

        <h1 className="font-display text-lg font-semibold text-fg">{title}</h1>

        <div className="ml-auto flex items-center gap-3">
          {actions}
          <UserButton />
        </div>
      </div>
    </div>
  )
}
