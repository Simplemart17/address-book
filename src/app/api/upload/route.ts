import { NextRequest } from 'next/server'
import { supabase } from '@/config/supabase.config'
import { v4 as uuidv4 } from 'uuid'
import {
  getUserFromAuth,
  unauthorizedResponse,
  errorResponse,
  successResponse,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { user, error: authError } = await getUserFromAuth(request)
  if (!user) return unauthorizedResponse(authError!)

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) return errorResponse('No file provided', 400)

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ]
    if (!allowedTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Only images are allowed.', 400)
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return errorResponse('File size too large. Maximum 5MB allowed.', 400)
    }

    const fileExtension = file.name.split('.').pop()
    const fileName = `${user.id}/${uuidv4()}.${fileExtension}`
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('contact-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return errorResponse('Failed to upload file')
    }

    const { data: urlData } = supabase.storage
      .from('contact-images')
      .getPublicUrl(fileName)

    return successResponse({
      url: urlData.publicUrl,
      message: 'File uploaded successfully',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return errorResponse('Something went wrong during upload')
  }
}
