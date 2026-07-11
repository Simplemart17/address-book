import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export default function Card({
  children,
  className,
  padding = true,
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-edge bg-surface shadow-card inset-shadow-highlight',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}
