import { type Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import clsx from 'clsx'

import { clerkAppearance } from '@/lib/clerk-appearance'
import { ToastProvider } from '@/components/ui/ToastProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-bricolage',
})

export const metadata: Metadata = {
  title: {
    template: '%s - ContactRef',
    default: 'ContactRef - Effective way to manage your contacts',
  },
  description:
    'A robust way to manage your contacts with the address book service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html
        lang="en"
        className={clsx('h-full antialiased', inter.variable, bricolage.variable)}
      >
        <body className="min-h-full">
          <ToastProvider>{children}</ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
