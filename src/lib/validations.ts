import { z } from 'zod'

export const contactTypeEnum = z.enum(['Friend', 'Colleague', 'Mate'])

export const createContactSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  type: contactTypeEnum,
  url: z.string().url().nullable().optional(),
})

export const updateContactSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  fullName: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  type: contactTypeEnum.optional(),
  url: z.string().url().nullable().optional(),
})

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const updateUserSchema = z.object({
  full_name: z.string().min(1).optional(),
})
