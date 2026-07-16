import Link from 'next/link'

import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  intro: string
  children: React.ReactNode
}

export default function LegalLayout({
  title,
  lastUpdated,
  intro,
  children,
}: LegalLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 page-glow" aria-hidden />
      <div className="pointer-events-none fixed inset-0 dot-grid" aria-hidden />

      <header className="relative px-4">
        <nav className="mx-auto mt-6 flex max-w-3xl items-center justify-between rounded-2xl border border-edge bg-surface/60 px-5 py-3 backdrop-blur-xl">
          <Link href="/" aria-label="ContactRef home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" href="/sign-in">
              Sign in
            </Button>
            <Button href="/sign-up">Get started</Button>
          </div>
        </nav>
      </header>

      <main className="relative px-4">
        <article className="mx-auto max-w-3xl pb-20 pt-16">
          <header className="border-b border-edge pb-8">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-xs text-fg-subtle">
              Last updated: {lastUpdated}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">{intro}</p>
          </header>

          <div className="mt-4 space-y-5 text-fg-muted [&_a]:text-primary-bright [&_a]:underline [&_a]:decoration-primary/40 [&_a]:underline-offset-2 hover:[&_a]:text-primary-bright hover:[&_a]:decoration-primary [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-fg [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-fg [&_li]:pl-1.5 [&_li]:leading-relaxed [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-fg [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-fg-subtle">
            {children}
          </div>
        </article>
      </main>

      <footer className="relative border-t border-edge px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-2 text-xs text-fg-subtle sm:flex-row sm:items-center">
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
