'use client'

import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

export default function Home() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-violet-600 lg:px-12">
        <div className="max-w-md">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white font-display">
            ContactRef
          </h1>
          <p className="mt-4 text-lg text-violet-100">
            The effective way to manage your contacts. Keep your network
            organized and accessible from anywhere.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 font-display">
              ContactRef
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-display">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {mode === 'login'
              ? 'Sign in to access your contacts'
              : 'Get started with your free account'}
          </p>

          <div className="mt-8">
            {mode === 'login' ? (
              <LoginForm onSwitchToRegister={() => setMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
