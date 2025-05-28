import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/config/supabase.config'

// Helper function to get user from authorization header
async function getUserFromAuth(req: NextApiRequest) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return null
  }
  
  return user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get authenticated user
    const user = await getUserFromAuth(req)
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      })
    }

    if (req.method === 'GET') {
      try {
        const { data: users, error } = await supabase.from('users').select('*');
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong"});
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong"});
  }

}
