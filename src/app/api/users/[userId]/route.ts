import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import {
  requireAdmin,
  forbiddenResponse,
  unauthorizedResponse,
  errorResponse,
  successResponse,
} from '@/lib/auth'
import { mapClerkUser } from '@/lib/clerk-users'
import {
  CONTACT_IMAGES_BUCKET,
  createAdminSupabaseClient,
} from '@/lib/supabase'
import { updateUserSchema } from '@/lib/validations'

type RouteParams = { params: Promise<{ userId: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { userId: currentUserId, sessionClaims } = await auth()
  if (!currentUserId) return unauthorizedResponse()

  const { userId } = await params

  // Users can only view their own profile; admins can view any
  const isAdmin = sessionClaims?.metadata?.role === 'admin'
  if (currentUserId !== userId && !isAdmin) {
    return errorResponse('Forbidden', 403)
  }

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return successResponse({ data: mapClerkUser(user) })
  } catch {
    return errorResponse('Something went wrong')
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { userId: adminId, error: authError } = await requireAdmin()
  if (!adminId) {
    if (authError === 'Forbidden: admin access required')
      return forbiddenResponse()
    return unauthorizedResponse(authError!)
  }

  const { userId } = await params

  if (userId === adminId) {
    return errorResponse('You cannot deactivate your own account', 400)
  }

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    const updated = user.banned
      ? await client.users.unbanUser(userId)
      : await client.users.banUser(userId)

    return successResponse({ data: mapClerkUser(updated) })
  } catch {
    return errorResponse('Something went wrong')
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId: currentUserId, sessionClaims } = await auth()
  if (!currentUserId) return unauthorizedResponse()

  const { userId } = await params

  // Users can update their own profile; admins can update any
  const isAdmin = sessionClaims?.metadata?.role === 'admin'
  if (currentUserId !== userId && !isAdmin) {
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

  if (!result.data.full_name) {
    return errorResponse('No valid fields to update', 400)
  }

  const [firstName, ...rest] = result.data.full_name.trim().split(/\s+/)
  const lastName = rest.join(' ')

  try {
    const client = await clerkClient()
    const updated = await client.users.updateUser(userId, {
      firstName,
      lastName,
    })
    return successResponse({ data: mapClerkUser(updated) })
  } catch {
    return errorResponse('Failed to update user', 400)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { userId: adminId, error: authError } = await requireAdmin()
  if (!adminId) {
    if (authError === 'Forbidden: admin access required')
      return forbiddenResponse()
    return unauthorizedResponse(authError!)
  }

  const { userId } = await params

  if (userId === adminId) {
    return errorResponse('You cannot delete your own account', 400)
  }

  try {
    const client = await clerkClient()
    await client.users.deleteUser(userId)
  } catch {
    return errorResponse('Something went wrong')
  }

  // Clerk deletion doesn't cascade to Supabase — clean up the user's
  // contacts and uploaded images with the secret-key client.
  try {
    const admin = createAdminSupabaseClient()
    await admin.from('contacts').delete().eq('user_id', userId)

    const { data: files } = await admin.storage
      .from(CONTACT_IMAGES_BUCKET)
      .list(userId)
    if (files?.length) {
      await admin.storage
        .from(CONTACT_IMAGES_BUCKET)
        .remove(files.map((file) => `${userId}/${file.name}`))
    }
  } catch (error) {
    console.error('Failed to clean up deleted user data:', error)
  }

  return successResponse({ message: 'Deleted successfully' })
}
