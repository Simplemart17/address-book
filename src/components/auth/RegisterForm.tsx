'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { usersApi } from '@/config/v3Api.config'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError('')
    setSuccess('')

    try {
      await usersApi.create({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      })

      setSuccess(
        'Account created! Please check your email to verify your account before signing in.',
      )
      reset()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setError(
          axiosErr.response?.data?.message || 'Registration failed. Please try again.',
        )
      } else {
        setError('Registration failed. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <Input
        label="Full name"
        type="text"
        placeholder="John Doe"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm password"
        type="password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
        size="lg"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-violet-600 hover:text-violet-500"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
