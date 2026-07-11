'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { uploadApi } from '@/lib/api'
import type { Contact } from '@/types/database'

const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  type: z.enum(['Friend', 'Colleague', 'Mate'], {
    message: 'Select a contact type',
  }),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  contact?: Contact | null
  onSubmit: (data: ContactFormData & { url?: string }) => Promise<void>
  onCancel: () => void
}

const typeOptions = [
  { value: 'Friend', label: 'Friend' },
  { value: 'Colleague', label: 'Colleague' },
  { value: 'Mate', label: 'Mate' },
]

export default function ContactForm({
  contact,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact
      ? {
          fullName: contact.full_name,
          email: contact.email,
          phone: contact.phone,
          address: contact.address,
          type: contact.type as ContactFormData['type'],
        }
      : { type: 'Friend' },
  })

  useEffect(() => {
    if (contact) {
      reset({
        fullName: contact.full_name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address,
        type: contact.type as ContactFormData['type'],
      })
    } else {
      reset({ type: 'Friend' })
    }
  }, [contact, reset])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImageFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const handleFormSubmit = async (data: ContactFormData) => {
    setError('')
    try {
      let url: string | undefined

      if (imageFile) {
        setUploading(true)
        const uploadResult = await uploadApi.uploadImage(imageFile)
        url = uploadResult.url
        setUploading(false)
      }

      await onSubmit({ ...data, url })
    } catch (err: unknown) {
      setUploading(false)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <Input
        label="Full name"
        placeholder="Enter full name"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="contact@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone"
        type="tel"
        placeholder="Enter phone number"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Address"
        placeholder="Enter address"
        error={errors.address?.message}
        {...register('address')}
      />

      <Select
        label="Type"
        options={typeOptions}
        error={errors.type?.message}
        {...register('type')}
      />

      <div>
        <span className="mb-1.5 block text-sm font-medium text-fg-muted">
          Photo (optional)
        </span>
        {imageFile && previewUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-edge bg-white/3 px-4 py-3">
            <Image
              src={previewUrl}
              alt="Selected photo preview"
              width={40}
              height={40}
              unoptimized
              className="size-10 rounded-full object-cover ring-1 ring-white/10"
            />
            <span className="flex-1 truncate text-sm text-fg">
              {imageFile.name}
            </span>
            <button
              type="button"
              onClick={() => handleFileChange(null)}
              className="rounded-lg p-1.5 text-fg-subtle transition-colors hover:bg-white/10 hover:text-fg"
              aria-label="Remove selected photo"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="contact-photo"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-edge-strong bg-white/3 px-6 py-8 text-center transition-colors hover:border-primary-bright/50 hover:bg-primary/5"
          >
            <PhotoIcon className="size-8 text-fg-subtle" aria-hidden="true" />
            <span className="text-sm text-fg-muted">
              Click to upload a photo
            </span>
            <span className="text-xs text-fg-subtle">
              JPEG, PNG, GIF or WebP
            </span>
            <input
              id="contact-photo"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="sr-only"
            />
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          loading={isSubmitting || uploading}
          className="flex-1"
        >
          {contact ? 'Update' : 'Create'} Contact
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
