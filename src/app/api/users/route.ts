import { clerkClient } from '@clerk/nextjs/server'
import {
  requireAdmin,
  forbiddenResponse,
  unauthorizedResponse,
  errorResponse,
  successResponse,
} from '@/lib/auth'
import { mapClerkUser } from '@/lib/clerk-users'

export async function GET() {
  const { userId, error: authError } = await requireAdmin()
  if (!userId) {
    if (authError === 'Forbidden: admin access required')
      return forbiddenResponse()
    return unauthorizedResponse(authError!)
  }

  try {
    const client = await clerkClient()
    const { data } = await client.users.getUserList({
      limit: 100,
      orderBy: '-created_at',
    })

    return successResponse({ data: data.map(mapClerkUser) })
  } catch (error) {
    console.error('Failed to list users:', error)
    return errorResponse('Failed to fetch users')
  }
}
