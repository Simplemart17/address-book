'use client'

import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import type { Contact } from '@/types/database'

interface ContactCardProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

const typeBadgeVariant: Record<string, 'violet' | 'success' | 'warning'> = {
  Friend: 'violet',
  Colleague: 'success',
  Mate: 'warning',
}

export default function ContactCard({
  contact,
  onEdit,
  onDelete,
}: ContactCardProps) {
  return (
    <div className="group relative rounded-2xl border border-edge bg-surface p-5 shadow-card inset-shadow-highlight transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-glow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={contact.url} name={contact.full_name} size="lg" />
          <div>
            <h3 className="text-sm font-semibold text-fg">
              {contact.full_name}
            </h3>
            <Badge variant={typeBadgeVariant[contact.type] || 'default'}>
              {contact.type}
            </Badge>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            onClick={() => onEdit(contact)}
            className="rounded-lg p-1.5 text-fg-subtle transition-colors hover:bg-white/10 hover:text-fg"
            aria-label={`Edit ${contact.full_name}`}
          >
            <PencilSquareIcon className="size-4" />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="rounded-lg p-1.5 text-fg-subtle transition-colors hover:bg-danger/15 hover:text-danger"
            aria-label={`Delete ${contact.full_name}`}
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <EnvelopeIcon className="size-4 shrink-0 text-fg-subtle" />
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <PhoneIcon className="size-4 shrink-0 text-fg-subtle" />
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <MapPinIcon className="size-4 shrink-0 text-fg-subtle" />
          <span className="truncate">{contact.address}</span>
        </div>
      </div>
    </div>
  )
}
