import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export const metadata = { title: 'Create your account' }

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none fixed inset-0 page-glow" aria-hidden />
      <div className="pointer-events-none fixed inset-0 dot-grid" aria-hidden />
      <Link href="/" className="relative mb-8 rounded-lg">
        <Logo size="md" />
      </Link>
      <div className="relative">
        <SignUp />
      </div>
    </div>
  )
}
