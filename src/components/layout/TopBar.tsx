'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'

interface TopBarProps {
  onMenuClick: () => void
  title: string
  actions?: React.ReactNode
}

export default function TopBar({ onMenuClick, title, actions }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-md text-slate-400 hover:text-slate-500 lg:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <h1 className="text-lg font-semibold text-slate-900 font-display">
          {title}
        </h1>

        {actions && (
          <div className="ml-auto flex items-center gap-3">{actions}</div>
        )}
      </div>
    </div>
  )
}
