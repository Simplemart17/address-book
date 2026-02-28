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
import type { Contact } from '@/config/supabase.config'

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
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={contact.url} name={contact.full_name} size="lg" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
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
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={`Edit ${contact.full_name}`}
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Delete ${contact.full_name}`}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <EnvelopeIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <PhoneIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPinIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">{contact.address}</span>
        </div>
      </div>
    </div>
  )
}
