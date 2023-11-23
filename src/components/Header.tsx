import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

export function Header():JSX.Element {
  return (
    <header className="relative z-50 flex-none lg:pt-11">
      <Link href="/">
        <Container className="flex flex-wrap items-center justify-center sm:justify-between lg:flex-nowrap cursor-pointer">
          <div className="flex items-center mt-10 lg:mt-0 lg:grow lg:basis-0">
            <Logo className="h-12 w-auto text-slate-900" />
            <p className="-ml-40 text-xl font-bold text-gray-600">Contact<span className="text-[#1277e9] font-extrabold text-2xl">Ref</span></p>
          </div>
        </Container>
      </Link>
    </header>
  )
}
