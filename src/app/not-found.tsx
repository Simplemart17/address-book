import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <p className="text-sm font-semibold text-violet-600">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 font-display sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-base text-slate-500">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
      >
        Go back home
      </Link>
    </div>
  )
}
