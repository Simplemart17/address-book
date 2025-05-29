import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/config/supabase.config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    })
  }

  try {
    const { verificationId } = req.query

    if (!verificationId || typeof verificationId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification ID'
      })
    }

    // Get user by verification ID (which is the user_id)
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', verificationId)
      .single()

    if (getUserError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user is already verified
    if (user.verified) {
      return res.status(200).json({
        success: true,
        message: 'User is already verified',
        data: {
          user,
          alreadyVerified: true
        }
      })
    }

    // Update user verification status
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ verified: true })
      .eq('user_id', verificationId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user verification:', updateError)
      return res.status(500).json({
        success: false,
        message: 'Failed to update verification status'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: updatedUser,
        alreadyVerified: false
      }
    })

  } catch (error) {
    console.error('Verification error:', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during verification'
    })
  }
}
