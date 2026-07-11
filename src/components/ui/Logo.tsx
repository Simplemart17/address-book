import clsx from 'clsx'
import LogoMark from './LogoMark'

interface LogoProps {
  size?: 'sm' | 'md'
  withWordmark?: boolean
}

export default function Logo({ size = 'sm', withWordmark = true }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark
        className={clsx(
          'shrink-0 drop-shadow-[0_0_12px_rgba(124,58,237,0.45)]',
          size === 'sm' ? 'size-8' : 'size-10',
        )}
      />
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
