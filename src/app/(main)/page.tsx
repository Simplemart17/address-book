import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import HeroCards from '@/components/landing/HeroCards'

export default async function Home() {
  const { userId } = await auth()
  if (userId) redirect('/contact-lists')

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 page-glow" aria-hidden />
      <div className="pointer-events-none fixed inset-0 dot-grid" aria-hidden />

      <header className="relative px-4">
        <nav className="mx-auto mt-6 flex max-w-5xl items-center justify-between rounded-2xl border border-edge bg-surface/60 px-5 py-3 backdrop-blur-xl">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" href="/sign-in">
              Sign in
            </Button>
            <Button href="/sign-up">Get started</Button>
          </div>
        </nav>
      </header>

      <main className="relative px-4">
        <section className="mx-auto max-w-3xl pb-16 pt-24 text-center">
          <p className="mx-auto w-fit rounded-full border border-edge bg-white/4 px-3 py-1 text-xs text-fg-muted">
            Your network, organized
          </p>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
            Every contact, exactly{' '}
            <span className="text-gradient">where you left them</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-fg-muted">
            ContactRef keeps the people in your life one search away — names,
            numbers, and addresses in a single quiet place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/sign-up" size="lg">
              Start free
            </Button>
            <Button href="/sign-in" variant="secondary" size="lg">
              Sign in
            </Button>
          </div>
        </section>

        <section className="animate-fade-up relative pb-24">
          <HeroCards />
        </section>
      </main>

      <footer className="relative border-t border-edge px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-2 text-xs text-fg-subtle sm:flex-row sm:items-center">
          <p>ContactRef — the effective way to manage your contacts.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-fg-muted">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-fg-muted">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
