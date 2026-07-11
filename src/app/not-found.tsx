import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none fixed inset-0 page-glow" aria-hidden />
      <div className="pointer-events-none fixed inset-0 dot-grid" aria-hidden />
      <p className="text-gradient font-display text-7xl font-semibold">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-base text-fg-muted">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow-sm inset-shadow-highlight transition-all hover:bg-primary-hover hover:shadow-glow"
      >
        Go back home
      </Link>
    </div>
  )
}
