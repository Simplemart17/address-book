import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/config/supabase.config'

export async function getUserFromAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Authentication required' }
  }

  const token = authHeader.replace('Bearer ', '')

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return { user: null, error: 'Invalid or expired token' }
  }

  return { user, error: null }
}

export async function requireAdmin(request: NextRequest) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return { user: null, error: authError }

  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminRecord) {
    return { user: null, error: 'Forbidden: admin access required' }
  }

  return { user, error: null }
}

export function forbiddenResponse(
  message = 'Forbidden: admin access required',
) {
  return NextResponse.json({ success: false, message }, { status: 403 })
}

export function unauthorizedResponse(message = 'Authentication required') {
  return NextResponse.json({ success: false, message }, { status: 401 })
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status })
}

export function successResponse(
  data: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json({ success: true, ...data }, { status })
}
