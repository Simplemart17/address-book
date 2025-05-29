import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/config/supabase.config'
import { sendVerificationEmail } from '@/lib/mailer'
import { normalizeEmail, validateEmail } from '@/utils/email'

// Helper function to get user from authorization header
async function getUserFromAuth(req: NextApiRequest) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return null
  }

  return user
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Get authenticated user
    const user = await getUserFromAuth(req)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (req.method === 'GET') {
      try {
        const { data: users, error } = await supabase.from('users').select('*')
        res.status(200).json({ success: true, data: users })
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: 'Something went wrong' })
      }
    }

    if (req.method === 'POST') {
      try {
        const { email, fullName, password } = req.body

        // Validate email format and check for + aliases in production
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
          return res.status(400).json({
            success: false,
            message: emailValidation.message
          });
        }

        // Normalize email (remove + aliases in production)
        const normalizedEmail = normalizeEmail(email);

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: 'user',
            },
          },
        })

        if (error) {
          return res.status(400).json({ success: false, message: error.message });
        }

        const supabaseUser = data.user

        // save data into users table
        const { error: insertError } = await supabase.from('users').insert({
          user_id: supabaseUser?.id,
          email: normalizedEmail, // Use normalized email
          full_name: supabaseUser?.user_metadata.full_name,
          password: 'managed-by-supabase',
          verified: false,
          status: true,
          user_type: 'user',
        })

        if (insertError) {
          return res.status(400).json({ success: false, message: insertError.message });
        }

        const result = await sendVerificationEmail(
          normalizedEmail, // Send verification to normalized email
          supabaseUser?.id as string,
          fullName,
        )

        res.status(201).json({ success: true, data: data })
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: 'Something went wrong' })
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
