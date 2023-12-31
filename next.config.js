/** @type {import('next').NextConfig} */

const env = process.env

const {
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_TOKEN,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  BASE_URL,
} = env

const nextConfig = {
  publicRuntimeConfig: {
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_TOKEN,
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    BASE_URL,
  },
}

module.exports = nextConfig
