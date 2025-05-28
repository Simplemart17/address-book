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
        const { userId } = req.query;
  
        const { data: user, error } = await supabase.from('users').select('*').eq('user_id', userId).single();
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong"});
      }
    }
  
    if (req.method === 'PATCH') {
      try {
        const { userId } = req.query;
        const userData = await supabase.from('users').select('status').eq('user_id', userId).single();
        
        const status = !userData?.data?.status;
  
        const { data: user, error } = await supabase.from('users').update({ status }).eq('user_id', userId);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong"});
      }
    }
  
    if (req.method === 'PUT') {
      try {
        const { userId } = req.query;
        const { full_name } = req.body;
  
        const { data: user, error } = await supabase.from('users').update({ full_name }).eq('user_id', userId).select().single();
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong"});
      }
    }
  
    if (req.method === 'DELETE') {
      try {
        const { userId } = req.query;
  
        await supabase.from('users').delete().eq('user_id', userId);
        res.status(200).json({ success: true, message: "Deleted successfully" });
      } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong"});
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong"});
  }

}
