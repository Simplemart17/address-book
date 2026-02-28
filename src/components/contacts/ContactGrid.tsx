'use client'

import { useEffect, useState, useCallback } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { contactsApi } from '@/config/v3Api.config'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ContactCard from './ContactCard'
import ContactForm from './ContactForm'
import SlideOver from '@/components/ui/SlideOver'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import type { Contact } from '@/config/supabase.config'

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

  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' as 'success' | 'error' })

  const fetchContacts = useCallback(async () => {
    try {
      const response = await contactsApi.getAll()
      setContacts(response.data)
      setFiltered(response.data)
    } catch {
      showToast('Failed to fetch contacts', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

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

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, variant })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

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
      showToast('Contact deleted successfully')
      setDeleteModalOpen(false)
      setDeletingContact(null)
      fetchContacts()
    } catch {
      showToast('Failed to delete contact', 'error')
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
        showToast('Contact updated successfully')
      } else {
        await contactsApi.create(data)
        showToast('Contact created successfully')
      }

      setSlideOverOpen(false)
      setEditingContact(null)
      fetchContacts()
    } catch {
      showToast('Failed to save contact', 'error')
    }
  }

  return (
    <DashboardLayout
      title="Contacts"
      actions={
        <Button onClick={handleCreate} size="sm">
          <PlusIcon className="h-4 w-4" />
          Add Contact
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
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
          {filtered.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
      <Modal
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

      {/* Toast */}
      <Toast
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        message={toast.message}
        variant={toast.variant}
      />
    </DashboardLayout>
  )
}
