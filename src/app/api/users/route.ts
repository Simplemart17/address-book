import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/config/supabase.config'
import { supabaseAdmin } from '@/config/supabase.server'
import {
  requireAdmin,
  forbiddenResponse,
  unauthorizedResponse,
  errorResponse,
  successResponse,
} from '@/lib/auth'
import { createUserSchema } from '@/lib/validations'
import { sendVerificationEmail } from '@/lib/mailer'
import { validateEmail, normalizeEmail } from '@/utils/email'

export async function GET(request: NextRequest) {
  const { user, error: authError } = await requireAdmin(request)
  if (!user) {
    if (authError === 'Forbidden: admin access required')
      return forbiddenResponse()
    return unauthorizedResponse(authError!)
  }

  const { data, error } = await supabase.from('contact_users').select('*')

  if (error) return errorResponse('Something went wrong')

  return successResponse({ data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = createUserSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.issues[0].message },
      { status: 400 },
    )
  }

  const { email, fullName, password } = result.data

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    return errorResponse(emailValidation.message!, 400)
  }

  const normalizedEmail = normalizeEmail(email)

  const { data: signUpData, error: signUpError } =
    await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    })

  if (signUpError) {
    return errorResponse(signUpError.message, 400)
  }

  const userId = signUpData.user?.id

  if (!userId) {
    return errorResponse('Failed to create user account')
  }

  const dbClient = supabaseAdmin || supabase
  const { error: insertError } = await dbClient.from('contact_users').insert({
    user_id: userId,
    email: normalizedEmail,
    full_name: fullName,
    password: 'managed-by-supabase',
    verified: false,
    status: true,
    user_type: 'user',
  })

  if (insertError) {
    return errorResponse(insertError.message, 400)
  }

  await sendVerificationEmail(normalizedEmail, userId, fullName)

  return successResponse({ data: signUpData }, 201)
}
