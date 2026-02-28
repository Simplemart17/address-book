'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Spinner from '@/components/ui/Spinner'

interface VerificationState {
  loading: boolean
  message: string
  messageType: 'success' | 'error' | 'info' | 'loading'
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Spinner size="lg" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}

function VerifyContent() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<VerificationState>({
    loading: true,
    message: '',
    messageType: 'loading',
  })

  useEffect(() => {
    const verifyUser = async () => {
      const verificationId = searchParams?.get('verificationId')

      if (!verificationId) {
        setState({
          loading: false,
          message: 'Invalid verification link. No verification ID found.',
          messageType: 'error',
        })
        return
      }

      try {
        const response = await fetch(`/api/verify/${verificationId}`)
        const result = await response.json()

        if (!result.success) {
          setState({
            loading: false,
            message:
              result.message || 'Invalid verification link. User not found.',
            messageType: 'error',
          })
          return
        }

        const { alreadyVerified } = result.data

        setState({
          loading: false,
          message: alreadyVerified
            ? 'Your email is already verified. You can sign in to your account.'
            : 'Email verified successfully! You can now sign in.',
          messageType: alreadyVerified ? 'info' : 'success',
        })
      } catch {
        setState({
          loading: false,
          message:
            'Something went wrong during verification. Please try again later.',
          messageType: 'error',
        })
      }
    }

    verifyUser()
  }, [searchParams])

  const iconColors = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-rose-100 text-rose-600',
    info: 'bg-violet-100 text-violet-600',
    loading: '',
  }

  const icons = {
    success: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    info: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    loading: null,
  }

  const titles = {
    success: 'Email Verified!',
    error: 'Verification Failed',
    info: 'Already Verified',
    loading: 'Verifying...',
  }

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-slate-500">
            Verifying your email...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${iconColors[state.messageType]}`}
        >
          {icons[state.messageType]}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">
          {titles[state.messageType]}
        </h1>
        <p className="mt-3 text-sm text-slate-500">{state.message}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  )
}
