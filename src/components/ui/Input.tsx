'use client'

import clsx from 'clsx'
import { forwardRef, useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, type, ...props }, ref) => {
    const inputId = id || props.name
    const isPassword = type === 'password'
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-fg-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={clsx(
              'block w-full rounded-lg border bg-black/25 px-3 py-2 text-sm text-fg transition-colors placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-danger/50 focus:border-danger focus:ring-danger/20'
                : 'border-edge-strong focus:border-primary-bright/60 focus:ring-primary-bright/20',
              icon && 'pl-9',
              isPassword && 'pr-10',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle transition-colors hover:text-fg-muted"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="size-5" />
              ) : (
                <EyeIcon className="size-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
