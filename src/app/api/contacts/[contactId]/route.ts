import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/config/supabase.config'
import {
  getUserFromAuth,
  unauthorizedResponse,
  errorResponse,
  successResponse,
} from '@/lib/auth'
import { updateContactSchema } from '@/lib/validations'

type RouteParams = { params: Promise<{ contactId: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return unauthorizedResponse(authError!)

  const { contactId } = await params

  if (!contactId) return errorResponse('Contact ID is required', 400)

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', contactId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return errorResponse('Contact not found', 404)
    }
    return errorResponse('Failed to fetch contact')
  }

  return successResponse({ data })
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return unauthorizedResponse(authError!)

  const { contactId } = await params

  if (!contactId) return errorResponse('Contact ID is required', 400)

  const body = await request.json()
  const result = updateContactSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.issues[0].message },
      { status: 400 },
    )
  }

  const updateData: Record<string, unknown> = {}
  if (result.data.email) updateData.email = result.data.email
  if (result.data.fullName) updateData.full_name = result.data.fullName
  if (result.data.address) updateData.address = result.data.address
  if (result.data.phone) updateData.phone = result.data.phone
  if (result.data.type) updateData.type = result.data.type
  if (result.data.url !== undefined) updateData.url = result.data.url

  const { data, error } = await supabase
    .from('contacts')
    .update(updateData)
    .eq('id', contactId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return errorResponse('Phone number already exists', 400)
    }
    if (error.code === 'PGRST116') {
      return errorResponse('Contact not found', 404)
    }
    return errorResponse('Failed to update contact')
  }

  return successResponse({ message: 'Contact updated successfully', data })
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return unauthorizedResponse(authError!)

  const { contactId } = await params

  if (!contactId) return errorResponse('Contact ID is required', 400)

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId)
    .eq('user_id', user.id)

  if (error) return errorResponse('Failed to delete contact')

  return successResponse({ message: 'Contact deleted successfully' })
}
