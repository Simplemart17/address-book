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

    switch (req.method) {
      case 'GET':
        try {
          const { data: contacts, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            throw error
          }

          res.status(200).json({ 
            success: true, 
            data: contacts 
          })
        } catch (error: any) {
          console.error('Get contacts error:', error)
          res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch contacts' 
          })
        }
        break

      case 'POST':
        try {
          const { email, fullName, address, phone, type, url } = req.body

          if (!email || !fullName || !address || !phone || !type) {
            return res.status(400).json({ 
              success: false, 
              message: 'All required fields must be provided' 
            })
          }

          const contactData = {
            email,
            full_name: fullName,
            address,
            phone,
            type,
            url: url || null,
            user_id: user.id
          }

          const { data: contact, error } = await supabase
            .from('contacts')
            .insert(contactData)
            .select()
            .single()

          if (error) {
            if (error.code === '23505') {
              return res.status(400).json({ 
                success: false, 
                message: 'Phone number already exists' 
              })
            }
            throw error
          }

          res.status(201).json({ 
            success: true, 
            message: 'Contact created successfully',
            data: contact
          })
        } catch (error: any) {
          console.error('Create contact error:', error)
          res.status(500).json({ 
            success: false, 
            message: 'Failed to create contact' 
          })
        }
        break

      default:
        res.status(405).json({ 
          success: false, 
          message: 'Method not allowed' 
        })
        break
    }
  } catch (error: any) {
    console.error('Contacts API error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong' 
    })
  }
}
