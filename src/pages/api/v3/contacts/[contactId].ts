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

    const { contactId } = req.query

    if (!contactId || typeof contactId !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Contact ID is required' 
      })
    }

    switch (req.method) {
      case 'GET':
        try {
          const { data: contact, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('id', contactId)
            .eq('user_id', user.id)
            .single()

          if (error) {
            if (error.code === 'PGRST116') {
              return res.status(404).json({ 
                success: false, 
                message: 'Contact not found' 
              })
            }
            throw error
          }

          res.status(200).json({ 
            success: true, 
            data: contact 
          })
        } catch (error: any) {
          console.error('Get contact error:', error)
          res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch contact' 
          })
        }
        break

      case 'PATCH':
        try {
          const { email, fullName, address, phone, type, url } = req.body

          const updateData: any = {}
          if (email !== undefined) updateData.email = email
          if (fullName !== undefined) updateData.full_name = fullName
          if (address !== undefined) updateData.address = address
          if (phone !== undefined) updateData.phone = phone
          if (type !== undefined) updateData.type = type
          if (url !== undefined) updateData.url = url

          const { data: contact, error } = await supabase
            .from('contacts')
            .update(updateData)
            .eq('id', contactId)
            .eq('user_id', user.id)
            .select()
            .single()

          if (error) {
            if (error.code === '23505') { // Unique constraint violation
              return res.status(400).json({ 
                success: false, 
                message: 'Phone number already exists' 
              })
            }
            if (error.code === 'PGRST116') {
              return res.status(404).json({ 
                success: false, 
                message: 'Contact not found' 
              })
            }
            throw error
          }

          res.status(200).json({ 
            success: true, 
            message: 'Contact updated successfully',
            data: contact
          })
        } catch (error: any) {
          console.error('Update contact error:', error)
          res.status(500).json({ 
            success: false, 
            message: 'Failed to update contact' 
          })
        }
        break

      case 'DELETE':
        try {
          const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', contactId)
            .eq('user_id', user.id)

          if (error) {
            throw error
          }

          res.status(200).json({ 
            success: true, 
            message: 'Contact deleted successfully' 
          })
        } catch (error: any) {
          console.error('Delete contact error:', error)
          res.status(500).json({ 
            success: false, 
            message: 'Failed to delete contact' 
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
    console.error('Contact API error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong' 
    })
  }
}
