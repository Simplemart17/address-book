import { FolderOpenIcon } from '@heroicons/react/24/outline'
import Button from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-4 flex size-16 items-center justify-center rounded-2xl border border-edge bg-white/4">
        <div className="absolute -inset-4 -z-10 rounded-full bg-primary/10 blur-2xl" />
        {icon || (
          <FolderOpenIcon className="size-8 text-fg-subtle" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <p className="mt-1 text-sm text-fg-muted">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  )
}
