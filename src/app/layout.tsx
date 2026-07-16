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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL
  ? new URL(process.env.NEXT_PUBLIC_APP_URL)
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : new URL('http://localhost:3000')

const siteName = 'ContactRef'
const siteTitle = 'ContactRef - Effective way to manage your contacts'
const siteDescription =
  'A robust way to manage your contacts with the address book service'

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    template: '%s - ContactRef',
    default: siteTitle,
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
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
