import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function requireUser() {
  const { userId } = await auth()
  return userId
}

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return { userId: null, error: 'Authentication required' }

  if (sessionClaims?.metadata?.role !== 'admin') {
    return { userId: null, error: 'Forbidden: admin access required' }
  }

  return { userId, error: null }
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
