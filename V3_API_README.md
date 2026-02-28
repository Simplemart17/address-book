# Address Book API

API documentation for the Address Book application, powered by Supabase.

## Authentication

Authentication is handled by Supabase Auth. All protected endpoints require a Bearer token.

### Registration
```
POST /api/users
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Login
Login is handled client-side via Supabase Auth (`supabase.auth.signInWithPassword`).

### Email Verification
```
GET /api/verify/{verificationId}
```

## API Endpoints

### Users

#### List All Users
```
GET /api/users
Authorization: Bearer <access_token>
```

#### Get User
```
GET /api/users/{userId}
Authorization: Bearer <access_token>
```

#### Update User
```
PUT /api/users/{userId}
Authorization: Bearer <access_token>
{
  "full_name": "Updated Name"
}
```

#### Toggle User Status
```
PATCH /api/users/{userId}
Authorization: Bearer <access_token>
```

#### Delete User
```
DELETE /api/users/{userId}
Authorization: Bearer <access_token>
```

### Contacts

#### List Contacts
```
GET /api/contacts
Authorization: Bearer <access_token>
```

#### Create Contact
```
POST /api/contacts
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

Contact types: `Friend`, `Colleague`, `Mate`

#### Get Contact
```
GET /api/contacts/{contactId}
Authorization: Bearer <access_token>
```

#### Update Contact
```
PATCH /api/contacts/{contactId}
Authorization: Bearer <access_token>
{
  "fullName": "Jane Doe",
  "phone": "0987654321"
}
```

#### Delete Contact
```
DELETE /api/contacts/{contactId}
Authorization: Bearer <access_token>
```

### File Upload

```
POST /api/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <image_file>
```

Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB.

## Validation

All POST/PUT/PATCH endpoints validate request bodies using Zod schemas:
- Contact creation requires: email, fullName, address, phone, type
- User registration requires: email, fullName, password (min 6 chars)
- Contact types must be one of: Friend, Colleague, Mate

## Security

- **Row Level Security (RLS)**: Users can only access their own contacts
- **Supabase Auth**: JWT-based authentication with automatic token refresh
- **Input Validation**: Zod schemas validate all request bodies
- **File Upload Validation**: Type and size checks on all uploads
