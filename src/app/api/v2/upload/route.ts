import { NextResponse } from 'next/server'
import cloudinary from '@/config/cloudinary.config'

interface CloudinaryResponse { 
  url: string;
}

export async function POST(req: Request) {

  try {
    const formData = await req.formData()
    const file = formData.get('url') as File;
    
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const resp = await new Promise<CloudinaryResponse>((resolve) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result: any) => {
        return resolve(result);
      }).end(fileBuffer);
    });

      return NextResponse.json({ success: true, url: resp?.url as string });
  } catch (error) {
    console.log(error, 'upload failed')
    return NextResponse.json({ success: false, message: 'Something went wrong' })
  }
}
