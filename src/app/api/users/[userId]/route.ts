import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/config/supabase.config'
import { supabaseAdmin } from '@/config/supabase.server'
import {
  getUserFromAuth,
  requireAdmin,
  forbiddenResponse,
  unauthorizedResponse,
  errorResponse,
  successResponse,
} from '@/lib/auth'
import { updateUserSchema } from '@/lib/validations'

type RouteParams = { params: Promise<{ userId: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return unauthorizedResponse(authError!)

  const { userId } = await params

  // Users can only view their own profile; admins can view any
  if (user.id !== userId) {
    const { data: adminRecord } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!adminRecord) {
      return errorResponse('Forbidden', 403)
    }
  }

  const { data, error } = await supabase
    .from('contact_users')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return errorResponse('Something went wrong')

  return successResponse({ data })
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, error: authError } = await requireAdmin(request)
  if (!user) {
    if (authError === 'Forbidden: admin access required')
      return forbiddenResponse()
    return unauthorizedResponse(authError!)
  }

  const { userId } = await params

  const { data: currentUser, error: fetchError } = await supabase
    .from('contact_users')
    .select('status')
    .eq('user_id', userId)
    .single()

  if (fetchError) return errorResponse('Something went wrong')

  const { data, error } = await supabase
    .from('contact_users')
    .update({ status: !currentUser.status })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return errorResponse('Something went wrong')

  return successResponse({ data })
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return unauthorizedResponse(authError!)

  const { userId } = await params

  // Only the user themselves can update their profile
  if (user.id !== userId) {
    return errorResponse('Forbidden', 403)
  }

  const body = await request.json()
  const result = updateUserSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.issues[0].message },
      { status: 400 },
    )
  }

  const updateData: Record<string, unknown> = {}
  if (result.data.full_name) updateData.full_name = result.data.full_name

  if (Object.keys(updateData).length === 0) {
    return errorResponse('No valid fields to update', 400)
  }

  const { data, error } = await supabase
    .from('contact_users')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return errorResponse(error.message, 400)

  return successResponse({ data })
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, error: authError } = await requireAdmin(request)
  if (!user) {
    if (authError === 'Forbidden: admin access required')
      return forbiddenResponse()
    return unauthorizedResponse(authError!)
  }

  const { userId } = await params

  // Use admin client for auth user deletion
  if (supabaseAdmin) {
    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authDeleteError) return errorResponse('Something went wrong')
  } else {
    return errorResponse('Admin operations not configured', 500)
  }

  const { error } = await supabase
    .from('contact_users')
    .delete()
    .eq('user_id', userId)

  if (error) return errorResponse('Something went wrong')

  return successResponse({ message: 'Deleted successfully' })
}
