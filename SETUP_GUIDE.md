# Address Book Setup Guide

## Prerequisites

- Node.js 18+ and npm
- A [Clerk](https://clerk.com) application
- Access to the shared Supabase project (this app lives in its own `contacts` schema)

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Clerk

1. Create an application at [dashboard.clerk.com](https://dashboard.clerk.com) with **Email + Password** enabled (email verification code is on by default).
2. Activate the **Supabase integration**: Configure → Integrations → Supabase. This adds the `"role": "authenticated"` claim Supabase needs. Copy the **Clerk domain** it displays — you'll paste it into Supabase in the next step.
3. Customize the session token (Sessions → Customize session token) so the admin role is available in session claims:

   ```json
   { "metadata": "{{user.public_metadata}}" }
   ```

4. Copy your **Publishable key** and **Secret key** from API Keys.

### 3. Set up the shared Supabase project

1. **Third-party auth**: Authentication → Sign In / Providers → Third-Party Auth → add **Clerk**, pasting the Clerk domain from step 2.2.
2. **Expose the schema**: Settings → API → Exposed schemas → add `contacts`.
3. **Apply the migration**: link the repo (`supabase link --project-ref <shared-project-ref>`) and run `supabase db push`, or paste `supabase/migrations/*_addressbook_contacts_schema.sql` into the SQL editor. The migration is idempotent and only touches the `contacts` schema plus the app-prefixed `addressbook-contact-images` bucket and its policies.

### 4. Configure environment variables

Create `.env.local` (see `.env.example`):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/contact-lists
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/contact-lists

NEXT_PUBLIC_SUPABASE_URL=https://<shared-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

### 5. Run the app

```bash
npm run dev
```

Visit http://localhost:3000, sign up, and verify with the emailed code.

### 6. Create the first admin

In the Clerk dashboard, open your user (Users → select) and set **Public metadata** to:

```json
{ "role": "admin" }
```

Sign out and back in (session claims refresh on new tokens). The Admin nav item and `/admin` dashboard are now available.

## Notes

- User registration, verification, password reset, and sessions are fully owned by Clerk — there is no users table in the database.
- The admin "Deactivate" action bans the user in Clerk (blocks sign-in and revokes sessions); "Activate" unbans.
- Deleting a user removes them from Clerk and cleans up their contacts and uploaded images in Supabase.
- Contact images are stored in the public `addressbook-contact-images` bucket under a per-user folder; storage policies only allow writes to your own folder.
