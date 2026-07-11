import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const CONTACT_IMAGES_BUCKET = 'addressbook-contact-images'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing ${name} environment variable. Please add it to your .env.local file.`,
    )
  }
  return value
}

// Per-request client that forwards the caller's Clerk session token,
// so RLS in the "contacts" schema applies to every query.
export function createServerSupabaseClient() {
  return createClient<Database>(
    requireEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv(supabasePublishableKey, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    {
      db: { schema: 'contacts' },
      accessToken: async () => (await auth()).getToken(),
    },
  )
}

// Secret-key client. Bypasses RLS — only for cleaning up a deleted
// user's rows and storage objects, where no user token exists.
export function createAdminSupabaseClient() {
  const secretKey = requireEnv(
    process.env.SUPABASE_SECRET_KEY,
    'SUPABASE_SECRET_KEY',
  )
  return createClient<Database>(
    requireEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    secretKey,
    {
      db: { schema: 'contacts' },
      auth: { autoRefreshToken: false, persistSession: false },
    },
  )
}
