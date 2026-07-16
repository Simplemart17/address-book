import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/privacy',
  '/terms',
])
const isAdminPageRoute = createRouteMatcher(['/admin(.*)'])
// Only the exact /api/users list is admin-gated here; /api/users/[userId]
// does fine-grained self-or-admin checks in the handler.
const isAdminApiRoute = createRouteMatcher(['/api/users'])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return

  const { sessionClaims } = await auth.protect()

  const isAdmin = sessionClaims?.metadata?.role === 'admin'
  if (!isAdmin && isAdminPageRoute(req)) {
    return NextResponse.redirect(new URL('/contact-lists', req.url))
  }
  if (!isAdmin && isAdminApiRoute(req)) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: admin access required' },
      { status: 403 },
    )
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
}
