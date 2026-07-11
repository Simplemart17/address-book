'use client'

import ContactCard from '@/components/contacts/ContactCard'
import type { Contact } from '@/types/database'

const sampleContacts: Contact[] = [
  {
    id: 'sample-1',
    created_at: '',
    updated_at: '',
    full_name: 'Amara Okafor',
    email: 'amara@studioline.co',
    phone: '+1 (415) 555-0134',
    address: 'Hayes Valley, San Francisco',
    type: 'Colleague',
    url: null,
    user_id: 'sample',
  },
  {
    id: 'sample-2',
    created_at: '',
    updated_at: '',
    full_name: 'Jonah Reyes',
    email: 'jonah.reyes@fastmail.com',
    phone: '+1 (312) 555-0198',
    address: 'Logan Square, Chicago',
    type: 'Friend',
    url: null,
    user_id: 'sample',
  },
  {
    id: 'sample-3',
    created_at: '',
    updated_at: '',
    full_name: 'Priya Natarajan',
    email: 'priya.n@northloop.dev',
    phone: '+44 20 7946 0871',
    address: 'Shoreditch, London',
    type: 'Mate',
    url: null,
    user_id: 'sample',
  },
]

const noop = () => {}

export default function HeroCards() {
  return (
    <div
      className="pointer-events-none mx-auto flex max-w-4xl select-none items-center justify-center gap-6"
      aria-hidden
    >
      <div
        className="hidden w-72 shrink-0 -rotate-3 scale-95 opacity-60 sm:block"
        style={{ animationDelay: '100ms' }}
      >
        <ContactCard contact={sampleContacts[0]} onEdit={noop} onDelete={noop} />
      </div>
      <div className="animate-fade-up z-10 w-80 shrink-0 shadow-glow-card">
        <ContactCard contact={sampleContacts[1]} onEdit={noop} onDelete={noop} />
      </div>
      <div
        className="hidden w-72 shrink-0 rotate-3 scale-95 opacity-60 sm:block"
        style={{ animationDelay: '200ms' }}
      >
        <ContactCard contact={sampleContacts[2]} onEdit={noop} onDelete={noop} />
      </div>
    </div>
  )
}
