'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import Link from 'next/link'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'

export function Header():JSX.Element {
  const router = useRouter();
  
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    const email = localStorage.getItem('email');

    if (email) {
      setEmail(email);
    }
  }, [email]);

  return (
    <>
      <header className="relative z-10 flex  items-center justify-between lg:pt-11 px-32">
        <Link href="/">
          <Container className="flex flex-wrap w-56 items-center justify-evenly sm:justify-between lg:flex-nowrap cursor-pointer">
            <div className="flex items-center mt-10 lg:mt-0 lg:grow lg:basis-0">
              <Logo className="h-12 w-auto text-slate-900" />
              <p className="-ml-40 text-xl font-bold text-gray-600">Contact<span className="text-[#1277e9] font-extrabold text-2xl">Ref</span></p>
            </div>
          </Container>
        </Link>
        {email && <div className="h-14 flex items-center">
          <p className="mr-6 text-base underline font-bold">{email}</p>
          <button
            type="button"
            className="p-3 inline-flex rounded-md bg-[#1277e9] text-gray-100 font-bold hover:text-[#94c3fa] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              localStorage.removeItem("email");
              router.push("/");
            }}
          >
            Logout
            <span className="sr-only">Close</span>
            <ArrowRightOnRectangleIcon className="ml-2 h-5 w-5 mt-[2px]" aria-hidden="true" />
          </button>
        </div>}
      </header>
    </>
  )
}
