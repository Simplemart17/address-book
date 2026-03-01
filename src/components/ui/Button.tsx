import clsx from 'clsx'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
  className?: string
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never
  }

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, keyof ButtonBaseProps> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-500 shadow-sm',
  secondary:
    'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:ring-violet-500 shadow-sm',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 shadow-sm',
  ghost:
    'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-violet-500',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    className,
  )

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLink
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  const { disabled, ...restButtonProps } = props as ButtonAsButton
  return (
    <button
      className={classes}
      disabled={loading || disabled}
      aria-busy={loading}
      {...restButtonProps}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
