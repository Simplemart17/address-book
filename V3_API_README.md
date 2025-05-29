# Address Book v3 API - Supabase Migration

This document outlines the v3 API implementation using Supabase, maintaining the same functionality as v1 and v2 APIs while providing significant improvements.

## 🚀 Key Features

### ✅ Maintained Functionality
- User authentication with email verification
- Contact creation, reading, updating, and deletion (CRUD)
- Image upload for contact photos
- Search and filtering capabilities
- Same table structure and workflow

### 🆕 New Improvements
- **Built-in Authentication**: Supabase Auth eliminates custom JWT handling
- **Real-time Capabilities**: Live updates with Supabase subscriptions
- **Row Level Security (RLS)**: Database-level security policies
- **Better TypeScript Support**: Full type safety with generated types
- **Simplified Database Management**: Single PostgreSQL database
- **Enhanced Security**: Built-in rate limiting and security features
- **Better Error Handling**: Comprehensive error messages and status codes

## 📁 Project Structure

```
src/
├── config/
│   ├── supabase.config.ts      # Supabase client configuration
│   └── v3Api.config.ts         # API client with auth interceptors
├── contexts/
│   └── AuthContext.tsx         # React context for authentication
├── components/
│   ├── LandingV3.tsx          # Landing page with auth forms
│   └── ContactListV3.tsx      # Contact management interface
├── pages/api/v3/
│   ├── auth/
│   │   ├── register.ts        # User registration
│   │   ├── login.ts           # User login
│   │   ├── verify.ts          # Email verification
│   │   └── logout.ts          # User logout
│   └── contacts/
│       ├── index.ts           # List/Create contacts
│       └── [contactId].ts     # Get/Update/Delete contact
└── app/
    ├── api/v3/upload/route.ts  # File upload endpoint
    ├── v3/page.tsx            # v3 landing page
    └── v3/contacts/page.tsx   # v3 contacts page
```

## 🛠 Setup Instructions

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Database Setup
Run the Prisma migration:
```bash
npx prisma migrate dev
```

### 4. Supabase Configuration
1. Create a new Supabase project
2. Enable email authentication
3. Create the contacts table (or use the provided migration)
4. Set up Row Level Security policies

## 🔐 Authentication Flow

### Registration
```typescript
POST /api/v3/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Login
```typescript
POST /api/v3/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Email Verification
```typescript
POST /api/v3/auth/verify
{
  "email": "user@example.com",
  "token": "verification-token"
}
```

## 📊 API Endpoints

### Contacts Management

#### Get All Contacts
```typescript
GET /api/v3/contacts
Authorization: Bearer <access_token>
```

#### Create Contact
```typescript
POST /api/v3/contacts
Authorization: Bearer <access_token>
{
  "email": "contact@example.com",
  "fullName": "Jane Smith",
  "address": "123 Main St",
  "phone": "1234567890",
  "type": "Friend",
  "url": "https://example.com/photo.jpg"
}
```

#### Update Contact
```typescript
PATCH /api/v3/contacts/{contactId}
Authorization: Bearer <access_token>
{
  "fullName": "Jane Doe",
  "phone": "0987654321"
}
```

#### Delete Contact
```typescript
DELETE /api/v3/contacts/{contactId}
Authorization: Bearer <access_token>
```

### File Upload
```typescript
POST /api/v3/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <image_file>
```

## 🔒 Security Features

### Row Level Security (RLS)
Contacts are automatically filtered by user_id, ensuring users can only access their own data.

### Authentication Middleware
All API endpoints automatically validate JWT tokens and extract user information.

### Input Validation
Comprehensive validation for all inputs with detailed error messages.

## 🎯 Usage Examples

### Frontend Integration
```typescript
import { useAuth } from '@/contexts/AuthContext'
import { contactsApi } from '@/config/v3Api.config'

function ContactsPage() {
  const { user, loading } = useAuth()
  
  const createContact = async (contactData) => {
    try {
      const response = await contactsApi.create(contactData)
      console.log('Contact created:', response.data)
    } catch (error) {
      console.error('Error:', error.response.data.message)
    }
  }
  
  // Component JSX...
}
```

### Real-time Updates (Future Enhancement)
```typescript
// Subscribe to contact changes
const subscription = supabase
  .channel('contacts')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'contacts' },
    (payload) => {
      console.log('Contact updated:', payload)
      // Update UI accordingly
    }
  )
  .subscribe()
```

## 🔄 Migration from v2 to v3

### Data Migration
1. Export contacts from MongoDB
2. Transform data to match new schema
3. Import to Supabase PostgreSQL

### Code Migration
1. Replace v2Api calls with v3Api
2. Update authentication flow
3. Replace MongoDB models with Supabase queries

## 🚀 Deployment

### Supabase Setup
1. Create production Supabase project
2. Configure authentication settings
3. Set up database schema
4. Configure storage buckets for images

### Environment Variables
Ensure all Supabase credentials are properly configured in production.

## 📈 Performance Optimizations

- **Connection Pooling**: Supabase handles database connections efficiently
- **Caching**: Built-in query caching and optimization
- **CDN**: Supabase Storage provides global CDN for images
- **Indexing**: Proper database indexes for fast queries

## 🔧 Troubleshooting

### Common Issues
1. **Authentication Errors**: Check Supabase project settings
2. **CORS Issues**: Configure allowed origins in Supabase dashboard
3. **Database Errors**: Verify RLS policies and table permissions

### Debug Mode
Enable debug logging in development:
```typescript
const supabase = createClient(url, key, {
  auth: { debug: true }
})
```

## 🎉 Benefits of v3 API

1. **Reduced Complexity**: Single database, built-in auth
2. **Better Security**: RLS, built-in rate limiting
3. **Improved DX**: Better TypeScript support, comprehensive error handling
4. **Scalability**: Supabase handles scaling automatically
5. **Real-time Ready**: Easy to add real-time features
6. **Cost Effective**: Generous free tier, pay-as-you-scale pricing

## 🔮 Future Enhancements

- Real-time contact updates
- Contact sharing between users
- Advanced search with full-text search
- Contact import/export functionality
- Mobile app with offline sync
- Contact groups and tags
- Integration with external services (Google Contacts, etc.)
