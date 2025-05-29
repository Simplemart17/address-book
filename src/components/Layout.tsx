import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/contexts/AuthContext'

export function Layout({
  children,
  showFooter = true,
}: {
  children: React.ReactNode
  showFooter?: boolean
}) {
  return (
    <>
      <Header />
      <main className="flex-auto">
        <AuthProvider>
          {children}
        </AuthProvider>
      </main>
      {/* <Footer /> */}
      {showFooter && <Footer />}
    </>
  )
}
