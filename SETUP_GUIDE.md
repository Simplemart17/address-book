# Address Book v3 API Setup Guide

## 🚀 Quick Start

This guide will help you set up the v3 API using Supabase for your Address Book application.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Git for version control

## 🛠 Installation Steps

### 1. Install Dependencies

The Supabase dependency has already been added to your project:

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
# v3 API - Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Keep existing v2 API variables for backward compatibility
DATABASE_URL=postgresql://your-postgresql-url
MONGODB_URI=your-mongodb-connection-string
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### 4. Set Up Database Schema

#### Option A: Using Prisma Migration (Recommended)
```bash
npx prisma migrate dev --name add_contacts_table
npx prisma generate
```

#### Option B: Manual Supabase Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the following SQL:

```sql
-- Create contacts table
CREATE TABLE contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    url TEXT,
    user_id UUID NOT NULL
);

-- Create indexes for better performance
CREATE INDEX contacts_email_idx ON contacts(email);
CREATE INDEX contacts_user_id_idx ON contacts(user_id);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only see their own contacts" ON contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own contacts" ON contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own contacts" ON contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own contacts" ON contacts
    FOR DELETE USING (auth.uid() = user_id);
```

### 5. Configure Supabase Authentication

1. In your Supabase dashboard, go to Authentication → Settings
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production URLs when deploying
   - **Email Templates**: Customize if needed
   - **Email Auth**: Ensure it's enabled

### 6. Set Up Storage (Optional)

If you want to use Supabase Storage instead of Cloudinary:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `contact-images`
3. Set the bucket to public
4. Configure RLS policies for the bucket

### 7. Test the Setup

Start your development server:
```bash
npm run dev
```

Visit the v3 API pages:
- Landing page: `http://localhost:3000/v3`
- Contacts page: `http://localhost:3000/v3/contacts`

**Note**: If you haven't set up your environment variables yet, you'll see a helpful setup guide instead of the login page.

### 8. Run API Tests

Test the v3 API endpoints:
```bash
node scripts/test-v3-api.js
```

## 🔧 Configuration Options

### Authentication Settings

In `src/config/supabase.config.ts`, you can customize:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### API Client Settings

In `src/config/v3Api.config.ts`, you can modify:

```typescript
export const v3Api = axios.create({
  timeout: 10000, // Request timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase settings with production URLs

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

### Supabase Production Settings

1. Update Site URL to your production domain
2. Add production URLs to redirect URLs
3. Configure custom SMTP (optional)
4. Set up database backups

## 🔍 Troubleshooting

### Common Issues

#### 1. Authentication Errors
```
Error: Invalid JWT
```
**Solution**: Check your Supabase URL and keys in environment variables

#### 2. Database Connection Issues
```
Error: relation "contacts" does not exist
```
**Solution**: Run the database migration or create the table manually

#### 3. CORS Errors
```
Error: CORS policy blocked
```
**Solution**: Add your domain to allowed origins in Supabase dashboard

#### 4. RLS Policy Errors
```
Error: new row violates row-level security policy
```
**Solution**: Ensure RLS policies are correctly configured

### Debug Mode

Enable debug logging:

```typescript
// In supabase.config.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: process.env.NODE_ENV === 'development'
  }
})
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## 🎯 Next Steps

After successful setup:

1. **Customize the UI**: Modify components in `src/components/`
2. **Add Real-time Features**: Implement Supabase subscriptions
3. **Enhance Security**: Add additional RLS policies
4. **Optimize Performance**: Add caching and optimization
5. **Add Features**: Implement contact sharing, groups, etc.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the API comparison document
3. Check Supabase dashboard for errors
4. Review browser console for client-side errors
5. Check server logs for API errors

## 🎉 Success!

Once everything is set up, you'll have a modern, scalable address book application with:

- ✅ Built-in authentication
- ✅ Secure database with RLS
- ✅ Real-time capabilities (ready to use)
- ✅ Full TypeScript support
- ✅ Automatic scaling
- ✅ Comprehensive error handling

Welcome to the future of your Address Book application! 🚀
