import type { User } from '@clerk/nextjs/server'

// Shape the admin UserTable expects (formerly the contact_users row).
export function mapClerkUser(user: User) {
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    ''

  return {
    id: user.id,
    user_id: user.id,
    email,
    full_name:
      [user.firstName, user.lastName].filter(Boolean).join(' ') || email,
    verified: user.primaryEmailAddress?.verification?.status === 'verified',
    status: !user.banned,
    user_type: (user.publicMetadata?.role as string) ?? 'user',
    created_at: new Date(user.createdAt).toISOString(),
  }
}
