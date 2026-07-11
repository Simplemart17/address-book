'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  actions?: React.ReactNode
}

export default function DashboardLayout({
  children,
  title,
  actions,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 page-glow" aria-hidden />
      <div className="pointer-events-none fixed inset-0 dot-grid" aria-hidden />

      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          actions={actions}
        />

        <main className="relative px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
