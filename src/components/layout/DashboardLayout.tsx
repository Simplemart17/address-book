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
    <div className="min-h-screen bg-slate-50">
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

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
