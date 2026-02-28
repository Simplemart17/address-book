import { NextRequest } from 'next/server'
import { supabase } from '@/config/supabase.config'
import { supabaseAdmin } from '@/config/supabase.server'
import { errorResponse, successResponse } from '@/lib/auth'

type RouteParams = { params: Promise<{ verificationId: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { verificationId } = await params

  if (!verificationId) {
    return errorResponse('Invalid verification ID', 400)
  }

  const dbClient = supabaseAdmin || supabase
  const { data: user, error: fetchError } = await dbClient
    .from('contact_users')
    .select('*')
    .eq('user_id', verificationId)
    .single()

  if (fetchError || !user) {
    return errorResponse('User not found', 404)
  }

  if (user.verified) {
    return successResponse({
      message: 'User is already verified',
      data: { user, alreadyVerified: true },
    })
  }

  const { data: updatedUser, error: updateError } = await dbClient
    .from('contact_users')
    .update({ verified: true })
    .eq('user_id', verificationId)
    .select()
    .single()

  if (updateError) {
    return errorResponse('Failed to update verification status')
  }

  return successResponse({
    message: 'Email verified successfully',
    data: { user: updatedUser, alreadyVerified: false },
  })
}
