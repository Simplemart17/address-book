import {v2 as cloudinary} from 'cloudinary';
import getConfig from 'next/config'

const {
  publicRuntimeConfig: { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET },
} = getConfig();
          
cloudinary.config({ 
  cloud_name: CLOUDINARY_NAME, 
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

export default cloudinary;