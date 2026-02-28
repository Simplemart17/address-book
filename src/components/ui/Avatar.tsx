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
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-indigo-100 text-indigo-700',
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
          'relative shrink-0 overflow-hidden rounded-full',
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
        'flex shrink-0 items-center justify-center rounded-full font-medium',
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
