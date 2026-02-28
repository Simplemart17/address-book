'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { uploadApi } from '@/config/v3Api.config'
import type { Contact } from '@/config/supabase.config'

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
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setError(axiosErr.response?.data?.message || 'Something went wrong')
      } else {
        setError('Something went wrong')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
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
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Photo (optional)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-violet-700 hover:file:bg-violet-100"
        />
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
