import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

// Belt-and-braces with the proxy admin check.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sessionClaims } = await auth()
  if (sessionClaims?.metadata?.role !== 'admin') {
    redirect('/contact-lists')
  }

  return <>{children}</>
}
