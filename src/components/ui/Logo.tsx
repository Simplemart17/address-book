import clsx from 'clsx'

interface LogoProps {
  size?: 'sm' | 'md'
  withWordmark?: boolean
}

export default function Logo({ size = 'sm', withWordmark = true }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={clsx(
          'flex items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent-2 font-display font-semibold text-white shadow-glow-sm',
          size === 'sm' ? 'size-8 text-sm' : 'size-10 text-base',
        )}
      >
        C
      </span>
      {withWordmark && (
        <span
          className={clsx(
            'font-display font-semibold tracking-tight text-fg',
            size === 'sm' ? 'text-lg' : 'text-xl',
          )}
        >
          ContactRef
        </span>
      )}
    </span>
  )
}
