# Address Book Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm package manager
- Supabase account (free tier available)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (usually 2-3 minutes)
4. Go to Settings → API to get your credentials

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Set Up Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the following SQL:

Run the migration file at `supabase/migrations/20260228000002_initial_addBook_schema.sql` in the SQL Editor, or use the Supabase CLI:

```bash
supabase db push
```

### 5. Configure Supabase Authentication

1. In your Supabase dashboard, go to Authentication → Settings
2. Configure:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production URLs when deploying
   - **Email Auth**: Ensure it's enabled

### 6. Set Up Storage (for contact images)

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `contact-images`
3. Set the bucket to public
4. Configure RLS policies for the bucket

### 7. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase settings with production URLs

## Troubleshooting

### Authentication Errors
```
Error: Invalid JWT
```
Check your Supabase URL and keys in environment variables.

### Database Connection Issues
```
Error: relation "contacts" does not exist
```
Run the SQL setup script in the Supabase SQL Editor.

### RLS Policy Errors
```
Error: new row violates row-level security policy
```
Ensure RLS policies are correctly configured.
