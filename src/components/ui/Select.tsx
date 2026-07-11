'use client'

import clsx from 'clsx'
import { forwardRef } from 'react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || props.name

    return (
      <div>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-fg-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'block w-full appearance-none rounded-lg border bg-black/25 px-3 py-2 pr-9 text-sm text-fg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-danger/50 focus:border-danger focus:ring-danger/20'
                : 'border-edge-strong focus:border-primary-bright/60 focus:ring-primary-bright/20',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronUpDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'

export default Select
