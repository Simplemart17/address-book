import clsx from 'clsx'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'violet'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/5 text-fg-muted ring-1 ring-inset ring-white/10',
  success: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/25',
  warning: 'bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/25',
  danger: 'bg-rose-400/10 text-rose-300 ring-1 ring-inset ring-rose-400/25',
  violet: 'bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/25',
}

export default function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
