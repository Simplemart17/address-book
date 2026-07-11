import clsx from 'clsx'
import Image from 'next/image'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  name: string
  size?: AvatarSize
  className?: string
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; pixels: number }> = {
  sm: { container: 'h-8 w-8', text: 'text-xs', pixels: 32 },
  md: { container: 'h-10 w-10', text: 'text-sm', pixels: 40 },
  lg: { container: 'h-12 w-12', text: 'text-base', pixels: 48 },
  xl: { container: 'h-16 w-16', text: 'text-lg', pixels: 64 },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const bgColors = [
  'bg-violet-400/15 text-violet-300',
  'bg-emerald-400/15 text-emerald-300',
  'bg-amber-400/15 text-amber-300',
  'bg-rose-400/15 text-rose-300',
  'bg-sky-400/15 text-sky-300',
  'bg-fuchsia-400/15 text-fuchsia-300',
]

function getColorFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return bgColors[Math.abs(hash) % bgColors.length]
}

export default function Avatar({
  src,
  name,
  size = 'md',
  className,
}: AvatarProps) {
  const { container, text, pixels } = sizeStyles[size]

  if (src) {
    return (
      <div
        className={clsx(
          'relative shrink-0 overflow-hidden rounded-full ring-1 ring-white/10',
          container,
          className,
        )}
      >
        <Image
          src={src}
          alt={name}
          width={pixels}
          height={pixels}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full font-medium ring-1 ring-white/10',
        container,
        text,
        getColorFromName(name),
        className,
      )}
    >
      {getInitials(name)}
    </div>
  )
}
