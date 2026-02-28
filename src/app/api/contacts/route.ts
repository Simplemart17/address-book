import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/config/supabase.config'
import {
  getUserFromAuth,
  unauthorizedResponse,
  errorResponse,
  successResponse,
} from '@/lib/auth'
import { createContactSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return unauthorizedResponse(authError!)

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return errorResponse('Failed to fetch contacts')

  return successResponse({ data })
}

export async function POST(request: NextRequest) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return unauthorizedResponse(authError!)

  const body = await request.json()
  const result = createContactSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.issues[0].message },
      { status: 400 },
    )
  }

  const { email, fullName, address, phone, type, url } = result.data

  const contactData = {
    email,
    full_name: fullName,
    address,
    phone,
    type,
    url: url ?? null,
    user_id: user.id,
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert(contactData)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return errorResponse('Phone number already exists', 400)
    }
    return errorResponse('Failed to create contact')
  }

  return successResponse({ message: 'Contact created successfully', data }, 201)
}
