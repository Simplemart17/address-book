'use client'

import { useEffect, useState, useCallback } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { contactsApi } from '@/lib/api'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ContactCard from './ContactCard'
import ContactForm from './ContactForm'
import SlideOver from '@/components/ui/SlideOver'
import ConfirmModal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastProvider'
import type { Contact } from '@/types/database'

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-edge bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-white/6" />
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-white/6" />
          <div className="h-4 w-16 rounded-full bg-white/6" />
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        <div className="h-3 w-4/5 rounded bg-white/6" />
        <div className="h-3 w-3/5 rounded bg-white/6" />
        <div className="h-3 w-2/3 rounded bg-white/6" />
      </div>
    </div>
  )
}

export default function ContactGrid() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filtered, setFiltered] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { toast } = useToast()

  const fetchContacts = useCallback(async () => {
    try {
      const response = await contactsApi.getAll()
      setContacts(response.data as Contact[])
      setFiltered(response.data as Contact[])
    } catch {
      toast('Failed to fetch contacts', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(contacts)
    } else {
      const q = search.toLowerCase()
      setFiltered(
        contacts.filter(
          (c) =>
            c.full_name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.includes(q),
        ),
      )
    }
  }, [search, contacts])

  const handleCreate = () => {
    setEditingContact(null)
    setSlideOverOpen(true)
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setSlideOverOpen(true)
  }

  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingContact) return
    setDeleteLoading(true)

    try {
      await contactsApi.delete(deletingContact.id)
      toast('Contact deleted successfully')
      setDeleteModalOpen(false)
      setDeletingContact(null)
      fetchContacts()
    } catch {
      toast('Failed to delete contact', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleFormSubmit = async (data: {
    fullName: string
    email: string
    phone: string
    address: string
    type: string
    url?: string
  }) => {
    try {
      if (editingContact) {
        await contactsApi.update(editingContact.id, data)
        toast('Contact updated successfully')
      } else {
        await contactsApi.create(data)
        toast('Contact created successfully')
      }

      setSlideOverOpen(false)
      setEditingContact(null)
      fetchContacts()
    } catch {
      toast('Failed to save contact', 'error')
    }
  }

  return (
    <DashboardLayout
      title="Contacts"
      actions={
        <Button onClick={handleCreate} size="sm">
          <PlusIcon className="size-4" />
          Add Contact
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-6 max-w-sm">
        <Input
          type="text"
          name="contact-search"
          placeholder="Search contacts..."
          icon={<MagnifyingGlassIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? 'No contacts found' : 'No contacts yet'}
          description={
            search
              ? 'Try a different search term'
              : 'Create your first contact to get started'
          }
          actionLabel={!search ? 'Add Contact' : undefined}
          onAction={!search ? handleCreate : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((contact, i) => (
            <div
              key={contact.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 11) * 40}ms` }}
            >
              <ContactCard
                contact={contact}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Slide-over for create/edit */}
      <SlideOver
        open={slideOverOpen}
        onClose={() => {
          setSlideOverOpen(false)
          setEditingContact(null)
        }}
        title={editingContact ? 'Edit Contact' : 'New Contact'}
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setSlideOverOpen(false)
            setEditingContact(null)
          }}
        />
      </SlideOver>

      {/* Delete confirmation */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeletingContact(null)
        }}
        title="Delete Contact"
        message={`Are you sure you want to delete ${deletingContact?.full_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteLoading}
        variant="danger"
      />
    </DashboardLayout>
  )
}
